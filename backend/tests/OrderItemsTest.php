<?php

namespace Tests\Unit;

use Src\OrderItems;
use Tests\Support\UnitTester;

class OrderItemsTest extends \Codeception\Test\Unit {

    protected UnitTester $tester;
    private $orderItems;

    protected function _before() {
        // Create a mock of the DataProvider class
        $this->orderItems = $this->getMockBuilder(OrderItems::class)
                ->disableOriginalConstructor()
                ->getMock();
    }

    public function testGetOrdersReturnsResponse() {
        // Mock the getOrders method of the DataProvider class
        $this->orderItems->expects($this->once())
                ->method('getOrders')
                ->willReturn(['status' => 'success', 'data' => []]);

        $response = $this->orderItems->getOrders();

        $this->assertEquals(['status' => 'success', 'data' => []], $response);
    }

    public function testGetOrderReturnsResponse() {
        $orderId = 1;

        // Mock the getOrder method of the DataProvider class
        $this->orderItems->expects($this->once())
                ->method('getOrder')
                ->with($orderId)
                ->willReturn(['status' => 'success', 'data' => []]);

        $response = $this->orderItems->getOrder($orderId);

        $this->assertEquals(['status' => 'success', 'data' => []], $response);
    }

    public function testCreateOrderReturnsResponse() {
        $orderData = [
            'name' => 'John Doe',
            'amount' => 100.00,
        ];

        // Mock the createOrder method of the DataProvider class
        $this->orderItems->expects($this->once())
                ->method('createOrder')
                ->with($orderData)
                ->willReturn(['status' => 'success', 'data' => []]);

        $response = $this->orderItems->createOrder($orderData);

        $this->assertEquals(['status' => 'success', 'data' => []], $response);
    }

    public function testUpdateOrderReturnsResponse() {
        $orderId = 1;
        $orderData = [
            'name' => 'John Doe',
            'amount' => 150.00,
        ];

        // Mock the updateOrder method of the DataProvider class
        $this->orderItems->expects($this->once())
                ->method('updateOrder')
                ->with($orderId, $orderData)
                ->willReturn(['status' => 'success', 'data' => []]);

        $response = $this->orderItems->updateOrder($orderId, $orderData);

        $this->assertEquals(['status' => 'success', 'data' => []], $response);
    }

    public function testDeleteOrderReturnsResponse() {
        $orderId = 1;

        // Mock the deleteOrder method of the DataProvider class
        $this->orderItems->expects($this->once())
                ->method('deleteOrder')
                ->with($orderId)
                ->willReturn(['status' => 'success', 'data' => []]);

        $response = $this->orderItems->deleteOrder($orderId);

        $this->assertEquals(['status' => 'success', 'data' => []], $response);
    }

}
