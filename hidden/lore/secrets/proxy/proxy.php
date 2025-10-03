<?php
// Check if a URL parameter is provided
if (isset($_GET['url'])) {
    $url = filter_var($_GET['url'], FILTER_SANITIZE_URL);

    // Initialize cURL session
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    // Execute and get the response
    $response = curl_exec($ch);
    curl_close($ch);

    // Output the fetched content
    echo $response;
} else {
    echo "Error: No URL provided!";
}
?>