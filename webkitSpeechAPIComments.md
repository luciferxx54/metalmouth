# Using x-webkit-speech enabled voice input #

This short overview is intended to explain how the Project metalmouth extension utilises Google's implementation of the HTML Speech Input API. It is incomplete and will be added to over time.

## HTML5 Speech Input API ##

Google's implementation of the HTML5 Speech Input API allows HTML text input elements to be defined as able to accept voice input - simply by giving the HTML input element the x-webkit-speech attribute:

<input type="text" id="voiceInput" x-webkit-speech />

### How it works ###

After activating the speech input (clicking on the microphone or keyboard shortcut):

  1. Focus is lost on the input element (which Project metalmouth uses to say 'speak now');
  1. The microphone records what you say;
  1. What the microphone collected is sent somewhere (I'll call it Google's off-site speech recognition system) for analysis;
  1. If what the microphone collected is not recognised a model box opens with options to 'cancel' or 'try again'; or
  1. If what the microphone collected was recognised the onspeechchange event is fired and the top match result placed in the input box.

## Event-handlers ##

### onspeechchange ###

This is fired when Google's off-site speech recognition system returns what it believes to be a reliable match to what has been said (best guess, with highest reliability).

The event returns alot more useful information, including the top five guesses (best + rest)...  The additional guesses matched against the set of supported voice commands allows the Project metalmouth extension to be that little bit more intelligent when guessing what the user said...

### onspeechstart ###

Not used...

### onspeechstop ###

Not used...

## Limitations for users with visual disabilities ##

  * When the focus is lost on the input, and what the microphone collected is not recognised a model box opens.  This modal box is provided via the OS, and as such not possible for Project metalmouth to detect or a user to operate.  An onnotrecognised event would be great!
  * The necessity to use mouse or keyboard for a voice input control gets frustrating.  The startSpeechInput function specified in the Speech Input API is not yet implemented in x-webkit-speech. However, won't it be wonderful if the input area once operated would stay actively monitoring/listening for any additional commands...