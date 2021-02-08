const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const findOrders = await Order.find()
      .populate('user', 'name')
      .sort('dateOrdered');

    if (!findOrders) {
      return res.status(404).send('주문 내역이 없습니다.');
    }

    return res.status(200).send(findOrders);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const findOrder = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category ' },
      });

    if (!findOrder) {
      return res.status(404).send('주문 내역이 없습니다.');
    }

    return res.status(200).send(findOrder);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user,
      dateOrdered,
    } = req.body;

    const orderItemsIds = Promise.all(
      orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = await orderItemsIds;

    const newOrder = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1,
      shippingAddress2,
      city,
      zip,
      country,
      phone,
      status,
      totalPrice,
      user,
      dateOrdered,
    });

    const saveOrder = await newOrder.save();

    if (!saveOrder) {
      return res
        .status(400)
        .json({ success: false, message: '주문을 생성하지 못했습니다.' });
    }

    return res.status(201).send(saveOrder);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

module.exports = router;
