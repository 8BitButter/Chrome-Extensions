const startButton = document.getElementById('start-button');
const timerDisplay = document.getElementById('timer-display');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
  chrome.storage.local.get(['timer'], (result) => {
    if (result.timer) {
      timerDisplay.textContent = formatTime(result.timer.time);
      if (result.timer.running) {
        startButton.textContent = 'Reset';
        minutesInput.disabled = true;
        secondsInput.disabled = true;
      } else {
        startButton.textContent = 'Start';
        minutesInput.disabled = false;
        secondsInput.disabled = false;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', updateDisplay);
setInterval(updateDisplay, 1000);

startButton.addEventListener('click', () => {
  chrome.storage.local.get(['timer'], (result) => {
    if (result.timer.running) {
      chrome.runtime.sendMessage({ action: "reset" }, updateDisplay);
    } else {
      const minutes = parseInt(minutesInput.value) || 0;
      const seconds = parseInt(secondsInput.value) || 0;
      const time = (minutes * 60) + seconds;
      if (isNaN(time) || time <= 0) {
        alert('Please enter a valid number of minutes and seconds.');
        return;
      }
      chrome.runtime.sendMessage({ action: "start", time: time }, updateDisplay);
    }
  });
});
