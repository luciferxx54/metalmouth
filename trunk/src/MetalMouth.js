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

console.log("loaded Metal Mouth");

chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
	if (request.greeting == "hello")
	{
		sendResponse({farewell: "goodbye"});
	}
	else
	{
		sendResponse({});
	}
});

var sequencerFunctions = 
[
 initMmId,
 initBodyDOM,
 removeExistingAccesskeys,
 initControlPanel,
 initOSM,
 initSVB,
 updateOSM,
 resetSVB,
 bringFocus
 ];

var sequencerNextItem;
var sequencerCurrentItem;

function sequencer()
{
	sequencerCurrentItem = sequencerNextItem;
	sequencerNextItem = sequencerNextItem + 1;
	sequencerFunctions[sequencerCurrentItem]();
}

var bodyDOM;
var controlPanel;
var osm;
var svb;

function start()
{
	sequencerNextItem = 0;
	sequencerCurrentItem = 0;
	sequencer();
}

function initMmId()
{
	var htmlElement = document.all;
	
	for (var i = 0; i < htmlElement.length; i++)
	{
		if (htmlElement[i].tagName != null)
		{
			htmlElement[i].setAttribute("_mm_Id", i); // give all a _mm_Id attribute in advance
		}
	}
	sequencer();
}

function BodyDOM(dom)
{
	this.dom = dom;
}

function initBodyDOM()
{
	bodyDOM = new BodyDOM(document.body.innerHTML);
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
	controlPanel = new MMControlPanelModel();
	sequencer();
}

function initOSM()
{
	osm = new OSMModel();
	sequencer();
}

function initSVB()
{
	svb = new SVBModel();
	sequencer();
}

function updateOSM(dom)
{
	osm.update(bodyDOM.dom);
	sequencer();
}

function resetSVB()
{
	svb.reset();
	sequencer();
}

function bringFocus()
{
	var mmControlPanelFocus = document.getElementById("_mm_ControlPanelFocus");
	if (mmControlPanelFocus != null)
	{
		mmControlPanelFocus.click();
	}
}

//--------------

function MMControlPanelModel()
{		
	getAudio(getPageTitle(), true, null); // not the best place for this, but otherwise init page description sequence is messed up
	
	var highestZIndex = calcHighestZIndex();
		
	var headElement = document.getElementsByTagName("head")[0];
	var mmStyleArea = document.createElement("style");
	mmStyleArea.innerText = "body{background-position:0px 22px;}a{display:inline-block;}#_mm_ShieldImage{position:absolute;top:0px;left:0px;z-index:" + (parseInt(highestZIndex) + 1) + ";}#_mm_InfoArea{position:fixed;top:0px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InteractArea{position:fixed;top:23px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 4) + ";padding:0px;}#_mm_Highlighter{position:absolute;z-index:" + (parseInt(highestZIndex) + 3) + ";}#_mm_HighlighterLegend{background-color:#FFFFFF;color:#000000;position:absolute;top:-14px;border:1px solid #FF8C00;text-size:8pt;}"; 
	headElement.appendChild(mmStyleArea);
		
	var mmPushDown = document.createElement("div");
	mmPushDown.style.width = "100%"; 
	mmPushDown.style.height = "22px";
	document.body.insertBefore(mmPushDown, document.body.firstChild);

	var mmShieldImage = new Image();
	mmShieldImage.id = "_mm_ShieldImage";
	mmShieldImage.style.cssText = "width:"  + document.body.scrollWidth + "px;height:" + document.body.scrollHeight + "px;";
	document.body.insertBefore(mmShieldImage, document.body.children[1]);
		
	var mmContainer = document.createElement("div")
	mmContainer.id = "_mm_Container";
	document.body.appendChild(mmContainer);
		
	mmContainer = document.getElementById("_mm_Container");
		
	if (mmContainer != null)
	{
		var mmInfoArea = document.createElement("div");
		mmInfoArea.id = "_mm_InfoArea"; 
		mmContainer.appendChild(mmInfoArea);
		
		var mmControlPanelFocus = new ControlPanelFocus();
		mmControlPanelFocus.add();
		
		var mmUrlText = new UrlText();
		mmUrlText.add();
		 
		var mmGoButton = new GoButtonModel();
		mmGoButton.add();
		
		var mmBackButton = new BackButtonModel();
		mmBackButton.add();
			
		var myDivider1 = document.createElement("span");
		myDivider1.innerText = "|";
		myDivider1.style.cssText = "float:left;margin-left:10px;margin-right:10px;";
		mmInfoArea.appendChild(myDivider1);
		
		var mmNavigateByHolder = new NavigateByHolder();
		mmNavigateByHolder.add();
		
		var mmReadCurrentButton = new ReadCurrentButton();
		mmReadCurrentButton.add();
		
		var mmReadPrevButton = new ReadPrevButton();
		mmReadPrevButton.add();
		
		var mmReadNextButton = new ReadNextButton();
		mmReadNextButton.add();
		 
		var mmInteractButton = new InteractButton();
		mmInteractButton.add();
		 
		var myDivider2 = document.createElement("span");
		myDivider2.innerText = "|";
		myDivider2.style.cssText = "float:left;margin-left:10px;margin-right:10px;";
		mmInfoArea.appendChild(myDivider2);
		
		var mmSpeakingRateHolder = new SpeakingRateHolder();
		mmSpeakingRateHolder.add();
		 
		var mmReadAllButton = new ReadAllButton();
		mmReadAllButton.add();
		
		var mmReadOnButton = new ReadOnButton();
		mmReadOnButton.add();
		
		var mmStopReadingButton = new StopReadingButton();
		mmStopReadingButton.add();
		 
		var mmOSMArea = document.createElement("div");
		mmOSMArea.id = "_mm_OSMArea"; 
		mmOSMArea.style.display = "none";
		mmContainer.appendChild(mmOSMArea);
			
		var mmHighlighter = document.createElement("div"); // div
		mmHighlighter.id = "_mm_Highlighter";
		mmHighlighter.style.cssText = "display:none;"; 
		mmContainer.appendChild(mmHighlighter);
		
		var mmHighlighterLegend = document.createElement("span");
		mmHighlighterLegend.id = "_mm_HighlighterLegend";
		mmHighlighter.appendChild(mmHighlighterLegend);
		
		var mmHighlighterText = document.createElement("span");
		mmHighlighterText.id = "_mm_HighlighterText";
		mmHighlighter.appendChild(mmHighlighterText);
		
		var mmInteractArea = document.createElement("div");
		mmInteractArea.id = "_mm_InteractArea";
		mmInteractArea.style.cssText = "display:none;"; 
		mmContainer.appendChild(mmInteractArea);
	}
	 
	this.update = function()
	{
		if (svb.nextOSMNode() > osm.elementCount())
		{
			mmReadNextButton.disable();
			// could say last one reached
		}
		else
		{
			mmReadNextButton.enable();
		}
		
		if (svb.prevOSMNode() <= 0)
		{
			mmReadPrevButton.disable();
		}
		else
		{
			mmReadPrevButton.enable();
		}
		
		var osmNodeToRead = document.getElementById("_mm_Replacement" + svb.getCurrentOSMNode());
		if (osmNodeToRead != null)
		{
			mmReadCurrentButton.enable();
			mmInteractButton.disable();

			var interactionItems = ["Link", "Skip_Link", "Text_Box", "Button", "Check_Button", "Single_Select"];
			
			if (interactionItems.indexOf(osmNodeToRead.className.replace("_mm_", "")) != -1)
			{
				mmInteractButton.enable();
			} 
		}
		else
		{
			getAudio("Page start", true, null);
			
			mmReadCurrentButton.disable();
			mmInteractButton.disable();
		}
	}
	
	this.updateNavigatableItems = function()
	{
		// Only add new possibilities if they exist in the page
		svb.setAvailableReadableNodes(osm.osmTypesInDOM());
		svb.setReadableNodes("All");
		mmNavigateByHolder.setAttribute("_mm_items", svb.getReadableNodes().toString());
		mmSpeakingRateHolder.setAttribute("_mm_items", getSpeakingRates().toString());
		mmSpeakingRateHolder.value(getDefaultSpeakingRate());
	}
	
	this.drawReadOnlyMenuInteract = function(readOnlyElement) // for mm menu items
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.innerHTML = "";
		// get all options and add them as buttons
		
		var readOnlyElementItems = readOnlyElement.getAttribute("_mm_items").split(',')
		
		for (var i in readOnlyElementItems)
		{
			var mmOptionButton = iap_Button.template();
			mmOptionButton.id = i;
			mmOptionButton.setAttribute("value", readOnlyElementItems[i].replace("_mm_", ""));
			mmOptionButton.setAttribute("title", readOnlyElementItems[i].replace("_mm_", ""));
			mmOptionButton.addEventListener("click", function(e){cancelReadOnly();readOnlyMenuOptionSelected(e, readOnlyElement)}, false); // mirror this above in text input for enter
			mmInteractionArea.appendChild(mmOptionButton);
		}
		
		var mmOptionCancelButton = iap_Button.template();
		mmOptionCancelButton.id = "_mm_CancelButton";
		mmOptionCancelButton.setAttribute("value", "Close");
		mmOptionCancelButton.setAttribute("title", "Close drop-down menu");
		mmOptionCancelButton.addEventListener("click", function(){cancelReadOnly()}, false);
		mmInteractionArea.appendChild(mmOptionCancelButton);
		
		mmInteractionArea.style.display = "";
		
		function cancelReadOnly()
		{
			getAudio("drop-down menu closed", false, function(){document.getElementById("_mm_ReadNextButton").focus();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function readOnlyMenuOptionSelected(e, selectElement)
		{
			selectElement.value = e.srcElement.value;
			selectElement.focus();
		}
	}
	
	// interact actions
	
	this.drawTextBoxInteract = function(textInputElement) // node ref needed so enter can set the values in the model and in the live site
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		
		var mmTBTextEntry = new TBTextEntry();
		mmTBTextEntry.add();
		 
		var mmTBEnterButton = iap_Button.template();
		mmTBEnterButton.id = "_mm_TBEnterButton";
		mmTBEnterButton.setAttribute("value", "Enter");
		mmTBEnterButton.setAttribute("title", "Enter");
		mmTBEnterButton.addEventListener("click", function(){enter(textInputElement);cancelInput();}, false);
		mmInteractionArea.appendChild(mmTBEnterButton);
		
		var mmTBCancelButton = iap_Button.template();
		mmTBCancelButton.id = "_mm_CancelButton";
		mmTBCancelButton.setAttribute("value", "Close");
		mmTBCancelButton.setAttribute("title", "Close text entry area");
		mmTBCancelButton.addEventListener("click", function(){cancelInput()}, false);
		mmInteractionArea.appendChild(mmTBCancelButton);
	
		mmInteractionArea.style.display = "";
	
		function cancelInput()
		{
			getAudio("text entry area closed", false, function(){document.getElementById("_mm_ReadNextButton").focus();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function enter(inputElement)
		{
			// setting value by javascript should not fire original events which is good
			
			var setValueFunction = function(liveElementToUpdate, enteredValue)
			{
				liveElementToUpdate.value = enteredValue;
				return null;
			}
			
			updateLiveAndOSM(inputElement, document.getElementById("_mm_TBTextEntry").value, setValueFunction, "INPUT");
			readCurrentNode(function(){document.getElementById("_mm_ReadNextButton").focus();});
		}
	}
		
	this.drawCheckButtonInteract = function(checkInputElement) // - services radio button and checkboxes
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		
		var mmCheckButton = iap_Button.template();
		mmCheckButton.id = "_mm_CheckButton";
		mmCheckButton.setAttribute("value", "checked");
		mmCheckButton.setAttribute("title", "Check");
		mmCheckButton.addEventListener("click", function(e){checkNoCheckClick(e, checkInputElement);cancelInput();}, false);
		mmInteractionArea.appendChild(mmCheckButton);
		
		var mmUncheckButton = iap_Button.template();
		mmUncheckButton.id = "_mm_UncheckButton";
		mmUncheckButton.setAttribute("value", "unchecked");
		mmUncheckButton.setAttribute("title", "Uncheck");
		mmUncheckButton.addEventListener("click", function(e){checkNoCheckClick(e, checkInputElement);cancelInput();}, false);
		mmInteractionArea.appendChild(mmUncheckButton);
		
		var mmCNCCancelButton = iap_Button.template();
		mmCNCCancelButton.id = "_mm_CancelButton";
		mmCNCCancelButton.setAttribute("value", "Close");
		mmCNCCancelButton.setAttribute("title", "Close check button entry area");
		mmCNCCancelButton.addEventListener("click", function(){cancelInput()}, false);
		mmInteractionArea.appendChild(mmCNCCancelButton);
		
		mmInteractionArea.style.display = "";
		
		function cancelInput()
		{
			getAudio("check button entry area closed", false, function(){document.getElementById("_mm_ReadNextButton").focus();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function checkNoCheckClick(e, inputElement)
		{
			// setting value by javascript should not fire original events which is good
			
			var setValueFunction = function(liveElementToUpdate, enteredValue)
			{
				if (enteredValue == "checked")
				{
					liveElementToUpdate.setAttribute("checked", "checked")
				}
				else
				{
					liveElementToUpdate.removeAttribute("checked");
				}
				return null;
			}
			updateLiveAndOSM(inputElement, e.srcElement.value, setValueFunction, "INPUT");
			readCurrentNode(function(){document.getElementById("_mm_ReadNextButton").focus();});
		}
	}
	
	this.drawSelectMenuInteract = function(selectInputElement)
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.innerHTML = "";
		// get all options and add them as buttons
		var options = selectInputElement.children;
		
		var count = 0;
		for (var i in options)
		{
			if (options[i].className == "_mm_Option")
			{
				var mmOptionButton = iap_Button.template();
				mmOptionButton.id = count;
				mmOptionButton.setAttribute("value", options[i].innerText);
				mmOptionButton.setAttribute("title", options[i].innerText);
				mmOptionButton.addEventListener("click", function(e){cancelSelect();optionSelected(e, selectInputElement)}, false); // mirror this above in text input for enter
				mmInteractionArea.appendChild(mmOptionButton);
				count++;
			}
		}
		
		var mmOptionCancelButton = iap_Button.template();
		mmOptionCancelButton.id = "_mm_CancelButton";
		mmOptionCancelButton.setAttribute("value", "Close");
		mmOptionCancelButton.setAttribute("title", "Close drop-down menu");
		mmOptionCancelButton.addEventListener("click", function(){cancelSelect()}, false);
		mmInteractionArea.appendChild(mmOptionCancelButton);
		
		mmInteractionArea.style.display = "";
		
		function cancelSelect()
		{
			getAudio("drop-down menu closed", false, function(){document.getElementById("_mm_ReadNextButton").focus();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function optionSelected(e, selectElement)
		{
			// setting value by javascript should not fire original events which is good
			
			var setValueFunction = function(liveElementToUpdate, enteredValue)
			{
				liveElementToUpdate.selectedIndex = enteredValue;
				return liveElementToUpdate[enteredValue].innerText;
			}
			updateLiveAndOSM(selectElement, e.srcElement.id, setValueFunction, "SELECT");
			readCurrentNode(function(){document.getElementById("_mm_ReadNextButton").focus();});
		}
	}
	
	function updateLiveAndOSM(osmNode, enteredValue, setValueFunction, elementTypeOfInterest) // setValueFunction(liveElementToUpdate, enteredValue)
	{
		var valueToSay;
		var mmStore = osmNode.getAttribute("_mm_Store");
		if (mmStore != "null") // null a string as it has been entered as a value into an attribute
		{
			valueToSay = setValueFunction(document.getElementById(mmStore), enteredValue);
		}
		else
		{
			var originalIdValue = osmNode.getAttribute("originalId"); // should be _mm_originalId
			var allElementsOfInterest = document.getElementsByTagName(elementTypeOfInterest);
			for (var i in allElementsOfInterest)
			{
				if(allElementsOfInterest[i].tagName == elementTypeOfInterest.toUpperCase())
				{
					if (allElementsOfInterest[i].getAttribute("_mm_Id") == originalIdValue)
					{
						valueToSay = setValueFunction(allElementsOfInterest[i], enteredValue);
						break;
					}
				}
			}				
		}
		
		if (valueToSay == null)
		{
			valueToSay = enteredValue;
		}
		
		// change value in model
		osmNode.children[2].innerText = "Current value: " + valueToSay; 
	}
	
	// Control Panel (CP) Base Models
	
	function CP_ButtonModel()
	{
		this.template = function()
		{
			var button = document.createElement("input");
			button.setAttribute("type", "image");
			button.style.cssText = "float:left;"; 
			button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
			return button; 
		}
		
		function buttonHasFocus(e)
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " button has focus", false, null);
			}
		}
		
		this.enableButton = function(buttonName, eventName, eventFunction)
		{
			buttonName.style.opacity = "1";
			buttonName.setAttribute("tabindex", "0");
			buttonName.addEventListener(eventName, eventFunction, false);
		}
		
		this.disableButton = function(buttonName, eventName, eventFunction)
		{
			buttonName.style.opacity = "0.25";
			buttonName.setAttribute("tabindex", "-1");
			buttonName.removeEventListener(eventName, eventFunction, false);
		}
	}
	
	function CP_TextBoxModel()
	{
		this.template = function()
		{
			var textBox = document.createElement("input");
			textBox.setAttribute("type", "text");
			textBox.style.cssText = "float:left;width:500px;height:16px;";
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
					getAudio(e.srcElement.getAttribute("title") + " text area has focus", false, null);
				}
				e.srcElement.addEventListener("keyup", function(e){keyUp_Handler(e);}, false);
				e.srcElement.addEventListener("keydown", function(e){keyDown_Handler(e);}, false);
			}
		}
		
		function inputLostFocus(e)
		{
			if ((e.srcElement.tagName == "INPUT") && (e.srcElement.type == "text"))
			{
				e.srcElement.removeEventListener("keyup", keyUp_Handler, false);
				e.srcElement.removeEventListener("keydown", keyDown_Handler, false);
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
					getAudio(getTextForAddedCharacter(enteredCharacter), false, null);
				}
				else
				{
					// character removed
					removedCharacter = userInput[userInput.length - 1];
					getAudio(getTextForRemovedCharacter(removedCharacter), false, null);
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
	
	function CP_DisplayBoxModel() // used for NavigateByHolder and SpeakingRateHolder 
	{
		this.template = function()
		{
			var displayBoxModel = document.createElement("input");
			displayBoxModel.style.cssText = "float:left;width:100px;height:16px;";
			displayBoxModel.setAttribute("readonly", "true");
			displayBoxModel.addEventListener("focus", function(e){readOnlyHasFocus(e);}, false);
			displayBoxModel.addEventListener("keydown", function(e){readOnlyClick(e);}, false); // click not working - keydown bit overly many keys which work, input needs correcting, 'all' choice seems to remain selected.
			displayBoxModel.addEventListener("click", function(e){readOnlyClick(e);}, false); // click not working - keydown bit overly many keys which work, input needs correcting, 'all' choice seems to remain selected.
			return displayBoxModel;
		}
		
		function readOnlyHasFocus(e)
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " drop-down menu has focus " + "current option selected is " + e.srcElement.value, false, null); // not working e.srcElement.getAttribute("value"), null);
			}
		}
		
		function readOnlyClick(e)
		{
			if (e.keyIdentifier != "Enter") // only picks up enter
			{
				return;
			}
			
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " drop-down entered " + (e.srcElement.getAttribute("_mm_items").split(',').length + 1) + "options available", false, changeFocus);
			}
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
			
			controlPanel.drawReadOnlyMenuInteract(e.srcElement);
		}
		
	}
	
	// Control Panel Button Models - Extend Button Model
	
	function ControlPanelFocus()
	{
		var button = new CP_ButtonModel();
		var controlPanelFocus = button.template();
		controlPanelFocus.id = "_mm_ControlPanelFocus";
		controlPanelFocus.setAttribute("type", "image");
		controlPanelFocus.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+5gz/qwAAAABJRU5ErkJggg==");
		controlPanelFocus.setAttribute("accesskey", "c");
		controlPanelFocus.setAttribute("title", "Control panel");
		controlPanelFocus.addEventListener("click", function(e){cpHasFocus(e);}, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(controlPanelFocus);
		}
		
		function cpHasFocus(e)
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " entered", true, function(){document.getElementById("_mm_UrlText").focus();});
			}
		}
	}
	
	function GoButtonModel()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var mmGoButton = button.template();
		mmGoButton.id = "_mm_GoButton";
		mmGoButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADY0lEQVQ4EZ1VW2xMQRj+Zs6cPXv2pltdatUqD1TSSCWtvkiEiBeRuHshSIgX4h68CiKRCE9IJC7x4oFEhETEAxEkEnFJiUsRldCq1dZ2dzvn7Bn/bJ1ul5bWn/w7e/75/2/+6wxTSsGn4KIb0yaO42NQ8EpCf3OY1SF52+v8F/Vw2SdfhWlQNu9KzdbV0fON0/n8sAUoxfz9f66MVDu7vb57Ld65i3sub1XqtCMY22zuOLX88tqFxuyqGOAWgJFD0pmkbBrcqq3mm+WhJRmS7Bappc3Ns2f0A/bm/+nYkArabMYkoLFOrGdsw0ERDXuTIna/hzq9lkkcEBguqUp5yOY9StHv+AwRS4VgWQnhOjnuKwQIsOWDh5Z3XRSStipPhM6/SUpzG4IIBQHPKwFrbfqk03oMAcqhT8JgePg0jcPbdsHkOTBu+FvFVWYzSDUtRsPZLYiFJOQg0JKix8TAB5VRSgeqkIfJMgioLJgqB4XKwWJ59PVJCl8hYHJI5488gPugOlBF7ekRMy6GZjqDCRMVUYFbTzgevRWI2OUp0nglT330v6yc0uH0fseFq2149aIVH9+34djRdahPyTKrUYEKK4yvr+7j5J67EFRI13GxY6eLE8c3YlatHCjrqEB1OxkEHKuoAmQG2R9pjE9W0/9uGhoaxV80KlA334vkzAVYumYVXr5JI/2tC5tW1GCsnYFToB77H1BFI6HbrL4mh7htU1vZmDyOIRgeA4OXCvaHp7pVXJkD1y1FbTyYXJcmT+YRqazGnOQ3eMxELB5HQE8Nkd9c5VZazEkx1QiL58HYQMcVjZw+6tPKKQTCUZlI0PgYMIz+XvYBtaLgTHF9fWmS5MmsqQq796+lntWjVgqpqEA/IVsgzDMURRyGNvyFpjWJyQvBRPunz1+7euthap+ZgdqJNsZGJAoFNgQkXTZBgWiUbiC9O9g9+uzu8bKQz3tE+sGRx7cfNDyanko2TagATUgFEonYkICERFgMnHMMhEdgukiPWxlu3nl3CXjWTiKEIOqaVu7dd2Bu8/imiC2Cnq7WMPT7Fh3AOtIyc/3Wm2t3z2w/QGYfNKgOPE6chFFfh6qqaPECIMGIiEqCztZOeqlekH4HcU//G8WKt1WYBDpZupz6sJGSjkq/f1nNFIn3E1A5KtX4cEUEAAAAAElFTkSuQmCC";
		mmGoButton.setAttribute("alt", "Go");
		mmGoButton.setAttribute("title", "Go"); 
		mmGoButton.addEventListener("click", go, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(mmGoButton);
		}
		
		function go()
		{
			// changes the url of the tab page
			var mmUrlText = document.getElementById("_mm_UrlText");
			document.location.href = mmUrlText.value;
		}
	}
	
	function BackButtonModel()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var mmBackButton = button.template();
		mmBackButton.id = "_mm_BackButton";
		mmBackButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADhElEQVQ4EZ1VTWhUVxT+7s97M/NmMmNmJpNaRYuRKDHGP6gtuCquSyguspC6sC6EiiC4EhEt3XRhBcmiFKE/CxFB7KLURW2hborQEtpiSQu1SEqCQWOmGcf3d6/nvGfmr2VKeuHO3PfOud859zvfuU9Ya7E6ysduTYyU5AYJaaLVl//xL2HkfBAv/XX57l1rzxl2Fwwqxq8Xjr9d+vzgy5isZAGO0w7VH1UKoEkZ3FnAzOWfn03Vr7w5q3nLkan8pXe2YXK0aBEksfoD9Vo1AY8PYjeEe0OI8/uk2PhuZX9NHtpKgPUQ8OO1zwZlWnKA14fk2MbDm1/TKOiq5xjXWgUK2Bp8fEUvCi4dRkh66iVEkL9FMwjh0+kiMnvkOqDDlzTiujLxP3bAIcBFX+CjmcewYRNCdIZMQ4SUyBsjZeyqpDYOG4VNqRG0kmst2EULS6AKFz/5GMuz30Jm8i07L0xMXOWGULtwEXurHmXVDpoUqtObTS6dO4gNwiCApyL4IoKW3SIzJLpYxYgjH2GUgdZtqPaKwBhwwJW4el8hpxRGSxRfOUQp8Zfw2g4vpEzeGWMpy26+W6BMu0cVvPmnwZnpaewem8BwtQbbeESgLbc2ap9V6k0pZpXFl/MZnPzwAyz/9BVu//gFYkog72Wh3FzaEX2AOk2slWT4xGEpWsLY9gnIfBGDm3ZgaHQ/nFwRluSxltE6V2QF1jsNnDgwApE/i1eq6zBSzuLKtc+weO82dE/1+wVpgSoqRK5AQL6PozuLCOMIebeJ/9G1SEFfFC/jOChXhrHHeULiN/jNLyLwmyQtQ/VtdCVnIkOSetpT99RFw00Xq7JgYGewAoUYzmKEdZt2wdUOlJPpAmWeA7eUSq3j+mQn6ihDEmQltociDVriuCrrOH1wJ56FY7S5W4uMo5QmLfvU+wWQGsmHRSKExoPvlx4+PVQnlfNNmiDzL89ywcO+4QB+FHY0YeKS2LVUGBjwSMcKGUV3RRNYmPtjnjidXbzxw++fjtcmTh+oEZRl/nhwM+QIOJtc2ilU9y9nxk2jlMTsisbNe3PfrHx3aYZPzWRt2Dv13qnJV3e8tT7vlDor3klLN2T6xMDLgfW//nXuzq3ps+8Dj37hPTyLNCs0tyA3ylUC4h4S6dW/DkXkryz8DdTvk/0hzSfpNyq9LKkX4dFkztc6uOWIUTTom2eeA17KQ22sgm3DAAAAAElFTkSuQmCC";
		mmBackButton.setAttribute("alt", "Back");
		mmBackButton.setAttribute("title", "Back"); 
		mmBackButton.addEventListener("click", back, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(mmBackButton);
		}
		
		function back()
		{
			history.go(-1);
		}
	}
	
	function ReadCurrentButton()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var readCurrentButton = button.template();
		readCurrentButton.id = "_mm_ReadCurrentButton";
		readCurrentButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAAEpklEQVQ4EY1Va0wUVxT+ZnZ2ZmfYXZaFhQXKQ0CwiBK0ELVADQRTEhNbA43+aIO1MW0T28SmaWI1MemfNlXTBz5iUlP7spH+qC1NERprrVYEtaXQWsUadcXlvbyWfTA703NnXZA+rCc5c+feOfe73z2v4XRdBxOO4/j855oeTXfKLh28Ziz+z0PnIxyvcZynf9rbe6T+XMycY6Dy2gM5L60v/aJ8cUqJLJlw95yYzX1HjgMmp1X80OM98+7h9jq9/eUBgRgK2w6dO9pQs7DEESdCjcwnSd/pFgBPD41OYwfGbhc7zSzwWOC2lofC6mGyXyvErdpVtCzPVea0ipgKqjE7Y7SIAgSzBH8YCM1osJh5KKKOmXCI5pFZ27CqIdWpYFmu63FkP58lxDs4F9usalHfMkuemCmyBT0eP746cQK/dP6EqfER2J3JWL6iAuvWVCDfbYE/EJx1VYT2yxLPwykmCmo4xN97HRMhCqIFHzRfQuNbO+DtbptlxF5OffYmmkrXYdv2N1C/+mGEggFyS9TEGEN+k6DrGvGKCvOdKFnQeOwsdr/2DGbGbsGRVoCckiokJCZhZKgf1y99h1udx7H9hSsI7P0YDbXFBuMYBjADITahcECRzGg+fx3v7XoRKgHmrHgS6zduQmGaDMmkIaDy6KqqxZefHISnqxVv79yKBRlNqCxMxJzzEAVlVAUThzsTGva9/w783t+RvqQaz27ZikcyTVDsTpgpYOFQAGkJIuy2V3Botw9D19qxb/9BFO/ZiQRZJ1pR4Y2BXdtsQsuPXeg5eRRSnAO19ZuxMt+GlIwcuNMy4Epxw52eCfdD2Vhd6ER13RbKDAs6Wj7EyQtXIdH+mBCoYOTgeBBoa/kGamAMmSU1qCorQJIrBVZbPEym6AZBEGCzO+ByJaFmVTFSF1ci5OtDa2sbgirLZ8bVDJ7swCJ+wzuGyz+fMRK9uLQCual2yIrNODCWHWzkKWtkqwNLshOxtLTSINfdeRoDvoCRx2zBCBTLy2s3vfD10TVsLhQuyofNqoA3Cf+oHraJJ+beiQhSshZBkuMw6vkDZ7s9CFKByHZiyoxY5G739SE4PgDZ4UZGqguiKBqs2ff5Qmyh4ao3iPOdF6CrAUz3X0Hj/gP49cYosh1m3mAaoXof9k1Sq7JAsKXCbo2LspyPZsx0ncMMlWhlHjWeJ1bjyPQgRge9eLquFlYr8KnHFwUNhYIoykvD5tcboRCgwxIh9rEE+TuyDhMFQpTjsTxvCkrDBkyGgPICB7oHeXC8RRNU6iFkhrJ8FzLidUh0bafDSqXHyuHelJ4DZx3LarMReBYkyzA0TUUypVzc9ARm1IguDF2+ODA6tVFLLsrgBcVhRNts+PO/mEbBWfooigJJSjeCGW+TMTw2MIU/O0YE3Pm2t/n7p44tzHRtWJqVcLdn/jvDOa5zbxwnst8GOnqHcbz19EcI/Xab0ZFJc8s37Xm1+rGVa5x2WdEiDwbKNnNU3oM+/2RL26mvL36+Yy8tedg6K5d40kTSLICchfnNmtbvIxwxIGcCN0lHSMeNfxT5h+UrY6yQzhUxTR5QGItp0gBVnf4Xbk6hPbDcA04AAAAASUVORK5CYII=";
		readCurrentButton.setAttribute("alt", "Read again"); 
		readCurrentButton.setAttribute("title", "Read again");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readCurrentButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readCurrentButton, "click", readCurrent);
		}
		
		this.disable = function()
		{
			button.disableButton(readCurrentButton, "click", readCurrent);
		}
		
		function readCurrent()
		{
			readCurrentNode(null);
		}
	}
	
	function ReadPrevButton()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var readPrevButton = button.template(); 
		readPrevButton.id = "_mm_ReadPrevButton";
		readPrevButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADRElEQVQ4EZVVS0hUYRT+/v8+Zu6M44ypY5pZaQ+sJIjIioyCooW0kIrAarKCFiEFraKVbawgkSQq6EG1KIjeEW0ydCNWJBEUuqlMJTMrx+fMvXPv7fx3HDMoZ+bAmf915jvnP985/2W2bSMhrKKpqHhhXl5incooW5x1D42EI48OdCXsmQBlbLla03DhYkVZ/t4cn1sRe39cJUz/PXIGjEVNvOwcaDl3603Ibj3cIwvT3fVNZ2u2LD5QOjcAw7SQMuKkH0liKJuftVFi7D5jq9bJjJVnNz64undJoR/DEwbIcfpiALmZbqwpDa4q2BYq5/DNzslwy26R2gQgYwyqzNMCFzf0agoCGSjgsA3Jsv6wJXLEuYQPPSNpgQpjwUXMmOB/hSNWHo8Hlx+/woPmDmguCYrEIaeocWDOpkAdQM2LK0/eoP5YCNHRQYQNN0ZMV3KNuRCOMlgWkUxC7Ot0XQZN09B05xXqju4CRr7g+cObaG95BtsyyWzmAjNjMSxYthr79+1BhkY3g6o6Obx0rw11R6phDnU73nrfNTtjqj/MMqAb1ZDoD/LskgBr7/qBu+ePTwGmCjTdTlZdMAzd2eL9X8O8OKAjdLAWcqBoul1a85geoZqMF6WMcdNSFRlV60swduwMbjQeh/GrG/lLN0D1BmCbsaTggqDckpUwDQImIaK4rXl9yA36UbUuSt5O41rDCazdsh2VFSsQ1WkvmRCPs/we6FIME7pFoJQGSVLgD2QjGI2haq2NSO1J2FzBojk+8jkrCfdxj5leDz79tKFTsTgPiigZToUqgBl53bkB6B+V4M/Oh8frdTolWbBuSmHf+C+CshhFGmGUYC5yLIB9BDxXVlBoGlCccpvqjxlxOXWdeDOEEOjr730D4e+WzQrFnkSHvky/0x3CyfRHfCZUl8LRNziG3vcd3VSruj7ICqTgnOLNJQUBqIpEvU49T9eR5fhcrP+nCp1JpB0fh3D9fvPtzqenrol4XaS58zYdCm3dWrkjL5iVwyzBTfwqM0XnnHGbDY9FRlta2168vVt3gfY+T35OWAYtskiDpJmk6YjwPk76jZSYwrADShORZJUGjVRURIphkmVcRIeIyo8SB/ZvfaIoPunSmgoAAAAASUVORK5CYII="; 
		readPrevButton.setAttribute("alt", "Read previous");
		readPrevButton.setAttribute("title", "Read previous");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readPrevButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readPrevButton, "click", prevNode);
		}
		
		this.disable = function()
		{
			button.disableButton(readPrevButton, "click", prevNode);
		}
		
		function prevNode()
		{
			svb.moveToAndReturnPrevOSMNode();
			controlPanel.update();
			highlightCurrentNode();
			readCurrentNode(null);
		}
	}
	
	function ReadNextButton()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var readNextButton = button.template();
		readNextButton.id = "_mm_ReadNextButton";
		readNextButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADOklEQVQ4EZWV20sUURzHv2duuzOt7jrr7prbFVIyMMggIlEquvcQPpRBD71oVpRF0EvQQ08V9FiBof0BUVo9RFHRlR7EigL1wYrAMte87K622+zszPQ7K64tFo4Hvuyc3/zO5/wuZ84yx3EwM1Y3ddYuL/MtYWS0mTD7YsbhH78MjjAcT41+vNbwkpaZ3IWvB6u5GGpt2Xpny9rFdUWajL/2+Qem0MRoapg23vTH+jvuv93/43Zzr8Rdmg/XtR3eVlEX1VVksnbhKhczUWSojBZXWVnrFmNb1gus9EB03arg7nJdw9TvbA7KwQtR2rDgUyWsqyhdE967q0aAX9FVSZTtheRM0cuSUJCDZTnwKhI0VQwJMDKiBdtVU2YoFrl/G/udg8zYQMXl/XFMQ8hvJzAGNxIFBioh2rq68ap3GEWaJ8/NPVgWZqGyF6LX505qMYYHenDyWAu6P0/OAUuB8kX4TqkcPX8ViZ9DYLPBF0bw10wQZXzpe4fRvsc43tKE623tqK8K5D0kWQbSGZO9uNuO8a8f8i/cPgz23CUwQ0f7DajUKD4Ex8gKZsaAqi1yy5njN9jThROnz2JgxEDEr83W1M5m5ji7NTAtjNr6eqjOFJKGySRQ+rZlQ9FXwBuaAGP53v2XyQQRjpFEemIIgi+Cg62XcWhHNWIph0ppQUoks07AY+LU8SOIJyddQWU6JQ8ePsKb+x1obL2Exs0VCAUDSPDDypgjmSnLKQkUORtXqognfGT8b4C5F4wcLNvGcz2KfS0XCFiJskgY/pIQxHg855Nrl6r5EClfgqIg3VzzfFuMDn8inkDthhpUlwGLIyEE9FJIkjgdDR1+Cb8M8pMERVGQdeavJ1/JT8r2tUEoHhXFgRKI4jSQJ2kJRMPPntHY+CR1CEH+7boZHo8CPRQhmJQHKhTpSDyFWN/7IUp/KHbvwfObFcvCZzdVhYlJl8K8ZLmg9IzujY9fk7j3tPuO+amzj0fMb4RodcO5E3t2bm8I634/gdn84Omd+SU0MZVKP3vV/eT1zTNXyDrAoVzFJJ20lERQfg8tZFhT5D1IGiMlpv+jePyAl6SR+IlYCJQnZZHSXNQX+w+KuzwukVF1zQAAAABJRU5ErkJggg==";
		readNextButton.setAttribute("alt", "Read next"); 
		readNextButton.setAttribute("title", "Read next");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readNextButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readNextButton, "click", nextNode);
		}
		
		this.disable = function()
		{
			button.disableButton(readNextButton, "click", nextNode);
		}
		
		function nextNode()
		{
			svb.moveToAndReturnNextOSMNode();
			controlPanel.update();
			highlightCurrentNode();
			readCurrentNode(null);
		}
	}
	
	function InteractButton()
	{
		// constructor 
		var button = new CP_ButtonModel();
		var interactButton = button.template();
		interactButton.id = "_mm_InteractButton";
		interactButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAAFAUlEQVQ4EY1VXWwUVRT+7vzu7Oxvt11aCq2FbrGw2AAGaSEQqU1IILQqJQH1gWhEH+RBEjTxBeXBxKhEQAMoGBKCP9CIBCOhijUWpIU0gWAVKuoSCpSWdgvddmd2Z8ZzZ9pCTIye5NzZuffMd77zc88yx3HAhTEmJV86vGRKSC9ksG13878WgTHHZix1a6S350DzzxPmjIMWPvVJ9YuN8w7XVU+Zo8kibHiOJoz+7cnogMhgeDSHtgs3fty57/Qa5/zmAYmxhPr6vkNfbmhIzAn4ZOStf5CkLwXQwhFIeGAT0Xk7gCIJKI8HlmVNczftrZHiKzbOn1dZmAxqMjLZ/IQdKDL4FAmirMCwGPK2A5H2VNGBY+eQNXKwaI+LmbcxLebH/MqilUxfN1XyBxD3qSIsyzPgq08W4Ig+dPT046cznei53I276SFoegAVM6tQV/sY6pJl8MsGRg2PiEUhqLIoo1iMSU7OENxaUXgc0K9KuJ528P6eT3Hi8w9xt7cbgmVS7rzQbUHEgcIKLF61AZs3bURNWYAiNDlh2A5RN0xRAix3gy+8SH/257Dpta3o+no7vQMqgdm0D1El0xyIBZz0VbTufwNXLnVh+46dWJSI0tdepByHQD3hOcxYIt7esccF1KloFpNQkqxHIrkQkUgYmcworl6+iGtdJ6AL93CtswVvbSvGvl3vYHpUmICaAKUCEJuTXSm0teyGplCnUk5rm7egsaEOxboNkcjalPfB5QvR2rkMrQfehObcxsVTB/FN21q80lznthdHJqaimy9ep85zXRi78xcoalQsWIVnmp7AzJgALRSDJBPzfB7FI2kUhGvQ1/sczrW8C2YOo+PsGTzfWPsgqMfaMC0M3rkNRu1iMwfTZ8xCdXmhG7aq+jwjWnPhCPTQEBKJWegQFAh2FkMDfdQFvFheXicTwXsvEAwRccXt895UDxxfIQpC+iQDjhzUfdAiU5FKpcAsw70MwTAVyqLW4pgU5iQo7DwerkpAi5VT/hiunj2G9/Z+htSwCD0QQED3I0jPtKli16FWdB7/GDLdJOaPYnayBjKjruBeSSarT6VATUUUCxrWo/3gVviELI5/9CoudZxC7eMrUFIyFYODg+g83YZf249AtkZgGhaqlj6Nukcq6BqP88u5oNSn5EKQJBQEFaxrrMdA30389t1eKGIeqY4jxLqFDBQqf55cW5CIoZGzUbJgNZ5dvw5lMZm+pz4eF5cpp837VAtEMHvaPby8YS2+Ki1D1/dfYKTvCsRclgAN7xO6iVK0HHOXNOHJlQ1YWBmEP1QASbyfSclyCI5uDRdFURAtKkGSblusaRG6H52L7it/4Ob1FLJjGSjUBUVTSjGraiaS5RFMLwoiFi+Fz6e5bQmHcmAaTLrVffHm7aExGl8istRWmuZHvKQMPpo0sdAA5j2kI2Mmkc87EKiAuswQ8CsIRmIIk6rjgJzZraFMGv3nB6T874d/OXZq9dEZpdGm6mkhd1ZqqkyV1hCPx2Fkx2CaBt0mi2ohQFZU8L5VVAUiDRdXCLC9ux/HT/ywH7jRxwP3k1YufWH7luWLF9WHg6rmDWE64qeUcO+d5ii98txPTmza4Qz77owMf3uy9eiFlm0f0OENbsHdhUljpOXkIwDcH9YPdB0dPyjchteZ8gIzTT+ukQ6S3nX/o8gbL51GylmPx0S//p/wALiHUdIsReX8DZ6tx+nRqUhCAAAAAElFTkSuQmCC";
		interactButton.setAttribute("alt", "Interact");
		interactButton.setAttribute("title", "Interact");
		interactButton.style.cssText = "float:left;";
		
		this.add = function()
		{
			mmInfoArea.appendChild(interactButton);
		}
		
		this.enable = function()
		{
			button.enableButton(interactButton, "click", interact);
		}
		
		this.disable = function()
		{
			button.disableButton(interactButton, "click", interact);
		}
		
		function interact()
		{
			var osmNode = document.getElementById("_mm_Replacement" + svb.getCurrentOSMNode());
			if (osmNode != null)
			{
				switch(osmNode.className.replace("_mm_", ""))
				{
					case "Link":
						linkInteraction(osmNode);
						break;
					case "Skip_Link":
						skipLinkInteraction(osmNode);
						break;
					case "Text_Box":
						textBoxInteraction(osmNode);
						break;
					case "Button":
						buttonInteraction(osmNode);
						break;
					case "Check_Button":
						checkButtonInteraction(osmNode)
						break;
					case "Single_Select":
						singleSelectInteraction(osmNode)
						break;
				}
			}
		}
		
		function linkInteraction(osmNode)
		{
			document.location.href = osmNode.getAttribute("_mm_Store");
		}
		
		function skipLinkInteraction(osmNode)
		{
			// locate target id from skip link
			
			var targetHref = osmNode.getAttribute("_mm_Store");
			
			var mmTargets = ["_mm_Skip_Target", "_mm_Section"]; 
			
			for (var i in mmTargets)
			{
				var skipTargets = document.getElementsByClassName(mmTargets[i]);
				for (var j in skipTargets)
				{
					if (typeof(skipTargets[j]) == "object")
					{
						if (skipTargets[j].getAttribute("_mm_Store") == targetHref)
						{
							var nodeIndex = parseInt(skipTargets[j].id.replace("_mm_Replacement", ""));
							svb.moveToDefinedOSMNode(nodeIndex);
							controlPanel.update();
							highlightCurrentNode();
							readCurrentNode(null);
							break;
						}
					}
				}
			}
		}
		
		function textBoxInteraction(osmNode)
		{
			controlPanel.drawTextBoxInteract(osmNode);
			
			getAudio("text entry area entered", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function buttonInteraction(inputElement)
		{
			var mmStore = inputElement.getAttribute("_mm_Store");
			if (mmStore != "null") // null a string as it has been entered as a value into an attribute
			{
				document.getElementById(mmStore).click();
			}
			else
			{
				var originalIdValue = "_mm_" + inputElement.getAttribute("originalId"); // should be _mm_originalId
				var allInputElements = document.getElementsByTagName("input");
				for (var i in allInputElements)
				{
					if(allInputElements[i].tagName == "INPUT")
					{
						if (allInputElements[i].getAttribute("_mm_Id") == originalIdValue)
						{
							allInputElements[i].click();
							break;
						}
					}
				}				
			}
		}
		
		function checkButtonInteraction(osmNode)
		{
			controlPanel.drawCheckButtonInteract(osmNode);
			
			getAudio("check button entry area entered", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function singleSelectInteraction(osmNode)
		{
			controlPanel.drawSelectMenuInteract(osmNode);
			
			getAudio("single select drop-down menu entered", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
	}
	
	function ReadAllButton()
	{
		// constructor 
		
		var button = new CP_ButtonModel();
		var readAllButton = button.template();
		readAllButton.id = "_mm_ReadAllButton";
		readAllButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADbUlEQVQ4EZVVW0hUURRd59x7Z+68vTZqzmCKYdCTvkISEZuCXj8pQWBqEH0EUZ9RP/lRQVBk9KC/IvpISj96WARCQhhkGhTkfBiWKEpZVto4j/ton6vDjExjtmHPuXfPPmuv/TjnMsuykBa2+U44uNFbkn5fzqpInE1Mzv60nh0cTvszAcrYBsfhS1ev7d4UaCn1S047DgOy4qX9c1ZOfj/iJnqjsz0Xbo+0Wn0t47Lwaj7ffvHkzuIjVatUQCeDQp4GZZBJIgdskUFiqK50RyRmPWCsvpYz1rAiss7XUlWmwoyZgAQMfdZx/9U0wAlV/4eK4HEDWkDB9nX+6sI9+7dw+AJFARdXBSvu4hj9xtF05i4+jHxB0vJgznKTuvKoGzFDRUJkZ1ogHBR6WViGNSMZorAKx/CYjtbTN/G2qx2pqUY87X4IyyT2+cQyKZgTbSea0VBXQj1g0FNz3K6pzCnLJMfxK8/R9+AifG4V0Rcddnnz4VHVQdtgyF5Mt+4jgCAgjJbJZDjmyyYlZnCgtgJDA40Y7+9C6foaQHZR9FymjEswYtP4OfoOKdUP3aD8DcPGFCRkJMUignDUrZZx6mgTzjkC2FFXg8haH+KpXFCH04XOl8N4dOMNqBs5Q2Knb1tVJ7RgCSJrxjDXuhe/EgxbK4kRcyzaZGdIFJ70JUVv7BLM08r8zoOKbYzB6/EAK8uwh08iYcooChXD4SDQrFNAbkimDEjSexs0A5V5WgAlA+EK8bhdCIXCNCKmDShJNLhZwgjVoIoI8HySAV3wEJtUp5PeRBS2iGUaJJt52pa9iqnII0tQybMjbV4CNO3yt5UyMA37Dz0Ry3Gw0/9fTpapQ3Jp0NbUQnIXwhQTutBMTrcJgcbJwrmwL08s6LqO5toQtq0/BolxrC2jZs4TR4q6KGP29dTHr7EpIBgSd6OYvaVEEFJozDZVaKgMKjRaHH5/AHAq+DT1GxPRd58pRCwxIVUq5eHySFXYA04XCyPHpVR2yPDQTGuahoBWAJWeB0eSuNzZfy/6+OwtkbSYn+LyyLFDDbvqG0NBXxF1jy6crInPQ13UjL4bfPp3fKa7d6BnsKPtOrl+EqBCvaQFpCtJfaTC9o9CkEdG4vQ4Sfqd9NfCN8o+H3Rfga4HKKQCdLkigotrWgAn6GBYfwA0gD16Lj7WCwAAAABJRU5ErkJggg=="; 
		readAllButton.setAttribute("alt", "Read From Beginning");
		readAllButton.setAttribute("title", "Read from beginning");
		readAllButton.addEventListener("click", function(){readAllClick();}, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(readAllButton);
		}
		
		function readAllClick() // click and it enables and focuses on stop 
		{
			mmReadOnButton.disable();
			mmStopReadingButton.enable();
			svb.reset();
			readOn();
		}
	}
	
	function ReadOnButton()
	{
		// constructor

		var button = new CP_ButtonModel();
		var readOnButton = button.template();
		readOnButton.id = "_mm_ReadOnButton";
		readOnButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAADe0lEQVQ4EaVVSWgUURB9v9eZSY9JZkyYxAEVFHdjPIg7ISC4IO5LPAjiQRQVERNFcQdRQQ8KKiiiBxc8uCB68RZRBHc9uBJEJK6RGJPM0t3/W39mOumMMW4FRf/+Vf/9V9VV1UwIAU+sxZcqYoVqxBWMe3s9PTVpFIy9bmxrFNcWvfR8mQRl00712zp/4Nmqoda4IlOB/yLP8VdPxhjetzi4/rj53JF1V5cLcTChMTbc2HriyMW66SWVlqUCbu446wamM6iuRp1haMysad83/RsZVirFM1eNqR7Sq9IKa+BJDp6myOVh0yA181SnS8nHztN2F/37BFA1KFzD2NyoFrVEeWFAAZwsDWYwPGxoxeXbDTBVDo+wQ2BFRcVYMXUgDM0Gz/l3UKY0hoPMRLigt+Yk0wr3hcUUhkcNTdhVtxZIfwZUYifFdQCjF55vPoDDa6uhiDZwL1UZBwbOCVmkVKLYaZFJh+0QizR0ijxkCFieBlWEeBOO7lmH9UdvQughKPQJfhbOCDRPBOWLU9iKAkZmv6pmAYK8GYd2r0Hd8TvEvHvgn0Hz7ujyStFJ4ID9FQd3rMaWk/e6Bf47UHkDAWuBApipT9i3bTV2nL4Ph1Eb+JB8yy6cen4hYD1gQfv+Dju3b8K5W00A1aon/wZKhebaKbhGGFNnLUFFSQpI2h6mn3TH3m8X3E0hxVVU1WxE7YJKlIWpJsV/MBWujZTDMGkRAc4biUGxIMKFEarnzvr6q/AlYMIWGL+gFrXzR2NYeQjR0hgMI9cguRgz0ys/XupIpBPtcBJJKvB01kz16zKDADegduEYjIgHCLCMRoQuCyI7LzxQhalKppNyG4J6tjCkYuLsFTBEItME0uQ6LqziUiybMhgVcRPRkrIMwwygdKCUEhBFzpnW+Oblh08tVdmSoOljuwxj+xmILx2NdNqljpInJBGGoKGgvLeVCdmUU8wvcq5+S7Wi9Wmzlnxw7PH5+ur64X1HTY6XajBcBf3jpYhFwpl27RhTBKBrOnVmiLqoaw6JIu6+SODCjSdngNcfJQ/yilTM2bB/24wJgydEQnqAUtARlZ+MXHuFI9Mo1zJ175rav5+/cffK7VN1e2nrrdyXH6uINAZEByBQJin6hiFZehJBNO1nXyjrr8iNnmjJ/qMYk0VWQBok7Sw4evlDoWGLNtIExch/AEiZOe7haZXoAAAAAElFTkSuQmCC"; 
		readOnButton.setAttribute("alt", "Read On");
		readOnButton.setAttribute("title", "Read On");
		readOnButton.style.opacity = "0.25";
		readOnButton.setAttribute("tabindex", "-1");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readOnButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readOnButton, "click", readOnClick);
		}
		
		this.disable = function()
		{
			button.disableButton(readOnButton, "click", readOnClick);
		}
		
		this.focus = function()
		{
			readOnButton.focus();
		}
		
		function disableSelf()
		{
			button.disableButton(readOnButton, "click", readOnClick);
		}
		
		function readOnClick()
		{
			disableSelf();
			mmStopReadingButton.enable(); 
			mmStopReadingButton.focus();
			readOn();
		}
	}
	
	function StopReadingButton()
	{
		// constructor
		
		var button = new CP_ButtonModel();
		var stopReadingButton = button.template();
		stopReadingButton.id = "_mm_StopReadingButton";
		stopReadingButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAWCAYAAAAvg9c4AAACoUlEQVQ4Ee1VTWgTURD+5u1LN2k3aRJTE40FWxAVlSoF9VY8hEK9mXtRD978QSgePPhzVm/Fg2KhHvQggrR6UIheBCsiVkT0ZCEqpYmp1mKaZHef85IU05ofLXhzwiSbmdlvfnbet6SUghYiknuPTw72bjA3QhE5ZWvrL0MAs/PF3JNrrx+p3JlvZSwNSgNj3RcOb5k4uLuzL+Qz2K5QzdUSVRCwWFJIvf3+6dL9z8n0eHJKcoV0ejR1/VSiqy8QkIDDlevIPxW3Er8j7o0XS84touFdEuEjm/b3WAOBoISbd+G4QIG8EEJwvY2FQHBdB6bKwxAKwiuwr9fqCQ7190u0e4JtHjAiQZgCk1MZnL0yDi/lec56FPVFuTYKRgCXR4aR2BMCuBizjeA33ZCEWqwMUXfMZX75uog3j29DFOa5gvqA2qo7cjuiyB1L8p9OHhl3pgh2qSB4iDViO3DsEsx2C9LIQxieGufKS9cuMqgfJY6Hw7vCoMvy66pqKc/xL57TMlDt72+gtc61Xv8HXevkGt/3T2a6ck+rycs7yHvYjFXKMQ7vaB1ZBapg83FV/m6Q1wIZq9w1AMRL7/piHK+NFZbQ620IQRJFzsbsxx/YtsLOmIFzIyegmCyanQENo5NujfDR5Ptk9fAV3ZKSyDyb+5D5kQUiUU0g2+MWor4g57I1cesy6ormYZOZKBzuYD/Th0dgJltQc9MvP3J/6czYvadXt8WD5wf7Aoisj2BdOMTjbEZ8lTyC+DlLrRIv3udx48Grm0jffadLMVljmxMnjyaHDhzq7rK6+HXSGlHj6iihKLuwtDCRev5w+s7FUbbMaFCtflYmRcRYdT+N+2ZnHcmzbZY1x7pA5XdUZXi6Yh9rY75jZwOx2a6BlxhP/QRv5eZ8hpNmIwAAAABJRU5ErkJggg=="; 
		stopReadingButton.setAttribute("alt", "Stop Reading");
		stopReadingButton.setAttribute("title", "Stop Reading");
		stopReadingButton.style.cssText = "float:left;";
		stopReadingButton.style.opacity = "0.25";
		stopReadingButton.setAttribute("tabindex", "-1");
		
		this.add = function()
		{
			mmInfoArea.appendChild(stopReadingButton);
		}
		
		this.enable = function()
		{
			button.enableButton(stopReadingButton, "click", stopClick);
		}
		
		this.disable = function()
		{
			button.disableButton(stopReadingButton, "click", stopClick);
		}
		
		this.focus = function()
		{
			stopReadingButton.focus();
		}
		
		function disableSelf()
		{
			button.disableButton(stopReadingButton, "click", stopClick);
		}
		
		function stopClick() // click and it enables and focuses on read on
		{
			readStop = true;
			disableSelf();
			mmReadOnButton.enable();
			mmReadOnButton.focus();
		}
	}
	
	// Control Panel Text Box Models - Extend CP_TextBoxModel
	
	function UrlText()
	{
		// constructor 
		
		var textBox = new CP_TextBoxModel();
		var urlText = textBox.template();
		urlText.id = "_mm_UrlText";
		urlText.setAttribute("title", "U r l");
		
		this.add = function()
		{
			mmInfoArea.appendChild(urlText);
		}
	}
	
	function TBTextEntry()
	{
		// constructor
		
		var textBox = new CP_TextBoxModel();
		var tBTextEntry = textBox.template();
		tBTextEntry.id = "_mm_TBTextEntry";
		tBTextEntry.setAttribute("title", "Form");
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.appendChild(tBTextEntry);
		}
	}
	
	// Control Panel Display Box Model - Extend CP_DisplayBoxModel
	
	// NavigateByHolder and SpeakingRateHolder
	
	function NavigateByHolder()
	{
		// constructor
		
		var displayBox = new CP_DisplayBoxModel();
		var navigateByHolder = displayBox.template();
		navigateByHolder.id = "_mm_NavigateByHolder";
		navigateByHolder.setAttribute("title", "Navigate by");
		navigateByHolder.value = "All";
		navigateByHolder.addEventListener("blur", changeNavigatableItems, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(navigateByHolder);
		}
		
		this.setAttribute = function(attributeName, attributeValue)
		{
			navigateByHolder.setAttribute(attributeName, attributeValue);
		}
		
		function changeNavigatableItems()
		{
			svb.setReadableNodes(navigateByHolder.value);
		}
	}
	
	function SpeakingRateHolder()
	{
		// constructor
		
		var displayBox = new CP_DisplayBoxModel();
		var speakingRateHolder = displayBox.template();
		speakingRateHolder.id = "_mm_SpeakingRateHolder";
		speakingRateHolder.setAttribute("title", "Speaking rate");
		speakingRateHolder.addEventListener("blur", changeSpeakingRate, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(speakingRateHolder);
		}
		
		this.setAttribute = function(attributeName, attributeValue)
		{
			speakingRateHolder.setAttribute(attributeName, attributeValue);
		}
		
		this.value = function(value)
		{
			speakingRateHolder.value = value;
		}
		
		function changeSpeakingRate()
		{
			setSpeakingRate(speakingRateHolder.value);
		}
	}
	
	// InteractionArea Panel Models
	
	function IAP_ButtonModel()
	{
		this.template = function()
		{
			var button = document.createElement("input");
			button.setAttribute("type", "button");
			button.addEventListener("focus", function(e){selectOptionHasFocus(e);}, false);
			// generic style could be place here
			return button; 
		}
		
		function selectOptionHasFocus(e)
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " option selectable", false, null);
			}
		}
	}
	
	// Utilities 
	
	function getPageTitle()
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
	
	function getPageCulture()
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
	
	// Highlighter
	
	function highlightCurrentNode()
	{
		var id = svb.getCurrentOSMNode();
		
		restoreHighlighter();
		
		var osmNodeToDehighlight = document.getElementById("_mm_Replacement" + svb.getHighlightedOSMNode()); // 0 in the first instance means nothing will be located which is ok
		if (osmNodeToDehighlight != null)
		{
			osmNodeToDehighlight.removeAttribute("style"); 
		}
		
		var osmNodeToHighlight = document.getElementById("_mm_Replacement" + id);
		if (osmNodeToHighlight != null)
		{
			osmNodeToHighlight.setAttribute("style", "border:1px solid red;");
			drawCurrentElementHighlighterArea(osmNodeToHighlight);
		}
		
		svb.setHighlightedOSMNode(id);
	}
	
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
	
	function getElementFromOriginalId(originalId)
	{
		var element = null;
		for (var i in document.all)
		{
			if (document.all[i].tagName != null)
			{
				var mmId = document.all[i].getAttribute("_mm_Id");
				if (parseInt(originalId) == parseInt(mmId))
				{
					element = document.all[i];
					break;
				}
			}
		}
		return element;
	}
	
	function restoreHighlighter()
	{
		var highlighter = document.getElementById("_mm_Highlighter");
		highlighter.style.cssText = "display:none;";
		highlighter.children[0].innerText = ""; // reset legend
		highlighter.children[1].innerText = ""; // reset text
	}
	
	function drawCurrentElementHighlighterArea(osmNodeToHighlight)
	{	
		var positions = calcPosition(getElementFromOriginalId(osmNodeToHighlight.getAttribute("originalId")));
		
		var x = positions[0];
		var y = positions[1];
		var width = positions[2];
		var height = positions[3];
		
		if ((x <= 0)||(x >= document.body.scrollWidth)||(y <=0)||(y >= document.body.scrollHeight)||(width == 0)||(height == 0))
		{
			drawOffscreenWarning(osmNodeToHighlight.className.replace("_mm_", ""), y + 30); // adjust down 
		}
		else
		{
			drawRectangleFromCoords(osmNodeToHighlight.className.replace("_mm_", ""), x, y, width, height, false);
		}
	}
	
	function drawRectangleFromCoords(legendValue, x, y, width, height, includeCircle)
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
			highlighter.children[0].innerText = legendValue;
			highlighter.style.border = "2px solid #FF8C00"; 
		}
	}
	
	function drawOffscreenWarning(legendValue, y)
	{
		var highlighter = document.getElementById("_mm_Highlighter");
		if (highlighter != null)
		{
			highlighter.style.cssText = "left:10px;top:" + y + "px;width:150px;height:20px;background:#FFFFFF;"; 
			highlighter.scrollIntoView();
			// amend scroll position due to metal mouth control panel 
			var scrollPosY = window.scrollY;
			window.scrollTo(0, scrollPosY - y);
			// paint following after scroll otherwise their paint might be disrupted
			highlighter.children[0].innerText = legendValue;
			highlighter.children[1].innerText = "<<< OFFSCREEN";
			highlighter.style.border = "2px solid #FF8C00";
		}
	}
	
	// AUDIO
	
	var speakingRateFloat; // float
	
	function getSpeakingRateAsFloat()
	{
		if (speakingRateFloat == undefined)
		{
			getDefaultSpeakingRate();
		}
		
		return speakingRateFloat;
	} 
	
	function getDefaultSpeakingRate()
	{
		speakingRateFloat = 0.7;
		return "Normal";
	}
	
	function getSpeakingRates()
	{
		return ["Slow", "Normal", "Fast"];
	}
	
	function setSpeakingRate(chosenRate)
	{
		switch(chosenRate)
		{
			case "Normal": 
				speakingRateFloat = 0.7;
				break;
			case "Slow":
				speakingRateFloat = 0.5;
				break;
			case "Fast":
				speakingRateFloat = 0.9;
				break;
		}
	}
	
	function tts(voice, callbackFunction)
	{
		chrome.extension.sendRequest({voice: JSON.stringify(voice)}, function(response) {
			if (callbackFunction != null)
			{
				callbackFunction();
			}
		});
	}
	
	function getAudio(text, enqueue, callbackFunction)
	{
		console.log(text);
		var voice = new VoiceModel(text, getPageCulture(), getSpeakingRateAsFloat().toString(), enqueue.toString()); // svb.speakingRate
		tts(voice, callbackFunction);
	}
	
	function VoiceModel(utterance, locale, rate, enqueue)
	{
		this.utterance = utterance;
		this.locale = locale;
		this.rate = rate;
		this.enqueue = enqueue;
	}
	
	// READ
	// function read needs a mechanism to ensure that the contents are read before moving on 
	
	var readStop = false; 
	
	function readOn() // runs recursively
	{	
		if (readStop == true)
		{
			readStop = false;
			return;
		}
		else
		{
			if (svb.getCurrentOSMNode() == osm.elementCount())
			{
				svb.reset();
				return;
			}
			else
			{
				readNextItem();
			}
		}
	}
	
	function readNextItem()
	{
		svb.moveToAndReturnNextOSMNode();
		controlPanel.update();
		highlightCurrentNode();
		readCurrentNode(readOn);
	}
	
	function getTextToRead(osmNodeToRead)
	{
		// want to identify each span with className = static_text
		var textToRead = ""; 
		for (var i in osmNodeToRead.children)
		{
			if ((osmNodeToRead.children[i].tagName == "SPAN")&&(osmNodeToRead.children[i].className == "_mm_Static_Text"))
			{
				textToRead = textToRead + " " + osmNodeToRead.children[i].innerText;
			}
		}
		return textToRead.trim();
	}
	
	function readCurrentNode(callbackFunction)
	{
		var osmNodeToRead = document.getElementById("_mm_Replacement" + svb.getCurrentOSMNode());
		if (osmNodeToRead != null)
		{
			var textToRead = getTextToRead(osmNodeToRead);
			getAudio(textToRead, false, callbackFunction);
		}
	}
}

// OSM

function OSMModel() // setUp
{
	var osmIndex;
	var typesInDOM = [];
	
	this.elementCount = function()
	{
		return osmIndex;
	} 
	
	this.update = function(bodyDOMCode)
	{
		var tempOSMHolder = document.createElement("div");
		tempOSMHolder.innerHTML = allFreeTextInSpan(bodyDOMCode);
		correctAddedSpanElements(tempOSMHolder);
		addLabelAttributes(tempOSMHolder);
		messAbout(tempOSMHolder);
		var osmArea = document.getElementById("_mm_OSMArea");
		osmArea.innerHTML = tempOSMHolder.innerHTML;
		tempOSMHolder = null;
		controlPanel.updateNavigatableItems();
	}
	
	function allFreeTextInSpan(bodyText)
	{	
		var newBodyText = ""; 
		var switchOff = false;
		
		var bodySplit = bodyText.split("<");
		
		if (bodySplit.length > 0)
		{
			for(var i in bodySplit)
			{
				if ((bodySplit[i].substring(0, 6).toUpperCase() == "SCRIPT")||(bodySplit[i].substring(0, 8).toUpperCase() == "NOSCRIPT"))
				{
					switchOff = true;
				}
				if ((bodySplit[i].substring(0, 7).toUpperCase() == "/SCRIPT")||(bodySplit[i].substring(0, 9).toUpperCase() == "/NOSCRIPT"))
				{
					switchOff = false;
				}
				if (switchOff == false)
				{
					if ((bodySplit[i].substring(0, 7).toUpperCase() != "/SCRIPT")&&(bodySplit[i].substring(0, 9).toUpperCase() != "/NOSCRIPT"))
					{
						var leftArrowIndex = bodySplit[i].indexOf(">");
						
						if (leftArrowIndex != -1)
						{
							if (leftArrowIndex == bodySplit[i].length - 1)
							{
								newBodyText = newBodyText + "<" + bodySplit[i];
							}
							else
							{
								var openingTag = bodySplit[i].substring(0, leftArrowIndex + 1);
								var freeText = bodySplit[i].substring(leftArrowIndex + 1);
								if (freeText.trim() != "")
								{
									newBodyText = newBodyText + "<" + openingTag + "<span>" + freeText.trim() + "</span>";
								}
								else
								{
									newBodyText = newBodyText + "<" + bodySplit[i].trim();
								}
							}
						}
					}
				}
			}
		}
		
		return newBodyText;
	}
	
	function correctAddedSpanElements(element)
	{
		var spans = element.getElementsByTagName("span");
		
		if (spans.length > 0)
		{
			for (var i in spans)
			{
				if (spans[i].tagName != null)
				{
					if (spans[i].hasAttribute("_mm_Id") == false)
					{
						var parentsMmId = spans[i].parentElement.getAttribute("_mm_Id");
						spans[i].setAttribute("_mm_Id", parentsMmId);
					}
				}
			}
		}
	}
	
	function addLabelAttributes(element)
	{
		var forAttributes = [];
		var labelValues = [];
		
		var labels = element.getElementsByTagName("label");
		
		if (labels.length > 0)
		{
			for (var i in labels)
			{
				if (labels[i].tagName != null)
				{
					forAttributes[forAttributes.length] = labels[i].getAttribute("for");
					labelValues[labelValues.length] = labels[i].innerText;
					labels[i].outerHTML = ""; 
				}
			}
			
			var elements = element.getElementsByTagName("*"); // all elements
			for (var j in elements)
			{
				var forIndex = forAttributes.indexOf(elements[j].id);
				if (forIndex != -1)
				{
					if (elements[j].tagName != null)
					{
						elements[j].setAttribute("label", labelValues[forIndex]);
					}
				}
			}
		}
	}
	
	this.osmTypesInDOM = function()
	{
		return typesInDOM;
	}
	
	function htmlElementToOSMType(liveElement)
	{
		// change html elements to osm object references
		var elementSwitch = "unsupported";
		
		switch(liveElement.tagName)
		{
				// interaction 
			case "A": 
				var hrefValue = liveElement.getAttribute("href");
				if (hrefValue == null)
				{
					elementSwitch = "_mm_Skip_Target";
				}
				else
				{
					if (hrefValue[0] == "#")
					{
						elementSwitch = "_mm_Skip_Link";
					}
					else
					{
						elementSwitch = "_mm_Link";
					}
				}
				break; 
			case "INPUT":
				var typeValue = liveElement.getAttribute("type");
				if (typeValue != null)
				{
					typeValue = typeValue.toLowerCase();
					if ((typeValue == "text")||(typeValue == "search")) // 
					{
						elementSwitch = "_mm_Text_Box";
					}
					if ((typeValue == "button")||(typeValue == "image")||(typeValue == "submit")||(typeValue == "reset"))
					{
						elementSwitch = "_mm_Button"; 
					}
					if ((typeValue == "checkbox")||(typeValue == "radio"))
					{
						elementSwitch = "_mm_Check_Button";
					}
				}
				break;
			case "BUTTON":
				elementSwitch = "_mm_Button";
				break;
			case "TEXTAREA":
				elementSwitch = "_mm_Text_Box";
				break;
			case "SELECT":
				if (liveElement.getAttribute("multiple") == null)
				{
					elementSwitch = "_mm_Single_Select";
				}
				break;
			case "OPTION":
				elementSwitch = "_mm_Option";
				break;
				// semantic
			case "DIV":
				elementSwitch = "_mm_Section";
				break; 
			case "FORM":
				elementSwitch = "_mm_Form";
				break;
			case "P":
				elementSwitch = "_mm_Paragraph";
				break; 
			case "SPAN":
				elementSwitch = "_mm_Static_Text";
				break;
			case "IMG":
				var altValue = liveElement.getAttribute("alt");
				if ((altValue != null)&&(altValue != ""))
				{
					elementSwitch = "_mm_Semantic_Image";
				}
				break; 
		}
		
		// following done as a by product
		
		if ((typesInDOM.indexOf(elementSwitch) == -1)&&(elementSwitch != "unsupported")&&(elementSwitch != "_mm_Static_Text"))
		{
			typesInDOM.push(elementSwitch);
		}
		
		return elementSwitch;
	}
	
	// MessAbout -
	// DOM errors are generally to do with baseElement functions being called as non-functions in Models i.e. baseElement.value should be baseElement.value()
	function messAbout(element)
	{
		osmIndex = 0;
		
		
		var createModelElement = function(liveElement, model)
		{
			var modelItem = new model(liveElement);
			var replacementElement = modelItem.replacementElement();
			replacementElement.id = "_mm_Replacement" + osmIndex;
			replacementElement.className = "_mm_" + modelItem.name;
			replacementElement.setAttribute("originalId", liveElement.getAttribute("_mm_Id"));
			replacementElement.setAttribute("originalChildren", modelItem.allChildrenIds().toString());
			liveElement.outerHTML = replacementElement.outerHTML;
		}
		
		
		var elements = element.getElementsByTagName("*"); // all 
		
		for (var j in elements)
		{
			if ((elements[j].tagName != null)&&(elements[j].tagName != "HTML")&&(elements[j].tagName != "BODY")&&(elements[j].tagName != "HEAD")&&(elements[j].parentElement.tagName != "HEAD")) // last one is for the suppressionScript
			{
				elements[j].className = "unchanged";
			}
		}
		
		while(element.getElementsByClassName("unchanged").length > 0)
		{
			var selectedElement = element.getElementsByClassName("unchanged")[0];
			
			var elementSwitch = htmlElementToOSMType(selectedElement); // becomes default
			
			switch(elementSwitch)
			{	
				// interaction - containers
				case "_mm_Skip_Link": // divs not allowed within a p - so link should be changed to span, also p should be changed to div
					osmIndex++;
					createModelElement(selectedElement, SkipLinkModel);
					break;
				case "_mm_Skip_Target": // divs not allowed within a p - so link should be changed to span, also p should be changed to div
					osmIndex++;
					createModelElement(selectedElement, SkipTargetModel);
					break;
				case "_mm_Link": // divs not allowed within a p - so link should be changed to span, also p should be changed to div
					osmIndex++;
					createModelElement(selectedElement, LinkModel);
					break;
				// interaction - non-container (have textToReadOut attributes)
				case "_mm_Text_Box":
					osmIndex++;
					createModelElement(selectedElement, TextBoxModel);
					break;
				case "_mm_Button":
					osmIndex++;
					createModelElement(selectedElement, ButtonModel);
					break;
				case "_mm_Check_Button":
					osmIndex++;
					createModelElement(selectedElement, CheckButtonModel);
					break;
				case "_mm_Single_Select":
					osmIndex++;
					createModelElement(selectedElement, SingleSelectModel);
					break;
				case "_mm_Section":
					osmIndex++;
					createModelElement(selectedElement, SectionModel);
					break;
				case "_mm_Paragraph":
					osmIndex++;
					createModelElement(selectedElement, ParagraphModel);
					break;
				case "_mm_Static_Text":
					osmIndex++;
					createModelElement(selectedElement, StaticTextModel);
					break;
				case "_mm_Form":
					osmIndex++;
					createModelElement(selectedElement, FormModel);
					break;
				// semantic - non-containers 
				case "_mm_Semantic_Image": // semantic image if alt is not null or ""
					osmIndex++;
					createModelElement(selectedElement, SemanticImageModel);
					break;
				// unsupported
				case "unsupported":
					osmIndex++;
					createModelElement(selectedElement, UnsupportedModel);
					break;
			}
		}
	}
	
	// element object
	
	function ElementModel(baseElement) // 
	{
		this.tagName = function()
		{
			return baseElement.tagName;
		}
		
		this.value = function()
		{
			var value = baseElement.value;
			var result = null;
			
			if ((value != null)&&(value != ""))
			{
				result = value;
			}
			
			return result;
		}
		
		this.contents = function()
		{
			var elementContents = null;
			if (baseElement.hasChildNodes() == true)
			{
				elementContents = baseElement.outerHTML.substring(baseElement.outerHTML.indexOf(">") + 1, baseElement.outerHTML.lastIndexOf("<")); // works for <a></a> not for <input />
			}
			return elementContents;
		}
		
		this.getAttribute = function(attributeName)
		{
			var attributeValue = baseElement.getAttribute(attributeName);
			var result = null;
			
			if ((attributeValue != null)&&(attributeValue != ""))
			{
				result = attributeValue;
			}
			
			return result;
		}
		
		this.mmId = function()
		{
			return baseElement.getAttribute("_mm_Id");
		}
		
		this.attributes = function()
		{
			return baseElement.attributes;
		}
		
		var originalElement;
		
		var originalIds = [];
		
		function walkDOM(element)
		{
			do 
			{
				if (originalElement.nextSibling == element) // hold recursive behaviour within the original element
				{
					break;
				} 
				if (element.tagName != null)
				{
					if (element != originalElement) // otherwise original is included in the list 
					{
						originalIds.push(element.getAttribute("_mm_Id"));
					}
				}
				if (element.hasChildNodes())
				{
					walkDOM(element.firstChild);
				}
			} 
			while (element = element.nextSibling)
		}
		
		this.allChildrenIds = function()
		{
			// collects all _mm_Ids for children in an array
			originalElement = baseElement;
			walkDOM(baseElement);
			return originalIds;
		}
	}
	
	// all OSM object models extends element obj
	
	// Interaction container objects ---------------------
	
	// ANCHOR // Special as you will want to move focus within the model 
	
	// Next Interation with skip link, then link, then text box / submit button etc
	
	// e.g. <a href="#here">
	
	function SkipLinkModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Skip_Link"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("href").substring(1));
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// check for and replace images included in links
			if (element.getElementsByTagName("img").length > 0)
			{
				var possibleImgs = element.children;
				
				if (possibleImgs.length > 0)
				{
					for (var i in possibleImgs)
					{
						if (possibleImgs[i].tagName == "IMG")
						{
							var alt = possibleImgs[i].getAttribute("alt");
							if ((alt == null)||(alt == ""))
							{
								alt = ""; 
							}
							else
							{
								alt = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + alt + "</span>";
							}
							possibleImgs[i].outerHTML = alt;
						}
					}
				}
			}
			
			element.innerHTML = whatAmI() + titleValue() + element.innerHTML;
			
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Skip Link</span>";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if (title == null)
			{
				title = ""; 
			}
			else
			{
				title = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
			}
			
			return title;
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// e.g. <a name="here">
	
	function SkipTargetModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Skip_Target"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("name"));
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			element.innerHTML = whatAmI() + titleValue() + elementContents;
			
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Skip Link Target</span>";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if (title == null)
			{
				title = ""; 
			}
			else
			{
				title = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
			}
			
			return title;
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// LINK (text, image, both) // from a element - also, taking alt for any image which is used as a link image
	
	function LinkModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Link"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("href"));
			
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// check for and replace images included in links
			if (element.getElementsByTagName("img").length > 0)
			{
				var possibleImgs = element.children;
				
				if (possibleImgs.length > 0)
				{
					for (var i in possibleImgs)
					{
						if (possibleImgs[i].tagName == "IMG")
						{
							var alt = possibleImgs[i].getAttribute("alt");
							if ((alt == null)||(alt == ""))
							{
								alt = ""; 
							}
							else
							{
								alt = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + alt + "</span>";
							}
							possibleImgs[i].outerHTML = alt;
						}
					}
				}
			}
			
			element.innerHTML = whatAmI() + titleValue() + element.innerHTML;
			
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Link</span>";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if ((title == null)||(title == ""))
			{
				title = ""; 
			}
			else
			{
				title = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
			}
			
			return title;
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// MAPAREA // image map areas 
	
	function MapAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Map_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}
	
	// Interaction non-container objects (have textToReadOut functions) ---------------------
	
	// TEXTBOX // from texture, type=password, type=text, label
	
	function TextBoxModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Text_Box"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			// state forms part of the text to read out - same for check box and radio button - when we fill in the values and press return we should do a round trip / or be notified if something in the page being tracked changes
			element.innerHTML = labelValue() + whatAmI() + stateValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Text Box:</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = baseElement.getAttribute("title");
				if (label == null)
				{
					label = "Unlabelled";
				}
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + label + "</span>";
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.value(); 
			
			if (state == null)
			{
				state = "None";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Current value: " + state + "</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// PUSHBUTTON // from button, input type=image, input type=button, input type=submit, input type=reset, label
	
	function ButtonModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Button"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			element.innerHTML = labelValue() + whatAmI();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Button</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = baseElement.getAttribute("value");
				if (label == null)
				{
					label = baseElement.getAttribute("alt");;
					if (label == null)
					{
						label = baseElement.getAttribute("title");;
						if (label == null)
						{
							label = "Unlabelled";
						}
					}
				}
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + label + "</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// CHECKBUTTON // from input type=checkbox, label // combined with input type=radio
	
	function CheckButtonModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Check_Button"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			element.innerHTML = labelValue() + whatAmI() + stateValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Check Box</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = "No label";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + label + "</span>";
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.getAttribute("checked"); 
			
			if (state == null)
			{
				state = "Unchecked";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Current value: " + state + "</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// single select (no multiple attribute)
	
	function SingleSelectModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Single_Select"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// remove OPTGROUP elements
			
			if (element.getElementsByTagName("OPTGROUP").length > 0)
			{
				var possibleOptgroups = element.children;
			
				if (possibleOptgroups.length > 0)
				{
					for (var i in possibleOptgroups)
					{
						if (possibleOptgroups[i].tagName == "OPTGROUP")
						{
							var optionsInOptGroups = possibleOptgroups[i].children;
							if (optionsInOptGroups.length > 0)
							{
								for (var j in optionsInOptGroups)
								{
									// adds options to select element
									if (optionsInOptGroups[j].tagName == "OPTION") 
									{
										element.appendChild(optionsInOptGroups[j]);
									}
								}
								element.removeChild[i];
							}
						}
					}
				}
			}
			
			// Deal with options
			var possibleOptions = element.children; // direct children, should just be options
			for (var k in possibleOptions)
			{
				if (possibleOptions[k].tagName == "OPTION")
				{
					possibleOptions[k].outerHTML = "<span class='_mm_Option' _mm_Id='" + baseElement.mmId() + "'>" + possibleOptions[k].innerText + "</span>";
				}
			}
			
			// finally
			element.innerHTML = whatAmI() + labelValue() + stateValue() + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Single select drop-down</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = "No label";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + label + "</span>";
		}
		
		function stateValue()
		{
			// state forms part of the text to read out

			var state = baseElement.value(); 
			
			if (state == null)
			{
				state = "None";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Current value: " + state + "</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	//--------------------------
	
	// Semantic container objects 
	
	// SECTION //  (DEFAULT FOR DIVISION) - version 1 - lets leave it at section
	// ARTICLE 
	
	function SectionModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Section"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id")); // as divs can be used as targets for anchor links
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// return And Remove First Child Header, as nodes are now set up in replacement element
			
			var header = null;
			var children = element.children; // direct children
			var headings = ["H1", "H2", "H3", "H4", "H5", "H6"];
			
			for (var i in children)
			{
				if (headings.indexOf(children[i].tagName) != -1)
				{
					header = children[i].innerText;
					element.removeChild[i];
					break;
				}
			}
			
			// finally
	
			element.innerHTML = whatAmI() + title(header) + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Section</span>";
		}
		
		function title(selectionTitle)
		{		
			if (selectionTitle == null)
			{
				selectionTitle = "Untitled";
			}
			else
			{
				selectionTitle = "headed " + selectionTitle;
			}
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + selectionTitle + "</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// PARAGRAPH //
	
	function ParagraphModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Paragraph"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = whatAmI() + elementContents;
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>New Paragraph</span>";
		}
	}
	
	// FORM 
	
	function FormModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Form"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = whatAmI() + elementContents;
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Form</span>";
		}
	}
	
	// STATICTEXT (should have a type attribute like type=quote or type=code) // from span, p, quote, abbr, code, etc… 
	
	function StaticTextModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Static_Text"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("span");
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}
	
	// IMAGE
	
	// Semantic non-container objects
	// text to read are given to non-containers 
	
	function SemanticImageModel(baseElement) // might be best to switch on wai-aria role - to differentiate it from decorative image alt="" decorative
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Semantic_Image";
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + altValue() + longdescValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Semantic Image</span>";
		}
		
		function altValue()
		{
			// alt forms part of the text to read out
			
			var alt = baseElement.getAttribute("alt"); 
			
			if (alt == null)
			{
				alt = "None";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Alternative Text: " + alt + "</span>";
		}
		
		function longdescValue()
		{
			var longDesc = baseElement.getAttribute("longdesc");
			
			if (longDesc == null)
			{
				longDesc = ""; 
			}
			else
			{
				longDesc = "<a href='" + longDesc + "' class='unchanged' _mm_Id='" + baseElement.mmId() + "'><span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Long Description</span></a>";
			}
			
			return longDesc;
		}
	}
	
	// Unsupported objects - (We need a big list: MULTISELECT,...) - some things are currently unsupported and others will not be supported even in the future...
	
	function UnsupportedModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Unsupported";
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");// baseElement.tagName());
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}	
}

// SVB 

// SVBMODEL 

function SVBModel()
{
	var currentOSMNodeIndex = 0; 
	var nextOSMNodeIndex = 1;
	var highlightedOSMNodeIndex = 0;
	var availableReadableNodes;
	var readableNodeTypes;
	
	this.getReadableNodes = function()
	{
		return nodesForNavigation(readableNodeTypes); // for mmNavigateByHolderMenu
	}
	
	this.setAvailableReadableNodes = function(availableNodes)
	{
		var all = ["All"];
		availableReadableNodes = all.concat(availableNodes);
	}
	
	function nodesForNavigation(availableReadableNodes) // you want to restrict the available nodes to those which are useful for navigation
	{
		var availableNavigationNodes = [];
		var possibleNavigationNodes = ["All", "_mm_Skip_Link", "_mm_Link", "_mm_Section", "_mm_Form"]; 
		for (var i in availableReadableNodes)
		{
			if (possibleNavigationNodes.indexOf(availableReadableNodes[i]) != -1)
			{
				availableNavigationNodes[availableNavigationNodes.length] = availableReadableNodes[i];
			}
		}
		return availableNavigationNodes;
	}
	
	this.setReadableNodes = function(groupName)
	{
		switch(groupName)
		{
			case "All":
				readableNodeTypes = availableReadableNodes;
				break;
			case "Link":
				readableNodeTypes = ["_mm_Link"];
				break;
			case "Skip_Link":
				readableNodeTypes = ["_mm_Skip_Link"];
				break;
			case "Section":
				readableNodeTypes = ["_mm_Section"];
				break;
			case "Form":
				readableNodeTypes = ["_mm_Form"];
				break;
		}
	}
	
	this.reset = function()
	{
		currentOSMNodeIndex = 0; 
		nextOSMNodeIndex = 1;
		highlightedOSMNodeIndex = 0;
		controlPanel.update();
	}
	
	this.setHighlightedOSMNode = function(nodeIndex)
	{
		highlightedOSMNodeIndex = nodeIndex;
	}
	
	this.getHighlightedOSMNode = function()
	{
		return highlightedOSMNodeIndex;
	}
	
	this.getCurrentOSMNode = function()
	{
		return currentOSMNodeIndex;
	}
	
	this.moveToDefinedOSMNode = function(nodeIndex)
	{
		currentOSMNodeIndex = nodeIndex;
		nextOSMNodeIndex = currentOSMNodeIndex + 1;
	}
	
	this.moveToAndReturnNextOSMNode = function()  // moveToAndReturnNextOSMNode // Should not be all nodes - only those of interest i.e. 
	{
		currentOSMNodeIndex = nextOSMNodeIndex;
		nextOSMNodeIndex = nextOSMNodeIndex + 1;
		
		if (currentOSMNodeIndex <= osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(readableNodeTypes.indexOf(nodeType) == -1)
				{
					this.moveToAndReturnNextOSMNode();
				}
			}
		}
		return currentOSMNodeIndex;
	}
	
	this.moveToAndReturnPrevOSMNode = function()
	{
		nextOSMNodeIndex = nextOSMNodeIndex - 1;
		currentOSMNodeIndex = currentOSMNodeIndex - 1;
		
		if (currentOSMNodeIndex > 0)
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(readableNodeTypes.indexOf(nodeType) == -1)
				{
					this.moveToAndReturnPrevOSMNode();
				}
			}
		}
		return currentOSMNodeIndex;
	}
	
	// The following help control buttons etc...
	
	var currentSimulated;
	var nextSimulated;
	
	function setUpSimulated()
	{
		currentSimulated = currentOSMNodeIndex;
		nextSimulated = nextOSMNodeIndex;
	}
	
	function nextNode() // no move
	{
		currentSimulated = nextSimulated;
		nextSimulated = nextSimulated + 1;
		
		if (currentSimulated <= osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentSimulated);
			if (node != null)
			{
				var nodeType = node.className;
				if(readableNodeTypes.indexOf(nodeType) == -1)
				{
					nextNode();
				}
			}
		}
		return currentSimulated;
	}
	
	function prevNode() // no move
	{
		nextSimulated = nextSimulated - 1;
		currentSimulated = currentSimulated - 1;
		
		if (currentSimulated > 0)
		{
			var node = document.getElementById("_mm_Replacement" + currentSimulated);
			if (node != null)
			{
				var nodeType = node.className;
				if(readableNodeTypes.indexOf(nodeType) == -1)
				{
					prevNode();
				}
			}
		}
		return currentSimulated;
	}
	
	this.nextOSMNode = function()
	{
		setUpSimulated();
		return nextNode();
	}
	
	this.prevOSMNode = function()
	{
		setUpSimulated();
		return prevNode();
	}
}