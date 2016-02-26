# Use Cases - Metalmouth Voice Input #

For quality assurance, starting from the soon to be release version 1.8.0 of the metalmouth extension.  Project metalmouth will try its best to ensure that all of the following use cases work, but a release candidate which satisfies use case series A, B and C can still be released. This document is incomplete and will be added to shortly, and updated over time.


---


## D1) Voice Input ##

### D1.1) Unselected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been unselected.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Right click the mouse.

Expected outcome(s):
  1. Nothing should happen.

### D1.2) Selected ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been selected.
  1. The options page has been saved and closed, using the save & close button.

Action(s):
  1. Right click the mouse.

Expected outcome(s):
  1. metalmouth should say "Voice input available".

### D1.3) Triggering voice command input ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been selected.
  1. The options page has been saved and closed, using the save & close button.
  1. User wearing headphones.
  1. Right click the mouse.
  1. metalmouth should say "Voice input available".

Action(s):
  1. Left click the mouse.

Expected outcome(s):
  1. metalmouth should say "speak now".

### D1.4) Inputting voice command - unknown command ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been selected.
  1. The options page has been saved and closed, using the save & close button.
  1. User wearing headphones.
  1. Right click the mouse.
  1. metalmouth should say "Voice input available".
  1. Left click the mouse.
  1. metalmouth should say "speak now".

Action(s):
  1. Say "Hello"

Expected outcome(s):
  1. metalmouth should say "command not recognised.  Try again".

### D1.5) Inputting voice command - known commands ###

#### D1.5.1) Next ####
???
#### D1.5.2) Previous ####
???
#### D1.5.3) Do ####
???
#### D1.5.4) Continue ####
???
#### D1.5.5) Jump ####
???
#### D1.5.6) Options ####

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been selected.
  1. The options page has been saved and closed, using the save & close button.
  1. User wearing headphones.
  1. Right click the mouse.
  1. metalmouth should say "Voice input available".
  1. Left click the mouse.
  1. metalmouth should say "speak now".

Action(s):
  1. Say "Options"

Expected outcome(s):
  1. metalmouth should say "command options recognised" then redirect tab to the metalmouth options page.

#### D1.5.7) Location ####
???

### D1.6) No speech heard ###

Precondition(s):
  1. metalmouth extension is installed.
  1. metalmouth extension is on - metalmouth icon button shows an open mouth.
  1. The "voice input" option has been selected.
  1. The options page has been saved and closed, using the save & close button.
  1. User wearing headphones.
  1. Right click the mouse.
  1. metalmouth should say "Voice input available".
  1. Left click the mouse.
  1. metalmouth should say "speak now".

Action(s):
  1. Be silent.

Expected outcome(s):
  1. After a few seconds metalmouth should say "No speech heard.  Try again".


---
