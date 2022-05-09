const style = `
  <style>
    .nanta-ui {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99999 !important;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      flex-direction: column;
      padding: 2rem;
    }

    .nanta-ui.hidden {
      display: none;
    }

    .nanta-ui__container {
      background-color: white;
      padding: 1rem;
    }

    #hide-nanta-ui {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      font-size: 1.5rem;
      border-radius: 15px;
      border: 0;
      background-color: red;
      color: white;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 0.5rem;
    }

    #hide-nanta-ui span {
      transform: translateY(-2px);
    }

    .nanta-ui__display {
      max-height: 50vh;
      overflow-y: auto;
    }
  </style>
`;

const html = `
  ${style}
  <div id="nanta-ui" class="nanta-ui hidden">
    <button type="button" id="hide-nanta-ui">
      <span>
        x
      </span>
    </button>
    <div class="nanta-ui__container">
      <div class="nanta-ui__search">
        <input id="nanta-search-input" type="text" placeholder="search"/>
      </div>
      <div id="nanta-ui-display" class="nanta-ui__display"><div>
    </div>
  </div>
`;

let searching = false;

window.onload = () => {
  document.body.insertAdjacentHTML('beforeend', html);

  const searchBox = document.getElementById('nanta-search-input');
  const xBtn = document.getElementById('hide-nanta-ui');
  let searchKeyPressTimeout = null;

  searchBox.addEventListener('keyup', (e) => {
    if (searching) return;

    clearTimeout(searchKeyPressTimeout);

    searchKeyPressTimeout = setTimeout(() => {
      const searchTerm = e.target.value;
      const display = document.getElementById('nanta-ui-display');

      display.innerHTML = ''; // empty
      
      searching = true;

      window.postMessage({
        searchTerm
      });
    }, 250);
  });

  xBtn.addEventListener('click', () => {
    const ui = document.getElementById('nanta-ui');
    ui.classList.add('hidden');
  });
};

window.addEventListener('message', (e) => {
  const msg = e.data;

  if (msg?.apiResponse) {
    const display = document.getElementById('nanta-ui-display');

    JSON.parse(msg.apiResponse).notes.forEach(note => {
      if (!note?.id) return;
      display.innerHTML += `<div class="nanta-ui__search-result" id="${note.id}">${note.name}</div>`;
    });
  }

  searching = false;
});