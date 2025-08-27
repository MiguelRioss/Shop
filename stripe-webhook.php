<?php
require 'vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Webhook;
use Stripe\Checkout\Session;

$stripeSecret = getenv('STRIPE_SECRET_KEY');       // sk_test_... or sk_live_...
$webhookSecret = getenv('STRIPE_WEBHOOK_SECRET');  // from Dashboard after adding the endpoint
$csvPath = __DIR__ . '/orders.csv';                // where you want the CSV saved

// Read the raw body & signature
$payload = @file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
  // Verify event came from Stripe
  $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
} catch (\UnexpectedValueException $e) {
  http_response_code(400); echo 'Invalid payload'; exit;
} catch (\Stripe\Exception\SignatureVerificationException $e) {
  http_response_code(400); echo 'Invalid signature'; exit;
}

// We only care about successful checkouts
if ($event->type === 'checkout.session.completed') {
  Stripe::setApiKey($stripeSecret);

  // Get the session with expanded line items and customer details
  $session = Session::retrieve([
    'id' => $event->data->object->id,
    'expand' => ['line_items', 'customer_details']
  ]);

  $cust = $session->customer_details;  // name, email, address
  $ship = $session->shipping_details;  // may be null if not collected
  $addr  = $ship ? $ship->address : ($cust->address ?? null);

  // Build one row (flatten the first line item; extend as you like)
  $line = $session->line_items->data[0] ?? null;
  $product  = $line ? $line->description : '';
  $qty      = $line ? $line->quantity : 1;
  $amount   = number_format($session->amount_total / 100, 2, '.', '');
  $currency = strtoupper($session->currency);

  $row = [
    'event_id'            => $event->id,
    'order_id'            => $session->client_reference_id, // you set this from your page
    'session_id'          => $session->id,
    'email'               => $cust->email ?? '',
    'customer_name'       => $cust->name ?? '',
    'product'             => $product,
    'qty'                 => $qty,
    'amount'              => $amount,
    'currency'            => $currency,
    'billing_addr1'       => $cust->address->line1 ?? '',
    'billing_addr2'       => $cust->address->line2 ?? '',
    'billing_city'        => $cust->address->city ?? '',
    'billing_postcode'    => $cust->address->postal_code ?? '',
    'billing_country'     => $cust->address->country ?? '',
    'shipping_addr1'      => $addr->line1 ?? '',
    'shipping_addr2'      => $addr->line2 ?? '',
    'shipping_city'       => $addr->city ?? '',
    'shipping_postcode'   => $addr->postal_code ?? '',
    'shipping_country'    => $addr->country ?? '',
    'created_at'          => gmdate('c'),
  ];

  // Append header if file is new
  $newFile = !file_exists($csvPath) || filesize($csvPath) === 0;
  $fp = fopen($csvPath, 'a');
  if ($newFile) {
    fputcsv($fp, array_keys($row));
  }
  fputcsv($fp, array_values($row));
  fclose($fp);
}

// Always 200 to acknowledge receipt
http_response_code(200);
echo 'ok';
