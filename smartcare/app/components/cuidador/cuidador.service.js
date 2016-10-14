(function() {
  'use strict';

  angular.module('smartcare.cuidadores')
    .factory('CuidadoresService', CuidadoresService);

  CuidadoresService.$inject = ['$http', '$q', 'API_URL'];

  function CuidadoresService($http, $q, API_URL) {
    var service = {};
    service.inserir = inserir;

    return service;

    function inserir(cuidador) {
      return $http.post(API_URL + '/api/usuario', { usuario: cuidador });
    }
  }
})();