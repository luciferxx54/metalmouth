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

goog.provide('mm_Navigator');

console.log("loaded navigator");

mm_Navigator.reset = function()
{
	initWalker();
	initJump();
}

mm_Navigator.startReadingNodes = function()
{
	readNodesStop = false;
	readOn();
	
	function readOn()
	{
		walkerElementPlusText.currentNode = walker.currentNode;
		walker = walkerElementPlusText;
		
		if (readNodesStop != true)
		{
			walker.nextNode();
		}
		
		if (osmType == null)
		{
			goBackToStart();
		}
		else
		{
			if (readNodesStop != true)
			{
				readNodeContents(contentComponents, readOn);
			}
		}
	}
}

mm_Navigator.stopReadingNodes = function() // navigator.
{
	readNodesStop = true;
}

mm_Navigator.backToStart = function() // navigator. click and it enables and focuses on stop 
{
	initWalker();
	restoreHighlighter();
	mm_TTS.getAudio("Page start", false, null);
}

mm_Navigator.jump = function() // navigator.
{	
	jump();
}

mm_Navigator.readPrevNode = function() // navigator.
{
	readNodesStop = true; // to stop reading on
	
	walkerElementPlusText.currentNode = walker.currentNode;
	walker = walkerElementPlusText;
	
	walker.previousNode();
	
	if (osmType == null)
	{
		goBackToStart();
	}
	else
	{
		readNodeContents(contentComponents);
	}
}

mm_Navigator.readNextNode = function() // navigator.
{
	readNodesStop = true; // to stop reading on
	
	walkerElementPlusText.currentNode = walker.currentNode;
	walker = walkerElementPlusText;
	
	walker.nextNode();
	
	if (osmType == null)
	{
		goBackToStart();
	}
	else
	{
		readNodeContents(contentComponents);
	}
}

mm_Navigator.interact = function() // navigator.
{
	if (osmType != null)
	{
		switch(osmType)
		{
			case "Link":
				linkInteraction(walker.currentNode);
				break;
			case "Quote_Link":
				linkInteraction(walker.currentNode);
				break;
			case "Map_Area":
				linkInteraction(walker.currentNode);
				break;
			case "Skip_Link":
				skipLinkInteraction(walker.currentNode);
				break;
			case "Text_Box":
				textBoxInteraction(walker.currentNode, "text");
				break;
			case "Search_Box":
				textBoxInteraction(walker.currentNode, "search");
				break;
			case "Password_Box":
				textBoxInteraction(walker.currentNode, "password");
				break;
			case "Telephone_Box":
				textBoxInteraction(walker.currentNode, "telephone");
				break;
			case "Url_Box":
				textBoxInteraction(walker.currentNode, "url");
				break;
			case "Email_Box":
				textBoxInteraction(walker.currentNode, "e-mail");
				break;
			case "Number_Box":
				textBoxInteraction(walker.currentNode, "number");
				break;
			case "Date_Time_Box":
				textBoxInteraction(walker.currentNode, "date time");
				break;
			case "Date_Box":
				textBoxInteraction(walker.currentNode, "date");
				break;
			case "Month_Box":
				textBoxInteraction(walker.currentNode, "month");
				break;
			case "Week_Box":
				textBoxInteraction(walker.currentNode, "week");
				break;
			case "Time_Box":
				textBoxInteraction(walker.currentNode, "time");
				break;
			case "Range_Input":
				rangeInputInteraction(walker.currentNode);
				break;
			case "Button":
				buttonInteraction(walker.currentNode);
				break;
			case "Check_Button":
				checkButtonInteraction(walker.currentNode);
				break;
			case "Single_Select":
				singleSelectInteraction(walker.currentNode);
				break;
			case "Audio":
				audioInteraction(walker.currentNode);
				break;
			case "Video":
				videoInteraction(walker.currentNode);
				break;
		}
	}
}

var osmType;
var contentComponents;

function goBackToStart()
{
	initWalker();
	restoreHighlighter();
	mm_TTS.getAudio("Page start", false, null);
}

function jump()
{
	if (jumpAvailable == true)
	{
		walkerJump.currentNode = walker.currentNode;
		walker = walkerJump;
		walker.nextNode();
		if (osmType != null) 
		{
			readNodeContents(contentComponents);
		}
		else
		{
			initWalker(); // should allow a loop of headers
			jump();
		}
	}
	else
	{
		mm_TTS.getAudio("page does not contain headers", false, null);
	} 
}

function osmItemChecker(node) 
{			
	function textNodeOnlyChild()
	{
		if(node.parentElement.childNodes.length == 1)
		{
			return true;
		}
		return false;
	}
	
	function textNodeInSpecificElement()
	{
		var specificElements = ["AUDIO", "VIDEO", "IFRAME"]; // any which contain text to display if they are unsupported - removed CANVAS and OBJECT as text alternatives can be placed in the body
		
		if(specificElements.indexOf(node.parentElement.tagName) != -1)
		{
			return true;
		}
		return false;
	}
	
	function empty() // void elements are intended to be empty
	{
		var voidHtmlElements = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];
		var htmlsWeAllowToBeEmpty = ["VIDEO", "AUDIO", "CANVAS"]; // any others? we don't support OBJECT currently?
		
		if ((voidHtmlElements.indexOf(node.nodeName) == -1) && (htmlsWeAllowToBeEmpty.indexOf(node.nodeName) == -1) && (node.childNodes.length == 0))  
		{
			return true;
		}
		return false;
	}
	
	osmType = null; // reset each time due to interact()
	contentComponents = [];
	
	if(node.nodeName != "#text")
	{
		// detect and remove empty elements which are not designed to be empty
		
		if (empty() == false)
		{
			// need to skip over our tags 
			if (node.hasAttribute("data-mm-uicomponent") == false) // data-mm-uicomponent on each metalmouth component 
			{
				var osmItemModel = mm_OSEM.filter(node);
		
				if (osmItemModel != null) 
				{
					osmType = osmItemModel.osmType;
					drawCurrentElementHighlighterAreaFromLive(osmType, node);
					contentComponents = osmItemModel.osmContentComponents;
					return NodeFilter.FILTER_ACCEPT;
				}
			}
		}
	}
	else
	{
		if ((textNodeOnlyChild() == false)&&(textNodeInSpecificElement() == false))
		{
			if (node.data.trim() != "") // node.data != "\n"
			{
				osmType = "Text";
				drawCurrentElementHighlighterAreaFromLive(osmType, node.parentElement);
				contentComponents[0] = node.data;
				return NodeFilter.FILTER_ACCEPT;
			}
		}
	}
	return NodeFilter.FILTER_SKIP;
}

function jumpChecker(node) // jump to headers - this is what people do
{
	osmType = null; // reset each time due to interact()
	contentComponents = [];
	
	if ((node.nodeName == "H1")||(node.nodeName == "H2")||(node.nodeName == "H3")||(node.nodeName == "H4")||(node.nodeName == "H5")||(node.nodeName == "H6"))
	{
		var osmItemModel = mm_OSEM.filter(node);
		
		if (osmItemModel != null) 
		{
			osmType = osmItemModel.osmType;
			drawCurrentElementHighlighterAreaFromLive(osmType, node);
			contentComponents = osmItemModel.osmContentComponents;
			return NodeFilter.FILTER_ACCEPT;
		}
	}
	return NodeFilter.FILTER_SKIP;
}

// this should be initiate - this should be a singleton object

var walkerElementPlusText;
var walkerJump;
var walkerFirstChild;
var walkerLastChild;
var walker;

function initWalker()
{
	var walkerUnfiltered = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, null, false);
	walkerFirstChild = walkerUnfiltered.firstChild();
	walkerLastChild = walkerUnfiltered.lastChild();
	walkerUnfiltered = null;
	
	walkerElementPlusText = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, osmItemChecker, false);
	walkerJump = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, jumpChecker, false);
	walker = walkerElementPlusText;
}

var jumpAvailable = false;

function initJump()
{
	var headers = ["H1", "H2", "H3", "H4", "H5", "H6"];
	
	for (var i in headers)
	{
		if (document.getElementsByTagName(headers[i]).length > 0)
		{
			jumpAvailable = true;
		}
	}
}

var readNodesStop;

function moveTo(elementReference) // id or name, this is used for internal links
{
	function moveToChecker(node)
	{
		if ((node.hasAttribute("id"))||(node.hasAttribute("name")))
		{
			if ((node.getAttribute("id") == elementReference)||(node.getAttribute("name") == elementReference))
			{
				osmType = null; // reset each time due to interact()
				contentComponents = [];
				
				var osmItemModel = mm_OSEM.filter(node);
				
				if (osmItemModel != null) 
				{
					osmType = osmItemModel.osmType;
					drawCurrentElementHighlighterAreaFromLive(osmType, node);
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

function readNodeContents(contentComponentsFromModel, callbackFunction)
{
	var textToRead = ""; 
	for (var i in contentComponentsFromModel)
	{
		textToRead = textToRead + " " + contentComponentsFromModel[i];
	}
	mm_TTS.getAudio(textToRead.trim(), false, callbackFunction);
}

function linkInteraction(liveElementToInteractWith)
{
	document.location.href = liveElementToInteractWith.getAttribute("href");
}

function skipLinkInteraction(liveElementToInteractWith)
{
	var targetHref = liveElementToInteractWith.getAttribute("href").replace("#", "");
	moveTo(targetHref);
}

function textBoxInteraction(liveElementToInteractWith, enteredDataType)
{
	mm_ControlPanel.drawTextBoxInteract(liveElementToInteractWith, enteredDataType);
	
	mm_TTS.getAudio(enteredDataType + " entry area entered", false, onFocus);
	
	function onFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}

function rangeInputInteraction(liveElementToInteractWith)
{
	mm_ControlPanel.drawRangeInputInteract(liveElementToInteractWith);
	
	mm_TTS.getAudio("Range input entry area entered", false, onFocus);
	
	function onFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}

function buttonInteraction(liveElementToInteractWith)
{
	liveElementToInteractWith.click();
}

function checkButtonInteraction(liveElementToInteractWith)
{
	mm_ControlPanel.drawCheckButtonInteract(liveElementToInteractWith);
	
	mm_TTS.getAudio("check button entry area entered", false, onFocus);
	
	function onFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}

function singleSelectInteraction(liveElementToInteractWith)
{
	mm_ControlPanel.drawSelectMenuInteract(liveElementToInteractWith);
	
	mm_TTS.getAudio("single select drop-down menu entered", false, numberOfItems);
	
	function numberOfItems()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mm_TTS.getAudio((mmInteractionArea.children.length - 1)  + " selectable options, first option", false, changeFocus); // -1 takes into account the divider and the close button
	}
	
	function changeFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}

function audioInteraction(liveElementToInteractWith)
{
	mm_ControlPanel.drawMediaInteract(liveElementToInteractWith, "audio");
	
	mm_TTS.getAudio("audio control area entered", false, onFocus);
	
	function onFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}

function videoInteraction(liveElementToInteractWith)
{
	mm_ControlPanel.drawMediaInteract(liveElementToInteractWith, "video");
	
	mm_TTS.getAudio("video control area entered", false, onFocus);
	
	function onFocus()
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.children[0].focus();
	}
}
