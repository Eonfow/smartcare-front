(function() {
  'use strict';

  angular.module('smartcare.principal')
    .factory('PrincipalService', PrincipalService);

  PrincipalService.$inject = ['$http', '$q', 'API_URL'];

  function PrincipalService($http, $q, API_URL) {
    var service = {};
    service.consultarDadosDashboard = consultarDadosDashboard;

    return service;

    function consultarDadosDashboard() {
      return $http.get(API_URL + '/api/dashboard');
    }
  }
})();