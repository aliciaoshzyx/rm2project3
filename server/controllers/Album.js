const models = require('../models');

const Album = models.Album;

const makerPageAlbum = (req, res) => {
  Album.AlbumModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), albums: docs });
  });
};

const communityPageAlbum = (req, res) => {
  Album.AlbumModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('community', { csrfToken: req.csrfToken(), albums: docs });
  });
};

const makeAlbum = (req, res) => {
  console.log('in make Album');
  if (!req.body.albumName) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }

  const albumData = {
    name: req.body.albumName,
    artist: req.body.albumArtist,
    art: req.body.albumArt,
    genere: req.body.albumGenere,
    tracks: JSON.parse(req.body.albumTracks),
    trackPrevs: JSON.parse(req.body.albumTrackPrev),
    owner: req.session.account._id,
    user: req.session.account.username,
  };

  const newAlbum = new Album.AlbumModel(albumData);

  const albumPromise = newAlbum.save();

  albumPromise.then(() => res.json({ redirect: '/makerAlbum' }));

  albumPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Album already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return albumPromise;
};

const getAlbums = (request, response) => {
  const req = request;
  const res = response;

  return Album.AlbumModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ albums: docs });
  });
};

const getAllAlbums = (request, response) => {
  const req = request;
  const res = response;

  return Album.AlbumModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ albums: docs });
  });
};

const deleteAlbum = (request, response) => {
  const req = request;
  const res = response;
  if (!req.body.albumID) {
    return res.status(400).json({ error: 'An error occurred' });
  }
  return Album.AlbumModel.deleteAlbum(req.body.albumID, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occured' });
    }
    return false;
  });
};

module.exports.makerPageAlbum = makerPageAlbum;
module.exports.makeAlbum = makeAlbum;
module.exports.getAlbums = getAlbums;
module.exports.getAllAlbums = getAllAlbums;
module.exports.communityPageAlbum = communityPageAlbum;
module.exports.deleteAlbum = deleteAlbum;
