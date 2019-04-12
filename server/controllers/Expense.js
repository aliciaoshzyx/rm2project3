const models = require('../models');

const Expense = models.Expense;

const makerPage = (req, res) => {
  Expense.ExpenseModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeExpense = (req, res) => {
  if (!req.body.name || !req.body.amount || !req.intensity
    ||!req.body.month || !req.body.year ) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }

  const expenseData = {
    name: req.body.name,
    amount: req.body.amount,
    intensity: req.body.intensity,
    month: req.body.month,
    year: req.body.year,
    day: req.body.day,
    notes: req.body.notes,
    owner: req.session.account._id,
  };

  const newExpense = new Expense.ExpenseModel(expenseData);

  const expensePromise = newExpense.save();

  expensePromise.then(() => res.json({ redirect: '/maker' }));

  expensePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Expense already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return domoPromise;
};

const getExpenses = (request, response) => {
  const req = request;
  const res = response;

  return Expense.ExpenseModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ expenses: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeExpenses;
module.exports.getExpenses = getExpenses;
