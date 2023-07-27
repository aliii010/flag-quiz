// fetching json data (name, image and etc.) from the server side using getNextRandomFlag function in views.py
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch the next random flag!");
  }
  const data = await response.json();

  return data;
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
  console.log(shown_flags);

  const img_element = document.querySelector("img");
  img_element.alt = data.name;
  img_element.src = data.image;
  img_element.setAttribute("flag-name", data.name);
  return data;
}

function getPreviousFlag() {
  // by creating a "function property" (getPreviousFlag.previous_flag) we get the index of the before last element of the 'shown_flag' array.
  if (typeof getPreviousFlag.previous_flag === 'undefined') {
    getPreviousFlag.previous_flag = shown_flags.length - 2;
  }

  const previous_data = shown_flags[getPreviousFlag.previous_flag];
  getPreviousFlag.previous_flag--;

  const img_element = document.querySelector("img");
  img_element.alt = previous_data.name;
  img_element.src = previous_data.image;
  img_element.setAttribute("flag-name", previous_data.name);
}

// after clicking previous button, when the next button is clicked the index of the previous flag is changed back to before last element of the 'shown_flags' array.
document.getElementById("next-button").addEventListener('click', () => {
  getPreviousFlag.previous_flag = shown_flags.length - 1;
  console.log(getPreviousFlag.previous_flag);
});

async function checkAnswer() {
  const user_answer = document.getElementById('user-input').value.toLowerCase();
  const flag_name = document.querySelector("img").getAttribute("flag-name").toLowerCase();
  
  if (user_answer == flag_name) {
    document.getElementById('user-input').value = "";
    
    shown_flags.pop();
    
    if (!known_flags.has(flag_name)) {
      known_flags.add(flag_name);
    }     
    
    document.getElementById('score').textContent = known_flags.size + "/197";

    let data = await getNextRandomFlag();

    if (known_flags.size === data.total_flag) {
      document.getElementById("flag-image").remove();
      document.getElementById("user-input").remove();
      document.getElementById("next-button").remove();
      document.getElementById("previous-button").remove();
      document.getElementById("terminated-message").textContent = "You knew all flag, good job!";
    }
  }
}

window.onload = async function() {
  const data = await getNextRandomFlag();
};