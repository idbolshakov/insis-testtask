var CONSOLIDATED_REPORT = {
	
	model: {},
	view: {},
	controller: {}
};
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
CONSOLIDATED_REPORT.view = {
	
	month_input   : document.getElementById('month_input'),
	year_input    : document.getElementById('year_input'),
	client_type_0 : document.getElementById('client_type_0'),
	client_type_1 : document.getElementById('client_type_1'),
	client_type_2 : document.getElementById('client_type_2'),
	show_button   : document.getElementById('show_button'),
	report_block  : document.getElementById('report_block'),
	
	/**
	 * showValidateMonthError
	 * 
	 * отвечает за показ сообщения
	 * об ошибке валидации месяца
	 */	
	showValidateMonthError: function() {
		
		alert('Выберите месяц');
	},
	
	
	/**
	 * showValidateYearError
	 * 
	 * отвечает за показ сообщения
	 * об ошибке валидации года
	 */		
	showValidateYearError: function() {
		
		alert('Укажите год четырехзначным числом (не ранее 1980 года, и не позднее текущего года)');
	},
	
	
	/**
	 * showValidateClientTypeError
	 * 
	 * отвечает за показ сообщения
	 * об ошибке валидации типа клиента
	 */		
	showValidateClientTypeError: function() {
		
		alert('Выберите тип клиента');
	},
	
	/**
	 * showProgressMessage
	 * 
	 * отвечает за показ сообщения
	 * о загрузке отчета
	 */
	showProgressMessage: function() {
		
		report_block.innerHTML = "Пожалуйста, подождите..";
	},
	
	printReport: function(data) {
		
		var report = '<table>'
			+'<thead>'
				+'<tr>'
					+'<td>Услуга</td>'
                    +'<td>Баланс на начало периода</td>'
                    +'<td>Приход</td>'
                    +'<td>Расход</td>'
                    +'<td>Перерасчет</td>'
                    +'<td>Итого</td>'
                +'</tr>'
            +'</thead>';
            
        for (var i=0, l=data.length; i<l; i++) {
						
			report += '<tr>'
				+'<td>'+data[i].offer_name+'</td>'
				+'<td>'+data[i].begin_balance+'</td>'
				+'<td>'+data[i].income+'</td>'
				+'<td>'+data[i].consumption+'</td>'
				+'<td>'+data[i].recalculation+'</td>'
				+'<td>'+data[i].total+'</td>'																				
				+'</tr>';
		}
            
        report_block.innerHTML = report;			
	},
}
CONSOLIDATED_REPORT.controller = {

	model: CONSOLIDATED_REPORT.model,
	view: CONSOLIDATED_REPORT.view,

	/**
	 * onShowClick
	 * 
	 * вызывается когда пользователь
	 * кликнул по кнопке "Смотреть"
	 * 
	 * валидируем пользовательский ввод,
	 * показываем сообщение о загрузке
	 * генерируем и отправляем запрос на отчет на сервер
	 */
	onShowClick: function() {
		
       if (
			this.validateMonth() && 
			this.validateYear() && 
			this.validateClientType()
		) {

			this.view.showProgressMessage();
			
			this.model.generateReportConfig({
				
				month: this.view.month_input.selectedIndex,
				year: this.view.year_input.value,
				client_type: this.getClientTypeId()
			});
			
			this.model.sendRequest(this);
       }		
	},
	
	/**
	 * validateMonth
	 * 
	 * проверяем правильность 
	 * ввода месяца 
	 */
	validateMonth: function() {
       
       var index = this.view.month_input.selectedIndex;

       if (index >= 0 && index <= 11) {

           return true

       } else {

           view.showValidateMonthError();

           return false;
       }		
	},
	
	/**
	 * validateYear
	 * 
	 * проверяем правильность 
	 * ввода года
	 * 
	 * должен быть >= 1980 и не позднее текущего года 
	 */	
	validateYear: function() {
       
       var year = Number.parseInt(this.view.year_input.value);

       if (year >= 1980 && year <= new Date().getFullYear()) {

           return true

       } else {

           this.view.showValidateYearError();

           return false;
       }		
	},
	
	/**
	 * validateClientType
	 * 
	 * проверяем выбран ли тип клиента 
	 * 
	 * возможные варианты типа клиента:
	 * 
	 * 1) не важно
	 * 2) физ. лица
	 * 3) юр. лица
	 */	
	validateClientType: function() {
       
       if (
			this.view.client_type_0.checked || 
			this.view.client_type_1.checked || 
			this.view.client_type_2.checked
		) {

           return true;

       } else {

           this.view.showValidateClientTypeError();
           return false;
       }		
	},
	
	/**
	 * getClientTypeId
	 * 
	 * возвращает Id выбранного типа клиента
	 * 
	 * @return {int} - id выбранного типа клиента
	 */
	getClientTypeId: function() {
		
		if (this.view.client_type_0.checked) {
			
			return this.view.client_type_0.value;
		}
		
		if (this.view.client_type_1.checked) {
			
			return this.view.client_type_1.value;
		}
		
		if (this.view.client_type_2.checked) {
			
			return this.view.client_type_2.value;
		}				
	},
	
	responseCallback: function() {

		this.view.printReport(this.model.reportData);
	},
	
	errorCallback: function() {
		
	},	
}
// ИНИЦИАЛИЗАЦИЯ
CONSOLIDATED_REPORT.view.show_button.addEventListener('click', function() {

	CONSOLIDATED_REPORT.controller.onShowClick();	
});
