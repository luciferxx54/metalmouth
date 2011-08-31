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

// place a start function which contains all start stuff
// then call the start function from the background file

// then do the same for metalmouth - so it calls metalmouth.start()

goog.provide('metalmouthInit.start');

goog.require('mm_speech');

function init(id) 
{
	chrome.tabs.executeScript(id, {file: "metalmouth-compiled.js"}, function(){ 		
		chrome.tabs.executeScript(id, {code:"metalmouth.start();"}, function(){

			var changeTab = function(tabId, changedProps) {
		
			if (tabId != id)
			{
				return; // to prevent Project metalmouth running when other tabs (not this one) are updated 
			}
			if (changedProps.status != "complete")
			{
				return;
			}
					   
			chrome.tabs.onUpdated.removeListener(changeTab);
					   
			init(id);		   
		};
					   
		chrome.tabs.onUpdated.addListener(changeTab);
	});});
}

function test(id)
{
	// this ensures that the page is fully loaded before init runs
	
	var codeToRun = function()
	{
		chrome.tabs.get(id, function(tab)
		{
			if (tab.status != "complete")
			{
				setTimeout(codeToRun,100);
			}
			else
			{
				// this code ensures against multiple loads if the extension is already loaded
		
				var functionToRun = function(){init(id)};
				var timer = window.setTimeout(functionToRun, 500); 
		
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.sendRequest(id, {greeting: "hello"}, function(response) {
						// no extension = no callback
						clearTimeout(timer);
					});
				});
			}
		});
	}
	codeToRun();
}

metalmouthInit.start = function()
{
	mm_speech.connect();
	
	// Listen for a click on the Project metalmouth icon.  
	
	chrome.browserAction.onClicked.addListener(function(tab){test(tab.id);});
	
	// Listen for omnibox keyword 
	
	// temp experimental.tts replacement
	// removed today var audioStack = new AudioStackModel(); // added
	
	// chrome.omnibox.onInputStarted.addListener(function(){chrome.experimental.tts.speak("Press space bar then enter to start Project metalmouth extension")}); temporarily commented out
	chrome.omnibox.onInputStarted.addListener(function(){mm_speech.speakDirectly("Press space bar then enter to start Project metalmouth extension", null)}); // {audioStack.speakDirectly("Press space bar then enter to start Project metalmouth extension", null)});
	
	chrome.omnibox.onInputEntered.addListener(function(text){
											  chrome.tabs.getSelected(null, function(tab)
																	  {
																	  chrome.tabs.update(tab.id, {'url': 'http://labs.google.com/accessible/', 'selected': true}, function(tab){test(tab.id);}); // have to set a start page as permission for chrome://newtab/ is denied
																	  });
											  });
	
	// temp experimental.tts replacement
	
	// AUDIO
	
	// chrome.experimental.tts enqueue does not appear to work - error raised (which cannot be caught) when utterance is stopped prematurely - also tried .stop() and it also did not work
	
	// chrome.experimental.tts has been commented out temporarily as it has become delayed in being taken out of experimental.
	
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
										   // else if (request.voice != undefined)
										   if (request.voice != undefined)
										   {
										   var voice = JSON.parse(request.voice);
										   try
										   {
										   // temp experimental.tts replacement - start
										   // if (enqueue == true)
										   if (voice.enqueue == "true")
										   {  
										   var callbackEnqueue = function()
										   {
										   sendResponse({spoken: "true"});
										   mm_speech.speakNext(); // audioStack.speakNext();
										   }
										   mm_speech.speakEnqueue(voice.utterance, callbackEnqueue); // audioStack.speakEnqueue(voice.utterance, callbackEnqueue);
										   }
										   else
										   {								   
										   var callbackDirect = function()
										   {
										   sendResponse({spoken: "true"}); 		   
										   }
										   mm_speech.speakDirectly(voice.utterance, callbackDirect); // audioStack.speakDirectly(voice.utterance, callbackDirect);
										   }
										   // end 
										   
										   /* temporarily commented out
											chrome.experimental.tts.speak(voice.utterance, {'locale':voice.locale,'rate':parseFloat(voice.rate),'enqueue':enqueue}, function(){
											sendResponse({spoken: "true"});
											});
											*/
										   }
										   catch(err)
										   {
										   console.log(err);
										   }
										   
										   }
										   else
										   {
										   sendResponse({});
										   }
										   });
}

// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('metalmouthInit.start', metalmouthInit.start);
