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

AlbumSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  artist: doc.artist,
  art: doc.art,
  genere: doc.genere,
  tracks: doc.tracks,
  trackPrevs: doc.trackPrev,
  owner: doc.owner,
});

AlbumSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return AlbumModel.find(search).select('name artist art genere tracks trackPrevs owner').exec(callback);
};

AlbumModel = mongoose.model('Album', AlbumSchema);

module.exports.AlbumModel = AlbumModel;
module.exports.AlbumSchema = AlbumSchema;
