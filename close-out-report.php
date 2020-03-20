<?php 
include 'dbUtils.php';
$id = $_GET['id'];
$p_sql = "SELECT p.*, co.co_name FROM project p JOIN company co ON p.coid = co.coid WHERE pjid = $id";
$pm_sql = "SELECT pm.* from project_milestone pm WHERE pm.pjid = $id";
$pce_sql = "SELECT pce.* from project_cost_estimate pce WHERE pce.pjid = $id";
$g_sql = "SELECT g.* from project_goal g WHERE g.pjid = $id";
$cc_sql = "SELECT ce.* from cost_element ce WHERE ce.pjid = $id ORDER BY ordering DESC";
$so_sql = "SELECT so.so_desc strategic_option, so.selected so_selected, cd.name cost_driver, ce.name cost_element from cost_driver_so so JOIN cost_driver cd ON so.cdid =cd.cdid JOIN cost_element ce ON so.ceid = ce.ceid WHERE so.pjid = $id";
$ss_sql = "SELECT ssid, ss_desc, ss_handle, priority FROM strategy_statement WHERE selected = 1 AND pjid = $id";
$ssb_sql = "SELECT SUM(expected_value) net_cost_improvement, ssid FROM ss_benefit WHERE pjid = $id GROUP BY ssid";
$ssr_sql = "SELECT SUM(expected_value) net_revenue_improvement, ssid FROM ss_risk WHERE pjid = $id GROUP BY ssid";
$ssa_sql = "SELECT a.* FROM action a WHERE a.pjid = $id";
$pr_sql = "SELECT p.* FROM person p";
$result=obtain_query_result($p_sql, $con);
$pm_result=getData($pm_sql, $con);
$pce_result=getData($pce_sql, $con);
$g_result=getData($g_sql, $con);
$cc_result=getData($cc_sql, $con);
$so_result=getData($so_sql, $con);
$ss_result=getData($ss_sql, $con);
$ssb_result=getData($ssb_sql, $con);
$ssr_result=getData($ssr_sql, $con);
$ssa_result=getData($ssa_sql, $con);
$p_result=getData($pr_sql, $con);
$title = $result['pj_name'];
$description = $result['pj_desc'];
$company = $result['co_name'];
$primaryCost = money_format("%.2n", $result['pj_potentialsaving']);
// $overview = array('desc' => $desc);
$overview = [$description];
$g_max_length = 7;
$goals = [];
$g_start_index = 0;
$critical_costs = [];
$cc_start_index = 0;
$critical_costs_number = 0;
$total_critical_costs = 0;
$strategic_options = [];
$so_start_index = 0;

// $cc_max_length = 13;
foreach($pm_result as $pmr){
    $overview[] = $pmr['ms_label'].' '.date('jS M, Y',strtotime($pmr['ms_date']));
}
foreach($pce_result as $pcer){
    $overview[] = $pcer['description'].': USD '.number_format($pcer['value']);
}
foreach($g_result as $g) {
    $goals[$g_start_index][] = $g;
    $g_length = count($goals[$g_start_index]);
    if($g_length%$g_max_length === 0) {
        $g_start_index++;
    }
}
$calculated_costs = [];
$divided_ce = [];
$level_zero_costs = 0;
$level_three_costs = 0;
$level_two_costs = 0;
$level_one_costs = 0;
foreach($cc_result as $ccr) {
    $level = $ccr['level'];
    $costamt = (int)$ccr['costamt'];
    if($level > 3) {
        $level_three_costs += $costamt;
        continue;
    }
    if($level > 2) {
        if($level_three_costs === 0) {
            $level_three_costs = $costamt;
        }
        $calculated_costs[$ccr['ceid']] = $level_three_costs;
        $level_two_costs += $costamt;
        $level_three_costs = 0;
        continue;
    }
    if($level > 1) {
        if($level_two_costs === 0) {
            $level_two_costs = $costamt;
        }
        $calculated_costs[$ccr['ceid']] = $level_two_costs;
        $level_one_costs += $costamt;
        $level_two_costs = 0;
        continue;
    }
    if($level == '1'){
        if($level_one_costs === 0) {
            $level_one_costs = $costamt;
        }
        $calculated_costs[$ccr['ceid']] = $level_one_costs;
        $total_critical_costs += $level_one_costs;
        $level_one_costs = 0;
    }
        
    
}
// echo '<pre>';
// print_r($calculated_costs);
// echo '</pre>';

foreach($cc_result as $ccr) {
    // if($ccr['level'] === "1") {
    //     $total_critical_costs += (int)$ccr['costamt'];
    // }
    if($ccr['criticalp'] == 0) continue;
    $critical_costs_number++;
    $ccr['costamt'] = $calculated_costs[$ccr['ceid']];
    // $total_critical_costs += $ccr['costamt'];
    $critical_costs[$cc_start_index][] = $ccr;
    $g_length = count($critical_costs[$cc_start_index]);
    if($g_length%$g_max_length === 0) {
        $cc_start_index++;
    }
}
foreach($so_result as $sor) {
    if($sor['so_selected'] == 0) continue;
    $strategic_options[$so_start_index][] = $sor;
    $g_length = count($strategic_options[$so_start_index]);
    if($g_length%$g_max_length === 0) {
        $so_start_index++;
    }
}
$ss_data = [];
$selected_ss = [];
foreach($ss_result as $ssbr) {
    $selected_ss[] = $ssbr['ssid'];
    $ss_data[$ssbr['ssid']] = array(
        'ss' => $ssbr['ss_handle'] . ' '. $ssbr['ss_desc'],
        'priority' => $ssbr['priority'],
    );
}

$reduce_step_single_data = $ss_data;
$total_benefits_value = 0;
$total_risks_value = 0;
foreach($ssb_result as $ssbr) {
    // print_r($ssbr);
    if(!in_array($ssbr['ssid'], $selected_ss)) continue;
    $total_benefits_value += $ssbr['net_cost_improvement'];
    $reduce_step_single_data[$ssbr['ssid']]['net_cost_improvement'] = $ssbr['net_cost_improvement'];
}
foreach($ssr_result as $ssbr) {
    // print_r($ssbr);
    if(!in_array($ssbr['ssid'], $selected_ss)) continue;
    $total_risks_value += $ssbr['net_revenue_improvement'];
    $reduce_step_single_data[$ssbr['ssid']]['net_revenue_improvement'] = $ssbr['net_revenue_improvement'];
}
$reduce_step_chunk = array_chunk($reduce_step_single_data, $g_max_length);
$total_value_identified = $total_benefits_value - $total_risks_value;
$implement_step_single_data = $reduce_step_single_data;
$persons = [];
foreach($p_result as $pr){
    $persons[$pr['pnid']] = trim($pr['firstname']).' '.trim($pr['lastname']);
}
foreach($ssa_result as $ssar) {
    $action_owners = explode(',',$ssar['responsible']);
    $action_owners_html = '';
    for($i=0;$i< count($action_owners);$i++){
        if($action_owners[$i] === '') continue;
     $action_owners_html .= $persons[$action_owners[$i]];
    }
    if($action_owners_html == '') $action_owners_html = 'TBD';
    $deadline = $ssar['deadline'] !== NULL?date('jS M, Y',strtotime($ssar['deadline'])):'TBD';
    // var_dump($deadline);
    $implement_step_single_data[$ssar['ssid']]['actions'][] = [$ssar['description'], $action_owners_html, $deadline];
    
}
$implement_final_data = [];
foreach($implement_step_single_data as $isd){
    if(isset($isd['actions'])){
        $actions_count = count($isd['actions']);
        if($actions_count > $g_max_length) {
            $new_actions = array_chunk($isd['actions'], $g_max_length);
            foreach($new_actions as $nact) {
                $isd['actions'] = $nact;
                $implement_final_data[] = $isd;
            }
        }else {
            $implement_final_data[] = $isd;
        }
    }
    
}
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
    <link rel="stylesheet" type="text/css" href="css/mystyle.css">
    <link href="css/cor-style.css" rel="stylesheet">
    <style>
        .activeBtn {
            background: #3291d6 none repeat scroll 0 0;
            color: #ffffff;
            outline: 0 none;
        }
        .loader{
  width: 100px;
  height: 100px;
  border-radius: 100%;
  position: relative;
  margin: 0 auto;
}

/* LOADER 1 */

#loader-1:before, #loader-1:after{
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 10px solid transparent;
  border-top-color: #3498db;
}
#loader-1:before{
  z-index: 100;
  animation: spin 1s infinite;
}

#loader-1:after{
  border: 10px solid #ccc;
}

@keyframes spin{
  0%{
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100%{
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.aimdrive-row{
    width:100%
}
.aimdrive-col {
    display: inline-block;
    width: 8%;
    text-align: center;
}
.rem10{
    font-size: 8rem;
}
.rem2{
    font-size: 1rem;
}
/* .aimdrive-subtitle{
    position: relative;
    top: -35px;
} */
.thankyou{
    margin-bottom: 25px;
    margin-top: 350px;
    text-align: center;
}
.no-download{
    display:none;
}

    </style>

    <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <![endif]-->
</head>
<body>
    <div id="postlogin-body" style='background:#fff'>
        <div class="">
        <button id="renderPdf" title="<?php echo $title; ?>">download report</button>
        <div class="no-download">
            If the download does not start please click <a href='#' target="_blank">here</a>
        </div>
        <div class="loader" id="loader-1" style='display:none'></div>
            <div class="mainbody" id="mainbody">
                <!-- intro_screen -->
                <!-- section 1 Project Title -->
                <section class="sec_wrapper sec_blue" style='background:#fff'>
                    <div class="sec_head">
                        <h1 class="sec_title" style='color:#2c5481'>CLOSE OUT REPORT</h1> </div>
                    <div class="sec_body">
                        <h2 class="sec_subtitle" id="sec_subtitle" style='color:#2c5481'><?php echo $title;?></h2> 
                    </div>
                    <div style='color:#2c5481;font-size:3rem'>
                        <strong><?php echo $company; ?></strong>
                    </div>
                    
                </section>
                <!-- section 1 Static -->
                <section class="sec_wrapper">
                    <div class="sec_head">
                        <!-- <h1 class="sec_title">Process Overview</h1> -->
                        <h2 class="sec_subtitle">AIM &amp; DRIVE Methodology</h2> </div>
                        <div class="sec_body">
                            <p>The Cost Challenge follows a rigorous and structured approach to arrive at the Opportunities/Strategies using the AIM&amp;DRIVE methodology</p>
                            <p> The objective is to maximize value from contracts and/or categories through improvements in productivity, efficiency, planning, waste elimination and optimization of specifications without adversely impacting Safety and Operational risk </p> 
                            
                        </div>
                    
                </section>
                <!-- section 2 Static -->
                <section class="sec_wrapper">
                    <!------ header ------>
                    <div class="sec_head">
                        <!--  <h1 class="sec_title">Process Overview</h1> -->
                        <h2 class="sec_subtitle">AIM &amp; DRIVE Methodology</h2> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered" style="width:90%">
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                    Agreeing on the need to manage costs
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                    Define team goals.
                                    Identify pain points / areas of improvement.
                                    Document past initiatives.
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                    Identifying critical costs in the supply chain
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                    Develop cost breakdown and select critical costs.
                                    Develop process maps.
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Measuring secondary and tertiary costs
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Develop list of cost drivers for each critical cost(using a proprietary methodology called Formula Based Costing)
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Defining Key Cost Drivers and Developing Strategic Options
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Select key cost drivers.
                                Develop list of strategic options (Factors).
                                Identify the critical strategic options.
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Reducing, Changing, or Eliminating activities that cause costs : Strategies
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Develop strategy statements.
                                Identify and quantify Benefits and Risks/Costs for each Strategy.
                                Prioritize Strategies for Implementation.
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Implementing an action plan
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Develop detailed implementation plan for each strategy (action items, owners, and due dates)
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Verifying the plan with cost monitors
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Document savings and value realized
                                </td>
                            </tr>
                            <tr valign='middle'>
                                <th style='font-size:1.5rem'>
                                Eternally improving and modifying the process
                                </th>
                                <td style='font-size:1.2rem;padding:8px 5px;'>
                                Revisit the AIM&DRIVE process for further improvement opportunities and value addition
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!------ footer ------>
                    
                </section>
                <!-- section 4 Overview -->
                <section class="sec_wrapper">
                    <!------ header ------>
                    <div class="sec_head">
                        <h1 class="sec_title">Overview</h1> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <ul class="topic_list">
                        <?php foreach($overview as $o) { ?>
                            <li><?php echo $o; ?></li>
                        <?php } ?>
                        </ul>
                    </div>
                    <!------ footer ------>
                    
                </section>
                <!-- section 6 Goals -->
                <?php foreach($goals as $g) { ?>
                <section id="temp" class="sec_wrapper">
                    <!------ header ------>
                    <div class="sec_head">
                    <h1 class="sec_title">Agree</h1>
                    </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered">
                            <thead>
                                <tr valign='middle' style='font-size:1.75rem'>
                                    <th width="20%">Perspective</th>
                                    <th width="80%">Goal</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach($g as $gp) {?>
                            <?php 
                                $singleGoal = preg_replace('/\s+/', ' ', $gp['goal']);
                                $singlePers = preg_replace('/\s+/', ' ', $gp['perspective']); 
                                // $singleGoal = trim($singleGoal); 
                            ?>
                                <tr valign='middle' style='font-size:1.51rem'>
                                    <td style="padding:8px 5px;"><?php echo $singlePers; ?></td>
                                    <td style="padding:8px 5px;"><?php echo $singleGoal; ?></td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                    <!------ footer ------>
                </section>
                <?php } ?> 
                <!-- section 8  critical costs Identify -->
                <?php foreach($critical_costs as $cc) { ?>
                <section class="sec_wrapper identify_wrapper">
                    <!------ header ------>
                    <div class="sec_head tab_section">
                    <h1 class="sec_title">Identify</h1>
                        <h2>The team has chosen to focus their improvement efforts on <?php echo $critical_costs_number;?> critical costs</h2> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered">
                            <tbody>
                                <tr valign='middle' style='font-size:1.75rem'>
                                    <th width="60%">Cost item</th>
                                    <th width="20%">Cost($) </th>
                                    <th width="15%">Percentage</th>
                                </tr>
                                <?php foreach($cc as $singlecc) { ?>
                                <tr valign='middle' style='font-size:1.5rem'>
                                    <td style="padding:8px 5px;" width="60%"><?php echo $singlecc['name'] ;?></td>
                                    <td style="padding:8px 5px;" width="20%"> <?php echo number_format($singlecc['costamt']) ;?></td>
                                    <td style="padding:8px 5px;" width="15%"><?php echo round(($singlecc['costamt']/$total_critical_costs)*100, 2) ;?>%</td>
                                </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                        
                    </div>
                    <!------ footer ------>
                    
                </section>
                <?php } ?>
                <!-- section 9 strategic options MnD -->
                <?php foreach($strategic_options as $so){ ?>
                <section class="sec_wrapper mand_wrapper">
                    <!------ header ------>
                    <div class="sec_head tab_section">
                    <h1 class="sec_title">Measure & Define</h1>
                        <h2>The team identified the following cost drivers and strategic options for further analysis:</h2> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered">
                            <thead>
                                <tr valign='middle' style='font-size:1.75rem'>
                                    <th width="25%">Critical Cost</th>
                                    <th width="25%">Cost Driver</th>
                                    <th width="50%">Strategic Option</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach($so as $singleSo) { ?>
                                <tr valign='middle' style='font-size:1.5rem'>
                                    <td style="padding:8px 5px;">
                                        <?php echo $singleSo['cost_element']; ?>
                                    </td>
                                    <td style="padding:8px 5px;">
                                    <?php echo $singleSo['cost_driver']; ?>
                                    </td>
                                    <td style="padding:8px 5px;"><?php echo $singleSo['strategic_option']; ?></td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                    <!------ footer ------>
                    
                </section>
                <?php } ?>
                <!-- section 12 benefits reduce -->
                <?php foreach($reduce_step_chunk as $reduce_step_data) {?>
                <section class="sec_wrapper reduce_wrapper">
                    <!------ header ------>
                    <div class="sec_head tab_section">
                    <h1 class="sec_title">Reduce</h1>
                        <h2>The Total Value identified from the Strategies selected for Implementation USD <?php echo number_format($total_value_identified); ?></h2> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered">
                            <thead>
                                <tr valign='middle' style='font-size:1.75rem'>
                                    <th width="55%">Strategy Statement</th>
                                    <th width="5%">Priority</th>
                                    <th class="" width="20%">Net Potential Value Identified</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php foreach($reduce_step_data as $rsd) { ?>
                            <?php 
                            if(!isset($rsd['ss'])) continue;
                                $net_revenue_improvement = isset($rsd['net_revenue_improvement'])?$rsd['net_revenue_improvement']: 0;
                                $net_cost_improvement = isset($rsd['net_cost_improvement'])?$rsd['net_cost_improvement']: 0;

                            ?>
                                <tr valign='middle'>
                                    <td style="padding:8px 5px;"><?php echo $rsd['ss']; ?></td>
                                    <td style="padding:8px 5px;"><?php echo $rsd['priority']; ?></td>
                                    <td style="padding:8px 5px;">USD <?php echo number_format($net_cost_improvement-$net_revenue_improvement); ?></td>
                                    
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                    <!------ footer ------>
                    
                </section>
                <?php } ?>
                <!-- section 14 actions implement -->
                <?php foreach($implement_final_data as $isd){ ?>
                <?php
                if(!isset($isd['ss'])) continue;
                $net_revenue_improvement = isset($isd['net_revenue_improvement'])?$isd['net_revenue_improvement']: 0;
                $net_cost_improvement = isset($isd['net_cost_improvement'])?$isd['net_cost_improvement']: 0;
                ?>
                <section class="sec_wrapper implement_wrapper">
                    <!------ header ------>
                    <div class="sec_head tab_section">
                    <h1 class="sec_title">Implement</h1>
                        <h2>The team is committed to completing the following actions and delivering the value identified</h2> </div>
                    <!------ body ------>
                    <div class="sec_body">
                        <table class="table table-bordered">
                            <thead>
                                <tr valign='middle' style='font-size:1.75rem'>
                                <th width="55%">Strategy Statement</th>
                                    <th width="5%">Priority</th>
                                    <th class="" width="20%">Net Potential Value Identified</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr valign='middle'>
                                    <td style="padding:8px 5px;"><?php echo $isd['ss']?></td>
                                    <td style="padding:8px 5px;"><?php echo $isd['priority']?></td>
                                    <td style="padding:8px 5px;" class="">USD <?php echo number_format($net_cost_improvement-$net_revenue_improvement);?></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table table-bordered">
                            <thead>
                                <tr valign='middle' style='font-size:1.75rem'>
                                    <th width="60%">Action Item</th>
                                    <th width="20%">Performer</th>
                                    <th class="" width="15%">Target Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            <?php if(isset($isd['actions']))foreach($isd['actions'] as $isda){ ?>
                                <tr valign='middle'>
                                    <td style="padding:8px 5px;"><?php echo $isda[0]; ?></td>
                                    <td style="padding:8px 5px;"><?php echo $isda[1]; ?></td>
                                    <td style="padding:8px 5px;"><?php echo $isda[2]; ?></td>
                                </tr>
                            <?php } ?>
                            </tbody>
                        </table>
                    </div>
                    <!------ footer ------>
                    
                </section>
                <?php }?>
                <!-- section 1 -->
                <section class="sec_blue" style='background:#fff'>
                    <div class="sec_head thankyou">
                        <h1 class="sec_title" style='color:#2c5481'>THANK YOU</h1> </div>
                </section>
            </div>
        </div>

    </div>
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <!-- Minified version of `es6-promise-auto` below. -->
    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
    <!-- Required to convert named colors to RGB -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.4/rgbcolor.min.js"></script>
      <!-- Optional if you want blur -->
    <script src="https://cdn.jsdelivr.net/npm/stackblur-canvas@^1/dist/stackblur.min.js"></script>
      <!-- Main canvg code -->
    <script src="https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js"></script>
    <script src="js/html2pdf.js" type="text/javascript"></script>
    <script>
        downloaded  = false;
        $('body').on('click', '#renderPdf', function(){
        $('#loader-1').show();
        title = $('#renderPdf').attr('title');
        
        var element = document.getElementById('mainbody');
        let pdfHeight = [];
        $(".sec_wrapper").each(function(){
          pdfHeight.push($(this).outerHeight(true));
        })
        pdfHeight.sort();
        
        pdfHeight.reverse();
        
        let date = new Date();
        
        var opt = {
          margin:       0,
          enableLinks : false,
          filename:     'close out report.pdf',
          pagebreak:    { after: '.sec_wrapper', avoid: '.sec_blue' },
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { dpi:300, letterRendering:true},
          jsPDF:        { unit: 'px', format: [1440, (pdfHeight[0]+7) ], orientation: 'landscape', compressPdf:false }
        };
        // html2pdf().set(opt).from(element).save('./uploads/cor.pdf').then(function(){});
        html2pdf().set(opt).from(element).toPdf().output('datauristring').then(function (pdfAsString) {
            // The PDF has been converted to a Data URI string and passed to this function.
            // Use pdfAsString however you like (send as email, etc)! For instance:
            var participantData = {
                title: title,
                base64String: pdfAsString,
            };
            
            $.ajax({
                url: "convert.php",
                type: "POST",
                data: {
                data: JSON.stringify(participantData)
                },
                success: function(response) { 
                    console.log(response);
                    let responseObj = JSON.parse(response);
                    $('#loader-1').hide();
                    if(responseObj.output.length !== 0) {
                        let status = responseObj.output[0].split(':');
                        if(status[0] === "ERROR") {
                            alert('There is an error in downloading the report, please try again sometime later')
                        }
                    }else {
                        window.location = 'reports/'+responseObj.file
                        $('.no-download a').attr('href','reports/'+responseObj.file);
                        $('.no-download').show();
                    }
                    
                },
                error: function(error) { 
                    console.log(error);
                    alert('There is an error in downloading the report, please try again sometime later')
                }
            });
        });
      });
    
    </script>
</body>

</html>