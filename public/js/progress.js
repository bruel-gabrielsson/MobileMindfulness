
function createDatesObject(){
	freq = {};
	//go back 30 days
	for (var i = 30;  i >= 0; i--){
		var current = sameDateButZeroTime(new Date());
		current.setDate(current.getDate() - i);
		freq[current.toUTCString()] = 0;
		console.log("Inserting " + current.toUTCString() + "into freq.");
	}
	return freq;
}

function createDatesArray(){
	var dates = [];
	//go back 30 days
	for (var i = 30;  i >= 0; i--){
		var current = sameDateButZeroTime(new Date());
		current.setDate(current.getDate() - i);
		freq.append(current.toUTCString());
	}
	return dates;
}

function sameDateButZeroTime(d){
	var e = new Date(d);
	e.setUTCHours(0);
	e.setUTCMinutes(0);
	e.setUTCSeconds(0);
	e.setUTCMilliseconds(0);
	return e;
}

function populateTable(result) {
	console.log("Populating table.");

	var freq = createDatesObject();

	$("#wait-msg").hide();
	$("#progress-table").show();

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

		var d = sameDateButZeroTime(new Date(record['date'])).toUTCString();
		console.log("Reviewing session from date " + d);
		if (d in freq){
			freq[d] += duration; //Session durations for the same day are additive.
			console.log(d + " was found in the data.");
		}
	});

	//TODO: set up the graph

	$(".session_link").click(function(e) {
		e.preventDefault();
		var sessionID = parseInt(jQuery(this).attr("id"));
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