(function() {
  'use strict';

  angular.module('smartcare.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', 'LoginService', '$state']

  function LoginController($scope, LoginService, $state) {
    var vm = this;
    vm.autenticar = autenticar;
    vm.loading = false;

    function autenticar() {
      vm.formulario.$setSubmitted();

      if(!vm.formulario.$valid) {
        toastr.error('Existem erros no formulário. Por favor, verifique os campos marcados em vermelho.');
        return;
      }

      vm.loading = true;
      LoginService.autenticar(vm.login, vm.senha )
        .success(function(data) {
          if(data.success) {
            localStorage.setItem('token', data.token);
            $state.go('index.main');
          }
          else {
            toastr.error('Usuário e/ou senhas inválidos');
          }

          vm.loading = false;
        });
    }
  }
})();