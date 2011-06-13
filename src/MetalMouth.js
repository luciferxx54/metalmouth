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
	else if(request.augmentationScriptComplete == "true") // see getAugmentationScriptReference()
	{
		sequencer();
		sendResponse({});
	}
	else
	{
		sendResponse({});
	}
});

// start sequencer

var startSequencerFunctions = 
[
 getAugmentationScriptReference,
 initMmId,
 initBodyDOM,
 removeExistingAccesskeys,
 initControlPanel,
 initOSM,
 initSVB,
 updateOSM,
 updateSVB,
 resetSVB,
 attachDOMChangeEventHandler,
 bringFocus
];

// change sequencer - Node Added / Node Removed

var changeSequencerFunctions = 
[
 initMmId,
 initBodyDOM,
 updateOSM,
 updateSVB,
 doNothing
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

var bodyDOM;
var controlPanel;
var osm;
var svb;

function start()
{
	sequencerNextItem = 0;
	sequencerCurrentItem = 0;
	sequencerFunctions = startSequencerFunctions;
	sequencer();
}

function change()
{
	sequencerNextItem = 0;
	sequencerCurrentItem = 0;
	sequencerFunctions = changeSequencerFunctions;
	sequencer();
}

var changeEventTimer;

function uponDomChange()
{
	// Each new element added or removed in the dom fires UponDomChange - if this is a group of 16 new options - then it fires 16 times.  It could however be fired once after the 16th event - 
	// so, if the events are tightly packed each event resets the timer and only the last event in the series fires
	
	var functionToRun = function(){change()};
	
	clearTimeout(changeEventTimer);
	changeEventTimer = window.setTimeout(functionToRun, 250); 
}

function getAugmentationScriptReference()
{
	var mmAugmentationScript = document.getElementById("_mm_AugmentationScript");
	
	if (mmAugmentationScript != null)
	{
		var augmentationScriptRef = mmAugmentationScript.getAttribute("href");
		if ((augmentationScriptRef != null) && (augmentationScriptRef.toLowerCase().indexOf(".js") != -1))
		{
			chrome.extension.sendRequest({augmentationScriptRef: augmentationScriptRef}, function(response) {
				mmAugmentationScript.outerHTML = ""; // this means that the augmentation is started see page top to show what happens when augmentation is complete
			});
		}
		else
		{
			sequencer(); // no script
		}
	}
	else
	{
		sequencer(); // no script
	}
}

// <a id="_mm_AugmentationScript" href="js ref" style="display:none"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+5gz/qwAAAABJRU5ErkJggg==" role="presentation" /></a>

function initMmId()
{
	var htmlElement = document.all;
	var numberingOn = true;
	var count = 0; 
	var elementsToAvoid = ["_mm_StyleArea", "_mm_PushDown", "_mm_ShieldImage"]; // elements which Project metalmouth extension adds
	
	for (var i = 0; i < htmlElement.length; i++)
	{
		if (elementsToAvoid.indexOf(htmlElement[i].id) == -1)
		{
			if (htmlElement[i].id == "_mm_Container") // element which Project metalmouth extension adds, and all its contents
			{
				numberingOn = false; 
			}
			if (numberingOn == true)
			{
				if (htmlElement[i].tagName != null)
				{
					htmlElement[i].setAttribute("_mm_Id", count); // give all a _mm_Id attribute in advance
					count++;
				}
			}
			if (htmlElement[i].id == "_mm_ContainerEnd")
			{
				numberingOn = true;
			}
		}
	}
	sequencer();
}

function BodyDOM(bodyElement)
{
	var domFromPage; 
	
	var bodyClone = bodyElement.cloneNode(true);

	removeScriptElements();
	removeNonScriptElements();
	allFreeTextInSpan();
	correctAddedSpanElements();
	removeLabelElements();
	removeAbbrElements();
	markSpecialCaseSpans();
	addHeaderCellValuesToDataCells();
	removeMMContainer();
	
	this.dom = function()
	{
		return domFromPage;
	}
	
	function removeScriptElements()
	{
		var scriptElements = bodyClone.getElementsByTagName("script");
		if (scriptElements.length > 0)
		{
			for (var x = 0; x < scriptElements.length; x++)
			{
				scriptElements[x].innerText = ""; 
			}
		}
	}
	
	function removeNonScriptElements()
	{
		var noscriptElements = bodyClone.getElementsByTagName("noscript");
		if (noscriptElements.length > 0)
		{
			for (var x = 0; x < noscriptElements.length; x++)
			{
				noscriptElements[x].innerText = ""; 
			}
		}
	}
	
	function allFreeTextInSpan() // <p>hello <span>there</span></p> should become <p><span>hello</span><span>there</span></p> so that the spans can become static text
	{	
		var newBodyText = ""; 
		
		var bodySplit = bodyClone.innerHTML.split("<");
		
		if (bodySplit.length > 0)
		{
			for(var i in bodySplit)
			{
				var rightArrowIndex = bodySplit[i].indexOf(">");
				
				if (rightArrowIndex != -1)
				{
					if (rightArrowIndex == bodySplit[i].length - 1) // see if we have <hghgh>
					{
						newBodyText = newBodyText + "<" + bodySplit[i];
					}
					else
					{
						var openingTag = bodySplit[i].substring(0, rightArrowIndex + 1);
						var freeText = bodySplit[i].substring(rightArrowIndex + 1);
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
		bodyClone.innerHTML = newBodyText;
	}
	
	function correctAddedSpanElements()
	{
		var spans = bodyClone.getElementsByTagName("span");
		
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
	
	function removeLabelElements()
	{
		// remove labels and add their contents to the relevant elements as label attributes - label attributes are not specified in html
		
		var labels = bodyClone.getElementsByTagName("label");  // this step is needed as you are removing elements, otherwise labels is reduced when the labels are removed
		if (labels.length > 0)
		{
			var labelsHolder = [];
			for(var a in labels)
			{
				if (labels[a].tagName != null)
				{
					labelsHolder[labelsHolder.length] = labels[a];
				}
			}
			
			if (labelsHolder.length > 0)
			{
				var forAttributes = [];
				var labelValues = [];
				
				for (var i in labelsHolder)
				{
					if (labelsHolder[i].tagName != null)
					{
						forAttributes[forAttributes.length] = labelsHolder[i].getAttribute("for");
						labelValues[labelValues.length] = labelsHolder[i].innerText;
						labelsHolder[i].outerHTML = ""; // remove label elements
					}
				}
				
				var elements = bodyClone.getElementsByTagName("*"); // all elements
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
	}
	
	function removeAbbrElements()
	{
		// remove abbr elements - replacing their content with the title value for the abbr element
		
		var abbrs = bodyClone.getElementsByTagName("abbr");
		if (abbrs.length > 0)
		{
			var abbrsHolder = [];
			for(var a in abbrs)
			{
				if (abbrs[a].tagName != null)
				{
					abbrsHolder[abbrsHolder.length] = abbrs[a];
				}
			}
			
			for (var i = 0; i < abbrsHolder.length; i++)
			{
				var replacementSpan = document.createElement("span");
				replacementSpan.setAttribute("_mm_Id", abbrsHolder[i].getAttribute("_mm_Id"));
				
				if (abbrsHolder[i].getAttribute("title") != null)
				{
					replacementSpan.innerText = abbrsHolder[i].getAttribute("title");
				}
				else
				{
					replacementSpan.innerText = abbrsHolder[i].innerText;
				}
				
				if (replacementSpan.innerText != "")
				{
					abbrsHolder[i].outerHTML = replacementSpan.outerHTML;
				}
				else
				{
					abbrsHolder[i].outerHTML = "";
				}
			}			
		}
	}
	
	function markSpecialCaseSpans()
	{
		// mark span elements which have a parent of body or div - special cases 
		
		var spanElements = bodyClone.getElementsByTagName("span");
		if (spanElements.length > 0)
		{
			for (var x = 0; x < spanElements.length; x++)
			{
				if ((spanElements[x].parentElement.tagName == "BODY")||(spanElements[x].parentElement.tagName == "DIV"))
				{
					spanElements[x].setAttribute("parentElement", spanElements[x].parentElement.tagName); 
				}
			}
		}
	}
	
	function addHeaderCellValuesToDataCells()
	{
		// collect all th element ids and texts
		
		var headerCells = bodyClone.getElementsByTagName("th");
		
		if (headerCells.length > 0)
		{
			var idAttributes = [];
			var headerCellValues = [];
			
			for (var i in headerCells)
			{
				if (headerCells[i].tagName != null)
				{
					if (headerCells[i].getAttribute("id") != null)
					{
						idAttributes[idAttributes.length] = headerCells[i].getAttribute("id");
						headerCellValues[headerCellValues.length] = headerCells[i].innerText; 
					}
				}
			}
			
			var elements = bodyClone.getElementsByTagName("td"); // all elements
			for (var j in elements)
			{
				if (elements[j].tagName != null)
				{
					var headersAttributeValue = elements[j].getAttribute("headers");
					if (headersAttributeValue != null)
					{
						var headerTexts = [];
						var headersAttributeValueArray = headersAttributeValue.split(',');
						for (var k in headersAttributeValueArray)
						{
							var trimmedValue = headersAttributeValueArray[k].trim();
							if (trimmedValue != "")
							{
								var indexOfId = idAttributes.indexOf(trimmedValue);
								if (indexOfId != -1)
								{
									headerTexts[headerTexts.length] = headerCellValues[indexOfId];
								}
							}
						}
						elements[j].setAttribute("headerCellTitles", JSON.stringify(headerTexts));
					}
				}
			}
		}
	}
	
	function removeMMContainer()
	{
		// remove mm container
		
		if (bodyClone.getElementsByClassName("_mm_Container").length > 0)
		{
			var elementsToRemoveFromBody = ["_mm_PushDown", "_mm_ShieldImage", "_mm_Container"]; // _mm_StyleArea is in the head, and untouched
			for (var i in elementsToRemoveFromBody)
			{
				var mmElementInClone = bodyClone.getElementsByClassName(elementsToRemoveFromBody[i])[0];
				bodyClone.removeChild(mmElementInClone);
			}
			domFromPage = bodyClone.innerHTML; // this is to remove control panel from OSM
		}
		else
		{
			domFromPage = bodyClone.innerHTML;
		}
	}
}

function initBodyDOM()
{
	bodyDOM = new BodyDOM(document.body);
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

function updateOSM()
{
	osm.update(bodyDOM.dom());
	sequencer();
}

function updateSVB()
{
	svb.update();
	sequencer();
}

function resetSVB()
{
	svb.reset();
	sequencer();
}

function attachDOMChangeEventHandler()
{
	document.body.addEventListener("DOMNodeInserted", addNode = function(e){nodeAddedUpdateOSM(e);}, false);
	document.body.addEventListener("DOMNodeRemoved", removeNode = function(e){nodeAddedUpdateOSM(e);}, false);
	
	// we want events being raised from our own code area to be captured and stopped
	var mmContainer = document.getElementById("_mm_Container");
	mmContainer.addEventListener("DOMNodeInserted", function(e){doNothingCapture(e);}, false);
    mmContainer.addEventListener("DOMNodeRemoved", function(e){doNothingCapture(e);}, false);
	sequencer();
}

var x = 0; 

function nodeAddedUpdateOSM(e)
{
	uponDomChange();
}

function nodeRemovedUpdateOSM(e)
{
	uponDomChange();
}

function doNothing()
{
	return;
}

function doNothingCapture(e) // stops any events from our code being interpreted as a change to the dom of the page being viewed
{
	e.stopPropagation();
}

function bringFocus()
{
	var mmControlPanelFocus = document.getElementById("_mm_ControlPanelFocus");
	if (mmControlPanelFocus != null)
	{
		mmControlPanelFocus.click();
	}
}

function removeMM()
{
	var mmContainer = document.getElementById("_mm_Container");
	document.body.removeChild(mmContainer);
	sequencer();
}

//--------------

function MMControlPanelModel()
{		
	getAudio(getPageTitle(), true, null); // not the best place for this, but otherwise init page description sequence is messed up
	
	correctTopValuesForAbsolutePositionedElements();
	
	var highestZIndex = calcHighestZIndex();
		
	var headElement = document.getElementsByTagName("head")[0];
	var mmStyleArea = document.createElement("style");
	mmStyleArea.id = "_mm_StyleArea"; // needs to be removed in initMmId upon dom change _mm_StyleArea, _mm_PushDown and _mm_ShieldImage
	mmStyleArea.innerText = "body{background-position:0px 22px;}span{display:inline-block;}a{display:inline-block;}#_mm_ShieldImage{position:absolute;top:0px;left:0px;z-index:" + (parseInt(highestZIndex) + 1) + ";}#_mm_InfoArea{position:fixed;top:0px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InteractArea{position:fixed;top:23px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 4) + ";padding:0px;}#_mm_Highlighter{position:absolute;z-index:" + (parseInt(highestZIndex) + 3) + ";}"; // #_mm_HighlighterLegend{background-color:#FFFFFF;color:#000000;position:absolute;top:-14px;border:1px solid #FF8C00;text-size:80px;} 
	headElement.appendChild(mmStyleArea);
		
	var mmPushDown = document.createElement("div");
	mmPushDown.id = "_mm_PushDown"; // needs to be removed in initMmId upon dom change
	mmPushDown.className = "_mm_PushDown"; // for removal from DOM clone
	mmPushDown.style.width = "100%"; 
	mmPushDown.style.height = "22px";
	document.body.insertBefore(mmPushDown, document.body.firstChild);

	var mmShieldImage = new Image();
	mmShieldImage.id = "_mm_ShieldImage"; // needs to be removed in initMmId upon dom change
	mmShieldImage.className = "_mm_ShieldImage"; // for removal from DOM clone
	mmShieldImage.style.cssText = "width:"  + document.body.scrollWidth + "px;height:" + document.body.scrollHeight + "px;";
	document.body.insertBefore(mmShieldImage, document.body.children[1]);
		
	var mmContainer = document.createElement("div")
	mmContainer.id = "_mm_Container";
	mmContainer.className = "_mm_Container"; 
	document.body.appendChild(mmContainer);
		
	mmContainer = document.getElementById("_mm_Container");
		
	if (mmContainer != null)
	{
		var mmInfoArea = new CP_InfoArea();
		mmInfoArea.add();
		
		// Control panel buttons
		
		var mmControlPanelFocus = new ControlPanelFocus();
		mmControlPanelFocus.add();
		
		var mmBackToStartButton = new BackToStartButton(); 
		mmBackToStartButton.add();
		
		var mmDivider1 = new CP_Divider();
		mmDivider1.add();
		
		var mmJumpButton = new JumpButtonModel();
		mmJumpButton.add();
		 
		var mmReadPrevButton = new ReadPrevButton();
		mmReadPrevButton.add();
		
		var mmReadNextButton = new ReadNextButton();
		mmReadNextButton.add();
		
		var mmInteractButton = new InteractButton();
		mmInteractButton.add();
		
		var mmDivider2 = new CP_Divider();
		mmDivider2.add(); 
		
		var mmReadOnButton = new ReadOnButton();
		mmReadOnButton.add();
		
		var mmStopReadingButton = new StopReadingButton();
		mmStopReadingButton.add();
		
		var mmDivider3 = new CP_Divider();
		mmDivider3.add();
		
		var mmChangeLocationButton = new ChangeLocationButtonModel(); // shortkey B
		mmChangeLocationButton.add();
		
		var mmNavigateByButton = new NavigateByButtonModel(); // shortkey S
		mmNavigateByButton.add(); 
		
		var mmOptionsButton = new OptionsButtonModel(); // shortkey L
		mmOptionsButton.add();
		
		var mmDivider4 = new CP_Divider();
		mmDivider4.add();
		
		var mmCurrentItemDisplay = new CurrentItemDisplayModel();
		mmCurrentItemDisplay.add();
		
		// Areas
		
		var mmOSMArea = document.createElement("div");
		mmOSMArea.id = "_mm_OSMArea"; 
		mmOSMArea.style.display = "none";
		mmContainer.appendChild(mmOSMArea);
			
		var mmHighlighter = document.createElement("div"); // div
		mmHighlighter.id = "_mm_Highlighter";
		mmHighlighter.style.cssText = "display:none;"; 
		mmContainer.appendChild(mmHighlighter);
		 
		var mmInteractArea = new CP_InteractArea();
		mmInteractArea.add();
		 
		var mmContainerEnd = document.createElement("div"); // added so we know where the container ends, for use in initMmId
		mmContainerEnd.id = "_mm_ContainerEnd";
		mmContainerEnd.style.cssText = "display:none;"; 
		mmContainer.appendChild(mmContainerEnd);
	}
	 
	this.update = function()
	{
		if (svb.nextOSMNode() > osm.elementCount())
		{
			mmReadNextButton.disable();
		}
		else
		{
			mmReadNextButton.enable();
		}
		
		if (svb.prevOSMNode() <= 0)
		{
			mmCurrentItemDisplay.setValue("");
			mmReadPrevButton.disable();
		}
		else
		{
			mmReadPrevButton.enable();
		}
		
		if (svb.nextJumpableOSMNode() > osm.elementCount())
		{
			mmJumpButton.disable();
		}
		else
		{
			mmJumpButton.enable();
		}
		
		var osmNodeToRead = document.getElementById("_mm_Replacement" + svb.getCurrentOSMNode());
		if (osmNodeToRead != null)
		{
			mmInteractButton.disable();

			if (osmNodeToRead.hasAttribute("mmInteractable"))
			{
				mmInteractButton.enable();
			}
		}
		else
		{
			mmInteractButton.disable();
		}
	}
	
	this.updateNavigatableItems = function()
	{
		// Only add new possibilities if they exist in the page
		svb.setAvailableReadableNodes(osm.osmTypesInDOM());
		mmNavigateByButton.setAttribute("_mm_items", svb.getJumpableNodes().toString());
	}
	
	this.changeDisplayedCurrentItem = function(currentItemName)
	{
		mmCurrentItemDisplay.setValue(currentItemName);
	}
	
	// interact actions
	
	this.drawTextBoxInteract = function(textInputElement, enteredDataType) // node ref needed so enter can set the values in the model and in the live site
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		
		var mmTBTextEntry = new TBTextEntry();
		mmTBTextEntry.add();
		 
		var mmTBEnterButton = new TBEnterButton();
		mmTBEnterButton.add();
	
		var mmCloseMenuButton = new CloseMenuButtonModel(enteredDataType, null);
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function cancelInput()
		{
			getAudio(enteredDataType + " entry area closed. Navigation mode entered.", false, function(){mmInteractButton.focusNoAudio();});
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
		
		function TBTextEntry()
		{
			// constructor
			var textBox = new CP_TextBoxModel();
			var tBTextEntry = textBox.template();
			tBTextEntry.id = "_mm_TBTextEntry";
			tBTextEntry.setAttribute("title", enteredDataType);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.appendChild(tBTextEntry);
			}
		}
		
		function TBEnterButton()
		{
			var tBEnterButton = iap_Button.template();
			tBEnterButton.id = "_mm_TBEnterButton";
			tBEnterButton.setAttribute("value", "Enter");
			tBEnterButton.setAttribute("title", "Enter");
			tBEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
			tBEnterButton.addEventListener("click", function(){enter(textInputElement);cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(tBEnterButton);
			}
		}
	}
		
	this.drawCheckButtonInteract = function(checkInputElement) // - services radio button and checkboxes
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		 
		var mmCheckButton = new CheckButtonModel();
		mmCheckButton.add();
		
		var mmUncheckButton = new UncheckButtonModel();
		mmUncheckButton.add();
		
		var mmCloseMenuButton = new CloseMenuButtonModel("check button", null);
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function cancelInput()
		{
			getAudio("check button entry area closed. Navigation mode entered.", false, function(){mmInteractButton.focusNoAudio();});
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
		
		function CheckButtonModel()
		{
			var checkButton = iap_Button.template();
			checkButton.id = "_mm_CheckButton";
			checkButton.setAttribute("value", "checked");
			checkButton.setAttribute("title", "Check");
			checkButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADc0lEQVQ4Ea2VeUgUcRTHvzPzmz1akxLbnCAiEqPoAikDiYrchCgiKf8oyg6MIklKKzIyovsOjCLosJNKrLRTkoggWiq68+qQRE1B0Uq3nd2dmd5v1yNzJwp6C7u/mffe573f+733W8EwDHCJmndh5tSxykq7hcVAhBZ8+Zdfhg6p+bv6rqS4bIfxKrOSuwkcPCO3NGOJa9iuhOHOCLtVQijUX1K5GTk0fVNR+qKuOu96xfz3p1PciFtasKjIXUP8/yP7Ct98gDNnoDQ7LfN2enJcX7tF+ocUzU2ZJES5W/VGFhVpVWQmdFn6NAM5R0tQ8/Ed9IAPAn3CC+2f2eFKmoblM0d3mfSxMihRNoVR4QNUZrlTo0sC7ly/iDJ3CaKHjgvCO3XdvxROktBc9gBO5xngFzDvBd0QNNZtHFrx/ASKNj4pFTcv5ZEVYCErNRDS87VGPfOpGUhMiAdDh+I3UC9wJ17U/XDaQ08tKjDQEVq3Eae/FfD5DQpAEYTwpRJ/C9T9SA687Y4XPUPi3A2o+KLiqx9wpW3D5mO34KG1RGUzE5OMAYeN4X7VD6zKWA2t9jEWrQogWhkC98VcuK8p8NhLycZixqUZM5EfVNSJQ21Yu24jLH1j8PTaQdw5mgnR4sDCzFykThkGr0ppm4gpOKDpcMgCtq+ehZFJi7vcnaNc2Jm7AiMUKx2o+eSbgmVG7eTRkb7pJF7dOtIBltHwvBjpGVvx5EMbbLL5UJmCreT0tt6HgkvnYPja4Fq2Ewu3nKUAOu4W5qP0ZR2svPdMxFTT7vVjcqwN5/NP4NCpIpzevwbOfiJaWr9heuIYzEkejgPZPhMsDWVYDY2PKIWGMWVSLFImZXWZ3Ti8PLhu9PDc+YZ5U/aWsGBJ1FFXXY7sQ1eh+72giwV+OkzOYJIYRLWp1MPtjUQM38tMEMGEX6bHoEvIoYxAVWU5Du7e2juVjjci8eTIGLCIAT1sOEoUDIk1taq1voA+uFNrIcW5A9kI6OshcO8/iEZJRNp6lqLdG0B9i6cWsWmXUwsffdb/xzWvabqx68rrcgzKimbv81OvTN9YEkmTtndCXHT/CLtM117PLP6QdLDCfPuNrV7ce15fmVdctsCo298U/M/jjvKs/CnJ8YOXRVglRYdgPlK9o9ARGUJDi1rx8IR7j9G8pZab/ATuk8tp2lm2nwAAAABJRU5ErkJggg=="; 
			checkButton.addEventListener("click", function(e){checkNoCheckClick(e, checkInputElement);cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(checkButton);
			}
		}
		
		function UncheckButtonModel()
		{
			var uncheckButton = iap_Button.template();
			uncheckButton.id = "_mm_UncheckButton";
			uncheckButton.setAttribute("value", "unchecked");
			uncheckButton.setAttribute("title", "Uncheck");
			uncheckButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACT0lEQVQ4EWP8//8/Awgwusw29bBWyObjYpNj+P//L1iQWOI/I/P7L7/u7t5+o///udxrYPNABlsWbg1K8VCdaq0tLsHPzQY0F2IZseYyMjAyvPv8k+HA5RePZm25kXRxRsBeBl6/BdYLdt3+AjSMKmDa5usvGWymqDF7RufOyfbR0AS5lBqAh5OF+9qLb2wsAjxs0twcLChmti0+xnD7xlWG/39+AAOfEUUOwQEGFzMHg4GhIUNBiAlcmJeTjUGYj0MOaOL/v//QwnT7lg0MR9bOYOBVNGT4++cXXBMyg5mZleHz3TMM7zLqUQwGhicwjhj+oDoVqpOJ4ReDkrkHw67tqxjY0SyFGf7+FyODi5MHAwvDb5gQCo3VYKD/GRiBKU6ejwGoEXtQ8ALN+/8PlCqxyzOhWIPG+fkPTQCJ+xO7Q+Eq8BoMV0UGY9RgeKANl6AAZgomZhYGbjz+4eECpmAmZqDXsZeEWDMIE7B8+PDyEUPltO0MTH++Y2gFFR+//rMzfH//FGdRwsL0n4EFZBAy4BBWZHj/cRdDR20JTheBTGQBOpiVXwZZK1CYkYGJ6T8zy/tvf559+/lHS4iXHa5gQnUSw7eyJKACUBGOG/z595+Bjx1VxZcfvxnefv71lEEgcJH94n13v1GllAcaMmPbjTcMtpO0WN6viz1oV7oj6e/ff1NstMWFeTlZcTsRj8yHr7+AVdPz5zO33Ur+fyj3GiOo/AQBVu+Fdp7mMnnAQl8emBj+4DEDQwpYVrF8/vbnztZD93v+70s5C1IAAH/cVPmhj9oJAAAAAElFTkSuQmCC"; 
			uncheckButton.addEventListener("click", function(e){checkNoCheckClick(e, checkInputElement);cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(uncheckButton);
			}
		}
	}
	
	this.drawSelectMenuInteract = function(selectInputElement)
	{
		mmInteractArea.clear();
		
		var mmCloseMenuButton = new CloseMenuButtonModel("select", null); // new OptionCloseButtonModel();
		
		// get all options and add them as buttons
		var options = selectInputElement.children;
		
		var count = 0;
		for (var i in options)
		{
			if (options[i].className == "_mm_Option")
			{
				var iap_OptionButtonModel = new IAP_OptionButtonModel()
				var mmOptionButton = iap_OptionButtonModel.template();
				mmOptionButton.id = count;
				mmOptionButton.setAttribute("value", options[i].innerText);
				mmOptionButton.setAttribute("title", options[i].innerText);
				mmOptionButton.addEventListener("click", function(e){mmCloseMenuButton.click();optionSelected(e, selectInputElement)}, false); // mirror this above in text input for enter
				mmInteractArea.addOptionToThisMenu(mmOptionButton);
				count++;
			}
		}
		
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function optionSelected(e, selectElement)
		{
			// setting value by javascript should not fire original events which is good
			var setValueFunction = function(liveElementToUpdate, enteredValue)
			{
				liveElementToUpdate.setAttribute("_mm_selectedindex", enteredValue); // problem is that we take dom innerHTML which does not keep live variable values like selectedIndex
				liveElementToUpdate.selectedIndex = enteredValue;
				fireChangeEvt(liveElementToUpdate);
				return liveElementToUpdate[liveElementToUpdate.getAttribute("_mm_selectedindex")].innerText;
			}
			updateLiveAndOSM(selectElement, e.srcElement.id, setValueFunction, "SELECT");
		}
	}
	
	this.drawRangeInputInteract = function(inputElement) // - services input elements with a type attribute set to range
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		var min = inputElement.getAttribute("mmMin");
		var max = inputElement.getAttribute("mmMax");
		var step = inputElement.getAttribute("mmStep");
		var currentValue = extractCurrentValue();
		var changedStep = calculateSteps();
		
		var mmIncreaseValueButton = new IncreaseValueButtonModel(); // increase value
		mmIncreaseValueButton.add();
		
		var mmDecreaseValueButton = new DecreaseValueButtonModel(); // decrease value
		mmDecreaseValueButton.add();
		
		var mmRangeEnterButton = new RangeEnterButton();
		mmRangeEnterButton.add();
		
		var mmCloseMenuButton = new CloseMenuButtonModel("range input", null);
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function cancelInput()
		{
			getAudio("range input entry area closed. Navigation mode entered.", false, function(){mmInteractButton.focusNoAudio();});
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
			
			updateLiveAndOSM(inputElement, currentValue, setValueFunction, "INPUT");
		}
		
		function extractCurrentValue()
		{
			var text = inputElement.children[3].innerText; 
			var colonPosition = text.indexOf(": ") + 2;
			text = text.substring(colonPosition);
			return text;
		}
		
		function calculateSteps()
		{
			// to calculate steps (max - min / step * x) increasing x by 1 until answer > 20 remembering value usually starts in the middle
			var x = 1; 
			
			while (((parseInt(max) - parseInt(min))/(parseInt(step) * x)) > 20)
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
					if (parseInt(currentValue) + parseInt(changedStep) <= max)
					{
						currentValue = parseInt(currentValue) + parseInt(changedStep);
						getAudio("value to enter increased to " + currentValue, false, null);
					}
					else
					{
						getAudio("maximum value " + currentValue + " reached", false, null);
					}
					break;
				case "decrease":
					if (parseInt(currentValue) - parseInt(changedStep) >= min)
					{
						currentValue = parseInt(currentValue) - parseInt(changedStep);
						getAudio("value to enter decreased to " + currentValue, false, null);
					}
					else
					{
						getAudio("minimum value " + currentValue + " reached", false, null);
					}
					break;
			}
		}
		
		function IncreaseValueButtonModel()
		{
			var increaseValueButton = iap_Button.template();
			increaseValueButton.id = "_mm_IncreaseButton";
			increaseValueButton.setAttribute("title", "Increase value");
			increaseValueButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADkklEQVQ4EZ2Va2gcVRTH/3fu7Ozsbma3brXEhihCSqFNLCLYqokopTUWrH4JgdI2/ZC2WBobTAilFRMMSmoVDfhCC35oPii1SEvQBUGCNKVv2jSt9mUU62OladLsksxOZuZ6zppduybZ2lx25nL3nvu75z1CKQUepesTK59eEnhrflSroqUnFP7ZyO7e6aVk2lHJM0P+noH3V33A0oLBj7d8u7Z+uf5ZzSI9HgwAU3fdiZbfFwLwfWDgNy/z1WnvjYOvruwUePZQxZ4NVn9DtbHAcRU8EpjLYHhJEEgMenjnm8w2fUVluKGqXC7wfIVJby7IqTPkuHQGqCzTUPWg3K3NCyNuSDKliEd5S9foIbkiYlkXSpKzDBHXSNIrKkxQQyqk3CBGMyGEOAZFDOP40M8jfvHB1iBgof3TE3jpzV4k7Sj5UhSFM1EvhtU1Bd200NlzGQe7d5EeY9iasdH92jpUxFJI2bNHelaNNUpkMxRB9+Hr+Oj15iyUlTj5ZRca2z7GwF8liIbZnJnHjGCGlkRC2PfdCN7eTdDxPwpOX0x8iM3Ne3H0FxOxyMxGTwNTOsIKB/H5MRudba/AG7lWAM0thvp7sGV7BxI/SIIb4Dy+fUwDR0mD3vMKu1p3wv5zIC8bK1+Gx+rbaf2vhsmzh7F9WxsOnHJhRYLQboMXgNlnfVcDaG1tR2qoPw+FVY6Wji707F2PF5vfpUYQzu+NXulDU2MjPkkkEaR+kIPLiqc2PvdEhVxeFpf4/qrA1h1dGB7szR9EqAwvd76HHS+Uw/Ru4pkVizEceRiDF65QxsRgxEqp4UzixKVR6Pc/gqVlAqd+9pysXZJMSNsKRy6MYfWqGsyrWwPTNKHrAdwbj6Guej4mJ9JwPIFgYAwdm5ahtnofVSNlDmlpcEn6DjS6YNLlmptyGJeeTtXVssZCwKiZ0lYhWwbKx7idgaNENkAZl+pFy2D1EgaQhO/STA+VnIDEjTTBmJezmf3O3c1x7dxfBXMuLjxzB0zPUBw5//JBja/5b6oUEO9ywSxWWPt9xLucIiUDsxfR/0ZzZ5twgOG0uiSTN9b++MDSUG3lQllqmZRJdCML3O3DzYrPJM6741/0Oxt1da3u1n0NX9f7ntr/5CL5qGUKOZdPk0NBPXfd/enQGa/p1/21fdlvHtsqxAGjqumeLQuj6iElhJi9b033jFS+GJ0QN48fsXvU8eeHWOJv971DmIZVuAUAAAAASUVORK5CYII="; 
			increaseValueButton.addEventListener("click", function(){changeValue("increase");}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(increaseValueButton);
			}
		}
		
		function DecreaseValueButtonModel()
		{
			var decreaseValueButton = iap_Button.template();
			decreaseValueButton.id = "_mm_DecreaseButton";
			decreaseValueButton.setAttribute("title", "Decrease value");
			decreaseValueButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADbUlEQVQ4EaWVWUhUURjH/3eZOzOalJpaUmFlVmL5oEF7Ly22QFRWJvVQRlqjUASB5FhRmdhLRZIZLW8VEfZQYETLU7YYREmQJRJE24M5zujs9/R9d+aOaWlZ5+Hec77zfb/zLWeRhBDgNn333W1zJivOMXFKBgRChvAvP0KC6urV37V0hKo7GlfcZDOJwQXOe47CfO1kfoZsVxUgutZfYgkiAcEw8LQj7LnxPFhx/8SyK9KUkubVB9ZYbxXmqarHP3KoubpM8DgrcPVJyFvb5Fuuzpqk7s+doKh9ASCsm2oj/+uUUV8QmD1RtudmWhxyvA2JmgXgif9tOjlms0iItyJZFkIKjzSnwznALF2IsMpK7KyVvFZkmXpStHiREPxBHQEqDKUw1jQqsKKQhCj9gbJd/8gAa6TU2qmj83MPEig3iqJApmrokJE9wYb0BB+4Bgy3a8BHtx1fXICFrLlohIS3rxeTkmRyLrK+AeZJu92GxqbHaLt1CpJNgyQrBnhuQRHqDxUh3d5DiwHtXQlwOC+h/cUDqOwA7TUfRTV/4z6c3DmDxuQBNQPsCwnkpgfRULkUZe4PaGtuiIX45HoNyiUZF44Wwe3TsbvyPM3XR9yKfvPW7kVtSTYyEgN49zUiNMAcoscvMC3Zj8a6PShTrXh1+3TMuOXaMVRQRB5X1y/QeUVVFNFmisiFXmIwi5sB5g4L3D6BqaN7cO54CcqoEK/vnOEpoz28XGV2Y//5W5yor96E8QRlxyzR/LLCT91+eOYYgtfsRM6q8hhkcGdB8aEBUNNTU28AmIVGWsjzLAO+CzkrHaZu7L9w62GCFmJc1NPBUFb8BWxac1qmJ7rJ81JkF+wxxVi07QjqneuRZu0ekNOYQrQTy/HgCR7zLshKZvgulPgCSE4Zi7MH1yFVo0JF9/Xv7Fg2LJgV3F6CJ3nQUFeKeItAivXPUANMh1Dl+3SoxlO8jWaM9RtH1jyBQ+qzgSQpcndvuN3tFVCHzHakoP6gQIDelWF8MI64i1hdHv2t+uCNv3rxNGXJ1FQtle+Bf72T2TE/LdzyPvTh0eO+OuNpynE0L9yQrzXSmzeT79OfLqmhIh4g51R6AxBPO0NtV5+Fd3Q0LGs1wKwlZTal5q0ZtT0lQUob0UtKtpzFbz349PLMt4tCFH9n3g9Gn08YtFwTeQAAAABJRU5ErkJggg=="; 
			decreaseValueButton.addEventListener("click", function(){changeValue("decrease");}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(decreaseValueButton);
			}
		}
		
		function RangeEnterButton()
		{
			var rangeEnterButton = iap_Button.template();
			rangeEnterButton.id = "_mm_rangeEnterButton";
			rangeEnterButton.setAttribute("value", "Enter");
			rangeEnterButton.setAttribute("title", "Enter");
			rangeEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
			rangeEnterButton.addEventListener("click", function(){enter(inputElement);cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(rangeEnterButton);
			}
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
		osmNode.children[3].innerText = "Current value: " + valueToSay; // the node which holds the current value is in 4th position
	}
	
	this.drawMediaInteract = function(mediaElement, mediaType) // - services video and audio
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		
		var mmPlayButton = new PlayButtonModel();
		mmPlayButton.add();
		
		var mmPauseButton = new PauseButtonModel();
		mmPauseButton.add();
		
		var mmRewindButton = new RewindButtonModel();
		mmRewindButton.add();
		
		var mmCloseMenuButton = new CloseMenuButtonModel(mediaType, null);
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function controlMedia(actionName)
		{
			var mmStore = mediaElement.getAttribute("_mm_Store");
			if (mmStore != "null") // null a string as it has been entered as a value into an attribute
			{
				switch(actionName)
				{
					case "play":
						document.getElementById(mmStore).play();
						getAudio(mediaType + " playing", false, function(){document.getElementById("_mm_PauseButton").focus();});
						break;
					case "pause":
						document.getElementById(mmStore).pause();
						getAudio(mediaType + " paused", false, function(){document.getElementById("_mm_PlayButton").focus();});
						break;
					case "rewind":
						document.getElementById(mmStore).currentTime = 0;
						document.getElementById(mmStore).pause();
						getAudio(mediaType + " rewound", false, function(){document.getElementById("_mm_PlayButton").focus();});
						break;
				}
			}
		}
		
		function PlayButtonModel()
		{
			var playButton = iap_Button.template();
			playButton.id = "_mm_PlayButton";
			playButton.setAttribute("title", "Play");
			playButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADAElEQVQ4EZ2VW0gUURjH/2cuO7vuqmt0oQvipageAi2phCQQywK7gSRRJN7wgvWQSWaCYg+BLwWJ1oNgb1k9BYVKL0V0MSFJKURS8BJRpunqujs7s9N3ditH0XX1g7Nzzpnz/b7vfHPOf5lhGODG0p4lpKVKxU67sJmG/sBk+D/CL7cx/KZDbTZ6ssa4G+PgvVc6MrKT5fv74qQEmwwEQ4VPZbR0VgW6BrX+h91q3pfGY2+lmLPPk6pO2x5dTJVjOEoz5SqQhz/MKJII7Nlq2Sky9pgdbz8kpmfn3Tt3QE5yRjB4tCCIw3hTdQFWmcGrGYHxv/mlnpoOWGi3isyiRl2GIkTbWbzdyhZkyjO3SAxNnZNo79MRZbdAFPhsaPNRYg5irYtAosAMaH+/3wIvWbFhZKAPZSWVaOqYgKQ4KPuV689Z1LSQeSiKAs/Ye9ReKkBFYxfGfU5EWkO6/E8uvFXub2hrKEVuZQu6Rm2IptLwrYay8MABgh89T+8gt6gKra9mYLU5oEjLl2YV4GB+E587UVlSiOstvXAZ0XAobMlzv2owxxvTQ2itK8L5iha8GaQjRidosa0JHISo6O/twdBPDQK/SYuMqrQWE5F88jLqr13A/m1ezHjodiyy1YPtW5BTXocb+QexyeoiqEkDTPBVgaMS03C1pgb5GRvBfFNweUjFTDBzNzSYzbvtPlKMm9WFOLzDwOycC7qfLQvlAUKAST+8c4AYgxNltagtTUesw4XpWb71+YDmLM19yTAYKZ15KtjXNS8kZyzKbzWjMmcXZH0K0xRniaULnAMsAaLkVv3jqg90RQHzt/V6fSjNikPcBgl+1YU5SnQlKFdAj0ql8hg/hE+DRsPHYU21WRgkesEDCPRkFDphPemwpga0mM8t28hHJqG3UGF7Rvyu7gH9buCvKbO6s+BMiuV2SrwYyReElpcFOw8M+E5U0uJ3X/XJJx/U0pcNR9sCYP42Nr/jVOp2sYpkMY6SpWXhG+mv9NvtH3g9oNd/f5D5gnv+Ac3vF2uTPY7FAAAAAElFTkSuQmCC"; 
			playButton.addEventListener("click", function(){controlMedia("play");}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(playButton);
			}
		}
		
		function PauseButtonModel()
		{
			var pauseButton = iap_Button.template();
			pauseButton.id = "_mm_PauseButton";
			pauseButton.setAttribute("title", "Pause");
			pauseButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAChElEQVQ4Ee1VS0hUURj+zn2Nd8bxwYhFk1BQbTIKhDIMC8yE9j1Aowymhe2aRYsWtYgoKKOFCAlFEQQ9qE0gRBlSKbZskUS2SKiF9iC1mbmvv/+/V8dJy127+Ye559zvP+c73/24fFcREaRWdw227Wk0r9RVolERfIaiRthd8aJIQZ+eobfPxv1TU7c6hmS1EuLm7NP9h3cYt1s3GamYAQRMqRT/+RfxKz4lOmcpJro0Xpb3gOFx7+vdMadrrLdjUKH1ccOFTNVI9y4z7bJOP4jUyQY9loDSNFAQwHfmwoZulWCFuVCANHQNMHXgxitv8kzf7E6jaZt9qHGtnhY9QiwVtxSG3/u4evMRdG8GrpbA6Uw75LBLAw9h0Rx8I4ns8Xa0bNSQcwgB7zWYeMsarWFrk3XQqK1EjcUAiyqWYh8KvobRB32A943xJPLde3kN4c39a3w/y/JScI7uYxsW7Io4RHWqCtUaQYmly0p80+KJCOcxvBcOO8KkF3Iu2Slc5KuAnfk/VSYu+lq2omxF0YHiZMW3gmgh6kqCZB4r9opUf04MDgpdIqC05N5jLnLnO64WxmkYqTyXIh5lzd/2clDoxudpmpgtRJFX4LCWcn3CqsoAJ89dhAEHLpmoT3Iuc272nL8MU7nwYKGe17j+IrXEJnPRl6lggtF7dra/7vmJ3WZzdVyFpEJusDC7IsaSRGGAXM4RGLZt8ZUxtiSXL4SqBTf5ub//Igy8cF739nxqM4gO5Go6n3RC2XdaNujbkxVKl0CPKrcwKRmXY6L5Zz7wX36g0f4h7wjRsXz4zZNdSl03N/esy6RrtfX8yIvPV0L5ryl/GGjyR/DxXd/IANHZ0NDffR//tvknLgsAAAAASUVORK5CYII="; 
			pauseButton.addEventListener("click", function(){controlMedia("pause");}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(pauseButton);
			}
		}
		
		function RewindButtonModel()
		{
			var rewindButton = iap_Button.template();
			rewindButton.id = "_mm_RewindButton";
			rewindButton.setAttribute("title", "Rewind");
			rewindButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADcElEQVQ4EZWVaUhUURTH//fd92beDM5ouBQFaaEZZeuXClsMKjAo+tCCUBFUFGVEfSjIFipCbIUkaYNCaCMoKIgK2vRDQdSHSkMjKsmw0FJHne29uZ0zk2E6T+x8mDnvLL977n3nnieUUmARSx9MLJ4m9w3zYgIEbDInHHGv848QFK0gf3apuvuvrMPqXnF9nMfgyZvvz1pZ6Lo2L1/PTnFTXB9kH9WRTnB0hxRqGuzPV17YJfVVC17oYvrNzAPbM6rXFRrZiUwBt+khVSEcCsGyFTjRSaQG2DFguE9gTKaWQ/HVIu9moV4wO7Vk2miZq1MAIfC4PoJ7NW/i+rL5+ZiT70IwMrBuXst0S7QGFLyGTXABrwuYmq3nTVo0bJWe5UOWKROruimwuTWIqxVbOA0zp9yGIT0IwvqnYF1T8Hg8uFr7C3VN3di7PAs2lc2Vuw0gI01laUoJ2mxC+Gx1Ga8FkGZc7/VxBOseSlSGH8dufcWOrdvQ+qUOuouPLiHMUDFh672Gofz7PRqaunw4WPUId88dBqI/4TLNpKlDAkuhkOJ1o+ajRNmRM3j/8FxSWF/joGDeupsiLG8KLjxpQ8WhI2j/8LRvvqPuDCYqv+WA8mPP+ZeoPrWfHpocQf0djmBJ0HctBi7tvIzaGycpz+6fO+gzda+DUHNw+4TDYQr4PygTHcE28aaOtHCjchNW7T5LfTbCoYLkZkcwXUJ0041L1ztxonQGDlReQkr2jOSUJFZnMAXzVQlFqStCAZQWp+P8xUrkFq1LghloGhTcG85zINAVxsJ8C9Wnd2DhhnI6RN8fNy8/UIYE5jTu6c6gjRxfJ86WLca2iouAfwyi4Z6BVLLoQijZOxb534oxIhRvCZv0/vX0RACX7EBZSS5GZVahobkbVoTi/wjH00SX+o8ONAcpWNKEi0ZtDE8zsWTLcfJqSE910zz+t9U4MWrTJ6anB2uL0tDS4ac8i2a2oKEFBOmdfG+3mwVybqft2Ztau3GuUcDX11YChumlvSvaZhAx3kH/srk6NpOdB71FaxsEDdF0vfAs8ra8vG2Orj4tax+7/sFqCrg+O0+O95tM6eLU+LnyGGTAYMLuAH+aGq33159H16iPKzrE34/p9DsjixZ5dqX7tHFUJd25oYumCa0tEGt8+jB4VL1e+o0zfwMlXEHNq2U2ygAAAABJRU5ErkJggg=="; 
			rewindButton.addEventListener("click", function(){controlMedia("rewind");}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(rewindButton);
			}
		}
	}
	
	// Control Panel (CP) Base Models
	
	function CP_InfoArea() // should have a this.addButton function - see CP_InteractArea
	{
		var infoArea = document.createElement("div");
		infoArea.id = "_mm_InfoArea";
		addHandlers();
		
		this.add = function()
		{
			mmContainer.appendChild(infoArea);
		}
		
		this.appendChild = function(elementToAppend)
		{
			infoArea.appendChild(elementToAppend);
		}
		
		function changeHotKeyStatus()
		{
			if (hotKeysHolder.value == "hotkeys on")
			{
				addHandlers();
			}
			else
			{
				removeHandlers();
			}
		}
		
		this.enableHotkeys = function()
		{
			addHandlers();
		}
		
		this.disableHotkeys = function()
		{
			removeHandlers();
		}
		
		function addHandlers()
		{
			alreadyBusy = false;
			infoArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
			infoArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
		}
		
		function removeHandlers()
		{
			infoArea.removeEventListener("keydown", hotKeyDown, false);
			infoArea.removeEventListener("keyup", hotKeyUp, false);
		}
		
		var hotKeyTimer;
		var keyBeingTimed;
		var buttonName; 
		var textIfButtonDisabled;
		var alreadyBusy; 
		var arrowSelected;
		
		function hotKeyDown_Handler(e)
		{
			if (alreadyBusy == false)
			{
				setAlreadyBusy(true);
				
				var selected = false; 
				
				switch(e.keyIdentifier.toString())
				{
					// special cases for arrowing around page
					case "Up": // ReadPrevButton + Interact
						selected = true;
						arrowSelected = "Up"; 
						keyBeingTimed = e.keyIdentifier.toString(); 
						buttonName = mmReadPrevButton; 
						textIfButtonDisabled = "Read previous Button is currently disabled"; 
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						window.event.returnValue = false;
						break;
					case "Down": // ReadNextButton + Interact
						selected = true;
						arrowSelected = "Down";
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmReadNextButton; 
						textIfButtonDisabled = "Read next button is currently disabled";
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						window.event.returnValue = false;
						break;
					case "Right":
						selected = true;
						arrowSelected = "Right";
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmJumpButton; 
						textIfButtonDisabled = "Jump button is currently disabled";
						hotKeyTimer = window.setTimeout(specialCasesFunctionToRun, 10);
						window.event.returnValue=false;
						break;						
					// end special cases
					case "U+0047": // g - ReadPrevButton
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString(); 
						buttonName = mmReadPrevButton; 
						textIfButtonDisabled = "Read previous Button is currently disabled"; 
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0048": // h - ReadNextButton
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmReadNextButton; 
						textIfButtonDisabled = "Read next button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0046": // f - jump 
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmJumpButton; 
						textIfButtonDisabled = "Jump button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004A": // j - interact
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmInteractButton; 
						textIfButtonDisabled = "Interact button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0042": // b - change location 
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmChangeLocationButton; 
						textIfButtonDisabled = "Change location button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004B": // k - read on
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmReadOnButton; 
						textIfButtonDisabled = "Read on button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0044": // d - start of page
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmBackToStartButton; 
						textIfButtonDisabled = "Back to start button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004C": // l - options
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmOptionsButton; 
						textIfButtonDisabled = "Options button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0053": // s - jump item selector
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = mmNavigateByButton; 
						textIfButtonDisabled = "Navigate by button is currently disabled";
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
			buttonName.focus();
			if (buttonName.enabled() == true)
			{
				buttonName.focus();
				setAlreadyBusy(false);
			}
			else
			{
				getAudio(textIfButtonDisabled, false, setAlreadyBusy(false));
			}
		}
		
		function specialCasesFunctionToRun() // this is for down and up arrowing
		{
			if (buttonName.enabled() == true)
			{
				buttonName.click();
				if ((arrowSelected == "Up")||(arrowSelected == "Down"))
				{
					if (mmInteractButton.enabled() == true)
					{
						mmInteractButton.focusNoAudio();
					}
				}
				if (arrowSelected == "Right")
				{
					if (mmJumpButton.enabled() == true)
					{
						mmJumpButton.focusNoAudio();
					}
				}
				setAlreadyBusy(false);
			}
			else
			{
				getAudio(textIfButtonDisabled, false, setAlreadyBusy(false));
			}
		}
		
		function setAlreadyBusy(value)
		{
			alreadybusy = value;
		}
	}
	
	function CP_InteractArea()
	{
		var closeMenuButton;
		var interactArea = document.createElement("div");
		interactArea.id = "_mm_InteractArea";
		interactArea.style.cssText = "display:none;";
		addHandlers();
		
		this.clear = function()
		{
			interactArea.innerHTML = ""; 
		}
		
		this.show = function()
		{
			interactArea.style.cssText = "";
		}
		
		this.add = function()
		{
			mmContainer.appendChild(interactArea);
		}
		
		this.addButtonToThisMenu = function(button)
		{
			interactArea.appendChild(button.asHtml());
		}
		
		this.addCloseButtonToThisMenu = function(closeButton)
		{ 
			interactArea.appendChild(closeButton.asHtml());
			closeMenuButton = closeButton;
		}
		
		this.addOptionToThisMenu = function(option)
		{
			interactArea.appendChild(option);
		}
		
		this.appendChild = function(elementToAppend)
		{
			interactArea.appendChild(elementToAppend);
		}
		
		function changeHotKeyStatus()
		{
			if (hotKeysHolder.value == "hotkeys on")
			{
				addHandlers();
			}
			else
			{
				removeHandlers();
			}
		}
		
		this.enableHotkeys = function()
		{
			addHandlers();
		}
		
		this.disableHotkeys = function()
		{
			removeHandlers();
		}
		
		this.focus = function()
		{
			interactArea.children[0].focus();
		}
		
		function addHandlers()
		{
			alreadyBusy = false;
			interactArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
			interactArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
		}
		
		function removeHandlers()
		{
			interactArea.removeEventListener("keydown", hotKeyDown, false);
			interactArea.removeEventListener("keyup", hotKeyUp, false);
		}
		
		var hotKeyTimer;
		var keyBeingTimed;
		var buttonName; 
		var textIfButtonDisabled;
		var alreadyBusy; 
		var arrowSelected;
		
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
					case "U+001B":
						selected = true;
						keyBeingTimed = e.keyIdentifier.toString();
						buttonName = closeMenuButton; 
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
			buttonName.focus();
			if (buttonName.enabled() == true)
			{
				buttonName.focus();
				setAlreadyBusy(false);
			}
			else
			{
				getAudio(textIfButtonDisabled, false, setAlreadyBusy(false));
			}
		}
		
		function setAlreadyBusy(value)
		{
			alreadybusy = value;
		}
	}
	
	function CP_Divider()
	{
		var mmDivider = document.createElement("span");
		mmDivider.innerText = "|";
		mmDivider.style.cssText = "float:left;margin-left:5px;margin-right:5px;";
		
		this.add = function()
		{
			mmInfoArea.appendChild(mmDivider);
		}
	}
	
	function CP_ButtonModel()
	{
		var audioOn = true;
		
		this.template = function()
		{
			var button = document.createElement("input");
			button.setAttribute("type", "image");
			button.style.cssText = "float:left;"; 
			button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
			return button; 
		}
		
		// focusNoAudio
		
		this.noAudio = function()
		{
			audioOn = false;
		}
		
		function buttonHasFocus(e)
		{
			if (audioOn == true)
			{
				if (e.srcElement.getAttribute("title") != "")
				{
					getAudio(e.srcElement.getAttribute("title") + " button has focus", false, null);
				}
			}
			else
			{
				audioOn = true;
			}
		}
		
		this.isEnabled = function(buttonName) // for hotkeys
		{
			var result = false;
			if (buttonName.style.opacity == "1")
			{
				result = true;
			}
			return result;
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
	
	function CP_DisplayBoxModel()
	{
		this.template = function()
		{
			var textBox = document.createElement("input");
			textBox.setAttribute("type", "text");
			textBox.setAttribute("readonly", "readonly")
			textBox.style.cssText = "float:left;width:400px;";
			return textBox; 
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
					getAudio(e.srcElement.getAttribute("title") + " entry area has focus", false, null);
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
	
	function CP_MenuButtonModel(menuName, menuButtonName, optionSelectedFunction)
	{
		this.template = function()
		{
			var button = document.createElement("input");
			button.setAttribute("type", "image");
			button.style.cssText = "float:left;"; 
			button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
			button.addEventListener("click", function(e){openSubMenuClick(e);}, false);
			return button; 
		}
		
		function buttonHasFocus(e)
		{
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " button has focus", false, null);
			}
		}
		
		this.isEnabled = function(buttonName) // for hotkeys
		{
			var result = false;
			if (buttonName.style.opacity == "1")
			{
				result = true;
			}
			return result;
		}
		
		function openSubMenuClick(e)
		{
			getAudio(menuName + " menu entered " + (e.srcElement.getAttribute("_mm_items").split(',').length + 1) + "options available", false, changeFocus);

			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
			
			drawSubMenu(e.srcElement);
		}
		
		function drawSubMenu(readOnlyElement) // for mm menu items
		{
			var iap_Button = new IAP_OptionButtonModel();
			
			mmInteractArea.clear();
			
			var mmCloseMenuButton = new CloseMenuButtonModel(menuName, menuButtonName);
			
			// get all options and add them as buttons
			
			var readOnlyElementItems = readOnlyElement.getAttribute("_mm_items").split(',')
			
			for (var i in readOnlyElementItems)
			{
				var optionButton = iap_Button.template();
				optionButton.id = i;
				optionButton.setAttribute("value", readOnlyElementItems[i].replace("_mm_", ""));
				optionButton.setAttribute("title", readOnlyElementItems[i].replace("_mm_", ""));
				optionButton.addEventListener("click", function(e){mmCloseMenuButton.click();optionSelected(e, readOnlyElement, optionSelectedFunction)}, false); // mirror this above in text input for enter
				mmInteractArea.addOptionToThisMenu(optionButton);
			}
			
			mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
			
			mmInteractArea.show();
			
			function optionSelected(e, selectElement, optionSelectedFunction)
			{
				// sets the navigate by item which the jump button then uses
				optionSelectedFunction(e.srcElement.value);
				// then refocus 
				selectElement.focus();
			}
		}
	}
	
	// InteractionArea Panel Models
	
	function IAP_Divider()
	{
		var divider = document.createElement("span");
		divider.innerText = "|";
		divider.style.cssText = "float:left;margin-left:5px;margin-right:5px;";
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(divider);
		}
	}
	
	function IAP_OptionButtonModel() // will be removed later in place of below
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
			if (e.srcElement.getAttribute("title") != "")
			{
				getAudio(e.srcElement.getAttribute("title") + " option has focus", false, null);
			}
		}
		
		this.isEnabled = function(buttonName) // for hotkeys
		{
			var result = false;
			if (buttonName.style.opacity == "1")
			{
				result = true;
			}
			return result;
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
	
	function IAP_ButtonModel()
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
		
		this.isEnabled = function(buttonName) // for hotkeys
		{
			var result = false;
			if (buttonName.style.opacity == "1")
			{
				result = true;
			}
			return result;
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
				getAudio("Reading all items", true, function(){mmReadOnButton.click();});
			}
		}
	}
	
	function NavigateByButtonModel() // replace NavigateByHolder
	{
		// constructor
		var optionSelectedFunction = function(value)
		{
			svb.setJumpableNodes(value);

			// to ensure that the jump button is updated

			if (svb.nextJumpableOSMNode() > osm.elementCount())
			{
				mmJumpButton.disable();
			}
			else
			{
				mmJumpButton.enable();
			}
		}
		
		var button = new CP_MenuButtonModel("Navigate by", "_mm_NavigateByButton", optionSelectedFunction);
		var navigateByButton = button.template();
		navigateByButton.id = "_mm_NavigateByButton";
		navigateByButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAC/0lEQVQ4EZ1VXUgUURQ+M3Nndme1bC1iSdCHlHqqTJFgyYIsgjWECgrLoECI6qWHQrC36CHIHoKg6DkKMorqIYUICjSUzOqhYkVarDdbK3fcn5m5t3NGZ91xx5y6cHdm7jn3u9/97nfPSkIIoBY7/nhPS0PlmYim1HAJbGcwyI+QJAAh/zKsz4Pj6avi2ZFPNE0i4L29g6cObI/2NdZG1miqDO5iQXAdEMTO5GwYTs6mHoymu97fSLxmDd1PO84nYrcPNlWzbIEDn99AUMxiXqyKQf36cB0X0l1p1/240na4u/9QczSmMRksWyBb3Nh/dJsDaEwCJF+VypgGi+pKDQ3wBapMwWCRR7AXG+fSdCKmqxJEK9kGhgtZC+fnaPtjDmGVMK0cqHHOIQRZiGiyk+8oKbjN3NkyIakhuHzrOXwYGgBFnk904/5PAaZcCZcunINEYzUULKS50IrA9C2rGsx8T0Jq5JEbD/DUUcazuEPvFr20UBPG1ABgJSmhCl/ZPIwpPWfRym4vAfB9RUVtBUw8tCWEoQhMott5Azra90F8RxMoinczvriAGnMZateFPfpS7iIwWQM9c7JtI2j6Vn8cv1HB4ffPGcjh5SLbuq0ITK4QigJX7r2Dqa8TEMgUiGJyFY62x2HnptWOj8uAaUAJRWB0+BW8edjnxgM8ddi/+yUwZGLZi7XLKyTKEQ5pAcBKUvRV6HncbckQvXqBUY5CwVySssJn1sCjWQpbcng03S5kYfOWZnTERfSzsgIihhHQlHSIhFkZOJ0jIw/SqsI2oaezBW9gKzq5nEX5SpiFrrDQpnN5G1S3gEmywmbmrKm8BdEq1MkpcNwEkcdejrLsCOlJ+VQZswUB6Yz9TR6fMHrHJg1T1yTHh2Q7uvf/0mUkFcZySeVzLGWkht9O35n/a+oZONHeFL2+ra5iLZnc5yyWZUsBkjKT4zCUnJ3sH0l3fbyZGHKAKRg99qQ1Xh85jXW1BovfoiEp+Jfm2EoCOW1YX16MTl8Tg51JSv8Dyv8z1ZWiNJgAAAAASUVORK5CYII="; 
		navigateByButton.setAttribute("alt", "Navigate by menu");
		navigateByButton.setAttribute("title", "Navigate by menu"); 
		navigateByButton.style.opacity = "1";
		
		this.add = function()
		{
			mmInfoArea.appendChild(navigateByButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(navigateByButton);
		}
		
		this.focus = function()
		{
			navigateByButton.focus();
		}
		
		this.setAttribute = function(attributeName, attributeValue)
		{
			navigateByButton.setAttribute(attributeName, attributeValue);
		}
	}
	
	function JumpButtonModel()
	{
		// constructor
		var button = new CP_ButtonModel();
		var jumpButton = button.template(); 
		jumpButton.id = "_mm_JumpButton";
		jumpButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADEElEQVQ4Ee1VW0gUURj+5szMXtxV8y4mpa12EbXMEETtgqBiD0EPQRei20NUkJgvQZAkkRT10kMKvSjbQhcsK+glSu1GBQVdyMIoDSM37brX2dmZzj97cUMfhV76h9kz5z/f/80//9nz/YKu6yAzNfdWNFbltWekmMsEJqjgbp1fFlmGSRJoapjAf8M8xhdUOYC8Ar8geoOq+/nIt7Pvzm90EVAg4vJ9V9dsXutwri7NzU8ySwYhLTIeMfkrhKBuBqMJN8ILmoKsZBEiYwaWqMOahhcfvvv7H4219x+tPymg4mzesbbahzsbFi+kDNUwDzQoAJvVgs6eO3CeOwFJZIZX4wTLqpvRdfwgrCzECSkqkoTNIuHW03Gc7nu1V1pZW7B1+aKMhSLPyBcMRykjgwYRit8D95uBv/zzC5dyJpmTKgYxLWr89vhVlBemoaIoo4Olp0jZZhMzPuWvaGOi8xJEMk1cE2VTtL6J3ohLFAUkJ8lZvEgC7cWcGXFpuh6emc4cveI/cbyQ/0vxD0thMUmw2xlkkzmeReyBiRJsNoYkKxcnLiyznS8pBo6NssTwccKLvqG3gP8rXg+/jy3Fxx+TX3Cy+yYUXUTdqhLUlWRCUUktpm0GsRrWUJCbjML5GWjb3wZ1/Mk0Ovo0POjC8GA/dhx3orI4a1adYVyRRSGmkzyQzrqqqtiybjG6ei4h1VEzgxjmdOw/cwUd+zbAKmlxhSMgcXFSkU1MBUZ9ATWut7RI5L+9fmyoyseZbhdSi2rJHTEi7XTh8K4maIoXIa7fMSMhVEI6pjzKqOieXPauoDR/fVlBWg51DzLSZuoYaljFCkcmHJWNGBx6AL/Pg5ZTl3BkTwN0xcdbVARLeNobiyzi9rPP4cv33u82WtOC7RdLt9UXX6gpyS5PSZIjrSyaBnU7u82Ka/dHMDL2BQc21UFXA0aniUKMz1dC1Jq+ua8//nTobmeT0yAmgCC0ple31rfkzLMu0bmgJu4xnfvUVDuYKOP3r58I8n9AwrbwWIH5AyH3wMuJXuXGdmO3/wB/8ytagoaVjgAAAABJRU5ErkJggg=="; 
		jumpButton.setAttribute("alt", "Jump");
		jumpButton.setAttribute("title", "Jump");
		
		this.add = function()
		{
			mmInfoArea.appendChild(jumpButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(jumpButton);
		}
		
		this.enable = function()
		{
			button.enableButton(jumpButton, "click", jump);
		}
		
		this.disable = function()
		{
			button.disableButton(jumpButton, "click", jump);
		}
		
		this.focus = function()
		{
			jumpButton.focus();
		}
		
		this.click = function()
		{
			jumpButton.click();
		}
		
		this.focusNoAudio = function()
		{
			button.noAudio();
			jumpButton.focus();
		}
		
		function jump()
		{
			svb.jumpToAndReturnNextOSMNode();
			controlPanel.update();
			highlightCurrentNode();
			
			if (svb.nextJumpableOSMNode() > osm.elementCount())
			{
				readCurrentNode(null, "Last item in page");
			}
			else
			{
				readCurrentNode(null, ""); // was next item
			}
		}
		
	}
	
	function CloseMenuButtonModel(menuName, menuButtonName) // generic sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var closeMenuButton = iap_Button.template();
		closeMenuButton.id = "_mm_CloseMenuButton";
		closeMenuButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII=";
		closeMenuButton.setAttribute("title", "Close menu");
		closeMenuButton.style.opacity = "1"; 
		closeMenuButton.addEventListener("click", function(){closeMenu()}, false);
		
		this.asHtml = function()
		{
			return closeMenuButton;
		}
		
		function closeMenu()
		{
			if (menuButtonName == null)
			{
				getAudio(menuName + " menu closed. Navigation mode entered.", false, function(){mmInteractButton.focusNoAudio();});
			}
			else
			{
				getAudio(menuName + " menu closed", false, function(){document.getElementById(menuButtonName).focus();});
			}
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		this.focus = function()
		{
			closeMenuButton.focus();
		}
		
		this.enabled = function() // for hotkeys
		{
			return iap_Button.isEnabled(closeMenuButton);
		}
		
		this.click = function()
		{
			closeMenu();
		}
	}
	
	function ReadPrevButton()
	{
		// constructor
		var button = new CP_ButtonModel();
		var readPrevButton = button.template(); 
		readPrevButton.id = "_mm_ReadPrevButton";
		readPrevButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADKElEQVQ4EZ1VWUhUYRT+7uJcJ2ckHRMiW6Ro8SHrwcoWBEOCoB6mxZYXRwySoCYtogWiIKjeeukp6SGsyJRoecheSisjCXpooZmYSixTW9TZ79y5t3OuM2NGy51+uHNn/v+c73z/Od85IxiGAV5z69o3rVhUdDzfocwVDGjmpsUPQ4A8GlEDvW+GTvovbG5jN4GBaw531rtXzzq3fME0hyyJGA9lEZVB6NGSOnr9X8LtD997O0+tuyCUbL9cdWjH0ru1a+YokbgGXU9ZWscFMxFFYIqSg2vd79Szrc/Xy0vmF3vL5xQoMTVJUVNcs6VMJPQkEFU1lJcW2soXFjeJuTbJpdgkJPUJNIHuZpOJQpZLJwzCo0d0iZT4ZKp+JgznK0eW4R8IIV3YbPDZxxCE5CRaDOp02NHW9RbX779CLuXsf5ecduTrOx1TcKOnD0f3euDZcxAFhXaEQhMpStv+6S1Bx9exGAwSgAnMTPMJtP1RHw407kTs4zO8ePkazafbkFDjf8KZtK+TnGz2fGxcuwxOuwTZvH5eLm486Ufz7h0YC/SYDt2tJ9A9yfXfP/JmV2Bd9R2qkQjRzOkDH7z17gzovyF+b8E6Fokpi0GEIGFgeARjgx9+b53NLhcqtcRIKIRG93IcO38TQn5Jev+/3tEwSdRscCqeRh2TiEexb2sldd5VnGnaBiPYj7K1dSieXgJdS1gKwsWzF0yHqKvUGKwKUrJG8ohFwwS+khJ0Baf3bUFVzQYc97oRtiw3gSaahqGv3xGKJsblxpR4TmgMXrsKwfBFxFWKFlUhaKolxmwkU+UkyjMrP9MgfMDzgpnv316FZ75himxNw+zLi7KaGbkiDXUOklkMLpJJ5UJXxihzaOGLQGDEWRJHwnF/MJIwRZ324ymlUuJ/ipc++uubGyMYUTESSvikgFL9Yt5M55bFpYVOJYc6hiJKnKssHxv5MqFbT/s/X7rt88jGPU+gbFfHJipeS8X8ojK7Tc56XPL1o/RH0esbft3R1dcQ66zzm/95fD/BeWRaRf3KBtdUZQaP1L/e+ZdDTuu3UfXT0yuPW4zBU4N8/ANeHTvrCJ1lmwAAAABJRU5ErkJggg=="; 
		readPrevButton.setAttribute("alt", "Read previous");
		readPrevButton.setAttribute("title", "Read previous");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readPrevButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(readPrevButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readPrevButton, "click", prevNode);
		}
		
		this.disable = function()
		{
			button.disableButton(readPrevButton, "click", prevNode);
		}
		
		this.focus = function()
		{
			readPrevButton.focus();
		}
		
		this.click = function()
		{
			readPrevButton.click();
		}
		
		function prevNode()
		{
			svb.moveToAndReturnPrevOSMNode();
			controlPanel.update();
			highlightCurrentNode();
			
			if (svb.prevOSMNode() <= 0)
			{
				readCurrentNode(null, "First item in page");
			}
			else
			{
				readCurrentNode(null, ""); // was previous item
			}
		}
	}
	
	function ReadNextButton()
	{
		// constructor
		var button = new CP_ButtonModel();
		var readNextButton = button.template();
		readNextButton.id = "_mm_ReadNextButton";
		readNextButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADKElEQVQ4EZ2VS0hUURjH//fcc0fH97MHYWqhSISbEs1UmIKCktBFKGpEBkWFkmQm0aKVSkUu3AgRZRG6EaGCFi2SMrKNQi4yw0cWpY7vGcd53EffGZ+jRFe/y7ncO/ec3/m+//m+byTDMCBMsj0+eDw74UpkCE/QdUn3/2jyxpjBZhzekXedA01Gd+V3P0+As268PlWQldSckRKbYLXIWN7LJJackoAFj4rPA/bh9q7h8t6mgk4eX9hyqLbscGuJbV+EphsQYzvGZQkH9kYlM7C24BNPc2Vb0bXmorzk9IhQBV6fDp3c3c5QNQOcMQRZWNjorMvKwkOUxJBgDo0+bMVE+GKsN1XXERasIDo0KJFJkqRuWVOi+VQdEl0yC6QLllCUrd/R7DPnDOMzi3jx/ge4YtkEFxyukfsWmhhKIQidzJiiMMTGROHZk/uY/mNDzYXTcC8uBCzl1iCO4XEnhuwe0iwwrICZ615E+C6Ewmf/hsbaFljDX6Li7BGoHtfqLB4XHYm33f14VFcJOlTTJst04I4xwD2FhqpiWteGquJskmXRXwcckMGgwmvvNw3dOFGf/4l6gjPjOfLz0sFlEBN0un4JtuDuRjK9GwS/d/cmugdmERcRLMCMXBeHtqX2sBkdvgdVdxqQmRKFqXk3SAqNLhk8NgWyZC4rBJVxDt05AY9zGiBozYM2VJfmYOjXJHwapdvUzBzOZKbB9qrTdFbw5ay4fbUYI33dBG2lg8uBh1JO9BqhLHdRV9q/Kxy7Y0KgmmxACuX9xLwOHpeKirpLuO6HOqnG1xTiMuWYl8pzwe0z3dkEeHLagbLzF1F+MnXVU9HhVowOz5BN1sXKGqpQHTuirDhnS4Lm8wY4JFiklMycLm3C7dWoONZ2WyX840EkkYXKWtj6/i2iX/RocLh8Y6y3/3d9z+C0W/xzKDLzNxRRsv8b1BaFZ6vzhDwKSdEzODn3uW+0URI5bLv1prTwaGJTRmp8dBBNMJ90SyGJ8D0U9aevk/aOrqHLHx7md/jB4nNcSeux3LSd1WFWnkSloi4tMXcnUficyzfY+WWsYb699KNY9RdxgVu70uAVBgAAAABJRU5ErkJggg==";
		readNextButton.setAttribute("alt", "Read next"); 
		readNextButton.setAttribute("title", "Read next");
		
		this.add = function()
		{
			mmInfoArea.appendChild(readNextButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(readNextButton);
		}
		
		this.enable = function()
		{
			button.enableButton(readNextButton, "click", nextNode);
		}
		
		this.disable = function()
		{
			button.disableButton(readNextButton, "click", nextNode);
		}
		
		this.focus = function()
		{
			readNextButton.focus();
		}
		
		this.focusNoAudio = function()
		{
			button.noAudio();
			readNextButton.focus();
		}
		
		this.click = function()
		{
			readNextButton.click();
		}
		
		function nextNode()
		{
			svb.moveToAndReturnNextOSMNode();
			controlPanel.update();
			highlightCurrentNode();
			
			if (svb.nextOSMNode() > osm.elementCount())
			{
				readCurrentNode(null, "Last item in page");
			}
			else
			{
				readCurrentNode(null, ""); // was next item
			}
		}
	}
	
	function InteractButton()
	{
		// constructor 
		var button = new CP_ButtonModel();
		var interactButton = button.template();
		interactButton.id = "_mm_InteractButton";
		interactButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAFHElEQVQ4EYVVCWxUVRQ9f52ZP/PbTHdKS7Gy1LYpjmwxUAwaWkWsayJtUBoECTEQm5IIjSzGJoJRMC5BQ1QgVkUgCkkNCSYFLB0JUSgoiGVJgEKHpcuUmfnrfO/7lIEak97kvz/v/ffOPfe+c+9wjuOAGac2Zc9YOuPNrHTfBFq6s+h+GXngwPEx3YwcOnV1m7Gv/piLx4CLF+6pmP/E2JbK0rxy1SdiyNfIiEM7OA4wrCQ6L/ZG9oW7G9s2VrWIXMF7maubq79bXDW+1CuLsGjD/xodTtl/4mFTgedQXhTM9UjCtvH1uwbFSc+WvjptYlapQqAx3UqdZT94oiJLAiRJRBI8RcLRGsE4FgyDnvtIWDZgJx1Mn5gtTivN+VDMy1CK/F4Rpj2cqeKhNcj48/IAOk+fw5XubgIzoKoqxj1YjFBJEcZkemhNdx2wgJIELIs8gqrnAUpo0r4/pyxffp8Xv1+MYuv2r9Gx/3v0XTkDW4sSUxuc4IGkZqGg5FHU1L6G+uceQ6bPRlyjaOmsi+XAEofFThOFQPe0X0Tz2w3oOfEzvBIHSRAhchYcSgMHDVzsGi6Fd+KjY604Gl6JDWsbUZwlQjMoH0M2DNjvk9B28jrWNi5B9Oxh+P0+GFoCvJKJ9PwJkL0B3O7rwWDPWXJmU9gWOlrWYxW527JxFYKee7eaAhYFHv2aiE8+/Qx9Q6C6zaHimQbULqhHxcQxYKrpHYijLXwcO7e+T/sOwq94Ed79AVoqK9FYNwu4rbucU8Ds0IETl9F5aDe8dHG6YWLmgnewqbkJBWkWdN1EkhI4LjsNM8uqMWVyCG8tq0MvgQumhv17d+KVmkqIJDtmvDvSwAkSzpztgt5/jS7AgS/vISxdvAgFqoH+wQQSJC/dtBHTTAxEB1EdysG8umUwHQGiyKH73El034hCEgUX0gVmPlh2EokEaYZu10nCp2YiN8NPzIdrm51ylZm0kZ+XQ5XhJVYcLCNBURnss2suMAPlqQRycnLAST5iL2Lg6t84cqILiqK4VTW0330pHgExS0BH+Ddw5iDxSCIQzEUwPeBqmW1KpcIwTUyuKEFGUQWRNoH4DWzZsBotbecBTwBqwA+VVBIIBHBT96L58734dddmyB4qEgqqbOpsFGb7U4WWujydNFg+Jg1za9/A9vUd8MsCbp7+BU1L5uHHqjo8HJpM8lNwrSeC8OED6DqyG2IyAds04C+chNr586EIBgao+pilgN32aWlYsbAG5/5Zg/aWdVAI3Oo9j8M71uLgtyxFMhwzDtExIXm8MCmnTnohXl+9GXMeGY1YQnNB2ZBKBZtoRhK5fhub3l2J5xu+gJM21pUZU5AMHZIdhUwVyEjFdRvBsiqs2rwLK16uJCfasHYrUo8WWH9gxt5xSkl+gMempkV4qmo2WltbcfqPdvRdv0K5NyD7VIwaW4KpM+fghacfx6QiFZqmuZ2NdUOGQY8g3ho0rmtmEgJVHqgNMh9szvMJ1EwvRPW05Yj0L8XN/tswTAsBqrTcjACy/JzrKBYniQ4ZA7VsB9GEFRGu8lMulEwY9VKoOCOdp5hd6THPtNligk2aSPcB+UEPCrO8yFZFyDz1YlIR6793WBJFnkeA2m/7XxFqYpcaRKejoTu0/KeFEo9vZpXnjWZ9+O7/4F0mI705IsKYdl7oje89emnNqS01X3F3QeS5O0JPTs9fR026jPrjvf43Eip95zhHiGt25Pj5Wx93ffniD+zIv+Y1Gb9W2rKPAAAAAElFTkSuQmCC";
		interactButton.setAttribute("alt", "Interact");
		interactButton.setAttribute("title", "Interact");
		interactButton.style.cssText = "float:left;";
		
		this.add = function()
		{
			mmInfoArea.appendChild(interactButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(interactButton);
		}
		
		this.enable = function()
		{
			button.enableButton(interactButton, "click", interact);
		}
		
		this.disable = function()
		{
			button.disableButton(interactButton, "click", interact);
		}
		
		this.focus = function()
		{
			interactButton.focus();
		}
		
		this.focusNoAudio = function()
		{
			button.noAudio();
			interactButton.focus();
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
					case "Quote_Link":
						linkInteraction(osmNode);
						break;
					case "Map_Area":
						linkInteraction(osmNode);
						break;
					case "Skip_Link":
						skipLinkInteraction(osmNode);
						break;
					case "Text_Box":
						textBoxInteraction(osmNode, "text");
						break;
					case "Search_Box":
						textBoxInteraction(osmNode, "search");
						break;
					case "Password_Box":
						textBoxInteraction(osmNode, "password");
						break;
					case "Telephone_Box":
						textBoxInteraction(osmNode, "telephone");
						break;
					case "Url_Box":
						textBoxInteraction(osmNode, "url");
						break;
					case "Email_Box":
						textBoxInteraction(osmNode, "e-mail");
						break;
					case "Number_Box":
						textBoxInteraction(osmNode, "number");
						break;
					case "Date_Time_Box":
						textBoxInteraction(osmNode, "date time");
						break;
					case "Date_Box":
						textBoxInteraction(osmNode, "date");
						break;
					case "Month_Box":
						textBoxInteraction(osmNode, "month");
						break;
					case "Week_Box":
						textBoxInteraction(osmNode, "week");
						break;
					case "Time_Box":
						textBoxInteraction(osmNode, "time");
						break;
					case "Range_Input":
						rangeInputInteraction(osmNode);
						break;
					case "Button":
						buttonInteraction(osmNode);
						break;
					case "Check_Button":
						checkButtonInteraction(osmNode);
						break;
					case "Single_Select":
						singleSelectInteraction(osmNode);
						break;
					case "Audio":
						audioInteraction(osmNode);
						break;
					case "Video":
						videoInteraction(osmNode);
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
		
		function textBoxInteraction(osmNode, enteredDataType)
		{
			controlPanel.drawTextBoxInteract(osmNode, enteredDataType);
			
			getAudio(enteredDataType + " entry area entered", false, onFocus);
			
			function onFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function rangeInputInteraction(osmNode)
		{
			controlPanel.drawRangeInputInteract(osmNode);
			
			getAudio("Range input entry area entered", false, onFocus);
			
			function onFocus()
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
				var originalIdValue = inputElement.getAttribute("originalId"); // should be _mm_originalId
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
			
			getAudio("check button entry area entered", false, onFocus);
			
			function onFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function singleSelectInteraction(osmNode)
		{
			controlPanel.drawSelectMenuInteract(osmNode);
			
			getAudio("single select drop-down menu entered", false, numberOfItems);
			
			function numberOfItems()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				getAudio((mmInteractionArea.children.length - 1)  + " selectable options, first option", false, changeFocus); // -1 takes into account the divider and the close button
			}
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function audioInteraction(osmNode)
		{
			controlPanel.drawMediaInteract(osmNode, "audio");
			
			getAudio("audio control area entered", false, onFocus);
			
			function onFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
		
		function videoInteraction(osmNode)
		{
			controlPanel.drawMediaInteract(osmNode, "video");
			
			getAudio("video control area entered", false, onFocus);
			
			function onFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
		}
	}
	
	function BackToStartButton()
	{
		// constructor 
		var button = new CP_ButtonModel();
		var backToStartButton = button.template();
		backToStartButton.id = "_mm_ReadAllButton";
		backToStartButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADL0lEQVQ4EaVVW0iUQRT+5r+s7uZmaWiZBV2MMDGFoogkU8vSIrAikwgkqNCwC2FET6H1YBY9SEFlSkUPBZkQgVAS0lbmS2RgkBn0UD54z3/vO9OZfy10V9utDsy/w5xzvvnOZc4yIQSkMHZ+dvaxdRUpCdpSwQRjvxSmNsJHYcroOB946RhqFq/2fzTxpH/CwZaMU3lJdwsy7KvnWlUTkzFg4s4IqJIUw7iPo+uz8bXZMVr15kphK0PqrYSa2pUd1UVJqyyxCuCnCDRC5YQXoD1toxKFDMn9zotBV/X9bzuVzF0LDhWk201Q7iI00g+MMNxzjAYZ00UiisW95Et2W9Lt1tys+HotNVFfFj/BVLEwGNyG8kstSFuyCAe2bwCcnqhIM4+bIuSwWRQkx6nLNS6YDBjQCdRrxeG6p3hy/Qw27anE0ZpBcK8nQiYEDB9DyeZs7M5JgnB6KecIaNJLUxnG3DrKLzzGo4bTiLME0NlyFR0PAhFASS04pcyKrBUPiVwKHXhNHxMYRFmhT4xFA1N1Kpyfcq3SyZ+LZ4vRoBA9g4B1jSpnhh7kYgL7uEBcrB9NZ3fAarXh9sVK5JdWISszHX5vkEHQPPiVjaJYrGh/1oae580A7UPFBDY7ykeMmRPXTuRhzLiMxQuTUX98PeAKBzarqcehuKcH7/3UDZZQWErv5CMuwXUnbp7MR1v3CMTQCBiFNylC01w+HugKAn7fZPcp+ynAUiPB58QGsG+tnRyFrHCYyKNIrzIMWKJwakDpPB2o1EcjVMrpJTT86a1mPp0ReGaX6DT/BSzk46B7hOz7EPlnYDluDb9OwDaCtMMd0iCawoT6t0WSLLnXQEXZNpQWb6TZw7AmbR7gMeeE5K5qAzT5XV4ylfM0rGOlTbjIVpPmZbnz5aAJGniIMg17H3XUiIsPKG/f9Te97nP2yyGt0IBX5G+UCx7KrUHTTy7qeVhVdH5xoavXqFFFX8vwkcYPPTTQtibatVk0NugVc7jooUS73GT7w8PR3j3mbnQMn+uoK2z4/Z+p723NKcmy1ybN1jLoGQeEzEyUQqbqqDvw3fHJVd97o6hZuv0E9D10Lhej4kwAAAAASUVORK5CYII="; 
		backToStartButton.setAttribute("alt", "Back to start");
		backToStartButton.setAttribute("title", "Back to start");
		backToStartButton.style.opacity = "1";
		backToStartButton.addEventListener("click", function(){backToStart();}, false);
		
		this.add = function()
		{
			mmInfoArea.appendChild(backToStartButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(backToStartButton);
		}
		
		this.focus = function()
		{
			backToStartButton.focus();
		}
		
		function backToStart() // click and it enables and focuses on stop 
		{
			svb.reset();
			restoreHighlighter();
			getAudio("Page start", true, function(){mmReadNextButton.focus();});
		}
	}
	
	function ReadOnButton()
	{
		// constructor
		var button = new CP_ButtonModel();
		var readOnButton = button.template();
		readOnButton.id = "_mm_ReadOnButton";
		readOnButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADYElEQVQ4EZ2Va0gUURTH/3NndnbXWdPUqMzeL/tQEBRRZkEQSVEfogjLoqQXFmjWl6LoBVlJH3oKEhQE1rfAL5UG9rA+FFhYiOFGSqWE2svddWd2Zm7n7s5qqQu5B87eu/fc87vnnjlzRuKcQ4hr4/2Va+an7tHcLBucW9HF//6RWHdf5EPDo66L/M3OduEmCfDqo3XFO/LSK5fM9GX4XBLs2Fn/j5WAnpCF+veBtqr67m0fb61/rUzbVbuxckt29eb8DBmGDYwSGj990jgV83M8s23Oa6QZN5fLGwr31u5bkZmlKRSpxcGJLTEKweui/CikjFR25jTSyXbEpmzR7G8lX6YykEfG67Ddo2SlypNVun50l8gNzdu6dNQ1fyEmnQKyOWKYHItzJ2LJHA/sfjO+PDgS3OdmmJCu5igUgEknu+NWiSJs/WbiYFk58KsDskuNm2Dp/ZiyaC1qrp1F3lwX7GBkwBafRDPJYdE9hwhZVEqLhgA81k94rV8D6lN0fH15FztKT+OVn66eQulKIMPBzkaJyWCyAukfdSHF50NH4x1sLzuLpnYQnLI6giQEj7A3tiRJSNE0+BtuoehQBZo/sxHhowcLvMSg+TR8qK/GtvJKtHQqBBcVMyjJgYW/A295eB2FpRVo8huxsnTYyYMFgJ6DSoE2v3yApy3fAYUNFGfyYMq1Ge6DlToVJy9UoXRtDqBHBl7c5MAEtcIBGN5sHDlzA6eKFoBZOiDeJ0eSAAtoELp7PMpO3sC5nQsp0iC1gzgyNo4STFAjiLArEweOX8XF3YsBIzAMKtAjVrdoLnooQJEZkA162o6IBmV5M7H/2BVc2r8MzBweaXyvACuUskEhqkvmyM3fBMX4QVU1WJ9h3cCKVQW4XJIPxSIoNaWhEmVJkJXekN0ZMfl0RFeoJVJPzpvhxZPqw5BlmZqe40x2MU1XDUh2gkhlCSHdxrffZhd70Ro89rwtxOGhV5MMjAAean0ZKTrS1BDS3f0xpflYT4jqlDoap33Us/9R0Xrp0/PMH/r09lnXbcV/c929NScejw2b1vmls7QxXups8SCHXjPRf3FZujnq3/W1Vz3vLeJNxZ3Rb55wSNtaW7BqnlbidbOJVI9DiicR0llnkHv7rJa6xu4K3lDYKlb/AE4TSHrXDJNkAAAAAElFTkSuQmCC"; 
		readOnButton.setAttribute("alt", "Read On");
		readOnButton.setAttribute("title", "Read On");
		button.enableButton(readOnButton, "click", readOnClick);
		
		this.add = function()
		{
			mmInfoArea.appendChild(readOnButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(readOnButton);
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
		
		this.focusNoAudio = function()
		{
			button.noAudio();
			readOnButton.focus();
		}
		
		function disableSelf()
		{
			button.disableButton(readOnButton, "click", readOnClick);
		}
		
		this.click = function()
		{
			readOnButton.click();
		}
		
		function readOnClick()
		{
			disableSelf();
			mmStopReadingButton.enable(); 
			mmStopReadingButton.focusNoAudio();
			readOn();
		}
	}
	
	function StopReadingButton()
	{
		// constructor
		var button = new CP_ButtonModel();
		var stopReadingButton = button.template();
		stopReadingButton.id = "_mm_StopReadingButton";
		stopReadingButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACZklEQVQ4Ee1VTWgTQRh9s7O7SUxStTYe1FgVW2lKEGKLgreKlepNPIgiPRQ8WD34d1P04kUEDz2UitiTqGDw4klRULAq4s1gKuqpVGxTk2pJzWYzn98kJbYlblPP/WB2YL5v3rx5O/NGEBF0CNFhbT15tbe50d5EJER5sN6PAWRyTjY1+PUu0ZnJMp4GDh991HahOzLc1R5KNPikNbdWvbBMCsgXid5+yadvv8qe/jDQ81ygdajp2qX4i3MHmmL+AC9d0jtYHmGA5xg8h7tbz6amL94f7zZ39URP7Y8FY36/ATWrYFhc4PctA5zRZn9DOZW5B+Ph1U9S4RvmhrV2y5qALDM1fAZGPs7g4cv38MkS8/ZmTkzRIRPHu9qQ2BZgDCDoE4g0yFYTUKWqprbE6PgMbl45CziTENLy1JlcBwhFsXdnEokdIQYuQWklAZeB5wUP2qaA5ZewhAFDsuYeoXRe18qKvvNLFwLPZQT/ZsHAunmFzv/rZHrP9EJdIrcCXBVoRYqqFDXPMZECqRKfUb7qHlGu4dpasRCYL1DBJRQdA0W+lIKWANYXl2sd7YiLbIUzhqzaeqGEeDSEy9cH2IRUfSakJFoiNqioTavintyZ5vgP91Muz7bEHqFts3N7EJ3xBOcWUai13/KYts0C2yZBsOXOFAgTv9So/Da2JxWNNx7avWXVeksbvXYnl3VzebF6G3MQlj65Ag/e5KaHnk6cMGmsf6rhWPKI6+LOvvZgx/8+TbMuqdef8+nhkUz/dPLwO/H3MRWyue9x7+Z19kaDVL06VARist9/utn0YPoe0fmMHvwD0ijwOFrUKeQAAAAASUVORK5CYII="; 
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
		
		this.focusNoAudio = function()
		{
			button.noAudio();
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
			mmReadOnButton.focusNoAudio();
		}
	}
	
	function ChangeLocationButtonModel()
	{
		// constructor
		var button = new CP_ButtonModel();
		var changeLocationButton = button.template();
		changeLocationButton.id = "_mm_ChangeLocationButton";
		changeLocationButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEgklEQVQ4EZ2VW0wcVRjH/3PZ2V2We1kugoBQRChQtCTYVYgt2sSk1wcCiCZtkOhDk6ZaWxuVaG2jxhcUtS0xodA+kDSRB3kQi42lNgKiaaGlcrWlLG2hUC677O5c/WZwt0ChUU8yM2fOfOf33c8wmqZBH0xcjT2nOLVsTRAXbiz8h5uqQRubkUYHTm6rJ55q8HTwM/t+KNq5IbwmO8GaLpgY9h9d/wrNkBRDN5dPkToG3b81/DqxZ6J+Vz8f80rTxre3xTWVPhsVoguopH6lwegfafg9XC7Dc4wpJ8Hm4DicZXKOv8BtKa08W5IflRpsZuGTNSjkiP/SLRd4DiZBgMYKYDgTTBxDylWIJCsvkpUUDcEWFhzDxAzK/DRvt5nSgwSGYA8s1WdWEwuFs6Dzhhudl69h7PYYOJZDUnIiHLlpyIw1Qxa98BFwwRcYynR4bCifxhNEXh7TYAuPofs8vjzdjPNNdZi+1Q1N8hres5ZQxKTlY2f5G3hzVz4iBC/mRTUAN8zTVIVfHCt9MYSgfzg1HProE1xvOWFsMIVEIyxpPRRFxuztftztOYcTVZfwZ98H+PRAOWKtXngkAxnALQHr7g9P8zh85DMDyplMyHqpEqVlpchOfQwSBb+9ewiNDbUY7WjCz6feQxXFv/qdEgicOwDVJwEwy1JSOCuqG5pxreUkON6EzbuP4ehbryEp1AefKFFZMdiYmoWCvGq8WxWNXpL76cwx1OVkYt/2TIg+XwDO+mdBZg4XeqfQ0vgVGE1BxosVOLL/VcRb3bjv8sFDcZz3qZiem8eGeAUfvn8Q9qwiqO4pNNYdR9+4BjN57B/GTLdEhAXfNZ+Dy3kVFnsKKl+vQDJZSoUfSIx/04xbgiNFQPHuvWDNNoxeaUVz22WjLP0VYoAFnsHQuIiuiy0GZJ1jKzbnxsPtkfysh56Sz4sdm55GbEYBVGkebedbMeXlqSQX0AaYpya4MuDEvRvdYHgBjucLEWGRqQGWZnoxXaTuyI43I++5TcbycG8nRsbdCLUupI3XO1VjeAwM/gVxbhy26BTkPPUEtd/q1rK0ySUq6OieQJg9EWaLFd7Jm2jtGkZCbCRUsNCLAaLCwjnmJA0qQiLjEG8Pg6z39apDg4USNTTuw8W2CxQKD5SZu6irrUH3yDzCbWZQdKn1yOU796ZpxkO1RMFGbalp8qpYPUJ0ZKCiIBIZcXvxsaBhZOg6Dh86iLz0aHz+/U3wejtrpLF4x8soKnSQWzbYOJGUPSidlTTocJdXhmOtFV8cPYDRKRFb1tnQMzILiZzlSYBnGQ3lhY+DYZMpGipcHnHJobQS2L82R/DkCBZro8xURSJ5CrAMy/GT83K/R9TyPT6ZWnb1hPlBy596KPUKESlyQXT0urwq7szKA2z71Zn9l/rn5shsWAUWZor6/7n80PZBd8/vPzprmYVfUzP9mtZ8vT4x6Ek6yGltuV2Pftc71y0av6au+l8m90yc3t5ngPVtTMy3MbklcWURwULEozEPf9VNcU5Lt/q+2XqKDFV0ib8BqeLqeWsyquIAAAAASUVORK5CYII="; 
		changeLocationButton.setAttribute("alt", "Change location menu");
		changeLocationButton.setAttribute("title", "Change location menu"); 
		changeLocationButton.addEventListener("click", openChangeLocationMenu, false);
		changeLocationButton.style.opacity = "1";
		
		this.add = function()
		{
			mmInfoArea.appendChild(changeLocationButton);
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(changeLocationButton);
		}
		
		this.focus = function()
		{
			changeLocationButton.focus();
		}
		
		function openChangeLocationMenu()
		{		
			getAudio("Change location menu drop-down entered 3 options available", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
			
			drawChangeLocationSubMenu();
		}
		
		function drawChangeLocationSubMenu() // node ref needed so enter can set the values in the model and in the live site
		{
			mmInteractArea.clear();
			
			var mmBackButton = new BackButtonModel();
			mmInteractArea.addButtonToThisMenu(mmBackButton);
			
			var mmNewUrlButton = new NewUrlButtonModel();
			mmInteractArea.addButtonToThisMenu(mmNewUrlButton);
			
			var mmCloseMenuButton = new CloseMenuButtonModel("Change location", "_mm_ChangeLocationButton");
			mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
			
			mmInteractArea.show();
		}
	}
	
	function BackButtonModel() // sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var backButton = iap_Button.template();
		backButton.id = "_mm_BackButton";
		backButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADQUlEQVQ4EZWVW0iUURDH/+e77LfrulaLq5llZgVdoItdIIkiTIOgKLq8SSQEQVAEQVEI9RJGFCEY9dKLFdSjEUEWgXiBHnoQESxLrDSzB8XU9bueZlZddL9d08Oe71vmzPxmzpwz8wkpJXjknm8q31cgrmTrKJICbkK40IeEOmrJnqZBpXbiUXk7mwkGl19vqjpZIuvK8uTSgAJMuVoolSCkGncFmgcx9KJPnGu/XdEoCi+8La/ZJl9XrZPGhAN4i6VO+1eJHlCBJ91i+EaLsl/blYvru2PSiBPU9hYeZaqmSwEpBN8Zw7KyYnFJi+jID5InXkgdvMWwLiAE/8s0JOK2BP3g0MzSJCKGV6CRVTpmwjvv4t2AJKdeIo/p0C6d9K4YkB+aWk3cBTLR0imzjHM2oYRR0/AUPz+9QiAY9qm6tgl9+SY8r7mKorAJc1YqfWDOiEE3Q6cppIqANQwxMgARMnxgYZnQcqLQKLmpmZwD5sVsknSNBeE6FkqilAJFhUIyRQv4wNJzoai6T84CimtqMJQOEn1WGFcaO9D8W8FXeykZzvE9o/7fd9KKC6N7zMDlZ2/wsbEOve1bUa9nwfzTA93I+i8oVSEJ1jUNDZ2jaHn1GCF7DENdrYm6DhkqNCMbkm7GYkYyFZbj4OKOJThRXQM3Uoi1e09hc0U1clZshGtPLoaZ0E1GzFUXVeO4f2w77OAdHNxQiMr1uTh+6y6Gf3QikObw5vOWBHNtcSOJELz2wApM2haCzig8x57PPuNaEswaU3AgFrCoIIB+csRgyhJUK+6DOKZDaTJ9chbMAbOA4TPNSLoO1OhqRNaU0s2YrllWmh4e7UqNrYPr+Q+WeoVU0/UYh3QjGEf9mcOQ6lFq0qm1RXQy9AhaHDIxSZ8G7m4cGD1UbcQUPyZsbM6jip3djRijk2ZplHOcOc8MMgnKnY1bwZgjMDwp+pS2797N1iHxlwuE26dGb+4TPPk/Rz7f5LTxjrPIloNp+4NfH/qVe4lP055rb4+cXoOHu3OxMkRZT7drssk4hJAYtwUowG/PP8uzHQ8qmxNgthBn3m85uFKejwSxitD+08iIpQVPKCMWej98cevky0M9rPoPklM6C19DN6sAAAAASUVORK5CYII=";
		backButton.setAttribute("alt", "Previous u r l");
		backButton.setAttribute("title", "Previous u r l"); 
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
		newUrlButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADUUlEQVQ4EZVVXUgUURT+7sydnd3adLVWLRExK8ukpOiHKKgghR6C/ogiKHoMxHrJeijoDyKSfkgCXyyil6CgSAjyRSPEogetQEHWIvqzHkpdp52/27ljWzO7a7EXZvbOPd/57rnn3PMtE0JADsY6i9YcDTWVFGKBABOYWvZs/3sxJpQxA6PdL62b4snWVx6fJJ5/4PGy3Zu12+sWY1k0wvB7r//x/bEzBpiWwEACHzpf2M09FxvvMZTfn33ibEHPgQZWG9YB2yY8AfMadDpFAbgK3H/mpq7eFdv4ih0zD62sQW2ESCdTedEFwQ7guMDqGkVfVee08niRUjWTjm+TQaaV084hjSZimrBpWaYvZcnfILdLxDr5FkeVak5sTrpQkvR7Enj3VYOq0keOQYWl0lpYONeGxrPrITejmGzu9w1pDIkvKpoOX4H9PQGVh/xmb26lJlG+vAEd13ehOGR4J80C0UKAWAIUhcH8NgTj8xtwLcuMVMqGU70UTOEU8RSlRWnMTFy2J2FVTQenRKtaeMrT9+bOOBRVwwxdYOQzQzjMUVZowTB9IJrmTmQQE/ySV4tSlHRj6B1UcK79LcbNCCJasKdyRhxkCn5xPYxvw304uP8sLGMM71/3gVvHcap5FWKRv/c1b2KV6xj7MIjRkTegfvDy/KDtPCqqO3BsXwGtyA7LUTxv9R8v1zYRLalCPL4IwprAl+F+bNrbhD1bYrDIlh55R2yZBioXb8C1Gy3oef4R3U+HcKGlHmXRyUAB8yaWEbmOhfKCH1i3BNhYX4dSIk1SelXfnctJLB0dyyIp9SF/n9GhFArXBskkaioENYjpaUwmMkAsjY5D1yYyD2psAoqW3XlcT8LRioncpZxSqXI0h4yBU8uo6cCkplbGbVxqa4FKHTjdUOh/IKJMemqWiZFcJPwqH0uKrylTeERSsebQjWlcIeEZ0uVjkBaDcpqpbpJUnmA8yUaV3pdOx8CI+Cj9pFx6TrSR8Y/nJ9kkiRT39CPFMEoK8Oqt/CdxTzOprWuOdDVuX89ura9lpWFKa2YkvmBzTr1ISYsHEsJ4+Nw9+ejUllaPWKILd3at3VzPzhTPcusI6LjB1s9JmF4kvDph4FN/QlwebG+4I9d/AbcNTtvfNJoMAAAAAElFTkSuQmCC";
		newUrlButton.setAttribute("alt", "Enter new url");
		newUrlButton.setAttribute("title", "Enter new url"); 
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
			urlEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg=="; 
			urlEnterButton.setAttribute("title", "Go");
			urlEnterButton.addEventListener("click", functionToRun, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.insertBefore(urlEnterButton, mmInteractionArea.lastChild);
			}
		}
	}
	
	function OptionsButtonModel()
	{
		// constructor
		var button = new CP_ButtonModel();
		var optionsButton = button.template();
		optionsButton.id = "_mm_OptionsButton";
		optionsButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADe0lEQVQ4Ee1VWWgUWRQ9r6q6ek1nMyZ2xmWSMSIuEdSgos64IogwbgwMIoqCfinEDxUFQYyCgqJ++eH6o8yHYDA4LiDGiAsaUYM4YxonJgaMbdLd6XRVd1W98r7qTuISjI5+euHVvfXue+fet9zzmG3bEPLT+trFM8pydub65HLYMJ3OL/0wKPGkFb7VnKhpO7HkopjGBPDcbZdXL51acLSqLBB0ySDcrxNGww0LuBdOxC80dm26tnfhaTb8zwuzt/xe8vcf0wq9yTQH518AyxgEmDMyu2JJYvCpEv66+1Y/cP7VImViha960ki/Vzc4TOvzoC6ZwU1LkmQFnIAdcG4hbZhImzY0wqgc4fdUVuRUK36XNMTtYhCJUlBHD7QRqiIhoqt49DSC1vbXSGoa3KqKkuIiTCgvwYhcC5ZlwkNYlPkQhVZiiTWlKJqsuBBwC9vpcvBFsKBPxe3/TGzeugvhxitAopN8KWoK4MlDcUUVduzYjhXTQ7C7TQFnSWK2yKa1M43dZx+j4XkPOnQPui0f4qYP7T1uXGpKYt/hEwjXnyLQdpqhUxPbZpD5Bq8f1+Fh079gMmWVFQpJQll5vAHUnjmEcwdbMKxsPALBfNicI9YVwZuXz2DFXmanDKxUha5T5jidARlgYdJJuyQOK9qCtsYWx/ktH2cregEY++C3t/t/6e+H9FH4H8B9G9J/K/q6BjF8xfDnD4Xq8cNM60jEIrDjbcQxghDp3malD1iUdDql9fZ/ouXAUCzfuBtzZ05GqCiPSlciRuPo6EzgakMjXOTnpqjGjDjAgtGCVDQjx01HU+s/VJDxXn9Gu4swf9V27K9eCQ+PEelYxCncyc9VGsRv4xagLdIDPU1Zi4IkUUgrJgGHPAaO1WzGjZVL0Rx+gWgsCkmSUFhQgLFjyvHrhGHgyQhixLvvi2BFxkyU5skOgVGdiYCyEtOscELnM+xchlCOhTXzRsGa9wsNyuyXzGxItgEtRdRIoP272A8vKNkgyhUs2a1zROk1keqfdu6509zd4YQhKtNTBh2KBm4knWaQLZYoMlGJjwUnD9S8RPJCBFb9k2iN8zRVbqqbtWxy4fEpP/tGiwHZR6E/pUEsEVSj1+f+i+Tz8w/ernt0ZPFNB1jMY1Unh8+cE9qQ71VKOfHaIFgfuCUwqUszXzVcbz9m31vbKpzvAAWRarIdJVEmAAAAAElFTkSuQmCC"; 
		optionsButton.setAttribute("alt", "Options menu");
		optionsButton.setAttribute("title", "Options menu"); 
		optionsButton.addEventListener("click", openOptionsMenu, false);
		optionsButton.style.opacity = "1";
		
		this.add = function()
		{
			mmInfoArea.appendChild(optionsButton);
		}
		
		this.focus = function()
		{
			optionsButton.focus();
		}
		
		this.enabled = function() // for hotkeys
		{
			return button.isEnabled(optionsButton);
		}
		
		function openOptionsMenu()
		{		
			getAudio("Options menu drop-down entered 3 options available", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
			
			drawOptionsSubMenu();
		}
		
		function drawOptionsSubMenu() // node ref needed so enter can set the values in the model and in the live site
		{
			mmInteractArea.clear();
			
			var mmSpeakSlowButton = new SpeakSlowButtonModel();
			mmInteractArea.addButtonToThisMenu(mmSpeakSlowButton);
			
			var mmSpeakNormalButton = new SpeakNormalButtonModel();
			mmInteractArea.addButtonToThisMenu(mmSpeakNormalButton);
			
			var mmSpeakFastButton = new SpeakFastButtonModel();
			mmInteractArea.addButtonToThisMenu(mmSpeakFastButton);
			
			var mmCloseMenuButton = new CloseMenuButtonModel("Options", "_mm_OptionsButton");
			mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);

			mmInteractArea.show();
		}
	}
	
	function SpeakSlowButtonModel()
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var speakSlowButton = iap_Button.template();
		speakSlowButton.id = "_mm_SpeakSlowButton";
		speakSlowButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADcElEQVQ4EaWVaWgTURDH/2/fJpttYs+09cCkXqVaY8GaVupRFbEVEfHCeoAK6hdBvKp4YOkHFUHED35URFErglqLfhEqCooHKHhgkXoXCm3UlqLJ7iabOC9pU2IiJjhkN/uO+c3szLxZFolEIISxgwU1u2btLspTy8Q4gsEFMfiHMAbu18zexx2+iwPX1z8S25kAuze1lK+bV9oyp7zYk2O3EjJm7B+8+DIjshEy8epT/7e2p1/3tR+rOy+zgh3Z+09uvLylrtSjKjKCoXBcIZMHLgFT3XlOVeHnpmy7GZDLVs1b6y11VthtMn5poUxYCXvJYYTMCLyTnKyqrPC0NCpPdWWRp2Lyf0VE0GqRkOuwFstgIFupRab3s3BGiQQ046/bEpQFXFxywuzgwGbl4BYFvp9hdHUPwAzqmDzGAYmSJIykIwlg0oNdtaGjW0NLayse3G3Dl3fP4V20HhdONlIQtbQrJg4W0CxVxdX7nTje1Iiel3eGHTMGwCQ5bW+FYhxsVxVcau/Evq0rYfg6hqH0JEmc7ukGIaZK1UeZlCV88IVwvPlAEjS2LfN71GOLouD2vafoft72V4IIFVWQ+CVJqoMqy+Stbkp48ewxKaQ+daJCFJUqgjsQ/oMSCZsw9EBSZyEsYBLvxw9fkidDE13v32Dv0YswjUBCqEXUmdWO7evq4S5UEw6ZHCaooBcUFg9xkv47H16DuFJJzsS52LF5JXVHYWY4wVKIyIpkwltVQwsi+5lJVW09RufbkppXtCoMw8CS+V64Zq7KiMpzS9DQ0AAbM5JiL1GauWiVJfkch5uPQR0zPT24nI2th86grtIFv2bEdaLFQzfpe5/RowVNaLqOpdVjcfrsNbiqV8c3pnrIGjsDO09dx/7N9QgFA+RtbJcoSZMGA36jn/f0VX6aXDFyRcX4gvwIxdszLh8LFy9D9oRZMCy5MCWVTtAIOIrGwT2tFvUbdqOpqRlrF5YjEtQguq1oTlxicKgyHr3txY2HX/ZEP02e7bdq1swuuVLrGekWixaZw2JV0E/V1dvvxy+/Rn3WAmeeHU4HBzN1BPRQvAainpKF15/7Aq1Puprbjiw4EQWLF2F156YurnY1OXNs04Z6tJVzKNRChSGTil2nz4QeJKBozdG0x0JAFrimm74XH/vOvD+7/KqY/Q0/dz9p8tGaIgAAAABJRU5ErkJggg==";
		speakSlowButton.setAttribute("alt", "Speak at slow speed");
		speakSlowButton.setAttribute("title", "Speak at slow speed");
		speakSlowButton.setAttribute("value", "Slow");
		speakSlowButton.addEventListener("click", speakSlow, false);
		
		this.asHtml = function()
		{
			return speakSlowButton;
		}
		
		this.enable = function()
		{
			iap_Button.enableButton(speakSlowButton, "click", speakSlow);
		}
		
		this.disable = function()
		{
			iap_Button.disableButton(speakSlowButton, "click", speakSlow);
		}
		
		function speakSlow()
		{
			setSpeakingRate("Slow");
			getAudio("Speak at slow speed selected, options menu closed", true, closeOptionsMenu);
		}
		
		function closeOptionsMenu()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
			mmOptionsButton.focus();
		}
	}
	
	function SpeakNormalButtonModel()
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var speakNormalButton = iap_Button.template();
		speakNormalButton.id = "_mm_SpeakNormalButton";
		speakNormalButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEB0lEQVQ4EZ1Va2xURRT+7vtud0tr6QNWg30XiZHSkvDoQkhNlVaNAYKpKSbUH0YNMS3+4IeGEG35QSEBH0GNIWm0oTEg5SEkRGtaAlooKa1BE5sopa1ppS1d2O3de+/eu57Z7V3ZbG02nt3ZmTkz8805Z75zlotEImAiv9he+VzlE/syPGJJBJwVVab4wyEiBELhsb5f7x2dOFn/AzvGMeB1Td89v6NqxYmNq3K9LkXE/F0pwhIIBximjf7hqdlvfx5p+vHg1nZRrT1eduB131e7ni3OsWwblhXzIGXU+Y08z6HYW5BJ3RcFDd9MiBvKC/dUFC3NYZazW/+vWDYZRN+1pdlyxVM5+/mMNHF5miIsainzQRZ5SNQW88cm42RJQHqanMezh1oopixuDMytSsh0y7hwfRxj9y24yYiF9jueMs/pY/GOwukJLwomqR6M+oHuob8x8Icf/QO3sPfAMUwGBahy0jHneLwX4yMaiBR5WXWh9/YkOjpP4UbvJUze+Q0N77QiO2sJ+k7uR7Ms4JPWvfBIEYQXeeg4sEBG2IILRzp68OnBdxEavxW/U+QM8JIanQ/0dMEfakKuR8Kcbv4neAyY/FfI0ravr+BI8ytEyuk4KBtwHN06H1iXewn8poKxBxYUQUKGYiFkJOdTFNgli7g+fB8ftzQngSbcQJPZ0UG89dp26PocVpStRVvLeyjLk/BQMxO2srACgoIzF85DGx9IWHQmHFHEDMc4HnowhZH+c9GliV++R+PUPRxta0X5k+lgCeaIKAoCgkYEQzd/cnRJvRXhsKaiEo0fniIKMktYY9GxMRcM4urgCEqXr4SLOOyISFSFHo5AC8w6uqT+WvdF+GemwTOWPZIhNmWbZ6kXDTWrCJQDSxBHRNOy4SJeZmYvc3RJ/e9XOsHaQlLsqwf/5k66T0tY5lnRcUs21lVVJyykOtlY/QKyXED4kfiyszwLd9g0sL1uM5aVv5QqXnRfRpEP9dvqKIH1hBCxRSIFJximhdI8Ge+3HIbqXZ0SuPBYEfa1fIQ1BenQ9HD8DOGx+izysw/1u8FQGLphYIevEMdOnEZ+1au0MZ6U8UPOwFvxMg592YXdtc9A00KOmh6XIxwL/qA5ymHL8fwP3thwtbGmxMs4rcgS7szY6Lp8DT3dl3F3eAi6FoSsqHi86Gn4ttRg29ZN5KGCOQJ1mMBAWTXs7PlTO9wxWBv9a1r99tlNOzfnt69fmVvgVkXIVDgkWUbA5DETMBGimqBQdmZRfUhXANPQoVP4HGEJxCy9OTw9cbZvZE/vobrTUWC2gVv/eUl1dX4z1d5CqtE2o6xIyaBQNRM4gSyL1YQwcf7f/IpBU/kXApo51j3012fGud03mPYfhruHeeE6UXgAAAAASUVORK5CYII=";
		speakNormalButton.setAttribute("alt", "Speak at normal speed");
		speakNormalButton.setAttribute("title", "Speak at normal speed"); 
		speakNormalButton.addEventListener("click", speakNormal, false);
		
		this.asHtml = function()
		{
			return speakNormalButton;
		}
		
		this.enable = function()
		{
			iap_Button.enableButton(speakNormalButton, "click", speakNormal);
		}
		
		this.disable = function()
		{
			iap_Button.disableButton(speakNormalButton, "click", speakNormal);
		}
		
		function speakNormal()
		{
			setSpeakingRate("Normal");
			getAudio("Speak at normal speed selected, options menu closed", true, closeOptionsMenu);
		}
		
		function closeOptionsMenu()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
			mmOptionsButton.focus();
		}
	}
	
	function SpeakFastButtonModel()
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var speakFastButton = iap_Button.template();
		speakFastButton.id = "_mm_SpeakFastButton";
		speakFastButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEmUlEQVQ4EY1VfUxVZRj/nc97zwVDFEVdMBWMi0tZZn6AGqK4Nc3IYi4bs+Vf8Qd9sLayqX+kjARdzH+olm7mx8wUjL4mmRjuok7ZFJ0NdAoRQggpX/eec89Hz3Pg4mXi6tnOe97zPs/7e76fIziOA6an8g9lZs+b/tFEn5JKJ5Z7+IRFoPPhW8MCogC5b8hqDdzs3NN15I1aPhUYOOuDn155dVnyl5npU6dqqgQ7+tbw3TGrR5FgWjYsiwRJCwFDD9u43Nzz8GTgTtFvpS8dFGLWfzV/R8GSuoJVKfGGScKEyhaNR4IgwDBN1Fy6h/VLZ8EnW9DpDsuLxNM8Eo7V39XLjl5bJ2bOSy5akDo53iTtYRKyCZjBx3uYJ6sajp+owsflBxF0vBAJlGXD5EHQsPB86mTPc/6EreIETZnGmpj5JGKOKotQ6BElFbLRg+/KC1FSeRKCrII9YWLFHkUEYSaKju1YI/lzmZGFXeNYxmoqJsaoqL7Qjr8emPB5AEnRSMzE1Ytn4ZAizovEgSZiLMqbxZ6MIVYe41UgeXy402Pjl8YOXLn9AI2NjXhvRwW6Bsh6sopJ1WJxrx+422tDtxV4yKOI33IElQ9kSYDi0XDmagcOH/0WV+p/RndbMzYX70ZcrBcXjmxHcVw8QtbwtRv1J7Dh5WvQ9RCWrtqA8m2FZL3BFmMUmI0wRQ2lB37FF6XFMLpuRHRCEcIQlTj3+3rgByT6s9x9X+dt8MP04x916BsYwtZ330aMpgwDc3RUrw9lBLrvw42k4aErHFkEgbSOJEKWJCzMzsOctLmI9cqIU02EqBoc24ROkW1s6aJr1DF8WfPICNzsRmXJ+4+BRsAj779bLuHcN9thWxaS/YtQtusT+BMF9AcdSIKNju4+fHa8CTKXiiN6cPL7Guidj9yPAPGbE8o1zhTqv4/mQLW7v3WxBvltbajY/SkyZk4gZbZbzywvc3326w6uNza4wuMtliNiyQuLsKWkyq1nt49J0HFsDA0OINDUhmem++EdqRbGkCUKH7dycHBsXKMVnDt9Cl332iFyrUbqiQRs20ZcYhLezJ1LNU/fUQ0hh2mOaaqI+CkzorHG7FvOHwM/45F/ZQHEdyjhCI5hi2HTQqwKLF6WM4bxfz+yctYh3ks5p/hGEwWCDsM6Xl+7Eonz10bz/nM/yZ+DjXlrYJmhx2RpqgiSQVanTVOxbdceeGdkPCY03oEyJR1bd36O+Ukxbh1HZLgiqIwksXdAbx0IUXEbBl5bnoKK/ScwK2sTcUebMnJn5C0iaXE+9n5dhU2r0zEYfGQtD6Ih3ULfoNEmYPX+2Tu3LDi/eXXqdHeiUXpbex2cqm3A72dPo62lCXpwiDpTw9Opz2JFdi7y1mRidoJMoPro34ZBedYcrrvTX3b4Sq77a8ooPLU8f8WsA4vTElJ81IU8d1XVg8GwgH8GyJuwSeUk0/iUKdE01A3d/RVFXGH3ua0v37rfXh1oLWzYu67GBWYBYeG+lBdz5xRN8qkzKb82h0qhIueZLJElPLQNctOg7EeVsotNslJ/yPzzzKWOSqf2rSY+/BcA2eThBFXcgAAAAABJRU5ErkJggg==";
		speakFastButton.setAttribute("alt", "Speak at fast speed");
		speakFastButton.setAttribute("title", "Speak at fast speed"); 
		speakFastButton.addEventListener("click", speakFast, false);
		
		this.asHtml = function()
		{
			return speakFastButton;
		}
		
		this.enable = function()
		{
			iap_Button.enableButton(speakFastButton, "click", speakFast);
		}
		
		this.disable = function()
		{
			iap_Button.disableButton(speakFastButton, "click", speakFast);
		}
		
		function speakFast()
		{
			setSpeakingRate("Fast");
			getAudio("Speak at fast speed selected, options menu closed", true, closeOptionsMenu);
		}
		
		function closeOptionsMenu()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
			mmOptionsButton.focus();
		}
	}
	
	function CurrentItemDisplayModel()
	{
		// constructor
		
		var displayBox = new CP_DisplayBoxModel();
		var currentItemDisplayArea = displayBox.template();
		currentItemDisplayArea.id = "_mm_CurrentItemDisplayArea";
		currentItemDisplayArea.setAttribute("title", "Current item display area");
		
		this.add = function()
		{
			mmInfoArea.appendChild(currentItemDisplayArea);
		}
		
		this.setValue = function(currentItemName)
		{
			currentItemDisplayArea.value = currentItemName;
		}
	}
	
	// Utilities 
	
	function fireChangeEvt(onThisElement)
	{
		var changeEvt = document.createEvent("HTMLEvents");
		changeEvt.initEvent("change", false, true); // bubbles - false, default action preventable
		onThisElement.dispatchEvent(changeEvt);
	}
	
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
			controlPanel.changeDisplayedCurrentItem(osmNodeToHighlight.className.replace("_mm_", "") + " (offscreen)");
		}
		else
		{
			controlPanel.changeDisplayedCurrentItem(osmNodeToHighlight.className.replace("_mm_", ""));
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
	
	function readCurrentNode(callbackFunction, nodeDescription)
	{
		var osmNodeToRead = document.getElementById("_mm_Replacement" + svb.getCurrentOSMNode());
		if (osmNodeToRead != null)
		{
			var textToRead = getTextToRead(osmNodeToRead);
			if (nodeDescription != null)
			{
				textToRead = nodeDescription + " " + textToRead;
			}
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
	 
	this.getOSMFromMMId = function(mmId)
	{		
		var element = null;
		var allDivElements = document.getElementsByTagName("div");
		
		for (var i in allDivElements)
		{
			if (allDivElements[i].tagName != null)
			{
				var originalId = allDivElements[i].getAttribute("originalid");
				if (parseInt(originalId) == parseInt(mmId))
				{
					element = allDivElements[i];
					break;
				}
			}
		}
		return element;
	}
	
	this.update = function(bodyDOMCode)
	{
		var tempOSMHolder = document.createElement("div");
		tempOSMHolder.innerHTML = bodyDOMCode;
		messAbout(tempOSMHolder);
		var osmArea = document.getElementById("_mm_OSMArea");
		osmArea.innerHTML = tempOSMHolder.innerHTML;
		tempOSMHolder = null;
		controlPanel.updateNavigatableItems();
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
					if (typeValue == "text") // 
					{
						elementSwitch = "_mm_Text_Box";
					}
					if (typeValue == "search") // 
					{
						elementSwitch = "_mm_Search_Box";
					}
					if (typeValue == "password") // 
					{
						elementSwitch = "_mm_Password_Box";
					}
					if ((typeValue == "button")||(typeValue == "image")||(typeValue == "submit")||(typeValue == "reset"))
					{
						elementSwitch = "_mm_Button"; 
					}
					if ((typeValue == "checkbox")||(typeValue == "radio"))
					{
						elementSwitch = "_mm_Check_Button";
					}
					if (typeValue == "telephone")
					{
						elementSwitch = "_mm_Telephone_Box";
					}
					if (typeValue == "url")
					{
						elementSwitch = "_mm_Url_Box";
					}
					if (typeValue == "e-mail")
					{
						elementSwitch = "_mm_Email_Box";
					}
					if (typeValue == "number")
					{
						elementSwitch = "_mm_Number_Box";
					}
					if (typeValue == "datetime")
					{
						elementSwitch = "_mm_Date_Time_Box";
					}
					if (typeValue == "date")
					{
						elementSwitch = "_mm_Date_Box";
					}
					if (typeValue == "month")
					{
						elementSwitch = "_mm_Month_Box";
					}
					if (typeValue == "week")
					{
						elementSwitch = "_mm_Week_Box";
					}
					if (typeValue == "time")
					{
						elementSwitch = "_mm_Time_Box";
					}
					if (typeValue == "range")
					{
						elementSwitch = "_mm_Range_Input";
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
					if (liveElement.hasAttribute("_mm_selectedindex") == false)
					{
						liveElement.setAttribute("_mm_selectedindex", liveElement.selectedIndex); // need to preserve values which are not writted into the dom - as UponDomChange takes the text from the dom, rather than virtually held values (i.e. selectedIndex)
					}
					elementSwitch = "_mm_Single_Select";
				}
				break;
			case "OPTION":
				elementSwitch = "_mm_Option";
				break;
				// semantic
			case "FORM":
				elementSwitch = "_mm_Form";
				break;
			case "P":
				elementSwitch = "_mm_Paragraph";
				break; 
			case "SPAN":
				if ((liveElement.getAttribute("parentElement") == "BODY")||(liveElement.getAttribute("parentElement") == "DIV")||(liveElement.getAttribute("parentElement") == "UNSUPPORTED")) // parentElement introduced in DOMText at top of page, with UNSUPPORTED it is introduced in the model
				{
					elementSwitch = "_mm_Sentence";
				}
				else
				{
					elementSwitch = "_mm_Static_Text";
				}
				break;
			case "IMG":
				if (liveElement.getAttribute("role") == "presentation")
				{
					elementSwitch = "_mm_Decorative_Image";
				}
				else
				{
					elementSwitch = "_mm_Semantic_Image";
				}
				break; 
			case "HEADER":
				elementSwitch = "_mm_Page_Header_Area";
				break;
			case "NAV":
				elementSwitch = "_mm_Site_Navigation_Area";
				break;
			case "MENU":
				var menuType = liveElement.getAttribute("type"); 
				if (menuType != null)
				{
					if (menuType.toLowerCase() == "list")
					{
						elementSwitch = "_mm_Menu";
					}
				}
				break;
			case "ARTICLE":
				elementSwitch = "_mm_Section";
				break;
			case "SECTION":
				if (liveElement.getAttribute("role") == "main")
				{
					elementSwitch = "_mm_Main_Content_Area";
				}
				else
				{
					elementSwitch = "_mm_Section";
				}
				break;
			case "FOOTER":
				elementSwitch = "_mm_Page_Footer_Area";
				break;
			case "ADDRESS":
				elementSwitch = "_mm_Page_Contact_Details"; 
				break;
			case "DIV":
				if (liveElement.getAttribute("was") == "th") // solution to table issue - contents of a table element cannot be changed to divs via the dom, as the whole contents changes i.e. tbody into div creates a new div below tbody rather than changing tbody
				{
					if (liveElement.getAttribute("role") == "presentation")
					{
						elementSwitch = "_mm_Layout_Header_Cell"; 
					}
					else
					{
						elementSwitch = "_mm_Header_Cell";
					}
				}
				else if (liveElement.getAttribute("was") == "td")
				{
					if (liveElement.getAttribute("role") == "presentation")
					{
						elementSwitch = "_mm_Layout_Data_Cell"; 
					}
					else
					{
						elementSwitch = "_mm_Data_Cell";
					}
				}
				else
				{
					elementSwitch = "_mm_Layout_Division";
				}
				break;
			case "CANVAS":
				elementSwitch = "_mm_Layout_Division"; // Any text inside the between <canvas> and </canvas> will be displayed in browsers that do not support the canvas element. As Chrome supports canvas we need to be able to change out the canvas element for its contents - the easiest way is to say it is a layout division
				break;
			case "FIELDSET":
				elementSwitch = "_mm_Input_Group";
				break;
			case "UL":
				elementSwitch = "_mm_Bulleted_List";
				break;
			case "OL":
				elementSwitch = "_mm_Numbered_List";
				break;
			case "LI":
				if (liveElement.getAttribute("role") == "menuitem")
				{
					elementSwitch = "_mm_Menu_Item";
				}
				else
				{
					elementSwitch = "_mm_List_Item";
				}
				break;
			case "MAP":
				elementSwitch = "_mm_Map";
				break;
			case "AREA":
				elementSwitch = "_mm_Map_Area";
				break;
			case "TABLE":
				if (liveElement.getAttribute("role") == "presentation")
				{
					elementSwitch = "_mm_Layout_Table"; 
				}
				else
				{
					elementSwitch = "_mm_Data_Table";
				}
				break;
			case "BLOCKQUOTE":
				if (liveElement.getAttribute("cite") == null)
				{
					elementSwitch = "_mm_Quote";
				}
				else
				{
					elementSwitch = "_mm_Quote_Link";
				}
				break;
			case "INS":
				elementSwitch = "_mm_Insertion";
				break;
			case "DEL":
				elementSwitch = "_mm_Deletion";
				break;
			case "CODE":
				elementSwitch = "_mm_Code";
				break;
			case "AUDIO":
				elementSwitch = "_mm_Audio";
				break;
			case "VIDEO":
				elementSwitch = "_mm_Video";
				break;
		}
		
		// following done as a by product 
		
		if ((typesInDOM.indexOf(elementSwitch) == -1)&&(elementSwitch != "unsupported")&&(elementSwitch != "_mm_Static_Text")&&(elementSwitch != "_mm_Layout_Division")&&(elementSwitch != "_mm_Layout_Table")&&(elementSwitch != "_mm_Layout_Header_Cell")&&(elementSwitch != "_mm_Layout_Data_Cell")&&(elementSwitch != "_mm_Decorative_Image")) // static text is included as it is read out automatically within other osm items.  Noting a main content area should always be included even in the simplest pages.
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
				case "_mm_Search_Box":
					osmIndex++;
					createModelElement(selectedElement, TextBoxModel);
					break;
				case "_mm_Password_Box":
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
				case "_mm_Semantic_Image": // semantic image if no role=presentation
					osmIndex++;
					createModelElement(selectedElement, SemanticImageModel);
					break;
				case "_mm_Decorative_Image": // semantic image if no role=presentation
					osmIndex++;
					createModelElement(selectedElement, DecorativeImageModel);
					break;
				case "_mm_Page_Header_Area":
					osmIndex++;
					createModelElement(selectedElement, PageHeaderAreaModel);
					break;
				case "_mm_Site_Navigation_Area":
					osmIndex++;
					createModelElement(selectedElement, SiteNavigationAreaModel);
					break;
				case "_mm_Menu":
					osmIndex++;
					createModelElement(selectedElement, MenuModel);
					break;
				case "_mm_Main_Content_Area":
					osmIndex++;
					createModelElement(selectedElement, MainContentAreaModel);
					break;
				case "_mm_Page_Footer_Area":
					osmIndex++;
					createModelElement(selectedElement, PageFooterAreaModel);
					break; 
				case "_mm_Page_Contact_Details":
					osmIndex++;
					createModelElement(selectedElement, PageContactDetailsModel);
					break;
				case "_mm_Layout_Division":
					osmIndex++;
					createModelElement(selectedElement, LayoutDivisionModel);
					break; 
				case "_mm_Sentence":
					osmIndex++;
					createModelElement(selectedElement, SentenceModel);
					break;
				case "_mm_Input_Group":
					osmIndex++;
					createModelElement(selectedElement, InputGroupModel);
					break;
				case "_mm_Bulleted_List":
					osmIndex++;
					createModelElement(selectedElement, BulletedListModel);
					break;
				case "_mm_Numbered_List":
					osmIndex++;
					createModelElement(selectedElement, NumberedListModel);
					break;
				case "_mm_List_Item":
					osmIndex++;
					createModelElement(selectedElement, ListItemModel);
					break;
				case "_mm_Menu_Item":
					osmIndex++;
					createModelElement(selectedElement, MenuItemModel);
					break;
				case "_mm_Map":
					osmIndex++;
					createModelElement(selectedElement, MapModel);
					break;
				case "_mm_Map_Area":
					osmIndex++;
					createModelElement(selectedElement, MapAreaModel);
					break;
				case "_mm_Layout_Table":
					osmIndex++;
					createModelElement(selectedElement, LayoutTableModel);
					break;
				case "_mm_Layout_Header_Cell":
					osmIndex++;
					createModelElement(selectedElement, LayoutHeaderCellModel);
					break;
				case "_mm_Layout_Data_Cell":
					osmIndex++;
					createModelElement(selectedElement, LayoutDataCellModel);
					break;
				case "_mm_Data_Table":
					osmIndex++;
					createModelElement(selectedElement, DataTableModel);
					break;
				case "_mm_Header_Cell":
					osmIndex++;
					createModelElement(selectedElement, HeaderCellModel);
					break;
				case "_mm_Data_Cell":
					osmIndex++;
					createModelElement(selectedElement, DataCellModel);
					break;	
				case "_mm_Quote":
					osmIndex++;
					createModelElement(selectedElement, QuoteModel);
					break;
				case "_mm_Quote_Link":
					osmIndex++;
					createModelElement(selectedElement, QuoteLinkModel);
					break;
				case "_mm_Insertion":
					osmIndex++;
					createModelElement(selectedElement, InsertionModel);
					break;
				case "_mm_Deletion":
					osmIndex++;
					createModelElement(selectedElement, DeletionModel);
					break;
				case "_mm_Code":
					osmIndex++;
					createModelElement(selectedElement, CodeModel);
					break;
				case "_mm_Audio":
					osmIndex++;
					createModelElement(selectedElement, AudioModel);
					break;
				case "_mm_Video":
					osmIndex++;
					createModelElement(selectedElement, VideoModel);
					break;
				case "_mm_Telephone_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Url_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Email_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Number_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Date_Time_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Date_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Month_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Week_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Time_Box":
					osmIndex++;
					createModelElement(selectedElement, FormatSpecificEntryBoxModel);
					break;
				case "_mm_Range_Input":
					osmIndex++;
					createModelElement(selectedElement, RangeInputModel);
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
			var elementContents = "";
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
		
		// next is only for select elements
		
		this.selectedTextValue = function()
		{
			return baseElement[baseElement.getAttribute("_mm_selectedindex")].innerText;
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
			
			// need to change elements within the contents
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
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + titleValue() + element.innerHTML;
			
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
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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
			element.innerHTML = whatAmI() + titleValue() + baseElement.contents();
			
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
			
			// need to change elements within the contents
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
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + titleValue() + element.innerHTML;
			
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
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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
	
	// QUOTELINK 
	
	function QuoteLinkModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Quote_Link"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("cite"));
				
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + titleValue() + baseElement.contents();
			
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Quote link</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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
	
	// MAP // map
	
	function MapModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Map"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + titleValue() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Map</span>";
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
	}
	
	// MAPAREA 
	
	function MapAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Map_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("href"));
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + altValue();
			
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Map area</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function altValue()
		{
			// title forms part of the text to read out
			
			var alt = baseElement.getAttribute("alt");
			
			if ((alt == null)||(alt == ""))
			{
				alt = "Untitled"; 
			}
			else
			{
				alt = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + alt + "</span>";
			}
			
			return alt;
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// LAYOUTTABLE // image map areas 
	
	function LayoutTableModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Layout_Table"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = changeTableContents(baseElement.contents());
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function changeTableContents(tableContents)
		{
			tableContents = tableContents.replace(/<tbody/gi, "<div role='presentation' was='tbody'"); // gi global insensitive
			tableContents = tableContents.replace(/tbody>/gi, "div>");
			tableContents = tableContents.replace(/<tr/gi, "<div role='presentation' was='tr'"); // gi global insensitive
			tableContents = tableContents.replace(/tr>/gi, "div>");
			tableContents = tableContents.replace(/<th/gi, "<div was='th'"); // gi global insensitive
			tableContents = tableContents.replace(/th>/gi, "div>");
			tableContents = tableContents.replace(/<td/gi, "<div was='td'"); // gi global insensitive
			tableContents = tableContents.replace(/td>/gi, "div>");
			return tableContents;
		}
	}
	
	// LAYOUTHEADERCELL // image map areas 
	
	function LayoutHeaderCellModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Layout_Header_Cell"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}
	
	// LAYOUTDATACELL // image map areas 
	
	function LayoutDataCellModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Layout_Data_Cell"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}
	
	// DATATABLE // image map areas 
	
	function DataTableModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Data_Table"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + summaryValue() + changeTableContents(baseElement.contents());
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function changeTableContents(tableContents)
		{
			tableContents = tableContents.replace(/<tbody/gi, "<div role='presentation' was='tbody'"); // gi global insensitive
			tableContents = tableContents.replace(/tbody>/gi, "div>");
			tableContents = tableContents.replace(/<tr/gi, "<div role='presentation' was='tr'"); // gi global insensitive
			tableContents = tableContents.replace(/tr>/gi, "div>");
			tableContents = tableContents.replace(/<th/gi, "<div was='th'"); // gi global insensitive
			tableContents = tableContents.replace(/th>/gi, "div>");
			tableContents = tableContents.replace(/<td/gi, "<div was='td'"); // gi global insensitive
			tableContents = tableContents.replace(/td>/gi, "div>");
			return tableContents;
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Data table</span>";
		}
		
		function summaryValue()
		{
			// title forms part of the text to read out
			
			var summary = baseElement.getAttribute("summary");
			
			if ((summary == null)||(summary == ""))
			{
				summary = ""; 
			}
			else
			{
				summary = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + summary + "</span>";
			}
			
			return summary;
		}
	}
	
	// HEADERCELL // image map areas 
	
	function HeaderCellModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Header_Cell"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Header cell</span>";
		}
	}
	
	// DATACELL // image map areas 
	
	function DataCellModel(baseElement) 
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Data_Cell"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + labelValue() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Data cell</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var labelText = ""; 
			var label = baseElement.getAttribute("headerCellTitles"); 
			
			if (label == null)
			{
				labelText = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>No specified row or column</span>";
			}
			else
			{
				var headerCellTitles = JSON.parse(label);
				for (var i in headerCellTitles)
				{
					labelText = labelText + "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>relates to " + headerCellTitles[i] + "</span>";
				}
				labelText = labelText + "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>cell value</span>";
			}
			
			return labelText;
		}
	}
	
	// AUDIO
	
	function AudioModel(baseElement) // allows play, pause, rewind
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Audio"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			
			// need to check contents to see if track elements are included - need to do a little more research on TRACK ELEMENT
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + titleValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Audio</span>";
		}
		
		function titleValue()
		{
			// label forms part of the text to read out
			
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "Untitled";
			}
			else
			{
				title = "Entitled: " + title; 
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// VIDEO
	
	function VideoModel(baseElement) // allows play, pause, rewind
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Video"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			
			// need to check contents to see if track elements are included - need to do a little more research on TRACK ELEMENT
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + titleValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Video</span>";
		}
		
		function titleValue()
		{
			// label forms part of the text to read out
			
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "Untitled";
			}
			else
			{
				title = "Entitled: " + title; 
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function storeValue(element, text)
		{
			element.setAttribute("_mm_Store", text);
		}
	}
	
	// Interaction non-container objects (have textToReadOut functions) ---------------------
	
	// TEXTBOX // from texture, type=password, type=text, label
	
	function TextBoxModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		var type;
		
		if (baseElement.tagName() == "TEXTAREA")
		{
			type = "text"; 
		}
		else
		{
			type = baseElement.getAttribute("type").toLowerCase(); 
		}
		
		var nameBasedOnType = "";
		
		switch(type)
		{
			case "text":
				nameBasedOnType = "Text_Box";
				break;
			case "search":
				nameBasedOnType = "Search_Box";
				break;
			case "password":
				nameBasedOnType = "Password_Box";
				break;
		}
		
		this.name = nameBasedOnType; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			// state forms part of the text to read out - same for check box and radio button - when we fill in the values and press return we should do a round trip / or be notified if something in the page being tracked changes
			element.setAttribute("mmInteractable", true);
			element.innerHTML = labelValue() + interactable() + whatAmI() + stateValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + type + " box</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = "Unlabelled";
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
	
	// FORMATSPECIFICENTRYBOX // from texture, type=password, type=text, label
	
	function FormatSpecificEntryBoxModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		var type = baseElement.getAttribute("type").toLowerCase(); 
		var nameBasedOnType = ""; 
		
		switch(type)
		{
			case "telephone":
				nameBasedOnType = "Telephone_Box"; 
				break;
			case "url":
				nameBasedOnType = "Url_Box"; 
				break;
			case "e-mail":
				nameBasedOnType = "Email_Box"; 
				break;
			case "number":
				nameBasedOnType = "Number_Box"; 
				break;
			case "datetime":
				nameBasedOnType = "Date_Time_Box"; 
				break;
			case "date":
				nameBasedOnType = "Date_Box"; 
				break;
			case "month":
				nameBasedOnType = "Month_Box"; 
				break;
			case "week":
				nameBasedOnType = "Week_Box"; 
				break;
			case "time":
				nameBasedOnType = "Time_Box"; 
				break;
		}
		
		this.name = nameBasedOnType; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			// state forms part of the text to read out - same for check box and radio button - when we fill in the values and press return we should do a round trip / or be notified if something in the page being tracked changes
			element.setAttribute("mmInteractable", true);
			element.innerHTML = labelValue() + interactable() + whatAmI() + specifiedFormat() + stateValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{		
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + type + " box</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = "Unlabelled";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + label + "</span>";
		}
		
		function specifiedFormat()
		{
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "No format specified";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Specified format " + title + "</span>";
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
	
	// RANGE // from type=range
	
	function RangeInputModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);

		this.name = "Range_Input"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id"));
			// state forms part of the text to read out - same for check box and radio button - when we fill in the values and press return we should do a round trip / or be notified if something in the page being tracked changes
			
			var min = baseElement.getAttribute("min"); 
			
			if (min != null)
			{
				element.setAttribute("mmMin", min);
			}

			var max = baseElement.getAttribute("max"); 
			
			if (max != null)
			{
				element.setAttribute("mmMax", max);
			}
			
			var step = baseElement.getAttribute("step"); 
			
			if (step != null)
			{
				element.setAttribute("mmStep", step);
			}
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = labelValue() + interactable() + whatAmI() + stateValue();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Range input</span>";
		}
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
		}
		
		function labelValue()
		{
			// label forms part of the text to read out
			
			var label = baseElement.getAttribute("label"); 
			
			if (label == null)
			{
				label = "Unlabelled";
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
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Current value: " + state + "</span>"; // careful changing text as it is used in drawRangeInput above
		}
		
		// state max / min 
		
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
			element.setAttribute("mmInteractable", true);
			element.innerHTML = labelValue() + interactable() + whatAmI();
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
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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
			
			element.setAttribute("mmInteractable", true);
			element.innerHTML = labelValue() + interactable() + whatAmI() + stateValue();
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
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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
			element.setAttribute("mmInteractable", true);
			element.innerHTML = interactable() + whatAmI() + labelValue() + stateValue() + element.innerHTML;
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
		
		function interactable()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Interactable</span>";
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

			var state = baseElement.selectedTextValue();
			
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
	
	// 	PAGE HEADER AREA //
	
	function PageHeaderAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Page_Header_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Page header area</span>";
		}
	}
	
	// 	SITE NAVIGATION AREA //
	
	function SiteNavigationAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Site_Navigation_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Site navigation area</span>";
		}
	}
	
	// 	MENU //
	
	function MenuModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Menu"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = titleValue() + whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Menu</span>";
		}
		
		function titleValue()
		{
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "None";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + title + "</span>";
		}
	}
	
	// 	MAIN CONTENT AREA //
	
	function MainContentAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Main_Content_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id")); // as divs can be used as targets for anchor links
			
			// you need to fill the element first 
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
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Main content area</span>";
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
	
	// 	PAGE FOOTER AREA //
	
	function PageFooterAreaModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Page_Footer_Area"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Page footer area</span>";
		}
	}
	
	// 	PAGE CONTACT DETAILS //
	
	function PageContactDetailsModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Page_Contact_Details"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Page contact details</span>";
		}
	}
	
	// 	PAGE CONTACT DETAILS //
	
	function LayoutDivisionModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Layout_Division"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
	}
	
	// SECTION + ARTICLE 
	
	function SectionModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Section"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			storeValue(element, baseElement.getAttribute("id")); // as divs can be used as targets for anchor links
			
			// you need to fill the element first 
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
	
	// SENTENCE //
	
	function SentenceModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Sentence"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			// you need to fill the element first
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			if ((element.innerHTML != "")&&(element.children.length == 0)) // removing the situation where you make a sentence which you cannot hear the content of
			{
				element.innerHTML = "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + element.innerHTML + "</span>"; 
			}
			
			if (element.innerHTML == "")
			{
				element.setAttribute("mmEmpty", "true");
			}
		
			element.innerHTML = whatAmI() + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Sentence</span>";
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
			
			if (baseElement.contents() == "")
			{
				element.setAttribute("mmEmpty", "true");
			}
			
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Paragraph</span>";
		}
	}
	
	// QUOTE //
	
	function QuoteModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Quote"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			if (baseElement.contents() == "")
			{
				element.setAttribute("mmEmpty", "true");
			} 
			
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Quote</span>";
		}
	}
	
	// INSERTION //
	
	function InsertionModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Insertion"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			if (baseElement.contents() == "")
			{
				element.setAttribute("mmEmpty", "true");
			}
			
			element.innerHTML = whatAmI() + insertedWhen() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Insertion</span>";
		}
		
		function dateTimeValue()
		{
						
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + name + "</span>";
		}
		
		function insertedWhen()
		{
			// YYYY-MM-DDThh:mm:ss 2011-05-17T13:25:01
 			
			// datetime attribute 
			
			var datetime = baseElement.getAttribute("datetime"); 
			
			if (datetime == null)
			{
				datetime = "";
			}
			else
			{
				// on the xx-yy
				
				if (datetime.indexOf("T") != -1)
				{
					datetime = datetime.replace("T", " at ");
				}
				
				datetime = "on the " + datetime; 
			}			
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>The following was inserted into the page" + datetime + "</span>";
		}
	}
	
	// DELETION //
	
	function DeletionModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Deletion"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			if (baseElement.contents() == "")
			{
				element.setAttribute("mmEmpty", "true");
			}
			
			element.innerHTML = whatAmI() + deletedWhen() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Deletion</span>";
		}
		
		function deletedWhen()
		{
			// YYYY-MM-DDThh:mm:ss 2011-05-17T13:25:01
			
			// datetime attribute
			
			var datetime = baseElement.getAttribute("datetime"); 
			
			if (datetime == null)
			{
				datetime = "";
			}
			else
			{
				// on the xx-yy
				
				if (datetime.indexOf("T") != -1)
				{
					datetime = datetime.replace("T", " at ");
				}
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>The following was deleted from the page" + datetime + "</span>";
		}
	}
	
	// CODE //
	
	function CodeModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Code"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			if (baseElement.contents() == "")
			{
				element.setAttribute("mmEmpty", "true");
			}
			
			element.innerHTML = whatAmI() + baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Code</span>";
		}
	}
	
	// 	BULLETED LIST //
	
	function BulletedListModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Bulleted_List"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			// element needs to be filled
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			element.innerHTML = whatAmI() + numberOfChildren(element.children.length) + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Bulleted list</span>";
		}
		
		function numberOfChildren(number)
		{
			var text = "items";
			
			if (number == 1)
			{
				text = "item"
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + number + " " + text + " listed</span>";
		}
	}
	
	// NUMBERED LIST //
	
	function NumberedListModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Numbered_List"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			// element needs to be filled
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			var children = element.children; // direct children
			
			var count = 1; 
			
			for (var i in children)
			{
				if (children[i].tagName == "LI")
				{
					children[i].setAttribute("positionInList", count);
					count++;
				}
			}
			
			element.innerHTML = whatAmI() + numberOfChildren(element.children.length) + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Numbered list</span>";
		}
		
		function numberOfChildren(number)
		{
			var text = "items";
			
			if (number == 1)
			{
				text = "item"
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + number + " " + text + " listed</span>";
		}
	}
	
	// LIST ITEM //
	
	function ListItemModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "List_Item"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			
			if (baseElement.contents() == "")
			{
				element.innerHTML = whatAmI() + empty();
			}
			else
			{
				element.innerHTML = whatAmI() + baseElement.contents();

			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			var positionInList = baseElement.getAttribute("positionInList"); 
			
			var text = ""; 
			
			if (positionInList != null)
			{
				text = " " + positionInList;
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>List item" + text + "</span>";
		}
		
		function empty()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Empty</span>";
		}
	}
	
	// MENU ITEM //
	
	function MenuItemModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Menu_Item"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			if (baseElement.contents() == "")
			{
				element.innerHTML = whatAmI() + empty();
			}
			else
			{
				element.innerHTML = whatAmI() + baseElement.contents();
				
			}
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{		
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Menu item</span>";
		}
		
		function empty()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Empty</span>";
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
			element.innerHTML = nameValue() + whatAmI() + baseElement.contents();
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
		
		function nameValue()
		{
			var name = baseElement.getAttribute("name"); 
			
			if (name == null)
			{
				name = "Untitled";
			}
			
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>" + name + "</span>";
		}
	}
	
	// INPUT GROUP 
	
	function InputGroupModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Input_Group"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			// storeValue(element, baseElement.getAttribute("id")); // as divs can be used as targets for anchor links
			
			// you need to fill the element first
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// return And Remove First Child Header, as nodes are now set up in replacement element
			
			var legend = null;
			var children = element.children; // direct children
			
			for (var i in children)
			{
				if (children[i].tagName == "LEGEND")
				{
					legend = children[i].innerText;
					element.removeChild[i];
					break;
				}
			}
			
			// finally
			
			element.innerHTML = whatAmI() + title(legend) + element.innerHTML;
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
		}
		
		function whatAmI()
		{
			return "<span class='unchanged' _mm_Id='" + baseElement.mmId() + "'>Input group</span>";
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
	}	
	
	// STATICTEXT (should have a type attribute like type=quote or type=code) // from span, p, quote, abbr, code, etc… 
	
	function StaticTextModel(baseElement)
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Static_Text"; 
		
		this.replacementElement = function()
		{
			var element = document.createElement("span");
			element.innerHTML = baseElement.contents();
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
	
	function DecorativeImageModel(baseElement) // might be best to switch on wai-aria role - to differentiate it from decorative image alt="" decorative
	{
		var baseElement = new ElementModel(baseElement);
		
		this.name = "Decorative_Image";
		
		this.replacementElement = function()
		{
			var element = document.createElement("div");
			element.innerHTML = baseElement.contents();
			return element;
		}
		
		this.allChildrenIds = function()
		{
			return baseElement.allChildrenIds();
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
			
			// you need to fill the element first
			var elementContents = baseElement.contents();
			if (elementContents != null)
			{
				element.innerHTML = elementContents;
			}
			
			// span elements which are direct children need to be given an "parentElement" attribute with a text value "UNSUPPORTED" - so that they will figure are sentences
			
			var children = element.children; // direct children
			
			if (children.length > 0)
			{
				for (var i in children)
				{
					if (children[i].tagName == "SPAN")
					{
						children[i].setAttribute("parentElement", "UNSUPPORTED");
						if ((children[i].innerHTML != "")&&(children[i].children == 0)) // removing the situation where you make a sentence which you cannot hear the content of
						{
							children[i].innerHTML = "<span class='unchanged' _mm_Id='" + children[i].getAttribute("_mm_Id") + "'>" + children[i].innerHTML + "</span>"; 
						}
					}
				}
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
	var jumpableNodeTypes = ["_mm_Section"]; // default value
	var osmElementCount;
	
	this.update = function()
	{
		osmElementCount = osm.elementCount();
	}
	
	this.setAvailableReadableNodes = function(availableNodes)
	{
		var all = ["All"];
		availableReadableNodes = all.concat(availableNodes);
	}
	
	// for Navigate by menu
	
	this.getJumpableNodes = function()
	{
		return nodesForNavigation(availableReadableNodes);
	}
	
	function nodesForNavigation(availableReadableNodes) // you want to restrict the available nodes to those which are useful for navigation
	{
		var availableNavigationNodes = [];
		var possibleNavigationNodes = ["_mm_Skip_Link", "_mm_Link", "_mm_Section", "_mm_Form"]; 
		for (var i in availableReadableNodes)
		{
			if (possibleNavigationNodes.indexOf(availableReadableNodes[i]) != -1)
			{
				availableNavigationNodes[availableNavigationNodes.length] = availableReadableNodes[i];
			}
		}
		return availableNavigationNodes;
	}
	
	this.setJumpableNodes = function(groupName)
	{
		switch(groupName)
		{
			case "Link":
				jumpableNodeTypes = ["_mm_Link"];
				break;
			case "Skip_Link":
				jumpableNodeTypes = ["_mm_Skip_Link"];
				break;
			case "Section":
				jumpableNodeTypes = ["_mm_Section"];
				break;
			case "Form":
				jumpableNodeTypes = ["_mm_Form"];
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
	
	this.moveToAndReturnNextOSMNode = function() 
	{
		currentOSMNodeIndex = nextOSMNodeIndex;
		nextOSMNodeIndex = nextOSMNodeIndex + 1;
		
		if (currentOSMNodeIndex <= osmElementCount) // osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(availableReadableNodes.indexOf(nodeType) == -1)
				{
					this.moveToAndReturnNextOSMNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
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
				if(availableReadableNodes.indexOf(nodeType) == -1)
				{
					this.moveToAndReturnPrevOSMNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
				{
					this.moveToAndReturnPrevOSMNode();
				}
			}
		}
		return currentOSMNodeIndex;
	}
	
	this.jumpToAndReturnNextOSMNode = function()
	{
		currentOSMNodeIndex = nextOSMNodeIndex;
		nextOSMNodeIndex = nextOSMNodeIndex + 1;
		
		if (currentOSMNodeIndex <= osmElementCount) // osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(jumpableNodeTypes.indexOf(nodeType) == -1)
				{
					this.jumpToAndReturnNextOSMNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
				{
					this.jumpToAndReturnNextOSMNode();
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
				if(availableReadableNodes.indexOf(nodeType) == -1)
				{
					nextNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
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
				if(availableReadableNodes.indexOf(nodeType) == -1)
				{
					prevNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
				{
					prevNode();
				}
			}
		}
		return currentSimulated;
	}
	
	function nextJumpableNode() // no move
	{
		currentSimulated = nextSimulated;
		nextSimulated = nextSimulated + 1;
		
		if (currentSimulated <= osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentSimulated);
			if (node != null)
			{
				var nodeType = node.className;
				if(jumpableNodeTypes.indexOf(nodeType) == -1)
				{
					nextJumpableNode();
				}
				// if the node only contains the osm item name
				if (node.hasAttribute("mmEmpty") == true)
				{
					nextJumpableNode();
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
	
	this.nextJumpableOSMNode = function()
	{
		setUpSimulated();
		return nextJumpableNode();
	}
}