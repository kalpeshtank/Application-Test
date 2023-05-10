<?php

namespace Src\Contracts;

interface DataProviderInterface {

    public function getOrders();

    public function getOrder($id);

    public function createOrder($param);

    public function updateOrder($id, $param);

    public function deleteOrder($id);
}
