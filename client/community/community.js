const handleComment = (e) => {
    e.preventDefault();
    console.log("in handlecomment");
    let postid = e.target.id;
    let inputId = postid.substr(0,33) + "I";
    $("#message").animate({width:'hide'}, 350);

    if($(`#${inputId}`).val() == ''){
        console.log("err")
        handleError("All fields are required");
        return false;
    }
    let body = $(`#${inputId}`).val();
    let ppId = postid.substr(0,25) + "pp";
    
    let parentPost =  $(`#${ppId}`).val();
    
    let csrf = $("#ccsrf").val();
    sendAjax('POST', $(`#${e.target.id}`).attr("action"), $(`#${e.target.id}`).serialize(), function() {
        console.log("suc");
        
    });

    loadComments(parentPost, csrf);
    return false;
};

const CommentList = function(props) {
    if(props.comments.length === 0){
        return (
            <div className="commentList">
                <h3 className="emptyComment">No Comments</h3>
            </div>
        );
    }

    const commentNodes = props.comments.map(function(comment) {
        return (
            <div key={comment._id} className="comment">
                <h3 className="commentUser">{comment.user} says: {comment.com}</h3>
                <h3 className="commentBody"> </h3>
            </div>
        );
    });

    return (
        <div className="commentList">
            {commentNodes}
        </div>
    );
}

const SongList = function(props) {
    if(props.songs.length === 0){
        return (
            <div className="songList">
                <h3 className="emptySong">No Entries Yet</h3>
            </div>
        );
    }
    const songNodes = props.songs.map(function(song) {
        let idString = `c${song._id}commentsform` ;
        let idString2 = `c${song._id}comments`;
        let idString3 = `c${song._id}commentsI`;
        let idString4 = `c${song._id}pp`
        idString = idString.replace(/\s+/g, '');
        return (
            <div key={song._id} className="song">
                <h3 className="songUser">Added by: {song.user}</h3>
                <h3 className="songName">Name: {song.name} </h3>
                <h3 className="songArtist">song: {song.artist} </h3>
                <h3 className="songType">Type: {song.type}</h3>
                <h3 className="songAlbum">Album: {song.album}</h3>
                <img className="songArt" src={song.art}/>
                <audio classname="songLink" controls src={song.link}/>
                <form id={idString} 
                onSubmit={handleComment} 
                name="commentForm"
                action="/makeComment"
                method="POST">
                    <input type="hidden" id={idString4} name="parentPost" value ={song._id}/>
                    <input class="commentI" id={idString3} type="text" name="comment" placeholder= "Add Comment"/>
                    <input type="hidden" id="ccsrf" name="_csrf" value={props.csrf}/>
                    <input id="commentSubmit" type="submit" value="Add Comment"/>
                </form>
                <div className="comments" id={idString2}>

                </div>
            </div>
        );
    });

    return (
        <div className="songList">
            {songNodes}
        </div>
    );
};

const loadAllSongsFromServer = (csrf) => {
    let songsA = [];
    sendAjax('GET', '/getAllSongs', null, (data) => {
        ReactDOM.render(
            <SongList songs={data.songs} csrf={csrf}/>, document.querySelector("#all")
        );
        songsA = data.songs;
        for(let i=0; i < songsA.length; i++)
            {
                loadComments(songsA[i]._id, csrf);
            }
    });
    
    
};

const loadComments = (parentP, csrf) => {
    console.log("in load comments");
    console.log(parentP);
    let idString = `c${parentP}comments` ;
    let d = {
        parentPost: parentP,
    }
    idString = idString.replace(/\s+/g, '');
    sendAjax('GET', '/getComments', {parentPost: parentP}, (data) => {
        ReactDOM.render(
            <CommentList comments={data.comments} csrf={csrf}/>, document.querySelector("#" + idString)
        );

    });
}

const ArtistList = function(props) {
    if(props.artists.length === 0){
        return (
            <div className="artistList">
                <h3 className="emptyArtist">No Entries Yet</h3>
            </div>
        );
    }

    const artistNodes = props.artists.map(function(artist) {
        let idString = `c${artist._id}commentsform` ;
        let idString2 = `c${artist._id}comments`;
        let idString3 = `c${artist._id}commentsI`;
        let idString4 = `c${artist._id}pp`
        return (
            <div key={artist._id} className="artist">
                <h3 className="artistUser">Added by: {artist.user}</h3>
                <h3 className="artistName">Name: {artist.name} </h3>
                <h3 className="artistGenere">Genere: {artist.genere} </h3>
                <iframe className="artistPage" src={artist.link}/>
                <form id={idString} 
                onSubmit={handleComment} 
                name="commentForm"
                action="/makeComment"
                method="POST">
                    <input type="hidden" id={idString4} name="parentPost" value ={artist._id}/>
                    <input class="commentI" id={idString3} type="text" name="comment" placeholder= "Add Comment"/>
                    <input type="hidden" id="ccsrf" name="_csrf" value={props.csrf}/>
                    <input id="commentSubmit" type="submit" value="Add Comment"/>
                </form>
                <div className="comments" id={idString2}>

                </div>
            </div>
        );
    });

    return (
        <div className="artistList">
            {artistNodes}
        </div>
    );
};
const loadAllArtistsFromServer = (csrf) => {
    let artistsA = [];
    sendAjax('GET', '/getAllArtists', null, (data) => {
        ReactDOM.render(
            <ArtistList artists={data.artists} csrf={csrf}/>, document.querySelector("#all")
        );
        artistsA = data.artists;
        for(let i=0; i < artistsA.length; i++)
            {
                loadComments(artistsA[i]._id, csrf);
            }
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
        let idString = `c${album._id}commentsform` ;
        let idString2 = `c${album._id}comments`;
        let idString3 = `c${album._id}commentsI`;
        let idString4 = `c${album._id}pp`
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
                <h3 className="albumUser">Added by: {album.user}</h3>
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
                <form id={idString} 
                onSubmit={handleComment} 
                name="commentForm"
                action="/makeComment"
                method="POST">
                    <input type="hidden" id={idString4} name="parentPost" value ={album._id}/>
                    <input class="commentI" id={idString3} type="text" name="comment" placeholder= "Add Comment"/>
                    <input type="hidden" id="ccsrf" name="_csrf" value={props.csrf}/>
                    <input id="commentSubmit" type="submit" value="Add Comment"/>
                </form>
                <div className="comments" id={idString2}>

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

const loadAllAlbumsFromServer = (csrf) => {
    let albumsA = [];
    sendAjax('GET', '/getAllAlbums', null, (data) => {
        ReactDOM.render(
            <AlbumList albums={data.albums} csrf={csrf}/>, document.querySelector("#all")
        );
        albumsA = data.albums;
        for(let i=0; i < albumsA.length; i++)
            {
                loadComments(albumsA[i]._id, csrf);
            }
    });
};

const createAllSong = (csrf) => {
    ReactDOM.render(<SongList songs={[]} csrf={csrf}/>, document.querySelector("#all"));
    loadAllSongsFromServer(csrf);
}

const createAllArtist = (csrf) => {
    ReactDOM.render(<ArtistList artists={[]} csrf={csrf}/>, document.querySelector("#all"));
    loadAllArtistsFromServer(csrf);
}

const createAllAlbum = (csrf) => {
    ReactDOM.render(<AlbumList albums={[]} />, document.querySelector("#all"));
    loadAllAlbumsFromServer(csrf);
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

   loadAllSongsFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});