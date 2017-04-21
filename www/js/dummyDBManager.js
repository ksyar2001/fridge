angular.module( 'starter.services' )
	.service( 'dummyDBManager', function( $ionicPlatform, $rootScope ) {

		var _DB, _listInFridge, _listOfFavorite; 
		var initial_DB_Fridge = []; 
		var initial_DB_Favorite = [];

		this.init = function( DB, listInFridge, listOfFavorite ) {
			$ionicPlatform.ready(function(){
				_DB = DB;
				_listInFridge = listInFridge;
				_listOfFavorite = listOfFavorite;

			_DB.executeStatement('CREATE TABLE IF NOT EXISTS FRIDGE (name unique, quantity)');
			_DB.executeStatement('CREATE TABLE IF NOT EXISTS FAVORITES (recipe_id unique, name, dateSaved DATETIME)');
			// DB.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES ("apple", 1)');
			// DB.executeStatement('INSERT INTO FRIDGE (name, quantity) VALUES ("pear", 1)');
			// _DB.executeStatement('INSERT INTO FAVORITES (recipe_id, name, dateSaved) VALUES (?,?,?)', ["1", "Sushi", new Date()]);
			// _DB.executeStatement('UPDATE FRIDGE SET quantity=? WHERE name = "apple"', ['45']);
			});
		}

		this.extract = function() {
			// need actual code that extracts from DB
			_DB.executeStatement('SELECT * FROM FRIDGE', []).then(function(data){
				for (var i=0; i<data.rows.length; i++){
					_listInFridge[i] = data.rows[i];
					initial_DB_Fridge[i] = data.rows[i];
				}
			});
			_DB.executeStatement('SELECT * FROM FAVORITES', []).then(function(data){
				for (var i=0; i<data.rows.length; i++){
					_listOfFavorite[i] = data.rows[i];
					initial_DB_Favorite[i] = data.rows[i];
				}
			});
		}

		this.update = function() {
			var batch = _DB.newBatchTransaction();
			var objects_tobe_updated = [];
			var objects_tobe_deleted = [];
			var objects_tobe_added = [];

			//for deleting and updating items
			for (var i=0; i<initial_DB_Fridge.length; i++){
				if (containsObject(initial_DB_Fridge[i], _listInFridge)){
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
				if (!containsObject(_listInFridge[i], initial_DB_Fridge)){
					objects_tobe_added.push(_listInFridge[i]);
				}
			}

			//for deleting in DB
			for (var i=0; i<objects_tobe_deleted.length; i++){
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

			//commit changes to the DB
			batch.commit().then(function(){
				return _DB.executeStatement('SELECT * FROM FRIDGE', null);
			})
			.then(function(result){
				Debug.log(result);
			})
		}

		//Helper Function
		function containsObject(obj, list) {
			var i;
			for (i = 0; i < list.length; i++) {
				if (list[i].name == obj.name) {
					return true;
				}
			}
			return false;
		}

	}
);