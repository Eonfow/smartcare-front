/**
 * INSPINIA - Responsive Admin Theme
 * 2.5
 *
 * Custom scripts
 */

$(document).ready(function () {


    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if(navbarHeigh > wrapperHeigh){
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if(navbarHeigh < wrapperHeigh){
            $('#page-wrapper').css("min-height", $(window).height()  + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {
            fix_height();
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function(){
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav') ) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    setTimeout(function(){
        fix_height();
    });

    toastr.options.closeButton = true;
    toastr.options.progressBar = true;
});

// Minimalize menu when screen is less than 768px
$(function() {
    $(window).bind("load resize", function() {
        if ($(document).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    })
});

(function() {
  'use strict';

  angular.module('smartcare.login', []);
})();
(function() {
  'use strict';

  angular.module('smartcare.login')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', 'LoginService', '$state']

  function LoginController($scope, LoginService, $state) {
    var vm = this;
    vm.autenticar = autenticar;

    function autenticar() {
      vm.formulario.$setSubmitted();

      if(!vm.formulario.$valid) {
        toastr.error('Existem erros no formulário. Por favor, verifique os campos marcados em vermelho.');
        return;
      }

      LoginService.autenticar(vm.login, vm.senha )
        .success(function(data) {
          if(data.success) {
            localStorage.setItem('token', data.token);
            $state.go('index.main');
          }
          else {
            toastr.error(data.errBody);
          }
        });
    }
  }
})();
(function() {
  'use strict';

  angular.module('smartcare.login')
    .factory('LoginService', LoginService);

  LoginService.$inject = ['$http', '$q', 'API_URL'];

  function LoginService($http, $q, API_URL) {
    var service = {};
    service.autenticar = autenticar;

    return service;

    function autenticar(login, senha) {
      return $http.post(API_URL + '/login', { login:login, senha:senha });
    }
  }
})();
(function() {
  'use strict';

  angular.module('smartcare.pacientes', []);
})();
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

      PacientesService.consultarDadosArduino({ idArduino: paciente.idArduino })
        .success(function(data) {
          if(!data.success) {
            toastr.error('Erro ao consultar dados do paciente');
            return;
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
(function() {
  'use strict';

  angular.module('smartcare.cuidadores', []);
})();
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
(function() {
  'use strict';

  angular.module('smartcare.principal', []);
})();
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
/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('smartcare', [
        'ui.router',                    // Routing
        'ui.bootstrap',                 // Bootstrap

        'smartcare.pacientes',
        'smartcare.cuidadores',
        'smartcare.login',
        'smartcare.principal'
    ])
})();
/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written stat for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index/principal");

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
            .state('index.main', {
                url: "/principal",
                templateUrl: "components/principal/principal.view.html",
                controller: 'PrincipalController',
                controllerAs: 'ctrl',
                data: { pageTitle: 'Example view' }
            })

            .state('index.cadastrarPaciente', {
                url: "/paciente/cadastrar",
                templateUrl: 'components/paciente/paciente.cadastrar.view.html',
                controller: 'CadastrarPacienteController',
                controllerAs: 'ctrl'
            })

            .state('index.gerenciarPaciente', {
                url: "/paciente/gerenciar",
                templateUrl: 'components/paciente/paciente.gerenciar.view.html',
                controller: 'GerenciarPacienteController',
                controllerAs: 'ctrl'
            })

            .state('index.cadastrarCuidador', {
                url: "/cuidador/cadastrar",
                templateUrl: 'components/cuidador/cuidador.cadastrar.view.html',
                controller: 'CadastrarCuidadorController',
                controllerAs: 'ctrl'
            })

        .state('login', {
            url: "/login",
            whitelisted: true,
            templateUrl: "components/login/login.view.html",
            controller: 'LoginController',
            controllerAs: 'ctrl'
        });
}
angular
    .module('smartcare')
    .constant('API_URL', 'https://smartcare-back-eonfow.c9users.io')
    .config(config)
    .run(function($rootScope, $state, $location) {
        $rootScope.$state = $state;

        var token = localStorage.getItem("token");

        if(!token){
            localStorage.removeItem("token");
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if(!toState.whitelisted && !localStorage.getItem("token")) {
                event.preventDefault();
                $state.go('login');
            }
        });
    });
/**
 * INSPINIA - Responsive Admin Theme
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'INSPINIA | Responsive Admin Theme';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'INSPINIA | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();
            });
        }
    };
};

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}


/**
 *
 * Pass all functions into module
 */
angular
    .module('smartcare')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen);

/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $state) {
    $scope.logout = function logout(){
        localStorage.removeItem('token');
        $state.go('login');
    }
}

angular
    .module('smartcare')
    .controller('MainCtrl', MainCtrl);