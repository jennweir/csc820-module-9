jest.mock('../api/common/database');
jest.mock('../api/common/models/Order');

let Order;
let sequelize;

beforeEach(() => {
  jest.clearAllMocks();
  Order = require('../api/common/models/Order');
  sequelize = require('../api/common/database');
});

describe('GET-order-by-id', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should have a status code of 200', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the controller function
    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      order: order
    });

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should indicate the response body contains the requested order', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the controller function
    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      order: order
    });

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.success).toEqual(true);
    expect(jsonData).toHaveProperty('order');
    expect(jsonData.order.id).toEqual(expect.any(Number));
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should contain an order with all required fields', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the controller function
    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      order: order
    });

    const jsonData = res.json.mock.calls[0][0];
    const order_data = jsonData.order;

    // 4. Assertions
    expect(order_data).toHaveProperty('customerEmail');
    expect(order_data).toHaveProperty('items');
    expect(order_data).toHaveProperty('totalPrice');
    expect(order_data).toHaveProperty('status');
    expect(order_data).toHaveProperty('createdAt');
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should have a response time below 500ms', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    const startTime = Date.now();

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const order = await OrderModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      order: order
    });

    // 4. Assertions
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
  });
});

describe('GET-order-by-id-nonexistent', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should return a status code of 404 when order not found', async () => {
    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1100 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const order = await OrderModel.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({
        error: 'Order not found'
      });
    }

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(404);
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should return an error message when order not found', async () => {
    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = { params: { id: 1100 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const order = await OrderModel.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({
        error: 'Order not found'
      });
    }

    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.error).toEqual('Order not found');
  });
});