"use strict";

var handleSong = function handleSong(e) {
    e.preventDefault();
    $("#message").animate({ width: 'hide' }, 350);

    if ($("#songName").val() == '') {
        handleError("All fields are required");
        return false;
    }
    var song = $("#songName").val();
    var artistNeeded = true;
    var artist = '';
    var type = '';
    var album = '';
    var art = '';
    var link = '';
    var url = '';
    if ($("#songArtist").val() == '') {

        url = "https://itunes.apple.com/search?term=" + song;
    } else {
        artist = $("#songArtist").val();
        url = "https://itunes.apple.com/search?term=" + song + "+" + artist;
    }
    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            type = result.results[0].kind;
            album = result.results[0].collectionName;
            if (artistNeeded) {
                artist = result.results[0].artistName;
            }
            art = result.results[0].artworkUrl100;
            link = result.results[0].previewUrl;
            song = result.results[0].trackName;
        }

    });

    $("#songName").val(song);
    $("#songArtist").val(artist);
    $("#songType").val(type);
    $("#songAlbum").val(album);
    $("#songArt").val(art);
    $("#songLink").val(link);
    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {

        loadSongsFromServer($("#csrfValue").val());
    });
    $("#songName").val('');
    $("#songArtist").val('');

    return false;
};

var handleArtist = function handleArtist(e) {
    e.preventDefault();
    $("#message").animate({ width: 'hide' }, 350);

    if ($("#artistName").val() == '') {
        handleError("All fields are required");
        return false;
    }
    var artist = $("#artistName").val();
    var genere = '';
    var link = '';
    var artId = '';

    var url = "https://itunes.apple.com/search?term=" + artist;
    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            artist = result.results[0].artistName;
            artId = result.results[0].artistId;
            link = result.results[0].artistViewUrl;
        }

    });
    url = "https://itunes.apple.com/lookup?id=" + artId;

    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            genere = result.results[0].primaryGenreName;
        }
    });

    $("#artistName").val(artist);
    $("#artistGenere").val(genere);
    $("#artistLink").val(link);
    sendAjax('POST', $("#artistForm").attr("action"), $("#artistForm").serialize(), function () {

        loadArtistsFromServer($("#csrfValue").val());
    });
    return false;
};

var handleAlbum = function handleAlbum(e) {
    e.preventDefault();
    $("#message").animate({ width: 'hide' }, 350);

    if ($("#albumName").val() == '') {
        handleError("All fields are required");
        return false;
    }
    var album = $("#albumName").val();
    var artistNeeded = true;
    var artist = $("#albumArtist").val();
    var genere = '';
    var art = '';
    var tracks = [];
    var trackPrevs = [];
    var albId = '';
    var url = '';
    if ($("#albumArtist").val() == '') {
        url = "https://itunes.apple.com/search?term=" + album;
    } else {
        url = "https://itunes.apple.com/search?term=" + album + "+" + artist;
    }

    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            album = result.results[0].collectionName;
            albId = result.results[0].collectionId;
            art = result.results[0].artworkUrl100;
            genere = result.results[0].primaryGenreName;
            if (artistNeeded) {
                artist = result.results[0].artistName;
            }
        }

    });
    url = "https://itunes.apple.com/lookup?id=" + albId + "&entity=song";

    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            for (var i = 0; i < result.resultCount; i++) {
                if (result.results[i].wrapperType == "track") {
                    tracks.push(result.results[i].trackName);
                    trackPrevs.push(result.results[i].previewUrl);
                }
            }
        }
    });
    $("#albumName").val(album);
    $("#albumArtist").val(artist);
    $("#albumGenere").val(genere);
    $("#albumArt").val(art);
    $("#albumTracks").val(JSON.stringify(tracks));
    $("#albumTrackPrev").val(JSON.stringify(trackPrevs));
    sendAjax('POST', $("#albumForm").attr("action"), $("#albumForm").serialize(), function () {

        loadAlbumsFromServer($("#csrfValue").val());
    });
    return false;
};

var handleDeleteSong = function handleDeleteSong(e) {
    e.preventDefault();

    $("#message").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});
    loadSongsFromServer($("#dcsrf").val());
    return false;
};

var handleDeleteArtist = function handleDeleteArtist(e) {
    e.preventDefault();

    $("#message").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});
    loadArtistsFromServer($("#dcsrf").val());
    return false;
};

var handleDeleteAlbum = function handleDeleteAlbum(e) {
    e.preventDefault();

    $("#message").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});
    loadAlbumsFromServer($("#dcsrf").val());
    return false;
};

var SongForm = function SongForm(props) {
    return React.createElement(
        "form",
        { id: "songForm",
            onSubmit: handleSong,
            name: "songForm",
            action: "/makerSong",
            method: "POST",
            className: "songForm"
        },
        React.createElement(
            "label",
            { htmlFor: "songName" },
            "Song: "
        ),
        React.createElement("input", { id: "songName", type: "text", name: "songName", placeholder: "Sugar" }),
        React.createElement(
            "label",
            { htmlFor: "songArtist" },
            "Artist: "
        ),
        React.createElement("input", { id: "songArtist", type: "text", name: "songArtist", placeholder: "Maroon 5" }),
        React.createElement("input", { id: "songType", type: "hidden", name: "songType", value: "" }),
        React.createElement("input", { id: "songAlbum", type: "hidden", name: "songAlbum", value: "" }),
        React.createElement("input", { id: "songArt", type: "hidden", name: "songArt", value: "" }),
        React.createElement("input", { id: "songLink", type: "hidden", name: "songLink", value: "" }),
        React.createElement("input", { type: "hidden", id: "csrfValue", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeSongSubmit", type: "submit", value: "Add song" })
    );
};

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
        var idString = song._id + "deleteSongForm";
        idString = idString.replace(/\s+/g, '');
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
                "Artist: ",
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
            React.createElement("audio", { classname: "songLink", controls: true, src: song.link }),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleDeleteSong,
                    name: "deleteSongForm",
                    action: "/deleteSong",
                    method: "POST" },
                React.createElement("input", { type: "hidden", name: "songID", value: song._id }),
                React.createElement("input", { type: "hidden", id: "dcsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "deleteSubmit", type: "submit", value: "Delete Song" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "songList" },
        songNodes
    );
};

var loadSongsFromServer = function loadSongsFromServer(csrf) {
    sendAjax('GET', '/getSongs', null, function (data) {
        ReactDOM.render(React.createElement(SongList, { songs: data.songs, csrf: csrf }), document.querySelector("#allT"));
    });
};

var ArtistForm = function ArtistForm(props) {
    return React.createElement(
        "form",
        { id: "artistForm",
            onSubmit: handleArtist,
            name: "artistForm",
            action: "/makerArtist",
            method: "POST",
            className: "artistForm"
        },
        React.createElement(
            "label",
            { htmlFor: "artistName" },
            "artist: "
        ),
        React.createElement("input", { id: "artistName", type: "text", name: "artistName", placeholder: "Maroon 5" }),
        React.createElement("input", { id: "artistGenere", type: "hidden", name: "artistGenere", value: "" }),
        React.createElement("input", { id: "artistLink", type: "hidden", name: "artistLink", value: "" }),
        React.createElement("input", { type: "hidden", id: "csrfValue", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeArtistSubmit", type: "submit", value: "Add artist" })
    );
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
        var idString = artist._id + "deleteArtistForm";
        idString = idString.replace(/\s+/g, '');
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
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleDeleteArtist,
                    name: "deleteArtistForm",
                    action: "/deleteArtist",
                    method: "POST" },
                React.createElement("input", { type: "hidden", name: "artistID", value: artist._id }),
                React.createElement("input", { type: "hidden", id: "dcsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "deleteSubmit", type: "submit", value: "Delete Artist" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "artistList" },
        artistNodes
    );
};

var loadArtistsFromServer = function loadArtistsFromServer(csrf) {
    sendAjax('GET', '/getArtists', null, function (data) {
        ReactDOM.render(React.createElement(ArtistList, { artists: data.artists, csrf: csrf }), document.querySelector("#allT"));
    });
};

var AlbumForm = function AlbumForm(props) {
    return React.createElement(
        "form",
        { id: "albumForm",
            onSubmit: handleAlbum,
            name: "albumForm",
            action: "/makerAlbum",
            method: "POST",
            className: "albumForm"
        },
        React.createElement(
            "label",
            { htmlFor: "albumName" },
            "Album: "
        ),
        React.createElement("input", { id: "albumName", type: "text", name: "albumName", placeholder: "V (Deluxe)" }),
        React.createElement(
            "label",
            { htmlFor: "albumArtist" },
            "Artist: "
        ),
        React.createElement("input", { id: "albumArtist", type: "text", name: "albumArtist", placeholder: "Maroon 5" }),
        React.createElement("input", { id: "albumGenere", type: "hidden", name: "albumGenere", value: "" }),
        React.createElement("input", { id: "albumTracks", type: "hidden", name: "albumTracks", value: "" }),
        React.createElement("input", { id: "albumTrackPrev", type: "hidden", name: "albumTrackPrev", value: "" }),
        React.createElement("input", { id: "albumArt", type: "hidden", name: "albumArt", value: "" }),
        React.createElement("input", { type: "hidden", id: "csrfValue", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeAlbumSubmit", type: "submit", value: "Add album" })
    );
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
        var idString = album._id + "deleteAlbumForm";
        idString = idString.replace(/\s+/g, '');
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
            ),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleDeleteAlbum,
                    name: "deleteAlbumForm",
                    action: "/deleteAlbum",
                    method: "POST" },
                React.createElement("input", { type: "hidden", name: "albumID", value: album._id }),
                React.createElement("input", { type: "hidden", id: "dcsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "deleteSubmit", type: "submit", value: "Delete Album" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "albumList" },
        albumNodes
    );
};

var loadAlbumsFromServer = function loadAlbumsFromServer(csrf) {
    sendAjax('GET', '/getAlbums', null, function (data) {
        ReactDOM.render(React.createElement(AlbumList, { albums: data.albums, csrf: csrf }), document.querySelector("#allT"));
    });
};

var createMakeSong = function createMakeSong(csrf) {
    ReactDOM.render(React.createElement(SongForm, { csrf: csrf }), document.querySelector("#make"));
};

var createMakeArtist = function createMakeArtist(csrf) {
    ReactDOM.render(React.createElement(ArtistForm, { csrf: csrf }), document.querySelector("#make"));
};

var createMakeAlbum = function createMakeAlbum(csrf) {
    ReactDOM.render(React.createElement(AlbumForm, { csrf: csrf }), document.querySelector("#make"));
};

var createAllSong = function createAllSong(csrf) {
    ReactDOM.render(React.createElement(SongList, { songs: [], csrf: csrf }), document.querySelector("#allT"));
    loadSongsFromServer(csrf);
};

var createAllArtist = function createAllArtist(csrf) {
    ReactDOM.render(React.createElement(ArtistList, { artists: [], csrf: csrf }), document.querySelector("#allT"));
    loadArtistsFromServer(csrf);
};

var createAllAlbum = function createAllAlbum(csrf) {
    ReactDOM.render(React.createElement(AlbumList, { albums: [], csrf: csrf }), document.querySelector("#allT"));
    loadAlbumsFromServer(csrf);
};

var setup = function setup(csrf) {
    var songButton = document.querySelector("#makeSong");
    var artistButton = document.querySelector("#makeArtist");
    var albumButton = document.querySelector("#makeAlbum");
    var allSongButt = document.querySelector("#showSong");
    var allArtistButt = document.querySelector("#showArtist");
    var allAlbumButt = document.querySelector("#showAlbum");

    songButton.addEventListener("click", function (e) {
        e.preventDefault();
        createMakeSong(csrf);
        return false;
    });

    artistButton.addEventListener("click", function (e) {
        e.preventDefault();
        createMakeArtist(csrf);
        return false;
    });

    albumButton.addEventListener("click", function (e) {
        e.preventDefault();
        createMakeAlbum(csrf);
        return false;
    });

    allSongButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllSong(csrf);

        return false;
    });

    allArtistButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllArtist(csrf);

        return false;
    });

    allAlbumButt.addEventListener("click", function (e) {
        e.preventDefault();
        createAllAlbum(csrf);

        return false;
    });

    loadSongsFromServer(csrf);
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
