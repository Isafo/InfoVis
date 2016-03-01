function map(){
 /*var format = function(d) {
        d = d / 1000000;
        return d3.format(',.02f')(d) + 'M';
    }

    var map = d3.geomap.choropleth()
        .geofile('/d3-geomap/topojson/world/countries.json')
        .colors(colorbrewer.YlGnBu[9])
        .column('YR2010')
        .format(format)
        .legend(true)
        .unitId('Country Code');

    d3.csv('/data/sp.pop.totl.csv', function(error, data) {
        d3.select('#map')
            .datum(data)
            .call(map.draw, map);
    });*/

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 1])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    //var color = d3.scale.category10();
    var color = d3.scale.linear().domain([0,6020])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb("#000000"), d3.rgb('#FF00FF')]);
    /*var color = d3.scale.ordinal()
                        .domain([0,6020])
                        .range([colorbrewer.Blues[5]]);*/
    var quantize = d3.scale.quantize()
    .domain([0,136956])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));


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

    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        //load summary data
		d3.csv("data/github_commits_by_country2.csv", function(error,data) {
            draw(countries,data);
		});
    });

    function draw(countries,data) {
        var country = g.selectAll(".country").data(countries);

        //initialize a color country object
        //var cc = new Map();
    	var cc = {};
	    data.forEach(function(d,i) {
		    //cc[d["Country"]] = color(d["Commits_per_100000_People"]);

            if(d["Commits_per_100000_People"] < 10)
                cc[d["Country"]] = "#FFFFB2";
            else if (d["Commits_per_100000_People"] < 100)
                cc[d["Country"]] = "#FECC5C";
            else if (d["Commits_per_100000_People"] < 1000)
                cc[d["Country"]] = "#FD8D3C";
            else if (d["Commits_per_100000_People"] < 10000)
                cc[d["Country"]] = "#F03B20";
            else
                cc[d["Country"]] = "#BD0026";

            //console.log(d["Commits_per_100000_People"]);
            console.log(color(d["Commits_per_100000_People"]));
            //cc[d["Country"]] = quantize(d["Commits_per_100000_People"]);

        });

        d3.selectAll("svg").attr("class", this.value);

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            //...
			.style("fill",function(d,i) {
                //console.log(d.properties.name + " " + cc[d.properties.name]);
				return  cc[d.properties.name];
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
