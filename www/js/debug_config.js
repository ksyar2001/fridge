//angular.module( 'starter.services')
//.service( 'Debug', function() {
//	this.alert( txt ) {
//		setTimeOut( function() { alert( txt ); }, 1 );
//	}
//} );
var Debug = {};
Debug.alert = function( txt ) {
	setTimeout( function() { 
		window.alert( txt );
	}, 1 );
};
Debug.log = function( txt ) {
	console.log( txt );
}
