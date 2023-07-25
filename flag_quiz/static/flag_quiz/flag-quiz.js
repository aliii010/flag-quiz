async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch the next random flag!");
  }
  const data = await response.json();

  return data;
}

const known_flags = new Set();

async function getNextRandomFlag() {
  let data = await fetchJson("/get_next_random_flag/");
  while (known_flags.has(data.name) && known_flags.size < data.total_flag) {
    data = await fetchJson("/get_next_random_flag/");
  }
  const img_element = document.querySelector("img");
  img_element.alt = data.name;
  img_element.src = data.image;
  img_element.setAttribute("flag-name", data.name);
  return data;
}

async function checkAnswer() {
  const user_answer = document.getElementById('user-input').value.toLowerCase();
  const flag_name = document.querySelector("img").getAttribute("flag-name").toLowerCase();
  
  if (user_answer == flag_name) {
    document.getElementById('user-input').value = "";

    if (!known_flags.has(flag_name)) {
      known_flags.add(flag_name);
    }     

    let data = await getNextRandomFlag();

    if (known_flags.size === data.total_flag) {
      document.getElementById("flag-image").remove();
      document.getElementById("user-input").remove();
      document.getElementById("next-button").remove();
      document.getElementById("terminated-message").textContent = "You knew all flag, good job!";
    }
  }
}