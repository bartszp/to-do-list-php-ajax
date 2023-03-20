<?php
$pdo = require_once('database.php');
if(isset($_POST['updatedTaskDesc']) && isset($_POST['id'])){
    $sql = 'UPDATE tasks SET task=:task WHERE id = :id';
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':task',$_POST['updatedTaskDesc']);
    $statement->bindParam(':id',$_POST['id']);
    $statement->execute();

}
