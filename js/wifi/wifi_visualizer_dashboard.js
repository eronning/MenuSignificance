var formatTime = d3.time.format("%H:%M");
var bisectDate = d3.bisector(function(d) { return d.date; }).left;


var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var display_options = ["Pick a specific day", "Pick a weekday"];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days_of_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var years = ["2015", "2016"]

d3.csv("data/wifi/wifi_info_cleaned.csv", function(error, data) {
  if (error) throw error;

  var weekday_groupings = {};
  var yearday_groupings = {};
  for (i in data) {
    var time = data[i];

    var week_group;
    // group by weekday
    if (time.week_day in weekday_groupings) {
      week_group = weekday_groupings[time.week_day];
      week_group.push(time);
      weekday_groupings[time.week_day] = week_group;
    }  else {
      week_group = [];
      week_group.push(time);
      weekday_groupings[time.week_day] = week_group;
    }

    var year_group;
    var yearday_key = yeardayKey(time.year, time.year_day);
    // group by day of the year
    if (yearday_key in yearday_groupings) {
      year_group = yearday_groupings[yearday_key];
      year_group.push(time);
      yearday_groupings[yearday_key] = year_group;
    } else {
      year_group = [];
      year_group.push(time);
      yearday_groupings[yearday_key] = year_group;
    }

  }




  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
      .domain([parseTime("7","30"), parseTime("19","30")])
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
      .x(function(d) { return x(parseTime(d.hour, d.minute)); })
      .y(function(d) { return y(d.num_people); });


  function drawGraph(data) {
    
    var svg = d3.select("#wifi_line").append("svg")
      .attr("id", "wifi_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", 60)
      .attr("y", 20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "steelblue")
      .text("Time of the day");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "steelblue")
      .text("Number of people");

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  }

  function drawError() {
    var svg = d3.select("#wifi_line").append("svg")
      .attr("id", "wifi_svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("x", 60)
      .attr("y", 20)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "steelblue")
      .text("Time of the day");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "steelblue")
      .text("Number of people");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 4)
      .style("fill", "red")
      .text("No wifi data for this day!");
  }

  // Create the select box for choosing options 
  function drawDropdown(id, appendId, data, onchange) {
    
    var select = d3.select(id)
      .append('select')
      .attr('id', appendId)
      .attr('class','dropdown')
      .on('change', onchange)

    var options = select
      .selectAll('option')
      .data(data).enter()
      .append('option')
      .text(function (d) { return d; });
  }
  // on change function for weekdays
  function weekday_onchange() {
    selectValue = d3.select('#secondary_id_weekday').property('value');
    d3.select("#wifi_svg").remove();
    console.log(selectValue);
    drawGraph(weekday_groupings[days.indexOf(selectValue)]);
  };

  function getYeardayIndex() {
    // get the user input values
    selectValue = d3.select('#secondary_id_yearday').property('value');
    var day = +selectValue;
    selectValue = d3.select('#secondary_id_month').property('value');
    var month = months.indexOf(selectValue);
    selectValue = d3.select('#secondary_id_year').property('value');
    var year = +selectValue;
    // get the day of the year
    var now = new Date(year, month, day);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var yearday = Math.floor(diff / oneDay);

    var yearday_key = yeardayKey(year, yearday)
    // clear the svg
    d3.select("#wifi_svg").remove();
    // check if the day exists
    if (yearday_groupings[yearday_key] !== undefined) {
      // draw the graph
      drawGraph(yearday_groupings[yearday_key]);
    } else {
      // draw an error text
      drawError();
    }
  }

  function month_onchange() {
    selectValue = d3.select('#secondary_id_month').property('value');
    var month = months.indexOf(selectValue);
    day_count = fillDayArray(days_of_months[month]);
    d3.select("#secondary_id_yearday").remove();
    d3.select("#secondary_id_year").remove();
    drawDropdown("#secondary_dropdown", "secondary_id_yearday", day_count, yearday_onchange);
    drawDropdown("#secondary_dropdown", "secondary_id_year", years, year_onchange);
    getYeardayIndex();
  }

  function yearday_onchange() {
    getYeardayIndex();
  }

  function year_onchange() {
    getYeardayIndex();
  }

  function display_onchange() {
    selectValue = d3.select('#primary_id').property('value')
    switch (display_options.indexOf(selectValue)) {
      case 0:
        d3.select("#secondary_id_weekday").remove();
        drawDropdown("#secondary_dropdown", "secondary_id_month", months, month_onchange);
        drawDropdown("#secondary_dropdown", "secondary_id_yearday", fillDayArray(days_of_months[0]), yearday_onchange);
        drawDropdown("#secondary_dropdown", "secondary_id_year", years, year_onchange);
        break;
      case 1:
        d3.select("#secondary_id_month").remove();
        d3.select("#secondary_id_yearday").remove();
        d3.select("#secondary_id_year").remove();
        drawDropdown("#secondary_dropdown", "secondary_id_weekday", days, weekday_onchange);
        break;
    }
  };

  drawError();
  drawDropdown("#primary_dropdown", "primary_id", display_options, display_onchange);
  drawDropdown("#secondary_dropdown", "secondary_id_month", months, month_onchange);
  drawDropdown("#secondary_dropdown", "secondary_id_yearday", fillDayArray(days_of_months[0]), yearday_onchange);
  drawDropdown("#secondary_dropdown", "secondary_id_year", years, year_onchange);
  
});

// parses time
function parseTime(h, m) {
  var s = h + ":" + m;
  var t = formatTime.parse(s);
  if (t != null && t.getHours() < 3) t.setDate(t.getDate() + 1);
  return t;
}

function fillDayArray(num_days) {
  var day_count = [];
  for (var i = 1; i <= num_days; i++) {
    day_count.push(i);
  }
  return day_count;
}

function yeardayKey(year, yearday) {
    return year + ',' + yearday;
}