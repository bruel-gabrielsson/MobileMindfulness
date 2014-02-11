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

	var $contentPages = $('.content-page');

	$("#start-start-button").on("click", function(e) {
		console.log("CLICK START");
		$contentPages.hide();
		$("#active-page").show();
	});

	$("#active-finish-button").on("click", function(e) {
		$contentPages.hide();
		$("#results-page").show();
	});

	$("#active-quit-button").on("click", function(e) {
		$contentPages.hide();
		$("#start-page").show();
	});

	$("#results-home-button").on("click", function(e) {
		$contentPages.hide();
		$("#start-page").show();
	});

	$("#start-help-button").on("click", function(e) {
		$contentPages.hide();
		$("#help-page").show();
	});

	$("#help-start-button").on("click", function(e) {
		$contentPages.hide();
		$("#active-page").show();
	});

	$("#help-back-button").on("click", function(e) {
		$contentPages.hide();
		$("#start-page").show();
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