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
      pointer-events: none; /* allow cursor pass through for text select */
    }

    .nanta-ui.hidden {
      display: none;
    }

    .nanta-ui__container {
      background-color: white;
      padding: 1rem;
      pointer-events: all;
      max-width: 50vw;
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
      pointer-events: all;
    }

    #hide-nanta-ui span {
      transform: translateY(-2px);
    }

    .nanta-ui__display {
      max-height: 50vh;
      overflow-y: auto;
    }

    .nanta-ui__display.creating {
      opacity: 0.7;
      background-color: #dcdcdc;
      cursor: wait;
    }
    
    .nanta-ui__display.has-results {
      border-top: 1px solid #808080;
      margin-top: 1rem;
    }

    .nanta-ui__search-result {
      padding: 0.25rem 0.5rem;
      cursor: pointer;
    }

    .nanta-ui__search-result:hover:not(.no-result) {
      background-color: #dcdcdc;
    }

    .nanta-ui__active-note-body {
      min-width: 350px;
      min-height: 200px;
      margin-top: 1rem;
    }

    .nanta-ui__search-result.no-result {
      cursor: default;
    }

    .nanta-ui__active-note-body.saving {
      opacity: 0.7;
      background-color: #dcdcdc;
      cursor: wait;
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

// https://stackoverflow.com/a/4929629/2710227
const dateNowYmd = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return `${yyyy}/${mm}/${dd}`;
}

// generally there should only be 3 calls updating these
// init and true/false setters
let searching = false;
let activeNoteName = '';
let updatingNote = false;
let creatingNote = false;

window.onload = () => {
  document.body.insertAdjacentHTML('beforeend', html);

  const searchBox = document.getElementById('nanta-search-input');
  const xBtn = document.getElementById('hide-nanta-ui');
  let searchKeyPressTimeout = null;

  searchBox.addEventListener('keyup', (e) => {
    if (searching || updatingNote) return;

    clearTimeout(searchKeyPressTimeout);

    searchKeyPressTimeout = setTimeout(() => {
      const searchTerm = e.target.value;
      const display = document.getElementById('nanta-ui-display');

      display.innerHTML = ''; // empty
      display.classList.remove('has-results');
      activeNoteName = '';

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
  const display = document.getElementById('nanta-ui-display');

  if (msg?.apiResponse) {
    const notes = JSON.parse(msg.apiResponse).notes;

    searching = false;
    display.classList.add('has-results');
    
    if (!notes.length) {
      display.innerHTML += `
        <div class="nanta-ui__search-result no-result">No results</div>
        <button type="button" id="create-note">Create note</button>
      `;

      const createNoteBtn = document.getElementById('create-note');

      createNoteBtn.addEventListener('click', () => {
        creatingNote = true;
        display.classList.add('creating');

        const activeSearchTerm = document.getElementById('nanta-search-input');

        window.postMessage({
          updateNote: {
            noteName: activeSearchTerm.value,
            noteBody: `created ${dateNowYmd()}`,
          }
        })
      });
    }

    notes.forEach(note => {
      if (!note?.id) return;
      const mostRecentNoteBodyId = note["MAX(id)"];
      display.innerHTML += `<div class="nanta-ui__search-result" id="${mostRecentNoteBodyId}"></div>`;
      const searchResultRow = document.getElementById(mostRecentNoteBodyId);
      searchResultRow.innerText = note.name;
    });

    // add event listeners
    document.querySelectorAll('.nanta-ui__search-result').forEach(searchResult => {
      searchResult.addEventListener('click', (el) => {
        const noteId = el.target.getAttribute('id');

        activeNoteName = el.target.innerText;
        
        window.postMessage({
          getNoteBody: noteId
        });
      });
    });
  }

  if (msg?.apiNoteBodyResponse) {
    display.classList.remove('has-results');
    display.innerHTML = '';
    display.innerHTML = `<textarea id="active-note-body" class="nanta-ui__active-note-body"></textarea>`;
    const body = document.getElementById('active-note-body');
    body.value = JSON.parse(msg.apiNoteBodyResponse)[0].body; // ehh anti-XSS attempt

    let modifyTimeout = null;

    // add on update listener
    document.getElementById('active-note-body').addEventListener('keyup', (e) => {
      if (updatingNote) return;

      clearTimeout(modifyTimeout);

      modifyTimeout = setTimeout(() => {
        updatingNote = true;
        body.classList.add('saving');

        window.postMessage({
          updateNote: {
            noteName: activeNoteName,
            noteBody: e.target.value,
          }
        })
      }, 500);
    });
  }

  // callback for create/update
  if (msg?.apiNoteBodyUpdateResponse) {
    // artificial delay
    setTimeout(() => {
      if (updatingNote) {
        const body = document.getElementById('active-note-body');
        body.classList.remove('saving');
        updatingNote = false;
      }

      if (creatingNote) {
        display.classList.remove('creating');
        creatingNote = false;
      }
    }, 250);
  }
});