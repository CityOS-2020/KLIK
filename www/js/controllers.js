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


  .controller('MapCtrl', function($scope, $state, Locations,$timeout) {

    initMap();
    function getHeatmapRadius(zoom) {

      return (zoom - 12) * 6;
    }


  function initMap()
  {
    console.log("uso u init map");
    Locations.all().$loaded()
      .then(
        function(locations){
          var heatMapData = [];
          //console.log(locations);
          for(var i=0;i<locations.length;i++)
          {

            heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].sea_temperature});
          }
         return heatMapData;
        }
      )
      .then(
        function(heatMapData)
        {
          var dubrovnik = new google.maps.LatLng(42.644739, 18.105468);

          $scope.map = new google.maps.Map(document.getElementById('map'), {
            center: dubrovnik,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.SATELLITE
          });

          /*var marker = new google.maps.Marker({
            position: {lat: 42.6551039, lng: 18.07017989999997},
            map: map,
          });

          var infowindow = new google.maps.InfoWindow({
            content: "Temp:",
            maxWidth: 200
          });

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });*/


          var heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData,
            disipating : true,
            radius : getHeatmapRadius($scope.map.zoom)
          });


          heatmap.setMap($scope.map);
        }
      );
  }

    function initHeatMapMarkers(){
      Locations.all().$loaded()
        .then(
          function(locations){
            var heatMapData = [];
            //console.log(locations);
            for(var i=0;i<locations.length;i++)
            {

              heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].sea_temperature});
            }
            return heatMapData;
          }
        )
        .then(
          function(heatMapData)
          {
            var heatmap = new google.maps.visualization.HeatmapLayer({
              data: heatMapData,
              disipating : true,
              radius : getHeatmapRadius($scope.map.zoom)
            });


            heatmap.setMap($scope.map);
          }
        );
          }
    

    function wrapper() {
      initHeatMapMarkers();
      $timeout(wrapper, 10000);
    }

    $timeout(wrapper, 10000);


    /*var heatMapData = [
      {location: new google.maps.LatLng(42.6551039,18.07017989999997), weight: 21},
      {location: new google.maps.LatLng(42.641842,18.115410500000053), weight: 25}
    ];*/
    //console.log(heatMapData);
    //UVALA LAPAD 42.6551039,18.07017989999997
    //BANJE BEACH 42.641842,18.115410500000053





  })


  .controller("HomeCtrl", function($scope, $sce,$window, Locations) {

    $scope.init = function(stream)
    {
      $scope.url = stream.stream;
      $scope.url = $sce.trustAsResourceUrl($scope.url);
    }
    $scope.locations = Locations.all();

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

    $scope.getTotal = function(location){
      var total = 0;
      var br=0;
      var locationRatings = location.ratings;
      for (var rating in locationRatings) {
        total += locationRatings[rating];
        br++;
      }
      return total/br;
    }

    $scope.rate = function(rate){
      $window.alert(rate+1);
    };

  })

  .controller('AdminCtrl', function($scope, Locations,$window, $ionicModal) {
    $scope.locations = Locations.all();
    $scope.location={};
    $scope.master = {};

    $scope.update = function(location) {
      if($scope.location.name){
        $scope.locations.$add(location);
        $scope.reset();
      }else{
        $window.alert("fail");
      }
    };

    $scope.reset = function() {
      $scope.location = angular.copy($scope.master);
    };

    $ionicModal.fromTemplateUrl('new-location.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

  })

  .controller('LocationDetailCtrl', function($scope, $stateParams,$firebaseObject,$sce,Chat) {
    $scope.chat = Chat.all();
    $scope.master = {};

    $scope.init = function(stream)
    {
      $scope.url = stream;
      $scope.url = $sce.trustAsResourceUrl($scope.url);
    };

    var ref = new Firebase("https://dubrovniksb.firebaseio.com/locations/"+$stateParams.locationId);
    var obj = $firebaseObject(ref);
    $scope.location = obj;

    $scope.update = function(msg) {
      if(msg.username!="") {
        $scope.chat.$add(msg);
      }
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


.controller('AccountCtrl', function() {

});
