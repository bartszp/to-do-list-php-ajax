<?php

require_once 'config.php';


function connect($host, $db_name, $user, $password)
{

    $dsn = "mysql:host=$host;dbname=$db_name;charset=UTF8";

    try{
        $options = [PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION];
        return new PDO($dsn, $user, $password, $options);


    } catch (PDOException $error) {
        die($error->getMessage());
    }
}

return connect($host, $db_name, $user, $password);