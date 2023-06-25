<?php

use Src\Traits\OrdersTrait;

class OrdersTraitTest extends \Codeception\Test\Unit {

    protected $ordersTrait;
    protected $mockFile;

    protected function _before() {
        $this->ordersTrait = $this->getMockForTrait(OrdersTrait::class);
        $this->mockFile = fopen('php://temp', 'w+');
        fwrite($this->mockFile, "id,name,state,zip,amount,qty,item\n");
        fwrite($this->mockFile, "1,John,Doe,12345,100,2,Item 1\n");
        fwrite($this->mockFile, "2,Jane,Smith,67890,200,3,Item 2\n");
        rewind($this->mockFile);
    }

    protected function _after() {
        fclose($this->mockFile);
    }

    public function testReadCsvDataById() {
        // Create a mock file with sample data
        $file = fopen('php://temp', 'w+');
        fwrite($file, "id,name,state,zip,amount,qty,item\n");
        fwrite($file, "1,John,Doe,12345,100,2,Item 1\n");
        fwrite($file, "2,Jane,Smith,67890,200,3,Item 2\n");
        rewind($file);

        // Call the function being tested
        $result = $this->ordersTrait->readCsvDataById($file, '1');

        // Assert the expected output
        $expectedData = [
            "id" => "1",
            "name" => "John",
            "state" => "Doe",
            "zip" => "12345",
            "amount" => "100",
            "qty" => "2",
            "item" => "Item 1"
        ];

        $this->assertEquals($expectedData, $result);

        // Close the mock file
        fclose($file);
    }

    public function testReadCsvData() {
        // Create a mock file with sample data
        $file = fopen('php://temp', 'w+');
        fwrite($file, "id,name,state,zip,amount,qty,item\n");
        fwrite($file, "1,John,Doe,12345,100,2,Item 1\n");
        fwrite($file, "2,Jane,Smith,67890,200,3,Item 2\n");
        rewind($file);

        // Call the function being tested
        $result = $this->ordersTrait->readCsvData($file);

        // Assert the expected output
        $expectedHeaders = ['id', 'name', 'state', 'zip', 'amount', 'qty', 'item'];
        $expectedData = [
            [
                'id' => '1',
                'name' => 'John',
                'state' => 'Doe',
                'zip' => '12345',
                'amount' => '100',
                'qty' => '2',
                'item' => 'Item 1',
            ],
            [
                'id' => '2',
                'name' => 'Jane',
                'state' => 'Smith',
                'zip' => '67890',
                'amount' => '200',
                'qty' => '3',
                'item' => 'Item 2',
            ],
        ];

        $this->assertEquals(['headers' => $expectedHeaders, 'data' => $expectedData], $result);

        // Close the mock file
        fclose($file);
    }

    public function testCreateCsvData() {
        $data = [
            'name' => 'New Name',
            'state' => 'New State',
            'zip' => 'New Zip',
            'amount' => 'New Amount',
            'qty' => 'New Qty',
            'item' => 'New Item',
        ];

        $expectedNewData = [
            'id' => '3',
            'name' => 'New Name',
            'state' => 'New State',
            'zip' => 'New Zip',
            'amount' => 'New Amount',
            'qty' => 'New Qty',
            'item' => 'New Item',
        ];

        $result = $this->ordersTrait->createCsvData($this->mockFile, $data);

        $this->assertEquals(200, $result['status']);
        $this->assertEquals($expectedNewData, $result['data']);
        $this->assertEquals('OrderItems Created', $result['message']);
    }

    public function testUpdateCsvData() {
        $inputData = [
            'name' => 'Updated Name',
            'state' => 'Updated State',
            'zip' => 'Updated Zip',
            'amount' => 'Updated Amount',
            'qty' => 'Updated Qty',
            'item' => 'Updated Item',
        ];

        $id = '1';

        $expectedUpdatedData = [
            'id' => $id,
            'name' => 'Updated Name',
            'state' => 'Updated State',
            'zip' => 'Updated Zip',
            'amount' => 'Updated Amount',
            'qty' => 'Updated Qty',
            'item' => 'Updated Item',
        ];

        $result = $this->ordersTrait->updateCsvData($this->mockFile, $inputData, $id);

        $this->assertEquals(200, $result['status']);
        $this->assertEquals([], $result['data']);
        $this->assertEquals('OrderItems Updated!', $result['message']);

        // Read the updated record to verify the changes
        rewind($this->mockFile);
        $updatedRecord = $this->ordersTrait->readCsvDataById($this->mockFile, $id);

        $this->assertEquals($expectedUpdatedData, $updatedRecord);
    }

    public function testDeleteCsvData() {
        $id = '1';

        $result = $this->ordersTrait->deleteCsvData($this->mockFile, $id);

        $this->assertEquals(200, $result['status']);
        $this->assertEquals(null, $result['data']);
        $this->assertEquals('OrderItem Deleted', $result['message']);

        // Read the file to verify the deletion
        rewind($this->mockFile);
        $data = [];
        while (($record = fgetcsv($this->mockFile)) !== false) {
            $data[] = $record;
        }

        $this->assertCount(1, $data); // Only the header row should remain
    }

    public function testDeleteMultipleCsvData() {
        $ids = ['1', '2'];

        $result = $this->ordersTrait->deleteMultipleCsvData($this->mockFile, $ids);

        $this->assertEquals(200, $result['status']);
        $this->assertEquals($ids, $result['data']);
        $this->assertEquals('Records deleted successfully', $result['message']);

        // Read the file to verify the deletions
        rewind($this->mockFile);
        $data = [];
        while (($record = fgetcsv($this->mockFile)) !== false) {
            $data[] = $record;
        }

        $this->assertCount(1, $data); // Only the header row should remain
    }

}
