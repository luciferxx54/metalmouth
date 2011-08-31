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

// start sequencer

var startSequencerFunctions = 
[
 removeExistingAccesskeys,
 initControlPanel,
 initOSM,
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

var controlPanel;
var osm;

function start()
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
	controlPanel = new MMControlPanelModel();
	sequencer();
}

function initOSM()
{
	osm = new OSMModel();
	sequencer();
}

function bringFocus()
{
	controlPanel.bringFocus();
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
	mmStyleArea.setAttribute("data-mm-uicomponent", "");
	mmStyleArea.innerText = "body{background-position:0px 22px;}ins{display:inline-block;}del{display:inline-block;}code{display:inline-block;}abbr{display:inline-block;}span{display:inline-block;}a{display:inline-block;}#_mm_ShieldImage{position:absolute;top:0px;left:0px;z-index:" + (parseInt(highestZIndex) + 1) + ";}#_mm_NavArea{position:fixed;top:0px;left:0px;width:2%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InfoArea{position:fixed;top:0px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 2) + ";padding:0px;}#_mm_InteractArea{position:fixed;top:23px;left:0px;width:100%;height:22px;background-color:#C0C0C0;border:1px solid #808080;z-index:" + (parseInt(highestZIndex) + 4) + ";padding:0px;}#_mm_Highlighter{position:absolute;z-index:" + (parseInt(highestZIndex) + 3) + ";}"; // #_mm_HighlighterLegend{background-color:#FFFFFF;color:#000000;position:absolute;top:-14px;border:1px solid #FF8C00;text-size:80px;} 
	headElement.appendChild(mmStyleArea);
		
	var mmPushDown = document.createElement("div");
	mmPushDown.id = "_mm_PushDown"; // needs to be removed in initMmId upon dom change
	mmPushDown.className = "_mm_PushDown"; // for removal from DOM clone
	mmPushDown.setAttribute("data-mm-uicomponent", "");
	mmPushDown.style.width = "100%"; 
	mmPushDown.style.height = "22px";
	document.body.insertBefore(mmPushDown, document.body.firstChild);

	var mmShieldImage = new Image();
	mmShieldImage.id = "_mm_ShieldImage"; // needs to be removed in initMmId upon dom change
	mmShieldImage.className = "_mm_ShieldImage"; // for removal from DOM clone
	mmShieldImage.setAttribute("data-mm-uicomponent", "");
	mmShieldImage.style.cssText = "width:"  + document.body.scrollWidth + "px;height:" + document.body.scrollHeight + "px;";
	document.body.insertBefore(mmShieldImage, document.body.children[1]);
		
	var mmContainer = document.createElement("div")
	mmContainer.id = "_mm_Container";
	mmContainer.className = "_mm_Container"; 
	mmContainer.setAttribute("data-mm-uicomponent", "");
	document.body.appendChild(mmContainer);
		
	mmContainer = document.getElementById("_mm_Container");
		
	if (mmContainer != null)
	{
		var mmNavArea = new CP_NavArea();
		mmNavArea.add();
		
		var mmInfoArea = new CP_InfoArea();
		mmInfoArea.add();
		
		// Control panel buttons
		
		var mmNavigationModeFocus = new NavigationModeFocus();
		mmNavigationModeFocus.add();
		
		var mmChangeLocationButton = new ChangeLocationButtonModel(); // shortkey B
		mmChangeLocationButton.add();
		
		var mmDivider = new CP_Divider();
		mmDivider.add();
		
		var mmCurrentItemDisplay = new CurrentItemDisplayModel();
		mmCurrentItemDisplay.add();
		
		// Areas
		
		var mmHighlighter = document.createElement("div"); // div
		mmHighlighter.id = "_mm_Highlighter";
		mmHighlighter.setAttribute("data-mm-uicomponent", "");
		mmHighlighter.style.cssText = "display:none;"; 
		mmContainer.appendChild(mmHighlighter);
		
		var mmInteractArea = new CP_InteractArea();
		mmInteractArea.add();
	}
	
	this.bringFocus = function()
	{
		getAudio("Reading all items", true, function(){mmNavigationModeFocus.focusNoAudio();initWalker();initJump();startReadingNodes();});
	}
	
	this.changeDisplayedCurrentItem = function(currentItemName)
	{
		mmCurrentItemDisplay.setValue(currentItemName);
	}
	
	// interact actions
	
	this.drawTextBoxInteract = function(liveTextInputElement, enteredDataType) // node ref needed so enter can set the values in the model and in the live site
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
			getAudio(enteredDataType + " entry area closed. Navigation mode entered.", false, function(){mmNavigationModeFocus.focusNoAudio();});
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
				var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
				mmInteractionArea.appendChild(tBTextEntry);
			}
		}
		
		function TBEnterButton()
		{
			var tBEnterButton = iap_Button.template();
			tBEnterButton.id = "_mm_TBEnterButton";
			tBEnterButton.setAttribute("data-mm-uicomponent", "");
			tBEnterButton.setAttribute("value", "Enter");
			tBEnterButton.setAttribute("title", "Enter");
			tBEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
			tBEnterButton.addEventListener("click", function(){enter();cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(tBEnterButton);
			}
		}
	}
		
	this.drawCheckButtonInteract = function(liveCheckInputElement) // - services radio button and checkboxes
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
			getAudio("check button entry area closed. Navigation mode entered.", false, function(){mmNavigationModeFocus.focusNoAudio();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function enter(e)
		{
			if (e.srcElement.value == "checked")
			{
				liveCheckInputElement.setAttribute("checked", "checked")
			}
			else
			{
				liveCheckInputElement.removeAttribute("checked");
			}
		}
		
		function CheckButtonModel()
		{
			var checkButton = iap_Button.template();
			checkButton.id = "_mm_CheckButton";
			checkButton.setAttribute("data-mm-uicomponent", "");
			checkButton.setAttribute("value", "checked");
			checkButton.setAttribute("title", "Check");
			checkButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADc0lEQVQ4Ea2VeUgUcRTHvzPzmz1akxLbnCAiEqPoAikDiYrchCgiKf8oyg6MIklKKzIyovsOjCLosJNKrLRTkoggWiq68+qQRE1B0Uq3nd2dmd5v1yNzJwp6C7u/mffe573f+733W8EwDHCJmndh5tSxykq7hcVAhBZ8+Zdfhg6p+bv6rqS4bIfxKrOSuwkcPCO3NGOJa9iuhOHOCLtVQijUX1K5GTk0fVNR+qKuOu96xfz3p1PciFtasKjIXUP8/yP7Ct98gDNnoDQ7LfN2enJcX7tF+ocUzU2ZJES5W/VGFhVpVWQmdFn6NAM5R0tQ8/Ed9IAPAn3CC+2f2eFKmoblM0d3mfSxMihRNoVR4QNUZrlTo0sC7ly/iDJ3CaKHjgvCO3XdvxROktBc9gBO5xngFzDvBd0QNNZtHFrx/ASKNj4pFTcv5ZEVYCErNRDS87VGPfOpGUhMiAdDh+I3UC9wJ17U/XDaQ08tKjDQEVq3Eae/FfD5DQpAEYTwpRJ/C9T9SA687Y4XPUPi3A2o+KLiqx9wpW3D5mO34KG1RGUzE5OMAYeN4X7VD6zKWA2t9jEWrQogWhkC98VcuK8p8NhLycZixqUZM5EfVNSJQ21Yu24jLH1j8PTaQdw5mgnR4sDCzFykThkGr0ppm4gpOKDpcMgCtq+ehZFJi7vcnaNc2Jm7AiMUKx2o+eSbgmVG7eTRkb7pJF7dOtIBltHwvBjpGVvx5EMbbLL5UJmCreT0tt6HgkvnYPja4Fq2Ewu3nKUAOu4W5qP0ZR2svPdMxFTT7vVjcqwN5/NP4NCpIpzevwbOfiJaWr9heuIYzEkejgPZPhMsDWVYDY2PKIWGMWVSLFImZXWZ3Ti8PLhu9PDc+YZ5U/aWsGBJ1FFXXY7sQ1eh+72giwV+OkzOYJIYRLWp1MPtjUQM38tMEMGEX6bHoEvIoYxAVWU5Du7e2juVjjci8eTIGLCIAT1sOEoUDIk1taq1voA+uFNrIcW5A9kI6OshcO8/iEZJRNp6lqLdG0B9i6cWsWmXUwsffdb/xzWvabqx68rrcgzKimbv81OvTN9YEkmTtndCXHT/CLtM117PLP6QdLDCfPuNrV7ce15fmVdctsCo298U/M/jjvKs/CnJ8YOXRVglRYdgPlK9o9ARGUJDi1rx8IR7j9G8pZab/ATuk8tp2lm2nwAAAABJRU5ErkJggg=="; 
			checkButton.addEventListener("click", function(e){enter(e);cancelInput();}, false);
			
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
			uncheckButton.setAttribute("data-mm-uicomponent", "");
			uncheckButton.setAttribute("value", "unchecked");
			uncheckButton.setAttribute("title", "Uncheck");
			uncheckButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACT0lEQVQ4EWP8//8/Awgwusw29bBWyObjYpNj+P//L1iQWOI/I/P7L7/u7t5+o///udxrYPNABlsWbg1K8VCdaq0tLsHPzQY0F2IZseYyMjAyvPv8k+HA5RePZm25kXRxRsBeBl6/BdYLdt3+AjSMKmDa5usvGWymqDF7RufOyfbR0AS5lBqAh5OF+9qLb2wsAjxs0twcLChmti0+xnD7xlWG/39+AAOfEUUOwQEGFzMHg4GhIUNBiAlcmJeTjUGYj0MOaOL/v//QwnT7lg0MR9bOYOBVNGT4++cXXBMyg5mZleHz3TMM7zLqUQwGhicwjhj+oDoVqpOJ4ReDkrkHw67tqxjY0SyFGf7+FyODi5MHAwvDb5gQCo3VYKD/GRiBKU6ejwGoEXtQ8ALN+/8PlCqxyzOhWIPG+fkPTQCJ+xO7Q+Eq8BoMV0UGY9RgeKANl6AAZgomZhYGbjz+4eECpmAmZqDXsZeEWDMIE7B8+PDyEUPltO0MTH++Y2gFFR+//rMzfH//FGdRwsL0n4EFZBAy4BBWZHj/cRdDR20JTheBTGQBOpiVXwZZK1CYkYGJ6T8zy/tvf559+/lHS4iXHa5gQnUSw7eyJKACUBGOG/z595+Bjx1VxZcfvxnefv71lEEgcJH94n13v1GllAcaMmPbjTcMtpO0WN6viz1oV7oj6e/ff1NstMWFeTlZcTsRj8yHr7+AVdPz5zO33Ur+fyj3GiOo/AQBVu+Fdp7mMnnAQl8emBj+4DEDQwpYVrF8/vbnztZD93v+70s5C1IAAH/cVPmhj9oJAAAAAElFTkSuQmCC"; 
			uncheckButton.addEventListener("click", function(e){enter(e);cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(uncheckButton);
			}
		}
	}
	
	this.drawSelectMenuInteract = function(liveSelectInputElement)
	{
		mmInteractArea.clear();
		
		var mmCloseMenuButton = new CloseMenuButtonModel("select", null); // new OptionCloseButtonModel();
		
		// get all options and add them as buttons
		
		var options = liveSelectInputElement.getElementsByTagName("option");
		
		var count = 0;
		for (var i in options)
		{
			if (options[i].tagName == "OPTION")
			{
				var iap_OptionButtonModel = new IAP_OptionButtonModel()
				var mmOptionButton = iap_OptionButtonModel.template();
				mmOptionButton.id = count;
				mmOptionButton.setAttribute("data-mm-uicomponent", "");
				mmOptionButton.setAttribute("value", options[i].innerText);
				mmOptionButton.setAttribute("title", options[i].innerText);
				mmOptionButton.addEventListener("click", function(e){mmCloseMenuButton.click();optionSelected(e)}, false); // mirror this above in text input for enter
				mmInteractArea.addOptionToThisMenu(mmOptionButton);
				count++;
			}
		}
		
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
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
	
	this.drawRangeInputInteract = function(liveTextInputElement) // - services input elements with a type attribute set to range
	{
		var iap_Button = new IAP_ButtonModel();
		var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
		var min = liveTextInputElement.getAttribute("min");
		var max = liveTextInputElement.getAttribute("max");
		var step = liveTextInputElement.getAttribute("step");
		var currentValue = liveTextInputElement.value;
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
			getAudio("range input entry area closed. Navigation mode entered.", false, function(){mmNavigationModeFocus.focusNoAudio();});
			mmInteractionArea.innerHTML = ""; 
			mmInteractionArea.style.display = "none";
		}
		
		function enter()
		{
			liveTextInputElement.value = currentValue;
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
			increaseValueButton.setAttribute("data-mm-uicomponent", "");
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
			decreaseValueButton.setAttribute("data-mm-uicomponent", "");
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
			rangeEnterButton.setAttribute("data-mm-uicomponent", "");
			rangeEnterButton.setAttribute("value", "Enter");
			rangeEnterButton.setAttribute("title", "Enter");
			rangeEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
			rangeEnterButton.addEventListener("click", function(){enter();cancelInput();}, false);
			
			this.add = function()
			{
				var mmInteractionArea = document.getElementById("_mm_InteractArea");
				mmInteractionArea.appendChild(rangeEnterButton);
			}
		}
	}
	
	this.drawMediaInteract = function(liveMediaElement, mediaType) // - services video and audio
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
		
		var mmCloseMenuButton = new CloseMenuButtonModel(mediaType, null);
		mmInteractArea.addCloseButtonToThisMenu(mmCloseMenuButton);
		
		mmInteractArea.show();
		
		function controlMedia(actionName)
		{
			switch(actionName)
			{
				case "play":
					liveMediaElement.play();
					getAudio(mediaType + " playing", false, function(){document.getElementById("_mm_PauseButton").focus();});
					break;
				case "pause":
					liveMediaElement.pause();
					getAudio(mediaType + " paused", false, function(){document.getElementById("_mm_PlayButton").focus();});
					break;
				case "rewind":
					liveMediaElement.currentTime = 0;
					liveMediaElement.pause();
					getAudio(mediaType + " rewound", false, function(){document.getElementById("_mm_PlayButton").focus();});
					break;
			}
		}
		
		function PlayButtonModel()
		{
			var playButton = iap_Button.template();
			playButton.id = "_mm_PlayButton";
			playButton.setAttribute("data-mm-uicomponent", "");
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
			pauseButton.setAttribute("data-mm-uicomponent", "");
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
			rewindButton.setAttribute("data-mm-uicomponent", "");
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
	
	function CP_NavArea() // should have a this.addButton function - see CP_InteractArea
	{
		var navArea = document.createElement("div");
		navArea.id = "_mm_NavArea";
		navArea.setAttribute("data-mm-uicomponent", "");
		addHandlers();
		
		this.add = function()
		{
			mmContainer.appendChild(navArea);
		}
		
		this.appendChild = function(elementToAppend)
		{
			navArea.appendChild(elementToAppend);
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
			navArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
			navArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
		}
		
		function removeHandlers()
		{
			navArea.removeEventListener("keydown", hotKeyDown, false);
			navArea.removeEventListener("keyup", hotKeyUp, false);
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
						buttonName = mmChangeLocationButton; 
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
			if (arrowSelected == "Enter")
			{
				interact();
			}
			else if(arrowSelected == "Up")
			{
				readPrevNode();
			}
			else if(arrowSelected == "Down")
			{
				readNextNode();
			}
			else if(arrowSelected == "Space")
			{
				if (readNodesStop == true)
				{
					startReadingNodes();
				}
				else
				{
					stopReadingNodes();
				}
			}
			else if(arrowSelected == "Right")
			{
				jump();
			}
			else // if(arrowSelected == "Right")
			{
				backToStart();
			}
		}
		
		function setAlreadyBusy(value)
		{
			alreadybusy = value;
		}
	}
	
	function CP_InfoArea() // should have a this.addButton function - see CP_InteractArea
	{
		var infoArea = document.createElement("div");
		infoArea.id = "_mm_InfoArea";
		infoArea.setAttribute("data-mm-uicomponent", "");
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
						buttonName = mmNavigationModeFocus; 
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
			buttonName.focus();
			setAlreadyBusy(false);
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
		interactArea.setAttribute("data-mm-uicomponent", "");
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
					case "U+001B": // escape
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
		var cpDivider = document.createElement("span");
		cpDivider.innerText = "|";
		cpDivider.setAttribute("data-mm-uicomponent");
		cpDivider.style.cssText = "float:left;margin-left:5px;margin-right:5px;";
		
		this.add = function()
		{
			mmInfoArea.appendChild(cpDivider);
		}
	}
	
	function CP_ModeFocusModel()
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
					getAudio(e.srcElement.getAttribute("title"), false, null);
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
				optionButton.setAttribute("data-mm-uicomponent", "");
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
		divider.setAttribute("data-mm-uicomponent");
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
	
	function NavigationModeFocus()
	{
		var button = new CP_ModeFocusModel();
		var navigationModeFocus = button.template();
		navigationModeFocus.id = "_mm_NavigationModeFocus";
		navigationModeFocus.setAttribute("data-mm-uicomponent", "");
		navigationModeFocus.setAttribute("type", "image");
		navigationModeFocus.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4//8/AwAI/AL+5gz/qwAAAABJRU5ErkJggg==");
		navigationModeFocus.setAttribute("accesskey", "c");
		navigationModeFocus.setAttribute("title", "Navigation mode");
		
		this.add = function()
		{
			mmNavArea.appendChild(navigationModeFocus);
		}
		
		this.focusNoAudio = function()
		{
			button.noAudio();
			navigationModeFocus.focus();
		}
		
		this.focus = function()
		{
			navigationModeFocus.focus();
		}
	}
	
	function CloseMenuButtonModel(menuName, menuButtonName) // generic sits in change location sub menu
	{
		// constructor
		var iap_Button = new IAP_ButtonModel();
		var closeMenuButton = iap_Button.template();
		closeMenuButton.id = "_mm_CloseMenuButton";
		closeMenuButton.setAttribute("data-mm-uicomponent", "");
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
				getAudio(menuName + " menu closed. Navigation mode entered.", false, function(){mmNavigationModeFocus.focusNoAudio();});
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
	
	function ChangeLocationButtonModel()
	{
		// constructor
		var button = new CP_ButtonModel();
		var changeLocationButton = button.template();
		changeLocationButton.id = "_mm_ChangeLocationButton";
		changeLocationButton.setAttribute("data-mm-uicomponent", "");
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
		backButton.setAttribute("data-mm-uicomponent", "");
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
		newUrlButton.setAttribute("data-mm-uicomponent", "");
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
	
	function CurrentItemDisplayModel()
	{
		// constructor
		
		var displayBox = new CP_DisplayBoxModel();
		var currentItemDisplayArea = displayBox.template();
		currentItemDisplayArea.id = "_mm_CurrentItemDisplayArea";
		currentItemDisplayArea.setAttribute("data-mm-uicomponent", "");
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
	
	// Controller 
	
	var osmType;
	var contentComponents;
	
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
					var osmItemModel = osm.filter(node);
			
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
			var osmItemModel = osm.filter(node);
			
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
	
	var rootnode = document.body;
	var walkerElementPlusText;
	var walkerJump;
	var walkerFirstChild;
	var walkerLastChild;
	var walker;
	
	function initWalker()
	{
		var walkerUnfiltered = document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, null, false);
		walkerFirstChild = walkerUnfiltered.firstChild();
		walkerLastChild = walkerUnfiltered.lastChild();
		walkerUnfiltered = null;
		
		walkerElementPlusText = document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, osmItemChecker, false);
		walkerJump = document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT, jumpChecker, false);
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
	
	function startReadingNodes()
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
				getAudio("no next item", false, null);
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
	
	function stopReadingNodes()
	{
		readNodesStop = true;
	}
	
	function backToStart() // click and it enables and focuses on stop 
	{
		initWalker();
		restoreHighlighter();
		getAudio("Page start", false, null);
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
			getAudio("page does not contain headers", false, null);
		} 
	}
	
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
					
					var osmItemModel = osm.filter(node);
					
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
		
		var walkerMoveTo = document.createTreeWalker(rootnode, NodeFilter.SHOW_ELEMENT, moveToChecker, false);
		walkerMoveTo.nextNode();
		walker.currentNode = walkerMoveTo.currentNode;
		readNodeContents(contentComponents);
	}
	
	function readPrevNode()
	{
		readNodesStop = true; // to stop reading on
		
		walkerElementPlusText.currentNode = walker.currentNode;
		walker = walkerElementPlusText;
		
		walker.previousNode();
		
		if (osmType == null)
		{
			getAudio("no previous items", false, null);
		}
		else
		{
			
			readNodeContents(contentComponents);
		}
	}
	
	function readNextNode()
	{
		readNodesStop = true; // to stop reading on
		
		walkerElementPlusText.currentNode = walker.currentNode;
		walker = walkerElementPlusText;
		
		walker.nextNode();
		
		if (osmType == null)
		{
			getAudio("no next item", false, null);
		}
		else
		{
			readNodeContents(contentComponents);
		}
	}
	
	function readNodeContents(contentComponentsFromModel, callbackFunction)
	{
		var textToRead = ""; 
		for (var i in contentComponentsFromModel)
		{
			textToRead = textToRead + " " + contentComponentsFromModel[i];
		}
		getAudio(textToRead.trim(), false, callbackFunction);
	}
	
	function interact()
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
		controlPanel.drawTextBoxInteract(liveElementToInteractWith, enteredDataType);
		
		getAudio(enteredDataType + " entry area entered", false, onFocus);
		
		function onFocus()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.children[0].focus();
		}
	}
	
	function rangeInputInteraction(liveElementToInteractWith)
	{
		controlPanel.drawRangeInputInteract(liveElementToInteractWith);
		
		getAudio("Range input entry area entered", false, onFocus);
		
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
		controlPanel.drawCheckButtonInteract(liveElementToInteractWith);
		
		getAudio("check button entry area entered", false, onFocus);
		
		function onFocus()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.children[0].focus();
		}
	}
	
	function singleSelectInteraction(liveElementToInteractWith)
	{
		controlPanel.drawSelectMenuInteract(liveElementToInteractWith);
		
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
	
	function audioInteraction(liveElementToInteractWith)
	{
		controlPanel.drawMediaInteract(liveElementToInteractWith, "audio");
		
		getAudio("audio control area entered", false, onFocus);
		
		function onFocus()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.children[0].focus();
		}
	}
	
	function videoInteraction(liveElementToInteractWith)
	{
		controlPanel.drawMediaInteract(liveElementToInteractWith, "video");
		
		getAudio("video control area entered", false, onFocus);
		
		function onFocus()
		{
			var mmInteractionArea = document.getElementById("_mm_InteractArea"); 
			mmInteractionArea.children[0].focus();
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
			controlPanel.changeDisplayedCurrentItem(osmType + " (offscreen)");
		}
		else
		{
			controlPanel.changeDisplayedCurrentItem(osmType);
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
}

// OSM

function OSMModel()
{
	function OSMItemModel(osmType, osmContentComponents)
	{
		this.osmType = osmType;
		this.osmContentComponents = osmContentComponents;
	}
	
	this.filter = function(currentNode)
	{
		var relevantModel = null;
		
		switch(currentNode.tagName)
		{
			case "A": 
				var hrefValue = currentNode.getAttribute("href");
				if (hrefValue == null)
				{
					relevantModel = SkipTargetModel_ContentToRead; 
				}
				else
				{
					if (hrefValue[0] == "#")
					{
						relevantModel = SkipLinkModel_ContentToRead;
					}
					else
					{
						relevantModel = LinkModel_ContentToRead;
					}
				}
				break; 
			case "INPUT":
				var typeValue = currentNode.getAttribute("type");
				if (typeValue != null)
				{
					typeValue = typeValue.toLowerCase();
					if (typeValue == "text") // 
					{
						relevantModel = TextBoxModel_ContentToRead;
					}
					if (typeValue == "search") // 
					{
						relevantModel = TextBoxModel_ContentToRead;
					}
					if (typeValue == "password") // 
					{
						relevantModel = TextBoxModel_ContentToRead;
					}
					if ((typeValue == "button")||(typeValue == "image")||(typeValue == "submit")||(typeValue == "reset"))
					{
						relevantModel = ButtonModel_ContentToRead; 
					}
					if ((typeValue == "checkbox")||(typeValue == "radio"))
					{
						relevantModel = CheckButtonModel_ContentToRead;
					}
					if (typeValue == "telephone")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "url")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "e-mail")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "number")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "datetime")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "date")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "month")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "week")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "time")
					{
						relevantModel = FormatSpecificEntryBoxModel_ContentToRead;
					}
					if (typeValue == "range")
					{
						relevantModel = RangeInputModel_ContentToRead;
					}
				}
				break;
			case "BUTTON":
				relevantModel = ButtonModel_ContentToRead;
				break;
			case "TEXTAREA":
				relevantModel = TextBoxModel_ContentToRead;
				break;
			case "SELECT":
				if (currentNode.getAttribute("multiple") == null) // need to collect relevant models for rest - doing this cuts out stages
				{
					relevantModel = SingleSelectModel_ContentToRead;
				}
				break;
			case "FORM":
				relevantModel = FormModel_ContentToRead;
				break;
			case "P":
				relevantModel = ParagraphModel_ContentToRead;
				break; 
			case "H1":
				relevantModel = Level1HeaderModel_ContentToRead;
				break;
			case "H2":
				relevantModel = Level2HeaderModel_ContentToRead;
				break;
			case "H3":
				relevantModel = Level3HeaderModel_ContentToRead;
				break;
			case "H4":
				relevantModel = Level4HeaderModel_ContentToRead;
				break;
			case "H5":
				relevantModel = Level5HeaderModel_ContentToRead;
				break;
			case "H6":
				relevantModel = Level6HeaderModel_ContentToRead;
				break;
			case "ABBR":
				relevantModel = AbbrModel_ContentToRead;
				break;
			case "SPAN":
				if ((currentNode.parentElement.tagName == "BODY")||(currentNode.parentElement.tagName == "DIV")||(currentNode.parentElement.tagName == "UNSUPPORTED")) // parentElement introduced in DOMText at top of page, with UNSUPPORTED it is introduced in the model
				{
					relevantModel = SentenceModel_ContentToRead;
				}
				else
				{
					relevantModel = StaticTextModel_ContentToRead;
				}
				break;
			case "IMG":
				if (currentNode.getAttribute("role") != "presentation")
				{
					relevantModel = SemanticImageModel_ContentToRead;
				}
				break; 
			case "HEADER":
				relevantModel = PageHeaderAreaModel_ContentToRead;
				break;
			case "NAV":
				relevantModel = SiteNavigationAreaModel_ContentToRead;
				break;
			case "MENU":
				var menuType = currentNode.getAttribute("type"); 
				if (menuType != null)
				{
					if (menuType.toLowerCase() == "list")
					{
						relevantModel = MenuModel_ContentToRead;
					}
				}
				break;
			case "ARTICLE":
				relevantModel = SectionModel_ContentToRead; // should be the same for DIV
				break;
			case "SECTION":
				if (currentNode.getAttribute("role") == "main")
				{
					relevantModel = MainContentAreaModel_ContentToRead;
				}
				else
				{
					relevantModel = SectionModel_ContentToRead;
				}
				break;
			case "FOOTER":
				relevantModel = PageFooterAreaModel_ContentToRead;
				break;
			case "ADDRESS":
				relevantModel = PageContactDetailsModel_ContentToRead; 
				break;
			case "DIV":
				if (currentNode.getAttribute("role") != "presentation")
				{
					relevantModel = SectionModel_ContentToRead;
				}
				break;
			case "CANVAS":
				relevantModel = CanvasModel_ContentToRead; // Any text inside the between <canvas> and </canvas> will be displayed in browsers that do not support the canvas element. As Chrome supports canvas we need to be able to change out the canvas element for its contents - the easiest way is to say it is a layout division
				break;
			case "FIELDSET":
				relevantModel = InputGroupModel_ContentToRead;
				break;
			case "UL":
				relevantModel = BulletedListModel_ContentToRead;
				break;
			case "OL":
				relevantModel = NumberedListModel_ContentToRead;
				break;
			case "LI":
				if (currentNode.getAttribute("role") == "menuitem")
				{
					relevantModel = MenuItemModel_ContentToRead;
				}
				else
				{
					relevantModel = ListItemModel_ContentToRead;
				}
				break;
			case "MAP":
				relevantModel = MapModel_ContentToRead;
				break;
			case "AREA":
				relevantModel = MapAreaModel_ContentToRead;
				break;
			case "TABLE":
				if (currentNode.getAttribute("role") != "presentation")
				{
					relevantModel = DataTableModel_ContentToRead; 
				}
				break;
			case "TH":
				if (currentNode.getAttribute("role") != "presentation")
				{
					relevantModel = HeaderCellModel_ContentToRead; 
				}
				break;
			case "TD":
				if (currentNode.getAttribute("role") != "presentation")
				{
					relevantModel = DataCellModel_ContentToRead; 
				}
				break;
			case "BLOCKQUOTE":
				if (currentNode.getAttribute("cite") == null)
				{
					relevantModel = QuoteModel_ContentToRead;
				}
				else
				{
					relevantModel = QuoteLinkModel_ContentToRead;
				}
				break;
			case "INS":
				relevantModel = InsertionModel_ContentToRead;
				break;
			case "DEL":
				relevantModel = DeletionModel_ContentToRead;
				break;
			case "CODE":
				relevantModel = CodeModel_ContentToRead;
				break;
			case "AUDIO":
				relevantModel = AudioModel_ContentToRead;
				break;
			case "VIDEO":
				relevantModel = VideoModel_ContentToRead;
				break;
		}
		
		if (relevantModel != null)
		{
			var modelItem = new relevantModel(currentNode);
			var osmItemModel = new OSMItemModel(modelItem.name, modelItem.contentComponents());
			return osmItemModel;
		}
		return relevantModel;
	}
	
	function ElementModel_ContentToRead(baseElement) // element from live page DOM 
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
		
		this.children = function()
		{
			return baseElement.children;
		}
		
		this.selectedTextValue = function()
		{
			return baseElement[baseElement.selectedIndex].innerText;
		}
	}
	
	// SkipLinkModel-----------------------
	
	function SkipLinkModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Skip_Link";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray; 
		}
		
		function whatAmI()
		{
			return "Skip Link";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if (title == null)
			{
				title = ""; 
			}
			
			return title;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "") // originalElement.childNodes[0].data != "\n"
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// SkipTargetModels------------------------
	
	function SkipTargetModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Skip_Target";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Skip Link Target";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if (title == null)
			{
				title = ""; 
			}
			
			return title;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// LinkModels------------------------ 
	
	function LinkModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Link";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}			
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Link";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if ((title == null)||(title == ""))
			{
				title = ""; 
			}
			
			return title;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
		
	// QuoteLinkModels------------------------
	
	function QuoteLinkModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Quote_Link";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Quote link";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if ((title == null)||(title == ""))
			{
				title = ""; 
			}
			
			return title;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// MapModels------------------------
	
	function MapModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Map";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Map";
		}
		
		function titleValue()
		{
			// title forms part of the text to read out
			
			var title = baseElement.getAttribute("title");
			
			if ((title == null)||(title == ""))
			{
				title = ""; 
			}
			
			return title;
		}
	}
	
	// MapAreaModels------------------------
	
	function MapAreaModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Map_Area";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = altValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Map area";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function altValue()
		{
			// title forms part of the text to read out
			
			var alt = baseElement.getAttribute("alt");
			
			if ((alt == null)||(alt == ""))
			{
				alt = "Untitled"; 
			}
			
			return alt;
		}
	}
	
	// DataTableModels------------------------
	
	function DataTableModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Data_Table";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = summaryValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Data table";
		}
		
		function summaryValue()
		{
			// title forms part of the text to read out
			
			var summary = baseElement.getAttribute("summary");
			
			if ((summary == null)||(summary == ""))
			{
				summary = ""; 
			}
			
			return summary;
		}
	}
	
	// HeaderCellModels------------------------
	
	function HeaderCellModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Header_Cell"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Header cell";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// DataCellModels------------------------
	
	function DataCellModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Data_Cell";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = headerCellTitlesValue();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Data cell";
		}
		
		function headerCellTitlesValue()
		{
			var headerText = ""; 
			var headersAttributeValue = baseElement.getAttribute("headers");
			if (headersAttributeValue != null)
			{
				var headersAttributeValueArray = headersAttributeValue.split(',');
				for (var k in headersAttributeValueArray)
				{
					var trimmedValue = headersAttributeValueArray[k].trim();
					if (trimmedValue != "")
					{
						var relatedHeaderElement = document.getElementById(trimmedValue);
						if (relatedHeaderElement != null)
						{
							if (headerText == "")
							{
								headerText = relatedHeaderElement.innerText;
							}
							else
							{
								headerText = headerText + " and " + relatedHeaderElement.innerText;
							}
						}
					}
				}
			}
			
			if (headerText.trim() == "")
			{
				headerText = "No specified row or column";
			}
			else
			{
				headerText = "relates to " + headerText + "cell value";
			}
			
			return headerText;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// AudioModels------------------------
	
	function AudioModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Audio";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Audio";
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
			
			return title;
		}
		
		function interactable()
		{
			return "Interactable";
		}
	}
	
	// VideoModels------------------------
	
	function VideoModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Video";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Video";
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
			
			return title;
		}
		
		function interactable()
		{
			return "Interactable";
		}
	}
	
	// TextBoxModels------------------------
	
	function TextBoxModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
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
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = stateValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return type + " box";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.value(); 
			
			if (state == null)
			{
				state = "None";
			}
			
			return "Current value: " + state;
		}
	}
	
	// FormatSpecificEntryBoxModels------------------------
	
	function FormatSpecificEntryBoxModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
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
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = specifiedFormat();
			contentComponentsArray[contentComponentsArray.length] = stateValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{		
			return type;
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
		
		function specifiedFormat()
		{
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "No format specified";
			}
			
			return title;
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.value(); 
			
			if (state == null)
			{
				state = "None";
			}
			
			return "Current value: " + state;
		}
	}
	
	// RangeInputModels------------------------
	
	function RangeInputModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Range_Input";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = stateValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Range input";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.value(); 
			
			if (state == null)
			{
				state = "None";
			}
			
			return "Current value: " + state; // careful changing text as it is used in drawRangeInput above
		}
	}
	
	// ButtonModels------------------------
	
	function ButtonModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Button";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Button";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
	}
	
	// CheckButtonModels------------------------
	
	function CheckButtonModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Check_Button";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = stateValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Check Box";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.getAttribute("checked"); 
			
			if (state == null)
			{
				state = "Unchecked";
			}
			
			return "Current value: " + state;
		}
	}
	
	// SingleSelectModels------------------------
	
	function SingleSelectModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Single_Select";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = interactable();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = labelValue();
			contentComponentsArray[contentComponentsArray.length] = stateValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Single select drop-down";
		}
		
		function interactable()
		{
			return "Interactable";
		}
		
		function labelValue()
		{
			var label = "";
			
			var id = baseElement.getAttribute("id");
			var labelElements = document.getElementsByTagName("label");
			for (var i in labelElements)
			{
				if (labelElements[i].tagName != null)
				{
					var forAttribute = labelElements[i].getAttribute("for");
					if (forAttribute != null)
					{
						if (forAttribute == id)
						{
							label = labelElements[i].innerText;
							break;
						}
					}
				}
			}
			
			if (label == "")
			{
				label = "Unlabelled";
			}
			
			return label;
		}
		
		function stateValue()
		{
			// state forms part of the text to read out
			
			var state = baseElement.selectedTextValue();
			
			if (state == null)
			{
				state = "None";
			}
			
			return "Current value: " + state;
		}
	}
	
	// PageHeaderAreaModels------------------------
	
	function PageHeaderAreaModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Page_Header_Area"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Page header area";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// SiteNavigationAreaModels------------------------
	
	function SiteNavigationAreaModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Site_Navigation_Area";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Site navigation area";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// MenuModels------------------------
	
	function MenuModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Menu"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = titleValue();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Menu";
		}
		
		function titleValue()
		{
			var title = baseElement.getAttribute("title"); 
			
			if (title == null)
			{
				title = "None";
			}
			
			return title;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// MainContentAreaModel------------------------
	
	function MainContentAreaModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Main_Content_Area";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Main content area";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// PageFooterAreaModel------------------------
	
	function PageFooterAreaModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Page_Footer_Area";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Page footer area";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// PageContactDetailsModel------------------------
	
	function PageContactDetailsModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Page_Contact_Details"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Page contact details";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// LayoutDivisionModel------------------------
	
	function CanvasModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Canvas"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Canvas";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// SectionModel------------------------
	
	function SectionModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Section";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			// contentComponentsArray[contentComponentsArray.length] = title();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Section";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// SentenceModel------------------------
	
	function SentenceModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Sentence"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Sentence";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 1
	
	function Level1HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 1 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 1 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 2
	
	function Level2HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 2 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 2 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 3
	
	function Level3HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 3 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 3 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 4
	
	function Level4HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 4 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 4 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 5
	
	function Level5HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 5 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 5 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Header 6
	
	function Level6HeaderModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Level 6 Header"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Level 6 Header";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// Abbr 
	
	function AbbrModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Abbreviation"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			
			if (containsExpandAbbr() == true)
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.getAttribute("title");
			}
			else
			{
				if (containsTextNodeOnly() == true)
				{
					contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
				}
			}
			return contentComponentsArray;
		}
		
		function containsExpandAbbr()
		{
			if (originalElement.getAttribute("title") != null)
			{
				return true;
			}
			return false;
		}
				
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// ParagraphModel------------------------
	
	function ParagraphModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Paragraph"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Paragraph";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// QuoteModel------------------------
	
	function QuoteModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Quote";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Quote";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// InsertionModel------------------------
	
	function InsertionModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Insertion";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = insertedWhen();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Insertion";
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
				
				datetime = " on the " + datetime; 
			}			
			
			return "The following was inserted into the page" + datetime;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// DeletionModel------------------------
	
	function DeletionModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Deletion";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = deletedWhen();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Deletion";
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
			
			return "The following was deleted from the page" + datetime;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// CodeModel------------------------
	
	function CodeModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Code";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Code";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// BulletedListModel------------------------
	
	function BulletedListModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Bulleted_List";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = numberOfChildren();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Bulleted list";
		}
		
		function numberOfChildren()
		{
			var number = baseElement.children().length;
			var text = "items";
			
			if (number == 1)
			{
				text = "item"
			}
			
			return number + " " + text + " listed";
		}
	}
	
	// NumberedListModel------------------------
	
	function NumberedListModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Numbered_List";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = numberOfChildren();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Numbered list";
		}
		
		function numberOfChildren()
		{
			var number = baseElement.children().length;
			var text = "items";
			
			if (number == 1)
			{
				text = "item"
			}
			
			return number + " " + text + " listed";
		}
	}
	
	// ListItemModel------------------------
	
	function ListItemModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "List_Item";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			var positionInList = baseElement.getAttribute("positionInList"); 
			
			var text = ""; 
			
			if (positionInList != null)
			{
				text = " " + positionInList;
			}
			
			return "List item" + text;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// MenuItemModel------------------------
	
	function MenuItemModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Menu_Item";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			
			return contentComponentsArray;
		}
		
		function whatAmI()
		{		
			return "Menu item";
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// FormModel------------------------
	
	function FormModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Form";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = nameValue();
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Form";
		}
		
		function nameValue()
		{
			var name = baseElement.getAttribute("name"); 
			
			if (name == null)
			{
				name = "Untitled";
			}
			
			return name;
		}
	}
	
	// InputGroupModel------------------------
	
	function InputGroupModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Input_Group";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = title();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Input group";
		}
		
		function title(selectionTitle)
		{		
			var legend = null;
			var children = baseElement.children(); // direct children
			
			for (var i in children)
			{
				if (children[i].tagName == "LEGEND")
				{
					legend = children[i].innerText;
					break;
				}
			}
			
			if (legend == null)
			{
				legend = "Untitled";
			}
			else
			{
				legend = "headed " + legend;
			}
			return legend;
		}
	}
	
	// StaticTextModel------------------------
	
	function StaticTextModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Static_Text"; 
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			if (containsTextNodeOnly() == true) // need to add these to elements which can hold content, but which are not layout elements
			{
				contentComponentsArray[contentComponentsArray.length] = originalElement.childNodes[0].data;
			}
			return contentComponentsArray;
		}
		
		function containsTextNodeOnly()
		{
			if (originalElement.childNodes.length == 1)
			{
				if (originalElement.childNodes[0].nodeName == "#text")
				{
					if (originalElement.childNodes[0].data.trim() != "")
					{
						return true;
					}
				}
			}
			return false;
		}
	}
	
	// SemanticImageModel------------------------
	
	function SemanticImageModel_ContentToRead(originalElement)
	{
		var baseElement = new ElementModel_ContentToRead(originalElement);
		
		this.name = "Semantic_Image";
		
		this.contentComponents = function()
		{
			var contentComponentsArray = [];
			contentComponentsArray[contentComponentsArray.length] = whatAmI();
			contentComponentsArray[contentComponentsArray.length] = altValue();
			contentComponentsArray[contentComponentsArray.length] = longdescValue();
			return contentComponentsArray;
		}
		
		function whatAmI()
		{
			return "Semantic Image";
		}
		
		function altValue()
		{
			// alt forms part of the text to read out
			
			var alt = baseElement.getAttribute("alt"); 
			
			if (alt == null)
			{
				alt = "None";
			}
			
			return "Alternative Text: " + alt;
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
				longDesc = "Long Description: " + longDesc;
			}
			return longDesc;
		}
	}
}

