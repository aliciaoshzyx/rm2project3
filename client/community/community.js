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
                <h3 className="songArtist">song: {song.artist} </h3>
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

const loadAllSongsFromServer = () => {
    sendAjax('GET', '/getAllSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} />, document.querySelector("#all")
        );
    });
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
const loadAllArtistsFromServer = () => {
    sendAjax('GET', '/getAllArtists', null, (data) => {
        ReactDOM.render(
            <ArtistList artists={data.artists} />, document.querySelector("#all")
        );
    });
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

const loadAllAlbumsFromServer = () => {
    sendAjax('GET', '/getAllAlbums', null, (data) => {
        ReactDOM.render(
            <AlbumList albums={data.albums} />, document.querySelector("#all")
        );
    });
};

const createAllSong = (csrf) => {
    ReactDOM.render(<SongList songs={[]} />, document.querySelector("#all"));
    loadAllSongsFromServer();
}

const createAllArtist = (csrf) => {
    ReactDOM.render(<ArtistList artists={[]} />, document.querySelector("#all"));
    loadAllArtistsFromServer();
}

const createAllAlbum = (csrf) => {
    ReactDOM.render(<AlbumList albums={[]} />, document.querySelector("#all"));
    loadAllAlbumsFromServer();
}

const setup = function(csrf) {
    const allSongsButt = document.querySelector("#showSongs");
    const allArtistsButt = document.querySelector("#showArtists");
    const allAlbumsButt = document.querySelector("#showAlbums");
   
    
    allSongsButt.addEventListener("click", (e) => {
        e.preventDefault();
        createAllSong(csrf);
        
        return false;
    })

    allArtistsButt.addEventListener("click", (e) => {
        e.preventDefault();
        createAllArtist(csrf);
        
        return false;
    })

    allAlbumsButt.addEventListener("click", (e) => {
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