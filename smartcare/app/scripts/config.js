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