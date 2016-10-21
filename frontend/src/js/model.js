CONSOLIDATED_REPORT.model = {
	
	// адрес скрипта, на который будем слать запрос
	requestURL: "ConsolidatedReport.php",
	
	startDate: null,
	endDate: null,
	reportConfig: null,
	reportData: null,
	
	/**
	 * generateReportConfig
	 * 
	 * отвечает за генерацию 
	 * конфига запроса, 
	 * который будем отправлять
	 * на бэкэнд
	 * 
	 * формат конфига:
	 * 
	 * {
	 * 		start_date:  'YYYY-MM-DD HH:MM:SS', - дата начала периода
	 * 		end_date:    'YYYY-MM-DD HH:MM:SS', - дата окончания периода
	 *  	client_type: {int} - id типа клиента
	 * }
	 * 
	 * @param data {object} - объект с данными для формирования конфига.
	 * Формат объекта: 
	 * {
	 * 	 month: {int}       - номер месяца (0..11)
	 *   year: {int}        - год (четырехзначное число)	
	 *   client_type: {int} - id типа клиента
	 * }
	 */
	generateReportConfig: function(data) {
		
		this.generateStartDateAndEndDate(data);
		
		this.reportConfig = JSON.stringify({
			
			start_date:  this.generateDateString(this.startDate),
			end_date:    this.generateDateString(this.endDate),
			client_type: data.client_type
		})
	},
	
	/**
	 * generateStartDateAndEndDate
	 * 
	 * отвечает за генерацию начальной 
	 * даты (даты начала периода) и конечной
	 * даты (даты конца периода)
	 * 
	 * @param data {object} - Объект с данными для генерации даты
	 * начала периода. Формат объекта: 
	 * 
	 * {
	 * 	 month: {int} - номер месяца (0..11)
	 *   year: {int}  - год (четырехзначное число)
	 * }
	 */
	generateStartDateAndEndDate: function(data) {
		
		this.startDate = new Date();
		this.startDate.setMonth(data.month);
		this.startDate.setFullYear(data.year);
		this.startDate.setDate(1);
		this.startDate.setHours(0);
		this.startDate.setMinutes(0);
		this.startDate.setSeconds(0);
		
		this.endDate = new Date(this.startDate.valueOf());
		this.endDate.setMonth(data.month+1);		
	},
	
	/**
	 * generateDateString
	 * 
	 * отвечает за генерацию
	 * даты в формате необходимом 
	 * для запроса
	 */
	generateDateString: function(date) {
        
        /**
         * leadingZero
         * 
         * если число меньше 9
         * то добавляем к нему 
         * ведущи ноль
         */
        var leadingZero = function(n) {
			
			if (n < 9) {
				
				return '0' + n;
			}
			
			return n;
		};
		
        var dateString = '';
        
        // Год
        dateString += date.getFullYear() + '-';
        
        // Месяц
        var month = date.getMonth() + 1;
        dateString += leadingZero(month) + '-';
        
        // День
        var day = date.getDate();
        dateString += leadingZero(day) + ' ';
        
        // часы
        var hours = date.getHours();
        dateString += leadingZero(hours) + ':';
        
        // минуты
        var minutes = date.getMinutes();
        dateString += leadingZero(minutes) + ':';
        
        // секунды
        var seconds = date.getSeconds();
        dateString += leadingZero(seconds);
        
        return dateString;                
	},
	
	/**
	 * sendRequest
	 * 
	 * отвечает за отправку запроса
	 * на сервер за данными сводного
	 * отчета
	 */
	sendRequest: function(controller) {

		var request = new XMLHttpRequest();
		
		var reportData = {};
		this.reportData = reportData;
		
		request.open('GET', this.getRequestParams(), true);
		request.send();
		
		request.onreadystatechange = function() {
			
			if (request.readyState == 4) {
				
				if (request.status == 200) {
					
					CONSOLIDATED_REPORT.model.setData(JSON.parse(request.responseText));
												
					controller.responseCallback();
				
				} else {
					
					controller.errorCallback();
				}
			}
		};
	},
	
	/**
	 * getRequestParams
	 * 
	 * @return строку запроса с парметрами сводного отчета
	 */
	getRequestParams: function() {
		
		return this.requestURL + "?reportConfig=" + this.reportConfig;
	},
	
	/**
	 * setData
	 * 
	 * отвечает за первичную
	 * обработку данных, полученных
	 * от сервера
	 */
	setData: function(data) {

		for (var i=0, l=data.length; i<l; i++) {

			// услуга
			if (data[i].offer_name === null) {
				
				data[i].offer_name = 'без названия';
			};

			// баланс на начало периода
			if (data[i].begin_balance === null) {
				
				data[i].begin_balance = 0;
			};	
			data[i].begin_balance /= 100;
			data[i].begin_balance = data[i].begin_balance.toFixed(2);
			
			// приход
			if (data[i].income === null) {
				
				data[i].income = 0;
			};
			data[i].income /= 100;
			data[i].income = data[i].income.toFixed(2);			
			
			// рахсод
			if (data[i].consumption === null) {
				
				data[i].consumption = 0;
			};	
			data[i].consumption /= 100;
			data[i].consumption = data[i].consumption.toFixed(2);			
			
			// перерасчет
			if (data[i].recalculation === null) {
				
				data[i].recalculation = 0;
			};	
			data[i].recalculation /= 100;
			data[i].recalculation = data[i].recalculation.toFixed(2);			
			
			// итого
			data[i].total = +data[i].begin_balance + +data[i].income - +data[i].consumption;	
			data[i].total = data[i].total.toFixed(2);
		}
		
		this.reportData = data;
	}
}
