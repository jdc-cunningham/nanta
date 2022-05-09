# refer
https://developer.chrome.com/docs/extensions/mv3/user_interface/

05/08/2022
Finally have some time to work on this. I really want this because all this time I've just been saving tabs but never looking at them again.

Also I have tabs I don't want to close because I want to write down that info somewhere.

4:52 PM
let's see if I can build this in two hours, the basic functionality is pretty simple.

I already have the API I'll use so I just have to post to that, hope I don't run into any problems.

I remember you have to deal with permissions/background JS, things like that for Chrome Extensions but it is possible.

<img src="./devlog-media/05-08-2022--basic-design.JPG" width="500"/>

Main hurdle is getting the API to work and it's a non-https local one.

At this time I have imported the unpacked chrome extension and I still have to build the UI/get it to show up.

GD it stop looking at memes

It puts the headphones on to focus or it gets the hose again

5:29 PM
Dang... already some problems, can't make the extension as I envisioned due to constraints (maximum size), that's alright.

Yeah there's some [tricks](https://stackoverflow.com/questions/66927030/is-there-a-way-to-change-the-position-location-of-a-chrome-extension-popup) around it but yeah.

Anyway need to make progress, this is not the main thing I want to work on today.

5:46 PM
I'm stuck, can't do this request, when the code is in there it breaks the page somehow with an "unexpected token" message starting at the `use strict;` line

5:53 PM
Seems to be some promise issue with fetch

6:02 PM
Damn I'm still failing

Dayum look at this [answer](https://stackoverflow.com/questions/9515704/use-a-content-script-to-access-the-page-context-variables-and-functions) lol "table of contents" haha that's legit

I have injected code before... sucks to go that route but why not. I'm interested in getting it done, this is a tool for me. I have injected code before eg. the YT hide tiles on load [work](https://github.com/jdc-cunningham/chrome-extension-code-injector) I did.

So I think I'll do something like the action tries to inject this code, if it's injected already just toggle it.

Yeah... I was trying to migrate to V3 like a good boy, but nah I want to get this done. This is a CRUD app I could crap out in 10 minutes but I'm stuck trying to figure out how to work around CE's security stuff which I'm not against, I just don't have the time/care to get into it right now.

6:31 PM
Okay I think I got it.

The mechanism will be:
- chrome extension icon will be clicked to show/hide the UI
- the UI is injected at the start
- the show/hide command is using `window.postMessage`

Unfortunately in 20 minutes I gotta stop/completely mind shift. Really want to make progress on the robot too but really want to prototype this. I'll do a max cap of another hour or two later on to get this to a working state.

Goal for TLR is plotting boxes in ThreeJS as the robot hits them.

Yeah dang will have to return to this in a bit.

10:33 PM
Alright back at it, I'm already feeling spent crap, I did just eat so maybe I gotta wait a little bit

procrastinating? omg literally me... also some police cars outside my apt man... keep thinking bullet gonna come outta nowhere and hit me.

Alright let's get that bread (there's no bread this is free)

Also my micro crypto trader is at 26% loss nice STONKS.

Ugh my fingers are oily damn it, anyway the postMessaging works pretty cool

Actually it's not, also the event fires from browserAction increment/keep increasing by 1 interesting

No it's fine I was just rebinding every time.

Still the two-way comms is not working as I thought it's posting to itself.

Okay so I'm not using postMessage I'm using chrome.runtime.onMessage for the injected to browser action (chrome extension icon) which I don't really need, I need the other one which is the chrome tabs.

[reference](https://stackoverflow.com/questions/25756807/calling-content-script-function-on-chrome-browseraction-onclicked)

[reference](https://stackoverflow.com/questions/14245334/sendmessage-from-extension-background-or-popup-to-content-script-doesnt-work)

Also it's not the injected code logic that's getting the ping from the chrome extension icon it's the loader (content script).

So I'll have to bridge that too.

Lol as they put "do not cross" tape lines across my parking lot, nice.

11:40 PM
Alright I'm done watching

I'm still trying to wrap my head around how to architect this thing based on what I have to work with.

