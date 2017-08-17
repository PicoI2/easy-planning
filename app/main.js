'use strict'
import 'angular';
import './data.js';
import './edit-task/edit-task.js';
import './planning/planning.js';
import './quick-view/quick-view.js';

const app = angular.module('main', ['dataModule', 'editTask', 'planning', 'quickView']);

app.run(['$rootScope', function($rootScope){
    $rootScope.name = "planning";
}])
