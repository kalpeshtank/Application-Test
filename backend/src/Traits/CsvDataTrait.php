<?php

namespace Src\Traits;

trait CsvDataTrait {

    protected $file = "../data/data.csv";

    protected function readCsvData() {
        $orders = array();
        $heders = array();
        $file = fopen($this->file, 'r');
        while (($row = fgetcsv($file)) !== false) {
            // Skip the header row
            if ($row[0] == 'id') {
                $heders = $row;
                continue;
            }
            // Add the order to the array
            if (isset($row[0])) {
                $order = array(
                    "id" => $row[0],
                    "name" => $row[1],
                    "state" => $row[2],
                    "zip" => $row[3],
                    "amount" => $row[4],
                    "qty" => $row[5],
                    "item" => $row[6]
                );
                $orders[] = $order;
            }
        }
        fclose($file);
        return ['heders' => $heders, 'data' => $orders];
    }

    protected function getCsvDataById($id) {
        $row_data = array();
        $file = fopen($this->file, 'r');
        while (($row = fgetcsv($file)) !== false) {
            // Skip the header row
            if ($row[0] == $id) {
                $row_data = array(
                    "id" => $row[0],
                    "name" => $row[1],
                    "state" => $row[2],
                    "zip" => $row[3],
                    "amount" => $row[4],
                    "qty" => $row[5],
                    "item" => $row[6]
                );
            }
        }
        fclose($file);
        return $row_data;
    }

    protected function createOrderData($input_data) {
        // Open the CSV file in append mode
        $csvFile = fopen($this->file, 'a');
        // Create a new array with the values of the new record
        $newData = array(
            "id" => $this->getId(),
            "name" => $input_data['name'],
            "state" => $input_data['state'],
            "zip" => $input_data['zip'],
            "amount" => $input_data['amount'],
            "qty" => $input_data['qty'],
            "item" => $input_data['item'],
        );
        if (fputcsv($csvFile, $newData)) {
            // Close the CSV file
            fclose($csvFile);
            return $this->sendResponse(200, $newData, "OrderItems Created");
        } else {
            return $this->sendResponse(404, $newData, "Please try again");
        }
    }

    protected function updateOrderData($id, $input_data) {
        // Open the CSV file in append mode
        $isfondRecord = false;
        $file = fopen($this->file, "r");
        $records = array();
        $header = fgetcsv($file); // Read header row
        // Read all records
        while (($record = fgetcsv($file)) !== FALSE) {
            if ($record[0] == $id) {
                $isfondRecord = true;
            }
            $records[] = $record;
        }
        fclose($file);
        if (!$isfondRecord) {
            return $this->sendResponse(404, [], 'Record not found');
        } else {
            // Open CSV file in write mode and truncate it
            $file = fopen($this->file, "w");
            fputcsv($file, $header); // Write header row
            // Loop through records and update the record with matching id
            foreach ($records as $record) {
                if ($record[0] == $id) {
                    $record = array(
                        "id" => $id, "name" => $input_data['name'], "state" => $input_data['state'], "zip" => $input_data['zip'],
                        "amount" => $input_data['amount'], "qty" => $input_data['qty'], "item" => $input_data['item'],
                    ); // Update record
                }
                fputcsv($file, $record); // Write record to CSV file
            }
            fclose($file);
            return $this->sendResponse(200, [], 'OrderItems Updated!');
        }
    }

    protected function getId() {
        $rows = [];
        $id = 0;
        // Read the CSV file to get the highest ID
        if (($handle = fopen($this->file, "r")) !== false) {
            while (($row = fgetcsv($handle)) !== false) {
                if ($row[0] == 'id') {
                    continue;
                }
                if ($row[0] > $id) {
                    $id = $row[0];
                }
                $rows[] = $row;
            }
            fclose($handle);
        }
        // Increment the ID for the new record
        $id++;
        return $id;
    }

    protected function deleteOrderData($id) {
        $rows = [];
        $handle = fopen($this->file, "r");
        // read the CSV file into an array
        while (($data = fgetcsv($handle)) !== FALSE) {
            $rows[] = $data;
        }
        fclose($handle);
        // find the index of the row with the specified ID
        $rowIndex = -1;
        foreach ($rows as $index => $row) {
            if ($row[0] == $id) {
                $rowIndex = $index;
                break;
            }
        }
        // remove the row from the array
        if ($rowIndex >= 0) {
            unset($rows[$rowIndex]);
        }

        // write the updated array back to the CSV file
        $handle = fopen($this->file, "w");
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);
        return $this->sendResponse(200, [], 'OrderItems Deleted!');
    }

}
