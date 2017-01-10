(function(){
angular.module("CustInfo")
	.service("DataService", DataService);

DataService.$inject = ["$q", "$http"];

function DataService($q, $http){
	var vm = this;
	vm.getCustomerData = getCustomerData;

	function getCustomerData(){
		return $q(function(resolve, reject) {
			$http({
			  method: 'GET',
			  //url: './js/services/MyData.json'
			  url: 'https://api.myjson.com/bins/3ir6o'
			}).then(function successCallback(response) {
				resolve(response.data)
			}, function errorCallback(error) {
				reject(error)
			});
		});
	};
};
})();