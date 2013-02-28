/*

 Project metalmouth - Developing a voice browser extension for Chrome (http://code.google.com/p/metalmouth/)
 Copyright (C) 2013 - Alistair Garrison
 
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

goog.provide('mm_BackgroundComms');

mm_BackgroundComms.call = function(name, value, cbFunction, cbResultsDependent)
{
	if (mm_BackgroundComms.port == undefined)
	{
		mm_BackgroundComms.connect();
	}
	mm_BackgroundComms.sendMsg(name, value, cbFunction, cbResultsDependent);
}

function BackgroundFunctionModel(name, value) // , values)
{
	this.name = name; 
	this.value = value;
}

mm_BackgroundComms.port = null;
mm_BackgroundComms.callbackFunction = null;
mm_BackgroundComms.callbackResultsDependent = null;

mm_BackgroundComms.connect = function()
{
	mm_BackgroundComms.callbackFunction = null;
	mm_BackgroundComms.callbackResultsDependent = null;
	mm_BackgroundComms.port = chrome.extension.connect();
	mm_BackgroundComms.port.onMessage.addListener(function(msg) {
		if (msg.complete == "true")
		{
			if (mm_BackgroundComms.callbackResultsDependent == true)
			{
				if (msg.results != null)
				{
					var results = JSON.parse(msg.results);
					if (mm_BackgroundComms.callbackFunction != null)
					{
						mm_BackgroundComms.callbackFunction(results);
					}
				}
			}
			else
			{
				if (mm_BackgroundComms.callbackFunction != null)
				{
					mm_BackgroundComms.callbackFunction();
				}
			}
		}
	});
}

mm_BackgroundComms.sendMsg = function(name, value, cbFunction, cbResultsDependent)
{
	mm_BackgroundComms.callbackFunction = cbFunction;
	mm_BackgroundComms.callbackResultsDependent = cbResultsDependent;
	
	var backgroundFunction = new BackgroundFunctionModel(name, value);
	mm_BackgroundComms.port.postMessage({backgroundFunction: JSON.stringify(backgroundFunction)});
}