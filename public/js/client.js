$(function() {
  getTask();

  $('#addTask').on('submit', addTask);

  $('#taskList').on('click', '.done', completeTask);
      //var idToComplete = $(this).parent().data('id');
      //console.log('We are completing task: ', idToComplete);

  //$('#book-list').on('click', '.save', updateBook);
  $('#taskList').on('click', '.delete', deleteTask);
});

function getTask() {
  $.ajax({
    type: 'GET',
    url: '/tasks',
    success: displayTasks
  });
}
//once server has responded, add tasks to task list
function displayTasks(response) {
  console.log(response);
  var $list = $('#taskList');
  $list.empty();
  response.forEach(function(tasks) {
    var $li = $('<li></li>');
    var $form = $('<form></form>');
    //$("#taskTable tr:last").after("<tr class='info'><td>" + tasks.task + "</td><td>" + tasks.status + "</td><td><button>Delete</button></td>" );

    $form.append('<input type="text" name="task" value="' + tasks.task + '"/>');
    $form.append('<input type="text" name="is_complete" value="' + tasks.is_complete + '"/>');
    var $doneButton = $('<button class="done">Done!</button>');
    $doneButton.data('id', tasks.id);
    $form.append($doneButton);
    var $deleteButton = $('<button class="delete">Delete</button>');
    $deleteButton.data('id', tasks.id);
    $form.append($deleteButton);


    $li.append($form);
    $list.append($li);
  });
}

function addTask(event) {
  event.preventDefault();

  // title=someTitle&author=someAuthor&published=today
  var taskData = $(this).serialize();

  $.ajax({
    type: 'POST',
    url: '/tasks',
    data: taskData,
    success: getTask
  });

  $(this).find('input').val('');
}

function completeTask(event){
  event.preventDefault();

  var tasksId = $(this).data('id');

  $.ajax({
    type: 'PUT',
    url: '/tasks/' + tasksId,
    success: getTask
  });
};


function deleteTask(event) {
  event.preventDefault();

  var tasksId = $(this).data('id');

  $.ajax({
    type: 'DELETE',
    url: '/tasks/' + tasksId,
    success: getTask
  });
};
