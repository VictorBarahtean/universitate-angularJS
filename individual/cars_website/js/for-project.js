
<script>
    var app = angular.module('myApp', []);
    app.controller('jsCtrl',function PostsCtrlAjax($scope, $http) {
        $http.get('data-storage/cars.json').then(function(response) {
        //$scope.phones = response.data;
        $scope.phones = {"test":"test2"};
    });});
    </script>