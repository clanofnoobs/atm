angular.module('atm', [])
.controller('ctrl', [
'$scope',
function($scope){
  $scope.photos = [
{ title: "hi", upvotes: 12 },
{ title: "hisdf", upvotes: 1 },
{ title: "hiss", upvotes: 2 },
{ title: "hi", upvotes: 3 },
{ title: "hi", upvotes: 4 },
];

  $scope.addPhoto = function(){
    $scope.photos.push({title: $scope.title, upvotes: 0});
  };
}]);
