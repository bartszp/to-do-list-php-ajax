<?php
$pdo = require_once('database.php');
if(isset($_POST['task']) && isset($_POST['regdate']) && isset($_POST['duedate']) && isset($_POST['priority'])){
    $sql = 'INSERT INTO tasks VALUES (NULL, :task, :regdate, :duedate, :priority)';
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':task',$_POST['task']);
    $statement->bindParam(':regdate',$_POST['regdate']);
    $statement->bindParam(':duedate',$_POST['duedate']);
    $statement->bindParam(':priority',$_POST['priority']);
    $statement->execute();
    echo('success');
}