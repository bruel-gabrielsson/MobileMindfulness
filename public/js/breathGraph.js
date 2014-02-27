var BreathGraph = function() {};

BreathGraph.prototype.init = function(historyLimit, color, lineWidth, idealPeriod, idealColor) {
	this.historyLimit = historyLimit;
	this.idealPeriod = idealPeriod;
	this.onStartCallbacks = [];
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.idealColor = 'rgb(' + idealColor[0] + ',' + idealColor[1] + ',' + idealColor[2] + ')';
	this.lineWidth = lineWidth;

	var $container = $('#breathGraph');
	if ($container.length) {
		this.$canvas = $('<canvas id="breathGraphCanvas">');
		$container.append(this.$canvas);
		
		this.$guidanceToggle = $('#guidanceCheckbox');

		this.canvas = document.getElementById('breathGraphCanvas');
		this.iv;
		this.reset();
	}
};

BreathGraph.prototype.reset = function() {
	this.$canvas.css({
		width: '50%',
		height: '100%'
	});

	this.canvasWidth = this.$canvas.width();
	this.canvasHeight = this.$canvas.height();
	this.canvas.width = this.canvasWidth;
	this.canvas.height = this.canvasHeight;
};

BreathGraph.prototype.onStart = function(callback) {
	this.onStartCallbacks.push(callback);
};

BreathGraph.prototype.start = function() {
	this.reset();
	var self = this;
	this.data = [];
};

BreathGraph.prototype.stop = function() {
	clearInterval(this.iv);
	return this.data;
};

BreathGraph.prototype.appendData = function(y) {
	var self = this;
	if (this.data.length == 0) {
		this.startTime = new Date().getTime();
		this.iv = setInterval(self.loop.bind(self), 1);
		var callbacks = this.onStartCallbacks;
		var l = callbacks.length;
		for (var i = 0; i < l; i++) {
			callbacks[i]();
		}
	}
	var t = new Date().getTime() - this.startTime;
	this.data.push({t:t,y:y});
};

BreathGraph.prototype.loop = function() {
	var canvas = this.canvas,
		ctx = canvas.getContext('2d'),
		showData = [],
		limit = this.historyLimit,
		data = this.data,
		length = data.length,
		now = new Date().getTime() - this.startTime,
		canvasWidth = this.canvasWidth,
		canvasHeight = this.canvasHeight,
		color = this.color,
		lineWidth = this.lineWidth;

	ctx.clearRect(0,0,canvasWidth,canvasHeight);

	var i;
	for (i = length-1; i >= 0 && (now - data[i].t) < limit; i--) {
		var x = (1 - (now - data[i].t) / limit),
			y = data[i].y;
		showData.push({x:x,y:y});
	}
	if (showData.length > 1 && i >= 0) {
		var x = (1 - (now - data[i].t) / limit),
			y = data[i].y;
		showData.push({x:x,y:y});
	}
	if (!showData.length && data.length > 1) {
		var x = 0,
			y = i >= 0 ? data[i].y : 0.5;
		showData.push({x:x,y:y});
		showData.push({x:x,y:y});
		showData.push({x:x,y:y});
	}
	var showDataLength = showData.length;
	if (showDataLength > 0) {
		if (this.$guidanceToggle.length && this.$guidanceToggle.is(':checked')){
			var POINTS = 100,
				GUIDE_COLOR = this.idealColor,
				PERIOD = (this.idealPeriod/limit)*canvasWidth/(2*Math.PI),
				AMPLITUDE = canvasHeight*0.4;

			ctx.strokeStyle = GUIDE_COLOR;
			ctx.lineWidth = lineWidth/2;
			ctx.beginPath();

			var offset = now/limit * canvasWidth;
			var initI = (now < limit) ? POINTS*(1-now/limit) : 0;
			var initX = initI*(canvasWidth/POINTS);
			initI = Math.floor(initI);
			ctx.moveTo(initX, Math.sin((offset + initX)/PERIOD)*AMPLITUDE + canvasHeight/2);

			for (var i = initI+1; i < POINTS; i++){
				var x_val = i*(canvasWidth/POINTS),
					y_val = Math.sin((x_val + offset)/PERIOD)*AMPLITUDE + canvasHeight/2;
				ctx.lineTo(x_val, y_val);
			}
			ctx.stroke();
			ctx.closePath();
		}

		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = color;

		ctx.beginPath();
		var firstPoint = showData[showDataLength-1];
		ctx.moveTo(firstPoint.x*canvasWidth,(0.9 - firstPoint.y*0.8)*canvasHeight);
		var point;
		for (var j = showDataLength-2; j >= 0; j--) {
			point = showData[j];
			ctx.lineTo(point.x*canvasWidth,(0.9 -point.y*0.8)*canvasHeight);
		}
		if (showDataLength > 2) {
			ctx.lineTo(canvasWidth,(0.9 -point.y*0.8)*canvasHeight);
		}
		ctx.stroke();
		ctx.closePath();
	}
};