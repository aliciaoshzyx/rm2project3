"use strict";

var handleSong = function handleSong(e) {
    e.preventDefault();
    console.log("in handlesong");
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
    console.log(song);
    if ($("#songArtist").val() == '') {
        url = "https://itunes.apple.com/search?term=" + song;
    } else {
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

    console.log(song + " " + type + " " + album + " " + song + " " + art + " " + link);
    $("#songName").val(song);
    $("#songArtist").val(artist);
    $("#songType").val(type);
    $("#songAlbum").val(album);
    $("#songArt").val(art);
    $("#songLink").val(link);
    console.log("serial " + $("#songForm").serialize());
    sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function () {

        loadSongsFromServer();
    });
    $("#songName").val('');
    $("#songArtist").val('');

    return false;
};

var handleArtist = function handleArtist(e) {
    e.preventDefault();
    console.log("in handleartist");
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
    console.log(url);
    $.ajax({
        url: url,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function success(result) {
            genere = result.results[0].primaryGenreName;
            console.log(result.results[0].primaryGenreName);
        }
    });

    console.log(genere);
    $("#artistName").val(artist);
    $("#artistGenere").val(genere);
    $("#artistLink").val(link);
    console.log("serial " + $("#artistForm").serialize());
    sendAjax('POST', $("#artistForm").attr("action"), $("#artistForm").serialize(), function () {

        loadArtistsFromServer();
    });
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
        React.createElement("input", { id: "songArtist", type: "text", name: "songsong", placeholder: "Maroon 5" }),
        React.createElement("input", { id: "songType", type: "hidden", name: "songType", value: "" }),
        React.createElement("input", { id: "songAlbum", type: "hidden", name: "songAlbum", value: "" }),
        React.createElement("input", { id: "songArt", type: "hidden", name: "songArt", value: "" }),
        React.createElement("input", { id: "songLink", type: "hidden", name: "songLink", value: "" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
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
                { className: "songsong" },
                "song: ",
                song.song,
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

var loadSongsFromServer = function loadSongsFromServer() {
    sendAjax('GET', '/getSongs', null, function (data) {
        ReactDOM.render(React.createElement(SongList, { songs: data.songs }), document.querySelector("#songs"));
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
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
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

var loadArtistsFromServer = function loadArtistsFromServer() {
    sendAjax('GET', '/getArtists', null, function (data) {
        ReactDOM.render(React.createElement(ArtistList, { artists: data.artists }), document.querySelector("#artists"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(SongForm, { csrf: csrf }), document.querySelector("#makeSong"));
    ReactDOM.render(React.createElement(ArtistForm, { csrf: csrf }), document.querySelector("#makeArtist"));

    ReactDOM.render(React.createElement(SongList, { songs: [] }), document.querySelector("#songs"));

    ReactDOM.render(React.createElement(ArtistList, { artists: [] }), document.querySelector("#artists"));
    loadSongsFromServer();
    loadArtistsFromServer();
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
