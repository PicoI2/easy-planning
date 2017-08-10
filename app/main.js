'use strict'
import 'angular';
import './data.js';
import './edit-task/edit-task.js';

const app = angular.module('main', ['dataModule', 'editTask']);

app.run(['$rootScope', function($rootScope){
    $rootScope.name = "you";
}])
