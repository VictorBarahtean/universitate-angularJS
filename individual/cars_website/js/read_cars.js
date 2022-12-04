//var myApp = angular.module('myApp', []);
myApp.controller('jsCtrl',function PostsCtrlAjax($scope, $http) {
    $http.get('data-storage/cars.json').then(function(response) {
    $scope.cars = response.data;
});
    $scope.selectCar = '';
    $scope.priceDay = '';
    $scope.acceptBrone = true;
    $scope.brones = {"brones":[
        {
            id:0,
            name: "Victor",
            age: 25,
            age_permis: "03/12/2019",
            staj_permis: 3,
            telefon: "071232131",
            masina_id : 3
        }
    ]}
    $scope.stergeBrone = function(id){
        let modified = [];
        let id_car = "";
        angular.forEach($scope.brones.brones, function(item) {
            if(item.id != id){
                modified.push(item);
            }
            else{
                id_car = item.masina_id;
            }
        });
        $scope.brones.brones = modified;
        modified = [];
        angular.forEach($scope.cars.cars, function(item) {
            if(item.id != id_car){
                modified.push(item);
            }
            else{
                modif_item = item;
                modif_item.disponibil = true;
                modified.push(modif_item);
            }
        });
        $scope.cars.cars = modified;
    }
    $scope.getCarWithId = function(id){
        angular.forEach($scope.cars.cars, function(item) {
            if(item.id == id){
                $scope.selectCar = item;
            }
        });
    }
    $scope.calcTotalDay = function(calcAnthDate = false, dates = []) {
        let date_org_1 = "00/00/0000";
        let date_org_2 = "00/00/0000";

        if(calcAnthDate){
            date_org_1 = dates[0];
            date_org_2 = dates[1];

        }
        else{
            if($scope.chkIn != "00/00/0000" && $scope.chkOut != "00/00/0000"){
                date_org_1 = $scope.chkIn;
                date_org_2 = $scope.chkOut;
            }
            else{
                $scope.totalDays = '';
                $scope.acceptBrone = true;
            }
        }

        let date_1_split = date_org_1.split("/");
        let date_2_split = date_org_2.split("/");

        let date_1 = new Date(date_1_split[1] + "/" + date_1_split[0] + "/" + date_1_split[2]);
        let date_2 = new Date(date_2_split[1] + "/" + date_2_split[0] + "/" + date_2_split[2]);

        const days = (date_2, date_1) =>{
            let difference = date_1.getTime() - date_2.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
            return TotalDays;
        }
        

        if(calcAnthDate){
            return days(date_1, date_2);
        }
        else{

            $scope.totalDays = days(date_1, date_2);

            switch(true){
                case $scope.totalDays >= 1 && $scope.totalDays <= 2:
                    $scope.priceDay = "step1";
                    break;
                case $scope.totalDays >= 3 && $scope.totalDays <= 6:
                    $scope.priceDay = "step2";
                    break;
                case $scope.totalDays >= 7 && $scope.totalDays <= 15:
                    $scope.priceDay = "step3";
                    break;
                default:
                    $scope.priceDay = "step4";
                    break;
            }

            if($scope.totalDays > 0){
                $scope.acceptBrone = false;
            }
            else{
                $scope.acceptBrone = true;
            }
        }
    }
    $scope.chkVarsta = "";
    $scope.alertCheckPers = false;

    $scope.toBoolean = function(value){
        return Boolean(value);
    }
    $scope.checkPers = function(){
        if($scope.nameSurname != undefined && $scope.nameSurname != ""){
            if($scope.varstaPers != undefined && $scope.varstaPers >= 20){
                if($scope.permisDate != undefined && $scope.permisDate != ""){
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
                    var yyyy = today.getFullYear();

                    today =  dd + '/' + mm + '/' + yyyy;
                    totalDays = $scope.calcTotalDay(true, [$scope.permisDate, today]);

                    if(totalDays / 365 > 1){
                        if($scope.numberPhone != ""){
                            lastLength = $scope.brones.brones.length;
                            var data = {
                                id:lastLength,
                                name: $scope.nameSurname,
                                age: $scope.varstaPers,
                                age_permis: $scope.permisDate,
                                staj_permis: (totalDays / 365).toFixed(2),
                                telefon: $scope.numberPhone,
                                masina_id : $scope.selectCar.id
                            }
                            $scope.brones.brones.push(data);
                            
                            $('#myModal2').modal('hide');
                            $('#myModal3').modal('show');
                            let modifCars = {"cars":[]};
                            angular.forEach($scope.cars.cars, function(item) {
                                if(item.id == $scope.selectCar.id ){
                                    modif_item = item;
                                    modif_item.disponibil = false;
                                    modifCars.cars.push(modif_item);
                                }
                                else{
                                    modifCars.cars.push(item);
                                }
                            });

                            $scope.cars = modifCars;
                            $scope.nameSurname = "";
                            $scope.varstaPers = "";
                            $scope.permisDate = "";
                            $scope.numberPhone = "";
                            $scope.selectCar = "";
                        }
                        else{
                            $scope.chkVarsta = "Nu ati introdus numarul de telefon!";
                        }
                    }
                    else{
                        $scope.chkVarsta = "Nu aveti destula experienta!";
                    }
                }
                else{
                    $scope.chkVarsta = "Nu ati introdus data emiterii permisului!";
                }
            }
            else{
                $scope.chkVarsta = "Varsta este prea mica!";
            }
        }
        else{
            $scope.chkVarsta = "Introduceti numele!";
        }
        if($scope.chkVarsta != ""){
            $scope.alertCheckPers = true;
        }
        else{
            $scope.alertCheckPers = false;
        }
        
    }
});

myApp.filter('groupBy', function(){
    return function(list, group_by) {

    var filtered = [];
    var filtered_group = [];

    angular.forEach(list, function(item) {
        if(filtered_group.includes(item[group_by]) == false){
            filtered.push(item);
            filtered_group.push(item[group_by]);
        }
    });
    return filtered;
    };
})

myApp.filter('betweenPrice', function(){
    return function(list, priceBetw) {
    var filtered = [];

    if(isNaN(parseInt(priceBetw[0])) || isNaN(parseInt(priceBetw[1])) ){
        return list;
    }
    else{
        angular.forEach(list, function(item) {
            
            if(parseInt(item.price) >= parseInt(priceBetw[0]) && parseInt(item.price) <= parseInt(priceBetw[1])){
                filtered.push(item);
            }
        });
        return filtered;
    }
    };
})
//availableCars
myApp.filter('availableCars', function(){
    return function(list, flagCars) {
    var filtered = [];
    
    if(flagCars){
        return list;
    }
    else{
        angular.forEach(list, function(item) {
            if(item.disponibil == true){
                filtered.push(item);
            }
        });
        return filtered;
    }
    };
})

myApp.controller('ctrlTest',function PostsCtrlAjax($scope, $http) {
    $scope.isCopy = false;
})

myApp.controller('navBar', function($scope, $interval) {
    $scope.theTime = new Date().toLocaleTimeString();
    $interval(function () {
        $scope.theTime = new Date().toLocaleTimeString();
    }, 1000);
  });