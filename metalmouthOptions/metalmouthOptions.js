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

goog.provide('metalmouthOptions.start');

goog.require('mm_optionsView.init');
goog.require('mm_optionsView.update');
goog.require('mm_BackgroundComms');

console.log("loaded metalmouth options auto");

var startMetalmouthFunctions = 
[
 initInterface,
 updateInterface,
 initMetalmouth
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

function startSequencer(selectedSequencerFunctions)
{
	sequencerNextItem = 0;
	sequencerCurrentItem = 0;
	sequencerFunctions = selectedSequencerFunctions;
	sequencer();
}

function initInterface()
{
	mm_optionsView.init();
	sequencer();
}

function updateInterface()
{
	var cbFunction_updateInterface = function(results) {
		mm_optionsView.update(results);
		sequencer();
	}
	
	mm_BackgroundComms.call("optionsGetData", null, cbFunction_updateInterface, true);
}

function initMetalmouth()
{
	metalmouth.start();
}

metalmouthOptions.start = function()
{
	startSequencer(startMetalmouthFunctions);
}

goog.exportSymbol('metalmouthOptions.start', metalmouthOptions.start);