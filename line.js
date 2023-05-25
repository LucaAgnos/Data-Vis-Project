// Fetch the CSV data
d3.csv("emigration_DE.csv").then(function(data) {
    // Convert data types if necessary
    data.forEach(function(d) {
      d.TIME_PERIOD = +d.TIME_PERIOD;
      d.OBS_VALUE = +d.OBS_VALUE;
    });
  
    // Set the dimensions and margins of the chart
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 1200 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
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
      .domain([0, d3.max(data, function(d) { return d.OBS_VALUE; })])
      .range([height, 0]);
  
    // Define the line function
    var line = d3
      .line()
      .x(function(d) { return xScale(d.TIME_PERIOD); })
      .y(function(d) { return yScale(d.OBS_VALUE); });
  
    // Append the line to the chart
    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);
  
    // Append the tooltip element
    var tooltip = d3.select("#chart-container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
   // Function to handle mouseover event
    function handleMouseOver(event, d) {
    // Get the x and y values from the mouse position
    var mouseX = d3.pointer(event)[0];
    var mouseY = d3.pointer(event)[1];
    var xValue = xScale.invert(mouseX).toFixed(0);
    var yValue = yScale.invert(mouseY).toFixed(0);
  
    // Show the tooltip with data value
    tooltip.transition()
      .duration(200)
      .style("opacity", 1);
  
    tooltip.html(`Year: ${xValue} <br/>Emigration: ${yValue}`);
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
  
    // Add the y-axis
    svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));
  });
  