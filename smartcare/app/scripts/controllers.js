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