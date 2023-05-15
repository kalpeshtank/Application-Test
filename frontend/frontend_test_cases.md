## Backend Code Test Cases

### Test Case 1: Get All Orders
**Description:** Test the functionality to retrieve all orders.

**Input:**
- Request: GET /orders

**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "success",
        "status": 200,
        "data": {
            "headers": [
                "id",
                "name",
                "state",
                "zip",
                "amount",
                "qty",
                "item"
                ],
            "data": [ {
                "id": "4",
                "name": "James",
                "state": "IL",
                "zip": "67866",
                "amount": "78.8",
                "qty": "1",
                "item": "E5"
            }]
        }
    }

**Actual Output:**
- Status Code: 200
- Response Body:     
    {
        "message": "success",
        "status": 200,
        "data": {
            "headers": [
                "id",
                "name",
                "state",
                "zip",
                "amount",
                "qty",
                "item"
            ],
            "data": [ {
                "id": "4",
                "name": "James",
                "state": "IL",
                "zip": "67866",
                "amount": "78.8",
                "qty": "1",
                "item": "E5"
            }]
        }
    }
![all orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/list.jpg)
**Result:**
Pass

### Test Case 2: Get Order by ID
**Description:** Test the functionality to retrieve a specific order by ID.

**Input:**
- Request: GET /orders/1

**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "success",
        "status": 200,
        "data": {
            "id": "100",
            "name": "Charlotte",
            "state": "NC",
            "zip": "16186",
            "amount": "92.4",
            "qty": "8",
            "item": "A1B2C3"
        }
    }

**Actual Output:**
- Status Code: 200
- Response Body: 
  {
    "message": "success",
    "status": 200,
    "data": {
        "id": "100",
        "name": "Charlotte",
        "state": "NC",
        "zip": "16186",
        "amount": "92.4",
        "qty": "8",
        "item": "A1B2C3"
    }
}
![update orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/update.jpg)
**Result:**
Pass

### Test Case 3: Create New Order
**Description:** Test the functionality to create a new order.

**Input:**
- Request: POST /orders
- Request Body:
    {
    "name": "John Doe",
    "state": "California",
    "zip": "12345",
    "amount": 100,
    "qty": 2,
    "item": "Item A"
    }


**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "OrderItems Created",
        "status": 200,
        "data": {
            "id": 1001,
            "name": "kalpesh 22",
            "state": "KT",
            "zip": 35005,
            "amount": 87.5,
            "qty": 3,
            "item": "TR9091"
        }
    }

**Actual Output:**
- Status Code: 200
- Response Body:

    {
        "message": "OrderItems Created",
        "status": 200,
        "data": {
            "id": 1001,
            "name": "kalpesh 22",
            "state": "KT",
            "zip": 35005,
            "amount": 87.5,
            "qty": 3,
            "item": "TR9091"
        }
    }
![add new orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/add.jpg)
**Result:**
Pass

### Test Case 4: Update Existing Order
**Description:** Test the functionality to update an existing order.

**Input:**
- Request: PUT /orders/1
- Request Body:
    {
        "name":"kalpesh kt",
        "state":"KT DK",
        "zip":39506,
        "amount":91,
        "qty":1,
        "item":"TR9092"
    }


**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "OrderItems Updated!",
        "status": 200,
        "data": []
    }

**Actual Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "OrderItems Updated!",
        "status": 200,
        "data": []
    }
![update orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/update.jpg)
**Result:**
Pass

### Test Case 5: Delete Order
**Description:** Test the functionality to delete an order.

**Input:**
- Request: DELETE /orders/1

**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "OrderItem Deleted",
        "status": 200,
        "data": null
    }

**Actual Output:**
- Status Code: 200
- Response Body: 

    {
        "message": "OrderItem Deleted",
        "status": 200,
        "data": null
    }
![delete orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/delete.jpg)
**Result:**
Pass

### Test Case 6: Delete Multiple Orders
**Description:** Test the functionality to delete multiple orders.

**Input:**
- Request: DELETE /orders?orderIds=1,2,3,1001

**Expected Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "Records deleted successfully",
        "status": 200,
        "data": [
            "3"
        ]
    }
**Actual Output:**
- Status Code: 200
- Response Body: 
    {
        "message": "Records deleted successfully",
        "status": 200,
        "data": [
            "3"
        ]
    }
![delete multiple orders](https://github.com/kalpeshtank/Application-Test/blob/main/frontend/delete_m.jpg)
**Result:**
Pass
