<?php

namespace Src;

use Src\InterfaceFile\OrdersInterface;
use Src\Traits\OrdersTrait;

class DataProvider extends BaseClass implements OrdersInterface {

    use OrdersTrait;

    protected $file = "../data/data.csv";

    public function __construct() {
        // Check if the file exists
        if (!file_exists($this->file)) {
            // Create a new file with the same name
            $newFile = fopen($this->file, 'w');
            // Write headers to the file
            $headers = ['id', 'name', 'state', 'zip', 'amount', 'qty', 'item'];
            fputcsv($newFile, $headers);
            fclose($newFile);
        }
    }

    /**
     * Get all orders
     * @return array
     */
    public function getOrders() {
        try {
            $responseData = $this->performFileOperation('read');
            return $this->sendResponse(200, $responseData, "success");
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
            $responseData = $this->performFileOperation('read', null, $id);
            return $this->sendResponse(200, $responseData, "success");
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
            if ($this->validateOrderData($param) === true) {
                return $this->performFileOperation('add', $param);
            }
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
            if ($this->validateOrderData($param) === true) {
                return $this->performFileOperation('write', $param, $id);
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
            return $this->performFileOperation('delete', null, $id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

}
