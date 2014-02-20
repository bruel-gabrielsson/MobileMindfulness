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
	console.log("Javascript connected!");

	var color0 = [0,95,150],
		color1 = [0,255,132];
	var historyLimit = 15000, // Show the last 15 seconds in the graph
		activeLineColor = [255,255,255],
		resultLineColor = [255,255,255],
		lineWidth = 2,
		progressLimit = 10; // The number of days that sould fit into the progress graph
	
	var breathCanvas = new BreathCanvas();
	var breathGraph = new BreathGraph();
	var breathResults = new BreathResults();
	var breathProgress = new BreathProgress();
	
	breathCanvas.init(color0, color1);
	breathGraph.init(historyLimit,activeLineColor,lineWidth);
	breathResults.init(historyLimit*2,resultLineColor,lineWidth);
	breathProgress.init(progressLimit,activeLineColor,lineWidth);

	var $contentPages = $('.content-page');

	breathGraph.onStart(function() {
		$('#active-finish-button').attr('disabled', false);
	});
	
	breathCanvas.bind(function(y) {
		breathGraph.appendData.call(breathGraph,y);
	});

	breathProgress.bind(function(session) { // Bind session click event
		$contentPages.hide();
		$("#results-page").show();
		breathResults.populate.call(breathResults, session.data, session.date);
	});
	
	breathResults.backButton(function() {
		$contentPages.hide();
		$("#progress-page").show();
	});

	breathResults.saveData(function(data) {
		// This is called when save button is pressed (even if the user is not logged in)
		// Be sure to use 'self' instead of 'this' (if you need to) since the 'this' pointer will point to the breathResults object

		// Put saving data here!!!

		$contentPages.hide();
		$("#progress-page").show();
		breathProgress.updateSessions.call(breathProgress, true);
	});

	$(".start-button").on("click", function(e) {
		$contentPages.hide();
		$('#active-finish-button').attr('disabled', true);
		$("#active-page").show(0, function() {
			breathCanvas.start.call(breathCanvas);
			breathGraph.start.call(breathGraph);
		});
	});

	$(".finish-button").on("click", function(e) {
		$contentPages.hide();
		breathCanvas.stop.call(breathCanvas);
		var data = breathGraph.stop.call(breathGraph);
		$("#results-page").show();
		breathResults.populate.call(breathResults,data);
	});

	$(".home-button, .quit-button, .back-button").on("click", function(e) {
		$contentPages.hide();
		$("#start-page").show();
	});

	$(".help-button").on("click", function(e) {
		$contentPages.hide();
		$("#help-page").show();
	});

	$(".progress-button").on("click", function(e) {
		$contentPages.hide();
		$("#progress-page").show();
		breathProgress.updateSessions.call(breathProgress, false);
	});

	initHomeScreen();

}

 
function initHomeScreen() {
	var $instructions = $('#introBox'),
		$startImage = $('#bannerHead');
	$("#preCanvas").click(function() {
		$instructions.toggle();
		$startImage.toggle();
	});
}