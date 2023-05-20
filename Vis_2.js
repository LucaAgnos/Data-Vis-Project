
function init() {

    var selectedYear = "";
    //reads in age csv
    d3.csv("AGE_Group.csv").then(function(data) {
        //changes string to number values
        data.forEach(d => {
            d.OBS_VALUE = +d.OBS_VALUE;; 
        });
        console.log(data);
        dataset = data;
        barChart(dataset);
    });

    

    function barChart() {
        


        var w = 1200;
    var h = 800;
    var padding = 50;


        var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h); 
     
        
        var margin = {top: 50, right: 40, bottom: 70, left: 200};
        var innerWidth = w - margin.left - margin.right;
        var innerHeight = h - margin.top - margin.bottom;

        //x scale linear is chosen to show linear representation for visualisation
        var xScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.OBS_VALUE)])
                .range([0, innerWidth]);
        
        //loads the range to consol testing purpose
        console.log(xScale.range());

        var xAxsis = d3.axisBottom()
                        .ticks(12)
                        .scale(xScale);

        //scale for the y value band is used so values are collected
        var yScale = d3.scaleBand()
                .domain(dataset.map(d => d.age))
                .range([ 0, innerHeight])
                .padding(0.2);
        
        //loads domain to console testing purpose
        console.log(yScale.domain());

        var yAxsis = d3.axisLeft()
                        .ticks(20)
                        .scale(yScale);
        
        
            

        


        //var g = svg.append("g")
           // .attr("transform", "trasnlate( 200, 100)")
        
        svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("transform", "translate(100,0)")
      //  .attr("transform", "trasnlate( "+ (margin.left)+","+(margin.top)+")")
        .attr("y", d => yScale(d.age))
        .attr("width", d => xScale(d.OBS_VALUE))
        .attr("height", yScale.bandwidth())
        .attr("fill", "red")
        //.attr("transform", "translate(500,400)");
        
        
        svg.append("g")
            .attr("transform", "translate(100, " + (h - margin.bottom) +")") //pushes axis to bottom of page
            .call(xAxsis)
            .append("text")
            //.attr("transform", "rotate(-90)")
            .attr("y", 30)
            .attr("x", 550)
            .attr("text-anchor", "end")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("immigrants") ;


        svg.append("g")
            .attr("transform", "translate (100,0)")
            .call(yAxsis)
            .append("text")
            .attr("y", -50)
            .attr("x", -250)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "end")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Age Groups") ;


            d3.select("#year").on("change", function() {
                selectedYear = this.value;
                var filteredData = dataset.filter(d => d.TIME_PERIOD === selectedYear);
                
                // Update the existing bars with the new data
                var bars = svg.selectAll("rect")
                    .data(filteredData);
                
                bars.enter()
                    .append("rect")
                    .merge(bars)
                    .transition()
                    .duration(500) 
                    .attr("y", d => yScale(d.age))
                    .attr("width", d => xScale(d.OBS_VALUE))
                    .attr("height", yScale.bandwidth())
                    .attr("fill", "red");
                
                bars.exit().remove(); // Remove any bars that are no longer needed
                
                // Update the existing axes
                svg.select(".x-axis")
                    .call(xAxis);
                
                svg.select(".y-axis")
                    .call(yAxis);
            });

    }

}

window.onload = init;  // runs the script when the page loads