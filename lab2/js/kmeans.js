    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
   var keys = [];

   
    function kmeans(data, k) {
        
        //...
		var prev_quality = Infinity;
		var square_dist = Infinity;
		keys = d3.keys(data[0]);
		
		// Randomly place K points into the space -------------------------------
		if(!k) {
			k = 3;
		}
		
		//var range = [];
		var max = [];
		var min = [];
		keys.forEach(function (e) {
			max.push(d3.max(data, function(d){return d[e];}));
			min.push(d3.min(data, function(d){return d[e];}));
		});
		
		var kPoints = [];
		
		while(k--) {

			
			var point_pos = [];
			
			// place k random points within the dimension
			dim = 0;
			keys.forEach(function (d) {
			
				point_pos.push( min[dim] +
					(Math.random() * (max[dim] - min[dim])));
				dim++;
			});
			
			kPoints.push(point_pos);
		}
		
		do {
			prev_quality = square_dist;
			
			// calculate the euclidian distance to the centoids -------------------------
			// and get the closest centroid index
			var centroid_index = [data.length];
			
			//for (var i in data) {
			for (var i = 0; i < data.length; i++) {
				var cur_value = data[i];
				var sum = Infinity;
				
				for (var z = 0; z < kPoints.length; z++) {
					dim = 0;
					keys.forEach (function (d) {
						distance = Math.pow(kPoints[z][dim] - cur_value[d], 2);
						dim++;
					});

					distance = Math.sqrt(distance);
					
					if(sum > distance) {
						sum = distance;
						centroid_index[i] = z;
					}
				}
			}
			
			// move the centroids to the mean position of its assignd data ---------------
			var sumArray = new Array(data[0].length);
			for (var z = 0; z < kPoints.length; z++) {
				var count = 0;
			
				for (var i = 0; i < centroid_index.length; i++) {
					dim = 0;
					keys.forEach(function (d) {
						sumArray[dim] = 0;
						dim++;
					});
					
					if(centroid_index[i] == z) {						
						
						dim = 0;
						keys.forEach(function (d) {
							sumArray[dim] += data[i][d];
							dim++;
						});	
						count++;			
					}
				}
				
				for(var j in sumArray){
					if(count != 0)
						sumArray[j] = sumArray[j]/count;
				}
				
				// move the centroid
				if(count != 0) {
					kPoints[z] = sumArray;
				}
			}

			// check the quality of the cluster ---------------------------------------------
			for (var i = 0; i < centroid_index.length; i++) {
				var cur_value = data[i];

				for (var z = 0; z < kPoints.length; z++) {
					var dim = 0;
					for (var dimension in cur_value) {
						distance = cur_value[dimension] - kPoints[z][dim];
						dim++;
					}
					
					distance = Math.sqrt(distance);
					square_dist = Math.pow(distance, 2);
				}
			}
			
			console.log("prev: " + prev_quality);
			console.log("square dist: " + square_dist);
			
		} while(square_dist < prev_quality || prev_quality - square_dist > 0.005);	
		
    };

