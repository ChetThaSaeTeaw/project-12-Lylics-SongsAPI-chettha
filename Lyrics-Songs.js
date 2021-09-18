const form = document.getElementById('form');
const seach = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiUrl = "https://api.lyrics.ovh/";

form.addEventListener('submit', event => {
    event.preventDefault();
    const songtext = search.value.trim();

    if(!songtext) {
        alert('Please enter song or artist.');
    } else {
        searchLylics(songtext);
    }
});

async function  searchLylics(song){
     const res =  await fetch(`${apiUrl}/suggest/${song}`);
     const allSongs = await res.json();
     showData(allSongs);
}

function showData(songs){
    result.innerHTML = `
    <ul class="songs">
        ${songs.data.map(song=> 
            `<li><span>
                <strong>${song.artist.name}</strong> - ${song.title}
            </span>
            <button class="btn" 
                data-artist="${song.artist.name}"
                data-song="${song.title}"
            >Lylic</button>
            </li>`
        ).join("")}
    </ul>
    `;

    if(songs.next || songs.prev){
        more.innerHTML = `
        ${songs.prev ? `<button class="btn" onclick="getMoreSongs('${songs.prev}')">Previous</button>` : ""}
        ${songs.next ? `<button class="btn" onclick="getMoreSongs('${songs.next}')">Next</button>` : ""}
        `
    } else {
        more.innerHTML = "";
    }
}

async function getMoreSongs(songsUrl) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsUrl}`);
    const allsongs = await res.json();
    showData(allsongs);
}

result.addEventListener('click', event => {
    const clickEl = event.target;

    if(clickEl.tagName == 'BUTTON') {
        const artist = clickEl.getAttribute('data-artist');
        const songName = clickEl.getAttribute('data-song');
        getLyrics(artist,songName);

    }
});

async function getLyrics (artist,songName) {
    const res =  await fetch(`${apiUrl}/v1/${artist}/${songName}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"<br>");
    if(lyrics) {
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>${lyrics}</span>
        `;
    } else {
        result.innerHTML = `
        <h2><span>
            <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>No data found.</span>
        `;
    }

    more.innerHTML = "";
}