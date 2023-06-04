

window.onload = function() {
    d3.csv("data/net_migration_rate.csv").then(function(data) {
      //changes string to number values
      data.forEach(d => {
        d.Time = +d.Time;
        d.CNMR_DE = +d.CNMR_DE;
        d.CNMR_US = +d.CNMR_US;
        d.CNMR_UK = +d.CNMR_UK;
        
      });
      
      console.log(data);
      dataset = data;
      line(dataset);
    });
  };

  function line(data) {
    var w = 1200;
    var h = 800;

    
    //set dimensions of margin
    var margin = { top: 50, right: 40, bottom: 70, left: 200 };
    var innerWidth = w - margin.left - margin.right;
    var innerHeight = h - margin.top - margin.bottom;

    var svg = d3.select("#chart")
    .append("svg")
    .attr("width", w + margin.left + margin.right) 
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define xscale 
    var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) {
            return +d.Time; 
        }),
        d3.max(data, function(d) {
            return +d.Time;
        })])
        .range([0, innerWidth]); 

        
    // define Y scale
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return Math.max(d.CNMR_DE, d.CNMR_US, d.CNMR_UK); } )])
        .range([innerHeight, 0]);
    
    // Define x scale
    var xAxsis = d3.axisBottom()
                //.ticks(10000)
                .scale(xScale);

    // Define y sclae
    var yAxsis = d3.axisLeft()
                   // .ticks(50)
                    .scale(yScale);

    var tooltip = d3.select("#chart1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("color", "black")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");
    
    var mouseover = function(event, d) {
      
        // get mouse cordinates
        var mouseX = event.pageX;
        var mouseY = event.pageY;
  
  
        d3.select("#tooltip")
        .style("opacity", 1)
        .html("Net Migration Rate per 1000 population <br> Germany " + d.CNMR_DE + "<br> United States " + d.CNMR_US + "<br> United Kingdom " + d.CNMR_UK + " <br> Year " + d.Time)
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

//title
   svg.append("text")
    .attr("x", innerWidth/2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("fill", "White")
    .style("font-family", "helvetica")
    .style("font-size", 20)
    .text("Net Migration Rate"); 

// x axis label
    svg.append("text")
    .attr("x", innerWidth/2 + 200)
    .attr("y", h -30)
    .attr("text-anchor", "middle")
    .attr("fill", "White")
    .style("font-family", "helvetica")
    .style("font-size", 20)
    .text("Years"); 

// y axsis label
svg.append("text")
.attr("text-anchor", "middle")
.attr("transform", "translate(60," + innerHeight/2  + ")rotate(-90)")
.attr("y", 80)
.attr("fill", "White")
.style("font-family", "helvetica")
.style("font-size", 20)
.text("Net Migration Rate"); 

//axis
svg.append("g")
.attr("transform", "translate(" + margin.left + ", " + (h - margin.bottom) + ")") 
.call(d3.axisBottom(xScale));

svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.axisLeft(yScale));

// data points
// Germany
svg.append("g") 
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.Time); })
    .attr("cy", function(d) { return yScale(d.CNMR_DE); })
    .attr("r", 6)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("fill", "#cc0000")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

// US data points
    svg.append("g") 
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.Time); })
    .attr("cy", function(d) { return yScale(d.CNMR_US); })
    .attr("r", 6)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("fill", "slateblue")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
//UK data points
    svg.append("g") 
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.Time); })
    .attr("cy", function(d) { return yScale(d.CNMR_UK); })
    .attr("r", 6)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("fill", "White")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)

// define each line 
var line1 = d3.line()
            .x(function(d) {return xScale(d.Time); })
            .y(function(d) {return yScale(d.CNMR_DE); })        
            .curve(d3.curveMonotoneX);

var line2 = d3.line()
            .x(function(d) {return xScale(d.Time); })
            .y(function(d) {return yScale(d.CNMR_US); })        
            .curve(d3.curveMonotoneX)

var line3 = d3.line()
            .x(function(d) {return xScale(d.Time); })
            .y(function(d) {return yScale(d.CNMR_UK); })        
            .curve(d3.curveMonotoneX)

// Line through the dots
//Germany Line
svg.append("path")
    .datum(data)
    .attr("class", "line1")
    .attr("d", line1)
    .style("fill", "none")
    .style("stroke", "#CC0000")
    .style("stroke-width", "3")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//US line
svg.append("path")
    .datum(data)
    .attr("class", "line2")
    .attr("d", line2)
    .style("fill", "none")
    .style("stroke", "slateblue")
    .style("stroke-width", "3")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//UK line
svg.append("path")
    .datum(data)
    .attr("class", "line3")
    .attr("d", line3)
    .style("fill", "none")
    .style("stroke", "white")
    .style("stroke-width", "3")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//legend
var legenddata = [
    {name: "Germany", color: "red"},
    {name: "United States of America", color: "slateblue"},
    {name: "United Kingdom", color: "white"},
]; 

// position of legend
var legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(" + (w - 200) + ", 20)");

var legend = legend.selectAll(".legend")
.data(legenddata)
.enter()
.append("g")
.attr("class", "legend")
.attr("transform", function(d, i) { return "translate(0," + (i * 20) + ")"; });

//size and color of rectancles next to words
legend.append("rect")
.attr("width", 10)
.attr("height", 10)
.attr("fill", function(d) { return d.color; });

//text for legend
legend.append("text")
.attr("x", 15)
.attr("y", 10)
.style("fill", "white")
.text(function(d) { return d.name; });

  }