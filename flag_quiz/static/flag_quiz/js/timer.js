let until;
let time_remaining;
let countdown;

document.getElementById('play-button').addEventListener('click', () => {
  until = new Date().getTime() + (18 * 60 + 2) * 1000;
  startTimer();
});


document.getElementById('resume-button').addEventListener('click', () => {
  until = new Date().getTime() + time_remaining;
  startTimer();

  getElementsBack();
  document.getElementById("resume-button").style.display = "none";
  document.getElementById('pause-icon').src = "/static/flag_quiz/images/pause.png";
});

document.getElementById('pause-button').addEventListener('click', () => {
  clearInterval(countdown);
  removeElements();
  document.getElementById("resume-button").style.display = "block";
  document.getElementById('pause-icon').src = "/static/flag_quiz/images/resume.png";
});


function startTimer() {
  countdown = setInterval(function() {
    const now = new Date().getTime();
    time_remaining = until - now;
    
    if (time_remaining <= 0) {
      clearInterval(countdown);
      document.getElementById('timer').innerHTML = "00:00";
      document.getElementById('timer').style.color = "#8f0000";
    } else {
      const minutes = Math.floor((time_remaining % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((time_remaining % (1000 * 60)) / 1000);
      
      seconds = (seconds < 10 ? '0' : "") + seconds
      document.getElementById('timer').innerHTML = minutes + ":" + seconds;
    }
  }, 1000);
}