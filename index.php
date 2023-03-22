<?php

session_start();
$_SESSION['checkpoint_1'] = 'check1';


// $pdo = require_once('database.php');    
// $tasks = require_once('list.php');



?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
</head>

<body>

    <div class="container" id="container">
        <div class="title">To do list</div>

        <form method="post" id="form" action="add-task.php">
            <div class="label-input-task">
                <label for="task">Task</label>
                <input type="text" name="task" id="task" placeholder="Add task here" autocomplete="off">
            </div>
            <div class="label-input-date">
                <label for="dueDate">Date</label>
                <input type="date" name="dueDate" id="due-date">
            </div>
            <div class="label-input-priority">
                <label for="priority">Priority</label>

                <fieldset>
                    <input type="radio" name="priority" id="priority-low" checked>
                    <input type="radio" name="priority" id="priority-medium">
                    <input type="radio" name="priority" id="priority-high">
                </fieldset>
            </div>
            <button type="submit" id="submit">Add task</button>
        </form>
        <div id="tasks-list">
        </div>





    </div>


    <script src="./app.js" type="module"></script>
</body>

</html>