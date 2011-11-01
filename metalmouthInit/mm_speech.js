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

mm_speech.speak = function(utterance, enqueue, callback)
{
	var handleCallback = function()
	{
		try
		{
			if (callback != null)
			{
				callback();
			}
		}
		catch(err)
		{
			console.log(err);
		}
	}
	
	if (utterance != null)
	{
		chrome.tts.speak(
			utterance,
			{
				lang: 'en-US', 
				rate: parseFloat(mm_applicationData.getSpecificData('speechRate')),
				enqueue: enqueue,
				onEvent: function(event) {
					if (event.type == 'end') {
						handleCallback();
					}
				}
			});
	}
}
