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
