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

goog.provide('mm_optionsView.init');
goog.provide('mm_optionsView.update');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('mm_BackgroundComms');

mm_optionsView.init = function() 
{	
	var optionsFieldset = goog.dom.createDom('fieldset', {
		
	}); 
	
	goog.dom.appendChild(document.body, optionsFieldset);
	
	var optionsLegend = goog.dom.createDom('legend', {
		'innerText': 'Options'
	});
	
	goog.dom.appendChild(optionsFieldset, optionsLegend);
	
	var option1 = goog.dom.createDom('div');
									 
	goog.dom.appendChild(optionsFieldset, option1);
	
	var newTabPageLabel = goog.dom.createDom('label', {
													 'for':'_mmOptions_newTabPage',
													 'innerText':'New tab url'
													 });
	
	goog.dom.appendChild(option1, newTabPageLabel);
	
	var newTabPage = goog.dom.createDom('input', {
												'id': '_mmOptions_newTabPage',
												'type': 'text'
												});
	
	goog.dom.appendChild(option1, newTabPage);
	
	var newTabPageNote = goog.dom.createDom('p', {
										'id': '_mmOptions_newTabPageNote',
										'innerText': "Default new tab url is Google's Accessible Search."
										});
	
	goog.dom.appendChild(option1, newTabPageNote);
	
	var option2 = goog.dom.createDom('div');
	
	goog.dom.appendChild(optionsFieldset, option2);
	
	var metalmouthAlwaysOnLabel = goog.dom.createDom('label', {
												  'for':'_mmOptions_turnOnMetalmouthAlwaysOn',
												  'innerText':'Always-on'
												  });
	
	goog.dom.appendChild(option2, metalmouthAlwaysOnLabel);
	
	var metalmouthAlwaysOn = goog.dom.createDom('input', {
											 'id': '_mmOptions_turnOnMetalmouthAlwaysOn',
											 'type': 'checkbox'
											 });
	
	goog.dom.appendChild(option2, metalmouthAlwaysOn);
	
	var option3 = goog.dom.createDom('div');
	
	goog.dom.appendChild(optionsFieldset, option3);
	
	var speechRateLabel = goog.dom.createDom('label', {
											 'for':'_mmOptions_speechRate',
											 'innerText':'Speech rate'
	});
	
	goog.dom.appendChild(option3, speechRateLabel);
	
	var speechRate = goog.dom.createDom('input', {
		'id': '_mmOptions_speechRate',
		'title': 'range goes from slow, a value of 0.5, to very fast, a value of 1.1',
		'type': 'range',
		'min': '0.5', 
		'max': '1.1',
		'step': '0.2'
	});
	
	goog.dom.appendChild(option3, speechRate);
	
	if (navigator.platform == "MacIntel")
	{
		// hide speech rate, just until TTS issues resolved - http://code.google.com/p/chromium/issues/detail?id=99116
		speechRateLabel.outerHTML = "";
		speechRate.outerHTML = "<p>Speech rate option is currently disabled for MAC users due to <a href='http://code.google.com/p/chromium/issues/detail?id=99116'>Chromium issue</a></p>"; 
	}
	
	// Experimental features
	
	var experimentalFeaturesFieldset = goog.dom.createDom('fieldset', {
											 
											 }); 
	
	goog.dom.appendChild(document.body, experimentalFeaturesFieldset);
	
	var experimentalFeaturesLegend = goog.dom.createDom('legend', {
										   'innerText': 'Experimental Features'
										   });
	
	goog.dom.appendChild(experimentalFeaturesFieldset, experimentalFeaturesLegend);
	
	var expOption1 = goog.dom.createDom('div');
	
	goog.dom.appendChild(experimentalFeaturesFieldset, expOption1);
	
	var turnOnVoiceInputLabel = goog.dom.createDom('label', {
											 'for':'_mmOptions_turnOnVoiceInput',
											 'innerText':'Voice commands'
											 });
	
	goog.dom.appendChild(expOption1, turnOnVoiceInputLabel);
	
	var turnOnVoiceInput = goog.dom.createDom('input', {
										'id': '_mmOptions_turnOnVoiceInput',
										'type': 'checkbox'
										});
	
	goog.dom.appendChild(expOption1, turnOnVoiceInput);
	
	var useHeadphonesNote = goog.dom.createDom('p', {
												  'id': '_mmOptions_useHeadphonesNote',
												  'innerText':'Please remember to use headphones with voice commands for best results.'
												  });
	
	goog.dom.appendChild(expOption1, useHeadphonesNote);
	
	var saveButton = goog.dom.createDom('input', {
		'id': '_mmOptions_saveButton',
		'type': 'button',
		'value': 'Save & Close',
		'style': 'float:left;'
		});
	
	goog.dom.appendChild(document.body, saveButton);
	
	goog.events.listen(saveButton, 
		goog.events.EventType.CLICK,
		function(){
					   
			var data = {
				newTabPage: document.getElementById('_mmOptions_newTabPage').value,
				turnOnMetalmouthAlwaysOn: document.getElementById('_mmOptions_turnOnMetalmouthAlwaysOn').checked,
				speechRate: navigator.platform == "MacIntel" ? "0.5" : document.getElementById('_mmOptions_speechRate').value,
				turnOnVoiceInput: document.getElementById('_mmOptions_turnOnVoiceInput').checked
			}

			mm_BackgroundComms.call("optionsClose", data, null, false);
		});
}

mm_optionsView.update = function(data)
{
	if (data.newTabPage)
	{
		document.getElementById('_mmOptions_newTabPage').value = data.newTabPage;
	}
	if (data.turnOnMetalmouthAlwaysOn)
	{
		document.getElementById('_mmOptions_turnOnMetalmouthAlwaysOn').checked = data.turnOnMetalmouthAlwaysOn;
	}
	if (data.speechRate)
	{
		var speechRate = document.getElementById('_mmOptions_speechRate');
		if (speechRate)
		{
			speechRate.value = data.speechRate;
		}
	}
	if (data.turnOnVoiceInput)
	{
		document.getElementById('_mmOptions_turnOnVoiceInput').checked = data.turnOnVoiceInput;
	}
}