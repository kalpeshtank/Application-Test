<?php

namespace Src;

use Src\Contracts\DataProviderInterface;
use Src\BaseClass;

class OrderItems extends BaseClass implements DataProviderInterface {

    private $requestMethod;
    private $id;
    private $dataProvider;
    private $file = "../data/data.csv";

    public function __construct($requestMethod, $id) {
        $this->requestMethod = $requestMethod;
        $this->id = $id;
        $this->dataProvider = new DataProvider();
    }

    public function processRequest() {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->id) {
                    return $this->getOrder($this->id);
                } else {
                    return $this->getOrders();
                }
                break;
            case 'POST':
                $param = $this->getInput();
                return $this->createOrder($param);
                break;
            case 'PUT':
                $param = $this->getInput();
                return $this->updateOrder($this->id, $param);
                break;
            case 'DELETE':
                return $this->deleteOrder($this->id);
                break;
            default:
                return $this->notFoundResponse();
                break;
        }
    }

    public function getOrders() {
        try {
            return $this->dataProvider->getOrders();
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function getOrder($id) {
        try {
            return $this->dataProvider->getOrder($id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function createOrder($param) {
        try {
            return $this->dataProvider->createOrder($param);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function updateOrder($id, $param) {
        try {
            if ($this->validateData($param) === true) {
                return $this->dataProvider->updateOrder($id, $param);
            }
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function deleteOrder($id) {
        try {
            return $this->dataProvider->deleteOrder($id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

}
