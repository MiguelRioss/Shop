<?php
require __DIR__ . '/vendor/autoload.php';

use Stripe\Webhook;
use Kreait\Firebase\Factory;

// ... your Stripe signature verification above ...

// --- Firebase bootstrap ---
$firebaseCredentials = __DIR__ . '/firebase-admin.json';

    $databaseUrl = 'https://storageproducts-bbe30-default-rtdb.europe-west1.firebasedatabase.app/'; // paste your URL

$factory = (new Factory)
    ->withServiceAccount($firebaseCredentials)
    ->withDatabaseUri($databaseUrl);

$database = $factory->createDatabase();

// --- Pick which events you want to store ---
// If you only want paid orders, keep checkout.session.completed.
// You can add others (payment_intent.succeeded/failed) later.
if ($event->type === 'checkout.session.completed') {
    $s   = $event->data->object;
    $cd  = $s->customer_details ?? (object)[];
    $adr = $cd->address ?? (object)[];

    // Idempotent write: use event id as the document/key so retries don’t duplicate
    $ref = $database->getReference('orders/'.$event->id);

    // Build a clean payload
    $payload = [
        'written_at'   => date('c'),
        'event_id'     => $event->id,
        'event_type'   => $event->type,
        'session_id'   => $s->id ?? null,
        'amount_total' => $s->amount_total ?? null,
        'currency'     => $s->currency ?? null,
        'email'        => $cd->email ?? null,
        'name'         => $cd->name ?? null,
        'address'      => [
            'country'     => $adr->country ?? null,
            'city'        => $adr->city ?? null,
            'line1'       => $adr->line1 ?? null,
            'postal_code' => $adr->postal_code ?? null,
        ],
        'metadata'     => $s->metadata ?? new stdClass(), // keep structure
    ];

    // Write (create or overwrite same event id—safe for retries)
    $ref->set($payload);
}

http_response_code(200);
echo 'ok';
