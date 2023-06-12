<?php

use PHPUnit\Framework\TestCase;
use Src\DataProvider;

class DataProviderTest extends TestCase {

    private $dataProvider;

    protected function setUp(): void {
        $this->dataProvider = new DataProvider();
    }

    public function testGetOrders() {
        $expectedResponse = [
            'status' => 200,
            'data' => [], // Replace with your expected data
            'message' => 'success'
        ];

        $result = $this->dataProvider->getOrders();

        $this->assertEquals($expectedResponse, $result);
    }

    public function testGetOrder() {
        $id = 1; // Set the desired ID for testing

        $expectedResponse = [
            'status' => 200,
            'data' => [], // Replace with your expected data
            'message' => 'success'
        ];

        $result = $this->dataProvider->getOrder($id);

        $this->assertEquals($expectedResponse, $result);
    }

    public function testCreateOrder() {
        $param = []; // Set the desired parameters for testing

        $expectedResponse = [
            'status' => 200,
            'data' => [], // Replace with your expected data
            'message' => 'success'
        ];

        $result = $this->dataProvider->createOrder($param);

        $this->assertEquals($expectedResponse, $result);
    }

    public function testUpdateOrder() {
        $id = 1; // Set the desired ID for testing
        $param = []; // Set the desired parameters for testing

        $expectedResponse = [
            'status' => 200,
            'data' => [], // Replace with your expected data
            'message' => 'success'
        ];

        $result = $this->dataProvider->updateOrder($id, $param);

        $this->assertEquals($expectedResponse, $result);
    }

    public function testDeleteOrder() {
        $id = 1; // Set the desired ID for testing

        $expectedResponse = [
            'status' => 200,
            'data' => [], // Replace with your expected data
            'message' => 'success'
        ];

        $result = $this->dataProvider->deleteOrder($id);

        $this->assertEquals($expectedResponse, $result);
    }

}
