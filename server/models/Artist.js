const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ArtistModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  link: {
    type: String,
    required: false,
  },

  genere: {
    type: String,
    required: true,
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

ArtistSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  link: doc.link,
  genere: doc.genere,
  owner: doc.owner,
  id: doc._id,
  user: doc.user,
});

ArtistSchema.statics.findAll = (callback) => ArtistSchema.find().exec(callback);

ArtistSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ArtistModel.find(search).select('name link genere owner user').exec(callback);
};

ArtistSchema.statics.deleteArtist = (artistID, callback) => {
  const search = {
    _id: convertId(artistID),
  };

  ArtistModel.deleteOne(search, (err) => {
    if (err) throw err;
  }).exec(callback);
};

ArtistModel = mongoose.model('Artist', ArtistSchema);

module.exports.ArtistModel = ArtistModel;
module.exports.ArtistSchema = ArtistSchema;
