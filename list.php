<?php
$pdo = require_once('database.php');
$sql = 'SELECT * FROM tasks';
$statement = $pdo->prepare($sql);
$statement->execute();
$tasks = $statement->fetchAll(PDO::FETCH_ASSOC);



$json_var = json_encode($tasks);
print_r($json_var);


?>