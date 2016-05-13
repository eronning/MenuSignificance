// define how time is formatted
var formatTime = d3.time.format("%H:%M");

// get a section of the date
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// variables indicating what data to use
var _wifi_checked, _course_checked = false;


// user display options
var display_options = ["Pick a specific day", "Pick a weekday"];
// defining the days of the week
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// months of the year
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// each months day count
var days_of_months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// the years of information being displayed
var years = ["2015", "2016"]

// errors
var _NO_WIFI_ERROR = "No wifi data for this day!";
var _NO_DATA_ERROR = "No data has been selected for use!";

// class of lines
var _wifi_line_class = "wifi_line"
var _course_line_class = "course_line"

// read in both sets of data
d3.csv("data/wifi/wifi_info_cleaned.csv", function(error, wifi_data) {
  if (error) throw error;
  d3.csv("data/course/course_data_cleaned.csv", function(error, course_data) {
    if (error) throw error;
    
    // group all of the wifi information
    var weekday_wifi_groupings = {};
    var yearday_wifi_groupings = {};
    // iterate through all of the wifi data
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


    // group all of the course information -- only possible by weekday
    var weekday_course_groupings = {};
    var fall_data = [];
    // iterate through all of the course information
    for (i in course_data) {
      var time = course_data[i];
      var week_group;
      // display only one semester of data -- times are different per semester
      // in the future have an option to pick the semester of course data to display
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
    }

    // define the margins
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // define the x value
    var x = d3.time.scale()
        .domain([parseTime("7","30"), parseTime("19","30")])
        .range([0, width]);

    // define a y value
    var y = d3.scale.linear()
        .domain([0, d3.max(fall_data, function(d) { return +d.num_people; })])
        .range([height, 0]);

    // declare the x-axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(11)
        .tickFormat(formatTime)
        .orient("bottom");

    // declare the y-axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // define a line
    var line = d3.svg.line()
        .x(function(d) { return x(parseTime(d.hour, d.minute)); })
        .y(function(d) { return y(d.num_people); });

    /* drawGraph draws the graph
     * @param data is the data to draw on the graph
     * @param lineClass is the class of lines to be drawn
     * return the svg drawn 
     */
    function drawGraph(data, lineClass) {
      
      // create the svg
      var svg = d3.select("#wifi_line").append("svg")
        .attr("id", "wifi_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // generate the x-axis
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

      // generate the y-axis
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

      // draw all of the paths
      svg.append("path")
        .datum(data)
        .attr("class", lineClass)
        .attr("d", line);

      // return the created svg
      return svg;
    }

    /* drawGraph draws the graph
     * @param data is the data to draw on the graph
     * @param lineClass is the class of lines to be drawn
     * return none 
     */
    function drawLines(svg, data, lineClass) {
      svg.append("path")
        .datum(data)
        .attr("class", lineClass)
        .attr("d", line);
    }

    /* drawError draws an error on the svg
     * @param error is the error to draw
     * return none 
     */
    function drawError(error) {

      // create the svg
      var svg = d3.select("#wifi_line").append("svg")
        .attr("id", "wifi_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // generate the x-axis
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

      // generate the y-axis
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

      // add the error text to the svg
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 4)
        .style("fill", "red")
        .text(error);
    }

    /* handleDraw handles the different types of data to be drawn
     * @param key is the key to grab the data
     * @param isWeekday is a boolean indicating whether or not the data
     *                  is a weekday or not
     * return none 
     */
    function handleDraw(key, isWeekday) {
      // remove the current svg
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

    /* drawDropdown draws the dropdowns for users
     * @param id is the id to append the dropdown to
     * @param appendId is id for the dropdown
     * @param data is the data to put in the dropdown
     * @param onchange is the onchange function for the dropdown
     * return none 
     */
    function drawDropdown(id, appendId, data, onchange) {
      
      // generate the select
      var select = d3.select(id)
        .append('select')
        .attr('id', appendId)
        .attr('class','dropdown')
        .on('change', onchange);

      // create the options elements
      var options = select
        .selectAll('option')
        .data(data).enter()
        .append('option')
        .text(function (d) { return d; });
    }

    /* weekday_onchange defines the onchange function for a weekday
     * return none 
     */
    function weekday_onchange() {
      selectValue = d3.select('#secondary_id_weekday').property('value');
      handleDraw(days.indexOf(selectValue), true);
    };

    /* getYearDay index gets the key for a year day from values entered
     * return none 
     */
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

    /* month_onchange is the onchange function for month dropdown
     * return none 
     */
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

    /* yearday_onchange is the onchange function for the yearday dropdown
     * return none 
     */
    function yearday_onchange() {
      getYeardayIndex();
    }

    /* year_onchange is the onchange function for the year dropdown
     * return none 
     */
    function year_onchange() {
      getYeardayIndex();
    }

    /* display_onchange is the onchange function for the display options dropdown
     * return none 
     */
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

    /* checkbox_onchange is the onchange function for the checkboxes (for data choice)
     * return none 
     */
    function checkbox_onchange() {
      var wifi_element = d3.select("#wifi_checkbox")[0][0];
      var wifi_child = wifi_element.childNodes[0].childNodes[1];
      _wifi_checked = wifi_child.checked;
      var course_element = d3.select("#course_checkbox")[0][0];
      var course_child = course_element.childNodes[0].childNodes[1];
      _course_checked = course_child.checked;
    }

    /* draw_checkbox draws a checkbox
     * @param id is the id of the checkbox
     * @param text is the text to be draw next to the checkbox
     * return none 
     */
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

/* parseTime parses the time given a hour and minute
 * @param h is the hour
 * @param m is the minute
 * return the combined time 
 */
function parseTime(h, m) {
  var s = h + ":" + m;
  var t = formatTime.parse(s);
  if (t != null && t.getHours() < 3) t.setDate(t.getDate() + 1);
  return t;
}

/* fillDayArray fills a array containing each day value for the number of days
 * @param num_days is the number of days to fill the array with
 * return the array containing the days
 */
function fillDayArray(num_days) {
  var day_count = [];
  for (var i = 1; i <= num_days; i++) {
    day_count.push(i);
  }
  return day_count;
}

/* yeardayKey gets a key for a yearday and year
 * @param year is the year 
 * @param yearday is the day of the year
 * return the key for the information passed in
 */
function yeardayKey(year, yearday) {
    return year + ',' + yearday;
}