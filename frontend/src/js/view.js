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
