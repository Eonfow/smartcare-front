(function() {
  'use strict';

  angular.module('smartcare.cuidadores')
    .controller('CadastrarCuidadorController', CadastrarCuidadorController);

  CadastrarCuidadorController.$inject = ['CuidadoresService'];

  function CadastrarCuidadorController(CuidadoresService) {
    var vm = this;
    vm.formulario = {};
    vm.cuidador = {};
    vm.cadastrarCuidador = cadastrarCuidador;

    function cadastrarCuidador() {
      vm.formulario.$setSubmitted();

      if(!vm.formulario.$valid) {
        toastr.error('Existem erros no formulário. Por favor, verifique os campos marcados em vermelho.');
        return;
      }

      vm.cuidador.tp_acesso = 'cuidadores';

      //cadastra o novo cuidador
      CuidadoresService.inserir(vm.cuidador)
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