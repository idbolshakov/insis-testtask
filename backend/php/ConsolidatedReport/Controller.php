<?php

namespace INSIS\TestTask\ConsolidatedReport;

/**
 * Controller
 *
 * класс описывает 
 * работу контроллера
 * модуля формирования
 * сводного отчета
 *
 * @version 1.0.0
 * @author idbolshakov@gmail.com
 */
class Controller {

    /**
     * onRequest
     *
     * метод вызывается,
     * когда пользователь
     * запросил данные для 
     * сводного отчета
     *
     * получаем из GET массива конфиг отчета, 
     * валидируем данные,
     * через модель отправляем запрос в базу 
     * и отправляем пользователю данные для отчета
     */
    public function onRequest() {

        $reportConfig = $this->parseReportConfig();

        if ($this->validateConfig($reportConfig)) {

            $model = new Model();

            echo $model->getConsolidateReportData($reportConfig);
        }
    }

    private function parseReportConfig() {

        return \json_decode($_GET['reportConfig'], true);
    }

    private function validateConfig($reportConfig) {
        
        if (
			\DateTime::createFromFormat('Y-m-d H:i:s', $reportConfig['start_date']) &&
			\DateTime::createFromFormat('Y-m-d H:i:s', $reportConfig['end_date']) &&
			$reportConfig['client_type'] >= 0 && 
			$reportConfig['client_type'] <= 2
		) {
			
			return true;
		}

		return false;
    }
}

?>
