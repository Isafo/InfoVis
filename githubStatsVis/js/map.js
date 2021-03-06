var countries;

function map() {

    var self = this; // for internal d3 functions

//------------Taken from lab1 TNM048 -----------------------------------------------

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 1])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

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

	  var countries_commits = [];
    var countries_population = [];
    var repo_languages = [];

    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        countries = topojson.feature(world, world.objects.countries).features;
    });

//-------------------- End of copied part --------------------------------------------


    //initialize color scale
    var color_domain = [ 10, 100, 1000, 10000 ];
    var legend_domain = [ 0, 10, 100, 1000 ];
    var legend_label = ["0 - 10", "10 - 1000", "1000 - 100000", "100000+"];
    var color = d3.scale.threshold()
                        .domain(color_domain)
                        .range(["#ffffb2", "#fecc5c", "#fd8d3c", "#e31a1c"]);

    function draw(data,cc,mode) {
        svg.selectAll(".legend").remove();
        g.selectAll(".country").remove();

        var country = g.selectAll(".country").data(countries);

        var legendInfoText;
        switch(mode) {
          case 1:
            legendInfoText = "Commits to open source repos per 100k population";
            break;
          case 2:
            legendInfoText = "";
            break;
          default:
            legendInfoText = "Open source repos per 100k population";
            break;
        }

//------------Taken from lab1 TNM048 ------------------------------------------------
        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })

            .style("fill", function(d) {
                return cc[d.properties.name];
            })
//-------------------- End of copied part -------------------------------------------
            .style("stroke", function(d) {
                return "#888888";
            })
            //selection
            .on("click",  function(d) {
                d3.select('#title').selectAll("label").remove();
                d3.select('#info').selectAll("label").remove();

                d3.select('#title').append('label').text("Top 10 languages in " + d.properties.name);

                d3.csv("data/github_commits_by_country.csv", function(error,data) {

                  data.forEach(function(d,i) {
                    countries_commits[d["Country"]] = d["Commits_per_100k_People"];
                    countries_population[d["Country"]] = d["Population"];
                  });

                  d3.select('#info').append('label').text("Population : " + countries_population[d.properties.name]);

                  if(document.getElementById("language_select").value == "All")
                    d3.select('#info').append('label').text("Number of repository per 100k people : " + countries_commits[d.properties.name]);
                  else
                    d3.select('#info').append('label').text("Number of " + document.getElementById("language_select").value + " repository per 100k people : " + repo_languages[d.properties.name]);
                });
                var pie = new piec(d.properties.name);
            });

            var legendDiv = svg.selectAll(".legendDiv")
                            .data(legend_domain)
                            .enter().append("g")
                            .attr("class", "legend");

            var legend = legendDiv.selectAll(".legend")
                            .data(legend_domain)
                            .enter().append("g")
                            .attr("class", "legend");

            var legend_width = 20, legend_height = 20;


            if(mode != 2) {
              legend.append("rect")
                    .attr("x", 20)
                    .attr("y", function(d, i){ return height*0.95 - 4*i - (i*legend_height) - 2*legend_height;})
                    .attr("width", legend_width)
                    .attr("height", legend_height)
                    .style("fill", function(d, i) { return color(d); })
                    .style("stroke", function(d, i) { return "#888888"; });

              legend.append("text")
                    .attr("x", 50)
                    .attr("y", function(d, i){ return height*0.95 - 4*i - (i*legend_height) - legend_height - 4;})
                    .text(function(d, i){ return legend_label[i]; });
            }
            else {
            }


            legend.append("text")
                  .attr("class", "legendInfo")
                  .attr("x", 20)
                  .attr("y", height*0.95 - (5*legend_height) - legend_height)
                  .text(legendInfoText);

    }

//------------Taken from lab1 TNM048 ------------------------------------------------
    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;


        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
//-------------------- End of copied part --------------------------------------------


    this.setMode = function(mode) {
      var cc = {};
      var users = {};

      switch(mode) {
        case "All":
          d3.csv("data/github_commits_by_country.csv", function(error,data) {
              data.forEach(function(d,i) {
                  cc[d["Country"]] = color(d["Commits_per_100k_People"]);
              });

              draw(data,cc, 1);
          });
          break;

        case "topLanguages":

          var languages = {};
          var counter = 0;

          d3.csv("data/github_commits_by_location_and_language.csv", function(error,data) {
            data.forEach(function(d,i) {
                if (Number(d.num_users)){

                  if(languages[d["Country"]]){
                      if (languages[d["Country"]][d["repository_language"]]) {
                        languages[d["Country"]][d["repository_language"]] += Number(d["num_users"]);
                      }
                      else{
                        languages[d["Country"]][d["repository_language"]] = Number(d["num_users"]);
                      }
                  }
                  else
                  {
                    languages[d["Country"]] = {};
                    languages[d["Country"]][d["repository_language"]] = Number(d["num_users"]);
                  }
                }
            });

            var big = 0;
            var largest;

            for (var country in languages){
              big = 0;

              for (var key in languages[country]){
                if ( Number(languages[country][key]) > 0)
                {
                  if (Number(languages[country][key]) > big){
                    big = Number(languages[country][key]);
                    largest = key;
                  }
                }
              }
              if (big != 0){
                cc[country] = colorLanguage(largest);
              }
            };


            draw(data,cc, 2);
          });
        break;

        default:
          var population = {};
          d3.csv("data/github_commits_by_country.csv", function(error,data) {
              data.forEach(function(d,i) {
                  population[d["Country"]] = d["Population"] / 100000;
              });
          });

          d3.csv("data/github_commits_by_location_and_language.csv", function(error,data) {

            data.forEach(function(d,i) {
              if(d["repository_language"] == mode)
                if(Number(d["num_users"])) {
                  if(users[d["Country"]]) {
                    users[d["Country"]] += Number(d["num_users"]);
                  }
                  else{
                    users[d["Country"]] = Number(d["num_users"]);
                  }

                  cc[d["Country"]] = color(users[d["Country"]] / population[d["Country"]]);
                  repo_languages[d["Country"]] = users[d["Country"]] / population[d["Country"]];
                }
            });

            draw(data,cc, 0);
          });
          break;
      }
    }
}
