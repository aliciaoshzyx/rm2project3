const handleSong = (e) => {
    e.preventDefault();
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
    if($("#songArtist").val() == ''){
        
        url = "https://itunes.apple.com/search?term=" + song;}else{
        artist = $("#songArtist").val();
        url = "https://itunes.apple.com/search?term=" + song + "+" + artist;
    }
    console.log(url);
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
     
    
     $("#songName").val(song);
     $("#songArtist").val(artist);
     $("#songType").val(type);
     $("#songAlbum").val(album);
     $("#songArt").val(art);
     $("#songLink").val(link);
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

const handleAlbum = (e) => {
    e.preventDefault();
    console.log("in handlealbum");
    $("#message").animate({width:'hide'}, 350);

    if($("#albumName").val() == ''){
        handleError("All fields are required");
        return false;
    }
    let album = $("#albumName").val();
    let artistNeeded = true;
    let artist = $("#albumArtist").val();
    let genere ='';
    let art = '';
    let tracks = [];
    let trackPrevs = [];
    let albId = '';
    let url = '';
    if($("#albumArtist").val() == ''){
        url = "https://itunes.apple.com/search?term=" + album;}else{
        url = "https://itunes.apple.com/search?term=" + album + "+" + artist;
    }

    $.ajax({ 
        url: url, 
        async: false,
        type: "GET",
        dataType: 'json',
        success:(result) => {
             album = result.results[0].collectionName;
             albId = result.results[0].collectionId;
             art = result.results[0].artworkUrl100;
             genere = result.results[0].primaryGenreName;
             if(artistNeeded){
                artist = result.results[0].artistName;
              } 
           }

           
       });
    url = "https://itunes.apple.com/lookup?id=" + albId + "&entity=song";
    console.log(url);
       $.ajax({ 
        url: url, 
        async: false,
        type: "GET",
        dataType: 'json',
        success:(result) => {
            for(let i = 0; i < result.resultCount; i++){
                if(result.results[i].wrapperType == "track"){
                    tracks.push(result.results[i].trackName);
                    trackPrevs.push(result.results[i].previewUrl);
                    console.log(result.results[i].previewUrl);
                }
            }
       }
    });
    console.log(JSON.stringify(trackPrevs));
     $("#albumName").val(album);
     $("#albumArtist").val(artist);
     $("#albumGenere").val(genere);
     $("#albumArt").val(art);
     $("#albumTracks").val(JSON.stringify(tracks));
     $("#albumTrackPrev").val(JSON.stringify(trackPrevs));
     console.log("serial " + $("#albumForm").serialize());
     sendAjax('POST', $("#albumForm").attr("action"), $("#albumForm").serialize(), function() {
       
        loadAlbumsFromServer();
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
            <input id="songArtist" type="text" name="songArtist" placeholder="Maroon 5"/>
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
            <SongList songs={data.songs} />, document.querySelector("#allT")
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
            <ArtistList artists={data.artists} />, document.querySelector("#allT")
        );
    });
};

const AlbumForm = (props) => {
    return (
        <form id="albumForm"
            onSubmit={handleAlbum}
            name="albumForm"
            action="/makerAlbum"
            method="POST"
            className="albumForm"
        >
            <label htmlFor="albumName">Album: </label>
            <input id="albumName" type="text" name="albumName" placeholder="V (Deluxe)"/>
            <label htmlFor="albumArtist">Artist: </label>
            <input id="albumArtist" type="text" name="albumArtist" placeholder="Maroon 5"/>
            <input id="albumGenere" type="hidden" name="albumGenere" value=''/>
            <input id="albumTracks" type="hidden" name="albumTracks" value=""/>
            <input id="albumTrackPrev" type="hidden" name="albumTrackPrev" value=""/>
            <input id="albumArt" type="hidden" name="albumArt" value=''/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeAlbumSubmit" type="submit" value="Add album" />
        </form>
    )
};

const AlbumList = function(props) {
    if(props.albums.length === 0){
        return (
            <div className="albumList">
                <h3 className="emptyAlbum">No Entries Yet</h3>
            </div>
        );
    }



    const albumNodes = props.albums.map(function(album) {
        const trackNodes = album.tracks.map(function(track) {
            return (
                <div className="track">
                    <h3 className="trackInd">{track}</h3>
                </div>
            )
        });

        const trackPrevNodes = album.trackPrevs.map(function(trackPrev) {
            return (
                 <div className="prev">
                     <audio controls className="trackPrev" src ={trackPrev}/>
                </div>
            )
        })

        
        return (
            <div key={album._id} className="album">
                <h3 className="albumName">Name: {album.name} </h3>
                <h3 className="albumArtist">Artist:{album.artist}</h3>
                <img className="albumArt" src={album.art}/>
                <h3 className="albumGenere">Genere: {album.genere} </h3>
                
                <div className="trackList">
                    {trackNodes}
                </div>
                <div className="prevList">
                    {trackPrevNodes}
                </div>
                
            </div>
        );
    });

    return (
        <div className="albumList">
            {albumNodes}
        </div>
    );
};

const loadAlbumsFromServer = () => {
    sendAjax('GET', '/getAlbums', null, (data) => {
        ReactDOM.render(
            <AlbumList albums={data.albums} />, document.querySelector("#allT")
        );
    });
};

const createMakeSong = (csrf) => {
    ReactDOM.render(<SongForm csrf={csrf} />, document.querySelector("#make"));
}

const createMakeArtist = (csrf) => {
    ReactDOM.render(<ArtistForm csrf={csrf} />, document.querySelector("#make"));
}

const createMakeAlbum = (csrf) => {
    ReactDOM.render(<AlbumForm csrf={csrf} />, document.querySelector("#make"));
}

const createAllSong = (csrf) => {
    ReactDOM.render(<SongList songs={[]} />, document.querySelector("#allT"));
    loadSongsFromServer();
}

const createAllArtist = (csrf) => {
    ReactDOM.render(<ArtistList artists={[]} />, document.querySelector("#allT"));
    loadArtistsFromServer();
}

const createAllAlbum = (csrf) => {
    ReactDOM.render(<AlbumList albums={[]} />, document.querySelector("#allT"));
    loadAlbumsFromServer();
}

const setup = function(csrf) {
    const songButton = document.querySelector("#makeSong");
    const artistButton = document.querySelector("#makeArtist");
    const albumButton = document.querySelector("#makeAlbum");
    const allSongButt = document.querySelector("#showSong");
    const allArtistButt = document.querySelector("#showArtist");
    const allAlbumButt = document.querySelector("#showAlbum");
   
    songButton.addEventListener("click", (e) => {
        e.preventDefault();
        createMakeSong(csrf);
        return false;
    })

    artistButton.addEventListener("click", (e) => {
        e.preventDefault();
        createMakeArtist(csrf);
        return false;
    })

    albumButton.addEventListener("click", (e) => {
        e.preventDefault();
        createMakeAlbum(csrf);
        return false;
    })

    allSongButt.addEventListener("click", (e) => {
        e.preventDefault();
        createAllSong(csrf);
        
        return false;
    })

    allArtistButt.addEventListener("click", (e) => {
        e.preventDefault();
        createAllArtist(csrf);
        
        return false;
    })

    allAlbumButt.addEventListener("click", (e) => {
        e.preventDefault();
        createAllAlbum(csrf);
        
        return false;
    })
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});