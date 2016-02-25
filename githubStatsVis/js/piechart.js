 
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

d3.csv("github_commits_by_location_and_language.csv", type, function(error, data) {
    if(error)
	throw error;

    var g =  svg.selectAll(".arc")
	        .data(pie(data))
		.enter()
		.append("g")
    		.attr("class", "arc");

    g.append("path")
	.attr("d", arc)
    	.style("fill", function(d) { return color(d.repository_language); });

    g.append("text")
	.attr("transform", function(d) { return "translate("
					 + label_arc.centroid(d)
					 + ")";})
    	.attr("dy", ".35em")
    	.text(function(d) { return d.repository.language });
});

function type(d) {
    d.num_users = +d.num_users;
    return d;
}
