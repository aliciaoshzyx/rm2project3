const models = require('../models');

const Artist = models.Artist;

const makerPageArtist = (req, res) => {
  Artist.ArtistModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), artists: docs });
  });
};

const communityPageArtist = (req, res) => {
  Artist.ArtistModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('community', { csrfToken: req.csrfToken(), artists: docs });
  });
};

const makeArtist = (req, res) => {
  console.log('in make Artist');
  console.log(req.body);
  if (!req.body.artistName) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }
  const artistData = {
    name: req.body.artistName,
    link: req.body.artistLink,
    genere: req.body.artistGenere,
    owner: req.session.account._id,
    user: req.session.account.username,
  };

  console.log(`data${JSON.stringify(artistData)}`);
  const newArtist = new Artist.ArtistModel(artistData);

  const artistPromise = newArtist.save();

  artistPromise.then(() => res.json({ redirect: '/makerArtist' }));

  artistPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Artist already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return artistPromise;
};

const getArtists = (request, response) => {
  const req = request;
  const res = response;

  return Artist.ArtistModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ artists: docs });
  });
};

const getAllArtists = (request, response) => {
  const req = request;
  const res = response;

  return Artist.ArtistModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ artists: docs });
  });
};

const deleteArtist = (request, response) => {
  const req = request;
  const res = response;
  if (!req.body.artistID) {
    return res.status(400).json({ error: 'An error occurred' });
  }
  return Artist.ArtistModel.deleteArtist(req.body.artistID, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occured' });
    }
    return false;
  });
};

module.exports.makerPageArtist = makerPageArtist;
module.exports.makeArtist = makeArtist;
module.exports.getArtists = getArtists;
module.exports.getAllArtists = getAllArtists;
module.exports.communityPageArtist = communityPageArtist;
module.exports.deleteArtist = deleteArtist;
