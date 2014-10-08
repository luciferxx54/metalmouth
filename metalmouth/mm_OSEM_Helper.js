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

goog.provide('mm_OSEM_Helper');

mm_OSEM_Helper.textNodeContents = function(originalElement) {
	if (originalElement.childNodes.length == 1) {
		var childNode = originalElement.childNodes[0];
		
		if (childNode.nodeName == "#text") {
			var data = childNode.data.trim();
			if (data != "") {
				return data;
			}
		}
	}
	return null;
}

mm_OSEM_Helper.labelValue = function(originalElement) { // we could amend this to check for wai-aria label attributes
	var label = "Unlabelled";
	var id = originalElement.getAttribute("id");
	if (id) {
		var labelElement = document.querySelector('[for=' + id + ']');
		if (labelElement) {
			var labelText = labelElement.innerText;
			if (labelText != "") {
				label = labelText;
			}
		}
	}
    if (label == "Unlabelled")  {
        var title = originalElement.getAttribute("title");
        if (title) {
            if (title != "") {
                label = title;
            }
        }
    }
	return label;
}

mm_OSEM_Helper.attributeValue = function(originalElement, attributeName, valueIfNoValue, prefixedText) {
	// title forms part of the text to read out
	
	var attValue = originalElement.getAttribute(attributeName);
	
	if ((attValue == null) || (attValue == "")) {
		if (valueIfNoValue == undefined) {
			attValue = "";
		}
		else {
			attValue = valueIfNoValue;
		}
	}
	else {
		if (prefixedText != undefined) {
			attValue = prefixedText + " " + attValue;
		}
	}
	
	return attValue;
}

mm_OSEM_Helper.numberOfChildren = function(originalElement) {
	var number = originalElement.children.length;
	
	var text = "items";
	
	if (number == 0) {
		number = "No";
	}
	
	if (number == 1) {
		text = "item"
	}
	
	return number + " " + text + " listed";
}

mm_OSEM_Helper.findPositionInList = function(originalElement) {
	var parent = originalElement.parentElement;
	var children = parent.children;
	for(var i = children.length; i--;) {
		if (children[i] == originalElement) {
			return i + 1; // corrects to say right position
		}
	}
	return null;
}