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

    return me;
}]);
