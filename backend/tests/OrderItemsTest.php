<?php

use PHPUnit\Framework\TestCase;
use Src\OrderItems;

class OrderItemsTest extends TestCase {

    private $orderItems;

    protected function setUp(): void {
        $requestMethod = 'GET'; // Set the desired request method for testing
        $id = null; // Set the desired ID for testing

        $this->orderItems = $this->getMockBuilder(OrderItems::class)
                ->disableOriginalConstructor()
                ->getMock();

        $this->orderItems->method('getInput')->willReturn([]);
        $this->orderItems->method('notFoundResponse')->willReturn([]);
        $this->orderItems->method('sendResponse')->willReturn([]);
    }

    public function testProcessRequestGetMethodWithoutId() {
        $this->orderItems->method('getOrders')->willReturn([]);

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

    public function testProcessRequestGetMethodWithId() {
        $this->orderItems->method('getOrder')->willReturn([]);

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

    public function testProcessRequestPostMethod() {
        $this->orderItems->method('createOrder')->willReturn([]);

        $_SERVER['REQUEST_METHOD'] = 'POST';

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

    public function testProcessRequestPutMethod() {
        $this->orderItems->method('updateOrder')->willReturn([]);

        $_SERVER['REQUEST_METHOD'] = 'PUT';

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

    public function testProcessRequestDeleteMethodWithoutId() {
        $this->orderItems->method('deleteOrder')->willReturn([]);

        $_SERVER['REQUEST_METHOD'] = 'DELETE';
        $_GET['orderIds'] = '1,2,3';

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

    public function testProcessRequestDeleteMethodWithId() {
        $this->orderItems->method('deleteOrder')->willReturn([]);

        $_SERVER['REQUEST_METHOD'] = 'DELETE';

        $result = $this->orderItems->processRequest();

        $this->assertEquals([], $result);
    }

}

?>