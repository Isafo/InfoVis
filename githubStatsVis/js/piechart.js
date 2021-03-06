

var colorLanguage = d3.scale.category20();
var legendLableLang = {};

function piec(country) {
    var self = this;
    // parts of the code taken from; [1] http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart
    //------------Taken from lab1 TNM048 ------------------------------------------------

    var myMap = new Map();

    var width = Number(document.getElementById("chart").offsetWidth)/2;
    var height = Number(document.getElementById("chart").offsetHeight);

    var radius = Math.min(width, height) / 2;
    var donutWidth = radius * 0.3; // for piechart: donutWidth = radius;
    var legendRectSize = 18;
    var legendSpacing = 4;

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


    d3.csv("data/github_commits_by_location_and_language.csv", function(error, bigdataset) {
        //rearrange the data so that it can be displayd in the pieChart
        var temp;
        bigdataset.forEach(function(d) {

            if(d.Country == country || country == "All"){
                if (Number(d.num_users)){

                    if (myMap.has(d.repository_language)){
                        temp = Number(myMap.get(d.repository_language));
                        myMap.set(d.repository_language, Number(d.num_users) + temp);
                    }
                    else{
                        myMap.set(d.repository_language, Number(d.num_users));
                    }
                }
                //else //för att rensa csv filen
                    //console.log("country " + d.Country + "     language " + d.repository_language +"   number: " +d.num_users);
            }
        });

        var dataset = [];
        var tooManyLanguages = 0;

        for (var [key, value] of myMap) {
            if (dataset.length < 9)
                dataset.push({ label: key, count: value });
            else
                tooManyLanguages = tooManyLanguages + value;
        }
        if (tooManyLanguages)
            dataset.push({ label: "others", count: tooManyLanguages })

        //create the piechart pises
        var path = svg.selectAll('path')
                      .data(pie(dataset))
                      .enter()
                      .append('path')
                      .attr('d', arc)
                      .attr('fill', function(d, i) {
                        return colorLanguage(d.data.label);
                      });

        path.on('mouseover', function(d) {
            var total = d3.sum(dataset.map(function(d) {
                return d.count;
            }));
            var percent = Math.round(1000 * d.data.count / total) / 10;
            tooltip.select('.label2').html(d.data.label);
            tooltip.select('.count').html(d.data.count);
            tooltip.select('.percent').html(percent + '%');
            tooltip.style('display', 'block');
        });

        path.on('mouseout', function() {
            tooltip.style('display', 'none');
        });

        path.on('mousemove', function(d) {
            tooltip.style('top', (d3.event.layerY + 10) + 'px')
                   .style('left', (d3.event.layerX + 10) + 'px');
        });

        var legend = svg.selectAll('.legend')
                        .data(dataset)
                        .enter()
                        .append('g')
                        .attr('class', 'legend')
                        .attr('transform', function(d, i) {
                            var height = legendRectSize + legendSpacing;
                            var offset =  height * dataset.length / 2;
                            var horz = radius + legendRectSize;
                            var vert = i * height - offset;
                            return 'translate(' + horz + ',' + vert + ')';
                        });

        legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)
              .style('fill', function(d) { return colorLanguage(d.label)})
              .style('stroke', function(d) { return colorLanguage(d.label)});

        legend.append('text')
              .attr('x', legendRectSize + legendSpacing)
              .attr('y', legendRectSize - legendSpacing)
              .text(function(d) { legendLableLang[d.label] = d.label; return d.label; });
    });

    var tooltip = d3.select('#chart')
        .append('div')
        .attr('class', 'tooltip');

    tooltip.append('div')
        .attr('class', 'label2');

    tooltip.append('div')
        .attr('class', 'count');

    tooltip.append('div')
        .attr('class', 'percent');
}
