<?php
// Réglages du site. À remplir avant la mise en ligne.
return [
    // Adresse qui reçoit les réservations et les messages
    'restaurant_email' => 'contact@grilladedemalpa.example',
    // Adresse d'expédition (doit appartenir au domaine du site pour éviter le spam)
    'from_email'       => 'no-reply@grilladedemalpa.example',
    'restaurant_name'  => 'La Grillade de Malpa',
    // Mot de passe de l'espace admin : générer le hash avec
    //   php -r "echo password_hash('VOTRE_MOT_DE_PASSE', PASSWORD_DEFAULT);"
    // Hash actuel = mot de passe de TEST (voir README) : à remplacer avant la mise en ligne.
    'admin_password_hash' => '$2y$12$lzAi5oAb40cNnisVco8XPueeDCaGEbXTN8pp73TrSR6vHz7C8dot2',
    // Base SQLite, hors de portée du web (dossier data/ protégé par .htaccess)
    'db_path' => __DIR__ . '/../data/grillade.sqlite',
    // Couverts maximum par réservation en ligne (au-delà : formulaire de contact)
    'max_guests' => 12,
    // Jours de fermeture (1 = lundi … 7 = dimanche) et créneaux proposés : à garder identiques à index.html
    'closed_days' => [1],
    'time_slots'  => ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
    // Effacement automatique des données (promis dans confidentialite.html)
    'retention_months' => 12,
    'timezone' => 'Europe/Paris',
];
