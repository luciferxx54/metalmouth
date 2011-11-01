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

goog.provide('mm_OSEM');

console.log("loaded offscreenElementModel");

// OSM
	
mm_OSEM.filter = function(currentNode)
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
				if ((typeValue == "text")||(typeValue == "search")||(typeValue == "password")) // 
				{
					relevantModel = TextBoxModel_ContentToRead;
				}
				if (typeValue == "image")
				{
					relevantModel = ImageButtonModel_ContentToRead; 
				}
				if ((typeValue == "button")||(typeValue == "submit")||(typeValue == "reset"))
				{
					relevantModel = ButtonModel_ContentToRead; 
				}
				if ((typeValue == "checkbox")||(typeValue == "radio"))
				{
					relevantModel = CheckButtonModel_ContentToRead;
				}
				if ((typeValue == "telephone")||(typeValue == "url")||(typeValue == "e-mail")||(typeValue == "number")||(typeValue == "datetime")||(typeValue == "date")||(typeValue == "month")||(typeValue == "week")||(typeValue == "time"))
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

function OSMItemModel(osmType, osmContentComponents)
{
	this.osmType = osmType;
	this.osmContentComponents = osmContentComponents;
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

// ImageButtonModels------------------------

function ImageButtonModel_ContentToRead(originalElement)
{
	var baseElement = new ElementModel_ContentToRead(originalElement);
	
	this.name = "Image_Button";
	
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
		return "Image button";
	}
	
	function interactable()
	{
		return "Interactable";
	}
	
	function labelValue()
	{
		// title forms part of the text to read out
		
		var alt = baseElement.getAttribute("alt");
		
		if ((alt == null)||(alt == ""))
		{
			alt = "Unlabelled"; 
		}
		
		return alt;
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
		var label = baseElement.getAttribute("value");
		
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

