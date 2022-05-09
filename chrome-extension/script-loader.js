var s = document.createElement('script');
s.src = chrome.extension.getURL('nanta-ui-logic.js');
(document.head||document.documentElement).appendChild(s);

// clean up call back
s.onload = function() {
  s.parentNode.removeChild(s);

  // send to background script
  // chrome.runtime.sendMessage({message: 'sent'});
};

// receive messages from chrome extension icon
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  console.log('message from icon');
  console.log(document.getElementById('nanta-ui'));
});

