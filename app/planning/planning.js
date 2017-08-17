'use strict'
import 'angular';

var modulePlanning = angular.module('planning', []);
const DAY = 86400000;

function PlanningCtrl ($data, $timeout, $rootScope) {
    var me = this;
    me.name = "PlanningCtrl";
    me.tasks = $data.tasks;
    me.days = $data.days;
    me.table = [[]];
    
    $rootScope.$on('dataGetTasks', () => {
        me.tasks = $data.tasks;
        me.buildTable();
    });

    $rootScope.$on('dataGetDays', () => {
        me.days = $data.days;
        if (0 == me.days.length) {
            var date = new Date(2017,8,1,0,0,0,0); // 1 sept !
            for (var i=0; i<123; ++i) {
                var newDate = new Date(date.getTime() + i*DAY);
                newDate.setHours(0,0,0,0);
                me.days.push({
                    day: newDate,
                    load: 0.0,
                    off: (newDate.getDay()%6) ? false : true,
                    weekend: (newDate.getDay()%6) ? false : true
                });
            }
        }
        me.buildTable();
    });

    me.buildTable = () => {
        for (var itDay in me.days) {
            me.days[itDay].load = 0.0;
        }
        me.table = new Array(me.tasks.length);
        for (var itTask in me.tasks) {
            var task = me.tasks[itTask];
            var dayNb = 0;
            me.table[itTask] = new Array(me.days.length);
            for (var itDay in me.days) {
                me.table[itTask][itDay] = {};
                var day = me.days[itDay];
                if (task.start <= day.day && task.end >= day.day) {
                    me.table[itTask][itDay].color = me.stringToColor(task.title);
                    if (false === day.off) {
                        ++dayNb;
                    }
                }
            }
            for (var itDay in me.days) {
                var day = me.days[itDay];
                if (task.start <= day.day && task.end >= day.day && !day.off) {
                    me.days[itDay].load += (task.leftTodo / dayNb);
                }
                if (day.weekend ||day.off) day.class = 'dayoff';
                else if (0.9 > day.load ) day.class = 'underload';
                else if (1.1 < day.load ) day.class = 'overload';
                else day.class = 'normalload'
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
        me.dragStart = (task.start.getTime() == day.day.getTime());
        me.dragEnd = (task.end.getTime() == day.day.getTime());
    }
    me.setDraggedDay = (day) => {
        if (me.dragStart) {
            if (me.draggedTask.end.getTime() >= day.day.getTime()) {
                me.draggedTask.start.setTime(day.day.getTime());
            }
        }
        else if (me.dragEnd) {
            if (me.draggedTask.start.getTime() <= day.day.getTime()) {
                me.draggedTask.end.setTime(day.day.getTime());
            }
        }
        else {
            me.draggedTask.start.setTime(me.draggedTask.start.getTime() + day.day.getTime() - me.draggedDay.day.getTime());
            me.draggedTask.end.setTime(me.draggedTask.end.getTime() + day.day.getTime() - me.draggedDay.day.getTime());
            me.draggedDay = day;
        }
    }
    me.changeDayOff = (keyDay) => {
        if (!me.days[keyDay].weekend) {
            me.days[keyDay].off =! me.days[keyDay].off;
            me.buildTable();
        }
    }
    // Save task and day list
    me.save = () => {
        $data.saveTasks();
        $data.saveDays();
    };
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