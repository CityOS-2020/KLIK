angular.module('starter.services', ['ionic', 'firebase','starter.controllers', 'starter.services'])

  .factory("Register",function($firebaseAuth)
  {
    return{
      register: function(mail,pwd)
      {
        var fb = new Firebase("https://dubrovniksb.firebaseio.com/");
        return $firebaseAuth(fb).$createUser({ email: mail, password: pwd });
      }
    }

  }
  )

  .factory("Login",function($firebaseAuth,$window)
    {


      function setPersistentUserAuthentication(strEmail, strProvider, uid, utcExpires)
      {
        $window.sessionStorage.setItem (
          'USER_AUTH_CRED',
          JSON.stringify({ email: strEmail, provider: strProvider, uid: uid, timeout: utcExpires * 10000000000 })
        );
      }

      return{
        login: function(mail,pwd)
        {
          var firebaseRef = new Firebase("https://dubrovniksb.firebaseio.com/");
          return $firebaseAuth(firebaseRef).$authWithPassword({ email: mail, password: pwd })
            .then(
              function(authUser)
              {
                // On successful authentication set the users authentication credentials and a timeout to the
                // session storage

                setPersistentUserAuthentication(authUser.email, authUser.provider, authUser.uid, authUser.expires);

                return authUser;
              }
            )
            .catch(
              function(errorAuth)
              {
                $window.alert(errorAuth);
              }
            );
        }
      }

    }
  )

  .factory("Locations", function($firebaseArray) {
    var itemsRef = new Firebase("https://dubrovniksb.firebaseio.com/locations");

    return {
      all: function() {
        return $firebaseArray(itemsRef);
      }
    };

  })

  .factory("Chat", function($firebaseArray) {
    var itemsRef = new Firebase("https://dubrovniksb.firebaseio.com/locations/KFThZ8SV4sYv7IYQ3Pf/chat");
    itemsRef.endAt().limitToLast(1);
    console.log(itemsRef);


    return {
      all: function() {
        return $firebaseArray(itemsRef.endAt().limitToLast(20));
      }
    };

  })

  .factory("Map", function($firebaseArray) {
    var fb = new Firebase("https://dubrovniksb.firebaseio.com/");
    var itemsRef = new Firebase("https://dubrovniksb.firebaseio.com/location");
    return $firebaseArray(itemsRef);
  })

  .factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

  .filter('range', function() {
    return function(val, range) {
      range = parseInt(range);
      for (var i=0; i<range; i++)
        val.push(i);
      return val;
    };
  });
