angular.module('starter.controllers', [])



// initial controllers that need to be edited or deleted.



.controller('appCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('fridgeCtrl', function($scope, $stateParams) {
  // dummy list
  $scope.listInFridge = {};
  var item1 = {};
  item1.name = "dummy1";
  item1.quantity = 1;
  var item2 = {};
  item2.name = "dummy2";
  item2.quantity = 2;

  $scope.listInFridge[0] = item1;
  $scope.listInFridge[1] = item2;
})





.controller('recipeCtrl', function($scope, $state, $ionicHistory) {



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




    $state.go('app.result')
  }

})





.controller('favoriteCtrl', function($rootScope, $scope, $ionicLoading, $state) {
  // initial constants
  $scope.button = "edit";
  $scope.style = "color:black; background-color:Beige";
  var mode = 0;

  // dummy favorite list
  $rootScope.listOfFavorite = {};
  var item1 = {};
  item1.id = 0;
  item1.name = "dummy1";
  item1.dateSaved = "02/01/2016";
  var item2 = {};
  item2.id = 1;
  item2.name = "dummy2";
  item2.dateSaved = "01/30/2017";

  $rootScope.listOfFavorite[item1.name] = item1;
  $rootScope.listOfFavorite[item2.name] = item2;



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
      delete $rootScope.listOfFavorite[item.name];

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
  // dummy search result list
  $scope.resultList = {};
  var item1 = {};
  item1.name = "dummy1";
  var item2 = {};
  item2.name = "dummy2";
  $scope.resultList[0] = item1;
  $scope.resultList[1] = item2;





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
    $rootScope.listOfFavorite[itemSaved.name] = itemSaved;

    console.log("item saved");
  }
});
