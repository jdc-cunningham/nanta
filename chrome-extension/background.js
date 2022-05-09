// chrome.runtime.onInstalled.addListener(() => {
//   window.addEventListener('message', (e) => {
//     console.log(e.data);
//   });
// });

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

/**
 * 
 * @param {Object} msg 
 */
const sendMessageToUi = (msg) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
      console.log(response);
    });  
  });
}

// https://stackoverflow.com/a/13819059/2710227
chrome.browserAction.onClicked.addListener((tab) => {
  sendMessageToUi({toggleUi: true});
});

// use this for notification, change ui
// the water droplet thing
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const msg = request.message;

  console.log(msg);

  if (msg?.searchTerm) {
    postAjax(`${API_BASE_URL}/search-notes`, msg, (response) => {
      console.log('api res');
      sendMessageToUi({apiResponse: response});
    });
  }

  if (msg?.noteId) {
    postAjax(`${API_BASE_URL}/get-note-body`, msg, (response) => {
      sendMessageToUi({apiResponse: response});
    });
  }

  callback('');
});