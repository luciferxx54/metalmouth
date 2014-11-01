/*

 Project metalmouth - Developing a voice browser extension for Chrome (http://code.google.com/p/metalmouth/)
 Copyright (C) 2014 - Alistair Garrison
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

*/

goog.provide('mm_speech');

// goog.require('mm_applicationData');

// var audioStack = null;
var howToSayUtterance = null;

/*
function urlBasedSpeechAvailable() {
	var req = new XMLHttpRequest();
	req.open("GET", "http://www.google.com/speech-api/v1/synthesize?lang=en-us&text=", false);
	req.send();
	return (req.status==404) ? false : true;
}
*/

mm_speech.speechFunction = speakIntTTS;

mm_speech.partsOfLargeUtterance = [];
mm_speech.callback = null;

mm_speech.largeUtterance = function(callback) {
    var tenWordBlock = mm_speech.partsOfLargeUtterance.pop();
    if (tenWordBlock != undefined) {
        mm_speech.speechFunction(tenWordBlock.trim(), mm_speech.largeUtterance);
    }
    else {
        mm_speech.callback();
    }
}

mm_speech.speak = function(utterance, callback) {
	// text - replace . for dot in .co.uk for example
	var patternToFindAndReplaceDotInUrl = /(\.)(?=[a-z])/gi;
	utterance = utterance.replace(patternToFindAndReplaceDotInUrl, " dot ");		
	
	// text - replace . for point in 45.4 for example
	var patternToFindAndReplaceDotInNumbers = /(\.)(?=[0-9])/gi;
	utterance = utterance.replace(patternToFindAndReplaceDotInNumbers, " point ");
	
	utterance = utterance.replace(/\!/g, ' exclamation mark ');
	utterance = utterance.replace(/\?/g, ' question mark ');
	utterance = utterance.replace(/\:/g, ' colon ');
	utterance = utterance.replace(/\//g, ' forward slash ');
	utterance = utterance.replace(/\@/g, ' at ');
	utterance = utterance.replace(/  /g, " ");
                                  
    if (utterance.length > 100) {
        // deal with large utterance
        var splitUtterance = function(utterance) {
            var tenWordBlocks = [];
            var index = 0;
            var words = utterance.split(" ");
            for (i = 0; i < words.length; i++) {
                if (i%10 == 0 && i > 0) {
                    index = index + 1;
                }
                if (tenWordBlocks[index] == undefined) { 
                    tenWordBlocks[index] = ""; 
                }
                tenWordBlocks[index] = tenWordBlocks[index] + " " + words[i];
            }
            return tenWordBlocks.reverse();
        }
        
        mm_speech.partsOfLargeUtterance = splitUtterance(utterance);
        mm_speech.callback = callback;
        mm_speech.largeUtterance(null);
    }
    else {
        mm_speech.speechFunction(utterance, callback);
    }
}
                                  
// here: need to chunck large utterances into 10 word sentences, rather than individual words.

// using modulus % split into 10 word sentences
                                  

                                  
function speakIntTTS(utterance, callback) {
	chrome.tts.stop();
	
	var howToSayUtterance = {
		lang: 'en-US', 
		rate: parseFloat('0.9'),
		enqueue: false
	};
	
	var functionToRun = function() {
		callback();
	};
	
	if (callback != null) {
		howToSayUtterance['onEvent'] = function(event) {		
			if (event.type == 'end') {
				functionToRun();
			}
		}
	}
	
	if (utterance != null) {
		chrome.tts.speak(
			utterance,
			howToSayUtterance
		);
	}
}
                                

/*
function speakIntTTSN(utterance, callback) {
    chrome.tts.stop();
                                  
    var parts = utterance.split(" ");
    parts = parts.reverse();
                                  
    var howToSayWord = {
        lang: 'en-US', 
        rate: parseFloat('0.9'),
        enqueue: false,
        onEvent: function(event) {
            console.log(event.type);
            if (event.type == 'end') {
                var word = parts.pop();
                if (word != undefined) {
                    functionToRun(word);
                }
                else {
                    callback();
                }           
            }
            if (event.type == 'interrupted') {
                    callback();
            }
        }
    };
                        
    var functionToRun = function(word) {
        chrome.tts.speak(word + " ", howToSayWord);
    }
                                  
    functionToRun(parts.pop());
}                                  
*/

/*
function speakExtTTS(utterance, callback) {
	audioStack.speakDirectly(utterance, callback);
}

function AudioStackModel() {
	var audio = null;
	
	this.speakDirectly = function(utterance, callback) {	
		var handleOnTimeUpdate = function() {
			if (audio.currentTime == 9223372013568) {
				audio.removeEventListener('timeupdate', handleOnTimeUpdate);
				callback();
			}
		}
		
		var handleOnEnded = function() {
			audio.removeEventListener('ended', handleOnEnded);
			callback();
		}
		
		var handleOnDurationChange = function() {
			if (audio.duration == "Infinity") {
				audio.addEventListener('timeupdate', handleOnTimeUpdate);
			}
			else {
				audio.addEventListener('ended', handleOnEnded);
			}
		}
		
		if (utterance != null) {
			if (audio) {
				if (audio.ended == false) {
					audio.pause();
				}
			}
			
			audio = new Audio();
			
			if (callback) {
				audio.addEventListener('durationchange', handleOnDurationChange); // can add each time because it is a new Audio object each time
			}
			audio.src = "http://www.google.com/speech-api/v1/synthesize?lang=en-us&text=" + escape(utterance);
			audio.play();
		}
	}
}
*/