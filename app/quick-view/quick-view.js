'use strict'
import 'angular';

function QuickViewCtrl ($data, $timeout, $rootScope) {
    var me = this;
    me.tasks = [];
    me.days = [];
    me.stats = {};
    
    $rootScope.$on('dataGetTasks', () => {
        me.tasks = $data.tasks;
        me.compute();
    });

    $rootScope.$on('dataGetDays', () => {
        me.days = $data.days;
        me.compute();
    });

    me.compute = () => {
        me.stats.leftTodo = 0;
        for (var itTask in me.tasks) {
            var task = me.tasks[itTask];
            me.stats.leftTodo += task.leftTodo;
        }
        me.stats.leftDays = 0;
        for (var itDay in me.days) {
            var day = me.days[itDay];
            if (!day.off && !day.weekend) {
                me.stats.leftDays++;
            }
        }
    };
}
QuickViewCtrl.$inject = ["$data", "$timeout", "$rootScope"];

angular.module('quickView', []).component('quickView', {
    restrict: 'E',
    templateUrl: 'quick-view/quick-view.html',
    controller: QuickViewCtrl,
    controllerAs: 'ctrl',
});