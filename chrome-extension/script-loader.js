const filesToInject = [
  {
    path: './nanta-ui/style.css',
    type: 'style'
  },
  {
    path: './nanta-ui/ui.js',
    type: 'script'
  },
  {
    path: './nanta-ui/logic.js',
    type: 'script'
  }
];

const injectFile = (path, type) => {
  var s = document.createElement(type);
  s.src = chrome.extension.getURL(path);
  (document.head||document.documentElement).appendChild(s);

  // clean up call back
  s.onload = function() {
    // s.parentNode.removeChild(s);

    // send to background script
    // chrome.runtime.sendMessage({message: 'sent'});
  };
}

filesToInject.forEach(file => {
  const { path, type } = file;
  injectFile(path, type);
});

// receive messages from chrome extension icon
chrome.runtime.onMessage.addListener((request, sender, callback) => {
  console.log('yes');
  console.log(request);
});

