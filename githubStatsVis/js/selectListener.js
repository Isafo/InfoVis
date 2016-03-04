$('#language_select').on('change', function() {
  mode = $( "#language_select" ).val();

  map.setMode(mode);
});


document.getElementById("topBtn").addEventListener("click", function(){
    console.log("click");
    map.setMode("topLanguages");
});