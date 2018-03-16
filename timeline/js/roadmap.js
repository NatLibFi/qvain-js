window.onload = function() {
	// convert date to datetime to make sure we get a local time
	function date(rfc) {
		return Date.parse(rfc + "T00:00:00")
	}

	var begin = Date.parse('2018-01-01T00:00:00') // needs to be local time; without time Date.parse() returns UTC
	var end = Date.parse('2019-01-01T00:00:00')

	var dotColor = "#ffa500"
	
	var testData = [
		{label: "qvain.js", times: [
			{label: "core", description: "get core and file API functionality to usable beta state",
				"starting_time": begin, "ending_time": date('2018-03-15')},
			{label: "usability improvements", description: "usability and user interface improvements pending feedback",
				"starting_time": date('2018-04-01'), "ending_time": date('2018-07-01')},
			{label: "automated tooling", description: "look into automated tooling and associated APIs for users with large datasets",
						"starting_time": date('2018-07-01'), "ending_time": date('2018-09-01')}]},
		{label: "qvain.go", times: [
			{label: "api", description: "finish javascript api",
				"starting_time": begin, "ending_time": date('2018-03-01')},
			{label: "metax", description: "metax dataset sync integration testing",
				"starting_time": date('2018-03-15'), "ending_time": date('2018-04-01')}]},
		{label: "qvain.id", times: [
			{label: "IdM evalution", description: "development pending FairData IdM solution at CSC",
				"starting_time": begin, "ending_time": date('2018-03-15')},
			{label: "IdM integration", description: "integration with chosen FairData IdM solution at CSC",
				"starting_time": date('2018-04-01'), "ending_time": date('2018-07-01')}]},
		{label: "ops", times: [
			{label: "test env", description: "testing environment up and running",
				"starting_time": date('2018-03-01'), "ending_time": date('2018-04-01')},
			{label: "prod env", description: "setup production environment from testing environment",
				"starting_time": date('2018-04-01'), "ending_time": date('2018-05-01')}]},
		{label: "release", times: [
			{label: "", description: "Qvain backend code release",
				"starting_time": date('2018-03-01'), "ending_time": date('2018-03-15'), "display": "circle", "color": dotColor},
			{label: "", description: "Qvain frontend code release",
				"starting_time": date('2018-03-15'), "ending_time": date('2018-04-01'), "display": "circle", "color": dotColor},
			{label: "", description: "projected 1.0 release for Qvain",
				"starting_time": date('2018-07-01'), "ending_time": date('2018-07-15'), "display": "circle", "color": dotColor}]}
	];

	var width = 1500;

	var customTimeFormat = d3.time.format.multi([
		[".%L", function(d) { return d.getMilliseconds(); }],
		[":%S", function(d) { return d.getSeconds(); }],
		["%I:%M", function(d) { return d.getMinutes(); }],
		["%I %p", function(d) { return d.getHours(); }],
		["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
		["%b %d", function(d) { return d.getDate() != 1; }],
		["%b", function(d) { return d.getMonth(); }],
		["%b %Y", function() { return true; }]
	]);

	var palette = colorbrewer.RdPu[9]
	
	function colors(n) {
		return palette[n%palette.length]
	}
	
	//var myTickFormat = Object.assign(d3.timeline().tickFormat(), {format: d3.time.format("%H")})
	var myTickFormat = {
		//format: d3.time.format("%b"),
		format: customTimeFormat,
		tickTime: d3.time.month,
		tickInterval: 1,
		tickSize: 6
	}
	var myTodayFormat = Object.assign(d3.timeline().showTodayFormat(), {color: "darkred", marginTop: 0, marginBottom: 0, width: 2})
	
	var chart = d3.timeline().beginning(begin).ending(end).background('#eeeeee').colors(d3.scale.category20c()).stack().tickFormat(myTickFormat).showTodayFormat(myTodayFormat).showTimeAxisTick().margin({left:70, right:30, top:0, bottom:0})
	//var chart = d3.timeline().beginning(begin).ending(end).background('#eeeeee').colors(colors).stack().tickFormat(myTickFormat).showTodayFormat(myTodayFormat).showTimeAxisTick().margin({left:70, right:30, top:0, bottom:0})
		if (false) {
		chart.showToday()
	}
		
	var svg = d3.select("#roadmap").append("svg").attr("width", width).datum(testData).call(chart);

	function prependZero(n) {
		if (n < 10) {
			return "0" + n
		}
		return n
	}

	function dateToIso(numDate) {
		var date = new Date(numDate)
		return date.getFullYear() + "-" + prependZero(date.getMonth()+1) + "-" + prependZero(date.getDate())
	}

	var explanation = document.getElementById('explanation');
	var deflist = document.createElement("dl");
	explanation.append(deflist)

	for (i in testData) {
		var dt = document.createElement("dt");
		dt.append(testData[i].label);
		deflist.append(dt);

		for (t in testData[i].times) {
			var dd = document.createElement("dd");
			var start = testData[i].times[t]["starting_time"]
			var end = testData[i].times[t]["ending_time"]
			var isCircle = testData[i].times[t]["display"] === "circle"
			if (!isCircle) {
				dd.append(dateToIso(start) + " – " + dateToIso(end) + ": ")
			} else {
				dd.append(dateToIso(start) + ": ")
			}
			dd.append(testData[i].times[t].description)
			if (!isCircle && testData[i].times[t]['label']) {
				var boldLabel = document.createElement("b")
				boldLabel.classList.add("label")
				boldLabel.append(testData[i].times[t].label)
				dd.append(boldLabel)
			}
						
			deflist.append(dd);
		}
	}
};
