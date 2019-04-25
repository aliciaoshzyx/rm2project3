module.exports.Account = require('./Account.js');
module.exports.Song = require('./Song.js');
module.exports.Artist = require('./Artist.js');
module.exports.Album = require('./Album.js');
module.exports.Comment = require('./Comment.js');

const notFound = (req, res) => {
  res.render('notFound');
};

module.exports.notFound = notFound;
