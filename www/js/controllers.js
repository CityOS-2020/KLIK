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
