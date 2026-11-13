<?php
declare(strict_types=1);

function config(): array {
    static $c = null;
    if ($c === null) {
        $c = require __DIR__ . '/config.php';
        date_default_timezone_set($c['timezone'] ?? 'Europe/Paris');
    }
    return $c;
}

// Efface ce qui dépasse la durée de conservation (RGPD), au plus une fois par jour
function purge_old(): void {
    $flag = dirname(config()['db_path']) . '/.last-purge';
    if (is_file($flag) && filemtime($flag) > time() - 86400) return;
    $limit = date('c', strtotime('-' . (int)config()['retention_months'] . ' months'));
    db()->prepare('DELETE FROM reservations WHERE created_at < ?')->execute([$limit]);
    db()->prepare('DELETE FROM messages WHERE created_at < ?')->execute([$limit]);
    @touch($flag);
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $path = config()['db_path'];
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0750, true);
    $pdo = new PDO('sqlite:' . $path, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        date TEXT NOT NULL, time TEXT NOT NULL, guests INTEGER NOT NULL,
        name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT "en attente",
        ip TEXT
    )');
    $pdo->exec('CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL,
        is_read INTEGER NOT NULL DEFAULT 0,
        ip TEXT
    )');
    return $pdo;
}

function json_out(int $code, array $data): never {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function require_post(): void {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(405, ['error' => 'Méthode non autorisée']);
    // Champ piège : les robots le remplissent, les humains ne le voient pas
    if (!empty($_POST['website'])) json_out(200, ['ok' => true]);
}

function field(string $name, int $max = 200): string {
    $v = trim((string)($_POST[$name] ?? ''));
    return mb_substr(str_replace(["\r", "\0"], '', $v), 0, $max);
}

// Limite simple : 5 envois par IP et par heure
function rate_limit(string $table): void {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $st = db()->prepare("SELECT COUNT(*) FROM $table WHERE ip = ? AND created_at > ?");
    $st->execute([$ip, date('c', time() - 3600)]);
    if ((int)$st->fetchColumn() >= 5) json_out(429, ['error' => 'Trop de demandes, réessayez plus tard.']);
}

function send_mail(string $to, string $subject, string $body, ?string $replyTo = null): bool {
    $c = config();
    $headers = [
        'From: ' . mb_encode_mimeheader($c['restaurant_name']) . ' <' . $c['from_email'] . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'MIME-Version: 1.0',
    ];
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $headers[] = 'Reply-To: ' . $replyTo;
    return @mail($to, mb_encode_mimeheader($subject), $body, implode("\r\n", $headers));
}
