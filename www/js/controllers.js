angular.module('starter.controllers', ['ionic'])



//initial controllers that need to be edited or deleted.


.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
  $rootScope.extras = false;  // For hiding the side bar and nav icon


})


.controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
  $state,fireBaseData,$ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function (formName, cred) {


    }
  })

.controller('menuCtrl', function($scope, $ionicModal, $timeout) {

})
// .controller('fridgeCtrl', function($scope, $http, $rootScope, $ionicLoading, $ionicModal, dummyDBManager) {
//
//   if( !$rootScope.isFridgeReady && $rootScope.isFridgeReady != false ) {
//     $state.go( 'app' );
//   }
// })

.controller('modalCtrl', function($scope, $state, $rootScope, dummyDBManager, APIController,Productjson,Classifiedproduct,Productjsonarray,FindByIngredientsModel) {

  $scope.input = {}

  //$scope.name = "";
  //$scope.description = "";

  var compareFunc = function( a, b ) {
    try {
      return a.name.localeCompare( b.name, 'en', { 'sensitivity': 'base' } );
    }
    catch( err ) {
      return -1;
    }
  };

  $scope.toFridge = function () {
    $scope.amount = $scope.amount || 1;
    var productJson = new Productjson( { "title": $scope.input.name } );
    var result = APIController.createClassifyAGroceryProduct( productJson );
    //Function call returns a promise
    result.then(function(success){

			//success case
			//getting context of response
			console.log(success.getContext());

      try {

      var answer = success.getContext().response.body;

      var object = $rootScope.listInFridge.find( a => a.name == answer.category );
      console.log( object );
      if( object ) {
        object.quantity++;
      }
      else {
        $rootScope.listInFridge.push( { "name":answer.category, "quantity":$scope.amount, "description":$scope.input.description, "image":answer.image } );
        $rootScope.listInFridge.sort( compareFunc );
      }
      dummyDBManager.update();
      console.log( $rootScope.listInFridge );

}
    catch( err ) {
      alert( "ERROR" );
    }

    $state.go('app.fridge');

		},function(err){
			//failure case
      alert( "ERROR : " + err.getContext() );
      $state.go('app.fridge');
		});
    //$scope.name = $scope.name || "test";

    //$scope.description = $scope.description || "test case";
  }
})

//.controller('fridgeCtrl',  function($scope, $http, $rootScope, $ionicLoading, $ionicModal, dummyDBManager) {
.controller('fridgeCtrl', function($scope, $http, $state,$ionicLoading, $http, $rootScope, APIService, $ionicModal, dummyDBManager) {

   //TODO: tmp commented because of a typeError

  //  if( !$rootScope.isFridgeReady && $rootScope.isFridgeReady != false ) {
  //    $state.go( 'app' );
  //  }
   //
   //
  //   $ionicLoading.show(
  //     {
  //       template: '<p class="item-icon-left">Initializing Fridge<ion-spinner icon="lines"/></p>'
  //     }
  //   );
  // while( $rootScope.isFridgeReady == false ) {
  //   console.log( "waiting" );
  // }
  //
  // $ionicLoading.hide();


// form of listInFridge would be similar to

// var data = [
//   {
//   "name": "Onion",
//   "quantity": "half-sliced",
//   "img": "http://lorempixel.com/400/200/",
//   "description": "What can I do with this onion?\r\n"
//   },
//   {
//     "name": "Baby Carrot",
//     "quantity": "A lot",
//     "img": "http://lorempixel.com/400/200/",
//     "description": "What can I do with this baby carrot?\r\n"
//   },
//   {
//     "name": "Pizza",
//     "quantity": "A slice",
//     "img": "http://lorempixel.com/400/200/",
//     "description": "What can I do with this pizza?\r\n"
//   }
// ]

var compareFunc = function( a, b ) {
  return a.name.localeCompare( b.name, 'en', { 'sensitivity': 'base' } );
};



  //TODO: tmp commented because of a typeError
  //console.log( $rootScope.listInFridge );


  //data.sort( compareFunc );
  //$scope.fridgeList = data;
  //$scope.moveItem = function(item, fromIndex, toIndex) {
  //$scope.artists.splice(fromIndex,1);
  //$scope.artists.splice(toIndex,0,item);

  $scope.clear_db = function(){
    console.log("Clearing DB");
    dummyDBManager.clean_table();
  }

  $rootScope.onDeleteSome = function( index, number ) {
    console.log( "delete some index is " + index );

    // default for testing
    index = ( index == 0 || index ) ? index : ( $rootScope.listInFridge.length - 1 );
    number = number || 1;

    var target = $rootScope.listInFridge[ index ];

    if( target.quantity - number > 0 ) {
      target.quantity -= number;
    }
    else {
      if( $rootScope.listInFridge.length > 1 ) {
        $rootScope.listInFridge.splice( index, 1 );
      }
      else {
        $rootScope.listInFridge.length = 0;
      }
    }
    dummyDBManager.update();
  }

  $scope.onDeleteAll = function( index ) {

    console.log( "delete all index is " + index );

    // default for testing
    index = ( index == 0 || index ) ? index : ( $rootScope.listInFridge.length - 1 );

    if( $rootScope.listInFridge.length > 1 ) {
      $rootScope.listInFridge.splice( index, 1 );
    }
    else {
      $rootScope.listInFridge.length = 0;
    }
    dummyDBManager.update();
  }


  $scope.onSearchRecipe = function( ) {
	if( $rootScope.listInFridge.length > 0 ) {
		var ingredients = $rootScope.listInFridge[ 0 ].name;
		for( var i = 1; i < $rootScope.listInFridge.length; ++i ) {
			ingredients += "," + $rootScope.listInFridge[ i ].name;
		}

		//get_recipes_with_ingredients : function(fillingredients, ingredients, limitLicense=false, number, ranking){
		APIService.get_recipes_with_ingredients( true, ingredients, false, 5, 2 )
		.then( function( result ) {
			console.log(result);
			$rootScope.resultList = result;
			$state.go('app.result' );
		} );

	 }
 }
  //var template='<ion-modal-view><ion-header-bar><h1 class="title">title</h1></ion-header-bar><ion-content>content</ion-content></ion-modal-view>';

  // $scope.modal2 = $ionicModal.fromTemplate('<div class="modal"><header class="bar bar-header bar-positive"> <h1 class="title">I\'m A Modal</h1><div class="button button-clear" ng-click="modal2.hide()"><span class="icon ion-close"></span></div></header><content has-header="true" padding="true"><p>This is a modal</p></content></div>', {
  //     scope: $scope,
  //
  //     animation: 'slide-left-right'
  //   });



  // $scope.modalShow = function() {
  //   $ionicModal.fromTemplate('
  //   <ion-modal-view><ion-header-bar class="bar-positive"><h1 class="title">Modal form</h1></ion-header-bar><ion-content class="padding"><p style="text-align: center;">Please use shift + tab a few times and notice you\'ll be able to access the form below the modal.</p><form role="form"><ion-list><label class="item item-input" ion-item><input type="text" placeholder="Modal value" /></label></ion-list></form></ion-content></ion-modal-view>').show();
  // };

  // $ionicModal.fromTemplateUrl('templates/fridge.html', {
  //   scope: $scope
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // $scope.createContact = function(u) {
  //   //$scope.contacts.push({ name: u.firstName + ' ' + u.lastName });
  //   $scope.modal.hide();
  // };
  $scope.toModal = function () {
    $state.go('app.modal');
  };

  $scope.moveItem = function(item, fromIndex, toIndex) {
    $rootScope.listInFridge.splice(fromIndex, 1);
    $rootScope.listInFridge.splice(toIndex, 0, item);
  };

})




.controller('recipeCtrl', function($scope, $rootScope, $state, $ionicHistory, APIService) {

  $scope.selecionado = 'Appetizer';

  $scope.selecionar = function(sel) {
    $scope.selecionado = sel;
  }


  $scope.opcoes = [
    {
      id: 'Appetizer',
      desc: 'Appetizer'
    },
    {
      id: 'Breakfast',
      desc: 'Breakfast'
    },
    {
      id: "Side Dish",
      desc: 'Side Dish'
    },
    {
      id: "Main Course",
      desc: 'Main Course'
    },
	{
      id: "Dessert",
      desc: 'Dessert'
    },
	{
      id: "Salad",
      desc: 'Salad'
    },
	{
      id: "Bread",
      desc: 'Bread'
    },
	{
      id: "Soup",
      desc: 'Soup'
    },
	{
      id: "Beverage",
      desc: 'Beverage'
    },
	{
      id: "Sauce",
      desc: 'Sauce'
    },
	{
      id: "Drink",
      desc: 'Drink'
    },
	
  ]

  $scope.selecionado2 = 'African';

  $scope.selecionar2 = function(sel) {
    $scope.selecionado2 = sel;
  }


  $scope.opcoes2 = [
    {
      id: 'African',
      desc: 'African'
    },
    {
      id: 'Chinese',
      desc: 'Chinese'
    },
    {
      id: "Japanese",
      desc: 'Japanese'
    },
    {
      id: "Korean",
      desc: 'Korean'
    },
	{
      id: "Vietnamese",
      desc: 'Vietnamese'
    },
	{
      id: "Thai",
      desc: 'Thai'
    },
	{
      id: "Indian",
      desc: 'Indian'
    },
	{
      id: "British",
      desc: 'British'
    },
	{
      id: "Irish",
      desc: 'Irish'
    },
	{
      id: "French",
      desc: 'French'
    },
	{
      id: "Italian",
      desc: 'Italian'
    },
	{
      id: "Mexican",
      desc: 'Mexican'
    },
	{
      id: "Spanish",
      desc: 'Spanish'
    },
	{
      id: "Middle eastern",
      desc: 'Middle eastern'
    },
	{
      id: "Jewish",
      desc: 'Jewish'
    },
	{
      id: "American",
      desc: 'American'
    },
	{
      id: "Cajun",
      desc: 'Cajun'
    },
	{
      id: "Southern",
      desc: 'Southern'
    },
	{
      id: "Greek",
      desc: 'Greek'
    },
	{
      id: "German",
      desc: 'German'
    },
	{
      id: "Nordic",
      desc: 'Nordic'
    },
	{
      id: "Eastern european",
      desc: 'Eastern european'
    },
	{
      id: "Caribbean",
      desc: 'Caribbean'
    },
	{
      id: "Latin american",
      desc: 'Latin american'
    }
  ]


  $scope.search = function () {
	  

    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
	$ionicHistory.clearCache();
	


    // $state.go is in this method

    APIService.search_recipes($scope.selecionado2,"", "", false, "", false, $scope.numSearch, 0, "", $scope.selecionado)

    .then(function(result){
      console.log(result);
      $rootScope.resultList = result;
      $state.go('app.result' );
    });

    /*
    function(cuisine, diet, excludeingredients, instructionRequired, intolerances, limitLicense=false, number, offset=0, query, type){
      */
  }
})





.controller('favoriteCtrl', function($rootScope, $scope, $ionicLoading, $state, $ionicHistory, APIService, APIController ) {
/*
  if( $rootScope.isFavReady && $rootScope.isFavReady != false) {
    $state.go( 'app' );
  }

  $ionicLoading.show(
    {
      template: '<p class="item-icon-left">Initializing Favorite<ion-spinner icon="lines"/></p>'
    }
  );

  while( $rootScope.isFavReady == false ) {
    console.log( "waiting" );
  }

  $ionicLoading.hide();
*/
  // initial constants
  $scope.button = "edit";
  $scope.style = "color:black; background-color:Beige";
  var mode = 0;

  // edit button is switched between edit or done every time its clicked. it changes the appearence of the list
 
  $scope.clickOnList = function ( id ) {
    // regular mode. clicking on it will lead to its recipe.
    console.log( $rootScope.listOfFavorite );
    
    $rootScope.selectedRecipe = $rootScope.listOfFavorite[ id ];
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    var result = APIController.getRecipeInformation( $rootScope.selectedRecipe.id );
    //Function call returns a promise
    result.then(function(success){
      //success case
      //getting context of response
      console.log(success.getContext());
      $rootScope.recipeDetail = success.getContext().response.body;
      $state.go('app.favoriteRecipe')

    },function(err){
      //failure case
    });
    // APIService.get_recipe_detail( $rootScope.selectedRecipe.id )
    // .then( function( result ) {
    //   console.log( result );
    //   $rootScope.recipeDetail = result;
    //   $state.go('app.favoriteRecipe')
    // });

    
  }

  $scope.onDelete = function(index) {
    delete $rootScope.listOfFavorite[item.id.toString()];
    dummyDBManager.update();
  }
})




.controller('favoriteRecipeCtrl', function($rootScope, $scope, $state, $stateParams, $ionicHistory) {

  // button to go back to the favorite list
  $scope.back = function () {
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.favorite')
  }



  $scope.delete = function() {
    delete $rootScope.listOfFavorite[$stateParams.itemId.toString()];

    console.log( $stateParams.itemId );
    console.log( $rootScope.listOfFavorite );

    dummyDBManager.update();

    $state.go('app.favorite');
  }
})


.controller('resultCtrl', function( $rootScope, $scope, $state, $ionicHistory, APIService, APIController) {

  $scope.select = function ( index ) {
    $rootScope.selectedRecipe = $rootScope.resultList[ index ];
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    // APIService.get_recipe_detail( $rootScope.selectedRecipe.id )
    // .then( function( result ) {
    //   console.log( result );
    //   $rootScope.recipeDetail = result;
    //   $state.go('app.selectedRecipe')
    // });
    var result = APIController.getRecipeInformation( $rootScope.selectedRecipe.id );
      //Function call returns a promise
      result.then(function(success){
        //success case
        //getting context of response
        console.log(success.getContext());
        $rootScope.recipeDetail = success.getContext().response.body;
        $state.go('app.selectedRecipe')

      },function(err){
        //failure case
      });
  }


  // rootScope.resultList
  // the recipe in it contains
  // hashKey : object:40
  // id: 755321
  // image: url?
  // readyInMinutes: 35
  // title: korean noodles
})


.controller('selectedRecipeCtrl', function($scope, $rootScope, $state, $ionicHistory, dummyDBManager, APIController, Productjsonarray) {

  $scope.img = { "url": null }

  $scope.img.url = "http://spoonacular.com/recipeImages/" + $rootScope.selectedRecipe.id + "-312x150.jpg";
  //var imgURL = "http://lorempixel.com/400/200/";
  //var imgURL = "https://spoonacular.com/recipeImages/579247-556x370.jpg";
  console.log( $scope.img.url );

  // the user decided to cook the recipe
  // the goal of this function is to remove the correct amount of ingredients from the fridge
  $scope.cook = function() {
    var usedArray = $rootScope.recipeDetail.extendedIngredients;


    var productJsonArray = [];
    for( var i = 0; i < usedArray.length; ++i ) {
      productJsonArray.push( { "title":usedArray[i].name } );
    }
    productJsonArray = productJsonArray.map( function( elem ) { return new Productjsonarray( elem ) } );


    var result = APIController.createClassifyGroceryProductsBatch( productJsonArray );
    //Function call returns a promise
    result.then(function(success){
			//success case
			//getting context of response
			console.log(success.getContext());

      var answerArray = success.getContext().response.body;

      if( answerArray.length != usedArray.length ) {
        alert( "LENGTH DIFFERENT" );
      }

      console.log( $rootScope.listInFridge );
      console.log( answerArray );
      console.log( usedArray );

      for( var i = 0; i < answerArray.length; ++i ) {
        var object = $rootScope.listInFridge.find( a => a.name == answerArray[i].category );
        if( object ) {
          var index = $rootScope.listInFridge.indexOf( object );
          $rootScope.onDeleteSome( index, usedArray[ i ].amount );
        }
        else {
          // skip for now
          // apply ingredient substitute?
        }
      }
      console.log( $rootScope.listInFridge );

		},function(err){
			//failure case
      console.log( err.getContext() );
		});
  }

  // button to go back to previous result of search
  $scope.back = function () {
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.result')
  }



  // save the current recipe to the favorite list
  // saves the date saved
  $scope.save = function() {
    var itemSaved = $rootScope.selectedRecipe;

    if( $rootScope.listOfFavorite.hasOwnProperty ( itemSaved.id ) ) {
      alert( "Already added" );
      return;
    }

    var time = new Date();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var y = time.getFullYear();

    //itemSaved.dateSaved = "" + m + "/" + d + "/" + y;
    itemSaved.dateSaved = time;
    $rootScope.listOfFavorite[itemSaved.id] = itemSaved;

    alert( "Saved" );
    // console.log( itemSaved );
    // console.log( $rootScope.listOfFavorite );

    dummyDBManager.update();
  }
});
