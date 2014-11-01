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

goog.provide('mm_ControlPanel');

goog.require('mm_BackgroundComms');

function calcDeveloperWindowPosition() {
	var xPos = document.body.clientWidth - 200;
	return xPos;
}

mm_ControlPanel.init = function() {
	mm_ControlPanel.pageCulture = getPageCulture();
	var highestZIndex = calcHighestZIndex();
	var developerWindowPosition = calcDeveloperWindowPosition();
    
    var headElement = document.querySelector("head");
	var mmStyleArea = document.createElement("style");
	mmStyleArea.setAttribute("data-mm-uicomponent", "");
	mmStyleArea.innerText = "ins{display:inline-block;}del{display:inline-block;}code{display:inline-block;}abbr{display:inline-block;}span{display:inline-block;}a{display:inline-block;}#_mm_ShieldImage{position:absolute;top:0px;left:0px;z-index:" + (highestZIndex + 1) + ";" + "width:"  + document.body.scrollWidth + "px;height:" + document.body.scrollHeight + "px;" + "}#_mm_InteractArea{position:fixed;top:0px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (highestZIndex + 2) + ";padding:0px;}#_mm_DeveloperWindow{position:fixed;top:50px;left:" + developerWindowPosition + "px;z-index:" + (highestZIndex + 3) + ";width:200px;border:1px solid #828282;font-family:courier;font-size:10pt;background-color:#FFF68F;}"; 
	
	headElement.appendChild(mmStyleArea);
    
	addBodyLevelKeyHandlers();
	var mmShieldImage = document.createElement("img");
	mmShieldImage.id = "_mm_ShieldImage";
	mmShieldImage.setAttribute("data-mm-uicomponent", "");
	document.body.insertBefore(mmShieldImage, document.body.children[1]);
	var mmContainer = document.createElement("div");
	mmContainer.id = "_mm_Container";
	mmContainer.className = "_mm_Container"; 
	mmContainer.setAttribute("data-mm-uicomponent", "");
	document.body.appendChild(mmContainer);
	var mmDeveloperWindow = document.createElement("div");
	mmDeveloperWindow.id = "_mm_DeveloperWindow"; 
	mmDeveloperWindow.setAttribute("data-mm-uicomponent", "");
	mmContainer.appendChild(mmDeveloperWindow);
	var mmDeveloperWindowItemLabel = document.createElement("div");
	mmDeveloperWindowItemLabel.setAttribute("data-mm-uicomponent", "");
	mmDeveloperWindowItemLabel.innerText = "OSEM Item:-"; 
	mmDeveloperWindow.appendChild(mmDeveloperWindowItemLabel);
	var mmDeveloperWindowItem = document.createElement("div");
	mmDeveloperWindowItem.id = "_mm_DeveloperWindowItem"; 
	mmDeveloperWindowItem.setAttribute("data-mm-uicomponent", "");
	mmDeveloperWindow.appendChild(mmDeveloperWindowItem);
	var mmDeveloperWindowRuler = document.createElement("hr");
	mmDeveloperWindow.appendChild(mmDeveloperWindowRuler);
	var mmDeveloperWindowOpeningTagLabel = document.createElement("div");
	mmDeveloperWindowOpeningTagLabel.setAttribute("data-mm-uicomponent", "");
	mmDeveloperWindowOpeningTagLabel.innerText = "DOM Node:-";
	mmDeveloperWindow.appendChild(mmDeveloperWindowOpeningTagLabel);
	var mmDeveloperWindowOpeningTag = document.createElement("div");
	mmDeveloperWindowOpeningTag.id = "_mm_DeveloperWindowOpeningTag"; 
	mmDeveloperWindowOpeningTag.setAttribute("data-mm-uicomponent", "");
	mmDeveloperWindow.appendChild(mmDeveloperWindowOpeningTag);
	var mmInteractArea = document.createElement("div");
	mmInteractArea.id = "_mm_InteractArea";
	mmInteractArea.setAttribute("data-mm-uicomponent", "");
	mmInteractArea.style.cssText = "display:none;";
	mmContainer.appendChild(mmInteractArea);
}

mm_ControlPanel.resetNavigator = function() {
	mm_Navigator.reset();
}

mm_ControlPanel.bringFocus = function() {

	var cbFunction_BringFocus = function() {
		var activeElement = document.activeElement;
		if (activeElement) {
			activeElement.blur();
		}
		mm_TTS.getAudio("Reading all items", function(){mm_Navigator.startReadingNodes();});
	}
	
	mm_TTS.getAudio(mm_ControlPanel.getPageTitle(), cbFunction_BringFocus);
}

mm_ControlPanel.drawTextBoxInteract = function(liveTextInputElement, enteredDataType) { 
    // node ref needed so enter can set the values in the model and in the live site
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea');
	mmInteractionArea.innerHTML = ""; 
	
	var mmTBTextEntry = new TBTextEntry();
	mmTBTextEntry.add();
	
	var mmTBEnterButton = new TBEnterButton();
	mmTBEnterButton.add();
	
	displayInteractionArea(enteredDataType + " entry area", null, true);
	
	function changeFocus() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio(enteredDataType + " entry area entered", changeFocus);
	
	function enter() {
		liveTextInputElement.value = document.getElementById("_mm_TBTextEntry").value;
	}
	
	function TBTextEntry() {
		// constructor
		var textBox = new CP_TextBoxModel();
		var tBTextEntry = textBox.template();
		tBTextEntry.id = "_mm_TBTextEntry";
		tBTextEntry.setAttribute("data-mm-uicomponent", "");
		tBTextEntry.setAttribute("title", enteredDataType);
		
		this.add = function() {
			mmInteractionArea.appendChild(tBTextEntry);
		}
	}
	
	function TBEnterButton() {
		var tBEnterButton = iap_Button.template();
		tBEnterButton.id = "_mm_TBEnterButton";
		tBEnterButton.setAttribute("data-mm-uicomponent", "");
		tBEnterButton.setAttribute("value", "Enter");
		tBEnterButton.addEventListener("click", function(){enter();goog.dom.getElement("_mm_CloseMenuButton").click();}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(tBEnterButton);
		}
	}
}

mm_ControlPanel.drawCheckButtonInteract = function(liveCheckInputElement) {
    // - services radio button and checkboxes
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = "";
	
	var mmCheckButton = new CheckButtonModel();
	mmCheckButton.add();
	
	var mmUncheckButton = new UncheckButtonModel();
	mmUncheckButton.add();
	
	displayInteractionArea("check entry area", null, false);
	
	var changeFocus = function() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("check entry area entered", changeFocus); // mm_TTS callback
	
	function enter(e) {
		if (e.srcElement.value == "check") {
			liveCheckInputElement.checked = true;
		}
		else {
			liveCheckInputElement.checked = false;
		}
	}
	
	function CheckButtonModel() {
		var checkButton = iap_Button.template();
		checkButton.id = "_mm_CheckButton";
		checkButton.setAttribute("data-mm-uicomponent", "");
		checkButton.setAttribute("value", "check");
		checkButton.addEventListener("click", function(e){enter(e);goog.dom.getElement("_mm_CloseMenuButton").click();}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(checkButton);
		}
	}
	
	function UncheckButtonModel() {
		var uncheckButton = iap_Button.template();
		uncheckButton.id = "_mm_UncheckButton";
		uncheckButton.setAttribute("data-mm-uicomponent", "");
		uncheckButton.setAttribute("value", "uncheck");
		uncheckButton.addEventListener("click", function(e){enter(e);goog.dom.getElement("_mm_CloseMenuButton").click();}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(uncheckButton);
		}
	}
}

mm_ControlPanel.drawSingleSelectMenuInteract = function(liveSelectInputElement) {
	var selectedIndex = 0;
	var options = liveSelectInputElement.querySelectorAll('option');
	var currentOptionText = options[0].innerText;
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	var mmNextOptionButton = new NextOptionButtonModel();
	mmNextOptionButton.add();
	
	var mmPreviousOptionButton = new PreviousOptionButtonModel();
	mmPreviousOptionButton.add();
	
	var mmSelectButton = new SelectButtonModel();
	mmSelectButton.add();
	
	var mmOptionDisplay = new OptionDisplayModel();
	mmOptionDisplay.add();
	mmOptionDisplay.setValue(currentOptionText, false);
	
	displayInteractionArea("single select", null, false);
	
	var changeFocus = function() {
		mmInteractionArea.children[0].focus();
	}
	
	var sayCurrentItem = function() {
		mm_TTS.getAudio("current option " + currentOptionText, changeFocus);
	}
	
	mm_TTS.getAudio("single select menu entered", sayCurrentItem);
	
	function NextOptionButtonModel() {
		var nextOptionButton = iap_Button.template();
		nextOptionButton.id = "_mm_NextOptionButton";
		nextOptionButton.setAttribute("data-mm-uicomponent", "");
		nextOptionButton.setAttribute("value", "Next option")
		nextOptionButton.addEventListener("click", moveToNextOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(nextOptionButton);
		}
		
		function moveToNextOption() {
			if (options[selectedIndex + 1] != undefined) {
				selectedIndex = selectedIndex + 1; 
				mmOptionDisplay.setValue(options[selectedIndex].innerText, true);				
			}
			else {
				mm_TTS.getAudio("no next option", null);
			}
		}
	}
	
	function PreviousOptionButtonModel() {
		var previousOptionButton = iap_Button.template();
		previousOptionButton.id = "_mm_PreviousOptionButton";
		previousOptionButton.setAttribute("data-mm-uicomponent", "");
		previousOptionButton.setAttribute("value", "Previous options")
		previousOptionButton.addEventListener("click", moveToPreviousOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(previousOptionButton);
		}
		
		function moveToPreviousOption() {
			if (options[selectedIndex - 1] != undefined) {
				selectedIndex = selectedIndex - 1; 
				mmOptionDisplay.setValue(options[selectedIndex].innerText, true);				
			}
			else {
				mm_TTS.getAudio("no previous option", null);
			}
		}
	}
	
	function SelectButtonModel() {
		var selectButton = iap_Button.template();
		selectButton.id = "_mm_SelectButton";
		selectButton.setAttribute("data-mm-uicomponent", "");
		selectButton.setAttribute("value", "Select");
		selectButton.addEventListener("click", enterSelectedItem, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(selectButton);
		}
		
		function enterSelectedItem() {
			goog.dom.getElement("_mm_CloseMenuButton").click();
			liveSelectInputElement.selectedIndex = selectedIndex;
		}
	}
	
	function OptionDisplayModel() {
		var displayBox = new IAP_DisplayBoxModel();
		var currentItemDisplayArea = displayBox.template();
		currentItemDisplayArea.id = "_mm_OptionDisplay";
		currentItemDisplayArea.setAttribute("data-mm-uicomponent", "");
		currentItemDisplayArea.setAttribute("title", "Option display");
		
		this.add = function() {
			mmInteractionArea.appendChild(currentItemDisplayArea);
		}
		
		this.setValue = function(currentOptionText, say) {
			currentItemDisplayArea.value = currentOptionText;
			if (say == true) {
				mm_TTS.getAudio("option " + currentOptionText, null);
			}
		}
	}
}

mm_ControlPanel.drawMultiSelectMenuInteract = function(liveSelectInputElement) {
	var selection = {};
	var selectedIndex = 0;
	var options = liveSelectInputElement.querySelectorAll('option');
	var currentOptionText = options[0].innerText;
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	var mmNextOptionButton = new NextOptionButtonModel();
	mmNextOptionButton.add();
	
	var mmPreviousOptionButton = new PreviousOptionButtonModel();
	mmPreviousOptionButton.add();
	
	var mmCheckButton = new CheckButtonModel();
	mmCheckButton.add();
	
	var mmUncheckButton = new UncheckButtonModel();
	mmUncheckButton.add();
	
	var mmEnterButton = new EnterButtonModel();
	mmEnterButton.add();
	
	for (var i = 0, len = options.length; i < len; i++) {
		options[i].selected == true ? selection[i] = "checked" : selection[i] = "unchecked";
	}

	var mmOptionDisplay = new OptionDisplayModel();
	mmOptionDisplay.add();
	mmOptionDisplay.setValue(0, currentOptionText, false);
	
	displayInteractionArea("multi select", null, false);
	
	var sayCurrentItem = function() {
		var changeFocus = function() {
			mmInteractionArea.children[0].focus();
		}
		
		mm_TTS.getAudio("current option " + currentOptionText + " " + selection[0], changeFocus);
	}
	
	mm_TTS.getAudio("multi select menu entered", sayCurrentItem);
	
	function NextOptionButtonModel() {
		var nextOptionButton = iap_Button.template();
		nextOptionButton.id = "_mm_NextOptionButton";
		nextOptionButton.setAttribute("data-mm-uicomponent", "");
		nextOptionButton.setAttribute("value", "Next option")
		nextOptionButton.addEventListener("click", moveToNextOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(nextOptionButton);
		}
		
		function moveToNextOption() {
			if (options[selectedIndex + 1] != undefined) {
				selectedIndex = selectedIndex + 1; 
				mmOptionDisplay.setValue(selectedIndex, options[selectedIndex].innerText, true);			
			}
			else {
				mm_TTS.getAudio("no next option", null);
			}
		}
	}
	
	function PreviousOptionButtonModel() {
		var previousOptionButton = iap_Button.template();
		previousOptionButton.id = "_mm_PreviousOptionButton";
		previousOptionButton.setAttribute("data-mm-uicomponent", "");
		previousOptionButton.setAttribute("value", "Previous options")
		previousOptionButton.addEventListener("click", moveToPreviousOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(previousOptionButton);
		}
		
		function moveToPreviousOption() {
			if (options[selectedIndex - 1] != undefined) {
				selectedIndex = selectedIndex - 1; 
				mmOptionDisplay.setValue(selectedIndex, options[selectedIndex].innerText, true);				
			}
			else {
				mm_TTS.getAudio("no previous option", null);
			}
		}
	}
	
	function CheckButtonModel() {
		var checkButton = iap_Button.template();
		checkButton.id = "_mm_CheckButton";
		checkButton.setAttribute("data-mm-uicomponent", "");
		checkButton.setAttribute("value", "Check");
		checkButton.addEventListener("click", checkOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(checkButton);
		}
		
		function checkOption() {
			selection[selectedIndex] = "checked";
			mmOptionDisplay.setValue(selectedIndex, options[selectedIndex].innerText, true);
		}
	}
	
	function UncheckButtonModel() {
		var uncheckButton = iap_Button.template();
		uncheckButton.id = "_mm_UnheckButton";
		uncheckButton.setAttribute("data-mm-uicomponent", "");
		uncheckButton.setAttribute("value", "Uncheck");
		uncheckButton.addEventListener("click", uncheckOption, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(uncheckButton);
		}
		
		function uncheckOption() {
			selection[selectedIndex] = "unchecked";
			mmOptionDisplay.setValue(selectedIndex, options[selectedIndex].innerText, true);
		}
	}
	
	function EnterButtonModel() {
		var enterButton = iap_Button.template();
		enterButton.id = "_mm_EnterButton";
		enterButton.setAttribute("data-mm-uicomponent", "");
		enterButton.setAttribute("value", "Enter");
		enterButton.addEventListener("click", enterSelectedItem, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(enterButton);
		}
		
		function enterSelectedItem() {
			goog.dom.getElement("_mm_CloseMenuButton").click();
			
			for (var i = 0, len = options.length; i < len; i++) {
				selection[i] == "checked" ? options[i].selected = true : options[i].selected = false;
			}
		}
	}
	
	function OptionDisplayModel() {
		var displayBox = new IAP_DisplayBoxModel();
		var currentItemDisplayArea = displayBox.template();
		currentItemDisplayArea.id = "_mm_OptionDisplay";
		currentItemDisplayArea.setAttribute("data-mm-uicomponent", "");
		currentItemDisplayArea.setAttribute("title", "Option display");
		
		this.add = function() {
			mmInteractionArea.appendChild(currentItemDisplayArea);
		}
		
		this.setValue = function(selectedIndex, currentOptionText, say) { 
			currentItemDisplayArea.value = currentOptionText + " " + selection[selectedIndex];
			if (say == true) {
				mm_TTS.getAudio("option " + currentOptionText + " " + selection[selectedIndex], null);
			}
		}
	}
}

mm_ControlPanel.drawRangeInputInteract = function(liveTextInputElement) {
    // - services input elements with a type attribute set to range
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea');
	mmInteractionArea.innerHTML = ""; 
	
	// default 
	var min = liveTextInputElement.getAttribute("min");
	min = (!min) ? 0 : asFloatOrInt(min);
	
	var max = liveTextInputElement.getAttribute("max");
	max = (!max) ? 100 : asFloatOrInt(max);
	
	var step = liveTextInputElement.getAttribute("step");
	step = (!step) ? 1 : asFloatOrInt(step);
	
	var toHowManyDecimalPlaces = function(num) {
		if (num.toString().indexOf('.') != -1) {
			return num.toString().substring(num.toString().indexOf('.') + 1).length;
		}
		return 0;
	}
	
	var howManyDecimalPlaces = toHowManyDecimalPlaces(step);
	var currentValue = liveTextInputElement.value;
	var changedStep = calculateSteps();
	
	var mmIncreaseValueButton = new IncreaseValueButtonModel(); // increase value
	mmIncreaseValueButton.add();
	
	var mmDecreaseValueButton = new DecreaseValueButtonModel(); // decrease value
	mmDecreaseValueButton.add();
	
	var mmRangeEnterButton = new RangeEnterButton();
	mmRangeEnterButton.add();
	
	displayInteractionArea("range entry area", null, false);
	
	var changeFocus = function() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("Range entry area entered", changeFocus); // mm_TTS callback
	
	function enter() {
		liveTextInputElement.value = currentValue;
	}
	
	function asFloatOrInt(text) {
		return (text.toString().indexOf('.') != -1) ? parseFloat(text) : parseInt(text);
	}
	
	function calculateSteps() {
		// to calculate steps (max - min / step * x) increasing x by 1 until answer > 20 remembering value usually starts in the middle
		var x = 1; 
		
		while (((max - min)/(step * x)) > 20) {
			x++;
		}
		
		return step * x; 
	}
	
	function changeValue(action) {
		switch(action) {
			case "increase":
				if ((asFloatOrInt(currentValue) + changedStep).toFixed(howManyDecimalPlaces) <= max) {
					currentValue = (asFloatOrInt(currentValue) + changedStep).toFixed(howManyDecimalPlaces);
					mm_TTS.getAudio("value to enter increased to " + currentValue, null);
				}
				else {
					mm_TTS.getAudio("maximum value " + currentValue + " reached", null);
				}
				break;
			case "decrease":
				if ((asFloatOrInt(currentValue) - changedStep).toFixed(howManyDecimalPlaces) >= min) {
					currentValue = (asFloatOrInt(currentValue) - changedStep).toFixed(howManyDecimalPlaces);
					mm_TTS.getAudio("value to enter decreased to " + currentValue, null);
				}
				else {
					mm_TTS.getAudio("minimum value " + currentValue + " reached", null);
				}
				break;
		}
	}
	
	function IncreaseValueButtonModel() {
		var increaseValueButton = iap_Button.template();
		increaseValueButton.id = "_mm_IncreaseButton";
		increaseValueButton.setAttribute("data-mm-uicomponent", "");
		increaseValueButton.setAttribute("value", "Increase value");
		increaseValueButton.addEventListener("click", function(){changeValue("increase");}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(increaseValueButton);
		}
	}
	
	function DecreaseValueButtonModel() {
		var decreaseValueButton = iap_Button.template();
		decreaseValueButton.id = "_mm_DecreaseButton";
		decreaseValueButton.setAttribute("data-mm-uicomponent", "");
		decreaseValueButton.setAttribute("value", "Decrease value");
		decreaseValueButton.addEventListener("click", function(){changeValue("decrease");}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(decreaseValueButton);
		}
	}
	
	function RangeEnterButton() {
		var rangeEnterButton = iap_Button.template();
		rangeEnterButton.id = "_mm_rangeEnterButton";
		rangeEnterButton.setAttribute("data-mm-uicomponent", "");
		rangeEnterButton.setAttribute("value", "Enter");
		rangeEnterButton.addEventListener("click", function(){enter();goog.dom.getElement("_mm_CloseMenuButton").click();}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(rangeEnterButton);
		}
	}
}

mm_ControlPanel.drawMediaInteract = function(liveMediaElement, mediaType) {
    // - services video and audio
	// Should also handle track selection
	
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
	mmInteractionArea.innerHTML = ""; 
	
	var mmPlayButton = new PlayButtonModel();
	mmPlayButton.add();
	
	var mmPauseButton = new PauseButtonModel();
	mmPauseButton.add();
	
	var mmRewindButton = new RewindButtonModel();
	mmRewindButton.add();
	
	displayInteractionArea(mediaType, null, false);
	
	var changeFocus = function() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio(mediaType + " control area entered", changeFocus);  // mm_TTS callback move to drawM
	
	function controlMedia(actionName) {
		switch(actionName) {
			case "play":
				liveMediaElement.play();
				mm_TTS.getAudio(mediaType + " playing", function(){document.getElementById("_mm_PauseButton").focus();}); // mm_TTS callback
				break;
			case "pause":
				liveMediaElement.pause();
				mm_TTS.getAudio(mediaType + " paused", function(){document.getElementById("_mm_PlayButton").focus();}); // mm_TTS callback
				break;
			case "rewind":
				liveMediaElement.currentTime = 0;
				liveMediaElement.pause();
				mm_TTS.getAudio(mediaType + " rewound", function(){document.getElementById("_mm_PlayButton").focus();}); // mm_TTS callback
				break;
		}
	}
	
	function PlayButtonModel() {
		var playButton = iap_Button.template();
		playButton.id = "_mm_PlayButton";
		playButton.setAttribute("data-mm-uicomponent", "");
		playButton.setAttribute("value", "Play");
		playButton.addEventListener("click", function(){controlMedia("play");}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(playButton);
		}
	}
	
	function PauseButtonModel() {
		var pauseButton = iap_Button.template();
		pauseButton.id = "_mm_PauseButton";
		pauseButton.setAttribute("data-mm-uicomponent", "");
		pauseButton.setAttribute("value", "Pause");
		pauseButton.addEventListener("click", function(){controlMedia("pause");}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(pauseButton);
		}
	}
	
	function RewindButtonModel() {
		var rewindButton = iap_Button.template();
		rewindButton.id = "_mm_RewindButton";
		rewindButton.setAttribute("data-mm-uicomponent", "");
		rewindButton.setAttribute("value", "Rewind");
		rewindButton.addEventListener("click", function(){controlMedia("rewind");}, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(rewindButton);
		}
	}
}

mm_ControlPanel.drawMMMenuInteract = function() {
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = "";
	
	var mmChangeLocationButton = new ChangeLocationButtonModel(); // option to open in new tab or open in current
	mmChangeLocationButton.add();
	
	displayInteractionArea("Top", null, false);
	
	function changeFocus() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("Top menu entered", changeFocus); // mm_TTS callback
	
	function ChangeLocationButtonModel() {
        // sits in change location sub menu
		// constructor
		var changeLocationButton = iap_Button.template();
		changeLocationButton.id = "_mm_ChangeLocationButton";
		changeLocationButton.setAttribute("data-mm-uicomponent", "");
		changeLocationButton.setAttribute("value", "Change location")
		changeLocationButton.addEventListener("click", openChangeLocationMenu, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(changeLocationButton);
		}
		
		function openChangeLocationMenu() {
			goog.dom.getElement('_mm_CloseMenuButton').click();
			mm_ControlPanel.drawNavigationInteract();
		}
	}
}
 
mm_ControlPanel.drawNavigationInteract = function() {
	var iap_Button = new IAP_ButtonModel();
	
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	var mmPreviousUrlButton = new PreviousUrlButtonModel();
	mmPreviousUrlButton.add();
	
	var mmChangeUrlButton = new ChangeUrlButtonModel();
	mmChangeUrlButton.add();
	
	var mmOpenTabButton = new OpenTabButtonModel();
	mmOpenTabButton.add();
	
	displayInteractionArea("Change location", null, false);
	
	function changeFocus() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("Change location menu entered", changeFocus); // mm_TTS callback
	
	function PreviousUrlButtonModel() {
        // sits in change location sub menu
		// constructor
		var backButton = iap_Button.template();
		backButton.id = "_mm_PreviousUrlButton";
		backButton.setAttribute("data-mm-uicomponent", "");
		backButton.setAttribute("value", "Previous url")
		backButton.addEventListener("click", previousUrl, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(backButton);
		}
		
		function previousUrl() {
			goog.dom.getElement('_mm_CloseMenuButton').click();
			history.back();
		}
	}
	
	function ChangeUrlButtonModel() {
        
        // sits in change location sub menu
		var changeUrlButton = iap_Button.template();
		changeUrlButton.id = "_mm_ChangeUrlButton";
		changeUrlButton.setAttribute("data-mm-uicomponent", "");
		changeUrlButton.setAttribute("value", "Change url");
		changeUrlButton.addEventListener("click", changeUrl, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(changeUrlButton);
		}
		
		function changeUrl() {
			goog.dom.getElement('_mm_CloseMenuButton').click();
			mm_ControlPanel.drawChangeUrlInteract();
		}
	}
	
	function OpenTabButtonModel() {
        // sits in change location sub menu
		var openTabButton = iap_Button.template();
		openTabButton.id = "_mm_OpenTabButton";
		openTabButton.setAttribute("data-mm-uicomponent", "");
		openTabButton.setAttribute("value", "New tab");
		openTabButton.addEventListener("click", openTab, false);
		
		this.add = function() {
			mmInteractionArea.appendChild(openTabButton);
		}
		
		function openTab() {
			goog.dom.getElement('_mm_CloseMenuButton').click();
			mm_ControlPanel.drawOpenTabInteract();
		}
	}
}

mm_ControlPanel.drawChangeUrlInteract = function() {
	var iap_Button = new IAP_ButtonModel();
	
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	var urlEnterButton = new UrlEnterButtonModel();
	urlEnterButton.add();
	
	var urlTextEntry = new URLTextEntry();
	urlTextEntry.add();
	
	displayInteractionArea("Change url", null, true);
	
	function changeFocus() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("Change url menu entered", changeFocus); // mm_TTS callback	
	
	function URLTextEntry() {
		// constructor
		var textBox = new CP_TextBoxModel();
		var uRLTextEntry = textBox.template();
		uRLTextEntry.id = "_mm_URLTextEntry";
		uRLTextEntry.setAttribute("data-mm-uicomponent", "");
		uRLTextEntry.setAttribute("title", "u r l");
		
		this.add = function() {
			mmInteractionArea.insertBefore(uRLTextEntry, mmInteractionArea.lastChild);
		}
		
		this.focus = function() {
			uRLTextEntry.focus();
		}
	}
	
	function UrlEnterButtonModel() {
        // generic sits in change location sub menu
		// constructor
		var urlEnterButton = iap_Button.template();
		urlEnterButton.id = "_mm_UrlEnterButton";
		urlEnterButton.setAttribute("data-mm-uicomponent", "");
		urlEnterButton.setAttribute("value", "Go");
		urlEnterButton.addEventListener("click", enterUrl, false);
		
		this.add = function() {
			mmInteractionArea.insertBefore(urlEnterButton, mmInteractionArea.lastChild);
		}
		
		function enterUrl() {
			// changes the url of the tab page
			
			var userEnteredUrl = document.getElementById("_mm_URLTextEntry").value;
			if (userEnteredUrl != "") { // other checks are also needed
				goog.dom.getElement('_mm_CloseMenuButton').click();
				document.location.href = userEnteredUrl;
			}
		}
	}
}

mm_ControlPanel.drawOpenTabInteract = function() {
	var iap_Button = new IAP_ButtonModel();
	
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	var urlEnterButton = new UrlEnterButtonModel();
	urlEnterButton.add();
	
	var urlTextEntry = new URLTextEntry();
	urlTextEntry.add();
	
	displayInteractionArea("Open tab", null, true);
	
	function changeFocus() {
		mmInteractionArea.children[0].focus();
	}
	
	mm_TTS.getAudio("Open tab menu entered", changeFocus); // mm_TTS callback	
	
	function URLTextEntry() {
		// constructor
		var textBox = new CP_TextBoxModel();
		var uRLTextEntry = textBox.template();
		uRLTextEntry.id = "_mm_URLTextEntry";
		uRLTextEntry.setAttribute("data-mm-uicomponent", "");
		uRLTextEntry.setAttribute("title", "u r l");
		
		this.add = function() {
			mmInteractionArea.insertBefore(uRLTextEntry, mmInteractionArea.lastChild);
		}
		
		this.focus = function() {
			uRLTextEntry.focus();
		}
	}
	
	function UrlEnterButtonModel() { // generic sits in change location sub menu
		// constructor
		var urlEnterButton = iap_Button.template();
		urlEnterButton.id = "_mm_UrlEnterButton";
		urlEnterButton.setAttribute("data-mm-uicomponent", "");
		urlEnterButton.setAttribute("value", "Go");
		urlEnterButton.addEventListener("click", enterUrl, false);
		
		this.add = function() {
			mmInteractionArea.insertBefore(urlEnterButton, mmInteractionArea.lastChild);
		}
		
		function enterUrl() {
			// changes the url of the tab page
			
			var userEnteredUrl = document.getElementById("_mm_URLTextEntry").value;
			if (userEnteredUrl != "") {// other checks are also needed
				goog.dom.getElement('_mm_CloseMenuButton').click();
				mm_BackgroundComms.call("openTab", userEnteredUrl, null, false);
			}
		}
	}
}

mm_ControlPanel.getPageTitle = function() {
	var titleElement = document.querySelector("title");
	
	var pageTitle = "Current page has no title";
	
	if (titleElement != null) {
		if (titleElement.innerText != "") {
			pageTitle = titleElement.innerText;
		}
	}	
	return pageTitle;
}

mm_ControlPanel.pageCulture = null;

mm_ControlPanel.showCurrentItem = function(osmType, liveElement) {
	restoreHighlighter(); // removes outline from old live
	liveElement.scrollIntoView();
	var scrollPosY = window.scrollY;
	window.scrollTo(0, scrollPosY - 40);
	var currentStyle = liveElement.style.cssText;
	liveElement.setAttribute("_mm_current", currentStyle);
	liveElement.setAttribute("style", currentStyle + "outline:2px solid #FF8C00;"); // might not be needed if elements are added to tab order
	mm_ControlPanel.changeDevWindow(osmType, liveElement);
}

mm_ControlPanel.changeDevWindow = function(osmType, currentNode) {
	var mmDeveloperWindowItem = document.getElementById("_mm_DeveloperWindowItem");
	var mmDeveloperWindowOpeningTag = document.getElementById("_mm_DeveloperWindowOpeningTag");
	
	mmDeveloperWindowItem.setAttribute("style", "display:none;");
	mmDeveloperWindowOpeningTag.setAttribute("style", "display:none;");
	
	mmDeveloperWindowItem.innerText = osmType;
	
	var domNodeInfo = "<span data-mm-uicomponent>tagName:" + currentNode.tagName + "</span><br/>"; 
	
	var attributes = currentNode.attributes;
	
	for (var i = 0, len = attributes.length; i < len; i++) {
		var attribute = attributes[i];
		var attributeName = attribute.name;
		if ((attributeName != "_mm_current") && (attributeName != "style")) {
			domNodeInfo = domNodeInfo + "<span data-mm-uicomponent>" + attributeName + ":" + attribute.value + "</span><br/>";
		}
	}
	mmDeveloperWindowOpeningTag.innerHTML = domNodeInfo;
	mmDeveloperWindowItem.setAttribute("style", "");
	mmDeveloperWindowOpeningTag.setAttribute("style", "");
}

function restoreHighlighter() {
	var oldLive = document.querySelector('[_mm_current]');
	if (oldLive) {
		var oldStyle = oldLive.getAttribute("_mm_current");
		if (oldStyle != "") {
			oldLive.style.cssText = oldStyle;
		}
		else {
			oldLive.removeAttribute("style");
		}
		oldLive.removeAttribute("_mm_current");
	}
}

function getPageCulture() {
	var culture = "en-US";
	var metaElements = document.querySelectorAll('meta');
	var len = metaElements.length;
	if (len > 0) {
		for (var i = len; i--;) {
			var metaElement = metaElements[i];
			if (metaElement.tagName == "META") {
				if (metaElement.hasAttribute("http-equiv") && metaElement.hasAttribute("content")) {
					culture = metaElement.getAttribute("content");
					break;
				}
			}
		}
	}
	return culture;
}

function displayInteractionArea(name, buttonName, allowOtherKeyInput) {
	// add a closebutton
	
	var mmCloseMenuButton = new CloseMenuButtonModel(name, buttonName);
	
	var mmInteractionArea = document.getElementById("_mm_InteractArea");
	mmInteractionArea.appendChild(mmCloseMenuButton.asHtml());
	
	// add event handlers
	mmInteractionArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
	mmInteractionArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	
	mm_ControlPanel.bodyLevelKeyHandlersActive = false; // pause body level event handlers
	
	// display
	
	mmInteractionArea.style.cssText = "";
	
	function CloseMenuButtonModel(menuName, menuButtonName) {// generic sits in change location sub menu 
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var closeMenuButton = iap_Button.template();
		closeMenuButton.id = "_mm_CloseMenuButton";
		closeMenuButton.setAttribute("data-mm-uicomponent", "");
		closeMenuButton.setAttribute("value", "Close menu");
		closeMenuButton.addEventListener("click", function(){closeMenu()}, false);
		
		this.asHtml = function() {
			return closeMenuButton;
		}
		
		function closeMenu() { // this needs to be passed in to this function - it should reside in the 
			if (menuName.indexOf("entry area") == -1) {
				menuName = menuName + " menu";
			}
			
			mm_TTS.getAudio(menuName + " closed. Navigation mode entered.", null);
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			
			//remove event handlers
			mmInteractionArea.removeEventListener("keydown", hotKeyDown, false);
			mmInteractionArea.removeEventListener("keyup", hotKeyUp, false);
			
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
			mm_ControlPanel.bodyLevelKeyHandlersActive = true; // restart body level event handlers
		}
		
		this.focus = function() {
			closeMenuButton.focus();
		}
		
		this.click = function() {
			closeMenu();
		}
	}
	
	// event handlers
	
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; 
	var textIfButtonDisabled;
	var alreadyBusy = false; 
	var arrowSelected;
	
	function hotKeyDown_Handler(e) {
		if (allowOtherKeyInput == false) {
			window.event.returnValue = false;
		}
		if (alreadyBusy == false) {
			alreadyBusy = true;
			
			var selected = false; 
			keyBeingTimed = e.keyIdentifier.toString();
			switch(keyBeingTimed) {
				case "Up":
					selected = true;
					arrowSelected = "Up"; 
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					break;
				case "Down":
					selected = true;
					arrowSelected = "Down";
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					break;
				case "U+001B": // escape
					selected = true;
					arrowSelected = "ESC";
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					break;
				case "Enter":
					selected = true;
					window.event.returnValue = true;
					break;
				default: 
					if (selected == false) {
						alreadyBusy = false;
					}
					break;
			}
		}
	}
	
	function hotKeyUp_Handler(e) {
		clearTimeout(hotKeyTimer);
		alreadyBusy = false;
	}
	
	function specialCasesFunctionToRun() {
		if (arrowSelected == "Up") {
			var previousSibling = document.activeElement.previousElementSibling;
			
			if (previousSibling) {
				previousSibling.focus();
			}
		}
		
		if (arrowSelected == "Down") {
			var nextSibling = document.activeElement.nextElementSibling;
			
			if (nextSibling) {
				nextSibling.focus();
			}
		}
		
		if (arrowSelected == "ESC") {
			document.getElementById('_mm_CloseMenuButton').click();
		}
	}
}

mm_ControlPanel.bodyLevelKeyHandlersActive = null;

function addBodyLevelKeyHandlers() {
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; // this needs changing
	var textIfButtonDisabled;
	var alreadyBusy = false; 
	var selectedIndex;
	
	mm_ControlPanel.bodyLevelKeyHandlersActive = true;
	
	var body = document.body;
	body.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
	body.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	
	function hotKeyDown_Handler(e) {
		if (mm_ControlPanel.bodyLevelKeyHandlersActive == true) {
			window.event.returnValue = false;
			
			if (alreadyBusy == false) {
				setAlreadyBusy(true);
				
				var selected = false;
				
				keyBeingTimed = e.keyIdentifier.toString();
				
				switch(keyBeingTimed) {
					case "Up": // ReadPrevButton
						selected = true;
						selectedIndex = 0;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;
					case "Down": // ReadNextButton
						selected = true;
						selectedIndex = 1;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;
					case "Left": // back to start
						selected = true;
						selectedIndex = 2;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;	
					case "Right": // jump
						selected = true;
						selectedIndex = 3;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;	
					case "U+0020": // space bar to start and stop read on, enter should be used with button interaction
						selected = true;
						selectedIndex = 4;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;
					case "Enter":
						selected = true;
						selectedIndex = 5;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;
					case "U+0009": // tab opens navigation menu
						selected = true;
						selectedIndex = 6;
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						break;
					default: 
						// if this is not one of the above we need to set alreadybusy to false... 
						if (selected == false) {
							setAlreadyBusy(false);
						}
						break;
				}
			}
		}
	}
	
	function hotKeyUp_Handler(e) {
		clearTimeout(hotKeyTimer);
		setAlreadyBusy(false);
	}

	var commandFunctions = [
		mm_Navigator.readPrevNode,
		mm_Navigator.readNextNode,
		mm_Navigator.backToStart,
		mm_Navigator.jump,	
		mm_Navigator.startOrStop,			
		mm_Navigator.interact,
		mm_ControlPanel.drawMMMenuInteract
	];
	
	function specialCasesFunctionToRun() { // this is for down and up arrowing
		commandFunctions[selectedIndex]();
	}
	
	function setAlreadyBusy(value)
	{
		alreadybusy = value;
	}
}

function CP_TextBoxModel() {
	this.template = function() {
		var textBox = document.createElement("input");
		textBox.setAttribute("type", "text");
		textBox.style.cssText = "float:left;width:400px;";
		textBox.addEventListener("focus", function(e){inputHasFocus(e);}, false);
		textBox.addEventListener("blur", function(e){inputLostFocus(e);}, false);
		return textBox; 
	}		
	
	function inputHasFocus(e) {
		if ((e.srcElement.tagName == "INPUT") && (e.srcElement.type == "text")) {
			var title = e.srcElement.getAttribute("title");
			if (title) {
				mm_TTS.getAudio(title + " entry area has focus", null);
			}
			
			// reset the box
			e.srcElement.value = ""; 
			userInput = "";
			
			// add key handlers
			e.srcElement.addEventListener("keyup", keyUp = function(e){keyUp_Handler(e);}, false);
			e.srcElement.addEventListener("keydown", keyDown = function(e){keyDown_Handler(e);}, false);
		}
	}
	
	function inputLostFocus(e) {
		if ((e.srcElement.tagName == "INPUT") && (e.srcElement.type == "text")) {
			e.srcElement.removeEventListener("keyup", keyUp, false);
			e.srcElement.removeEventListener("keydown", keyDown, false);
		}
	}
	
	// this means that we have to correct the text entry boxes in the InteractionArea
	
	var userInput = "";
	
	function keyUp_Handler(e) {
		if (e.srcElement.value != userInput) {
			if (e.srcElement.value.length > userInput.length) {
				// character added
				enteredCharacter = e.srcElement.value;
				enteredCharacter = enteredCharacter[enteredCharacter.length - 1];
				mm_TTS.getAudio(getTextForAddedCharacter(enteredCharacter), null);
			}
			else {
				// character removed
				removedCharacter = userInput[userInput.length - 1];
				mm_TTS.getAudio(getTextForRemovedCharacter(removedCharacter), null);
			}
		}
	}
	
	function keyDown_Handler(e) {
		userInput = e.srcElement.value;
	}
	
	function characterToText(character) {
        // need to convert ! to exclamation mark etc...
		var text = character; 
		
		var characterLookUp = [["!", "exclamation mark"], ['"', "double quote"], [" ", "space"], ["'", "single quote"], ["?", "question mark"], [":", "colon"], ["/", "forward slash"], [".", "dot"], ["@", "at"]]; // needs adding to
		
		for (var i = characterLookUp.length; i--;) {
			if (characterLookUp[i][0] == character) {
				text = characterLookUp[i][1];
				break;
			}
		}
		
		return text;
	}
	
	function getTextForAddedCharacter(enteredCharacter) {
		return characterToText(enteredCharacter); 
	}
	
	function getTextForRemovedCharacter(removedCharacter) {
		var text = characterToText(removedCharacter) + " removed";
		return text;
	}
}

function IAP_ButtonModel() {
	this.template = function() {
		var button = document.createElement("input");
		button.setAttribute("type", "button");
		button.style.cssText = "float:left;"; 
		button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
		return button; 
	}
	
	function buttonHasFocus(e) {
		var value = e.srcElement.getAttribute("value");
		if (value) {
			mm_TTS.getAudio(value + " button has focus", null); // null needs to be replaced with the function to attach event - so on blur un attaches event 
		}
	}
}

function IAP_DisplayBoxModel() {
	this.template = function() {
		var textBox = document.createElement("input");
		textBox.setAttribute("type", "text");
		textBox.setAttribute("readonly", "readonly")
		textBox.style.cssText = "float:left;width:400px;";
		return textBox; 
	}
}

function calcHighestZIndex() {
	var highestZ = 0;
	var elements = document.body.querySelectorAll('*'); // document.all;
	var view = document.defaultView;
	for (var i = elements.length; i--;) {
		var element = elements[i];
		if (element.clientHeight > 0) {
			var computerStyle = view.getComputedStyle(element);
			var zIndex = parseInt(computerStyle.getPropertyValue("z-index"));
			if (zIndex != NaN) {
				if (zIndex > highestZ) {
					highestZ = zIndex;
				}
			}
		}
	}
	return highestZ;
}