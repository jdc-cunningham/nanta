// https://stackoverflow.com/a/13819059/2710227
chrome.browserAction.onClicked.addListener((tab) => {
  console.log('click');
});