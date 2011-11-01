/*
 
 Project accessami - Helping people to improve the accessibility of their web content (http://code.google.com/p/accessami/)
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

mm_optionsView.init = function() 
{	
	var optionsFieldset = goog.dom.createDom('fieldset', {
		
	}); 
	
	goog.dom.appendChild(document.body, optionsFieldset);
	
	var optionsLegend = goog.dom.createDom('legend', {
		'innerText': 'Options'
	});
	
	goog.dom.appendChild(optionsFieldset, optionsLegend);
	
	var speechRateLabel = goog.dom.createDom('label', {
											 'for':'_mmOptions_speechRate',
											 'innerText':'Speech rate:'
	});
	
	goog.dom.appendChild(optionsFieldset, speechRateLabel);
	
	var speechRate = goog.dom.createDom('input', {
		'id': '_mmOptions_speechRate',
		'title': 'range goes from slow, a value of 0.5, to very fast, a value of 1.1',
		'type': 'range',
		'min': '0.5', 
		'max': '1.1',
		'step': '0.2'
	});
	
	goog.dom.appendChild(optionsFieldset, speechRate);
	
	// add in save button
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
				speechRate: document.getElementById('_mmOptions_speechRate').value
			}

			chrome.extension.sendRequest({optionsPageClose: JSON.stringify(data)});
		});
}

mm_optionsView.update = function(data)
{
	if (data.speechRate)
	{
		document.getElementById('_mmOptions_speechRate').value = data.speechRate;
	}
}