var BreathGraph = function() {};

BreathGraph.prototype.init = function(historyLimit, color, lineWidth) {
	var $container = $('#breathGraph');
	var $canvas = $('<canvas id="breathGraphCanvas">');
	$canvas.css({
		width: '50%',
		height: '100%'
	});
	this.historyLimit = historyLimit;
	this.color = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
	this.lineWidth = lineWidth;
	
	$container.append($canvas);
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();
	console.log(this.canvasWidth);
	console.log(this.canvasHeight);
	this.$canvas = $canvas;
	this.canvas = document.getElementById('breathGraphCanvas');
	this.canvas.width = this.canvasWidth;
	this.canvas.height = this.canvasHeight;
	this.iv;
};

BreathGraph.prototype.start = function() {
	var self = this;
	this.data = [];
	this.startTime = new Date().getTime();
	this.iv = setInterval(self.loop.bind(self), 1);
};

BreathGraph.prototype.stop = function() {
	clearInterval(this.iv);
	return this.data;
};

BreathGraph.prototype.appendData = function(y) {
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
		showDataLength = 0,
		color = this.color,
		lineWidth = this.lineWidth;
	var i;
	for (i = length-1; i >= 0 && (now - data[i].t) < limit; i--) {
		var x = (1 - (now - data[i].t) / limit),
			y = data[i].y;
		showData.push({x:x,y:y});
		showDataLength++;
	}
	if (showDataLength > 1 && i >= 0) {
		var x = (1 - (now - data[i].t) / limit),
			y = data[i].y;
		showData.push({x:x,y:y});
		showDataLength++;
	}
	if (showDataLength > 0) {
		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;
		ctx.clearRect(0,0,canvasWidth,canvasHeight);
		ctx.beginPath();
		var firstPoint = showData[showDataLength-1];
		ctx.moveTo(firstPoint.x*canvasWidth,(0.9 - firstPoint.y*0.8)*canvasHeight);
		var point;
		for (var j = showDataLength-2; j >= 0; j--) {
			point = showData[j];
			ctx.lineTo(point.x*canvasWidth,(0.9 -point.y*0.8)*canvasHeight);
			ctx.stroke();
		}
		if (showDataLength > 2) {
			ctx.lineTo(canvasWidth,(0.9 -point.y*0.8)*canvasHeight);
			ctx.stroke();
		}
	}
};