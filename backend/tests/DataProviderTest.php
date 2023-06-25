<?php

namespace Tests\Unit;

use Src\DataProvider;
use Tests\Support\UnitTester;

class DataProviderTest extends \Codeception\Test\Unit {

    private $dataProvider;
    private $dummyFilePath;

    protected function _before() {
        // Provide the path of the dummy file
        $this->dummyFilePath = __DIR__ . '/../data/dummy_data.csv';

        // Create an instance of the DataProvider class with the dummy file path
        $this->dataProvider = new DataProvider($this->dummyFilePath);
    }

    public function testGetOrdersReturnsResponse() {
        $response = $this->dataProvider->getOrders();

        $this->assertEquals(['status' => 200, 'data' => [], 'message' => 'success'], $response);
    }

    public function testGetOrderReturnsResponse() {
        $orderId = 1;

        $response = $this->dataProvider->getOrder($orderId);

        $this->assertEquals(['status' => 200, 'data' => [], 'message' => 'success'], $response);
    }

    public function testCreateOrderReturnsResponse() {
        $orderData = [
            'name' => 'John Doe',
            'amount' => 100.00,
                // ... provide other required order data
        ];

        $response = $this->dataProvider->createOrder($orderData);

        $this->assertEquals(['status' => 200, 'data' => [], 'message' => 'success'], $response);
    }

    public function testUpdateOrderReturnsResponse() {
        $orderId = 1;
        $orderData = [
            'name' => 'John Doe',
            'amount' => 150.00,
                // ... provide updated order data
        ];

        $response = $this->dataProvider->updateOrder($orderId, $orderData);

        $this->assertEquals(['status' => 200, 'data' => [], 'message' => 'success'], $response);
    }

    public function testDeleteOrderReturnsResponse() {
        $orderId = 1;

        $response = $this->dataProvider->deleteOrder($orderId);

        $this->assertEquals(['status' => 200, 'data' => [], 'message' => 'success'], $response);
    }

}
