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
	console.log("Javascript connected!");

	var color0 = [0,95,150],
		color1 = [0,255,132];
	var historyLimit = 15000, // Show the last 15 seconds in the graph
		lineColor = [0,95,150],
		lineWidth = 1;

		lineColor = [0,0,0];
	
	var breathCanvas = new BreathCanvas();
	var breathGraph = new BreathGraph();
	
	breathCanvas.init(color0, color1);
	breathGraph.init(historyLimit,lineColor,lineWidth);
	
	breathCanvas.bind(function(y) {
		breathGraph.appendData.call(breathGraph,y);
	});

	var $contentPages = $('.content-page');

	$(".start-button").on("click", function(e) {
		$contentPages.hide();
		$("#active-page").show(0, function() {
			breathCanvas.start.call(breathCanvas);
			breathGraph.start.call(breathGraph);
		});
	});

	$(".finish-button").on("click", function(e) {
		$contentPages.hide();
		breathCanvas.stop();
		var data = breathGraph.stop();
		$("#results-page").show();
	});

	$(".home-button, .quit-button, .back-button").on("click", function(e) {
		$contentPages.hide();
		$("#start-page").show();
	});

	$(".help-button").on("click", function(e) {
		$contentPages.hide();
		$("#help-page").show();
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