(function(){ // Prevent from being global. Will be removed when using webpack
    'use strict'
    const app = angular.module('main', []);
    app.run(['$rootScope', function($rootScope){
        $rootScope.name = "you";
    }])
})()