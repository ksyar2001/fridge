angular.module('starter.APIservices', [])

.factory('APIService', function($http, $state, $rootScope, $q){
	var header = {'X-Mashape-Key':'Vy8k8AFD4KmshIMbldoXn34WwUrip1vKDsWjsnpAbRHyCbIlO6', 'Accept':'application/json'};
	var api_url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/';
	var error = {};

	return {
		//return list of recipes with their ids when searched by ingredients
		get_recipes_with_ingredients : function(fillingredients, ingredients, limitLicense=false, number, ranking){

			// default values for testing purpose
			fillingredients = fillingredients || false;
			ingredients = ingredients || [ "apples", "flour", "sugar" ];
			limitLicense = limitLicense || false;
			number = number || 5;
			ranking = ranking || 1;
			//queryParameters = queryParameters || null;

			var url = api_url + 'findByIngredients';
			var params = {fillingredients:fillingredients, ingredients:ingredients, 
				limitLicense:limitLicense, number:number, ranking:ranking};
			return $http.get(url, {params:params, headers:header})
			.then(function(response){
				return response.data;
			})
			.catch(function(data, status){
				error[status] = data;
				$state.go('app.result', { 'resultList' : [] } );
				return error;
			});

		},
		//return id's detailed steps of recipe
		get_recipe_detail : function(id){
			var url = api_url + id + '/analyzedInstructions';
			var params = {stepsBreakdown:true};
			return $http.get(url, {params:params, headers:header})
			.then(function(response){
				return response.data;
			})
			.catch(function(data, status){
				error[status] = data;
				return error;
			});

		},
		//return list of recipes with their ids when searched without ingredients
		search_recipes : function(cuisine, diet, excludeingredients, instructionRequired, intolerances, limitLicense=false, number, offset=0, query, type){
			var url = api_url + 'search'
			var params = {cuisine:cuisine, diet:diet, excludeingredients:excludeingredients, instructionRequired:instructionRequired, 
				intolerances:intolerances, limitLicense:limitLicense, number:number, offset:offset, query:query, type:type};
			return $http.get(url, {params:params, headers:header})
			.then(function(response){
				return response.data.results;
			})
			.catch(function(data){
				error[status] = data;
				return error;
			})

		}

		
	}
});