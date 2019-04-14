"use strict";

var SongList = function SongList(props) {
    if (props.songs.length === 0) {
        return React.createElement(
            "div",
            { className: "songList" },
            React.createElement(
                "h3",
                { className: "emptySong" },
                "No Entries Yet"
            )
        );
    }

    var songNodes = props.songs.map(function (song) {
        return React.createElement(
            "div",
            { key: song._id, className: "song" },
            React.createElement(
                "h3",
                { className: "songName" },
                "Name: ",
                song.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "songArtist" },
                "song: ",
                song.artist,
                " "
            ),
            React.createElement(
                "h3",
                { className: "songType" },
                "Type: ",
                song.type
            ),
            React.createElement(
                "h3",
                { className: "songAlbum" },
                "Album: ",
                song.album
            ),
            React.createElement("img", { className: "songArt", src: song.art }),
            React.createElement("audio", { classname: "songLink", controls: true, src: song.link })
        );
    });

    return React.createElement(
        "div",
        { className: "songList" },
        songNodes
    );
};

var loadAllSongsFromServer = function loadAllSongsFromServer() {
    sendAjax('GET', '/getAllSongs', null, function (data) {
        ReactDOM.render(React.createElement(SongList, { songs: data.songs }), document.querySelector("#all"));
    });
};

var ArtistList = function ArtistList(props) {
    if (props.artists.length === 0) {
        return React.createElement(
            "div",
            { className: "artistList" },
            React.createElement(
                "h3",
                { className: "emptyArtist" },
                "No Entries Yet"
            )
        );
    }

    var artistNodes = props.artists.map(function (artist) {
        return React.createElement(
            "div",
            { key: artist._id, className: "artist" },
            React.createElement(
                "h3",
                { className: "artistName" },
                "Name: ",
                artist.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "artistGenere" },
                "Genere: ",
                artist.genere,
                " "
            ),
            React.createElement("iframe", { className: "artistPage", src: artist.link })
        );
    });

    return React.createElement(
        "div",
        { className: "artistList" },
        artistNodes
    );
};
var loadAllArtistsFromServer = function loadAllArtistsFromServer() {
    sendAjax('GET', '/getAllArtists', null, function (data) {
        ReactDOM.render(React.createElement(ArtistList, { artists: data.artists }), document.querySelector("#all"));
    });
};

var AlbumList = function AlbumList(props) {
    if (props.albums.length === 0) {
        return React.createElement(
            "div",
            { className: "albumList" },
            React.createElement(
                "h3",
                { className: "emptyAlbum" },
                "No Entries Yet"
            )
        );
    }

    var albumNodes = props.albums.map(function (album) {
        var trackNodes = album.tracks.map(function (track) {
            return React.createElement(
                "div",
                { className: "track" },
                React.createElement(
                    "h3",
                    { className: "trackInd" },
                    track
                )
            );
        });

        var trackPrevNodes = album.trackPrevs.map(function (trackPrev) {
            return React.createElement(
                "div",
                { className: "prev" },
                React.createElement("audio", { controls: true, className: "trackPrev", src: trackPrev })
            );
        });

        return React.createElement(
            "div",
            { key: album._id, className: "album" },
            React.createElement(
                "h3",
                { className: "albumName" },
                "Name: ",
                album.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "albumArtist" },
                "Artist:",
                album.artist
            ),
            React.createElement("img", { className: "albumArt", src: album.art }),
            React.createElement(
                "h3",
                { className: "albumGenere" },
                "Genere: ",
                album.genere,
                " "
            ),
            React.createElement(
                "div",
                { className: "trackList" },
                trackNodes
            ),
            React.createElement(
                "div",
                { className: "prevList" },
                trackPrevNodes
            )
        );
    });

    return React.createElement(
        "div",
        { className: "albumList" },
        albumNodes
    );
};

var loadAllAlbumsFromServer = function loadAllAlbumsFromServer() {
    sendAjax('GET', '/getAllAlbums', null, function (data) {
        ReactDOM.render(React.createElement(AlbumList, { albums: data.albums }), document.querySelector("#all"));
    });
};

var createAllSong = function createAllSong(csrf) {
    ReactDOM.render(React.createElement(SongList, { songs: [] }), document.querySelector("#all"));
    loadAllSongsFromServer();
};

var createAllArtist = function createAllArtist(csrf) {
    ReactDOM.render(React.createElement(ArtistList, { artists: [] }), document.querySelector("#all"));
    loadAllArtistsFromServer();
};

var createAllAlbum = function createAllAlbum(csrf) {
    ReactDOM.render(React.createElement(AlbumList, { albums: [] }), document.querySelector("#all"));
    loadAllAlbumsFromServer();
};

var setup = function setup(csrf) {
    var allSongsButt = document.querySelector("#showSongs");
    var allArtistsButt = document.querySelector("#showArtists");
    var allAlbumsButt = document.querySelector("#showAlbums");

    allSongsButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllSong(csrf);

        return false;
    });

    allArtistsButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllArtist(csrf);

        return false;
    });

    allAlbumsButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllAlbum(csrf);

        return false;
    });
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#message").text(message);
};

var redirect = function redirect(response) {
    $("#message").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
