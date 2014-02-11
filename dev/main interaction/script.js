$(document).ready(function() {
	var color0 = [0,95,150],
		color1 = [0,255,132];
	var historyLimit = 15000, // Show the last 15 seconds in the graph
		lineColor = [0,95,150],
		lineWidth = 3;
	
	var breathCanvas = new BreathCanvas();
	var breathGraph = new BreathGraph();
	
	breathCanvas.init(color0, color1);
	breathGraph.init(historyLimit,lineColor,lineWidth);
	
	breathCanvas.bind(function(y) {
		breathGraph.appendData.call(breathGraph,y);
	});
	
	// Code above will be needed to setup
	// Code below is just for this particular GUI, another implementation will be required later.
	
	var started = false;
	$button = $('button');
	$button.click(function() {
		if (started) {
			breathCanvas.stop();
			var data = breathGraph.stop();
			$button.removeClass('started');
			started = false;
		} else {
			breathCanvas.start();
			breathGraph.start();
			$button.addClass('started');
			started = true;
		}
	});
	
	
});