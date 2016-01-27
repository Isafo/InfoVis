function sp(){
    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
	var color = d3.scale.category20b();

    //initialize tooltip
    var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
		return "<strong>Household income:</strong> <span style='color:red'>" + d["Household income"] + "</span>";
	})

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
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
          d["Household income"] = +d["Household income"];
          d["Student skill"] = +d["Student skills"];
        });

        x.domain(d3.extent(data, function(d) { return d["Household income"]; })).nice();
        y.domain(d3.extent(data, function(d) { return d["Student skills"]; })).nice();


        draw(data);

    });

    function draw(data)
    {

		var cc = {};
		data.forEach(function(d,i){
				cc[d["Country"]] = color(d["Country"]);
		});
	
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
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d["Household income"]); })
            .attr("cy", function(d) { return y(d["Student skills"]); })
			
			.style("fill",function(d,i) { 
				return cc[d["Country"]];
			})

            //tooltip
            .on("mouseover", function(d) {
				return tip.show;
            })
            .on("mouseout", function(d) {
                return tip.hide;
            })
            .on("click",  function(d) {
			  sp1.selectDot(d["Country"]);
			
			  //d3.select(this).attr("r", 7);
			  pc1.selectLine(d["Country"]);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
		d3.selectAll(".dot")
			.attr("r", function(d){
			if(value == d["Country"])
				return 7;
			else
				return 3.5;
			});
    };

    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}
