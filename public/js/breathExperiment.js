var BreathExperiment = function() {};

BreathExperiment.prototype.init = function(timeLimit, color, lineWidth) {
	this.timeLimit = timeLimit;
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;
	this.initialized = false;
	this.nGraphs = 0;

	var $guidanceSessions = $('#guidanceSessions');
	if ($guidanceSessions.length) {
		this.initialized = true;
		this.$guidanceSessions = $guidanceSessions;
		this.$indexSessions = $('#indexSessions');
	}
};

BreathExperiment.prototype.addGraph = function(data, $parent) {

	this.$indexSessions.css({height:'1000px'});

	var self = this;
	var $graphContainer = $('<div class="expGraph">'),
		$graphCanvas = $('<canvas class="graphCanvas" id="canv' + self.nGraphs + '">'),
		$labels = $('<div class="labels">');
	$graphContainer.append($graphCanvas, $labels);
	$parent.append($graphContainer);
	var graph = document.getElementById('canv' + self.nGraphs++);

	var length = data.length,
		first = data[0],
		last = data[length-1];

	$graphCanvas.css({
		width: '100%',
		height: '80px'
	});

	var canvasWidth = $graphCanvas.width(),
		canvasHeight = $graphCanvas.height();

	var ww = $(window).width(),
	ctx = graph.getContext('2d');

	if (length > 1) {
		//this.condensed.width = canvasWidth;
		//this.condensed.height = canvasHeight;

		var timeSpan = parseInt(last.t) - parseInt(first.t),
			ratio = timeSpan / this.timeLimit,
			fullWidth = canvasWidth * Math.max(ratio,1);

		$graphCanvas.css({
			width: fullWidth,
			height: canvasHeight
		});

		$labels.css({
			width: fullWidth
		});

		graph.width = fullWidth;
		graph.height = canvasHeight;

		var color = self.color,
			lineWidth = self.lineWidth;

		self.drawFullGraph(ctx,data,fullWidth,canvasHeight,timeSpan,$labels);
	}
	this.$indexSessions.css({height:'auto'});
};

BreathExperiment.prototype.drawFullGraph = function(ctx, data, fullWidth, canvasHeight, timeSpan, $labels) {
	var length = data.length;
	ctx.strokeStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	ctx.beginPath();
	var firstPoint = data[0],
		t0 = parseInt(firstPoint.t);
	ctx.moveTo(0,(0.9 - firstPoint.y*0.8)*canvasHeight);
	var point;
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.lineTo((parseInt(point.t)-t0)/timeSpan*fullWidth,(0.9 -point.y*0.8)*canvasHeight);
	}
	ctx.stroke();
	ctx.closePath();
	$labels.empty();
	var timeLimit = this.timeLimit;
	var startTime = parseInt(data[0].t);
	var endTime = parseInt(data[length-1].t);
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
	if (ms !== endTime + timeLimit/2) {
		var s = Math.round(endTime/1000);
		var m = Math.floor(s/60);
		s %= 60;
		var $label = $('<label>' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</label>');
		$label.css({right:0});
		$labels.append($label);
	}
}

BreathExperiment.prototype.updateSessions = function() {
	// Show the loading page
	$("#loading").show();
	$(".loading-overlay").show();
	
	var self = this;

	$.get('/breathingsession/experiment', function(sessions) {
		self.clearSessions();
		if (sessions !== undefined && sessions.message) {
			self.showMessage(sessions.message);
			$("#loading").hide();
			$(".loading-overlay").hide();

		} else {
			var $guidance = self.$guidanceSessions,
				$index = self.$indexSessions;

			var guidance = sessions.guidance,
				index = sessions.index;

			var gl = guidance.length,
				il = index.length;

			for (var i = 0; i < gl; i++) {
				self.addGraph(guidance[i].data, $guidance);
			}

			for (var i = 0; i < il; i++) {
				self.addGraph(index[i].data, $index);
			}

			// Take loading page away
			$("#loading").hide();
			$(".loading-overlay").hide();
		}
	});
	
};

BreathExperiment.prototype.clearSessions = function() {
	if (this.initialized) {
		this.$guidanceSessions.empty();
		this.$indexSessions.empty();
	}
};