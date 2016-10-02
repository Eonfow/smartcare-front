(function() {
  'use strict';

  angular.module('smartcare.pacientes')
    .controller('CadastrarPacienteController', CadastrarPacienteController);

  CadastrarPacienteController.$inject = ['PacientesService'];

  function CadastrarPacienteController(PacientesService) {
    var vm = this;
    vm.formulario = {};
    vm.paciente = {};
    vm.cadastrarPaciente = cadastrarPaciente;

    function cadastrarPaciente() {
      vm.formulario.$setSubmitted();

      if(!vm.formulario.$valid) {
        toastr.error('Existem erros no formulário. Por favor, verifique os campos marcados em vermelho.');
        return;
      }

      vm.paciente.tp_acesso = 'pacientes';

      //cadastra o novo paciente
      PacientesService.inserir(vm.paciente)
        .success(function(data) {
          if(data.success) {
            toastr.success('Paciente cadastrado com sucesso!');
            vm.paciente = {};
          }
          else {
            toastr.error('Erro ao cadastrar paciente :(');
          }
        });
    }
  }
})();