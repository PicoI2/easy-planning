'use strict'
import 'angular';

var modulePlanning = angular.module('planning', []);
const DAY = 86400000;

function PlanningCtrl ($data, $timeout, $rootScope) {
    var me = this;
    me.name = "PlanningCtrl";
    me.tasks = $data.tasks;
    me.days = [];
    me.loads = [];
    me.table = [[]];
    var date = new Date(2017,8,1,0,0,0,0); // 1 sept !
    me.days.push(date);
    for (var i=1; i<123; ++i) {
        me.days.push(new Date(date.getTime() + i*DAY));
    }
    me.loads = new Array(me.days.length);
    
    $rootScope.$on('dataGetTask', () => {
        me.tasks = $data.tasks;
        me.buildTable();
    });

    me.buildTable = () => {

        for (var itDay in me.days) {
            if (me.days[itDay].getDay()%6) {
                me.loads[itDay] = 0.0;
            }
        }

        me.table = new Array(me.tasks.length);
        for (var itTask in me.tasks) {
            var task = me.tasks[itTask];
            var dayNb = 0;
            me.table[itTask] = new Array(me.days.length);
            for (var itDay in me.days) {
                me.table[itTask][itDay] = {};
                var day = me.days[itDay];
                if (task.start <= day && task.end >= day) {
                    me.table[itTask][itDay].color = me.stringToColor(task.title);
                    if (day.getDay()%6) {
                        ++dayNb;
                    }
                }
            }
            for (var itDay in me.days) {
                var day = me.days[itDay];
                if (task.start <= day && task.end >= day && day.getDay()%6) {
                    me.loads[itDay] += (task.leftTodo / dayNb);
                }
            }
        }
    };

    me.stringToColor = (str) => {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = 'background-color: #';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        colour += ";";
        return colour;
    }

    me.setDraggedTask = (task, day) => {
        me.draggedTask = task;
        me.draggedDay = day;
        me.dragStart = (task.start.getTime() == day.getTime());
        me.dragEnd = (task.end.getTime() == day.getTime());
    }
    me.setDraggedDay = (day) => {
        if (me.dragStart) {
            console.log("drag start");
            me.draggedTask.start.setTime(day.getTime());
        }
        else if (me.dragEnd) {
            console.log("drag end");
            me.draggedTask.end.setTime(day.getTime());
        }
        else {
            console.log("drag task");
            me.draggedTask.start.setTime(me.draggedTask.start.getTime() + day.getTime() - me.draggedDay.getTime());
            me.draggedTask.end.setTime(me.draggedTask.end.getTime() + day.getTime() - me.draggedDay.getTime());
            me.draggedDay = day;
        }
    }
}
PlanningCtrl.$inject = ["$data", "$timeout", "$rootScope"];

modulePlanning.component('planning', {
    restrict: 'E',
    templateUrl: 'planning/planning.html',
    controller: PlanningCtrl,
    controllerAs: 'ctrl',
});

modulePlanning.directive('draggableTask', () => {
    return {
        restrict: 'A',
        link: (scope, element) => {
            
            var el = element[0];
            el.draggable = true;

            el.addEventListener(
                'dragstart',
                (e) => {
                    scope.ctrl.setDraggedTask(scope.task, scope.day);
                    scope.ctrl.buildTable();
                    scope.$apply();
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragenter',
                (e) => {
                    scope.ctrl.setDraggedDay(scope.day);
                    scope.ctrl.buildTable();
                    scope.$apply();
                    return false;
                },
                false
            );

            // el.addEventListener(
            //     'dragend',
            //     (e) => {
            //         scope.ctrl.buildTable();
            //         scope.$apply();
            //         return false;
            //     },
            //     false
            // );
            
        }
    }
});