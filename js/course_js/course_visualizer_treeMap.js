var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var color = d3.scale.category20c();

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });


d3.csv("data/course_times.csv", function(data) {

	var map = {};
	for (i in data) {
		// list of objects
		var element = data[i];
    /*console.log(element);*/
    var start_split = element.start.split(' ');
    var start_time = start_split[1];

		if (map[start_time] == undefined) {
        map[start_time] = {};
    }

    var classes = map[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    var arr = classes[classNumber];
    arr.push(element);

	}
  var childNodes = new Array();
  for (var key in map) {
    var s = map[key];
    var leafNodes = new Array();
    for (var k in s) {
      var ele = s[k][0];
      var size = ele.seats_total - ele.seats_available;
      var leafObj = {name: k, size: size};
      leafNodes.push(leafObj);
    }
    var childObj = {name: key, children: leafNodes};
    childNodes.push(childObj);
  }
  var hierarchy = {name: 'root', children: childNodes};

  var div = d3.select("#visual").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

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

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
