# Use Cases - Metalmouth Controls #

For quality assurance, starting from the soon to be release version 1.8.0 of the metalmouth extension, all of the following basic use cases must be able to be completed without issue (on Windows and Mac) before a new version of the metalmouth extension can be considered to be acceptable for public release.   This document is incomplete and will be added to shortly, and updated over time.


---

## A1) Installation of packaged metalmouth extension ##

### A1.1) Installation from Project metalmouth website ###

Precondition(s):
  1. Chrome browser installed.

Action(s):
  1. Download / install extension from Project metalmouth website (http://code.google.com/p/metalmouth/downloads/list).

Expected outcome(s):
  1. Extension is listed in chrome://extensions.
  1. metalmouth icon button is added into toolbar.  The icon shows a closed mouth.

### A1.2) Installation from Chrome Web Store ###

Precondition(s):
  1. Chrome browser installed.

Action(s):
  1. Download / install extension from Project metalmouth page on Chrome Web Store (https://chrome.google.com/webstore/detail/bmogbhmnbehfapbmjlaoflagfobahfli).

Expected outcome(s):
  1. Extension is listed in chrome://extensions/.
  1. metalmouth icon button is added into toolbar.  The icon shows a closed mouth.


---

## A2) Turning metalmouth extension on and off ##

### A2.1) Just after Chrome has started ###

#### A2.1.1) Omnibox method - Turning On ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser just been started - with single tab showing the home page or new tab page.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned off.
  1. Chrome's omnibox has focus (to be certain use shortcut to focus the omnibox. Windows / Linux: Ctrl+L or Mac: ⌘-L).

Action(s):
  1. Press the 'm' key twice.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension on".
  1. metalmouth extension button icon should change from having a closed mouth to an open mouth.
  1. The tab is refreshed - metalmouth scripts should be injected automatically, and all items should start to be read out.

#### A2.1.2) Omnibox method - Turning Off ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser just been started - with single tab showing the home page or new tab page.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned on.
  1. Chrome's omnibox has focus (to be certain use shortcut to focus the omnibox. Windows / Linux: Ctrl+L or Mac: ⌘-L).

Action(s):
  1. Press the 'm' key twice.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension off".
  1. metalmouth extension button icon should change from having an open mouth to a closed mouth.

#### A2.1.3) Metalmouth button method - Turning On ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser just been started - with single tab showing the home page or new tab page.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned off.

Action(s):
  1. Click the metalmouth icon button in the toolbar.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension on".
  1. metalmouth extension button icon should change from having a closed mouth to an open mouth.
  1. The tab is refreshed - metalmouth scripts should be injected automatically, and all items should start to be read out.

#### A2.1.4) Metalmouth button method - Turning Off ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser just been started - with single tab showing the home page or new tab page.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned on.

Action(s):
  1. Click the metalmouth icon button in the toolbar.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension off".
  1. metalmouth extension button icon should change from having an open mouth to a closed mouth.

### A2.2) Chrome showing several tabs ###

#### A2.2.1) Omnibox method - Turning On ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser started - several tabs exist.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned off.
  1. Chrome's omnibox has focus (to be certain use shortcut to focus the omnibox. Windows / Linux: Ctrl+L or Mac: ⌘-L).

Action(s):
  1. Press the 'm' key twice.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension on".
  1. metalmouth extension button icon should change from having a closed mouth to an open mouth.
  1. The tab is refreshed - metalmouth scripts should be injected automatically, and all items should start to be read out.

#### A2.2.2) Omnibox method - Turning Off ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser started - several tabs exist.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned on.
  1. Chrome's omnibox has focus (to be certain use shortcut to focus the omnibox. Windows / Linux: Ctrl+L or Mac: ⌘-L).

Action(s):
  1. Press the 'm' key twice.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension off".
  1. All open tab pages are refreshed.
  1. metalmouth extension button icon should change from having an open mouth to a closed mouth.

#### A2.2.3) Metalmouth button method - Turning On ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser started - several tabs exist.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned off.

Action(s):
  1. Click the metalmouth icon button in the toolbar.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension on".
  1. metalmouth extension button icon should change from having a closed mouth to an open mouth.
  1. The tab is refreshed - metalmouth scripts should be injected automatically, and all items should start to be read out.

#### A2.2.4) Metalmouth button method - Turning Off ####

Precondition(s):
  1. Chrome browser installed.
  1. Chrome browser started - several tabs exist.
  1. metalmouth extension is installed.
  1. metalmouth extension is turned on.

Action(s):
  1. Click the metalmouth icon button in the toolbar.

Expected outcome(s):
  1. metalmouth extension should start with the words "metalmouth extension off".
  1. All open tab pages are refreshed.
  1. metalmouth extension button icon should change from having an open mouth to a closed mouth.


---

## A3) Tab-level interaction ##

Window shortcuts - http://www.google.com/support/chrome/bin/static.py?page=guide.cs&guide=25799&topic=28650
Mac shortcuts - http://www.google.com/support/chrome/bin/static.py?page=guide.cs&guide=25799&topic=28651&

### A3.1) Create new tab ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.

Action(s):
  1. Create a new tab using Chrome shortcuts (Windows / Linux: Ctrl+T or Mac: ⌘-T).

Expected outcome(s):
  1. New tab is create.
  1. Focus changes to new tab.
  1. metalmouth should say "Opening new tab". Re-directs to Google Accessible Search if no home page has been selected in Chrome or no newTabPage has been selected in metalmouth options.

### A3.2) Close current tab ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.

Action(s):
  1. Close the current tab (selected) using Chrome shortcuts (Windows / Linux: Ctrl+W or Mac: ⌘-W).

Expected outcome(s):
  1. Current tab is closed.
  1. Focus changes to an open tab.
  1. metalmouth should say "Closing tab moving focus to tab showing (url)".

### A3.3) Cycle to another open tab which has had metalmouth scripts injected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. two tabs exist which have metalmouth scripts injected.
  1. One of these tabs is the current tab (selected).

Action(s):
  1. Cycle from the current tab (selected) to the second tab using Chrome shortcuts (Windows / Linux: Ctrl+Tab or Mac: Ctrl-Tab).

Expected outcome(s):
  1. Focus changes to another open tab.
  1. metalmouth should say "Moving focus to tab showing (url)".

### A3.4) Cycle to another open tab which has not had metalmouth scripts injected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. Two tabs exist, only one of which has metalmouth scripts injected.
  1. The tab which has metalmouth scripts injected is the current tab (selected).
Action(s):
  1. Cycle from the current tab (selected) to second tab using Chrome shortcuts (Windows / Linux: Ctrl+Tab or Mac: Ctrl-Tab).

Expected outcome(s):
  1. Focus changes to another open tab.
  1. metalmouth should say "Moving focus to tab showing (url)".
  1. metalmouth scripts should be injected automatically, and all items should start to be read out.

### A3.5) Cycle to another open tab which is a new tab page ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. Two tabs exist, only one of which has metalmouth scripts injected.  The other is a new tab page.
  1. The tab which has metalmouth scripts injected is the current tab (selected).
Action(s):
  1. Cycle from the current tab (selected) to second tab using Chrome shortcuts (Windows / Linux: Ctrl+Tab or Mac: Ctrl-Tab).

Expected outcome(s):
  1. Focus changes to another open tab.
  1. metalmouth should say "Moving focus to tab showing (url)".  Should be Google Accessible Search.
  1. metalmouth scripts should be injected automatically, and all items should start to be read out.


---

## A4) metalmouth menu bar ##

### A4.1) Opening metalmouth menu bar on page load ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has read out page title, but not started to read all.

Action(s):
  1. Press tab.

Expected outcome(s):
  1. metalmouth has stopped reading all items.
  1. metalmouth "Top menu" is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

### A4.2) Closing metalmouth menu bar on page load ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has read out page title, but not started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press esc.

Expected outcome(s):
  1. metalmouth "Top menu" is invisible.
  1. metalmouth should say "Top menu closed".
  1. metalmouth should say "Navigation mode entered".
  1. normal navigation should be possible.

### A4.3) Open metalmouth menu bar ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.

Action(s):
  1. Press tab.

Expected outcome(s):
  1. metalmouth has stopped reading all items.
  1. metalmouth "Top menu" is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

### A4.4) Close metalmouth menu bar using esc ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press esc.

Expected outcome(s):
  1. metalmouth "Top menu" is invisible.
  1. metalmouth should say "Top menu closed".
  1. metalmouth should say "Navigation mode entered".
  1. normal navigation should be possible.

### A4.5) Close metalmouth menu bar using close button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press down arrow until "close menu" button is focused.
  1. Press enter.

Expected outcome(s):
  1. metalmouth "Top menu" is invisible.
  1. metalmouth should say "Top menu closed".
  1. metalmouth should say "Navigation mode entered".
  1. normal navigation should be possible.

### A4.6) Using keys other than up, down, esc or enter have no effect ###

  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press tab.

Expected outcome(s):
  1. nothing should happen.

### A4.7) Using up and down ###

  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Use the up and down keys to cycle through all options a number of times.

Expected outcome(s):
  1. The up and down keys move focus in an expected way - no buttons are being skipped over.

### A4.8) Open change location menu ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth "Top menu" is invisible.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Previous url button has focus".

### A4.9) Open metalmouth options ###

  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.

Action(s):
  1. Press tab until "options" button is focused.
  1. Press enter.

Expected outcome(s):
  1. metalmouth "Top menu" is invisible.
  1. Current tab should be re-directed to options page.
  1. metalmouth should say "metalmouth voice browser options".
  1. metalmouth should say "Reading all items".


---

## A5) Change location menu ##

### A5.1) Open new url menu ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".

Action(s):
  1. Press tab until "change url" button is focused.
  1. Press enter.

Expected outcome(s):
  1. The change location menu should be invisible.
  1. The new url menu should be open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

### A5.2) Open new tab menu ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".

Action(s):
  1. Press enter when the new tab button is focused.

Expected outcome(s):
  1. The change location menu should be invisible.
  1. The new tab menu should be open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

### A5.3) Back button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. The change location menu should be invisible.
  1. The tab should load the previous url visited.

### A5.4) Close change location menu bar using esc ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".

Action(s):
  1. Press esc.

Expected outcome(s):
  1. metalmouth change location bar should be invisible.
  1. metalmouth should say "Navigation mode entered".

### A5.5) Close change location menu bar using close button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".

Action(s):
  1. Press tab until "close menu" button is focused.
  1. Press enter.

Expected outcome(s):
  1. metalmouth change location bar should be invisible.
  1. metalmouth should say "Navigation mode entered".


---


## A6) Change url menu ##

### A6.1) Add characters to url text input box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the url text input box.

### A6.2) Remove characters from url text input box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the url text input box.

### A6.3) Enter url ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

Action(s):
  1. Enter a url in the text entry box.
  1. Press tab to focus the enter button.
  1. Press enter.

Expected outcome(s):
  1. The "Change url" menu should be invisible.
  1. A current tab should load the contents of the url specified.

### A6.4) Close change url menu using esc ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press esc.

Expected outcome(s):
  1. The "Change url" menu should be invisible.
  1. metalmouth should say "Navigation mode entered".

### A6.5) Close change url menu using close button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening change url menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press tab until the "close menu" button has focus.
  1. Press enter.

Expected outcome(s):
  1. The "Change url" menu should be invisible.
  1. metalmouth should say "Navigation mode entered".


---


## A7) New tab menu ##

### A7.1) Add characters to url text input box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "New tab" button has been focused and enter pressed.
  1. The "new tab" menu is open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the url text input box.

### A7.2) Remove characters from url text input box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "New tab" button has been focused and enter pressed.
  1. The "new tab" menu is open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the url text input box.

### A7.3) Enter url ###

  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "New tab" button has been focused and enter pressed.
  1. The "new tab" menu is open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

Action(s):
  1. Enter a url in the text entry box.
  1. Press tab to focus the enter button.
  1. Press enter.

Expected outcome(s):
  1. The "new tab" menu should be invisible.
  1. A new tab should open, come into focus and then load the contents of the url specified.

### A7.4) Close change url menu using esc ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "New tab" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press esc.

Expected outcome(s):
  1. The "New" menu should be invisible.
  1. metalmouth should say "Navigation mode entered".

### A7.5) Close change url menu using close button ###

  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Tab has been pressed.
  1. metalmouth has stopped reading all items.
  1. metalmouth top menu is visible.
  1. metalmouth should say "Top menu entered".
  1. metalmouth should say "Change location button" has focus.
  1. Enter has been pressed.
  1. "Change location menu" is visible.
  1. metalmouth should say "Change location menu entered".
  1. metalmouth should say "Back button has focus".
  1. "Change url" button has been focused and enter pressed.
  1. The "change url" menu is open, with metalmouth saying "opening new tab menu".
  1. Focus should be on url text input box.

Action(s):
  1. Press tab until the "close menu" button has focus.
  1. Press enter.

Expected outcome(s):
  1. The "New tab" menu should be invisible.
  1. metalmouth should say "Navigation mode entered".

---


## A8) metalmouth options ##

### A8.1) New tab url option ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".

Action(s):
  1. Press down arrow until "New tab url" text input box has focus.
  1. Press enter to interact with the "New tab url" text input box.
  1. The text input interaction area is now visible.
  1. The text input area is focused.
  1. Type in "http://www.google.co.uk".
  1. Press tab until the "enter" button is focused.
  1. Press enter.

Expected outcome(s):
  1. The text input interaction area is invisible.
  1. "http://www.google.co.uk" has appeared in the "new tab url" text input box.

### A8.2) Speech Rate Option ###

#### A8.2.1) Available on Windows ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. The speech rate range input box is available.

Action(s):
  1. Press down arrow until "Speech rate" range input box has focus.

Expected outcome(s):
  1. metalmouth should say "speech rate range input current value 0.9".

#### A8.2.2) Not available on Mac ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".

Action(s):
  1. Use in-tab navigation to move down to "speech rate" option.

Expected outcome(s):
  1. metalmouth should say "Option disabled etc...".

#### A8.2.3) Selecting ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".

Action(s):
  1. Press down arrow until "Speech rate" range input box has focus.
  1. Press enter to interact with the "Speech rate" range input box.
  1. The range input interaction area is now visible.
  1. metalmouth should say "increase value button has focus".
  1. Press enter.
  1. metalmouth should say "Value to enter increased to 1.1".
  1. Press down arrow until "Enter button" has focus.
  1. Press enter.

Expected outcome(s):
  1. The range input interaction area is now invisible.
  1. metalmouth should say "range input menu closed".
  1. metalmouth should say "navigation mode entered".
  1. The value of the speech rate range input is increased to 1.1.

### A8.3) Always-On Option ###

#### A8.3.1) Selecting ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. "Always-on" option is not selected.

Action(s):
  1. Use in-tab navigation to move down to "Always-on" checkbox.
  1. Press enter to interact with the "Always-on" checkbox.
  1. The checkbox input interaction area is now visible.
  1. Focus the check button and press enter.

Expected outcome(s):
  1. The checkbox input interaction area is now invisible.
  1. A tick should have appeared in the "Always-on" checkbox.

#### A8.3.2) Unselecting ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. "Always-on" option is selected.

Action(s):
  1. Use in-tab navigation to move down to "Always-on" checkbox.
  1. Press enter to interact with the "Always-on" checkbox.
  1. The checkbox input interaction area is now visible.
  1. Focus the uncheck button and press enter.

Expected outcome(s):
  1. The checkbox input interaction area is now invisible.
  1. A tick should have disappeared in the "Always-on" checkbox.

### A8.4) Voice Input Option ###

#### A8.4.1) Selecting ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. "Voice input" option is not selected.

Action(s):
  1. Use in-tab navigation to move down to "Voice input" checkbox.
  1. Press enter to interact with the "Voice input" checkbox.
  1. The checkbox input interaction area is now visible.
  1. Focus the check button and press enter.

Expected outcome(s):
  1. The checkbox input interaction area is now invisible.
  1. A tick should have appeared in the "Voice input" checkbox.

#### A8.4.2) Unselecting ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. "Voice input" option is selected.

Action(s):
  1. Use in-tab navigation to move down to "Voice input" checkbox.
  1. Press enter to interact with the "Voice input" checkbox.
  1. The checkbox input interaction area is now visible.
  1. Focus the uncheck button and press enter.

Expected outcome(s):
  1. The checkbox input interaction area is now invisible.
  1. A tick should have disappeared in the "Voice input" checkbox.

### A8.5) Saving Options ###

#### A8.5.1) Save & Close ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".
  1. A url value has been entered into the "new tab page" text box.
  1. Speech rate has been selected.
  1. Always-on has been checked.
  1. Voice input has been checked.

Action(s):
  1. Use in-tab navigation to move down to "Save & Close" button.
  1. Press enter to click on the "Save & Close" button.

Expected outcome(s):
  1. The options page should close.
  1. metalmouth should say "Closing tab (tab number)".
  1. Focus changes to an open tab.
  1. metalmouth should say "Moving focus to tab (tab number) showing (url)".

#### A8.5.2) Confirming option(s) are saved ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. metalmouth options page has been opened via metalmouth toolbar option - see previous use case "4.5) Open metalmouth options".

Action(s):
  1. Use in-tab navigation to move down to "new tab page" text input box.
  1. Then use in-tab navigation to move down to "Speech Rate" range input box.
  1. Then use in-tab navigation to move down to "Always-on" checkbox.
  1. Then use in-tab navigation to move down to "Voice input" checkbox.

Expected outcome(s):
  1. When the "New tab page" text input box is focused metalmouth should say "new tab page text input box current value http://www.google.co.uk".
  1. When the "Speech rate" range input box is focused metalmouth should say "".
  1. When the "Always-on" checkbox is focused metalmouth should say "".
  1. When the "Speech rate" checkbox is focused metalmouth should say "".


---

## A9) New Tab Page ##

### A9.1) Default - No URL Entered ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.

Action(s):
  1. Create a new tab using Chrome shortcuts (Windows / Linux: Ctrl+T or Mac: ⌘-T).

Expected outcome(s):
  1. New tab is create.
  1. Focus changes to new tab.
  1. If the new tab shows chrome://newtab the contents should be updated to show (by default) Google's Accessible Search page.
  1. metalmouth should say "Opening new tab (tab number) showing (url)".

### A9.2) URL Entered ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "new tab page" option has been set to a url in the metalmouth options page.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Create a new tab using Chrome shortcuts (Windows / Linux: Ctrl+T or Mac: ⌘-T).

Expected outcome(s):
  1. New tab is create.
  1. Focus changes to new tab.
  1. If the new tab shows chrome://newtab the tab should be updated to the url defined by the user in the "new tab page" option.
  1. metalmouth should say "Opening new tab (tab number) showing (url)".


---

## A10) Speech Rate - New Rate Selected ##

### A10.1) Slower Speech Rate Selected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "speech rate" option has been set to a slower than default speech rate.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Create a new tab using Chrome shortcuts (Windows / Linux: Ctrl+T or Mac: ⌘-T).

Expected outcome(s):
  1. New tab is create.
  1. Focus changes to new tab.
  1. If the new tab shows chrome://newtab the tab should be updated to the url defined by the user in the "new tab page" option.
  1. at a slower speech rate metalmouth should say "Opening new tab (tab number) showing (url)".

### A10.2) Faster Speech Rate Selected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "speech rate" option has been set to a faster than default speech rate.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Create a new tab using Chrome shortcuts (Windows / Linux: Ctrl+T or Mac: ⌘-T).

Expected outcome(s):
  1. New tab is create.
  1. Focus changes to new tab.
  1. If the new tab shows chrome://newtab the tab should be updated to the url defined by the user in the "new tab page" option.
  1. at a faster speech rate metalmouth should say "Opening new tab (tab number) showing (url)".


---

## A11) Always-On ##

### A11.1) Try to turn off extension using omnibox method ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "always-on" option has been selected.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Focus the omnibox (Windows / Linux: Ctrl+L or Mac: ⌘-L).
  1. Press 'm' twice.

Expected outcome(s):
  1. Nothing should happen.

### A11.2) Try to turn off extension using icon button method ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "always-on" option has been selected.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Click on the metalmouth icon button.

Expected outcome(s):
  1. Nothing should happen.

### A11.3) After Chrome restart ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "always-on" option has been selected.
  1. The options page has been saved and closed, using the save & close button.
  1. Chrome browser has been restarted.

Action(s):
  1. Do nothing.

Expected outcome(s):
  1. metalmouth should say "Starting metalmouth extension".


---


## A12) Page-level navigation via keyboard ##

### A12.1) Down arrow ###

#### A12.1.1) Down arrow at page top ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Left arrow has been pressed.
  1. metalmouth has been stopped read all - and returned to page start.
  1. metalmouth has said "page start".

Action(s):
  1. Press down arrow.

Expected outcome(s):
  1. metalmouth should read out the next OSEM item.

#### A12.1.2) Down arrow at mid page location ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. metalmouth has stopped read all.

Action(s):
  1. Press down arrow.

Expected outcome(s):
  1. metalmouth should read out the next OSEM item.

#### A12.1.3) Down arrow at page bottom ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed to stop read all at the bottom of the page.
  1. The last item on the page has been read out.

Action(s):
  1. Press down arrow.

Expected outcome(s):
  1. metalmouth should say "page start".
  1. The navigator should be reset.

### A12.2) Up arrow ###

#### A12.2.1) Up arrow at page top ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Left arrow has been pressed.
  1. metalmouth has been stopped read all - and returned to page start.
  1. metalmouth has said "page start".

Action(s):
  1. Press down up.

Expected outcome(s):
  1. metalmouth should say "page start".

#### A12.2.2) Up arrow at mid page location ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. metalmouth has stopped read all.

Action(s):
  1. Press up arrow.

Expected outcome(s):
  1. metalmouth should read out the previous OSEM item.

### A12.2.3) Up arrow at page bottom ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed to stop read all at the bottom of the page.
  1. The last item on the page has been read out.

Action(s):
  1. Press up arrow.

Expected outcome(s):
  1. metalmouth should read out the previous OSEM item.

### A12.3) Left arrow ###

#### A12.3.1) Left arrow at page top ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Left arrow has been pressed.
  1. metalmouth has been stopped read all - and returned to page start.
  1. metalmouth has said "page start".

Action(s):
  1. Press left arrow.

Expected outcome(s):
  1. metalmouth should say "page start".

#### A12.3.2) Left arrow at mid page location ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. metalmouth has stopped read all.

Action(s):
  1. Press left arrow.

Expected outcome(s):
  1. metalmouth should say "page start".

#### A12.3.3) Left arrow at page bottom ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed to stop read all at the bottom of the page.
  1. The last item on the page has been read out.

Action(s):
  1. Press left arrow.

Expected outcome(s):
  1. metalmouth should say "page start".

### A12.4) Right arrow ###

#### A12.4.1) Right arrow at page top ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Left arrow has been pressed.
  1. metalmouth has been stopped read all - and returned to page start.
  1. metalmouth has said "page start".

Action(s):
  1. Press right arrow.

Expected outcome(s):
  1. metalmouth navigator should move to the next available OSEM header item and read its contents, looping past the end of the document and going again from the start if necessary.

#### A12.4.2) Right arrow at mid page location ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. metalmouth has stopped read all.

Action(s):
  1. Press right arrow.

Expected outcome(s):
  1. metalmouth navigator should move to the next available OSEM header item and read its contents, looping past the end of the document and going again from the start if necessary.

#### A12.4.3) Right arrow at page bottom ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed to stop read all at the bottom of the page.
  1. The last item on the page has been read out.

Action(s):
  1. Press right arrow.

Expected outcome(s):
  1. metalmouth navigator should move to the next available OSEM header item and read its contents, looping past the end of the document and going again from the start if necessary.

### A12.5) Space bar ###

#### A12.5.1) Stop reading ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.

Action(s):
  1. Press space bar.

Expected outcome(s):
  1. metalmouth should read the contents of the current OSEM item and come to a stop.

#### A12.5.2) Continue reading ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. metalmouth has stopped read all.

Action(s):
  1. Press space bar.

Expected outcome(s):
  1. metalmouth should start to read the contents of the next OSEM item and continue to read each subsequent OSEM.


---
