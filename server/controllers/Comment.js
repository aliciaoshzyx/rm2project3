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
  console.log('in make comment');
  console.log(req.body);
  if (!req.body.comment || !req.body.parentPost) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }
  const commentData = {
    com: req.body.comment,
    parentPost: req.body.parentPost,
    owner: req.session.account._id,
    user: req.session.account.username,
  };

  console.log(`data${JSON.stringify(commentData)}`);
  const newComment = new Comment.CommentModel(commentData);

  const commentPromise = newComment.save();

  commentPromise.then(() => {
    req.session.comment = Comment.CommentModel.toAPI(newComment);
    return res.json({ redirect: '/makerCOmment' });
   });

  commentPromise.catch((err) => {
    console.log("in error");
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Comment already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return commentPromise;
};

// const getComments = (request, response) => {
//   const req = request;
//   const res = response;

//   return Artist.ArtistModel.findByOwner(req.session.account._id, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(400).json({ error: 'An error occured' });
//     }

//     return res.json({ artists: docs });
//   });
// };

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

// const deleteArtist = (request, response) => {
//   const req = request;
//   const res = response;
//   if (!req.body.artistID) {
//     return res.status(400).json({ error: 'An error occurred' });
//   }
//   return Artist.ArtistModel.deleteArtist(req.body.artistID, (err, docs) => {
//     if (err) {
//       console.log(err);
//       return res.status(202).json({ error: 'An error occured' });
//     }
//     return false;
//   });
// };

module.exports.makerPageComment = makerPageComment;
module.exports.makeComment = makeComment;
module.exports.getComments = getComments;
// /module.exports.getAllArtists = getAllArtists;
module.exports.communityPageComments = communityPageComments;
// module.exports.deleteArtist = deleteArtist;
