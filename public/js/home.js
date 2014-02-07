/*
 * Function that sets up the home screen.
 */
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
