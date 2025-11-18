'use strict';

/*------------------------------------
  HT PreLoader
--------------------------------------*/
function preloader() {
  $('#ht-preloader').fadeOut();
};
/*------------------------------------
  HT Create jquery events
--------------------------------------*/
function event(property,events,link, responseProperty,responseType) {
    $(property).on(''+events,function () {
    var val = $(property).val();

    if (responseType == 1) {
      $(responseProperty).html('<div class="spinner-border text-primary"></div>');

    }
    if (responseType == 3) {
    var oldClass = property.slice(0, -1);
    var oldval = $(oldClass).val();
    if (val != oldClass ) {
      return $(responseProperty).html('<div class="text-dark h6"><span class = "text-danger fa fa-times"></span>passwords do not match</div>');
    }else {
      return $(responseProperty).html('<div class="text-dark h6"><span class = "text-success fa fa-check"></span>passwords match</div>');
    }
    }

    $.post('handlers/ajax/'+link,{value: val}).done(function (data) {
    if (responseType == 1) {
      $(responseProperty).html(data);
    }else {
      $(responseProperty).find('option').remove().end();
      var region = jQuery.parseJSON(data);
                   region.forEach((item) => {
                   $(responseProperty).append('<option value="'+item.id+'">'+item.region+'</option>');
                 });



    }
    });

    });
    }
    /*------------------------------------
      HT resend Email code
    --------------------------------------*/
    function resend_token(username, token) {
      $.post('handlers/ajax/resend_token',{username: username, token:token}).done(function (data) {

          $('resend_token_response').html(data);





        });
    }
    /*------------------------------------
      HT Create Form events
    --------------------------------------*/
    function formEvent(formName,link,button,buttonText,response) {

      // when the form is submitted
      $(''+formName).on('submit', function (e) {

      // if the validator does not prevent form submit
      if (!e.isDefaultPrevented()) {
          var url ='handlers/ajax/'+link;
          $(''+button).attr("disabled", true);
          $(''+button).html("<span><i class='spinner-border text-light'></i>&nbsp;Loading....</span>");
          // POST values in the background the the script URL
          $.ajax({
              type: "POST",
              url: url,
              data: new FormData(this),
              contentType: false,
                cache: false,
                    processData:false,
              success: function (data)
              {
                if (formName == 'login-form') {
                  if (data == false) {
                  $(''+response).html(data);
                  }else{
                  $(''+formName).html(data);
                  }
                }else{
                  $(''+response).html(data);
                }
                $(''+button).removeAttr("disabled");
                $(''+button).html(''+buttonText);

                  // empty the form

            }
          });
          return false;
      }
    });
    }
// HT function onload
function popup() {
    var id = '#dialog';

    //Get the screen height and width
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    //Set heigth and width to mask to fill up the whole screen
    $('#mask').css({'width':maskWidth,'height':maskHeight});

    //transition effect
    $('#mask').fadeIn(500);
    $('#mask').fadeTo("slow",0.9);

    //Get the window height and width
    var winH = $(window).height();
    var winW = $(window).width();

    //Set the popup window to center
    $(id).css('top',  winH/2-$(id).height()/2);
    $(id).css('left', winW/2-$(id).width()/2);

    //transition effect
    $(id).fadeIn(2000);

//if close button is clicked
$('.window .close').click(function (e) {
    //Cancel the link behavior
    e.preventDefault();

    $('#mask').hide();
    $('.window').hide();
});

//if mask is clicked
$('#mask').click(function () {
    $(this).hide();
    $('.window').hide();
});

}
/*------------------------------------
  HT Window load and functions
--------------------------------------*/
$(document).ready(function() {

    event('#country','change','form/getStates','#states',2 ),
    event('#form_user','keyup','form/getUsername','.form_user',1 ),
    event('#form_email','keyup','form/getEmail','.form_email',1 ),
    // event('#form_password','keyup','form/passwordVerify','.form_password',1 ),
    formEvent('#register-form','form/signupHandler','.submitButton','Submit','.messages'),
    formEvent('#recover-form','form/recoverHandler','.submitButton','Recover','.messages'),
    formEvent('#password-form','form/passwordchange','.submitButton','Change','.messages'),
    formEvent('#password-form','form/passwordchange','.submitButton','Submit','.messages'),
    formEvent('#twofa-form','form/twofa','.twofa-Button','Submit','.twofa-messages'),
    formEvent('#login-form','form/signinHandler','.submitButton','Login','.messageslogin');
    // formEvent('#login-form','form/signinHandler','.loginbtn','login','.messageslogin');



    ;});


    $(function(){

        if(!localStorage.getItem("visted")){
            popup();
            localStorage.setItem("visted",true);
         }

    })


    $(window).on('load', function() {
      preloader();
  });
