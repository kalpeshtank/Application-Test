<?php

use PHPUnit\Framework\TestCase;
use Src\BaseClass;
use Src\DataProvider;
use Src\OrderItems;

class BaseClassTest extends TestCase {

    public function testValidateData() {
        $baseClass = new Src\BaseClass();

        $inputData = [
            'name' => 'John Doe',
            'state' => 'California',
            'zip' => '123456',
            'amount' => 10,
            'qty' => 5,
            'item' => 'Widget'
        ];

        $result = $baseClass->validateData($inputData);

        $this->assertTrue($result);
    }

    public function testGetInput() {
        $inputData = ['name' => 'John Doe', 'age' => 25];
        $inputJson = json_encode($inputData);

        $baseClass = new Src\BaseClass();
        $this->mockPhpInput($inputJson);

        $result = $baseClass->getInput();

        $this->assertEquals($inputData, $result);
    }

    public function testSendResponse() {
        $expectedStatus = 200;
        $expectedData = ['message' => 'Success'];
        $expectedMessage = 'OK';

        $baseClass = new Src\BaseClass();
        $this->expectOutputString(json_encode(['status' => $expectedStatus, 'data' => $expectedData, 'message' => $expectedMessage]));

        $baseClass->sendResponse($expectedStatus, $expectedData, $expectedMessage);

        $this->assertSame(http_response_code(), $expectedStatus);
    }

    public function testNotFoundResponse() {
        $expectedStatus = 404;

        $baseClass = new Src\BaseClass();
        $this->expectOutputString(json_encode(['status' => $expectedStatus, 'data' => [], 'message' => 'Not Found']));

        $baseClass->notFoundResponse();

        $this->assertSame(http_response_code(), $expectedStatus);
    }

    public function testUnprocessableEntityResponse() {
        $expectedStatus = 422;

        $baseClass = new Src\BaseClass();
        $this->expectOutputString(json_encode(['status' => $expectedStatus, 'data' => [], 'message' => 'Invalid input']));

        $baseClass->unprocessableEntityResponse();

        $this->assertSame(http_response_code(), $expectedStatus);
    }

    private function mockPhpInput($data) {
        // Mock the input stream using php://temp
        $stream = fopen('php://temp', 'r+');
        fwrite($stream, $data);
        rewind($stream);

        // Set the input stream to the mock data
        stream_wrapper_register('php-input', DummyStreamWrapper::class);
        DummyStreamWrapper::$stream = $stream;

        // Set the default input stream to the mock wrapper
        ini_set('default_socket_timeout', -1);
        ini_set('default_mimetype', 'application/octet-stream');
        ini_set('default_wrapper', 'php-input');
    }

}

?>