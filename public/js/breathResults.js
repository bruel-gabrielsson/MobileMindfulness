var BreathResults = function() {};

BreathResults.prototype.init = function(timeLimit, color, lineWidth) {
	this.timeLimit = timeLimit;
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;

	var $fullGraphContainer = $('#resultsGraph');
	if ($fullGraphContainer.length) {
		this.$fullGraph = $('<canvas id="resultsGraphCanvas">');
		this.$fullLabels = $('<div class="labels">');
		$fullGraphContainer.append(this.$fullGraph, this.$fullLabels);
		this.fullGraph = document.getElementById('resultsGraphCanvas');

		var $condensedContainer = $('#condensedResultsGraph');
		this.$condensed = $('<canvas id="condensedResultsGraphCanvas">');
		this.$condensedLabels = $('<div class="labels">');
		$condensedContainer.append(this.$condensed, this.$condensedLabels);
		this.condensed = document.getElementById('condensedResultsGraphCanvas');
	}
};

BreathResults.prototype.populate = function(data, date) {

	/*
	function replacer(key, value) {
	    if (typeof value === 'number' && !isFinite(value)) {
	        return String(value);
	    }
	    return value;
	}
	console.log(JSON.stringify(data, replacer));
	*/

	this.data = data;

	if (date !== undefined) {
		$('#results-page h2').text(new Date(date).toDateString());
		if (this.$buttons) {
			this.$saveButton.detach();
			this.$quitButton.detach();
			this.$buttons.append(this.$backButton);
			this.$buttons.addClass('single');
		}
	} else {
		$('#results-page h2').text('Results');
		if (this.$buttons) {
			this.$backButton.detach();
			this.$buttons.append(this.$saveButton, this.$quitButton);
			this.$buttons.removeClass('single');
		}
	}

	var length = data.length,
		first = data[0],
		last = data[length-1];

	this.$condensed.css({
		width: '100%',
		height: '80px'
	});
	this.$fullGraph.css({
		width: this.$condensed.width(),
		height: this.$condensed.height()
	});

	this.canvasWidth = this.$condensed.width();
	this.canvasHeight = this.$condensed.height();
	var canvasWidth = this.canvasWidth,
		canvasHeight = this.canvasHeight;
		

	var ww = $(window).width();
	var ctx1 = this.fullGraph.getContext('2d');
	var ctx2 = this.condensed.getContext('2d');
	ctx1.clearRect(0,0,Math.max(canvasWidth,ww),canvasHeight);
	ctx2.clearRect(0,0,Math.max(canvasWidth,ww),canvasHeight);

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
		this.$fullLabels.css({
			width: fullWidth
		});
		this.fullGraph.width = fullWidth;
		this.fullGraph.height = canvasHeight;


		// Get graph properties
		var color = this.color,
			lineWidth = this.lineWidth;

		// Draw full graph
		this.drawFullGraph(ctx1, data, fullWidth, canvasHeight, timeSpan, this.$fullLabels);

		// Draw condensed graph
		if (ratio < 1) {
			this.drawFullGraph(ctx2, data, fullWidth, canvasHeight, timeSpan, this.$condensedLabels);
		} else {
			this.drawCondensedGraph(ctx2, data, ratio, fullWidth, canvasWidth, canvasHeight, timeSpan, this.$condensedLabels);
		}
	}
};

BreathResults.prototype.drawFullGraph = function(ctx, data, fullWidth, canvasHeight, timeSpan, $labels) {
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
	$labels.empty();
	var timeLimit = this.timeLimit;
	var startTime = data[0].t;
	var endTime = data[length-1].t;
	for (var ms = startTime; ms <= endTime; ms += timeLimit/2) {
		if (endTime - ms <= timeLimit/4 && ms !== startTime) ms = endTime;
		var s = Math.round(ms/1000);
		var m = Math.floor(s/60);
		s %= 60;
		var $label = $('<label>' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</label>');
		var css = {};
		if (ms == endTime) {
			css.right = 0;
		} else if (ms == startTime) {
			css.left = 0;
		} else {
			css.left = (ms/endTime*fullWidth);
		}
		$label.css(css);
		$labels.append($label);
	}
	if (ms !== endTime) {
		var s = Math.round(endTime/1000);
		var m = Math.floor(s/60);
		s %= 60;
		var $label = $('<label>' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</label>');
		$label.css({right:0});
		$labels.append($label);
	}
}

BreathResults.prototype.drawCondensedGraph = function(ctx, data, ratio, fullWidth, canvasWidth, canvasHeight, timeSpan, $labels) {
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

	$labels.empty();

	var startTime = firstPoint.t;
	var s = Math.round(startTime/1000);
	var m = Math.floor(s/60);
	s %= 60;
	var $startLabel = $('<label>' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</label>');
	$startLabel.css({left:0});

	var endTime = data[length-1].t;
	var s = Math.round(endTime/1000);
	var m = Math.floor(s/60);
	s %= 60;
	var $endLabel = $('<label>' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</label>');
	$endLabel.css({right:0});

	$labels.append($startLabel, $endLabel);
}

BreathResults.prototype.backButton = function(callback) {
	this.$buttons = $('#results-page .bottom-buttons');
	if (!this.$saveButton) this.$saveButton = $('#results-page button.save-button');
	this.$quitButton = $('#results-page button.quit-button');
	this.$backButton = $('<button type="button" class="back-to-progress btn btn-danger btn-lg btn-block">Back</button>');
	this.$backButton.click(callback);
};

BreathResults.prototype.saveData = function(callback) {
	var self = this;
	if (!this.$saveButton) this.$saveButton = $('#results-page button.save-button');
	this.$saveButton.click(function() {
		callback(self.data);
	});
};