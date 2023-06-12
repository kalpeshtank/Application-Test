<?php

use PHPUnit\Framework\TestCase;
use Src\Traits\OrdersTrait;

class OrdersTraitTest extends TestCase {

    use OrdersTrait;

    protected function setUp(): void {
        
    }

    public function testReadCsvData() {
        // Mock the file handle
        $file = fopen($this->file, 'r');
        $headers = ['id', 'name', 'state', 'zip', 'amount', 'qty', 'item'];
        $data = [
            ['1', 'John Doe', 'CA', '12345', '100', '2', 'Product A'],
            ['2', 'Jane Smith', 'NY', '67890', '200', '3', 'Product B'],
        ];
        $expectedResponse = ['headers' => $headers, 'data' => $data];

        // Mock the fgetcsv function
        $this->mockFunction('fgetcsv', $data, $file, true);

        $result = $this->readCsvData($file);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    public function testReadCsvDataById() {
        // Mock the file handle
        $file = fopen($this->file, 'r');
        $id = 2;
        $data = ['2', 'Jane Smith', 'NY', '67890', '200', '3', 'Product B'];
        $expectedResponse = [
            'id' => '2',
            'name' => 'Jane Smith',
            'state' => 'NY',
            'zip' => '67890',
            'amount' => '200',
            'qty' => '3',
            'item' => 'Product B',
        ];

        // Mock the fgetcsv function
        $this->mockFunction('fgetcsv', $data, $file, true);

        $result = $this->readCsvDataById($file, $id);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    public function testCreateCsvData() {
        // Mock the file handle
        $file = fopen($this->file, 'r+');
        $data = [
            'name' => 'John Doe',
            'state' => 'CA',
            'zip' => '12345',
            'amount' => '100',
            'qty' => '2',
            'item' => 'Product A',
        ];
        $expectedResponse = [
            'status' => 200,
            'data' => [
                'id' => '1',
                'name' => 'John Doe',
                'state' => 'CA',
                'zip' => '12345',
                'amount' => '100',
                'qty' => '2',
                'item' => 'Product A',
            ],
            'message' => 'OrderItems Created',
        ];

        // Mock the fputcsv function
        $this->mockFunction('fputcsv', true, $file, true);

        $result = $this->createCsvData($file, $data);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    public function testUpdateCsvData() {
        // Mock the file handle
        $file = fopen($this->file, 'r+');
        $id = 2;
        $data = [
            'name' => 'Jane Smith',
            'state' => 'NY',
            'zip' => '67890',
            'amount' => '200',
            'qty' => '3',
            'item' => 'Product B',
        ];
        $expectedResponse = [
            'status' => 200,
            'data' => [],
            'message' => 'OrderItems Updated!',
        ];

        // Mock the fgetcsv function
        $this->mockFunction('fgetcsv', ['2', 'Jane Smith', 'NY', '67890', '200', '3', 'Product B'], $file, true);

        // Mock the fseek function
        $this->mockFunction('fseek', 0, $file, true);

        // Mock the ftruncate function
        $this->mockFunction('ftruncate', true, $file, true);

        // Mock the fputcsv function
        $this->mockFunction('fputcsv', true, $file, true);

        $result = $this->updateCsvData($file, $data, $id);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    public function testDeleteCsvData() {
        // Mock the file handle
        $file = fopen($this->file, 'r+');
        $id = 2;
        $expectedResponse = [
            'status' => 200,
            'data' => null,
            'message' => 'OrderItem Deleted',
        ];

        // Mock the fgetcsv function
        $this->mockFunction('fgetcsv', ['2', 'Jane Smith', 'NY', '67890', '200', '3', 'Product B'], $file, true);

        // Mock the fseek function
        $this->mockFunction('fseek', 0, $file, true);

        // Mock the ftruncate function
        $this->mockFunction('ftruncate', true, $file, true);

        // Mock the fputcsv function
        $this->mockFunction('fputcsv', true, $file, true);

        $result = $this->deleteCsvData($file, $id);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    public function testDeleteMultipleCsvData() {
        // Mock the file handle
        $file = fopen($this->file, 'r+');
        $ids = [2, 3];
        $expectedResponse = [
            'status' => 200,
            'data' => [2, 3],
            'message' => 'Records deleted successfully',
        ];

        // Mock the fgetcsv function
        $this->mockFunction('fgetcsv', ['2', 'Jane Smith', 'NY', '67890', '200', '3', 'Product B'], $file, true);
        $this->mockFunction('fgetcsv', ['3', 'John Doe', 'CA', '12345', '100', '2', 'Product A'], $file, true);
        $this->mockFunction('fgetcsv', false, $file, false); // Return false to indicate end of file
        // Mock the fseek function
        $this->mockFunction('fseek', 0, $file, true);

        // Mock the ftruncate function
        $this->mockFunction('ftruncate', true, $file, true);

        // Mock the fputcsv function
        $this->mockFunction('fputcsv', true, $file, true);

        $result = $this->deleteMultipleCsvData($file, $ids);

        $this->assertEquals($expectedResponse, $result);
        fclose($file);
    }

    protected function mockFunction($function, $returnValue, $context, $expectsClose = false) {
        $mock = $this->getMockBuilder('stdClass')
                ->setMethods([$function])
                ->getMock();

        $mock->expects($this->atLeastOnce())
                ->method($function)
                ->withConsecutive([$context], $this->returnValue($returnValue));

        if ($expectsClose) {
            $mock->expects($this->once())
                    ->method('fclose')
                    ->with($context);
        }

        $this->setFunctionMock($function, $mock);
    }

}

?>