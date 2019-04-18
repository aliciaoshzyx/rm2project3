const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let CommentModel = {};

const convertId = mongoose.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
  com: {
    type: String,
    required: true,
  },

  user: {
    type: String,
    required: true,
  },

  parentPost: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.statics.toAPI = (doc) => ({
  com: doc.com,
  parentPost: doc.parentPost,
  owner: doc.owner,
  id: doc._id,
  user: doc.user,
});

CommentSchema.statics.findAll = (callback) => CommentSchema.find().exec(callback);

CommentSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return CommentModel.find(search).select('body parentPost owner id user').exec(callback);
};

CommentSchema.statics.findByPost = (parentPost, callback) =>
CommentModel.find({ parentPost }).exec(callback);

// CommentSchema.statics.deleteComment = (artistID, callback) => {

//   const search = {
//     _id: convertId(artistID),
//   };

//   ArtistModel.deleteOne(search, (err) => {
//     if (err) throw err;
//   }).exec(callback);
// };

CommentModel = mongoose.model('Comment', CommentSchema);

module.exports.CommentModel = CommentModel;
module.exports.CommentSchema = CommentSchema;
