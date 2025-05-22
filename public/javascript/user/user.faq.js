document.getElementById("header_search").style.display = 'none';

  async function fetchfaqc() {
    document.getElementById("arrivingdata").innerHTML = "";
    const response = await fetch("/faq", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    let results = json.data;
    let tablebody = document.getElementById("arrivingdata");
    if (results.length == 0) {
      tablebody.innerText = "no faq available";
    }
    results.forEach((result) => {
      let div = document.createElement("div");
      div.classList.add("faq");
      const row = `<div class="faq-item">
                <div class="faq-question" onclick="toggleAnswer(this)">
                    <h2>${result.title}</h2>
                    <span class="toggle-icon">+</span>
                </div>
                <div class="faq-answer">
                    <p>${result.content}</p>
                </div>
            </div>`;
      div.innerHTML += row;
      tablebody.appendChild(div);
    });
  }
  fetchfaqc();

function toggleAnswer(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.toggle-icon');

    if (answer.style.display === "block") {
        answer.style.display = "none";
        icon.textContent = "+";
    } else {
        answer.style.display = "block";
        icon.textContent = "-";
    }
}