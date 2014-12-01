define([
	'core'
],function(){
	
	var DefaultData = {
		sUserName: '',
		sFullName: '',
		sEmail: '',
		sPassword: '',
		sTimeZone: 0,
		sFirstName: '',
		sLastName: '',
		iGender: '',
		sBirthday: '',
		sFacebook: '',
		sTwitter: '',
		sAim: '',
		sAbout: '',
		sLoginBy: null,
        sLoginUID: null,

        //to post avatar
        sCoordinates: '',
        iWidth: '',
        iHeight: '',
        sImgSrc: '',
        bIsAgreeTerms: false
	};
	
	var SignUpData = function(){
		this.all = DefaultData;
	}
	
	SignUpData.prototype.reset = function(){
		this.all = DefaultData;
		return this;
	}
	
	SignUpData.prototype.update  = function(data){
		this.all = $.extend({},this.all, data);
		return this;
	}
	
	return new SignUpData;
});
