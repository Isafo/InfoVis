    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
   var keys = [];
   var centroids = [];
   var centroid_index = [];

   function calcCentroid(data, k){
		// Randomly place K points into the space
		var temp = []
   		for(var i = 0; i < k; i++) {
			temp[i] = data[Math.floor(Math.random() * data.length)];
		}
		return temp;
   }
   
   function assignCentroid(data, _centroids){
		var temp = []
		
		for (var i = 0; i < data.length; i++) {
				var cur_value = data[i];
				var sum = Infinity;
				var distance;
				 
				for (var z = 0; z < _centroids.length; z++) {
					distance = 0;

					keys.forEach (function (d) {
						distance += Math.pow(_centroids[z][d] - cur_value[d], 2);
					});
					
					distance = Math.sqrt(distance);
					
					if(sum > distance) {
						sum = distance;
						temp[i] = z;
					}
				}
			}
		return temp;
   }
   
   function moveCentroid(data, _centroids, _centroid_index) {
		// move the centroids to the mean position of its assignd data
		var newPos = _centroids;
		var sum = data[0];
		var count = 0;
		
		for (var z = 0; z < _centroids.length; z++) {
			count = 0;
			keys.forEach(function (d) {
				sum[d] = 0;
			});
		
			for (var i = 0; i < _centroid_index.length; i++) {
				if(_centroid_index[i] == z) {
					keys.forEach(function (d) {
						sum[d] += Number(data[i][d]);
						
					});
					count++;
				}	
			}
			//console.log(sum);
			
			keys.forEach(function (d) {
				newPos[z][d] = sum[d] / count;
				//console.log(count);
			});
			//console.log(newPos);
		}

		return newPos;
   }

   
    function kmeans(data, k) {
        
        //...
		var prev_quality = Infinity;
		var square_dist = Infinity;
		var qu  = Infinity;
		keys = d3.keys(data[0]);
		var distance = 0;
		
		// Randomly place K points into the space
		centroids = calcCentroid(data,k);

		// repeat untill the results dosen't improve or dosen't improve above epsilon
		do {
			prev_quality = qu;
			
			// calculate the euclidian distance to the centoids 
			// and get the closest centroid index
			centroid_index = assignCentroid(data,centroids);

			// move the centroids to the mean position of its assignd data
			centroids = moveCentroid(data, centroids, centroid_index);
			
			var temp = [];
			// check the quality of the cluster ------------------------------------
			for (var i = 0; i < centroid_index.length; i++) {
				var cur_value = data[i];
				distance = 0;
				temp = [];
				
				for (var z = 0; z < centroids.length; z++) {
					keys.forEach( function (d) {
						distance += Number(Math.pow(cur_value[d] - centroids[z][d], 2));	
					});	

					distance = Math.sqrt(distance);
				
					square_dist = Math.pow(distance, 2);
					temp.push(square_dist);
					
				}
				
				//console.log(temp);
			}
				//console.log(Math.min.apply(Math, temp));
				qu = Math.min.apply(Math, temp);
			
			//console.log("prev: " + prev_quality);
			//console.log("square dist: " + square_dist);
			
		} while(qu < prev_quality || prev_quality - qu > 0.005);	

		return centroid_index;
    };

