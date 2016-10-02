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