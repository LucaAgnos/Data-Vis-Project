// Fetch the CSV data
d3.csv("data/emigration_imigration_de.csv").then(function(data) {
  // Convert data types if necessary
  data.forEach(function(d) {
    d.TIME_PERIOD = +d.TIME_PERIOD;
    d.OBS_VALUE = +d.OBS_VALUE;
    d.OBS_VALUE_IM = +d.OBS_VALUE_IM;
  });

  // Set the dimensions and margins of the chart
  var margin = { top: 60, right: 20, bottom: 70, left: 100 }, // Increase the left margin
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Append the SVG element to the chart container
  var svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the x and y scales
  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, function(d) { return d.TIME_PERIOD; }))
    .range([0, width]);

  var yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, function(d) { return Math.max(d.OBS_VALUE, d.OBS_VALUE_IM); })])
    .range([height, 0]);

  // Define the line function
  var line_OBS_VALUE = d3.line()
    .x(function(d) { return xScale(d.TIME_PERIOD); })
    .y(function(d) { return yScale(d.OBS_VALUE); });

  var line_OBS_VALUE_IM = d3.line()
    .x(function(d) { return xScale(d.TIME_PERIOD); })
    .y(function(d) { return yScale(d.OBS_VALUE_IM); });

  // Append the line to the chart
  svg.append("path")
    .datum(data)
    .attr("class", "line OBS_VALUE")
    .attr("d", line_OBS_VALUE)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  svg.append("path")
    .datum(data)
    .attr("class", "line OBS_VALUE_IM")
    .attr("d", line_OBS_VALUE_IM)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  // Update the tooltip element selection
  var tooltip = d3.select("#tooltip");

  // Get the position of the SVG element
  var svgPosition = document.getElementById("chart-container").getBoundingClientRect();
  var svgLeft = svgPosition.left;
  var svgTop = svgPosition.top;

  // Function to handle mouseover event
  function handleMouseOver(event, d) {
    // Get the x and y values from the mouse position
    var mouseX = d3.pointer(event)[0];
    var mouseY = d3.pointer(event)[1];
    var xValue = xScale.invert(mouseX).toFixed(0);
    var yValue = yScale.invert(mouseY).toFixed(0);

    // Determine which line is being hovered over
    var lineClass = d3.select(this).attr("class");

    // Show the tooltip with data value based on the line
    if (lineClass === "line OBS_VALUE") {
      tooltip.html(`Year: ${xValue} <br/>Emigration: ${yValue}`);
    } else if (lineClass === "line OBS_VALUE_IM") {
      tooltip.html(`Year: ${xValue} <br/>Immigration: ${yValue}`);
    }

// Calculate the tooltip position relative to the SVG element
var tooltipLeft = event.pageX + 10 + "px"; // Add an offset of 10 pixels from the mouse cursor
var tooltipTop = event.pageY - 10 + "px"; // Subtract 10 pixels to adjust the position


    // Show the tooltip with data value
    tooltip
      .style("left", tooltipLeft)
      .style("top", tooltipTop)
      .transition()
      .duration(200)
      .style("opacity", 1);
  }

  // Hide the tooltip
  function handleMouseOut() {
    tooltip.transition()
      .duration(200)
      .style("opacity", 0);
  }

  // Add the x-axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

  // Add the y-axis with modified translation
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  // Add the x-axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 40) // Adjust the position based on the height
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Year");

  // Add the y-axis label
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20) // Adjust the position
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Number of People");

  // Add the chart title
  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top + 20) // Adjust the position
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .text("Emigration and Immigration Data");

  var legendData = [
    { name: "Immigration", color: "green" },
    { name: "Emigration", color: "yellow" }
  ];

  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + (width - 100) + ", 20)"); // Adjust the position of the legend

  var legendItems = legend.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

  legendItems.append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d) { return d.color; });

  legendItems.append("text")
    .attr("x", 15)
    .attr("y", 10)
    .style("fill", "white")
    .text(function(d) { return d.name; });
});
