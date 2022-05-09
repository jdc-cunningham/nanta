<img src="./chrome-extension/icon128_dark.png"/>

### Security flaw
This is curently using `window.postMessage` as part of the comms layer and it is not secured/readable by any website. I need to come up with a fix for that.

### About
Primarily this is a basic Chrome extension interface that accepts a tag and body along with relevant tabs.

### Demo
<img src="./demo.gif"/>

### Background
I spend most of my time in front of a computer, particularly within reach/in Chrome. So I want to make a note taking Chrome extension app. This helps me jot down notes and close that tab, not really a RAM concern just wanting to keep track of anything I found interesting at the time.

I have made a couple but they're not really full fledged (no data store/requests). They're usually some kind of injector or they grab all the tabs I have so I can quickly save it in a notepad with a date. My intent is to track all the random things I'm thinking about. At a glance I can see my previous history of what I was looking into (these would be tagged topics). And I will have that "grab all tabs" feature as well and include it here.

I am still working on a centralized personal data store since I have other note taking methods that are using their own data stores.

### How it works
This is not the only way to do this but how I got it to work for what I need. See the diagram below.

<img src="./nanta-ce-comms.png"/>

These are primarily notes to myself if I want to make something like this again in the future.