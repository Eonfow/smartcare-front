(function() {
  'use strict';

  angular.module('smartcare.pacientes')
    .controller('GerenciarPacienteController', GerenciarPacienteController);

  GerenciarPacienteController.$inject = ['$scope', 'PacientesService'];

  function GerenciarPacienteController($scope, PacientesService) {
    var vm = this;
    vm.pacientes = [];
    vm.pacienteSelecionado = null;
    vm.tab = 1;
    vm.editarPaciente = editarPaciente;
    vm.removerCuidador = removerCuidador;
    vm.loading = false;

    //preenche a lista de pacientes
    PacientesService.listar()
      .success(function(data) {
        if(data.success) {
          vm.pacientes = data.result.docs;
        }
        else {
          toastr.error('Erro ao consultar pacientes');
        }
      });

    function editarPaciente(paciente) {
      vm.pacienteSelecionado = null;

      vm.loading = true;
      PacientesService.consultarDadosArduino({ idArduino: paciente.idArduino })
        .success(function(data) {
          vm.loading = false;

          if(!data.success) {
            toastr.error('Erro ao consultar dados do paciente');
            return;
          }

          //faz o tratamento das datas
          for(var i = 0; i < data.result.docs.length; i++) {
            data.result.docs[i].dataFormatada = moment(data.result.docs[i].data).format("DD/MM/YYYY HH:mm:ss");
          }

          vm.pacienteSelecionado = paciente;
          vm.pacienteSelecionado.registros = data.result.docs;
        });
    }

    function removerCuidador(cuidador, index) {
      PacientesService.desassociarCuidador({ idPaciente: vm.pacienteSelecionado._id, idCuidador: cuidador._id })
        .success(function(data) {
          if(data.success) {
            vm.pacienteSelecionado.cuidadores.splice(index, 1);
          }
          else {
            toastr.error(data.errBody || 'Erro ao remover cuidador');
          }
        })
    }
  }
})();