const searchInput = document.getElementById('nanta-search-input');
const display = document.getElementById('nanta-ui-display');

alert('yo');

// generally there should only be 3 calls updating these
// init and true/false setters
let searching = false;
let activeNoteName = '';
let updatingNote = false;
let creatingNote = false;
let searchKeyPressTimeout = null;

// https://stackoverflow.com/a/4929629/2710227
const dateNowYmd = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return `${yyyy}/${mm}/${dd}`;
}

// https://developer.chrome.com/docs/extensions/mv2/security/
const sanitizeInput = (input) => {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

searchInput.addEventListener('keyup', (e) => {
  if (searching || updatingNote) return;

  clearTimeout(searchKeyPressTimeout);

  searchKeyPressTimeout = setTimeout(() => {
    const searchTerm = e.target.value;

    display.innerHTML = ''; // empty
    display.classList.remove('has-results');
    activeNoteName = '';

    searching = true;

    chrome.runtime.sendMessage({
      searchTerm
    });
  }, 250);
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const msg = request;

  if (msg?.apiResponse) {
    const notes = JSON.parse(msg.apiResponse).notes;

    searching = false;
    display.classList.add('has-results');
    
    if (!notes.length) {
      display.innerHTML += `
        <div id="no-results-row" class="nanta-ui__search-result no-result">No results</div>
        <button type="button" id="create-note">Create note</button>
      `;

      const createNoteBtn = document.getElementById('create-note');

      createNoteBtn.addEventListener('click', () => {
        creatingNote = true;
        display.classList.add('creating');

        const activeSearchTerm = document.getElementById('nanta-search-input');

        chrome.runtime.sendMessage({
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
      display.innerHTML += `<div class="nanta-ui__search-result" id="${mostRecentNoteBodyId}">
        <span id="${mostRecentNoteBodyId}-span"></span>
        <button type="button">x</button>
      </div>`;
      const searchResultRow = document.getElementById(`${mostRecentNoteBodyId}-span`);
      searchResultRow.innerText = note.name;
    });

    // add event listeners
    document.querySelectorAll('.nanta-ui__search-result').forEach(searchResult => {
      searchResult.addEventListener('click', (el) => {
        const noteId = el.target.getAttribute('id');

        activeNoteName = el.target.innerText;
        
        chrome.runtime.sendMessage({
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

        chrome.runtime.sendMessage({
          updateNote: {
            noteName: activeNoteName,
            noteBody: sanitizeInput(e.target.value),
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
        display.innerHTML = '<p class="nanta-ui__new-entry">Entry created!</p>';
      }
    }, 250);
  }
});