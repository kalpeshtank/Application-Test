<?php

namespace Src\Traits;

trait OrdersTrait {

    protected $file = "../data/data.csv";

    /**Interface
     * Function to perform file operations based on the provided operation
     * @param type $operation
     * @param type $data
     * @param type $id
     * @return type
     */
    protected function performFileOperation($operation, $data = null, $id = null) {
        $file = fopen($this->file, 'r+');
        flock($file, LOCK_EX);
        $result = null;
        switch ($operation) {
            case 'read':
                if ($id)
                    $result = $this->readCsvDataById($file, $id);
                else
                    $result = $this->readCsvData($file);
                break;
            case 'add':
                $result = $this->createCsvData($file, $data);
                break;
            case 'write':
                $result = $this->updateCsvData($file, $data, $id);
                break;
            case 'delete':
                if (is_array($id)) {
                    $result = $this->deleteMultipleCsvData($file, $id);
                } else {
                    $result = $this->deleteCsvData($file, $id);
                }
                break;
        }
        flock($file, LOCK_UN);
        fclose($file);
        return $result;
    }

    /**
     * Function to read all CSV data
     * @param type $file
     * @return array
     */
    protected function readCsvData($file) {
        $orders = array();
        $headers = array();
        while (($row = fgetcsv($file)) !== false) {
            // Skip the header row
            if ($row[0] == 'id') {
                $headers = $row;
                continue;
            }
            // Add the order to the array
            if (isset($row[0])) {
                $order = array_combine($headers, $row);
                $orders[] = $order;
            }
        }
        return ['headers' => $headers, 'data' => $orders];
    }

    /**
     * Function to read CSV data by ID
     * @param type $file
     * @param type $id
     * @return array
     */
    protected function readCsvDataById($file, $id) {
        $row_data = [];
        while (($row = fgetcsv($file)) !== false) {
            // Skip the header row
            if ($row[0] == $id) {
                $row_data = [
                    "id" => $row[0],
                    "name" => $row[1],
                    "state" => $row[2],
                    "zip" => $row[3],
                    "amount" => $row[4],
                    "qty" => $row[5],
                    "item" => $row[6]
                ];
                break;
            }
        }
        return $row_data;
    }

    /**
     * Function to create a new CSV record
     * @param type $file
     * @param type $data
     * @return type
     */
    protected function createCsvData($file, $data) {
        // Create a new array with the values of the new record
        $newData = array(
            "id" => $this->getId($file),
            "name" => $data['name'],
            "state" => $data['state'],
            "zip" => $data['zip'],
            "amount" => $data['amount'],
            "qty" => $data['qty'],
            "item" => $data['item'],
        );
        if (fputcsv($file, $newData)) {
            return $this->sendResponse(200, $newData, "OrderItems Created");
        } else {
            return $this->sendResponse(404, $newData, "Please try again");
        }
    }

    /**
     * Function to update CSV data
     * @param type $file
     * @param type $input_data
     * @param type $id
     * @return type
     */
    protected function updateCsvData($file, $input_data, $id) {
        $isFoundRecord = false;
        $records = [];
        $header = fgetcsv($file); // Read header row
        // Read all records
        while (($record = fgetcsv($file)) !== false) {
            if ($record[0] == $id) {
                $isFoundRecord = true;
                $record = array(
                    "id" => $id,
                    "name" => $input_data['name'],
                    "state" => $input_data['state'],
                    "zip" => $input_data['zip'],
                    "amount" => $input_data['amount'],
                    "qty" => $input_data['qty'],
                    "item" => $input_data['item'],
                ); // Update record
            }
            $records[] = $record;
        }
        if (!$isFoundRecord) {
            return $this->sendResponse(404, [], 'Record not found');
        } else {
            // Open the CSV file in write mode and truncate it
            fseek($file, 0);
            ftruncate($file, 0);
            // Write header row
            fputcsv($file, $header);
            // Loop through records and write them to the CSV file
            foreach ($records as $record) {
                fputcsv($file, $record);
            }
            return $this->sendResponse(200, [], 'OrderItems Updated!');
        }
    }

    /**
     * Function to get the next ID for a new record
     * @param type $file
     * @return number 
     */
    protected function getId($file) {
        $rows = [];
        $id = 0;
        // Read the CSV file to get the highest ID
        while (($row = fgetcsv($file)) !== false) {
            if ($row[0] == 'id') {
                continue;
            }
            if ($row[0] > $id) {
                $id = $row[0];
            }
            $rows[] = $row;
        }
        // Increment the ID for the new record
        $id++;
        return $id;
    }

    /**
     * Function to delete CSV data by ID
     * @param type $file
     * @param type $id
     * @return response
     */
    protected function deleteCsvData($file, $id) {
        $rows = [];
        while (($data = fgetcsv($file)) !== false) {
            if ($data[0] != $id) {
                $rows[] = $data;
            }
        }
        fseek($file, 0);
        ftruncate($file, 0);
        foreach ($rows as $row) {
            fputcsv($file, $row);
        }
        return $this->sendResponse(200, null, "OrderItem Deleted");
    }

    /**
     * Function to delete multiple CSV records
     * @param array $ids
     * @return response
     */
    protected function deleteMultipleCsvData($file, $ids) {
        $rows = [];
        $deletedIds = [];
        while (($data = fgetcsv($file)) !== false) {
            $recordId = $data[0]; // Assuming the record ID is in the first column
            if (in_array($recordId, $ids)) {
                $deletedIds[] = $recordId;
            } else {
                $rows[] = $data;
            }
        }
        fseek($file, 0);
        ftruncate($file, 0);
        foreach ($rows as $row) {
            fputcsv($file, $row);
        }
        return $this->sendResponse(200, $deletedIds, "Records deleted successfully");
    }

}
