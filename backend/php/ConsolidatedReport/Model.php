<?php

namespace INSIS\TestTask\ConsolidatedReport;

use INSIS\TestTask\Database\Database;

/**
 * Model
 *
 * класс описывает 
 * работу модели
 * модуля формирования
 * сводного отчета
 *
 * @version 1.0.0
 * @author idbolshakov@gmail.com
 */
class Model {

    /**
     * generateSqlQuery
     *
     * метод отвечает за формирование
     * sql запроса к базе за данными
     * о сводном отчете.
     *
     * запрос формируется на основе конфига запроса
     *
     * @param @queryConfig - конфиг запроса
     * @return данные для сводного отчета в формате json
     */
    public function getConsolidateReportData($queryConfig) {

        $query = $this->generateSqlQuery($queryConfig);

        return Database::getInstance()->query($query);
    }

    private function generateSqlQuery($queryConfig) {

        $start_date               = $queryConfig['start_date'];
        $end_date                 = $queryConfig['end_date'];
        $recalculation_payment_id = 3;

        return "
            
            SELECT 
                
                offers.id AS current_offer_id,

                offers.name AS offer_name,

                (SELECT 
                    SUM(summ) 
                 FROM 
                    payments 
                 WHERE date < '$start_date' AND offer_id = current_offer_id

                ) AS begin_balance,

                (SELECT
                    SUM(summ)
                 FROM
                    payments
                WHERE 
                    date > '$start_date' AND 
                    date < '$end_date' AND 
                    summ > 0 AND
                    offer_id = current_offer_id

                ) as income,

                (SELECT
                    ABS(SUM(summ))
                 FROM
                    payments
                 WHERE
                    date > '$start_date' AND 
                    date < '$end_date' AND
                    summ < 0 AND
                    offer_id = current_offer_id

                ) as consumption,

                (SELECT
                    SUM(summ)
                 FROM
                    payments
                 WHERE
                    date > '$start_date' AND 
                    date < '$end_date' AND
                    payment_type_id = '$recalculation_payment_id' AND
                    offer_id = current_offer_id

                ) as recalculation
            
            FROM

                offers;
        ";
    }
}

?>
