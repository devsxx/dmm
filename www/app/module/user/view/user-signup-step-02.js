define([ //Save Signup Data
	'text!user/tpl/user-signup-step-02.html',
	'user/plugin/signup-data'
],function(text, signupData){
	
	return Backbone.View.extend({
		region: {
			wrapper: '#main',
			scroller: '#content'
		},
		events: {
			'click #cancel_btn': 'onCancelClick',
			'click #btn-next': 'goNext',
			'click #form_input_birthday': 'focusBirthday',
			'click #signup-birthday': 'handleDates'
		},
		template: _.template(text),
		goNext: function(){
			
			var dom = this.$el;
			
			var sFirstName = dom.find('#signup-firstname').val();
			var sLastName = dom.find('#signup-lastname').val();
			var iGender = dom.find('#signup-gender').val();
			var sWebsite = dom.find('#signup-website').val();
			var sFacebook = dom.find('#signup-facebook').val();
			var sTwitter = dom.find('#signup-twitter').val();
			var sAim = dom.find('#signup-aim').val();
			var sAbout = dom.find('#signup-about').val();
			var sBirthday = dom.find('#signup-birthday').val();
			
			var $firstName = dom.find('#signup-firstname');
			var $lastName = dom.find('#signup-lastname');
			var $gender = dom.find('#signup-gender');

            $firstName.removeClass('error');
            $lastName.removeClass('error');
            $gender.removeClass('error');

			if(!sFirstName.trim()){
                $firstName.addClass('error');
				utils.modal.alert('First Name can not be empty!');
				return ;
			}
			
			if(!sLastName.trim()){
                $lastName.addClass('error');
				utils.modal.alert('Last Name can not be empty!');
				return ;
			}
			
			// if(!iGender){
                // $gender.addClass('error');
			// 	alert('Gender can not be empty');
			// 	return ;
			// }
			
			signupData.update({
				sFirstName: sFirstName,
				sLastName: sLastName,
				iGender: iGender,
				sWebsite: sWebsite,
				sFacebook: sFacebook,
				sTwitter: sTwitter,
				sAim: sAim,
				sAbout: sAbout,
				sBirthday:sBirthday
				
			});
						
			window.location.href='#signup/step03';
		}, 
		render: function(context){
			var self = this;
			
			this.context = $.extend({}, context);
			
			this.$el.html(this.template({data: signupData.all }));
			
			this.$scroller = this.$el.find(this.region.scroller);
			
			// bind input edit, paste events
			this.$input_eles = $('input', this.$el);
			this.$input_eles.each(function () {
				$(this).bind('input propertychange', function () {
		            self.toggleBtn();
		        });
			});
			
			return this;
		},
		inject: function(){
			
			$(this.region.wrapper).html(this.$el);
			
			this.$scroller.ensureVerticalScroll();

            this.toggleBtn();

			return this;
		},
		focusBirthday: function (evt) {
			$('#signup-birthday', this.$el).focus();
		},
        handleDates: function (evt) {
            if (constants.platform != 'android') {
                return;
            }

            var currentField = $(evt.currentTarget);

            var myNewDate = Date.parse(currentField.val()) || new Date();
            if(typeof myNewDate === "number") {
                myNewDate = new Date (myNewDate);
            }

            datePicker.show({
                date : myNewDate,
                mode : 'date'
            }, function(returnDate) {
                if(returnDate !== "" && returnDate != "Invalid Date") {
                    var newDate = new Date(returnDate);
                    currentField.val(utils.moment(newDate.getTime()).format('YYYY-MM-DD'));
                }
                currentField.blur();
            });
        },
        toggleBtn: function () {
        	var bDisable = true;
	        
	        this.$input_eles.each(function () {
	            if ($(this).attr("type") != "checkbox" && $(this).val() != "") {
	                bDisable = false;
	            }
	        });
	        
	        $('#btn-next').toggleClass('disabled', bDisable);
        },
        onCancelClick: function () {
        	utils.modal.confirm(_t('No account will be created if you cancel this screen'), function (selected) {
        		if (selected == 1) {
        			signupData.reset();
        			window.location.href = "#login";
        		}
        	}, _t('Confirm'), [_t('Ok'), _t('Cancel')]);
        }
	});
});
