const models = require('../models');

const Song = models.Song;

const makerPageSong = (req, res) => {
  Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), songs: docs });
  });
};

const communityPageSong = (req, res) => {
  Song.SongModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('community', { csrfToken: req.csrfToken(), songs: docs });
  });
};

const makeSong = (req, res) => {
  if (!req.body.songName) {
    return res.status(400).json({ error: 'Not all required fields filled' });
  }
  const songData = {
    name: req.body.songName,
    artist: req.body.songArtist,
    type: req.body.songType,
    album: req.body.songAlbum,
    link: req.body.songLink,
    art: req.body.songArt,
    owner: req.session.account._id,
    user: req.session.account.username,
    upvotes: req.body.upvotes,
  };

  const newSong = new Song.SongModel(songData);

  const songPromise = newSong.save();

  songPromise.then(() => res.json({ redirect: '/makerSong' }));

  songPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Song already exists.' });
    }

    return res.statuse(400).json({ error: 'An error occured' });
  });

  return songPromise;
};


const getSongs = (request, response) => {
  const req = request;
  const res = response;

  return Song.SongModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ songs: docs });
  });
};

const getAllSongs = (request, response) => {
  const req = request;
  const res = response;

  return Song.SongModel.findAll((err, docs) => {
    console.log(docs);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ songs: docs });
  });
};

const updateUpvotes = (request, response) => {
  const req = request;
  const res = response;
  
  let up = parseInt(req.body.upvotes);
  const songID = req.body.songID;
  console.log(up);
  return Song.SongModel.updateUpvotes(songID, up, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({songs :docs});
  });

}

const deleteSong = (request, response) => {
  const req = request;
  const res = response;
  if (!req.body.songID) {
    return res.status(400).json({ error: 'An error occurred' });
  }
  return Song.SongModel.deleteSong(req.body.songID, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(202).json({ error: 'An error occured' });
    }
    return false;
  });
};


module.exports.makerPageSong = makerPageSong;
module.exports.makeSong = makeSong;
module.exports.getSongs = getSongs;
module.exports.getAllSongs = getAllSongs;
module.exports.communityPageSong = communityPageSong;
module.exports.deleteSong = deleteSong;
module.exports.updateSongUpvotes = updateUpvotes;
