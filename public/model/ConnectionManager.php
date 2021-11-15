<?php

class ConnectionManager {

    public function getConnection() {
        $servername = 'localhost';
        $username = 'root';
        $password = '';
        $dbname = 'fastcash';
        $port = '3306';
        $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8;port=$port",
            $username,
            $password);

        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }
}

