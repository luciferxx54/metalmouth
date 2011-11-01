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

goog.provide('metalmouth.start');

goog.require('mm_ControlPanel');
goog.require('mm_Navigator');
goog.require('mm_TTS');
goog.require('mm_OSEM');

goog.require('goog.dom');

console.log("loaded Metal Mouth");
 
// start sequencer

var startSequencerFunctions = 
[
 removeExistingAccesskeys,
 readPageTitle,
 initControlPanel,
 bringFocus
];

var sequencerNextItem;
var sequencerCurrentItem;
var sequencerFunctions;

function sequencer()
{
	sequencerCurrentItem = sequencerNextItem;
	sequencerNextItem = sequencerNextItem + 1;
	sequencerFunctions[sequencerCurrentItem]();
}

metalmouth.start = function()
{
	sequencerNextItem = 0;
	sequencerCurrentItem = 0;
	sequencerFunctions = startSequencerFunctions;
	sequencer();
}

function removeExistingAccesskeys()
{
	var elements = document.all;
	for (var i in elements)
	{
		if (elements[i].tagName != null)
		{
			if (elements[i].getAttribute("accesskey") != null)
			{
				elements[i].removeAttribute("accesskey");
			}
		}
	}
	sequencer();
}

function initControlPanel()
{
	mm_ControlPanel.init();
	sequencer();
}

function readPageTitle()
{
	mm_TTS.getAudio(mm_ControlPanel.getPageTitle(), true, function(){sequencer();});
}

function bringFocus()
{
	mm_ControlPanel.bringFocus();
}

// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('metalmouth.start', metalmouth.start);
