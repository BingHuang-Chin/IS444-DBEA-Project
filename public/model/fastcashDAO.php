<?php

class fastcashDAO{

    public function retrieveLoans(){
        $connMgr = new ConnectionManager();
        $pdo = $connMgr->getConnection();
        $sql = "SELECT * FROM loans";
        $stmt = $pdo->prepare($sql);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        $loans_list = [];
        while($row = $stmt->fetch()){
            $loan = new loan(
                $row['id'],
                $row['user_id'],
                $row['loan_amount'],
                $row['loan_status'],
                $row['loaned_by'],
                $row['payment_duration'],
                $row['due_date'],
                $row['interest']
            );
            $loans_list[] = $loan;
        };
        $stmt = null;
        $pdo = null;
        return $loans_list;
    }
}