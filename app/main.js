'use strict'
import 'angular';

const app = angular.module('main', []);

app.run(['$rootScope', function($rootScope){
    $rootScope.name = "you";
}])
