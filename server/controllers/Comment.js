const models = require('../models');

const Comment = models.Comment;

const makerPageComment = (req, res) => {
  Comment.CommentModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), comments: docs });
  });
};

const communityPageComments = (req, res) => {
  Comment.CommentModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('community', { csrfToken: req.csrfToken(), comments: docs });
  });
};

const makeComment = (req, res) => {
  if (!req.body.comment || !req.body.parentPost) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }
  const commentData = {
    com: req.body.comment,
    parentPost: req.body.parentPost,
    owner: req.session.account._id,
    user: req.session.account.username,
  };

  const newComment = new Comment.CommentModel(commentData);

  const commentPromise = newComment.save();

  commentPromise.then(() => res.json({ redirect: '/makerComment' }));

  commentPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Comment already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return commentPromise;
};


const getComments = (request, response) => {
  const req = request;
  const res = response;
  return Comment.CommentModel.findByPost(req.query.parentPost, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ comments: docs });
  });
};


module.exports.makerPageComment = makerPageComment;
module.exports.makeComment = makeComment;
module.exports.getComments = getComments;
module.exports.communityPageComments = communityPageComments;
