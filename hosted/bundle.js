"use strict";

var handleSong = function handleSong(e) {
    e.preventDefault();
    console.log("in handleSong");
    $("#message").animate({ width: 'hide' }, 350);

    if ($("#songName").val() == '') {
        handleError("All fields are required");
        return false;
    }
    var song = $("#songName").val();
    var artist = '';
    var artistNeeded = true;
    var type = '';
    var album = '';
    var art = '';
    var link = '';
    var url = '';
    console.log(song);
    if ($("#songArtist").val() == '') {
        artist = $("#songArtist").val();
        artistNeeded = false;
        url = "https://itunes.apple.com/search?term=" + song + "+" + artist;
    } else {
        url = "https://itunes.apple.com/search?term=" + song;
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

    console.log(song + " " + type + " " + album + " " + artist + " " + art + " " + link);
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
    return false;
};

var SongForm = function SongForm(props) {
    return React.createElement(
        "form",
        { id: "songForm",
            onSubmit: handleSong,
            name: "songForm",
            action: "/maker",
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
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeSongSubmit", type: "submit", value: "Add Song" })
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

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(SongForm, { csrf: csrf }), document.querySelector("#makeSong"));

    ReactDOM.render(React.createElement(SongList, { songs: [] }), document.querySelector("#songs"));
    loadSongsFromServer();
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
