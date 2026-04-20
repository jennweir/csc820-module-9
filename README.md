# Simple Containerized API

A lightweight RESTful API for managing orders, built with Node.js and Express. Features containerization with Docker, automated CI/CD through GitLab CI, and deployment to Google Kubernetes Engine (GKE) Autopilot clusters using Workload Identity Federation.

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

## Test the API with Jest

First, ensure Jest is installed with `npm install --save-dev jest`

Then configure npm scripts. In package.json file, update the scripts section to include:

`"test": "jest"`

`"coverage": "jest --coverage"`

This will enable generation of a test coverage report.

Run tests with `npm test` and generate API coverage report with `npm run coverage`.

### Jest Tests

`tests/get-api-status.test.js` includes unit tests that validate the API is operational

`tests/get-all-orders.test.js` includes unit tests with mocking that validate the API properly returns all orders and handles errors/edge cases separately from the database connection

`tests/get-order-by-id.test.js` includes unit tests with mocking that validate the API properly returns an order based on its orderId and handles errors/edge cases separately from the database connection

`tests/post-create-order.test.js` includes unit tests with mocking that validate the API properly creates orders with the required order fields separately from the database connection

`tests/update-order-status.test.js` includes unit tests with mocking that validate the API properly updates orders with the required status field separately from the database connection

`tests/delete-order-id.test.js` includes unit tests with mocking that validate the API properly deletes order information separately from the database connection

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
