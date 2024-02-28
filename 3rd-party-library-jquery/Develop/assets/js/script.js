$(document).ready(function () {

    // Initial loading of tasks
    loadTasks();

    // Handling the form submission to add a new task
    $('#taskForm').submit(function (e) {
        e.preventDefault();
        addTask();
    });

    // Deleting a task
    $(document).on('click', '.delete-task', function () {
        deleteTask($(this).closest('.task-card').data('id'));
    });

    // Making tasks draggable
    $(document).on('mouseover', '.task-card', function() {
        if (!$(this).data("init")) {
            $(this).data("init", true).draggable({
                revert: 'invalid',
                cursor: 'grab',
                zIndex: 1000,
                containment: 'document', 
            });
        }
    });

    // Making lanes droppable and handling task movement between lanes
    $('.lane').droppable({
        accept: '.task-card',
        drop: function (event, ui) {
            var taskId = ui.draggable.data('id');
            var newStatus = $(this).attr('id').replace('-cards', ''); 
            updateTaskStatus(taskId, newStatus);

            // Moved card's new status updated, now adjust its class/color as required
            applyDueDateColorToTask(ui.draggable, newStatus);
            
            ui.draggable.detach().css({top: 0, left: 0}).appendTo($(this).find('.tasks-container'));
            ui.draggable.css('z-index', '');
        },
        tolerance: 'pointer',
        containment: 'document'
    });
});

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        createTaskCard(task);
    });
}

function addTask() {
    var task = {
        id: generateTaskId(),
        title: $('#taskTitle').val(),
        dueDate: $('#taskDueDate').val(),
        description: $('#taskDescription').val(),
        status: 'todo' // Ensure all tasks are initially set to 'todo'
    };

    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTaskCard(task);

    $('#formModal').modal('hide');
    $('#taskForm')[0].reset();
}

function updateTaskStatus(taskId, newStatus) {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(function(task) {
        if(task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(taskId) {
    var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    // Reload tasks to reflect the deletion
    $('.task-card[data-id="' + taskId + '"]').remove();
}

function generateTaskId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function createTaskCard(task) {
    var taskCardHtml = `
    <div class="task-card card mb-3 ${getTaskCardClass(task.dueDate, task.status)}" 
        data-id="${task.id}" 
        data-due-date="${task.dueDate}"> <!-- Ensure dueDate is set as a data attribute -->
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
            <button type="button" class="btn btn-danger delete-task"><i class="fas fa-trash-alt"></i></button>
        </div>
    </div>`;

    $('#' + task.status + '-cards').append(taskCardHtml);
}

function getTaskCardClass(dueDate, status) {
    const today = dayjs().startOf('day');
    const taskDueDate = dayjs(dueDate);
    let cardClass = 'bg-light'; // Default class for future due dates

    if (status !== 'done') { // Apply coloring unless status is 'Done'
        if (taskDueDate.isSame(today, 'day')) {
            cardClass = 'bg-warning'; // Due today
        } else if (taskDueDate.isBefore(today, 'day')) {
            cardClass = 'bg-danger'; // Overdue
        }
    }
    return cardClass;
}

function applyDueDateColorToTask($task, newStatus) {
    var dueDate = $task.data('dueDate'); // Make sure we're grabbing the dueDate correctly
    
    $task.removeClass('bg-light bg-warning bg-danger'); // Reset the color
    
    // This checks for the current status, not the new one, to decide the color, we need to adjust it:
    $task.addClass(getTaskCardClass(dueDate, newStatus)); // Apply the correct color based on due date and newStatus
}

























  
  
  

  
  
  
  
  
