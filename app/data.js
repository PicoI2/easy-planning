'use strict'
import 'angular';

// $data service, handle every http request.
angular.module("dataModule", []).factory('$data', ["$http", "$timeout", "$rootScope", function ($http, $timeout, $rootScope) {
    var me = this;
    me.tasks = [{title:"Loading tasks..."}];
    me.days = [];
    
    $http.get('/task').then((rep) => {
        me.tasks = rep.data;
        for (var itTask in me.tasks) {
            me.tasks[itTask].start = new Date(me.tasks[itTask].start);;
            me.tasks[itTask].start.setHours(0,0,0,0);
            me.tasks[itTask].end = new Date(me.tasks[itTask].end);;
            me.tasks[itTask].end.setHours(0,0,0,0);
        }
        $rootScope.$emit('dataGetTasks');
    });

    $http.get('/day').then((rep) => {
        me.days = rep.data;
        for (var itDay in me.days) {
            me.days[itDay].day = new Date(me.days[itDay].day);;
            me.days[itDay].day.setHours(0,0,0,0);
        }
        $rootScope.$emit('dataGetDays');
    });

    me.saveTasks = () => {
        $http.post('/task', me.tasks).then(
            function success(rep) {
                console.log("post task success" + rep);
            },
            function error(rep) {
                console.log("post task error" + rep);
            },
        );
    };

    me.saveDays = () => {
        $http.post('/day', me.days).then(
            function success(rep) {
                console.log("post day success" + rep);
            },
            function error(rep) {
                console.log("post day error" + rep);
            },
        );
    };

    return me;
}]);
