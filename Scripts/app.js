/*
  D3 Visualization Conservation of aligned reads of Igf1r

  This uses a precompiled csv to display a dot plot showing conservation

  -1 = space when amino acids are different and there is no conservation of function.
  0 = * when amino acids are identical
  1 = . when amino acids are different but the function is semi-conserved.
  2 = : when amino acids are different but the function is conserved
*/

//Setup general chart boundaries
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1280 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

//Init the start and end
var start=0, end=1376;

//Read domain data
d3.csv('Input/parsed_con.csv')
  .row(function (d) { return d })
  .get(function (error, data) {

    //Error message
    if(error){
      console.log(error);
      d3.select("body").append("p").text("Error loading csv");
    };

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.POS = +d.POS;
      d.CON = +d.CON;
      d.MUS = d.X1;
      d.HUM = d.X2;
    });

    //Subset data based on start/end
    var subset = data.filter(function(d){return d.POS <= end && d.POS >= start})

    //Find max x value
    var max = d3.max(subset, function(d){return +d.POS})

    //Draws the plot
    function draw_plot(start, end){
      /*
        Setup
      */

      //Subset data based on start/end
      subset = data.filter(function(d){return d.POS <= end && d.POS >= start})

      //Find max x value
      max = d3.max(subset, function(d){return +d.POS})
      console.log(max);

      //Setup x
      var xValue = function(d) { return d.POS ;}, // data -> value
          xScale = d3.scale.linear().range([0, width]), // value -> display
          xMap = function(d) { return xScale(xValue(d));}, // data -> display
          xAxis = d3.svg.axis().scale(xScale).orient("bottom");

      // setup y
      var yValue = function(d) { return d.CON;}, // data -> value
          yScale = d3.scale.linear().range([height, 0]), // value -> display
          yMap = function(d) { return yScale(yValue(d));}, // data -> display
          yAxis = d3.svg.axis().scale(yScale).orient("left");

      // add the graph canvas to the body of the webpage
      var svg = d3.select(".chart-div").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(subset, xValue)-1, d3.max(subset, xValue)+1]);
      yScale.domain([d3.min(subset, yValue)-1, d3.max(subset, yValue)+1]);

      // add the tooltip area to the webpage
      var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      /*
        Draw axis
      */

      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("AA location");

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Conservation");

      //Draw legend
      var legend = svg.selectAll(".legend")
          .data(["-1=AA different and no conservation of function","0=Identical", "1=AA Different but function semi-conserved", "2=AA Different but function conserved"])
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)

      // draw legend text
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d;})

      //Builds dot plot
      svg.selectAll(".dot")
          .data(subset)
          .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 2.5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", 1);
              tooltip.html("<p>" + "Pos: " + d.POS + "<br/>" +"Mus: " + d.MUS + "<br/>"  + "HUM: " + d.HUM + "</p")
                   .style("left", (d3.event.pageX - 10) + "px")
                   .style("top", (d3.event.pageY - 90) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });

    }

    //Draw initial max plot on csv load
    draw_plot(0, max);

    /*
      Data binding for protein location range
    */

    //Find the gene element from datalist
    d3.select("#start").on('change', function(){
        clearGraph();

        //Ensure that it's a positive number/less than max
        if(this.value >= 0 && this.value <= 1376){
          start = this.value;
          draw_plot(start, end);
          set_min(this.value);
        }
    });

    //Detects the different transcripts element from options
    d3.select("#end").on('change', function(){
        clearGraph();

        //Ensure that it's a positive number/less than max
        if(this.value >= 0 && this.value <= 1376){
          end = this.value;
          draw_plot(start, end);
          set_max(this.value);
        }
    });

    //Sets new minimum validation based on value of #start
    function set_min(value){
      d3.select("#end")
        .attr("min", value)
    }

    function set_max(value){
      d3.select("#start")
        .attr("max", value)
    }

    //Clears entries
    function clearGraph(){
      d3.selectAll("svg").remove(); //Clean svg on entry
    }

})