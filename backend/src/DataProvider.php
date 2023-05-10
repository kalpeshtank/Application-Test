<?php

namespace Src;

use Src\Contracts\DataProviderInterface;
use Src\Traits\CsvDataTrait;

class DataProvider extends BaseClass implements DataProviderInterface {

    use CsvDataTrait;

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

    public function getOrders() {
        try {
            $responseData = $this->performFileOperation('read');
            return $this->sendResponse(200, $responseData, "success");
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function getOrder($id) {
        try {
            $responseData = $this->performFileOperation('read', null, $id);
            return $this->sendResponse(200, $responseData, "success");
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function createOrder($param) {
        try {
            if ($this->validateData($param) === true) {
                return $this->performFileOperation('add', $param);
            }
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function updateOrder($id, $param) {
        try {
            if ($this->validateData($param) === true) {
                return $this->performFileOperation('write', $param, $id);
            }
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

    public function deleteOrder($id) {
        try {
            return $this->performFileOperation('delete', $id);
        } catch (\ErrorException $e) {
            return $this->sendResponse(404, [], $e->getMessage());
        }
    }

}
