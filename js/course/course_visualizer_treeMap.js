var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// define a color
var color = d3.scale.category20c();

// define the treemap
var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

// read in all of the data
d3.csv("data/course_times.csv", function(data) {

  // create a map of all of the data
	var map = {};
	for (i in data) {
		// list of objects
		var element = data[i];
    var start_split = element.start.split(' ');
    var start_time = start_split[1];
    // check if the key exists
		if (map[start_time] == undefined) {
        // if not -- create a new map
        map[start_time] = {};
    }
    // get the classes at that timeslot
    var classes = map[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    // add the class to its timeslot
    var arr = classes[classNumber];
    arr.push(element);

	}

  // format the data
  var childNodes = new Array();
  // iterate through each timeslot
  for (var key in map) {
    var s = map[key];
    var leafNodes = new Array();
    // iterate through each course in the timeslot
    for (var k in s) {
      // gather all of the information
      var ele = s[k][0];
      var size = ele.seats_total - ele.seats_available;
      // store the information in a object
      var leafObj = {name: k, size: size};
      leafNodes.push(leafObj);
    }
    // add the nodes to outer container
    var childObj = {name: key, children: leafNodes};
    childNodes.push(childObj);
  }

  // generate a hierarchy to visualize
  var hierarchy = {name: 'root', children: childNodes};

  // create a div to add to
  var div = d3.select("#visual").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

  // start creating nodes from all of the formatted data
  var node = div.datum(hierarchy).selectAll(".node")
        .data(treemap.nodes)
      .enter().append("div")
        .attr("class", "node")
        .call(position)
        .style("background", function(d) { return d.children ? color(d.name) : null; })
        .text(function(d) { return d.children ? null : d.name; });
    d3.selectAll("input").on("change", function change() {
      var value = this.value === "count"
          ? function() { return 1; }
          : function(d) { return d.size; };

      node
          .data(treemap.value(value).nodes)
        .transition()
          .duration(1500)
          .call(position);
    });
});

// generate function to determine positioning
function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
