function buildMenu(options, currentOption, elementId, cb_select) {
  /*
   Construit un menu a partir d'une dictionnaire d'options, au format
   {
     key: {
       icon: "xxx.png",
       label: "Xxx"
     }
   }
  */
  function fillOption(key) {
    let containerHTML = ""
    if ("icon" in options[key])
      containerHTML += `<img id="currentIcon" src="images/${options[key].icon}" width="48" height="48">`;
    
    if ("label" in options[key])
      containerHTML += `<span class="ms-3" id="currentLabel">${options[key].label}</span>`;   
    
    return containerHTML
  }
  
  const container = document.getElementById(elementId)
  container.innerHTML = `
      <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown">
        ${fillOption(currentOption)}
      </button>
      <ul class="dropdown-menu bg-dark"></ul>`;
  
  const menu = container.querySelector(".dropdown-menu");
  for (let key in options) {
    let li = document.createElement("li");
    li.innerHTML = `<a class="dropdown-item text-light" href="#">
        ${fillOption(key)}
    </a>`

    li.querySelector(".dropdown-item")
      .addEventListener("click", () => {
        container.querySelector("button").innerHTML = fillOption(key)
        cb_select(key);
    });

    menu.appendChild(li);
  }
}


function showModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) {
    const modal = new bootstrap.Modal(el);
    modal.show();
    //console.log(modal)
  }
}

function hideModals() {
  document.querySelectorAll('.modal.show').forEach(modalEl => {
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal)
      modal.hide();
    });
}