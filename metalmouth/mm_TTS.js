/*

 Project metalmouth - Developing a voice browser extension for Chrome (http://code.google.com/p/metalmouth/)
 Copyright (C) 2011 - Alistair Garrison
 
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

goog.provide('mm_TTS');

console.log("loaded tts");

mm_TTS.getAudio = function(text, enqueue, callbackFunction)
{
	// text - replace . for dot in .co.uk for example
	
	var patternToFindAndReplaceDotInUrl = /(\.)(?=[a-z])/gi;
	text = text.replace(patternToFindAndReplaceDotInUrl, " dot ");		
	
	// text - replace . for point in 45.4 for example
	var patternToFindAndReplaceDotInNumbers = /(\.)(?=[0-9])/gi;
	text = text.replace(patternToFindAndReplaceDotInNumbers, " point ");
	
	var voice = new VoiceModel(text, enqueue.toString()); // svb.speakingRate
	tts(voice, callbackFunction);
}
 
function tts(voice, callbackFunction)
{
	chrome.extension.sendRequest({voice: JSON.stringify(voice)}, function(response) {
		if (callbackFunction != null)
		{
			callbackFunction();
		}
	});
}

function VoiceModel(utterance, enqueue)
{
	this.utterance = utterance;
	this.enqueue = enqueue;
}
	