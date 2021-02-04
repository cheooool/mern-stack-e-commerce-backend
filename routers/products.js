const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = {
        category: req.query.categories.split(','),
      };
    }
    const productList = await Product.find(filter).populate('category');

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
    const findProduct = await Product.findById(id).populate('category');
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

router.put(`/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.isValidObjectId(id)) {
      return res.status(404).send('존재하지 않는 상품 id 입니다.');
    }

    const {
      name,
      description,
      richDescription,
      image,
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

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        richDescription,
        image,
        brand,
        price,
        category,
        countInStock,
        rating,
        isFeatured,
        dateCreated,
      },
      {
        new: true,
      }
    );

    if (!updateProduct) {
      return res.status(400).json({
        success: false,
        message: '상품정보 변경에 실패했습니다.',
      });
    }
    return res.status(200).send(updateProduct);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const removeProduct = await Product.findByIdAndRemove(id);
    if (!removeProduct) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 상품입니다.',
      });
    }
    return res.status(200).send('상품이 제거되었습니다.');
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments((count) => count);
    // count 메소드는 최신버전에서는 사용되지 않는다.
    // const productCount = await Product.count((count) => count);
    if (!productCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      productCount: productCount,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.get('/get/featured/:count', async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const featureProduct = await Product.find({ isFeatured: true }).limit(
      +count
    );

    if (!featureProduct) {
      res.status(500).json({ success: false });
    }
    res.send(featureProduct);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
