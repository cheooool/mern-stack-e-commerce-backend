const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
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

router.get(`/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Product.findById(id);

    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.',
      });
    }
    return res.send(findProduct);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const {
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      isFeatured,
      dateCreated,
    } = req.body;

    const findCategory = await Category.findById(category);

    if (!findCategory) {
      return res.status(400).send('Invalid Category');
    }

    const product = new Product({
      name,
      description,
      richDescription,
      image,
      images,
      brand,
      price,
      category,
      countInStock,
      rating,
      isFeatured,
      dateCreated,
    });

    const newProduct = await product.save();

    if (!newProduct) {
      res.status(400).json({
        success: false,
        message: '상품을 생성하지 못했습니다.',
      });
    }

    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
