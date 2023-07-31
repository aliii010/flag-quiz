window.onload = async function() {
  await getNextRandomFlag();
  removeElements();
};

function reloadPage() {
  location.reload();
}

// fetching json data (name, image and etc.) from the server side using getNextRandomFlag function in views.py
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch the next random flag!");
  }
  const data = await response.json();

  return data;
}

let prev_cell = null;
async function checkCell() {
  if (prev_cell !== null) {
    prev_cell.classList.remove('change-background_of_cell');
  }
  const current_flag_name = document.querySelector("img.flag-img").getAttribute("flag-name").toLowerCase();
  const cell = document.getElementById(current_flag_name);
  const selector = '#' + current_flag_name;
  const cell_flag_name = document.querySelector(selector).getAttribute("flag-name");

  if (current_flag_name == cell_flag_name) {
    cell.classList.add('change-background_of_cell');
  }
  prev_cell = cell;
}

const known_flags = new Set();
let shown_flags = [];

async function getNextRandomFlag() {
  // these three lines below is for not getting a flag that the user has already guessed correctly
  let data = await fetchJson("/get_next_random_flag/");
  while (known_flags.has(data.name) && known_flags.size < data.total_flag) {
    data = await fetchJson("/get_next_random_flag/");
  }

  shown_flags.push(data);

  const img_element = document.querySelector("img.flag-img");
  img_element.alt = data.name;
  img_element.src = data.image;
  img_element.setAttribute("flag-name", data.name);

  checkCell();

  return data;
}

function getPreviousFlag() {
  // by creating a "function property" (getPreviousFlag.previous_flag) we get the index of the before last element of the 'shown_flag' array.
  if (typeof getPreviousFlag.previous_flag === 'undefined') {
    getPreviousFlag.previous_flag = shown_flags.length - 2;
  }

  const previous_data = shown_flags[getPreviousFlag.previous_flag];
  getPreviousFlag.previous_flag--;

  const img_element = document.querySelector("img.flag-img");
  img_element.alt = previous_data.name;
  img_element.src = previous_data.image;
  img_element.setAttribute("flag-name", previous_data.name);

  checkCell();
}

// after clicking previous button, when the next button is clicked the index of the previous flag is changed back to before last element of the 'shown_flags' array.
document.getElementById("next-button").addEventListener('click', () => {
  getPreviousFlag.previous_flag = shown_flags.length - 1;
});


function removeElements() {
  document.getElementById("flag-image").style.display = "none";
  document.getElementById("user-input").style.display = "none";
  document.getElementById("next-button").style.display = "none";
  document.getElementById("previous-button").style.display = "none";
  document.getElementById("pause-button").style.display = "none";
  document.getElementById("terminated-message").style.display = "none";
  document.getElementById("play-again-button").style.display = "none";

  const current_flag_name = document.querySelector("img.flag-img").getAttribute("flag-name").toLowerCase();
  const cell = document.getElementById(current_flag_name);
  cell.classList.remove('change-background_of_cell');
}


function getElementsBack() {
  document.getElementById("flag-image").style.display = "block";
  document.getElementById("user-input").style.display = "flex";
  document.getElementById("next-button").style.display = "flex";
  document.getElementById("previous-button").style.display = "block";
  document.getElementById("pause-button").style.display = "flex";
  checkCell();
  document.getElementById("play-button").style.display = "none";
}


async function checkAnswer() {
  const user_answer = document.getElementById('user-input').value.toLowerCase();
  const current_flag_name = document.querySelector("img.flag-img").getAttribute("flag-name").toLowerCase();
  
  if (user_answer == current_flag_name) {
    document.getElementById('user-input').value = "";
    
    shown_flags.pop();
    
    if (!known_flags.has(current_flag_name)) {
      known_flags.add(current_flag_name);
    }     
    
    document.getElementById('score').textContent = known_flags.size + "/197";
    const selector = "." + current_flag_name;
    document.querySelector(selector).textContent = current_flag_name;

    let data = await getNextRandomFlag();

    if (known_flags.size === data.total_flag) {
      removeElements();
      clearInterval(countdown);
      document.getElementById("terminated-message").style.display = "block";
      document.getElementById("terminated-message").textContent = "You named all the flags, good job!";
      document.getElementById("play-again-button").style.display = "flex";
    }
  }
}