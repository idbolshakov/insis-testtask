default: 
	@rm -rf build/;	
	@mkdir build/;
	
	@cp src/index.html build/index.html;
	@cp src/styles.css build/styles.css;
	
	@cat src/js/config.js\
		 src/js/model.js\
		 src/js/view.js\
		 src/js/controller.js\
		 src/js/app.js\
		 > build/scripts.js;
		 
	@cp build/index.html /var/www/html/insis/index.html;
	@cp build/styles.css /var/www/html/insis/styles.css;	
	@cp build/scripts.js /var/www/html/insis/scripts.js;		 

