<!---------------------------------- forgot password modal ---------------------------------->
      <div id="forgotpassword_modal" class="modal fade" role="dialog">
         <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content" id="pcModal">
               <div class="modal-header">
                  <h4 class="modal-title pcosttitle">Forgot Password?</h4>
               </div>
               <form id="forgot-password-form" method="post" action="send-password.php">
                  <div class="modal-body">
                        <div class="profile_dp_content">
                           <div class="input_wrp">
                              <label>Enter Email</label>
                              <input id="emailId" type="email" class="textbox" name="email">
                           </div>
                        </div>
                  </div>
                  <div class="modal-footer">
                     <input name="submit" type="submit" value="Send Password Reset Link" class="submit_btn action_btn"/>
                     <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                  </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
      <!---------------------------------- primary cost modal ---------------------------------->
      <div id="primarycost_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="pcModal">
               <div class="modal-header">
                  <h4 class="modal-title pcosttitle">Add Primary cost</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <!--<textarea type="text" class="inputText textbox" required rows="10"></textarea>-->
                     <input type="text" name="editor1" rows="10" class="inputText textbox" id="pcost_input" onkeyup='activateButton("pcost_submit");' maxlength= "64" placeholder="input here.. (limited to 64 characters)" required />
                     <label class="input_label floating_label">Primary cost</label>
                     <span id="chars"></span>
                  </div>
                  <div class="input_wrp">
                     <!--<textarea type="text" class="inputText textbox" required rows="10"></textarea>-->
                     <input type="text" name="estamt_input" rows="10" class="inputText textbox formattedNumberField" onkeyup='activateButton("pcost_submit");' id="estamt_input"  required />
                     <label class="input_label floating_label">Estimated Amount</label>
                  </div>
                  <div class="input_wrp">
                     <input type="text" list="currlist" class="textbox" required onkeyup='activateButton("pcost_submit");' id="change_currency">
                     <label class="input_label floating_label">Base Currency</label>
                  <div id="currencySelector"></div>
                  </div>
                  <input type="hidden" name="pcosttype" value="" id="pcosttype"/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDPrimaryCost()" class="submit_btn action_btn" id="pcost_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- cost_driver_modal ---------------------------------->
      <div id="cost_driver_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="cdModalContent">
               <div class="modal-header">
                  <h4 class="modal-title measuretitle">Add Cost Driver</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                  <label class="">Numerator</label>
                     <input type="text" class="form-control" onkeyup='activateButton("add_cost_btn");'  id="numerator" />
                     
                  <div class="error numerator_error" style="color: red"></div>
                  
                  </div>
                  
                  <div class="input_wrp">
                  <label class="">Denominator</label>
                     <input type="text" class="form-control" onkeyup='activateButton("add_cost_btn");' id="denominator" />
                     
                  <div class="error denominator_error" style="color: red"></div>
                  
                  </div>
                  <div class="input_wrp">
                  <label class="">Driver Name</label>
                     <input type="text" class="form-control" onkeyup='activateButton("add_cost_btn");' id="cdname" />
                     
                  <div class="error cdname_error" style="color: red"></div>
                  </div>
                  <div class="input_wrp">
                  <label class="">Current value</label>
                     <input type="text" class="form-control" onkeyup='activateButton("add_cost_btn");'  id="currentVal"/>
                     
                  </div>
                  <div class="input_wrp">
                  <label class="">Target value</label>
                     <input type="text" class="form-control" onkeyup='activateButton("add_cost_btn");'  id="targetVal"/>
                     
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDCostDriver()" class="submit_btn" id="add_cost_btn"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- add stag_item_modal ---------------------------------->
      <div id="stag_item_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="siModal">
               <div class="modal-body stagmodal_head">
                  <div class="modal-header">
                     <h4 class="modal-title stagmodal_title">Add Strategic Option</h4>
                     <div class="drag_handle">&nbsp;</div>
                  </div>
                  <div class="upper_sec">
                     <span class="num_value">
                        <div id="cdNum"></div>
                     </span>
                     <hr>
                     <span class="den_value">
                        <div id="cdDen"></div>
                     </span>
                  </div>
                  <div class="bottom_sec">
                     <span style="font-size: 1.3em;" class="process_value">
                        <b>
                           <div id="cdName"></div>
                        </b>
                     </span>
                  </div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <textarea placeholder="Describe Strategic Option" type="text" onkeyup='activateButton("stag_item_submit");' class="form-control" id="input_stagdesc" required rows="8"></textarea>
                     
                  </div>
               </div>
               <div class="modal-footer">
                  <div class="checkbox_wrp">
                     <input type="checkbox" name="useEachLine" value="yes" id="useEachLine" class="css-checkbox">
                     <label for="useEachLine" class="css-label">Save each line as separate strategic option</label>
                  </div>
                  <input type="submit" value="Save" class="submit_btn  action_btn" onClick="saveEDSOs()" id="stag_item_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- ce_modal ---------------------------------->
      <div id="ce_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <div class="modal-content draggable" id="ceModal">
               <div class="modal-header">
                  <h4 class="modal-title ce_modaltitle">Add Cost Element </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                     <label>Cost Element</label>
                     <input placeholder="This is a mandatory field. Please fill it" type="text" class="form-control" required onkeyup='activateButton("ce_submit");' id="ce_name" >
                     
                  </div>
                  <div class="form-group">
                     <label>Value</label>
                     <input placeholder="Value is a mandatory field and fill only numbers" type="text" class="form-control formattedNumberField" required oninput="numbersOnlyPlease(this);" onkeyup='activateButton("ce_submit");' id="ce_value" pattern="[0=9]">
                     
                  </div>
                  <div class="clearfix"></div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveCE()" class="submit_btn action_btn" id="ce_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- initiatives_modal ---------------------------------->
      <div id="initiatives_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <div class="modal-content draggable" id="initModal">
               <div class="modal-header">
                  <h4 class="modal-title init_modaltitle">Add Initiative </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <textarea type="text" class="inputText textbox" onkeyup='activateButton("init_submit");' id="pidesc" required rows="2" ></textarea>
                     <label class="input_label floating_label">Description for Initiative goes here </label>
                     <div class="error pidesc_error" style="color: red"></div>
                  </div>
                  
                  
                  <div class="input_wrp grid_2 no_margin">
                     <input type="number" min="1950" max="2060" step= "1" value="2018" maxlength="4" class="textbox" required onkeyup='activateButton("init_submit");' id="piyear" >
                     <label class="input_label floating_label">Year</label>
                     <div class="error piyear_error" style="color: red"></div>
                  </div>
                  <div class="input_wrp grid_2 margin_lt">
                     <input type="text" class="textbox" required onkeyup='activateButton("init_submit");' id="pisaving" >
                     <label class="input_label floating_label">Saving</label>
                     <div class="error pisaving_error" style="color: red"></div>
                     </div>
                  
                  <div class="clearfix"></div>
               </div>
               <div class="modal-footer">
                  <div class="checkbox_wrp">
                     <input type="checkbox" name="ongoingCB"  id="ongoingCB" class="css-checkbox">
                     <label for="ongoingCB" class="css-label">Ongoing?</label>
                  </div>
                  <input type="submit" value="Save" onClick="savePastInitiative()" class="submit_btn action_btn" id="init_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- strategy_modal ---------------------------------->
      <div id="strategy_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="add_smModal">
               <div class="modal-header">
                  <h4 class="modal-title strategy_modaltitle">Add Strategy Statement</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                     <label class="">Strategy Statement Number</label>
                     <input type="text" class="form-control" required onkeyup='activateButton("Strategy_submit");' id="add_strategy_no" >
                  </div>
                  <div class="form-group">
                  <label class="">Priority</label>
                  <select class="form-control" required="" id="add_priority_txt" >
                     <option value=""></option>
                     <option value="HIGH">HIGH</option>
                     <option value="MEDIUM">MEDIUM</option>
                     <option value="LOW">LOW</option>
                  </select>
                     
                  </div>
                  <div class="clearfix"></div>
                  <div class="form-group">
                  <label >Strategy statement</label>
                  <textarea type="text" class="form-control" id="add_strategy_statmnt"  onkeyup='activateButton("Strategy_submit");' required rows="3" 
                  placeholder="This is a Mandatory field" color="red"></textarea>
                     
                    
                  </div>
                  <h6 class="modal_label">Select Applicable Strategic Options </h6>
                  <div class="strategy_list cus_scroll">
                     <div id="add_allStrategicOptions"></div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDSS()" class="submit_btn action_btn" id="Strategy_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- add_statopt_modal ---------------------------------->
      <div id="add_statopt_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="asmModal">
               <div class="modal-header">
                  <h4 class="modal-title somtitle">Select Strategic Options</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div id="ssHeaderSO" class="head">
                  </div>
                  <div class="strategy_stat">
                  <div id="ssStatSO"> </div>
                  </div>
                  <div class="strategy_list cus_scroll">
                     <div id="optAllStrategicOptions"></div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="updateSOList()" class="submit_btn action_btn" id="strategyopt_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- add saving_type_modal ---------------------------------->
      <div id="saving_type_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="ssmModal">
               <div class="modal-header">
                  <h4 class="modal-title rationaletitle">Add Savings Types</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div class="head">
                     <span class="stat_count"> 1.</span>
                     <span class="Priority_type high_priority"> High</span>
                  </div>
                  <div class="strategy_stat">
                     Decrease the overall fluid volume required by building volume based on real-time mud properties instead of using unweighted pre-mix to dilute the active mud system
                  </div>
               </div>
               <div class="modal-body">
                  <h6 class="modal_label">Savings types </h6>
                  <div class="input_wrp saving_type_opt">
                     <input type="text" class="textbox"  value="Cost Improvement" required id="costImprovement" onkeyup='activateButton("savingtype_submit");'>
                     <button class="text-capitalize remove_btn pull-right"><i class="fa fa-minus"></i></button>
                  </div>
                  <div class="input_wrp saving_type_opt">
                     <input type="text" class="textbox"  value="Revenue Improvement" required id="revenueImprovement" onkeyup='activateButton("savingtype_submit");'>
                     <button class="text-capitalize remove_btn pull-right"><i class="fa fa-minus"></i> </button>
                  </div>
                  <div class="input_wrp saving_type_opt">
                     <button class="text-capitalize add_btn pull-right"><i class="fa fa-plus"></i> </button>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" class="submit_btn action_btn" id="savingtype_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- add benefit_modal ---------------------------------->
      <div id="benefit_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="bmModal">
               <div class="modal-header">
                  <h4 class="modal-title bentitle">Add Benefit</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div id="ssHeaderBen" class="head">
                  </div>
                  <div class="strategy_stat">
                  <div id="ssStatBen"></div>
                  </div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                  <label>Benefit</label>
                     <textarea type="text" class="inputText form-control" required rows="2"  onkeyup='activateButton("benefit_submit");' id="benefittext"></textarea>
                     
                  </div>

                  

                  <div class="fomr-group">
                  <label>Saving Type</label>   
                  <select class="form-control" required="" id="benefitsType">
                        <option value="" disabled="" selected="" hidden=""></option>
                        <option value="Cost Improvement">Cost Improvement</option>
                        <option value="Revenue Improvement">Revenue Improvement</option>
                        <option value="Qualitative Improvement">Qualitative Improvement</option>
                     </select>
                  </div>

                  <div class="form-group">
                  <label>Value</label>
                     <input placeholder="Value should be a number and mandatory field" type="text" class="form-control" required onkeyup='activateButton("benefit_submit");' id="benefitvalue" >
                  </div>


               </div>
                  
                

               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDBenefit()" class="submit_btn action_btn" id="benefit_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- add risk_modal ---------------------------------->
      <div id="risk_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="rmModal">
               <div class="modal-header">
                  <h4 class="modal-title risktitle">Add Risk or Cost</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div id="ssHeaderRisk" class="head">
                  </div>
                  <div class="strategy_stat">
                  <div id="ssStatRisk"></div>
                  </div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                  <label>Risk or Cost</label>
                     <textarea type="text" class="inputText form-control" required onkeyup='activateButton("risk_submit");' rows="2"  id="risktext"></textarea>
                     
                  </div>
                  
                  <div class="form-group">
                  <label>Risk/Cost  Type</label>
                     <select class="form-control" required="" id="risksType"   >
                        <option value="" disabled="" selected="" hidden=""></option>
                        <option value="Cost Increase">Cost Increase</option>
                        <option value="Revenue Decrease">Revenue Decrease</option>
                        <option value="Qualitative Risk">Qualitative Risk</option>
                     </select>
                  </div>

                  


                  <div class="form-group">
                  <label class="">Value</label>
                     <input  placeholder="Value should be a number and a mandatory field" type="text" class="form-control" required onkeyup='activateButton("risk_submit");' id="riskvalue" >
                     
                  </div>

               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" class="submit_btn action_btn" onClick="saveEDRisk()" id="risk_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- progressnote_modal ---------------------------------->
      <div id="progressnote_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="pnModal">
               <div class="modal-header">
                  <h4 class="modal-title progresstitle">Add Progress Note</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body action_stat_wrap">
                  <div class="head">
                     <span class="stat_subcount">
                        <div id="actionLabel"></div>
                     </span>
                  </div>
                  <div class="action_stat">
                  <div id="actionDesc"> </div>
                  </div>
                  <div class="clearfix">
                     <ul class="info_option_wrp stat_action pull-left">
                        <li>
                           <div class="item target_date">
                              <h6 class="title">Target Date </h6>
                              <div id="actionDeadline"></div>
                           </div>
                        </li>
                        <li>
                           <div class="item">
                              <h6 class="title">Last Updated </h6>
                              <div id="actionLastDate"></div>
                           </div>
                        </li>
                     </ul>
                     <ul class="info_option_wrp stat_action pull-right">
                        <li>
                           <div class="item text-right">
                              <h6 class="title">Progress </h6>
                              <div id="actionProgress"></div>
                           </div>
                        </li>
                        <li>
                           <div class="item owner_items">
                              <h6 class="title">Owners </h6>
                              <span class="owner_count">
                                 <div id="actionPerf"></div>
                              </span>
                           </div>
                        </li>
                     </ul>
                  </div>
               </div>
               <div class="modal-body">
               <div class="input_wrp">
                     <span class='ss-actions'>
                        <input type="radio" id="setCompleted" class="ss-action" name='ss-action' value='complete'>
                        <label for="setCompleted" class="">Complete Action</label>
                     </span>
                     <span class='ss-actions'>
                        <input type="radio" id="setDropped" class="ss-action" name='ss-action'  value='drop'>
                        <label for="setDropped" class="">Drop Action</label>
                     </span>
                     <span class='ss-actions'>
                        <input type="radio" id="setProgress" class="ss-action" name='ss-action'  value='progress'>
                        <label for="setProgress" class="">Update Progress</label>
                     </span>
                  </div>
                  <div class="input_wrp">
                     
                  </div>
                  <div class="form-group">
                     <label>Update</label>
                     <textarea placeholder="This is a mandatory field." type="text" class="form-control" id="input_update" required onkeyup='activateButton("progressnote_submit");' rows="3" ></textarea>
                     <div class="error" id='input_update_error'>
                     </div>
                  </div>
                  <div class="form-group progress-div">
                     <label>Progress in Percentage</label>
                     <input placeholder="This is a mandatory field. Please update cumulative progress percentage." type="text" class="form-control" required onkeyup='activateButton("progressnote_submit");' id="input_progress" >
                     <div class="error" id='input_progress_error'>
                     </div>
                  </div>
                  <div class="form-group">
                  <label>Date</label>
                     <input id="date-picker_progress" type="text" onchange='activateButton("progressnote_submit");' class="date-picker form-control date_icon"  />
                  </div>
                  <div class="clearfix"></div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveNewProgressNote()" class="submit_btn action_btn" id="progressnote_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- update_val_modal ---------------------------------->
      <div id="update_val_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="uvModal">
               <div class="modal-header">
                  <h4 class="modal-title vactiontitle"> Update Value Realized</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div id="ssHeaderV" class="head">
                  </div>
                  <div class="strategy_stat">
                  <div id="vSS"></div>
                  </div>
                  <ul class="stat_action modal_stat_action">
                     <li>
                        <div class="item total_bc_value">
                           <h6 class="title">Net potential value </h6>
                           <div id="vNPV"></div>
                        </div>
                     </li>
                     <li>
                        <div class="item total_bc_value">
                           <h6 class="title">Value realised</h6>
                           <div id="vRealized"></div>
                        </div>
                     </li>
                     <li>
                        <div class="item total_bc_value">
                           <h6 class="title">Action Items</h6>
                           <div id="vNumActions"></div>
                        </div>
                     </li>
                     <li>
                        <div class="item owner_items">
                           <h6 class="title">Owners </h6>
                           <div id="vPerformers"></div>
                        </div>
                     </li>
                  </ul>
               </div>
               <div class="modal-body">

               <div class="clearfix"></div>
                  
                  <div class="input_wrp">
                     <label class="form-label">Notes</label>
                     <textarea type="text" class="form-control" id="notesNPV" required rows="3" onkeyup='activateButton("update_val_submit");'></textarea>
                  </div>
                 <div class="form-group">
                  <label class="form-label">Benefits/RiskType</label>
                     <select required class="form-control"  id="verifyRisksType">
                        <option value=""></option>
                        <option value="Cost Improvement">Cost Improvement</option>
                        <option value="Revenue Improvement">Revenue Improvement</option>
                        <option value="Cost Increase">Cost Increase</option>
                        <option value="Revenue Decrease">Revenue Decrease</option>
                     </select>																																																																																																																																																																					
                  </div>
                  <div class="input_wrp grid_2 no_margin">
                  <label class="">Please update value realised</label>
                  <input type="number" placeholder="mandatory field" class="form-control" required id="value_realized" required rows="3" onkeyup='activateButton("update_val_submit");'>
                  
                  </div>
                  <div class="input_wrp grid_2 margin_lt">
                  <label class="">Date</label>
                     <input id="vDate-Picker" type="text" class="form-control date-picker date_icon" onchange='activateButton("update_val_submit");' />
                  </div>
                  <input type="hidden" name="savingsId" value='' id='savingsId'/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="addNPVtoSS()" class="submit_btn action_btn" id="update_val_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- Rationale_modal ---------------------------------->
      <div id="rationale_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="ratModal">
               <div class="modal-header">
                  <h4 class="modal-title rationaletitle">Add Rationale</h4>
                  <div id="gmsg"></div>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <!--<textarea type="text" class="inputText textbox" required rows="10"></textarea>-->
                     <textarea type="text" id="editor1" name="editor1" rows="10" class="inputText textbox" required></textarea>
                     <label class="input_label floating_label">Rationale description</label>
                  </div>
                  <input type="hidden" name="rationaletype" value="" id="rationaletype"/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveNewRationale()" class="submit_btn action_btn" id="rationale_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- Goal_modal ---------------------------------->
      <div id="goals_modal" class="modal fade" role="dialog">
         <div id="goals_modal-dialog" class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="gmModal">
               <div class="modal-header">
                  <h4 class="modal-title goaltitle">
                     <div id="goalstitle">Add Goals</div>
                  </h4>
                  <div id="gmsg"></div>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                  <label class="">Goal description</label>
                     <textarea type="text" class="form-control" id="goaldescription" required rows="8" onkeyup='activateButton("goalButton");'></textarea>
                     
                  <div class="error goaldescription_error" style="color: red"></div>
                  </div>
                  <div class="input_wrp">
                  <label class="">Add Existing Perspective</label>
                     <input type="text" id="goalOperation" required list="perspList" onkeyup='activateButton("goalButton");' class="form-control">
                  <div class="error goalOperation_error" style="color: red"></div>
                  <div id="perspectiveSelect"></div>
                  <div class="error testButton_error" style="color: red"></div>
                  </div>
                  <div class="input_wrp">
                  <div class='perspective-new'>
                  <label class="">Add New Perspective</label>
                     <input class="form-control" type="text" id="newPerspective"  value="" placeholder="Add New Perspective" />
                  </div>
                  </div>
               </div>
               <div class="modal-footer">
                  <div class="checkbox_wrp seperateGoalsContainer">
                     <input type="checkbox" name="separateGoals" value="yes" id="separateGoals" class="css-checkbox">
                     <label id="goalcblabel" for="separateGoals" class="css-label">Save each line as separate goal with same perspective.
                     </label>
                  </div>
                  <button type="button" id="goalButton"  onClick="saveEDGoal()" class="submit_btn action_btn" id=""/>Save</button>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- trying a new confirm modal -------------------------------->
      <div id="myconfirm_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="mcModal">
               <div class="modal-header">
                  <H3 class="modal-title">
                     <img src="images\info_icon.png" width=32 height=32>
                     <div id="myconfirmtitle"></div>
                  </H3>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div>
                  <div id="confirmMsg"></div>
                  </div>
               </div>
               <div class="modal-footer">
                  <div id="myconfirmButtons"></div>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- trying a new confirm modal -------------------------------->
      <div id="mymsg_modal" class="modal fade" role="dialog" style="display: none; z-index: 1200 !important;">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="mymModal">
               <div class="modal-header">
                  <h4 class="modal-title">
                     <div id="mymsgtitle"></div>
                  </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div>
                  <div id="mymsgbody"></div>
                  </div>
               </div>
               <div class="modal-footer">
                  <button type="button" class="cancel_btn" data-dismiss="modal">Dismiss</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- delete confirmation modal ---------------------------------->
      <div id="del_confirm_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="dcModal">
               <div class="modal-header">
                  <h4 class="modal-title">Delete </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div>Are you sure to delete?</div>
                  <input type="hidden" name="deleterowid" id="deleterowid" value=""/>
                  <input type="hidden" name="deletetype" id="deletetype" value=""/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Ok" class="activeBtn submit_btn action_btn" id="del_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!------------------------  modals for projects ---------------->
      <div id="projects_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="projModal">
               <div class="modal-header">
                  <h4 class="modal-title projectsTitle">Add Project </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class=" projects_modalbody cus_scroll">
                  <div class="modal-body">
                     <div class="form-group client-hidden">
                        <label >Client</label>
                        <input autocomplete="off" type="text" list="compsel" class="form-control" id="client_name" onkeyup='activateButton("project_submit");' onChange="generateBUSelector()">
                        <div id="companySelector"></div>
                        <div class="error client_name_error" style="color: red; margin-top:5px"></div>
                     </div>
                     <div class="form-group">
                        <label > Project title</label>
                        <input autocomplete="off" type="text" autofocus="autofocus"  class="form-control" onkeyup='activateButton("project_submit");' id="project_title">
                        <div class="error project_title_error" style="color: red; margin-top:5px"></div>
                     </div>
                     <div class="form-group">
                        <label > Project Description</label>
                        <span id="charcount" class="charcnt"></span>
                        <textarea type="text" class="form-control" maxlength="255" id="project_desc" onkeyup="charcountupdate(this.value)"  rows="5"></textarea>
                        
                        <div class="error project_desc_error" style="color: red; margin-top:5px"></div>
                     </div>
                     <div class="col-md-12 p-0" style="padding:0px">
                         <div class="row">
                                <div class="col-sm-6 form-group">
                                        <label >Department</label>
                                        <input autocomplete="off" type="text" list="depsel" class="form-control"  onkeyup='activateButton("project_submit");' id="client_dept">
                                        
                                        <div class="error client_dept_error" style="color: red; margin-top:5px"></div>
                                        <div id="deptSelector"></div>
                                     </div>
                                     <div class="col-sm-6 form-group" style='display:none'>
                                        <input type="checkbox" class="css-checkbox" name="activeProject" onkeyup='activateButton("project_submit");' id="activeProject">
                                        <label for="activeProject" class="css-label" >Dropped Project?</label><br>
                                     </div>
                         </div>
                     </div>
                     <div class="col-md-12 p-0" style="padding:0px">
                         <div class="row">
                                <div class="col-sm-6 form-group">
                                        <label >Base Currency</label>
                                        <input autocomplete="off" type="text" list="currlist" class="form-control" required="" onkeyup='activateButton("project_submit");' id="base_currency">
                                        
                                        <div class="error base_currency_error" style="color: red; margin-top:5px"></div>
                                        <div id="currencySelector"></div>
                                     </div>
                                     <div class="col-sm-6 form-group">
                                            <label >Project value</label>
                                        <input autocomplete="off" type="text" class="form-control formattedNumberField" onkeyup='activateButton("project_submit");' id="project_value">
                                        
                                        <div class="error project_value_error" style="color: red; margin-top:5px"></div>
                                     </div><div class="col-sm-6 form-group">
                                            <label >Region</label>
                                        <input autocomplete="off" type="text" class="form-control formattedNumberField" onkeyup='activateButton("project_submit");' id="project_region">
                                        
                                        <div class="error region_error" style="color: red; margin-top:5px"></div>
                                     </div>
                                     <!--  -->
                     <div class="col-sm-6 form-group">
                     <label >Start Date</label>
                        <input id="project_start_date" onchange='activateButton("date_submit");' type="text" class="date-picker textbox date_icon" />
                        <!-- <label class="input_label floating_label">Date</label> -->
                     <div class="error start_date_error" style="color: red"></div>
                     </div>
                                     
                         </div>
                     </div>
                     <div class="col-md-12 p-0" style="padding:0px">
                         <div class="row">
                           <div class="col-sm-6 form-group">
                              <div id="supplierSelector"></div>
                              <div class="error supplierSelector_error" style="color: red; margin-top:5px"></div>
                           </div>
                           <div class="col-sm-6 form-group">
                              <label class="newsupplierfield">New Supplier Name</label>
                              <input autocomplete="off" type="text" class="form-control" onkeyup='activateButton("project_submit");' id="supp_name">
                           </div>
                         </div>
                     </div>
                  </div>




                  
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDProject()" class="submit_btn action_btn" id="project_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- delete confirmation modal ---------------------------------->
      <div id="del_confirm_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="dc2Modal">
               <div class="modal-header">
                  <h4 class="modal-title">Delete </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div>Are you sure to delete?</div>
                  <input type="hidden" name="deleterowid" id="deleterowid" value=""/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Ok" class="activeBtn submit_btn action_btn" id="del_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------- background page modals ---------------->
      <!---------------------------------- scope modal ---------------------------------->
      <div id="scope_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="scopeModal">
               <div class="modal-header">
                  <h4 class="modal-title scope_modaltitle">Edit Project Scope</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <!--<textarea type="text" class="inputText textbox" required rows="10"></textarea>-->
                     <textarea type="text" id="editor2" onkeyup='activateButton("scope_submit");' name="editor2" rows="10" class="inputText textbox" required="">
                    </textarea>
                     <label class="input_label floating_label">Describe the scope of this project</label>
                  <div class="error editor2_error" style="color: red"></div>
                  </div>
                  <input type="hidden" name="rationaletype" value="" id="rationaletype"/>
               </div>
               <div class="modal-footer">
                  <button type="button" onClick="saveScope()" class="submit_btn action_btn" id="scope_submit"/>Save</button>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- dates_modal ---------------------------------->
      <div id="dates_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <div class="modal-content draggable" id="datesModal">
               <div class="modal-header">
                  <h4 class="modal-title dates_modaltitle">Add Dates </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="grid_wrp">
                     <div class="input_wrp grid_2 no_margin saving_type_opt">
                        <input type="text" class="textbox" required onkeyup='activateButton("date_submit");' id="input_milestone"/>
                        <label class="input_label floating_label">Milestone</label>
                     <div class="error input_milestone_error" style="color: red"></div>
                     </div>
                     <div class="input_wrp grid_2 margin_lt saving_type_opt">
                        <input id="date_milestone" onchange='activateButton("date_submit");' type="text" class="date-picker textbox date_icon" />
                        <label class="input_label floating_label">Date</label>
                     <div class="error date_milestone_error" style="color: red"></div>
                     </div>
                     <div class="clearfix"></div>
                  </div>
                  <div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input onblur="saveMilestone()"  type="button" value="Save" class="submit_btn action_btn" id="date_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- estimate_modal ---------------------------------->
      <div id="estimate_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <div class="modal-content draggable" id="estimatesModal">
               <div class="modal-header">
                  <h4 class="modal-title estimate_modaltitle">Add Estimates </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="grid_wrp">
                     <div class="input_wrp grid_2 no_margin saving_type_opt">
                        <input type="text" autofocus="autofocus" class="textbox" required onkeyup='activateButton("estimate_submit");' id="input_estimatedesc">
                        <label class="input_label floating_label">Description</label>
                     <div class="error input_estimatedesc_error" style="color: red"></div>
                     </div>
                     <div class="input_wrp grid_2 margin_lt saving_type_opt">
                        <input type="text" class="textbox" required onkeyup='activateButton("estimate_submit");' id="input_estimateamt">
                        <label class="input_label floating_label">Amount</label>
                     <div class="error input_estimateamt_error" style="color: red"></div>
                     </div>
                     <div class="clearfix"></div>
                  </div>
                  <div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEstimate()" class="submit_btn action_btn" id="estimate_submit"/>
                  <button type="button" class="cancel_btn" onClick="cancelEstimate()" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!-------------------------------- session modal ------------------------------->
      <!---------------------------------- session_modal ---------------------------------->
      <div id="session_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="sessionModal">
               <div class="modal-header">
                  <h4 class="modal-title workplanitle">Add/Edit Session</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <input type="text" class="textbox" required onkeyup='activateButton("session_submit");' id="workplantext" >
                     <label class="input_label floating_label">Agenda</label>
                  </div>
                  <div class="input_wrp grid_2 no_margin">
                     <select class="textbox" required id="workprocess" >
                        <option value="" disabled selected hidden></option>
                        <option value="Preview">Preview</option>
                        <option value="Agree">Agree</option>
                        <option value="Identify">Identify</option>
                        <option value="Measure">Measure</option>
                        <option value="Define">Define</option>
                        <option value="Reduce">Reduce</option>
                        <option value="Implement">Implement</option>
                        <option value="Verify">Verify</option>
                        <option value="Eternal">Eternal</option>
                     </select>
                     <label class="input_label floating_label">Process step</label>
                  </div>
                  <div class="input_wrp grid_2 margin_lt">
                     <select class="textbox" required id="worksessiontype" >
                        <option value="" disabled selected hidden></option>
                        <option value="Remote Type">Remote Type</option>
                        <option value="Face to Face">Face to Face</option>
                     </select>
                     <label class="input_label floating_label">Session type</label>
                  </div>
                  <div class="clearfix"></div>
                  <div class="input_wrp grid_2 no_margin">
                     <input id="sessiondate" type="text" onchange='activateButton("session_submit");' class="date-picker textbox date_icon"/>
                     <label class="input_label floating_label">Date</label>
                  </div>
                  <div class="input_wrp grid_1 margin_lt">
                     <input type="text" class="textbox clockpicker time_icon" onkeyup='activateButton("session_submit");' value="" id="workfrom" onchange="workplanselect()">
                     <label class="input_label floating_label">From</label>
                  </div>
                  <div class="input_wrp grid_1 margin_lt">
                     <input type="text" class="textbox clockpicker time_icon" onkeyup='activateButton("session_submit");' value="" id="workto" onchange="workplanselect()">
                     <label class="input_label floating_label">To</label>
                  </div>
                  <div class="clearfix"></div>
                  <div class="input_wrp">
                     <input type="text" class="textbox" required onkeyup='activateButton("session_submit");' id="worklocation" >
                     <label class="input_label floating_label">Location</label>
                  </div>
                  <div class="input_wrp">
                  <div id="wpPerformers">
                  </div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveWorkPlan()" class="submit_btn action_btn" id="session_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!-------------------------------- tasks modal --------------------------------->
      <div id="tasks_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="tasksModal">
               <div class="modal-header">
                  <h4 class="modal-title tasktitle">Add Task</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                     <label class="">Task</label>
                     <input type="text" class="form-control" required onkeyup='activateButton("tasks_submit");' id="tasktext" >
                     
                  </div>
                  <div class="form-group">
                  <label class="">Due </label>
                     <input id="input_taskdate" type="text" onchange='activateButton("tasks_submit");' class="date-picker form-control date_a date_icon" />
                  </div>
                  <div class="form-group">
                  <label class="">Process step</label>
                     <select class="form-control" required id="taskprocess" >
                        <option value="" disabled selected hidden></option>
                        <option value="Preview">Preview</option>
                        <option value="Agree">Agree</option>
                        <option value="Identify">Identify</option>
                        <option value="Measure">Measure</option>
                        <option value="Define">Define</option>
                        <option value="Reduce">Reduce</option>
                        <option value="Implement">Implement</option>
                        <option value="Verify">Verify</option>
                        <option value="Eternal">Eternal</option>
                     </select>
                     
                  </div>
                  <div class="clearfix"></div>
                  <div class="form-group">
                  <div id="taskPerformers">
                  </div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveTask()" class="submit_btn action_btn" id="tasks_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- company_modal ---------------------------------->
      <div id="company_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="companyModal">
               <div class="modal-header">
                  <h4 class="modal-title companyTitle">Add Company</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <input type="text" class="textbox" required onkeyup='activateButton("company_submit");' id="company_name">
                     <label class="input_label floating_label">Name</label>
                  </div>
                  <div class="input_wrp">
                     <input type="text" class="textbox" required onkeyup='activateButton("company_submit");' id="company_asets" >
                     <label class="input_label floating_label">Assets</label>
                  </div>
                  <div class="input_wrp">
                     <input type="text" class="textbox" required onkeyup='activateButton("company_submit");'id="company_address" >
                     <label class="input_label floating_label">Address</label>
                  </div>
                  <div class="input_wrp grid_2 no_margin">
                     <input type="text" class="textbox" required onkeyup='activateButton("company_submit");' id="company_website" >
                     <label class="input_label floating_label">Website</label>
                  </div>
                  <div class="input_wrp grid_2 margin_lt">
                     <input type="text" class="textbox" required onkeyup='activateButton("company_submit");' id="company_contact" >
                     <label class="input_label floating_label">Phone</label>
                  </div>
                  <div class="clearfix"></div>
               </div>
               <div class="modal-footer">
                  <div class="checkbox_wrp">
                     <input type="checkbox" name="supplierCB" value="yes" id="supplierCB" class="css-checkbox">
                     <label for="supplierCB" class="css-label">Register as Supplier</label>
                  </div>
                  <input type="submit" value="Save" onClick="saveEDCompany()" class="submit_btn action_btn" id="company_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- employee_modal ---------------------------------->
      <div id="employee_modal" class="modal fade tab_modal" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="employeeModal">
               <div class="modal-header ">
                  <h4 class="modal-title employeeTitle">Add Employee</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <!-- Tab panes -->
                  <div class="tab-content">
                     <!-- tab 1 -->
                     <div class="tab-pane active" id="individual_emp">
                        <div class="input_wrp grid_2 no_margin">
                           <input type="text" class="textbox" required onkeyup='activateButton("employee_submit");' id="emp_fname" >
                           <label class="input_label floating_label">First Name</label>
                        </div>
                        <div class="input_wrp grid_2 margin_lt">
                           <input type="text" class="textbox" required onkeyup='activateButton("employee_submit");' id="emp_lname" >
                           <label class="input_label floating_label">Last Name</label>
                        </div>
                        <div class="clearfix"></div>
                        <div class="input_wrp">
                           <input type="text" list="compsel" class="textbox" required onkeyup='activateButton("employee_submit");' id="emp_company" >
                           <label class="input_label floating_label">Company</label>
                        <div id="companySelector"></div>
                        </div>
                        <div class="input_wrp grid_2 no_margin">
                           <input type="text" class="textbox" required id="emp_desg" onkeyup='activateButton("employee_submit");'>
                           <label class="input_label floating_label">Designation</label>
                        </div>
                        <div class="input_wrp grid_2 margin_lt">
                           <input type="text" class="textbox" required onkeyup='activateButton("employee_submit");' id="emp_email">
                           <label class="input_label floating_label">Email</label>
                        </div>
                        <div class="clearfix"></div>
                        <div class="modal-footer">
                           <div class="checkbox_wrp">
                              <input type="checkbox" name="checkboxG6" value="yes" id="checkboxG6" class="css-checkbox">
                              <label for="checkboxG6" class="css-label">Assign as company admin</label>
                           </div>
                           <input type="submit" value="Save" onClick="saveEDPerson()" class="submit_btn action_btn" id="employee_submit"/>
                           <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                        </div>
                     </div>
                     <!-- tab 2 -->
                     <div class="tab-pane" id="import_emp">
                        <div class="input_wrp">
                           <input type="file" name="img[]" class="file">
                           <div class="input-group browse_wrp">
                              <input type="text" class="textbox browseinput" disabled placeholder="Select File" id="import_file" onkeyup="emp_importtext()">
                              <span class="browsebtn_wrp">
                              <button class="text-capitalize browse btn browse_btn" type="button"> Browse</button>
                              </span>
                           </div>
                           <div class="import_note">
                              <span class="import_count">92</span> records identified . Assign columns from file to respective values to import list.
                           </div>
                        </div>
                        <div class="input_wrp assigncol_wrp">
                           <label>Assign Column</label>
                           <table class="table assigncol_table">
                              <tr>
                                 <td width="50%"> First Name</td>
                                 <td width="50%">
                                    <select class="textbox" id="assign_col_1" required onchange="emp_importselect()">
                                       <option value="" disabled="" selected="" hidden=""></option>
                                       <option value="assigncol">Column 1</option>
                                       <option value="assigncol">Column 2</option>
                                       <option value="assigncol">Column 3</option>
                                       <option value="assigncol">Column 4</option>
                                       <option value="assigncol">Column 5</option>
                                    </select>
                                 </td>
                              </tr>
                              <tr>
                                 <td width="50%"> Last Name</td>
                                 <td width="50%">
                                    <select class="textbox" id="assign_col_2" required onchange="emp_importselect()">
                                       <option value="" disabled="" selected="" hidden=""></option>
                                       <option value="assigncol">Column 1</option>
                                       <option value="assigncol">Column 2</option>
                                       <option value="assigncol">Column 3</option>
                                       <option value="assigncol">Column 4</option>
                                       <option value="assigncol">Column 5</option>
                                    </select>
                                 </td>
                              </tr>
                              <tr>
                                 <td width="50%"> Company</td>
                                 <td width="50%">
                                    <select class="textbox" id="assign_col_3" required onchange="emp_importselect()">
                                       <option value="" disabled="" selected="" hidden=""></option>
                                       <option value="assigncol">Column 1</option>
                                       <option value="assigncol">Column 2</option>
                                       <option value="assigncol">Column 3</option>
                                       <option value="assigncol">Column 4</option>
                                       <option value="assigncol">Column 5</option>
                                    </select>
                                 </td>
                              </tr>
                              <tr>
                                 <td width="50%">Designation</td>
                                 <td width="50%">
                                    <select class="textbox" id="assign_col_4" required onchange="emp_importselect()">
                                       <option value="" disabled="" selected="" hidden=""></option>
                                       <option value="assigncol">Column 1</option>
                                       <option value="assigncol">Column 2</option>
                                       <option value="assigncol">Column 3</option>
                                       <option value="assigncol">Column 4</option>
                                       <option value="assigncol">Column 5</option>
                                    </select>
                                 </td>
                              </tr>
                              <tr>
                                 <td width="50%">Email</td>
                                 <td width="50%">
                                    <select class="textbox" id="assign_col_5" required onchange="emp_importselect()">
                                       <option value="" disabled="" selected="" hidden=""></option>
                                       <option value="assigncol">Column 1</option>
                                       <option value="assigncol">Column 2</option>
                                       <option value="assigncol">Column 3</option>
                                       <option value="assigncol">Column 4</option>
                                       <option value="assigncol">Column 5</option>
                                    </select>
                                 </td>
                              </tr>
                           </table>
                        </div>
                        <div class="modal-footer">
                           <input type="submit" value="Save" onClick="saveEDPerson()" class="submit_btn action_btn" id="empimport_submit"/>
                           <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- files_modal ---------------------------------->
      <div id="files_modal" class="modal fade tab_modal" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="filesModal">
               <div class="modal-header">
                  <h4 class="modal-title filesTitle">Add Project File</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
               <div class="input_wrp" id="dropzone">
                              <div class="form-group">
                                 <input type="file" name="file" id="file" >
                              </div>
                              <div class="form-group">
                              <label class="">Document Title</label>
                                 <input type="text" class="form-control" required name="title" id="title" >
                                 
                              </div>
                              <div class="form-group">
                                 <label class="">Use in step</label>
                                 <select class="fomr-control" id="step" name="step" required>
                                    <option value="">Select Step</option>
                                    <option value="Preview" selected>Preview</option>
                                    <option value="Agree">Agree</option>
                                    <option value="Identify">Identify</option>
                                    <option value="Measure">Measure</option>
                                    <option value="Define">Define</option>
                                    <option value="Reduce">Reduce</option>
                                    <option value="Implement">Implement</option>
                                    <option value="Verify">Verify</option>
                                    <option value="Eternal">Eternal</option>
                                 </select>
                                 
                              </div>
                           </div>
                           <div id="projectVariables"></div>
                           <div class="modal-footer addfile">
                              <input type="submit" value="Save" onclick="disableFileSubmit();" class="submit_btn action_btn" id="file_submit"/>
                              <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                           </div>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- bp_modal ---------------------------------->
      <div id="bp_modal" class="modal fade tab_modal" role="dialog">
         <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
               <div class="modal-header">
                  <h4 class="modal-title workplanitle">Add Participant</h4>
               </div>
               <div class="modal-body">
                  <ul class="tablist">
                     <li class="active"><a href="#individual_emp" aria-controls="home" role="tab" data-toggle="tab">Add Individual</a></li>
                     <li><a href="#import_emp" aria-controls="profile" role="tab" data-toggle="tab">Import List from File</a></li>
                     <li><a href="#prv_proj" aria-controls="profile" role="tab" data-toggle="tab">From Previous Projects (32)</a></li>
                  </ul>
                  <!-- Tab panes -->
                  <div class="tab-content">
                     <!-- tab 1 -->
                     <div class="tab-pane active" id="individual_emp">
                        Tab One contents
                     </div>
                     <!-- tab 2 -->
                     <div class="tab-pane" id="import_emp">
                        Tab Two contents
                     </div>
                     <!-- tab 3 -->
                     <div class="tab-pane" id="prv_proj">
                        Tab Three contents
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- participant_modal ---------------------------------->
      <div id="participant_modal" class="modal fade tab_modal" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="partsModal">
               <div class="modal-header">
                  <h4 class="modal-title workplanitle">Add Participants</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div id="partTabs">
                     <ul >
                        <li class="active"><a href="#individual_emp" role="tab" data-toggle="tab">Add new person</a></li>
                        <li ><a href="#prv_proj"  role="tab" data-toggle="tab">Select Existing Personnel</a></li>
                        <!--- <li ><a href="#import_emp" aria-controls="profile" role="tab" data-toggle="tab">Import List from File</a></li> --->
                     </ul>
                     <!-- Tab panes -->
                     <div id="individual_emp">
                        <div class="input_wrp grid_2 no_margin">
                           <input type="text" class="textbox" required id="partind_fname" onkeyup='activateButton("indemp_submit");'>
                           <label class="input_label floating_label">First Name</label>
                        </div>
                        <div class="input_wrp grid_2 margin_lt">
                           <input type="text" class="textbox" required id="partind_lname" onkeyup='activateButton("indemp_submit");'>
                           <label class="input_label floating_label">Last Name</label>
                        </div>
                        <div class="clearfix"></div>
                        <div class="input_wrp">
                           <input list="compsel2" type="text" class="textbox" required onkeyup='activateButton("indemp_submit");' id="partind_company">
                           <label class="input_label floating_label">Company</label>
                        <div id="companySelector2"></div>
                        </div>
                        <div class="input_wrp grid_2 no_margin">
                           <input type="text" class="textbox" required id="partind_desg">
                           <label class="input_label floating_label">Designation</label>
                           <!---
                              <datalist id="particChoices">
                                <option value="MEMBER">
                                <option value="FACILITATOR">
                                <option value="LEADER">
                              </datalist>
                              --->
                        </div>
                        <div class="input_wrp grid_2 margin_lt">
                           <input type="text" class="textbox" required onkeyup='activateButton("indemp_submit");' id="partind_email">
                           <label class="input_label floating_label">Email</label>
                        </div>
                        <div class="clearfix"></div>
                        <div class="modal-footer">
                           <!---
                              <div class="checkbox_wrp">
                                  <input type="checkbox" name="checkboxG6" value="yes" id="checkboxG6" class="css-checkbox">
                                  <label for="checkboxG6" class="css-label">Assign as company admin</label>
                              </div>
                              -->
                           <input type="submit" value="Add to Project" id="indemp_submit" onClick="addPersonToProject()" class="submit_btn action_btn" />
                           <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                        </div>
                     </div>
                     <!-- tab 2 -->
                     <div  id="prv_proj">
                        -
                           <div>
                             <input type="text" class="prvprojserach" required id="prvprojserach" onkeyup="" placeholder="Search Personnel">
                           </div>
                          
                        <div class="prv_proj_table_wrp">
                           <table class="table prv_proj_thead">
                              <thead>
                                 <tr>
                                    <th width="5%">
                                       <div class="checkbox_wrp">
                                          <input type="checkbox" name="checkbox1" value="yes" id="checkbox1" class="css-checkbox">
                                          <label for="checkbox1" class="css-label"></label>
                                       </div>
                                    </th>
                                    <th width="50%"> Participant</th>
                                    <th width="45%"> Designation</th>
                                 </tr>
                              </thead>
                           </table>
                           <div class="prv_proj_scroll cus_scroll">
                              <div id="participantPoolSelector"></div>
                           </div>
                        </div>
                        <div class="modal-footer">
                           <div class="pull-left">
                           </div>
                           <input type="submit" value="Save" class="submit_btn action_btn" onClick="updateParticipants()" id="bpprv_submit"/>
                           <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- action_modal ---------------------------------->
      <div id="action_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="actionModal">
               <div class="modal-header">
                  <h4 class="modal-title actiontitle"> Add Action Item </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body statopt_modalhead">
                  <div id="ssHeaderA" class="head">
                  </div>
                  <div class="strategy_stat">
                  <div id="ssDesc">
                  </div>
                  </div>
                  <div class="info_option_wrp stat_action">
                     <div class="item total_bc_value">
                        <h6 class="title">Net potential value </h6>
                        <div id="ssVal"></div>
                     </div>
                  </div>
               </div>
               <div class="modal-body">
                  <div class="input_wrp">
                     <label class="">Action </label>
                     <input placeholder="This field is mandatory." type="text" class="form-control" required onkeyup='activateButton("action_submit");' id="action_desc" >
                  </div>
                  <div class="form-group input_wrp">
                  <label class="">Target Date</label>
                     <input id="action_date" type="text" onchange='activateButton("action_submit");' class="date-picker form-control date_icon"  />
                  </div>
                  <div class="input_wrp">
                  <label class="">Select Performers </label>
                     <div id="actionPerformers"></div>
                  </div>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Save" class="submit_btn action_btn" onClick="saveEDSSAction()" id="action_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!---------------------------------- delete confirmation modal ---------------------------------->
      <div id="del_confirm_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="dcModal3">
               <div class="modal-header">
                  <h4 class="modal-title">Delete </h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div>Are you sure to delete?</div>
                  <input type="hidden" name="deleterowid" id="deleterowid" value=""/>
                  <input type="hidden" name="deletetype" id="deletetype" value=""/>
               </div>
               <div class="modal-footer">
                  <input type="submit" value="Ok" class="activeBtn submit_btn action_btn" id="del_submit"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            </div>
         </div>
      </div>
      <!-- ---------------------------------- edit strategy modal ------------------------------------------------- -->
      <div id="edit_strategy_modal" class="modal fade" role="dialog">
         <div class="modal-dialog draggable">
            <!-- Modal content-->
            <div class="modal-content draggable" id="smModal">
               <div class="modal-header">
                  <h4 class="modal-title edit_strategy_modaltitle">Edit Strategy Statement</h4>
                  <div class="drag_handle">&nbsp;</div>
               </div>
               <div class="modal-body">
                  <div class="form-group">
                  <label class="">Strategy Statement Number</label>
                     <input type="text" class="textbox" required onkeyup='activateButton("Strategy_submit");' id="strategy_no" >
                     
                  </div>
                  <div class="form-group">
                  <label class="">Priority</label>
                     <select class="textbox" required="" id="priority_txt" >
                        <option value=""></option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                     </select>
                     
                  </div>
                  <div class="clearfix"></div>
                  <div class="input_wrp">
                  <label >Strategy statement</label>
                     <textarea type="text" class="form-control" id="strategy_statmnt"  onkeyup='activateButton("Strategy_submit");' required rows="3" 
                      placeholder="This is a Mandatory field" color="red"></textarea>
                    </div>
                    <div class="form-group grid_2 no_margin">
                    <label class="">Start Date</label>
                     <input id="input_startdate" type="text" onchange='activateButton("Strategy_submits");' class="date-picker form-control date_icon" />
                    
                   </div>

                   <div class="form-group grid_2">
                   <label class="">Target Date</label>
                     <input id="input_enddate" type="text" onchange='activateButton("Strategy_submits");' class="date-picker form-control date_icon" />
                     
                   </div>
                   <div class="form-group">
                    <label class="">Select Owner </label>
                     <select id="multiselect_owners" class="form-control">

                     </select>
                  </div>
                 </div>
                
               <div class="modal-footer">
                  <input type="submit" value="Save" onClick="saveEDSSI()" class="submit_btn action_btn" id="Strategy_submits"/>
                  <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
               </div>
            
         </div>
      </div></div>
      <!------------------------------------ Undropping modal------------------------------------------ -->

   <div id="undrop_modal" class="modal fade" role="dialog">
    <div class="modal-dialog draggable">
         <!-- Modal content-->
         <div class="modal-content draggable" id="undrop_modal_ss">
            <div class="modal-header">
               <h4 class="modal-title  highlight-modal-title">Reason for undropping Strategy Statement</h4>
               <div class="drag_handle">&nbsp;</div>
            </div>
            <div class="modal-body">
               <div class="clearfix"></div>
               <div class="input_wrp">
                  <label >Reason</label>
                  <textarea type="text" class="form-control" id="undrop_reason"  onkeyup='activateButton("Strategy_submit");' required rows="3" 
                     placeholder="This is a Mandatory field" color="red"></textarea>
                     <input type="hidden" name="ssid" value='-1' id='undrop_ssid'>
               </div>
            </div>
         
         <div class="modal-footer">
            <input type="submit" value="Save" onClick="saveUnDropReason()" class="submit_btn action_btn" id="undrop_save"/>
             <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
         </div>
      </div>
   </div>
   </div>

 <!------------------------------------ Reopen modal------------------------------------------ -->

 <div id="reopen_modal" class="modal fade" role="dialog">
    <div class="modal-dialog draggable">
         <!-- Modal content-->
         <div class="modal-content draggable" id="reopen_modal_ss">
            <div class="modal-header">
               <h4 class="modal-title highlight-modal-title">Reason for Reopening Strategy Statement</h4>
               <div class="drag_handle">&nbsp;</div>
            </div>
            <div class="modal-body">
               <div class="clearfix"></div>
               <div class="input_wrp">
                  <label >Reason</label>
                  <textarea type="text" class="form-control" id="reopen_reason"  onkeyup='activateButton("Strategy_submit");' required rows="3" 
                     placeholder="This is a Mandatory field" color="red"></textarea>
                     <input type="hidden" name="ssid" value='-1' id='reopen_ssid'>
               </div>
            </div>
         
         <div class="modal-footer">
            <input type="submit" value="Save" onClick="reopenSSV()" class="submit_btn action_btn" id="reopen_save"/>
             <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
         </div>
      </div>
   </div>
   </div>

<!-- ----------------------------------------------------------------------------------------------------------------------- -->
<div id="unselect_modal" class="modal fade" role="dialog">
    <div class="modal-dialog draggable">
         <!-- Modal content-->
         <div class="modal-content draggable" id="unselect_modal_ss">
            <div class="modal-header">
               <h4 class="modal-title highlight-modal-title">This Strategy Statement has Action Items assigned. Are you sure you want to unselect this Strategy Statement? If yes, please provide a reason.</h4>
               <div class="drag_handle">&nbsp;</div>
            </div>
            <div class="modal-body">
               <div class="clearfix"></div>
               <div class="input_wrp">
                  <label >Reason For Unselecting</label>
                  <textarea type="text" class="form-control" id="unimplement_reason"  onkeyup='activateButton("Strategy_submit");'  rows="3" 
                     placeholder="This is a Mandatory field" color="red" required></textarea>
                     <input type="hidden" name="ssid" value='-1' id='unselect_ssid'>
               </div>
            </div>
         
         <div class="modal-footer">
            <input type="submit" value="Save" onClick="saveUnSelectReason()" class="submit_btn action_btn" id="undrop_save"/>
             
             <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
         </div>
      </div>
   </div>
   </div>

   <!-- --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- -->

   <div id="drop_modal" class="modal fade" role="dialog">
    <div class="modal-dialog draggable">
         <!-- Modal content-->
         <div class="modal-content draggable" id="drop_modal_ss">
            <div class="modal-header">
               <h4 class="modal-title highlight-modal-title">This Strategy Statement has Action Items assigned. Are you sure you want to drop this Strategy Statement? If yes, please provide a reason.</h4>
               <div class="drag_handle">&nbsp;</div>
            </div>
            <div class="modal-body">
               <div class="clearfix"></div>
               <div class="input_wrp">
                  <label >Reason for Dropping</label>
                  <textarea type="text" class="form-control" id="drop_reason"  onkeyup='activateButton("Strategy_submit");' required rows="3" 
                     placeholder="This is a Mandatory field" color="red"></textarea>
                     <input type="hidden" name="ssid" value='-1' id='drop_ssid'>
               </div>
            </div>
         
         <div class="modal-footer">
            <input type="submit" value="Save" onClick="deleteEDSSIm()" class="submit_btn action_btn" id="undrop_save"/>
             
             <button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>
         </div>
      </div>
   </div>
   </div>
