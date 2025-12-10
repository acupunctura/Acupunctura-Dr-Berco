<?php
// sendmail.php - simple PHP mail handler (works on hosting with PHP enabled)
// IMPORTANT: configure & test on a real PHP host (000webhost, InfinityFree etc.)
// This is a minimal example. For production add validation, sanitization & anti-spam measures.

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = 'sberco97@gmail.com'; // destination email
    $subject = 'Programare noua de pe site - Dr. Veaceslav Berco';
    $name = isset($_POST['name']) ? strip_tags($_POST['name']) : 'N/A';
    $phone = isset($_POST['phone']) ? strip_tags($_POST['phone']) : 'N/A';
    $email = isset($_POST['email']) ? strip_tags($_POST['email']) : 'N/A';
    $date = isset($_POST['date']) ? strip_tags($_POST['date']) : 'N/A';
    $message = isset($_POST['message']) ? strip_tags($_POST['message']) : '';

    $body = "Numele pacientului: $name\nTelefon: $phone\nEmail: $email\nData dorita: $date\n\nObservatii:\n$message";

    $headers = 'From: webmaster@lmsmo3.webwave.dev' . "\r\n" .
        'Reply-To: ' . $email . "\r\n" .
        'X-Mailer: PHP/' . phpversion();

    $sent = mail($to, $subject, $body, $headers);

    if($sent) {
        // redirect back with success
        header('Location: thankyou.html');
        exit;
    } else {
        echo 'Eroare la trimitere. Te rog incearca din nou.';
    }
} else {
    echo 'Metoda nu este suportata.';
}
?>