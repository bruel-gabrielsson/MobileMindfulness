/*
 * Function that sets up the home screen.
 */
'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	var self = this;

	var color0 = [0,95,150],
		color1 = [0,255,132];
	var historyLimit = 15000, // Show the last 15 seconds in the graph
		idealBreathingPeriod = 6000,
		activeLineColor = [255,255,255],
		idealLineColor = [0,255,132],
		resultLineColor = [255,255,255],
		lineWidth = 2,
		progressLimit = 10; // The number of days that sould fit into the progress graph
	
	var breathExperiment = new BreathExperiment();
	breathExperiment.init(historyLimit*2,resultLineColor,lineWidth);

	breathExperiment.updateSessions.call(breathExperiment);

	$('#experiment-update-button').click(function() {
		breathExperiment.updateSessions.call(breathExperiment);
	});
}