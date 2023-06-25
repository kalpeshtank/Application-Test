<?php

use Codeception\Test\Unit;

class BaseClassTest extends Unit {

    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function _before() {
        // Set up any necessary dependencies or configurations before each test
    }

    protected function _after() {
        // Clean up or reset any changes made during the test
    }

    public function testGetInputReturnsArray() {
        $baseClass = new \Src\BaseClass();

        // Mock the file_get_contents function to return a JSON string
        $jsonString = '{"name":"John Doe","state":"CA","zip":"12345","amount":10.5,"qty":2,"item":"Widget"}';
        $this->getModule('PhpBrowser')->_getConfig()['mockedData']['file_get_contents'] = $jsonString;

        // Call the getInput() method
        $result = $baseClass->getInput();

        // Assert that the result is an array with the expected values
        $expectedResult = [
            'name' => 'John Doe',
            'state' => 'CA',
            'zip' => '12345',
            'amount' => 10.5,
            'qty' => 2,
            'item' => 'Widget',
        ];
        $this->assertEquals($expectedResult, $result);
    }

    public function testValidateOrderDataWithValidData() {
        $baseClass = new \Src\BaseClass();

        // Prepare a mock input data
        $inputData = [
            'name' => 'John Doe',
            'state' => 'CA',
            'zip' => '12345',
            'amount' => 10,
            'qty' => 2,
            'item' => 'Product',
        ];

        // Call the validateOrderData() method
        $result = $baseClass->validateOrderData($inputData);

        // Assert that the result is true, indicating valid data
        $this->assertTrue($result);
    }

    public function testValidateOrderDataWithInvalidData() {
        $baseClass = new \Src\BaseClass();

        $inputData = [
            'name' => '',
            'state' => 'CA',
            'zip' => '',
            'amount' => '10.5',
            'qty' => '',
            'item' => '',
        ];

        $result = $baseClass->validateOrderData($inputData);

        $expectedResult = [
            'data' => [
                'name' => 'Name is required',
                'zip' => 'Zip code is required',
                'amount' => 'Amount must be a number',
                'qty' => 'Quantity is required',
                'item' => 'Item is required',
            ],
            'message' => 'Error',
        ];

        $this->assertEquals($expectedResult, $result);
    }

    protected function createErrorResponse($status, $data, $message = null) {
        return [
            'status' => $status,
            'data' => $data,
            'message' => $message,
        ];
    }

}
