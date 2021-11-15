<?php

require_once 'C:\wamp64\www\DBEA\IS444-DBEA-Project\public\model\common.php';


$dao = new fastcashDAO();
$loans = $dao->retrieveLoans();

foreach($loans as $loan){
    print_r($loan);
}


?>