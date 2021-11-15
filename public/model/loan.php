<?php

class loan{
    public $id;
    public $user_id;
    public $loan_amount;
    public $loan_status;
    public $loaned_by;
    public $payment_duration;
    public $due_date;
    public $interest;


    public function __construct($id, $user_id, $loan_amount, $loan_status, $loaned_by, $payment_duration, $due_date,$interest){
        $this->id = $id;
        $this->user_id = $user_id;
        $this->loan_amount = $loan_amount;
        $this->loan_status = $loan_status;
        $this->loaned_by = $loaned_by;
        $this->payment_duration = $payment_duration;
        $this->due_date = $due_date;
        $this->interest = $interest;
    }
    

}