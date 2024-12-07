function detectBlowSound() {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    microphone.connect(analyser);

    function analyzeSound() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Adjusted volume threshold for whisper sound
      if (volume > 20 && volume <= 50) { // Whisper-blown threshold
        const candles = document.querySelectorAll('.candle');
        candles.forEach((candle) => {
          extinguishCandle(candle);
        });

        // Check if all flames are gone
        const remainingFlames = document.querySelectorAll('.flame').length;
        if (remainingFlames === 0) {
          const wishMessage = document.getElementById('wishMessage');
          wishMessage.style.display = 'block';
          wishMessage.style.animation = 'fadeIn 1s forwards';
        }
      }

      requestAnimationFrame(analyzeSound);
    }

    analyzeSound();
  }).catch((err) => {
    console.error('Microphone access denied:', err);
  });
}

// Extinguish a candle (fade-out flame)
function extinguishCandle(candle) {
  const flame = candle.querySelector('.flame');
  if (flame) {
    flame.style.animation = 'fadeOut 1s forwards';
    setTimeout(() => {
      flame.style.display = 'none';
    }, 1000); // Matches fade-out animation duration
  }
}

// Add fade-out and fade-in animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .flame {
    animation: fadeIn 1s forwards;
  }
`;
document.head.appendChild(style);

// Start detecting sound
detectBlowSound();
