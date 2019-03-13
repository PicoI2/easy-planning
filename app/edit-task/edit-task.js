'use strict'
import 'angular';

function EditTaskCtrl ($data, $timeout, $rootScope) {
    var me = this;
    me.tasks = $data.tasks;
    
    $rootScope.$on('dataGetTasks', () => {
        me.tasks = $data.tasks;
    });
    
    // Save task list
    me.save = () => {
        $data.saveTasks();
        $rootScope.$emit('dataGetTasks');
    };

    // Get an event when something is paste into the cell.
    me.paste = (event) => {
        var taskKey = parseInt(event.target.attributes["task-key"].value);
        var taskTitle = "Error";
        // Get paste text
        var taskList = event.clipboardData.getData('text/plain');
        var lines = taskList.split('\n');
        for (var it in lines) {     // For each line pasted
            var i = parseInt(it);
            var values = lines[i].split('\t');  // A tab delimit task title and left to do days.
            if (2 == values.length) {
                if (taskKey + i >= me.tasks.length) {
                    me.tasks.push({});
                }
                var task = me.tasks[taskKey + i];
                task.title = values[0];
                task.leftTodo = parseInt(values[1]);
                task.start = new Date(2019,2,1,0,0,0,0);
                task.end =  new Date(2019,11,1,0,0,0,0);
            }
            if (0 == i) {
                // Memorise the title of the data where data were pasted for later.
                event.clipboardData.setData('text/plain', values[0]);
                taskTitle = values[0];
            }
        }
        // I don't know how to modifiy the event to limit the text pasted into the cell.
        // So, at the end of the digest, the title of the task where data were pasted is overwrited with the goot title value.
        $timeout(()=>{
            me.tasks[taskKey].title = taskTitle;
        }, 0);
    };

    me.addTask = () => {
        if (me.tasks.length > 0) {
            var lastTask = JSON.parse(JSON.stringify(me.tasks[me.tasks.length-1]));
            me.tasks.push({
                title: '',
                leftTodo: lastTask.leftTodo,
                start: lastTask.start,
                end: lastTask.end,
            });
        }
        else {
            var startDate = new Date(2019,2,1,0,0,0,0);
            var endDate = new Date(2019,11,1,0,0,0,0);
            me.tasks.push({
                title: '',
                leftTodo: 3,
                start: startDate,
                end: endDate
            });
        }
        
    };

    me.deleteTask = (taskKey) => {
        me.tasks.splice(taskKey, 1);
    };
}
EditTaskCtrl.$inject = ["$data", "$timeout", "$rootScope"];

angular.module('editTask', []).component('editTask', {
    restrict: 'E',
    templateUrl: 'edit-task/edit-task.html',
    controller: EditTaskCtrl,
    controllerAs: 'ctrl',
});