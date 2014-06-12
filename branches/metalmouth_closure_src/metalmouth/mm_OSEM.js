/*

 Project metalmouth - Developing a voice browser extension for Chrome (http://code.google.com/p/metalmouth/)
 Copyright (C) 2013 - Alistair Garrison
 
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

goog.require('mm_OSEM_Helper');

console.log("loaded offscreenElementModel");
	
mm_OSEM.waiariaroleFilterFunctions = {}

mm_OSEM.waiariaroleFilterFunctions['main'] = function(currentNode) {
	return ["Main_Content_Area", MainContentAreaModel_ContentToRead];
}

mm_OSEM.waiariaroleFilterFunctions['menuitem'] = function(currentNode) {
	return ["Menu_Item", MenuItemModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions = {}

mm_OSEM.tagNameFilterFunctions['A'] = function(currentNode) {
	var hrefValue = currentNode.getAttribute("href");
	if (!hrefValue)
	{
		return ["Skip_Target", SkipTargetModel_ContentToRead]; 
	}
	else
	{
		if (hrefValue[0] == "#")
		{
			return ["Skip_Link", SkipLinkModel_ContentToRead];
		}
		else
		{
			// check to see if target attribute is set to _blank or new
			
			var targetValue = currentNode.getAttribute("target");
			if (targetValue)
			{
				targetValue = targetValue.toLowerCase();
				if ((targetValue == "_blank") || (targetValue == "new"))
				{
					return ["New_Tab_Link", NewTabLinkModel_ContentToRead];
				}
			}
			return ["Link", LinkModel_ContentToRead];
		}
	}
}

mm_OSEM.tagNameFilterFunctions['INPUT'] = function(currentNode) {
	
	var inputTypeModels = {
		text:["Text_Box", TextBoxModel_ContentToRead],
		search:["Search_Box", TextBoxModel_ContentToRead],
		password:["Password_Box", TextBoxModel_ContentToRead],
		image:["Image_Button", ImageButtonModel_ContentToRead],
		button:["Input_Button", InputButtonModel_ContentToRead],
		submit:["Submit_Button", SubmitButtonModel_ContentToRead],
		reset:["Reset_Button", ResetButtonModel_ContentToRead],
		checkbox:["Check_Button", CheckButtonModel_ContentToRead],
		radio:["Check_Button", CheckButtonModel_ContentToRead],
		tel:["Telephone_Box", FormatSpecificEntryBoxModel_ContentToRead],
		url:["Url_Box", FormatSpecificEntryBoxModel_ContentToRead],
		email:["Email_Box", FormatSpecificEntryBoxModel_ContentToRead],
		number:["Number_Box", FormatSpecificEntryBoxModel_ContentToRead],
		datetime:["Date_Time_Box", FormatSpecificEntryBoxModel_ContentToRead],
		date:["Date_Box", FormatSpecificEntryBoxModel_ContentToRead],
		month:["Month_Box", FormatSpecificEntryBoxModel_ContentToRead],
		week:["Week_Box", FormatSpecificEntryBoxModel_ContentToRead],
		time:["Time_Box", FormatSpecificEntryBoxModel_ContentToRead],
		range:["Range_Input", RangeInputModel_ContentToRead]
	};
	
	var typeValue = currentNode.getAttribute("type");
	
	if (typeValue != null)
	{
		typeValue = typeValue.toLowerCase();
		return inputTypeModels[typeValue];
	}
	return null;
}

mm_OSEM.tagNameFilterFunctions['BUTTON'] = function(currentNode) {
	return ["Button", ButtonModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['TEXTAREA'] = function(currentNode) {
	return ["Textarea_Box", TextareaBoxModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['SELECT'] = function(currentNode) {
	if (currentNode.getAttribute("multiple") == null) // need to collect relevant models for rest - doing this cuts out stages
	{
		return ["Single_Select", SingleSelectModel_ContentToRead];
	}
	else
	{
		return ["Multi_Select", MultiSelectModel_ContentToRead];
	}
}

mm_OSEM.tagNameFilterFunctions['FORM'] = function(currentNode) {
	return ["Form", FormModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['P'] = function(currentNode) {
	return ["Paragraph", ParagraphModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H1'] = function(currentNode) {
	return ["Level_1_Header", Level1HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H2'] = function(currentNode) {
	return ["Level_2_Header", Level2HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H3'] = function(currentNode) {
	return ["Level_3_Header", Level3HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H4'] = function(currentNode) {
	return ["Level_4_Header", Level4HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H5'] = function(currentNode) {
	return ["Level_5_Header", Level5HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['H6'] = function(currentNode) {
	return ["Level_6_Header", Level6HeaderModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['B'] = function(currentNode) {
	return ["Bold_Text", BModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['U'] = function(currentNode) {
	return ["Underlined_Text", UModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['I'] = function(currentNode) {
	return ["Italic_Text", IModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['ABBR'] = function(currentNode) {
	return ["Abbreviation", AbbrModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['EM'] = function(currentNode) {
	return ["Bold_Text", EmModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['SPAN'] = function(currentNode) {
	var parent = currentNode.parentElement;
	var parentTagname = parent.tagName;
	if ((parentTagname == "BODY")||(mm_OSEM.tagNameFilterFunctions.hasOwnProperty(parentTagname) == false)) // last condition checks if parentElement is unsupported - removed ||(parentTagname == "DIV")
	{
		return ["Sentence", SentenceModel_ContentToRead];
	}
	else
	{
		return ["Inline_Content", InlineContentModel_ContentToRead];
	}
}

mm_OSEM.tagNameFilterFunctions['IMG'] = function(currentNode) {
	return ["Semantic_Image", SemanticImageModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['HEADER'] = function(currentNode) {
	return ["Page_Header_Area", PageHeaderAreaModel_ContentToRead];
}
	
mm_OSEM.tagNameFilterFunctions['NAV'] = function(currentNode) {
	return ["Site_Navigation_Area", SiteNavigationAreaModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['MENU'] = function(currentNode) {
	var menuType = currentNode.getAttribute("type"); 
	if (menuType != null)
	{
		if (menuType.toLowerCase() == "list")
		{
			return ["Menu", MenuModel_ContentToRead];
		}
	}
	return null;
}

mm_OSEM.tagNameFilterFunctions['MAIN'] = function(currentNode) {
	return ["Main", MainContentAreaModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['ARTICLE'] = function(currentNode) {
	return ["Article", ArticleModel_ContentToRead]; // should be the same for DIV
}

mm_OSEM.tagNameFilterFunctions['SECTION'] = function(currentNode) {
	return ["Section", SectionModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['FOOTER'] = function(currentNode) {
	return ["Page_Footer_Area", PageFooterAreaModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['ADDRESS'] = function(currentNode) {
	return ["Page_Contact_Details", PageContactDetailsModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['DIV'] = function(currentNode) {
	return ["Section", SectionModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['CANVAS'] = function(currentNode) {
	return ["Canvas", CanvasModel_ContentToRead]; // Any text inside the between <canvas> and </canvas> will be displayed in browsers that do not support the canvas element. As Chrome supports canvas we need to be able to change out the canvas element for its contents - the easiest way is to say it is a layout division
}

mm_OSEM.tagNameFilterFunctions['FIELDSET'] = function(currentNode) {
	return ["Input_Group", InputGroupModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['UL'] = function(currentNode) {
	return ["Bulleted_List", BulletedListModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['OL'] = function(currentNode) {
	return ["Numbered_List", NumberedListModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['LI'] = function(currentNode) {
	return ["List_Item", ListItemModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['MAP'] = function(currentNode) {
	return ["Map", MapModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['AREA'] = function(currentNode) {
	var targetValue = currentNode.getAttribute("target");
	if (targetValue)
	{
		targetValue = targetValue.toLowerCase();
		if ((targetValue == "_blank") || (targetValue == "new"))
		{
			return ["New_Tab_Map_Area", NewTabMapAreaModel_ContentToRead];
		}
	}
	return ["Map_Area", MapAreaModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['TABLE'] = function(currentNode) {
	return ["Data_Table", DataTableModel_ContentToRead]; 
}

mm_OSEM.tagNameFilterFunctions['TH'] = function(currentNode) {
	return ["Header_Cell", HeaderCellModel_ContentToRead]; 
}

mm_OSEM.tagNameFilterFunctions['TD'] = function(currentNode) {
	return ["Data_Cell", DataCellModel_ContentToRead]; 
}

mm_OSEM.tagNameFilterFunctions['BLOCKQUOTE'] = function(currentNode) {
	if (currentNode.getAttribute("cite") == null)
	{
		return ["Quote", QuoteModel_ContentToRead];
	}
	else
	{
		return ["Quote_Link", QuoteLinkModel_ContentToRead];
	}
}

mm_OSEM.tagNameFilterFunctions['INS'] = function(currentNode) {
	return ["Insertion", InsertionModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['DEL'] = function(currentNode) {
	return ["Deletion", DeletionModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['CODE'] = function(currentNode) {
	return ["Code", CodeModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['AUDIO'] = function(currentNode) {
	return ["Audio", AudioModel_ContentToRead];
}

mm_OSEM.tagNameFilterFunctions['VIDEO'] = function(currentNode) {
	return ["Video", VideoModel_ContentToRead];
}

mm_OSEM.filter = function(currentNode)
{		
	var relevantModelFunction = null;
	var roleAttribute = currentNode.getAttribute('role');
	if (roleAttribute)
	{
		roleAttribute = roleAttribute.toLowerCase();
		if (roleAttribute == "presentation")
		{
			return null;
		}
		relevantModelFunction = mm_OSEM.waiariaroleFilterFunctions.hasOwnProperty(roleAttribute) ? mm_OSEM.waiariaroleFilterFunctions[roleAttribute](currentNode) : null;
	}
	if (!relevantModelFunction)
	{
		var tagName = currentNode.tagName;
		relevantModelFunction = mm_OSEM.tagNameFilterFunctions.hasOwnProperty(tagName) ? mm_OSEM.tagNameFilterFunctions[tagName](currentNode) : null;
	}
	if (relevantModelFunction)
	{		
		var osmItemModel = new OSMItemModel(relevantModelFunction[0], relevantModelFunction[1](currentNode));
		return osmItemModel;
	}
	return null;
}

function OSMItemModel(osmType, osmContentComponents)
{
	this.osmType = osmType;
	this.osmContentComponents = osmContentComponents;
}

// wai-aria role filter functions

function MainContentAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Main content area";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

// tagName filter functions

function SkipLinkModel_ContentToRead(originalElement) 
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Skip Link";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title");
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray; 
}

function SkipTargetModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Skip Target";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title");
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function LinkModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Link";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title");		

	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}

	return contentComponentsArray;
}

function NewTabLinkModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Link opens in a new tab";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title");		
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function QuoteLinkModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Quote link";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title");
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function MapModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.attributeValue(originalElement, "title", "Untitled");
	contentComponentsArray[1] = "Map";
	return contentComponentsArray;
}

function NewTabMapAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Map area opens in a new tab";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "alt", "Untitled");
	return contentComponentsArray;
}

function MapAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Map area";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "alt", "Untitled");
	return contentComponentsArray;
}

function DataTableModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Data table";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "summary", "No summary");
	return contentComponentsArray;
}

function HeaderCellModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Header cell";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function DataCellModel_ContentToRead(originalElement)
{
	var headerCellTitlesValue = function()
	{
		var headerText = ""; 
		var headersAttributeValue = originalElement.getAttribute("headers");
		if (headersAttributeValue != null)
		{
			var headersAttributeValueArray = headersAttributeValue.split(',');
			for (var i = 0, len = headersAttributeValueArray.length; i < len; i++)
			{
				var trimmedValue = headersAttributeValueArray[i].trim();
				if (trimmedValue != "")
				{
					var relatedHeaderElement = document.getElementById(trimmedValue);
					if (relatedHeaderElement)
					{
						var relatedHeaderElementText = relatedHeaderElement.innerText;
						if (relatedHeaderElementText != "")
						{
							if (headerText == "")
							{
								headerText = relatedHeaderElementText;
							}
							else
							{
								headerText = headerText + " and " + relatedHeaderElementText;
							}
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
			headerText = "relates to " + headerText;
		}
		
		return headerText;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Data cell";
	contentComponentsArray[1] = headerCellTitlesValue();
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = "cell value" + textNodeContents;
	}
	
	return contentComponentsArray;
}

function AudioModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Audio";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title", "Untitled", "Entitled");
	return contentComponentsArray;
}

function VideoModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Video";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title", "Untitled", "Entitled");
	return contentComponentsArray;
}

function TextareaBoxModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var value = originalElement.value;
		var state = ((value != null)&&(value != "")) ? value : "None"; 
		return "Current value " + state;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable text area box";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function TextBoxModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var value = originalElement.value;
		var state = ((value != null)&&(value != "")) ? value : "None"; 
		return "Current value " + state;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable " + originalElement.getAttribute("type") + " box";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function FormatSpecificEntryBoxModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var value = originalElement.value;
		var state = ((value != null)&&(value != "")) ? value : "None"; 
		return "Current value " + state;
	}
	
	var correctedType = function()
	{
		var type = originalElement.getAttribute("type");
		if (type == "tel")
		{
			type = "telephone";
		}
		return type;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable " + correctedType() + " box";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = mm_OSEM_Helper.attributeValue(originalElement, "title", "No format specified");
	contentComponentsArray[4] = stateValue();
	return contentComponentsArray;
}

function RangeInputModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var value = originalElement.value;
		var state = ((value != null)&&(value != "")) ? value : "None"; 
		return "Current value " + state; // careful changing text as it is used in drawRangeInput above
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable Range input";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function ImageButtonModel_ContentToRead(originalElement)
{
	var label = mm_OSEM_Helper.labelValue(originalElement);
	var alt = mm_OSEM_Helper.attributeValue(originalElement, "alt");
	
	label = label + " " + alt;
	
	if (label == "") {
		label = "unlabelled";
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = label;
	contentComponentsArray[1] = "Interactable Image button";
	return contentComponentsArray;
}

function InputButtonModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.attributeValue(originalElement, "value", "Unlabelled");
	contentComponentsArray[1] = "Interactable Input Button";
	return contentComponentsArray;
}

function SubmitButtonModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Submit Button";
	return contentComponentsArray;
}

function ResetButtonModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Interactable Reset Button";
	return contentComponentsArray;
}

function ButtonModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	var innerText = originalElement.innerText;
	contentComponentsArray[0] = innerText == "" ? "Unlabelled" : innerText;
	contentComponentsArray[1] = "Interactable Button";
	return contentComponentsArray;
}

function CheckButtonModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var state = originalElement.checked == true ? "checked" : "unchecked"; 
		return "Current value " + state;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable Check Button";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function SingleSelectModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var state = originalElement[originalElement.selectedIndex].innerText;
		
		if (state == null)
		{
			state = "No selected value";
		}
		
		return "Current value " + state;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable Single select drop-down";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function MultiSelectModel_ContentToRead(originalElement)
{
	var stateValue = function()
	{
		var state = [];
		var options = originalElement.querySelectorAll('option');
		
		for (var i = 0, len = options.length; i < len; i++)
		{
			var option = options[i];
			if (option.selected == true)
			{
				state[state.length] = option.innerText;
			}
		}
		
		var stateLen = state.length;
		if (stateLen == 1)
		{
			return "Current selected value " + state[0];
		}
		else if (stateLen > 0)
		{
			return "Current selected values " + state.toString();
		}
		else
		{
			return "No selected values";
		}
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.labelValue(originalElement);
	contentComponentsArray[1] = "Interactable Multi select drop-down";
	contentComponentsArray[2] = mm_OSEM_Helper.attributeValue(originalElement, "required");
	contentComponentsArray[3] = stateValue();
	return contentComponentsArray;
}

function PageHeaderAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Page header area";
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	return contentComponentsArray;
}

function SiteNavigationAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Site navigation area";
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	return contentComponentsArray;
}

function MenuModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.attributeValue(originalElement, "title", "Untitled");
	contentComponentsArray[1] = "Menu";
	contentComponentsArray[2] = mm_OSEM_Helper.numberOfChildren(originalElement);
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[3] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function PageFooterAreaModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Page footer area";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function PageContactDetailsModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Page contact details";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function CanvasModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Canvas";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "title", "Untitled", "Entitled");
	return contentComponentsArray;
}

function ArticleModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Article";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function SectionModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Section";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function SentenceModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Sentence";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level1HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 1 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level2HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 2 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level3HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 3 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level4HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 4 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level5HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 5 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function Level6HeaderModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Level 6 Header";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function AbbrModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	
	var title = originalElement.getAttribute("title");
	if (title != null)
	{
		contentComponentsArray[0] = title;
	}
	else
	{
		var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
		if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
		{
			contentComponentsArray[1] = textNodeContents;
		}
	}
	return contentComponentsArray;
}

function BModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[0] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function UModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[0] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function IModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[0] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function EmModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[0] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function ParagraphModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Paragraph";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function QuoteModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Quote";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function InsertionModel_ContentToRead(originalElement)
{
	var insertedWhen = function()
	{
		// YYYY-MM-DDThh:mm:ss 2011-05-17T13:25:01
		
		// datetime attribute 
		
		var datetime = originalElement.getAttribute("datetime"); 
		
		if (datetime == null)
		{
			return "";
		}
		else
		{
			// on the xx-yy
			
			if (datetime.indexOf("T") != -1)
			{
				datetime = datetime.replace("T", " at ");
			}
			
			return "The following was inserted into the page on the " + datetime; 
		}			
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Insertion";
	contentComponentsArray[1] = insertedWhen();
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray;

}

function DeletionModel_ContentToRead(originalElement)
{
	var deletedWhen = function()
	{
		// YYYY-MM-DDThh:mm:ss 2011-05-17T13:25:01
		
		// datetime attribute
		
		var datetime = originalElement.getAttribute("datetime"); 
		
		if (datetime == null)
		{
			return "";
		}
		else
		{
			// on the xx-yy
			
			if (datetime.indexOf("T") != -1)
			{
				datetime = datetime.replace("T", " at ");
			}
			return "The following was deleted from the page on the " + datetime;  
		}
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Deletion";
	contentComponentsArray[1] = deletedWhen();
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function CodeModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Code";
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function BulletedListModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Bulleted list";
	contentComponentsArray[1] = mm_OSEM_Helper.numberOfChildren(originalElement);
	return contentComponentsArray;
}

function NumberedListModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Numbered list";
	contentComponentsArray[1] = mm_OSEM_Helper.numberOfChildren(originalElement);
	return contentComponentsArray;
}

function ListItemModel_ContentToRead(originalElement)
{
	var whatAmI = function()
	{
		var positionInList = mm_OSEM_Helper.findPositionInList(originalElement); 
		
		var text = ""; 
		
		if (positionInList != null)
		{
			text = " " + positionInList;
		}
		
		return "List item" + text;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = whatAmI();
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function MenuItemModel_ContentToRead(originalElement)
{
	var whatAmI = function()
	{		
		var positionInList = mm_OSEM_Helper.findPositionInList(originalElement);
		
		var text = ""; 
		
		if (positionInList != null)
		{
			text = " " + positionInList;
		}
		
		return "Menu item" + text;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = whatAmI();
	
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	
	return contentComponentsArray;
}

function FormModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = mm_OSEM_Helper.attributeValue(originalElement, "name", "Untitled");
	contentComponentsArray[1] = "Form";
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	return contentComponentsArray;
}

function InputGroupModel_ContentToRead(originalElement)
{
	var title = function()
	{		
		var legend = "Untitled";
		
		var legendElement = originalElement.querySelector('legend');
		
		if (legendElement)
		{
			var legendText = legendElement.innerText;
			if (legendText != "")
			{
				legend = legendText;
			}
		}
		return legend;
	}
	
	var contentComponentsArray = [];
	contentComponentsArray[0] = title();
	contentComponentsArray[1] = "Input group";
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[2] = textNodeContents;
	}
	return contentComponentsArray;
}

function InlineContentModel_ContentToRead(originalElement) // formed from span
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Inline content";
	var textNodeContents = mm_OSEM_Helper.textNodeContents(originalElement);
	if (textNodeContents) // need to add these to elements which can hold content, but which are not layout elements
	{
		contentComponentsArray[1] = textNodeContents;
	}
	return contentComponentsArray;
}

function SemanticImageModel_ContentToRead(originalElement)
{
	var contentComponentsArray = [];
	contentComponentsArray[0] = "Semantic Image";
	contentComponentsArray[1] = mm_OSEM_Helper.attributeValue(originalElement, "alt", "No alternative text", "Alternative Text");
	return contentComponentsArray;
}

