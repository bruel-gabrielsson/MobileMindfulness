// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
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
