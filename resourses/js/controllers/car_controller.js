(function (){
	'use strict';
	car_stock_app.controller('CarController', ['$scope', 'car_service',
		function($scope, car_service) {
		
		$scope.car_stocks = [];
		$scope.filters = {
				car_type : '',
				car_color : '',
				car_price : '',
				show : false
		};
		$scope.advanced_filters = {
				car_types_obj : {
					car_types : [],
					use_filter : false
				},
				car_colors_obj : {
					car_colors : [],
					use_filter : false
				},
				car_price_groups_obj : {
					car_price_groups : [],
					use_filter : false
				}
		};
		
		/**
		 * This function gets filter values
		 * @param {Object} json_obj
		 * @param {String} filter_type
		 * @return {Array} filter_values
		 * 
		 */
		function get_filter_value(json_obj, filter_type){
			var filter_values = [];
			if(typeof json_obj != "undefined"){
				angular.forEach(json_obj,function(value,key){
			        angular.forEach(value,function(v1,k1){
			        	angular.forEach(v1,function(v2,k2){
				        	switch(filter_type) {
				        	    case 'color':
				        	    	if(k2 == "color"){
				        	    		 var color = v2;
				        	    		 color = color.toString();
					        			 if (filter_values.filter(function(e) { return e.name == color; }).length == 0) {
					        				  /* filter_values contains the element we're looking for */
					        				 var color_obj = {
					        						name : color,
					        						select : false
					        				 };
					        				 filter_values.push(color_obj);
					        			 }
					        		}
				        	    break;
				        	    case 'type':
				        	    	if(k2 == "type"){
				        	    		 var type = v2;
				        				 type = type.toString().split(" ")[0];
					        			 if (filter_values.filter(function(e) { return e.name == type; }).length == 0) {
					        				  /* filter_values contains the element we're looking for */
					        				 var type_obj = {
					        						name : type,
					        						select : false
					        				 };
					        				 filter_values.push(type_obj);
					        			 }
					        		}
				        	    break;
				        	    case 'price':
				        	    	if(k2 == "price"){
				        	    		 if (filter_values.indexOf(v2) === -1){
					        				 filter_values.push(v2);
						        		 }
					        		}
				        	    break;
				        	    default:
				        	    	filter_values = [];
				        	    break;
				        	}
			        	});
			        });
			    });
			}
	   		return filter_values;
		}
		
		/**
		 * This function generates array of price ranges
		 * @param {array} car_prices The Array of car's prices
		 * @param {int} group_count The count of price group that we want to generate
		 * @return {array}
		 * 
		 */
		function generate_group_price(car_prices, group_count){
			var car_price_groups = [],
			larg_price = 0,
				range = 0;
			// Generate range of group prices
			if(typeof car_prices != "undefined" && car_prices.length > 0){
				car_prices.sort(naturalSort);
				larg_price = car_prices[car_prices.length-1];
				if(larg_price > 0){
					range = larg_price / group_count;
				}
			}
			// Build array of objects, each object is a group contain min and max of price
			for(var i = 0; i < group_count; i++){
				var min = i*range;
				var max = min + range;
				if(max == larg_price){
					var group_obj = {
							min : parseInt(min),
							select : false
					};
				}else{
					var group_obj = {
							min : parseInt(min),
							max : parseInt(max),
							select : false
					};
				}
				car_price_groups.push(group_obj);
			}
			return car_price_groups;
		}
		
		/**
		 * This function reset filters and show / hide them
		 */
		$scope.toggle_filters = function(){
			if($scope.filters.show){
				$scope.filters.show = false;
			}else{
				$scope.filters.show = true;
			}
			$scope.filters.car_type = '';
			$scope.filters.car_color = '';
			$scope.filters.car_price = '';
	    };
	    
	    /**
		 * This function is used to filter cars
		 * @param  {object} item The car to filter by
		 * @return {bool} 
		 */
		$scope.advanced_filter = function(item){
			var type_filter_found = true,
				color_filter_found = true,
				price_filter_found = true,
				found = true;
			// Search for selected car type filters and check wether the item type is similar to the filter value
			if(typeof item.type != "undefined"){
					if(typeof $scope.advanced_filters.car_types_obj.car_types != "undefined" && $scope.advanced_filters.car_types_obj.car_types.length > 0){
						var selected_filters = $scope.advanced_filters.car_types_obj.car_types.filter(function(e) {
									if(e.select){
										return e
									}else{
										return e.select; 
									}
							});	
						if (selected_filters.length > 0){
							var type_name = item.type.toString().toLowerCase();
							if (selected_filters.filter(function(e) { return type_name.indexOf(e.name.toString().toLowerCase()) !== -1;}).length > 0) {
								type_filter_found = true;
							}else{
								type_filter_found = false;
							}
						}
					}
			}
			// Search for selected car color filters and check wether the item color is equal to the filter value
			if(typeof item.color != "undefined"){
					if(typeof $scope.advanced_filters.car_colors_obj.car_colors != "undefined" && $scope.advanced_filters.car_colors_obj.car_colors.length > 0){
						var selected_filters = $scope.advanced_filters.car_colors_obj.car_colors.filter(function(e) {
									if(e.select){
										return e
									}else{
										return e.select; 
									}
							});	
						if (selected_filters.length > 0){
							var color_name = item.color.toString().toLowerCase();
							if (selected_filters.filter(function(e) { return color_name == e.name;}).length > 0) {
								color_filter_found = true;
							}else{
								color_filter_found = false;
							} 
						}
					}
			}
			// Search for selected car price range filters and check wether the item price is between min and max price of the filter value
			if(typeof item.price != "undefined"){
				if(typeof $scope.advanced_filters.car_price_groups_obj.car_price_groups != "undefined" && $scope.advanced_filters.car_price_groups_obj.car_price_groups.length > 0){
					var selected_filters = $scope.advanced_filters.car_price_groups_obj.car_price_groups.filter(function(e) {
								if(e.select){
									return e
								}else{
									return e.select; 
								}
						});	
					if (selected_filters.length > 0){
						var price = item.price.toString().toLowerCase();
						if (selected_filters.filter(function(e) { 
								if(typeof e.max != "undefined"){
									if(price >= e.min && price <= e.max){
										return true;
									}else{
										return false;
									}
								}else{
									if(price >= e.min){
										return true;
									}else{
										return false;
									}
									
								}
							}).length > 0) {
							price_filter_found = true;
						}else{
							price_filter_found = false;
						} 
					}
				}
			}
			// check if all filters are true
			if(type_filter_found && color_filter_found && price_filter_found){
				found = true;
			}else{
				found = false;
			}
			return found;
	    };
	    
	    /**
		 * Initial the controller
		 */
		function init(){
			$scope.car_stocks = car_stock_json;
			// generate filters
			$scope.advanced_filters.car_colors_obj.car_colors = get_filter_value($scope.car_stocks, 'color');
	        $scope.advanced_filters.car_types_obj.car_types =  get_filter_value($scope.car_stocks, 'type');
	        var car_prices =  get_filter_value($scope.car_stocks, 'price');
	        $scope.advanced_filters.car_price_groups_obj.car_price_groups = generate_group_price(car_prices, 4);
	        
	        // This part has been replaced with the code above, because we couldn't read files from browsers like Chrome without using a web server
	        /*
			 car_service.get_cars('car_stock.json').then(function(data) {
				 	$scope.car_stocks = data;
			        $scope.advanced_filters.car_colors_obj.car_colors = get_filter_value($scope.car_stocks, 'color');
			        $scope.advanced_filters.car_types_obj.car_types =  get_filter_value($scope.car_stocks, 'type');
			        var car_prices =  get_filter_value($scope.car_stocks, 'price');
			        $scope.advanced_filters.car_price_groups_obj.car_price_groups = generate_group_price(car_prices, 4);
			 }, function() {
				 	
			 });*/
		}
		
		//
		init();
		
		}
	]);
})();
