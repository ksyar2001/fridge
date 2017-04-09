
angular.module( 'starter.services' )
	.service( 'dummyDBManager', function( $ionicPlatform, $rootScope ) {

		var _DB, _listInFridge, _listOfFavorite;

		this.init = function( DB, listInFridge, listOfFavorite ) {
			_DB = DB;
			_listInFridge = listInFridge;
			_listOfFavorite = listOfFavorite;

			// DB.executeStatement('CREATE TABLE IF NOT EXISTS FRIDGE (name unique, quantity)');
			// DB.executeStatement('CREATE TABLE IF NOT EXISTS FAVORITES (id unique, name, dateSaved)');
			// DB.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES ("apple", 1)');
		}

		this.extract = function(callback) {
			// dummy
			var item1 = {};
  	// 		item1.name = "dummy11";
  	// 		item1.quantity = 1;
  	// 		var item2 = {};
  	// 		item2.name = "dummy22";
  	// 		item2.quantity = 2;

  	// 		_listInFridge[0] = item1;
  	// 		_listInFridge[1] = item2;

			// var item1 = {};
			// item1.id = 0;
			// item1.name = "dummy11";
			// item1.dateSaved = "02/01/2016";
			// var item2 = {};
			// item2.id = 1;
			// item2.name = "dummy22";
			// item2.dateSaved = "01/30/2017";

			// _listOfFavorite[item1.id] = item1;
			// _listOfFavorite[item2.id] = item2;
			// need actual code that extracts from DB
			_DB.executeStatement('SELECT * FROM FRIDGE', []).then(function(data){
				return new Promise(function(resolve, reject){
					setTimeout(function(){
					resolve(data);
					Debug.log(data);
				}, 1);
				})
				.then(function(data){
					setTimeout(function(){
						_listInFridge[0] = data;
						Debug.log(data);
					}, 1)
				})
			});
			


		}

		this.update = function() {
			// update DB with the 2 lists.
			// 
		}
	}
);