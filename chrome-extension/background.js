const API_BASE_URL = 'http://192.168.1.144:5003';

const postAjax = (url, data, success) => {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
          function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
      ).join('&');

  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}

chrome.runtime.onInstalled.addListener(() => {
  // run stuff on startup
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const msg = request;

  if (msg?.searchTerm) {
    postAjax(`${API_BASE_URL}/search-notes`, {noteQueryStr: msg.searchTerm}, (response) => {
      chrome.runtime.sendMessage({apiResponse: response});
    });
  }

  if (msg?.getNoteBody) {
    postAjax(`${API_BASE_URL}/get-note-body`, {noteId: msg.getNoteBody}, (response) => {
      chrome.runtime.sendMessage({apiNoteBodyResponse: response});
    });
  }

  if (msg?.updateNote) {
    const { noteName, noteBody } = msg.updateNote;

    postAjax(
      `${API_BASE_URL}/save-note`,
      {
        noteName,
        noteBody
      },
      (response) => {
        chrome.runtime.sendMessage({apiNoteBodyUpdateResponse: response});
      }
    );
  }

  if (msg?.deleteNote) {
    const { noteName } = msg.deleteNote;

    postAjax(
      `${API_BASE_URL}/delete-note`,
      {
        noteName
      },
      (response) => {
        chrome.runtime.sendMessage({apiNoteBodyUpdateResponse: response});
      }
    );
  }

  callback('bg ack');
});