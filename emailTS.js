/*
 * Mailcheck https://github.com/Kicksend/mailcheck
 * Author
 * Derrick Ko (@derrickko)
 *
 * License
 * Copyright (c) 2012 Receivd, Inc.
 *
 * Licensed under the MIT License.
 *
 * v 1.1
 */
var Kicksend={mailcheck:{threshold:3,defaultDomains:"".split(" "),defaultTopLevelDomains:"".split(" "),run:function(a){a.domains=a.domains||Kicksend.mailcheck.defaultDomains;a.topLevelDomains=a.topLevelDomains||Kicksend.mailcheck.defaultTopLevelDomains;a.distanceFunction=
a.distanceFunction||Kicksend.sift3Distance;var b=Kicksend.mailcheck.suggest(encodeURI(a.email),a.domains,a.topLevelDomains,a.distanceFunction);b?a.suggested&&a.suggested(b):a.empty&&a.empty()},suggest:function(a,b,c,d){a=a.toLowerCase();a=this.splitEmail(a);if(b=this.findClosestDomain(a.domain,b,d)){if(b!=a.domain)return{address:a.address,domain:b,full:a.address+"@"+b}}else if(c=this.findClosestDomain(a.topLevelDomain,c),a.domain&&c&&c!=a.topLevelDomain)return b=a.domain,b=b.substring(0,b.lastIndexOf(a.topLevelDomain))+
c,{address:a.address,domain:b,full:a.address+"@"+b};return!1},findClosestDomain:function(a,b,c){var d,e=99,g=null;if(!a||!b)return!1;c||(c=this.sift3Distance);for(var f=0;f<b.length;f++){if(a===b[f])return a;d=c(a,b[f]);d<e&&(e=d,g=b[f])}return e<=this.threshold&&null!==g?g:!1},sift3Distance:function(a,b){if(null==a||0===a.length)return null==b||0===b.length?0:b.length;if(null==b||0===b.length)return a.length;for(var c=0,d=0,e=0,g=0;c+d<a.length&&c+e<b.length;){if(a.charAt(c+d)==b.charAt(c+e))g++;
else for(var f=e=d=0;5>f;f++){if(c+f<a.length&&a.charAt(c+f)==b.charAt(c)){d=f;break}if(c+f<b.length&&a.charAt(c)==b.charAt(c+f)){e=f;break}}c++}return(a.length+b.length)/2-g},splitEmail:function(a){a=a.split("@");if(2>a.length)return!1;for(var b=0;b<a.length;b++)if(""===a[b])return!1;var c=a.pop(),d=c.split("."),e="";if(0==d.length)return!1;if(1==d.length)e=d[0];else{for(b=1;b<d.length;b++)e+=d[b]+".";2<=d.length&&(e=e.substring(0,e.length-1))}return{topLevelDomain:e,domain:c,address:a.join("@")}}}};
window.jQuery&&function(a){a.fn.mailcheck=function(a){var c=this;if(a.suggested){var d=a.suggested;a.suggested=function(a){d(c,a)}}if(a.empty){var e=a.empty;a.empty=function(){e.call(null,c)}}a.email=this.val();Kicksend.mailcheck.run(a)}}(jQuery);


/*
 * Email Typo/Suggestion Plugin
 * Author
 * Versatility Werks (flwebsites.biz)
 *
 * License
 * Copyright (c) 2014 Versatility Werks
 *
 * Licensed under the MIT License.
 *
 * v 1.0
 */
 
$(function(){

;(function($){

$.fn.emailTS = function(options) {

	var emailInput = this;
    
	/* Default Options */
	var defaultOptions = {
		tooltip: true,
		typo: true,
		domains: ['yahoo.com', 'ymail.com', 'live.com', 'mail.com', 'comcast.com', 'comcast.net', 'yahoo.co.uk', 'hotmail.co.uk', 'verizon.net', 'sbcglobal.net', 'att.net', 'embarqmail.com', 'aim.com', 'me.com', 'msn.com', 'hotmail.com', 'gmail.com', 'aol.com'],
		addDomains: ['verswerks.com', 'farfromboring.com', 'nomoreagent.com']
		}
	
	/* Combine user options with default */
	options = $.extend({}, defaultOptions, options);
	
	/* Add domains to defaults */
	options.domains = $.merge(options.domains, options.addDomains);
	  
	$(emailInput).each(function(){
		var thisInput = $(this);
		
		/* START Typo */
		if(options.typo){
		thisInput.on('blur', function(){
			thisInput.mailcheck({ //initialize mailcheck
			domains: options.domains, //add the domains
			suggested: function(element, suggestion) {
				var parentWrap = $(element).parents(':first');
				if(!parentWrap.find('.emailSuggestion').length){
					parentWrap.append("<div class='emailSuggestion'></div>");
				}
				var emailSuggestion = $(element).parents(':first').find('.emailSuggestion');
				emailSuggestion.html("Did you mean: <a href='#' class='changeEmail'>"+suggestion.full+"</a>?").show();
				emailSuggestion.on('click', '.changeEmail', function(e){
					e.preventDefault();
					var changeEmail = $(this);
					var newEmail = changeEmail.html();
					emailSuggestion.hide();
					parentWrap.find('input').val(newEmail);					
				});
			}
			});			
		});
		}
		/* END Typo */
		
		/* START Suggestion */
		if(options.tooltip){
		if(!thisInput.parents('.emailWrap').length){
				thisInput.wrap("<div class='emailWrap'></div>");
				thisInput = $(this);
				thisInput.focus();
			}
		var inputWrap = thisInput.parents(':first');
		
		var suggestionSpan = inputWrap.find('.suggestion');
		if(suggestionSpan.length < 1){
			inputWrap.append("<span class='suggestion'></span>");
			suggestionSpan = inputWrap.find('.suggestion');
		}
			
		thisInput.on('keyup', function() {
			var value = thisInput.val().toLowerCase();
			var a_pos = value.indexOf('@');
			
			if (suggestionSpan) {
				suggestionSpan.hide();
				
				if (a_pos != -1){
						var typed = value.substr(a_pos+1),
							len = typed.length,
							matches = [],
							lastMatches = '';
						
						/* START loop through typed in */
						for(var i = 0; i < len; i++) {
						
						matches[i] = [];
						
						if(i == 0){ lastMatches = options.domains; }else{ lastMatches = matches[i-1]; }
						$.each(lastMatches, function(index, domain){
							if(domain[i] == typed[i]){
								matches[i].push(domain);
							}
						});
						if(matches[i].length == 1 || len-1 == i){
							if(matches[i][0] != typed){ suggestionSpan.text(matches[i][0]).show(); } break;
						}else if(matches[i].length == 0){ break; }
						
						/* END loop through typed in */
						}
						
				}
			}
		});
		
		suggestionSpan.on('click', function(e) {
			e.preventDefault();
			var thisSuggWrap = suggestionSpan.parents(':first');
			thisSuggWrap.find('.emailSuggestion').hide();
			var suggested_val = suggestionSpan.text();
			var input_val = thisInput.val();
			var a_pos = input_val.indexOf('@');
			var before_a = input_val.substr(0, a_pos);
			thisInput.val(before_a + '@' + suggested_val);
			suggestionSpan.hide();
		});
		
		var mouseOver = false;
		suggestionSpan.on('mouseover', function() {
			mouseOver = true;
		}).mouseout(function() {
			mouseOver = false;
		});
		
		thisInput.on('blur', function() {
			if (!(mouseOver)) {
				suggestionSpan.hide();
			}
		});
		
		thisInput.on('keypress', function(e) {
			if (e.keyCode == 13) {
				if (suggestionSpan.is(':visible')) {
					var input_val = thisInput.val();
					var a_pos = input_val.indexOf('@');
					var before_a = input_val.substr(0, a_pos);
					var suggestedEmail = suggestionSpan.text();
					$(this).val(before_a + "@" + suggestedEmail);
					suggestionSpan.hide();
				}
				e.preventDefault();
			}
		});
		
		}
		/* END Suggestion */
		
		
		
	});
	
}
})(jQuery);

});
