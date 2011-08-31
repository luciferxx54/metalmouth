goog.provide('mm_TTS');

console.log("loaded tts");

mm_TTS.getAudio = function(text, enqueue, callbackFunction)
{
	// text - replace . for dot in .co.uk for example
	
	var patternToFindAndReplaceDotInUrl = /(\.)(?=[a-z])/gi;
	text = text.replace(patternToFindAndReplaceDotInUrl, " dot ");		
	
	// text - replace . for point in 45.4 for example
	var patternToFindAndReplaceDotInNumbers = /(\.)(?=[0-9])/gi;
	text = text.replace(patternToFindAndReplaceDotInNumbers, " point ");
	
	var voice = new VoiceModel(text, mm_ControlPanel.getPageCulture(), getSpeakingRateAsFloat().toString(), enqueue.toString()); // svb.speakingRate
	tts(voice, callbackFunction);
}

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

function VoiceModel(utterance, locale, rate, enqueue)
{
	this.utterance = utterance;
	this.locale = locale;
	this.rate = rate;
	this.enqueue = enqueue;
}
	