var appBitcoin = new Framework7({
	animateNavBackIcon: true // *Removes* back icon animation
});
var $$ = Dom7;
var mainView = appBitcoin.addView('.view-main', {
	domCache: true, // Enable inline pages
	dynamicNavbar: true
});

var frame, // Will be used to put contents of iframe in initsetup for other functions
    loopCaptchaChecked, // setInterval to check Captcha checkbox
    loopCaptchaChallenge; // setInterval to check Captcha challenge

var Bitcoin = {
	setup: {
		getFrame: function() {
			frame = $('iframe').contents();
			Bitcoin.frame = $(frame);
		},
		setFrame: function() {
			setLoginStatus('Connecting…');
			Bitcoin.setup.getFrame();
			setLoginStatus('Checking balance…');
			Bitcoin.info.balance();
			setLoginStatus('Consociating…');
			Bitcoin.setup.framed();
			Bitcoin.frame.find('#free_play_form_button').click(function(){
				setTimeout(function(){
					iAd.prepareInterstitial({
						autoShow: true
					})
				},1500)}
			);
		}
	},
	info: {
		balance: function() {
			$('#topbalance').text(Bitcoin.frame.find('#balance2').text().replace(' BTC',''));
		},
		payout: function() {
			return Bitcoin.frame.find('.payout_time_remaining').text().replace('Days',' days ').replace('Day',' day ').replace('Hours',' hours ').replace('Hour',' hour ').replace('Minutes',' minutes ').replace('Minute',' minute ').replace('Seconds',' seconds;').replace('Second',' second;').split(';')[0];
		}
	}
};

function setLoginStatus (status) {
	$('#loginstatus').text(status);
}

// Go
$(document).ready(function() {

	Bitcoin.setup.setFrame();

	// Stuff to run constantly
	window.setInterval(function() {
		Bitcoin.info.balance(); // keeps balance updated
		Bitcoin.frame.find('.cc_banner-wrapper').remove(); // removes cookies banner
		$('#payouttime').text(Bitcoin.info.payout());
	}, 1000);

	// When iframe changes location, iframe init needs to take place again
	$('#mainiframe').load(function() {
		Bitcoin.setup.setFrame();
		setLoginStatus('Almost there…');
		window.setTimeout(function () {

			setLoginStatus('');

			if (Bitcoin.frame.find('.free_play_claim_button').is(':visible')) {

				// Faucet not opened, iframe is only showing Open Faucet button right now
				$('#loading-block, #mainiframe, #openfaucet-preloader').hide();
				$('#openfaucet').show();

				// Open Faucet list item link
				$('#openfaucet-button').on('click', function() {
					$('#openfaucet-button').off('click'); // disables subsequent clicks
					$('#openfaucet-preloader').show(); // show preloader
					Bitcoin.frame.find('.free_play_claim_button')[0].click(); // click on the button in the iframe
				});

				$('#text-maxwinnings').text(Bitcoin.frame.find('#free_play_payout_table > table tbody tr:last td:last').text().replace(' BTC',''));

			} else if (Bitcoin.frame.find('#free_play_form_button').is(':visible')) {

				// Faucet opened
				$('#loading-block, #openfaucet').hide();
				Bitcoin.frame.find('#free_play_form_button').hide();
				$('#mainiframe').css('height', '100vh').show();

				// every .5 seconds, check if Captcha is checked
				loopCaptchaChecked = setInterval(function() {
					if (Bitcoin.frame.find('iframe[title="recaptcha widget"]').contents().find('.recaptcha-checkbox').attr('aria-checked') == "true") {
						clearInterval(loopCaptchaChecked);
						Bitcoin.frame.find('#free_play_form_button').click();
					}
				}, 500);

			} else {

				$('#loading-block').hide();
				$('#mainiframe').show();

			}

		}, 1000);
	});

	// Button in info page used to check auto withdraw
	$('#checkAutoWithdrawStatus').click(function(){
		if (Bitcoin.frame.find('span#edaw > span').is('.green')) {
			$('#outputAutoWithdrawStatus').removeAttr('style').text('Auto Withdraw is enabled. Your balance will be automatically reset to zero when this occurs.');
		} else {
			$('#outputAutoWithdrawStatus').removeAttr('style').text('Auto Withdraw is disabled. Tap below to enable Auto Withdraw:');
			$('#enableAutoWithdraw').on('click', function(){
				Bitcoin.frame.find('#auto_withdraw').click();
				$(this).off('click').hide();
				$('#outputAutoWithdrawStatus').text('Auto Withdraw is enabled. Your balance will be automatically reset to zero when this occurs.');
			}).show().parent().removeAttr('style');
		}
	});

});

document.addEventListener("deviceready", onDeviceReady, false);
// iAd setup
function onDeviceReady() {
	if (iAd) {
		iAd.createBanner({
			position: iAd.AD_POSITION.BOTTOM_CENTER,
			autoShow: true,
			overlap: false,
			offsetTopBar: true
		});
	}
}

Bitcoin.setup.framed = function() {
	// Formatting
	Bitcoin.frame.find('.adsbygoogle').attr("style", "display: none;");
	Bitcoin.frame.find('#free_play_tab > center, #free_play_tab > br, #wait > p, #switch_to_solvemedia, .large-9 > div[align=center] > center, a[href="javascript:Recaptcha.showhelp()"], .top-bar, div[style="margin-top:25px;text-align:center;margin-bottom:15px;"] > span, p[style="width:80%;"]').remove();
	Bitcoin.frame.find('#free_play_payout_table').hide();
	Bitcoin.frame.find('div[style="margin-top:25px;text-align:center;margin-bottom:15px;"]').contents().filter(function() {return this.nodeType == Node.TEXT_NODE;}).remove();
	Bitcoin.frame.find('.bold.red').parent().remove();
	Bitcoin.frame.find('#free_play_form').find('p:not(:has(select))').remove();
	Bitcoin.frame.find('.row-collapse').css({'margin': '0 auto', 'width': '100%;', 'top': '0'});
	Bitcoin.frame.find('body').css('background','none');
	Bitcoin.frame.find('div[align=center]').first().css({'margin-top': '10px', 'margin-left': '0'});
	Bitcoin.frame.find('.g-recaptcha > div > div').css('width', '290px');
	Bitcoin.frame.find('#free_play_captchas_recaptcha_v2').css({'display': 'block', 'margin-left': '-10px'});
	Bitcoin.frame.find('#free_play_captchas_recaptcha_v1, #free_play_captchas_solvemedia').css('display', 'none');
	Bitcoin.frame.find('#free_play_captcha_types').remove();
	Bitcoin.frame.find('body').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
	Bitcoin.frame.find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
	Bitcoin.frame.find('#free_play_tab').css({'margin': '0', 'padding': '0'});
	Bitcoin.frame.find('div.large-12.columns').css('padding', '0');
	Bitcoin.frame.find('#free_play_form_button, .login_menu_button, .signup_menu_button, #signup_button, #login_button, #free_play_claim_button button, a.button.medium.success').css({'background-color': 'white', 'border-style': 'none', 'color': '#222', 'box-shadow': 'none', 'width': '100vw', 'border-radius': '0', 'font-weight': 'inherit'});
	Bitcoin.frame.find('#signup_button, #login_button').css('width', '80vw');
	Bitcoin.frame.find('#contact_form_error, #create_wallet_error, #double_your_btc_error, #free_play_error, #login_error, #signup_error').css({'font-weight': 'inherit', 'color': 'inherit'});
	Bitcoin.frame.find('#free_play_digits').css({'margin': '50px auto', 'width': '100vw', 'font-weight': 'inherit', 'font-size': '50px'});
	Bitcoin.frame.find('#free_play_result, #free_play_result > div, #free_play_result > div > b, #free_play_result > div > b > span').css({'font-weight': 'inherit', 'background-color': 'lightcyan'});
	Bitcoin.frame.find('#free_play').css('margin-top', '10px');
	Bitcoin.frame.find('#wait').css({'margin-top': '50px', 'background-color': 'lightgoldenrodyellow', 'width': '100vw'});
	Bitcoin.frame.find('fieldset').css({'background': 'none', 'border': 'none', 'padding': '20px 0'});
	Bitcoin.frame.find('a[data-reveal-id="myModal"]').parent().remove();
	Bitcoin.frame.find('a[data-reveal-id=myModal3], a[data-reveal-id=myModal5], a[data-reveal-id=myModal6]').parent().parent().remove();
	Bitcoin.frame.find('input[name=referrer]').parent().parent().hide();
	Bitcoin.frame.find('.pricing-table, .pricing-table li, .pricing-table li span').css({'border': 'none', 'background': 'none', 'font-weight': 'inherit'}).find('li[class=title]').remove();
	Bitcoin.frame.find('p.free_play_claim').remove();
	Bitcoin.frame.find('a.button.medium.success').text('Open Faucet').parents().eq(1).find('p:first').remove();
	Bitcoin.frame.find('#free_play_result div.bold.center.green a').replaceWith($('<span>two lottery tickets</span>'));
	Bitcoin.frame.find('.hasCountdown').css({'border': '0', 'background-color': 'inherit'});
	// New home
	Bitcoin.frame.find('#new_home').removeAttr('style');
	Bitcoin.frame.find('#new_home p.bold').remove();
	Bitcoin.frame.find('#signup_form_div fieldset, #login_form_div fieldset').css({'background':'none', 'box-shadow':'none', 'padding': '20px'});
	Bitcoin.frame.find('label').css('font-weight','initial');
	Bitcoin.frame.find('.fa-stack').remove();
	Bitcoin.frame.find('.fa-stack, #features, #home_bitcoin ~ div, #home_bitcoin, .cc_banner-wrapper').remove();
	Bitcoin.frame.find('.columns, .row').css({'padding': '0', 'margin': '0'});
	Bitcoin.frame.find('#free_play_form_button').parent().parent().css('margin-top','25px');
	Bitcoin.frame.find('.free_play_claim_button').parent().parent().css('margin-top','70px');
	Bitcoin.frame.find('button[data-reveal-id="myModal17"]').parent().hide();
	// iPad
	Bitcoin.frame.find('.show-for-medium-up').remove();
	Bitcoin.frame.find('.show-for-small').removeClass('show-for-small');
	Bitcoin.frame.find('#signup_form_div').parent().css('width', '100vw');
	Bitcoin.frame.find('#login_form_btc_address').attr('type', 'email');
	// reCAPTCHA
	Bitcoin.frame.find('iframe[title="recaptcha widget"]').contents().find('.rc-anchor-pt').css('visibility', 'hidden');
	Bitcoin.frame.find('iframe[title="recaptcha challenge"], iframe[title="recaptcha widget"]').contents().find('html').css({'-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-user-select': 'none'});
	Bitcoin.frame.find('iframe[title="recaptcha challenge"]').contents().find('.rc-report-problem-text, .audio-button-holder, .image-button-holder, .help-button-holder').css('visibility', 'hidden');
};