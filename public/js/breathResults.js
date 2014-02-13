var BreathResults = function() {};

BreathResults.prototype.init = function(timeLimit, color, lineWidth) {
	this.timeLimit = timeLimit;
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;

	var $fullGraphContainer = $('#resultsGraph');
	this.$fullGraph = $('<canvas id="resultGraphCanvas">');
	$fullGraphContainer.append(this.$fullGraph);
	this.fullGraph = document.getElementById('resultGraphCanvas');

	var $condensedContainer = $('#condensedResultsGraph');
	this.$condensed = $('<canvas id="condensedResultGraphCanvas">');
	$condensedContainer.append(this.$condensed);
	this.condensed = document.getElementById('condensedResultGraphCanvas');
};

BreathResults.prototype.populate = function(data) {
	var length = data.length,
		first = data[0],
		last = data[length-1];

	if (length > 1) {
		// Fix canvas sizes
		this.$condensed.css({
			width: '100%',
			height: '100%'
		});

		this.canvasWidth = this.$condensed.width();
		this.canvasHeight = this.$condensed.height();
		var canvasWidth = this.canvasWidth,
			canvasHeight = this.canvasHeight;

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
		var ctx = this.fullGraph.getContext('2d');

		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.clearRect(0,0,fullWidth,canvasHeight);
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


		// Draw condensed graph
		ctx = this.condensed.getContext('2d');
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.clearRect(0,0,canvasWidth,canvasHeight);

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
};