<?php

session_start();

require_once("connect_db.php");

$connection = new mysqli($host,$db_user, $db_password,$db_name);
echo "$connection->connect_errno";
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>To do list v1</title>
</head>

<body>

    <h1>To do list</h1>
    <form method="post">

        <input type="text" name="task" id="task">
        <button type="submit">Submit</button>

    </form>


    
    <script src="./app.js"></script>
</body>

</html>