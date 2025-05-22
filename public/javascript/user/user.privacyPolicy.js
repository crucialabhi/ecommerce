document.getElementById("header_search").style.display = 'none';

  async function fetchtandc() {
    document.getElementById("arrivingdata").innerHTML = "";
      const response = await fetch("/privacypolicy", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      let results = json.data;
      let tablebody = document.getElementById("arrivingdata");
      results.forEach((result) => {
        let div = document.createElement('div');
      div.classList.add("section")
        const row = `<div class="section">
    <h2>${result.title}</h2>
    <p>${result.content}</p>
  </div>`;
  div.innerHTML += row;
  tablebody.appendChild(div)
      });
    }
    fetchtandc()