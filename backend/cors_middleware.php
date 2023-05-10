<?php

function corsMiddleware($requestMethod) {
    // List of domains that are allowed to make cross-origin requests
    $allowedOrigins = [
        'http://localhost:4200', // Update with your frontend URL
    ];

    // Check if the request origin is allowed
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }

    // Handle the OPTIONS preflight request
    if ($requestMethod === 'OPTIONS') {
        header('HTTP/1.1 200 OK');
        exit;
    }
}
