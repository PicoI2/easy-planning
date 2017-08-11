'use strict'
import 'angular';

// $data service, handle every http request.
angular.module("dataModule", []).factory('$data', ["$http", "$timeout", "$rootScope", function ($http, $timeout, $rootScope) {
    var me = this;
    me.tasks = [{title:"Loading tasks..."}];
    
    $http.get('/task').then((rep) => {
            me.tasks = rep.data;
            for (var itTask in me.tasks) {
                me.tasks[itTask].start = new Date(me.tasks[itTask].start);;
                me.tasks[itTask].start.setHours(0,0,0,0);
                me.tasks[itTask].end = new Date(me.tasks[itTask].end);;
                me.tasks[itTask].end.setHours(0,0,0,0);
            }
            $rootScope.$emit('dataGetTask');
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

    return me;
}]);
