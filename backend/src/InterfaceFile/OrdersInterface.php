<?php

namespace Src\InterfaceFile;

interface OrdersInterface {

    /**
     * Get all orders
     *
     * @return array
     */
    public function getOrders();

    /**
     * Get order by ID
     *
     * @param int $id
     * @return array
     */
    public function getOrder($id);

    /**
     * Create a new order
     *
     * @param array $param
     * @return array
     */
    public function createOrder($param);

    /**
     * Update an existing order
     *
     * @param int $id
     * @param array $param
     * @return array
     */
    public function updateOrder($id, $param);

    /**
     * Delete an order
     *
     * @param int $id
     * @return array
     */
    public function deleteOrder($id);
}
