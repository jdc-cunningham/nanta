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
    }

    .nanta-ui.hidden {
      display: none;
    }
  </style>
`;

const html = `
  ${style}
  <div id="nanta-ui" class="nanta-ui hidden">
    <div class="nanta-ui__search">
      <input id="nanta-search-input" type="text" placeholder="search"/>
    </div>
    <div id="nanta-ui-display" class="nanta-ui__display"><div>
  </div>
`;

let searching = false;

window.onload = () => {
  document.body.insertAdjacentHTML('beforeend', html);

  const searchBox = document.getElementById('nanta-search-input');
  let searchKeyPressTimeout = null;

  searchBox.addEventListener('keyup', (e) => {
    if (searching) return;

    clearTimeout(searchKeyPressTimeout);

    searchKeyPressTimeout = setTimeout(() => {
      const searchTerm = e.target.value;
      
      searching = true;

      window.postMessage({
        searchTerm
      });
    }, 250);
  });
};

window.addEventListener('message', (e) => {
  const msg = e.data;

  if (msg?.apiResponse) {
    const display = document.getElementById('nanta-ui-display');

    JSON.parse(msg.apiResponse).notes.forEach(note => {
      display.innerHTML += `<div class="nanta-ui__search-result" id="${note.id}">${note.name}</div>`;
    });
  }

  setSearching = false;
});