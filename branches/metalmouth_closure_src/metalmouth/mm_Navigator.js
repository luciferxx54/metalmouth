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

goog.provide('mm_Navigator');

mm_Navigator.reset = function() {
	initWalker();
	initJump();
}

mm_Navigator.startOrStop = function() {
	if (readNodesStop == true) {
		mm_Navigator.startReadingNodes();
	}
	else {
		mm_Navigator.stopReadingNodes();
	}
}

mm_Navigator.startReadingNodes = function() {
	readNodesStop = false;
	readOn();
	
	function readOn() {
		walkerElementPlusText.currentNode = walker.currentNode;
		walker = walkerElementPlusText;
		
		if (readNodesStop != true) {
			walker.nextNode();
		}
		
		if (osmType == null) {
			goBackToStart();
		}
		else
		{
			if (readNodesStop != true) {
				readNodeContents(contentComponents, readOn);
			}
		}
	}
}

mm_Navigator.stopReadingNodes = function() {
	readNodesStop = true;
}

mm_Navigator.backToStart = function() { 
    // navigator. click and it enables and focuses on stop 
	initWalker();
	restoreHighlighter();
	mm_TTS.getAudio("Page start", null);
}

mm_Navigator.jump = function() {	
	jump();
}

mm_Navigator.readPrevNode = function() {
	readNodesStop = true; // to stop reading on
	
	walkerElementPlusText.currentNode = walker.currentNode;
	walker = walkerElementPlusText;
	
	walker.previousNode();
	
	if (osmType == null) {
		goBackToStart();
	}
	else {
		readNodeContents(contentComponents);
	}
}

mm_Navigator.readNextNode = function() {
	readNodesStop = true; // to stop reading on
	
	walkerElementPlusText.currentNode = walker.currentNode;
	walker = walkerElementPlusText;
	
	walker.nextNode();
	
	if (osmType == null) {
		goBackToStart();
	}
	else {
		readNodeContents(contentComponents);
	}
}

mm_Navigator.interactFunctions = {}

mm_Navigator.interactFunctions['Link'] = function(currentNode) {
	var linkInteraction = function(liveElementToInteractWith) {
		document.location.href = liveElementToInteractWith.getAttribute("href"); // this should look at the background code open the page using opener and see if it contains a meta refresh
	} 
	return linkInteraction(currentNode);
}

mm_Navigator.interactFunctions['New_Tab_Map_Area'] = function(currentNode) {
	var newTabMapAreaInteraction = function(liveElementToInteractWith) {
		mm_BackgroundComms.call("openTab", liveElementToInteractWith.getAttribute("href"), null, false);
	} 
	return newTabMapAreaInteraction(currentNode);
}

mm_Navigator.interactFunctions['New_Tab_Link'] = function(currentNode) {
	var newTabLinkInteraction = function(liveElementToInteractWith) {
		mm_BackgroundComms.call("openTab", liveElementToInteractWith.getAttribute("href"), null, false);
	} 
	return newTabLinkInteraction(currentNode);
}

mm_Navigator.interactFunctions['Quote_Link'] = function(currentNode) {
	var linkInteraction = function(liveElementToInteractWith) {
		document.location.href = liveElementToInteractWith.getAttribute("cite"); // this should look at the background code open the page using opener and see if it contains a meta refresh
	} 
	return linkInteraction(currentNode);
}

mm_Navigator.interactFunctions['Map_Area'] = function(currentNode) {
	var linkInteraction = function(liveElementToInteractWith) {
		document.location.href = liveElementToInteractWith.getAttribute("href"); // this should look at the background code open the page using opener and see if it contains a meta refresh
	} 
	return linkInteraction(currentNode);
}

mm_Navigator.interactFunctions['Skip_Link'] = function(currentNode) {
	var skipLinkInteraction = function(liveElementToInteractWith) {
		var targetHref = liveElementToInteractWith.getAttribute("href").replace("#", "");
		moveTo(targetHref);
	}
	return skipLinkInteraction(currentNode);
}

mm_Navigator.interactFunctions['Text_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "text");
}

mm_Navigator.interactFunctions['Search_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "search");
}

mm_Navigator.interactFunctions['Password_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "password");
}

mm_Navigator.interactFunctions['Telephone_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "telephone");
}

mm_Navigator.interactFunctions['Url_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "url");
}

mm_Navigator.interactFunctions['Email_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "e-mail");
}

mm_Navigator.interactFunctions['Number_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "number");
}

mm_Navigator.interactFunctions['Date_Time_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "date time");
}

mm_Navigator.interactFunctions['Date_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "date");
}

mm_Navigator.interactFunctions['Month_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "month");
}

mm_Navigator.interactFunctions['Week_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "week");
}

mm_Navigator.interactFunctions['Time_Box'] = function(currentNode) {
	return mm_ControlPanel.drawTextBoxInteract(currentNode, "time");
}

mm_Navigator.interactFunctions['Range_Input'] = function(currentNode) {
	return mm_ControlPanel.drawRangeInputInteract(currentNode);
}

mm_Navigator.interactFunctions['Button'] = function(currentNode) {
	var buttonInteraction = function(liveElementToInteractWith) {
		liveElementToInteractWith.click();
	}
	return buttonInteraction(currentNode);
}

mm_Navigator.interactFunctions['Input_Button'] = function(currentNode) {
	var buttonInteraction = function(liveElementToInteractWith) {
		liveElementToInteractWith.click();
	}
	return buttonInteraction(currentNode);
}

mm_Navigator.interactFunctions['Image_Button'] = function(currentNode) {
	var buttonInteraction = function(liveElementToInteractWith) {
		liveElementToInteractWith.click();
	}
	return buttonInteraction(currentNode);
}
	
mm_Navigator.interactFunctions['Submit_Button'] = function(currentNode) {
	var buttonInteraction = function(liveElementToInteractWith) {
		liveElementToInteractWith.click();
	}
	return buttonInteraction(currentNode);
}
		
mm_Navigator.interactFunctions['Reset_Button'] = function(currentNode) {
	var buttonInteraction = function(liveElementToInteractWith) {
		liveElementToInteractWith.click();
	}
	return buttonInteraction(currentNode);
}
		
mm_Navigator.interactFunctions['Check_Button'] = function(currentNode) {
	return mm_ControlPanel.drawCheckButtonInteract(currentNode);
}
			
mm_Navigator.interactFunctions['Single_Select'] = function(currentNode) {
	return mm_ControlPanel.drawSingleSelectMenuInteract(currentNode);
}

mm_Navigator.interactFunctions['Multi_Select'] = function(currentNode) {
	return mm_ControlPanel.drawMultiSelectMenuInteract(currentNode);
}
				
mm_Navigator.interactFunctions['Audio'] = function(currentNode) {
	return mm_ControlPanel.drawMediaInteract(currentNode, "audio");
}
					
mm_Navigator.interactFunctions['Video'] = function(currentNode) {
	return mm_ControlPanel.drawMediaInteract(currentNode, "video");
}

mm_Navigator.interact = function()  {
	if (osmType != null) {
		mm_Navigator.interactFunctions[osmType](walker.currentNode);
	}
}

var osmType;
var contentComponents;

function goBackToStart() {
	initWalker();
	restoreHighlighter();
	mm_TTS.getAudio("Page start", null);
}

function jump() {
	if (jumpAvailable == true) {
		walkerJump.currentNode = walker.currentNode;
		walker = walkerJump;
		walker.nextNode();
		if (osmType != null) {
			readNodeContents(contentComponents);
		}
		else {
			initWalker(); // should allow a loop of headers
			jump();
		}
	}
	else {
		mm_TTS.getAudio("page does not contain headers", null);
	} 
}

function osmItemChecker(node) {	
	function textNodeOnlyChild() {
		if(node.parentElement.childNodes.length == 1) {
			return true;
		}
		return false;
	}
	
	function nodeInSpecificElement() {
		var specificElements = ["AUDIO", "VIDEO", "CANVAS", "IFRAME", "BUTTON"]; // any which contain text to display if they are unsupported - removed CANVAS and OBJECT as text alternatives can be placed in the body - will also be useful for handling TRACK elements
		
		if(specificElements.indexOf(node.parentElement.tagName) != -1) {
			return true;
		}
		return false;
	}
    
    function nodeNotVisible() {
        var comp = document.defaultView.getComputedStyle(node);
        if ((comp.getPropertyValue("display") == "none") || (comp.getPropertyValue("visibility") == "hidden")) {
            return true;
        }
        return false;
    }
    
    function parentNodeNotVisible() {
        // check the ancestor of the node to make sure that it is not display:none or visibility:hidden
        var parent = node.parentElement;
        while (parent.tagName != "BODY") {
            var comp = document.defaultView.getComputedStyle(parent);
            if ((comp.getPropertyValue("display") == "none") || (comp.getPropertyValue("visibility") == "hidden")) {
                return true;
            }
            parent = parent.parentElement;
        }
        return false;
    }
	
	function empty() { 
        // void elements are intended to be empty
		var voidHtmlElements = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];
		var htmlsWeAllowToBeEmpty = ["VIDEO", "AUDIO", "CANVAS", "TEXTAREA"]; // any others? we don't support OBJECT currently?
		
		if ((voidHtmlElements.indexOf(node.nodeName) == -1) && (htmlsWeAllowToBeEmpty.indexOf(node.nodeName) == -1) && (node.childNodes.length == 0))  
		{
			return true;
		}
		return false;
	}
	
	osmType = null; // reset each time due to interact()
	contentComponents = [];
	
	if(node.nodeName != "#text") {
		// detect and remove empty elements which are not designed to be empty
		if ((empty() == false) && (nodeInSpecificElement() == false) && (nodeNotVisible() == false) && (parentNodeNotVisible() == false)) {
            // last condition added 
			// need to skip over our tags 
			if (node.hasAttribute("data-mm-uicomponent") == false) {
                // data-mm-uicomponent on each metalmouth component 
				var osmItemModel = mm_OSEM.filter(node);
		
				if (osmItemModel != null) {
					osmType = osmItemModel.osmType;
					mm_ControlPanel.showCurrentItem(osmType, node);
					contentComponents = osmItemModel.osmContentComponents;
					return NodeFilter.FILTER_ACCEPT;
				}
			}
		}
	}
	else {
		if ((textNodeOnlyChild() == false)&&(nodeInSpecificElement() == false)) {
			if (node.data.trim() != "") {
                // node.data != "\n"
				osmType = "Text";
				mm_ControlPanel.showCurrentItem(osmType, node.parentElement);
				contentComponents[0] = node.data;
				return NodeFilter.FILTER_ACCEPT;
			}
		}
	}
	return NodeFilter.FILTER_SKIP;
}

function jumpChecker(node) {
    // jump to headers - this is what people do
	osmType = null; // reset each time due to interact()
	contentComponents = [];
	
	if ((node.nodeName == "H1")||(node.nodeName == "H2")||(node.nodeName == "H3")||(node.nodeName == "H4")||(node.nodeName == "H5")||(node.nodeName == "H6")) {
		var osmItemModel = mm_OSEM.filter(node);
		
		if (osmItemModel != null) {
			osmType = osmItemModel.osmType;
			mm_ControlPanel.showCurrentItem(osmType, node);
			contentComponents = osmItemModel.osmContentComponents;
			return NodeFilter.FILTER_ACCEPT;
		}
	}
	return NodeFilter.FILTER_SKIP;
}

var walkerElementPlusText;
var walkerJump;
var walkerFirstChild;
var walkerLastChild;
var walker;

function initWalker() {
	var walkerUnfiltered = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, null, false);
	walkerFirstChild = walkerUnfiltered.firstChild();
	walkerLastChild = walkerUnfiltered.lastChild();
	walkerUnfiltered = null;
	
	walkerElementPlusText = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, osmItemChecker, false);
	walkerJump = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, jumpChecker, false);
	walker = walkerElementPlusText;
}

var jumpAvailable = false;

function initJump() {
	var headers = document.body.querySelectorAll("h1,h2,h3,h4,h5,h6");
	if (headers.length > 0) {
		jumpAvailable = true;
	}
}

var readNodesStop;

function moveTo(elementReference) {
    // id or name, this is used for internal links

	function moveToChecker(node) {
		if ((node.hasAttribute("id"))||(node.hasAttribute("name"))) {
			if ((node.getAttribute("id") == elementReference)||(node.getAttribute("name") == elementReference)) {
				osmType = null; // reset each time due to interact()
				contentComponents = [];
				
				var osmItemModel = mm_OSEM.filter(node);
				
				if (osmItemModel != null) {
					osmType = osmItemModel.osmType;
					mm_ControlPanel.showCurrentItem(osmType, node);
					contentComponents = osmItemModel.osmContentComponents;
					return NodeFilter.FILTER_ACCEPT;
				}	
			}
		}
		return NodeFilter.FILTER_SKIP;
	}
	
	var walkerMoveTo = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, moveToChecker, false);
	walkerMoveTo.nextNode();
	walker.currentNode = walkerMoveTo.currentNode;
	readNodeContents(contentComponents);
}

function readNodeContents(contentComponentsFromModel, callbackFunction) {	
	var textToRead = "";
	for (var i = 0, len = contentComponentsFromModel.length; i < len; i++) {
		textToRead = textToRead + " " + contentComponentsFromModel[i];
	}
	mm_TTS.getAudio(textToRead.trim(), callbackFunction); // mm_TTS callback changed textToRead.trim() to just textToRead
}
