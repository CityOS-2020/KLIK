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

  .controller('LocationDetailCtrl', function($scope, $stateParams,$firebaseObject) {
    var ref = new Firebase("https://dubrovniksb.firebaseio.com/locations/"+$stateParams.locationId);
    var obj = $firebaseObject(ref);
    $scope.location = obj;
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


.controller('AccountCtrl', function() {

});
