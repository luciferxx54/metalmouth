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

goog.provide('metalmouthInit.start');

goog.require('mm_applicationData');
goog.require('mm_speech');

var mmTabId;
var mmTabUrl;

function init(id) 
{
	mmTabId = id;
	chrome.tabs.get(id, function(tab) {
		var insertUpdateListener = function()
		{
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
		}
						
		if ((tab.url.indexOf('chrome-extension://') == -1) && (tab.url.indexOf('options.html') == -1))
		{
			mmTabUrl = tab.url;
			chrome.tabs.executeScript(id, {file: "metalmouth-compiled.js"}, function() { 	
				chrome.tabs.executeScript(id, {code:"metalmouth.start();"}, function() {
					insertUpdateListener();
				});
			});
		}
		else
		{
			insertUpdateListener();
		}
	});
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
	mm_applicationData.connect();
	
	// Listen for a click on the Project metalmouth icon.  
	
	chrome.browserAction.onClicked.addListener(function(tab){test(tab.id);});
	
	// Listen for omnibox keyword 
	
	chrome.omnibox.onInputStarted.addListener(function(){mm_speech.speak("Press space bar then enter to start Project metalmouth extension", false, null)});

	chrome.omnibox.onInputEntered.addListener(function(text){
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.update(tab.id, {'url': 'http://labs.google.com/accessible/', 'selected': true}, function(tab){test(tab.id);}); // have to set a start page as permission for chrome://newtab/ is denied
		});
	});
	
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		if (request.voice != undefined)
		{
			var voice = JSON.parse(request.voice);
			try
			{
				var callbackDirect = function() {
					sendResponse({spoken: "true"}); 		   
				}
				mm_speech.speak(voice.utterance, voice.enqueue == "true" ? true : false, callbackDirect);
			}
			catch(err)
			{
				console.log(err);
			}
		}
		else if(request.optionsPageOpen != undefined)
		{
			chrome.tabs.update(mmTabId, {url:"options.html"});
		}
		else if(request.optionsPageGetData != undefined)
		{
			sendResponse({options: JSON.stringify(mm_applicationData.getData())});
		}
		else if(request.optionsPageClose != undefined)
		{
			mm_applicationData.update(request.optionsPageClose);
			chrome.tabs.update(mmTabId, {url:mmTabUrl});
		}
		else if (request.retrieveData != undefined)
		{
			sendResponse({data: JSON.stringify(mm_applicationData.getSpecificData(request.retrieveData))});
		}
		else
		{
			sendResponse({});
		}
	});
}

// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('metalmouthInit.start', metalmouthInit.start);
