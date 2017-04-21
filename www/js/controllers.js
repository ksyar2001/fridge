angular.module('starter.controllers', ['ionic'])



// initial controllers that need to be edited or deleted.


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

.controller('fridgeCtrl', function($scope, $http, $rootScope, $ionicLoading) {
  $ionicLoading.show(
    {
      template: '<p class="item-icon-left">Initializing Fridge<ion-spinner icon="lines"/></p>'
    }
  );

  while( $rootScope.isFridgeReady == false ) {
    console.log( "waiting" );
  }

  $ionicLoading.hide();

// form of listInFridge would be similar to
  var data = [
    {
    "name": "Onion",
    "lastname": "half-sliced",
    "img": "http://lorempixel.com/400/200/",
    "description": "What can I do with this onion?\r\n"
    },
    {
      "name": "Baby Carrot",
      "lastname": "A lot",
      "img": "http://lorempixel.com/400/200/",
      "description": "What can I do with this baby carrot?\r\n"
    },
    {
      "name": "Pizza",
      "lastname": "A slice",
      "img": "http://lorempixel.com/400/200/",
      "description": "What can I do with this pizza?\r\n"
    }
  ]

  var compareFunc = function( a, b ) {
    return a.name.localeCompare( b.name, 'en', { 'sensitivity': 'base' } ); 
  };
  

  data.sort( compareFunc );
  $scope.artists = data;
  $scope.moveItem = function(item, fromIndex, toIndex) {
  $scope.artists.splice(fromIndex,1);
  $scope.artists.splice(toIndex,0,item);

  $scope.onAdd = function( name, amount, description ) {
    data.push( { "name":name, "lastname":amount, "description":description } );
    data.sort( compareFunc );
  };

  $scope.onDelete = function( index ) {
    data.splice( index, 1 );
  } 
};

})

.controller('recipeCtrl', function($scope, $rootScope, $state, $ionicHistory, APIService) {

  $scope.search = function () {
    console.log("search");

    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });


    //way to use the selected options
    var x = document.getElementById("cuisine");
    console.log("this is the thing :" + x.options[x.selectedIndex].text);

    // $state.go is in this method
    APIService.search_recipes($scope.cuisine,"", "", false, "", false, 5, 0, "", $scope.type)
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





.controller('favoriteCtrl', function($rootScope, $scope, $ionicLoading, $state, $ionicHistory, APIService ) {

  $ionicLoading.show(
    {
      template: '<p class="item-icon-left">Initializing Favorite<ion-spinner icon="lines"/></p>'
    }
  );

  while( $rootScope.isFavReady == false ) {
    console.log( "waiting" );
  }

  $ionicLoading.hide();

  // initial constants
  $scope.button = "edit";
  $scope.style = "color:black; background-color:Beige";
  var mode = 0;

  // edit button is switched between edit or done every time its clicked. it changes the appearence of the list
  $scope.edit = function () {

    switch(mode){
      // regular mode   --> switch to edit mode.
      case 0:
        mode = 1;
        $scope.style = "color:white; background-color:DimGray";
        $scope.button = "done";
        console.log("reg to edit mode");
        break;

        // edit mode  --> switch to regular mode.
      case 1:
        mode = 0;
        $scope.style = "color:black; background-color:Beige";
        $scope.button = "edit";
        console.log("edit to reg mode");
        break;

      default:
        $scope.style = "color:black; background-color:Beige";

    }
  };

  $scope.clickOnList = function ( index ) {
    // regular mode. clicking on it will lead to its recipe.
    if (mode == 0) {
      $rootScope.selectedRecipe = $rootScope.listOfFavorite[ index ];
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      APIService.get_recipe_detail( $rootScope.selectedRecipe.id )
      .then( function( result ) {
        console.log( result );
        $rootScope.recipeDetails = result;
        $state.go('app.favoriteRecipe')
      });
    }

    // edit mode  clicking on a item will delete that item from the list.
    if (mode == 1) {
      delete $rootScope.listOfFavorite[item.id.toString()];

    }
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

    $state.go('app.favorite');
  }
})


.controller('resultCtrl', function( $rootScope, $scope, $state, $ionicHistory, APIService) {

  $scope.select = function ( index ) {
    $rootScope.selectedRecipe = $rootScope.resultList[ index ];
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    APIService.get_recipe_detail( $rootScope.selectedRecipe.id )
    .then( function( result ) {
      console.log( result );
      $rootScope.recipeDetails = result;
      $state.go('app.selectedRecipe')
    });
  }


  // rootScope.resultList
  // the recipe in it contains
  // hashKey : object:40
  // id: 755321
  // image: url?
  // readgyInMinutes: 35
  // title: korean noodles
})


.controller('selectedRecipeCtrl', function($scope, $rootScope, $state, $ionicHistory) {



  var imgURL = "http://spoonacular.com/recipeImages/" + $rootScope.selectedRecipe.id + "-312x150.jpg";
  //var imgURL = "http://lorempixel.com/400/200/";
  //var imgURL = "https://spoonacular.com/recipeImages/579247-556x370.jpg";
  console.log( imgURL );
  
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

    itemSaved.dateSaved = "" + m + "/" + d + "/" + y;
    $rootScope.listOfFavorite[itemSaved.id] = itemSaved;

    alert( "Saved" );
    console.log( itemSaved );
    console.log( $rootScope.listOfFavorite );
  }
});
