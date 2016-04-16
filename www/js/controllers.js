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

  .controller('MapCtrl', function($scope, $state) {
    var heatMapData = [
      {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
      new google.maps.LatLng(37.782, -122.445),
      {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
      {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
      {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
      new google.maps.LatLng(37.782, -122.437),
      {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},

      {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
      {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
      new google.maps.LatLng(37.785, -122.443),
      {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
      new google.maps.LatLng(37.785, -122.439),
      {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
      {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
    ];

    var sanFrancisco = new google.maps.LatLng(42.644739, 18.105468);

    var map = new google.maps.Map(document.getElementById('map'), {
      center: sanFrancisco,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatMapData
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
