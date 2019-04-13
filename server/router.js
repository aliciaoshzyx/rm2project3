const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSongs', mid.requiresLogin, controllers.Song.getSongs);
  app.get('/getArtists', mid.requiresLogin, controllers.Artist.getArtists);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/makerSong', mid.requiresLogin, controllers.Song.makerPageSong);
  app.post('/makerSong', mid.requiresLogin, controllers.Song.makeSong);
  app.get('/makerArtist', mid.requiresLogin, controllers.Artist.makerPageArtist);
  app.post('/makerArtist', mid.requiresLogin, controllers.Artist.makeArtist);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
