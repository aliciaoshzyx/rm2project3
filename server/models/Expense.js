const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ExpenseModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  amount: {
    type: Number,
    min: 0,
    required: true,
  },

  intensity: {
      type: String,
      required: true,
  },

  month: {
      type: String,
      required: true,
  },

  year: {
      type:String,
      required: true,
  },

  day:{
      type: String,
      required: false
  },

  notes: {
      type: String,
      required: false, 
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ExpenseSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

ExpenseSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ExpenseModel.find(search).select('name age').exec(callback);
};

ExpenseModel = mongoose.model('Expense', ExpenseSchema);

module.exports.ExpenseModel = ExpenseModel;
module.exports.ExpenseSchema = ExpenseSchema;
