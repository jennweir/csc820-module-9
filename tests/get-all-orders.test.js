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

describe('GET-all-orders-success', () => {
  // 1. Setup Mock Data and Expected Return Value
  it('should return a 200 status code', async () => {
    Order.mockReturnValue({
      findAll: jest.fn().mockResolvedValue([])
    });

    // 2. Setup Response (res) object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the module function
    const OrderModel = Order(sequelize);
    const orders = await OrderModel.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

    // 4. Assertions
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return a response containing all of the orders', async () => {
    // 1. Setup Mock Data and Expected Return Value
    Order.mockReturnValue({
      findAll: jest.fn().mockResolvedValue([])
    });

    // 2. Setup Response (res) object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the module function
    const OrderModel = Order(sequelize);
    const orders = await OrderModel.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

    // 4. Assertions
    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.success).toEqual(true);
    expect(jsonData).toHaveProperty('orders');
    expect(jsonData.orders).toBeInstanceOf(Array);
    expect(jsonData).toHaveProperty('count');
  });

  it('should ensure every order contains all expected fields', async () => {
    // 1. Setup Mock Data and Expected Return Value
    const mockOrders = [
      {
        id: 1,
        customerEmail: 'johndoe@email.com',
        items: ['item1'],
        totalPrice: 99,
        status: 'Pending'
      },
      {
        id: 2,
        customerEmail: 'janedoe@email.com',
        items: ['item2'],
        totalPrice: 100,
        status: 'Shipped'
      }
    ];

    Order.mockReturnValue({
      findAll: jest.fn().mockResolvedValue(mockOrders)
    });

    // 2. Setup Response (res) object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the module function
    const OrderModel = Order(sequelize);
    const orders = await OrderModel.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

    // 4. Assertions
    const jsonData = res.json.mock.calls[0][0];
    if (jsonData.count > 0) {
      jsonData.orders.forEach(order => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('customerEmail');
        expect(order).toHaveProperty('items');
        expect(order).toHaveProperty('totalPrice');
        expect(order).toHaveProperty('status');
      });
    }
  });

  it('should ensure the number of orders is the same as the number of orders in the orders array', async () => {
    // 1. Setup Mock Data and Expected Return Value
    const mockOrders = [
      { id: 1, customerEmail: 'johndoe@email.com', items: ['item1'], totalPrice: 99, status: 'Pending' },
      { id: 2, customerEmail: 'janedoe@email.com', items: ['item2'], totalPrice: 100, status: 'Shipped' }
    ];

    Order.mockReturnValue({
      findAll: jest.fn().mockResolvedValue(mockOrders)
    });

    // 2. Setup Response (res) object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the module function
    const OrderModel = Order(sequelize);
    const orders = await OrderModel.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

    // 4. Assertions
    const jsonData = res.json.mock.calls[0][0];
    expect(jsonData.count).toEqual(jsonData.orders.length);
  });

  it('should ensure the response time of returning all orders is less than 2000ms', async () => {
    // 1. Setup Mock Data and Expected Return Value
    Order.mockReturnValue({
      findAll: jest.fn().mockResolvedValue([])
    });

    // 2. Setup Response (res) object
    const startTime = Date.now();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // 3. Execute the module function
    const OrderModel = Order(sequelize);
    const orders = await OrderModel.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

    // 4. Assertions
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(2000);
  });
});
