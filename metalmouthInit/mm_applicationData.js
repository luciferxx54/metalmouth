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

goog.provide('mm_applicationData');

// temp experimental.tts replacement
var applicationData; //  = new AudioStackModel(); // added

// AUDIO

mm_applicationData.connect = function()
{
	if (localStorage.getItem("MetalmouthApplicationData") == null)
	{
		applicationData = new ApplicationDataModel(); // set up with default values
	}
	else
	{
		applicationData = new ApplicationDataModel(JSON.parse(localStorage.getItem("MetalmouthApplicationData")));
	}
}

mm_applicationData.update = function(jsonEncodedData)
{
	localStorage.setItem("MetalmouthApplicationData", jsonEncodedData);
	applicationData = new ApplicationDataModel(JSON.parse(localStorage.getItem("MetalmouthApplicationData")));
}

mm_applicationData.getSpecificData = function(key)
{
	return applicationData[key];
}

mm_applicationData.getData = function()
{
	return applicationData;
}

function ApplicationDataModel(data) // data in id and value pairs
{
	var applicationDataModel; 
	
	if (data == undefined)
	{
		applicationDataModel = {
		speechRate: '0.7'
		}
	}
	else
	{
		applicationDataModel = {
		speechRate: data.speechRate
		}
	}
	return applicationDataModel;
}