    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    function kmeans(data, k) {
        
        //...
        // Randomly place K points into the space
	if(!k) {
	    k = 3;
	}

	var range = [];
	

	for (var dimension in data) {
	    var extremes[];
	    
	    extremes[0] = d3.max(data, function(d){return d[dimension]});
	    extremes[1] = d3.min(data, function(d){return d[dimension]});

	    range.push(extremes);
	}
	
	var kPoints[];
	
	while(k--) {

	    var point_pos = [];
	    
	    // place k random points within the dimension
	    for(var dimension in data) {
		point_pos = range[dimension][1] +
		    (Math.random() * (range[dimension][0] - range[dimension][1]));
		
	    }
	    kPoints.push(point_pos);
	}

	// calculate the euclidian distance to the centoids
	// and get the closest centroid index
	var centroid_index = [];
	
	for (var i in data) {

	    var cur_value = data[i];
	    var sum = infinity;
	    for (var z = 0; z < kPoints.length; z++) {
		for (var dimension in cur_value) {
		    distance = kPonts[z][dimension] - curvalue[dimension];
		}
		distance = Math.sqrt(distance);
		
		if(sum > distance) {
		    sum = distance;
		    centroid_index[i] = z;
		}	
	    }
	}

	
	
    };

