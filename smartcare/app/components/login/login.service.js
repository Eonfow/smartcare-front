(function() {
  'use strict';

  angular.module('smartcare.login')
    .factory('LoginService', LoginService);

  LoginService.$inject = ['$http', '$q', 'API_URL'];

  function LoginService($http, $q, API_URL) {
    var service = {};
    service.autenticar = autenticar;

    return service;

    function autenticar(login, senha) {
      return $http.post(API_URL + '/login', { login:login, senha:senha });
    }
  }
})();