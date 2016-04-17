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
              $state.go('tab.map');
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


  .controller('MapCtrl', function($scope, $state, Locations,$timeout,$ionicSideMenuDelegate) {
    var gradient1 = /*[
     'rgba(255, 0, 0, 0)',
     'rgba(255, 255, 0, 0.9)',
     'rgba(0, 255, 0, 0.7)',
     'rgba(173, 255, 47, 0.5)',
     'rgba(152, 251, 152, 0)',
     'rgba(152, 251, 152, 0)',
     'rgba(0, 0, 238, 0.5)',
     'rgba(186, 85, 211, 0.7)',
     'rgba(255, 0, 255, 0.9)',
     'rgba(255, 0, 0, 1)'];*/
      [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ];
    var gradient2 = [
      'rgba(0, 200, 255, 0)',
      'rgba(0, 200, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)'

    ];
    //za temperaturu zraka
    var  gradient3 = [
      'rgba(255, 255, 0, 0)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 225, 0, 1)',
      'rgba(255, 200, 0, 1)',
      'rgba(255, 175, 0, 1)',
      'rgba(255, 160, 0, 1)',
      'rgba(255, 145, 0, 1)',
      'rgba(255, 125, 0, 1)',
      'rgba(255, 110, 0, 1)',
      'rgba(255, 100, 0, 1)',
      'rgba(255, 75, 0, 1)',
      'rgba(255, 50, 0, 1)',
      'rgba(255, 25, 0, 1)',
      'rgba(255, 0, 0, 1)'
    ];
    $scope.type=1;
    $scope.gradient=gradient3;

    $scope.trigger = function (type)
    {
      $scope.type="";
      $scope.gradient="";
      if(type==1){
        $scope.type=type;
        $scope.gradient=gradient3;
        initHeatMapMarkers(type,gradient3);
      }else if(type==2){
        $scope.type=2;
        $scope.gradient=gradient2;
        initHeatMapMarkers(type,gradient2);
      }else if(type==3){
        $scope.type=3;
        $scope.gradient=gradient3;
        initHeatMapMarkers(type,gradient3);
      }else if(type==4){
        $scope.type=4;
        $scope.gradient=gradient2;
        initHeatMapMarkers(type,gradient2);
      }else if(type==5){
        $scope.type=5;
        $scope.gradient=gradient1;
        initHeatMapMarkers(type,gradient1);
      }else if(type==6){
        $scope.type=6;
        $scope.gradient=gradient3;
        initHeatMapMarkers(type,gradient3);
      }
    };

    $scope.toggleMenu = function ()
    {
      $ionicSideMenuDelegate.toggleLeft();
    };

    initMap();
    function getHeatmapRadius(zoom) {

      return (zoom - 12) * 10;
    }


    function initMap()
    {
      Locations.all().$loaded()
        .then(
          function(locations){
            var heatMapData = [];
            //console.log(locations);
            for(var i=0;i<locations.length;i++)
            {
              if( (typeof $scope.type !== 'undefined') && $scope.type==1)
              {
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].temperature});
              }else if($scope.type==2){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].uv});

              }else if($scope.type==3){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].sea_temperature});

              }else if($scope.type==4){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].humidity});
              }else if($scope.type==5){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].mq});
              }else if($scope.type==6){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].ppl});
              }
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
              zoom: 14,
              scrollwheel: false,
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


            $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: heatMapData,
              disipating : true,
              gradient : $scope.gradient,
              radius : getHeatmapRadius($scope.map.zoom)
            });


            $scope.heatmap.setMap($scope.map);
          }
        );
    }

    function initHeatMapMarkers(type,gradient){
      console.log("uso u init heat markers");
      $scope.heatmap.setMap(null);
      Locations.all().$loaded()
        .then(
          function(locations){
            var heatMapData = [];
            //console.log(locations);
            for(var i=0;i<locations.length;i++)
            {
              if( (typeof $scope.type !== 'undefined') && $scope.type==1)
              {
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].temperature});
              }else if($scope.type==2){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].uv});

              }else if($scope.type==3){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].sea_temperature});

              }else if($scope.type==4){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].humidity});
              }else if($scope.type==5){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].mq});
              }else if($scope.type==6){
                heatMapData.push({location: new google.maps.LatLng(locations[i].lat,locations[i].lng), weight: locations[i].ppl});
              }
            }
            return heatMapData;
          }
        )
        .then(
          function(heatMapData)
          {
            $scope.heatmap = new google.maps.visualization.HeatmapLayer({
              data: heatMapData,
              disipating : true,
              radius : getHeatmapRadius($scope.map.zoom),
              gradient : $scope.gradient
            });



            $scope.heatmap.setMap($scope.map);
          }
        );
    }


    function wrapper() {
      initHeatMapMarkers($scope.type,$scope.gradient);
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
    $scope.chat = Chat.all($stateParams.locationId);
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
