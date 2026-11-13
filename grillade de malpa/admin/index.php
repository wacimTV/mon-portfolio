<?php
declare(strict_types=1);
require __DIR__ . '/../api/lib.php';

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict',
    'cookie_secure'   => !empty($_SERVER['HTTPS']),
]);
$c = config();
$h = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');

if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(16));
$csrf_ok = fn() => hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''));

// Connexion / déconnexion
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');

$error = '';
if (isset($_POST['password'])) {
    // Blocage après 5 essais ratés en 15 minutes, par adresse IP (fichier hors web, dans data/)
    $lockFile = dirname($c['db_path']) . '/.login-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '') . '.json';
    $tries = is_file($lockFile) ? (json_decode((string)file_get_contents($lockFile), true) ?: []) : [];
    $tries = array_values(array_filter($tries, fn($t) => $t > time() - 900));
    if (count($tries) >= 5) {
        $error = 'Trop d\'essais. Réessayez dans 15 minutes.';
    } elseif ($c['admin_password_hash'] && password_verify((string)$_POST['password'], $c['admin_password_hash'])) {
        @unlink($lockFile);
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        header('Location: ./'); exit;
    } else {
        $tries[] = time();
        @file_put_contents($lockFile, json_encode($tries));
        sleep(1);
        $error = $c['admin_password_hash'] ? 'Mot de passe incorrect.' : 'Aucun mot de passe défini dans api/config.php.';
    }
}
if (isset($_GET['logout'])) { session_destroy(); header('Location: ./'); exit; }

$logged = !empty($_SESSION['admin']);
if ($logged) purge_old();

// Actions sur les réservations et les messages
if ($logged && $_SERVER['REQUEST_METHOD'] === 'POST' && $csrf_ok()) {
    $id = (int)($_POST['id'] ?? 0);
    $action = $_POST['action'] ?? '';
    if (in_array($action, ['confirmée', 'refusée', 'annulée'], true)) {
        db()->prepare('UPDATE reservations SET status = ? WHERE id = ?')->execute([$action, $id]);
        $r = db()->query('SELECT * FROM reservations WHERE id = ' . $id)->fetch(PDO::FETCH_ASSOC);
        if ($r && !empty($_POST['notify'])) {
            $jour = date('d/m/Y', strtotime($r['date']));
            $texte = match ($action) {
                'confirmée' => "Votre table pour {$r['guests']} personne(s) le $jour à {$r['time']} est confirmée. À bientôt !",
                'refusée'   => "Nous sommes désolés, nous sommes complets le $jour à {$r['time']}. N'hésitez pas à demander un autre créneau.",
                'annulée'   => "Votre réservation du $jour à {$r['time']} est annulée.",
            };
            send_mail($r['email'], "Votre réservation chez {$c['restaurant_name']}", "Bonjour {$r['name']},\n\n$texte\n\n{$c['restaurant_name']}");
        }
    } elseif ($action === 'lu') {
        db()->prepare('UPDATE messages SET is_read = 1 WHERE id = ?')->execute([$id]);
    } elseif ($action === 'supprimer-message') {
        db()->prepare('DELETE FROM messages WHERE id = ?')->execute([$id]);
    }
    header('Location: ./' . (isset($_GET['tab']) ? '?tab=' . urlencode($_GET['tab']) : '')); exit;
}

$tab = $_GET['tab'] ?? 'reservations';
$filter = $_GET['quand'] ?? 'avenir';
?>
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin · <?= $h($c['restaurant_name']) ?></title>
<style>
  :root { --bg:#e5e1d8; --surface:#f4f1ea; --ink:#2a1d17; --muted:#65564c; --accent:#456f3a; --line:#cfc8bb; --red:#9b2c1f; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; background: var(--bg); color: var(--ink); }
  header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--ink); color: var(--bg); }
  header a { color: var(--bg); }
  main { max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
  nav.tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  nav.tabs a { padding: 10px 16px; background: var(--surface); color: var(--ink); text-decoration: none; border: 1px solid var(--line); }
  nav.tabs a.on { background: var(--ink); color: var(--bg); }
  table { width: 100%; border-collapse: collapse; background: var(--surface); }
  th, td { padding: 10px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
  th { font-size: 13px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
  .badge { display: inline-block; padding: 2px 8px; font-size: 13px; background: var(--bg); }
  .badge.confirmée { background: var(--accent); color: #fff; }
  .badge.refusée, .badge.annulée { background: var(--red); color: #fff; }
  form.inline { display: inline; }
  button { font: inherit; padding: 8px 12px; min-height: 40px; border: 1px solid var(--ink); background: var(--surface); cursor: pointer; }
  button.ok { background: var(--accent); color: #fff; border-color: var(--accent); }
  button.no { color: var(--red); border-color: var(--red); }
  .login { max-width: 360px; margin: 80px auto; background: var(--surface); padding: 32px; }
  .login input { width: 100%; padding: 12px; font: inherit; margin: 8px 0 16px; border: 1px solid var(--line); }
  .err { color: var(--red); }
  .msg { white-space: pre-wrap; }
  td { overflow-wrap: anywhere; }
  ::selection { background: var(--accent); color: #fff; }
  .unread td { font-weight: 600; }
  @media (max-width: 760px) {
    table, thead, tbody, tr, th, td { display: block; }
    thead { display: none; }
    tr { margin-bottom: 12px; border: 1px solid var(--line); }
    td { border: 0; padding: 6px 12px; }
  }
</style>
</head>
<body>
<?php if (!$logged): ?>
  <form class="login" method="post">
    <h1>Espace restaurant</h1>
    <label for="pw">Mot de passe</label>
    <input id="pw" type="password" name="password" autocomplete="current-password" required autofocus>
    <?php if ($error): ?><p class="err"><?= $h($error) ?></p><?php endif; ?>
    <button class="ok" type="submit">Se connecter</button>
  </form>
<?php else:
  $nb_attente = (int)db()->query("SELECT COUNT(*) FROM reservations WHERE status = 'en attente' AND date >= date('now')")->fetchColumn();
  $nb_nonlus  = (int)db()->query("SELECT COUNT(*) FROM messages WHERE is_read = 0")->fetchColumn();
?>
  <header><strong><?= $h($c['restaurant_name']) ?> · Admin</strong><a href="?logout=1">Déconnexion</a></header>
  <main>
    <nav class="tabs">
      <a href="?tab=reservations" class="<?= $tab === 'reservations' ? 'on' : '' ?>">Réservations (<?= $nb_attente ?> en attente)</a>
      <a href="?tab=messages" class="<?= $tab === 'messages' ? 'on' : '' ?>">Messages (<?= $nb_nonlus ?> non lus)</a>
    </nav>

  <?php if ($tab === 'reservations'):
    $sql = $filter === 'passees'
      ? "SELECT * FROM reservations WHERE date < date('now') ORDER BY date DESC, time DESC LIMIT 200"
      : "SELECT * FROM reservations WHERE date >= date('now') ORDER BY date, time";
    $rows = db()->query($sql)->fetchAll(PDO::FETCH_ASSOC); ?>
    <nav class="tabs">
      <a href="?tab=reservations&quand=avenir" class="<?= $filter !== 'passees' ? 'on' : '' ?>">À venir</a>
      <a href="?tab=reservations&quand=passees" class="<?= $filter === 'passees' ? 'on' : '' ?>">Passées</a>
    </nav>
    <table>
      <thead><tr><th>Date</th><th>Pers.</th><th>Client</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody>
      <?php if (!$rows): ?><tr><td colspan="5">Aucune réservation.</td></tr><?php endif; ?>
      <?php foreach ($rows as $r): ?>
        <tr>
          <td><?= $h(date('d/m/Y', strtotime($r['date']))) ?> à <?= $h($r['time']) ?></td>
          <td><?= (int)$r['guests'] ?></td>
          <td><?= $h($r['name']) ?><br><a href="mailto:<?= $h($r['email']) ?>"><?= $h($r['email']) ?></a><br><a href="tel:<?= $h($r['phone']) ?>"><?= $h($r['phone']) ?></a></td>
          <td><span class="badge <?= $h($r['status']) ?>"><?= $h($r['status']) ?></span></td>
          <td>
            <?php foreach (['confirmée' => 'Confirmer', 'refusée' => 'Refuser', 'annulée' => 'Annuler'] as $act => $label):
              if ($r['status'] === $act) continue; ?>
              <form class="inline" method="post" action="?tab=reservations">
                <input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>">
                <input type="hidden" name="id" value="<?= (int)$r['id'] ?>">
                <input type="hidden" name="action" value="<?= $h($act) ?>">
                <input type="hidden" name="notify" value="1">
                <button class="<?= $act === 'confirmée' ? 'ok' : 'no' ?>" type="submit"><?= $label ?></button>
              </form>
            <?php endforeach; ?>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
    <p style="color:var(--muted)">Confirmer, refuser ou annuler envoie automatiquement un e-mail au client.</p>

  <?php else:
    $rows = db()->query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 200')->fetchAll(PDO::FETCH_ASSOC); ?>
    <table>
      <thead><tr><th>Reçu</th><th>De</th><th>Message</th><th>Actions</th></tr></thead>
      <tbody>
      <?php if (!$rows): ?><tr><td colspan="4">Aucun message.</td></tr><?php endif; ?>
      <?php foreach ($rows as $m): ?>
        <tr class="<?= $m['is_read'] ? '' : 'unread' ?>">
          <td><?= $h(date('d/m/Y H:i', strtotime($m['created_at']))) ?></td>
          <td><?= $h($m['name']) ?><br><a href="mailto:<?= $h($m['email']) ?>">Répondre</a></td>
          <td class="msg"><?= $h($m['message']) ?></td>
          <td>
            <?php if (!$m['is_read']): ?>
            <form class="inline" method="post" action="?tab=messages"><input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><input type="hidden" name="action" value="lu"><button type="submit">Marquer lu</button></form>
            <?php endif; ?>
            <form class="inline" method="post" action="?tab=messages" onsubmit="return confirm('Supprimer ce message ?')"><input type="hidden" name="csrf" value="<?= $h($_SESSION['csrf']) ?>"><input type="hidden" name="id" value="<?= (int)$m['id'] ?>"><input type="hidden" name="action" value="supprimer-message"><button class="no" type="submit">Supprimer</button></form>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
  </main>
<?php endif; ?>
</body>
</html>
