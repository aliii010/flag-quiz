let until;
let time_remaining;
let countdown;

document.getElementById('play-button').addEventListener('click', () => {
  until = new Date().getTime() + (18 * 60 + 2) * 1000;
  startTimer();
});

const resumeContainer = document.getElementById('resume-container');

document.getElementById('resume-button').addEventListener('click', () => {
  until = new Date().getTime() + time_remaining;
  startTimer();
  resumeContainer.classList.add('hidden');
  resumeContainer.classList.remove('visible');
});

document.getElementById('pause-button').addEventListener('click', () => {
  clearInterval(countdown);
  resumeContainer.classList.add('visible');
  resumeContainer.classList.remove('hidden');

  const time_resumed = document.getElementById('timer').textContent;
  document.getElementById('resume-time-remaining').textContent = time_resumed + " REMAINING";
  const score_resumed = document.getElementById('score').textContent;
  document.getElementById('resume-score').textContent = score_resumed + " SCORE";
});


function startTimer() {
  countdown = setInterval(function() {
    const now = new Date().getTime();
    time_remaining = until - now;
    
    if (time_remaining <= 0) {
      clearInterval(countdown);
      document.getElementById('timer').innerHTML = "00:00";
      document.getElementById('timer').style.color = "#8f0000";

      removeElements();
      document.getElementById("terminated-message").style.display = "block";
      document.getElementById("terminated-message").textContent = "You named " + known_flags.size + " flags";
      document.getElementById("play-again-button").style.display = "flex";
    } else {
      const minutes = Math.floor((time_remaining % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((time_remaining % (1000 * 60)) / 1000);
      
      seconds = (seconds < 10 ? '0' : "") + seconds
      document.getElementById('timer').innerHTML = minutes + ":" + seconds;
    }
  }, 1000);
}