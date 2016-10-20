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

    private $config = array(

        'host'     => 'localhost',
        'db'       => 'insis_test_task',
        'login'    => 'root',
        'password' => 'root'
    );


    /**
     * конструктор
     *
     * устанавливаем соединение
     * с базой
     *
     * настройки для 
     * установки соединения
     * берем из конфига $this->config
     *
     */
    private function __construct() {
    
        $db_server = \mysql_connect(

            $this->config['host'],
            $this->config['login'],
            $this->config['password']
        );

        if ($db_server) {

            $this->query("SET NAMES utf8 COLLATE utf8_unicode_ci");

            \mysql_select_db($this->config['db']);

        } else {

            exit();
        }
    }

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

    /**
     * query
     *
     * отправляет запрос к базе
     *
     * @param $query - sql запрос в текстовом виде
     * @return результат выполнения запроса
     */
    public function query($query) {

        return \mysql_query($query);
    }
}

?>
