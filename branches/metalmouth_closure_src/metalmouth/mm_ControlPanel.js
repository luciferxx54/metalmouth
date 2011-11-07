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

goog.provide('mm_ControlPanel');

console.log("loaded controlPanel");

mm_ControlPanel.init = function()
{
	correctTopValuesForAbsolutePositionedElements();
	
	var highestZIndex = calcHighestZIndex();
	
	// only provide ids for elements which are going to be called
	
	var headElement = document.getElementsByTagName("head")[0];
	
	var mmStyleArea = document.createElement("style");
	mmStyleArea.setAttribute("data-mm-uicomponent", "");
	mmStyleArea.innerText = "body{background-position:0px 22px;}ins{display:inline-block;}del{display:inline-block;}code{display:inline-block;}abbr{display:inline-block;}span{display:inline-block;}a{display:inline-block;}#_mm_ShieldImage{position:absolute;top:0px;left:0px;z-index:" + (parseInt(highestZIndex) + 1) + ";" + "width:"  + document.body.scrollWidth + "px;height:" + document.body.scrollHeight + "px;" + "}#_mm_NavArea{position:fixed;top:0px;left:0px;width:2%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InfoArea{position:fixed;top:0px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InteractArea{position:fixed;top:23px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 4) + ";padding:0px;}#_mm_Highlighter{position:absolute;z-index:" + (parseInt(highestZIndex) + 3) + ";}"; // #_mm_HighlighterLegend{background-color:#FFFFFF;color:#000000;position:absolute;top:-14px;border:1px solid #FF8C00;text-size:80px;} 
	
	headElement.appendChild(mmStyleArea);
	
	var mmPushDown = document.createElement("div");
	mmPushDown.setAttribute("data-mm-uicomponent", "");
	mmPushDown.style.width = "100%"; 
	mmPushDown.style.height = "22px";
	document.body.insertBefore(mmPushDown, document.body.firstChild);
	
	var mmShieldImage = new Image();
	mmShieldImage.setAttribute("data-mm-uicomponent", "");
	document.body.insertBefore(mmShieldImage, document.body.children[1]);
	
	var mmContainer = document.createElement("div"); // create the element with goog.dom. Then replace mmContainer with goog.dom.getElement plus the id of the element.
	mmContainer.id = "_mm_Container"; // goog.dom.getElement('_mm_Container')
	mmContainer.className = "_mm_Container"; 
	mmContainer.setAttribute("data-mm-uicomponent", "");
	document.body.appendChild(mmContainer);
	
	var mmNavArea = document.createElement("div");
	mmNavArea.id = "_mm_NavArea";
	mmNavArea.setAttribute("data-mm-uicomponent", "");
	mmContainer.appendChild(mmNavArea);
	navAreaAddHandlers();
	
	var mmInfoArea = document.createElement("div");
	mmInfoArea.id = "_mm_InfoArea";
	mmInfoArea.setAttribute("data-mm-uicomponent", "");
	mmContainer.appendChild(mmInfoArea);
	infoAreaAddHandlers();
	
	// Control panel buttons
	
	var mmNavigationModeFocus = document.createElement("input");
	mmNavigationModeFocus.setAttribute("type", "image");
	mmNavigationModeFocus.style.cssText = "float:left;"; 
	mmNavigationModeFocus.id = "_mm_NavigationModeFocus";
	mmNavigationModeFocus.setAttribute("data-mm-uicomponent", "");
	mmNavigationModeFocus.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+5gz/qwAAAABJRU5ErkJggg==");
	mmNavigationModeFocus.setAttribute("accesskey", "c");
	mmNavigationModeFocus.setAttribute("title", "Navigation mode");
	goog.dom.getElement('_mm_NavArea').appendChild(mmNavigationModeFocus);
	
	var mmVoiceInput = new VoiceInputControlModel();
	goog.dom.getElement('_mm_InfoArea').appendChild(mmVoiceInput.asHtml());
	
	var mmChangeLocationButton = new ChangeLocationButtonModel(); // shortkey B
	goog.dom.getElement('_mm_InfoArea').appendChild(mmChangeLocationButton.asHtml());
	
	var mmDivider = goog.dom.createDom('span', {
		'innerText':'|',
		'data-mm-uicomponent':'',
		'style':'float:left;margin-left:5px;margin-right:5px;'
	});
	
	goog.dom.appendChild(mmInfoArea, mmDivider);
	
	var mmOptionsButton = new OptionsButtonModel();
	goog.dom.getElement('_mm_InfoArea').appendChild(mmOptionsButton.asHtml());
	
	goog.dom.appendChild(mmInfoArea, mmDivider);
	
	var mmCurrentItemDisplay = document.createElement("input");
	mmCurrentItemDisplay.setAttribute("type", "text");
	mmCurrentItemDisplay.setAttribute("readonly", "readonly")
	mmCurrentItemDisplay.style.cssText = "float:left;width:400px;";
	mmCurrentItemDisplay.id = "_mm_CurrentItemDisplayArea";
	mmCurrentItemDisplay.setAttribute("data-mm-uicomponent", "");
	mmCurrentItemDisplay.setAttribute("title", "Current item display area");
	goog.dom.getElement('_mm_InfoArea').appendChild(mmCurrentItemDisplay)
	
	// Areas
	
	var mmHighlighter = document.createElement("div"); // div
	mmHighlighter.id = "_mm_Highlighter";
	mmHighlighter.setAttribute("data-mm-uicomponent", "");
	mmHighlighter.style.cssText = "display:none;"; 
	mmContainer.appendChild(mmHighlighter);
	
	var mmInteractArea = document.createElement("div");
	mmInteractArea.id = "_mm_InteractArea";
	mmInteractArea.setAttribute("data-mm-uicomponent", "");
	mmInteractArea.style.cssText = "display:none;";
	mmContainer.appendChild(mmInteractArea);
	interactAreaAddHandlers();
}

mm_ControlPanel.bringFocus = function()
{
	chrome.extension.sendRequest({retrieveData: 'turnOnVoiceInput'}, function(response) {
		if (response.data != undefined)
		{
			if (response.data.toString() == 'true')
			{
				mm_Navigator.reset();
				var voiceInput = goog.dom.getElement('_mm_VoiceInput');
				voiceInput.style.display = '';
				voiceInput.focus();
			}
			else
			{
				mm_TTS.getAudio("Reading all items", true, function(){focusNoAudio('_mm_NavigationModeFocus');mm_Navigator.reset();mm_Navigator.startReadingNodes();});
			}
		}
	});
}

mm_ControlPanel.drawTextBoxInteract = function(liveTextInputElement, enteredDataType) // node ref needed so enter can set the values in the model and in the live site
{
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	
	var mmTBTextEntry = new TBTextEntry();
	mmTBTextEntry.add();
	
	var mmTBEnterButton = new TBEnterButton();
	mmTBEnterButton.add();
	
	displayInteractionArea(enteredDataType, null);
	
	function cancelInput()
	{
		mm_TTS.getAudio(enteredDataType + " entry area closed. Navigation mode entered.", false, function(){focusNoAudio('_mm_NavigationModeFocus');});
		mmInteractionArea.innerHTML = ""; 
		mmInteractionArea.style.display = "none";
	}
	
	function enter()
	{
		liveTextInputElement.value = document.getElementById("_mm_TBTextEntry").value;
	}
	
	function TBTextEntry()
	{
		// constructor
		var textBox = new CP_TextBoxModel();
		var tBTextEntry = textBox.template();
		tBTextEntry.id = "_mm_TBTextEntry";
		tBTextEntry.setAttribute("data-mm-uicomponent", "");
		tBTextEntry.setAttribute("title", enteredDataType);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(tBTextEntry);
		}
	}
	
	function TBEnterButton()
	{
		var tBEnterButton = iap_Button.template();
		tBEnterButton.id = "_mm_TBEnterButton";
		tBEnterButton.setAttribute("data-mm-uicomponent", "");
		tBEnterButton.setAttribute("value", "Enter");
		tBEnterButton.addEventListener("click", function(){enter();cancelInput();}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(tBEnterButton);
		}
	}
}

mm_ControlPanel.drawCheckButtonInteract = function(liveCheckInputElement) // - services radio button and checkboxes
{
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	
	var mmCheckButton = new CheckButtonModel();
	mmCheckButton.add();
	
	var mmUncheckButton = new UncheckButtonModel();
	mmUncheckButton.add();
	
	displayInteractionArea("check button", null);
	
	function cancelInput()
	{
		mm_TTS.getAudio("check button entry area closed. Navigation mode entered.", false, function(){focusNoAudio('_mm_NavigationModeFocus');});
		mmInteractionArea.innerHTML = ""; 
		mmInteractionArea.style.display = "none";
	}
	
	function enter(e)
	{
		if (e.srcElement.value == "check")
		{
			liveCheckInputElement.checked = true;
		}
		else
		{
			liveCheckInputElement.checked = false;
		}
	}
	
	function CheckButtonModel()
	{
		var checkButton = iap_Button.template();
		checkButton.id = "_mm_CheckButton";
		checkButton.setAttribute("data-mm-uicomponent", "");
		checkButton.setAttribute("value", "check");
		checkButton.addEventListener("click", function(e){enter(e);cancelInput();}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(checkButton);
		}
	}
	
	function UncheckButtonModel()
	{
		var uncheckButton = iap_Button.template();
		uncheckButton.id = "_mm_UncheckButton";
		uncheckButton.setAttribute("data-mm-uicomponent", "");
		uncheckButton.setAttribute("value", "uncheck");
		uncheckButton.addEventListener("click", function(e){enter(e);cancelInput();}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(uncheckButton);
		}
	}
}

mm_ControlPanel.drawSelectMenuInteract = function(liveSelectInputElement)
{
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
	mmInteractionArea.innerHTML = ""; 
	
	// get all options and add them as buttons
	
	var options = liveSelectInputElement.getElementsByTagName("option");
	
	var count = 0;
	for (var i in options)
	{
		if (options[i].tagName == "OPTION")
		{
			var mmOptionButton = document.createElement("input");
			mmOptionButton.setAttribute("type", "button");
			mmOptionButton.style.cssText = "float:left;background-color:#99CCFF;border:0px solid;";
			mmOptionButton.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
			mmOptionButton.id = count;
			mmOptionButton.setAttribute("data-mm-uicomponent", "");
			mmOptionButton.setAttribute("value", options[i].innerText);
			mmOptionButton.addEventListener("click", function(e){goog.dom.getElement('_mm_CloseMenuButton').click();optionSelected(e)}, false); // mirror this above in text input for enter
			mmInteractionArea.appendChild(mmOptionButton);
			count++;
		}
	}
	
	displayInteractionArea("select", null);
	
	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("value") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("value") + " option has focus", false, null);
		}
	}
	
	function optionSelected(e)
	{
		liveSelectInputElement.selectedIndex = e.srcElement.id;
		fireChangeEvt(liveSelectInputElement);
	}
	
	function fireChangeEvt(onThisElement)
	{
		var changeEvt = document.createEvent("HTMLEvents");
		changeEvt.initEvent("change", false, true); // bubbles - false, default action preventable
		onThisElement.dispatchEvent(changeEvt);
	}
}

mm_ControlPanel.drawRangeInputInteract = function(liveTextInputElement) // - services input elements with a type attribute set to range
{
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = goog.dom.getElement('_mm_InteractArea');
	var min = asFloatOrInt(liveTextInputElement.getAttribute("min"));
	var max = asFloatOrInt(liveTextInputElement.getAttribute("max"));
	var step = asFloatOrInt(liveTextInputElement.getAttribute("step"));
	
	var toHowManyDecimalPlaces = function(num)
	{
		if (num.toString().indexOf('.') != -1)
		{
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
	
	displayInteractionArea("range input", null);
	
	function cancelInput()
	{
		mm_TTS.getAudio("range input entry area closed. Navigation mode entered.", false, function(){focusNoAudio('_mm_NavigationModeFocus');});
		mmInteractionArea.innerHTML = ""; 
		mmInteractionArea.style.display = "none";
	}
	
	function enter()
	{
		liveTextInputElement.value = currentValue;
	}
	
	function asFloatOrInt(text)
	{
		return (text.toString().indexOf('.') != -1) ? parseFloat(text) : parseInt(text);
	}
	
	function calculateSteps()
	{
		// to calculate steps (max - min / step * x) increasing x by 1 until answer > 20 remembering value usually starts in the middle
		var x = 1; 
		
		while (((max - min)/(step * x)) > 20)
		{
			x++;
		}
		
		return step * x; 
	}
	
	function changeValue(action)
	{
		switch(action)
		{
			case "increase":
				if ((asFloatOrInt(currentValue) + changedStep).toFixed(howManyDecimalPlaces) <= max)
				{
					currentValue = (asFloatOrInt(currentValue) + changedStep).toFixed(howManyDecimalPlaces);
					mm_TTS.getAudio("value to enter increased to " + currentValue, false, null);
				}
				else
				{
					mm_TTS.getAudio("maximum value " + currentValue + " reached", false, null);
				}
				break;
			case "decrease":
				if ((asFloatOrInt(currentValue) - changedStep).toFixed(howManyDecimalPlaces) >= min)
				{
					currentValue = (asFloatOrInt(currentValue) - changedStep).toFixed(howManyDecimalPlaces);
					mm_TTS.getAudio("value to enter decreased to " + currentValue, false, null);
				}
				else
				{
					mm_TTS.getAudio("minimum value " + currentValue + " reached", false, null);
				}
				break;
		}
	}
	
	function IncreaseValueButtonModel()
	{
		var increaseValueButton = iap_Button.template();
		increaseValueButton.id = "_mm_IncreaseButton";
		increaseValueButton.setAttribute("data-mm-uicomponent", "");
		increaseValueButton.setAttribute("value", "Increase value");
		increaseValueButton.addEventListener("click", function(){changeValue("increase");}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(increaseValueButton);
		}
	}
	
	function DecreaseValueButtonModel()
	{
		var decreaseValueButton = iap_Button.template();
		decreaseValueButton.id = "_mm_DecreaseButton";
		decreaseValueButton.setAttribute("data-mm-uicomponent", "");
		decreaseValueButton.setAttribute("value", "Decrease value");
		decreaseValueButton.addEventListener("click", function(){changeValue("decrease");}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(decreaseValueButton);
		}
	}
	
	function RangeEnterButton()
	{
		var rangeEnterButton = iap_Button.template();
		rangeEnterButton.id = "_mm_rangeEnterButton";
		rangeEnterButton.setAttribute("data-mm-uicomponent", "");
		rangeEnterButton.setAttribute("value", "Enter");
		rangeEnterButton.addEventListener("click", function(){enter();cancelInput();}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(rangeEnterButton);
		}
	}
}

mm_ControlPanel.drawMediaInteract = function(liveMediaElement, mediaType) // - services video and audio
{
	// Should also handle track selection
	
	var iap_Button = new IAP_ButtonModel();
	var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
	
	var mmPlayButton = new PlayButtonModel();
	mmPlayButton.add();
	
	var mmPauseButton = new PauseButtonModel();
	mmPauseButton.add();
	
	var mmRewindButton = new RewindButtonModel();
	mmRewindButton.add();
	
	displayInteractionArea(mediaType, null);
	
	function controlMedia(actionName)
	{
		switch(actionName)
		{
			case "play":
				liveMediaElement.play();
				mm_TTS.getAudio(mediaType + " playing", false, function(){document.getElementById("_mm_PauseButton").focus();});
				break;
			case "pause":
				liveMediaElement.pause();
				mm_TTS.getAudio(mediaType + " paused", false, function(){document.getElementById("_mm_PlayButton").focus();});
				break;
			case "rewind":
				liveMediaElement.currentTime = 0;
				liveMediaElement.pause();
				mm_TTS.getAudio(mediaType + " rewound", false, function(){document.getElementById("_mm_PlayButton").focus();});
				break;
		}
	}
	
	function PlayButtonModel()
	{
		var playButton = iap_Button.template();
		playButton.id = "_mm_PlayButton";
		playButton.setAttribute("data-mm-uicomponent", "");
		playButton.setAttribute("value", "Play");
		playButton.addEventListener("click", function(){controlMedia("play");}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(playButton);
		}
	}
	
	function PauseButtonModel()
	{
		var pauseButton = iap_Button.template();
		pauseButton.id = "_mm_PauseButton";
		pauseButton.setAttribute("data-mm-uicomponent", "");
		pauseButton.setAttribute("value", "Pause");
		pauseButton.addEventListener("click", function(){controlMedia("pause");}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(pauseButton);
		}
	}
	
	function RewindButtonModel()
	{
		var rewindButton = iap_Button.template();
		rewindButton.id = "_mm_RewindButton";
		rewindButton.setAttribute("data-mm-uicomponent", "");
		rewindButton.setAttribute("value", "Rewind");
		rewindButton.addEventListener("click", function(){controlMedia("rewind");}, false);
		
		this.add = function()
		{
			mmInteractionArea.appendChild(rewindButton);
		}
	}
}

mm_ControlPanel.getPageTitle = function()
{
	var titleElement = document.getElementsByTagName("title")[0];
	
	var pageTitle = "Current page has no title";
	
	if (titleElement != null)
	{
		if (titleElement.innerText != "")
		{
			pageTitle = titleElement.innerText;
		}
	}	
	return pageTitle;
}

var pageCulture = null;

mm_ControlPanel.getPageCulture = function()
{
	if (pageCulture == null)
	{
		var culture = "en-US"; // default
		var metaElements = document.getElementsByTagName("meta");
		if (metaElements.length > 0)
		{
			for (var i in metaElements)
			{
				if (metaElements[i].tagName == "META")
				{
					if (metaElements[i].hasAttribute("http-equiv") && metaElements[i].hasAttribute("content"))
					{
						pageCulture = metaElements[i].getAttribute("content");
					}
				}
			}
		}
	}
	return pageCulture;
}

// added 

function focusNoAudio(id)
{
	goog.dom.getElement(id).focus();
}

function focusWithAudio(id)
{
	focusNoAudio(id);
	
	// add audio
	
	var title = goog.dom.getElement(id).getAttribute("title");
	
	if (title != "")
	{
		mm_TTS.getAudio(title + " button has focus", false, null);
	}
}

function isEnabled(id)		
{
	var result = false;
	if (goog.dom.getElement(id).style.opacity == "1")
	{
		result = true;
	}
	return result;
}

function displayInteractionArea(name, buttonName)
{
	// add a closebutton
	
	var mmCloseMenuButton = new CloseMenuButtonModel(name, buttonName);
	
	var mmInteractionArea = document.getElementById("_mm_InteractArea");
	
	mmInteractionArea.appendChild(mmCloseMenuButton.asHtml());
	
	// display
	
	mmInteractionArea.style.cssText = "";
	
	function CloseMenuButtonModel(menuName, menuButtonName) // generic sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var closeMenuButton = iap_Button.template();
		closeMenuButton.id = "_mm_CloseMenuButton";
		closeMenuButton.setAttribute("data-mm-uicomponent", "");
		closeMenuButton.setAttribute("value", "Close menu");
		closeMenuButton.style.opacity = "1"; 
		closeMenuButton.addEventListener("click", function(){closeMenu()}, false);
		
		this.asHtml = function()
		{
			return closeMenuButton;
		}
		
		function closeMenu()  // this needs to be passed in to this function - it should reside in the 
		{
			if (menuButtonName == null)
			{
				mm_TTS.getAudio(menuName + " menu closed. Navigation mode entered.", false, function(){focusNoAudio('_mm_NavigationModeFocus');});
			}
			else
			{
				mm_TTS.getAudio(menuName + " menu closed", false, function(){document.getElementById(menuButtonName).focus();});
			}
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		this.focus = function()
		{
			closeMenuButton.focus();
		}
		
		this.click = function()
		{
			closeMenu();
		}
	}
}

// compact navAreaAddHandlers, infoAreaAddHandlers and interactAreaAddHandlers

function navAreaAddHandlers()
{
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; // this needs changing
	var textIfButtonDisabled;
	var alreadyBusy = false; 
	var arrowSelected;
	
	var navArea = goog.dom.getElement('_mm_NavArea');
	navArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
	navArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	
	function hotKeyDown_Handler(e)
	{
		if (alreadyBusy == false)
		{
			setAlreadyBusy(true);
			
			var selected = false; 
			
			switch(e.keyIdentifier.toString())
			{
					// special cases for arrowing around page
				case "Up": // ReadPrevButton
					selected = true;
					arrowSelected = "Up"; 
					keyBeingTimed = e.keyIdentifier.toString();  
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue = false;
					break;
				case "Down": // ReadNextButton
					selected = true;
					arrowSelected = "Down";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue = false;
					break;
				case "Left": // back to start
					selected = true;
					arrowSelected = "Left";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue=false;
					break;	
				case "Right": // jump
					selected = true;
					arrowSelected = "Right";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue=false;
					break;	
				case "U+0020": // space bar to start and stop read on, enter should be used with button interaction
					selected = true;
					arrowSelected = "Space";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue=false;
					break;
				case "Enter":
					selected = true;
					arrowSelected = "Enter";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue=false;
					break;
					
					// end special cases
					
				case "U+0042": // b - change location 
					selected = true;
					keyBeingTimed = e.keyIdentifier.toString();
					buttonId = '_mm_ChangeLocationButton'; 
					textIfButtonDisabled = "Change location button is currently disabled";
					hotKeyTimer = window.setTimeout(functionToRun, 500);
					break;
				default: 
					// if this is not one of the above we need to set alreadybusy to false... 
					if (selected == false)
					{
						setAlreadyBusy(false);
					}
					break;
			}
		}
	}
	
	function hotKeyUp_Handler(e)
	{
		// cancels timer
		if (e.keyIdentifier.toString() == keyBeingTimed)
		{
			clearTimeout(hotKeyTimer);
			setAlreadyBusy(false);
		}
	}
	
	function functionToRun()
	{
		// running function
		focusWithAudio(buttonId);
		if (isEnabled(buttonId) == true)
		{
			focusWithAudio(buttonId);
			setAlreadyBusy(false);
		}
		else
		{
			mm_TTS.getAudio(textIfButtonDisabled, false, setAlreadyBusy(false));
		}
	}
	
	function specialCasesFunctionToRun() // this is for down and up arrowing
	{
		if (arrowSelected == "Enter")
		{
			mm_Navigator.interact();
		}
		else if(arrowSelected == "Up")
		{
			mm_Navigator.readPrevNode();
		}
		else if(arrowSelected == "Down")
		{
			mm_Navigator.readNextNode();
		}
		else if(arrowSelected == "Space")
		{
			if (readNodesStop == true)
			{
				mm_Navigator.startReadingNodes();
			}
			else
			{
				mm_Navigator.stopReadingNodes();
			}
		}
		else if(arrowSelected == "Right")
		{
			mm_Navigator.jump();
		}
		else // if(arrowSelected == "Right")
		{
			mm_Navigator.backToStart();
		}
	}
	
	function setAlreadyBusy(value)
	{
		alreadybusy = value;
	}
}

function infoAreaAddHandlers()
{
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; 
	var textIfButtonDisabled;
	var alreadyBusy = false; 
	
	var infoArea = goog.dom.getElement('_mm_InfoArea');
	infoArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
	infoArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	
	function hotKeyDown_Handler(e)
	{
		if (alreadyBusy == false)
		{
			setAlreadyBusy(true);
			
			var selected = false; 
			
			switch(e.keyIdentifier.toString())
			{
				case "U+001B": // escape
					selected = true;
					keyBeingTimed = e.keyIdentifier.toString();
					buttonId = '_mm_NavigationModeFocus'; 
					hotKeyTimer = window.setTimeout(functionToRun, 10);
					break;
				default: 
					// if this is not one of the above we need to set alreadybusy to false... 
					if (selected == false)
					{
						setAlreadyBusy(false);
					}
					break;
			}
		}
	}
	
	function hotKeyUp_Handler(e)
	{
		// cancels timer
		if (e.keyIdentifier.toString() == keyBeingTimed)
		{
			clearTimeout(hotKeyTimer);
			setAlreadyBusy(false);
		}
	}
	
	function functionToRun()
	{
		// running function
		focusWithAudio(buttonId);
		setAlreadyBusy(false);
	}
	
	function setAlreadyBusy(value)
	{
		alreadybusy = value;
	}
}

function interactAreaAddHandlers()
{
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; 
	var textIfButtonDisabled;
	var alreadyBusy = false; 
	var arrowSelected;
	
	var interactArea = goog.dom.getElement('_mm_InteractArea');
	interactArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
	interactArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	
	function hotKeyDown_Handler(e)
	{
		if (alreadyBusy == false)
		{
			setAlreadyBusy(true);
			
			var selected = false; 
			
			switch(e.keyIdentifier.toString())
			{
				case "Up":
					selected = true;
					arrowSelected = "Up"; 
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue = false;
					break;
				case "Down":
					selected = true;
					arrowSelected = "Down";
					keyBeingTimed = e.keyIdentifier.toString();
					hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
					window.event.returnValue = false;
					break;
				case "U+001B": // escape
					selected = true;
					keyBeingTimed = e.keyIdentifier.toString();
					buttonId = '_mm_CloseMenuButton'; 
					textIfButtonDisabled = "Close menu button is currently disabled";
					hotKeyTimer = window.setTimeout(functionToRun, 500);
					break;
				default: 
					// if this is not one of the above we need to set alreadybusy to false... 
					if (selected == false)
					{
						setAlreadyBusy(false);
					}
					break;
			}
		}
	}
	
	function hotKeyUp_Handler(e)
	{
		// cancels timer
		if (e.keyIdentifier.toString() == keyBeingTimed)
		{
			clearTimeout(hotKeyTimer);
			setAlreadyBusy(false);
		}
	}
	
	function specialCasesFunctionToRun()
	{
		var focusIndex = 0;
		
		for (var i in interactArea.children)
		{
			if (interactArea.children[i] == document.activeElement)
			{
				focusIndex = i;
				break;
			}
		}
		
		if (arrowSelected == "Up")
		{
			if (focusIndex > 0)
			{
				interactArea.children[parseInt(focusIndex) - 1].focus();
			}
		}
		
		if (arrowSelected == "Down")
		{
			if (focusIndex < (interactArea.children.length - 1))
			{
				interactArea.children[parseInt(focusIndex) + 1].focus();
			}
		}
	}
	
	function functionToRun()
	{
		focusWithAudio(buttonId);
		if (isEnabled(buttonId) == true)
		{
			focusWithAudio(buttonId);
			setAlreadyBusy(false);
		}
		else
		{
			mm_TTS.getAudio(textIfButtonDisabled, false, setAlreadyBusy(false));
		}
	}
	
	function setAlreadyBusy(value)
	{
		alreadybusy = value;
	}
}

function CP_TextBoxModel()
{
	this.template = function()
	{
		var textBox = document.createElement("input");
		textBox.setAttribute("type", "text");
		textBox.style.cssText = "float:left;width:400px;";
		textBox.addEventListener("focus", function(e){inputHasFocus(e);}, false);
		textBox.addEventListener("blur", function(e){inputLostFocus(e);}, false);
		return textBox; 
	}		
	
	function inputHasFocus(e)
	{
		if ((e.srcElement.tagName == "INPUT") && (e.srcElement.type == "text"))
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				mm_TTS.getAudio(e.srcElement.getAttribute("title") + " entry area has focus", false, null);
			}
			
			// reset the box
			e.srcElement.value = ""; 
			userInput = "";
			
			// add key handlers
			e.srcElement.addEventListener("keyup", keyUp = function(e){keyUp_Handler(e);}, false);
			e.srcElement.addEventListener("keydown", keyDown = function(e){keyDown_Handler(e);}, false);
		}
	}
	
	function inputLostFocus(e)
	{
		if ((e.srcElement.tagName == "INPUT") && (e.srcElement.type == "text"))
		{
			e.srcElement.removeEventListener("keyup", keyUp, false);
			e.srcElement.removeEventListener("keydown", keyDown, false);
		}
	}
	
	// this means that we have to correct the text entry boxes in the InteractionArea
	
	var userInput = "";
	
	function keyUp_Handler(e)
	{
		if (e.srcElement.value != userInput)
		{
			if (e.srcElement.value.length > userInput.length)
			{
				// character added
				enteredCharacter = e.srcElement.value;
				enteredCharacter = enteredCharacter[enteredCharacter.length - 1];
				mm_TTS.getAudio(getTextForAddedCharacter(enteredCharacter), false, null);
			}
			else
			{
				// character removed
				removedCharacter = userInput[userInput.length - 1];
				mm_TTS.getAudio(getTextForRemovedCharacter(removedCharacter), false, null);
			}
		}
	}
	
	function keyDown_Handler(e)
	{
		userInput = e.srcElement.value;
	}
	
	function characterToText(character)
	{
		var text = character; 
		
		var characterLookUp = [["!", "exclamation mark"], ['"', "double quote"], [" ", "space"], ["'", "single quote"], ["?", "question mark"], [":", "colon"], ["/", "forward slash"], [".", "dot"]]; // needs adding to
		
		for (var i in characterLookUp)
		{
			if (characterLookUp[i][0] == character)
			{
				text = characterLookUp[i][1];
				break;
			}
		}
		
		return text;
		
		// need to convert ! to exclamation mark etc...
	}
	
	function getTextForAddedCharacter(enteredCharacter)
	{
		return characterToText(enteredCharacter); 
	}
	
	function getTextForRemovedCharacter(removedCharacter)
	{
		var text = characterToText(removedCharacter) + " removed";
		return text;
	}
}

function IAP_ButtonModel()
{
	this.template = function()
	{
		var button = document.createElement("input");
		button.setAttribute("type", "button");
		button.style.cssText = "float:left;"; 
		button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
		return button; 
	}
	
	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("value") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("value") + " button has focus", false, null);
		}
	}
}

function VoiceInputControlModel()
{
	var voiceInput = goog.dom.createDom('input', {
										'type':'text',
										'id':'_mm_VoiceInput',
										'style':'float:left;display:none;',
										'title':'Voice input area'
										});
	
	voiceInput.setAttribute('data-mm-uicomponent');
	voiceInput.setAttribute('x-webkit-speech');
	voiceInput.addEventListener("focus", function(e){voiceInput_Focus(e);}, false);
	voiceInput.addEventListener("webkitspeechchange", function(e){voiceInput_Change(e);}, false);
	
	this.asHtml = function()
	{
		return voiceInput;
	}
	
	function voiceInput_Focus(e)
	{
		voiceInput.addEventListener("blur", voiceInputLostFocus = function(e){voiceInput_Blur(e);}, false);
		
		if (e.srcElement.getAttribute("title") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("title") + " has focus.", true, null);
		}
	}
	
	function voiceInput_Change(e)
	{
		var commandRecognised = false;
		
		var findWordFromSimilarWords = function() // this will locate similar words from those used to simplistically train the speech engine
		{
			var mmVoiceCommands = ['all', 'next', 'previous', 'do', 'stop', 'continue', 'jump', 'settings', 'location'];
			
			for (var i=0; i < 5; i++)
			{
				var utterance = e.results[i].utterance;
				if (utterance != undefined)
				{
					if (mmVoiceCommands.indexOf(utterance) != -1) // best guess this is what people were after 
					{
						return utterance;
					}
				}
				else
				{
					break;
				}
			}
			
			return null;
		}
		
		var command = findWordFromSimilarWords(command);
		
		console.log(command);
		// reset box
		e.srcElement.value = "";
		
		switch(command)
		{
			case 'all':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command all", true, null);
				mm_Navigator.startReadingNodes();
				break;
			case 'next':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command next", true, null);
				mm_Navigator.readNextNode();
				break;
			case 'previous':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command previous", true, null);
				mm_Navigator.readPrevNode();
				break;
			case 'do':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command do", true, null);
				mm_Navigator.interact();
				break;
			case 'stop':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command stop", true, null);
				mm_Navigator.stopReadingNodes();
				break;
			case 'continue':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command continue", true, null);
				mm_Navigator.startReadingNodes();
				break;
			case 'jump':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command jump", true, null);
				mm_Navigator.jump();
				break;
			case 'settings':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command settings", true, null);
				goog.dom.getElement('_mm_OptionsButton').click();
				break;
			case 'location':
				commandRecognised = true;
				mm_TTS.getAudio("recognised command location", true, null);
				goog.dom.getElement('_mm_ChangeLocationButton').click();
				break;
			default:
				if (commandRecognised == false)
				{
					mm_TTS.getAudio("command not recognised", true, null);
				}
				break;
		}
	}
	
	function voiceInput_Blur(e)
	{
		voiceInput.removeEventListener("blur", voiceInputLostFocus, false);
		mm_TTS.getAudio("speak now", false, null);
	}
}

function OptionsButtonModel()
{
	var optionsButton = document.createElement("input");
	optionsButton.setAttribute("type", "button");
	optionsButton.setAttribute("value", "Options");
	optionsButton.style.cssText = "float:left;";
	optionsButton.id = "_mm_OptionsButton";
	optionsButton.setAttribute("data-mm-uicomponent", "");
	optionsButton.addEventListener("click", openOptionsPage, false);
	optionsButton.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
	optionsButton.style.opacity = "1";	
	
	this.asHtml = function()
	{
		return optionsButton;
	}
	
	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("value") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("value") + " button has focus", false, null);
		}
	}
	
	function openOptionsPage()
	{		 
		chrome.extension.sendRequest({optionsPageOpen: 'true'});
	}
}

function ChangeLocationButtonModel()
{
	// constructor

	var changeLocationButton = document.createElement("input");
	changeLocationButton.setAttribute("type", "button");
	changeLocationButton.setAttribute("value", "Change location");
	changeLocationButton.style.cssText = "float:left;";
	changeLocationButton.id = "_mm_ChangeLocationButton";
	changeLocationButton.setAttribute("data-mm-uicomponent", "");
	changeLocationButton.addEventListener("click", openChangeLocationMenu, false);
	changeLocationButton.addEventListener("focus", function(e){buttonHasFocus(e);}, false);

	changeLocationButton.style.opacity = "1";
	
	this.asHtml = function()
	{
		return changeLocationButton;
	}

	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("value") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("value") + " button has focus", false, null);
		}
	}
	
	function openChangeLocationMenu()
	{		
		mm_TTS.getAudio("Change location menu drop-down entered 3 options available", false, changeFocus);
		
		function changeFocus()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.children[0].focus();
		}
		
		drawChangeLocationSubMenu();
	}
	
	function drawChangeLocationSubMenu() // node ref needed so enter can set the values in the model and in the live site
	{
		var mmInteractionArea = goog.dom.getElement('_mm_InteractArea'); 
		mmInteractionArea.innerHTML = "";
		
		var mmBackButton = new BackButtonModel();
		mmInteractionArea.appendChild(mmBackButton.asHtml());
		
		var mmNewUrlButton = new NewUrlButtonModel();
		mmInteractionArea.appendChild(mmNewUrlButton.asHtml());
		
		displayInteractionArea("Change location", "_mm_ChangeLocationButton");
	}
	
	function BackButtonModel() // sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var backButton = iap_Button.template();
		backButton.id = "_mm_BackButton";
		backButton.setAttribute("data-mm-uicomponent", "");
		backButton.setAttribute("value", "Go back")
		backButton.addEventListener("click", back, false);
		
		this.asHtml = function()
		{
			return backButton;
		}
		
		function back()
		{
			history.go(-1);
		}
	}
	
	function NewUrlButtonModel() // sits in change location sub menu
	{
		var iap_Button = new IAP_ButtonModel();
		var newUrlButton = iap_Button.template();
		newUrlButton.id = "_mm_EnterUrlButton";
		newUrlButton.setAttribute("data-mm-uicomponent", "");
		newUrlButton.setAttribute("value", "Enter url");
		newUrlButton.addEventListener("click", newUrl, false);
		
		this.asHtml = function()
		{
			return newUrlButton;
		}
		
		function newUrl()
		{
			newUrlButton.style.display = "none"; // make button disappear 
			
			var urlTextEntry = new URLTextEntry();
			urlTextEntry.add();
			
			var functionToRun = function()
			{
				// changes the url of the tab page
				
				var userEnteredUrl = document.getElementById("_mm_URLTextEntry").value;
				if (userEnteredUrl != "") // other checks are also needed
				{
					document.location.href = document.getElementById("_mm_URLTextEntry").value;
				}
			}
			
			var urlEnterButton = new UrlEnterButtonModel(functionToRun);
			urlEnterButton.add();
			urlTextEntry.focus();
		}
		
		function URLTextEntry()
		{
			// constructor
			var textBox = new CP_TextBoxModel();
			var uRLTextEntry = textBox.template();
			uRLTextEntry.id = "_mm_URLTextEntry";
			uRLTextEntry.setAttribute("data-mm-uicomponent", "");
			uRLTextEntry.setAttribute("title", "u r l");
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.insertBefore(uRLTextEntry, mmInteractionArea.lastChild);
			}
			
			this.focus = function()
			{
				uRLTextEntry.focus();
			}
		}
		
		function UrlEnterButtonModel(functionToRun) // generic sits in change location sub menu
		{
			// constructor
			var iap_Button = new IAP_ButtonModel();
			var urlEnterButton = iap_Button.template();
			urlEnterButton.id = "_mm_UrlEnterButton";
			urlEnterButton.setAttribute("data-mm-uicomponent", "");
			urlEnterButton.setAttribute("value", "Go");
			urlEnterButton.addEventListener("click", functionToRun, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.insertBefore(urlEnterButton, mmInteractionArea.lastChild);
			}
		}
	}
}

// Utilities 
// utilities.js

function calcHighestZIndex()
{
	var highestZ = 0;
	var elements = document.all;
	for (var i in elements)
	{
		if (elements[i].tagName != null)
		{
			try
			{
				var zIndex = document.defaultView.getComputedStyle(elements[i]).getPropertyValue("z-index");
				if (zIndex != "")
				{
					if (parseInt(zIndex) > highestZ)
					{
						highestZ = zIndex;
					}
				}
			}
			catch(err)
			{
				console.log(err);
			}
		}
	}
	return highestZ;
}

function correctTopValuesForAbsolutePositionedElements()
{
	walkDOM(document.getElementsByTagName("BODY")[0]);
	
	function walkDOM(element)
	{
		do 
		{
			if (element.tagName != null)
			{
				if (document.defaultView.getComputedStyle(element).getPropertyValue("position") == "relative")
				{
					// do nothing
				}
				else if (document.defaultView.getComputedStyle(element).getPropertyValue("position") == "absolute")
				{
					var top = document.defaultView.getComputedStyle(element).getPropertyValue("top");
					if (top != "")
					{
						if (top.toLowerCase() != "auto")
						{
							var cssUnits = ["px","%","in","cm","mm","em","ex","pt","pc"];
							
							var units = ""; 
							
							for (var a in cssUnits)
							{
								if (top.toLowerCase().indexOf(cssUnits[a]) != -1)
								{
									units = cssUnits[a];
									break;
								}
							}
							
							if (units != "") // if it has units - css should have units otherwise the browser might have to guess.
							{
								var topToChars = top.split("");
								var topAsNumber = "";
								
								var charactersOfInterest = ["-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
								
								for (var x = 0; x < topToChars.length; x++)
								{
									if (charactersOfInterest.indexOf(topToChars[x]) != -1)
									{
										topAsNumber = topAsNumber + topToChars[x];
									}
								}
								
								topAsNumber = parseInt(topAsNumber);
								
								topAsNumber = topAsNumber + 22;
								
								var currentStyleAttribute = element.style.cssText;
								
								// to show what has been changed
								
								element.setAttribute("ccChanged", "true");
								
								if (currentStyleAttribute == "")
								{
									element.style.cssText = "top:" + topAsNumber.toString() + units + ";"; // needs to add 22 to top
								}
								else
								{
									element.style.cssText = element.style.cssText + ";top:" + topAsNumber.toString() + units + ";";
									element.style.cssText = element.style.cssText.replace(/;;/g, ";");
								}
							}
						}
					}
				}
				// code end
				else
				{			
					if (element.hasChildNodes())
					{
						walkDOM(element.firstChild);
					}
				}
			}
		} 
		while (element = element.nextSibling)
			}
}

// Highlighter
function calcPosition(positionElement)
{
	var element_coordinates = [4];
	var left = 0;
	var top = 0;
	var width = 0;
	var height = 0;
	
	width = positionElement.scrollWidth;
	height = positionElement.scrollHeight;
	
	var allXPadding = 0;
	var allYPadding = 0;
	var allXMargin = 0;
	var allYMargin = 0;
	
	while (positionElement != null)
	{
		allXPadding = allXPadding + positionElement.clientLeft;
		allXPadding = allYPadding + positionElement.clientTop;
		allXMargin = allXMargin + positionElement.offsetLeft;
		allYMargin = allYMargin + positionElement.offsetTop;
		positionElement = positionElement.offsetParent;
	}
	
	left = allXPadding + allXMargin; 
	top = allYPadding + allYMargin; 
	
	element_coordinates[0] = left;
	element_coordinates[1] = top;
	element_coordinates[2] = width;
	element_coordinates[3] = height;
	return element_coordinates; 
}

function restoreHighlighter()
{
	var highlighter = document.getElementById("_mm_Highlighter");
	highlighter.style.cssText = "display:none;";
}

function drawCurrentElementHighlighterAreaFromLive(osmType, liveElement)
{	
	var positions = calcPosition(liveElement);
	
	var x = positions[0];
	var y = positions[1];
	var width = positions[2];
	var height = positions[3];
	
	if ((x <= 0)||(x >= document.body.scrollWidth)||(y <=0)||(y >= document.body.scrollHeight)||(width == 0)||(height == 0))
	{
		goog.dom.getElement('_mm_CurrentItemDisplayArea').value = osmType + " (offscreen)";
	}
	else
	{
		goog.dom.getElement('_mm_CurrentItemDisplayArea').value = osmType;
		drawRectangleFromCoords(x, y, width, height, false);
	}
}

function drawRectangleFromCoords(x, y, width, height, includeCircle)
{
	var highlighter = document.getElementById("_mm_Highlighter");
	if (highlighter != null)
	{
		highlighter.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + width + "px;height:" + height + "px;";
		highlighter.scrollIntoView();
		// amend scroll position due to metal mouth control panel 
		var scrollPosY = window.scrollY;
		window.scrollTo(0, scrollPosY - 40);
		// paint following after scroll otherwise their paint might be disrupted
		highlighter.style.border = "2px solid #FF8C00";
		window.scrollTo(0, window.scrollY - 1); // forces the page to refresh - otherwise sometimes partial squares are left visable
		
	}
}