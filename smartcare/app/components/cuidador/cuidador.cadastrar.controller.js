(function() {
  'use strict';

  angular.module('smartcare.cuidadores')
    .controller('CadastrarCuidadorController', CadastrarCuidadorController);

  CadastrarCuidadorController.$inject = ['CuidadoresService'];

  function CadastrarCuidadorController(CuidadoresService) {
    var vm = this;
    vm.formulario = {};
    vm.paciente = {};
    vm.cadastrarCuidador = cadastrarCuidador;

    function cadastrarCuidador() {
      vm.formulario.$setSubmitted();

      if(!vm.formulario.$valid) {
        toastr.error('Existem erros no formulário. Por favor, verifique os campos marcados em vermelho.');
        return;
      }

      //cadastra o novo cuidador
      CuidadoresService.inserir(vm.paciente)
        .success(function(data) {
          if(data.success) {
            toastr.success('Cuidador cadastrado com sucesso!');
            vm.paciente = {};
          }
          else {
            toastr.error('Erro ao cadastrar cuidador :(');
          }
        });
    }
  }
})();