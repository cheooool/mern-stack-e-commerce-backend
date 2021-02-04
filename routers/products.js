const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const productList = await Product.find();

    if (!productList) {
      return res.status(404).json({
        success: false,
        message: '등록된 상품이 없습니다.',
      });
    }
    return res.send(productList);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const { name, image, countInStock } = req.body;
    const product = new Product({
      name,
      image,
      countInStock,
    });

    const newProduct = product.save();

    if (!newProduct) {
      res.status(400).json({
        success: false,
        message: '상품을 생성하지 못했습니다.',
      });
    }

    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(500).json({
      success: false,
      errror,
    });
  }
});

module.exports = router;
