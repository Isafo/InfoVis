
var pie = new pc("All");

var map = new map();

d3.select('#title').append('label').text("Top 10 languages in all countries");
d3.select('#description').append('label').append("small").text("measured by number of repositories in in that languages \n \n");

map.setMode("All");
