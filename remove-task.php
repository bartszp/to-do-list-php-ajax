<?php

$pdo = require_once('database.php');
if(isset($_POST['id'])){
    $sql = 'DELETE FROM tasks WHERE id = :id';
    $statement = $pdo->prepare($sql);
    $statement->bindParam(':id', $_POST['id']);
    $statement->execute();
}