'use strict'
import 'angular';

// $data service, handle every http request.
angular.module("dataModule", []).factory('$data', ["$http", "$timeout", function ($http, $timeout) {
    var me = this;

    me.getTasks = () => {
        return $http.get('/task').then((rep)=>{
            return rep.data;
        });
    };

    me.setTasks = (tasks) => {
        $http.post('/task', tasks).then(
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
