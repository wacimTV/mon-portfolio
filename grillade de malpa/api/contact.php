<?php
declare(strict_types=1);
require __DIR__ . '/lib.php';

require_post();

$name    = field('name', 100);
$email   = field('email', 150);
$message = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 4000));

$errors = [];
if ($name === '') $errors['name'] = 'Écrivez votre nom.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Adresse e-mail invalide.';
if (mb_strlen($message) < 5) $errors['message'] = 'Écrivez votre message.';
if ($errors) json_out(422, ['error' => 'Formulaire incomplet', 'fields' => $errors]);

rate_limit('messages');

$st = db()->prepare('INSERT INTO messages (created_at, name, email, message, ip) VALUES (?,?,?,?,?)');
$st->execute([date('c'), $name, $email, $message, $_SERVER['REMOTE_ADDR'] ?? '']);

$c = config();
send_mail($c['restaurant_email'], "Message du site de $name", "De : $name <$email>\n\n$message", $email);

json_out(200, ['ok' => true]);
