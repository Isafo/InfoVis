function map(){

    console.log("start av map");

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 1])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    var color_domain = [ 10, 100, 1000, 10000];
    var legend_label = ["< 10", "> 10", "> 1000", "> 100000"];   
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"]);


    //initialize tooltip
    //...

    var projection = d3.geo.mercator()
        .center([-5, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

	var countries_data = [];
    console.log("innan ladda data");
    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        //load summary data
        console.log("ladda karta");
   		d3.csv("data/github_commits_by_country.csv", function(error,data) {

        console.log("ladda karta");
            draw(countries,data);
		});
    });

    function draw(countries,data) {
        console.log("draw");
        var country = g.selectAll(".country").data(countries);

        //initialize a color country object

		var cc = {};
        data.forEach(function(d,i) {
		      cc[d["Country"]] = color(d["Commits_per_100k_People"]);
	    });

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            //...

			.style("fill",function(d,i) {
				return  cc[d.properties.name];
			})
            .style("stroke", function(d) {
  				  return "#888888";
  			})

            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout",  function(d) {
                //...
            })
            //selection
            .on("click",  function(d) {

            });

    }

    //zoom and panning method
    function move() {
        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //method for selecting features of other components
    function selFeature(value){
        //...
    }
}
