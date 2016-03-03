$('#language_select').on('change', function() {
  mode = $( "#language_select" ).val();

  map.setMode(mode);
});
