<?php 
session_start();

?>
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2">
      <title>Aim&amp;Drive</title>
      <link href="https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,600,700" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="css/bootstrap.css">
      <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
      <link rel="stylesheet" type="text/css" href="css/jquery.multiselect.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.css" />
      <link rel="stylesheet" type="text/css" href="css/eternal.css">
      <link rel="stylesheet" type="text/css" href="css/cs3-adds.css">
      <link rel="stylesheet" type="text/css" href="css/measure_define.css">
      <link rel="stylesheet" type="text/css" href="css/clockpicker.css" />
      <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
      <link type="text/css" href="css/OverlayScrollbars.css" rel="stylesheet"/>
      <link rel="stylesheet" type="text/css" href="css/mystyle.css">
      <link rel="stylesheet" type="text/css" href="css/login.css">
      <link href="css/style.css" rel="stylesheet" type="text/css">
      <link href="https://rawgit.com/bevacqua/dragula/master/dist/dragula.css" rel="stylesheet">
      <link href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/3.1.2/css/fixedHeader.dataTables.min.css">
      <link href="https://cdn.datatables.net/buttons/1.5.1/css/buttons.dataTables.css" rel="stylesheet" type="text/css" />
      <link href="css/purejscarousel.css" rel="stylesheet">
      <link href="css/cor-style.css" rel="stylesheet">
      <link rel="stylesheet" type="text/css" href="css/background.css">
      <link href="css/highcharts-custom.css" rel="stylesheet" type="text/css">

      <style>
         .amcharts-main-div a{ display:none!important;}
      </style>
      
      <style>
         .activeBtn {
         background: #3291d6 none repeat scroll 0 0;
         color: #ffffff;
         outline: 0 none;
         }
      </style>
      
      <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
   </head>
   <body>
   
      <div id="prelogin-body">
         <div class="container-fluid">
            <div class="row">
               <!-- left sec -->
               <div class="col-lg-6 col-sm-6 col-sm-6 login_bg">
                  <div class="login_left_sec">
                     <img src="images/logo_big.png" alt="logo"/>
                     <div class="overview">
                        Formula Driven <br/>Cost Management Process<br/> for all your projects.
                     </div>
                     <section class="powerdby_wrp">
                        <span class="title">Powered by the</span>
                        <img src="images/company_logo.png" alt="logo" />
                     </section>
                  </div>
               </div>
               <!-- right sec -->
               <div class="col-lg-6 col-sm-6 col-sm-6 login_right_sec">
                  <div class="login_form_container">
                     <h4 class="page_head">Login</h4>
                     <div class="form_wrp">
                        <div class="input_wrp">
                           <input type="text" class="textbox" name="email" id="email" required id="" onkeyup="">
                           <label class="input_label floating_label">Email</label>
                        </div>
                        <div class="input_wrp">
                           <input type="password" name="password" id="password" class="textbox" required />
                           <label class="input_label floating_label">Password</label>
                        </div>
                        <div id="loginstatus">
                        </div>
                        <div class="form_footer">
                           <button data-toggle="modal" data-target="#forgotpassword_modal" class="btn btn-link link_forgot_pwd">Forgot password</button>
                           <input type="submit" value="Login" onClick="login()" class="submit_btn acc_submit_btn" id="login_submit">
                        </div>
                        <?php if(isset($_SESSION['message'])):?>
                        <div class="alert alert-danger mt-2" style='margin-top:10px'><?php echo $_SESSION['message']; ?></div>
                        <?php session_destroy();endif;?>
                     </div>
                  </div>
                  <footer class="text-center login_footer">
                     &copy; 2017 Anklesaria Group. All rights reserved
                  </footer>
               </div>
            </div>
         </div>
      </div>
      <div id="postlogin-body" >
         <div class="header_wrp">
            <div id="mainheader"></div>
            <div id="pagenavbar"></div>
         </div>
         <div id="startupstatus"></div>
         <div class="main_wrapper">
            <div class="mainbody" id="mainbody">
               <div id="pagecontent"></div>
            </div>
         </div>
         
      </div>
      <!---------------------------------- Footer ---------------------------------->
      <!----  feedback message --->
      <div id="wait" onClick="clearDisplayArea('');" class="msgclass"><span class="msgimg"><img src='images/ajax_wait.gif' width="32" height="32" /></span><span class="errimg"><img src='images/errorimage.png' width="32" height="32" /></span><span id="waitmsg" class="msgcont"> </span></div>
      <?php include "modals.php"; ?>
      <!----------------------------- js ----------------------------->
      <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
      <!-- Minified version of `es6-promise-auto` below. -->
    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
      <!-- <script type="text/javascript" src="https://code.jquery.com/jquery-1.10.2.js"></script> -->
      <!-- <script type="text/javascript" src="js/jquery.js"></script> -->
      <script type="text/javascript" src="js/jquery.overlayScrollbars.js"></script>
    
      <script type="text/javascript" src="js/bootstrap.min.js"></script>
      <script src="js/purejscarousel.js"></script>
      <script src="js/dragulla.js"></script>
      <script type="text/javascript" src="js/enscroll-0.6.1.min.js"></script>
      <script src="js/1.11.4_ui.js"></script>
      <script src="https://cdn.ckeditor.com/4.7.0/standard-all/ckeditor.js"></script>
      <!-- Include Date Range Picker -->
      
      <!-- <script type="text/javascript" src="js/datepicker.js"></script> -->
      <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.js"></script>
      <script type="text/javascript" src="js/clockpicker.js"></script>
      <script type="text/javascript" src="js/cust_multiselect.js"></script>
      <script type="text/javascript" src="js/canvasjs.min.js"></script>
      <!--			<script src="select_js/jquery.min.js"></script>
         -->
      <!--[if IE 8]><script src="js/es5.js"></script><![endif]-->
      <script src="https://www.chartjs.org/dist/2.7.2/Chart.bundle.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.5.0"></script>
      <script src="js/amcharts.js" type="text/javascript"></script>
      <script src="js/pie.js" type="text/javascript"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.17.0/jquery.validate.min.js"></script>
      <script src="https:////cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"></script>
      <script src="https://cdn.datatables.net/buttons/1.5.1/js/dataTables.buttons.js"></script>
      <script src="https://cdn.datatables.net/buttons/1.2.2/js/buttons.html5.js"></script>
      <script src="https://cdn.datatables.net/buttons/1.5.1/js/buttons.colVis.min.js"></script>
      <script src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.print.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script> 
      <!-- Required to convert named colors to RGB -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.4/rgbcolor.min.js"></script>
      <!-- Optional if you want blur -->
      <script src="https://cdn.jsdelivr.net/npm/stackblur-canvas@^1/dist/stackblur.min.js"></script>
      <!-- Main canvg code -->
      <script src="https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js"></script>
      <script src="js/html2pdf.js" type="text/javascript"></script>
      <script src="https://code.highcharts.com/highcharts.js"></script>
      
      <script type="text/javascript" src="exitdesign13.js?<?php echo time()?>"></script>
    <!--Start of Tawk.to Script-->

<script type="text/javascript">

var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();

(function(){

var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];

s1.async=true;

s1.src='https://embed.tawk.to/5e575cfc298c395d1cea0966/default';

s1.charset='UTF-8';

s1.setAttribute('crossorigin','*');

s0.parentNode.insertBefore(s1,s0);

})();

</script>

<!--End of Tawk.to Script-->
      <script>
      Chart.plugins.unregister(ChartDataLabels);
         Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
    color: '#fff'
});
Chart.defaults.global.plugins.datalabels.display = function(ctx) {
    return ctx.dataset.data[ctx.dataIndex] !== 0;
}
         if(document.getElementById('cdModalContent') !== null) {
         	$("#cdModalContent").draggable({
         			containment: "document", // possible values: "parent", "document", "window".
         			handle: ".drag_handle",
         			scroll: false
         	});
         }
         
           $("#ceModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#pcModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#siModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#initModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#smModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#asmModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#ssmModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#bmModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#rmModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#pnModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#uvModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#ratModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#gmModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#mcModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#mymModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#dcModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#projModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#dc2Modal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#scopeModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#datesModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#estimatesModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#sessionModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#tasksModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#companyModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#employeeModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#filesModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#partsModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#actionModal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#dcModal3").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });


           $("#undrop_modal_ss").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });


           $("#reopen_modal_ss").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#unselect_modal").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
           $("#drop_modal_ss").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });

           $("#unselect_modal_ss").draggable({
               containment: "document", // possible values: "parent", "document", "window".
               handle: ".drag_handle",
               scroll: false
           });
         
         
         
         // driverfilter
         
         //filter
         $('#driverFilter').change(function(){
         var trs = $('.cd_item');
         if(this.value == ''){ // Show All Records
         	 trs.show();
         	 var $rows = $('.cd_item');
         }else{ // Show Records as keycost
            var $el = $('.'+this.value);
            trs.not($el).hide();
            $el.show();
         }
         $('.add_cost_driver').show();
         });
         
         //enscroll (custom scroll)
         
         $('.cus_scroll').enscroll({
         horizontalScrolling: false,
         addPaddingToPane:false,
         verticalTrackClass: 'vertical-track2',
         verticalHandleClass: 'vertical-handle2',
         //horizontalTrackClass: 'horizontal-track2',
         //horizontalHandleClass: 'horizontal-handle2',
         //cornerClass: 'corner2'
         });
         
         // $('div.purejscarousel-slides-container').children().hide();
            $('.add_cost_driver').show();
         
         // cd item option btn click open dropdown
         $(".cd_item .opt_btn").click(function(){
         if ($(this).parent().find('.opt_btn_wrp').css('display') == 'none') {
         	$('.cd_item').removeClass('add_cdstyle');
         	$('.opt_btn_wrp').hide();
         	$(this).parent().find('.opt_btn_wrp').toggle();
         	$(this).closest(".cd_item").toggleClass('add_cdstyle');
         } else {
         	$('.cd_item').removeClass('add_cdstyle');
         	$('.opt_btn_wrp').hide();
         }
         });
         
         //show estimated values(slider_1)
         $("#show_est_val_1").click(function(){
         $("#show_est_val_1").text('Hide estimated values');
         $("#carousel_1 .est_values_wrp").toggleClass('d-block');
         $("#carousel_1 .cd_item").toggleClass('item_collapse');
         $(".slider_1 .crit_cost_wrp").toggleClass('item_collapse');	// expand cd item
         $(".slider_1 .strag_opt").toggleClass('strag_opt_collapse');	// stragic option position chnge
         //chnage text
         if($(".cd_item" ).hasClass("item_collapse")){
         	$("#show_est_val_1").html('Hide estimated values <i class="fa fa-angle-up" aria-hidden="true"></i>');
         }
         else{
         	$("#show_est_val_1").html('Show estimated values <i class="fa fa-angle-down" aria-hidden="true"></i>');
         }
         });
         
         //show estimated values (slider_2)
         $("#show_est_val_2").click(function(){
         $("#show_est_val_2").text('Hide estimated values');
         $("#carousel_2 .est_values_wrp").toggleClass('d-block');
         $("#carousel_2 .cd_item").toggleClass('item_collapse');
         $(".slider_2 .crit_cost_wrp").toggleClass('item_collapse');
         $(".slider_2 .strag_opt").toggleClass('strag_opt_collapse');	// stragic option position chnge
         
         //chnage text
         if($(".cd_item" ).hasClass("item_collapse")){
         	$("#show_est_val_2").html('Hide estimated values <i class="fa fa-angle-up" aria-hidden="true"></i>');
         }
         else{
         	$("#show_est_val_2").html('Show estimated values <i class="fa fa-angle-down" aria-hidden="true"></i>');
         }
         });
         
         
         //show estimated values (slider_3)
         $("#show_est_val_3").click(function(){
         $("#show_est_val_3").text('Hide estimated values');
         $("#carousel_3 .est_values_wrp").toggleClass('d-block');
         $("#carousel_3 .cd_item").toggleClass('item_collapse');
         $(".slider_3 .crit_cost_wrp").toggleClass('item_collapse');
         $(".slider_3 .strag_opt").toggleClass('strag_opt_collapse');	// stragic option position chnge
         
         //chnage text
         if($(".cd_item" ).hasClass("item_collapse")){
         	$("#show_est_val_3").html('Hide estimated values <i class="fa fa-angle-up" aria-hidden="true"></i>');
         }
         else{
         	$("#show_est_val_3").html('Show estimated values <i class="fa fa-angle-down" aria-hidden="true"></i>');
         }
         });
         
         //show strategic option(slider_1)
         $("#show_stag_opt_1").click(function(){
         $('body').toggleClass('noscroll');	// hide vertical scroll of body
         $(".slider_controls").toggle();// hide slider controls
         $("#destroy-carousel-default").toggle();// hide grid mode
         
         
         $("#carousel_1 .strag_opt").toggleClass('stag_collapse');
         $(".strag_opt").toggle();//	 strag  clck menu
         $("#load_stag_opt").toggle();// load strag option with scroll
         $(".slider_2").toggle(); // slider 2
         $(".slider_3").toggle(); // slider 3
         
         //chnage text
         if($(".strag_opt" ).hasClass("stag_collapse")){
         	$("#show_stag_opt_1").html('Hide strategic options <i class="fa fa-angle-up" aria-hidden="true"></i>');
         }
         else{
         	$("#show_stag_opt_1").html('Show strategic options <i class="fa fa-angle-down" aria-hidden="true"></i>');
         }
         });
         
         $(".cd_item").hover(function(){
         $('body').toggleClass('noscroll');	// hide vertical scroll of body
         });
         
         //stag option btn click open dropdown
         $(".stag_item .opt_btn").click(function(){
          if ($(this).parent().find('.opt_btn_wrp').css('display') == 'none') {
         	$('.stag_item').removeClass('add_stag_border');
         	$('.opt_btn_wrp').hide();
         	$(this).parent().find('.opt_btn_wrp').toggle();
         	$(this).closest(".stag_item").toggleClass('add_stag_border');
         } else {
         	$('.stag_item').removeClass('add_stag_border');
         	$('.opt_btn_wrp').hide();
         }
         
         });
         
         //starg tem opt_btn function
         //mark active_strategy on click opt_wrp btn list
         $(".stag_item .implement_btn").click(function(){
         	$(this).closest(".stag_item").toggleClass('mark_stag_imp'); /* add class when when implement actoin is click */
         	$(this).closest(".stag_item").find(".opt_btn").toggleClass('active_action'); /* add class when when implement actoin is click */
         });
         
         // stag_modal submit btn color
          function isStagvaltext() {
         	stagdescSaveBtn();
         }
         
         function stagdescSaveBtn() {
         	var inputstagdesc = $('#input_stagdesc').val();
         	$('#stag_item_submit').removeClass('activeBtn');
         	if (inputstagdesc) {
         		$('#stag_item_submit').addClass('activeBtn');
         	}
         }
         
         // edit stag_item
          function editStagitem(editstag) {
         	$('#stag_item_modal').modal('show');
         	$('.stagmodal_title').text('Edit Strategic Option');
         	$('.opt_btn_wrp').hide();
         }
         
         $('.open_stag_modal').click(function(){
         	 $('.stagmodal_title').text('Add Strategic Option');
         });
         
         // delete stag_item
         function deleteStagitem(delstag) {
         	$('.opt_btn_wrp').hide();
         	$('#del_confirm_modal').modal('show');
         	var deletedrowid = delstag.closest('.stag_item').attr('id');
         	$('#deleterowid').val(deletedrowid);
         }
         
         $("#del_submit").click(function(){
         	$('#del_confirm_modal').modal('hide');
         	var deleteRow = $('#deleterowid').val();
         	// Delete for workplan
         	$('#'+deleteRow).hide();
         	if($('.strag_opt_list li:visible').length == 0) {
         		//$('.info_block').show();
         	}
         });
         
         //  cd item opt_btn function
           function measureImapact(imapctVal){
               if(imapctVal.closest('.cd_action_btn').find('.mark_impact').hasClass('d-block')) {
                   imapctVal.closest('.cd_action_btn').find('.mark_impact').removeClass('d-block');
               }else{
                   imapctVal.closest('.cd_action_btn').find('.mark_impact').addClass('d-block');
               }
           }
           function measureKeycost(keyCostVal){
               if(keyCostVal.closest('.cd_action_btn').find('.mark_keycost').hasClass('d-block')) {
                   keyCostVal.closest('.cd_action_btn').find('.mark_keycost').removeClass('d-block');
                   keyCostVal.closest('.bottom_sec').find('.process_value').removeClass('critical_bg');
         	keyCostVal.closest('.cd_item').removeClass('keycost');
               }else{
                   keyCostVal.closest('.cd_action_btn').find('.mark_keycost').addClass('d-block');
                   keyCostVal.closest('.bottom_sec').find('.process_value').addClass('critical_bg');
         	keyCostVal.closest('.cd_item').addClass('keycost'); // add class when cd item is marked as key cost driver
               }
           }
           function measureEternal(eternalVal){
         
           }
           function editMeasure(edittask) {
              console.trace();
               $('#cost_driver_modal').modal('show');
               $('.measuretitle').text('Edit Cost Driver');
               $('.opt_btn_wrp').hide();
               $('.cd_item').removeClass('add_cdstyle');
           }
           function deleteMeasure(deleteVal) {
               $('.opt_btn_wrp').hide();
               $('.cd_item').removeClass('add_cdstyle');
               $('#del_confirm_modal').modal('show');
               var deletedrowid = deleteVal.closest('.cd_item').attr('id');
               $('#deleterowid').val(deletedrowid);
           }
           $("#del_submit").click(function(){
               $('#del_confirm_modal').modal('hide');
               var deleteRow = $('#deleterowid').val();
         
               // Delete for task
               $('#'+deleteRow).hide();
           });
           function measuretext() {
               changeSaveBtn();
           }
           function changeSaveBtn() {
               var numerator = $('#numerator').val();
               var denominator = $('#denominator').val();
               var process = $('#process').val();
               var currentVal = $('#currentVal').val();
               var targetVal = $('#targetVal').val();
         
               $('.submit_btn').removeClass('activeBtn');
               if (numerator && denominator && process && currentVal && targetVal) {
                   $('.submit_btn').addClass('activeBtn');
               }
           }
           function openPopUp(sliderType) {
               $('#slidertype').val(sliderType);
               $('.measuretitle').text('Add Cost Driver');
           }
           
           // option dropdown close on click outside
           $(document).on("click", function(event){
               var $trigger = $(".opt_btn");
               if($trigger != event.target && $(event.target).find(".opt_btn_wrp:visible").length > 0 ) {
                   $('.opt_btn_wrp').hide();
                   $('.cd_item').removeClass('add_cdstyle');
         	$('.stag_item').removeClass('add_stag_border');
               }
           });
      
         $("#password").keypress(function(event){
         if(event.keyCode == 13){
         $("#login_submit").click();
         }
         });
         
         // ck editor
         CKEDITOR.replace( 'editor1', {
         contentsCss : 'css/editor.css',
         //height: 250,
         
         toolbarLocation: 'bottom',
         removePlugins: 'elementspath,resize',
         extraPlugins: 'colorbutton,colordialog',
         uiColor: '#ffffff',
         // Define the toolbar groups as it is a more accessible solution.
         toolbarGroups: [
         {"name":"basicstyles","groups":["basicstyles"]},
         {"name":"paragraph","groups":["list","blocks"]},
         {"name": "colors" },
         //{"name":"links","groups":["links"]},
         //{"name":"document","groups":["mode"]},
         //{"name":"insert","groups":["insert"]},
         //{"name":"styles","groups":["styles"]},
         //{"name":"about","groups":["about"]}
         ],
         // Remove the redundant buttons from toolbar groups defined above.
         removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Spevaluealchar,links,paragraph,document,about,'
         }).on('key',
               function(e){
                   setTimeout(function(){
                       var isrationale = e.editor.getData().length;
                       $('#rationale_submit').removeClass('activeBtn');
                       if(isrationale) {
                           $('#rationale_submit').addClass('activeBtn');
                       }
                   },10);
               }
           );
         
         // Rationale script
         var rationalerows = 1;
         var goalrows = 1;
         
         $('#openmodal').click(function(){
         $('.opt_btn_wrp').hide();
         $("#rationaletype").val('');
         $('.rationaletitle').text('Add Rationale');
         });
         
         $("#rationale_submit").click(function(){
           $('.rationale_txt_data').addClass('rationalecopy');
         $('#rationale_modal').modal('hide');
         $('#openmodal').hide();
           $('.opt_btn_wrp').hide();
         $('.info_block').hide();
           var rationaleType = $("#rationaletype").val();
           if(rationaleType != 'edit') {
               $('.rationalecopy').clone().appendTo("#rationaleClones");
               $('#rationaleClones').find(".rationale_txt_data").show();
               //$('#rationaleClones').find(".rationale_txt_data").removeClass('rationalecopy');
               $('.rationale_txt_data').removeClass('rationalecopy');
               $('#rationaleClones').find("div:last-child").attr('id','rationale'+rationalerows);
               rationalerows++;
           }
         });
         function editRationale() {
           $('.opt_btn_wrp').hide();
           $(document).ready(function(){
               $('input[type="submit"]').attr('disabled','disabled');
               var e = CKEDITOR.instances['editor1'];
               e.on("change", function(e) {
               var prevent_submit = CKEDITOR.instances['editor1'].getData();
               
                   if(prevent_submit != ''){
                       $('input[type="submit"]').attr('disabled',false);
                   }
               });
           });
           $('#rationale_modal').modal('show');
           CKEDITOR.instances.editor1.setData(document.getElementById("rationaleText").innerHTML);
         $('.rationaletitle').text('Edit Rationale');
           $('#rationaletype').val('edit');
         }
         function deleteRationale(delRationale) {
           $('.opt_btn_wrp').hide();
           $('#del_confirm_modal').modal('show');
           var deletedrowid = delRationale.closest('.rationale_txt_data').attr('id');
           $('#deleterowid').val(deletedrowid);
           $('#deletetype').val('rationale');
         }
         $("#del_submit").click(function(){
           $('#del_confirm_modal').modal('hide');
           var deleteRow = $('#deleterowid').val();
           var deletetype = $('#deletetype').val();
           if(deletetype == 'rationale') {
               // Delete for rationale
               $('#'+deleteRow).remove();
               if($('#rationaleClones').children().length == 0) {
                   $('.info_block').show();
                   $('#openmodal').show();
               }
               delRationale.closest('.rationale_txt_data').remove();
               if($('#rationaleClones').children().length == 0) {
                   $('.info_block').show();
                   $('#openmodal').show();
               }
           } else {
               // Delete for goal
               $('#'+deleteRow).remove();
               if($('#goaldataClone tr').length == 2) {
                   $('.no_data_row').show();
               }
           }
         });
         
         function Rationaleoption(ratOpn) {
            var isoptionOpen = ratOpn.parent().find('.opt_btn_wrp').css('display');
            if (isoptionOpen == 'none') {
               $('.opt_btn_wrp').hide();
               ratOpn.parent().find('.opt_btn_wrp').toggle();
           } else {
               ratOpn.parent().find('.opt_btn_wrp').toggle();
        
           }
         }

         function RationaleoptionAlt(ratOpn) {
             localStorage.setItem('toggleId', ratOpn);
            if ( $('#'+ratOpn).css('visibility') == 'hidden' ){
                $('.verifydropdown').css('visibility','hidden');
                $('.reducedropdown').css('visibility','hidden');
                $('#'+ratOpn).css('visibility','visible');
            }else
                $('#'+ratOpn).css('visibility','hidden');
         }
         
         
         // option btn click open dropdown
         function Milstoneoption(ratOpn) {
           var isoptionOpen = ratOpn.parent().find('.opt_btn_wrp').css('display');
           
           if (isoptionOpen == 'none') {
               $('.opt_btn_wrp').hide();
               ratOpn.parent().find('.opt_btn_wrp').toggle();
           } else {
               ratOpn.parent().find('.opt_btn_wrp').toggle();
           }
         }
         
         // Goal script
         
         $("#goal_submit").click(function(){
         $('#goals_modal').modal('hide');
         //$('.goal_data').show();
         $('.no_data_row').hide();
           var seperateGoal = 'no';
           if($('#checkboxG6').prop("checked") == true){
               var seperateGoal = $('#checkboxG6').val();
           }
           var isSepGoals = 1;
           var isseperateGoals = $('#goaldescription').val();
           var eachLine = isseperateGoals.split('\n');
           if (eachLine.length > 0 && seperateGoal == 'yes') {
              isSepGoals = eachLine.length;
           }
         
           var goalType = $("#goaltype").val();
           if (goalType != 'edit') {
               for(var i = 0; i < parseInt(isSepGoals); i++) {
                   if ((seperateGoal == 'yes' && eachLine[i] && eachLine[i] != '') || (seperateGoal == 'no')) {
                       $(".goaldatacopy" ).clone().appendTo("#goaldataClone");
                       $('#goaldataClone').find(".goal_data").show();
                       $('#goaldataClone').find(".goal_data").removeClass('goaldatacopy');
                       $('#goaldataClone').find("tr:last-child").attr('id','goal'+goalrows);
                       goalrows++;
                   }
               }
           }
         });
         function isGoalDesc(isGoal) {
           var goalDesc = isGoal.val();
           var goalOpern = $('#goalOperation').val();
           $('#goal_submit').removeClass('activeBtn');
           if (goalDesc && goalOpern) {
               $('#goal_submit').addClass('activeBtn');
           }
         }
         function isGoalOperation(isopern) {
           var goalDesc = $('#goaldescription').val()
           var goalOpern = isopern.val();
           $('#goal_submit').removeClass('activeBtn');
           if (goalDesc && goalOpern) {
               $('#goal_submit').addClass('activeBtn');
           }
         }
         
           function goalDataOption(goalOpn) {
               var isoptionOpen = goalOpn.parent().find('.opt_btn_wrp').css('display');
               goalOpn.parent().find('.opt_btn_wrp').removeClass('opt_btn_wrp_top');
         
               if (isoptionOpen == 'none') {
                   $('.opt_btn_wrp').hide();
                   //if ((main - $(goalOpn).offset().top) < 100) {
                   if ($(goalOpn).offset().top > ($(window).scrollTop() + $(window).height() - 100)) {
                       goalOpn.parent().find('.opt_btn_wrp').addClass('opt_btn_wrp_top');
                       goalOpn.parent().find('.opt_btn_wrp').toggle();
                   }
                   else {
                       goalOpn.parent().find('.opt_btn_wrp').toggle();
                   }
               } else {
                   goalOpn.parent().find('.opt_btn_wrp').toggle();
               }
         }
         
         function editGoal(editgoal) {
           $('.opt_btn_wrp').hide();
           $('.goaltitle').text('Edit Goals');
           $('#goals_modal').modal('show');
           $('#goaltype').val('edit');
         }
         
         
         $('.goal_table').on('click', 'tr:not(:first-child)', function() {
           editGoal($(this));
         });
         
         $('.goal_table').on('click', 'td:last-child', function(e) {
           e.stopPropagation();
         });
         
         function deleteGoal(delgoal) {
           $('.opt_btn_wrp').hide();
           $('#del_confirm_modal').modal('show');
           var deletedrowid = delgoal.closest('.goal_data').attr('id');
           $('#deleterowid').val(deletedrowid);
           $('#deletetype').val('goal');
         }
         
         // option dropdown close on click outside
         $(document).on("click", function(event){
           var $trigger = $(".opt_btn");
           if($trigger != event.target && $(event.target).find(".opt_btn_wrp:visible").length > 0 ) {
               $('.opt_btn_wrp').hide();
           }
         });
         
         CKEDITOR.replace( 'editor2', {
         contentsCss : 'css/editor.css',
         //height: 250,
         
         toolbarLocation: 'bottom',
         removePlugins: 'elementspath,resize',
         extraPlugins: 'colorbutton,colordialog',
         uiColor: '#ffffff',
         // Define the toolbar groups as it is a more accessible solution.
         toolbarGroups: [
         {"name":"basicstyles","groups":["basicstyles"]},
         {"name":"paragraph","groups":["list","blocks"]},
         {"name": "colors" },
         //{"name":"links","groups":["links"]},
         //{"name":"document","groups":["mode"]},
         //{"name":"insert","groups":["insert"]},
         //{"name":"styles","groups":["styles"]},
         //{"name":"about","groups":["about"]}
         ],
         // Remove the redundant buttons from toolbar groups defined above.
         removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar,links,paragraph,document,about,'
         }).on('key',
               function(e){
                   setTimeout(function(){
                       var isrationale = e.editor.getData().length;
                       $('#scope_submit').removeClass('activeBtn');
                       if(isrationale) {
                           $('#scope_submit').addClass('activeBtn');
                       }
                   },10);
               }
           );
         
         
           function editScope(editscope) {
           $('#scope_modal').modal('show');
           CKEDITOR.instances.editor2.setData(document.getElementById("projscope").innerHTML);
           $('.scope_modaltitle').text('Edit Scope');
           $('.opt_btn_wrp').hide();
         }
         
         $(".opt_btn").click(function(){
         if ($(this).parent().find('.opt_btn_wrp').css('display') == 'none') {
         //	$('.cd_item').removeClass('add_cdstyle');
         $('.opt_btn_wrp').hide();
         $(this).parent().find('.opt_btn_wrp').toggle();
         //	$(this).closest(".cd_item").toggleClass('add_cdstyle');
         } else {
         //$('.cd_item').removeClass('add_cdstyle');
         $('.opt_btn_wrp').hide();
         }
         });
         
         
         $(".date-picker").datepicker({
         dateFormat: 'yy-mm-dd',
         changeMonth: true,
         changeYear: true,
         altField: "#idTourDateDetailsHidden",
         altFormat: "yy-mm-dd",
         autoclose: true,
         todayHighlight: true,
         toggleActive: false
         });
         
         $(".date-picker").on("change", function () {
         var id = $(this).attr("id");
         var val = $("label[for='" + id + "']").text();
         $("#msg").text(val + " changed");
         });
         
         function editDate(i) {
           editingMilestone = Gcurrentdata[Gmilesindex][i][0];
           $('#dates_modal').modal('show');
           document.getElementById("input_milestone").value = Gcurrentdata[Gmilesindex][i][1];
           // alert("Milestone : " + Gcurrentdata[Gmilesindex][i][2]);
           setDate("date_milestone", Gcurrentdata[Gmilesindex][i][2]);
           deactivateButton("date_submit");
           $('.dates_modaltitle').text('Edit Project Milestone');
           $('.opt_btn_wrp').hide();
         }
         
         function deleteDate(i) {
           deleteMilestone (i);
           editingMilestone = -1;
         }
         
         function editEstimate(i) {
           editingEstimate = Gcurrentdata[Gestimatesindex][i][0];
           $('#estimate_modal').modal('show');
           document.getElementById("input_estimatedesc").value = Gcurrentdata[Gestimatesindex][i][1];
           document.getElementById("input_estimateamt").value = Gcurrentdata[Gestimatesindex][i][2];
           $('.estimate_modaltitle').text('Edit Estimate');
           $('.opt_btn_wrp').hide();
         }
         
         function workplanOption(taskOpn) {
           var isoptionOpen = taskOpn.parent().find('.opt_btn_wrp').css('display');
           if (isoptionOpen == 'none') {
               $('.opt_btn_wrp').hide();
               taskOpn.parent().find('.opt_btn_wrp').toggle();
           } else {
               taskOpn.parent().find('.opt_btn_wrp').toggle();
           }
         }
         
         function workplanselect() {
         
         }
         function editworkplan(i) {
           editingSession = Gcurrentdata[Gworkplanindex][i][0];
           $('#session_modal').modal('show');
           // need to fix the indices...
         
           var meeting = Gcurrentdata[Gworkplanindex][i];
           var startElements = mysqlTimeStampToDate5(meeting[3]);
           var endElements = mysqlTimeStampToDate5(meeting[4]);
           var meetingdate = startElements[0];
           var from = startElements[1]+':'+startElements[2];
           var totime = endElements[1]+':'+endElements[2];
         
           document.getElementById("workplantext").value = Gcurrentdata[Gworkplanindex][i][1];
           document.getElementById("workprocess").value = Gcurrentdata[Gworkplanindex][i][2];
           document.getElementById("worksessiontype").value = Gcurrentdata[Gworkplanindex][i][6];
           setDate("sessiondate", meetingdate);
           document.getElementById("workfrom").value = from;
           document.getElementById("workto").value = totime;
           document.getElementById("worklocation").value = Gcurrentdata[Gworkplanindex][i][5];
           populateWPTeamSelector(Gcurrentstrategy, Gcurrentdata[Gworkplanindex][i][0], "wpPerformers");
           // document.getElementById("memberSelection").value = Gcurrentdata[Gworkplanindex][i][1];
         
           $('.workplanitle').text('Edit Work Session');
           $('.opt_btn_wrp').hide();
         }
         
         function taskOption(taskOpn) {
           var isoptionOpen = taskOpn.parent().find('.opt_btn_wrp').css('display');
           if (isoptionOpen == 'none') {
               $('.opt_btn_wrp').hide();
               taskOpn.parent().find('.opt_btn_wrp').toggle();
           } else {
               taskOpn.parent().find('.opt_btn_wrp').toggle();
           }
         }
         
           // $('.clockpicker').clockpicker();
         $('.clockpicker').clockpicker({
         placement: 'top',
         align: 'left',
         donetext: 'Done'
         });
         
         
      </script>
      <script>
         //browse btn path
         
         	$(document).on('click', '.browse', function(){
         		var file = $(this).parent().parent().parent().find('.file');
         		file.trigger('click');
         	});
         	$(document).on('change', '.file', function(){
         		$(this).parent().find('.browseinput').val($(this).val().replace(/C:\\fakepath\\/i, ''));
         	});
         
         //enscroll (custom scroll)
         
         	$('.cus_scroll').enscroll({
         		horizontalScrolling: false,
         		addPaddingToPane:false,
         		verticalTrackClass: 'vertical-track2',
         		verticalHandleClass: 'vertical-handle2',
         		//horizontalTrackClass: 'horizontal-track2',
         		//horizontalHandleClass: 'horizontal-handle2',
         		//cornerClass: 'corner2'
         	});
         
         // -------------- company table ----------
         
         
         	//menu option btn click dropdown
         	$(".opt_btn").click(function(){
         		if ($(this).parent().find('.opt_btn_wrp').css('display') == 'none') {
         			$('.opt_btn_wrp').hide();
         			$(this).parent().find('.opt_btn_wrp').toggle();
         		} else {
         			$('.opt_btn_wrp').hide();
         		}
         	});
         
         
         
         // -------------- projects table ----------
         
          	$("#projects_submit").click(function(){
         		$('#projects_modal').modal('hide');
         		$('.projects_table .no_data_row').hide();
         		$('.projects_data').show();
         	});
         
         // chnage submit btn color (project modal)
         
             function projecttext() {
                 projectSaveBtn();
             }
         
         	 function projectSaveBtn() {
         		var clientname = $('#client_name').val();
         		var clientdept = $('#client_dept').val();
         		var projecttitle = $('#project_title').val();
         		var projectdesc = $('#project_desc').val();
         		var basecur = $('#base_currency').val();
         		var projectvalue = $('#project_value').val();
         		var provaldesc = $('#project_val_desc').val();
         		var supplier = $('#supplier').val();
         
                 $('#projects_submit').removeClass('activeBtn');
                 if (clientname && clientdept && projecttitle && projectdesc && basecur && projectvalue && provaldesc && supplier) {
                     $('#projects_submit').addClass('activeBtn');
                 }
             }
         
         // option dropdown close on click outside
             $(document).on("click", function(event){
                 var $trigger = $(".opt_btn");
                 if($trigger != event.target && $(event.target).find(".opt_btn_wrp:visible").length > 0 ) {
                     $('.opt_btn_wrp').hide();
                 }
             });
         
         		$("#date_submit").click(function(){
         			$(".date_info_block").hide();
         			$("#dates_modal").modal('hide');
         			$(".date_text_container").addClass('d-block');
         		});
         
         
               
  
         
      </script>
      
   </body>
</html>