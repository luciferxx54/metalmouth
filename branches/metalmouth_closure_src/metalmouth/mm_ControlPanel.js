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

	// var mmNavArea = new CP_NavArea();
	// mmContainer.appendChild(mmNavArea.asHtml());
	
	var mmNavArea = document.createElement("div");
	mmNavArea.id = "_mm_NavArea";
	mmNavArea.setAttribute("data-mm-uicomponent", "");
	mmContainer.appendChild(mmNavArea);
	navAreaAddHandlers();
	
	// var mmInfoArea = new CP_InfoArea();
	// mmContainer.appendChild(mmInfoArea.asHtml());
	
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
	
	var mmChangeLocationButton = new ChangeLocationButtonModel(); // shortkey B
	goog.dom.getElement('_mm_InfoArea').appendChild(mmChangeLocationButton.asHtml());
	
	var mmDivider = document.createElement("span");
	mmDivider.innerText = "|";
	mmDivider.setAttribute("data-mm-uicomponent");
	mmDivider.style.cssText = "float:left;margin-left:5px;margin-right:5px;";
	goog.dom.getElement('_mm_InfoArea').appendChild(mmDivider);
	
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
	
	// var mmInteractArea = new CP_InteractArea();
	// mmContainer.appendChild(mmInteractArea.asHtml());
	
	var mmInteractArea = document.createElement("div");
	mmInteractArea.id = "_mm_InteractArea";
	mmInteractArea.setAttribute("data-mm-uicomponent", "");
	mmInteractArea.style.cssText = "display:none;";
	mmContainer.appendChild(mmInteractArea);
	interactAreaAddHandlers();
}

mm_ControlPanel.bringFocus = function()
{
	mm_TTS.getAudio("Reading all items", true, function(){focusNoAudio('_mm_NavigationModeFocus');mm_Navigator.reset();mm_Navigator.startReadingNodes();});  // focusNoAudio should be turned into a function - so only an id needs to be provided 
}

/*
mm_ControlPanel.changeDisplayedCurrentItem = function(currentItemName)
{
	goog.dom.getElement('_mm_CurrentItemDisplayArea').value = currentItemName;
}
*/

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
		tBEnterButton.setAttribute("title", "Enter");
		tBEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
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
			mmOptionButton.style.cssText = "float:left;";
			mmOptionButton.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
			mmOptionButton.id = count;
			mmOptionButton.setAttribute("data-mm-uicomponent", "");
			mmOptionButton.setAttribute("value", options[i].innerText);
			mmOptionButton.setAttribute("title", options[i].innerText);
			mmOptionButton.addEventListener("click", function(e){goog.dom.getElement('_mm_CloseMenuButton').click();optionSelected(e)}, false); // mirror this above in text input for enter
			mmInteractionArea.appendChild(mmOptionButton); // addOptionToThisMenu(mmOptionButton);
			count++;
		}
	}
	
	displayInteractionArea("select", null);
	
	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("title") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("title") + " option has focus", false, null);
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
					mm_TTS.getAudio("value to enter increased to " + currentValue, false, null);
				}
				else
				{
					mm_TTS.getAudio("maximum value " + currentValue + " reached", false, null);
				}
				break;
			case "decrease":
				if (parseInt(currentValue) - parseInt(changedStep) >= min)
				{
					currentValue = parseInt(currentValue) - parseInt(changedStep);
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
		increaseValueButton.setAttribute("title", "Increase value");
		increaseValueButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADkklEQVQ4EZ2Va2gcVRTH/3fu7Ozsbma3brXEhihCSqFNLCLYqokopTUWrH4JgdI2/ZC2WBobTAilFRMMSmoVDfhCC35oPii1SEvQBUGCNKVv2jSt9mUU62OladLsksxOZuZ6zppduybZ2lx25nL3nvu75z1CKQUepesTK59eEnhrflSroqUnFP7ZyO7e6aVk2lHJM0P+noH3V33A0oLBj7d8u7Z+uf5ZzSI9HgwAU3fdiZbfFwLwfWDgNy/z1WnvjYOvruwUePZQxZ4NVn9DtbHAcRU8EpjLYHhJEEgMenjnm8w2fUVluKGqXC7wfIVJby7IqTPkuHQGqCzTUPWg3K3NCyNuSDKliEd5S9foIbkiYlkXSpKzDBHXSNIrKkxQQyqk3CBGMyGEOAZFDOP40M8jfvHB1iBgof3TE3jpzV4k7Sj5UhSFM1EvhtU1Bd200NlzGQe7d5EeY9iasdH92jpUxFJI2bNHelaNNUpkMxRB9+Hr+Oj15iyUlTj5ZRca2z7GwF8liIbZnJnHjGCGlkRC2PfdCN7eTdDxPwpOX0x8iM3Ne3H0FxOxyMxGTwNTOsIKB/H5MRudba/AG7lWAM0thvp7sGV7BxI/SIIb4Dy+fUwDR0mD3vMKu1p3wv5zIC8bK1+Gx+rbaf2vhsmzh7F9WxsOnHJhRYLQboMXgNlnfVcDaG1tR2qoPw+FVY6Wji707F2PF5vfpUYQzu+NXulDU2MjPkkkEaR+kIPLiqc2PvdEhVxeFpf4/qrA1h1dGB7szR9EqAwvd76HHS+Uw/Ru4pkVizEceRiDF65QxsRgxEqp4UzixKVR6Pc/gqVlAqd+9pysXZJMSNsKRy6MYfWqGsyrWwPTNKHrAdwbj6Guej4mJ9JwPIFgYAwdm5ahtnofVSNlDmlpcEn6DjS6YNLlmptyGJeeTtXVssZCwKiZ0lYhWwbKx7idgaNENkAZl+pFy2D1EgaQhO/STA+VnIDEjTTBmJezmf3O3c1x7dxfBXMuLjxzB0zPUBw5//JBja/5b6oUEO9ywSxWWPt9xLucIiUDsxfR/0ZzZ5twgOG0uiSTN9b++MDSUG3lQllqmZRJdCML3O3DzYrPJM6741/0Oxt1da3u1n0NX9f7ntr/5CL5qGUKOZdPk0NBPXfd/enQGa/p1/21fdlvHtsqxAGjqumeLQuj6iElhJi9b033jFS+GJ0QN48fsXvU8eeHWOJv971DmIZVuAUAAAAASUVORK5CYII="; 
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
		decreaseValueButton.setAttribute("title", "Decrease value");
		decreaseValueButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADbUlEQVQ4EaWVWUhUURjH/3eZOzOalJpaUmFlVmL5oEF7Ly22QFRWJvVQRlqjUASB5FhRmdhLRZIZLW8VEfZQYETLU7YYREmQJRJE24M5zujs9/R9d+aOaWlZ5+Hec77zfb/zLWeRhBDgNn333W1zJivOMXFKBgRChvAvP0KC6urV37V0hKo7GlfcZDOJwQXOe47CfO1kfoZsVxUgutZfYgkiAcEw8LQj7LnxPFhx/8SyK9KUkubVB9ZYbxXmqarHP3KoubpM8DgrcPVJyFvb5Fuuzpqk7s+doKh9ASCsm2oj/+uUUV8QmD1RtudmWhxyvA2JmgXgif9tOjlms0iItyJZFkIKjzSnwznALF2IsMpK7KyVvFZkmXpStHiREPxBHQEqDKUw1jQqsKKQhCj9gbJd/8gAa6TU2qmj83MPEig3iqJApmrokJE9wYb0BB+4Bgy3a8BHtx1fXICFrLlohIS3rxeTkmRyLrK+AeZJu92GxqbHaLt1CpJNgyQrBnhuQRHqDxUh3d5DiwHtXQlwOC+h/cUDqOwA7TUfRTV/4z6c3DmDxuQBNQPsCwnkpgfRULkUZe4PaGtuiIX45HoNyiUZF44Wwe3TsbvyPM3XR9yKfvPW7kVtSTYyEgN49zUiNMAcoscvMC3Zj8a6PShTrXh1+3TMuOXaMVRQRB5X1y/QeUVVFNFmisiFXmIwi5sB5g4L3D6BqaN7cO54CcqoEK/vnOEpoz28XGV2Y//5W5yor96E8QRlxyzR/LLCT91+eOYYgtfsRM6q8hhkcGdB8aEBUNNTU28AmIVGWsjzLAO+CzkrHaZu7L9w62GCFmJc1NPBUFb8BWxac1qmJ7rJ81JkF+wxxVi07QjqneuRZu0ekNOYQrQTy/HgCR7zLshKZvgulPgCSE4Zi7MH1yFVo0JF9/Xv7Fg2LJgV3F6CJ3nQUFeKeItAivXPUANMh1Dl+3SoxlO8jWaM9RtH1jyBQ+qzgSQpcndvuN3tFVCHzHakoP6gQIDelWF8MI64i1hdHv2t+uCNv3rxNGXJ1FQtle+Bf72T2TE/LdzyPvTh0eO+OuNpynE0L9yQrzXSmzeT79OfLqmhIh4g51R6AxBPO0NtV5+Fd3Q0LGs1wKwlZTal5q0ZtT0lQUob0UtKtpzFbz349PLMt4tCFH9n3g9Gn08YtFwTeQAAAABJRU5ErkJggg=="; 
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
		rangeEnterButton.setAttribute("title", "Enter");
		rangeEnterButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAACmElEQVQ4Ee2VXUgUURTH/3fmzu66O21qayKVUREYhlFCpghRJFFUhoREpr1F+VxB0AfRm5APRS9aZFBQEok+lG8GQlFZgfSmFlGiJJqtu7Ozzsft3BXWXMe1hx49A8Pce+b+zse951wmhICUgoaefXu3hW7k6loJhHAY2Jwipc3+YgzqjOl8H/gSaxlqO9op/2YSXH2ht66uIr+9coue79cYcbODMrWMJmwX+PTNMLoGpi713qy5y0LHnpVdP7n+VUNVJC9J2hw/h6qqmWuzjl3XhWFayPEp6P7wy2l9OX6CV2wPny8rDuY55KZpCzx/+wPR6AwURfqxvLi0LhgM4VB5ERTmYkdxUCXeZb7KzwoCmpIKX3AdHY/v4POLNiJSbP8kDBuq6nHgfgslNg7OGfQcNcLJoHQ2JYx2gVtR+PMK0XSxFTq3QFF6igwoiQAe3b4CnpxKRyhZwoXDPVf5wmg8UonStUDC8ib7uILRGQ1P7uVC0JMp3mAymUgkEDMAcwmwRWAjYZN30vDi/VAyLf2v8Qo4ncmVVKRT4X2O6VwGAxrCQQZtiXPsp3P8W9YXVauXeIBlJ7bQNziOwYAN21lcVRKkUk3H3QCEM0vsxXAum/Tf8xY4zIkhXGvcT8u9y3neQ7n3BvQ1temilj2EXOF8MuaMxEyXPKAJM46Dh2uxc1c5eb0cdA4vmIrV+YVQrBgUH4ORdDEdt0YYKh+uu3p2a/+Z6sgm6vFQuA8q11Jm5z3L8kUeurYF25pN5fvpm8nora6xGi5eN42WnOuppyuqY/dmvTTkT6bDyoJboJIZls2Krqav3R+nmsc6j79L3XnyL1b0oGDPqaLmSJhvpJ7qvWMLcPMDBUyZNuyf/e8n2kXf6WGp+QP1tPFu71qjGQAAAABJRU5ErkJggg==";
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
		playButton.setAttribute("title", "Play");
		playButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADAElEQVQ4EZ2VW0gUURjH/2cuO7vuqmt0oQvipageAi2phCQQywK7gSRRJN7wgvWQSWaCYg+BLwWJ1oNgb1k9BYVKL0V0MSFJKURS8BJRpunqujs7s9N3ditH0XX1g7Nzzpnz/b7vfHPOf5lhGODG0p4lpKVKxU67sJmG/sBk+D/CL7cx/KZDbTZ6ssa4G+PgvVc6MrKT5fv74qQEmwwEQ4VPZbR0VgW6BrX+h91q3pfGY2+lmLPPk6pO2x5dTJVjOEoz5SqQhz/MKJII7Nlq2Sky9pgdbz8kpmfn3Tt3QE5yRjB4tCCIw3hTdQFWmcGrGYHxv/mlnpoOWGi3isyiRl2GIkTbWbzdyhZkyjO3SAxNnZNo79MRZbdAFPhsaPNRYg5irYtAosAMaH+/3wIvWbFhZKAPZSWVaOqYgKQ4KPuV689Z1LSQeSiKAs/Ye9ReKkBFYxfGfU5EWkO6/E8uvFXub2hrKEVuZQu6Rm2IptLwrYay8MABgh89T+8gt6gKra9mYLU5oEjLl2YV4GB+E587UVlSiOstvXAZ0XAobMlzv2owxxvTQ2itK8L5iha8GaQjRidosa0JHISo6O/twdBPDQK/SYuMqrQWE5F88jLqr13A/m1ezHjodiyy1YPtW5BTXocb+QexyeoiqEkDTPBVgaMS03C1pgb5GRvBfFNweUjFTDBzNzSYzbvtPlKMm9WFOLzDwOycC7qfLQvlAUKAST+8c4AYgxNltagtTUesw4XpWb71+YDmLM19yTAYKZ15KtjXNS8kZyzKbzWjMmcXZH0K0xRniaULnAMsAaLkVv3jqg90RQHzt/V6fSjNikPcBgl+1YU5SnQlKFdAj0ql8hg/hE+DRsPHYU21WRgkesEDCPRkFDphPemwpga0mM8t28hHJqG3UGF7Rvyu7gH9buCvKbO6s+BMiuV2SrwYyReElpcFOw8M+E5U0uJ3X/XJJx/U0pcNR9sCYP42Nr/jVOp2sYpkMY6SpWXhG+mv9NvtH3g9oNd/f5D5gnv+Ac3vF2uTPY7FAAAAAElFTkSuQmCC"; 
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
		pauseButton.setAttribute("title", "Pause");
		pauseButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAChElEQVQ4Ee1VS0hUURj+zn2Nd8bxwYhFk1BQbTIKhDIMC8yE9j1Aowymhe2aRYsWtYgoKKOFCAlFEQQ9qE0gRBlSKbZskUS2SKiF9iC1mbmvv/+/V8dJy127+Ye559zvP+c73/24fFcREaRWdw227Wk0r9RVolERfIaiRthd8aJIQZ+eobfPxv1TU7c6hmS1EuLm7NP9h3cYt1s3GamYAQRMqRT/+RfxKz4lOmcpJro0Xpb3gOFx7+vdMadrrLdjUKH1ccOFTNVI9y4z7bJOP4jUyQY9loDSNFAQwHfmwoZulWCFuVCANHQNMHXgxitv8kzf7E6jaZt9qHGtnhY9QiwVtxSG3/u4evMRdG8GrpbA6Uw75LBLAw9h0Rx8I4ns8Xa0bNSQcwgB7zWYeMsarWFrk3XQqK1EjcUAiyqWYh8KvobRB32A943xJPLde3kN4c39a3w/y/JScI7uYxsW7Io4RHWqCtUaQYmly0p80+KJCOcxvBcOO8KkF3Iu2Slc5KuAnfk/VSYu+lq2omxF0YHiZMW3gmgh6kqCZB4r9opUf04MDgpdIqC05N5jLnLnO64WxmkYqTyXIh5lzd/2clDoxudpmpgtRJFX4LCWcn3CqsoAJ89dhAEHLpmoT3Iuc272nL8MU7nwYKGe17j+IrXEJnPRl6lggtF7dra/7vmJ3WZzdVyFpEJusDC7IsaSRGGAXM4RGLZt8ZUxtiSXL4SqBTf5ub//Igy8cF739nxqM4gO5Go6n3RC2XdaNujbkxVKl0CPKrcwKRmXY6L5Zz7wX36g0f4h7wjRsXz4zZNdSl03N/esy6RrtfX8yIvPV0L5ryl/GGjyR/DxXd/IANHZ0NDffR//tvknLgsAAAAASUVORK5CYII="; 
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
		rewindButton.setAttribute("title", "Rewind");
		rewindButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADcElEQVQ4EZWVaUhUURTH//fd92beDM5ouBQFaaEZZeuXClsMKjAo+tCCUBFUFGVEfSjIFipCbIUkaYNCaCMoKIgK2vRDQdSHSkMjKsmw0FJHne29uZ0zk2E6T+x8mDnvLL977n3nnieUUmARSx9MLJ4m9w3zYgIEbDInHHGv848QFK0gf3apuvuvrMPqXnF9nMfgyZvvz1pZ6Lo2L1/PTnFTXB9kH9WRTnB0hxRqGuzPV17YJfVVC17oYvrNzAPbM6rXFRrZiUwBt+khVSEcCsGyFTjRSaQG2DFguE9gTKaWQ/HVIu9moV4wO7Vk2miZq1MAIfC4PoJ7NW/i+rL5+ZiT70IwMrBuXst0S7QGFLyGTXABrwuYmq3nTVo0bJWe5UOWKROruimwuTWIqxVbOA0zp9yGIT0IwvqnYF1T8Hg8uFr7C3VN3di7PAs2lc2Vuw0gI01laUoJ2mxC+Gx1Ga8FkGZc7/VxBOseSlSGH8dufcWOrdvQ+qUOuouPLiHMUDFh672Gofz7PRqaunw4WPUId88dBqI/4TLNpKlDAkuhkOJ1o+ajRNmRM3j/8FxSWF/joGDeupsiLG8KLjxpQ8WhI2j/8LRvvqPuDCYqv+WA8mPP+ZeoPrWfHpocQf0djmBJ0HctBi7tvIzaGycpz+6fO+gzda+DUHNw+4TDYQr4PygTHcE28aaOtHCjchNW7T5LfTbCoYLkZkcwXUJ0041L1ztxonQGDlReQkr2jOSUJFZnMAXzVQlFqStCAZQWp+P8xUrkFq1LghloGhTcG85zINAVxsJ8C9Wnd2DhhnI6RN8fNy8/UIYE5jTu6c6gjRxfJ86WLca2iouAfwyi4Z6BVLLoQijZOxb534oxIhRvCZv0/vX0RACX7EBZSS5GZVahobkbVoTi/wjH00SX+o8ONAcpWNKEi0ZtDE8zsWTLcfJqSE910zz+t9U4MWrTJ6anB2uL0tDS4ac8i2a2oKEFBOmdfG+3mwVybqft2Ztau3GuUcDX11YChumlvSvaZhAx3kH/srk6NpOdB71FaxsEDdF0vfAs8ra8vG2Orj4tax+7/sFqCrg+O0+O95tM6eLU+LnyGGTAYMLuAH+aGq33159H16iPKzrE34/p9DsjixZ5dqX7tHFUJd25oYumCa0tEGt8+jB4VL1e+o0zfwMlXEHNq2U2ygAAAABJRU5ErkJggg=="; 
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
		closeMenuButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAADlUlEQVQ4EaVVbUhTURh+7jZ12fxKZ2ViUWlglkWYBBWZYpSWfZF92LTCpA/RH/3Qon5k2L9MSRMloxLM0MpMilbTzCKUKPErJ2Wppa10xebcZPN0zubm3E2weuHee87znvd53/ueh3M4QgiYcVyEJOhIqsxP6upLMc4MTvPFcRz5OqhTKYsv3SKkQWPmY8QBCeVhx+OCi9eFzA5xEzsJx3NNk5YVBWj0RlND67fW/Kq25J7S+CYgrGDh5butvaaxMZrj/4xx5Nxv68OqvEXCyKTUS2lxweulHuJpVzjVQtoSeEmc3TuH9B4Cqbs4yFPiMtXav8a93Fzg4+4SJKD9NNIG8AjuvP6Chs/DPNwKfNAQFD/rhmMk4xoDjALrQvuvomcEgkQZVNv3oqxxACZ7Jx0/6dHjRUI65u+JQVldt4PXMuURK9Wj+HQyA7uVCux89xD+WyNx9dpzfKfrR+lzXd6F4S1xSHqQh+ihDkhOpKBeOcQjF9kj7LfuVjcjrrrIBq9TtWN+cgwqlDkw+Psj4kwKQjW9Nn9UuxzZJY+xMns/3OzLjL9Y97x/SGfTWb/WSAoK5eSlzxLWedtjoOOfMEvchnU6e5PczBLyXqUnVrEOqHWEctbb5zBXMWemEMkpUfhao0BlZCJ0IotinKnXY7zbJnBQLIvCq/KnkGUfwhKpC0UmG4+YuVl/1q72w5voeKidJZMj6MwgcELDmliExqyAJ89rAf5IXD9gRGXiBZzK2IF5ukFeqOvYKDKL0tGy6Qgqm/l+FsAjLq/7gO+btuH4zbOYRWhnx602cC0qwndZp3CiI1ltCaSbN6Lw5kuMOAiaR2ykAQGf2m09YxK7sSEJmqqHkFZXoEB2Hipzsyw5Avs7YNKPQujYZEdVsN3NL31NejGDfIGY5KZdIU0/baIh3SZCcnOqyVuJPxmhSsnJvE7UE25iVcUkHbMaWOL9B8JR2FYIr7k+2Je6BVJLceb3AvqPKemxuLc4APernkF2OumPGyiiB5JIwA5UO2M7ffSCDO6UhJeZ+pgA98Yuh2rzcvgK7QLpkJ1wLEyg+qXvVGsnNsm6bNYUpFY/+zqSMkytMeCHRt8pUNR0ZT1q6uujZzTD/8sYB+OSyz9miUjzye4A2e0dI0ZSvH6p7zKJWCT82xSskVoDu5oGWvKrOo6SxmMfObqh5io5LnRm4OFzB/28XX3/pWx2mXaVXCklpFbL4n8DdMXmrcY/z1YAAAAASUVORK5CYII=";
		closeMenuButton.setAttribute("title", "Close menu");
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

/*
function CP_NavArea()
{
	var navArea = document.createElement("div");
	navArea.id = "_mm_NavArea";
	navArea.setAttribute("data-mm-uicomponent", "");
	addHandlers();
	
	this.asHtml = function()
	{
		return navArea;
	}
	
	function addHandlers()
	{
		alreadyBusy = false;
		navArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
		navArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	}
	
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; // this needs changing
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
*/

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

/*
function CP_InfoArea()
{
	var infoArea = document.createElement("div");
	infoArea.id = "_mm_InfoArea";
	infoArea.setAttribute("data-mm-uicomponent", "");
	addHandlers();
	
	this.asHtml = function()
	{
		return infoArea;
	}
	
	function addHandlers()
	{
		alreadyBusy = false;
		infoArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
		infoArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	}
	
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; 
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
*/

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

/*
function CP_InteractArea()
{
	var interactArea = document.createElement("div");
	interactArea.id = "_mm_InteractArea";
	interactArea.setAttribute("data-mm-uicomponent", "");
	interactArea.style.cssText = "display:none;";
	addHandlers();
	
	this.asHtml = function()
	{
		return interactArea;
	}
	
	function addHandlers()
	{
		alreadyBusy = false;
		interactArea.addEventListener("keydown", hotKeyDown = function(e){hotKeyDown_Handler(e);}, false);
		interactArea.addEventListener("keyup", hotKeyUp = function(e){hotKeyUp_Handler(e);}, false);
	}
	
	var hotKeyTimer;
	var keyBeingTimed;
	var buttonId; 
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
*/

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
		button.setAttribute("type", "image");
		button.style.cssText = "float:left;"; 
		button.addEventListener("focus", function(e){buttonHasFocus(e);}, false);
		return button; 
	}
	
	function buttonHasFocus(e)
	{
		if (e.srcElement.getAttribute("title") != "")
		{
			mm_TTS.getAudio(e.srcElement.getAttribute("title") + " button has focus", false, null);
		}
	}
}

function ChangeLocationButtonModel()
{
	// constructor

	var changeLocationButton = document.createElement("input");
	changeLocationButton.setAttribute("type", "image");
	changeLocationButton.style.cssText = "float:left;";
	changeLocationButton.id = "_mm_ChangeLocationButton";
	changeLocationButton.setAttribute("data-mm-uicomponent", "");
	changeLocationButton.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAEgklEQVQ4EZ2VW0wcVRjH/3PZ2V2We1kugoBQRChQtCTYVYgt2sSk1wcCiCZtkOhDk6ZaWxuVaG2jxhcUtS0xodA+kDSRB3kQi42lNgKiaaGlcrWlLG2hUC677O5c/WZwt0ChUU8yM2fOfOf33c8wmqZBH0xcjT2nOLVsTRAXbiz8h5uqQRubkUYHTm6rJ55q8HTwM/t+KNq5IbwmO8GaLpgY9h9d/wrNkBRDN5dPkToG3b81/DqxZ6J+Vz8f80rTxre3xTWVPhsVoguopH6lwegfafg9XC7Dc4wpJ8Hm4DicZXKOv8BtKa08W5IflRpsZuGTNSjkiP/SLRd4DiZBgMYKYDgTTBxDylWIJCsvkpUUDcEWFhzDxAzK/DRvt5nSgwSGYA8s1WdWEwuFs6Dzhhudl69h7PYYOJZDUnIiHLlpyIw1Qxa98BFwwRcYynR4bCifxhNEXh7TYAuPofs8vjzdjPNNdZi+1Q1N8hres5ZQxKTlY2f5G3hzVz4iBC/mRTUAN8zTVIVfHCt9MYSgfzg1HProE1xvOWFsMIVEIyxpPRRFxuztftztOYcTVZfwZ98H+PRAOWKtXngkAxnALQHr7g9P8zh85DMDyplMyHqpEqVlpchOfQwSBb+9ewiNDbUY7WjCz6feQxXFv/qdEgicOwDVJwEwy1JSOCuqG5pxreUkON6EzbuP4ehbryEp1AefKFFZMdiYmoWCvGq8WxWNXpL76cwx1OVkYt/2TIg+XwDO+mdBZg4XeqfQ0vgVGE1BxosVOLL/VcRb3bjv8sFDcZz3qZiem8eGeAUfvn8Q9qwiqO4pNNYdR9+4BjN57B/GTLdEhAXfNZ+Dy3kVFnsKKl+vQDJZSoUfSIx/04xbgiNFQPHuvWDNNoxeaUVz22WjLP0VYoAFnsHQuIiuiy0GZJ1jKzbnxsPtkfysh56Sz4sdm55GbEYBVGkebedbMeXlqSQX0AaYpya4MuDEvRvdYHgBjucLEWGRqQGWZnoxXaTuyI43I++5TcbycG8nRsbdCLUupI3XO1VjeAwM/gVxbhy26BTkPPUEtd/q1rK0ySUq6OieQJg9EWaLFd7Jm2jtGkZCbCRUsNCLAaLCwjnmJA0qQiLjEG8Pg6z39apDg4USNTTuw8W2CxQKD5SZu6irrUH3yDzCbWZQdKn1yOU796ZpxkO1RMFGbalp8qpYPUJ0ZKCiIBIZcXvxsaBhZOg6Dh86iLz0aHz+/U3wejtrpLF4x8soKnSQWzbYOJGUPSidlTTocJdXhmOtFV8cPYDRKRFb1tnQMzILiZzlSYBnGQ3lhY+DYZMpGipcHnHJobQS2L82R/DkCBZro8xURSJ5CrAMy/GT83K/R9TyPT6ZWnb1hPlBy596KPUKESlyQXT0urwq7szKA2z71Zn9l/rn5shsWAUWZor6/7n80PZBd8/vPzprmYVfUzP9mtZ8vT4x6Ek6yGltuV2Pftc71y0av6au+l8m90yc3t5ngPVtTMy3MbklcWURwULEozEPf9VNcU5Lt/q+2XqKDFV0ib8BqeLqeWsyquIAAAAASUVORK5CYII="; 
	changeLocationButton.setAttribute("alt", "Change location menu");
	changeLocationButton.setAttribute("title", "Change location menu"); 
	changeLocationButton.addEventListener("click", openChangeLocationMenu, false);
	changeLocationButton.style.opacity = "1";
	
	this.asHtml = function()
	{
		return changeLocationButton;
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
		// controlPanel.changeDisplayedCurrentItem(osmType + " (offscreen)");
		goog.dom.getElement('_mm_CurrentItemDisplayArea').value = osmType + " (offscreen)";
	}
	else
	{
		// controlPanel.changeDisplayedCurrentItem(osmType);
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