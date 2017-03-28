angular.module('starter.services', [])

.service( 'DB', function($ionicPlatform) {
	$ionicPlatform.ready( function() {
		return {			
			init : function() {
				var db;
				if( window.cordova && window.sqlitePlugin ) {
					db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
				}
				else {
					db = window.openDatabase( 'my.db', '1.0', 'My', 5*1024*1024 );
				}
				var helper = require( 'sql-promise-helper.js' ).newPromiseHelper( db );
				alert( "DB initialized" );
			}
			
			executeStatement : function( query, value ) {
				return helper.executeStatement( query, value );
			}
		};
	} );
} );