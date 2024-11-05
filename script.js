import * as songDatabase from "./songDB.js";
const songDB = songDatabase.songDB;

document.addEventListener("DOMContentLoaded", ()=>{

    let song = new Audio();
    let currentSong = 0;
    let playing = false;

    const artistName = document.querySelector(".artist-name");
    const musicName = document.querySelector(".song-name");
    const fillBar = document.querySelector(".fill-bar");
    const time = document.querySelector(".time");
    const cover = document.getElementById("cover");
    const playBtn = document.getElementById("play");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const prog = document.querySelector(".progress-bar");
    const songList = document.getElementById("list");

    songDB.forEach((song) => {
        let song_li = document.createElement("li");
        song_li.textContent = song.name + " - " + song.artist;
        songList.appendChild(song_li);    
    });
    
    const songs = document.querySelectorAll("li");

    loadSong(currentSong);
    song.addEventListener("timeupdate", updateProgress);
    song.addEventListener("ended", nextSong);
    prevBtn.addEventListener("click", prevSong);
    nextBtn.addEventListener("click", nextSong);
    playBtn.addEventListener("click", togglePlayPause);
    prog.addEventListener("click", seek);

    songs.forEach((songItem) => {
        songItem.addEventListener("click", () =>{
            currentSong = getSongIndexFromName(songItem.innerText);
            playMusic();
        });
    });

    function loadSong(index){
        const { name, artist, src, cover: thumb } = songDB[index];
        artistName.innerText = artist;
        musicName.innerText = name;
        song.src = src;
        cover.style.backgroundImage = `url(${thumb})`;
    }

    function updateProgress(){
        if(song.duration){
            const pos = (song.currentTime / song.duration) * 100;
            fillBar.style.width = `${pos}%`;
            const duration = formatTime(song.duration);
            const currentTime = formatTime(song.currentTime);
            time.innerText = `${currentTime} - ${duration}`;
        }
    }

    function formatTime(seconds){
        const minutes = Math.floor(seconds/60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0': ''}${secs}`;
    }

    function togglePlayPause(){
        if(playing){
            song.pause();
        }else{
            song.play();
        }
        playing=!playing;
        playBtn.classList.toggle("fa-pause", playing);
        playBtn.classList.toggle("fa-play", !playing);
        cover.classList.toggle("active", playing);
    }

    function nextSong(){
        currentSong = (currentSong + 1) % songDB.length;
        playMusic();
    }

    function prevSong(){
        currentSong = (currentSong - 1 + songDB.length) % songDB.length;  
        playMusic();
    }

    function playMusic(){
        loadSong(currentSong);
        song.play();
        playing = true;
        playBtn.classList.add('fa-pause');
        playBtn.classList.remove('fa-play');
        cover.classList.add('active');
    }
    
    function seek(e){
        const pos = (e.offsetX / prog.clientWidth) * song.duration;
        song.currentTime = pos;
    }

    function getSongIndexFromName(nameOfSong){
        let index = -1
        for(let x=0; x<songDB.length; x++){
            const songTitleAndArtist = songDB[x].name + " - " + songDB[x].artist;
            if(songTitleAndArtist == nameOfSong)
                index=x;
        }
        return index;
    }
});

