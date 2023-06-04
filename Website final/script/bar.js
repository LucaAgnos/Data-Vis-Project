window.onload = function() {
  d3.csv("data/age_gender.csv").then(function(data) {
    //changes string to number values
    data.forEach(d => {
      d.OBS_VALUE = +d.OBS_VALUE;
    });
    
    console.log(data);
    dataset = data;
    barChart(dataset);
  });
};

function barChart(data) {
  var w = 1200;
  var h = 800;

  var svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  
    //set dimensions of margin
  var margin = { top: 50, right: 40, bottom: 70, left: 200 };
  var innerWidth = w - margin.left - margin.right;
  var innerHeight = h - margin.top - margin.bottom;

  // Create an array of unique age groups
  var ageGroups = [...new Set(data.map(d => d.age))];

  var values = ["Male", "Female"]; 

  // Color scale for distinguishing male and female
  var colorScale = d3.scaleOrdinal()
    .domain(["M", "F"])
    .range(["steelblue", "salmon"]);

  // x scaleBand is used as age in this graph is categorical
  var xScale = d3.scaleBand()
    .domain(ageGroups)
    .range([0, innerWidth])
    .padding(0.1);

  var xAxis = d3.axisBottom()
    .scale(xScale);

  // scale for the y value linear is chosen to show linear representation for visualization
  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.OBS_VALUE)])
    .range([innerHeight, 0]);

  var yAxis = d3.axisLeft()
    .scale(yScale);
  
    svg.append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", margin.top / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("fill", "white")
    .text("Age and Gender Distribution");


    var mouseover = function(event, d) {
      
      // get mouse cordinates
      var mouseX = event.pageX;
      var mouseY = event.pageY;


      d3.select("#tooltip")
      .style("opacity", 1)
      .html("Gender: " + d.sex + "<br>" + "Immigrants: " + d.OBS_VALUE)
      //location of the tooltip popup in relation to the mouse curser
      .style("left", (mouseX + 10) + "px")
      .style("top", (mouseY + 10) + "px");
      
      //logs the mouse over event
      console.log("Mouseover event occurred. Data:", d);
  };
  
  var mouseout = function(event, d) {
    d3.select("#tooltip")
      .style("opacity", 0);
  };

  // Group the data by sex (M and F)
  var GroupData = d3.group(data, d => d.sex);

  // Create a group for each sex
  var GenderGroups = svg.selectAll(".sex-group")
    .data(GroupData)
    .enter()
    .append("g")
    .attr("class", "sex-group")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    GenderGroups.selectAll("rect")
    .data(d => d[1])
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.age) + xScale.bandwidth() * (d.sex === "F" ? 0 : 0.5))
    .attr("y", d => yScale(d.OBS_VALUE))
    .attr("width", xScale.bandwidth() / 2)
    .attr("height", d => innerHeight - yScale(d.OBS_VALUE))
    .attr("fill", d => colorScale(d.sex))
  
    // Tooltip
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  // Append x-axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + margin.left + ", " + (h - margin.bottom) + ")") // pushes axis to bottom of page
    .call(xAxis)
    .append("text")
    .attr("y", 30)
    .attr("x", innerWidth / 2)
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .attr("fill", "white")
    .text("Age Groups");

  // Append y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis)
    .append("text")
    .attr("y", -50)
    .attr("x", -margin.left)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "end")
    .attr("font-size", "15px")
    .attr("fill", "white")
    .text("Number of Immigrants");

  // Legend 
  var legend = svg.selectAll(".legend")
          .data(values.slice())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i ) { return "translate( 0," + i * 20 + ")";}); 
    
      //size of the rectangles and what color they will be for legend
    legend.append("rect")
          .attr("x", 1000)
          .attr("y", 100)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", colorScale); 
    //text style for legend and location
    legend.append("text")
          .attr("x", 1040)
          .attr("y", 110)
          .attr("dy", ".35em")
          .style("fill", "white")
          .style("text-anchor", "start")
          .text(function(d) {return d; });  

    

    d3.select("#year").on("change", function() {
        var selectedYear = this.value;
        var filteredData = dataset.filter(d => d.TIME_PERIOD === selectedYear);
      
        // Update the existing bars with the new data
        var bars = GenderGroups.selectAll("rect")
          .data(d => d3.filter(filteredData, x => x.sex === d[0]));
      
        // Enter new bars
        bars.enter()
          .append("rect")
          .attr("x", d => xScale(d.age) + xScale.bandwidth() * (d.sex === "F" ? 0 : 0.5))
          .attr("y", innerHeight)
          .attr("width", xScale.bandwidth() / 2)
          .attr("height", 0)
          .attr("fill", d => colorScale(d.sex))
          .merge(bars) 
          .transition()
          .duration(500)
          .attr("x", d => xScale(d.age) + xScale.bandwidth() * (d.sex === "F" ? 0 : 0.5))
          .attr("y", d => yScale(d.OBS_VALUE))
          .attr("width", xScale.bandwidth() / 2)
          .attr("height", d => innerHeight - yScale(d.OBS_VALUE))
          .attr("fill", d => colorScale(d.sex));
      
        // Remove unnecessary bars
        bars.exit().remove();
      
        // Update the x-axis
        svg.select(".x-axis")
          .call(xAxis);
      });
      
}
