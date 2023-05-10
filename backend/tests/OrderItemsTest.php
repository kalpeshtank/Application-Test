<?php

use PHPUnit\Framework\TestCase;
use Src\BaseClass;
use Src\DataProvider;
use Src\OrderItems;

class OrderItemsTest extends TestCase {

    protected function setUp(): void {
        
    }

    public function testGetOrders() {
        $dataProviderMock = $this->createMock(DataProvider::class);
        $dataProviderMock->expects($this->once())
                ->method('getOrders')
                ->willReturn(['order1', 'order2']);

        $orderItems = new OrderItems('GET', null);
        $orderItems->setDataProvider($dataProviderMock);

        $response = $orderItems->processRequest();

        $this->assertEquals(200, $response['status']);
        $this->assertEquals(['order1', 'order2'], $response['data']);
        $this->assertEquals('success', $response['message']);
    }

    public function testGetOrder() {
        $dataProviderMock = $this->createMock(DataProvider::class);
        $dataProviderMock->expects($this->once())
                ->method('getOrder')
                ->with($this->equalTo(1))
                ->willReturn(['id' => 1, 'name' => 'John Doe']);

        $orderItems = new OrderItems('GET', 1);
        $orderItems->setDataProvider($dataProviderMock);

        $response = $orderItems->processRequest();

        $this->assertEquals(200, $response['status']);
        $this->assertEquals(['id' => 1, 'name' => 'John Doe'], $response['data']);
        $this->assertEquals('success', $response['message']);
    }

    protected function tearDown(): void {
        
    }

}

?>