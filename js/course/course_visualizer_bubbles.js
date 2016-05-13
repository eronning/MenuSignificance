var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20c();

// define a bubble element
var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);


d3.csv("data/course/course_data.csv", function(data) {
  // create a map of all data
	var map = {};
	for (i in data) {
		// list of objects
		var element = data[i];
    var start_split = element.start.split(' ');
    var start_time = start_split[1];
    // check if the key is found
		if (map[start_time] == undefined) {
        // if not -- initialize a new map
        map[start_time] = {};
    }
    // get the classes at that start time
    var classes = map[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    // push the array of classes at that time to the array
    var arr = classes[classNumber];
    arr.push(element);

	}
  // generate a array of al data
  var childNodes = new Array();
  for (var key in map) {
    var s = map[key];
    var leafNodes = new Array();
    for (var k in s) {
      // get the data for each node
      var ele = s[k][0];
      var size = ele.seats_total - ele.seats_available;
      // put the size of the course and name of the course in the node
      var leafObj = {name: k, size: size};
      // add the leaf node to the array
      leafNodes.push(leafObj);
    }
    var childObj = {name: key, children: leafNodes};
    childNodes.push(childObj);
  }
  // create the object to create the visualization from
  var hierarchy = {name: 'root', children: childNodes};

  // build the svg
  var svg = d3.select("#course_bubbles").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  // create nodes from data formatted in hierarchy
  var h = setup(hierarchy);
  var node = svg.selectAll(".node")
      .data(bubble.nodes(h)
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  // make sure to add the title to the node
  node.append("title")
      .text(function(d) {return d.className + ": " + format(d.value); });

  // define each node as a circle 
  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); });

  // add the text of that node
  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); });

 
});

// Returns a flattened hierarchy containing all leaf nodes under the root.
function setup(root) {
  var setup = [];
  // recursively add each elements data
  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else setup.push({packageName: name, className: node.name, value: node.size});
  }
  // make the recursive call
  recurse(null, root);
  return {children: setup};
}

d3.select(self.frameElement).style("height", diameter + "px");