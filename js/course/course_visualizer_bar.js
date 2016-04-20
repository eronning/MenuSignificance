var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 1250 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

d3.csv("data/course_times.csv", function(data) {

  var startMap = {};
  for (i in data) {
    // list of objects
    var element = data[i];
    /*console.log(element);*/
    var start_split = element.start.split(' ');
    var start_time = start_split[1];

    if (startMap[start_time] == undefined) {
        startMap[start_time] = {};
    }

    var classes = startMap[start_time];
    var classNumber = element.number;
    if (classes[classNumber] == undefined) {
      classes[classNumber] = new Array();
    }
    var arr = classes[classNumber];
    arr.push(element);

  }
  var parsedData = new Array();
  for (var time in startMap) {
    var timeSlot = startMap[time];
    var size = 0;
    for (var course in timeSlot) {
      var courseInfo = timeSlot[course][0];
      size += courseInfo.seats_total - courseInfo.seats_available;
    }
    parsedData.push({time: time, size: size});
  }

 
  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);


  parsedData.sort(timeCompare);
	x.domain(parsedData.map(function(d) {return d.time; }));
  y.domain([0, d3.max(parsedData, function(d) {return d.size; })]);


  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var svg = d3.select("#visual").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Number of Students:</strong> <span style='color:red'>" + d.size + "</span>";
  })

  svg.call(tip);
  
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

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Students");

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

function type(d) {
  d.frequency = +d.frequency;
  return d;
}

function timeCompare(a, b) {
    return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
}