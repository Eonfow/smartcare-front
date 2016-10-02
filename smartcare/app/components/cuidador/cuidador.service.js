(function() {
  'use strict';

  angular.module('smartcare.cuidadores')
    .factory('CuidadoresService', CuidadoresService);

  CuidadoresService.$inject = ['$http', '$q'];

  function CuidadoresService($http, $q) {
    var service = {};
    service.inserir = inserir;
    service.listar = listar;

    return service;

    function inserir(paciente) {
      return {
        success: function(callback) {
          setTimeout(function() {
            return callback({ success: true });
          }, 1500);
        }
      }
    }

    function listar() {
      return {
        success: function(callback) {
          setTimeout(function() {
            var pacientes = [{
              nome: 'Alvaro',
              email: 'alvaro.dasmerces@gmail.com',
              dt_nascimento: '25/03/1992',
              nome: 'Alvaro 2',
              email: 'alvaro.dasmerces@gmail.com',
              dt_nascimento: '13/06/1995',
              nome: 'Alvaro 3',
              email: 'alvaro.dasmerces@gmail.com',
              dt_nascimento: '01/09/2002'
            }]

            return callback({ success: true, pacientes: pacientes });
          }, 1500);
        }
      }
    }
  }
})();