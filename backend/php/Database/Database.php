<?php

namespace INSIS\TestTask\Database;

/**
 * Database
 *
 * класс описывает
 * синглтон-объект
 * для доступа к
 * базе данных
 *
 * @version 1.0.0
 * @author idbolshakov@gmail.com
 */
class Database  {

    private static $instance = null;

    private function __construct() {}

    protected function __clone() {}

    /**
     * getInstance
     *
     * метод отвечает за доступ
     * к синглтон-объекту Database
     *
     * @return синглтон-объект Database
     */
    public function getInstance() {

        if ( \is_null(self::$instance) ) {

            self::$instance = new self();
        }

        return self::$instance;
    }
}

?>
