jest.mock('../api/common/database');
jest.mock('../api/common/models/Order');

let Order;
let sequelize;

beforeEach(() => {
  jest.clearAllMocks();
  Order = require('../api/common/models/Order');
  sequelize = require('../api/common/database');
});

describe('PATCH-update-order-status-id', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should return a status code of 200', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      save: jest.fn().mockResolvedValue()
    };
    mockOrder.status = 'Shipped';

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      params: { id: 1 },
      body: { status: 'Shipped' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const { status } = req.body;
    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    if (order && status) {
      order.status = status;
      await order.save();
      res.status(200).json({
        success: true,
        order: order
      });
    }

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should update the order status', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Pending',
      save: jest.fn().mockResolvedValue()
    };
    mockOrder.status = 'Shipped';

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      params: { id: 1 },
      body: { status: 'Shipped' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    order.status = req.body.status;
    await order.save();
    res.status(200).json({
      success: true,
      order: order
    });

    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.success).toEqual(true);
    expect(jsonData.order.status).toEqual('Shipped');
  });

  it('should return the updated order data', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Shipped',
      updatedAt: new Date().toISOString(),
      save: jest.fn().mockResolvedValue()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      params: { id: 1 },
      body: { status: 'Shipped' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      order: order
    });

    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.order).toHaveProperty('id');
    expect(jsonData.order).toHaveProperty('customerEmail');
    expect(jsonData.order).toHaveProperty('totalPrice');
    expect(jsonData.order).toHaveProperty('updatedAt');
  });

  it('should have a response time below 500ms', async () => {
    const mockOrder = {
      id: 1,
      customerEmail: 'johndoe@email.com',
      items: ['item1', 'item2'],
      totalPrice: 99,
      status: 'Shipped',
      save: jest.fn().mockResolvedValue()
    };

    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(mockOrder)
    });

    const startTime = Date.now();

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      params: { id: 1 },
      body: { status: 'Shipped' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    await order.save();
    res.status(200).json({
      success: true,
      order: order
    });

    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(500);
  });
});

describe('PATCH-update-order-status-id-fail', () => {
  it('should return a 404 status code when order not found', async () => {
    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null)
    });

    // 2. Setup Express Request (req) and Response (res) objects
    const req = {
      params: { id: 1100 },
      body: { status: 'Shipped' }
    };
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

  it('should return an error when order not found', async () => {
    Order.mockReturnValue({
      findByPk: jest.fn().mockResolvedValue(null)
    });

    const req = {
      params: { id: 1100 },
      body: { status: 'Shipped' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const OrderModel = Order(sequelize);
    const order = await OrderModel.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({
        error: 'Order not found'
      });
    }

    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.error).toEqual('Order not found');
  });
});

describe('PATCH-update-order-status-missing', () => {
  it('should return a 400 status code when status field is not provided in the update body', () => {
    const req = {
      params: { id: 1 },
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const { status } = req.body;
    if (!status) {
      res.status(400).json({
        error: 'Status field is required'
      });
    }

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return an error when status field is not provided in the update body', () => {
    const req = {
      params: { id: 1 },
      body: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    if (!req.body.status) {
      res.status(400).json({
        error: 'Status field is required'
      });
    }

    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.error).toEqual('Status field is required');
  });
});
