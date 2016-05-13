var diameter = 1200,
    format = d3.format(",d");

var pack = d3.layout.pack()
    .size([diameter - 4, diameter - 4])
    .value(function(d) { return d.size; });

// read in all of the data
d3.csv("data/course_times.csv", function(data) {

  // create a map for all of the data
	var map = {};
	for (i in data) {
		// list of objects
		var element = data[i];
    var start_split = element.start.split(' ');
    var start_time = start_split[1];
    // check to see if the key exists
		if (map[start_time] == undefined) {
        map[start_time] = {};
    }
    // get the classes at that time
    var classes = map[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    // add the class to that timeslot
    var arr = classes[classNumber];
    arr.push(element);

	}

  // format data 
  var childNodes = new Array();
  // iterate through each timeslot in the map
  for (var key in map) {
    var s = map[key];
    var leafNodes = new Array();
    // iterate through each class in the timeslot
    for (var k in s) {
      // only need one of the times
      var ele = s[k][0];
      var size = ele.seats_total - ele.seats_available;
      // add all of the data to the array of nodes
      var leafObj = {name: k, size: size};
      leafNodes.push(leafObj);
    }
    // add the list of nodes
    var childObj = {name: key, children: leafNodes};
    childNodes.push(childObj);
  }

  // generate a hierarchy to visualize
  var hierarchy = {name: 'root', children: childNodes};

  // create the svg to build on
  var svg = d3.select("#visual").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(2,2)");

  // generate nodes from all of the data
  var node = svg.datum(hierarchy).selectAll(".node")
      .data(pack.nodes)
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // give each node a title
  node.append("title")
      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

  // make each node a circle
  node.append("circle")
      .attr("r", function(d) {return d.r; });

  // add text about each circle
  node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name.substring(0, d.r / 3); });

 
});

d3.select(self.frameElement).style("height", diameter + "px");