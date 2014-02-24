var BreathProgress = function() {};

BreathProgress.prototype.init = function(dayLimit, color, lineWidth) {
	this.dayLimit = dayLimit; // How many days should fit into the screen
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;
	this.$message = $('<div class="messageDialog"></div>');

	var $graphContainer = $('#progressGraph');
	if ($graphContainer.length) {
		this.$yLabels = $('<div class="y-axis labels">');
		this.$scrollable = $('<div class="scrollGraph">');
		this.$graph = $('<canvas id="progressGraphCanvas">');
		this.$xLabels = $('<div class="labels">');
		this.$scrollable.append(this.$graph, this.$xLabels);
		$graphContainer.append(this.$yLabels, this.$scrollable);
		this.graph = document.getElementById('progressGraphCanvas');
	}

	this.$sessions = $('#sessions');
	this.fetched = false;
};

BreathProgress.prototype.showMessage = function(message) {
	this.$message.detach();
	this.$message.html(message);
	$('#progress-page .page-content').append(this.$message);
};

BreathProgress.prototype.updateSessions = function(force) {
	if (!force && this.fetched) {
		return; // Do not fetch new data if no new data is uploaded
	}
	this.$message.detach();
	this.fetched = true;

	// Show the loading page
	$("#loading").show();
	
	var self = this;
	$.get('/breathingsession/history', function(sessions) {
		self.clearSessions();
		if (sessions !== undefined && sessions.message) {
			self.showMessage(sessions.message);
			$("#loading").hide();
		} else {
			var numberOfSessions = sessions.length;
			for (var i = 0; i < numberOfSessions; i++) {
				self.addSession(sessions[i]);
			}
			self.populate(sessions);

			// Take loading page away
			$("#loading").hide();
			
		}
	});
	
};

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

	var $date = $('<h5>' + new Date(session.date).toDateString() + '</h5>');

	var dt = session.data[session.data.length-1].t - session.data[0].t;
	var s = Math.round(dt/1000);
	var m = Math.floor(s/60);
	s %= 60;
	var $duration = $('<h5 class="duration">' + (m>0?(m + 'm'):'') + (m>0&&s>0?' ':'') + (s>0?(s + 's'):'') + '</h5>');
	$session.append($date, $duration);

	$session.click(function() {
		self.notify(session);
	});

	this.$sessions.prepend($session);
};

BreathProgress.prototype.populate = function(sessions) {

	var length = sessions.length;

	this.$graph.css({
		width: '100%',
		height: '80px'
	});

	this.canvasWidth = this.$graph.width()-30;
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
			var date = new Date(sessions[i].date);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
			date = date.valueOf();
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
		if (length > 1) {
			var first = dataPoints[0],
				last = dataPoints[length-1];

			var timeSpan = last.date - first.date,
				timeLimit = length > 2 ? this.dayLimit * 24 * 60 * 60 * 1000 : timeSpan,
				ratio = timeSpan/timeLimit,
				fullWidth = canvasWidth * Math.max(ratio,1);
			this.$graph.css({
				width: fullWidth,
				height: canvasHeight
			});
			this.$xLabels.css({
				width: fullWidth
			});
			this.$yLabels.css({
				height: canvasHeight + 30
			});
			this.graph.width = fullWidth;
			this.graph.height = canvasHeight;

			// Get graph properties
			var color = this.color,
				lineWidth = this.lineWidth;

			// Draw graph
			this.drawGraph(ctx, dataPoints, fullWidth, canvasHeight, timeSpan, this.$xLabels, this.$yLabels, maxY);
		}
	}
};

BreathProgress.prototype.drawGraph = function(ctx, data, fullWidth, canvasHeight, timeSpan, $xLabels, $yLabels, maxY) {
	var length = data.length;
	ctx.strokeStyle = this.color;
	ctx.fillStyle = this.color;
	ctx.lineWidth = this.lineWidth;
	ctx.beginPath();
	var firstPoint = data[0],
		t0 = firstPoint.date;
	var circleRadius = 5,
		xMargin = 20;
	fullWidth -= 2*xMargin;
	ctx.moveTo(xMargin,(0.9 - firstPoint.duration/maxY*0.8)*canvasHeight);
	var point;
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.lineTo(xMargin + (point.date-t0)/timeSpan*fullWidth,(0.9 -point.duration/maxY*0.8)*canvasHeight);
	}
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(xMargin + (firstPoint.date-t0)/timeSpan*fullWidth,(0.9 -firstPoint.duration/maxY*0.8)*canvasHeight,circleRadius,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
	for (var i = 1; i < length; i++) {
		point = data[i];
		ctx.beginPath();
		ctx.arc(xMargin + (point.date-t0)/timeSpan*fullWidth,(0.9 -point.duration/maxY*0.8)*canvasHeight,circleRadius,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	$xLabels.empty();
	var dayLimit = this.dayLimit;
	var startTime = data[0].date;
	var endTime = data[length-1].date;
	var dayMs = 24*60*60*1000;
	var step = Math.floor(dayLimit/4) * dayMs;
	for (var ms = startTime; ms <= endTime; ms += dayMs) {
		var $label = $('<label>');
		if (ms !== startTime && ms !== endTime && ((endTime-ms) % step || ms - startTime <= step/2)) {
			var date = new Date(ms);
			var month = date.getMonth() + 1;
			var day = date.getDate();
			$label.addClass('tick');
		} else {
			var date = new Date(ms);
			var month = date.getMonth() + 1;
			var day = date.getDate();
			$label.text(month + '/' + day);
		}
		var css = {};
		//if (ms == endTime) css.right = 0;
		//else if (ms == startTime) css.left = 0;
		css.left = xMargin + ((ms-startTime)/(endTime-startTime)*fullWidth);
		$label.css(css);
		$xLabels.append($label);
	}

	$yLabels.empty();
	var maxMinutes = maxY/(60*1000);
	var $label0 = $('<label>0</label>');
	$label0.css({top: 0.9*canvasHeight});
	$yLabels.append($label0);
	var step = maxMinutes > 2 ? (Math.floor(maxMinutes / 2)) :
			   maxMinutes > 0.5 ? 0.5 :
			   0.1;
	for (var m = 0; m <= maxMinutes; m += step) {
		var $label = $('<label>');
		$label.css({top:(0.9 -m/maxMinutes*0.8)*canvasHeight});
		var time = Math.round(m*10)/10;
		if (time == 0.5) time = '½';
		else if (time == 1.5) time = '1½';
		$label.text(time);
		$yLabels.append($label);
	}

	this.$scrollable.scrollLeft(fullWidth);
}