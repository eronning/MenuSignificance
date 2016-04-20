var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);


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

  var svg = d3.select("#visual").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

    /*var a = classes(root);*/
    var h = setup(hierarchy);
    var node = svg.selectAll(".node")
        .data(bubble.nodes(h)
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) {return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.packageName); });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) {console.log(d); return d.className.substring(0, d.r / 3); });

 
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function setup(root) {
  var setup = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else setup.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: setup};
}

d3.select(self.frameElement).style("height", diameter + "px");