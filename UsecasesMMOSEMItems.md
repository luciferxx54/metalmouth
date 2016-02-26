# Use Cases - Off-Screen Element Model - Items #

For quality assurance, starting from the soon to be release version 1.8.0 of the metalmouth extension, all of the following basic use cases must be able to be completed without issue (on Windows and Mac) before a new version of the metalmouth extension can be considered to be acceptable for public release.   This document is incomplete and will be added to shortly, and updated over time.


---


## B1) OSEM items (on focus) - Non-WAI-ARIA based ##

### B0.1) Main content area ###

#### B0.1.1) Formed from MAIN element - no contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<main></main>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B0.1.2) Formed from MAIN element - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<main>`_text only contents_`</main>`

Action(s):
  1. Press down arrow until current OSEM is the defined "main content area".

Expected outcome(s):
  1. metalmouth should say "Main content area".
  1. metalmouth should say "text only contents".

#### B0.1.3) Formed from MAIN element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<main>`_some html contents_`</main>`

Action(s):
  1. Press down arrow until current OSEM is the defined "main content area".

Expected outcome(s):
  1. metalmouth should say "main content area".

### B1.1) Page header area ###

#### B1.1.1) No content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<header></header>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.1.2) Text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<header>`_text only contents_`</header>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page header area".

Expected outcome(s):
  1. metalmouth should say "page header area".
  1. metalmouth should say "text only contents".

#### B1.1.3) Some html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<header>`_some html contents_`</header>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page header area".

Expected outcome(s):
  1. metalmouth should say "page header area".

### B1.2) Site navigation area ###

#### B1.2.1) No content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<nav></nav>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.2.1) Text only content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<nav>`_text only contents_`</nav>`

Action(s):
  1. Press down arrow until current OSEM is the defined "site navigation area".

Expected outcome(s):
  1. metalmouth should say "site navigation area".
  1. metalmouth should say "text only contents".

#### B1.2.3) Some html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<nav>`_some html contents_`</nav>`

Action(s):
  1. Press down arrow until current OSEM is the defined "site navigation area".

Expected outcome(s):
  1. metalmouth should say "site navigation area".

### B1.3) Menu ###

#### B1.3.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list' title='appropriate title'></menu>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "menu".
  1. metalmouth should say "no items listed".

#### B1.3.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list' title='appropriate title'>_text only contents_</menu>`

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "menu".
  1. metalmouth should say "no items listed".

#### B1.3.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list' title='appropriate title'><li role="menuitem">Hello World 1</li><li role="menuitem">Hello World 2</li><li role="menuitem">Hello World 3</li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "menu".
  1. metalmouth should say "3 items listed".

#### B1.3.4) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list'><li role="menuitem">Hello World 1</li><li role="menuitem">Hello World 2</li><li role="menuitem">Hello World 3</li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "untitled".
  1. metalmouth should say "menu".
  1. metalmouth should say "3 items listed".

#### B1.3.5) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list' title=''><li role="menuitem">Hello World 1</li><li role="menuitem">Hello World 2</li><li role="menuitem">Hello World 3</li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "untitled".
  1. metalmouth should say "menu".
  1. metalmouth should say "3 items listed".

#### B1.3.6) One menu item ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type='list' title='appropriate title'><li role="menuitem">Hello World 1</li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the defined "menu".

Expected outcome(s):
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "menu".
  1. metalmouth should say "1 item listed".

### B1.4) Page footer area ###

#### B1.4.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<footer></footer>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.4.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<footer>`_text only contents_`</footer>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page footer area".

Expected outcome(s):
  1. metalmouth should say "page footer area".
  1. metalmouth should say "text only contents".

#### B1.4.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<footer>`_some html contents_`</footer>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page footer area".

Expected outcome(s):
  1. metalmouth should say "page footer area".

### B1.5) Page contact details ###

#### B1.5.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<address></address>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.5.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<address>`_text only contents_`</address>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page contact details".

Expected outcome(s):
  1. metalmouth should say "page contact details".
  1. metalmouth should say "text only contents".

#### B1.5.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<address>`_some html contents_`</address>`

Action(s):
  1. Press down arrow until current OSEM is the defined "page contact details".

Expected outcome(s):
  1. metalmouth should say "page contact details".

### B1.6) Skip link ###

#### B1.6.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title='appropriate title'></a>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.6.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title='appropriate title'>`_text only contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".

Expected outcome(s):
  1. metalmouth should say "Interactable skip link".
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "text only contents".

#### B1.6.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title='appropriate title'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".

Expected outcome(s):
  1. metalmouth should say "Interactable skip link".
  1. metalmouth should say "appropriate title".

#### B1.6.4) Title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title='appropriate title'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".

Expected outcome(s):
  1. metalmouth should say "Interactable skip link".
  1. metalmouth should say "appropriate title".

#### B1.6.5) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".

Expected outcome(s):
  1. metalmouth should say "Interactable skip link".

#### B1.6.6) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='#targetName' title=''>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip link".

Expected outcome(s):
  1. metalmouth should say "Interactable skip link".

### B1.7) Skip target ###

#### B1.7.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a name='targetName' title='appropriate title'></a>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.7.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a name='targetName' title='appropriate title'>`_text only contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip target".

Expected outcome(s):
  1. metalmouth should say "Skip target".
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "text only contents".

#### B1.7.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a name='targetName' title='appropriate title'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip target".

Expected outcome(s):
  1. metalmouth should say "Skip target".
  1. metalmouth should say "appropriate title".

#### B1.7.5) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a name='targetName'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip target".

Expected outcome(s):
  1. metalmouth should say "Skip target".

#### B1.7.6) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a name='targetName' title=''>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "skip target".

Expected outcome(s):
  1. metalmouth should say "Skip target".

### B1.8) Link ###

#### B1.8.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title'></a>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.8.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title'>`_text only contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "link".

Expected outcome(s):
  1. metalmouth should say "Interactable link".
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "text only contents".

#### B1.8.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "link".

Expected outcome(s):
  1. metalmouth should say "Interactable link".
  1. metalmouth should say "appropriate title".

#### B1.8.4) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "link".

Expected outcome(s):
  1. metalmouth should say "Interactable link".

#### B1.8.5) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title=''>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "link".

Expected outcome(s):
  1. metalmouth should say "Interactable link".

### B1.9) New tab link ###

#### B1.9.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title' target="_blank"></a>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.9.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title' target="_blank">`_text only contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".

Expected outcome(s):
  1. metalmouth should say "Interactable link opens in a new tab".
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "text only contents".

#### B1.9.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title' target="_blank">`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".

Expected outcome(s):
  1. metalmouth should say "Interactable link opens in a new tab".
  1. metalmouth should say "appropriate title".

#### B1.9.4) Target attribute set to "new" ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='appropriate title' target='new'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".

Expected outcome(s):
  1. metalmouth should say "Interactable Link opens in a new tab".
  1. metalmouth should say "appropriate title".

#### B1.9.5) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' target='_blank'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".

Expected outcome(s):
  1. metalmouth should say "Interactable Link opens in a new tab".

#### B1.9.6) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<a href='url' title='' target='_blank'>`_some html contents_`</a>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab link".

Expected outcome(s):
  1. metalmouth should say "Interactable Link opens in a new tab".

### B1.10) Section ###

#### B1.10.1) Formed from SECTION element - no contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section></section>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.10.2) Formed from SECTION element - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section>`_text only contents_`</section>`

Action(s):
  1. Press down arrow until current OSEM is the defined "section".

Expected outcome(s):
  1. metalmouth should say "section".
  1. metalmouth should say "text only contents".

#### B1.10.3) Formed from SECTION element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section>`_some html contents_`</section>`

Action(s):
  1. Press down arrow until current OSEM is the defined "section".

Expected outcome(s):
  1. metalmouth should say "section".

#### B1.10.4) Formed from DIV element - no contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div></div>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.10.5) Formed from DIV element - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div>`_text only contents_`</div>`

Action(s):
  1. Press down arrow until current OSEM is the defined "section".

Expected outcome(s):
  1. metalmouth should say "section".
  1. metalmouth should say "text only contents".

#### B1.10.6) Formed from DIV element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div>`_some html contents_`</div>`

Action(s):
  1. Press down arrow until current OSEM is the defined "section".

Expected outcome(s):
  1. metalmouth should say "section".

### B1.11) Article ###

#### B1.11.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<article></article>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.11.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<article>`_text only contents_`</article>`

Action(s):
  1. Press down arrow until current OSEM is the defined "article".

Expected outcome(s):
  1. metalmouth should say "article".
  1. metalmouth should say "text only contents".

#### B1.11.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<article>`_some html contents_`</article>`

Action(s):
  1. Press down arrow until current OSEM is the defined "article".

Expected outcome(s):
  1. metalmouth should say "article".

### B1.12) Level 1 - 6 headers ###

#### B1.12.1) Formed from H1 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h1>`_text only content_`</h1>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 1 header".

Expected outcome(s):
  1. metalmouth should say "level 1 header".
  1. metalmouth should say "text only content".

#### B1.12.2) Formed from H1 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h1>`_html content_`</h1>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 1 header".

Expected outcome(s):
  1. metalmouth should say "level 1 header".

#### B1.12.3) Formed from H2 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h2>`_text only content_`</h2>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 2 header".

Expected outcome(s):
  1. metalmouth should say "level 2 header".
  1. metalmouth should say "text only content".

#### B1.12.4) Formed from H2 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h2>`_html content_`</h2>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 2 header".

Expected outcome(s):
  1. metalmouth should say "level 2 header".

#### B1.12.5) Formed from H3 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h3>`_text only content_`</h3>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 3 header".

Expected outcome(s):
  1. metalmouth should say "level 3 header".
  1. metalmouth should say "text only content".

#### B1.12.6) Formed from H3 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h3>`_html content_`</h3>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 3 header".

Expected outcome(s):
  1. metalmouth should say "level 3 header".

#### B1.12.7) Formed from H4 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h4>`_text only content_`</h4>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 4 header".

Expected outcome(s):
  1. metalmouth should say "level 4 header".
  1. metalmouth should say "text only content".

#### B1.12.8) Formed from H4 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h4>`_html content_`</h4>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 4 header".

Expected outcome(s):
  1. metalmouth should say "level 4 header".

#### B1.12.9) Formed from H5 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h5>`_text only content_`</h5>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 5 header".

Expected outcome(s):
  1. metalmouth should say "level 5 header".
  1. metalmouth should say "text only content".

#### B1.12.10) Formed from H5 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h5>`_html content_`</h5>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 5 header".

Expected outcome(s):
  1. metalmouth should say "level 5 header".

#### B1.12.11) Formed from H6 element - text content only ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h6>`_text only content_`</h6>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 6 header".

Expected outcome(s):
  1. metalmouth should say "level 6 header".
  1. metalmouth should say "text only content".

#### B1.12.12) Formed from H6 element - html content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<h6>`_html content_`</h6>`

Action(s):
  1. Press down arrow until current OSEM is the defined "level 6 header".

Expected outcome(s):
  1. metalmouth should say "level 6 header".

### B1.13) Paragraph ###

#### B1.13.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p></p>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.13.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>`_text only contents_`</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "paragraph".

Expected outcome(s):
  1. metalmouth should say "paragraph".
  1. metalmouth should say "text only contents".

#### B1.13.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>`_some html contents_`</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "article".

Expected outcome(s):
  1. metalmouth should say "paragraph".

### B1.13) Quote ###

#### B1.13.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote></blockquote>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.13.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote>`_text only contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote".

Expected outcome(s):
  1. metalmouth should say "quote".
  1. metalmouth should say "text only contents".

#### B1.13.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote>`_some html contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote".

Expected outcome(s):
  1. metalmouth should say "quote".

### B1.14) Quote link ###

#### B1.14.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='url' title='appropriate title'></blockquote>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.14.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='url' title='appropriate title'>`_text only contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote link".

Expected outcome(s):
  1. metalmouth should say "Interactable quote link".
  1. metalmouth should say "appropriate title".
  1. metalmouth should say "text only contents".

#### B1.14.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='url' title='appropriate title'>`_some html contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote link".

Expected outcome(s):
  1. metalmouth should say "Interactable quote link".
  1. metalmouth should say "appropriate title".

#### B1.14.4) No title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='url'>`_some html contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote link".

Expected outcome(s):
  1. metalmouth should say "Interactable quote link".

#### B1.14.5) Null title attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<blockquote cite='url' title=''>`_some html contents_`</blockquote>`

Action(s):
  1. Press down arrow until current OSEM is the defined "quote link".

Expected outcome(s):
  1. metalmouth should say "Interactable quote link".

### B1.15) Insertion ###

#### B1.15.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ins datetime='2011-05-17T13:25:01'></ins>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.15.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ins datetime='2011-05-17T13:25:01'>`_text only contents_`</ins>`

Action(s):
  1. Press down arrow until current OSEM is the defined "insertion".

Expected outcome(s):
  1. metalmouth should say "Insertion".
  1. metalmouth should say "The following was inserted into the page on the".
  1. metalmouth should say "17th May 2011 at 13.25".
  1. metalmouth should say "text only contents".

#### B1.15.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ins datetime='2011-05-17T13:25:01'>`_some html contents_`</ins>`

Action(s):
  1. Press down arrow until current OSEM is the defined "insertion".

Expected outcome(s):
  1. metalmouth should say "Insertion".
  1. metalmouth should say "The following was inserted into the page on the".
  1. metalmouth should say "17th May 2011 at 13.25".

#### B1.15.4) No datetime attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ins>`_some html contents_`</ins>`

Action(s):
  1. Press down arrow until current OSEM is the defined "insertion".

Expected outcome(s):
  1. metalmouth should say "Insertion".

### B1.16) Deletion ###

#### B1.16.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<del datetime='2011-05-17T13:25:01'></del>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.16.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<del datetime='2011-05-17T13:25:01'>`_text only contents_`</del>`

Action(s):
  1. Press down arrow until current OSEM is the defined "deletion".

Expected outcome(s):
  1. metalmouth should say "Deletion".
  1. metalmouth should say "The following was deleted from the page on the".
  1. metalmouth should say "17th May 2011 at 13.25".
  1. metalmouth should say "text only contents".

#### B1.16.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<del datetime='2011-05-17T13:25:01'>`_some html contents_`</del>`

Action(s):
  1. Press down arrow until current OSEM is the defined "deletion".

Expected outcome(s):
  1. metalmouth should say "Deletion".
  1. metalmouth should say "The following was deleted into the page on the".
  1. metalmouth should say "17th May 2011 at 13.25".

#### B1.16.4) No datetime attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<del>`_some html contents_`</del>`

Action(s):
  1. Press down arrow until current OSEM is the defined "insertion".

Expected outcome(s):
  1. metalmouth should say "Insertion".

### B1.17) Code ###

#### B1.17.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<code></code>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.17.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<code>`_text only contents_`</code>`

Action(s):
  1. Press down arrow until current OSEM is the defined "code".

Expected outcome(s):
  1. metalmouth should say "code".
  1. metalmouth should say "text only contents".

#### B1.17.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<code>`_some html contents_`</code>`

Action(s):
  1. Press down arrow until current OSEM is the defined "code".

Expected outcome(s):
  1. metalmouth should say "code".

### B1.18) Form ###

#### B1.18.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<form name='appropriateName'></form>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.18.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<form name='appropriateName'>`_text only contents_`</form>`

Action(s):
  1. Press down arrow until current OSEM is the defined "form".

Expected outcome(s):

  1. metalmouth should say "appropriateName".
  1. metalmouth should say "form".
  1. metalmouth should say "text only contents".

#### B1.18.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<form name='appropriateName'>`_some html contents_`</form>`

Action(s):
  1. Press down arrow until current OSEM is the defined "form".

Expected outcome(s):
  1. metalmouth should say "appropriateName".
  1. metalmouth should say "Form".

#### B1.18.4) No name attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<form>`_some html contents_`</form>`

Action(s):
  1. Press down arrow until current OSEM is the defined "form".

Expected outcome(s):
  1. metalmouth should say "Untitled".
  1. metalmouth should say "Form".

### B1.19) Input group ###

#### B1.19.1) Legend ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<fieldset><legend>`_appropriate name_`</legend></fieldset>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input group".

Expected outcome(s):

  1. metalmouth should say "appropriateName".
  1. metalmouth should say "input group".

#### B1.19.2) Empty legend element ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<fieldset><legend></legend></fieldset>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input group".

Expected outcome(s):

  1. metalmouth should say "Untitled".
  1. metalmouth should say "input group".

#### B1.19.3) No legend element and text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<fieldset>text only contents</fieldset>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input group".

Expected outcome(s):

  1. metalmouth should say "Untitled".
  1. metalmouth should say "input group".
  1. metalmouth should say "text only contents".

#### B1.19.4) No legend element and some contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<fieldset><p>some html</p> contents</fieldset>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input group".

Expected outcome(s):

  1. metalmouth should say "Untitled".
  1. metalmouth should say "input group".

#### B1.19.5) No legend element and no contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<fieldset></fieldset>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.20) Text box ###

#### B1.20.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" />`
  1. Enter "hello world" into this text box.

Action(s):
  1. Press down arrow until current OSEM is the defined "text box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable text box".
  1. metalmouth should say "Current value: hello world".

#### B1.20.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="text" />`
  1. Enter "hello world" into this text box.

Action(s):
  1. Press down arrow until current OSEM is the defined "text box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable text box".
  1. metalmouth should say "Current value: hello world".

#### B1.20.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="text" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "text box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable text box".
  1. metalmouth should say "Current value: None".

#### B1.20.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="text" required="required" />`
  1. Enter "hello world" into this text box.

Action(s):
  1. Press down arrow until current OSEM is the defined "text box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable text box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: hello world".

### B1.21) Search box ###

#### B1.21.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" />`
  1. Enter "hello world" into this search box.

Action(s):
  1. Press down arrow until current OSEM is the defined "search box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable search box".
  1. metalmouth should say "Current value: hello world".

#### B1.21.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="search" />`
  1. Enter "hello world" into this search box.

Action(s):
  1. Press down arrow until current OSEM is the defined "search box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable search box".
  1. metalmouth should say "Current value: hello world".

#### B1.21.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="search" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "search box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable search box".
  1. metalmouth should say "Current value: None".

#### B1.21.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="search" required="required" />`
  1. Enter "hello world" into this search box.

Action(s):
  1. Press down arrow until current OSEM is the defined "search box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable search box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: hello world".

### B1.22) Password box ###

#### B1.22.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" />`
  1. Enter "helloworld" into this password box.

Action(s):
  1. Press down arrow until current OSEM is the defined "password box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable password box".
  1. metalmouth should say "Current value: hello world".

#### B1.22.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="password" />`
  1. Enter "helloworld" into this password box.

Action(s):
  1. Press down arrow until current OSEM is the defined "password box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable password box".
  1. metalmouth should say "Current value: hello world".

#### B1.22.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="password" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "password box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable password box".
  1. metalmouth should say "Current value: None".

#### B1.22.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="password" required="required" />`
  1. Enter "helloworld" into this password box.

Action(s):
  1. Press down arrow until current OSEM is the defined "password box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable password box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: hello world".

### B1.23) Telephone box ###

#### B1.23.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" />`
  1. Enter "0123456789" into this telephone box.

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable telephone box".
  1. metalmouth should say "Current value: 0123456789".

#### B1.23.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="tel" />`
  1. Enter "0123456789" into this telephone box.

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable telephone box".
  1. metalmouth should say "Current value: 0123456789".

#### B1.23.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="tel" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable telephone box".
  1. metalmouth should say "Current value: None".

#### B1.23.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" required="required" />`
  1. Enter "0123456789" into this telephone box.

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable telephone box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: 0123456789".

#### B1.23.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="tel" title="Formatted as country code plus number" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "telephone box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable telephone box".
  1. metalmouth should say "Formatted as country code plus number".

### B1.24) Url box ###

#### B1.24.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" />`
  1. Enter "http://www.google.co.uk/" into this url box.

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable url box".
  1. metalmouth should say "Current value: http://www.google.co.uk/".

#### B1.24.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="url" />`
  1. Enter "http://www.google.co.uk/" into this url box.

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable url box".
  1. metalmouth should say "Current value: http://www.google.co.uk/".

#### B1.24.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="url" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable url box".
  1. metalmouth should say "Current value: None".

#### B1.24.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" required="required" />`
  1. Enter "http://www.google.co.uk/" into this url box.

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable url box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: http://www.google.co.uk/".

#### B1.24.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="url" title="Formatted to include http(s)" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "url box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable url box".
  1. metalmouth should say "Formatted to include http(s)".

### B1.25) Email box ###

#### 14.25.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" />`
  1. Enter "test.test@test.com" into this url box.

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable email box".
  1. metalmouth should say "Current value: test.test@test.com".

#### B1.25.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="email" />`
  1. Enter "test.test@test.com" into this email box.

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable email box".
  1. metalmouth should say "Current value: test.test@test.com".

#### B1.25.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="email" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable email box".
  1. metalmouth should say "Current value: None".

#### B1.25.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" required="required" />`
  1. Enter "test.test@test.com" into this email box.

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable email box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: test.test@test.com".

#### B1.25.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="email" title="Formatted as test.test@test.com" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "email box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable email box".
  1. metalmouth should say "Formatted as test.test@test.com".

### B1.26) Number box ###

#### B1.26.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" min="1" max="10" />`
  1. Enter "5" into this datetime box.

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable number box".
  1. metalmouth should say "Current value: 29".

#### B1.26.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="number" min="1" max="10" />`
  1. Enter "5" into this number box.

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable number box".
  1. metalmouth should say "Current value: 29".

#### B1.26.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="number" min="1" max="10" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable number box".
  1. metalmouth should say "Current value: None".

#### B1.26.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" min="1" max="10" required="required" />`
  1. Enter "5" into this email box.

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable number box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: 5".

#### B1.26.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="number" min="1" max="10" title="Enter numbers only" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "number box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable number box".
  1. metalmouth should say "Enter numbers only".

### B1.27) Datetime box ###

#### B1.27.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" />`
  1. Enter "dateTimeFormattedData" into this datetime box.

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable datetime box".
  1. metalmouth should say "Current value: dateTimeFormattedData".

#### B1.27.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="datetime" />`
  1. Enter "dateTimeFormattedData" into this datetime box.

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable datetime box".
  1. metalmouth should say "Current value: dateTimeFormattedData".

#### B1.27.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="datetime" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable datetime box".
  1. metalmouth should say "Current value: None".

#### B1.27.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" required="required" />`
  1. Enter "dateTimeFormattedData" into this email box.

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable datetime box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: dateTimeFormattedData".

#### B1.27.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="datetime" title="Formatted as a datetime" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "datetime box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable datetime box".
  1. metalmouth should say "Formatted as a datetime".

### B1.28) Date box ###

#### B1.28.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" />`
  1. Enter "dateFormattedData" into this date box.

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable date box".
  1. metalmouth should say "Current value: dateFormattedData".

#### B1.28.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="date" />`
  1. Enter "dateFormattedData" into this date box.

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable date box".
  1. metalmouth should say "Current value: dateFormattedData".

#### B1.28.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="date" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable date box".
  1. metalmouth should say "Current value: None".

#### B1.28.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" required="required" />`
  1. Enter "dateFormattedData" into this email box.

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable date box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: dateFormattedData".

#### B1.28.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="date" title="Formatted as a date" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "date box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable date box".
  1. metalmouth should say "Formatted as a date".

### B1.29) Month box ###

#### B1.29.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" />`
  1. Enter "monthFormattedData" into this date box.

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable month box".
  1. metalmouth should say "Current value: monthFormattedData".

#### B1.29.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="month" />`
  1. Enter "monthFormattedData" into this month box.

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable month box".
  1. metalmouth should say "Current value: monthFormattedData".

#### B1.29.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="month" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable month box".
  1. metalmouth should say "Current value: None".

#### B1.29.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" required="required" />`
  1. Enter "monthFormattedData" into this month box.

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable month box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: monthFormattedData".

#### B1.29.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="month" title="Formatted as a month" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "month box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable month box".
  1. metalmouth should say "Formatted as a month".

### B1.30) Week box ###

#### B1.30.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" />`
  1. Enter "weekFormattedData" into this week box.

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable week box".
  1. metalmouth should say "Current value: weekFormattedData".

#### B1.30.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="week" />`
  1. Enter "weekFormattedData" into this week box.

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable week box".
  1. metalmouth should say "Current value: weekFormattedData".

#### B1.30.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="week" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable week box".
  1. metalmouth should say "Current value: None".

#### B1.30.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" required="required" />`
  1. Enter "weekFormattedData" into this week box.

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable week box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: weekFormattedData".

#### B1.30.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="week" title="Formatted as a week" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "week box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable week box".
  1. metalmouth should say "Formatted as a week".

### B1.31) Time box ###

#### B1.31.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" />`
  1. Enter "timeFormattedData" into this time box.

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable time box".
  1. metalmouth should say "Current value: timeFormattedData".

#### B1.31.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="time" />`
  1. Enter "timeFormattedData" into this time box.

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable time box".
  1. metalmouth should say "Current value: timeFormattedData".

#### B1.31.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="time" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable time box".
  1. metalmouth should say "Current value: None".

#### B1.31.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" required="required" />`
  1. Enter "timeFormattedData" into this time box.

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable time box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: timeFormattedData".

#### B1.31.5) Label / text value / title providing format information ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="time" title="Formatted as a time" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "time box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable time box".
  1. metalmouth should say "Formatted as a time".

### B1.32) Range input ###

#### B1.32.1) Label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" />`
  1. Select and enter a value into this range box.

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable range box".
  1. metalmouth should say "Current value: _selected value_".

#### B1.32.2) No label / text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="range" min="1" max="10" />`
  1. Select and enter a value into this range box.

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable range box".
  1. metalmouth should say "Current value: _selected value_".

#### B1.32.3) No label / no text value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="range" min="1" max="10"  />`

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable range box".
  1. metalmouth should say "Current value: None".

#### B1.32.4) Label / text value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="range" min="1" max="10" required="required" />`
  1. Select and enter a value into this range box.

Action(s):
  1. Press down arrow until current OSEM is the defined "range box".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable range box".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: _selected value_".

### B1.33) Check button ###

#### B1.33.1) Label / checked / Formed from input type=radio ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="radio" />`
  1. Check this radio button.

Action(s):
  1. Press down arrow until current OSEM is the defined "check button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable check button".
  1. metalmouth should say "Current value: checked".

#### B1.33.2) Label / checked / Formed from input type=checkbox ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="checkbox" />`
  1. Check this check button.

Action(s):
  1. Press down arrow until current OSEM is the defined "check button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable check button".
  1. metalmouth should say "Current value: checked".

#### B1.33.3) No label ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="checkbox" />`
  1. Uncheck this check button.

Action(s):
  1. Press down arrow until current OSEM is the defined "check button".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable check button".
  1. metalmouth should say "Current value: unchecked".

#### B1.33.4) No label / checked ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="checkbox" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "check button".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable check button".
  1. metalmouth should say "Current value: checked".

#### B1.33.5) Label / checked / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="checkbox"  required="required" />`
  1. Check this check button.

Action(s):
  1. Press down arrow until current OSEM is the defined "check button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable check button".
  1. metalmouth should say "Required".
  1. metalmouth should say "Current value: checked".

### B1.34) Input Button ###

#### B1.34.1) Value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="button" value="label text"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable input button".

#### B1.34.2) Null value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="button" value=""/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "input button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable input button".

#### B1.34.3) No value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="button" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "input button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable input button".

### B1.35) Submit button ###

#### B1.35.1) Value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="submit" value="label text"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "submit button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable submit button".

#### B1.35.2) Null value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="submit" value=""/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "submit button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable submit button".

#### B1.35.3) No value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="submit" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "submit button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable submit button".

### B1.36) Reset button ###

#### B1.36.1) Value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="reset" value="label text"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "reset button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable reset button".

#### B1.36.2) Null value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="reset" value=""/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "reset button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable reset button".

#### B1.36.3) No value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" type="reset" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "reset button".

Expected outcome(s):

  1. metalmouth should say "unlabelled".
  1. metalmouth should say "Interactable reset button".

### B1.37) Image button ###

#### B1.37.1) Label + alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" type="image" src="test.png" alt="altForImage" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "image button".

Expected outcome(s):

  1. metalmouth should say "label text + altForImage".
  1. metalmouth should say "Interactable image button".

#### B1.37.2) Label / no alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" src="test.png" src="test.png" type="image" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "image button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable image button".

#### B1.37.3)No label / alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" src="test.png" type="image" alt="altForImage" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "image button".

Expected outcome(s):

  1. metalmouth should say "altForImage".
  1. metalmouth should say "Interactable image button".

#### B1.37.4)Label / null alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><input id="inputId" src="test.png" type="image" alt="" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "image button".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable image button".

#### B1.37.5) No label / no alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<input id="inputId" src="test.png" type="image" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "image button".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable image button".

### B1.38) Button ###

#### B1.38.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<button type="button"></button>`

Action(s):
  1. Press down arrow until current OSEM is the defined "button".

Expected outcome(s):

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.38.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<button type="button">_text only content_</button>`

Action(s):
  1. Press down arrow until current OSEM is the defined "button".

Expected outcome(s):

  1. metalmouth should say "_text only content_".
  1. metalmouth should say "Interactable button".

#### B1.38.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<button type="button" title="hello">_some html content_</button>`

Action(s):
  1. Press down arrow until current OSEM is the defined "button".

Expected outcome(s):

  1. metalmouth should say the inner text value generated from "some html content", if the inner text value is "" metlamouth will say "Unlabelled".
  1. metalmouth should say "Interactable button".

### B1.39) Single select (drop-down menu with one selectable option) ###

#### B1.39.1) Label / selected value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId"><option id="1">Hello World</option></select>`
  1. Select an option in this select menu.

Action(s):
  1. Press down arrow until current OSEM is the defined "Single select drop-down".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable Single select drop-down".
  1. metalmouth should say "Current value: selected option".

#### B1.39.2) No label / selected value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId"><option id="1">Hello World</option></select>`
  1. Select an option in this select menu.

Action(s):
  1. Press down arrow until current OSEM is the defined "Single select drop-down".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable Single select drop-down".
  1. metalmouth should say "Current value: selected option".

#### B1.39.3) No label / no selected value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId"><option id="1">Hello World</option></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "Single select drop-down".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable Single select drop-down".
  1. metalmouth should say "Current value: None".

#### B1.39.4) Label / no selected value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId" required="required"><option id="1">Hello World</option></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "Interactable Single select drop-down".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable Single select drop-down".
  1. metalmouth should say "Required".

#### B1.39.5) Label / No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId"></select>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.39.6) No label / No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId"></select>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.40) Multi select (drop-down menu with multiple selectable options) ###

#### B1.40.1) Label / multiple selected values ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId" multiple="multiple"><option id="1">_option 1 text_</option><option id="2">_option 2 text_</option></select>`
  1. Both options have been selected in this select menu.

Action(s):
  1. Press down arrow until current OSEM is the defined "Multi select drop-down".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable Multi select drop-down".
  1. metalmouth should say "Current selected values option 1 text, option 2 text".

#### B1.40.2) No label / multiple selected values ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId" multiple="multiple"><option id="1">_option 1 text_</option><option id="2">_option 2 text_</option></select>`
  1. Both options have been selected in this select menu.

Action(s):
  1. Press down arrow until current OSEM is the defined "Multi select drop-down".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable Multi select drop-down".
  1. metalmouth should say "Current selected values option 1 text, option 2 text".

#### B1.40.3) No label / single selected value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId" multiple="multiple"><option id="1">_option 1 text_</option><option id="2">_option 2 text_</option></select>`
  1. First option has been selected in this select menu.

Action(s):
  1. Press down arrow until current OSEM is the defined "Multi select drop-down".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable Multi select drop-down".
  1. metalmouth should say "Current value: option 1 text".

#### B1.40.4) No label / no selected value ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId" multiple="multiple"><option id="1">_option 1 text_</option><option id="2">_option 2 text_</option></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "Multi select drop-down".

Expected outcome(s):

  1. metalmouth should say "Unlabelled".
  1. metalmouth should say "Interactable Multi select drop-down".
  1. metalmouth should say "No selected values".

#### B1.40.5) Label / no selected value / required ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId" multiple="multiple" required="required"><option id="1">_option 1 text_</option><option id="2">_option 2 text_</option></select>`

Action(s):
  1. Press down arrow until current OSEM is the defined "Interactable Multi select drop-down".

Expected outcome(s):

  1. metalmouth should say "label text".
  1. metalmouth should say "Interactable Multi select drop-down".
  1. metalmouth should say "Required".

#### B1.40.6) Label / No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<label for="inputId">`_label text_`</label><select id="inputId" multiple="multiple"></select>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.40.7) No label / No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<select id="inputId" multiple="multiple"></select>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.41) Bulleted list ###

#### B1.41.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ul></ul>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.41.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ul>text only contents</ul>`

Action(s):
  1. Press down arrow until current OSEM is the defined "bulleted list".

Expected outcome(s):
  1. metalmouth should say "bulleted list".
  1. metalmouth should say "no items listed".

#### B1.41.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ul><li>item1</li><li>item2</li><li>item3</li></ul>`

Action(s):
  1. Press down arrow until current OSEM is the defined "bulleted list".

Expected outcome(s):
  1. metalmouth should say "bulleted list".
  1. metalmouth should say "3 items listed".

#### B1.41.4) One menu item ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ul><li>item1</li></ul>`

Action(s):
  1. Press down arrow until current OSEM is the defined "bulleted list".

Expected outcome(s):
  1. metalmouth should say "bulleted list".
  1. metalmouth should say "1 item listed".

### B1.42) Numbered list ###

#### B1.42.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol></ol>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.42.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol>text only contents</ol>`

Action(s):
  1. Press down arrow until current OSEM is the defined "ordered list".

Expected outcome(s):
  1. metalmouth should say "ordered list".
  1. metalmouth should say "no items listed".

#### B1.42.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol><li>item1</li><li>item2</li><li>item3</li></ol>`

Action(s):
  1. Press down arrow until current OSEM is the defined "ordered list".

Expected outcome(s):
  1. metalmouth should say "ordered list".
  1. metalmouth should say "3 items listed".

#### B1.42.4) One menu item ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol><li>item1</li></ol>`

Action(s):
  1. Press down arrow until current OSEM is the defined "ordered list".

Expected outcome(s):
  1. metalmouth should say "ordered list".
  1. metalmouth should say "1 item listed".

### B1.43) List item ###

#### B1.43.1) list item - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol><li>Hello World 1</li><li><p>Hello World 2</p></li><li></li></ol>`

Action(s):
  1. Press down arrow until current OSEM is the first list item in the "ordered list".

Expected outcome(s):
  1. metalmouth should say "list item 1".
  1. metalmouth should say "Hello World 1".

#### B1.43.2) list item - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol><li>Hello World 1</li><li><p>Hello World 2</p></li><li></li></ol>`

Action(s):
  1. Press down arrow until current OSEM is the second list item in the "ordered list".

Expected outcome(s):
  1. metalmouth should say "list item 2".

#### B1.43.3) list item - no content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<ol><li>Hello World 1</li><li><p>Hello World 2</p></li><li></li></ol>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.44) Map ###

#### B1.44.1) Title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map title="title text">`_some html content_ `</map>`

Action(s):
  1. Press down arrow until current OSEM is the defined "map".

Expected outcome(s):

  1. metalmouth should say "title text".
  1. metalmouth should say "map".

#### B1.44.2) Null title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map title="">`_some html content_ `</map>`

Action(s):
  1. Press down arrow until current OSEM is the defined "map".

Expected outcome(s):

  1. metalmouth should say "untitled".
  1. metalmouth should say "map".

#### B1.44.3) No title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map>`_some html content_ `</map>`

Action(s):
  1. Press down arrow until current OSEM is the defined "map".

Expected outcome(s):

  1. metalmouth should say "untitled".
  1. metalmouth should say "map".

#### B1.44.4) No content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<map></map>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.45) Map area ###

#### B1.45.1) Alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" alt="altValue" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area".
  1. metalmouth should say "altValue".

#### B1.45.2) Null alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" alt="" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area".
  1. metalmouth should say "Untitled".

#### B1.45.3) No alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area".
  1. metalmouth should say "Untitled".

### B1.46) New Tab Map area ###

#### B1.46.1) Alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" alt="altValue" target="_blank"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area opens in a new tab".
  1. metalmouth should say "altValue".

#### B1.46.2) Null alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" alt="" target="_blank"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area opens in a new tab".
  1. metalmouth should say "Untitled".

#### B1.46.3) No alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<area shape="rect" coords="0,0,100,100" href="test.html" target="_blank"/>`

Action(s):
  1. Press down arrow until current OSEM is the defined "new tab map area".

Expected outcome(s):

  1. metalmouth should say "Interactable Map area opens in a new tab".
  1. metalmouth should say "Untitled".

### B1.47) Data table ###

#### B1.47.1) Summary / Some contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="tableSummary">`_some contents_`</table>`

Action(s):
  1. Press down arrow until current OSEM is the defined "table".

Expected outcome(s):

  1. metalmouth should say "Data table".
  1. metalmouth should say "tableSummary".

#### B1.47.2) Null summary / Some contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="tableSummary">`_some contents_`</table>`

Action(s):
  1. Press down arrow until current OSEM is the defined "table".

Expected outcome(s):

  1. metalmouth should say "Data table".
  1. metalmouth should say "No summary".

#### B1.47.3) No summary / Some contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table>`_some contents_`</table>`

Action(s):
  1. Press down arrow until current OSEM is the defined "table".

Expected outcome(s):

  1. metalmouth should say "Data table".
  1. metalmouth should say "No summary".

#### B1.47.4) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table></table>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B1.48) Header cell ###

#### B1.48.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<th></th>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B1.48.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<th>`_text only contents_`</th>`

Action(s):
  1. Press down arrow until current OSEM is the defined "header cell".

Expected outcome(s):
  1. metalmouth should say "header cell".
  1. metalmouth should say "text only contents".

#### B1.48.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<th>`_some html contents_`</th>`

Action(s):
  1. Press down arrow until current OSEM is the defined "header cell".

Expected outcome(s):
  1. metalmouth should say "header cell".

### B1.49) Data cell ###

#### B1.49.1) No contents / headers ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="this is a real datatable about planes"><tr><th role="presentation"></th><th id="column1">Mono plane</th><th id="column2">Bi plane</th><th id="column3">Tri plane</th></tr><tr><th id="row1">Number of Wings</th><td headers="column1, row1">1</td><td headers="column2, row1"><span>2</span></td><td headers="column3, row1"></td></tr></table>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for the empty TD element.

#### B1.49.2) Text only contents / headers ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="this is a real datatable about planes"><tr><th role="presentation"></th><th id="column1">Mono plane</th><th id="column2">Bi plane</th><th id="column3">Tri plane</th></tr><tr><th id="row1">Number of Wings</th><td headers="column1, row1">1</td><td headers="column2, row1"><span>2</span></td><td headers="column3, row1"></td></tr></table>`

Action(s):
  1. Press down arrow until current OSEM is the first "data cell" in this table.

Expected outcome(s):
  1. metalmouth should say "data cell".
  1. metalmouth should say "relates to Mono plane and number of wings".
  1. metalmouth should say "cell value 1".

#### B1.49.3) Some html contents / headers ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="this is a real datatable about planes"><tr><th role="presentation"></th><th id="column1">Mono plane</th><th id="column2">Bi plane</th><th id="column3">Tri plane</th></tr><tr><th id="row1">Number of Wings</th><td headers="column1, row1">1</td><td headers="column2, row1"><span>2</span></td><td headers="column3, row1"></td></tr></table>`

Action(s):
  1. Press down arrow until current OSEM is the second "data cell" in this table.

Expected outcome(s):
  1. metalmouth should say "data cell".
  1. metalmouth should say "relates to bi plane and number of wings".

#### B1.49.4) Some html contents / No headers attribute ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="this is a real datatable about planes"><tr><th role="presentation"></th><th id="column1">Mono plane</th><th id="column2">Bi plane</th><th id="column3">Tri plane</th></tr><tr><th id="row1">Number of Wings</th><td headers="column1, row1">1</td><td><span>2</span></td><td headers="column3, row1"></td></tr></table>`

Action(s):
  1. Press down arrow until current OSEM is the second "data cell" in this table.

Expected outcome(s):
  1. metalmouth should say "data cell".
  1. metalmouth should say "No specified row or column".

#### B1.49.5) Some html contents / headers attribute / missing id ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<table summary="this is a real datatable about planes"><tr><th role="presentation"></th><th id="column1">Mono plane</th><th>Bi plane</th><th id="column3">Tri plane</th></tr><tr><th id="row1">Number of Wings</th><td headers="column1, row1">1</td><td headers="column2, row1"><span>2</span></td><td headers="column3, row1"></td></tr></table>`

Action(s):
  1. Press down arrow until current OSEM is the second "data cell" in this table.

Expected outcome(s):
  1. metalmouth should say "data cell".
  1. metalmouth should say "relates to number of wings".

### B1.50) Audio ###

#### B1.50.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/test.ogg" controls="controls"></audio>`

Action(s):
  1. Press down arrow until current OSEM is the defined "audio".

Expected outcome(s):
  1. metalmouth should say "Interactable Audio".
  1. metalmouth should say "Untitled".

#### B1.50.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/test.ogg" controls="controls">_text only contents_</audio>`

Action(s):
  1. Press down arrow until current OSEM is the defined "audio".

Expected outcome(s):
  1. metalmouth should say "Interactable Audio".
  1. metalmouth should say "Untitled".

#### B1.50.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" src="http://www.test.com/html5/test.ogg" controls="controls">_some html contents_</audio>`

Action(s):
  1. Press down arrow until current OSEM is the defined "audio".

Expected outcome(s):
  1. metalmouth should say "Interactable Audio".
  1. metalmouth should say "Untitled".

#### B1.50.4) No contents / title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<audio id="audioClip" title="audioTitle" src="http://www.test.com/html5/test.ogg" controls="controls">_some html contents_</audio>`

Action(s):
  1. Press down arrow until current OSEM is the defined "audio".

Expected outcome(s):
  1. metalmouth should say "Interactable Audio".
  1. metalmouth should say "Entitled".
  1. metalmouth should say "audioTitle".

### B1.51) Video ###

#### B1.51.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/test.ogg"></video>`

Action(s):
  1. Press down arrow until current OSEM is the defined "video".

Expected outcome(s):
  1. metalmouth should say "Interactable Video".
  1. metalmouth should say "Untitled".

#### B1.51.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/test.ogg">_text only contents_</video>`

Action(s):
  1. Press down arrow until current OSEM is the defined "video".

Expected outcome(s):
  1. metalmouth should say "Interactable Video".
  1. metalmouth should say "Untitled".

#### B1.51.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" src="http://www.test.com/html5/test.ogg">_some html contents_</video>`

Action(s):
  1. Press down arrow until current OSEM is the defined "video".

Expected outcome(s):
  1. metalmouth should say "Interactable Video".
  1. metalmouth should say "Untitled".

#### B1.51.4) No contents / title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<video id="videoClip" title="videoTitle" src="http://www.test.com/html5/test.ogg">_some html contents_</video>`

Action(s):
  1. Press down arrow until current OSEM is the defined "video".

Expected outcome(s):
  1. metalmouth should say "Interactable video".
  1. metalmouth should say "Entitled".
  1. metalmouth should say "videoTitle".

### B1.52) Canvas ###

#### B1.52.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<canvas id="canvas"></canvas>`

Action(s):
  1. Press down arrow until current OSEM is the defined "canvas".

Expected outcome(s):
  1. metalmouth should say "Canvas".
  1. metalmouth should say "Untitled".

#### B1.52.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<canvas id="canvas">_text only contents_</canvas>`

Action(s):
  1. Press down arrow until current OSEM is the defined "canvas".

Expected outcome(s):
  1. metalmouth should say "Canvas".
  1. metalmouth should say "Untitled".

#### B1.52.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<canvas id="canvas">_some html contents_</canvas>`

Action(s):
  1. Press down arrow until current OSEM is the defined "canvas".

Expected outcome(s):
  1. metalmouth should say "Canvas".
  1. metalmouth should say "Untitled".

#### B1.52.4) No contents / title ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<canvas id="canvas" title="canvasTitle"></canvas>`

Action(s):
  1. Press down arrow until current OSEM is the defined "canvas".

Expected outcome(s):
  1. metalmouth should say "Canvas".
  1. metalmouth should say "Entitled".
  1. metalmouth should say "canvasTitle".

### B1.53) Semantic image ###

#### B1.53.1) Alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<img src="test.png" alt="altValue" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "semantic image".

Expected outcome(s):

  1. metalmouth should say "Semantic image".
  1. metalmouth should say "Alternative text".
  1. metalmouth should say "altValue".

#### B1.53.2) Null alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<img src="test.png" alt="" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "semantic image".

Expected outcome(s):

  1. metalmouth should say "Semantic image".
  1. metalmouth should say "No alternative text".

#### B1.53.3) No alt ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<img src="test.png" />`

Action(s):
  1. Press down arrow until current OSEM is the defined "semantic image".

Expected outcome(s):

  1. metalmouth should say "Semantic image".
  1. metalmouth should say "No alternative text".


---

## B2) OSEM items (on focus) - WAI-ARIA based ##
### B2.1) Menu item ###

#### B2.1.1) menu item - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type="list"><li role="menuitem">Hello World 1</li><li role="menuitem"><p>Hello World 2</p></li><li role="menuitem"></li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the first list item in the "menu".

Expected outcome(s):
  1. metalmouth should say "menu item 1".
  1. metalmouth should say "Hello World 1".

#### B2.1.2) menu item - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type="list"><li role="menuitem">Hello World 1</li><li role="menuitem"><p>Hello World 2</p></li><li role="menuitem"></li></menu>`

Action(s):
  1. Press down arrow until current OSEM is the second list item in the "menu".

Expected outcome(s):
  1. metalmouth should say "menu item 2".

#### B2.1.3) menu item - no content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<menu type="list"><li role="menuitem">Hello World 1</li><li role="menuitem"><p>Hello World 2</p></li><li role="menuitem"></li></menu>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

### B2.2) Main content area ###

#### B2.2.1) Formed from SECTION element - no contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section role="main"></section>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this empty element.

#### B2.2.2) Formed from SECTION element - text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section role="main">`_text only contents_`</section>`

Action(s):
  1. Press down arrow until current OSEM is the defined "main content area".

Expected outcome(s):
  1. metalmouth should say "Main content area".
  1. metalmouth should say "text only contents".

#### B2.2.3) Formed from SECTION element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<section role="main">`_some html contents_`</section>`

Action(s):
  1. Press down arrow until current OSEM is the defined "main content area".

Expected outcome(s):
  1. metalmouth should say "main content area".

#### B2.2.4) Formed from DIV element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div role="main">`_some html contents_`</div>`

Action(s):
  1. Press down arrow until current OSEM is the defined "main content area".

Expected outcome(s):
  1. metalmouth should say "main content area".

### B2.3) Any element with role=presentation ###

#### B2.3.1) Formed from DIV element - some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div role="presentation">_some html contents_</div>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.

#### B2.3.2) Formed from IMG element ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<img role="presentation" src="decorative.png" />`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.


---

## B3) Special OSEM items (on focus) - Node based, rather than element based ##

### B3.1) Inline content ###

#### B3.1.1) SPAN - Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>Hello <span>there</span> World</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "paragraph".
  1. Press down arrow twice.

Expected outcome(s):
  1. metalmouth should say "inline content".
  1. metalmouth should say "there".

#### B3.1.2) SPAN - Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>Hello <span>here and <a href="text.com">there</a></span> World</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "paragraph".
  1. Press down arrow twice.

Expected outcome(s):
  1. metalmouth should say "inline content".

#### B3.1.3) SPAN - Only html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>Hello <span><a href="text.com">there</a></span> World</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "paragraph".
  1. Press down arrow twice.

Expected outcome(s):
  1. metalmouth should say "inline content".

#### B3.1.4) SPAN - No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<p>Hello <span></span> World</p>`

Action(s):
  1. Press down arrow until current OSEM is the defined "paragraph".
  1. Press down arrow twice.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.

### B3.2) Sentence ###

#### B3.2.1) Child of Body element ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<body><span>Hello World</span></body>`

Action(s):
  1. Press down arrow until current OSEM is the defined "sentence".
  1. Press down arrow once.

Expected outcome(s):
  1. metalmouth should say "sentence".
  1. metalmouth should say "Hello world".

### B3.3) Text ###

#### B3.3.1) Child of Body element ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<body>Hello World</body>`

Action(s):
  1. Press down arrow once.

Expected outcome(s):
  1. metalmouth should say "Hello world".

#### B3.3.2) DIV - some text content ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<div>Hello <p>World</p></div>`

Action(s):
  1. Press down arrow until current OSEM is the defined "section".
  1. Press down arrow once.

Expected outcome(s):
  1. metalmouth should say "Hello".


---

## B4) Unsupported elements ##

### B4.1) General ###

#### B4.1.1) No contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<center></center>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.

#### B4.1.2) Text only contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<center>Hello world</center>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.

#### B4.1.3) Some html contents ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. New tab has been opened.
  1. metalmouth has started to read all.
  1. Space bar has been pressed.
  1. The following code should be present in the DOM:
`<center><span>Hello world</span></center>`

Action(s):
  1. Press down arrow until last OSEM has been read.

Expected outcome(s):
  1. No OSEM item should have been formed for this element.  The contents should still be reachable, and readable.


---
