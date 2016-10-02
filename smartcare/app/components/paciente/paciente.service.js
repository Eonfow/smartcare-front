(function() {
  'use strict';

  angular.module('smartcare.pacientes')
    .factory('PacientesService', PacientesService);

  PacientesService.$inject = ['$http', '$q', 'API_URL'];

  function PacientesService($http, $q, API_URL) {
    var service = {};
    service.inserir = inserir;
    service.listar = listar;
    service.desassociarCuidador = desassociarCuidador;
    service.consultarDadosArduino = consultarDadosArduino;

    return service;

    function inserir(paciente) {
      return $http.post(API_URL + '/api/usuario', { usuario: paciente });
    }

    function listar() {
      return $http.get(API_URL + '/api/usuario');
    }

    function desassociarCuidador(params) {
      return $http.post(API_URL + '/api/desassociar/' + params.idPaciente + '/' + params.idCuidador, { token: 'DAOSIFJASIOF', abc: '123' });
    }

    function consultarDadosArduino(params) {
      return $http.get(API_URL + '/api/arduino/' + params.idArduino);
    }
  }
})();