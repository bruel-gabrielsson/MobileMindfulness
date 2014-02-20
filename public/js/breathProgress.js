var BreathProgress = function() {};

BreathProgress.prototype.init = function(dayLimit, color, lineWidth) {
	this.dayLimit = dayLimit; // How many days should fit into the screen
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;

	var $graphContainer = $('#progressGraph');
	if ($graphContainer.length) {
		this.$graph = $('<canvas id="progressGraphCanvas">');
		this.$labels = $('<div class="labels">');
		$graphContainer.append(this.$graph, this.$labels);
		this.graph = document.getElementById('progressGraphCanvas');
	}

	this.$sessions = $('#sessions');
	this.fetched = false;
};

BreathProgress.prototype.updateSessions = function(force) {
	if (!force && this.fetched) {
		return; // Do not fetch new data if no new data is uploaded
	}
	this.fetched = true;
	console.log('fetch data from server');
	
	var self = this;
	getHistory(function(sessions) {

		self.clearSessions();
		var numberOfSessions = sessions.length;
		for (var i = 0; i < numberOfSessions; i++) {
			self.addSession(sessions[i]);
		}
		self.populate(sessions);
	});

	
};

var getHistory = function(call) {

	$.get('/breathingsession/history', function(project_json) {
		call(project_json);
	});
}

BreathProgress.prototype.bind = function(callback) {
	// Bind callback to session click event
	this.callback = callback;
};

BreathProgress.prototype.notify = function(session) {
	if (this.callback !== undefined) {
		this.callback(session);
	}
};

BreathProgress.prototype.clearSessions = function() {
	this.$sessions.empty();
};

BreathProgress.prototype.addSession = function(session) {
	var self = this;
	var $session = $('<div class="session" id="' + session._id + '">');

	var $date = $('<h5>' + session.date + '</h5>');

	var dt = session.data[session.data.length-1].t - session.data[0].t;
	var s = Math.round(dt/1000);
	var m = Math.floor(s/60);
	s %= 60;
	var $duration = $('<h5 class="duration">' + (m<10?0:'') + m + ':' + (s<10?0:'') + s + '</h5>');
	$session.append($date, $duration);

	$session.click(function() {
		self.notify(session);
	});

	this.$sessions.append($session);
};

BreathProgress.prototype.populate = function(sessions) {

	var length = sessions.length;

	this.$graph.css({
		width: '100%',
		height: '80px'
	});

	this.canvasWidth = this.$graph.width();
	this.canvasHeight = this.$graph.height();
	var canvasWidth = this.canvasWidth,
		canvasHeight = this.canvasHeight;

	var ww = $(window).width();
	var ctx = this.graph.getContext('2d');
	ctx.clearRect(0,0,Math.max(canvasWidth,ww),canvasHeight);

	if (length > 1) {
		// Fix canvas sizes
		var dataPoints = [];
		var maxY = 0;

		for (var i = 0; i < length; i++) {
			var sessionData = sessions[i].data;
			var date = Date.parse(sessions[i].date);
			var duration = sessionData[sessionData.length-1].t - sessionData[0].t;
			var lastDPindex = dataPoints.length-1;
			if (i > 0 && date === dataPoints[lastDPindex].date) {
				dataPoints[lastDPindex].duration += duration;
				if (dataPoints[lastDPindex].duration > maxY) maxY = dataPoints[lastDPindex].duration;
			} else {
				var dataPoint = {
					'date': date,
					'duration': duration
				};
				if (duration > maxY) maxY = duration;
				dataPoints.push(dataPoint);
			}
		}

		length = dataPoints.length;
		var first = dataPoints[0],
			last = dataPoints[length-1];

		var timeSpan = last.date - first.date,
			timeLimit = this.dayLimit * 24 * 60 * 60 * 1000,
			ratio = timeSpan/timeLimit,
			fullWidth = canvasWidth * Math.max(ratio,1);
		this.$graph.css({
			width: fullWidth,
			height: canvasHeight
		});
		this.$labels.css({
			width: fullWidth
		});
		this.graph.width = fullWidth;
		this.graph.height = canvasHeight;

		// Get graph properties
		var color = this.color,
			lineWidth = this.lineWidth;

		// Draw graph
		this.drawGraph(ctx, dataPoints, fullWidth, canvasHeight, timeSpan, this.$labels, maxY);
	}
};

BreathProgress.prototype.drawGraph = function(ctx, data, fullWidth, canvasHeight, timeSpan, $labels, maxY) {
	var length = data.length;
	ctx.strokeStyle = this.color;
	ctx.fillStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	ctx.beginPath();
	var firstPoint = data[0],
		t0 = firstPoint.date;
	ctx.moveTo(0,(0.9 - firstPoint.duration/maxY*0.8)*canvasHeight);
	var point;
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.lineTo((point.date-t0)/timeSpan*fullWidth,(0.9 -point.duration/maxY*0.8)*canvasHeight);
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc((firstPoint.date-t0)/timeSpan*fullWidth,(0.9 -firstPoint.duration/maxY*0.8)*canvasHeight,5,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.beginPath();
		ctx.arc((point.date-t0)/timeSpan*fullWidth,(0.9 -point.duration/maxY*0.8)*canvasHeight,5,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	$labels.empty();
	/*
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
	*/
}