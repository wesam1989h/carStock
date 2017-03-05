(function() {
	'use strict';
	car_stock_app.factory('car_service', ['$q', '$http',
		function($q, $http) {
		return {
		
			/**
			 * Get the cars from the json file
			 * @param {String} file The json file path
			 * @return {promise} deferred.promise
			 */
			get_cars : function(file){
				var deferred = $q.defer();
				$http.get(file).then(function(data) {
					// Success
					if(typeof data.data != "undefined"){
						deferred.resolve(data.data);
					}else{
						deferred.reject();
					}
				}, function(data) {
					deferred.reject();
				});
				return deferred.promise;
			}
		}
}
]);
})();