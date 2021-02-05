const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });
    if (!findUser) {
      return res.status(400).send('유저 정보를 찾지못했습니다.');
    }
    if (
      findUser &&
      bcrypt.compareSync(req.body.password, findUser.passwordHash)
    ) {
      const token = jwt.sign(
        {
          userId: findUser._id,
          isAdmin: findUser.isAdmin,
        },
        process.env.SECRET,
        {
          expiresIn: '1d',
        }
      );
      return res.status(200).send({ user: findUser.email, token: token });
    } else {
      return res.status(400).send('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments((count) => count);
    // count 메소드는 최신버전에서는 사용되지 않는다.
    // const userCount = await Product.count((count) => count);
    if (!userCount) {
      res.status(500).json({ success: false });
    }
    res.send({
      userCount: userCount,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const removeUser = await User.findByIdAndRemove(id);
    if (!removeUser) {
      return res.status(404).json({
        success: false,
        message: '존재하지 않는 사용자입니다.',
      });
    }
    return res.status(200).send('사용자가 제거되었습니다.');
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
