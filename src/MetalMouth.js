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
		 
		// Areas
		
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

			var interactionItems = ["Link", "Skip_Link", "Text_Box", "Button", "Check_Button", "Single_Select"];
			
			if (interactionItems.indexOf(osmNodeToRead.className.replace("_mm_", "")) != -1)
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
	
	// interact actions
	
	this.drawTextBoxInteract = function(textInputElement) // node ref needed so enter can set the values in the model and in the live site
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		
		var mmTBTextEntry = new TBTextEntry();
		mmTBTextEntry.add();
		 
		var mmTBEnterButton = new TBEnterButton();
		mmTBEnterButton.add();
		
		var mmTBCloseButton = new TBCloseButton();
		mmTBCloseButton.add();
		 
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
		
		function TBCloseButton()
		{
			var tBCloseButton = iap_Button.template();
			tBCloseButton.id = "_mm_CancelButton";
			tBCloseButton.setAttribute("value", "Close");
			tBCloseButton.setAttribute("title", "Close text entry area");
			tBCloseButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII="; 
			tBCloseButton.addEventListener("click", function(){cancelInput()}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(tBCloseButton);
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
		
		var mmCNCCloseButton = new CNCCloseButtonModel();
		mmCNCCloseButton.add();
		 
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
		
		function CNCCloseButtonModel()
		{
			var cNCCloseButton = iap_Button.template();
			cNCCloseButton.id = "_mm_CloseButton";
			cNCCloseButton.setAttribute("value", "Close");
			cNCCloseButton.setAttribute("title", "Close check button entry area");
			cNCCloseButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII=";
			cNCCloseButton.addEventListener("click", function(){cancelInput()}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(cNCCloseButton);
			}
		}
	}
	
	this.drawSelectMenuInteract = function(selectInputElement)
	{
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		mmInteractionArea.innerHTML = "";
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
				mmOptionButton.addEventListener("click", function(e){cancelSelect();optionSelected(e, selectInputElement)}, false); // mirror this above in text input for enter
				mmInteractionArea.appendChild(mmOptionButton);
				count++;
			}
		}
		
		var mmOptionCloseButton = new OptionCloseButtonModel();
		mmOptionCloseButton.add();
		 
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
		
		function OptionCloseButtonModel()
		{
			var iap_Button = new IAP_ButtonModel();
			var optionCloseButton = iap_Button.template();
			optionCloseButton.id = "_mm_CloseButton";
			optionCloseButton.setAttribute("value", "Close");
			optionCloseButton.setAttribute("title", "Close drop-down menu");
			optionCloseButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII="; 
			optionCloseButton.addEventListener("click", function(){cancelSelect()}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(optionCloseButton);
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
		osmNode.children[2].innerText = "Current value: " + valueToSay; 
	}
	
	// Control Panel (CP) Base Models
	
	function CP_InfoArea()
	{
		var mmInfoArea = document.createElement("div");
		mmInfoArea.id = "_mm_InfoArea";
		addHandlers();
		
		this.add = function()
		{
			mmContainer.appendChild(mmInfoArea);
		}
		
		this.appendChild = function(elementToAppend)
		{
			mmInfoArea.appendChild(elementToAppend);
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
			mmInfoArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
			mmInfoArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
		}
		
		function removeHandlers()
		{
			mmInfoArea.removeEventListener("keydown", hotKeyDown, false);
			mmInfoArea.removeEventListener("keyup", hotKeyUp, false);
		}
		
		var hotKeyTimer;
		var keyBeingTimed;
		var buttonName; 
		var textIfButtonDisabled;
		var alreadyBusy; 
		
		function hotKeyDown_Handler(e)
		{
			if (alreadyBusy == false)
			{
				setAlreadyBusy(true);
				
				var selected = false; 
				
				switch(e.keyIdentifier.toString())
				{
					case "U+0047": // g - ReadPrevButton
						selected = true;
						keyBeingTimed = "U+0047"; 
						buttonName = mmReadPrevButton; 
						textIfButtonDisabled = "Read previous Button is currently disabled"; 
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0048": // h - ReadNextButton
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmReadNextButton; 
						textIfButtonDisabled = "Read next button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0046": // f - jump 
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmJumpButton; 
						textIfButtonDisabled = "Jump button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004A": // j - interact
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmInteractButton; 
						textIfButtonDisabled = "Interact button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0042": // b - change location 
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmChangeLocationButton; 
						textIfButtonDisabled = "Change location button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004B": // k - read on
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmReadOnButton; 
						textIfButtonDisabled = "Read on button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0044": // d - start of page
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmBackToStartButton; 
						textIfButtonDisabled = "Back to start button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+004C": // l - options
						selected = true;
						keyBeingTimed = "U+0048";
						buttonName = mmOptionsButton; 
						textIfButtonDisabled = "Options button is currently disabled";
						hotKeyTimer = window.setTimeout(functionToRun, 500);
						break;
					case "U+0053": // s - jump item selector
						selected = true;
						keyBeingTimed = "U+0048";
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
	
	function CP_TextBoxModel()
	{
		this.template = function()
		{
			var textBox = document.createElement("input");
			textBox.setAttribute("type", "text");
			textBox.style.cssText = "float:left;width:400px;height:16px;";
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
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.innerHTML = "";
			
			// get all options and add them as buttons
			
			var readOnlyElementItems = readOnlyElement.getAttribute("_mm_items").split(',')
			
			for (var i in readOnlyElementItems)
			{
				var optionButton = iap_Button.template();
				optionButton.id = i;
				optionButton.setAttribute("value", readOnlyElementItems[i].replace("_mm_", ""));
				optionButton.setAttribute("title", readOnlyElementItems[i].replace("_mm_", ""));
				optionButton.addEventListener("click", function(e){closeMenu();optionSelected(e, readOnlyElement, optionSelectedFunction)}, false); // mirror this above in text input for enter
				mmInteractionArea.appendChild(optionButton);
			}
			
			var mmCloseMenuButton = new CloseMenuButtonModel(menuName, menuButtonName);
			mmCloseMenuButton.add();
			
			mmInteractionArea.style.display = "";
			
			function optionSelected(e, selectElement, optionSelectedFunction)
			{
				// sets the navigate by item which the jump button then uses
				optionSelectedFunction(e.srcElement.value);
				// then refocus 
				selectElement.focus();
			}
			
			function closeMenu()
			{
				getAudio(menuName + " menu closed", false, function(){document.getElementById("_mm_ReadNextButton").focus();});
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.innerHTML = ""; 
				mmInteractionArea.style.display = "none";
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
				getAudio(e.srcElement.getAttribute("title") + " entered", true, function(){document.getElementById("_mm_ReadNextButton").focus();});
			}
		}
	}
	
	function NavigateByButtonModel() // replace NavigateByHolder
	{
		// constructor
		var optionSelectedFunction = function(value)
		{
			svb.setJumpableNodes(value);
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
				readCurrentNode(null, "Next item");
			}
		}
		
	}
	
	function CloseMenuButtonModel(menuName, menuButtonName) // generic sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var mmCloseMenuButton = iap_Button.template();
		mmCloseMenuButton.id = "_mm_CloseMenuButton";
		mmCloseMenuButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII=";
		mmCloseMenuButton.setAttribute("title", "Close menu");
		mmCloseMenuButton.addEventListener("click", function(){closeMenu()}, false);
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(mmCloseMenuButton);
		}
		
		function closeMenu()
		{
			getAudio(menuName + " menu closed", false, function(){document.getElementById(menuButtonName).focus();});
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
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
				readCurrentNode(null, "Previous item");
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
				readCurrentNode(null, "Next item");
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
			getAudio("Change location menu drop-down entered 4 options available", false, changeFocus);
			
			function changeFocus()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.children[0].focus();
			}
			
			drawChangeLocationSubMenu();
		}
		
		function drawChangeLocationSubMenu() // node ref needed so enter can set the values in the model and in the live site
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.innerHTML = "";
			
			var mmBackButton = new BackButtonModel();
			mmBackButton.add();
			
			var mmNewUrlButton = new NewUrlButtonModel();
			mmNewUrlButton.add();
			
			var iapDivider = new IAP_Divider();
			iapDivider.add();
			
			var mmCloseChangeLocationMenuButton = new CloseMenuButtonModel("Change location", "_mm_ChangeLocationButton");
			mmCloseChangeLocationMenuButton.add();
			
			mmInteractionArea.style.display = "";
		}
	}
	
	function BackButtonModel() // sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var backButton = iap_Button.template();
		backButton.id = "_mm_BackButton";
		backButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADQUlEQVQ4EZWVW0iUURDH/+e77LfrulaLq5llZgVdoItdIIkiTIOgKLq8SSQEQVAEQVEI9RJGFCEY9dKLFdSjEUEWgXiBHnoQESxLrDSzB8XU9bueZlZddL9d08Oe71vmzPxmzpwz8wkpJXjknm8q31cgrmTrKJICbkK40IeEOmrJnqZBpXbiUXk7mwkGl19vqjpZIuvK8uTSgAJMuVoolSCkGncFmgcx9KJPnGu/XdEoCi+8La/ZJl9XrZPGhAN4i6VO+1eJHlCBJ91i+EaLsl/blYvru2PSiBPU9hYeZaqmSwEpBN8Zw7KyYnFJi+jID5InXkgdvMWwLiAE/8s0JOK2BP3g0MzSJCKGV6CRVTpmwjvv4t2AJKdeIo/p0C6d9K4YkB+aWk3cBTLR0imzjHM2oYRR0/AUPz+9QiAY9qm6tgl9+SY8r7mKorAJc1YqfWDOiEE3Q6cppIqANQwxMgARMnxgYZnQcqLQKLmpmZwD5sVsknSNBeE6FkqilAJFhUIyRQv4wNJzoai6T84CimtqMJQOEn1WGFcaO9D8W8FXeykZzvE9o/7fd9KKC6N7zMDlZ2/wsbEOve1bUa9nwfzTA93I+i8oVSEJ1jUNDZ2jaHn1GCF7DENdrYm6DhkqNCMbkm7GYkYyFZbj4OKOJThRXQM3Uoi1e09hc0U1clZshGtPLoaZ0E1GzFUXVeO4f2w77OAdHNxQiMr1uTh+6y6Gf3QikObw5vOWBHNtcSOJELz2wApM2haCzig8x57PPuNaEswaU3AgFrCoIIB+csRgyhJUK+6DOKZDaTJ9chbMAbOA4TPNSLoO1OhqRNaU0s2YrllWmh4e7UqNrYPr+Q+WeoVU0/UYh3QjGEf9mcOQ6lFq0qm1RXQy9AhaHDIxSZ8G7m4cGD1UbcQUPyZsbM6jip3djRijk2ZplHOcOc8MMgnKnY1bwZgjMDwp+pS2797N1iHxlwuE26dGb+4TPPk/Rz7f5LTxjrPIloNp+4NfH/qVe4lP055rb4+cXoOHu3OxMkRZT7drssk4hJAYtwUowG/PP8uzHQ8qmxNgthBn3m85uFKejwSxitD+08iIpQVPKCMWej98cevky0M9rPoPklM6C19DN6sAAAAASUVORK5CYII=";
		backButton.setAttribute("alt", "Back");
		backButton.setAttribute("title", "Back"); 
		backButton.addEventListener("click", back, false);
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(backButton);
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
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(newUrlButton);
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
			uRLTextEntry.setAttribute("title", "Url text entry area");
			
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
			urlEnterButton.setAttribute("title", "Go button");
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
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.innerHTML = "";
			
			var mmSpeakSlowButton = new SpeakSlowButtonModel();
			mmSpeakSlowButton.add();
			
			var mmSpeakNormalButton = new SpeakNormalButtonModel();
			mmSpeakNormalButton.add();
			
			var mmSpeakFastButton = new SpeakFastButtonModel();
			mmSpeakFastButton.add();
			
			var iapDivider = new IAP_Divider();
			iapDivider.add();
			
			var mmCloseOptionsMenuButton = new CloseMenuButtonModel("Options", "_mm_OptionsButton");
			mmCloseOptionsMenuButton.add();
			
			mmInteractionArea.style.display = "";
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
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(speakSlowButton);
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
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(speakNormalButton);
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
		
		this.add = function()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea");
			mmInteractionArea.appendChild(speakFastButton);
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
	var jumpableNodeTypes = ["_mm_Section"]; // default value
	
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
		
		if (currentOSMNodeIndex <= osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(availableReadableNodes.indexOf(nodeType) == -1)
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
			}
		}
		return currentOSMNodeIndex;
	}
	
	this.jumpToAndReturnNextOSMNode = function()
	{
		currentOSMNodeIndex = nextOSMNodeIndex;
		nextOSMNodeIndex = nextOSMNodeIndex + 1;
		
		if (currentOSMNodeIndex <= osm.elementCount())
		{
			var node = document.getElementById("_mm_Replacement" + currentOSMNodeIndex);
			if (node != null)
			{
				var nodeType = node.className;
				if(jumpableNodeTypes.indexOf(nodeType) == -1)
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
					nextNode();
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