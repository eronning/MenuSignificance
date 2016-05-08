var formatTime = d3.time.format("%H:%M");

d3.csv("data/wifi/wifi_info_cleaned.csv", function(error, data) {
  if (error) throw error;

  var time_groupings = {};

  for (i in data) {
    var time = data[i];

    var time_group;

    if (time.week_day in time_groupings) {
      time_group = time_groupings[time.week_day];
      time_group.push(time);
      time_groupings[time.week_day] = time_group;
    }  else {
      time_group = [];
      time_group.push(time);
      time_groupings[time.week_day] = time_group;
    }
  }

  console.log(time_groupings[0]);

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .domain([parseTime("7:30"), parseTime("19:30")])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return +d.num_people; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(11)
      .tickFormat(formatTime)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var line = d3.svg.line()
      .x(function(d) { return x(parseTime(d.hour + ":" + d.minute)); })
      .y(function(d) { return y(d.num_people); });

  var svg = d3.select("#wifi_line").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of people");

  svg.append("path")
      .datum(time_groupings[0])
      .attr("class", "line")
      .attr("fill", "purple")
      .attr("d", line);
});

// parses time
function parseTime(s) {
  var t = formatTime.parse(s);
  if (t != null && t.getHours() < 3) t.setDate(t.getDate() + 1);
  return t;
}