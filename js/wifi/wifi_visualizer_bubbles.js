var _max_hour = 19;
var _min_hour = 7

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

d3.csv("data/wifi/wifi_info.csv", function(data) {
	var validTimePairs = new Array();
	for (var i in data) {
		var connect = toDate(data[i].connect_time);
		var disconnect = toDate(data[i].disconnect_time);
		
		if (withinBounds(connect)) {
			validTimePairs.push({connect: connect, disconnect: disconnect});
		}
	}
	var timeMap = [];
	for (var i in validTimePairs) {
		// get the pair of data
		var pair = validTimePairs[i];
		// get the day
		var day = pair.connect.getDay();
		if (timeMap[day] == undefined) {
			timeMap[day] = [];
		}
		var dayMap = timeMap[day];
		var hour = pair.connect.getUTCHours();

		if (dayMap[hour] == undefined) {
			dayMap[hour] = new Array();
		}

		var arr = dayMap[hour];
		arr.push(pair);
	}

	var childNodes = new Array();
    for (var key in timeMap) {
      var days = timeMap[key];
      var leafNodes = new Array();
      for (var hours in days) {
        var leafObj = {name: hours, size: days[hours].length};
        leafNodes.push(leafObj);
      }
      var childObj = {name: key, children: leafNodes};
      childNodes.push(childObj);
    }
    var hierarchy = {name: "root", children: childNodes};

    var svg = d3.select("#wifi_bubbles").append("svg")
	    .attr("width", diameter)
	    .attr("height", diameter)
	  	.append("g")
	    .attr("transform", "translate(2,2)");

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

	svg.call(tip);
    
    var node = svg.datum(hierarchy).selectAll(".node")
      .data(pack.nodes)
      .enter().append("g")
      .attr("class", function(d) {return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

  	/*node.append("title")
      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });*/

  	node.append("circle")
      .attr("r", function(d) { return d.r; });

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

function toDate(time) {
	return new Date(time * 1000);
}

function withinBounds(dateTime) {
	var hours = dateTime.getUTCHours();
	var min = dateTime.getMinutes();
	return hours <= _max_hour
		&& hours >= _min_hour;
}
