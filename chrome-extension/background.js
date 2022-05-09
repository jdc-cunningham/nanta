// chrome.runtime.onInstalled.addListener(() => {
//   window.addEventListener('message', (e) => {
//     console.log(e.data);
//   });
// });

// https://stackoverflow.com/a/13819059/2710227
chrome.browserAction.onClicked.addListener((tab) => {
  console.log('click');

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
  });
});

// chrome.runtime.onMessage.addListener((request, sender, callback) => {
//   console.log(request);
// });