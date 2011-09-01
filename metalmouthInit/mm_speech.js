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

// temp experimental.tts replacement
var audioStack; //  = new AudioStackModel(); // added

// AUDIO

mm_speech.connect = function()
{
	audioStack = new AudioStackModel();
}

mm_speech.speakEnqueue = function(utterance, callback)
{
	audioStack.speakEnqueue(utterance, callback);
}

mm_speech.speakNext = function()
{
	audioStack.speakNext();
}

mm_speech.speakDirectly = function(utterance, callback)
{
	audioStack.speakDirectly(utterance, callback);
}

function AudioStackModel()
{
	// constructor
	
	var audio = null;

	var audioTimer;
	var audioInUse = false;
	
	var callbackFunction;
	var spoken = true; 
	
	var utterances = [];
	var callbacks = [];
	
	this.speakEnqueue = function(utterance, callback)
	{
		queueSpeak(utterance, callback);
		
		// if nothing is being played 
		
		if (audioInUse == false)
		{
			speakNextInQueue();
		}
	}
	
	this.speakNext = function()
	{
		speakNextInQueue();
	}
	
	this.speakDirectly = function(utterance, callback)
	{
		clearStack();
		speak(utterance, callback);
	}
	
	function speak(utterance, callback)
	{
		callbackFunction = callback;
		
		if (utterance != null)
		{
			if (audioInUse == true)
			{
				audio.pause();
				clearTimeout(audioTimer);
			}
			audio = new Audio();
			
			audio.addEventListener("play", onPlay, false);
			audio.src = getSourceUrl(utterance);
			audio.play();
		}
		
		function onPlay()
		{	
			audioInUse = true;
			
			var currentTimeTracker;
			
			var functionToRun = function()
			{
				if ((audio.currentTime == audio.duration)||(audio.currentTime == currentTimeTracker))
				{
					ended();
				}
				else
				{
					if (audio.currentTime > 0)
					{
						currentTimeTracker = audio.currentTime;
					}
					audioTimer = window.setTimeout(functionToRun, 250);
				}
			};
			audioTimer = window.setTimeout(functionToRun, 250);
		}
	}
	
	function getSourceUrl(utterance)
	{
		var foundationUrl = "http://www.google.com/speech-api/v1/synthesize?lang=en-us&text=";
		return foundationUrl + escape(utterance);
	}
	
	function clearStack()
	{
		utterances = [];
		callbacks = [];
	}
	
	function queueSpeak(utterance, callback)
	{
		utterances[utterances.length] = utterance;
		callbacks[callbacks.length] = callback;
	}
	
	function speakNextInQueue()
	{
		if (utterances.length > 0) 
		{
			var utterance = utterances[0]; // returns first item in array 
			utterances = utterances.slice(1); // removes first;
			var callback = callbacks[0];
			callbacks = callbacks.slice(1);
			speak(utterance, callback);	  
		} 
	}
	
	// Event handlers
	
	function ended()
	{
		audioInUse = false;
		
		try
		{
			if (callbackFunction != null)
			{
				callbackFunction();
			}
		}
		catch(err)
		{
			console.log(err);
		}
	}
}
