const handleSong = (e) => {
    e.preventDefault();
    console.log("in handlesong");
    $("#message").animate({width:'hide'}, 350);

    if($("#songName").val() == ''){
        handleError("All fields are required");
        return false;
    }
    let song = $("#songName").val();
    let artistNeeded = true;
    let artist = '';
    let type = '';
    let album = '';
    let art = '';
    let link = '';
    let url = '';
    console.log(song);
    if($("#songArtist").val() == ''){
        url = "https://itunes.apple.com/search?term=" + song;}else{
        url = "https://itunes.apple.com/search?term=" + song + "+" + artist;
    }

    $.ajax({ 
        url: url, 
        async: false,
        type: "GET",
        dataType: 'json',
        success:(result) => {
             type = result.results[0].kind;
             album = result.results[0].collectionName;
             if(artistNeeded){
               artist = result.results[0].artistName;
             } 
             art = result.results[0].artworkUrl100;
             link = result.results[0].previewUrl;
             song = result.results[0].trackName;
           }

           
       });
     
    
     console.log(song + " " + type + " " + album + " " + song + " " + art  + " " + link);
     $("#songName").val(song);
     $("#songArtist").val(artist);
     $("#songType").val(type);
     $("#songAlbum").val(album);
     $("#songArt").val(art);
     $("#songLink").val(link);
     console.log("serial " + $("#songForm").serialize());
     sendAjax('POST', $("#songForm").attr("action"), $("#songForm").serialize(), function() {
         
        loadSongsFromServer();
    });
    $("#songName").val('');
    $("#songArtist").val('');

    return false;
};

const handleArtist = (e) => {
    e.preventDefault();
    console.log("in handleartist");
    $("#message").animate({width:'hide'}, 350);

    if($("#artistName").val() == ''){
        handleError("All fields are required");
        return false;
    }
    let artist = $("#artistName").val();
    let genere ='';
    let link = '';
    let artId = '';

    let url = "https://itunes.apple.com/search?term=" + artist 
    $.ajax({ 
        url: url, 
        async: false,
        type: "GET",
        dataType: 'json',
        success:(result) => {
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
        success:(result) => {
             genere = result.results[0].primaryGenreName;
             console.log(result.results[0].primaryGenreName);
       }
    });

    console.log(genere);
     $("#artistName").val(artist);
     $("#artistGenere").val(genere);
     $("#artistLink").val(link);
     console.log("serial " + $("#artistForm").serialize());
     sendAjax('POST', $("#artistForm").attr("action"), $("#artistForm").serialize(), function() {
       
        loadArtistsFromServer();
    });
    return false;
};

const SongForm = (props) => {
    return (
        <form id="songForm"
            onSubmit={handleSong}
            name="songForm"
            action="/makerSong"
            method="POST"
            className="songForm"
        >
            <label htmlFor="songName">Song: </label>
            <input id="songName" type="text" name="songName" placeholder="Sugar"/>
            <label htmlFor="songArtist">Artist: </label>
            <input id="songArtist" type="text" name="songsong" placeholder="Maroon 5"/>
            <input id="songType" type="hidden" name="songType" value=''/>
            <input id="songAlbum" type="hidden" name="songAlbum" value=''/>
            <input id="songArt" type="hidden" name="songArt" value=''/>
            <input id="songLink" type="hidden" name="songLink" value=''/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeSongSubmit" type="submit" value="Add song" />
        </form>
    )
};

const SongList = function(props) {
    if(props.songs.length === 0){
        return (
            <div className="songList">
                <h3 className="emptySong">No Entries Yet</h3>
            </div>
        );
    }

    const songNodes = props.songs.map(function(song) {
        return (
            <div key={song._id} className="song">
                <h3 className="songName">Name: {song.name} </h3>
                <h3 className="songsong">song: {song.song} </h3>
                <h3 className="songType">Type: {song.type}</h3>
                <h3 className="songAlbum">Album: {song.album}</h3>
                <img className="songArt" src={song.art}/>
                <audio classname="songLink" controls src={song.link}/>
            </div>
        );
    });

    return (
        <div className="songList">
            {songNodes}
        </div>
    );
};

const loadSongsFromServer = () => {
    sendAjax('GET', '/getSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#songs")
        );
    });
};

const ArtistForm = (props) => {
    return (
        <form id="artistForm"
            onSubmit={handleArtist}
            name="artistForm"
            action="/makerArtist"
            method="POST"
            className="artistForm"
        >
            <label htmlFor="artistName">artist: </label>
            <input id="artistName" type="text" name="artistName" placeholder="Maroon 5"/>
            <input id="artistGenere" type="hidden" name="artistGenere" value=''/>
            <input id="artistLink" type="hidden" name="artistLink" value=''/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeArtistSubmit" type="submit" value="Add artist" />
        </form>
    )
};

const ArtistList = function(props) {
    if(props.artists.length === 0){
        return (
            <div className="artistList">
                <h3 className="emptyArtist">No Entries Yet</h3>
            </div>
        );
    }

    const artistNodes = props.artists.map(function(artist) {
        return (
            <div key={artist._id} className="artist">
                <h3 className="artistName">Name: {artist.name} </h3>
                <h3 className="artistGenere">Genere: {artist.genere} </h3>
                <iframe className="artistPage" src={artist.link}/>
                
            </div>
        );
    });

    return (
        <div className="artistList">
            {artistNodes}
        </div>
    );
};

const loadArtistsFromServer = () => {
    sendAjax('GET', '/getArtists', null, (data) => {
        ReactDOM.render(
            <ArtistList artists={data.artists} />, document.querySelector("#artists")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );
    ReactDOM.render(
        <ArtistForm csrf={csrf} />, document.querySelector("#makeArtist")
    );

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );

    ReactDOM.render(
        <ArtistList artists={[]} />, document.querySelector("#artists")
    );
    loadSongsFromServer();
    loadArtistsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});