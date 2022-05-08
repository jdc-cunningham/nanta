'use strict';

const LOCAL_API_URL_BASE = 'http://192.168.1.144:5003'; 

chrome.runtime.onInstalled.addListener(() => {
  postRequest(
    `${LOCAL_API_URL_BASE}/get-note-body`,
    {"noteId": 23},
    (response) => { console.log(data) }
  );
});

// https://stackoverflow.com/a/56483313/2710227
const postRequest = (url, payload, callback) => {
  const req = new XMLHttpRequest();

  req.open("POST", url, true);
  req.setRequestHeader("Content-type", "application/json");
  req.send(payload);

  req.onreadystatechange = () => { // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("Got response 200!");
      callback(this.response);
    }
  }
}