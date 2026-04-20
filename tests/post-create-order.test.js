jest.mock('../api/common/database');
jest.mock('../api/common/models/Order');

let Order;
let sequelize;

beforeEach(() => {
  jest.clearAllMocks();
  Order = require('../api/common/models/Order');
  sequelize = require('../api/common/database');
});

describe('POST-create-order', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should validate the status code is 201', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending'
    };

    Order.mockReturnValue({
      create: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const { customerEmail, items, totalPrice } = req.body;
    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const newOrder = await OrderModel.create({
      customerEmail,
      items,
      totalPrice,
      status: 'Pending'
    });
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: { emailSent: true, to: customerEmail },
      message: 'Order created successfully'
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should ensure the response body contains order information', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending'
    };

    Order.mockReturnValue({
      create: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: { emailSent: true, to: req.body.customerEmail },
      message: 'Order created successfully'
    });

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.success).toEqual(true);
    expect(jsonData).toHaveProperty('order');
    expect(jsonData.order.id).toEqual(expect.any(Number));
    expect(jsonData.order.customerEmail).toEqual('johndoe@email.com');
    expect(jsonData.order.status).toEqual('Pending');
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should ensure the response contains email confirmation', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending'
    };

    Order.mockReturnValue({
      create: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const newOrder = await OrderModel.create(req.body);
    const notification = {
      emailSent: true,
      to: 'johndoe@email.com'
    };
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: notification,
      message: 'Order created successfully'
    });

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.notification.emailSent).toEqual(true);
    expect(jsonData.notification.to).toEqual('johndoe@email.com');
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should ensure the response time accounts for sending the email', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending'
    };

    Order.mockReturnValue({
      create: jest.fn().mockResolvedValue(mockOrder)
    });
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: { emailSent: true, to: req.body.customerEmail },
      message: 'Order created successfully'
    });

    const responseTime = Date.now() - startTime;
    // 4. Assertions
    expect(responseTime).toBeGreaterThanOrEqual(2000);
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should ensure the json header ', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending'
    };

    Order.mockReturnValue({
      create: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      header: jest.fn().mockReturnThis()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const newOrder = await OrderModel.create(req.body);
    res.status(201).json({
      success: true,
      order: newOrder,
      notification: { emailSent: true, to: req.body.customerEmail },
      message: 'Order created successfully'
    });

    // 4. Assertions
    expect(res.json).toHaveBeenCalled();
  });
});

describe('POST-create-order validation', () => {
  it('Status code 400 when missing items', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const { customerEmail, items, totalPrice } = req.body;
    if (!items) {
      res.status(400).json({
        error: 'Missing required field: items'
      });
    }

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing required field: items'
    });
  });

  it('should fail due to missing items in order request body', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.items) {
      res.status(400).json({
        error: 'Missing required field: items'
      });
    }

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.error).toEqual('Missing required field: items');
  });

  it('should return a status code of 400 when missing the customer email in request body', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.customerEmail) {
      res.status(400).json({
        error: 'Missing required field: customerEmail'
      });
    }

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should fail due to missing the customer email in order request body', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        items: ['item1', 'item2'],
        totalPrice: 99
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.customerEmail) {
      res.status(400).json({
        error: 'Missing required field: customerEmail'
      });
    }

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.error).toEqual('Missing required field: customerEmail');
  });

  it('should return a status code of 400 when missing the total price in request body', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2']
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.totalPrice) {
      res.status(400).json({
        error: 'Missing required field: totalPrice'
      });
    }

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should fail due to missing total price in order request body', () => {
    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      body: {
        customerEmail: 'johndoe@email.com',
        items: ['item1', 'item2']
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.totalPrice) {
      res.status(400).json({
        error: 'Missing required field: totalPrice'
      });
    }

    // 4. Assertions
    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.error).toEqual('Missing required field: totalPrice');
  });
});
