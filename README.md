# CSC820 Module 9

Building a RESTful API with Node.js and Express.js

## Running API Locally

### Dependencies and Installation

`node -v` is v24.14.1

`npm -v` is 11.11.0

`npm install express sequelize sqlite3 jsonwebtoken ajv`

### Run the API

To run the API locally, first cd into the directory storing the api and app.js file:

`cd api`

Then, execute the following command:

`node app.js`

> Prior to each run, it is recommended to remove the `api/storage/data.db` file that tracks the contents of the SQLite database stored locally. This file is not committed in GitHub and is re-initialized upon each restart of the API for local testing.

Once running on your local machine, run curl calls in a separate terminal against `localhost:3000` to test. If a different port is desired, overwrite the `PORT` environment variable with the following syntax: `PORT=<port> node app.js`.

### Sample Test Curl Calls

```bash
# 1. POST /orders - Create a new order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerEmail": "johndoe@email.com",
    "items": ["item1", "item2"],
    "totalPrice": 99
  }'

# 2. GET /orders - Retrieve all orders
curl http://localhost:3000/orders

# 3. GET /orders/:id - Retrieve a specific order by ID
curl http://localhost:3000/orders/1

# 4. PATCH /orders/:id - Update order status by ID
curl -X PATCH http://localhost:3000/orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shipped"
  }'

# 5. DELETE /orders/:id - Delete an order by ID
curl -X DELETE http://localhost:3000/orders/1
```

## API Documentation

### 1. POST /orders

Creates a new order and sends confirmation email to the customerEmail provided in the order request body.

**Endpoint:** `POST /orders`

**URL Parameters:**

| Field | Type | Description |
|-------|------|-------------|
| customerEmail | String | Customer email address |
| items | Array | List of items in the order |
| totalPrice | Integer | Order total amount in dollars |

**Example Request Body:**

```json
{
  "customerEmail": "johndoe@email.com",
  "items": ["item1", "item2"],
  "totalPrice": 99
}
```

**HTTP Status Codes:**

201 - Order created successfully
400 - Missing or invalid required field
500 - Server error

### 2. GET /orders

Retrieves all orders from the database. Will not include orders that have been deleted.

**Endpoint:** `GET /orders`

**URL Parameters:**

None

**HTTP Status Codes:**

200 - Success - orders retrieved
500 - Server error

### 3. GET /orders/:id

Retrieves a specific order by its database ID. ID is naturally increasing and is not reused.

**Endpoint:** `GET /orders/:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Order ID |

**HTTP Status Codes:**

200 - Success - order found
404 - Order not found
500 - Server error

### 4. PATCH /orders/:id

Updates an order's status. Move "Pending" to "Shipped".

**Endpoint:** `PATCH /orders/:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Order ID |

**Request Body:**
```json
{
  "status": "Shipped"
}
```

**HTTP Status Codes:**

200 - Success - order updated
400 - Missing status field
404 - Order not found
500 - Server error

### 5. DELETE /orders/:id

Deletes an order from the database based on its ID.

**Endpoint:** `DELETE /orders/:id`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | Integer | Order ID |

**HTTP Status Codes:**

200 - Success - order deleted
404 - Order not found
500 - Server error
