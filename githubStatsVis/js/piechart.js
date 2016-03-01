console.log("piechart start");
 /*
var width = 350,
    height = 200,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category10();

var arc = d3.svg.arc()
    		.outerRadius(radius - 10)
    		.innerRadius(0);

var label_arc = d3.svg.arc()
    		      .outerRadius(radius - 40)
    		      .innerRadius(radius - 40);

var pie_chart = d3.layout.pie()
    			 .sort(null)
    			 .value(function(d) { return d.language; });

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv("data/github_commits_by_location_and_language.csv", type, function(error, data) {
    console.log("piechart csv start");

    if(error)
	throw error;

    var g = svg.selectAll(".arc")
	           .data(pie_chart(data))
		       .enter()
		       .append("g")
    	       .attr("class", "arc");

    g.append("path")
	 .attr("d", arc)
     .style("fill", function(d) { return color(d.repository_language); });

    g.append("text")
	 .attr("transform", function(d) { return "translate(" + label_arc.centroid(d) + ")";})
     .attr("dy", ".35em")
     .text(function(d) { return d.repository_language });

     console.log("piechart csv slut");
});

function type(d) {
    console.log("type: " + d)
    d.num_users = +d.num_users;
    return d;
}*/

function pc(country) {
// delar av koden tagen från: http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart 

    /*var language_dataset = [
      { label: 'Abulia', count: 10 }, 
      { label: 'Betelgeuse', count: 20 },
      { label: 'Cantaloupe', count: 30 },
      { label: 'Dijkstra', count: 40 }
    ];*/
    var myMap = new Map();

    var width = Number(document.getElementById("chart").offsetWidth)/2;
    var height = Number(document.getElementById("chart").offsetHeight);
    //console.log("width " + width);
    //console.log("height " + height);
    var radius = Math.min(width, height) / 2;
    var donutWidth = radius * 0.3; // for piechart: donutWidth = radius;
    var legendRectSize = 18;
    var legendSpacing = 4;

    var color = d3.scale.category20b();

    var svg = d3.select('#chart')
                .append('svg')
                .attr('width', Number(document.getElementById("chart").offsetWidth))
                .attr('height', height)
                .append('g')
                .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    var arc = d3.svg.arc()
                    .innerRadius(radius - donutWidth) 
                    .outerRadius(radius);

    var pie = d3.layout.pie()
                       .value(function(d) { return d.count; })
                       .sort(null);

    d3.csv("data/github_commits_by_location_and_language.csv", function(error, bigdataset) {  
        var temp;
        bigdataset.forEach(function(d) {                    
            //d.count = +d.count; 
            //language_dataset.(d.repository_language) = repository_language + d.num_users;
            //Country,repository_language,num_users
            if (Number(d.num_users)){

                if (myMap.has(d.repository_language)){
                    temp = Number(myMap.get(d.repository_language));
                    myMap.set(d.repository_language, Number(d.num_users) + temp);
                } 
                else
                    myMap.set(d.repository_language, Number(d.num_users));               
            }
            //else
                //console.log("country " + d.Country + "     language " + d.repository_language +"   number: " +d.num_users);
        }); 

        var dataset = [];

        for (var [key, value] of myMap) {
          console.log(key + " = " + value);
          dataset.push({ label: key, count: value })
        }

        var path = svg.selectAll('path')
                      .data(pie(dataset))
                      .enter()
                      .append('path')
                      .attr('d', arc)
                      .attr('fill', function(d, i) { 
                        return color(d.data.label);
                      });

        var legend = svg.selectAll('.legend')
                        .data(color.domain())
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                            var height = legendRectSize + legendSpacing;
                            var offset =  height * color.domain().length / 2;
                            var horz = radius + legendRectSize;
                            var vert = i * height - offset;
                            return 'translate(' + horz + ',' + vert + ')';
                        });

        legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)                                   
              .style('fill', color)
              .style('stroke', color);
                
        legend.append('text')
              .attr('x', legendRectSize + legendSpacing)
              .attr('y', legendRectSize - legendSpacing)
              .text(function(d) { return d; });
    }); 

}
 console.log("piechart slut");