const handleSong = (e) => {
    e.preventDefault();
    console.log("in handleSong");
    $("#message").animate({width:'hide'}, 350);

    if($("#songName").val() == ''){
        handleError("All fields are required");
        return false;
    }
    let song = $("#songName").val();
    let artist ='';
    let artistNeeded = true;
    let type = '';
    let album = '';
    let art = '';
    let link = '';
    let url = '';
    console.log(song);
    if($("#songArtist").val() == ''){
        artist =  $("#songArtist").val();
        artistNeeded = false;
        url = "https://itunes.apple.com/search?term=" + song + "+" + artist;}else{
        url = "https://itunes.apple.com/search?term=" + song;
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
     
    
     console.log(song + " " + type + " " + album + " " + artist + " " + art  + " " + link);
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
    return false;
};

const SongForm = (props) => {
    return (
        <form id="songForm"
            onSubmit={handleSong}
            name="songForm"
            action="/maker"
            method="POST"
            className="songForm"
        >
            <label htmlFor="songName">Song: </label>
            <input id="songName" type="text" name="songName" placeholder="Sugar"/>
            <label htmlFor="songArtist">Artist: </label>
            <input id="songArtist" type="text" name="songArtist" placeholder="Maroon 5"/>
            <input id="songType" type="hidden" name="songType" value=''/>
            <input id="songAlbum" type="hidden" name="songAlbum" value=''/>
            <input id="songArt" type="hidden" name="songArt" value=''/>
            <input id="songLink" type="hidden" name="songLink" value=''/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeSongSubmit" type="submit" value="Add Song" />
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
                <h3 className="songArtist">Artist: {song.artist} </h3>
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

const setup = function(csrf) {
    ReactDOM.render(
        <SongForm csrf={csrf} />, document.querySelector("#makeSong")
    );

    ReactDOM.render(
        <SongList songs={[]} />, document.querySelector("#songs")
    );
    loadSongsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});