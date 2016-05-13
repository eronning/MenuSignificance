// set the hours of the ratty
var _max_hour = 19;
var _min_hour = 7

// define an array of weekdays
var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

var diameter = 960,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 4, diameter - 4])
    .value(function(d) { return d.size; });

// read in all of the wifi information
d3.csv("data/wifi/wifi_info.csv", function(data) {

	// create an array of all valid times
	var validTimePairs = new Array();
	// iterate through all of the data
	for (var i in data) {
		// get a date object from the millisecond format
		var connect = toDate(data[i].connect_time);
		var disconnect = toDate(data[i].disconnect_time);
		// check if the hours of the day are within ratty hours
		if (withinBounds(connect)) {
			validTimePairs.push({connect: connect, disconnect: disconnect});
		}
	}

	// generate a time map
	var timeMap = [];
	for (var i in validTimePairs) {
		// get the pair of data
		var pair = validTimePairs[i];
		// get the day
		var day = pair.connect.getDay();
		if (timeMap[day] == undefined) {
			timeMap[day] = [];
		}
		// get the day map
		var dayMap = timeMap[day];
		var hour = pair.connect.getUTCHours();
		// check if the hour exists
		if (dayMap[hour] == undefined) {
			// if not create a new array
			dayMap[hour] = new Array();
		}
		// add the element to that hour timeslot
		var arr = dayMap[hour];
		arr.push(pair);
	}

	// format all of the data
	var childNodes = new Array();
	// iterate through all of the days
    for (var key in timeMap) {
      var days = timeMap[key];
      var leafNodes = new Array();
      // iterate through all of the valid hours in the day
      for (var hours in days) {
      	// get the information about each object
        var leafObj = {name: hours, size: days[hours].length};
        // add the information to the array
        leafNodes.push(leafObj);
      }
      // get hours information and put it in the day object
      var childObj = {name: key, children: leafNodes};
      // add the day information to the array
      childNodes.push(childObj);
    }

    // create a hierarchy of all of the information
    var hierarchy = {name: "root", children: childNodes};

    // generate the svg to build
    var svg = d3.select("#wifi_bubbles").append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	  	.append("g")
	    .attr("transform", "translate(2,2)");

	// create the tooltip for the visualization
	var tip = d3.tip()
	    .attr('class', 'd3-tip')
	    .offset([-10, 0])
	    .html(function(d) {
	    	if (d.name != "root") {
		    	var info = "Hour";
		    	var data = d.name;
		    	if (d.children) {
		    		info = "Day";
		    		data = weekday[d.name];
		    	}
		    	return "<strong>" + info + ":</strong> <span style='color:red'>" + data + "</span>";
	    	}
	    	return "";
  	})

	// add the tooltip to the svg
	svg.call(tip);
    
    // create all of the nodes from the formatted data
    var node = svg.datum(hierarchy).selectAll(".node")
      .data(pack.nodes)
      .enter().append("g")
      .attr("class", function(d) {return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  	// designate each node a circle
  	node.append("circle")
      .attr("r", function(d) { return d.r; });

    // add the text information to each node
  	node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) {
      	var suffix = (d.name >= 12)? 'pm' : 'am';
      	var hours = (d.name > 12)? d.name - 12 : d.name;
      	var name = hours + suffix;
        return name.substring(0, d.r / 3);
      });


 
});

d3.select(self.frameElement).style("height", diameter + "px");

// get a date object from milliseconds
function toDate(time) {
	return new Date(time * 1000);
}

// check if the hours are within the bounds of the
// hours that the ratty is open
function withinBounds(dateTime) {
	var hours = dateTime.getUTCHours();
	var min = dateTime.getMinutes();
	return hours <= _max_hour
		&& hours >= _min_hour;
}
