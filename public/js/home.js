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
		activeLineColor = [255,255,255],
		resultLineColor = [255,255,255],
		lineWidth = 2;
	
	var breathCanvas = new BreathCanvas();
	var breathGraph = new BreathGraph();
	var breathResults = new BreathResults();
	
	breathCanvas.init(color0, color1);
	breathGraph.init(historyLimit,activeLineColor,lineWidth);
	breathResults.init(historyLimit*2,resultLineColor,lineWidth);

	breathGraph.onStart(function() {
		$('#active-finish-button').attr('disabled', false);
	});
	
	breathCanvas.bind(function(y) {
		breathGraph.appendData.call(breathGraph,y);
	});

	var $contentPages = $('.content-page');

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
		if ($("#username").length > 0) {
			//TODO: Send AJAX request to database
			//$.get("/URL_TO_DATABASE/" + $("#username").text()", populateTable);

			//For now, call populateTable synchronously with toy data.
			//I am assuming the history will arrive sorted by date.
			var result = { 'breath_history': 
				[
					{'date': 'February 07, 2014 21:16:00',
			      	  'graph_data': 
							[{t: 0, y: .50}, {t: 15, y: .70}, {t: 20, y: .60}]},
					{'date': 'February 08, 2014 14:03:00',
					  'graph_data':
							[{t: 0, y: .20}, {t: 15, y: .80}, {t: 20, y: .40}]},
					{'date': 'February 10, 2014 09:18:00',
					  'graph_data':
							[{t: 0, y: .20}, {t: 15, y: .80}, {t: 60, y: .40}]}
				]
			};

			populateTable(result);
		}
		$contentPages.hide();
		$("#progress-page").show();
	});

	$(".save-data").on("click", function(e) {
		console.log("saving data");
		
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