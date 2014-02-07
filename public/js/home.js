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

	$("#start-start-button").on("click", function(e) {
		console.log("CLICK START");
		$("#start-page").css("display", "none");
		$("#active-page").css("display", "inline");
	});

	$("#active-finish-button").on("click", function(e) {

		$("#active-page").css("display", "none");
		$("#results-page").css("display", "inline");
	});

	$("#results-home-button").on("click", function(e) {

		$("#results-page").css("display", "none");
		$("#start-page").css("display", "inline");
	});

	$("#start-help-button").on("click", function(e) {

		$("#start-page").css("display", "none");
		$("#help-page").css("display", "inline");
	});

	$("#help-start-button").on("click", function(e) {

		$("#help-page").css("display", "none");
		$("#active-page").css("display", "inline");
	});

	

	initHomeScreen();

}

 
function initHomeScreen() {
	$("#introBox").hide();
	$("#preCanvas").click(showInstructions);
	$("#introBox").click(hideInstructions);
	console.log("Javascript connected!");
}


function showInstructions() {
	$("#introBox").show();
	$("#preCanvas").hide();
}

function hideInstructions() {
	$("#introBox").hide();
	$("#preCanvas").show();
}
