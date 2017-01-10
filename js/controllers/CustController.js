(function(){
angular.module("CustInfo")
	.controller("CustController", CustController);

CustController.$inject = ["DataService"];

function CustController(DataService){
	var vm = this;
	vm.custMasterData = null;
	vm.custMasterDataCopy = null;
	vm.custdata = null;
	vm.searchDropDownOptions = [{label: "First Name",value: "first_name"},{label: "Last Name",value: "last_name"},{label: "Credit card number",value: "credit_card_num"},{label: "Email",value: "email"},{label: "Country",value: "country"},{label: "City",value: "city"}];
	vm.selectedSearchOpt = vm.searchDropDownOptions[0];
	vm.currentPage = 1;
	vm.paginationPageSizes = 10;
	vm.init = init;
	vm.getTotalPages = getTotalPages;
	vm.goToNextPage = goToNextPage;
	vm.goToPrevPage = goToPrevPage;
	vm.search = search;
	vm.reset = reset;

	function init(){
		if(vm.custMasterDataCopy!=null){
			vm.custMasterData = angular.copy(vm.custMasterDataCopy);
			var tmpData = angular.copy(vm.custMasterData)
			vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
			tmpData = null;
		}
		else{
			DataService.getCustomerData()
			.then(function(response){
				vm.custMasterData = response;
				vm.custMasterDataCopy = response;
				console.log(vm.custMasterData[0]);
				var tmpData = angular.copy(vm.custMasterData)
				vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
				tmpData = null;
				//vm.gridOptions2.data = response;
			})
			.catch(function(err){
				console.log(err)
			})
		}
	};

	function getTotalPages(){
		return Math.ceil(vm.custMasterData.length / vm.paginationPageSizes);
	}

	function goToNextPage(){
		var tmpData = angular.copy(vm.custMasterData);
		vm.custdata = tmpData.splice((vm.currentPage*vm.paginationPageSizes), vm.paginationPageSizes);
		vm.currentPage++;
		tmpData = null;
	}

	function goToPrevPage(){
		var tmpData = angular.copy(vm.custMasterData);
		vm.currentPage--;
		vm.custdata = tmpData.splice(((vm.currentPage-1)*vm.paginationPageSizes), vm.paginationPageSizes);
		tmpData = null;
	}
	
	function search(){
		vm.custMasterData = angular.copy(vm.custMasterDataCopy);
		vm.custdata = new Array();
		angular.forEach(vm.custMasterData, function(value, key) {
			if(value[vm.selectedSearchOpt.value].toLowerCase().indexOf(vm.searchText) != -1){
				vm.custdata.push(value);
			}
		});
		vm.custMasterData = vm.custdata;
		vm.custdata = null;
		vm.custdata = vm.custMasterData.splice(0, vm.paginationPageSizes);
	}
	
	function reset(){
		vm.init();
	}
	/* vm.gridOptions2 = {
		enablePaginationControls: true,
		paginationPageSizes: [50, 75, 100, 150, 200, 300],
		paginationPageSize: 25
	};

	  vm.gridOptions2.onRegisterApi = function (gridApi) {
		vm.gridApi2 = gridApi;
	  } */
	vm.init();
}
})();