const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let SongModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  artist: {
    type: String,
    required: false,
  },

  type: {
    type: String,
    required: true,
  },

  album: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: false,
  },

  art: {
    type: String,
    required: true,
    default: `https://images-wixmp-ed30a86b8c4ca887773594c2.
    wixmp.com/f/0441c1c5-1d8c-4795-bd2b-09d00f49ab64/day4crn-500cb08a-
    3e2a-49d9-93c7-23a2f534ebba.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
    eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzI
    joidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7In
    BhdGgiOiJcL2ZcLzA0NDFjMWM1LTFkOGMtNDc5NS1iZDJiLTA5ZDAwZjQ5YWI2NFwvZGF5NGN
    ybi01MDBjYjA4YS0zZTJhLTQ5ZDktOTNjNy0yM2EyZjUzNGViYmEucG5nIn1dXSwiYXVkIjpb
    InVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.EqdBDCHlgUGyMye2pNXiLiTuOUIPWxaev
    6NuBd2kpy0`,
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

SongSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  artist: doc.artist,
  type: doc.type,
  album: doc.album,
  link: doc.link,
  art: doc.art,
  owner: doc.owner,
});

SongSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SongModel.find(search).select('name artist type album link art owner').exec(callback);
};

SongModel = mongoose.model('Song', SongSchema);

module.exports.SongModel = SongModel;
module.exports.SongSchema = SongSchema;