var formatTime = d3.time.format("%H:%M");
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var _wifi_checked, _course_checked = false;

var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var display_options = ["Pick a specific day", "Pick a weekday"];

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var days_of_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var years = ["2015", "2016"]

var _NO_WIFI_ERROR = "No wifi data for this day!";
var _NO_DATA_ERROR = "No data has been selected for use!";

var _wifi_line_class = "wifi_line"
var _course_line_class = "course_line"

d3.csv("data/wifi/wifi_info_cleaned.csv", function(error, wifi_data) {
  if (error) throw error;
  d3.csv("data/course/course_data_cleaned.csv", function(error, course_data) {
    if (error) throw error;
    
    // group all of the wifi information
    var weekday_wifi_groupings = {};
    var yearday_wifi_groupings = {};
    for (i in wifi_data) {
      var time = wifi_data[i];
      var week_group;
      // group by weekday
      if (time.week_day in weekday_wifi_groupings) {
        week_group = weekday_wifi_groupings[time.week_day];
        week_group.push(time);
        weekday_wifi_groupings[time.week_day] = week_group;
      }  else {
        week_group = [];
        week_group.push(time);
        weekday_wifi_groupings[time.week_day] = week_group;
      }

      var year_group;
      var yearday_key = yeardayKey(time.year, time.year_day);
      // group by day of the year
      if (yearday_key in yearday_wifi_groupings) {
        year_group = yearday_wifi_groupings[yearday_key];
        year_group.push(time);
        yearday_wifi_groupings[yearday_key] = year_group;
      } else {
        year_group = [];
        year_group.push(time);
        yearday_wifi_groupings[yearday_key] = year_group;
      }

    }


    // group all of the wifi information
    var weekday_course_groupings = {};
    var fall_data = [];
    /*var yearday_course_groupings = {};*/
    for (i in course_data) {
      var time = course_data[i];
      var week_group;
      if (time.semester === "Fall%202015") {
        fall_data.push(time);
        // group by weekday
        if (time.week_day in weekday_course_groupings) {
          week_group = weekday_course_groupings[time.week_day];
          week_group.push(time);
          weekday_course_groupings[time.week_day] = week_group;
        }  else {
          week_group = [];
          week_group.push(time);
          weekday_course_groupings[time.week_day] = week_group;
        }
      }
      /*var year_group;
      var yearday_key = yeardayKey(time.year, time.year_day);
      // group by day of the year
      if (yearday_key in yearday_course_groupings) {
        year_group = yearday_course_groupings[yearday_key];
        year_group.push(time);
        yearday_course_groupings[yearday_key] = year_group;
      } else {
        year_group = [];
        year_group.push(time);
        yearday_course_groupings[yearday_key] = year_group;
      }*/

    }


    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .domain([parseTime("7","30"), parseTime("19","30")])
        .range([0, width]);

    /*console.log(d3.max(course_data, function(d) { return +d.num_people; }))*/
    // JUST SET A LARGE SCALING VALUE
    var y = d3.scale.linear()
        .domain([0, d3.max(fall_data, function(d) { return +d.num_people; })])
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


    function drawGraph(data, lineClass) {
      
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
        .attr("class", lineClass)
        .attr("d", line);

      return svg;
    }

    function drawLines(svg, data, lineClass) {
      svg.append("path")
        .datum(data)
        .attr("class", lineClass)
        .attr("d", line);
    }

    function drawError(error) {
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
        .text(error);
    }

    function handleDraw(key, isWeekday) {
      d3.select("#wifi_svg").remove();
      // user wants wifi information to be used
      var wifi_svg;
      if (_wifi_checked) {
        // it is a weekday
        if (isWeekday) {
          // draw the weekday graph
          wifi_svg = drawGraph(weekday_wifi_groupings[key], _wifi_line_class);
        } else {
          // it is a yearday
          if (yearday_wifi_groupings[key] !== undefined) {
            // draw the yearday graph
            wifi_svg = drawGraph(yearday_wifi_groupings[key], _wifi_line_class);
          } else {
            // draw an error text
            drawError(_NO_WIFI_ERROR);
          }
        }
      }
      // user wants course data to be used
      if (_course_checked) {
        // draw with course information
        if (isWeekday) {
          var data = weekday_course_groupings[key];
          // draw the weekday graph
          if (_wifi_checked && wifi_svg !== undefined) {
            drawLines(wifi_svg, data, _course_line_class)
          } else {
            drawGraph(data, _course_line_class);
          }
          
        } 
      }
      // user hasn't select any information to be used
      if (!_wifi_checked && !_course_checked) {
        // draw a no data error on the graph
        drawError(_NO_DATA_ERROR);
      }
    }

    // Create the select box for choosing options 
    function drawDropdown(id, appendId, data, onchange) {
      
      var select = d3.select(id)
        .append('select')
        .attr('id', appendId)
        .attr('class','dropdown')
        .on('change', onchange);

      var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });
    }
    // on change function for weekdays
    function weekday_onchange() {
      selectValue = d3.select('#secondary_id_weekday').property('value');
      handleDraw(days.indexOf(selectValue), true);
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
      handleDraw(yearday_key, false);
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
          d3.select("#course_checkbox").style('opacity', '0');
          drawDropdown("#secondary_dropdown", "secondary_id_month", months, month_onchange);
          drawDropdown("#secondary_dropdown", "secondary_id_yearday", fillDayArray(days_of_months[0]), yearday_onchange);
          drawDropdown("#secondary_dropdown", "secondary_id_year", years, year_onchange);
          break;
        case 1:
          d3.select("#course_checkbox").style('opacity', '1');
          d3.select("#secondary_id_month").remove();
          d3.select("#secondary_id_yearday").remove();
          d3.select("#secondary_id_year").remove();
          drawDropdown("#secondary_dropdown", "secondary_id_weekday", days, weekday_onchange);
          break;
      }
    };

    // check the status of the check boxes
    function checkbox_onchange() {
      var wifi_element = d3.select("#wifi_checkbox")[0][0];
      var wifi_child = wifi_element.childNodes[0].childNodes[1];
      _wifi_checked = wifi_child.checked;
      var course_element = d3.select("#course_checkbox")[0][0];
      var course_child = course_element.childNodes[0].childNodes[1];
      _course_checked = course_child.checked;
    }

    function draw_checkbox(id, text) {
      d3.select(id)
        .attr('class', 'checkbox')
        .append('label')
          .text(text)
        .append('input')
          .attr('type','checkbox')
          .on('change', checkbox_onchange);
    }
        

    // the first day being display doesn't exist
    drawError(_NO_DATA_ERROR);
    // draw both the checkboxes
    draw_checkbox("#wifi_checkbox", "WiFi Information");
    draw_checkbox("#course_checkbox", "Course Times");
    d3.select("#course_checkbox").style('opacity', '0');
    // show all of the dropdowns
    drawDropdown("#primary_dropdown", "primary_id", display_options, display_onchange);
    drawDropdown("#secondary_dropdown", "secondary_id_month", months, month_onchange);
    drawDropdown("#secondary_dropdown", "secondary_id_yearday", fillDayArray(days_of_months[0]), yearday_onchange);
    drawDropdown("#secondary_dropdown", "secondary_id_year", years, year_onchange);
  });
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