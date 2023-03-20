<?php

$pdo = require_once('database.php');
if(isset($_POST['task'])){
    $sql = 'INSERT INTO tasks VALUES (NULL, :task)';
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':task',$_POST['task']);
    $statement->execute();

}