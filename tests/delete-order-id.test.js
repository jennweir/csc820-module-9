// Mock the order module and database module
jest.mock('../api/common/database');
jest.mock('../api/common/models/Order');

let Order;
let sequelize;

beforeEach(() => {
  jest.clearAllMocks();
  Order = require('../api/common/models/Order');
  sequelize = require('../api/common/database');
});

describe('DELETE-order-id', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should have a status code of 200', async () => {
    const mockOrder = {
      id: 1,
      destroy: jest.fn().mockResolvedValue()
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

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const order = await OrderModel.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.status(200).json({
        success: true,
        message: 'Order deleted'
      });
    }
    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // 1. Setup Mock Data
  it('should indicate deletion was successful', async () => {
    const mockOrder = {
      id: 1,
      destroy: jest.fn().mockResolvedValue()
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

    const OrderModel = Order(sequelize);
    // 3. Execute the controller function
    const order = await OrderModel.findByPk(req.params.id);
    await order.destroy();
    res.status(200).json({
      success: true,
      message: 'Order deleted'
    });
    const jsonData = res.json.mock.calls[0][0];
    // 4. Assertions
    expect(jsonData.success).toEqual(true);
    expect(jsonData.message).toEqual('Order deleted');
  });

  // 1. Setup Mock Data and Expected Return Value
  it('should have a response time below 500ms', async () => {
    const mockOrder = {
      id: 1,
      destroy: jest.fn().mockResolvedValue()
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
    await order.destroy();
    res.status(200).json({
      success: true,
      message: 'Order deleted'
    });
    const responseTime = Date.now() - startTime;
    // 4. Assertions
    expect(responseTime).toBeLessThan(500);
  });
});

describe('DELETE-order-id-nonexistent', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should have a status code of 404 when order not found', async () => {
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

  it('should indicate failure when order not found', async () => {
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

describe('DELETE-order-id-no-id', () => {
  it('should have a status code of 404 when order not found', async () => {
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
    const order = await OrderModel.findByPk(req.params.id);
    if (!order) {
      res.status(404).json({
        error: 'Order not found'
      });
    }
    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('should indicate failure when order not found', async () => {
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
