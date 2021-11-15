<?php

require_once 'IS444-DBEA-Project\public\model\common.php';

?>


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastCash | Lender's</title>

  <!-- Bootstrap core CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">


    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>

    <!-- Custom styles for this template -->
    <link href="../../dashboard.css" rel="stylesheet">
</head>

<body>
  <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="">FastCash</a>
    <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search">
    <ul class="navbar-nav px-3">
      <li class="nav-item text-nowrap">
        <a class="nav-link" href="#">Sign out</a>
      </li>
    </ul>
  </header>
  
  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column">
            <li class="nav-item text-sm-center">
              <!-- This line can be removed if we dw to show -->
              <a class="nav-link">
                  @{{ username }} <br>
                  Progress <br>
                  Level 1 <br>
                  Loaner
              </a>
           </li>
          <br>
            <li class="nav-item">
              <a class="nav-link" aria-current="page" href="lender.html">
                <span data-feather="home"></span>
                Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="lender_loanpool.html">
                <span data-feather="users"></span>
                Loan Pool
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="lender_loaners.html">
                <span data-feather="bar-chart-2"></span>
                Current Loaners
              </a>
            <li class="nav-item">
              <a class="nav-link" href="loan_list.html">
                <span data-feather="bar-chart-2"></span>
                Loan List
                </a>
          </ul>
  
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved reports</span>
            <a class="link-secondary" href="#" aria-label="Add a new report">
              <span data-feather="plus-circle"></span>
            </a>
          </h6>
          <ul class="nav flex-column mb-2">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <span data-feather="file-text"></span>
                Current month
              </a>
          </ul>
        </div>
      </nav>
  
    <?php
      // $servername = "localhost";
      // $username = "root";
      // $password = "";
      // $dbname = 'fashcash';
      // $port = '3306';
      // $conn = new mysqli($servername,$username,$password);
      // if($conn->connect_error){
      //   die("connection failed: " . $conn->connect_error);
      // }
      // $sql = "SELECT id, user_id, loan_amount, loan_status, loaned_by,
      // payment_duration, due_date, interest
      // FROM loans
      // $result = $conn->query($sql);
      
      // if ($result->num_rows > 0) {
      
      //     echo"<table>";
      //     echo("<table border = \"1\">");
      //     print("<tr>");
      //     print("<th>ID</th>");
      //     print("<th>USER ID</th>");
      //     print("<th>LOAN AMOUNT</th>");
      //     print("<th>LOAN STATUS</th>");
      //     print("<th>LOANED BY</th>");
      //     print("<th>PAYMENT DURATION</th>");
      //     print("<th>DUE DATE</th>");
      //     print("<th>INTEREST</th>");
      //     while($row = $result->fetch_assoc()) {
      //         echo "<tr><td>" . $row["loans.id"]. "</td><td>" . $row["loans.user_id"].
      //         "</td><td>" . $row["loans.loan_amount"]. "</td><td>" . $row["loans.loan_status"] . "</td><td>" .
      //         $row["loans.payment_duration"] . "</td><td>" . $row["loans.due_date"] . "</td><td>" .
      //         $row["loans.interest"] . "</td><td>";
      //     }
      // } else {
      //     echo "0 results";
      // }
      // echo"</table>";
      // $conn->close();


      ?>  

  
      <script src="../../assets/dist/js/bootstrap.bundle.min.js"></script>
  
        <script src="https://cdn.jsdelivr.net/npm/feather-icons@4.28.0/dist/feather.min.js" integrity="sha384-uO3SXW5IuS1ZpFPKugNNWqTZRRglnUJK6UAZ/gxOX80nxEkN9NcGZTftn6RzhGWE" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js" integrity="sha384-zNy6FEbO50N+Cg5wap8IKA4M/ZnLJgzc6w2NqACZaK0u0FXfOWRRJOnQtpZun8ha" crossorigin="anonymous"></script><script src="../../dashboard.js"></script>
</body>
</html>