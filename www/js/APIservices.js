angular.module('starter.APIservices', [])

.factory('APIService', function($http){
	var header = {X-Mashape-Key:'', Accept:'application/json'};
	var api_url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/';
	var error = {};

	return {
		//return list of recipes with their ids when searched by ingredients
		get_recipes_with_ingredients : function(fillingredients, ingredients, limitLicense=false, number, ranking){
			var url = api_url + 'findByIngredients';
			var params = {fillingredients:fillingredients, ingredients:ingredients, 
				limitLicense:limitLicense, number:number, ranking:ranking};
			$http.get(url, {params:params, headers:header})
			.then(function(response){
				var web_response = angular.fromJson(response);
				return web_response;
				//iterate response
			})
			.catch(function(data, status){
				error[status] = data;
				return error;
			});

		},
		//return id's detailed steps of recipe
		get_recipe_detail : function(id){
			var url = api_url + id + '/analyzedInstructions';
			var params = {stepsBreakdown:true};
			$http.get(url, {params:params, headers:header})
			.then(function(response){
				var web_response = angular.fromJson(response);
				return web_response;
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
			$http.get(url, {params:params, headers:header})
			.then(function(response){
				var web_response = angular.fromJson(response);
				return web_response;
			})
			.catch(function(data){
				error[status] = data;
				return error;
			})

		}

		
	}
});