
// Brodybits' sql-promise-helper
// https://github.com/brodybits/sql-promise-helper
//
// reformatted into angular module form
// previously, node require form

angular.module( 'starter.services', [] )
	.service( 'DB', function( $ionicPlatform ) {
		var executeStatement, executeStatementBatch, newBatchTransaction;

		executeStatement = function(db, sql, values, onsuccess, onerror) {
			if (!!db.executeSql) {
				db.executeSql(sql, values || [], onsuccess, onerror);
			} else {
				db.transaction(function(tx) {
					tx.executeSql(sql, values, function(ignored, rs) {
						// Debug.log(rs);
						onsuccess(rs);
					}, function(ignored, error) {
						onerror(error);
					});
				});
			}
		};

		executeStatementBatch = function(db, statements, onsuccess, onerror) {
			if (!!db.sqlBatch) {
				db.sqlBatch(statements, onsuccess, onerror);
			} else {
				db.transaction(function(tx) {
					var i, len, results, st;
					results = [];
					for (i = 0, len = statements.length; i < len; i++) {
						st = statements[i];
						if (st.constructor === Array) {
							results.push(tx.executeSql(st[0], st[1]));
						} else {
							results.push(tx.executeSql(st));
						}
					}
					return results;
				}, onerror, onsuccess);
			}
		};

		newBatchTransaction = function(db) {
			var statements;
			statements = [];
			return {
				executeStatement: function(sql, values) {
					if (!statements) {
						throw new Error('Invalid state');
					}
					if (!!values) {
						statements.push([sql, values]);
					} else {
						statements.push(sql);
					}
				},
				abort: function() {
					if (!statements) {
						throw new Error('Invalid state');
					}
					statements = null;
					return Promise.resolve();
				},
				commit: function() {
					var mystatements;
					if (!statements) {
						throw new Error('Invalid state');
					}
					mystatements = statements;
					statements = null;
					return new Promise(function(resolve, reject) {
						executeStatementBatch(db, mystatements, resolve, reject);
					});
				}
			};
		};

		var myDB;

		this.init = function( db ) {
			$ionicPlatform.ready( function() {
				if( !!window.cordova && !!window.sqlitePlugin ) {
					myDB = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
					Debug.log( "cordova" );
				}
				else {
					myDB = window.openDatabase( 'his.db', '1.0', 'My', 5*1024*1024 );
					Debug.log( "websql" );
				}
				Debug.log( "DB initialized" );
			} );
		};

		this.executeStatement = function(sql, values) {
			return new Promise(function(resolve, reject) {
				return executeStatement(myDB, sql, values, resolve, reject);
			});
		}
		this.newBatchTransaction = function() {
			return newBatchTransaction(myDB);
		}
	} );

