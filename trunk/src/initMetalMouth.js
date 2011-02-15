/*

 Project metalmouth - Developing a voice browser extension for Chrome (http://code.google.com/p/metalmouth/)
 Copyright (C) 2011 - Alistair Garrison
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// console.log("loaded");

// --enable-experimental-extension-apis

function init(id) 
{
  	chrome.tabs.executeScript(id, {file: "MetalMouth.js"}, function(){ 		
		chrome.tabs.executeScript(id, {code:"start();"}, function(){

			var changeTab = function(tabId, changedProps) {
		
			if (tabId != id)
			{
				return; // to prevent metalmouth running when other tabs (not this one) are updated 
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

// Listen for a click on the osm icon.  

chrome.browserAction.onClicked.addListener(function(tab){test(tab.id);});

// Listen for omnibox keyword 

chrome.omnibox.onInputStarted.addListener(function(){chrome.experimental.tts.speak("Press space bar then enter to start Project metalmouth extension")});

chrome.omnibox.onInputEntered.addListener(function(text){
	chrome.tabs.getSelected(null, function(tab)
	{
		chrome.tabs.update(tab.id, {'url': 'http://www.google.com', 'selected': true}, function(tab){test(tab.id);});
	});
});// );

// chrome.omnibox.onInputStarted.addListener(function() {console.log("mm started");chrome.tabs.getSelected(null, function(tab){test(tab.id);});});// );

// Following enqueue does not appear to work - error raised (which cannot be caught) when utterance is stopped prematurely - also tried .stop() and it also did not work

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	if (request.tts != "")
	{
		var voice = JSON.parse(request.voice);
		try
		{
			var enqueue;
			if (voice.enqueue == "true")
			{
				enqueue = true;
			}
			else
			{
				enqueue = false;
			}

			chrome.experimental.tts.speak(voice.utterance, {'locale':voice.locale,'rate':parseFloat(voice.rate),'enqueue':enqueue}, function(){
				sendResponse({spoken: "true"});
			});
		}
		catch(err)
		{
			console.log(err);
		}

	}
	else
	{
	   sendResponse({}); // snub them.
	}
});



