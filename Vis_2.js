
function init() {

    var w = 500;
    var h = 500;
    //var barPadding = 30;
    var padding = 50;


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
        

        var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h); 
     
        
        var margin = {top: 20, right: 30, bottom: 30, left: 40};
        var innerWidth = w - margin.left - margin.right;
        var innerHeight = h - margin.top - margin.bottom;

        //x scale linear is chosen to show linear representation for visualisation
        var xScale = d3.scaleLinear()
                .domain([0, d3.max(dataset, d => d.OBS_VALUE)])
                .range([margin.left, w - margin.right]);
        
        //loads the range to consol testing purpose
        console.log(xScale.range());

        var xAxsis = d3.axisBottom()
                        .ticks(6)
                        .scale(xScale);

        //scale for the y value band is used so values are collected
        var yScale = d3.scaleBand()
                .domain(dataset.map(d => d.age))
                .range([ h - padding, padding ])
                .padding(0.2);
        
        //loads domain to console testing purpose
        console.log(yScale.domain());

        var yAxsis = d3.axisLeft()
                        .ticks(20)
                        .scale(yScale)

        

        svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.age))
        .attr("width", d => xScale(d.OBS_VALUE))
        .attr("height", yScale.bandwidth(yScale))
        .attr("fill", "slateblue");
        
        svg.append("g")
            .attr("transform", "translate(-38, " + (h - margin.bottom ) +")") //pushes axis to bottom of page
            .call(xAxsis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 50)
            .attr("x", 250)
            .attr("text-anchor", "end")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("Age Groups") ;
;

        svg.append("g")
            .attr("transform", "translate (" +(padding)+",0)")
            .call(yAxsis)
            .append("text")
            .attr("y", h )
            .attr("x", w - 280)
            .attr("text-anchor", "end")
            .attr("font-size", "15px")
            .attr("fill", "white")
            .text("imigrants") ;


        d3.select("#year").on("change", function() {
            selectedYear = this.value;
            
            dataset.filter(d => d.TIME_PERIOD === selectedYear); 
        

        })
        



    }

}

window.onload = init;  // runs the script when the page loads