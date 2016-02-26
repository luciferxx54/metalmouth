# Use Cases - Off-Screen Element Model - Item Interaction #

For quality assurance, starting from the soon to be release version 1.8.0 of the metalmouth extension, all of the following basic use cases must be able to be completed without issue (on Windows and Mac) before a new version of the metalmouth extension can be considered to be acceptable for public release.   This document is incomplete and will be added to shortly, and updated over time.


---


## C1) Interaction with OSEM items ##

### C1.1) Skip Link ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title='appropriate title'>text only contents</a>`
`<a name='targetName'>text only contents</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".
  1. Press enter.

Expected outcome(s):
  1. Focus is moved to the position of the defined skip target.
  1. The skip link is processed in the relevant manner by metalmouth.

### C1.2) Link ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='http://www.test.com/' title='appropriate title'>text only contents</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "link".
  1. Press enter.

Expected outcome(s):
  1. Location of the current tab changes to the url defined in the link.
  1. metalmouth starts to process this new page.

### C1.3) New Tab Link ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='http://www.test.com/' title='appropriate title' target="_blank">text only contents</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".
  1. Press enter.

Expected outcome(s):
  1. A new tab is opened.
  1. The location of this new tab changes to the url defined in the link.
  1. metalmouth starts to process this new tab page.

### C1.4) Quote Link ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='http://www.test.com/'>text only contents</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote".
  1. Press enter.

Expected outcome(s):
  1. Location of the current tab changes to the url defined in the link.
  1. metalmouth starts to process this new page.

### C1.5) Map Area ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map><area href="http://www.test.com/" alt="text only contents" /></map>`

Action(s):
  1. Press down arrow until current OSEM is the defined "map area".
  1. Press enter.

Expected outcome(s):
  1. Location of the current tab changes to the url defined in the link.
  1. metalmouth starts to process this new page.

### C1.6) New Tab Map Area ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map><area href="http://www.bbc.com/" alt="text only contents" target="_blank" /></map>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab map area".
  1. Press enter.

Expected outcome(s):
  1. A new tab is opened.
  1. The location of this new tab changes to the url defined in the link.
  1. metalmouth starts to process this new tab page.

### C1.7) Text Box ###

### C1.7.1) Activate text entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "text box".
  1. Press enter.

Expected outcome(s):
  1. text entry area box opens.
  1. metalmouth says "text entry area entered".
  1. metalmouth says "text entry area has focus".

### C1.7.2) Add characters to text area entry box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`
  1. Down arrow has been pressed until current OSEM is the defined "text box".
  1. Enter has been pressed.
  1. The text entry area box has opened.
  1. metalmouth says "text entry area entered".
  1. metalmouth says "text entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.7.3) Remove characters from text entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`
  1. Down arrow has been pressed until current OSEM is the defined "text box".
  1. Enter has been pressed.
  1. The text entry area box has opened.
  1. metalmouth says "text entry area entered".
  1. metalmouth says "text entry area has focus".
  1. "b" has been pressed - so "b" appears in the "text entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the text entry area box.

### C1.7.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`
  1. Down arrow has been pressed until current OSEM is the defined "text box".
  1. Enter has been pressed.
  1. The text entry area box has opened.
  1. metalmouth says "text entry area entered".
  1. metalmouth says "text entry area has focus".
  1. A value has been typed - so this text now is shown in the text entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.7.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`
  1. Down arrow has been pressed until current OSEM is the defined "text box".
  1. Enter has been pressed.
  1. The text entry area box has opened.
  1. metalmouth says "text entry area entered".
  1. metalmouth says "text entry area focus".
  1. A value has been typed - so this text now is shown in the text entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Text entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant text box.

### C1.8) Search Box ###

### C1.8.1) Activate search entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "search box".
  1. Press enter.

Expected outcome(s):
  1. search entry area box opens.
  1. metalmouth says "search entry area entered".
  1. metalmouth says "search entry area has focus".

### C1.8.2) Add characters to search entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`
  1. Down arrow has been pressed until current OSEM is the defined "search box".
  1. Enter has been pressed.
  1. The search entry area box has opened.
  1. metalmouth says "search entry area entered".
  1. metalmouth says "search entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.8.3) Remove characters from search entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`
  1. Down arrow has been pressed until current OSEM is the defined "search box".
  1. Enter has been pressed.
  1. The search entry area box has opened.
  1. metalmouth says "search entry area entered".
  1. metalmouth says "search entry area has focus".
  1. "b" has been pressed - so "b" appears in the 'search entry area' box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the search entry area box.

### C1.8.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`
  1. Down arrow has been pressed until current OSEM is the defined "search box".
  1. Enter has been pressed.
  1. The search entry area box has opened.
  1. metalmouth says "search entry area entered".
  1. metalmouth says "search entry area has focus".
  1. A value has been typed - so this text now is shown in the search entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.8.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`
  1. Down arrow has been pressed until current OSEM is the defined "search box".
  1. Enter has been pressed.
  1. The search entry area box has opened.
  1. metalmouth says "search entry area entered".
  1. metalmouth says "search entry area focus".
  1. A value has been typed - so this text now is shown in the search entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Search entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant search box.

### C1.9) Password Box ###

### C1.9.1) Activate password entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "password box".
  1. Press enter.

Expected outcome(s):
  1. password entry area box opens.
  1. metalmouth says "password entry area entered".
  1. metalmouth says "password entry area has focus".

### C1.9.2) Add characters to password entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`
  1. Down arrow has been pressed until current OSEM is the defined "password box".
  1. Enter has been pressed.
  1. The password entry area box has opened.
  1. metalmouth says "password entry area entered".
  1. metalmouth says "password entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.9.3) Remove characters from password entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`
  1. Down arrow has been pressed until current OSEM is the defined "password box".
  1. Enter has been pressed.
  1. The password entry area box has opened.
  1. metalmouth says "password entry area entered".
  1. metalmouth says "password entry area has focus".
  1. "b" has been pressed - so "b" appears in the 'password entry area' box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the password entry area box.

### C1.9.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`
  1. Down arrow has been pressed until current OSEM is the defined "password box".
  1. Enter has been pressed.
  1. The password entry area box has opened.
  1. metalmouth says "password entry area entered".
  1. metalmouth says "password entry area has focus".
  1. A value has been typed - so this text now is shown in the password entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.9.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`
  1. Down arrow has been pressed until current OSEM is the defined "password box".
  1. Enter has been pressed.
  1. The password entry area box has opened.
  1. metalmouth says "password entry area entered".
  1. metalmouth says "password entry area focus".
  1. A value has been typed - so this text now is shown in the password entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "password entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The value should now be the value shown in the relevant password box.

### C1.10) Telephone Box ###

### C1.10.1) Activate telephone entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".
  1. Press enter.

Expected outcome(s):
  1. telephone entry area box opens.
  1. metalmouth says "telephone entry area entered".
  1. metalmouth says "telephone entry area has focus".

### C1.10.2) Add characters to telephone entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`
  1. Down arrow has been pressed until current OSEM is the defined "telephone box".
  1. Enter has been pressed.
  1. The telephone entry area box has opened.
  1. metalmouth says "telephone entry area entered".
  1. metalmouth says "telephone entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.10.3) Remove characters from telephone entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`
  1. Down arrow has been pressed until current OSEM is the defined "telephone box".
  1. Enter has been pressed.
  1. The telephone entry area box has opened.
  1. metalmouth says "telephone entry area entered".
  1. metalmouth says "telephone entry area has focus".
  1. 'b' has been pressed - so 'b' appears in the 'telephone entry area' box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the telephone entry area box.

### C1.10.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`
  1. Down arrow has been pressed until current OSEM is the defined "telephone box".
  1. Enter has been pressed.
  1. The telephone entry area box has opened.
  1. metalmouth says "telephone entry area entered".
  1. metalmouth says "telephone entry area has focus".
  1. A value has been typed - so this text now is shown in the telephone entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.10.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`
  1. Down arrow has been pressed until current OSEM is the defined "telephone box".
  1. Enter has been pressed.
  1. The telephone entry area box has opened.
  1. metalmouth says "telephone entry area entered".
  1. metalmouth says "telephone entry area focus".
  1. A value has been typed - so this text now is shown in the telephone entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "telephone entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant telephone box.

### C1.11) Url Box ###

### C1.11.1) Activate url entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".
  1. Press enter.

Expected outcome(s):
  1. url entry area box opens.
  1. metalmouth says "url entry area entered".
  1. metalmouth says "url entry area has focus".

### C1.11.2) Add characters to url entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`
  1. Down arrow has been pressed until current OSEM is the defined "url box".
  1. Enter has been pressed.
  1. The url entry area box has opened.
  1. metalmouth says "url entry area entered".
  1. metalmouth says "url entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.11.3) Remove characters from url entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`
  1. Down arrow has been pressed until current OSEM is the defined "url box".
  1. Enter has been pressed.
  1. The url entry area box has opened.
  1. metalmouth says "url entry area entered".
  1. metalmouth says "url entry area has focus".
  1. "b" has been pressed - so "b" appears in the "url entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the url entry area box.

### C1.11.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`
  1. Down arrow has been pressed until current OSEM is the defined "url box".
  1. Enter has been pressed.
  1. The url entry area box has opened.
  1. metalmouth says "url entry area entered".
  1. metalmouth says "url entry area has focus".
  1. A value has been typed - so this text now is shown in the url entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.11.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`
  1. Down arrow has been pressed until current OSEM is the defined "url box".
  1. Enter has been pressed.
  1. The url entry area box has opened.
  1. metalmouth says "url entry area entered".
  1. metalmouth says "url entry area focus".
  1. A value has been typed - so this text now is shown in the url entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "url entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant url box.

### C1.12) Email Box ###

### C1.12.1) Activate email entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".
  1. Press enter.

Expected outcome(s):
  1. email entry area box opens.
  1. metalmouth says "email entry area entered".
  1. metalmouth says "email entry area has focus".

### C1.12.2) Add characters to email entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`
  1. Down arrow has been pressed until current OSEM is the defined "email box".
  1. Enter has been pressed.
  1. The email entry area box has opened.
  1. metalmouth says "email entry area entered".
  1. metalmouth says "email entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.12.3) Remove characters from email entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`
  1. Down arrow has been pressed until current OSEM is the defined "email box".
  1. Enter has been pressed.
  1. The email entry area box has opened.
  1. metalmouth says "email entry area entered".
  1. metalmouth says "email entry area has focus".
  1. "b" has been pressed - so "b" appears in the "email entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the email entry area box.

### C1.12.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`
  1. Down arrow has been pressed until current OSEM is the defined "email box".
  1. Enter has been pressed.
  1. The email entry area box has opened.
  1. metalmouth says "email entry area entered".
  1. metalmouth says "email entry area has focus".
  1. A value has been typed - so this text now is shown in the email entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.12.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`
  1. Down arrow has been pressed until current OSEM is the defined "email box".
  1. Enter has been pressed.
  1. The email entry area box has opened.
  1. metalmouth says "email entry area entered".
  1. metalmouth says "email entry area focus".
  1. A value has been typed - so this text now is shown in the email entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "email entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant email box.

### C1.13) Date Time Box ###

### C1.13.1) Activate datetime entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".
  1. Press enter.

Expected outcome(s):
  1. datetime entry area box opens.
  1. metalmouth says "datetime entry area entered".
  1. metalmouth says "datetime entry area has focus".

### C1.13.2) Add characters to datetime entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`
  1. Down arrow has been pressed until current OSEM is the defined "datetime box".
  1. Enter has been pressed.
  1. The datetime entry area box has opened.
  1. metalmouth says "datetime entry area entered".
  1. metalmouth says "datetime entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.13.3) Remove characters from datetime entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`
  1. Down arrow has been pressed until current OSEM is the defined "datetime box".
  1. Enter has been pressed.
  1. The datetime entry area box has opened.
  1. metalmouth says "datetime entry area entered".
  1. metalmouth says "datetime entry area has focus".
  1. "b" has been pressed - so "b" appears in the "datetime entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the datetime entry area box.

### C1.13.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`
  1. Down arrow has been pressed until current OSEM is the defined "datetime box".
  1. Enter has been pressed.
  1. The datetime entry area box has opened.
  1. metalmouth says "datetime entry area entered".
  1. metalmouth says "datetime entry area has focus".
  1. A value has been typed - so this text now is shown in the datetime entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.13.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`
  1. Down arrow has been pressed until current OSEM is the defined "datetime box".
  1. Enter has been pressed.
  1. The datetime entry area box has opened.
  1. metalmouth says "datetime entry area entered".
  1. metalmouth says "datetime entry area focus".
  1. A value has been typed - so this text now is shown in the datetime entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "datetime entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant datetime box.

### C1.14) Date Box ###

### 18.14.1) Activate date entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".
  1. Press enter.

Expected outcome(s):
  1. date entry area box opens.
  1. metalmouth says "date entry area entered".
  1. metalmouth says "date entry area has focus".

### C1.14.2) Add characters to date entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`
  1. Down arrow has been pressed until current OSEM is the defined "date box".
  1. Enter has been pressed.
  1. The date entry area box has opened.
  1. metalmouth says "date entry area entered".
  1. metalmouth says "date entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.14.3) Remove characters from date entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`
  1. Down arrow has been pressed until current OSEM is the defined "date box".
  1. Enter has been pressed.
  1. The date entry area box has opened.
  1. metalmouth says "date entry area entered".
  1. metalmouth says "date entry area has focus".
  1. "b" has been pressed - so "b" appears in the "date entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the date entry area box.

### C1.14.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`
  1. Down arrow has been pressed until current OSEM is the defined "date box".
  1. Enter has been pressed.
  1. The date entry area box has opened.
  1. metalmouth says "date entry area entered".
  1. metalmouth says "date entry area has focus".
  1. A value has been typed - so this text now is shown in the date entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.14.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`
  1. Down arrow has been pressed until current OSEM is the defined "date box".
  1. Enter has been pressed.
  1. The date entry area box has opened.
  1. metalmouth says "date entry area entered".
  1. metalmouth says "date entry area focus".
  1. A value has been typed - so this text now is shown in the date entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "date entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant date box.

### C1.15) Month Box ###

### C1.15.1) Activate month entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".
  1. Press enter.

Expected outcome(s):
  1. month entry area box opens.
  1. metalmouth says "month entry area entered".
  1. metalmouth says "month entry area has focus".

### C1.15.2) Add characters to month entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`
  1. Down arrow has been pressed until current OSEM is the defined "month box".
  1. Enter has been pressed.
  1. The month entry area box has opened.
  1. metalmouth says "month entry area entered".
  1. metalmouth says "month entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.15.3) Remove characters from month entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`
  1. Down arrow has been pressed until current OSEM is the defined "month box".
  1. Enter has been pressed.
  1. The month entry area box has opened.
  1. metalmouth says "month entry area entered".
  1. metalmouth says "month entry area has focus".
  1. "b" has been pressed - so "b" appears in the 'month entry area' box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the month entry area box.

### C1.15.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`
  1. Down arrow has been pressed until current OSEM is the defined "month box".
  1. Enter has been pressed.
  1. The month entry area box has opened.
  1. metalmouth says "month entry area entered".
  1. metalmouth says "month entry area has focus".
  1. A value has been typed - so this text now is shown in the month entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.15.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`
  1. Down arrow has been pressed until current OSEM is the defined "month box".
  1. Enter has been pressed.
  1. The month entry area box has opened.
  1. metalmouth says "month entry area entered".
  1. metalmouth says "month entry area focus".
  1. A value has been typed - so this text now is shown in the month entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "month entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant month box.

### C1.16) Week Box ###

### C1.16.1) Activate week entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".
  1. Press enter.

Expected outcome(s):
  1. week entry area box opens.
  1. metalmouth says "week entry area entered".
  1. metalmouth says "week entry area has focus".

### C1.16.2) Add characters to week entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`
  1. Down arrow has been pressed until current OSEM is the defined "week box".
  1. Enter has been pressed.
  1. The week entry area box has opened.
  1. metalmouth says "week entry area entered".
  1. metalmouth says "week entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.16.3) Remove characters from week entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`
  1. Down arrow has been pressed until current OSEM is the defined "week box".
  1. Enter has been pressed.
  1. The week entry area box has opened.
  1. metalmouth says "week entry area entered".
  1. metalmouth says "week entry area has focus".
  1. "b" has been pressed - so "b" appears in the "week entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the week entry area box.

### C1.16.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`
  1. Down arrow has been pressed until current OSEM is the defined "week box".
  1. Enter has been pressed.
  1. The week entry area box has opened.
  1. metalmouth says "week entry area entered".
  1. metalmouth says "week entry area has focus".
  1. A value has been typed - so this text now is shown in the week entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.16.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`
  1. Down arrow has been pressed until current OSEM is the defined "week box".
  1. Enter has been pressed.
  1. The week entry area box has opened.
  1. metalmouth says "week entry area entered".
  1. metalmouth says "week entry area focus".
  1. A value has been typed - so this text now is shown in the week entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "week entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant week box.

### C1.17) Time Box ###

### C1.17.1) Activate time entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".
  1. Press enter.

Expected outcome(s):
  1. time entry area box opens.
  1. metalmouth says "time entry area entered".
  1. metalmouth says "time entry area has focus".

### C1.17.2) Add characters to time entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`
  1. Down arrow has been pressed until current OSEM is the defined "time box".
  1. Enter has been pressed.
  1. The time entry area box has opened.
  1. metalmouth says "time entry area entered".
  1. metalmouth says "time entry area has focus".

Action(s):
  1. Press "b".

Expected outcome(s):
  1. metalmouth says "b".
  1. "b" is shown in the text entry area box.

### C1.17.3) Remove characters from time entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`
  1. Down arrow has been pressed until current OSEM is the defined "time box".
  1. Enter has been pressed.
  1. The time entry area box has opened.
  1. metalmouth says "time entry area entered".
  1. metalmouth says "time entry area has focus".
  1. "b" has been pressed - so "b" appears in the "time entry area" box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "b removed".
  1. no characters are shown in the time entry area box.

### C1.17.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`
  1. Down arrow has been pressed until current OSEM is the defined "time box".
  1. Enter has been pressed.
  1. The time entry area box has opened.
  1. metalmouth says "time entry area entered".
  1. metalmouth says "time entry area has focus".
  1. A value has been typed - so this text now is shown in the time entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.17.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`
  1. Down arrow has been pressed until current OSEM is the defined "time box".
  1. Enter has been pressed.
  1. The time entry area box has opened.
  1. metalmouth says "time entry area entered".
  1. metalmouth says "time entry area focus".
  1. A value has been typed - so this text now is shown in the time entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "time entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant time box.

### C1.18) Number Box ###

### C1.18.1) Activate number entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".
  1. Press enter.

Expected outcome(s):
  1. number entry area box opens.
  1. metalmouth says "number entry area entered".
  1. metalmouth says "number entry area has focus".

### C1.18.2) Add characters to number entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" />`
  1. Down arrow has been pressed until current OSEM is the defined "number box".
  1. Enter has been pressed.
  1. The number entry area box has opened.
  1. metalmouth says "number entry area entered".
  1. metalmouth says "number entry area has focus".

Action(s):
  1. Press "5".

Expected outcome(s):
  1. metalmouth says "five".
  1. "5" is shown in the number entry area box.

### C1.18.3) Remove characters from number entry area box ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" />`
  1. Down arrow has been pressed until current OSEM is the defined "number box".
  1. Enter has been pressed.
  1. The number entry area box has opened.
  1. metalmouth says "number entry area entered".
  1. metalmouth says "number entry area has focus".
  1. "5" has been pressed - so "5" appears in the 'number entry area' box.

Action(s):
  1. Press delete.

Expected outcome(s):
  1. metalmouth says "five removed".
  1. no characters are shown in the number entry area box.

### C1.18.4) Focus enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" />`
  1. Down arrow has been pressed until current OSEM is the defined "number box".
  1. Enter has been pressed.
  1. The number entry area box has opened.
  1. metalmouth says "number entry area entered".
  1. metalmouth says "number entry area has focus".
  1. A value has been typed - so this text now is shown in the number entry area box.

Action(s):
  1. Press tab to focus "Enter button".

Expected outcome(s):
  1. metalmouth says "Enter button has focus".

### C1.18.5) Press enter button ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" />`
  1. Down arrow has been pressed until current OSEM is the defined "number box".
  1. Enter has been pressed.
  1. The number entry area box has opened.
  1. metalmouth says "number entry area entered".
  1. metalmouth says "number entry area focus".
  1. A value has been typed - so this text now is shown in the number entry area box.
  1. Tab has been pressed to focus "Enter button".

Action(s):

  1. Press enter.

Expected outcome(s):
  1. metalmouth says "number entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant number box.

### C1.19) Range Input ###

#### C1.19.1) Activate range entry area box ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10"  step="1" required="required" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".
  1. Press enter.

Expected outcome(s):
  1. range entry area box opens.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".

#### C1.19.2) Increase value to enter ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" step="1" required="required" />`
  1. Down arrow has been pressed until current OSEM is the defined "range box".
  1. Enter has been pressed.
  1. The range entry area box has opened.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".

Action(s):
  1. Press enter until maximum value reached.

Expected outcome(s):
  1. metalmouth says "value to enter increased to x + step", for each value until the maximum value is reached.
  1. metalmouth says "maximum value x reached".

#### C1.19.3) Focus decrease value button ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" step="1" required="required" />`
  1. Down arrow has been pressed until current OSEM is the defined "range box".
  1. Enter has been pressed.
  1. The range entry area box has opened.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".

Action(s):
  1. Press tab to focus "Decrease value button".

Expected outcome(s):
  1. metalmouth says "decrease value button has focus".

#### C1.19.4) Decrease value to enter ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" step="1" required="required" />`
  1. Down arrow has been pressed until current OSEM is the defined "range box".
  1. Enter has been pressed.
  1. The range entry area box has opened.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".
  1. Tab has been pressed to focus "decrease value button".

Action(s):
  1. Press enter until minimum value reached.

Expected outcome(s):
  1. metalmouth says "value to enter decreased to x - step", for each value until the minimum value is reached.
  1. metalmouth says "minimum value x reached".

#### C1.19.5) Focus enter button ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" step="1" required="required" />`
  1. Down arrow has been pressed until current OSEM is the defined "range box".
  1. Enter has been pressed.
  1. The range entry area box has opened.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".

Action(s):
  1. Press tab to focus "enter button".

Expected outcome(s):
  1. metalmouth says "enter button has focus".

#### C1.19.6) Press enter button ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" required="required" />`
  1. Down arrow has been pressed until current OSEM is the defined "range box".
  1. Enter has been pressed.
  1. The range entry area box has opened.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".
  1. Tab has been pressed to focus "Enter button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "range entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The typed value should now be the value shown in the relevant range box.

#### C1.19.7) Activate range entry area box - Default settings ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" required="required" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".
  1. Press enter.

Expected outcome(s):
  1. range entry area box opens.
  1. metalmouth says "range entry area entered".
  1. metalmouth says "increase value button has focus".

### C1.20) Button ###

#### C1.20.1) Click ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<button>Button text</button>`
  1. Down arrow has been pressed until current OSEM is the defined "input button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. Any actions attached to the click event of the button are fired.

### C1.21) Input Button ###

#### C1.21.1) Click ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="button" value="label text"/>`
  1. Down arrow has been pressed until current OSEM is the defined "input button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. Any actions attached to the click of the button are fired.

### C1.22) Image Button ###

#### C1.22.1) Click ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="image" src="test.png" value="label text"/>`
  1. Down arrow has been pressed until current OSEM is the defined "input button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. Any actions attached to the click of the button are fired.

### C1.23) Submit Button ###

#### C1.23.1) Click ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="submit" value="label text"/>`
  1. Down arrow has been pressed until current OSEM is the defined "input button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. Any actions attached to the click of the button are fired.

### C1.24) Reset Button ###

#### C1.24.1) Click ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="reset" value="label text"/>`
  1. Down arrow has been pressed until current OSEM is the defined "input button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. Any actions attached to the click of the button are fired.

### C1.25) Check Button ###

#### C1.25.1) Activate check entry area box / input type=radio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="radio" name="sex" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="radio" name="sex" value="female" /><label for="manuRadiobox2">Female</label>`

Action(s):
  1. Press down arrow until current OSEM is the first defined "check box" of the two.
  1. Press enter.

Expected outcome(s):
  1. check entry area box opens.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

#### C1.25.2) Check the checkbox / input type=radio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="radio" name="sex" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="radio" name="sex" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "check entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The first of the two "check boxes" should be checked, the second "check box" should be unchecked.

#### C1.25.3) Focus the uncheck button / input type=radio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="radio" name="sex" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="radio" name="sex" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

Action(s):
  1. Press tab to focus "uncheck button".

Expected outcome(s):
  1. metalmouth says "uncheck button has focus".

#### C1.25.4) Uncheck the checkbox / input type=radio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="radio" name="sex" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="radio" name="sex" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".
  1. Tab has been pressed to focus "uncheck button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "check entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The first of the two "check boxes" should be unchecked, the second "check box" should be checked.

#### C1.25.5) Activate check entry area box / input type=checkbox ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="checkbox" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="checkbox" value="female" /><label for="manuRadiobox2">Female</label>`

Action(s):
  1. Press down arrow until current OSEM is the first defined "check box" of the two.
  1. Press enter.

Expected outcome(s):
  1. check entry area box opens.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

#### C1.25.6) Check the checkbox / input type=checkbox ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="checkbox" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="checkbox" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "check entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The first of the two "check boxes" should be checked, there should be no impact on the second.

#### C1.25.7) Focus the uncheck button / input type=checkbox ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="checkbox" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="checkbox" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".

Action(s):
  1. Press tab to focus "uncheck button".

Expected outcome(s):
  1. metalmouth says "uncheck button has focus".

#### C1.25.8) Uncheck the checkbox / input type=checkbox ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="manuRadiobox1" type="checkbox" value="male" /><label for="manuRadiobox1">Male</label><br /><input id="manuRadiobox2" type="checkbox" value="female" /><label for="manuRadiobox2">Female</label>`
  1. Down arrow has been pressed until current OSEM is the first defined "check box" of the two.
  1. Enter has been pressed.
  1. The check entry area box has opened.
  1. metalmouth says "check entry area entered".
  1. metalmouth says "check button has focus".
  1. Tab has been pressed to focus "uncheck button".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "check entry area closed".
  1. metalmouth says "Navigation mode entered".
  1. The first of the two "check boxes" should be checked, there should be no impact on the second.

### C1.26) Single Select ###

#### C1.26.1) Activate single select ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="manuSelect"><option>option 1</option><option>option 2</option><optgroup><option>option 3</option><option>option 4</option></optgroup></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "single select".
  1. Press enter.

Expected outcome(s):
  1. single select entry area box opens.
  1. metalmouth says "single select entry area entered".
  1. metalmouth says "current option x".
  1. metalmouth says "next option button has focus".

#### C1.26.2) Move to next option ####

#### C1.26.3) Focus previous option button ####

#### C1.26.4) Move to previous option ####

#### C1.26.5) Focus select button ####

#### C1.26.6) Select option ####

### C1.27) Multi Select ###

#### C1.27.1) Activate multi select ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="manuSelect" multiple="multiple"><option>option 1</option><option>option 2</option><optgroup><option>option 3</option><option>option 4</option></optgroup></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "multi select".
  1. Press enter.

Expected outcome(s):
  1. multi select entry area box opens.
  1. metalmouth says "multi select entry area entered".
  1. metalmouth says "current option x".
  1. metalmouth says "next option button has focus".

#### C1.27.2) Move to next option ####
???
#### C1.27.3) Focus previous option button ####
???
#### C1.27.4) Move to previous option ####
???
#### C1.27.5) Focus check button ####
???
#### C1.27.6) Check option ####
???
#### C1.27.7) Focus Uncheck button ####
???
#### C1.27.8) Uncheck option ####
???
#### C1.27.9) Check two options ####
???
#### C1.27.10) Focus enter button ####
???
#### C1.27.11) Enter ####
???
#### C1.27.12) Check no options ####
???
#### C1.27.13) Check one option ####
???
#### C1.27.14) Check all options ####
???
### C1.28) Audio ###

#### C1.28.1) Activate audio control area box ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/Audio.ogg" controls="controls"></audio>`

Action(s):
  1. Press down arrow until current OSEM is defined "audio".
  1. Press enter.

Expected outcome(s):
  1. audio control area box opens.
  1. metalmouth says "audio control area entered".
  1. metalmouth says "play button has focus".

#### C1.28.2) Play audio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/Audio.ogg" controls="controls"></audio>`
  1. Down arrow pressed until current OSEM is the defined "audio".
  1. Enter pressed.
  1. Audio control area box has opened.
  1. metalmouth has said "audio control area entered".
  1. metalmouth has said "play button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Audio playing".
  1. The audio starts playing.
  1. metalmouth says "Pause button has focus".

#### C1.28.3) Pause audio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/Audio.ogg" controls="controls"></audio>`
  1. Down arrow pressed until current OSEM is the defined "audio".
  1. Enter pressed.
  1. Audio control area box has opened.
  1. metalmouth has said "audio control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Audio playing".
  1. The audio has started to play.
  1. metalmouth has said "Pause button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Audio paused.  Play button has focus.".

#### C1.28.4) Focus rewind button ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/Audio.ogg" controls="controls"></audio>`
  1. Down arrow pressed until current OSEM is the defined "audio".
  1. Enter pressed.
  1. Audio control area box has opened.
  1. metalmouth has said "audio control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Audio playing".
  1. The audio has started to play.
  1. metalmouth has said "Pause button has focus".
  1. Enter pressed.
  1. metalmouth has said "Audio paused.  Play button has focus.".

Action(s):
  1. Press down arrow until rewind button has focus.

Expected outcome(s):
  1. metalmouth says "Rewind button has focus".

#### C1.28.5) Rewind audio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/Audio.ogg" controls="controls"></audio>`
  1. Down arrow pressed until current OSEM is the defined "audio".
  1. Enter pressed.
  1. Audio control area box has opened.
  1. metalmouth has said "audio control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Audio playing".
  1. The audio has started to play.
  1. metalmouth has said "Pause button has focus".
  1. Enter pressed.
  1. metalmouth has said "Audio paused.  Play button has focus.".
  1. Down arrow pressed until rewind button has focus.
  1. metalmouth has said "Rewind button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Audio rewound. Play button has focus.".

### C1.29) Video ###

#### C1.29.1) Activate video control area box ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/Video.ogg"></video>`

Action(s):
  1. Press down arrow until current OSEM is defined "video".
  1. Press enter.

Expected outcome(s):
  1. video control area box opens.
  1. metalmouth says "video control area entered".
  1. metalmouth says "play button has focus".

#### C1.29.2) Play video ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/Video.ogg"></video>`
  1. Down arrow pressed until current OSEM is the defined "video".
  1. Enter pressed.
  1. Video control area box has opened.
  1. metalmouth has said "video control area entered".
  1. metalmouth has said "play button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Video playing".
  1. The video starts playing.
  1. metalmouth says "Pause button has focus".

#### C1.29.3) Pause video ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/Video.ogg"></video>`
  1. Down arrow pressed until current OSEM is the defined "video".
  1. Enter pressed.
  1. Video control area box has opened.
  1. metalmouth has said "video control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Video playing".
  1. The video has started to play.
  1. metalmouth has said "Pause button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Video paused.  Play button has focus.".

#### C1.29.4) Focus rewind button ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/Video.ogg"></video>`
  1. Down arrow pressed until current OSEM is the defined "video".
  1. Enter pressed.
  1. Video control area box has opened.
  1. metalmouth has said "video control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Video playing".
  1. The video has started to play.
  1. metalmouth has said "Pause button has focus".
  1. Enter pressed.
  1. metalmouth has said "Video paused.  Play button has focus.".

Action(s):
  1. Press down arrow until rewind button has focus.

Expected outcome(s):
  1. metalmouth says "Rewind button has focus".

#### C1.29.5) Rewind video ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/Video.ogg"></video>`
  1. Down arrow pressed until current OSEM is the defined "video".
  1. Enter pressed.
  1. Video control area box has opened.
  1. metalmouth has said "video control area entered".
  1. metalmouth has said "play button has focus".
  1. Enter pressed.
  1. metalmouth has said "Video playing".
  1. The video has started to play.
  1. metalmouth has said "Pause button has focus".
  1. Enter pressed.
  1. metalmouth has said "Video paused.  Play button has focus.".
  1. Down arrow pressed until rewind button has focus.
  1. metalmouth has said "Rewind button has focus".

Action(s):
  1. Press enter.

Expected outcome(s):
  1. metalmouth says "Video rewound. Play button has focus.".


---
