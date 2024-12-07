// JavaScript to play the birthday song
function playSong() {
    const audio = document.getElementById('birthdaySong');
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
  