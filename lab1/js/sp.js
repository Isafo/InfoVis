function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...

    //initialize tooltip
    //...

    var x = d3.scale.linear()
        .domain([0,100000])             <!-- Fel ställe att sefeniera axlarna på enligt labbanvisningarna ? -->
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0,100])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;

        //define the domain of the scatter plot axes
        //...
        data.forEach(function(d) {

          console.log(d["Household income"]);


          d["Household income"] = +d["Household income"];
          d["Student skill"] = +d["Student skills"];
        });

        x.domain(d3.extent(data, function(d) { return d["Household income"]; })).nice();
        y.domain(d3.extent(data, function(d) { return d["Student skills"]; })).nice();



        draw();

    });

    function draw()
    {

        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6);

        svg.append("text")
                    .attr("x", width/2)
                    .attr("y", height*1.08)
                    .style("text-anchor", "middle")
                    .text("Household income");

        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em");

        svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -height/2)
                .attr("y", -23)
                .style("text-anchor", "middle")
                .text("Student skills");

        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...

            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d["Household income"]); })
            .attr("cy", function(d) { return y(d["Student skills"]); })

            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout", function(d) {
                //...
            })
            .on("click",  function(d) {
                //...
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}
