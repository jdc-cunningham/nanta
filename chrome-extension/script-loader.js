var s = document.createElement('script');
s.src = chrome.extension.getURL('nanta-ui-logic.js');
(document.head||document.documentElement).appendChild(s);

// clean up call back
s.onload = function() {
  s.parentNode.removeChild(s);
};

window.addEventListener('message', (e) => {
  // check origin
  if (e.source !== window) return;

  const msg = e.data;

  if (msg?.searchTerm) {
    chrome.runtime.sendMessage({searchTerm: msg.searchTerm});
  }

  if (msg?.getNoteBody) {
    chrome.runtime.sendMessage({getNoteBody: msg.getNoteBody});
  }

  if (msg?.updateNote) {
    chrome.runtime.sendMessage({updateNote: msg.updateNote});
  }
});

// receive messages from chrome extension icon
// primary to hide/show the injected UI
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const msg = request;

  if (msg?.toggleUi) {
    const ui = document.getElementById('nanta-ui');

    if (ui.classList.contains('hidden')) {
      ui.classList.remove('hidden');
    } else {
      ui.classList.add('hidden');
    }
  }

  if (msg?.apiResponse) {
    window.postMessage({
      apiResponse: msg.apiResponse
    });
  }

  if (msg?.apiNoteBodyResponse) {
    window.postMessage({
      apiNoteBodyResponse: msg.apiNoteBodyResponse
    });
  }

  if (msg?.apiNoteBodyUpdateResponse) {
    window.postMessage({
      apiNoteBodyUpdateResponse: msg.apiNoteBodyUpdateResponse
    });
  }

  // have to call this to avoid error
  callback('ui ack');
});

