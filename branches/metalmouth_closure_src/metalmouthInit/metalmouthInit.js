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

goog.provide('metalmouthInit.load');
goog.require('mm_speech');

metalmouthInit.load = function() {
	var mmOn = false; // initially off
	
	var portConnected;
	var portListenerStatus;
	var tabMessage;
    
    // addListeners();
    
	// setUp - Run Once when mm reloaded in chrome://extensions
    
    chrome.browserAction.setIcon({path:"MetalMouthLogo_Off.png"});
    chrome.browserAction.setTitle({title:"metalmouth off"});
    chrome.browserAction.onClicked.addListener(startStopAction);
    
    /*
	function addListeners() {
        console.log("browserAction listen");
		chrome.browserAction.onClicked.addListener(startStopAction); // Button always on 
	}
    */
	
    /*
	function removeListeners() {
        console.log("browserAction not listening");
		chrome.browserAction.onClicked.removeListener(startStopAction); // Button always on 
	}
    */
	
	function refreshCurrentTab() {
		chrome.tabs.getSelected(null, function(tab){
			var url = tab.url;
			if (url == "chrome://newtab/") {
                url = "http://www.google.com/cse/home?cx=000183394137052953072%3Azc1orsc6mbq";
			}
			chrome.tabs.update(tab.id, {'url':url, selected: true});
		});
	}
	
	function refreshAllTabsAtStart() {
        // send a message to each tab
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = tabs.length; i--;) {
				var tab = tabs[i];
				var url = tab.url;
				if (url == "chrome://newtab/") {
                    url = "http://www.google.com/cse/home?cx=000183394137052953072%3Azc1orsc6mbq";
				}
				chrome.tabs.update(tab.id, {'url':url, selected: true});
			}
		});
	}
	
    /*
	function refreshAllTabs() { // removes injected metalmouth code from all open pages
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = tabs.length; i--;) {
				var tab = tabs[i];
                var url = tab.url;
                if (url.substring(0,6) != "chrome") {
                    chrome.tabs.executeScript(tab.id, {code:"var injectedResult = true;try{metalmouth.injected();}catch(e){injectedResult = false};if (injectedResult == true){window.location.href='" + tab.url + "';}"}, null);
                }
			}
		});
	}
    */
    
    function refreshAllTabs() {
		chrome.tabs.getAllInWindow(null, function(tabs) {
            for (var i = tabs.length; i--;) {
                var tab = tabs[i];
                chrome.tabs.update(tab.id, {url:tab.url});
            }
        });
	}
    
	function mmStart() {
		portConnected = 0;
		portListenerStatus = 0;
		tabMessage = null;
			
		chrome.tabs.onUpdated.addListener(handler_OnUpdated);
		chrome.tabs.onCreated.addListener(handler_OnCreated);
		chrome.tabs.onRemoved.addListener(handler_OnRemoved);
		chrome.tabs.onActiveChanged.addListener(handler_OnActiveChanged);
		chrome.extension.onConnect.addListener(handler_OnConnect);
		chrome.browserAction.setIcon({path:"MetalMouthLogo_On.png"});
		chrome.browserAction.setTitle({title:"metalmouth on"});
        runFunc = mmStop;
		mm_speech.speak("metalmouth extension on", function(){refreshCurrentTab();}); // add listeners
	}
	
	function mmStop() {
		chrome.tabs.onUpdated.removeListener(handler_OnUpdated);
		chrome.tabs.onCreated.removeListener(handler_OnCreated);
		chrome.tabs.onRemoved.removeListener(handler_OnRemoved);
		chrome.tabs.onActiveChanged.removeListener(handler_OnActiveChanged);
		chrome.extension.onConnect.removeListener(handler_OnConnect);
		chrome.browserAction.setIcon({path:"MetalMouthLogo_Off.png"});
		chrome.browserAction.setTitle({title:"metalmouth off"});
        refreshAllTabs();
        runFunc = mmStart;
		mm_speech.speak("metalmouth extension off", function(){}); // add listeners
	} 
	
    var runFunc = mmStart;
    
	function startStopAction() { // this needs to be on a timer so that it waits until instable is true to change setting.
        runFunc();
        /*
         
        if (mmOn == false) {
            mmStart();
        }
        else {
            mmStop();
        }
        */
	}
	
	// Event Handlers
	
	function handler_OnUpdated(tabId, info) {
		if (info.status == "complete" ) {
			chrome.tabs.get(tabId, function(tab) {
				var tabUrl = tab.url;
				if ((tabUrl.indexOf('chrome-devtools://') == -1) && (tabUrl.indexOf('chrome://') == -1) && (tabUrl.indexOf('chrome-extension://') == -1) && (tabUrl.indexOf('options.html') == -1)) {
					var runFunction = function() {
						chrome.tabs.executeScript(tabId, {file: "metalmouth-compiled.js"}, function() {
							chrome.tabs.executeScript(tabId, {code:"metalmouth.start();"}, null);
						});
					}
					var interval = setInterval(function(){if(portListenerStatus == 0){clearInterval(interval);runFunction();}}, 100);
				}
			});		  
		}
	}
	
	function handler_OnCreated(tab) {
		portListenerStatus = 0;
		var tabUrl = tab.url;
		if ((tabUrl.indexOf('chrome-extension://') != -1) && (tabUrl.indexOf('/options.html') != -1)) {
			tabMessage = "Options page";
		}
		else {
			tabMessage = "Opening new";
		}
	}
	
	function handler_OnRemoved(tabId, removeInfo) {
		tabMessage = "Closing tab moving focus to";
	}
	
	function handler_OnActiveChanged(tabId, selectInfo) {
		chrome.tabs.get(tabId, function(tab) {
			var getTabMessage = function() {
				var message = "moving focus to ";
				if (tabMessage) {
					message = tabMessage + " ";
					tabMessage = null;
				}
				return message;
			}
						
			var updatePageAppropriately = function() {
				var newTabPage = tabUrl;
				if (newTabPage == "chrome://newtab/") {
                    newTabPage = "http://www.google.com/cse/home?cx=000183394137052953072%3Azc1orsc6mbq";
				}
				mm_speech.speak(getTabMessage() + "tab", function(){chrome.tabs.update(tab.id, {url:newTabPage, selected: true});});	
			}			
			
			var tabUrl = tab.url; 

			if (tabMessage == "Opening new") {
				updatePageAppropriately();
			}
			else {
				if ((tabUrl.indexOf('chrome-extension://') != -1) && (tabUrl.indexOf('/options.html') != -1)) {
					console.log("metalmouth options"); // do nothing more
				}
				else if ((tabUrl.indexOf('chrome-devtools://') != -1) || (tabUrl.indexOf('chrome://') != -1) || (tabUrl.indexOf('chrome-extension://') != -1)) {
					updatePageAppropriately();
				}
				else {
					var checkIfMMInjected = function() {
						// we inject the following which tests to see if metalmouth.injected returns true.  If not, metalmouth has not been injected - so the page is refreshed
						chrome.tabs.executeScript(tabId, {code:"var injectedResult = true;try{metalmouth.injected();}catch(e){injectedResult = false};var mmInjectedTest = chrome.extension.connect();mmInjectedTest.postMessage({injected: injectedResult});"}, null);
					}
					mm_speech.speak(getTabMessage() + "tab showing " + tabUrl, checkIfMMInjected);	
				}
			}
		});
	}
	
	function handler_OnConnect(port) {
		var handleDisconnect = function() {
			portConnected = 0;
		}
		
		var callableFunctions = {}
		
		callableFunctions['voice'] = function(sentValue) {
			var callbackDirect = function() {
				if (portConnected == 1) {
					port.postMessage({complete: "true"});
				}
				portListenerStatus = 0;
			}
			mm_speech.speak(sentValue, callbackDirect);
		}
		
		callableFunctions['openTab'] = function(sentValue) {
			portListenerStatus = 0;
			chrome.tabs.create({url:sentValue});
		}
		
		port.onDisconnect.addListener(handleDisconnect);
		port.onMessage.addListener(function(msg) {
			if (msg.backgroundFunction != undefined) {
				portConnected = 1; // open as message received
				portListenerStatus = 1; 
				var backgroundFunction = JSON.parse(msg.backgroundFunction);
				callableFunctions[backgroundFunction.name](backgroundFunction.value);
			}
			if (msg.injected == false) {
				refreshCurrentTab();
			}
		});
	}
}

metalmouthInit.load();
