const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let AlbumModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  artist: {
    type: String,
    required: true,
  },

  art: {
    type: String,
    required: true,
  },

  genere: {
    type: String,
    required: true,
  },

  tracks: [{
    type: String,
    required: true,
  }],

  trackPrevs: [{
    type: String,
    required: true,
  }],

  upvotes: {
    type: Number,
    required: false,
    default: 0,
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

  user: {
    type: String,
    required: true,
  },
});

AlbumSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  artist: doc.artist,
  art: doc.art,
  genere: doc.genere,
  tracks: doc.tracks,
  trackPrevs: doc.trackPrev,
  owner: doc.owner,
  user: doc.user,
});

AlbumSchema.statics.findAll = (callback) => AlbumModel.find().exec(callback);

AlbumSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return AlbumModel.find(search).select('name artist art genere tracks trackPrevs owner user').exec(callback);
};

AlbumSchema.statics.deleteAlbum = (albumID, callback) => {
  const search = {
    _id: convertId(albumID),
  };

  AlbumModel.deleteOne(search, (err) => {
    if (err) throw err;
  }).exec(callback);
};


AlbumModel = mongoose.model('Album', AlbumSchema);

module.exports.AlbumModel = AlbumModel;
module.exports.AlbumSchema = AlbumSchema;
