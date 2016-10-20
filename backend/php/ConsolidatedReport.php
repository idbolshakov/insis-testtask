<?php
//
// на этот скрипт будем отправлять запрос с фронтенда
//

require('Database/Database.php');

require('ConsolidatedReport/Model.php');
require('ConsolidatedReport/Controller.php');


use INSIS\TestTask\ConsolidatedReport\Controller;

$controller = new Controller();
$controller->onRequest();

?>
