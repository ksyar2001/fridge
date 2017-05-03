angular.module( 'starter.services' )
	.service( 'dummyDBManager', function( $ionicPlatform, $rootScope ) {

		var _DB, _listInFridge, _listOfFavorite; 
		var initial_DB_Fridge = []; 
		var initial_DB_Favorite = [];

		this.init = function( DB, listInFridge, listOfFavorite ) {

			$rootScope.isFridgeReady = false;
			$rootScope.isFavReady  = false;

			$ionicPlatform.ready(function(){
				_DB = DB;
				_listInFridge = listInFridge;
				_listOfFavorite = listOfFavorite;

				// _DB.executeStatement('DROP TABLE FRIDGE');
			 // 	_DB.executeStatement('DROP TABLE FAVORITES');

				_DB.executeStatement('CREATE TABLE IF NOT EXISTS FRIDGE (name TEXT unique, quantity INTEGER)');
				_DB.executeStatement('CREATE TABLE IF NOT EXISTS FAVORITES (id INTEGER unique, title TEXT, dateSaved DATETIME)');
			 	//DB.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES ("apple", 1)');
			 	//DB.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES ("pear", 1)');
			 	//_DB.executeStatement('INSERT INTO FAVORITES (id, title, dateSaved) VALUES (?,?,?)', ["1", "Sushi", new Date()]);
			 	//_DB.executeStatement('UPDATE FRIDGE SET quantity=? WHERE name = "apple"', ['45']);
			});
		}

		this.extract = function() {
			// need actual code that extracts from DB
			_DB.executeStatement('SELECT * FROM FRIDGE', []).then(function(data){
				for (var i=0; i<data.rows.length; i++){
					_listInFridge[i] = data.rows[i];
					initial_DB_Fridge[i] = data.rows[i];
				}
				// console.log(_listInFridge);
				$rootScope.isFridgeReady = true;
			});
			_DB.executeStatement('SELECT * FROM FAVORITES', []).then(function(data){
				for (var i=0; i<data.rows.length; i++){
					_listOfFavorite[data.rows[i].id] = data.rows[i];
					initial_DB_Favorite[i] = data.rows[i];
				}
				// console.log(_listOfFavorite);
				$rootScope.isFavReady = true;
			});
		}

		this.clean_table = function(){
			_DB.executeStatement('DROP TABLE FRIDGE');
			_DB.executeStatement('DROP TABLE FAVORITES');
		}

		this.update = function() {
			var batch = _DB.newBatchTransaction();
			var objects_tobe_updated = [];
			var objects_tobe_deleted = [];
			var objects_tobe_added = [];
			var favorites_tobe_added = [];
			var favorites_tobe_deleted = [];
			//for deleting and updating items
			console.log("INITIAL DB");
			console.log(initial_DB_Fridge);
			for (var i=0; i<initial_DB_Fridge.length; i++){
				if (containsObject(initial_DB_Fridge[i], _listInFridge) == true){
					//itmes for update
					if (initial_DB_Fridge[i].quantity != _listInFridge[i].quantity){
						objects_tobe_updated.push(_listInFridge[i]);
					}
				}
				else {
					objects_tobe_deleted.push(initial_DB_Fridge[i]);
				}
			}

			for (var i=0; i<_listInFridge.length; i++){
				if (containsObject(_listInFridge[i], initial_DB_Fridge) == false){
					objects_tobe_added.push(_listInFridge[i]);
				}
			}
			console.log("===DB Fridge===")
			console.log(_listInFridge);
			console.log("===TOBE_DELETED===");
			console.log(objects_tobe_deleted);
			console.log("===TOBE_ADDED===");
			console.log(objects_tobe_added);

			//for deleting in DB
			for (var i=0; i<objects_tobe_deleted.length; i++){
				console.log( "tobe deleted = " + objects_tobe_deleted[i].name );
				batch.executeStatement('DELETE from FRIDGE WHERE name=?', [objects_tobe_deleted[i].name,]);
			}
			//for adding in DB
			for (var i=0; i<objects_tobe_added.length; i++){
				batch.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES (?,?)', [objects_tobe_added[i].name, objects_tobe_added[i].quantity]);
			}
			//for updating in DB
			for (var i=0; i<objects_tobe_updated.length; i++){
				batch.executeStatement('UPDATE FRIDGE SET quantity=? WHERE name=?', [objects_tobe_updated[i].quantity, objects_tobe_updated[i].name]);
			}

			var listofFavorite = [];

			listofFavorite = dicttoArray(_listOfFavorite);

			// console.log(listofFavorite);
			// console.log(initial_DB_Favorite);

			for (var i=0; i<initial_DB_Favorite.length; i++){
				if (containsObject(initial_DB_Favorite[i], listofFavorite, true) == false){
					favorites_tobe_deleted.push(initial_DB_Favorite[i]);
				}
			}

			for (var i=0; i<listofFavorite.length; i++){
				if (containsObject(listofFavorite[i], initial_DB_Favorite, true) == false){
					favorites_tobe_added.push(listofFavorite[i]);
				}
			}

			for (var i=0; i<favorites_tobe_deleted.length; i++){
				batch.executeStatement('DELETE from FAVORITES WHERE id=?', [favorites_tobe_deleted[i].id]);
			}

			for (var i=0; i<favorites_tobe_added.length; i++){
				batch.executeStatement('INSERT INTO FAVORITES (id, title, dateSaved) VALUES (?,?,?)', [favorites_tobe_added[i].id, favorites_tobe_added[i].title, new Date()]);
			}

			//commit changes to the DB
			batch.commit().then(function(){
				initial_DB_Fridge = _listInFridge.slice(0);
				initial_DB_Favorite = listofFavorite;
				return _DB.executeStatement('SELECT * FROM FAVORITES', null);
			})
			.then(function(result){
				console.log(result);
			})
		}

		//Helper Function
		function containsObject(obj, list, id=false) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (id == false){
					if (list[i].name == obj.name) {
						return true;
					}
				}
				else {
					if (list[i].id == obj.id) {
						return true;
					}
				}
			}
			return false;
		}

		function dicttoArray(dict){
			var return_array = [];
			for (var key in dict){
				return_array.push(dict[key]);
			}
			return return_array;
		}

	}
);