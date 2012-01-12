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

goog.provide('mm_speech');

goog.require('mm_applicationData');

var audioStack = null;
var howToSayUtterance = null;

function urlBasedSpeechAvailable()
{
	var req = new XMLHttpRequest();
	req.open("GET", "http://www.google.com/speech-api/v1/synthesize?lang=en-us&text=", false);
	req.send();
	return (req.status==404) ? false : true;
}

mm_speech.speechFunction = null;

mm_speech.speak = function(utterance, callback)
{
	if (!mm_speech.speechFunction)
	{
		if ((navigator.platform == "MacIntel") && (urlBasedSpeechAvailable() == true))
		{
			audioStack = new AudioStackModel();
			mm_speech.speechFunction = speakExtTTS;
		}
		else
		{
			mm_speech.speechFunction = speakIntTTS;
		}
	}
	
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
	
	mm_speech.speechFunction(utterance, callback);
}

function speakIntTTS(utterance, callback)
{
	chrome.tts.stop();
	
	var howToSayUtterance = {
		lang: 'en-US', 
		rate: parseFloat(mm_applicationData.getSpecificData('speechRate')),
		enqueue: false
	};
	
	var functionToRun = function()
	{
		callback();
	};
	
	if (callback != null)
	{
		howToSayUtterance['onEvent'] = function(event) {
			if (event.type == 'interrupted') {
				functionToRun = function()
				{
				};
			}			
			if (event.type == 'end') {
				functionToRun();
			}
		}
	}
	
	if (utterance != null)
	{
		chrome.tts.speak(
			utterance,
			howToSayUtterance
		);
	}
}

function speakExtTTS(utterance, callback)
{
	audioStack.speakDirectly(utterance, callback);
}

function AudioStackModel()
{
	var audio = null;
	
	this.speakDirectly = function(utterance, callback)
	{	
		var handleOnTimeUpdate = function()
		{
			if (audio.currentTime == 9223372013568)
			{
				audio.removeEventListener('timeupdate', handleOnTimeUpdate);
				callback();
			}
		}
		
		var handleOnEnded = function()
		{
			audio.removeEventListener('ended', handleOnEnded);
			callback();
		}
		
		var handleOnDurationChange = function()
		{
			if (audio.duration == "Infinity")
			{
				audio.addEventListener('timeupdate', handleOnTimeUpdate);
			}
			else
			{
				audio.addEventListener('ended', handleOnEnded);
			}
		}
		
		if (utterance != null)
		{
			if (audio){
				if (audio.ended == false)
				{
					audio.pause();
				}
			}
			
			var handlePlay = function()
			{
				audio.src = "";
			}
			
			audio = new Audio();
			audio.addEventListener("play", handlePlay, false);
			
			if (callback) {
				audio.addEventListener('durationchange', handleOnDurationChange); // can add each time because it is a new Audio object each time
			}

			audio.src = "http://www.google.com/speech-api/v1/synthesize?lang=en-us&text=" + escape(utterance);
			audio.play();
		}
	}
}