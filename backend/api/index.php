<?php

require "../start.php";
require "../src/BaseClass.php";
require "../src/OrderItems.php";
require '../cors_middleware.php';

$baseController = new Src\BaseClass();
$requestMethod = $_SERVER["REQUEST_METHOD"];
// Call the CORS middleware function
corsMiddleware($requestMethod);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$requestAccessArray = ['order', 'orders'];
// endpoints starting with `/order` or `/orders` for GET shows all posts
// everything else results in a 404 Not Found
if (!in_array($uri[1], $requestAccessArray)) {
    return $baseController->sendResponse(404, [], "Not Found");
}
// endpoints starting with `/posts` for POST/PUT/DELETE results in a 404 Not Found
if (($uri[1] == 'orders') && isset($uri[2])) {
    return $baseController->unprocessableEntityResponse();
}
// the order id is, of course, optional and must be a number
$id = null;
if (isset($uri[2])) {
    $id = (int) $uri[2];
}

// pass the request method and order ID to the order and process the HTTP request:
$controller = new Src\OrderItems($requestMethod, $id);
$controller->processRequest();
