const express = require('express');
const mongoose = require('mongoose');
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const checkLogin = require('../middlewares/checkLogin');

const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);

const router = express.Router();

// GET all the TODOS
router.get('/', checkLogin, async (req, res) => {
  try {
    // provides all data
    // const result = await Todo.find({ status: 'active' });

    // field dekhabo na
    const result = await Todo.find({})
      .populate('user', 'name username') // db te je name a rakhchi
      .select({
        _id: 0,
        __v: 0,
        date: 0,
      })
      .limit(2);
    res.status(200).json({
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error',
    });
  }
});

// GET Active TODO
router.get('/active', async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive();
  res.status(200).json({
    data,
  });
});

router.get('/js', async (req, res) => {
  const data = await Todo.findByJS();
  res.status(200).json({
    data,
  });
});

// GET TODOS BY LANGUAGE
router.get('/language', async (req, res) => {
  const data = await Todo.find().byLanguage('react');
  res.status(200).json({
    data,
  });
});

// GET a TODO by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await Todo.find({ _id: req.params.id });
    res.status(200).json({
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'There was a server side error!',
    });
  }
});

// POST A TODO
router.post('/', checkLogin, async (req, res) => {
  try {
    const newTodo = new Todo({
      ...req.body,
      user: req.userId,
    });
    const todo = await newTodo.save(); // return new record
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      },
    );
    res.status(200).json({
      message: 'Todo was inserted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

// POST multiple TODO
router.post('/all', async (req, res) => {
  try {
    const result = await Todo.insertMany(req.body);

    res.status(200).json({
      message: 'Todos were inserted successully!',
    });
  } catch (error) {
    res.status(403).json({
      error: error.message,
    });
  }
});

// PUT TODO
router.put('/:id', async (req, res) => {
  try {
    // const result = await Todo.updateOne(
    //     { _id: req.params.id },
    //     {
    //         $set: {
    //             status: 'acitve',
    //         },
    //     },
    // );

    // sometimes need updated document
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: 'acitve',
        },
      },
      {
        new: true, // updated data
      }
    );

    console.log(result);

    res.status(200).json({
      message: 'Todo was updated successfully!',
    });
  } catch (error) {
    res.status(403).json({
      error: error.message,
    });
  }
});

// DELETE TODO
router.delete('/:id', async (req, res) => {
  try {
    await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: 'Todo was deleted successfully!',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error!',
    });
  }
});

module.exports = router;
