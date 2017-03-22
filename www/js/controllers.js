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
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.result')
  }

})





.controller('favoriteCtrl', function($scope, $ionicLoading) {
  // dummy favorite list
  $scope.listOfFavorite = {};
  var item1 = {};
  item1.name = "dummy1";
  item1.dateSaved = "02/01/2016";
  var item2 = {};
  item2.name = "dummy2";
  item2.dateSaved = "01/30/2017";

  $scope.listOfFavorite[0] = item1;
  $scope.listOfFavorite[1] = item2;



  // print for testing
  $scope.edit = function () {
    $ionicLoading.show({ template: 'editing!', noBackdrop: true, duration: 1000 });
  };
  $scope.showRecipe = function (item) {
    $ionicLoading.show({ template: 'Recipe showed!', noBackdrop: true, duration: 1000 });
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


.controller('selectedRecipeCtrl', function($scope, $state, $ionicHistory) {
  $scope.back = function () {
    // disable the automatically created back button from state.go
    // to keep the sidemenu accessible at all time
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $state.go('app.result')
  }

});
