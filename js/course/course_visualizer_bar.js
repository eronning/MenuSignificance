var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1250 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// read in the course data file
d3.csv("data/course/course_data.csv", function(data) {
  // generate a map of all hte data
  var startMap = {};
  for (i in data) {
    // list of objects
    var element = data[i];
    var start_split = element.start.split(' ');
    var start_time = start_split[1];
    // check if the time exists in the map
    if (startMap[start_time] == undefined) {
        // if not -- create a new map
        startMap[start_time] = {};
    }
    // get the classes at that time
    var classes = startMap[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    // add the new class number to the array of classes
    var arr = classes[classNumber];
    arr.push(element);

  }
  // go through the time keys in the map
  var parsedData = new Array();
  for (var time in startMap) {
    var timeSlot = startMap[time];
    var size = 0;
    // iterate through each course at the timeslot
    for (var course in timeSlot) {
      // accumulate the course info by adding the size of the courses
      var courseInfo = timeSlot[course][0];
      size += courseInfo.seats_total - courseInfo.seats_available;
    }
    // add all the data
    parsedData.push({time: time, size: size});
  }

  // define x values
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
  // define y values
  var y = d3.scale.linear()
    .range([height, 0]);

  // sort data based on time
  parsedData.sort(timeCompare);
	x.domain(parsedData.map(function(d) {return d.time; }));
  y.domain([0, d3.max(parsedData, function(d) {return d.size; })]);

  // define x axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  // define y axis
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  // generate the svg
  var svg = d3.select("#course_bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // create a tool tip to add to the svg
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Number of Students:</strong> <span style='color:red'>" + d.size + "</span>";
  })

  // add the tooltip
  svg.call(tip);
  
  // generate the x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", width)
      .attr("y", -25)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Start Time of Classes");

  // generate the y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Students");

  // create bars for the graph from the formatted data
  svg.selectAll(".bar")
      .data(parsedData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.time); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.size); })
      .attr("height", function(d) { return height - y(d.size); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

 
});

// define the tyepe the data to be integer values
function type(d) {
  d.frequency = +d.frequency;
  return d;
}

// create time compare function for sorting times
function timeCompare(a, b) {
    return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
}