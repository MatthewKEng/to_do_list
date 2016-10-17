$(function() {
  getTask();

  $('#addTask').on('submit', addTask);

  //$('#book-list').on('click', '.save', updateBook);
  //$('#book-list').on('click', '.delete', deleteBook);
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
    $form.append('<input type="text" name="status" value="incomplete"/>');
    var $deleteButton = $('<button class="delete">Delete</button>');
    $deleteButton.data('id', tasks.id);
    $form.append($deleteButton);

    //var $deleteButton = $('<button class="delete">Delete!</button>');
    //$deleteButton.data('id', book.id);
    //$form.append($deleteButton);


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
