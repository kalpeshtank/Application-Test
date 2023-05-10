<?php

namespace Src;

use Src\Contracts\DataProviderInterface;
use Src\BaseClass;

class OrderItems extends BaseClass implements DataProviderInterface {

    private $requestMethod;
    private $id;
    private $dataProvider;

    public function __construct($requestMethod, $id) {
        $this->requestMethod = $requestMethod;
        $this->id = $id;
        $this->dataProvider = new DataProvider();
    }

    /**
     * Process the incoming request
     *
     * @return array
     */
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

    /**
     * Get all orders
     *
     * @return array
     */
    public function getOrders() {
        try {
            return $this->dataProvider->getOrders();
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    /**
     * Get order by ID
     *
     * @param int $id
     * @return array
     */
    public function getOrder($id) {
        try {
            return $this->dataProvider->getOrder($id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    /**
     * Create a new order
     *
     * @param array $param
     * @return array
     */
    public function createOrder($param) {
        try {
            return $this->dataProvider->createOrder($param);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    /**
     * Update an existing order
     * 
     * @param int $id
     * @param array $param
     * @return array
     */
    public function updateOrder($id, $param) {
        try {
            if ($this->validateData($param) === true) {
                return $this->dataProvider->updateOrder($id, $param);
            }
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    /**
     * Delete an order
     *
     * @param int $id
     * @return array
     */
    public function deleteOrder($id) {
        try {
            return $this->dataProvider->deleteOrder($id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

}
