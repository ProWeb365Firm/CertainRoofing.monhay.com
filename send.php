<?php
/**
 * Contact form handler for the static Certain Roofing site.
 * Replaces Contact Form 7 (which needed WordPress). Uses PHP mail().
 */

$to       = 'info@CertainRoofing.com';
$fromAddr = 'no-reply@certainroofing.com';

$allowedReturns = ['contact/'];
$return = in_array($_POST['_return'] ?? '', $allowedReturns, true) ? $_POST['_return'] : 'contact/';
function back($return, $ok) { header('Location: ' . $return . '?sent=' . ($ok ? '1' : '0')); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: contact/'); exit; }

// Honeypot: real visitors never fill this hidden field.
if (!empty($_POST['website_url'])) back($return, true);

function clean_line($v) { return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', (string)$v)); }

$name    = clean_line($_POST['your-name'] ?? '');
$phone   = clean_line($_POST['your-phone'] ?? '');
$email   = clean_line($_POST['your-email'] ?? '');
$city    = clean_line($_POST['your-city'] ?? '');
$topic   = clean_line($_POST['your-topic'] ?? '');
$message = trim((string)($_POST['your-message'] ?? ''));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) back($return, false);

$body  = "New message from the Certain Roofing website\n\n";
$body .= "Name: {$name}\nPhone: {$phone}\nEmail: {$email}\nCity: {$city}\nTopic: {$topic}\n\nMessage:\n{$message}\n";
$body .= "\n--\nSent from the contact form";

$headers  = "From: Certain Roofing Website <{$fromAddr}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$subject = 'Website message from ' . $name . ($topic !== '' ? ' (' . $topic . ')' : '');
$ok = mail($to, $subject, $body, $headers, '-f' . $fromAddr);
back($return, $ok);
