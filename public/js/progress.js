var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
	"Aug", "Sep", "Oct", "Nov", "Dec"];

var months_mm = ["01", "02", "03", "04", "05", "06", "07", "08",
	"09", "10", "11", "12"];

var TRAILING_DAYS = 14; //Number of days to go back in recent history

function createDatesObject(){
	var freq = {};
	//go back TRAILING_DAYS days
	for (var i = TRAILING_DAYS;  i >= 0; i--){
		var current = sameDateButZeroTime(new Date());
		current.setDate(current.getDate() - i);
		freq[current.toString()] = 0;
		console.log("Inserting " + current.toString() + "into freq.");
	}
	return freq;
}

function createDatesArray(){
	var dates = [];
	//go back TRAILING_DAYS days
	for (var i = TRAILING_DAYS;  i >= 0; i--){
		var current = sameDateButZeroTime(new Date());
		current.setDate(current.getDate() - i);
		dates.push(current.toString());
	}
	return dates;
}

function createLabels(){
	var dates = createDatesArray();
	var labels = [];
	for (var i = 0; i < dates.length; i++){
		var date = new Date(dates[i]); //convert back to Date obj
		labels.push(months[date.getMonth()] + "." + date.getDate());
	}
	return labels;
}

function createYVals(freq){
	var dates = createDatesArray();
	var yVals = [];
	for (var i = 0; i < dates.length; i++){
		yVals.push(freq[dates[i]]);
	}
	return yVals;
}

//NOTE: Using setUTC{Hours|Minutes...} was causing problems here
function sameDateButZeroTime(d){
	var e = new Date(d);
	e.setHours(0);
	e.setMinutes(0);
	e.setSeconds(0);
	e.setMilliseconds(0);
	return e;
}

function populateTable(result) {
	console.log("Populating table.");

	var freq = createDatesObject();

	$("#wait-msg").hide();
	$("#progress-table").show();
	$("progress-graph").show();

	var $p_table = $("#progress-table");
	var breath_history = result['breath_history'];
	$.each(breath_history, function (index, record){
		if (index == 0) {
			html = "<tr>";
			html += "<th>Date</th>";
			html += "<th>Duration</th>";
			html += "</tr>";
			$p_table.html(html); //Completely overwrite any existing contents of the table
		}

		html = "<tr>";
		html += "<td>" + "<a class = 'session_link' id = '" + index + "'>" + record['date'] + "</a>" + "</td>";
		var time_series = record['graph_data'];
		var length = time_series.length;
		var first_tuple = record['graph_data'][0];
		var last_tuple = record['graph_data'][length - 1];
		var duration = last_tuple['t'] - first_tuple['t'];
		html += "<td>" + duration + "</td>";

		html += "</tr>";
		$p_table.append(html);

		var d = sameDateButZeroTime(new Date(record['date'])).toString();
		console.log("Reviewing session from date " + d);
		if (d in freq){
			freq[d] += duration; //Session durations for the same day are additive.
			console.log(d + " was found in the data.");
		}
	});

	//Reset the graph canvas' width and height each the page
	//is loaded--otherwise width and height double for some
	//reason upon each viewing
	$("#progress-graph").get(0)['width'] = 400;
	$("#progress-graph").get(0)['height'] = 200;

	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#progress-graph").get(0).getContext("2d");

	var x_labels = createLabels();
	var yVals = createYVals(freq);

	var data = {
		labels : x_labels,
		datasets : [
			{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				data : yVals
			}
		]
	};

	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx).Bar(data, {});

	$(".session_link").click(function(e) {
		e.preventDefault();
		var sessionID = parseInt(jQuery(this).attr("id")); //get the ID from the session that was clicked
		console.log("Session ID clicked: ", sessionID);

		//render the results screen with this data.

		var clickedSession = breath_history[sessionID],
			data = clickedSession['graph_data'];

		//TODO: try to avoid these redefinitions
		var historyLimit = 15000, // Show the last 15 seconds in the graph
			activeLineColor = [255,255,255],
			resultLineColor = [255,255,255],
			lineWidth = 2;

		var $contentPages = $('.content-page');


		console.log(clickedSession);

		var breathResults = new BreathResults();
		breathResults.init(historyLimit*2,resultLineColor,lineWidth);

		$contentPages.hide();
		$("#results-page").show();
		breathResults.populate.call(breathResults,data);
	});

}
