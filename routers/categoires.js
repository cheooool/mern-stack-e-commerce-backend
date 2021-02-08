const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const categoryList = await Category.find();

    if (!categoryList) {
      return res
        .status(404)
        .json({ success: false, message: '등록된 카테고리가 없습니다.' });
    }
    return res.status(200).send(categoryList);
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: '카테고리를 찾을 수 없습니다.' });
    }
    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const category = new Category({
      name,
      icon,
      color,
    });

    const newCategory = await category.save();

    if (!newCategory) {
      return res
        .status(400)
        .json({ success: false, message: '카테고리를 생성하지 못했습니다.' });
    }

    return res.status(201).send(newCategory);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        icon,
        color,
      },
      {
        // 업데이트한 내용을 바로 받으려면 해당 옵션을 입력해주어야한다.
        new: true,
      }
    );

    if (!category) {
      return res.status(400).json({
        success: false,
        message: '카테고리 변경에 실패했습니다.',
      });
    }
    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const removeCategory = await Category.findByIdAndRemove(req.params.id);

    if (!removeCategory) {
      return res.status(404).json({
        success: false,
        message: '해당하는 카테고리를 찾을 수 없습니다.',
      });
    }

    return res
      .status(200)
      .json({ success: true, message: '카테고리가 제거되었습니다.' });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
});

module.exports = router;
