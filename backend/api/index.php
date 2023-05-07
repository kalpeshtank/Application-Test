<?php

require "../start.php";
require "../src/BaseClass.php";
require "../src/OrderItems.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

$baseController = new Src\BaseClass();
$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$requestAccessArray = ['order', 'orders'];
// endpoints starting with `/post` or `/posts` for GET shows all posts
// everything else results in a 404 Not Found
if (!in_array($uri[1], $requestAccessArray)) {
    return $baseController->sendResponse(404, [], "Not Found");
}
// endpoints starting with `/posts` for POST/PUT/DELETE results in a 404 Not Found
if (($uri[1] == 'orders') && isset($uri[2])) {
    return $baseController->unprocessableEntityResponse();
}
// the post id is, of course, optional and must be a number
$id = null;
if (isset($uri[2])) {
    $id = (int) $uri[2];
}

// pass the request method and post ID to the Post and process the HTTP request:
$controller = new Src\OrderItems($requestMethod, $id);
$controller->processRequest();
