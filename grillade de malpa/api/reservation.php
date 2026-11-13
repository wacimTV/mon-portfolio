<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

require_post();

$date   = field('date', 20);
$time   = field('time', 10);
$guests = (int)field('guests', 3);
$name   = field('name', 100);
$email  = field('email', 150);
$phone  = field('phone', 30);

$errors = [];
// Date au format jj/mm ou jj/mm/aaaa, aujourd'hui ou plus tard
if (!preg_match('#^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?$#', $date, $m)) {
    $errors['date'] = 'Écrivez le jour, par exemple 21/11.';
} else {
    $year = $m[3] ?? date('Y');
    if (strlen($year) === 2) $year = '20' . $year;
    if (!checkdate((int)$m[2], (int)$m[1], (int)$year)) {
        $errors['date'] = 'Cette date n\'existe pas.';
    } else {
        $ts = mktime(0, 0, 0, (int)$m[2], (int)$m[1], (int)$year);
        if (!isset($m[3]) && $ts < strtotime('today')) $ts = strtotime('+1 year', $ts);
        if ($ts < strtotime('today')) $errors['date'] = 'Choisissez une date à venir.';
        elseif ($ts > strtotime('+90 days')) $errors['date'] = 'Les réservations ouvrent 90 jours à l\'avance.';
        elseif (in_array((int)date('N', $ts), config()['closed_days'], true)) $errors['date'] = 'Le restaurant est fermé ce jour-là.';
        $date = date('Y-m-d', $ts);
    }
}
if (!preg_match('#^([01]?\d|2[0-3])[:hH]?([0-5]\d)?$#', $time, $t)) {
    $errors['time'] = 'Écrivez l\'heure, par exemple 20:00.';
} else {
    $time = sprintf('%02d:%02d', $t[1], $t[2] ?? 0);
    if (!in_array($time, config()['time_slots'], true)) $errors['time'] = 'Choisissez un horaire de service.';
    elseif (empty($errors['date']) && strtotime("$date $time") < time() + 3600) $errors['time'] = 'Réservez au moins une heure à l\'avance.';
}
if ($guests < 1 || $guests > config()['max_guests']) {
    $errors['guests'] = 'Entre 1 et ' . config()['max_guests'] . ' personnes. Au-delà, écrivez-nous.';
}
if ($name === '') $errors['name'] = 'Écrivez le nom de la réservation.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Adresse e-mail invalide.';
if (!preg_match('#^[+0-9 ().-]{6,30}$#', $phone)) $errors['phone'] = 'Numéro de téléphone invalide.';

if ($errors) json_out(422, ['error' => 'Formulaire incomplet', 'fields' => $errors]);

rate_limit('reservations');

purge_old();
$st = db()->prepare('INSERT INTO reservations (created_at, date, time, guests, name, email, phone, ip) VALUES (?,?,?,?,?,?,?,?)');
$st->execute([date('c'), $date, $time, $guests, $name, $email, $phone, $_SERVER['REMOTE_ADDR'] ?? '']);
$id = db()->lastInsertId();

$c = config();
$jour = date('d/m/Y', strtotime($date));

send_mail($c['restaurant_email'], "Nouvelle réservation n°$id : $jour à $time, $guests pers.",
    "Nouvelle demande de réservation\n\n"
  . "Date : $jour à $time\nPersonnes : $guests\nNom : $name\nE-mail : $email\nTéléphone : $phone\n\n"
  . "Confirmez ou refusez depuis l'espace admin du site.", $email);

send_mail($email, "Votre demande de table chez {$c['restaurant_name']}",
    "Bonjour $name,\n\nNous avons bien reçu votre demande de table pour $guests personne(s) le $jour à $time.\n"
  . "Nous vous confirmons la réservation par e-mail très vite.\n\nÀ bientôt,\n{$c['restaurant_name']}");

json_out(200, ['ok' => true, 'id' => (int)$id]);
