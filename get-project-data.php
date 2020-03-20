<?php
// inputs (all required, all integer id's): project company bu
/* output is json intended to show ALL data for the project,
in the form of an array containing many sub-arrays:
 - project name (project.pj_name)
 - project description (project.pj_desc)
 - potential savings:
   if project.pj_potentialsaving is null then null, otherwise array:
   - project.pj_potentialsaving
   - project.pj_pj_costunit
 - project status:
   if pj_status is null then the string "No Status", otherwise pj_status
 - NULL (previously commodities associated with the project)
 - company and business unit name, array:
   - company.co_name
   - if busunit.bu_divname is null the "" otherwise busunit.bu_divname
   - busunit.bu_name
 - suppliers related to the project - an array contining company name
   of each supplier
   [*** Swamy - check that this is the correct meaning of project_supplies]
   
 - team members of the project, an array containing for each team member:
   - project_team.role
   - if the project_team.firstname is null then the project_team.email_address
     otherwise project_team.firstname
   - if project_team.lastname is null then "" otherwise project_team.lastname
[*** Swamy can you continue from here?]

*/
require 'CONNECT_TO_DB.php';
//$row is the row of person for this user
//$admin is "admin" if the person works for CMS, otherwise ""
  $valueRealizedYear = [];
  $totalRealizedValue = 0;
  $totalValueIdentified = 0;
  $totalQuarterSorted = [];

$company=getcompany();
$bu=getbu();
$project=getproject();
$output=array();
$q="select * from project p, busunit b, company c where pjid=$project and
  p.coid=$company and b.coid=$company and c.coid=$company
  and p.buid=$bu and b.buid=$bu";
$result=obtain_query_result($q);

if(!$row= mysqli_fetch_assoc($result)) {
  die('["ERROR", "not a project"]');
}
// 0 - project name, 1 - project description, 2[0] - potential_saving, 2[1] - costunit, 
// 3 - status, 4 - NULL, 5[0] - co_name, 5[1] - , 5[2] - department
$output= array(htmlentities($row['pj_name'],ENT_QUOTES, "UTF-8"),
                htmlentities($row['pj_desc'],ENT_QUOTES, "UTF-8"),
               (is_null($row['pj_potentialsaving']))?NULL:
                 array($row['pj_potentialsaving'],$row['pj_costunit']),
               (is_null($row['pj_status']))?"No Status":$row['pj_status'],
               NULL, // (listof x s.t. (project-commodity obj x)) 
               array($row['co_name'],
                     (is_null($row['bu_divname']))?"":$row['bu_divname'],
                     $row['bu_name']));

$q2="select * from project_supplies ps, company c where 
  c.coid=supplier_coid and
  pjid=$project and buid=$bu and ps.coid=$company";
$result2=obtain_query_result($q2);
$com=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $com[]=$row2['co_name'];
}
// 6 - suppliers
$output[]=$com;

$q2="select * from project_team pt, company c, person p where personid=pnid " .
 " and pt.coid=c.coid and pt.coid=$company and pt.buid=$bu " .
 " and pt.pjid=$project";
$result2=obtain_query_result($q2);
$team=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $team[]=array($row2['role'],
                (is_null($row2['firstname']))?$row2['email_address']
                                             :$row2['firstname'],
                (is_null($row2['lastname']))?"":$row2['lastname'],
                (is_null($row2['co_name']))?"":$row2['co_name']);
}
// 7[n][0] - role , 7[n][1] - firstname , 7[n][2] - lastname , 7[n][3] - co_name 
$output[]=$team;


$q2="select * from project_goal where coid=$company and buid=$bu
 and pjid=$project order by creationtime";
$result2=obtain_query_result($q2);
$goals=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $goals[]=array($row2['goal'],$row2['perspective'],$row2['stakeholder']);
}
// 8[n][0] -  goal ,8[n][1] - perspective ,8[n][2] - stakeholder
$output[]=$goals;

// 9[0] - primary cost, 9[1] - estimated amount, 9[2] - cost rationale, 9[3] - cost unit, 
// 9[4] - , 9[5] - , 9[6] - , 9[7] - 
$output[]=array($row['pj_primarycost'],
                $row['pj_primarycostamt'],
                $row['pj_primarycostrationale'],
                $row['pj_costunit'],
                $row['pj_primarycostleveragable'],
                $row['pj_primarycostacquisition'],
                $row['pj_primarycostusage'],
                $row['pj_primarycosteol']);

$q2="select * from cost_element where coid=$company and buid=$bu
 and pjid=$project order by ordering";
$result2=obtain_query_result($q2);
$ce=array();
$crit=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $ce[]=array($row2['ceid'],$row2['name'],$row2['level'],$row2['ordering'],
              $row2['costamt'],$row2['impactable'],$row2['future_cash_flow'],
              $row2['comment'],$row2['criticalp'],$row2['costunit'],
              $row2['costtype'],$row2['ce_status']);
  if($row2['criticalp']!=0){
  $crit[]=$row2['ceid'];
  }
}
// 10[0][n][0] - cost element id, 
// 10[0][n][1] - cost element name, 
// 10[0][n][2] - cost element level
// 10[0][n][3] - cost element ordering ,
// 10[0][n][4] - cost element amount,
// 10[0][n][5] - cost element impactable
// 10[0][n][6] - cost element future cash flow ,
// 10[0][n][7] - cost element comment,
// 10[0][n][8] - cost element critical p 
// 10[0][n][9] - cost element cost unit,
// 10[0][n][10] - cost element cost type,
// 10[0][n][11] - cost element status

// 10[1][n] - cost element id,
$output[]=array($ce,$crit);
$qce="select * from cost_element where
 criticalp>0 and coid=$company" .
 " and buid=$bu and pjid=$project" .
 " order by costtype,ordering";
$ceans=array();
$resultce=obtain_query_result($qce);
while($rowce= mysqli_fetch_assoc($resultce)) {
  $thisce=array($rowce['ceid'],$rowce['name']);
  $qcd="select * from cost_driver where coid=$company" .
       " and buid=$bu and pjid=$project" .
       " and ceid=" . $rowce['ceid'] . " order by position";
  $resultcd=obtain_query_result($qcd);
  $cdans=array();
  while($rowcd= mysqli_fetch_assoc($resultcd)) {
    $nxtcd=array($rowcd['cdid'], $rowcd['name'], $rowcd['position'],
                   "NOT-USED",
                   (is_null($rowcd['numer']))?NULL:
                    array($rowcd['numer'],$rowcd['denom'],$rowcd['currentval'],
                          $rowcd['canimprove'],$rowcd['target'],$rowcd['unit'],
                          $rowcd['keyp'],$rowcd['cd_status']));
    $qdso="select * from cost_driver_so where coid=$company" .
       " and buid=$bu and pjid=$project" .
       " and ceid=" . $rowce['ceid'] . " and cdid=" . $rowcd['cdid'] .
       " order by ordering";
    $resultdso=obtain_query_result($qdso);
    $dso=array();
    while($rowdso= mysqli_fetch_assoc($resultdso)) {
      $dso[]=array($rowdso['soid'],$rowdso['so_desc']
      ,$rowdso['selected'],$rowdso['so_status']);
    }
    $nxtcd[]=$dso;
    $cdans[]=$nxtcd;
  }
  $thisce[]=$cdans;
  $ceans[]=$thisce;
}
/* 
11[n][0] - cost element id, 
11[n][1] - cost element name,

11[n][2][m][0] - cost driver id,  
11[n][2][m][1] - cost driver name, 
11[n][2][m][2] - cost driver position, 
11[n][2][m][3] - NOT_USED, 
11[n][2][m][4][0] - cost driver numerator,  
11[n][2][m][4][1] - cost driver denominator,  
11[n][2][m][4][2] - cost driver current value,  
11[n][2][m][4][3] - cost driver can improve,  
11[n][2][m][4][4] - cost driver target,  
11[n][2][m][4][5] - cost driver unit,  
11[n][2][m][4][6] - cost driver key p,  
11[n][2][m][4][7] - cost driver status,  
11[n][2][m][5][l][0] - cost driver strategic option id,  
11[n][2][m][5][l][1] - cost driver strategic option description,  
11[n][2][m][5][l][2] - cost driver strategic option selected,
11[n][2][m][5][l][3] - cost driver strategic option status,

*/
$output[]=$ceans;
$totalQuarters = [];
$valueRealizedPerQuarter = [];
$q2="select * from strategy_statement where
 coid=$company and buid=$bu and pjid=$project";
$result2=obtain_query_result($q2);
$ss=array();
$totalRiskValue = 0;
$totalBenefitValue= 0;
$ssValueIdentified = [];
while($row2= mysqli_fetch_assoc($result2)) {
  $strategy_statement_id = $row2['ssid'];
  $ssd=array(
        $strategy_statement_id,
        (is_null($row2['ss_desc']))?"":htmlentities($row2['ss_desc'],ENT_QUOTES, "UTF-8"),
        (is_null($row2['ss_constraint']))?"":$row2['ss_constraint'],
        (is_null($row2['priority']))?"unassigned":$row2['priority'],
        );
  $q3="select * from ss_risk where coid=$company and buid=$bu " .
      " and pjid=$project and ssid=" . $strategy_statement_id.
      " order by creationtime";
  $result3=obtain_query_result($q3);
  $ssrb=array();
  while($row3= mysqli_fetch_assoc($result3)) {
    $riskValue = (int)$row3['expected_value'];
    if($row2['selected'] > 0) {
      $totalRiskValue += $riskValue;
      if(isset($ssValueIdentified[$strategy_statement_id]['risk'])) {
        $ssValueIdentified[$strategy_statement_id]['risk'] += $riskValue;
      }else {
        $ssValueIdentified[$strategy_statement_id]['risk'] = $riskValue;  
      }
    } 
    $ssrb[]=array(
            htmlentities($row3['description'],ENT_QUOTES, "UTF-8"),
            $riskValue,
            $row3['risk_benefit_type'],
            $row3['min_value'],
            $row3['max_value']
          );
  }
  $ssd[]=$ssrb;
  $q3="select * from ss_benefit where coid=$company and buid=$bu
   and pjid=$project and ssid=" . $strategy_statement_id.
   " order by creationtime";
  $result3=obtain_query_result($q3);
  $ssrb=array();
  if($row2['selected']>0) {
  $ssValueIdentified[$strategy_statement_id]['ss_handle'] = $row2['ss_handle'];
  $ssValueIdentified[$strategy_statement_id]['ss_dropped'] = $row2['ss_dropped'];
  $ssValueIdentified[$strategy_statement_id]['ss_unimplement'] = $row2['ss_unimplement'];
  }
  while($row3= mysqli_fetch_assoc($result3)) {
    $benefitValue = (int)$row3['expected_value'];
    if($row2['selected']>0) {
      $totalBenefitValue += $benefitValue;
      if(isset($ssValueIdentified[$strategy_statement_id]['benefit'])) {
        $ssValueIdentified[$strategy_statement_id]['benefit'] += $benefitValue;
      }else {
        $ssValueIdentified[$strategy_statement_id]['benefit'] = $benefitValue;  
      }
    } 
    $ssrb[]=array(
            htmlentities($row3['description'],ENT_QUOTES, "UTF-8"),
            $benefitValue,
            $row3['risk_benefit_type'],
            $row3['min_value'],
            $row3['max_value'],
            );
  }
  $ssd[]=$ssrb;
  $totalValueIdentified = $totalBenefitValue - $totalRiskValue;

  $ssact=array();
  //if($row2['selected']>0)  // allow non selected SS actions (for now) since things are out of order in newad...
  
  $q3="select * from action where coid=$company and buid=$bu
  and pjid=$project and ssid=" . $strategy_statement_id . " order by actionid ASC";
  $result3=obtain_query_result($q3);
  while($row3= mysqli_fetch_assoc($result3)) {
    $action_id = $row3['actionid'];
    $action_participants_sql = "SELECT person_id FROM action_participants WHERE action_id = $action_id";
    $action_participants_result=obtain_query_result($action_participants_sql);
    $action_participants = [];
  while($action_participants_row= mysqli_fetch_assoc($action_participants_result)) {
    array_push($action_participants, $action_participants_row['person_id']);
  }
  $action_participants = count($action_participants) === 0? '': implode(',', $action_participants);
  $thisact=array($action_id,
                  (is_null($row3['description'])?"":htmlentities($row3['description'],ENT_QUOTES, "UTF-8")),
                  (is_null($row3['deadline'])?"":$row3['deadline']),
                  ($action_participants));
  // (listof (x y z) s.t. (action-timed-comment a x y z))
  $q4="select * from action_comment where coid=$company and " . 
      " buid=$bu and pjid=$project and ssid=" . $strategy_statement_id .
      " and actionid=" . $row3['actionid'] . " order by creationtime";
  $result4=obtain_query_result($q4);
  $ssactpr=array();
  while($row4= mysqli_fetch_assoc($result4)) {
    $ssactpr[]=array($row4['comment'],$row4['author'],$row4['creationtime']);
  }
  $thisact[]=$ssactpr;
  // (any x s.t. (action-completed-at a x) ifnone  "")
  $thisact[]=(is_null($row3['completiontime'])?"":$row3['completiontime']);
  // (any x s.t. (action-create-date a x) ifnone  "old data")
  $thisact[]=(is_null($row3['creationtime'])?"":$row3['creationtime']);
  // (listof (x y z) s.t. (action-percentage a x y z)) - date percent person
  $q4="select * from action_progress where coid=$company and " . 
      " buid=$bu and pjid=$project and ssid=" . $strategy_statement_id .
      " and actionid=" . $row3['actionid'] . " order by lastupdate";
  $result4=obtain_query_result($q4);
  $ssactpr=array();
  while($row4= mysqli_fetch_assoc($result4)) {
    $ssactpr[]=array($row4['creationtime'],$row4['pctcomplete'],
    $row4['author'],$row4['comment'], $row4['lastupdate']);
  }
  $thisact[]=$ssactpr;

  $thisact[]=(is_null($row3['startdate'])?"":$row3['startdate']);
  $thisact[]=$row3['ordering'];
  $thisact[]=$row3['dropped'];
  $thisact[]=$row3['dropped_comment'];
  $thisact[]=$row3['completed'];
  $thisact[]=$row3['completed_by'];
  $thisact[] = $row2['ss_handle'];
  $ssact[]=$thisact;
  }
    
  $ssd[]=$ssact;

  // (listof f s.t. (ss-so ss f))
  // (listof cd s.t. (ss-cost-driver ss cd))
  $q3="select * from ss_so where coid=$company and buid=$bu" .
      " and pjid=$project and ssid=" . $strategy_statement_id;
  $result3=obtain_query_result($q3);
  $so=array();
  $cd=array();
  while($row3= mysqli_fetch_assoc($result3)) {
    $so[]=$row3['soid'];
    $cd[]=$row3['cdid'];
  }
  $ssd[]=$so;
  $ssd[]=$cd;
  $ssd[]=($row2['selected']>0)? "SELECTED" : "NOT SELECTED";
  
  $ssd[]=($row2['leveragable']<=0)? array() : 
    array($row2['leveragableamount'],$row2['leveragablecomment']);
  $ssd[]=(is_null($row2['ss_status']))?"No Status":$row2['ss_status'];
  $ssd[]=$row2['ss_handle'];

  // 2017-08-21 
  $q3="select * from strategy_statement_savings
   where coid=$company and buid=$bu and pjid=$project and ssid= $strategy_statement_id ORDER BY savingsdate DESC";
  $result3=obtain_query_result($q3);
  $sssaving=array();
  $savings_year = 0;
  $savings_month = 0;
  $savings_quarter = 0;
  
  while($row3= mysqli_fetch_assoc($result3)) {
    if($row3['savingsdate'] !== NULL || $row3['savingsdate'] !== '') {
      $savings_year = date('Y', strtotime($row3['savingsdate']));
      $savings_month = date('n', strtotime($row3['savingsdate']));
      $savings_quarter = $savings_year.','.'Q'.ceil($savings_month / 3);
    }
    $savings_type = $row3['savingstype'];
    $eachValueRealized = (int)$row3['value'];
    if($savings_type === "Cost Improvement" || $savings_type === "Revenue Improvement") {
      // do nothing
    }else {
      $eachValueRealized = -$eachValueRealized;
    }
    $totalRealizedValue += $eachValueRealized;
    $sssaving[]=array($eachValueRealized,$row3['savingsdate'],
                      $row3['comment'],$row3['person'], $savings_year, $row3['savingstype'], $row3['savingsid'] );
    $valueRealizedYear[] = array(
      'year' => $savings_year,
      'quarter' => $savings_quarter,
      'month' => $savings_month,
      'valueRealized' => $eachValueRealized
    );
    if(array_key_exists($savings_quarter,$totalQuarters) === False) {
      $totalQuarters[$savings_quarter] = $eachValueRealized;
    }else {
      $totalQuarters[$savings_quarter] += $eachValueRealized;
    }
    if(isset($ssValueIdentified[$strategy_statement_id]['realized'])) {
      $ssValueIdentified[$strategy_statement_id]['realized'] += $eachValueRealized;
    }else {
      $ssValueIdentified[$strategy_statement_id]['realized'] = $eachValueRealized;
    }
    
  }
  ksort($totalQuarters);
  $totalQuarterSorted = $totalQuarters;
  $ssd[] =$sssaving;
  $ssd[] = $row2['ss_complete'];
  $ssd[] = $row2['ss_completed_by'];
  $ssd[] = $row2['ss_complete_date'];
  $ssd[] = $row2['ss_startdate'];
  $ssd[] = $row2['ss_enddate'];
  $ssd[] = $row2['ss_owner'];
  $ssd[] = $row2['ssundrop_reason'];
  $ssd[] = $row2['ss_dropped'];
  $ssd[] = $row2['dropped_date'];
  $ssd[] = $row2['dropped_by'];
  $ssd[] = $row2['undropped_date'];
  $ssd[] = $row2['undropped_by'];
  $ssd[] = $row2['reopened_by'];
  $ssd[] = $row2['reopened_date'];
  $ssd[] = $row2['unimplement_reason'];
  $ssd[] = $row2['unimplement_by'];
  $ssd[] = $row2['unimplement_date'];
  $ssd[] = $row2['ss_unimplement'];
  $ssd[] = $row2['reselect_date'];
  $ssd[] = $row2['reselect_by']; 
  $ssd[] = $row2['drop_reason']; 
  $ss[]=$ssd;
}
/* 
strategy statement
12[n][0] - id,
12[n][1] - description,
12[n][2] - contstraint,
12[n][3] - priority,

strategy statement risks
12[n][4][m][0] - description,
12[n][4][m][1] - expected_value,
12[n][4][m][2] - risk_benefit_type,
12[n][4][m][3] - min_value,
12[n][4][m][4] - max_value,

strategy statement benefits
12[n][5][m][0] -  description,
12[n][5][m][1] -  expected_value,
12[n][5][m][2] -  risk_benefit_type,
12[n][5][m][3] -  min_value,
12[n][5][m][4] -  max_value,

strategy statement actions
12[n][6][m][0] -  id,
12[n][6][m][1] -  description,
12[n][6][m][2] -  deadline,
12[n][6][m][3] -  participnts 
,
strategy statement action comments
12[n][6][m][4][l][0] -  comment,
12[n][6][m][4][l][1] -  author,
12[n][6][m][4][l][2] -  creation time,
12[n][6][m][5] - completion time,
12[n][6][m][6] - creation time,
strategy statement action progress
12[n][6][m][7][l][0] - creationtime,
12[n][6][m][7][l][1] - pctcomplete,
12[n][6][m][7][l][2] - author,
12[n][6][m][7][l][3] - comment,
12[n][6][m][7][l][4] - lastupdate,
12[n][6][m][8] - start date,
12[n][6][m][9] - ordering,
12[n][6][m][10] - dropped,
12[n][6][m][11] - dropped_comment,
12[n][6][m][12] - completed,
12[n][6][m][13] - completed_by,
12[n][7][m] - strategy option id ,
12[n][8][m] - cost driver id,
12[n][9] - selected,

leveragable
12[n][10][0] - leveragableamount,
12[n][10][1] - leveragablecomment,
12[n][11] - status - Eternal ,
12[n][12] - handle ,

savings
12[n][13][m][0] - value,
12[n][13][m][1] - savings date,
12[n][13][m][2] - comment,
12[n][13][m][3] - person,


12[n][14] - complete,
12[n][15] - completed by,
12[n][16] - completed date,
12[n][17] - startdate,
12[n][18] - enddate,
12[n][19] - ssowner,
12[n][20] - ssundropreason,
12[n][21] - ssdropped,
12[n][22] - droppeddate,
12[n][23] - droppedby,
12[n][24] - undropped_date,
12[n][25] - undropped_by,
12[n][26] - reopened_by,
12[n][27] - reopened_date
12[n][28] - unimplement_reason
12[n][29] - unimplement_by
12[n][30] - unimplement_date
12[n][31] - ss_unimplement
12[n][32] - reselect_date
12[n][33] - reselect_by
12[n][34] - drop_reason
12[n][35] - value identified and realized per strategy
*/
$output[]=$ss;

// (get-comments obj)
$statuswords=array("Preview","Agree","Identify","Measure","Define",
                   "Reduce","Implement","Verify","Eternal");
$com=array();
foreach($statuswords as $step){
  $qcom="select * from project_step_comment where coid=$company and " .
        " buid=$bu and pjid=$project and step = '$step' " .
        " order by creationtime"; 
  $resultcom=obtain_query_result($qcom);
  $scom=array();
  while($rowcom= mysqli_fetch_assoc($resultcom)) {
     $scom[]= array($rowcom['comment'],
                    $rowcom['author'],
                    $rowcom['creationtime']);
  }
 $com[]=array($step,$scom);            
}

/* 
  13[n][0] - step , 
  13[n][1][0] - step comment, 
  13[n][1][1] - step author, 
  13[n][1][2] - step creation time, 
*/
$output[]=$com;
// (get-docs obj) 
$doc=array();
foreach($statuswords as $step){
  $qdoc="select * from document where coid=$company and " .
        " buid=$bu and pjid=$project and step = '$step' " .
        " order by lastmodtime";
  $resultdoc=obtain_query_result($qdoc);
  $sdoc=array();
  while($rowdoc= mysqli_fetch_assoc($resultdoc)) {
     // doc creator created modified handle desc url type
     $sdoc[]= array($rowdoc['docid'],
                    $rowdoc['author'],
                    $rowdoc['creationtime'],
                    $rowdoc['lastmodtime'],
                    $rowdoc['docname'],
                    $rowdoc['docdesc'],
                    $rowdoc['url'],
                    $rowdoc['filename'], // non-null means internal
                    $rowdoc['contenttype']);
  }
 $doc[]=array($step,$sdoc);            
}
/*
  14[n][0]    - step , 
  14[n][1][0] - docid,
  14[n][1][1] - author,
  14[n][1][2] - creationtime,
  14[n][1][3] - lastmodtime,
  14[n][1][4] - docname,
  14[n][1][5] - docdesc,
  14[n][1][6] - url,
  14[n][1][7] - filename,
  14[n][1][8] - contenttype,
*/
$output[]=$doc;
// 15 - last modified time
$output[]=$row['pj_lastmodtime'];
// 16 - creation time
$output[]=$row['pj_creationtime'];
// 17 -  scope
$output[]=$row['pj_scope'];
// 18 - comment
$output[]=$row['pj_comment'];

$q2="select * from project_cost_estimate where
 coid=$company and buid=$bu and pjid=$project";
$result2=obtain_query_result($q2);
$costest=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $costest[]=array($row2['pjceid'],$row2['description'],$row2['value']);
}
/* 
  19[n][0] - project cost estimate id
  19[n][1] - project cost estimate description
  19[n][2] - project cost estimate value
*/
$output[]=$costest;

$q2="select * from project_past_initiative where
 coid=$company and buid=$bu and pjid=$project";
$result2=obtain_query_result($q2);
$pastinit=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $pastinit[]=array($row2['pjpiid'],$row2['description'],
                    $row2['start_year'],$row2['identified_value'],
                    $row2['delivered_value'],$row2['status']);
}
/*  
  20[n][0] -  project past initiative id
  20[n][1] -  project past initiative description
  20[n][2] -  project past initiative start_year
  20[n][3] -  project past initiative identified_value
  20[n][4] -  project past initiative delivered_value
  20[n][5] -  project past initiative status
*/
$output[]=$pastinit;

$q2="select * from project_meeting where
 coid=$company and buid=$bu and pjid=$project";
$result2=obtain_query_result($q2);
$mtgs=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $mid=$row2['pjmeetingid'];
  $mtg=array($mid,$row2['agenda'],
             $row2['step'],$row2['starttime'],
             $row2['endtime'],$row2['location'],$row2['meeting_type']);
  $q3="select * from project_meeting_participant where
     coid=$company and buid=$bu and pjid=$project and pjmeetingid=$mid";
  $result3=obtain_query_result($q3);
  $part=array();
  while($row3= mysqli_fetch_assoc($result3)) {
    $part[]=$row3['participant'];
    }
  $mtg[]=$part;
  $mtgs[]=$mtg;
}
// 21[0] - meeting id
// 21[1] - meeting agenda
// 21[2] - meeting step
// 21[3] - meeting start time
// 21[4] - meeting end time
// 21[5] - meeting location
// 21[6] - meeting type
// 21[n][0] - meeting participant
$output[]=$mtgs;
$q2="select * from project_task where
 coid=$company and buid=$bu and pjid=$project";
$result2=obtain_query_result($q2);
$tasks=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $tid=$row2['pjtaskid'];
  $tsk=array($tid,$row2['description'],
             $row2['step'],$row2['due_date'],$row2['status']);
  $q3="select * from project_task_participant where
     coid=$company and buid=$bu and pjid=$project and pjtaskid=$tid";
  $result3=obtain_query_result($q3);
  $part=array();
  while($row3= mysqli_fetch_assoc($result3)) {
    $part[]=$row3['participant'];
    }
  $tsk[]=$part;
  $tasks[]=$tsk;
}
// 22
$output[]=$tasks;

$q2="select * from project_milestone where
 coid=$company and buid=$bu and pjid=$project ORDER BY ms_date ASC";
$result2=obtain_query_result($q2);
$ms=array();
while($row2= mysqli_fetch_assoc($result2)) {
  $ms[]=array($row2['pjmsid'],$row2['ms_label'],$row2['ms_date']);
}
$actionSql = "SELECT a.*, a.pjid apjid,p.pj_name, ss.ssid,ss.selected,ss.ss_handle, ss.ss_desc, ss.pjid, ss.ss_unimplement, ss.ss_dropped, ss.ss_complete FROM strategy_statement ss LEFT JOIN action a ON a.ssid = ss.ssid JOIN project p ON ss.pjid = p.pjid WHERE ss.selected=1 AND ss.pjid = $project";
$actionResult=obtain_query_result($actionSql);
$allActions = [];
// $allProjectActions = [];
$pendingActions = [];
$completedActions = 0;
$totalActions = 0;
$SSActionEntry = [];
$completion_year = [];
$start_year = [];
$strategies = [];
while($actionRow= mysqli_fetch_assoc($actionResult)) {
  /* Strategy Statement Action Items progress */
  if($actionRow['ss_unimplement'] == 1) continue;
  if($actionRow['ss_dropped'] == 1) continue;
  $completion_time = $actionRow['completiontime'];
  $deadline = $actionRow['deadline'];
  $creation_time = $actionRow['creationtime'];
  $action_dropped = $actionRow['dropped'];
  $action_completed = $actionRow['completed'];
  $onTime = true;
  $inProgress = true;
  $completed = false;
  $outStanding = false;
  $dropped = false;
  if($completion_time !== NULL){ // completion time is present
      $completed= true;
      $inProgress = false;
      $onTime = false;
  } else if($deadline !== NULL){// completion time is not present and deadline is present
    $deadline_ts = strtotime($deadline);
      if($deadline_ts < time()) {
        $outStanding = true;
        $onTime = false;
      }
  }
  if($action_completed == 1) {
    $completed= true;
    $outStanding = false;
    $inProgress = false;
    $onTime = false;
  }
  if($action_dropped == 1) {
    $dropped= true;
    $completed= false;
    $outStanding = false;
    $inProgress = false;
    $onTime = false;
  }
  $totalActions = 1;
  if($actionRow['actionid'] === NULL) {
    $dropped= false;
    $completed= false;
    $outStanding = false;
    $inProgress = false;
    $onTime = false;
    $totalActions = 0;
  }
  if(!isset($strategies[$actionRow['ssid']])) {
    $strategies[$actionRow['ssid']] = array(
      'project' => $actionRow['pjid'],
      'projectName' => htmlentities($actionRow['pj_name'],ENT_QUOTES, "UTF-8"),
      'totalActions' => $totalActions,
      'inProgress' => $inProgress?1:0,
      'completed' => $completed?1:0,
      'onTime' => $onTime?1:0,
      'outStanding' => $outStanding?1:0,
      'ssid' => $actionRow['ssid'],
      'ssdesc' => $actionRow['ss_desc'],
      'sshandle' => $actionRow['ss_handle'],
      'dropped' => $dropped?1:0,
    );
  }else {
    $strategies[$actionRow['ssid']]['totalActions'] += 1;
    $strategies[$actionRow['ssid']]['inProgress'] = $inProgress?$strategies[$actionRow['ssid']]['inProgress'] + 1 : $strategies[$actionRow['ssid']]['inProgress'];
    $strategies[$actionRow['ssid']]['completed'] = $completed?$strategies[$actionRow['ssid']]['completed']+1 : $strategies[$actionRow['ssid']]['completed'];
    $strategies[$actionRow['ssid']]['dropped'] = $dropped?$strategies[$actionRow['ssid']]['dropped']+1 : $strategies[$actionRow['ssid']]['dropped'];
    $strategies[$actionRow['ssid']]['onTime'] = $onTime?$strategies[$actionRow['ssid']]['onTime'] +1 : $strategies[$actionRow['ssid']]['onTime'];
    $strategies[$actionRow['ssid']]['outStanding'] = $outStanding?$strategies[$actionRow['ssid']]['outStanding'] +1 : $strategies[$actionRow['ssid']]['outStanding'];
  }
  if(!isset($allProjectActions)) {
    $allProjectActions = array(
      'project' => $actionRow['pjid'],
      'projectName' => htmlentities($actionRow['pj_name'],ENT_QUOTES, "UTF-8"),
      'totalActions' => $totalActions,
      'inProgress' => $inProgress?1:0,
      'completed' => $completed?1:0,
      'onTime' => $onTime?1:0,
      'outStanding' => $outStanding?1:0
    );
  }else {
    $allProjectActions['totalActions'] += 1;
    $allProjectActions['inProgress'] = $inProgress?$allProjectActions['inProgress'] + 1 : $allProjectActions['inProgress'];
    $allProjectActions['completed'] = $completed?$allProjectActions['completed']+1 : $allProjectActions['completed'];
    $allProjectActions['onTime'] = $onTime?$allProjectActions['onTime'] +1 : $allProjectActions['onTime'];
    $allProjectActions['outStanding'] = $outStanding?$allProjectActions['outStanding'] +1 : $allProjectActions['outStanding'];
  }
  if($actionRow['responsible'] === NULL || $actionRow['responsible'] === '') {
    continue;
  }
  $participants = explode(",",$actionRow['responsible']);
  foreach($participants as $k=> $v) {
    if(!isset($allActions[$v])) {
      $allActions[$v] = array(
        'project' => $actionRow['pjid'],
        'projectName' => htmlentities($actionRow['pj_name'],ENT_QUOTES, "UTF-8"),
        'totalActions' => $totalActions,
        'inProgress' => $inProgress?1:0,
        'completed' => $completed?1:0,
        'onTime' => $onTime?1:0,
        'outStanding' => $outStanding?1:0,
        'participant' => $v,
        'ssid' => $actionRow['ssid']
      );
    }else {
      $allActions[$v]['totalActions'] += 1;
      $allActions[$v]['inProgress'] = $inProgress?$allActions[$v]['inProgress'] + 1 : $allActions[$v]['inProgress'];
      $allActions[$v]['completed'] = $completed?$allActions[$v]['completed']+1 : $allActions[$v]['completed'];
      $allActions[$v]['onTime'] = $onTime?$allActions[$v]['onTime'] +1 : $allActions[$v]['onTime'];
      $allActions[$v]['outStanding'] = $outStanding?$allActions[$v]['outStanding'] +1 : $allActions[$v]['outStanding'];
    }
    if($inProgress || $outStanding) {
      $pendingActions[] = array(
        'pjid' => $actionRow['pjid'],
        'pj_name' => htmlentities($actionRow['pj_name'],ENT_QUOTES, "UTF-8"),
        'participant' => $v,
        'deadline' => $actionRow['deadline'],
        'description' => $actionRow['description']
      );
    }
  }
}
$ghgh = date('Y', time());
$hghg = date('Y', time());
if(count($start_year) > 0) {
  sort($start_year);
  $ghgh = $start_year[0];
}
if(count($completion_year) > 0) {
  rsort($completion_year);
  $hghg = $completion_year[0];
}
rsort($completion_year);
$SSActionEntry = array(
  'pjid' => $row['pjid'],
  'pj_name' => htmlentities($row['pj_name'],ENT_QUOTES, "UTF-8"),
  'startYear' => $ghgh,
  'endYear' => $hghg,
  'totalActions' => $totalActions,
  'completedActions' => $completedActions
);
// 23[n][0] - milestone id
// 23[n][1] - milestone label
// 23[n][0] - milestone date
$output[]=$ms;
$output[]= $row['pj_startdate']; //24
$output[]= $row['pj_region'];//25
$output[]= $row['pjid']; //26
$output[] = $allActions; //27
$output[] = $pendingActions; //28
$output[] = $SSActionEntry; //29
$output[] = $strategies; //30
$output[] = array('currency' => 'USD','trendData' => $totalQuarterSorted, 'valueRealizedTrend' => $valueRealizedYear, 'identified' => $totalValueIdentified, 'project' => htmlentities($row['pj_name'],ENT_QUOTES, "UTF-8"), 'realized' => $totalRealizedValue); //31
$output[] = isset($allProjectActions)?$allProjectActions:[]; //32
$ss_so_sql = "SELECT ss.selected ss_selected, ss.ss_desc,ss.ssid,ss_so.ssid,ss_so.soid, so.soid,so.so_desc, so.selected so_selected FROM strategy_statement ss JOIN ss_so ON ss_so.ssid = ss.ssid JOIN cost_driver_so so ON ss_so.soid = so.soid WHERE ss.pjid = $project";
$ss_so_sql_result=obtain_query_result($ss_so_sql);
$ss_so_sql_array = [];
while($ss_so_sql_row= mysqli_fetch_assoc($ss_so_sql_result)) {
  $ss_so_sql_array[] = $ss_so_sql_row;
}
$output[] = $ss_so_sql_array; //33
$output[] = $ssValueIdentified; //34
echo json_encode(array("",$output));
/* 
0 - Project Name
1 - Project Description
2 - Value and Currency
3 -
4 -
5 - Suppliers
6 - Client
7 - Participants
8 - Goal and Perspective
9 - 0:Primary Cost , 1:Estimated Amount, 2:Rationale, 3:, 4:, 5:, 6:, 7:,
10 -
11 -
12 -
13 -
14 -
15 -
16 -
17 -
18 -
19 -
20 -
21 -
22 -
23 -
24 - start date
25 - region
26 - 
27 - 
28 - 
29 - 
30 - 
31 - 
32 - 
33 -
*/
?>