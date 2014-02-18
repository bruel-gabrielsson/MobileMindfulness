

function populateTable(result) {
	console.log("Populating table.");

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
	});

	$(".session_link").click(function(e) {
		e.preventDefault();
		var sessionID = parseInt(jQuery(this).attr("id"));
		console.log("Session ID clicked: ", sessionID);

		var clickedSession = breath_history[sessionID];
		console.log(clickedSession);
		//TODO: load results screen with this data.
	});

}