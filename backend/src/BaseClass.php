<?php

namespace Src;

class BaseClass {

    public function getInput() {
        $input_data = file_get_contents('php://input');
        return (array) json_decode($input_data);
    }

    protected function validateData($input_data) {
        $errors = array(); // to store error messages
        // validate required fields
        if (empty($input_data['name'])) {
            $errors['name'] = "Name is required";
        }
        if (empty($input_data['state'])) {
            $errors['state'] = "State is required";
        }
        if (empty($input_data['zip'])) {
            $errors['zip'] = "Zip code is required";
        } else if (strlen($input_data['zip']) != 6) {
            $errors['zip'] = "Zip code must be 6 digits";
        }
        if (empty($input_data['amount'])) {
            $errors['amount'] = "Amount is required";
        } else if (!is_numeric($input_data['amount'])) {
            $errors['amount'] = "Amount must be a number";
        }
        if (empty($input_data['qty'])) {
            $errors['qty'] = "Quantity is required";
        } else if (!is_numeric($input_data['qty'])) {
            $errors['qty'] = "Quantity must be a number";
        }
        if (empty($input_data['item'])) {
            $errors['item'] = "Item is required";
        }
        // check if there are any errors
        if (!empty($errors)) {
            return $this->sendResponse(400, $errors, "Error");
        } else {
            return true;
        }
    }

    public function sendResponse($status, $data = array(), $message = null) {
        $response = array();
        if ($message != null) {
            $response['message'] = $message;
        }
        $response['status'] = $status;
        $response['data'] = $data;
        http_response_code($status);
        header('Content-Type: application/json');
        $this->setHeaders($status);
        echo json_encode($response);
    }

    public function notFoundResponse() {
        $this->sendResponse(404, [], "Not Found");
    }

    public function unprocessableEntityResponse() {
        $this->sendResponse(422, [], "Invalid input");
    }

    private function setHeaders($statusCode) {
        switch ($statusCode) {
            case 200:
                header('HTTP/1.1 200 OK');
                break;
            case 201:
                header('HTTP/1.1 201 Created');
                break;
            case 400:
                header('HTTP/1.1 400 Bad Request');
                break;
            case 401:
                header('HTTP/1.1 401 Unauthorized');
                break;
            case 403:
                header('HTTP/1.1 403 Forbidden');
                break;
            case 404:
                header('HTTP/1.1 404 Not Found');
                break;
            case 500:
                header('HTTP/1.1 500 Internal Server Error');
                break;
            default:
                header('HTTP/1.1 ' . $statusCode);
                break;
        }
    }

}
