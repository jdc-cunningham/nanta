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

