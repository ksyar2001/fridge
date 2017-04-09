angular.module('starter.controllers', [])



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

.controller('appCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('fridgeCtrl', function($scope, $rootScope) {
  $scope.listInFridge = $rootScope.listInFridge;
  console.log($rootScope.listInFridge[0]);
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





.controller('favoriteCtrl', function($rootScope, $scope, $ionicLoading, $state) {
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




  $scope.clickOnList = function (item) {
    // regular mode. clicking on it will lead to its recipe.
    if (mode == 0) {
      $state.go('app.favoriteRecipe' , {
        'itemId' : item.name
      })

    }

    // edit mode  clicking on a item will delete that item from the list.
    if (mode == 1) {
      delete $rootScope.listOfFavorite[item.id];

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
    delete $rootScope.listOfFavorite[$stateParams.itemId];

    $state.go('app.favorite');
  }
})


.controller('resultCtrl', function($scope, $state, $ionicHistory) {
 
  $scope.select = function () {
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.selectedRecipe')
  }

})


.controller('selectedRecipeCtrl', function($scope, $rootScope, $state, $ionicHistory) {



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
    var itemSaved = {};
    var time = new Date();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var y = time.getFullYear();

    // save a dummy for testing
    itemSaved.dateSaved = "" + m + "/" + d + "/" + y;
    itemSaved.name = "addeddummy";
    $rootScope.listOfFavorite[itemSaved.id] = itemSaved;

    console.log("item saved");
  }
});
