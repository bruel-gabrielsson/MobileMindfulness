var BreathResults = function() {};

BreathResults.prototype.init = function(timeLimit, color, lineWidth) {
	this.timeLimit = timeLimit;
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;

	var $fullGraphContainer = $('#resultsGraph');
	if ($fullGraphContainer.length) {
		this.$fullGraph = $('<canvas id="resultGraphCanvas">');
		$fullGraphContainer.append(this.$fullGraph);
		this.fullGraph = document.getElementById('resultGraphCanvas');

		var $condensedContainer = $('#condensedResultsGraph');
		this.$condensed = $('<canvas id="condensedResultGraphCanvas">');
		$condensedContainer.append(this.$condensed);
		this.condensed = document.getElementById('condensedResultGraphCanvas');
	}
};

BreathResults.prototype.populate = function(data) {
	var length = data.length,
		first = data[0],
		last = data[length-1];

	this.$condensed.css({
		width: '100%',
		height: '100%'
	});

	this.canvasWidth = this.$condensed.width();
	this.canvasHeight = this.$condensed.height();
	var canvasWidth = this.canvasWidth,
		canvasHeight = this.canvasHeight;
		
	var ctx1 = this.fullGraph.getContext('2d');
	var ctx2 = this.condensed.getContext('2d');
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);

	if (length > 1) {
		// Fix canvas sizes

		this.condensed.width = canvasWidth;
		this.condensed.height = canvasHeight;

		var timeSpan = last.t - first.t,
			ratio = timeSpan / this.timeLimit,
			fullWidth = canvasWidth * Math.max(ratio,1);
		this.$fullGraph.css({
			width: fullWidth,
			height: canvasHeight
		});
		this.fullGraph.width = fullWidth;
		this.fullGraph.height = canvasHeight;


		// Get graph properties
		var color = this.color,
			lineWidth = this.lineWidth;

		// Draw full graph
		this.drawFullGraph(ctx1, data, fullWidth, canvasHeight, timeSpan);

		// Draw condensed graph
		if (ratio < 1) {
			this.drawFullGraph(ctx2, data, fullWidth, canvasHeight, timeSpan);
		} else {
			this.drawCondensedGraph(ctx2, data, ratio, fullWidth, canvasWidth, canvasHeight, timeSpan);
		}
	}
};

BreathResults.prototype.drawFullGraph = function(ctx, data, fullWidth, canvasHeight, timeSpan) {
	var length = data.length;
	ctx.strokeStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	ctx.beginPath();
	var firstPoint = data[0],
		t0 = firstPoint.t;
	ctx.moveTo(0,(0.9 - firstPoint.y*0.8)*canvasHeight);
	var point;
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.lineTo((point.t-t0)/timeSpan*fullWidth,(0.9 -point.y*0.8)*canvasHeight);
	}
	ctx.stroke();
	ctx.closePath();
}

BreathResults.prototype.drawCondensedGraph = function(ctx, data, ratio, fullWidth, canvasWidth, canvasHeight, timeSpan) {
	var length = data.length;
	ctx.strokeStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	// Draw first sequence
	ctx.beginPath();
	var firstPoint = data[0],
		t0 = firstPoint.t;
	ctx.moveTo(0,(0.9 - firstPoint.y*0.8)*canvasHeight);
	var point;
	for (var i = 1; i < length; i++) {
		point = data[i];
		var part = (point.t-t0)/timeSpan,
			x = Math.min(part*fullWidth,0.5*canvasWidth);
		ctx.lineTo(x,(0.9 -point.y*0.8)*canvasHeight);
		if (part/ratio > 0.5) break;
	}
	ctx.stroke();
	ctx.closePath();

	// Draw last sequence
	ctx.beginPath();
	var lastPoint = data[length-1],
		tl = lastPoint.t;
	ctx.moveTo(canvasWidth,(0.9 - lastPoint.y*0.8)*canvasHeight);
	var point;
	for (var i = length-2; i >= 0; i--) {
		point = data[i];
		var part = (tl-point.t)/timeSpan,
			x = Math.max(canvasWidth-part*fullWidth,0.5*canvasWidth);
		ctx.lineTo(x,(0.9 -point.y*0.8)*canvasHeight);
		if (part/ratio > 0.5) break;
	}
	ctx.stroke();
	ctx.closePath();
}