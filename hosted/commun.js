"use strict";

var handleComment = function handleComment(e) {
    e.preventDefault();
    var postid = e.target.id;
    var inputId = postid.substr(0, 33) + "I";
    $("#message").animate({ width: 'hide' }, 350);

    if ($("#" + inputId).val() == '') {
        console.log("err");
        handleError("All fields are required");
        return false;
    }
    var body = $("#" + inputId).val();
    var ppId = postid.substr(0, 25) + "pp";

    var parentPost = $("#" + ppId).val();

    var csrf = $("#ccsrf").val();
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});

    loadComments(parentPost, csrf);
    return false;
};

var handleUpvote = function handleUpvote(e) {
    e.preventDefault();
    console.log("in handle upvote");
    console.log(e.target.id);
    $("#" + e.target.id + " :input").prop("readonly", true);
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {});
    if ($("#" + e.target.id).attr("action") == "/updateSongUpvotes") {
        loadAllSongsFromServer($("ccsrf").val());
    } else if ($("#" + e.target.id).attr("action") == '/updateAlbumUpvotes') {
        loadAllAlbumsFromServer($("ccsrf").val());
    } else if ($("#" + e.target.id).attr("action") == '/updateArtistUpvotes') {
        loadAllArtistsFromServer($("ccsrf").val());
    }
};
var CommentList = function CommentList(props) {
    if (props.comments.length === 0) {
        return React.createElement(
            "div",
            { className: "commentList" },
            React.createElement(
                "h3",
                { className: "emptyComment" },
                "No Comments"
            )
        );
    }

    var commentNodes = props.comments.map(function (comment) {
        return React.createElement(
            "div",
            { key: comment._id, className: "comment" },
            React.createElement(
                "h3",
                { className: "commentUser" },
                comment.user,
                " says: ",
                comment.com
            ),
            React.createElement(
                "h3",
                { className: "commentBody" },
                " "
            )
        );
    });

    return React.createElement(
        "div",
        { className: "commentList" },
        commentNodes
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
                "No Songs Yet"
            )
        );
    }
    var songNodes = props.songs.map(function (song) {
        var idString = "c" + song._id + "commentsform";
        var idString2 = "c" + song._id + "comments";
        var idString3 = "c" + song._id + "commentsI";
        var idString4 = "c" + song._id + "pp";
        var idString5 = "c" + song._id + "up";
        var idString6 = "c" + song._id + "ups";
        idString = idString.replace(/\s+/g, '');
        return React.createElement(
            "div",
            { key: song._id, className: "song" },
            React.createElement(
                "h3",
                { className: "songUser" },
                "Added by: ",
                song.user
            ),
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
            React.createElement("audio", { classname: "songLink", controls: true, src: song.link }),
            React.createElement(
                "h3",
                { className: "songUpvotes" },
                song.upvotes
            ),
            React.createElement(
                "form",
                { id: idString5,
                    onSubmit: handleUpvote,
                    name: "upvoteForm",
                    action: "/updateSongUpvotes",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString5, name: "songID", value: song._id }),
                React.createElement("input", { type: "hidden", id: idString6, name: "upvotes", value: song.upvotes }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "upvoteSubmit", type: "submit", value: "Upvote" })
            ),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleComment,
                    name: "commentForm",
                    action: "/makeComment",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString4, name: "parentPost", value: song._id }),
                React.createElement("input", { "class": "commentI", id: idString3, type: "text", name: "comment", placeholder: "Add Comment" }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "commentSubmit", type: "submit", value: "Add Comment" })
            ),
            React.createElement("div", { className: "comments", id: idString2 })
        );
    });

    return React.createElement(
        "div",
        { className: "songList" },
        songNodes
    );
};

var loadAllSongsFromServer = function loadAllSongsFromServer(csrf) {
    var songsA = [];
    sendAjax('GET', '/getAllSongs', null, function (data) {
        ReactDOM.render(React.createElement(SongList, { songs: data.songs, csrf: csrf }), document.querySelector("#all"));
        songsA = data.songs;
        for (var i = 0; i < songsA.length; i++) {
            loadComments(songsA[i]._id, csrf);
        }
    });
};

var loadComments = function loadComments(parentP, csrf) {
    var idString = "c" + parentP + "comments";
    var d = {
        parentPost: parentP
    };
    idString = idString.replace(/\s+/g, '');
    sendAjax('GET', '/getComments', { parentPost: parentP }, function (data) {
        ReactDOM.render(React.createElement(CommentList, { comments: data.comments, csrf: csrf }), document.querySelector("#" + idString));
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
                "No Artists Yet"
            )
        );
    }

    var artistNodes = props.artists.map(function (artist) {
        var idString = "c" + artist._id + "commentsform";
        var idString2 = "c" + artist._id + "comments";
        var idString3 = "c" + artist._id + "commentsI";
        var idString4 = "c" + artist._id + "pp";
        var idString5 = "c" + artist._id + "up";
        var idString6 = "c" + artist._id + "ups";
        return React.createElement(
            "div",
            { key: artist._id, className: "artist" },
            React.createElement(
                "h3",
                { className: "artistUser" },
                "Added by: ",
                artist.user
            ),
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
                "h3",
                { className: "artistUpvotes" },
                artist.upvotes
            ),
            React.createElement(
                "form",
                { id: idString5,
                    onSubmit: handleUpvote,
                    name: "upvoteForm",
                    action: "/updateArtistUpvotes",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString5, name: "artistID", value: artist._id }),
                React.createElement("input", { type: "hidden", id: idString6, name: "upvotes", value: artist.upvotes }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "upvoteSubmit", type: "submit", value: "Upvote" })
            ),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleComment,
                    name: "commentForm",
                    action: "/makeComment",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString4, name: "parentPost", value: artist._id }),
                React.createElement("input", { "class": "commentI", id: idString3, type: "text", name: "comment", placeholder: "Add Comment" }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "commentSubmit", type: "submit", value: "Add Comment" })
            ),
            React.createElement("div", { className: "comments", id: idString2 })
        );
    });

    return React.createElement(
        "div",
        { className: "artistList" },
        artistNodes
    );
};
var loadAllArtistsFromServer = function loadAllArtistsFromServer(csrf) {
    var artistsA = [];
    sendAjax('GET', '/getAllArtists', null, function (data) {
        ReactDOM.render(React.createElement(ArtistList, { artists: data.artists, csrf: csrf }), document.querySelector("#all"));
        artistsA = data.artists;
        for (var i = 0; i < artistsA.length; i++) {
            loadComments(artistsA[i]._id, csrf);
        }
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
                "No Albums Yet"
            )
        );
    }

    var albumNodes = props.albums.map(function (album) {
        var idString = "c" + album._id + "commentsform";
        var idString2 = "c" + album._id + "comments";
        var idString3 = "c" + album._id + "commentsI";
        var idString4 = "c" + album._id + "pp";
        var idString5 = "c" + album._id + "up";
        var idString6 = "c" + album._id + "ups";
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
                { className: "albumUser" },
                "Added by: ",
                album.user
            ),
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
                "h3",
                { classname: "albumUpvotes" },
                album.upvotes
            ),
            React.createElement(
                "form",
                { id: idString5,
                    onSubmit: handleUpvote,
                    name: "upvoteForm",
                    action: "/updateAlbumUpvotes",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString5, name: "albumID", value: album._id }),
                React.createElement("input", { type: "hidden", id: idString6, name: "upvotes", value: album.upvotes }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "upvoteSubmit", type: "submit", value: "Upvote" })
            ),
            React.createElement(
                "form",
                { id: idString,
                    onSubmit: handleComment,
                    name: "commentForm",
                    action: "/makeComment",
                    method: "POST" },
                React.createElement("input", { type: "hidden", id: idString4, name: "parentPost", value: album._id }),
                React.createElement("input", { "class": "commentI", id: idString3, type: "text", name: "comment", placeholder: "Add Comment" }),
                React.createElement("input", { type: "hidden", id: "ccsrf", name: "_csrf", value: props.csrf }),
                React.createElement("input", { id: "commentSubmit", type: "submit", value: "Add Comment" })
            ),
            React.createElement("div", { className: "comments", id: idString2 })
        );
    });

    return React.createElement(
        "div",
        { className: "albumList" },
        albumNodes
    );
};

var loadAllAlbumsFromServer = function loadAllAlbumsFromServer(csrf) {
    var albumsA = [];
    sendAjax('GET', '/getAllAlbums', null, function (data) {
        ReactDOM.render(React.createElement(AlbumList, { albums: data.albums, csrf: csrf }), document.querySelector("#all"));
        albumsA = data.albums;
        for (var i = 0; i < albumsA.length; i++) {
            loadComments(albumsA[i]._id, csrf);
        }
    });
};

var createAllSong = function createAllSong(csrf) {
    ReactDOM.render(React.createElement(SongList, { songs: [], csrf: csrf }), document.querySelector("#all"));
    loadAllSongsFromServer(csrf);
};

var createAllArtist = function createAllArtist(csrf) {
    ReactDOM.render(React.createElement(ArtistList, { artists: [], csrf: csrf }), document.querySelector("#all"));
    loadAllArtistsFromServer(csrf);
};

var createAllAlbum = function createAllAlbum(csrf) {
    ReactDOM.render(React.createElement(AlbumList, { albums: [] }), document.querySelector("#all"));
    loadAllAlbumsFromServer(csrf);
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

    loadAllSongsFromServer(csrf);
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
