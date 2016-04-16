angular.module('starter.controllers', [])

  .controller('SignInCtrl', function($scope, $state, Login) {
    $scope.signin = {
      username:"",
      password:""
    };

    $scope.signIn = function() {

      Login.login($scope.signin.username,$scope.signin.password)
        .then(
          function(auth)
          {
           return auth;
          }
        )
        .then(
          function(auth)
          {
            if(auth)
            {
              $state.go('tab.dash');
            }
          }
        );

    };

  })
  .controller('RegisterCtrl', function($scope, $state, Register) {

    $scope.register={
      username:"",
      password:""
    }

    $scope.registerHndlr = function(nextState)
    {
      console.log($scope.register);
        Register.register($scope.register.username,$scope.register.password)
          .then(
            function(user)
            {
              console.log(user);
            }
          );

    }
  })

  .controller('MapCtrl', function($scope, $state, Map) {

    function getHeatmapRadius(zoom) {

      return (zoom - 12) * 6;
    }
    $scope.locations=Map;
    console.log($scope.locations);
    var heatMapData = [
      {location: new google.maps.LatLng(42.6551039,18.07017989999997), weight: 21},
      {location: new google.maps.LatLng(42.641842,18.115410500000053), weight: 25}
    ];

    //UVALA LAPAD 42.6551039,18.07017989999997
    //BANJE BEACH 42.641842,18.115410500000053

    var positions =[{
      "lapad":{
        "lat": 42.6551039,
        "lng":18.07017989999997
      },
      "banje":{
        "lat":42.641842,
        "lng":18.115410500000053
      }
    }];


    var sanFrancisco = new google.maps.LatLng(42.644739, 18.105468);

    var map = new google.maps.Map(document.getElementById('map'), {
      center: sanFrancisco,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var marker = new google.maps.Marker({
      position: {lat: 42.6551039, lng: 18.07017989999997},
      map: map,
    });

    var infowindow = new google.maps.InfoWindow({
      content: "Temp: 21°C",
      maxWidth: 200
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });


    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData,
      disipating : true,
      radius : getHeatmapRadius(map.zoom)
    });


    heatmap.setMap(map);
  })

  .controller("HomeCtrl", function($scope, $sce,$window, Beaches) {
    $scope.init = function(stream)
    {
      $scope.url = stream.stream;
      $scope.url = $sce.trustAsResourceUrl($scope.url);
    }
    $scope.beaches = Beaches;

    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
        $scope.init(group);
      }
    };

    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

    $scope.getTotal = function(beach){
      var total = 0;
      var br=0;
      var beachRatings = beach.ratings;
      for (var rating in beachRatings) {
        total += beachRatings[rating];
        br++;
      }
      return total/br;
    }

    $scope.rate = function(rate){
      $window.alert(rate+1);
    };

})

.controller('ChatsCtrl', function($scope, Chats) {

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
  .controller('AdminCtrl', function($scope, Beaches,$window) {
    $scope.beaches = Beaches;

    $scope.master = {};

    $scope.update = function(beach) {
      if($scope.beach.name&&$scope.beach.temp&&$scope.beach.hum&&$scope.beach.stream){
        $scope.beaches.$add(beach);
        $scope.reset();
      }else{
        $window.alert("Niste upisali potrebne vrijednosti!");

      }
    };

    $scope.reset = function() {
      $scope.beach = angular.copy($scope.master);
    };

    $scope.reset();

  })


.controller('AccountCtrl', function() {

});
