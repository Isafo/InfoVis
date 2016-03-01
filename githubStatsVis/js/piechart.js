function pc(country) {
    console.log("piechart start");
    var self = this;
    // delar av koden tagen från: http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart 

    /*var dataset = [
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

    //! remove preveus piechart if thers was one before, needed when switching country.
    d3.select('#chart').selectAll("svg").remove();

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


    //var test1 = pie1.selectCountry(country);
    //this.selectCountry = function(country){
        //clear data?

        d3.csv("data/github_commits_by_location_and_language.csv", function(error, bigdataset) {  
            var temp;
            bigdataset.forEach(function(d) {                    
                //d.count = +d.count; 
                //language_dataset.(d.repository_language) = repository_language + d.num_users;
                //Country,repository_language,num_users
                if(d.Country == country || country == "All"){
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
                }
            }); 

            var dataset = [];
            var tooManyLanguages = 0;

            for (var [key, value] of myMap) {
                //console.log(key + " = " + value);
                if (dataset.length < 6)
                    dataset.push({ label: key, count: value });
                else 
                    tooManyLanguages = tooManyLanguages + value;
            }
            if (tooManyLanguages)
                dataset.push({ label: "others", count: tooManyLanguages })


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
    //};
    console.log("piechart slut");
}