(function() {
  'use strict';

  angular.module('smartcare.principal')
    .controller('PrincipalController', PrincipalController);

  PrincipalController.$inject = ['PrincipalService'];

  function PrincipalController(PrincipalService) {
    var vm = this;
    vm.numPacientes = 0;
    vm.numCuidadores = 0;
    vm.numRegistrosArduino = 0;

    PrincipalService.consultarDadosDashboard()
      .success(function(data) {
        console.log(data);
        if(!data.success) {
          toastr.error('Erro ao consultar dashboard');
          return;
        }

        vm.numPacientes = data.result.totais.pacientes;
        vm.numCuidadores = data.result.totais.cuidadores;
        vm.numRegistrosArduino = data.result.totais.arduino;
      });
  }
})();