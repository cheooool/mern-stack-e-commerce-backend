const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', async (req, res) => {
  try {
    const userList = await User.find().select('-passwordHash');

    if (!userList) {
      return res.status(500).json({
        success: false,
      });
    }

    return res.status(200).send(userList);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.findById(id).select('-passwordHash');

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: '유저 정보를 찾을 수 없습니다.',
      });
    }

    return res.status(200).send(findUser);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      passwordHash,
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    } = req.body;
    const user = new User({
      name,
      email,
      passwordHash: bcrypt.hashSync(passwordHash, 10),
      phone,
      isAdmin,
      street,
      apartment,
      zip,
      city,
      country,
    });

    const newUser = await user.save();

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: '아이디를 생성할 수 없습니다.',
      });
    }

    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
