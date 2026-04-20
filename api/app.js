const express = require('express');
const app = express();
const sequelize = require('./common/database');
const order = require('./common/models/Order');
const Order = order(sequelize);

app.use(express.json());

// Simulates email confirmation for a promise-based delay when creating an order
const sendEmailConfirmation = async (customerEmail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        emailSent: true,
        to: customerEmail,
        subject: `Order Confirmation for ${customerEmail}`,
        sentAt: new Date().toISOString()
      });
    }, 2000); // 2 second promise-based delay
  });
};

app.get('/status', (req, res) => {
  res.json({
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.post('/orders', async (req, res) => {
  try {
    const { customerEmail, items, totalPrice } = req.body;

    // Input Validation - Check each field individually
    if (!customerEmail) {
      return res.status(400).json({
        error: 'Missing required field: customerEmail'
      });
    }
    if (!items) {
      return res.status(400).json({
        error: 'Missing required field: items'
      });
    }
    if (!totalPrice) {
      return res.status(400).json({
        error: 'Missing required field: totalPrice'
      });
    }

    // call promise-based email confirmation
    const emailResult = await sendEmailConfirmation(customerEmail);
    console.log(`Confirmation email sent to ${emailResult.to}`);

    // Save order to database
    const newOrder = await Order.create({
      customerEmail: customerEmail,
      items: items,
      totalPrice: totalPrice,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      order: newOrder,
      notification: emailResult,
      message: 'Order created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

app.get('/orders', async (req, res) => {
  // Retrieve all orders.
  try {
    // findAll is sequelize's way of finding all values in a table
    const orders = await Order.findAll();
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to find orders',
      details: error.message
    });
  }
});

app.get('/orders/:id', async (req, res) => {
  // Retrieve a specific order by ID.
  try {
    // findByPk is sequelize's way of finding a value by its ID
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to find order',
      details: error.message
    });
  }
});

app.patch('/orders/:id', async (req, res) => {
  // Update an order status from "Pending" to "Shipped"
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    // Update the order status
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        error: 'Status field is required'
      });
    }
    order.status = status;
    await order.save();
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update order',
      details: error.message
    });
  }
});

app.delete('/orders/:id', async (req, res) => {
  // Cancel/remove an order.
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }
    // destroy is sequelize's way of deleting a value
    await order.destroy();
    res.status(200).json({
      success: true,
      message: 'Order deleted'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete order',
      details: error.message
    });
  }

});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}
module.exports = app;
