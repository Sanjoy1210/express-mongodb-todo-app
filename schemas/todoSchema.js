const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // model name
  },
});

// instance methods
todoSchema.methods = {
  findActive() {
    return mongoose.model('Todo').find({ status: 'active' });
  },
  findActiveCallback(cb) {
    return mongoose.model('Todo').find({ status: 'active' }, cb);
  },
};

// static methods
todoSchema.statics = {
  findByJS() {
    return this.find({ title: /js/i });
  },
};

// query helpers
todoSchema.query = {
  byLanguage(language) {
    return this.find({ title: new RegExp(language, 'i') });
  },
};

module.exports = todoSchema;
