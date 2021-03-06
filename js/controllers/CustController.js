﻿(function(){
angular.module("CustInfo")
	.controller("CustController", CustController);

CustController.$inject = ["DataService"];

function CustController(DataService){
	var vm = this;
	vm.custMasterData = null;
	vm.custMasterDataCopy = null;
	vm.custdata = null;
	vm.uniqueCountries = null;
	vm.uniqueCurrencies = null;
	vm.uniqueCreditCardTypes = null;
	vm.selectedCountries = new Array();
	vm.selectedCurrencies = new Array();
	vm.selectedCCType = new Array();
	vm.searchDropDownOptions = [{label: "First Name",value: "first_name"},{label: "Last Name",value: "last_name"},{label: "Credit card number",value: "credit_card_num"},{label: "Email",value: "email"},{label: "Country",value: "country"},{label: "City",value: "city"}];
	vm.selectedSearchOpt = null;
	vm.paginationOptions = ["10", "20", "50", "100", "300"]
	vm.selectedPagination = vm.paginationOptions[0];
	vm.currentPage = 1;
	vm.paginationPageSizes = 10;
	vm.activeAdvanceFilters = false;
	vm.sortAsc = {firstName:null, lastName:null, country:null};
	vm.init = init;
	vm.getTotalPages = getTotalPages;
	vm.goToNextPage = goToNextPage;
	vm.goToPrevPage = goToPrevPage;
	vm.filterGender = filterGender;
	vm.filterCountry = filterCountry;
	vm.filterCurrency = filterCurrency;
	vm.filterCCType = filterCCType;
	vm.filterData = filterData;
	vm.getUniqueCountries = getUniqueCountries;
	vm.getUniquecurrency = getUniquecurrency;
	vm.getUniqueCreditCardTypes = getUniqueCreditCardTypes;
	vm.showAdvanceFilters = showAdvanceFilters;
	vm.changePaginationValue = changePaginationValue;
	vm.search = search;
	vm.sortData = sortData;
	vm.reset = reset;

	
	/** This is the first method called, where it will initialize all the functional modules of this app. The data from this method is loaded only once and if this method is called again the data is preserved and used again instead of giving a rest call */
	function init(){
		vm.searchText = null;
		vm.genderMale = null;
		vm.genderFemale = null;
		vm.currentPage = 1;
		vm.activeAdvanceFilters = false;
		vm.sortAsc = {firstName:null, lastName:null, country:null};
		vm.selectedSearchOpt = vm.searchDropDownOptions[0];
		if(vm.custMasterDataCopy!=null){
			vm.custMasterData = angular.copy(vm.custMasterDataCopy);
			var tmpData = angular.copy(vm.custMasterData)
			vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
			tmpData = null;
			vm.getUniqueCountries();
			vm.getUniquecurrency();
			vm.getUniqueCreditCardTypes();
		}
		else{
			DataService.getCustomerData()
			.then(function(response){
				vm.custMasterData = response;
				vm.custMasterDataCopy = response;
				var tmpData = angular.copy(vm.custMasterData)
				vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
				tmpData = null;
				vm.getUniqueCountries();
				vm.getUniquecurrency();
				vm.getUniqueCreditCardTypes();
				//vm.gridOptions2.data = response;
			})
			.catch(function(err){
				console.log(err);
				DataService.getCustomerDataOffline()
				.then(function(responseOffline){
					vm.custMasterData = responseOffline;
					vm.custMasterDataCopy = responseOffline;
					var tmpData = angular.copy(vm.custMasterData)
					vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
					tmpData = null;
					vm.getUniqueCountries();
					vm.getUniquecurrency();
					vm.getUniqueCreditCardTypes();
				})
				.catch(function(errOffline){
					console.log(errOffline)
				});
			})
		}
	};

	/** This method will only return number of pages you can jump next according to pagination  */
	function getTotalPages(){
		return Math.ceil(vm.custMasterData.length / vm.paginationPageSizes);
	}

	/** This method will help in jumping to the next slot of values from data according to pagination */
	function goToNextPage(){
		var tmpData = angular.copy(vm.custMasterData);
		vm.custdata = tmpData.splice((vm.currentPage*vm.paginationPageSizes), vm.paginationPageSizes);
		vm.currentPage++;
		tmpData = null;
		vm.sortAsc = {firstName:null, lastName:null, country:null};
	}

	/** This method will help in jumping to the previous slot of values from data according to pagination */
	function goToPrevPage(){
		var tmpData = angular.copy(vm.custMasterData);
		vm.currentPage--;
		vm.custdata = tmpData.splice(((vm.currentPage-1)*vm.paginationPageSizes), vm.paginationPageSizes);
		tmpData = null;
		vm.sortAsc = {firstName:null, lastName:null, country:null};
	}

	/** This method searches value according to the value in search text box and the combo box, this method is smartly written to avoid multiple call for each selection, it will check the value from combo box and will search and return value accordingly */
	function search(){
		vm.custMasterData = angular.copy(vm.custMasterDataCopy);
		vm.custdata = new Array();
		angular.forEach(vm.custMasterData, function(value, key) {
			if(value[vm.selectedSearchOpt.value].toLowerCase().indexOf(vm.searchText) != -1){
				vm.custdata.push(value);
			}
		});
		vm.custMasterData = angular.copy(vm.custdata);
		var tmpData = angular.copy(vm.custMasterData)
		vm.custdata = null;
		vm.custdata = tmpData.splice(0, vm.paginationPageSizes);
		vm.sortAsc = {firstName:null, lastName:null, country:null};
	}

	/** This method will reset the pagination, with all the features */
	function reset(){
		vm.paginationPageSizes = 10;
		vm.selectedPagination = vm.paginationOptions[0];
		vm.init();
	}

	/** An Extra method just for simplicity of code and avoid confusion for gender selection */
	function filterGender(){
		vm.filterData();
	}

	/** This method will tackle filteration of data from all the selections done in checkboxes (Advance filter) */
	function filterData(){
		vm.custMasterData = angular.copy(vm.custMasterDataCopy);
		var tmpData = new Array();
		if(vm.genderMale!=undefined && vm.genderMale!=false || vm.genderFemale!=undefined && vm.genderFemale!=false)
		{
			if(vm.genderMale!=false && vm.genderFemale!=false && vm.genderMale!=undefined && vm.genderFemale!=undefined){
				tmpData = angular.copy(vm.custMasterData);
			}
			else if(vm.genderMale!=false && vm.genderMale!=undefined){
				angular.forEach(vm.custMasterData, function(value, key) {
					if(value.gender.toLowerCase() == "male"){
						tmpData.push(value);
					}
				});
			}
			else{
				angular.forEach(vm.custMasterData, function(value, key) {
					if(value.gender.toLowerCase() == "female"){
						tmpData.push(value);
					}
				});
			}
		}
		else{
			tmpData = angular.copy(vm.custMasterData);
		}
			//Need to check below code
			if(vm.selectedCountries.length>0){
				var newTmpData = new Array();
				for(var i=0; i<vm.selectedCountries.length; i++){
					for(var j=0; j<tmpData.length; j++){
						if(vm.selectedCountries[i] == tmpData[j].country){
							newTmpData.push(tmpData[j]);
						}
					}
				}
				tmpData = angular.copy(newTmpData);
			}

			if(vm.selectedCurrencies.length>0){
				var newTmpData = new Array();
				for(var k=0; k<vm.selectedCurrencies.length; k++){
					for(var l=0; l<tmpData.length; l++){
						if(vm.selectedCurrencies[k] == tmpData[l].currency){
							newTmpData.push(tmpData[l]);
						}
					}
				}
				tmpData = angular.copy(newTmpData);
			}

			if(vm.selectedCCType.length>0){
				var newTmpData = new Array();
				for(var x=0; x<vm.selectedCCType.length; x++){
					for(var y=0; y<tmpData.length; y++){
						if(vm.selectedCCType[x] == tmpData[y].credit_card_type){
							newTmpData.push(tmpData[y]);
						}
					}
				}
				tmpData = angular.copy(newTmpData);
			}
			vm.custMasterData = angular.copy(tmpData);
			var newTmpData = angular.copy(vm.custMasterData)
			vm.custdata = null;
			vm.custdata = newTmpData.splice(0, vm.paginationPageSizes);
	}

	/** This method is called while initialization and will copy all the unique countries in an separate array named- uniqueCountries */
	function getUniqueCountries(){
		var tmpData = new Array();
		tmpData= angular.copy(vm.custMasterData);
		for(var i=0; i<tmpData.length; i++){
			for(var j=i+1; j<tmpData.length;j++){
				if(tmpData[i].country == tmpData[j].country){
					tmpData.splice(j,1);
					j--;
				}
			}
		}

		vm.uniqueCountries = angular.copy(tmpData);
		tmpData = null;
	}

	/** This method is called while initialization and will copy all the unique currencies in an separate array named- uniqueCurrencies */
	function getUniquecurrency(){
		var tmpData = new Array();
		tmpData= angular.copy(vm.custMasterData);
		for(var i=0; i<tmpData.length; i++){
			for(var j=i+1; j<tmpData.length;j++){
				if(tmpData[i].currency == tmpData[j].currency){
					tmpData.splice(j,1);
					j--;
				}
			}
		}

		vm.uniqueCurrencies = angular.copy(tmpData);
		tmpData = null;
	}

	/** This method is called while initialization and will copy all the unique credit card types in an separate array named- uniqueCreditCardTypes */
	function getUniqueCreditCardTypes(){
		var tmpData = new Array();
		tmpData= angular.copy(vm.custMasterData);
		for(var i=0; i<tmpData.length; i++){
			for(var j=i+1; j<tmpData.length;j++){
				if(tmpData[i].credit_card_type == tmpData[j].credit_card_type){
					tmpData.splice(j,1);
					j--;
				}
			}
		}

		vm.uniqueCreditCardTypes = angular.copy(tmpData);
		tmpData = null;
	}

	/** This method will create a new array of countries that are selected/checked from checkbox which will later call the filterData method */
	function filterCountry(country){
		if(vm.selectedCountries.length > 0){
			var flag= false;
			var index=-1;
			for(var i=0; i<vm.selectedCountries.length; i++){
				if(vm.selectedCountries[i] == country)
				{
					flag = true;
					index = i;
					break;
				}
			}

			if(flag == false){
				vm.selectedCountries.push(country);
			}
			else{
				vm.selectedCountries.splice(index,1);
			}
		}
		else{
			vm.selectedCountries.push(country);
		}
		vm.filterData();
	}

	/** This method will create a new array of currencies that are selected/checked from checkbox which will later call the filterData method */
	function filterCurrency(currency){
		if(vm.selectedCurrencies.length > 0){
			var flag= false;
			var index=-1;
			for(var i=0; i<vm.selectedCurrencies.length; i++){
				if(vm.selectedCurrencies[i] == currency)
				{
					flag = true;
					index = i;
					break;
				}
			}

			if(flag == false){
				vm.selectedCurrencies.push(currency);
			}
			else{
				vm.selectedCurrencies.splice(index,1);
			}
		}
		else{
			vm.selectedCurrencies.push(currency);
		}
		vm.filterData();
	}

	/** This method will create a new array of credit card types that are selected/checked from checkbox which will later call the filterData method */
	function filterCCType(cctype){
		if(vm.selectedCCType.length > 0){
			var flag= false;
			var index=-1;
			for(var i=0; i<vm.selectedCCType.length; i++){
				if(vm.selectedCCType[i] == cctype)
				{
					flag = true;
					index = i;
					break;
				}
			}

			if(flag == false){
				vm.selectedCCType.push(cctype);
			}
			else{
				vm.selectedCCType.splice(index,1);
			}
		}
		else{
			vm.selectedCCType.push(cctype);
		}
		vm.filterData();
	}
	
	/** This method will just show the box of all checkboxes i.e Advance filter and will also disable the search text box, search combo box and search button and vice versa */
	function showAdvanceFilters(){
		vm.searchText = null;
		if(vm.activeAdvanceFilters == true){
			vm.activeAdvanceFilters = false;
		}
		else{
			vm.activeAdvanceFilters = true;
		}
	}
	
	/** This method is a generic method to sort columns from the table in ascending and decending manner, the column is sorted according to the value in sortType variable */
	function sortData(sortType){
		if(sortType == 'fname'){
			if(vm.sortAsc.firstName == false || vm.sortAsc.firstName == null){
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.first_name.toLowerCase();
					var y = b.first_name.toLowerCase();
					return x < y ? -1 : x > y ? 1 : 0;
				});
				vm.custdata = angular.copy(byName);
				vm.sortAsc.firstName = true;
			}
			else{
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.first_name.toLowerCase();
					var y = b.first_name.toLowerCase();
					return x < y ? 1 : x > y ? -1 : 0;
				});
				vm.custdata = angular.copy(byName)
				vm.sortAsc.firstName = false;
			}
			vm.sortAsc.lastName=null
			vm.sortAsc.country=null;
		}
		else if(sortType == 'lname'){
			if(vm.sortAsc.lastName == false || vm.sortAsc.lastName == null){
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.last_name.toLowerCase();
					var y = b.last_name.toLowerCase();
					return x < y ? -1 : x > y ? 1 : 0;
				});
				vm.custdata = angular.copy(byName);
				vm.sortAsc.lastName = true;
			}
			else{
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.last_name.toLowerCase();
					var y = b.last_name.toLowerCase();
					return x < y ? 1 : x > y ? -1 : 0;
				});
				vm.custdata = angular.copy(byName)
				vm.sortAsc.lastName = false;
			}
			vm.sortAsc.firstName=null
			vm.sortAsc.country=null;
		}
		else if(sortType == 'country'){
			if(vm.sortAsc.country == false || vm.sortAsc.country == null){
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.country.toLowerCase();
					var y = b.country.toLowerCase();
					return x < y ? -1 : x > y ? 1 : 0;
				});
				vm.custdata = angular.copy(byName);
				vm.sortAsc.country = true;
			}
			else{
				var byName = vm.custdata.slice(0);
				byName.sort(function(a,b) {
					var x = a.country.toLowerCase();
					var y = b.country.toLowerCase();
					return x < y ? 1 : x > y ? -1 : 0;
				});
				vm.custdata = angular.copy(byName)
				vm.sortAsc.country = false;
			}
			vm.sortAsc.firstName=null;
			vm.sortAsc.lastName=null
		}
	}
	
	/** This method will change the pagination value i.e number of rows we will see in the table according to the value selected */
	function changePaginationValue(paginationVal){
		vm.paginationPageSizes = parseInt(vm.selectedPagination);
		vm.init();
	}
	
	/** Below code is commented because this code creates a new grid with the help of angular's UI-grid plugin. */
	/* vm.gridOptions2 = {
		enablePaginationControls: true,
		paginationPageSizes: [50, 75, 100, 150, 200, 300],
		paginationPageSize: 25
	};

	  vm.gridOptions2.onRegisterApi = function (gridApi) {
		vm.gridApi2 = gridApi;
	  } */
	  
	/** Initialise application */
	vm.init();
}
})();