var GpreloginBody = "";
var btnClass2 = "btn2 btn2-primary";
var btnClass1 = "btn-sm btn-primary";
var btnClass = btnClass1;
var GmaxShortStrategyDesc = 30;
var GstatusIndex = 11;
var GprojectFilterSetting = "Active";
var GallProjects = false;
var GsortOrder = "Sort By Creation Date";
var GsortChoices = [
  "Sort By Creation Date",
  "Sort By Project Name",
  "Sort By Company Name",
  "Sort By Contract Value"
];
var Gtitles = [
  ["Agree", "Agree on the Need to Manage Costs"],
  ["Identify", "Identify the Critical Cost Elements"],
  ["Measure", "Measure the Cost Elements"],
  ["Define", "Define the Key Cost Drivers"],
  ["Reduce", "Reduce/Change/Remove Activities that Cause Cost"],
  ["Implement", "Implement a Cost Management Strategy"],
  ["Verify", "Verify the Performance of the Action Plan"],
  ["Eternal", "Eternal Focus on New Ideas for Cost Reduction"]
];

var Gperspectives = [
  "Cost",
  "Customer Service",
  "Engineering",
  "Environment",
  "Finance",
  "HR",
  "Legal",
  "Logistics",
  "Marketing",
  "Operations",
  "Planning",
  "Procurement",
  "Quality",
  "R&D",
  "Reliability",
  "Safety",
  "Social",
  "Supply Chain",
  "Technology"
];
var GssFilter = 1;
var GeditingGoal = -1;
var Grtypes = [
  "OPEX Increase",
  "CAPEX Increase",
  "Revenue Reduction",
  "Qualitative"
];
var Gbtypes = [
  "OPEX Reduction",
  "CAPEX Reduction",
  "Revenue Increase",
  "Cost Avoidance",
  "Qualitative"
];
var Gcompanies = [];
var Gsuppliers = [];
var Gprojects = [];
var Gcommodities = [];
var Gnaics = [];
var Gcurrency = [];
var Gstrategies = [];
var Gpersons = [];
var Gadmin = 0;
var Gcurrentstrategy = 0;
var Gcurrentdata = [];
var Ggoalsindex = 8;
var Gprimeindex = 9;
var Gelementsindex = 10;
var Gcdindex = 11;
var Grbindex = 12;
var Gcommentsindex = 13;
var Gdocsindex = 14;
var Gcurrentcompany = 0;
var Gcdateindex = 16;
var Gmdateindex = 15;
var Gscopeindex = 17;
var Gcommentindex = 18;
var Gestimatesindex = 19;
var Gpastinitindex = 20;
var Gworkplanindex = 21;
var Gtasksindex = 22;
var Gmilesindex = 23;
var Gscope = "";
var Gestimates = [];
var Gpastinits = [];
var Gmeetings = [];
var Gtasks = [];
var Gmiles = [];
var Gcurrentpage;
var Gcurrentuser = [];
var GmyProjectsBody,
  GcompaniesBody,
  GbusBody,
  GpersonsBody,
  GeditProjectsBody,
  GeditTeamsBody,
  GeditCommsBody;
var GagreeContent,
  GidentifyContent,
  GmeasureContent,
  GdefineContent,
  GreduceContent;
var GimplementContent, GverifyContent, GeternalContent, GreportsContent;
var Gcurrentstep;
var GcurrentSS;
var GcurrentSSEntry = [];
var GdefaultCurrency = "";
var GselectedProject;
var GheaderColor = "lightgray";
var Gcostdrivers = [];
var selectedCompany;
var selectedCommodity;
var selectedPerson;
var selectedAdminStrategy;
var LOGINTAB = 0;
var SOURCETAB = 1;
var QUERYTAB = 2;
var RESULTTAB = 3;
var SAVEDTAB = 4;
var FAQTAB = 5;
var Gusername = "";
var Gtoken = "";
var Gemployer = "";
var Gpnid = "";
var Gsession = "";
var clientID = "";
var currentquery = "";
var finalString = "";
var saveAdvancedQueryBody = "";
var saveConjunctsBody = "";
var saveInputDetails = [];

if (localStorage.getItem("Gtoken") !== null) {
  document.getElementById("prelogin-body").innerHTML = "";
  Gtoken = localStorage.getItem("Gtoken");
  Gusername = localStorage.getItem("Gusername");
  Gadmin = localStorage.getItem("Gadmin");
  Gemployer = localStorage.getItem("Gemployer");
  if (Gadmin) {
    addendum = "<br>You are an Aim&Drive administrator";
  }
  document.getElementById("postlogin-body").style.display = "block";
  GpreloginBody = document.getElementById("prelogin-body").innerHTML;
  startup();
}
var ssClicks = [];
function resetSSClicks() {
  ssClicks = [];
}
/**
 * Used to get from the datepicker.
 * @param {string} id - The id of the datepicker div
 */
function getDateById(id) {
  var value = $("#" + id)
    .datepicker()
    .val();

  if (value === "") {
    return new Date().toLocaleString("en-GB");
  }
  var elements = new Date(value).toLocaleString("en-GB");
  return elements;
}
/**
 * Used to set the datepicker for the dive.
 * @param {string} id - The id of the datepicker div
 * @param {string} val - The date value from database
 */
function setDateById(id, val) {
  var elements = val.split("-");
  var newval = elements[1] + "/" + elements[2] + "/" + elements[0];
  $("#" + id).datepicker("setDate", newval);
}
/**
 * Used to save a new rationale in the database
 */
function saveNewRationale() {
  $("#rationale_modal").modal("hide");
  $(".rationaletitle").text("Edit Rationale");
  $.ajax({
    url:
      "set-primary-cost.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&rationale=" +
      encodeURIComponent(CKEDITOR.instances.editor1.getData()),
    type: "POST",
    success: updateAStep,
    error: errorFun
    //,datatype: "json"
  });
}

function savePrimaryCost() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }

  if (validNumber("aestim") == 0) {
    showTimedMessage("gmsg", "Estimated cost is not a valid number!", 0, true);
    return;
  }
  if (validNumber("alever") == 0) {
    showTimedMessage(
      "gmsg",
      "Leveragable savings is not a valid number!",
      0,
      true
    );
    return;
  }

  var acq, usage, eol;
  if (validNumber("acquis-cost") == 0) {
    acq = 0;
  } else acq = extractNumber(document.getElementById("acquis-cost").value);

  if (validNumber("usage-cost") == 0) {
    usage = 0;
  } else usage = extractNumber(document.getElementById("usage-cost").value);

  if (validNumber("eol-cost") == 0) {
    eol = 0;
  } else eol = extractNumber(document.getElementById("eol-cost").value);

  showTimedMessage("gmsg", "Saving primary cost...", 0, true);
  $.ajax({
    url:
      "set-primary-cost.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&pc=" +
      encodeURIComponent(document.getElementById("aprime").value) +
      "&cost=" +
      encodeURIComponent(
        extractNumber(document.getElementById("aestim").value)
      ) +
      "&leveragable=" +
      encodeURIComponent(
        extractNumber(document.getElementById("alever").value)
      ) +
      "&acquisition=" +
      encodeURIComponent(acq) +
      "&usage=" +
      encodeURIComponent(usage) +
      "&eol=" +
      encodeURIComponent(eol) +
      "&curr=" +
      encodeURIComponent(prCurr) +
      "&rationale=" +
      encodeURIComponent(document.getElementById("arationale").value),
    type: "POST",
    success: saveChangedGoals,
    error: errorFun
    //,datatype: "json"
  });
}
/**
 * Used to save primary cost in the database
 */
function saveEDPrimaryCost() {
  $("#primarycost_modal").modal("hide");
  if (validNumber("estamt_input") == 0) {
    showTimedMessage("gmsg", "Estimated cost is not a valid number!", 0, true);
    return;
  }
  var cost = extractNumber(document.getElementById("estamt_input").value);
  currency = document.getElementById("change_currency").value;
  saveMainScrollXY();
  showTimedMessage("gmsg", "Saving primary cost...", 0, false);
  $.ajax({
    url:
      "set-primary-cost.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&pc=" +
      encodeURIComponent(document.getElementById("pcost_input").value) +
      "&cost=" +
      encodeURIComponent(cost) +
      "&currency=" +
      encodeURIComponent(currency),
    type: "POST",
    success: saveEDAgree,
    error: errorEDFun
    //,datatype: "json"
  });
}

function addSSClick(index) {
  for (var i = 0; i < ssClicks.length; i++) {
    if (ssClicks[i][0] == index) {
      ssClicks[i][1] = ssClicks[i][1] + 1;
      return;
    }
  }
  ssClicks.push([index, 1]);
}

function getSSClicks(index) {
  for (var i = 0; i < ssClicks.length; i++) {
    if (ssClicks[i][0] == index) {
      return ssClicks[i][1];
    }
  }
  return 0;
}
var soClicks = [];
function resetSOClicks() {
  soClicks = [];
}
function addSOClick(i, j) {
  for (var k = 0; k < soClicks.length; k++) {
    if (soClicks[k][0] == i && soClicks[k][1] == j) {
      soClicks[k][2] = soClicks[k][2] + 1;
      return;
    }
  }
  soClicks.push([i, j, 1]);
}

function getSOClicks(i, j) {
  for (var k = 0; k < soClicks.length; k++) {
    if (soClicks[k][0] == i && soClicks[k][1] == j) {
      return soClicks[k][2];
    }
  }
  return 0;
}

// priority panel -- is it open (one per SS )
var prClicks = [];

function resetPRClicks() {
  prClicks = [];
}

function addPRClick(i) {
  for (var k = 0; k < prClicks.length; k++) {
    if (prClicks[k][0] == i) {
      prClicks[k][1] = prClicks[k][1] + 1;
      return;
    }
  }
  prClicks.push([i, 1]);
}

function getPRClicks(i) {
  for (var k = 0; k < prClicks.length; k++) {
    if (prClicks[k][0] == i) {
      return prClicks[k][1];
    }
  }
  return 0;
}

// ss summ panel -- is it open (one per SS )
var summClicks = [];

function resetSummClicks() {
  summClicks = [];
}

function addSummClick(i) {
  for (var k = 0; k < summClicks.length; k++) {
    if (summClicks[k][0] == i) {
      summClicks[k][1] = summClicks[k][1] + 1;
      return;
    }
  }
  summClicks.push([i, 1]);
}

function getSummClicks(i) {
  for (var k = 0; k < summClicks.length; k++) {
    if (summClicks[k][0] == i) {
      return summClicks[k][1];
    }
  }
  return 0;
}

// verify -- progress panel
var progClicks = [];

function resetProgClicks() {
  progClicks = [];
}

function addProgClick(i, j) {
  for (var k = 0; k < progClicks.length; k++) {
    if (progClicks[k][0] == i && progClicks[k][1] == j) {
      progClicks[k][2] = progClicks[k][2] + 1;
      return;
    }
  }
  progClicks.push([i, j, 1]);
}

function getProgClicks(i, j) {
  for (var k = 0; k < progClicks.length; k++) {
    if (progClicks[k][0] == i && progClicks[k][1] == j) {
      return progClicks[k][2];
    }
  }
  return 0;
}

// verify -- comments

var commClicks = [];

function resetCommClicks() {
  commClicks = [];
}

function addCommClick(i, j) {
  for (var k = 0; k < commClicks.length; k++) {
    if (commClicks[k][0] == i && commClicks[k][1] == j) {
      commClicks[k][2] = commClicks[k][2] + 1;
      return;
    }
  }
  commClicks.push([i, j, 1]);
}

function getCommClicks(i, j) {
  for (var k = 0; k < commClicks.length; k++) {
    if (commClicks[k][0] == i && commClicks[k][1] == j) {
      return commClicks[k][2];
    }
  }
  return 0;
}

function setButtonClass() {
  if (document.getElementById("btnclass1").checked) btnClass = btnClass1;
  else btnClass = btnClass2;
}

function getMyData() {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][1] == null) {
      myAlert("Attention", "weird entry: " + Gpersons[1][i], "error");
      return;
    }
    if (Gpersons[1][i][1].valueOf() == Gusername.valueOf())
      return Gpersons[1][i];
  }
  return null;
}

function selectAll(id) {
  //document.getElementById(id).focus();
  //document.getElementById(id).select();
}
/**
 * Used to show messages for actions.
 * @param {string} id - id of the div where the message has to be showed.
 * @param {string} msg - Message string.
 * @param {string} interval - time interval after which the message should appear.
 * @param {bool} error - Flag to indicate where it is an error or not.
 */
function showTimedMessage(id, msg, interval, error) {
  // id doesn't matter -- we can take out this parameter later...
  // if (document.getElementById(id) == null) return;
  $("#wait").css("display", "block");
  $(".msgimg").css("display", "none");
  $(".errimg").css("display", "none");
  if (error) {
    $("#wait").css("display", "none");
    myAlert("ERROR!", msg, "error");
  } else {
    document.getElementById("waitmsg").innerHTML = msg;
    $(".msgimg").css("display", "block");
  }
  if (interval > 0) setTimeout(clearDisplayArea(id), interval);
}

// 1: login; 2: data sources; 3: query; 4: results ; 5: saved queries; 6: faq
function tabSet(i) {
  $("#maintabs").tabs("option", "active", i);
}

function setbg(id, color) {
  document.getElementById(id).style.background = color;
}

// relations is all the relations and their information
// relations is an array where each of the following form
//   [ group1, [ rel1, args, types, doc ], [ rel2, args, types, doc ] ...]
var Grelations = [];
var Gsavedqueries = [];

var currentSavedQuery = "";
function includes(arr, obj) {
  if (arr == null || obj == null) return false;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].valueOf() == obj.valueOf()) return true;
  }
  return false;
}

function nothing() {}
/**
 * Used to login the user. Validates against the server
 */
function login() {
  document.getElementById("loginstatus").innerHTML = "Trying to login";
  $.ajax({
    url:
      "login.php?username=" +
      encodeURIComponent(document.getElementById("email").value) +
      "&password=" +
      encodeURIComponent(document.getElementById("password").value),
    type: "POST",
    success: loginOK,
    error: loginFailed
    //,datatype: "json"
  });
}

function conjunctsSelected() {
  return document.getElementById("conjuncts").checked;
}

function queryTypeSelected() {
  if (!conjunctsSelected()) {
    // saveConjunctsBody = document.getElementById("queryedit").innerHTML;
    // document.getElementById("advarea").innerHTML = saveAdvancedQueryBody;
    document.getElementById("advarea").style.display = "block";
    document.getElementById("advarea").style.visibility = "visible";
    document.getElementById("queryedit").style.display = "none";
    document.getElementById("queryedit").style.visibility = "hidden";
  } else {
    // savedAdvancedQueryBody = document.getElementById("advarea").innerHTML;
    // document.getElementById("advarea").innerHTML = "";
    // document.getElementById("queryedit").innerHTML = saveConjunctsBody;
    document.getElementById("queryedit").style.visibility = "visible";
    document.getElementById("queryedit").style.display = "block";
    document.getElementById("advarea").style.display = "none";
    document.getElementById("advarea").style.visibility = "hidden";
  }
}
/**
 * Callback function to the login function once the login is successful
 * @callback
 */
function loginOK(response) {
  var results = JSON.parse(response);
  if (results.length > 0) {
    if (results[0].valueOf() == "".valueOf()) {
      var addendum = "";
      Gusername = document.getElementById("email").value;
      clientID = "Client__" + Gusername;

      if (results[1].valueOf() == "admin".valueOf()) {
        addendum = "<br>You are an Aim&Drive administrator";
      }
      Gtoken = results[2];
      Gemployer = results[3];
      Gpnid = results[4];
      localStorage.setItem("Gtoken", Gtoken);
      localStorage.setItem("Gusername", Gusername);
      localStorage.setItem("Gemployer", Gemployer);
      localStorage.setItem("Gpnid", Gpnid);

      document.getElementById("loginstatus").innerHTML =
        "User " +
        document.getElementById("email").value +
        " Logged in..." +
        addendum;
      document.getElementById("postlogin-body").style.display = "block";
      GpreloginBody = document.getElementById("prelogin-body").innerHTML;
      document.getElementById("prelogin-body").innerHTML = "";
      if (results[1].valueOf() == "admin".valueOf()) {
        Gadmin = 1;
      } else {
        Gadmin = 0;
      }
      localStorage.setItem("Gadmin", Gadmin);
      startup();
    } else {
      document.getElementById("loginstatus").innerHTML =
        '<font color="red">' + results[1] + "</font>";
    }
  } else
    document.getElementById("loginstatus").innerHTML =
      '<font color="red">' + results + "</font>";
}

function loginFailed(response) {
  myAlert("ERROR", response, "error");
  document.getElementById("loginstatus").innerHTML =
    "Login aborted -- server error!";
}
//get-project-data-start
/**
 * Called when user clicks on the project from projects tab
 * @param {string} id - project id for the project clicked
 */
function selectStrategy(id) {
  resetStrategyData();
  Gcurrentstrategy = id;
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      id +
      "&company=" +
      getCompanyForProject(id) +
      "&bu=" +
      getBUForProject(id),
    type: "POST",
    success: strategyready,
    error: strategyabort
    //,datatype: "json"
  });
}

function reloadAStepData() {
  showTimedMessage(
    "gmsg",
    "Agree step data updated  ..." + GeditingGoal,
    0,
    false
  );
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: refreshNewAStep,
    error: goalOpFailed
    //,datatype: "json"
  });
}

function updateAStep(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "") {
    reloadAStepData();
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", "ERROR " + result[1] + GeditingGoal, 0, true);
  }
}

function driverUpdated(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "mstat",
      "Saved driver.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewMStep,
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("mstat", result[1], 0, true);
  }
}

function kcdriverUpdated(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "destat",
      "Saved driver.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewDStep,
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("destat", result[1], 0, true);
  }
}

function ssUpdated(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "restatus",
      "Strategy statements updated.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewRStep,
      error: ssOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("restatus", result[1], 0, true);
  }
}

function apUpdated(resp) {
  var result = JSON.parse(resp);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "imstatus",
      "Saved action plan.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewImStep,
      error: imOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("imstatus", result[1], 0, true);
  }
}

function veUpdated(resp) {
  var result = JSON.parse(resp);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "vestatus",
      "Saved action plan updates.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewVStep,
      error: veOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("vestatus", result[1], 0, true);
  }
}

function iStepSaved(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "treesel",
      "Saved worksheet.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewIStep,
      error: istepOpFailed
      //,datatype: "json"
    });
    coastClear = 1;
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("treesel", res[1], 0, true);
  }
}

function masterWorksheet(id) {
  showTimedMessage("reportstat", "Accessing data from server...", 0, false);
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      id +
      "&company=" +
      getCompanyForProject(id) +
      "&bu=" +
      getBUForProject(id),
    type: "POST",
    success: generateReport,
    error: strategyabort
    //,datatype: "json"
  });
}

function updateBackground(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: strategyBackReady,
      error: backOpFailed
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateSideFilePanel(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: updateFileSectionOnly,
      error: backOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateProjectTasksInternal() {
  showTimedMessage(
    "gmsg",
    "Database updated.  Refreshing display...",
    0,
    false
  );
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: strategyTasksReady,
    error: backOpFailed
    //,datatype: "json"
  });
}

function updateProjectWPInternal() {
  showTimedMessage(
    "gmsg",
    "Database updated.  Refreshing display...",
    0,
    false
  );
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: strategyWPReady,
    error: backOpFailed
    //,datatype: "json"
  });
}

function refreshEDStrategiesDelayed() {
  $.ajax({
    url:
      "get-project-data.php?project=" +
      encodeURIComponent(GprojectForSupplier) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(GprojectForSupplier)) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: refreshEDStrategies,
    error: projectEDOpFailed
    //,datatype: "json"
  });
}

function updateActionsTab(response) {
  selectedActionPerformers = [];
  currentActionId = -1;
  var results = JSON.parse(response);

  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Updating display", 0, false);
    $.ajax({
      url:
        "get-project-data.php?project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        encodeURIComponent(getCompanyForProject(Gcurrentstrategy)) +
        "&bu=" +
        encodeURIComponent(getBUForProject(Gcurrentstrategy)) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: internalUpdateActionsTab,
      error: actionOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function updateEDProgress(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Getting project data...", 0, false);
    $.ajax({
      url:
        "get-project-data.php?project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        encodeURIComponent(getCompanyForProject(Gcurrentstrategy)) +
        "&bu=" +
        encodeURIComponent(getBUForProject(Gcurrentstrategy)) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshProgressNotesInternal,
      error: progOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function updateEDSS() {
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: updateEDSSInternal,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function updateEDSSWithResult(response) {
  var results = JSON.parse(response);

  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Updating display", 0, false);
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: updateEDSSInternal,
      error: ssEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function iEDStepSaved(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Saved cost element.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshEDIStep,
      error: identifyEDOpFailed
      //,datatype: "json"
    });
    coastClear = 1;
  } else {
    if (invalidTokenP(res[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function driverEDRefresh(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Saved driver.  Now updating display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshEDMStep,
      error: driverEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
  }
}

function saveEDAgree(response) {
  GdefaultCurrency = currency;
  var result = JSON.parse(response);
  if (result[0].valueOf() == "") {
    showTimedMessage("gmsg", "Agree step data updated...", 0, false);
    $.ajax({
      url:
        "get-project-data.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: refreshNewAStep,
      error: errorEDFun
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", "ERROR " + result[1], 0, true);
  }
}

function updateVerifyContents(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Getting project data...", 0, false);
    $.ajax({
      url:
        "get-project-data.php?project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        encodeURIComponent(getCompanyForProject(Gcurrentstrategy)) +
        "&bu=" +
        encodeURIComponent(getBUForProject(Gcurrentstrategy)) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshVerifyContents,
      error: progOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function retrieveNextStrategyData() {
  if (lastManDataRetrieved >= manProjects.length) {
    showTimedMessage("", "All project data retrieved!", 1000, false);
    return;
  }
  showTimedMessage(
    "",
    "Retrieving project # " +
      (lastManDataRetrieved + 1) +
      " of " +
      manProjects.length,
    0,
    false
  );
  var proj = manProjects[lastManDataRetrieved];
  var projid = proj[0];
  $.ajax({
    url:
      "get-project-data.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      projid +
      "&company=" +
      getCompanyForProject(projid) +
      "&bu=" +
      getBUForProject(projid),
    type: "POST",
    success: getNextStrategyAsNeeded,
    error: strategyabort
    //,datatype: "json"
  });
}

function refreshNewAStep(response) {
  if (!reParseStrategyData(response, "gmsg")) return;
  refreshAStep();
  // refreshIStep();
  showTimedMessage("gmsg", "Agree step update completed", 6000, false);
}

function refreshNewMStep(response) {
  if (!reParseStrategyData(response, "mstat")) return;
  refreshMStep();
  // refreshDStep();  // since data shown there might also have changed!
  showTimedMessage("mstat", "Display updated...", 5000, false);
}

function refreshNewDStep(response) {
  if (!reParseStrategyData(response, "destat")) return;
  refreshDStep();
  showTimedMessage("destat", "Display updated...", 5000, false);
}

function refreshNewRStep(response) {
  if (!reParseStrategyData(response, "restatus")) return;
  refreshRStep();
  if (GsavedSSDesc.valueOf() == "".valueOf())
    showTimedMessage("restatus", "Project updates completed", 4000, false);
  else
    showTimedMessage(
      "restatus",
      "Strategic option added to strategy statement.  Remember to edit and save it immediately.",
      0,
      true
    );
  GsavedSSDesc = "";
}

function refreshNewImStep(response) {
  if (!reParseStrategyData(response, "imstatus")) return;
  refreshImStep();
  showTimedMessage("imstatus", "Display updated...", 5000, false);
}

function refreshNewVStep(response) {
  if (!reParseStrategyData(response, "vestatus")) return;
  refreshVStep();
  showTimedMessage("vestatus", "Action plan display updated...", 5000, false);
}

function refreshNewIStep(response) {
  if (!reParseStrategyData(response, null)) return;
  refreshIStep();
}

function generateReport(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("reportstat", result[1], 0, true);
    return;
  }
  var reportData = result[1];
  showTimedMessage("reportstat", "Generating report", 0, false);
  genMaster(reportData);
}

function strategyBackReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gcurrentdata = result[1];
  // document.getElementById("projscope").innerHTML = Gcurrentdata[Gscopeindex];
  refreshBackground();
  refreshFileSidePanel();
  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}

function updateFileSectionOnly(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gcurrentdata = result[1];
  // document.getElementById("projscope").innerHTML = Gcurrentdata[Gscopeindex];
  refreshFileSidePanel();
  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}

function strategyTasksReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gcurrentdata = result[1];
  // document.getElementById("projscope").innerHTML = Gcurrentdata[Gscopeindex];
  if (updateTaskPanel.valueOf() == "main".valueOf()) refreshTasks();
  else refreshTaskSidePanel();
  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}

function strategyWPReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gcurrentdata = result[1];
  // document.getElementById("projscope").innerHTML = Gcurrentdata[Gscopeindex];
  refreshWorkplan();
  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}

function refreshEDStrategies(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  setEDMyProjectsBody();
  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}

function internalUpdateActionsTab(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    Gcurrentdata = results[1];
    showTimedMessage("gmsg", "Display updated.", 5, false);
    refreshSS_ED_Actions();
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function refreshProgressNotesInternal(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Display being updated...", 5000, false);
    Gcurrentdata = results[1];
    updateVerifyActions();
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function updateEDSSInternal(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    Gcurrentdata = results[1];
    if (SSUpdateFrom == 1) {
      // from reduce
      refreshRStep();
      // GcurrentSS = editingSS;
      populateSSRisksBenefits();
    } else if (SSUpdateFrom == 2) {
      // from implement
      refreshImStep();
    } // from verify
    else {
      refreshVStep();
    }
    showTimedMessage("gmsg", "Display updated...", 5000, false);
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }

  // for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
  //   var oentr = Gcurrentdata[Grbindex][i];
  //   var ss = oentr[0];
  // var oentry = findSSEntry(ss);
  //
  //
  // if (oentry[9].valueOf() == "SELECTED".valueOf()) {
  //   document.getElementById("startegyselectbutton"+ss).innerHTML =
  //     "Unselect strategy statement for Implementation.";
  // } else {
  //   document.getElementById("startegyselectbutton"+ss).innerHTML =
  //     "Select strategy statement for Implementation.";
  // }
  // }
}

function refreshEDIStep(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  showTimedMessage("gmsg", "Successful worksheet update", 4000, false);
  Gcurrentdata = result[1];
  Gcostdrivers = [];
  if (Gcurrentdata != null && Gcurrentdata[Gcdindex] != null)
    Gcostdrivers = arrayClone(Gcurrentdata[Gcdindex]);
  identifyStepContents();
}

function refreshEDMStep(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    reParseStrategyData(response, "gmsg");
    refreshMStep();
    showTimedMessage("gmsg", "Display updated...", 2000, false);
  } else {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }

    showTimedMessage("gmsg", result[1], 0, true);
  }
}

function refreshVerifyContents(response) {
  if (!reParseStrategyData(response, "gmsg")) return;
  refreshVStep();
  showTimedMessage("gmsg", "Update completed", 6000, false);
}

function getNextStrategyAsNeeded(obj) {
  var result = JSON.parse(obj);
  //
  if (result.length > 0) {
    if (result[0].valueOf() == "".valueOf()) {
      allManProjectsData.push(result[1]);
      allManProjectsDataTemp.push(result[1]);
      if (lastManDataRetrieved < manProjects.length - 1) {
        lastManDataRetrieved++;
        setTimeout(retrieveNextStrategyData(), 200);
      } else {
        showTimedMessage("", "All data retrieved!", 1000, false);
        setManagementReports();
      }
    } else {
      if (invalidTokenP(result[1])) {
        // //edLogout2();
        return;
      }
      showTimedMessage("", "Error " + result[1], 0, true);
    }
  } else showTimedMessage("", "Error in retrieval: " + result, 0, true);
}

function strategyready(response) {
  var result = JSON.parse(response);
  if (result != null) {
    if (result[0].valueOf() != "".valueOf()) {
      if (invalidTokenP(result[1])) {
        //edLogout2();
        return;
      } else {
        myAlert("FAILURE!", result[1], "error");
        return;
      }
    }
  }
  resetSSClicks();
  resetSOClicks();
  resetPRClicks();
  resetSummClicks();
  reParseStrategyData(response, null);
  // refreshHeaders();

  clearAllStrategyDisplay();
  GdefaultCurrency = Gcurrentdata[2][1];
  if (Gcurrentdata[Gprimeindex] != null) {
    bigCost[0] = Gcurrentdata[Gprimeindex][1];
    bigCost[1] = Gcurrentdata[Gprimeindex][5];
    bigCost[2] = Gcurrentdata[Gprimeindex][6];
    bigCost[3] = Gcurrentdata[Gprimeindex][7];
  } else {
    bigCost[0] = 0;
    bigCost[1] = 0;
    bigCost[2] = 0;
    bigCost[3] = 0;
  }

  switchMainContents("Background");
}

//get-project-data-end
/**
 * Callback function from the login function after successful login
 * @callback
 */
function startup() {
  document.getElementById("startupstatus").innerHTML =
    "Loading relevant projects ...";
  $.ajax({
    url:
      "get-projects-for-user.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: startupok,
    error: startupfailed
    //,datatype: "json"
  });
}

function cleanWebString(incoming) {
  return incoming
    .replace("/", "W")
    .replace("=", "Z")
    .replace(">", "Y")
    .replace("<", "X")
    .replace("+", "U")
    .replace("*", "V");
}

function cleanVarString(incoming) {
  return JSON.stringify(incoming);
}
var depProjs = [],
  clientProjs = [],
  supProjs = [],
  regProjs = [],
  reportStrategies = [];
/**
 * callback function from statup function.
 * @callback
 */
function startupok(response) {
  var result = JSON.parse(response);
  if (result[0] == "ERROR") {
    localStorage.clear();
    location.reload();
  }

  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }

    myAlert("FAILURE!", result[1], "error");
    return;
  }
  Gstrategies = result[1];

  reportStrategies = result[1];
  regProjs = result[2];
  depProjs = result[3];
  clientProjs = result[4];
  supProjs = result[5];

  if (Gadmin > 0) {
    $.ajax({
      url:
        "get-companies.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: companiesReady,
      error: startupfailed
      //,datatype: "json"
    });
  } // not an administrator...
  else {
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: usersReady,
      error: startupfailed
      //,datatype: "json"
    });
  }
}

function adjustDoc(doc) {
  var ind = doc.valueOf().indexOf(")");
  return (
    "<em><b>" +
    doc.valueOf().substring(0, ind + 1) +
    "</b></em> " +
    doc.valueOf().substring(ind + 1)
  );
}

function saveChangedGoals(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", "Problems in saving costs: " + oldindex, 0, true);
    return;
  }
  removeChangedObject("aprime");
  removeChangedObject("aestim");
  removeChangedObject("acquis-cost");
  removeChangedObject("usage-cost");
  removeChangedObject("alever");
  removeChangedObject("eol-cost");
  removeChangedObject("arationale");
  if (changedObjects.length == 0) {
    // no more work to do
    reloadAStepData();
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    var rowstring = items[1];
    var row = parseInt(rowstring);
    if (i < changedObjects.length - 1) saveGoal(row, 0);
    else saveGoal(row, 1);
  }
  changedObjects = [];
}

function primaryCostSaved(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Saving primary cost...", 0, true);
    refreshIStep();
    showTimedMessage("gmsg", "Saving primary cost...", 3000, false);
  } else {
    showTimedMessage("gmsg", result[1], 0, true);
  }
}

function errorFun(resp) {
  myAlert("ERROR!", resp, "error");
}

function reParseStrategyData(response, mid) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return false;
    }

    if (mid != null) showTimedMessage(mid, result[1], 0, true);
    else myAlert("ERROR!", result[1], "error");
    return false;
  }
  Gcurrentdata = result[1];
  Gcostdrivers = [];
  if (Gcurrentdata != null && Gcurrentdata[Gcdindex] != null)
    Gcostdrivers = arrayClone(Gcurrentdata[Gcdindex]);
  return true;
}
/**
 * Gets the company information for a project.
 * @param {string} pid - project id.
 * @returns {number} Company Id
 */
function getCompanyForProject(pid) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == pid) {
      return Gstrategies[i][1][0];
    }
  }
  return -1;
}

function getSupplierForProject(pid) {}
/**
 * Gets the department or business unit information for a given project
 * @param {string} pid - project id.
 */
function getBUForProject(pid) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == pid) {
      return Gstrategies[i][3][0];
    }
  }
  return -1;
}

function resetStrategyData() {
  Gscope = "";
  Gestimates = [];
  Gpastinits = [];
  Gmeetings = [];
  Gtasks = [];
  Gmiles = [];
}

function refreshComments(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    Gcurrentdata[Gcommentsindex] = result[1];
    refreshCommTab(Gcurrentstep);
  } else {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }

    myAlert("ERROR!", result[1], "error");
  }
}

function refreshDocs(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    Gcurrentdata[Gdocsindex] = result[1];
    refreshDocTab(Gcurrentstep);
    showTimedMessage(
      "dload-feedback-" + Gcurrentstep,
      "document successfully uploaded",
      6000,
      false
    );
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage(
      "dload-feedback-" + Gcurrentstep,
      "Document not properly uploaded",
      0,
      true
    );
  }
}

function getComments(strategy) {
  $.ajax({
    url:
      "get-comments.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: refreshComments,
    error: veOpFailed
    //,datatype: "json"
  });
}

function getDocuments(strategy) {
  $.ajax({
    url:
      "get-docs.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: refreshDocs,
    error: veOpFailed
    //,datatype: "json"
  });
}

function updateComments(response) {
  var elements = JSON.parse(response);
  if (elements[0].valueOf() == "".valueOf()) {
    getComments(Gcurrentstrategy);
  } else {
    if (invalidTokenP(elements[1])) {
      //edLogout2();
      return;
    }
    myAlert("ERROR", elements[1], "error");
  }
}

function submitComment(prefix) {
  var tb = document.getElementById("comm-" + prefix);
  if (tb == null) {
    myAlert("ERROR", "Cannot find textbox", "error");
    return;
  }
  var comment = tb.value;
  if (comment.valueOf() == "".valueOf()) {
    myAlert("ERROR", "Please provide a comment to add!", "error");
    return;
  }
  Gcurrentstep = prefix;
  // document.getElementById("vestatus").innerHTML = "Adding comment to action...";
  $.ajax({
    url:
      "add-comment.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&step=" +
      prefix +
      "&who=" +
      encodeURIComponent(Gusername) +
      "&comment=" +
      encodeURIComponent(document.getElementById("comm-" + prefix).value),
    type: "POST",
    success: updateComments,
    error: veOpFailed
    //,datatype: "json"
  });
}

function strategyabort(response) {
  showTimedMessage("", "ERROR " + response, 0, true);
}

function docTypeSwitch(prefix) {
  if (document.getElementById("dext-" + prefix).checked) {
    var id = "docloc-" + prefix;
    document.getElementById("locspec-" + prefix).innerHTML =
      '<input type=file size=40 name="file" value="Upload" id="' + id + '">';
    $("#" + id).change(function() {
      var str = document.getElementById("docloc-" + prefix).value;

      var m = str.lastIndexOf("\\"); // look for / or \
      var m2 = str.lastIndexOf("/");
      var max; // find the larger of the two indices
      if (m > m2) max = m;
      else max = m2;

      var n = str.lastIndexOf(".");

      var nn, tt;

      if (n >= 0 && n < str.length - 1) {
        tt = str.substring(n + 1);
        nn = str.substring(max + 1, n);
      } else {
        tt = "";
        nn = str.substring(max + 1);
      }
      var filename = (nn + "." + tt).replace(" ", "_");
      document.getElementById("file-" + prefix).value = filename;
    });
  } else {
    document.getElementById("locspec-" + prefix).innerHTML =
      'Specify URL: <input type=text name=docurl size=50 id="docurl-' +
      prefix +
      '">';
  }
}

function getCurrentDocuments(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("dload-feedback-" + Gcurrentstep, results[1], 0, true);
    return;
  }
  getDocuments(Gcurrentstrategy);
}
/**
 * Used to save the uploaded files in database
 * @param {string} id - project id.
 * @param {string} prefix - current step the file uploaded to
 */
function saveDoc(prefix, id) {
  var desc = "ddesc-" + id;
  var title = "dtitle-" + id;

  Gcurrentstep = prefix;
  showTimedMessage("dload-feedback-" + prefix, "Saving the document", 0, false);
  $.ajax({
    url:
      "save-document.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&who=" +
      Gusername +
      "&title=" +
      encodeURIComponent(document.getElementById(title).value) +
      "&document=" +
      id +
      "&project=" +
      Gcurrentstrategy +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&desc=" +
      encodeURIComponent(document.getElementById(desc).value),
    type: "POST",
    success: getCurrentDocuments,
    error: docFailed
    //,datatype: "json"
  });
}
/**
 * Used to refresh the file panel in the A step.
 * @callback
 * @param {string} prefix - current step the file uploaded to
 */
function refreshDocTab(prefix) {
  var tabstring = '<div id="dload-feedback-' + prefix + '"></div>';
  tabstring =
    tabstring +
    '<TABLE class="fancyTable" cellpadding=1 cellspacing=1 border=1 width=100%>';
  tabstring =
    tabstring +
    "<thead><TH>Document type</TH><TH>&nbsp;</TH><TH>Document title</TH><TH>Description</TH><TH>Document location</TH><TH>Author</TH><TH>Created</TH><TH>Modified</TH></thead>";
  // tabstring = tabstring + '<TR><TD><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new bookmark" onClick="addDocOrBookmark(prefix + ')"></TD>';
  tabstring = tabstring + "<tbody>";
  if (Gcurrentdata[Gdocsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Gdocsindex].length; i++) {
      if (Gcurrentdata[Gdocsindex][i][0].valueOf() == prefix.valueOf()) {
        if (Gcurrentdata[Gdocsindex][i][1] != null) {
          var rows = 0;
          for (var j = 0; j < Gcurrentdata[Gdocsindex][i][1].length; j++) {
            var commentry = Gcurrentdata[Gdocsindex][i][1][j];
            var rowclass = "";
            if (rows % 2 == 1) rowclass = " class=alt";
            rows++;
            var docid = Gcurrentdata[Gdocsindex][i][1][j][0];
            var doctype = "Bookmark";
            if (
              (Gcurrentdata[Gdocsindex][i][1][j][7] + "").valueOf() !=
              "".valueOf()
            )
              doctype = "Document";
            tabstring =
              tabstring +
              "<TR " +
              rowclass +
              "><TD width=8% align=center>" +
              doctype +
              "</TD>" +
              '<TD width=26 align=center><div style="opacity: 0.4;"><input title="Save new title/description" type=image src="images/save-16.png" onClick="saveDoc(' +
              prefix +
              ", " +
              docid +
              ')"><div></TD>' +
              '<TD width=14%> <input type=text size=30 id="dtitle-' +
              docid +
              '" value="' +
              Gcurrentdata[Gdocsindex][i][1][j][4] +
              '"></TD>' +
              '<TD><textarea rows=2 cols=60 id="ddesc-' +
              docid +
              '">' +
              Gcurrentdata[Gdocsindex][i][1][j][5] +
              "</textarea></TD>";
            if (doctype.valueOf() == "Bookmark".valueOf())
              tabstring =
                tabstring +
                '<TD style="background: lightgray;"><A target="_blank"  HREF="' +
                Gcurrentdata[Gdocsindex][i][1][j][6] +
                '">' +
                Gcurrentdata[Gdocsindex][i][1][j][6] +
                "</TD>";
            else {
              tabstring =
                tabstring +
                '<TD style="background: lightgray;">' +
                '<A target="_blank" href="view-doc.php?' +
                "document=" +
                docid +
                "&company=" +
                getCompanyForProject(Gcurrentstrategy) +
                "&bu=" +
                getBUForProject(Gcurrentstrategy) +
                "&project=" +
                Gcurrentstrategy +
                "&username=" +
                Gusername +
                "&token=" +
                Gtoken +
                '"><input type=submit value="View Doc"></A></TD>';
            }
            tabstring =
              tabstring +
              "<TD>" +
              getPersonName(Gcurrentdata[Gdocsindex][i][1][j][1]) +
              "</TD>" +
              "<TD>" +
              Gcurrentdata[Gdocsindex][i][1][j][2] +
              "</TD><TD> " +
              Gcurrentdata[Gdocsindex][i][1][j][3] +
              "</TD>" +
              "</TR>";
          }
        }
      }
    }
  }
  tabstring = tabstring + "</tbody></TABLE>";
  tabstring =
    tabstring +
    '<form id="file_upload_form-' +
    prefix +
    '" method="post" enctype="multipart/form-data" action="upload-document.php">';
  tabstring = tabstring + "<TABLE>";
  tabstring = tabstring + "<TR>";
  tabstring = tabstring + "<TD width=8%>&nbsp;&nbsp;</TD>";
  tabstring = tabstring + "<TD width=26 align=center>&nbsp</TD>";
  tabstring =
    tabstring +
    '<TD align=center width=14%><b>Enter Title:</b><br><input type=text size=30 name="title" id="dtitle-' +
    prefix +
    '"></TD><TD align=center><b>Enter Description:</b><br><textarea name="desc" rows=4 cols=60 id="ddesc-' +
    prefix +
    '"></textarea></TD>';
  tabstring =
    tabstring +
    '<TD><input type=radio name="dtype-' +
    prefix +
    '" id="dbook-' +
    prefix +
    '" onClick="docTypeSwitch(' +
    prefix +
    ')"> Bookmark<br>';
  tabstring =
    tabstring +
    '<input type=radio name="dtype-' +
    prefix +
    '" id="dext-' +
    prefix +
    '"  onClick="docTypeSwitch(' +
    prefix +
    ')"> Document<br><div id="locspec-' +
    prefix +
    '"></div></TD><TD width=50 align=center><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new document" )"></div></TD></tfoot>';

  tabstring =
    tabstring +
    '<input name="company" id="comp-' +
    prefix +
    '" type="hidden" value="' +
    getCompanyForProject(Gcurrentstrategy) +
    '">';
  tabstring =
    tabstring +
    '<input name="bu" id="bu-' +
    prefix +
    '" type="hidden" value="' +
    getBUForProject(Gcurrentstrategy) +
    '">';
  tabstring =
    tabstring +
    '<input name="project" id="strat-' +
    prefix +
    '" type="hidden" value="' +
    Gcurrentstrategy +
    '">';
  tabstring =
    tabstring +
    '<input name="username" id="uname-' +
    prefix +
    '" type="hidden" value="' +
    Gusername +
    '">';
  tabstring =
    tabstring +
    '<input name="password" id="upass-' +
    prefix +
    '" type="hidden" value="' +
    Gtoken +
    '">';
  tabstring =
    tabstring +
    '<input id="file-' +
    prefix +
    '" name="filename" type="hidden">';
  tabstring =
    tabstring + '<input name="step" type="hidden" value="' + prefix + '">';
  tabstring =
    tabstring +
    '<iframe id="upload_target-' +
    prefix +
    '" name="upload_target-' +
    prefix +
    '" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>';
  tabstring = tabstring + "</form>";
  // </form>';

  document.getElementById("doctab-" + prefix).innerHTML = tabstring;
  document.getElementById("file_upload_form-" + prefix).onsubmit = function() {
    Gcurrentstep = prefix;
    document.getElementById("file_upload_form-" + prefix).target =
      "upload_target-" + prefix; //'upload_target' is the name of the iframe
    document.getElementById("upload_target-" + prefix).onload = uploadDone;
  };
}

function uploadDone() {
  //Function will be called when iframe is loaded

  var ret = frames[
    "upload_target-" + Gcurrentstep
  ].document.getElementsByTagName("body")[0].innerHTML;
  var ind1 = ret.indexOf("[");
  var ind2 = ret.indexOf("]");
  var exp = ret.substring(ind1, ind2 + 1);
  var data = JSON.parse(exp);

  if (data[0].valueOf() == "".valueOf()) {
    //This part happens when the image gets uploaded.
    getDocuments(Gcurrentstrategy);
    showTimedMessage(
      "dload-feedback-" + Gcurrentstep,
      "Updating document list",
      0,
      false
    );
  } else myAlert("ERROR", "Upload Failed: " + data.failure, "error");
}

function refreshCommTab(prefix) {
  var tabstring =
    '<TABLE class="fancyTable" cellpadding=1 cellspacing=1 border=1 width=100%>';
  tabstring =
    tabstring +
    "<thead><TH>Comment</TH><TH>Author</TH><TH>Time and date</TH></thead>";
  tabstring =
    tabstring +
    '<tfoot><TD><textarea rows=4 cols=60 id="comm-' +
    prefix +
    '"></textarea></TD>';
  tabstring =
    tabstring +
    '<TD><input type=submit class="btn-sm btn-cta-primary" value="Add Comment" onClick="submitComment(' +
    prefix +
    ')"></TD><TD>&nbsp;</TD></tfoot>';
  tabstring = tabstring + "<tbody>";
  if (Gcurrentdata[Gcommentsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Gcommentsindex].length; i++) {
      if (Gcurrentdata[Gcommentsindex][i][0].valueOf() == prefix.valueOf()) {
        if (Gcurrentdata[Gcommentsindex][i][1] != null) {
          var rows = 0;
          for (var j = 0; j < Gcurrentdata[Gcommentsindex][i][1].length; j++) {
            var commentry = Gcurrentdata[Gcommentsindex][i][1][j];
            var rowclass = "";
            if (rows % 2 == 1) rowclass = " class=alt";
            rows++;
            tabstring =
              tabstring +
              "<TR " +
              rowclass +
              "><TD width=70%>" +
              Gcurrentdata[Gcommentsindex][i][1][j][0] +
              "</TD>" +
              "<TD>" +
              getPersonName(Gcurrentdata[Gcommentsindex][i][1][j][1]) +
              "</TD>" +
              "<TD>" +
              Gcurrentdata[Gcommentsindex][i][1][j][2] +
              "</TD>" +
              "</TR>";
          }
        }
      }
    }
  }
  tabstring = tabstring + "</tbody></TABLE>";
  document.getElementById("commtab-" + prefix).innerHTML = tabstring;
}

function strategyBody(prefix) {
  if (prefix.valueOf() == "Agree".valueOf()) return;
}

function saveWorksheet(prefix) {
  if (prefix.valueOf() == "Agree".valueOf()) {
    savePrimaryCost();
    return;
  } else if (prefix.valueOf() == "Identify".valueOf()) {
    saveIWorksheet();
    return;
  } else if (prefix.valueOf() == "Measure".valueOf()) {
    saveMWorksheet();
    return;
  } else if (prefix.valueOf() == "Define".valueOf()) {
    saveDWorksheet();
    return;
  } else if (prefix.valueOf() == "Reduce".valueOf()) {
    saveRWorksheet();
    return;
  } else if (prefix.valueOf() == "Implement".valueOf()) {
    saveImWorksheet();
    return;
  } else if (prefix.valueOf() == "Verify".valueOf()) {
    myAlert(
      "Attention!",
      "Please use the individual save buttons on the worksheet",
      "error"
    );
    return;
  }
  myAlert(
    "Attention!",
    "Save for this worksheet is yet to be implemented",
    "error"
  );
}
/**
 * Called to set inner header once inside the project
 * @param {string} prefix - current step the project is in when clicked
 */
function strategyHeader(prefix) {
  var sumpanel = prefix + "-summpanel";
  var commpanel = prefix + "-commpanel";
  var docpanel = prefix + "-docpanel";

  var linkstring = "";
  linkstring =
    linkstring +
    '<button  title="Click to expose/hide project summary" type"button" class="' +
    btnClass +
    '" data-toggle="collapse" data-target="#' +
    sumpanel +
    '">' +
    " Summary </button>&nbsp;&nbsp;&nbsp;";
  linkstring =
    linkstring +
    '<button title="Click to expose/hide project comments" type"button" class="' +
    btnClass +
    '" data-toggle="collapse" data-target="#' +
    commpanel +
    '">' +
    " Comments </button>&nbsp;&nbsp;&nbsp;";
  linkstring =
    linkstring +
    '<button title="Click to expose/hide project references/documents" type"button" class="' +
    btnClass +
    '" data-toggle="collapse" data-target="#' +
    docpanel +
    '">' +
    " References </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  // only administrators (i.e., Anklesaria people) can save anything when it comes to A&D worksheets
  if (Gadmin > 0)
    linkstring =
      linkstring +
      '<button title="Save changes to ' +
      prefix +
      ' worksheet" type"button" class="' +
      btnClass +
      '" onClick="saveWorksheet(' +
      prefix +
      ')"> Save Worksheet</button>';

  setEDProjectHeader(
    getTitle(prefix) + "</font></H5>",
    linkstring,
    "<H5><font color=darkblue>" + Gcurrentdata[0] + "&nbsp;&nbsp;</font></H5>"
  );

  setEDProcessNav(prefix);

  var tabstring =
    '<div class="collapse" id="' + docpanel + '" style="background: #d6e0ef;">';

  tabstring =
    tabstring + '  <div style="margin: 10px;" id="doctab-' + prefix + '">';
  tabstring = tabstring + " Bookmarks Content to be decided for " + prefix;
  tabstring = tabstring + "  </div>";
  tabstring = tabstring + "</div>";

  tabstring =
    tabstring +
    '<div class="collapse" id="' +
    commpanel +
    '" style="background: azure;">';
  tabstring = tabstring + '<div id="commtab-' + prefix + '">';
  tabstring =
    tabstring + " Bookmarks Content to be decided for " + prefix + "</div>";
  tabstring = tabstring + "</div>";

  tabstring =
    tabstring +
    '<div class="collapse" id="' +
    sumpanel +
    '" style="background: azure;">';
  tabstring =
    tabstring +
    "<table class=fancyTable cellpadding=1 cellspacing=1 border=1 width=100%>";
  tabstring =
    tabstring +
    "<TR><TD>Project description: </TD><TD>" +
    Gcurrentdata[1] +
    "</TD>";
  tabstring = tabstring + "<TD rowspan=5>Participants: </TD><TD rowspan=5>";
  tabstring =
    tabstring +
    "<TABLE width=100%><TR><TH>Name</TH><TH>Company</TH><TH>Role on team</TH></TR>";
  if (Gcurrentdata[7] != null) {
    for (var n = 0; n < Gcurrentdata[7].length; n++) {
      var rowclass = "";
      if (n % 2 == 1) rowclass = " class=alt";
      tabstring = tabstring + "<TR " + rowclass + ">";
      tabstring =
        tabstring +
        "<TD>" +
        Gcurrentdata[7][n][1] +
        " " +
        Gcurrentdata[7][n][2] +
        "</TD>";
      tabstring = tabstring + "<TD>" + Gcurrentdata[7][n][3] + "</TD>";
      tabstring = tabstring + "<TD>" + Gcurrentdata[7][n][0] + "</TD></TR>";
    }
  }
  tabstring = tabstring + "</TABLE>";
  tabstring = tabstring + "</TD></TR>";
  tabstring =
    tabstring +
    "<TR><TD>Company: </TD><TD>" +
    Gcurrentdata[5][0] +
    "</TD></TR>";
  tabstring =
    tabstring +
    "<TR><TD>Business Unit: </TD><TD>" +
    Gcurrentdata[5][2] +
    "</TD></TR>";
  tabstring =
    tabstring +
    "<TD>Division Name: </TD><TD>" +
    Gcurrentdata[5][1] +
    "</TD></TR>";
  tabstring =
    tabstring + "<TR><TD>Supplier: </TD><TD>" + Gcurrentdata[6] + "</TD></TR>";
  tabstring = tabstring + "</TABLE>";
  tabstring = tabstring + "</div>";

  return tabstring;
}
/**
 * Get the name of the company using company id
 * @param {string} id - company id
 */
function getCompanyName(id) {
  for (var i = 0; i < Gcompanies.length; i++) {
    // if(Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    if (Gcompanies[i][0] == id) {
      return Gcompanies[i][1];
    }
  }
}

function getCompanyNameBySupplier(supplier_id) {
  for (var i = 0; i < Gcompanies.length; i++) {
    // if (Gcompanies[i][0] == id)
    // {
    //     return Gcompanies[i][1];
    // }
  }
}

function companyExistsP(name) {
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][1].valueOf() == name.valueOf()) {
      return true;
    }
  }
  return false;
}
/**
 * Get the company id when a company name is present
 * @param {string} name - name of the company
 * @return {number} company id
 */
function getCompanyIdFromName(name) {
  if (name === "" || name === undefined) return -1;
  var company_name = "";
  for (var i = 0; i < Gcompanies.length; i++) {
    company_name = Gcompanies[i][1].trim();
    if (company_name === "") continue;
    if (company_name.valueOf() == name.valueOf()) {
      return Gcompanies[i][0];
    }
  }
  return -1;
}

function divisionExistsP(comp, buname) {
  for (var i = 0; i < Gprojects.length; i++) {
    if (Gprojects[i][0] == comp) {
      for (var j = 2; j < Gprojects[i].length; j++) {
        if (Gprojects[i][j][1].valueOf() == buname.valueOf()) return true;
      }
    }
  }
  return false;
}
/**
 * Get the business unit or department name when and company id and business unit name is supplied
 * @param {string} comp - company id
 * @param {string} buname - business unit name
 */
function getBUIdFromName(comp, buname) {
  // alert("company: " + comp + " buname: " + buname);
  // alert(Gprojects);
  for (var i = 0; i < Gprojects.length; i++) {
    if (Gprojects[i][0] == comp) {
      // alert("company match " + " # of entries: " + (Gprojects[i].length - 2));
      for (var j = 2; j < Gprojects[i].length; j++) {
        // alert("bu entry " + j +" " + Gprojects[i][j]);
        if (Gprojects[i][j][1].valueOf() == buname.valueOf())
          return Gprojects[i][j][0];
      }
    }
  }
  return -1;
}

function populateGoals(i) {
  if (i >= 0 && i < Gcurrentdata[Ggoalsindex].length) {
    document.getElementById("goal").value = Gcurrentdata[Ggoalsindex][i][0];
    document.getElementById("persp").value = Gcurrentdata[Ggoalsindex][i][1];
    document.getElementById("allperspectives").value =
      Gcurrentdata[Ggoalsindex][i][1];
    document.getElementById("stake").value = Gcurrentdata[Ggoalsindex][i][2];
  }
}
/**
 * Called to save the goal into database
 * @param {number} num - total number of goals for the project
 */
function addGoalInternal(num) {
  num++;
  var newgoal = "<< new goal " + num + " >>";
  var newpersp = "";
  if (Gcurrentdata[Ggoalsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Ggoalsindex].length; i++)
      if (Gcurrentdata[Ggoalsindex][0].valueOf() == newgoal.valueOf()) {
        showTimedMessage("gmsg", "Cannot add a duplicate goal", 0, true);
        return;
      }
  }
  stake = "";
  showTimedMessage("gmsg", "Adding goal ...", 0, false);
  $.ajax({
    url:
      "add-goal.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&goal=" +
      encodeURIComponent(newgoal) +
      "&stakeholder=" +
      stake +
      "&perspective=" +
      newpersp,
    type: "POST",
    success: updateAStep,
    error: goalOpFailed
    //,datatype: "json"
  });
}

function addGoal(num) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add new goals!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addGoalInternal(num);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {
            // do nothing...
          }
        }
      }
    });
  } else addGoalInternal(num);
}
/**
 * Called when add goal button is clicked
 */
function addEDGoal() {
  $(".goaldescription_error").hide();
  $(".goalOperation_error").hide();
  $("#separateGoals").prop("checked", false);
  $(".goaltitle").text("Add New Goal");
  document.getElementById("newPerspective").value = "";
  document.getElementById("perspectiveSelect").innerHTML = injectPerspectives(
    -1
  ); // no default in perspectives
  document.getElementById("goaldescription").value = "";
  document.getElementById("goalOperation").value = "";
  // document.getElementById("separateGoals").style.visibility = "visible";
  // document.getElementById("goalcblabel").style.visibility = "visible";
  // document.getElementById("separateGoals").checked = false;
  deactivateButton("goalButton");
  $(document).ready(function() {
    // $('button[type="button"]').attr('disabled','disabled');
    $('input[type="text"]').on("keyup", function() {
      if ($(this).val != "") {
        $('button[type="button"]').removeAttr("disabled");
      }
    });
  });
  GeditingGoal = -1;
}
$(".perspective-new").show();
/**
 * Called when edit goal button is clicked
 * @param {number} i - goal index inside goal array for the project.
 */
function editEDGoal(i) {
  // $(".perspective-new").hide();
  $("#separateGoals").prop("checked", false);
  $(".seperateGoalsContainer").hide();
  $(".goaldescription_error").hide();
  $(".goalOperation_error").hide();
  $(".opt_btn_wrp").hide();
  $("#goals_modal").modal("show");
  document.getElementById("newPerspective").value = "";
  $(".goaltitle").text("Edit Goal");
  document.getElementById("perspectiveSelect").innerHTML = injectPerspectives(
    i
  ); // no default in perspectives
  document.getElementById("goaldescription").value =
    Gcurrentdata[Ggoalsindex][i][0];
  document.getElementById("goalOperation").value =
    Gcurrentdata[Ggoalsindex][i][1];
  // document.getElementById("separateGoals").style.visibility = "hidden";
  // document.getElementById("goalcblabel").style.visibility = "hidden";
  deactivateButton("goalButton");
  GeditingGoal = i;
  $(document).ready(function() {
    // $('button[type="button"]').attr('disabled','disabled');
    $('input[type="text"]').on("keyup", function() {
      if ($(this).val != "") {
        $('button[type="button"]').removeAttr("disabled");
      }
    });
  });
}
/**
 * Called when delete goal button is clicked
 * @param {number} i - goal index inside goal array for the project.
 */
function deleteEDGoal(i) {
  $(".opt_btn_wrp").hide();
  // alert("trying to delete goal # " + i);
  showTimedMessage("gmsg", "Deleting goal " + i + " ...", 0, false);
  $.ajax({
    url:
      "delete-goal.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&goal=" +
      encodeURIComponent(Gcurrentdata[Ggoalsindex][i][0]),
    type: "POST",
    success: updateAStep,
    error: goalOpFailed
    //,datatype: "json"
  });
}

function saveEDGoalSaved() {
  if (GeditingGoal == -1) {
    showTimedMessage("gmsg", "Adding goal ...", 0, false);
    $.ajax({
      url:
        "add-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(document.getElementById("goaldescription").value) +
        "&perspective=" +
        encodeURIComponent(document.getElementById("goalOperation").value) +
        "&stakeholder=",
      type: "POST",
      success: updateAStep,
      error: goalOpFailed
      //,datatype: "json"
    });
  }

  // alert("adding goal: " + document.getElementById("goaldescription").value + "\nPerspective: " + document.getElementById("goalOperation").value)
  else {
    showTimedMessage("gmsg", "Saving goal ... " + GeditingGoal, 0, false);
    $.ajax({
      url:
        "save-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(document.getElementById("goaldescription").value) +
        "&oldgoal=" +
        encodeURIComponent(Gcurrentdata[Ggoalsindex][GeditingGoal][0]) +
        "&perspective=" +
        encodeURIComponent(document.getElementById("goalOperation").value) +
        "&stakeholder=",
      type: "POST",
      success: updateAStep,
      error: goalOpFailed
      //,datatype: "json"
    });
  }
}

function addEDGoalInternal(goal, update) {
  showTimedMessage("gmsg", "Adding next goal..." + GeditingGoal, 0, false);
  if (update == 1) {
    $.ajax({
      url:
        "add-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(goal) +
        "&perspective=" +
        encodeURIComponent(document.getElementById("goalOperation").value) +
        "&stakeholder=",
      type: "POST",
      success: updateAStep,
      error: goalOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "add-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(goal) +
        "&perspective=" +
        encodeURIComponent(document.getElementById("goalOperation").value) +
        "&stakeholder=",
      type: "POST",
      success: showTimedMessage("gmsg", "Goal added", 0, false),
      error: goalOpFailed
      //,datatype: "json"
    });
  }
}

function saveEDGoal() {
  let canAddGoal = true;
  let individualGoals = [];
  $(".goaldescription_error").hide();
  $(".goalOperation_error").hide();
  var goalText = document.getElementById("goaldescription").value;
  var perspectiveinit = document.getElementById("goalOperation").value;
  var newPerspective = document.getElementById("newPerspective").value;
  //
  let seperateGoals = $("#separateGoals").prop("checked");
  //
  // return;
  if (goalText === "" || goalText.size == 0) {
    $(".goaldescription_error")
      .text("Description is required")
      .show();
    canAddGoal = false;
  }
  if (perspectiveinit === "" && newPerspective === "") {
    $(".goalOperation_error")
      .text("Perspective is required")
      .show();
    canAddGoal = false;
  }

  if (perspectiveinit !== "" && newPerspective !== "") {
    $(".goalOperation_error")
      .text("Add either existing perspective or new perspective but not both")
      .show();
    canAddGoal = false;
  }
  perspective = perspectiveinit;
  if (perspective === "") {
    perspective = newPerspective;
  }
  if (canAddGoal) {
    if (seperateGoals) {
      individualGoals = goalText.split("\n");
    } else {
      individualGoals.push(goalText);
    }
    $("#goals_modal").modal("hide");
    if (GeditingGoal == -1) {
      $.ajax({
        url:
          "add-goal.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&project=" +
          Gcurrentstrategy +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&perspective=" +
          encodeURIComponent(perspective) +
          "&stakeholder=",
        type: "POST",
        data: { goal: individualGoals },
        success: updateAStep,
        error: goalOpFailed
        //,datatype: "json"
      });
    } // alert("adding goal: " + document.getElementById("goaldescription").value + "\nPerspective: " + document.getElementById("goalOperation").value)
    else {
      showTimedMessage("gmsg", "Saving goal ... " + GeditingGoal, 0, false);
      var oldGoal = Gcurrentdata[Ggoalsindex][GeditingGoal][0];
      $.ajax({
        url:
          "save-goal.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&project=" +
          Gcurrentstrategy +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&goal=" +
          encodeURIComponent(individualGoals) +
          "&oldgoal=" +
          encodeURIComponent(oldGoal) +
          "&perspective=" +
          encodeURIComponent(perspective) +
          "&stakeholder=",
        type: "POST",
        success: updateAStep,
        error: goalOpFailed
        //,datatype: "json"
      });
    }
  }
}

// this is brittle -- counting on error message containing username/token...

function invalidTokenP(x) {
  if (x.indexOf("username/token") >= 0) return true;
  return false;
}

function populatePersp() {
  document.getElementById("persp").value = document.getElementById(
    "allperspectives"
  ).value;
}

function perspChanged(i) {
  document.getElementById("pers-" + i).value = document.getElementById(
    "perssel-" + i
  ).value;
  fixTextRowClass(["pers", "stake", "gtext"], i);
}
/**
 * Goals HTML is prepared
 */
function refreshGoals() {
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";

  var numGoals = 0;
  if (Gcurrentdata[Ggoalsindex] != null)
    numGoals = Gcurrentdata[Ggoalsindex].length;

  var goalstring =
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div><div style="height: 600px;"><table class=fancyTable id="goalsandp" cellpadding=1 cellspacing=1 width=100%><thead>';
  goalstring = goalstring + "<TR>";
  if (Gadmin == 1) {
    goalstring =
      goalstring +
      "<TH>Action</TH><TH width=53%>Goal</TH><TH width=20%>Perspective</TH><TH width=20%>Stake holder(s)</TH>";
    goalstring = goalstring + "<TR></thead>";
    goalstring =
      goalstring +
      "<tfoot><TR>" +
      '<TD align=center width=30 colspan=4><div style="opacity: 0.4;"><input type=image src="images/plus32.png" title="Add a new goal" onClick="addGoal(' +
      numGoals +
      ')"></div><br></TD>';
    // '<TD>&nbsp;</TD>';
    //goalstring = goalstring + '<TD align=center>&nbsp;</TD>';
    //goalstring = goalstring + '<TD align=center>&nbsp;</TD>';
    goalstring = goalstring + "</TR></tfoot><tbody>";
  } else {
    goalstring = goalstring + "<TH>&nbsp;</TH>";
    goalstring =
      goalstring +
      "<TH width=53%>Goal</TH><TH width=20%>Perspective</TH><TH width=20%>Stake holder(s)</TH><TR></thead><tbody>";
  }

  if (Gcurrentdata[Ggoalsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Ggoalsindex].length; i++) {
      var persid = "pers-" + i;
      var persel = "perssel-" + i;
      var gtext = "gtext-" + i;
      var stakeid = "stake-" + i;
      var prefixes = "[pers, stake, gtext]";
      var rowclass = "";
      if (i % 2 == 1) rowclass = ' class="odd" ';
      goalstring = goalstring + "<TR " + rowclass + " >";
      if (Gadmin > 0) {
        // goalstring = goalstring + '<TD align=center><div style="opacity: 0.4;"><input title="Save the changes to the goal in this row" type=image src="images/save-16.png" onClick="saveGoal(' + i + ')"></div></TD>';
        goalstring = goalstring + "&nbsp;";
        goalstring =
          goalstring +
          '<TD align=center><div style="opacity: 0.4;"><input type=image src="images/trash20.png" title="Delete goal in this row" onClick="deleteGoal(' +
          i +
          ')"></div></TD>';
      }
      goalstring =
        goalstring +
        '<TD align=center><textarea rows=2 cols=90 oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        i +
        ')" id="' +
        gtext +
        '"' +
        disabled +
        ">" +
        Gcurrentdata[Ggoalsindex][i][0] +
        "</textarea></TD>";
      goalstring =
        goalstring +
        '<TD align=center><input list="' +
        persel +
        '" type=text title="Choose an existing perspective or type one in"  oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        i +
        ')"  size=35 id="' +
        persid +
        '" value="' +
        Gcurrentdata[Ggoalsindex][i][1] +
        '" ' +
        disabled +
        "><br>";
      goalstring = goalstring + '<datalist id="' + persel + '" > ';
      for (var k = 0; k < Gperspectives.length; k++) {
        var selected = "";
        // if (Gperspectives[k].valueOf() == Gcurrentdata[Ggoalsindex][i][1].valueOf())selected = " selected ";
        goalstring = goalstring + '<option value="' + Gperspectives[k] + '" >';
      }
      goalstring = goalstring + "</datalist></TD>";
      goalstring =
        goalstring +
        '<TD align=center><textarea oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        i +
        ')" cols=50 rows=2 id="' +
        stakeid +
        '"' +
        disabled +
        "> " +
        Gcurrentdata[Ggoalsindex][i][2] +
        "</textarea></TD>";

      goalstring = goalstring + "</TR>";
    }
  }
  if (Gadmin > 0) {
  }

  goalstring = goalstring + "</tbody></table></div>";
  return goalstring;
}

function saveGoal(i, update) {
  var oldindex = i;
  if (typeof oldindex == "string") oldindex = parseInt(oldindex);

  var oldgoal = "";
  if (oldindex >= 0 && oldindex < Gcurrentdata[Ggoalsindex].length)
    oldgoal = Gcurrentdata[Ggoalsindex][oldindex][0];
  else {
    showTimedMessage("gmsg", "No goal with index: " + oldindex, 0, true);
    return;
  }

  var newgoal = document.getElementById("gtext-" + i).value;
  var newpersp = document.getElementById("pers-" + i).value;
  var newstake = document.getElementById("stake-" + i).value;

  showTimedMessage("gmsg", "Saving goal ..." + i, 0, false);
  if (update)
    $.ajax({
      url:
        "save-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(newgoal) +
        "&oldgoal=" +
        encodeURIComponent(oldgoal) +
        "&stakeholder=" +
        encodeURIComponent(newstake) +
        "&perspective=" +
        encodeURIComponent(newpersp),
      type: "POST",
      success: updateAStep,
      error: goalOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "save-goal.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&goal=" +
        encodeURIComponent(newgoal) +
        "&oldgoal=" +
        encodeURIComponent(oldgoal) +
        "&stakeholder=" +
        encodeURIComponent(newstake) +
        "&perspective=" +
        encodeURIComponent(newpersp),
      type: "POST",
      success: showTimedMessage("gmsg", "Goal " + i + " saved", 4, false),
      error: goalOpFailed
      //,datatype: "json"
    });
}

function deleteGoalInternal(i) {
  if (Gcurrentdata[Ggoalsindex] == null) {
    showTimedMessage("gmsg", "No existing goals to delete", 0, true);
    return;
  }
  var oldindex = i;
  if (typeof oldindex == "string") oldindex = parseInt(oldindex);
  var oldgoal = "";
  if (oldindex >= 0 && oldindex < Gcurrentdata[Ggoalsindex].length)
    oldgoal = Gcurrentdata[Ggoalsindex][oldindex][0];
  else {
    showTimedMessage("gmsg", "No goal with index: " + oldindex, 0, true);
    return;
  }

  showTimedMessage("gmsg", "Deleting goal ...", 0, false);
  $.ajax({
    url:
      "delete-goal.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&goal=" +
      encodeURIComponent(oldgoal),
    type: "POST",
    success: updateAStep,
    error: goalOpFailed
    //,datatype: "json"
  });
}

function deleteGoal(i) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this goal!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteGoalInternal(i);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteGoalInternal(i);
}

var costTree;

function refreshHeaders() {
  document.getElementById("agheader").innerHTML = strategyHeader("Agree");
  document.getElementById("idheader").innerHTML = strategyHeader("Identify");
  document.getElementById("meheader").innerHTML = strategyHeader("Measure");
  document.getElementById("deheader").innerHTML = strategyHeader("Define");
  document.getElementById("reheader").innerHTML = strategyHeader("Reduce");
  document.getElementById("imheader").innerHTML = strategyHeader("Implement");
  document.getElementById("veheader").innerHTML = strategyHeader("Verify");
  refreshCommTab("Agree");
  refreshCommTab("Identify");
  refreshCommTab("Measure");
  refreshCommTab("Define");
  refreshCommTab("Reduce");
  refreshCommTab("Implement");
  refreshCommTab("Verify");
  refreshDocTab("Agree");
  refreshDocTab("Identify");
  refreshDocTab("Measure");
  refreshDocTab("Define");
  refreshDocTab("Reduce");
  refreshDocTab("Implement");
  refreshDocTab("Verify");
}

function moveDriverLeftInternal(i, j) {
  var costElement = Gcurrentdata[Gcdindex][i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var leftdriver = Gcostdrivers[i][2][j - 1][0];
  var source = Gcostdrivers[i][2][j][2];
  var destination = Gcostdrivers[i][2][j - 1][2];
  // var goahead = confirm("Element: " + Gcurrentdata[Gcdindex][i][1] + " driver source: " + source + " destination: " + destination);
  // if (!goahead) return;

  document.getElementById("mstat").innerHTML =
    "Moving the driver as requested...";
  $.ajax({
    url:
      "swap-drivers.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(destination),
    type: "POST",
    success: driverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function moveDriverLeft(i, j) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this driver now!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            moveDriverLeftInternal(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else moveDriverLeftInternal(i, j);
}

function moveDriverRightInternal(i, j) {
  var costElement = Gcurrentdata[Gcdindex][i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var rightdriver = Gcostdrivers[i][2][j + 1][0];
  var source = Gcostdrivers[i][2][j][2];
  var destination = Gcostdrivers[i][2][j + 1][2];
  //var goahead = confirm("Element: " + Gcurrentdata[Gcdindex][i][1] + " driver source: " + source + " destination: " + destination);
  //if (!goahead) return;

  document.getElementById("mstat").innerHTML =
    "Moving the driver as requested...";
  $.ajax({
    url:
      "swap-drivers.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(destination),
    type: "POST",
    success: driverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function moveDriverRight(i, j) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this driver now!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            moveDriverRightInternal(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else moveDriverRightInternal(i, j);
}

function handleDrop(event) {
  event.preventDefault();

  var data = event.dataTransfer.getData("text"); // should give us cd id (from which we can get numerator/denominator too)
  var sources = data.split("-"); // get the i, j, and possibly cd id for the source
  var destinations = event.target.id.split("-"); // get the i and j and possibly cd id for the destination
  if (sources.length != 3 || destinations.length != 3) {
    // length will be 4 if we have cd id..
    window.alert(
      "Wrong DnD: source= " +
        event.dataTransfer.getData("text") +
        " destination=" +
        event.target.id
    );
    return;
  }
  //
  var si = parseInt(sources[1]);
  var di = parseInt(destinations[1]);
  var sj = parseInt(sources[2]);
  var dj = parseInt(destinations[2]);

  if (di != si) {
    // not the same cost element
    alert("Cannot drag from cost element " + si + " to " + di);
    return;
  }
  if (dj == sj) return;

  var costElement = Gcurrentdata[Gcdindex][di][0];

  document.getElementById("mstat").innerHTML =
    "Moving the driver as requested...";
  $.ajax({
    url:
      "move-driver.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&source=" +
      sj +
      "&destination=" +
      dj,
    type: "POST",
    success: driverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function allowDrop(event) {
  event.preventDefault();
}

// remember the value dragged AND its type
// should be enough to capture the id argval-i-j
// "i" is the conjunct number; and "j" is the element number
// "value" is the value of the dragged elemnt
function valueDragged(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function driverOpFailed() {
  showTimedMessage("mstat", "Driver operation failed", 0, true);
}

function ssOpFailed() {
  showTimedMessage("restatus", "Project statement update failed", 0, true);
}

function addDriverInternal(i) {
  var costElement = Gcostdrivers[i][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("mstat").innerHTML = "Adding a new driver";
  $.ajax({
    url:
      "add-driver-to-project.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(Gcostdrivers[i][0]) +
      "&dname=" +
      encodeURIComponent("< fill in >") +
      "&pos=" +
      pos,
    type: "POST",
    success: driverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function addDriver(i) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a new driver!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addDriverInternal(i);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addDriverInternal(i);
}

function saveDriver(i, j, update) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("mstat").innerHTML = "Saving the driver";
  if (update == 1) {
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(costElement) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&numerator=" +
        encodeURIComponent(
          document.getElementById("num-" + i + "-" + j).value
        ) +
        "&denominator=" +
        encodeURIComponent(
          document.getElementById("den-" + i + "-" + j).value
        ) +
        "&dname=" +
        document.getElementById("cd-" + i + "-" + j).value,
      type: "POST",
      success: driverUpdated,
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(costElement) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&numerator=" +
        encodeURIComponent(
          document.getElementById("num-" + i + "-" + j).value
        ) +
        "&denominator=" +
        encodeURIComponent(
          document.getElementById("den-" + i + "-" + j).value
        ) +
        "&dname=" +
        document.getElementById("cd-" + i + "-" + j).value,
      type: "POST",
      success: showTimedMessage("mstat", "driver updated", 0, false),
      error: driverOpFailed
      //,datatype: "json"
    });
  }
}

function deleteSOInternal(i, j, so) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("destat").innerHTML = "Removing strategic option...";
  $.ajax({
    url:
      "delete-driver-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(driver) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&so=" +
      encodeURIComponent(so),
    type: "POST",
    success: kcdriverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function deleteSO(i, j, so) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this strategic option now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteSOInternal(i, j, so);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteSOInternal(i, j, so);
}

function upSOInternal(i, j, k) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("destat").innerHTML = "Moving strategic option up...";
  $.ajax({
    url:
      "swap-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(driver) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&source=" +
      encodeURIComponent(k) +
      "&destination=" +
      encodeURIComponent(k - 1),
    type: "POST",
    success: kcdriverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function upSO(i, j, k) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this strategic option now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            upSOInternal(i, j, k);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else upSOInternal(i, j, k);
}

function downSOInternal(i, j, k) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("destat").innerHTML =
    "Moving strategic option down...";
  $.ajax({
    url:
      "swap-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(driver) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&source=" +
      encodeURIComponent(k) +
      "&destination=" +
      encodeURIComponent(k + 1),
    type: "POST",
    success: kcdriverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function downSO(i, j, k) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this strategic option now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            downSOInternal(i, j, k);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else downSOInternal(i, j, k);
}

function saveSO(ce, driver, so, desc, selected, update) {
  document.getElementById("destat").innerHTML = "Saving strategic option...";
  if (update == 1) {
    $.ajax({
      url:
        "save-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&ce=" +
        encodeURIComponent(ce) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&so=" +
        encodeURIComponent(so) +
        "&desc=" +
        encodeURIComponent(desc) +
        "&select=" +
        selected,
      type: "POST",
      success: kcdriverUpdated,
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&ce=" +
        encodeURIComponent(ce) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&so=" +
        encodeURIComponent(so) +
        "&desc=" +
        encodeURIComponent(desc) +
        "&select=" +
        selected,
      type: "POST",
      success: showTimedMessage("destat", "Strategic option saved", 0, false),
      error: driverOpFailed
      //,datatype: "json"
    });
  }
}

function numOptions(i, j) {
  var entry = Gcurrentdata[Gcdindex][i][2][j]; // entry for the driver details
  if (entry != null && entry.length >= 5 && entry[5] != null)
    return entry[5].length;
  return 0;
}

function addSOInternal(i, j) {
  // var so = document.getElementById("so-"+i+"-"+j).value;
  var so = "New strategic option " + (numOptions(i, j) + 1);
  if (so.valueOf() == "".valueOf()) {
    showTimedMessage("destat", "Strategic option has no content!", 0, true);
    return;
  }
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("destat").innerHTML = "Adding strategic option...";
  $.ajax({
    url:
      "add-driver-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(driver) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      costElement +
      "&desc=" +
      encodeURIComponent(so),
    type: "POST",
    success: kcdriverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function addSO(i, j) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a strategic option now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addSOInternal(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addSOInternal(i, j);
}

function addSOToDriver(costElement, driver, so, update) {
  if (!update) {
    $.ajax({
      url:
        "add-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        costElement +
        "&desc=" +
        encodeURIComponent(so),
      type: "POST",
      success: showTimedMessage("destat", "Adding next option", 0, false),
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "add-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        costElement +
        "&desc=" +
        encodeURIComponent(so),
      type: "POST",
      success: kcdriverUpdated,
      error: driverOpFailed
      //,datatype: "json"
    });
  }
}

function addSOsInternal(i, j) {
  // var so = document.getElementById("so-"+i+"-"+j).value;
  var sos = document.getElementById("newsos-" + i + "-" + j).value;
  if (sos.valueOf() == "".valueOf()) {
    showTimedMessage("destat", "Strategic option has no content!", 0, true);
    return;
  }
  var options = sos.split("\n");
  for (var m = options.length - 1; m >= 0; m--) {
    if (options[m].valueOf() == "".valueOf()) {
      options.splice(m, 1);
    }
  }

  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;

  document.getElementById("destat").innerHTML = "Adding strategic options...";

  for (var j = 0; j < options.length; j++) {
    if (j < options.length - 1) {
      setTimeout(addSOToDriver(costElement, driver, options[j], 0), 1000);
    } else {
      setTimeout(addSOToDriver(costElement, driver, options[j], 1), 1000);
    }
  }
}

function addSOs(i, j) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a strategic option now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addSOsInternal(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addSOsInternal(i, j);
}

function makeKCDInternal2(i, j) {
  var checkbox = document.getElementById("kcb-" + i + "-" + j);
  var val = 0;
  if (checkbox.checked) val = 1;
  if (checkbox == null) {
    showTimedMessage("destat", "checkbox was not found!", 0, true);
    return;
  }
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  document.getElementById("destat").innerHTML = "Adding strategic option...";
  $.ajax({
    url:
      "set-kcd.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(driver) +
      "&ce=" +
      costElement +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&val=" +
      encodeURIComponent(val),
    type: "POST",
    success: kcdriverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function makeKCDInternal(i, j) {
  var checkbox = document.getElementById("kcb-" + i + "-" + j);
  if (checkbox.checked) {
    // wants to make the driver KCD
    if (
      document.getElementById("kimp-" + i + "-" + j).value.valueOf() !=
      "YES".valueOf()
    ) {
      $.confirm({
        title: "Attention!",
        message:
          "A Key Cost Driver must be impactable. Are you sure you want to make this a Key Cost Driver anyway?",
        buttons: {
          OK: {
            class: "blue",
            action: function() {
              makeKCDInternal2(i, j);
            }
          },
          Cancel: {
            class: "gray",
            action: function() {
              checkbox.checked = false;
            }
          }
        }
      });
    } else makeKCDInternal2(i, j);
  }
}

function makeKCD(i, j) {
  var checkbox = document.getElementById("kcb-" + i + "-" + j);
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you do this operation now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            makeKCDInternal(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {
            checkbox.checked = !checkbox.checked;
          }
        }
      }
    });
  } else makeKCDInternal(i, j);
}

function saveDSDriver(i, j, update) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  var pos = 0;
  if (Gcostdrivers[i][2] != null) pos = Gcostdrivers[i][2].length;
  document.getElementById("destat").innerHTML = "Saving the driver details";
  if (update == 1) {
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(costElement) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&current=" +
        encodeURIComponent(
          document.getElementById("kcurr-" + i + "-" + j).value
        ) +
        "&units=" + // encodeURIComponent(document.getElementById("cdcurr-"+i+"-"+j).value) +
        "&target=" +
        encodeURIComponent(
          document.getElementById("ktar-" + i + "-" + j).value
        ) +
        "&impact=" +
        document.getElementById("kimp-" + i + "-" + j).value,
      type: "POST",
      success: kcdriverUpdated,
      error: driverOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(costElement) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&current=" +
        encodeURIComponent(
          document.getElementById("kcurr-" + i + "-" + j).value
        ) +
        "&units=" + // encodeURIComponent(document.getElementById("cdcurr-"+i+"-"+j).value) +
        "&target=" +
        encodeURIComponent(
          document.getElementById("ktar-" + i + "-" + j).value
        ) +
        "&impact=" +
        document.getElementById("kimp-" + i + "-" + j).value,
      type: "POST",
      success: showTimedMessage("destat", "driver saved", 0, false),
      error: driverOpFailed
      //,datatype: "json"
    });
  }
}

function deleteDriverInternal2(i, j) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];
  document.getElementById("mstat").innerHTML = "Saving the driver";
  $.ajax({
    url:
      "delete-driver.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(costElement) +
      "&driver=" +
      encodeURIComponent(driver),
    type: "POST",
    success: driverUpdated,
    error: driverOpFailed
    //,datatype: "json"
  });
}

function deleteDriverInternal(i, j) {
  var costElement = Gcostdrivers[i][0];
  var driver = Gcostdrivers[i][2][j][0];

  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a new driver!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteDriverInternal2(i, j);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteDriverInternal2(i, j);
}

function deleteDriver(i, j) {
  $.confirm({
    title: "Attention!",
    message: "Please confirm that you want to delete this driver!",
    buttons: {
      OK: {
        class: "blue",
        action: function() {
          deleteDriverInternal(i, j);
        }
      },
      Cancel: {
        class: "gray",
        action: function() {}
      }
    }
  });
}

var carouselIDs = [];
var allCarousels = [];
var mdSliders = [];

var ceSOPanels = [],
  ceEstimatePanels = [],
  gridView = false,
  scrollX = 0,
  scrollY = 0;

function saveMainScrollXY() {
  scrollX = $("#main-wrapper").scrollLeft();
  scrollY = $("#main-wrapper").scrollTop();
}

function restoreMainScrollXY() {
  $("#main-wrapper").scrollTop(scrollY);
  $("#main-wrapper").scrollLeft(scrollX);
}

var scrollLeftSide = 0,
  scrollRightSide = 0;

function storeSSPageState() {
  scrollLeftSide = $("#left-panel").scrollTop();
  scrollRightSide = $("#right-panel").scrollTop();
}

function restoreSSPageState() {
  $("#left-panel").scrollTop(scrollLeftSide);
  $("#right-panel").scrollTop(scrollRightSide);
}

function resetMDState() {
  ceSOPanels = [];
  ceEstimatePanels = [];
  gridView = false;
  scrollX = 0;
  scrollY = 0;
}
/**
 * Measure step contents are prepared
 */
function refreshMStep() {
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";
  carouselIDs = [];
  mdSliders = [];
  var cdstring =
    '<div id="mstat"> </div><br><h4>Old School Contents</h4>' + injectModals();
  if (Gcostdrivers != null) {
    var prefixes = "[num, den, cd]";
    for (var i = 0; i < Gcostdrivers.length; i++) {
      cdstring =
        cdstring +
        "<TABLE class=fancyTable cellpadding=1 cellspacing=1 border=1>";
      var numdrivers = 0;
      if (Gcostdrivers[i][2] != null) numdrivers = Gcostdrivers[i][2].length;
      if (numdrivers > 1)
        cdstring =
          cdstring +
          "<THEAD><TR><TH>Critical costs</TH><TH colspan=" +
          numdrivers +
          "> Cost drivers </TH></TR></THEAD>";
      else
        cdstring =
          cdstring +
          "<THEAD><TR><TH>Critical costs</TH><TH> Cost drivers </TH></TR></THEAD>";
      var percent = getCEPercentCorrect(Gcostdrivers[i][0]);
      var parent = getCEParent(Gcostdrivers[i][0]);

      // alert("Parent: " + parent);
      if (parent == null)
        cdstring =
          cdstring +
          '<TR><TD style="max-width: 140px; min-width: 140px; width: 140px" align=center>' +
          Gcostdrivers[i][1];
      else
        cdstring =
          cdstring +
          '<TR><TD style="max-width: 140px; min-width: 140px; width: 140px" align=center><font color=orange> [' +
          parent +
          "]</font><br>" +
          Gcostdrivers[i][1];
      cdstring =
        cdstring +
        "<BR><font color=blue> (" +
        percent +
        '% of Total)</font> <BR><BR><div style="opacity: 0.4;"><input type=image src="images/plus32.png" title="Add a new driver" onClick="addDriver(' +
        i +
        ')"' +
        disabled +
        "> </div></TD>";
      if (numdrivers == 0) cdstring = cdstring + "<TD>&nbsp;</TD>";
      var checkboxstring = "<TR><TD>Select</TD>";
      for (var j = 0; j < numdrivers; j++) {
        cdstring = cdstring + '<TD width=140 valign="top"><TABLE width=160>';
        var entry = Gcostdrivers[i][2][j]; // entry for the driver details
        var numid = "num-" + i + "-" + j;
        var denid = "den-" + i + "-" + j;
        var num =
          '<TR><TD><input  style="text-align: center;" onInput="fixTextCDClass(' +
          prefixes +
          ", " +
          i +
          ", " +
          j +
          ')" type=text id=' +
          numid +
          ' onClick="selectAll(' +
          numid +
          ')" value=""' +
          disabled +
          "></TD></TR>";
        var den =
          '<TR class="odd"><TD><input  style="text-align: center;" onInput="fixTextCDClass(' +
          prefixes +
          ", " +
          i +
          ", " +
          j +
          ')" type=text id=' +
          denid +
          ' onClick="selectAll(' +
          denid +
          ')" value=""' +
          disabled +
          "></TD></TR>";
        if (
          entry != null &&
          entry.length >= 4 &&
          entry[4] != null &&
          entry[4].length > 0
        ) {
          num =
            '<TR><TD align=center><input style="text-align: center;" onInput="fixTextCDClass(' +
            prefixes +
            ", " +
            i +
            ", " +
            j +
            ')" type=text id="' +
            numid +
            '" onClick="selectAll(' +
            numid +
            ')" value="' +
            entry[4][0] +
            '"' +
            disabled +
            "></TD></TR>";
          den =
            '<TR class="odd"><TD class="denominator" align=center><input  style="text-align: center;" onInput="fixTextCDClass(' +
            prefixes +
            ", " +
            i +
            ", " +
            j +
            ')" type=text id="' +
            denid +
            '" onClick="selectAll(' +
            denid +
            ')" value="' +
            entry[4][1] +
            '"' +
            disabled +
            "></TD></TR>";
        }
        cdstring = cdstring + num;
        cdstring = cdstring + den;
        var cdid = "cd-" + i + "-" + j;
        cdstring =
          cdstring +
          '<TR><TD align=center bgcolor=lightgreen><input  onInput="fixTextCDClass(' +
          prefixes +
          ", " +
          i +
          ", " +
          j +
          ')" class="cd" type=text id="' +
          cdid +
          '" onClick="selectAll(' +
          cdid +
          ')" value="' +
          entry[1] +
          '"' +
          disabled +
          "></TD></TR>"; // driver name
        cdstring =
          cdstring +
          '<TR class="odd"><TD align=center><TABLE border=0 cellspacing=0 cellpadding=0 width=100%><TR><TD width=33% align=center>';
        if (j > 0 && Gadmin == 1)
          cdstring =
            cdstring +
            '<div style="opacity: 0.4;"><input type=image src="images/arrow-left.png" title="Move driver to the left" onClick="moveDriverLeft(' +
            i +
            ", " +
            j +
            ')"' +
            disabled +
            "></div>";
        else cdstring = cdstring + "&nbsp;";
        cdstring = cdstring + "</TD>";
        if (Gadmin == 1)
          cdstring =
            cdstring +
            '<TD width=34% align=center><div style="opacity: 0.4;"><input title="Delete this driver" type=image src="images/trash20.png" onClick="deleteDriver(' +
            i +
            "," +
            j +
            ')" value="Delete"' +
            disabled +
            "></div></TD><TD width=33% align=center>";
        else
          cdstring =
            cdstring +
            "<TD width=34% align=center>&nbsp;</TD><TD width=33% align=center>";
        if (j < numdrivers - 1 && Gadmin == 1)
          cdstring =
            cdstring +
            '<div style="opacity: 0.4;"><input type=image src="images/arrow-right.png" title="Move driver to the right" onClick="moveDriverRight(' +
            i +
            ", " +
            j +
            ')"' +
            disabled +
            "></div>";
        else cdstring = cdstring + "&nbsp;";
        cdstring = cdstring + "</TD></TR></TABLE></TD></TR>";
        var checkboxid = "element-" + i + "-" + j;
        checkboxstring =
          checkboxstring +
          "<TD align=center><input type=checkbox value=" +
          entry[0] +
          ' id="' +
          checkboxid +
          '"' +
          disabled +
          "></TD>";
        // cdstring = cdstring + '<TR><TD>' + Gcurrentdata[Gcdindex][i][3][j][1] + '</TD></TR>';
        cdstring = cdstring + "</TABLE></TD>";
      }
      cdstring = cdstring + "</TR>";
      cdstring = cdstring + "</TABLE><BR>";
    }
  }
  document.getElementById("Measure-body").innerHTML = mdStepContents2();

  for (var i = 0; i < ceSOPanels.length; i++) {
    // alert("Panel open: " + ceSOPanels[i]);
    var id = ceSOPanels[i];
    var item = $("#" + id).closest(".cost_driver_container");
    $(item)
      .find(".strag_opt_load")
      .show();
  }

  for (var i = 0; i < ceEstimatePanels.length; i++) {
    // alert("Panel open: " + ceSOPanels[i]);
    var id = ceEstimatePanels[i];
    showEstimatePanel(id);
  }

  $(window).scroll(function() {
    $(".crit_cost_wrp").css({
      left: $(this).scrollLeft() + 0
    });
  });

  restoreMainScrollXY();

  document.getElementById("destroy-carousel-default").onclick = function() {
    $(".strategic_option").hide(); // hide stretegic option in grid mode
    $(this).addClass("disable_activemode");
    $(".enable_icon").removeClass("enable_activemode");
    $(".slider_controls").hide();
    $(".cd_inner_wrp").addClass("cd_inner_wrp_grid");
    //$('.cd_item').css("position","static");
  };

  document.getElementById("enable-carousel-default").onclick = function() {
    $(".strategic_option").show(); // show stretegic option
    $(this).addClass("enable_activemode");
    $(".disable_icon").removeClass("disable_activemode");
    $(".slider_controls").show();

    //if (!$('#carousel_1').hasClass('purejscarousel')) {
    //				carousel1.build();
    //	   }

    $(".cd_inner_wrp").removeClass("cd_inner_wrp_grid");
    //$('.cd_item').css("position","relative");
  };

  $(".strategic_option").click(function() {
    var item = $(this).closest(".cost_driver_container");
    // alert("id of object: " + $(this).attr("id"));
    $(item)
      .find(".strag_opt_load")
      .toggle(); // load strag option with scroll

    $("#destroy-carousel-default").toggle(); // hide grid mode

    $(item)
      .find(".strategic_option")
      .toggleClass("stag_collapse");

    if (
      $(item)
        .find(".strategic_option")
        .hasClass("stag_collapse")
    ) {
      if ($.inArray($(this).attr("id"), ceSOPanels) < 0)
        ceSOPanels.push($(this).attr("id"));
      $(item)
        .find(".strategic_option")
        .html(
          'Hide strategic options <i class="fa fa-angle-up" aria-hidden="true"></i>'
        );
      //$(".cost_driver_wrp").addClass('set_height');
    } else {
      if ($.inArray($(this).attr("id"), ceSOPanels) >= 0)
        ceSOPanels.splice($.inArray($(this).attr("id"), ceSOPanels), 1);
      $(item)
        .find(".strategic_option")
        .html(
          'Show strategic options <i class="fa fa-angle-down" aria-hidden="true"></i>'
        );
      $(item)
        .find(".cost_driver_wrp")
        .removeClass("set_height");
    }
  });
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  // cd item option btn click open dropdown
  $(".cd_item .opt_btn").click(function() {
    if (
      $(this)
        .parent()
        .find(".opt_btn_wrp")
        .css("display") == "none"
    ) {
      $(".cd_item").removeClass("add_cdstyle");
      $(".opt_btn_wrp").hide();
      $(this)
        .parent()
        .find(".opt_btn_wrp")
        .toggle();
      $(this)
        .closest(".cd_item")
        .toggleClass("add_cdstyle");
    } else {
      $(".cd_item").removeClass("add_cdstyle");
      $(".opt_btn_wrp").hide();
    }
  });

  $(".cd_item").hover(function() {
    $("body").toggleClass("noscroll"); // hide vertical scroll of body
  });

  //stag option btn click open dropdown
  $(".stag_item .opt_btn").click(function() {
    if (
      $(this)
        .parent()
        .find(".opt_btn_wrp")
        .css("display") == "none"
    ) {
      $(".stag_item").removeClass("add_stag_border");
      $(".opt_btn_wrp").hide();
      $(this)
        .parent()
        .find(".opt_btn_wrp")
        .toggle();
      $(this)
        .closest(".stag_item")
        .toggleClass("add_stag_border");
    } else {
      $(".stag_item").removeClass("add_stag_border");
      $(".opt_btn_wrp").hide();
    }
  });

  changedObjects = [];
  // refreshDStep();
}
/**
 * Define step contents are prepared
 */
function refreshDStep() {
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";

  oldCheckBoxValues = [];
  oldSelectValues = [];
  changedObjects = [];
  var kcdstring =
    '<div id="destat"> </div><h4>Old School Contents</h4><br>' + injectModals();
  var prefixes = "[kcurr, ktar]";
  var selprefixes = "[kimp]";
  if (Gcurrentdata[Gcdindex] != null) {
    for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
      kcdstring =
        kcdstring +
        "<TABLE class=fancyTable cellpadding=1 cellspacing=1 border=1>";
      var numdrivers = 0;
      if (Gcurrentdata[Gcdindex][i][2] != null)
        numdrivers = Gcurrentdata[Gcdindex][i][2].length;
      if (numdrivers > 1)
        kcdstring =
          kcdstring +
          "<THEAD><TR><TH >Critical costs</TH><TH colspan=" +
          numdrivers +
          "> Cost drivers </TH></TR></THEAD>";
      else
        kcdstring =
          kcdstring +
          "<THEAD><TR><TH >Critical costs</TH><TH> Cost drivers </TH></TR></THEAD>";
      var percent = getCEPercentCorrect(Gcurrentdata[Gcdindex][i][0]);
      var parent = getCEParent(Gcurrentdata[Gcdindex][i][0]);
      var ceid = Gcurrentdata[Gcdindex][i][0];
      if (parent == null)
        kcdstring =
          kcdstring +
          '<TR><TD style="max-width: 140px; min-width: 140px; width: 140px">' +
          Gcurrentdata[Gcdindex][i][1] +
          "<br><font color=blue> ( " +
          percent +
          "% of total) </font></TD>";
      else
        kcdstring =
          kcdstring +
          '<TR><TD style="max-width: 140px; min-width: 140px; width: 140px"><font color=orange>' +
          parent +
          "</font><br>[" +
          Gcurrentdata[Gcdindex][i][1] +
          "]<br><font color=blue> ( " +
          percent +
          "% of total) </font></TD>";
      if (numdrivers == 0) kcdstring = kcdstring + "<TD>&nbsp;</TD>";

      var currentRow = '<TR class="odd"><TD><b>Current value:</b></TD>';
      var canImpact = '<TR class="odd"><TD><b>Can impact?</b></TD>';
      var targetRow = "<TR><TD><b>Target value:</b></TD>";
      var factorsRow = '<TR class="odd" ><TD><b>Strategic options:</b><br>';
      var buttonsRow = "<TR><TD>&nbsp;</TD>";
      factorsRow = factorsRow + "</TD>";
      var checkboxstring = "<TR><TD><b>Select as key cost driver:</b></TD>";
      for (var j = 0; j < numdrivers; j++) {
        kcdstring = kcdstring + "<TD align=center width=184><TABLE width=184>";

        var entry = Gcurrentdata[Gcdindex][i][2][j]; // entry for the driver details
        var num = "<TR><TD>&nbsp;</TD></TR>";
        var den = "<TR><TD>&nbsp;</TD></TR>";
        var currid = "kcurr-" + i + "-" + j;
        var curr =
          '<TD align=center><input type=text onClick="selectAll(' +
          currid +
          ')" id="' +
          currid +
          '"  value=""' +
          disabled +
          "></TD>";
        var kimpid = "kimp-" + i + "-" + j;
        var change = "<TD>&nbsp;</TD>";
        var tarid = "ktar-" + i + "-" + j;
        var tar =
          '<TD align=center><input type=text id="' +
          tarid +
          '" onClick="selectAll(' +
          tarid +
          ' )" value=""' +
          disabled +
          "></TD>";
        var factors = '<TD><div id="kfact"></div></TD>';
        var kcdp = 0;
        var eventspec =
          ' onChange="fixSelCDClass(' +
          selprefixes +
          ", " +
          i +
          ", " +
          j +
          ')"  ';
        if (
          entry != null &&
          entry.length >= 4 &&
          entry[4] != null &&
          entry[4].length > 0
        ) {
          num = "<TR><TD align=center>&nbsp;" + entry[4][0] + "</TD></TR>";
          den =
            '<TR><TD class="denominator" align=center>&nbsp;' +
            entry[4][1] +
            "</TD></TR>";
          curr =
            '<TD align=center><input onInput="fixTextCDClass(' +
            prefixes +
            ", " +
            i +
            ", " +
            j +
            ')" type=text id="' +
            currid +
            '" onClick="selectAll(' +
            currid +
            ')"  value="' +
            entry[4][2] +
            '"' +
            disabled +
            ">";
          // '<input onInput="fixTextCDClass(' + prefixes + ', ' + i + ', ' + j + ')" type=text size=8 id="cdcurr-' + i + '-' + j + '" value="' + entry[4][5] +'"></TD>';
          change =
            "<TD align=center>" +
            generateSelectDefaultEvent(
              kimpid,
              ["", "YES", "NO"],
              entry[4][3],
              eventspec
            ) +
            "</TD>";
          if (Gadmin == 0) change = "<TD align=center>" + entry[4][3] + "</TD>";
          else {
            if (entry[4][3] == null) setOldSelectValue(kimpid, "");
            else setOldSelectValue(kimpid, entry[4][3]);
          }
          tar =
            '<TD align=center><input onInput="fixTextCDClass(' +
            prefixes +
            ", " +
            i +
            ", " +
            j +
            ')" type=text id="' +
            tarid +
            '" onClick="selectAll(' +
            tarid +
            ')" value="' +
            entry[4][4] +
            '"' +
            disabled +
            "></TD>";
          if (
            entry[4].length >= 7 &&
            ("" + entry[4][6]).valueOf() != "0".valueOf()
          )
            kcdp = 1;
        } else {
          // nothing to do here -- no details yet...
        }
        kcdstring = kcdstring + num;
        kcdstring = kcdstring + den;
        if (kcdp)
          kcdstring =
            kcdstring +
            '<TR><TD align=center><i><b><div style="background-color: yellow;">' +
            entry[1] +
            "</div></b></i></TD></TR>";
        // driver name
        else
          kcdstring =
            kcdstring +
            "<TR><TD align=center><i><b>" +
            entry[1] +
            "</b></i></TD></TR>"; // driver name
        buttonsRow =
          buttonsRow +
          '<TD align=center><input class="btn-sm btn-info" onClick="saveDSDriver(' +
          i +
          "," +
          j +
          ')" title="Save Driver Details" type=submit value="Save Details"></TD>';
        currentRow = currentRow + curr;
        canImpact = canImpact + change;
        targetRow = targetRow + tar;

        factors = '<TD  VALIGN="top">';
        var sopanelid = "sopanel-" + i + "-" + j;
        factors =
          factors +
          '<center><button title="Click to expose/hide strategic options" type"button" onClick="addSOClick(' +
          i +
          "," +
          j +
          ');" class="btn-sm btn-info" data-toggle="collapse" data-target="#' +
          sopanelid +
          '">' +
          "Show/Hide Strategic Options" +
          " </button></center>";

        var open = "";
        if (getSOClicks(i, j) % 2 == 1) open = " in";
        factors =
          factors +
          '<div class="collapse ' +
          open +
          '" id="' +
          sopanelid +
          '"><TABLE class=fancyTableBorder>';
        checkboxprefixes = "[socb]";
        soprefixes = "[sotext]";
        if (
          entry != null &&
          entry.length >= 5 &&
          entry[5] != null &&
          entry[5].length > 0
        ) {
          for (var k = 0; k < entry[5].length; k++) {
            var soid = entry[5][k][0];
            var sodesc = entry[5][k][1];
            var sosel = entry[5][k][2];
            var checked = "";
            if ((sosel + "").valueOf() == "1".valueOf()) checked = " checked ";
            var sotextid = "sotext-" + i + "-" + j + "-" + soid;
            var socbid = "socb-" + i + "-" + j + "-" + soid;
            var socbcontid = "contsocb-" + i + "-" + j + "-" + soid;
            var rowdat = i + "-" + j + "-" + soid;
            var classspec = "";
            if (checked.valueOf() != "".valueOf())
              classspec = " class=goodidea ";
            if (Gadmin == 1) {
              factors =
                factors +
                '<TR> <TD width=16 align=center><div id="' +
                socbcontid +
                '"> <input type=checkbox onchange="fixCheckBoxRowClass(' +
                checkboxprefixes +
                "," +
                rowdat +
                ')" id="' +
                socbid +
                '" title="Select this strategic option to carry forward" ' +
                checked +
                '></div></TD><TD width=18 align=center><div style="opacity: 0.4;"><input title="Delete this strategic option" onClick="deleteSO(' +
                i +
                ", " +
                j +
                "," +
                soid +
                ')" type="image" src="images/trash20.png"></div></TD>';
              if (k > 0)
                factors =
                  factors +
                  '<TD align=center width=16><div style="opacity: 0.4;"><input type=image src="images/upArrow20.png" onClick="upSO(' +
                  i +
                  ", " +
                  j +
                  "," +
                  (k + 1) +
                  ')" title="Shift this strategic option UP one position"></div></TD>';
              else factors = factors + "<TD align=center width=16>&nbsp;</TD>";
              if (k < entry[5].length - 1)
                factors =
                  factors +
                  '<TD align=center width=16><div style="opacity: 0.4;"><input type=image src="images/downArrow20.png" onClick="downSO(' +
                  i +
                  ", " +
                  j +
                  "," +
                  (k + 1) +
                  ')" title="Shift this strategic option down one position"></div></TD>';
              else factors = factors + "<TD align=center width=16>&nbsp;</TD>";
              factors =
                factors +
                "<TD><textarea " +
                classspec +
                ' oninput="fixTextRowClass(' +
                soprefixes +
                ",  " +
                rowdat +
                ')" cols=22 rows=2 id="' +
                sotextid +
                '">' +
                sodesc +
                "</textarea></TD></TR>";
            } else
              factors =
                factors +
                '<TR> <TD width=20 align=center><div id="' +
                socbcontid +
                '"> <input type=checkbox onchange="fixCheckBoxRowClass(' +
                checkboxprefixes +
                ", " +
                rowdat +
                ')" id="' +
                socbid +
                '" title="Select this strategic option to carry forward" ' +
                checked +
                disabled +
                "></div></TD><TD width=20 align=center>&nbsp</TD> <TD>" +
                sodesc +
                "</TD></TR>";

            setOldCheckBoxValue(socbid, "" + sosel);
          }
        }

        var soid = "so-" + i + "-" + j;

        if (Gadmin == 1) {
          factors = factors + "<TR><TD align=center colspan=2>";
          factors =
            factors +
            '<div style="opacity: 0.4;"><input type=image src="images/plus32.png" title="Add all strategic options in the textbox" onClick="addSOs(' +
            i +
            "," +
            j +
            ')"></div></TD>';
          factors =
            factors +
            '<TD colspan=3><textarea title="Enter 1 or more strategic options separated by newline" id="newsos-' +
            i +
            "-" +
            j +
            '" cols=31 rows=5></textarea></TD></TR>';
        } else {
          factors = factors + "<TR><TD colspan=3 align=center>";
          factors = factors + "&nbsp;</TD></TR>";
        }
        factors = factors + "</TABLE></div></TD>";

        factorsRow = factorsRow + factors;
        kcdstring = kcdstring + "</TR></TABLE></TD>";
        var checkboxid = "kcb-" + i + "-" + j;
        var chkd = "";
        if (entry[4] == null || entry[4].length <= 6 || entry[4][6] == null)
          continue;
        if (("" + entry[4][6]).valueOf() != "0".valueOf()) {
          chkd = "checked";
        }
        checkboxstring =
          checkboxstring +
          '<TD align=center><input type=checkbox onClick="makeKCD(' +
          i +
          "," +
          j +
          ')" value=' +
          entry[0] +
          ' id="' +
          checkboxid +
          '" ' +
          chkd +
          " " +
          disabled +
          "></TD>";
      }
      kcdstring = kcdstring + "</TR>";
      kcdstring = kcdstring + currentRow + "</TR>";
      kcdstring = kcdstring + targetRow + "</TR>";
      kcdstring = kcdstring + canImpact + "</TR>";
      // kcdstring = kcdstring + buttonsRow + '</TR>';
      if (numdrivers > 0) kcdstring = kcdstring + checkboxstring + "</TR>";
      kcdstring = kcdstring + factorsRow + "</TR>";

      kcdstring = kcdstring + "</TABLE><P>";
    }
  }
  document.getElementById("Define-body").innerHTML = kcdstring;
}
/**
 * Find Strategic Option description given a cost driver id, cost element id and strategic option id
 * @param {number} ce - cost element id.
 * @param {number} cd - cost driver id.
 * @param {number} so - strategic option id
 */
function getSOText(ce, cd, so) {
  for (var m = 0; m < Gcurrentdata[Gcdindex].length; m++) {
    var centry = Gcurrentdata[Gcdindex][m];
    if (centry == null) continue;
    var costElement = centry[0];
    if (costElement == ce) {
      for (var b = 0; b < Gcurrentdata[Gcdindex][m][2].length; b++) {
        var cdentry = Gcurrentdata[Gcdindex][m][2][b];
        if (cdentry != null) {
          var driver = cdentry[0];
          if (driver == cd) {
            if (cdentry[5] != null) {
              for (var xx = 0; xx < cdentry[5].length; xx++) {
                var option = cdentry[5][xx][0];
                if (so == option) return cdentry[5][xx][1];
              }
            }
          }
        }
      }
    }
  }
  return "weird: strategic option not found!!";
}

function addSSSoInternal(ss) {
  var selection = document.getElementById("sssel-" + ss).value;
  if (selection == null) {
    showTimedMessage(
      "restatus",
      "Please select a strategic option to add",
      0,
      true
    );
    return;
  }
  var items = selection.split("-");
  var ss = parseInt(items[0]);
  var ce = parseInt(items[1]);
  var driver = parseInt(items[2]);
  var so = parseInt(items[3]);
  var text = getSOText(ce, driver, so);
  // alert(" ce = " + ce + " ; driver = " + driver + " ; ss = " + ss + " ; so = " + so + " ; text = " + text);
  setSSSo(ce, driver, ss, 1, so, text);
}

function addSSSo(ss) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if do this operation now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addSSSoInternal(ss);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addSSSoInternal(ss);
}

function deleteSSSoInternal(ce, cd, ss, so) {
  // alert(" ce = " + ce + " ; driver = " + cd + " ; ss = " + ss + " ; so = " + so);
  setSSSo(ce, cd, ss, 0, so, "");
}

function deleteSSSo(ce, cd, ss, so) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if do this operation now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteSSSoInternal(ce, cd, ss, so);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteSSSoInternal(ce, cd, ss, so);
}

function setSSSo(ce, cd, ss, val, option, text) {
  GcurrentSS = ss;
  GsavedSSDesc = "";
  if (val == 1) {
    GsavedSSDesc = document.getElementById("desc-" + ss).value + "\n" + text;
    document.getElementById("desc-" + ss).value = GsavedSSDesc;
  }

  document.getElementById("restatus").innerHTML =
    "Updating strategy statement...";
  $.ajax({
    url:
      "set-ss-option.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&ce=" +
      ce +
      "&driver=" +
      cd +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      encodeURIComponent(ss) +
      "&value=" +
      encodeURIComponent(val) +
      "&option=" +
      encodeURIComponent(option),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function populateKCD(id, reldiv) {
  var tablestring = "";
  var selector = document.getElementById(id); //
  reldiv = document.getElementById(reldiv);

  if (selector != null) {
    var cd = parseInt(selector.value);
    if (reldiv != null) {
      for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
        for (var j = 0; j < Gcurrentdata[Gcdindex][i][2].length; j++) {
          var cdentry = Gcurrentdata[Gcdindex][i][2][j];
          if (cdentry != null) {
            if ((cd + "").valueOf() == ("" + cdentry[0]).valueOf()) {
              var cdname = cdentry[1];
              if (cdentry[5] != null) {
                tablestring =
                  "<table><TR><th>Strategic options for: " +
                  cdname +
                  "</TH></TR>";
                for (var k = 0; k < cdentry[5].length; k++) {
                  tablestring =
                    tablestring + "<TR><TD>" + cdentry[5][k] + "</TD></TR>";
                }
                tablestring = tablestring + "</TABLE>";
                reldiv.innerHTML = tablestring;
                return;
              }
              reldiv.innerHTML = "No strategic options";
              return;
            }
          }
        }
      }
      reldiv.innerHTML = "No strategic options defined";
    }
  }
}

function addSSRiskInternal(ss, len) {
  GcurrentSS = ss;
  document.getElementById("restatus").innerHTML =
    "Adding strategy statement risk...";
  $.ajax({
    url:
      "add-risk.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&risk=" +
      encodeURIComponent("<< risk " + (len + 1) + " >>") +
      "&value=" +
      encodeURIComponent(0) +
      "&type=" +
      encodeURIComponent(Grtypes[0]),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function addSSRisk(ss, len) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add new risks now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addSSRiskInternal(ss, len);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addSSRiskInternal(ss, len);
}

function deleteSSRiskInternal(ss, rb) {
  document.getElementById("restatus").innerHTML =
    "Deleting strategy statement risk...";
  GcurrentSS = ss;
  $.ajax({
    url:
      "delete-risk.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&risk=" +
      encodeURIComponent(rb),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function deleteSSRisk(ss, rb) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this risk now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteSSRiskInternal(ss, rb);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteSSRiskInternal(ss, rb);
}

function getCurrentRisk(ss, k) {
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry[0] == ss) {
      var risks = oentry[4];
      if (k >= 0 && k < risks.length) return risks[k][0];
      return "Weird risk case";
    }
  }
  return "Weird risk case 2";
}

function saveSSRisk(ss, k, update) {
  var ssrisktext = "risktext-" + ss + "-" + k + "-risk";
  var ssriskval = "riskval-" + ss + "-" + k + "-risk";
  var ssriskmax = "riskmax-" + ss + "-" + k + "-risk";
  var ssriskmin = "riskmin-" + ss + "-" + k + "-risk";
  var ssrisktype = "risktype-" + ss + "-" + k + "-risk";

  var val = extractNumber(document.getElementById(ssriskval).value);
  var maxval = extractNumber(document.getElementById(ssriskmax).value);
  var minval = extractNumber(document.getElementById(ssriskmin).value);

  if (!(val <= maxval && val >= minval)) {
    myAlert(
      "Attention!",
      "Expected risk level must be between the max and min values",
      "error"
    );
    return;
  }
  var rb = getCurrentRisk(ss, k);

  document.getElementById("restatus").innerHTML =
    "Saving strategy statement risk...";
  GcurrentSS = ss;
  if (update == 1) {
    $.ajax({
      url:
        "save-risk.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ss +
        "&risk=" +
        encodeURIComponent(rb) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&newrisk=" +
        encodeURIComponent(document.getElementById(ssrisktext).value) +
        "&newval=" +
        encodeURIComponent(val) +
        "&newmax=" +
        encodeURIComponent(maxval) +
        "&newmin=" +
        encodeURIComponent(minval) +
        "&newtype=" +
        encodeURIComponent(document.getElementById(ssrisktype).value),
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-risk.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ss +
        "&risk=" +
        encodeURIComponent(rb) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&newrisk=" +
        encodeURIComponent(document.getElementById(ssrisktext).value) +
        "&newval=" +
        encodeURIComponent(val) +
        "&newmax=" +
        encodeURIComponent(maxval) +
        "&newmin=" +
        encodeURIComponent(minval) +
        "&newtype=" +
        encodeURIComponent(document.getElementById(ssrisktype).value),
      type: "POST",
      success: showTimedMessage("restatus", "Saved risk", 0, false),
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function addSSBenefitInternal(ss, len) {
  document.getElementById("restatus").innerHTML =
    "Adding strategy statement benefit...";
  GcurrentSS = ss;
  $.ajax({
    url:
      "add-benefit.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&benefit=" +
      encodeURIComponent("<< benefit " + (len + 1) + " >>") +
      "&value=" +
      encodeURIComponent(0) +
      "&type=" +
      encodeURIComponent(Gbtypes[0]),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function addSSBenefit(ss, len) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add new benefits now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addSSBenefitInternal(ss, len);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addSSBenefitInternal(ss, len);
}

function deleteSSBenefitInternal(ss, rb) {
  document.getElementById("restatus").innerHTML =
    "Deleting strategy statement benefit...";
  GcurrentSS = ss;
  $.ajax({
    url:
      "delete-benefit.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&benefit=" +
      encodeURIComponent(rb),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function deleteSSBenefit(ss, rb) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this benefit now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteSSBenefitInternal(ss, rb);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteSSBenefitInternal(ss, rb);
}

function getCurrentBenefit(ss, k) {
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry[0] == ss) {
      var benefits = oentry[5];
      if (k >= 0 && k < benefits.length) return benefits[k][0];
      return "Weird benefit case";
    }
  }
  return "Weird benefit case 2";
}

function saveSSBenefit(ss, k, update) {
  var ssbentext = "bentext-" + ss + "-" + k + "-benefit";
  var ssbenval = "benval-" + ss + "-" + k + "-benefit";
  var ssbenmax = "benmax-" + ss + "-" + k + "-benefit";
  var ssbenmin = "benmin-" + ss + "-" + k + "-benefit";
  var ssbentype = "bentype-" + ss + "-" + k + "-benefit";

  var val = extractNumber(document.getElementById(ssbenval).value);
  var maxval = extractNumber(document.getElementById(ssbenmax).value);
  var minval = extractNumber(document.getElementById(ssbenmin).value);

  if (!(val <= maxval && val >= minval)) {
    myAlert(
      "Attention",
      "Expected benefit must be between the max and min values",
      "error"
    );
    return;
  }

  var rb = getCurrentBenefit(ss, k);
  document.getElementById("restatus").innerHTML =
    "Saving strategy statement benefit...";
  GcurrentSS = ss;
  if (update == 1) {
    $.ajax({
      url:
        "save-benefit.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ss +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&benefit=" +
        encodeURIComponent(rb) +
        "&newbenefit=" +
        encodeURIComponent(document.getElementById(ssbentext).value) +
        "&newval=" +
        encodeURIComponent(val) +
        "&newmax=" +
        encodeURIComponent(maxval) +
        "&newmin=" +
        encodeURIComponent(minval) +
        "&newtype=" +
        encodeURIComponent(document.getElementById(ssbentype).value),
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-benefit.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ss +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&benefit=" +
        encodeURIComponent(rb) +
        "&newbenefit=" +
        encodeURIComponent(document.getElementById(ssbentext).value) +
        "&newval=" +
        encodeURIComponent(val) +
        "&newmax=" +
        encodeURIComponent(maxval) +
        "&newmin=" +
        encodeURIComponent(minval) +
        "&newtype=" +
        encodeURIComponent(document.getElementById(ssbentype).value),
      type: "POST",
      success: showTimedMessage("restatus", "Benefit saved", 0, false),
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function addNewSSTemplate(num) {
  document.getElementById("restatus").innerHTML =
    "Adding new strategy statement";
  GcurrentSS = null;
  $.ajax({
    url:
      "add-ss.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ssname=" +
      encodeURIComponent("<< New strategy statement " + (num + 1) + ">>"),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function saveSS(ss, update) {
  document.getElementById("restatus").innerHTML =
    "Updating strategy statement...";
  GcurrentSS = ss;
  var val = document.getElementById("levercb-" + ss).checked;
  // alert("check box state: " + val);
  if (val) {
    if (update == 1) {
      $.ajax({
        url:
          "save-ss.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&ss=" +
          ss +
          "&project=" +
          encodeURIComponent(Gcurrentstrategy) +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&desc=" +
          encodeURIComponent(document.getElementById("desc-" + ss).value) +
          "&priority=" +
          encodeURIComponent(document.getElementById("priority-" + ss).value) +
          "&constraints=" +
          encodeURIComponent(
            document.getElementById("constraints-" + ss).value
          ) +
          "&leveragable=1" +
          "&amount=" +
          encodeURIComponent(document.getElementById("levam-" + ss).value) +
          "&comment=" +
          encodeURIComponent(document.getElementById("levcomm-" + ss).value),
        type: "POST",
        success: ssUpdated,
        error: ssOpFailed
        //,datatype: "json"
      });
    } else {
      $.ajax({
        url:
          "save-ss.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&ss=" +
          ss +
          "&project=" +
          encodeURIComponent(Gcurrentstrategy) +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&desc=" +
          encodeURIComponent(document.getElementById("desc-" + ss).value) +
          "&priority=" +
          encodeURIComponent(document.getElementById("priority-" + ss).value) +
          "&constraints=" +
          encodeURIComponent(
            document.getElementById("constraints-" + ss).value
          ) +
          "&leveragable=1" +
          "&amount=" +
          encodeURIComponent(document.getElementById("levam-" + ss).value) +
          "&comment=" +
          encodeURIComponent(document.getElementById("levcomm-" + ss).value),
        type: "POST",
        success: showTimedMessage(
          "restatus",
          "Strategy statement saved",
          0,
          false
        ),
        error: ssOpFailed
        //,datatype: "json"
      });
    }
  } else {
    if (update == 1) {
      $.ajax({
        url:
          "save-ss.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&ss=" +
          ss +
          "&project=" +
          encodeURIComponent(Gcurrentstrategy) +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&desc=" +
          encodeURIComponent(document.getElementById("desc-" + ss).value) +
          "&priority=" +
          encodeURIComponent(document.getElementById("priority-" + ss).value) +
          "&constraints=" +
          encodeURIComponent(
            document.getElementById("constraints-" + ss).value
          ) +
          "&leveragable=0",
        type: "POST",
        success: ssUpdated,
        error: ssOpFailed
        //,datatype: "json"
      });
    } else {
      $.ajax({
        url:
          "save-ss.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&ss=" +
          ss +
          "&project=" +
          encodeURIComponent(Gcurrentstrategy) +
          "&company=" +
          getCompanyForProject(Gcurrentstrategy) +
          "&bu=" +
          getBUForProject(Gcurrentstrategy) +
          "&desc=" +
          encodeURIComponent(document.getElementById("desc-" + ss).value) +
          "&priority=" +
          encodeURIComponent(document.getElementById("priority-" + ss).value) +
          "&constraints=" +
          encodeURIComponent(
            document.getElementById("constraints-" + ss).value
          ) +
          "&leveragable=0",
        type: "POST",
        success: showTimedMessage(
          "restatus",
          "Strategy statement saved",
          0,
          false
        ),
        error: ssOpFailed
        //,datatype: "json"
      });
    }
  }
}

function addSSImpacted(ss) {
  var selector = document.getElementById("rekcdsel-" + ss);
  if (
    selector == null ||
    selector.value == null ||
    selector.value.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "restatus",
      "Please select a valid cost driver to add",
      0,
      true
    );
    return;
  }
  document.getElementById("restatus").innerHTML =
    "Adding cost driver as impacted by strategy statement...";
  $.ajax({
    url:
      "add-ss-cd.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&cd=" +
      encodeURIComponent(selector.value),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function delSSImpacted(ss) {
  document.getElementById("restatus").innerHTML =
    "Deleting cost driver as impacted by strategy statement...";
  var selector = document.getElementById("impacted-" + ss);
  if (
    selector == null ||
    selector.value == null ||
    selector.value.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "restatus",
      "Please select a valid cost driver to delete",
      0,
      true
    );
    return;
  }

  $.ajax({
    url:
      "delete-ss-cd.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&cd=" +
      encodeURIComponent(selector.value),
    type: "POST",
    success: ssUpdated,
    error: ssOpFailed
    //,datatype: "json"
  });
}

function selectSSInternal(ss) {
  var checked = document.getElementById("sel-" + ss).checked;
  if (checked) {
    GcurrentSS = ss;
    document.getElementById("restatus").innerHTML =
      "Selecting strategy statement for implementation...";
    $.ajax({
      url:
        "set-ss-selected.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss,
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  } else {
    GcurrentSS = ss;
    document.getElementById("restatus").innerHTML =
      "Unselecting strategy statement for implementation...";
    $.ajax({
      url:
        "set-ss-unselected.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss,
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function selectSS(ss) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes in this worksheet!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            selectSSInternal(ss);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {
            var checked = document.getElementById("sel-" + ss).checked;
            document.getElementById("sel-" + ss).checked = !checked;
          }
        }
      }
    });
  } else selectSSInternal(ss);
}

var GsavedSSDesc = "";

function showLever(ss, comment, amount) {
  if (document.getElementById("levercb-" + ss).checked) {
    document.getElementById("lever-" + ss).innerHTML =
      '<table width=80%><TR><TD width=20%>Enter amount:</td><td><input type=text size=40 id="levam-' +
      ss +
      '" value="' +
      amount +
      '"></TD></TR>' +
      '<TR><TD>Comment:</TD><TD><textarea id="levcomm-' +
      ss +
      '">' +
      comment +
      " </textarea></td></tr></table>";
  } else {
    document.getElementById("lever-" + ss).innerHTML = "";
  }
}

function padHeading(heading) {
  var len = heading.length;
  var maxlen = 200;
  var padding = Math.round((maxlen - len) / 2);
  var result = "";
  padding = padding * 1.1;
  for (var i = 0; i < padding; i++) result = result + "&nbsp;";
  result = result + heading;
  for (var j = 0; j < padding; j++) result = result + "&nbsp;";
  return result;
}

function setCurrentSS(ss) {
  GcurrentSS = ss;
}

function refreshRPage() {
  if (document.getElementById("allss").checked) GssFilter = 2;
  else GssFilter = 1;
  et_pricost_table();
}
/**
 * Reduce step content is prepared
 */
function refreshRStep() {
  document.getElementById("Reduce-body").innerHTML = reduceStepContents();
  $(".strategy_stat_wrap").click(function() {
    var elements = this.id.split("-");
    GcurrentSS = parseInt(elements[1]);
    let ratOpn = localStorage.getItem("toggleId");
    if (
      "implementDropDown" + GcurrentSS == ratOpn ||
      "reduce-" + GcurrentSS == ratOpn ||
      "verifydropdown" + GcurrentSS == ratOpn
    ) {
      if ($("#" + ratOpn).css("visibility") == "hidden") {
        $("#" + ratOpn).css("visibility", "hidden");
      } else $("#" + ratOpn).css("visibility", "visible");
    } else {
      $(".verifydropdown").css("visibility", "hidden");
      $(".reducedropdown").css("visibility", "hidden");
    }

    populateSSRisksBenefits();
    $(".strategy_stat_wrap").removeClass("selected_strategy");
    $(this).addClass("selected_strategy");
    $(".action_info_block").hide();
    $(".action_head").addClass("d-block");
  });
  // when refreshing display, add data for the current SS
  if (GcurrentSS != -1) {
    populateSSRisksBenefits();
    $(".strategy_stat_wrap").removeClass("selected_strategy");
    $("#strategy-" + GcurrentSS).addClass("selected_strategy");
    $(".action_head").addClass("d-block");
  }
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
  OverlayScrollbars(document.getElementById("left-panel"), {
    className: "os-theme-dark deviant-scrollbars"
  });
  restoreSSPageState();
}
/**
 * Reduce step content is prepared
 * @callback
 */
function reduceStepContents() {
  var body = `<div class="container-fluid">
    <div class="row">
    <div id="gmsg" onClick="document.getElementById('gmsg').innerHTML=''"></div>
    <div id="left-panel" class="col-lg-6 col-md-6 col-sm-6 strategy_container cus_scroll_leftt">
    <div class="sec_head no_margin">
    <h2 class="sec_title no_margin">Strategy Statements</h2>
    <div class="pull-right">`;
  if (Gadmin == 1) {
    body =
      body +
      `<a href="javascript:void(0);"  class="btn prmary_btn"  id="open_strategy_modal" onClick="addEDSS()" data-toggle="modal" data-target="#strategy_modal">
      <i class="fa fa-plus" aria-hidden="true"></i> Strategy Statements</a>`;
  }
  body = body + "</div>" + "</div>";

  if (Gcurrentdata[Grbindex] != null) {
    for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
      var oentry = Gcurrentdata[Grbindex][i];
      if (oentry == null) {
        body = body + "No data...";
        continue;
      }
      var eternClass = "";
      var eternalTag = 0;
      var eternalImg = "";
      var pclass = " low_priority";
      var performance = getSummaryPerformanceAlt(oentry);
      let selectedBody = "";
      let adminBody = "";
      var ss = oentry[0];
      var ssname = oentry[1];
      var priority = oentry[3];
      var selected = oentry[9];
      var sshandle = oentry[12];
      var fixedhandle = sshandle;
      let perfCalc = performance[0] + performance[1] - performance[2];
      let netPotentitalVIdentified = CurrencyFormat(
        perfCalc,
        GdefaultCurrency,
        0,
        "",
        ","
      );
      if (sshandle.length > GmaxShortStrategyDesc) {
        let tempHandle = sshandle.substring(0, GmaxShortStrategyDesc);
        fixedhandle = `<span title="${sshandle}">${tempHandle}</span>`;
      }
      if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
      else if (priority.valueOf() == "MEDIUM".valueOf())
        pclass = " medium_priority";
      if (selected.valueOf() == "SELECTED".valueOf()) {
        selectedBody =
          '<span class="active_strategy">Selected For Implementation</span>';
      }
      if (
        oentry.length >= 12 &&
        oentry[11] != null &&
        oentry[11].valueOf() == "ETERNAL".valueOf()
      ) {
        eternClass = " click_icon";
        eternalTag = 1;
      }
      if (eternalTag == 1) {
        eternalImg =
          '<img title="Marked for reconsideration in Eternal step"  width="28px" src="images/eternal_icon.png"/>';
      }
      if (Gadmin == 1) {
        adminBody +=
          `<button class="text-capitalize more_option opt_btn pull-right" onclick="RationaleoptionAlt('reduce-${ss}')"><img src="images/ver_more_black.png" alt="more"> </button>` +
          '<div class="reducedropdown" id="reduce-' +
          ss +
          '">';
        var selClass = "";
        let select_statement = "Select Strategy Statement for Implementation";
        if (selected != null && selected.valueOf() == "SELECTED".valueOf()) {
          selClass = "click_reduce_icon";
          select_statement = "Unselect Strategy Statement for Implementation";
        }
        adminBody += `<ul class="strategic_action">
          <li> <a href="javascript:void(0);" id="startegyselectbutton${ss}" class="implement_btn ${selClass}" onClick="setSSSelection(${ss})"> 
          ${select_statement} </a> </li>
          <li><a href="javascript:void(0);"  class="eternal_btn ${eternClass}" onClick="markSSEternal(${ss},'${selected}' )"> Mark for Eternal Watchlist </a></li>
          </ul>
          <h4>Other actions</h4>
          <ul class="other_action">
          <li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDSS(1)"> Edit Strategy Statement </a> </li>
          <li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDSS(${ss}, '${selected}')"> Delete Strategy Statement </a> </li>
          </ul>
          </div>`;
      }
      body =
        body +
        `<div class="strategy_stat_wrap" id="strategy- ${ss}">
               <section class="new_action_stat_wrap">
                <div class="head">
                <span>${fixedhandle} ${ssname}</span> 
                  <h6 class="title">Net potential value identified</h6> ${netPotentitalVIdentified}
                  <div class='priority-container'>
                    <span class="Priority_type  ${pclass}"> ${priority}</span>
                    ${selectedBody}
                  </div>
                  <span class="eternal_strategy">${eternalImg}</span>
                </div>
                ${adminBody}`;
      body =
        body +
        "</section>" +
        '<div class="strategic_opt_wrp">' +
        '<div class="strategic_opt_head">' +
        '<span onClick="toggleStrategicOptions($(this))" class="show_stat_opt">Show selected strategic options <i class="fa fa-angle-down" aria-hidden="true"></i> </span>' +
        "";
      if (Gadmin == 1) {
        body =
          body +
          '<button class="text-capitalize add_btn pull-right add_statopt_btn"  data-toggle="modal" onClick="setupSOs(' +
          ss +
          ')" data-target="#add_statopt_modal">' +
          '<i class="fa fa-plus"></i>' +
          "</button>";
      }
      body = body + "</div>" + '<ul class="strategic_opt_list">';
      //
      //

      if (Gadmin == 1) {
        for (var ss_so_key in Gcurrentdata[33]) {
          if (Gcurrentdata[33][ss_so_key].ssid == ss) {
            sotext = Gcurrentdata[33][ss_so_key].so_desc;
            so = Gcurrentdata[33][ss_so_key].soid;
            ss = Gcurrentdata[33][ss_so_key].ssid;
            body =
              body +
              `<li>
            ${sotext}
            <button 
            class="text-capitalize add_btn pull-right" 
            onClick="confirmRemoveSSSOAlt(${so}, ${ss})"> 
            <i class="fa fa-minus"></i> 
            </button>
            </li>`;
          }
        }
      }
      body = body + "</ul></div></div>";
    }
  }

  if (ss == null) {
  } else {
    if (Gadmin == 1) {
      body =
        body +
        '<a href="javascript:void(0);"  class="btn prmary_btn"  id="open_strategy_modal" onClick="addEDSS()" data-toggle="modal" data-target="#strategy_modal">' +
        '<i class="fa fa-plus" aria-hidden="true"></i> Strategy Statements' +
        "</a>";
    }
  }

  body =
    body +
    `</div>
    <!-- right sec -->
    <div class="col-lg-6 col-md-6 col-sm-6 saving_container">
    <section class="saving_top_wrp"> 
    <div class="sec_head">
    </div>
    <ul class="saving_type_wrp">
    <li class="saved_types">
    <h6 class="saved_label">Cost Improvement</h6>
    <span class="saved_value">
    <div id="ssSavingsTotal"></div>
    </span>
    </li>
    <li class="saved_types">
    <h6 class="saved_label">Revenue Improvement</h6>
    <span class="saved_value">
    <div id="ssCostImpTotal"></div>
    </span>
    </li>
    <li class="saved_types">
    <h6 class="saved_label">Cost Increase</h6>
    <span class="saved_value">
    <div id="ssCostIncTotal"></div>
    </span>
    </li>
    <li class="saved_types">
    <h6 class="saved_label">Revenue Decrease</h6>
    <span class="saved_value">
    <div id="ssRevDecTotal"></div>
    </span>
    </li>
    </ul>
    </section>
    <!-- right bottom part -->
    <section class="saving_bottom_wrp">
    <div id="right-panel" class="saving_bottom_sec cus_scroll right-position">
    <div id="ssRisksBenefits"></div>
    </div>
    </section>
    </div>
    </div>
    </div>`;
  return body;
}
/**
 * Reduce step Benefits and Risks content
 */
function populateSSRisksBenefits() {
  if (Gcurrentdata[Grbindex] == null) return;
  var benefitsString = "";
  var risksString = "";
  // alert("current SS " + GcurrentSS);
  var performance = [0, 0, 0];
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    var ss = oentry[0];
    if (ss != GcurrentSS) continue; // go on to the next iteration if not this entry
    performance = getSummaryPerformanceAlt(oentry);
    document.getElementById("ssCostImpTotal").innerHTML = CurrencyFormat(
      performance[1],
      GdefaultCurrency,
      0,
      "",
      ","
    );
    document.getElementById("ssSavingsTotal").innerHTML = CurrencyFormat(
      performance[0],
      GdefaultCurrency,
      0,
      "",
      ","
    );
    document.getElementById("ssCostIncTotal").innerHTML = CurrencyFormat(
      performance[4],
      GdefaultCurrency,
      0,
      "",
      ","
    );
    document.getElementById("ssRevDecTotal").innerHTML = CurrencyFormat(
      performance[3],
      GdefaultCurrency,
      0,
      "",
      ","
    );

    // alert("performance: " + performance);
    var ssname = oentry[1];
    var constraints = oentry[2];
    var priority = oentry[3];
    var risks = oentry[4];
    var benefits = oentry[5];
    var impSelection = oentry[9];
    var leveragable = oentry[10];
    if (benefits != null) {
      for (var j = 0; j < benefits.length; j++) {
        var benefit = benefits[j][0];
        var val = benefits[j][1];
        var rbtype = benefits[j][2];

        benefitsString =
          benefitsString +
          '<li id="benefits1"> ' +
          '<div class="benefit_desc">' +
          benefits[j][0] +
          "&nbsp;&nbsp;[" +
          rbtype +
          "]" +
          '<span class="benefit_value pull-right"> ' +
          CurrencyFormat(val, GdefaultCurrency, 0, "", ",") +
          "</span>" +
          "</div>";
        if (Gadmin == 1) {
          benefitsString =
            benefitsString +
            '<button class="text-capitalize more_option opt_btn pull-right" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
            '<div class="goal_opt">' +
            '<div class="opt_btn_wrp" hidden> ' +
            '<ul class="other_action">                                         ' +
            '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDBenefit(' +
            j +
            ')"> Edit Benefit </a> </li>' +
            '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteEDBenefit(' +
            j +
            ')"> Delete Benefit </a> </li>' +
            "</ul> " +
            "</div>" +
            "</div>";
          // '<button class="text-capitalize remove_btn" onclick="confirmDeleteEDBenefit(' + j + ')"><i class="fa fa-minus"></i></button>' +
        }
        benefitsString = benefitsString + "</li>";
      }
    }

    if (risks != null) {
      for (var j = 0; j < risks.length; j++) {
        var risk = risks[j][0];
        var val = risks[j][1];
        var rbtype = risks[j][2];

        risksString =
          risksString +
          '<li id="risk1"> ' +
          '<div class="benefit_desc">' +
          risks[j][0] +
          "&nbsp;&nbsp;[" +
          rbtype +
          "]" +
          '<span class="benefit_value pull-right"> ' +
          CurrencyFormat(val, GdefaultCurrency, 0, "", ",") +
          "</span>" +
          "</div>" +
          "";
        if (Gadmin == 1) {
          risksString =
            risksString +
            '<button class="text-capitalize more_option opt_btn pull-right" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
            '<div class="goal_opt">' +
            '<div class="opt_btn_wrp" hidden> ' +
            '<ul class="other_action">                                         ' +
            '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDRisk(' +
            j +
            ')"> Edit Risk </a> </li>' +
            '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteEDRisk(' +
            j +
            ')"> Delete Risk </a> </li>' +
            "</ul> " +
            "</div>" +
            "</div>";
          // '<button class="text-capitalize remove_btn" onclick="confirmDeleteEDRisk(' + j + ')"><i class="fa fa-minus"></i></button>' +
        }
        risksString = risksString + "</li>";
      }
    }
    break; // this means we found our risks and benefits for this SS
  }

  body =
    '<div class="saving_sec">' +
    '<h2 class="sec_title no_margin">Benefits</h2>' +
    '<div class="pull-right">                        ' +
    '<span class="benfitcost">' +
    CurrencyFormat(
      performance[0] + performance[1],
      GdefaultCurrency,
      0,
      "",
      ","
    ) +
    "</span>                   ";
  if (Gadmin == 1) {
    body =
      body +
      '<button class="text-capitalize add_btn" data-toggle="modal" onClick="initBenefit()" data-target="#benefit_modal">' +
      '<i class="fa fa-plus"></i>' +
      "</button>";
  }
  body =
    body +
    "</div>" +
    // '<p class="no_data_desc benefit_info_block"> No benefits added yet.</p>'
    '<ul class="benefit_list">' +
    benefitsString +
    "</ul>" +
    "</div>" +
    '<div class="saving_sec">' +
    '<h2 class="sec_title no_margin">Costs/Risks</h2> ' +
    '<div class="pull-right">                        ' +
    '<span class="riskcost">' +
    CurrencyFormat(performance[2], GdefaultCurrency, 0, "", ",") +
    "</span>                   ";
  if (Gadmin == 1) {
    body =
      body +
      '<button class="text-capitalize add_btn"  data-toggle="modal" onClick="initRisk()" data-target="#risk_modal">' +
      '<i class="fa fa-plus"></i>' +
      "</button>";
  }
  body =
    body +
    "</div>" +
    '<ul class="risk_list">' +
    risksString +
    "</ul>" +
    "</div>";

  document.getElementById("ssRisksBenefits").innerHTML = body;
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
}

function adescid(ss) {
  return "adesc-" + ss;
}

function addSSAction(ss, len) {
  var desc, who, when;
  desc = "<< new action " + len + " >>";
  who = "";
  when = "";
  document.getElementById("imstatus").innerHTML =
    "Adding action to action plan...";
  $.ajax({
    url:
      "add-ss-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&action=" +
      encodeURIComponent(desc) +
      "&who=" +
      encodeURIComponent(who) +
      "&when=" +
      encodeURIComponent(when),
    type: "POST",
    success: apUpdated,
    error: imOpFailed
    //,datatype: "json"
  });
}

function deleteSSActionInternal(ss, action) {
  document.getElementById("imstatus").innerHTML =
    "Deleting action from action plan...";
  $.ajax({
    url:
      "delete-ss-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&action=" +
      action,
    type: "POST",
    success: apUpdated,
    error: imOpFailed
    //,datatype: "json"
  });
}

function deleteSSAction(ss, action) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this action now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteSSActionInternal(ss, action);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteSSActionInternal(ss, action);
}

// this will always be from the logged in user...
function addSSActionComment(ss, action) {
  document.getElementById("vestatus").innerHTML = "Adding comment to action...";
  $.ajax({
    url:
      "add-action-comment.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&action=" +
      action +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      ss +
      "&comment=" +
      encodeURIComponent(
        document.getElementById("acomment-" + ss + "-" + action).value
      ),
    type: "POST",
    success: veUpdated,
    error: veOpFailed
    //,datatype: "json"
  });
}

function addSSActionPercent(ss, action) {
  document.getElementById("vestatus").innerHTML =
    "Adding percentage complete to action...";
  $.ajax({
    url:
      "add-action-progress.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&action=" +
      action +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      ss +
      "&percent=" +
      encodeURIComponent(
        document.getElementById("percent-" + ss + "-" + action).value
      ),
    type: "POST",
    success: veUpdated,
    error: veOpFailed
    //,datatype: "json"
  });
}

function setCompleted(ss, action) {
  document.getElementById("vestatus").innerHTML =
    "Setting  action completed...";

  // if a date is set, use it; otherwise it will be today's date...
  if (
    document.getElementById("complete-" + ss + "-" + action).value.valueOf() ==
    "".valueOf()
  ) {
    $.ajax({
      url:
        "set-action-complete.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss +
        "&action=" +
        action,
      type: "POST",
      success: veUpdated,
      error: veOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "set-action-complete.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&action=" +
        action +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss +
        "&date=" +
        encodeURIComponent(
          document.getElementById("complete-" + ss + "-" + action).value
        ),
      type: "POST",
      success: veUpdated,
      error: veOpFailed
      //,datatype: "json"
    });
  }
}

function upSSActionInternal(ss, action, source) {
  $.ajax({
    url:
      "swap-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      encodeURIComponent(ss) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(source - 1),
    type: "POST",
    success: apUpdated,
    error: imOpFailed
    //,datatype: "json"
  });
}

function upSSAction(ss, action, source) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this action up!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            upSSActionInternal(ss, action, source);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else upSSActionInternal(ss, action, source);
}

function downSSActionInternal(ss, action, source) {
  $.ajax({
    url:
      "swap-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      encodeURIComponent(ss) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(source + 1),
    type: "POST",
    success: apUpdated,
    error: imOpFailed
    //,datatype: "json"
  });
}

function downSSAction(ss, action, source) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you move this action down!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            downSSActionInternal(ss, action, source);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else downSSActionInternal(ss, action, source);
}
/**
 * Implement step content is prepared
 */
function refreshImStep() {
  imstring = implementStepContents();
  document.getElementById("Implement-body").innerHTML = imstring;
  if (GcurrentSS != -1) {
    refreshSS_ED_Actions();
    $(".strategy_stat_wrap").removeClass("selected_strategy");
    $(this).addClass("selected_strategy");
    $(".action_head").addClass("d-block");
  }
  restoreSSPageState();
  $(".stat_count").click(function() {
    var elements = this.id.split("-");
    GcurrentSS = parseInt(elements[1]);
    let ratOpn = localStorage.getItem("toggleId");
    if ("implementDropDown" + GcurrentSS == ratOpn) {
      if ($("#" + ratOpn).css("visibility") == "hidden") {
        $("#" + ratOpn).css("visibility", "hidden");
      } else $("#" + ratOpn).css("visibility", "visible");
    } else {
      $(".verifydropdown").css("visibility", "hidden");
    }
    let ssObjectJSON = $(this).attr("ssObject");
    let ssObject = JSON.parse(ssObjectJSON);
    GCurrentSSDropped = false;
    GCurrentSSComplete = false;
    if (ssObject.ssdropped == "1") {
      GCurrentSSDropped = true;
    }
    if (ssObject.sscomplete == "1") {
      GCurrentSSComplete = true;
    }

    refreshSS_ED_Actions();
    $(".strategy_stat_wrap").removeClass("selected_strategy");
    $(this)
      .closest(".strategy_stat_wrap")
      .addClass("selected_strategy");
    $(".action_info_block").hide();
    $(".action_head").addClass("d-block");
  });

  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  OverlayScrollbars(document.getElementById("left-panel"), {
    className: "os-theme-dark deviant-scrollbars"
  });
}

var chartObjects = [];

function refreshVCharts() {
  // try rendering the chart with made up data to verify rendering works...
  // alert("got here");
  for (var i = 0; i < chartObjects.length; i++) {
    // alert("got here 2 ss=" + chartObjects[i]);
    var oentry = findSSEntry(chartObjects[i]);
    var actualSavings = oentry[13];
    // if (actualSavings.length == 0)
    // {
    // 	document.getElementById("chartContainer-"+chartObjects[i]).innerHTML = "No realized savings data for this strategy statement";
    // 	continue;
    // }

    var maxVal = -1,
      minVal = 1000000000,
      graphData = [];
    for (var j = 0; j < actualSavings.length; j++) {
      var val = actualSavings[j][0];
      // alert("number: " + j + " value: " + val);
      if (typeof val == "string") val = parseFloat(val);
      if (val > maxVal) {
        maxVal = val;
      }
      if (val < minVal) minVal = val;
      var dd = actualSavings[j][1];
      var elements = dd.split("-");
      var year = parseInt(elements[0]);
      var month = parseInt(elements[1]);
      var day = parseInt(elements[2]);
      graphData.push({
        x: new Date(year, month, day),
        y: val
      });
    }
    var minD = actualSavings[0][1];
    var minElements = minD.split("-");
    var minDate = new Date(
      parseInt(minElements[0]),
      parseInt(minElements[1]),
      parseInt(minElements[2])
    );
  }
}
/**
 * Verify step content is prepared
 */
function refreshVStep() {
  document.getElementById("Verify-body").innerHTML = verifyStepContents();
  $(".strategy_stat_wrap").click(function() {
    //
    var elements = this.id.split("-");
    GcurrentSS = parseInt(elements[1]);
    let ratOpn = localStorage.getItem("toggleId");
    if ("implementDropDown" + GcurrentSS == ratOpn) {
      if ($("#" + ratOpn).css("visibility") == "hidden") {
        $("#" + ratOpn).css("visibility", "hidden");
      } else $("#" + ratOpn).css("visibility", "visible");
    } else {
      $(".verifydropdown").css("visibility", "hidden");
    }
    updateVerifyActions();
    $(".strategy_stat_wrap").removeClass("selected_strategy");
    $(this).addClass("selected_strategy");
    $(".action_info_block").hide();
    $(".action_head").addClass("d-block");
  });

  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  OverlayScrollbars(document.getElementById("left-panel"), {
    className: "os-theme-dark deviant-scrollbars"
  });

  // refreshVCharts();
}

function completeSS() {
  let allStrategies = Gcurrentdata[Grbindex];
  let currentStrategy = allStrategies.filter(function(strategies) {
    return strategies[0] == GcurrentSS;
  });
  let actions = currentStrategy[0][6];
  let completed = 0;
  for (var key in actions) {
    if (actions[key][5] !== "" || actions[key][10] == 1) {
      completed++;
    }
  }
  if (completed === actions.length) {
    var ssData = {
      token: Gtoken,
      username: Gusername,
      currentSS: GcurrentSS
    };
    $.ajax({
      url: "completeSS.php",
      type: "POST",
      data: {
        data: JSON.stringify(ssData)
      },
      success: updateVerifyContents,
      error: progOpFailed
    });
  } else {
    showTimedMessage(
      "gmsg",
      actions.length -
        completed +
        " action items for this strategy statement are not completed. Please complete/drop them first",
      0,
      true
    );
  }
}

function updateVerifyActions() {
  let loggedinuser = localStorage.getItem("Gpnid");
  var body = "";
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    var currentProjectStrategies = oentry[6];
    var ssOwnerId = oentry[19];
    if (oentry[0] == GcurrentSS) {
      if (
        currentProjectStrategies == null ||
        currentProjectStrategies.length == 0
      ) {
        body = body + "No actions for this strategy statement!";
        break;
      }
      document.getElementById("vactionsheader").innerHTML = "";
      for (j = 0; j < currentProjectStrategies.length; j++) {
        var completed = false;
        var currentStrategy = currentProjectStrategies[j];
        var ssObject = {
          ssid: oentry[0],
          sscomplete: oentry[14],
          ssdropped: oentry[21],
          ssunimplement: oentry[31]
        };
        ssObject = JSON.stringify(ssObject);
        var actionid = currentStrategy;
        var atext = currentStrategy[1];
        var adead = currentStrategy[2];
        var awho = currentStrategy[3];
        var dropped = currentStrategy[10] === "0" ? false : true;
        var droppedComment = currentStrategy[11];
        awho = awho.split(",");
        let owners;
        let ownersHtml = "";
        for (var iii = 0; iii < awho.length; iii++) {
          owners = generateProfileIconFromId(awho[iii], "owner_count");
          ownersHtml += owners;
        }
        //
        //
        for (i = 0; i <= awho.length; i++) {
          ownersid = awho[i];
          //
        }
        //
        //
        var acomplete = currentStrategy[5];
        var label = "" + (j + 1);
        body =
          body +
          '<div class="action_stat_wrap" id="action_1"> ' +
          '<section class="new_action_stat_wrap"> ' +
          '<div class="head">' +
          '<span class="stat_subcount">' +
          label +
          " " +
          atext +
          "</span> " +
          "</div>" +
          '<div class="clearfix">' +
          '<ul class="info_option_wrp stat_action pull-left">' +
          "<li> " +
          '<div class="item total_bc_value">' +
          '<h6 class="title">Target Date </h6>' +
          getPrintDate(adead) +
          "</div>" +
          "</li>" +
          "";

        let actionOwnerButton = "";
        //
        //

        for (i = 0; i <= awho.length; i++) {
          ownersid = awho[i];
          //
          //
          if (loggedinuser == ownersid) {
            actionOwnerButton += `<button class="text-capitalize add_btn pull-right" onClick='addEDProgressNote( ${i},${j}, ${ssObject})'>
        <i class="fa fa-plus"></i>
      </button>`;
          }
        }
        if (Gadmin == 1 || loggedinuser == ssOwnerId) {
          actionOwnerButton += `<button class="text-capitalize add_btn pull-right" onClick='addEDProgressNote( ${i},${j}, ${ssObject})'>
        <i class="fa fa-plus"></i>
      </button>`;
        }

        var lastProg = "",
          lastUpdate = "";

        if (currentStrategy[7] != null) {
          var len = currentStrategy[7].length;

          if (len > 0) {
            lastProg =
              currentStrategy[7][len - 1][1] > 0
                ? currentStrategy[7][len - 1][1] + "%"
                : "Dropped";
            lastUpdate = currentStrategy[7][len - 1][4];
          }
        }
        body = body + "<li> ";
        if (acomplete.valueOf() == "".valueOf()) {
          body =
            body +
            '<div class="item total_bc_value">' +
            '<h6 class="title">Last Updated </h6>' +
            getPrintDate(lastUpdate) +
            "</div>";
        } else {
          completed = true;
          body =
            body +
            '<div class="item total_bc_value">' +
            '<h6 class="title">Completion Date </h6>' +
            getPrintDate(acomplete) +
            "</div>";
        }
        if (completed) {
          actionStatusClass = "success";
          actionStatus = "Completed";
        } else if (dropped) {
          actionStatusClass = "danger";
          actionStatus = "Dropped";
        } else {
          actionStatusClass = "warning";
          actionStatus = "Pending";
        }
        body =
          body +
          `</li>
          </ul>
          <ul class="info_option_wrp stat_action pull-right">
          <li> 
          <div class="item text-right total_bc_value">
          <h6 class="title">Progress </h6>
          ${lastProg} 
          </div>
          </li>
          <li>
          <div class="item owner_items">
          <h6 class="title">Owners </h6>
          ${ownersHtml} 
          </div> 
          </li>
          </ul>
          <div class='clearfix'></div>
          <div>
            <span class='action-status action-status-${actionStatusClass}'>${actionStatus}</span>
          </div> 
          </div> 
          </section> 
          <div class="progress_note_wrp">
          <div class="progress_note_head">
          <span class="show_pro_note_opt" onClick="toggleProgNotes($(this))">Show progress notes <i class="fa fa-angle-down" aria-hidden="true"></i> </span>    
          
           ${actionOwnerButton}`;

        body +=
          "</div>" +
          '<div class="pronote_dropdown_wrp" hidden>' +
          '<table class="pronote_dropdown strategic_opt_list">' +
          "<thead> <tr>" +
          '<th width="20%">Date of Update</th>' +
          '<th width="40%">Note</th>' +
          '<th width="15%">Progress </th>' +
          '<th width="20%">Updated by </th>' +
          '<th width="5%"> </th>' +
          "</tr></thead><tbody>";
        //
        if (currentStrategy[7] != null) {
          // progress notes for this action...
          for (var k = currentStrategy[7].length - 1; k >= 0; k--) {
            var progress = currentStrategy[7][k];
            var owner = progress[2];
            ownersHtml = generateProfileIconFromId(owner);
            var progressText = progress[1] > 0 ? progress[1] + "%" : "dropped";
            var comment = progress[3];
            if (comment == "") comment = "No notes available!!";
            var update = progress[4];

            body =
              body +
              "<tr>" +
              "<td>" +
              '<span class="updatedate">' +
              getPrintDate(update) +
              "</span>" +
              "</td>" +
              '<td><p class="updatenote">' +
              comment +
              "</p></td>" +
              '<td> <span class="update_progress">' +
              progressText +
              " </span> </td>" +
              "<td>" +
              '<div class="item owner_items update_by">' +
              ownersHtml +
              "</div>" +
              "</td>" +
              "<td>" +
              "</td>" +
              "</tr>";
          }
        }
        body = body + "</tbody></table>" + "</div>" + "</div>" + "</div>";
      }
      break;
    }
  }
  document.getElementById("verifyActions").innerHTML = body;
}

function getActionOwners(actions) {
  let performers = [];
  let indiPerformers = "";
  for (var i = 0; i < actions.length; i++) {
    if (actions[i][3] === undefined) continue;
    indiPerformers += actions[i][3] + ",";
  }
  indiPerformers = indiPerformers.slice(0, -1);
  performers = [...new Set(indiPerformers.split(","))];
  return performers;
}

function refreshEStep() {
  var estring = "<h4>Old School Contents</h4> TBD" + injectModals();
  document.getElementById("econtent").innerHTML = estring;
}

function clearAllStrategyDisplay() {}

function getProjectCurrency() {
  if (Gcurrentdata[2] != null && Gcurrentdata[2].length >= 2)
    return Gcurrentdata[2][1];
  return "USD";
}
var prCurr;

var changedObjects = [];

function changedObjectP(id) {
  for (var i = 0; i < changedObjects.length; i++)
    if (changedObjects[i].valueOf() == id.valueOf()) return i;
  return -1;
}

function addChangedObject(id) {
  if (changedObjectP(id) == -1) changedObjects.push(id);
}

function removeChangedObject(id) {
  var i = changedObjectP(id);
  if (i != -1) changedObjects.splice(i, 1);
}

function removeChanged(str) {
  var i = str.search("changed");
  if (i >= 0) return str.substring(0, i - 1);
  return str;
}

function fixTextClass(id) {
  if (
    document.getElementById(id).value.valueOf() ==
    document.getElementById(id).defaultValue.valueOf()
  ) {
    document.getElementById(id).className = removeChanged(
      document.getElementById(id).className
    );
    removeChangedObject(id);
  } else {
    document.getElementById(id).className += " changed";
    addChangedObject(id);
  }
}

function getOldSelectValue(id) {
  for (var i = 0; i < oldSelectValues.length; i++)
    if (oldSelectValues[i][0].valueOf() == id.valueOf())
      return oldSelectValues[i][1];
  return "";
}

function setOldSelectValue(id, val) {
  for (var i = 0; i < oldSelectValues.length; i++) {
    if (oldSelectValues[i][0].valueOf() == id.valueOf()) {
      // this case should never occur...
      oldSelectValues[i][1] = val;
      return;
    }
  }
  oldSelectValues.push([id, val]);
}

function getOldCheckBoxValue(id) {
  for (var i = 0; i < oldCheckBoxValues.length; i++) {
    if (oldCheckBoxValues[i][0].valueOf() == id.valueOf()) {
      return oldCheckBoxValues[i][1];
    }
  }
  return "";
}

function setOldCheckBoxValue(id, val) {
  for (var i = 0; i < oldCheckBoxValues.length; i++) {
    if (oldCheckBoxValues[i][0].valueOf() == id.valueOf()) {
      // this case should never occur...
      oldCheckBoxValues[i][1] = val;
      return;
    }
  }
  oldCheckBoxValues.push([id, val]);
}

function fixSelRowClass(prefixes, row) {
  var anyItemChanged = 0;
  // alert("prefixes: " + prefixes + "\n row: " + row);
  for (var i = 0; i < prefixes.length; i++) {
    if (document.getElementById(prefixes[i] + "-" + row) == null) continue;
    if (
      document.getElementById(prefixes[i] + "-" + row).value.valueOf() ==
      getOldSelectValue(prefixes[i] + "-" + row).valueOf()
    ) {
      document.getElementById(
        prefixes[i] + "-" + row
      ).className = removeChanged(
        document.getElementById(prefixes[i] + "-" + row).className
      );
    } else {
      document.getElementById(prefixes[i] + "-" + row).className += " changed";
      addChangedObject("row-" + row);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("row-" + row);
}

// the category remembers why part of the data changed (id is not enough)
function fixSelRowClassWithCat(prefixes, row, cat) {
  var anyItemChanged = 0;
  //alert("prefixes: " + prefixes + "\n row: " + row);
  for (var i = 0; i < prefixes.length; i++) {
    if (document.getElementById(prefixes[i] + "-" + row) == null) continue;
    if (
      document.getElementById(prefixes[i] + "-" + row).value.valueOf() ==
      getOldSelectValue(prefixes[i] + "-" + row).valueOf()
    ) {
      document.getElementById(
        prefixes[i] + "-" + row
      ).className = removeChanged(
        document.getElementById(prefixes[i] + "-" + row).className
      );
    } else {
      document.getElementById(prefixes[i] + "-" + row).className += " changed";
      addChangedObject("row-" + row);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("row-" + row);
}

function fixSelCDClass(prefixes, cenum, drivnum) {
  var anyItemChanged = 0;
  //alert("prefixes: " + prefixes + "\n row: " + row);
  for (var i = 0; i < prefixes.length; i++) {
    //alert (prefixes[i]+"-"+row);
    if (
      document
        .getElementById(prefixes[i] + "-" + cenum + "-" + drivnum)
        .value.valueOf() ==
      getOldSelectValue(prefixes[i] + "-" + cenum + "-" + drivnum).valueOf()
    ) {
      document.getElementById(
        prefixes[i] + "-" + cenum + "-" + drivnum
      ).className = removeChanged(
        document.getElementById(prefixes[i] + "-" + cenum + "-" + drivnum)
          .className
      );
    } else {
      document.getElementById(
        prefixes[i] + "-" + cenum + "-" + drivnum
      ).className += " changed";
      addChangedObject("item-" + cenum + "-" + drivnum);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("item-" + cenum + "-" + drivnum);
}

function fixCheckBoxRowClass(prefixes, row) {
  // alert("prefixes: " + prefixes + " rowdat: " + row);
  var anyItemChanged = 0;
  for (var i = 0; i < prefixes.length; i++) {
    var oldval = getOldCheckBoxValue(prefixes[i] + "-" + row);
    if (
      (document.getElementById(prefixes[i] + "-" + row).checked &&
        oldval.valueOf() == "1".valueOf()) ||
      (!document.getElementById(prefixes[i] + "-" + row).checked &&
        oldval.valueOf() == "0".valueOf())
    ) {
      document.getElementById(
        "cont" + prefixes[i] + "-" + row
      ).className = removeChanged(
        document.getElementById("cont" + prefixes[i] + "-" + row).className
      );
    } else {
      document.getElementById("cont" + prefixes[i] + "-" + row).className +=
        " changedcb";
      addChangedObject("cb-" + row);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("cb-" + row);
}

function fixTextRowClass(prefixes, row) {
  var anyItemChanged = 0;
  // alert("prefixes: " + prefixes + "\n row: " + row);
  for (var i = 0; i < prefixes.length; i++) {
    //alert (prefixes[i]+"-"+row);
    if (document.getElementById(prefixes[i] + "-" + row) == null) continue;
    if (
      document.getElementById(prefixes[i] + "-" + row).value.valueOf() ==
      document.getElementById(prefixes[i] + "-" + row).defaultValue.valueOf()
    ) {
      document.getElementById(
        prefixes[i] + "-" + row
      ).className = removeChanged(
        document.getElementById(prefixes[i] + "-" + row).className
      );
    } else {
      // alert("found a change: " + row);
      document.getElementById(prefixes[i] + "-" + row).className += " changed";
      addChangedObject("row-" + row);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("row-" + row);
}

function fixTextCDClass(prefixes, cenum, drivnum) {
  var anyItemChanged = 0;
  //alert("prefixes: " + prefixes + "\n row: " + row);
  for (var i = 0; i < prefixes.length; i++) {
    //alert (prefixes[i]+"-"+row);
    if (
      document.getElementById(prefixes[i] + "-" + cenum + "-" + drivnum) == null
    )
      continue;
    if (
      document
        .getElementById(prefixes[i] + "-" + cenum + "-" + drivnum)
        .value.valueOf() ==
      document
        .getElementById(prefixes[i] + "-" + cenum + "-" + drivnum)
        .defaultValue.valueOf()
    ) {
      document.getElementById(
        prefixes[i] + "-" + cenum + "-" + drivnum
      ).className = removeChanged(
        document.getElementById(prefixes[i] + "-" + cenum + "-" + drivnum)
          .className
      );
    } else {
      document.getElementById(
        prefixes[i] + "-" + cenum + "-" + drivnum
      ).className += " changed";
      addChangedObject("item-" + cenum + "-" + drivnum);
      anyItemChanged = 1;
    }
  }
  if (anyItemChanged == 0) removeChangedObject("item-" + cenum + "-" + drivnum);
}

function injectPerspectives(goalnum) {
  var res = '<datalist id="perspList">';

  for (var k = 0; k < Gperspectives.length; k++) {
    var selected = "";
    if (goalnum >= 0) {
      if (
        Gperspectives[k].valueOf() ==
        Gcurrentdata[Ggoalsindex][goalnum][1].valueOf()
      )
        selected = " selected ";
    }
    res = res + '<option value="' + Gperspectives[k] + '">';
  }
  res = res + "</datalist>";
  return res;
}
/**
 * Agree step content is prepared
 */
function agreeContents() {
  var rationaleExists = true;
  if (
    Gcurrentdata[Gprimeindex][2] == null ||
    Gcurrentdata[Gprimeindex][2].valueOf() == "".valueOf()
  )
    rationaleExists = false;
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-6 col-md-6 col-sm-6">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Primary Cost</h2>' +
    "</div>" +
    '<div class="pcost_data" id="pcostdata">';
  if (Gadmin == 1) {
    // administrator ONLY
    body =
      body +
      '<button class="text-capitalize more_option opt_btn" onclick="Pcostoption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">                                         ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editPrimaryCost()"> Edit cost </a> </li>' +
      // '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deletepcost($(this))"> Delete cost </a> </li>' +
      "</ul> " +
      "</div>";
  }
  body =
    body +
    '<section onclick="editpcost($(this))">' +
    '<div class="cost_sec pull-left">' +
    '<span class="title">Primary cost</span>' +
    Gcurrentdata[Gprimeindex][0] +
    "</div>" +
    '<div class="amount_sec pull-left">' +
    '<span class="title">Estimated amount</span>' +
    CurrencyFormat(Gcurrentdata[Gprimeindex][1], GdefaultCurrency, 0, "", ",") +
    "</div>" +
    "</section>  " +
    '<div class="clearfix"></div>              ' +
    "</div>" +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Rationale</h2>';
  if (!rationaleExists) {
    if (Gadmin == 1) {
      body =
        body +
        '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openmodal" data-toggle="modal" data-target="#rationale_modal">' +
        '<i class="fa fa-plus" aria-hidden="true"></i> Rationale' +
        "</a>";
    }
  }
  body = body + "</div>" + "";

  if (!rationaleExists) {
    if (Gadmin == 1) {
      body =
        body +
        '<div class="info_block">' +
        '<img src="images/info_icon.png" class="icon_lt"/> Add rationale for choosing this topic as the primary cost to manage' +
        "</div>" +
        "";
    }
  } else {
    body =
      body +
      '<div class="rationale_txt_data">' +
      "<p >" +
      '<div class="replayText" id="rationaleText"> </div>';
    if (Gadmin == 1) {
      body =
        body +
        '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editRationale()"> Edit Rationale </a> </li>' +
        // '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteRationale()"> Delete Rationale </a> </li>' +
        "</ul> " +
        "</div>";
    }
    body = body + "</div>" + "</div>";
  }
  // on to goals...
  body =
    body +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin new">Goals</h2>';
  if (Gadmin == 1) {
    // admin only
    body =
      body +
      '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="opengoalModal" data-toggle="modal" onClick="addEDGoal()" data-target="#goals_modal">' +
      '<i class="fa fa-plus" aria-hidden="true"></i> Goal' +
      "</a>";
  }
  body =
    body +
    "</div>" +
    "<table hidden>" +
    '<tr class="goal_data goaldatacopy" hidden>' +
    "<td>" +
    "Operations" +
    "</td>" +
    "<td>" +
    "Reduce Engineering design time from X months to Y months or less (define for each of the 4 Eng. Activities: integrity, FCP, demolition, PSM) (eg. Setup design office at site, " +
    "speed up retrieval of Eng. Master drawings)" +
    "</td>" +
    "<td>" +
    '<div class="goal_opt">' +
    '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
    '<div class="opt_btn_wrp"> ' +
    '<ul class="other_action">                                         ' +
    '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDGoal(); return false;"> Edit Goal </a> </li>' +
    '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDGoal(); return false;"> Delete Goal </a> </li>' +
    "</ul> " +
    "</div>" +
    "</div>" +
    "</td>" +
    "</tr>" +
    "</table>" +
    '<table class="table goal_table sort_table" id="goaldataClone">' +
    "<thead><tr>" +
    '<th width="16%" class="sorting sortable asc">Perspective</th>' +
    '<th width="80%" class="sortable">Goal </th>' +
    '<th width="4%"></th>' +
    "</tr></thead><tbody>";

  if (
    Gcurrentdata[Ggoalsindex] == null ||
    Gcurrentdata[Ggoalsindex].length == 0
  ) {
    body =
      body +
      '<tr class="no_data_row">' +
      '<td colspan="3">' +
      '<span class="no_data_desc">No goals added yet</span>' +
      "</td>" +
      "</tr>";
  } else {
    for (var i = 0; i < Gcurrentdata[Ggoalsindex].length; i++) {
      body = body + '<TR class="">';
      body = body + "<TD>" + Gcurrentdata[Ggoalsindex][i][1] + "</TD>";
      body = body + "<TD>" + Gcurrentdata[Ggoalsindex][i][0] + "</TD>";
      body = body + "<td>";
      if (Gadmin == 1) {
        body =
          body +
          '<div class="goal_opt">' +
          '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
          '<div class="opt_btn_wrp"> ' +
          '<ul class="other_action">' +
          '<li> <a href="javascript:void(0);" class="mark_edit_cost" onclick="editEDGoal(' +
          i +
          '); return false;"> Edit Goal </a> </li>' +
          '<li><a href="javascript:void(0);" class="mark_del_cost" onclick="deleteEDGoal(' +
          i +
          '); return false;"> Delete Goal </a> </li>' +
          "</ul> " +
          "</div>" +
          "</div>";
      } else body = body + "&nbsp;";
      body = body + "</td>";
      body = body + "</TR>";
    }
  }
  body = body + "</tbody></table>" + "</div>";
  if (Gadmin == 1) {
    // admin only
    body =
      body +
      '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="opengoalModal" data-toggle="modal" onClick="addEDGoal()" data-target="#goals_modal">' +
      '<i class="fa fa-plus" aria-hidden="true"></i> Goal' +
      "</a>";
  }
  body += "</div></div>";
  return body;
}

function refreshAStep() {
  changedObjects = [];
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";
  var agstring =
    "<BR><h4>Old School Contents</h4>" +
    injectModals() +
    "<table class=fancyTable cellpadding=0 cellspacing=0 border=0 width=100%>";
  agstring =
    agstring +
    '<TR class="odd"><TD><b>Primary Cost:</b></TD><TD colspan=2><input oninput="fixTextClass(aprime)"  type=text size=80 onClick="selectAll(aprime)" id="aprime" ' +
    disabled +
    "></TD><TD>&nbsp;</TD></TR>";
  agstring =
    agstring +
    '<TR><TD><TABLE><TR><TD><div id="prcurr"> </div></TD></TR><TR><TD><input oninput="fixTextClass(aestim)" type=text size=40 onClick="selectAll(aestim)" id="aestim"' +
    disabled +
    ">&nbsp;&nbsp;";
  agstring = agstring + "</TD></TR></TABLE></TD>";
  agstring =
    agstring +
    '<TD><TABLE border=0><TR><TD><B>Estimated Acquisition Cost:</B> </TD></TR><TR><TD><input type=text oninput="fixTextClass(acquis-cost)"  size=40 onClick="selectAll(acquis-cost)" id="acquis-cost"' +
    disabled +
    ">&nbsp;&nbsp;";
  agstring = agstring + "</TD></TR></TABLE></TD>";
  agstring =
    agstring +
    '<TD><TABLE><TR><TD><B>Estimated Usage Cost:</B> </TD></TR><TR><TD><input type=text size=40 oninput="fixTextClass(usage-cost)"  onClick="selectAll(usage-cost)" id="usage-cost"' +
    disabled +
    ">&nbsp;&nbsp;";
  agstring = agstring + "</TD></TR></TABLE></TD>";
  agstring =
    agstring +
    '<TD><TABLE><TR><TD><B>Estimated End-of-Life Cost:</B> </TD></TR><TR><TD><input type=text size=40 oninput="fixTextClass(eol-cost)"  onClick="selectAll(eol-cost)" id="eol-cost"' +
    disabled +
    ">&nbsp;&nbsp;";
  agstring = agstring + "</TD></TR></TABLE></TD></TR>";

  agstring =
    agstring +
    '<TR class="odd"><TD colspan=2><B>Estimated Leveragable Spend:</B>&nbsp;&nbsp;<input type=text oninput="fixTextClass(alever)"  size=40 onClick="selectAll(alever)" id="alever"' +
    disabled +
    ">&nbsp;&nbsp;</TD><TD>&nbsp;</TD><TD>&nbsp;</TD></TR>";
  agstring =
    agstring +
    '<TR><TD  colspan=4><TABLE><TR><TD width=100 valign=middle><B>Rationale:</B></TD><TD><textarea rows=3 cols=120  oninput="fixTextClass(arationale)"  onClick="selectAll(arationale)" id="arationale"' +
    disabled +
    "> </textarea></TD></TR></TABLE</TD></TR>";
  //    agstring = agstring + '<TR><TD><div id="primsg"></div></TD><TD colspan=3 align=center><div id="costbuttons"><input type=submit onClick="savePrimaryCost()" class="btn-sm btn-info" value="Save Changes to Worksheet"></div></TD></TR></TABLE>';
  agstring = agstring + "</TABLE>";
  agstring = agstring + refreshGoals();

  agstring = agreeContents();
  document.getElementById("Agree-body").innerHTML = agstring;

  $(".sortable").click(function() {
    var o = $(this).hasClass("asc") ? "desc" : "asc";
    $(".sortable")
      .removeClass("asc")
      .removeClass("desc");
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;
    sort(colIndex, o);
  });
  if (Gcurrentdata[Gprimeindex] != null) {
    bigCost[0] = Gcurrentdata[Gprimeindex][1];
    GdefaultCurrency = Gcurrentdata[2][1];
    if (document.getElementById("rationaleText") != null) {
      document.getElementById("rationaleText").innerHTML =
        Gcurrentdata[Gprimeindex][2];
    }
    prCurr = Gcurrentdata[Gprimeindex][1];
    bigCost[1] = Gcurrentdata[Gprimeindex][5];
    bigCost[2] = Gcurrentdata[Gprimeindex][6];
    bigCost[3] = Gcurrentdata[Gprimeindex][7];
  } else {
    bigCost[0] = 0;
    bigCost[1] = 0;
    bigCost[2] = 0;
    bigCost[3] = 0;
  }
  refreshGoals();

  if (Gadmin == 0) {
  }
}

var activeColor = "#AAFFAA";
var inactiveColor = "#ecCB8f";

function refreshTableOrder() {
  //var value = document.getElementById('allprojects').checked;
  //GallProjects = value;
  if (GallProjects) refreshMyProjects(2);
  else refreshMyProjects(1);
  GsortOrder = document.getElementById("myprojectsorder").value;
}

function sortStrategies() {
  if (document.getElementById("myprojectsorder") == null) return Gstrategies;

  var result = arrayClone(Gstrategies);
  var selection = document.getElementById("myprojectsorder").value;
  if (selection == null) return Gstrategies;
  if (selection.valueOf() == "Sort By Creation Date".valueOf()) return result;

  if (selection.valueOf() == "Sort By Project Name".valueOf()) {
    for (var i = 0; i < result.length; i++) {
      for (var j = i + 1; j < result.length; j++) {
        if (result[i][4].valueOf() > result[j][4].valueOf()) {
          var temp = result[i];
          result[i] = result[j];
          result[j] = temp;
        }
      }
    }
    return result;
  }

  if (selection.valueOf() == "Sort By Company Name".valueOf()) {
    for (var i = 0; i < result.length; i++) {
      for (var j = i + 1; j < result.length; j++) {
        if (result[i][1][1].valueOf() > result[j][1][1].valueOf()) {
          var temp = result[i];
          result[i] = result[j];
          result[j] = temp;
        }
      }
    }
    return result;
  }

  if (selection.valueOf() == "Sort By Contract Value".valueOf()) {
    for (var i = 0; i < result.length; i++) {
      for (var j = i + 1; j < result.length; j++) {
        if (parseFloat(result[i][6][0]) > parseFloat(result[j][6][0])) {
          var temp = result[i];
          result[i] = result[j];
          result[j] = temp;
        }
      }
    }
    return result;
  }

  return result;
}

function getBUNameFromProject(sid) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (sid == Gstrategies[i][0]) {
      return Gstrategies[i][3][1];
    }
  }
  return "??";
}

function getStrategyName(s) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == s) {
      return Gstrategies[i][4];
    }
  }
  return "";
}

function getProjectEntry(s) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == s) {
      return Gstrategies[i];
    }
  }
  return [];
}

function strategiesTable(val) {
  var tabstring =
    '<div style="width: 100%; height: 600px;"><table class="fancyTable" cellpadding=2 cellspacing=2 id="myprojects" width=100%>';
  tabstring =
    tabstring +
    "<thead><TR><TH>Open</TH><TH>Project name</TH><TH>Company name</TH><TH>Business unit</TH><TH>Description</TH><TH>Create date</TH><TH>Value of contract</TH><TH>Supplier(s)</TH></TR></thead><tbody>";
  result = sortStrategies();
  for (var i = 0; i < result.length; i++) {
    // decide whether to show this project or not...
    var active = result[i][GstatusIndex];
    var color = activeColor;
    // alert("active val: " + active);
    if (active.valueOf() == "INACTIVE".valueOf()) {
      if (val == 1)
        // means show ONLY active projects
        continue;
      color = inactiveColor;
    }

    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + ">";
    tabstring = tabstring + "<TD align=center>";
    var selected = "";

    if (Gcurrentstrategy != null && Gcurrentstrategy == result[i][0])
      selected = " checked ";
    tabstring =
      tabstring +
      '<input type=radio id="selstrategy" name="selstrategy" onClick="selectStrategy(' +
      result[i][0] +
      ')" ' +
      selected +
      " ></TD>";
    if (color == inactiveColor)
      tabstring =
        tabstring +
        '<TD><span style="color: darkblue; background-color: ' +
        color +
        ';">' +
        result[i][4] +
        "</span></TD>";
    else tabstring = tabstring + "<TD>" + result[i][4] + "</TD>";
    tabstring = tabstring + "<TD>" + result[i][1][1] + "</TD>";
    // tabstring = tabstring + '<TD>' + result[i][2] + '</TD>';
    tabstring = tabstring + "<TD>" + result[i][3][1] + "</TD>";
    tabstring = tabstring + "<TD>" + result[i][5] + "</TD>";
    tabstring = tabstring + "<TD>" + result[i][8] + "</TD>";
    if (result[i][6] != null && result[i][6].length > 1) {
      var curr = CurrencyFormat(result[i][6][0], result[i][6][1], 0, "", ",");
      tabstring = tabstring + "<TD>" + curr + "</TD>";
    } else tabstring = tabstring + "<TD> &nbsp;</TD>";
    tabstring = tabstring + "<TD>";
    if (result[i][9] != null) {
      for (var j = 0; j < result[i][9].length; j++)
        tabstring = tabstring + result[i][9][j][1] + "<br>";
    }
    tabstring = tabstring + "</TD></TR>";
  }
  tabstring = tabstring + "</tbody></table></div>";

  return tabstring;
}

function getAnklesaria() {
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][1].valueOf().search("Anklesaria") >= 0)
      return Gcompanies[i][0];
  }
  return -1;
}
/**
 * Get participants of a project based on project id
 * @param {number} s - Project Id
 */
function getTeamParticipants(s) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if ((Gstrategies[i][0] + "").valueOf() == (s + "").valueOf()) {
      var participants = [];
      if (Gstrategies[i][10] != null) {
        for (var m = 0; m < Gstrategies[i][10].length; m++) {
          participants.push([
            Gstrategies[i][10][m][0],
            Gstrategies[i][10][m][1]
          ]);
        }
      }
      return participants;
    }
  }
  return [];
}

function getPotentialTeamMembers(strategy) {
  var personsCMS = [];
  var personsCompany = [];
  var personsSupplier = [];
  var company = strategy[1][0];
  var supplier = "";
  var ankle = getAnklesaria();
  var persons = [];

  if (strategy[9] != null && strategy[9].valueOf() != "".valueOf())
    supplier = strategy[9][0][0];
  // if (supplier != "") alert("supplier found: " + supplier);

  for (var i = 0; i < Gpersons[1].length; i++) {
    var p = Gpersons[1][i];
    var emp = Gpersons[1][i][8];

    if (emp + "" == supplier + "")
      personsSupplier.push([
        p[0],
        getPersonName(p[0]),
        supplier,
        getCompanyName(supplier)
      ]);
    else if (emp == company)
      personsCompany.push([
        p[0],
        getPersonName(p[0]),
        company,
        getCompanyName(company)
      ]);
    else if (emp == ankle)
      personsCMS.push([
        p[0],
        getPersonName(p[0]),
        ankle,
        getCompanyName(ankle)
      ]);
  }

  for (var i = 0; i < personsCMS.length; i++) {
    for (var j = i + 1; j < personsCMS.length; j++) {
      if (personsCMS[i][1] > personsCMS[j][1]) {
        var temp = personsCMS[j];
        personsCMS[j] = personsCMS[i];
        personsCMS[i] = temp;
      }
    }
  }

  for (var i = 0; i < personsCompany.length; i++) {
    for (var j = i + 1; j < personsCompany.length; j++) {
      if (personsCompany[i][1] > personsCompany[j][1]) {
        var temp = personsCompany[j];
        personsCompany[j] = personsCompany[i];
        personsCompany[i] = temp;
      }
    }
  }
  // alert("supplier employees: " + personsSupplier);
  for (var i = 0; i < personsSupplier.length; i++) {
    for (var j = i + 1; j < personsSupplier.length; j++) {
      if (personsSupplier[i][1] > personsSupplier[j][1]) {
        var temp = personsSupplier[j];
        personsSupplier[j] = personsSupplier[i];
        personsSupplier[i] = temp;
      }
    }
  }
  for (var i = 0; i < personsCompany.length; i++) {
    persons.push(personsCompany[i]);
  }
  for (var i = 0; i < personsSupplier.length; i++) {
    persons.push(personsSupplier[i]);
  }
  for (var i = 0; i < personsCMS.length; i++) {
    persons.push(personsCMS[i]);
  }

  return persons;
}

/**
 * Team panel for a particular project
 * @param {number} i - Project Id
 */
function refreshTeamArea(i) {
  var teamstring =
    "<table class=fancyTable cellpadding=1 cellspacing=1 border=1 width=100%>";
  teamstring =
    teamstring +
    "<tr><th align=center>Select</th><th align=center>Participant Name</th><th>Role</th></tr>";
  if (Gstrategies[i][10] != null) {
    for (var m = 0; m < Gstrategies[i][10].length; m++) {
      teamstring =
        teamstring +
        '<TR><TD align=center width=100 align=center><input type=radio name=teamsel id=teamsel value="' +
        Gstrategies[i][10][m][0] +
        '"></TD><TD>' +
        getPersonName(Gstrategies[i][10][m][0]) +
        "</TD>" +
        "<TD>" +
        Gstrategies[i][10][m][1] +
        "</TD></TR>";
    }
  }
  var teamsters = getPotentialTeamMembers(Gstrategies[i]);
  teamstring =
    teamstring + "<TR><TD>&nbsp;</TD><TD><select id=selperson width=60>";
  for (var n = 0; n < teamsters.length; n++)
    teamstring =
      teamstring +
      '<option value="' +
      teamsters[n][0] +
      '">' +
      teamsters[n][1] +
      "  (" +
      teamsters[n][3] +
      ")</option>";
  teamstring = teamstring + "</select></TD><TD><select id=selrole>";
  teamstring = teamstring + "<option value=MEMBER>MEMBER</OPTION>";
  teamstring = teamstring + "<option value=LEADER>LEADER</OPTION>";
  teamstring = teamstring + "<option value=FACILITATOR>FACILITATOR</OPTION>";
  teamstring = teamstring + "</select></TD></TR>";
  teamstring = teamstring + "<TR><TD align=center colspan=3>";
  teamstring =
    teamstring +
    '<input type=submit value="Add Participant" onClick="addMember()"> &nbsp;&nbsp&nbsp;&nbsp;';
  teamstring =
    teamstring +
    '<input type=submit value="Remove Participant" onClick="removeMember()"> &nbsp;&nbsp';
  teamstring = teamstring + "</TD></TR></TABLE>";
  document.getElementById("teamers").innerHTML = teamstring;
}

function refreshSupplierArea(i) {
  var supstring =
    "<TABLE class=fancyTable cellpadding=1 cellspacing=1 border=1 width=100%>";
  supstring =
    supstring +
    "<TR><TH align=centerwidth=60>Select<TH align=center>Participating Supplier Company</TH></TR>";
  if (Gstrategies[i][9] != null) {
    for (var n = 0; n < Gstrategies[i][9].length; n++) {
      supstring =
        supstring +
        '<TR><TD align=center><input type=radio id=supselect name=supselect value="';
      supstring = supstring + Gstrategies[i][9][n][0] + '"></TD>';
      supstring = supstring + "<TD>" + Gstrategies[i][9][n][1] + "</TD></TR>";
    }
  }
  supstring = supstring + "<TR><TD>&nbsp;</TD><TD>";
  supstring = supstring + "<select id=stratsup>";
  for (var i = 0; i < Gcompanies.length; i++)
    if (Gcompanies[i].length >= 7)
      // then it is a supplier...
      supstring =
        supstring +
        "<option value=" +
        Gcompanies[i][0] +
        ">" +
        Gcompanies[i][1] +
        "</option>";
  supstring = supstring + "</select></TD></TR>";
  supstring = supstring + "<TR><TD colspan=2 align=center>";
  supstring =
    supstring +
    '<input type=submit value="Add Supplier" onClick="addSupplier()">&nbsp;&nbsp&nbsp;&nbsp;';
  supstring =
    supstring +
    '<input type=submit value="Remove Supplier" onClick="removeSupplier()">';
  supstring = supstring + "</TD></TR></TABLE>";
  document.getElementById("teamsups").innerHTML = supstring;
}

function editStrategy(s) {
  selectedAdminStrategy = s;
  for (var i = 0; i < Gstrategies.length; i++) {
    if ((s + "").valueOf() == (Gstrategies[i][0] + "").valueOf()) {
      refreshTeamArea(i);
      refreshSupplierArea(i);
      return;
    }
  }
}

function refreshTeam(response) {
  Gstrategies = JSON.parse(response);

  for (var i = 0; i < Gstrategies.length; i++) {
    GmyProjectsBody = strategiesTable(1);
    GeditProjectsBody = strategiesTableAdmin();
    GeditTeamsBody = teamTableAdmin();
    if (
      (selectedAdminStrategy + "").valueOf() ==
      (Gstrategies[i][0] + "").valueOf()
    ) {
      refreshTeamArea(i);
      refreshSupplierArea(i);
    }
  }
  showTimedMessage("stratstat", "Team / suppliers updated...", 5000, false);
}

function addMember() {
  if (
    selectedAdminStrategy == null ||
    selectedAdminStrategy.valueOf() == "".valueOf()
  ) {
    document.getElementById("supteamstat").innerHTML =
      "Please select a project to add members to";
    return;
  }
  document.getElementById("supteamstat").innerHTML =
    "Adding new participant  ...";
  var strategy = selectedAdminStrategy;
  var person = document.getElementById("selperson").value;
  var role = document.getElementById("selrole").value;
  strategyStatusArea = "supteamstat";
  $.ajax({
    url:
      "add-participant.php?project=" +
      encodeURIComponent(strategy) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(strategy)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(strategy)) +
      "&person=" +
      encodeURIComponent(person) +
      "&role=" +
      encodeURIComponent(role) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategies,
    error: teamOpFailed
    //,datatype: "json"
  });
}

function removeMember() {
  if (
    selectedAdminStrategy == null ||
    selectedAdminStrategy.valueOf() == "".valueOf()
  ) {
    document.getElementById("supteamstat").innerHTML =
      "Please select a project to add members to";
    return;
  }
  var strategy = selectedAdminStrategy;
  var person = getSelectedRadioValue("teamsel");
  document.getElementById("supteamstat").innerHTML =
    "Removing participant  ...";
  strategyStatusArea = "supteamstat";
  $.ajax({
    url:
      "remove-participant.php?project=" +
      encodeURIComponent(strategy) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(strategy)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(strategy)) +
      "&person=" +
      encodeURIComponent(person) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategies,
    error: teamOpFailed
    //,datatype: "json"
  });
}

function addSupplier() {
  if (
    selectedAdminStrategy == null ||
    selectedAdminStrategy.valueOf() == "".valueOf()
  ) {
    document.getElementById("supteamstat").innerHTML =
      "Please select a project to add members to";
    return;
  }
  document.getElementById("supteamstat").innerHTML =
    "Adding supplier to team  ...";
  var strategy = selectedAdminStrategy;
  var company = document.getElementById("stratsup").value;
  strategyStatusArea = "supteamstat";
  $.ajax({
    url:
      "add-supplier.php?project=" +
      encodeURIComponent(strategy) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(strategy)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(strategy)) +
      "&supplier=" +
      encodeURIComponent(company) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategies,
    error: teamOpFailed
    //,datatype: "json"
  });
}

function removeSupplier() {
  if (
    selectedAdminStrategy == null ||
    selectedAdminStrategy.valueOf() == "".valueOf()
  ) {
    document.getElementById("supteamstat").innerHTML =
      "Please select a project to add members to";
    return;
  }
  document.getElementById("supteamstat").innerHTML =
    "Removing supplier from team  ...";
  var strategy = selectedAdminStrategy;
  var company = getSelectedRadioValue("supselect");
  strategyStatusArea = "supteamstat";
  $.ajax({
    url:
      "remove-supplier.php?project=" +
      encodeURIComponent(strategy) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(strategy)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(strategy)) +
      "&supplier=" +
      encodeURIComponent(company) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategies,
    error: teamOpFailed
    //,datatype: "json"
  });
}

var issuingPage = "";

function refreshStrategiesLocal() {
  GmyProjectsBody = strategiesTable(1);
  GeditProjectsBody = strategiesTableAdmin();
  GeditTeamsBody = teamTableAdmin();

  if (issuingPage.valueOf() == "project-edit-page".valueOf()) {
    issuingPage = "";
    return;
  }
  if (selectedAdminStrategy != null) {
    setSelectedRadio("stratsel", selectedAdminStrategy);
    editStrategy(selectedAdminStrategy); // make display current for this strategy...
  }
}

function refreshStrategies(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("stratstat", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  refreshStrategiesLocal();
  showTimedMessage(
    strategyStatusArea,
    "Project data successfully refreshed",
    5000,
    false
  );
}

var strategyStatusArea;

function updateStrategies(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      strategyStatusArea,
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-projects-for-user.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshStrategies,
      error: strategyOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage(strategyStatusArea, res[1], 0, true);
  }
}

function addStrategyInternal() {
  var name = document.getElementById("stratname").value;
  var comp = document.getElementById("stratcomp").value;
  var proj = document.getElementById("stratproj").value;
  var desc = document.getElementById("stratdesc").value;
  var save = extractNumber(document.getElementById("stratpot").value);
  var curr = document.getElementById("stcurr").value;
  if (
    name.valueOf() == "".valueOf() ||
    comp.valueOf() == "".valueOf() ||
    proj.valueOf() == "".valueOf() ||
    desc.valueOf() == "".valueOf() ||
    save.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "stratstat",
      "All project attributes must be provided!",
      0,
      true
    );
    return;
  }

  document.getElementById("stratstat").innerHTML = "Adding new project ...";
  strategyStatusArea = "stratstat";
  issuingPage = "project-edit-page";
  $.ajax({
    url:
      "add-project.php?pn=" +
      encodeURIComponent(name) +
      "&bu=" +
      encodeURIComponent(proj) +
      "&company=" +
      encodeURIComponent(comp) +
      "&desc=" +
      encodeURIComponent(desc) +
      "&savings=" +
      encodeURIComponent(save) +
      "&curr=" +
      encodeURIComponent(curr) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategies,
    error: strategyOpFailed
    //,datatype: "json"
  });
}

function addStrategy() {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a new project now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addStrategyInternal();
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addStrategyInternal();
}

function saveAllProjects() {
  if (changedObjects.length == 0) {
    myAlert("Attention!", "There are no changes to save!", "error");
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var items = changedObjects[i].split("-");
    var obj = items[1];
    obj = parseInt(obj);
    if (i < changedObjects.length - 1) setTimeout(saveStrategy(obj, 0), 1000);
    else setTimeout(saveStrategy(obj, 1), 1000);
  }
}

function saveStrategy(id, update) {
  var name = document.getElementById("stname-" + id).value;
  var comp = document.getElementById("stcomp-" + id).value;
  var proj = document.getElementById("projsel-" + id).value;
  var desc = document.getElementById("stdesc-" + id).value;
  var save = extractNumber(document.getElementById("stsave-" + id).value);
  var curr = document.getElementById("stcurr-" + id).value;
  if (
    name.valueOf() == "".valueOf() ||
    comp.valueOf() == "".valueOf() ||
    proj.valueOf() == "".valueOf() ||
    desc.valueOf() == "".valueOf() ||
    save.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "stratstat",
      "All project attributes must be provided!",
      0,
      true
    );
    return;
  }

  document.getElementById("stratstat").innerHTML = "Saving project ...";
  strategyStatusArea = "stratstat";
  issuingPage = "project-edit-page";
  if (update == 1) {
    $.ajax({
      url:
        "save-project.php?sn=" +
        encodeURIComponent(name) +
        "&desc=" +
        encodeURIComponent(desc) +
        "&savings=" +
        encodeURIComponent(save) +
        "&obj=" +
        encodeURIComponent(id) +
        "&company=" +
        getCompanyForProject(id) +
        "&bu=" +
        getBUForProject(id) +
        "&curr=" +
        encodeURIComponent(curr) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateStrategies,
      error: strategyOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-project.php?sn=" +
        encodeURIComponent(name) +
        "&desc=" +
        encodeURIComponent(desc) +
        "&savings=" +
        encodeURIComponent(save) +
        "&obj=" +
        encodeURIComponent(id) +
        "&company=" +
        getCompanyForProject(id) +
        "&bu=" +
        getBUForProject(id) +
        "&curr=" +
        encodeURIComponent(curr) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: showTimedMessage(
        strategyStatusArea,
        "Project updated...",
        0,
        false
      ),
      error: strategyOpFailed
      //,datatype: "json"
    });
  }
}

function createProjectsFor(company) {
  for (var i = 0; i < Gprojects.length; i++) {
    if ((company + "").valueOf() == (Gprojects[i][0] + "").valueOf()) {
      var projstring = '<select  style="width: 140px;" id="stratproj" >';
      for (var j = 2; j < Gprojects[i].length; j++) {
        projstring =
          projstring +
          '<OPTION VALUE="' +
          Gprojects[i][j][0] +
          '">' +
          Gprojects[i][j][1] +
          "</OPTION>";
      }
      projstring = projstring + "</select>";
      return projstring;
    }
  }
}

function createProjectsForId(company, selid, projid) {
  for (var i = 0; i < Gprojects.length; i++) {
    if ((company + "").valueOf() == (Gprojects[i][0] + "").valueOf()) {
      var projstring = '<select id="' + selid + '" >';
      for (var j = 2; j < Gprojects[i].length; j++) {
        var selected = "";
        if ((projid + "").valueOf() == (Gprojects[i][j][0] + "").valueOf())
          seleected = " selected ";
        projstring =
          projstring +
          '<OPTION VALUE="' +
          Gprojects[i][j][0] +
          '" + ' +
          selected +
          " >" +
          Gprojects[i][j][1] +
          "</OPTION>";
      }
      projstring = projstring + "</select>";
      return projstring;
    }
  }
}

function loadProjects() {
  var company = document.getElementById("stratcomp").value;
  document.getElementById("sprojsel").innerHTML = createProjectsFor(company);
}

function loadStProjects(id, projid) {
  var company = document.getElementById("stcomp-" + id).value;
  document.getElementById("divproj-" + id).innerHTML = createProjectsForId(
    company,
    "projsel-" + id,
    projid
  );
}

// new table for supplier and team editing...
function teamTableAdmin() {
  var tabstring = '<div id="supteamstat"></div>';
  tabstring =
    tabstring +
    "<TABLE class=fancyTable width=100% cellpadding=2 cellspacing=2 border=2>";
  tabstring =
    tabstring +
    '<TR><TD align=center width=50%><div id="teamers"></div></TD><TD align=center><div id="teamsups"></div></TD></TR></TABLE>';
  tabstring =
    tabstring +
    '<P><div style="height: 600px; width: 100%;"> <table class="fancyTable" id="supteamtab" width=100% cellpadding=2 cellspacing=2 border=1><thead>';
  tabstring =
    tabstring +
    "<TR><TH>Select</TH><TH>Project name</TH><TH>Company name</TH><TH>Business unit</TH><TH>Description</TH><TH>Value of contract</TH><TH>Supplier(s)</TH></TR>";
  tabstring = tabstring + "</thead><tbody>";
  for (var i = 0; i < Gstrategies.length; i++) {
    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + ">";
    tabstring = tabstring + "<TD width=60 align=center>";
    tabstring =
      tabstring +
      '<input type=radio name=stratsel id=stratsel value="' +
      Gstrategies[i][0] +
      '" onClick="editStrategy(' +
      Gstrategies[i][0] +
      ')"></TD>';
    tabstring = tabstring + "<TD>" + Gstrategies[i][4] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][1][1] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][3][1] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][5] + "</TD>";
    if (Gstrategies[i][6] != null && Gstrategies[i][6].length > 1) {
      var curr = CurrencyFormat(
        Gstrategies[i][6][0],
        Gstrategies[i][6][1],
        0,
        "",
        ","
      );
      tabstring = tabstring + "<TD>" + curr + "</TD>";
    } else tabstring = tabstring + "<TD> &nbsp;</TD>";
    tabstring = tabstring + "<TD>";
    if (Gstrategies[i][9] != null) {
      for (var j = 0; j < Gstrategies[i][9].length; j++)
        tabstring = tabstring + Gstrategies[i][9][j][1] + "<br>";
      tabstring = tabstring + "&nbsp;";
    } else tabstring = tabstring + "&nbsp;";
    tabstring = tabstring + "</TD></TR>";
  }

  tabstring = tabstring + "</tbody></table></div>";
  return tabstring;
}

function activateProject(i) {
  var p = Gstrategies[i][0];
  var stat = Gstrategies[i][Gstrategies[i].length - 1];
  if (stat.valueOf() == "INACTIVE".valueOf()) {
    strategyStatusArea = "stratstat";
    showTimedMessage("stratstat", "Activating project...", 0, false);
    $.ajax({
      url:
        "save-project.php?" +
        "&obj=" +
        encodeURIComponent(p) +
        "&company=" +
        getCompanyForProject(p) +
        "&bu=" +
        getBUForProject(p) +
        "&status=" +
        encodeURIComponent("") +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateStrategies,
      error: strategyOpFailed
      //,datatype: "json"
    });
  } else myAlert("ERROR", "status: " + stat, "error");
}

function inactivateProject(i) {
  var p = Gstrategies[i][0];
  var stat = Gstrategies[i][Gstrategies[i].length - 1];
  if (stat.valueOf() != "INACTIVE".valueOf()) {
    strategyStatusArea = "stratstat";
    showTimedMessage("stratstat", "Deactivating project...", 0, false);
    $.ajax({
      url:
        "save-project.php?" +
        "&obj=" +
        encodeURIComponent(p) +
        "&company=" +
        getCompanyForProject(p) +
        "&bu=" +
        getBUForProject(p) +
        "&status=" +
        encodeURIComponent("INACTIVE") +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateStrategies,
      error: strategyOpFailed
      //,datatype: "json"
    });
  } else myAlert("ERROR", "Nothing to do... " + stat, "error");
}

function activateSS(ss, stat) {
  // alert("activate " + ss + " stat " + stat);
  var p = Gcurrentstrategy;
  if (stat != 1) {
    showTimedMessage("restatus", "Activating strategy statement...", 0, false);
    $.ajax({
      url:
        "save-ss?" +
        "&ss=" +
        encodeURIComponent(ss) +
        "&project=" +
        encodeURIComponent(p) +
        "&company=" +
        getCompanyForProject(p) +
        "&bu=" +
        getBUForProject(p) +
        "&status=" +
        encodeURIComponent("") +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function inactivateSS(ss, stat) {
  // alert("inactivate " + ss + " stat " + stat);
  var p = Gcurrentstrategy;
  if (stat == 1) {
    showTimedMessage("restatus", "Deactivate strategy statement...", 0, false);
    $.ajax({
      url:
        "save-ss?" +
        "&ss=" +
        encodeURIComponent(ss) +
        "&project=" +
        encodeURIComponent(p) +
        "&company=" +
        getCompanyForProject(p) +
        "&bu=" +
        getBUForProject(p) +
        "&status=" +
        encodeURIComponent("INACTIVE") +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: ssUpdated,
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function strategiesTableAdmin() {
  changedObjects = [];
  oldSelectValues = [];
  var tabstring =
    '<div id="stratstat"> </div>' +
    injectModals() +
    '<div style="height: 500px; width: 98%;"><table class="fancyTable" id="sadmintab" width=97% cellpadding=2 cellspacing=2 border=1><thead>';

  tabstring =
    tabstring +
    "<TR><TH>&nbsp;Status&nbsp;</TH><TH>Project name</TH><TH>Company name</TH><TH>Business unit</TH><TH>Description</TH><TH>Value of contract</TH><TH>Currency</TH><TH>Supplier(s)</TH></TR></thead>";
  tabstring =
    tabstring + '<tfoot><TR style="background: ' + GheaderColor + ';">';
  tabstring =
    tabstring +
    '<TD  align=center><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new project" onClick="addStrategy()"></div></TD>';
  tabstring =
    tabstring +
    '<TD align=center><textarea id=stratname cols=40 rows=3  onClick="selectAll(stratname)"></textarea></TD>';
  tabstring =
    tabstring +
    '<TD align=center><select style="max-width: 140px; min-width: 140px; width: 140px;" id=stratcomp onClick="loadProjects()">';
  for (var i = 0; i < Gcompanies.length; i++)
    tabstring =
      tabstring +
      "<option value=" +
      Gcompanies[i][0] +
      ">" +
      Gcompanies[i][1] +
      "</option>";
  tabstring = tabstring + "<select></TD>";
  // tabstring = tabstring + '<TD><input id=stratdiv type=text></TD>';
  tabstring =
    tabstring +
    "<TD align=center><div id=sprojsel><select id=stratproj></select></div></TD>";
  tabstring =
    tabstring +
    '<TD  align=center><textarea id=stratdesc onClick="selectAll(stratdesc)" cols=40 rows=3></textarea></TD>';
  tabstring =
    tabstring +
    '<TD align=center><input id=stratpot onClick="selectAll(stratpot)" type=text></TD>';
  tabstring =
    tabstring +
    "<TD  align=center>" +
    generateCurrencySelector("stcurr") +
    "</TD>";
  tabstring = tabstring + "<TD>&nbsp;</TD>";
  tabstring = tabstring + "</tfoot></TR>";
  tabstring = tabstring + "<tbody>";
  var prefixes = "[stname, stdesc, stsave]";
  var selprefixes = "[stcurr]";
  for (var i = 0; i < Gstrategies.length; i++) {
    var mods = "";
    var id = Gstrategies[i][0];
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + ">";
    tabstring = tabstring + "<TD width=90>";
    var active = Gstrategies[i][12];
    if (active.valueOf() == "INACTIVE".valueOf()) active = 0;
    else active = 1;
    if (active == 1) {
      tabstring =
        tabstring +
        '<input type=radio name="active-' +
        i +
        '" onClick="inactivateProject(' +
        i +
        ')" > Inactive<br>';
      tabstring =
        tabstring +
        '<input type=radio name="active-' +
        i +
        '" onClick="activateProject(' +
        i +
        ')" checked > Active';
    } else {
      tabstring =
        tabstring +
        '<input type=radio name="active-' +
        i +
        '" onClick="inactivateProject(' +
        i +
        ')" checked > Inactive<br>';
      tabstring =
        tabstring +
        '<input type=radio name="active-' +
        i +
        '" onClick="activateProject(' +
        i +
        ')" > Active';
    }

    tabstring = tabstring + "</TD>";
    tabstring =
      tabstring +
      '<TD align=center><textarea oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" cols=40 rows=3 id="stname-' +
      id +
      '" >' +
      Gstrategies[i][4] +
      "</textarea></TD>"; // name
    var divselid = "divproj-" + id;
    var projselid = "projsel-" + id;
    tabstring =
      tabstring +
      '<TD align=center><select style="width: 140px;" title="Company for a project cannot be changed!" disabled id="stcomp-' +
      id +
      '" onClick="loadStProjects(' +
      id +
      ')">';
    for (var k = 0; k < Gcompanies.length; k++) {
      var selected = "";
      if (Gcompanies[k][0] == Gstrategies[i][1][0]) selected = " selected";
      tabstring =
        tabstring +
        "<option value=" +
        Gcompanies[k][0] +
        " " +
        selected +
        " >" +
        Gcompanies[k][1] +
        "</option>";
    }
    tabstring = tabstring + "</select></TD>";
    // tabstring = tabstring + '<TD><input id=stratdiv type=text></TD>';
    tabstring = tabstring + '<TD align=center><div id="' + divselid + '">';

    for (var m = 0; m < Gprojects.length; m++) {
      if (
        (Gstrategies[i][1][0] + "").valueOf() ==
        (Gprojects[m][0] + "").valueOf()
      ) {
        // companies match...
        tabstring =
          tabstring +
          '<select style="width: 140px;"  title="Business unit for a project cannot be changed!"  disabled id="' +
          projselid +
          '" >';
        for (var xx = 2; xx < Gprojects[m].length; xx++) {
          var selected = "";
          if (Gstrategies[i][3][0] == Gprojects[m][xx][0])
            selected = " selected ";
          tabstring =
            tabstring +
            '<OPTION VALUE="' +
            Gprojects[m][xx][0] +
            '" ' +
            selected +
            " >" +
            Gprojects[m][xx][1] +
            "</OPTION>";
        }
        tabstring = tabstring + "</select>";
      }
    }

    tabstring = tabstring + "</div></TD>";
    tabstring =
      tabstring +
      '<TD align=center><textarea oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" rows=3 cols=40 id="stdesc-' +
      id +
      '"> ' +
      Gstrategies[i][5] +
      "</textarea></TD>"; // desc
    if (Gstrategies[i][6] != null && Gstrategies[i][6].length > 1) {
      // savings
      var curr = CurrencyFormat(Gstrategies[i][6][0], "", 0, "", ",");
      tabstring =
        tabstring +
        '<TD align=center><input type=text oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        id +
        ')" id="stsave-' +
        id +
        '" value="' +
        curr +
        '"></TD>';
    } else
      tabstring =
        tabstring +
        '<TD align=center><input type=text oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        id +
        ')" id="stsave-' +
        id +
        '" ></TD>';
    var eventspec =
      ' onChange="fixSelRowClass(' + selprefixes + ", " + id + ')"  ';
    tabstring =
      tabstring +
      "<TD align=center>" +
      generateCurrencySelectorWithDefaultEvent(
        "stcurr-" + id,
        Gstrategies[i][6][1],
        eventspec
      ) +
      "</TD>";
    setOldSelectValue("stcurr-" + id, Gstrategies[i][6][1]);
    tabstring = tabstring + "<TD align=center>";
    if (Gstrategies[i][9] != null) {
      for (var j = 0; j < Gstrategies[i][9].length; j++)
        tabstring = tabstring + Gstrategies[i][9][j][1] + "<br>";
      tabstring = tabstring + "&nbsp;";
    } else tabstring = tabstring + "&nbsp;";
    tabstring = tabstring + "</TD></TR>";
    // tabstring = tabstring + '<TD width=60 align=center><input title="Save the changes to this row" type=image src="images/save-16.png" onClick="saveStrategy(' + id + ')"></TD>';
  }

  tabstring = tabstring + "</tbody></table></div>";
  return tabstring;
}

function getCommodityName(c) {
  for (var i = 0; i < Gcommodities.length; i++)
    if (Gcommodities[i][0] == c) return Gcommodities[i][1];
  return "";
}

function populateCompany(c) {
  selectedCompany = c;
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    if ((c + "").valueOf() == (Gcompanies[i][0] + "").valueOf()) {
      document.getElementById("companystat").innerHTML =
        Gcompanies[i][1] + " selected ...";
      document.getElementById("compname").value = Gcompanies[i][1];
      document.getElementById("compadd").value = Gcompanies[i][2];
      document.getElementById("compass").value = Gcompanies[i][3][0];
      document.getElementById("compcurr").value = Gcompanies[i][3][1];
      document.getElementById("compweb").value = Gcompanies[i][4];
      document.getElementById("comptel").value = Gcompanies[i][5];
      if (Gcompanies[i].length >= 7) {
        if (Gcompanies[i][6].valueOf() == "yes".valueOf())
          document.getElementById("supplierp").checked = true;
        else document.getElementById("supplierp").checked = false;
      } else document.getElementById("supplierp").checked = false;
    }
  }
}

function setSelectedRadio(name, val) {
  var elements = document.getElementsByName(name);
  for (var i = 0; i < elements.length; i++)
    if ((elements[i].value + "").valueOf() == (val + "").valueOf()) {
      elements[i].checked = true;
      return;
    }
}

// a bunch of radio buttons sharing the same name.  Find the the value of the checked radio
function getSelectedRadioValue(name) {
  var elements = document.getElementsByName(name);
  for (var i = 0; i < elements.length; i++)
    if (elements[i].checked) {
      return elements[i].value;
    }
}

function sortCompanies() {
  for (var i = 0; i < Gcompanies.length; i++) {
    for (var j = i + 1; j < Gcompanies.length; j++) {
      if (Gcompanies[i][1].valueOf() > Gcompanies[j][1].valueOf()) {
        var temp = Gcompanies[i];
        Gcompanies[i] = Gcompanies[j];
        Gcompanies[j] = temp;
      }
    }
  }
}

function refreshCompanies(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("companystat", result[1], 0, true);
    return;
  }
  Gcompanies = result[1];
  sortCompanies();
  GcompaniesBody = companiesTable();
  document.getElementById("mainbody").innerHTML = companiesTable();
  setSelectedRadio("companysel", selectedCompany);
  populateCompany(selectedCompany);
  showTimedMessage(
    "companystat",
    "Company information successfully refreshed",
    5000,
    false
  );
}

function updateCompanies(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "companystat",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-companies.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshCompanies,
      error: companyOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("companystat", res[1], 0, true);
  }
}

function istepOpFailed(resp) {
  showTimedMessage("treesel", "Cost element updates failed", 0, true);
}

function strategyOpFailed(resp) {
  showTimedMessage("stratstat", "Project update failed", 0, true);
}

function imOpFailed(resp) {
  showTimedMessage("stratstat", "Action plan definition failed", 0, true);
}

function veOpFailed(resp) {
  showTimedMessage("stratstat", "Action plan update failed", 0, true);
}

function docFailed(resp) {
  showTimedMessage(
    "dload-feedback-" + Gcurrentstep,
    "Doc update failed",
    0,
    true
  );
}

function teamOpFailed(resp) {
  showTimedMessage("stratstat", "Team update failed", 0, true);
}

function companyOpFailed(resp) {
  showTimedMessage("companystat", "Company update failed", 0, true);
}

function commodityOpFailed(resp) {
  showTimedMessage("commstat", "Category update failed", 0, true);
}

function personOpFailed(resp) {
  showTimedMessage("persstat", "Person update failed", 0, true);
}

function projectOpFailed(resp) {
  showTimedMessage("projstat", "Project update failed", 0, true);
}

function goalOpFailed(resp) {
  showTimedMessage("gmsg", "Goal update failed", 0, true);
}

function addCompany() {
  var name = document.getElementById("compname").value;
  var add = document.getElementById("compadd").value;
  var ass = extractNumber(document.getElementById("compass").value);
  var curr = "USD"; // document.getElementById('compcurr').value;
  var url = document.getElementById("compweb").value;
  var tel = document.getElementById("comptel").value;
  var supplierp = document.getElementById("supplierp").checked;
  if (name.valueOf() == "".valueOf()) {
    showTimedMessage("companystat", "Company requires a name!", 0, true);
    return;
  }

  document.getElementById("companystat").innerHTML = "Adding new company ...";
  if (supplierp) {
    $.ajax({
      url:
        "add-company.php?name=" +
        encodeURIComponent(name) +
        "&address=" +
        encodeURIComponent(add) +
        "&assets=" +
        encodeURIComponent(ass) +
        "&units=" +
        encodeURIComponent(curr) +
        "&url=" +
        encodeURIComponent(url) +
        "&telephone=" +
        encodeURIComponent(tel) +
        "&supplierp=yes" +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateCompanies,
      error: companyOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "add-company.php?name=" +
        encodeURIComponent(name) +
        "&address=" +
        encodeURIComponent(add) +
        "&assets=" +
        encodeURIComponent(ass) +
        "&units=" +
        encodeURIComponent(curr) +
        "&url=" +
        encodeURIComponent(url) +
        "&telephone=" +
        encodeURIComponent(tel) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateCompanies,
      error: companyOpFailed
      //,datatype: "json"
    });
  }
}

function saveCompany(id, update) {
  var name = document.getElementById("cname-" + id).value;
  var add = document.getElementById("cadd-" + id).value;
  var ass = extractNumber(document.getElementById("cass-" + id).value);
  //var curr = document.getElementById('compcurr').value;
  var url = document.getElementById("cweb-" + id).value;
  var tel = document.getElementById("ctel-" + id).value;
  var supplierp = document.getElementById("csupp-" + id).checked;

  if (name.valueOf() == "".valueOf()) {
    showTimedMessage(
      "companystat",
      "All company attributes must be provided for save!",
      0,
      true
    );
    return;
  }

  document.getElementById("companystat").innerHTML = "Saving company ...";
  if (update == 1) {
    if (supplierp)
      $.ajax({
        url:
          "save-company.php?obj=" +
          id +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=yes" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateCompanies,
        error: companyOpFailed
        //,datatype: "json"
      });
    else
      $.ajax({
        url:
          "save-company.php?obj=" +
          id +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=no" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateCompanies,
        error: companyOpFailed
        //,datatype: "json"
      });
  } else {
    if (supplierp)
      $.ajax({
        url:
          "save-company.php?obj=" +
          id +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=yes" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: showTimedMessage(
          "companystat",
          "Next company updated",
          0,
          false
        ),
        error: companyOpFailed
        //,datatype: "json"
      });
    else
      $.ajax({
        url:
          "save-company.php?obj=" +
          id +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=no" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: showTimedMessage(
          "companystat",
          "Next company updated",
          0,
          false
        ),
        error: companyOpFailed
        //,datatype: "json"
      });
  }
}

function companiesTable() {
  changedObjects = [];

  var tabstring =
    '<div id="companystat"></div><div style="height: 550px; width: 100%;">';
  tabstring =
    tabstring +
    injectModals() +
    '<table class="fancyTable" cellpadding=2 cellspacing=2 border=1 id="ctab"  width=100%>';
  tabstring =
    tabstring +
    "<thead><TR><TH>Name</TH><TH>Address</TH><TH>Assets (USD) </TH><TH>Website</TH><TH>Telephone</TH><TH>Supplier? </TH><TH>Action</TH></TR></thead>";
  tabstring =
    tabstring +
    '<tfoot><TR><TD align=center><input id=compname value="" onClick="selectAll(compname)" type=text></TD>' +
    '<TD align=center><textarea id=compadd rows=3 cols=45></textarea></TD> <TD align=center><input id=compass value="" onClick="selectAll(compass)" type=text></TD>' +
    '<TD align=center><input id=compweb value="" onClick="selectAll(compweb)" type=text></TD> <TD align=center><input id=comptel value="" onClick="selectAll(comptel)" type=text></TD>' +
    '<TD align=center><input type=checkbox id="supplierp" width=60></TD><TD align=center width=60><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new company" onClick="addCompany()"></div></TD></TR></tfoot>';
  tabstring = tabstring + "<tbody>";
  var prefixes = "[cname, cadd, cass, cweb, ctel ]";
  var cbprefixes = "[csupp]";
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + ">";
    var id = Gcompanies[i][0];
    tabstring =
      tabstring +
      '<TD align=center><input type=text oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" id="cname-' +
      id +
      '" value="' +
      Gcompanies[i][1] +
      '"></TD>';
    tabstring =
      tabstring +
      '<TD align=center><textarea oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" rows=2 cols=45 id="cadd-' +
      id +
      '">' +
      Gcompanies[i][2] +
      "</textarea></TD>";
    if (Gcompanies[i][3] != null && Gcompanies[i][3].length >= 1)
      tabstring =
        tabstring +
        '<TD align=center><input type=text oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        id +
        ')" id="cass-' +
        id +
        '" value="' +
        CurrencyFormat(Gcompanies[i][3][0], "", 0, "", ",") +
        '"></TD>';
    else
      tabstring =
        tabstring +
        '<TD align=center><input type=text oninput="fixTextRowClass(' +
        prefixes +
        ", " +
        id +
        ')" id="cass-' +
        id +
        '" ></TD>';
    tabstring =
      tabstring +
      '<TD align=center><input type=text oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" id="cweb-' +
      id +
      '" value="' +
      Gcompanies[i][4] +
      '"></TD>';
    tabstring =
      tabstring +
      '<TD align=center><input type=text oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" id="ctel-' +
      id +
      '" value="' +
      Gcompanies[i][5] +
      '"></TD>';

    var supp = "";
    tabstring =
      tabstring +
      '<TD width=60 align=center><div id="contcsupp-' +
      id +
      '"><input type=checkbox onchange="fixCheckBoxRowClass(' +
      cbprefixes +
      ",  " +
      id +
      ')" id="csupp-' +
      id +
      '"';

    var selVal = "0";
    if (Gcompanies[i].length > 6) {
      supp = " checked ";
      selVal = "1";
    }
    tabstring = tabstring + supp + "></div></TD>";
    // tabstring = tabstring + '<TD align=center width=60><input title="Save the changes to this row" type=image src="images/save-16.png" onClick="saveCompany(' + id + ', 1)"></TD>';
    tabstring = tabstring + "<TD>&nbsp;</TD>";
    setOldCheckBoxValue("csupp-" + id, selVal);
    tabstring = tabstring + "</TR>";
  }
  tabstring = tabstring + "</tbody></TABLE></div>";

  return tabstring;
}

var projCompanySelected = "";

function refreshProjectsLocal() {
  // document.getElementById("divisionsarea").innerHTML = projectsTable();
  GbusBody = projectsTable();
}

function refreshProjects(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("projstat", result[1], 0, true);
    return;
  }
  Gprojects = result[1];
  refreshProjectsLocal();
  document.getElementById("mainbody").innerHTML = GbusBody;
  setSelectedRadio("companySelector", projCompanySelected);
  if (GselectedProject != null) populateProject(GselectedProject);
  showTimedMessage(
    "projstat",
    "Project information successfully refreshed",
    5000,
    false
  );
}

function updateProjects(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    projCompanySelected = document.getElementById("companySelector").value;
    if (document.getElementById("projectSelector") != null)
      GselectedProject = document.getElementById("projectSelector").value;
    showTimedMessage(
      "projstat",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-all-bus-divisions.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshProjects,
      error: projectOpFailed
      //,datatype: "json"
    });
  } else showTimedMessage("projstat", "ERROR: " + res[0] + res[1], 0, true);
}

function projectsTable() {
  var tabstring =
    '<table class="fancyTable" id="bunitstab" width=80% cellpadding=2 cellspacing=2 border=1>';
  tabstring =
    tabstring +
    '<TR><TD>Company Selection: </TD><TD> <select id="companySelector" onClick="populateProjects()">';
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    tabstring =
      tabstring +
      "<option value=" +
      Gcompanies[i][0] +
      "> " +
      Gcompanies[i][1] +
      "</option>";
  }
  tabstring = tabstring + "</select></TD></TR>";
  tabstring =
    tabstring +
    '<TR><TD>Business Units: </TD><TD> <div id="projectsArea"> <select id="projectSelector"  onChange="populateProject()">';
  tabstring = tabstring + "</select></DIV></TD></TR>";
  tabstring =
    tabstring +
    '<TR><TD>Unit Name</TD><TD><input type=text onClick="selectAll(project-name)" value="" id="project-name"></TD></TR>';
  tabstring =
    tabstring +
    '<TR><TD>Unit Description</TD><TD><textarea id="project-desc" onClick="selectAll(project-desc)" rows=5 cols=80> </textarea></TD></TR>';
  tabstring =
    tabstring +
    '<TR><TD>Unit Budget</TD><TD><input type=text value="" onClick="selectAll(project-budget)" id="project-budget">';
  tabstring = tabstring + "&nbsp;&nbsp; <select id=pcurr>";
  for (var m = 0; m < Gcurrency.length; m++)
    tabstring =
      tabstring +
      '<OPTION value="' +
      Gcurrency[m] +
      '">' +
      Gcurrency[m] +
      "</OPTION>";
  tabstring = tabstring + "</select></TD></TR>";
  tabstring =
    tabstring +
    "<TR class=alt><TD align=center colspan=2>If relevant, add division information below</TD></TR>";
  tabstring =
    tabstring +
    '<TR><TD>Division Name:</TD><TD><input id="divname" onClick="selectAll(divname)" type=text value=""></TD></TR>';
  tabstring =
    tabstring +
    '<TR><TD>Division Description:</TD><TD><textarea id="divdesc" onClick="selectAll(divdesc)" rows=4 cols=80> </textarea></TD></TR>';
  tabstring =
    tabstring +
    '<TR><TD>Division Location:</TD><TD><input type=text id="divloc"  onClick="selectAll(divloc)" value=""></TD></TR></TABLE>';
  tabstring =
    tabstring +
    '<br><center><div id="projstat"></div><br><input type=submit class="btn-sm btn-info" value="Add New Business Unit" onClick="addProject()">';
  tabstring =
    tabstring +
    '&nbsp;&nbsp;&nbsp;<input type=submit class="btn-sm btn-info" value="Modify Selected Business Unit" onClick="saveProject()">';

  return tabstring;
}

function generateSelect(id, values) {
  var selstring = '<select id="' + id + '">';
  for (var i = 0; i < values.length; i++) {
    selstring =
      selstring +
      '<option value="' +
      values[i] +
      '">' +
      values[i] +
      "</option>";
  }
  selstring = selstring + "</select>";
  return selstring;
}

function generateSelectDefault(id, values, sel) {
  var selstring = '<select id="' + id + '">';
  if (sel == null) sel = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i].valueOf() == sel.valueOf())
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '" selected>' +
        values[i] +
        "</option>";
    else
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '">' +
        values[i] +
        "</option>";
  }
  selstring = selstring + "</select>";
  return selstring;
}

function generateSelectDefaultEvent(id, values, sel, eventspec) {
  var selstring = '<select id="' + id + '" ' + eventspec + ">";
  if (sel == null) sel = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i].valueOf() == sel.valueOf())
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '" selected>' +
        values[i] +
        "</option>";
    else
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '">' +
        values[i] +
        "</option>";
  }
  selstring = selstring + "</select>";

  return selstring;
}

function generateSelectDefaultEventClass(id, values, sel, eventspec, level) {
  var selstring =
    '<select id="' + id + '" ' + eventspec + ' class="level' + level + '" >';
  if (sel == null) sel = "";
  for (var i = 0; i < values.length; i++) {
    if (values[i].valueOf() == sel.valueOf())
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '" selected>' +
        values[i] +
        "</option>";
    else
      selstring =
        selstring +
        '<option value="' +
        values[i] +
        '">' +
        values[i] +
        "</option>";
  }
  selstring = selstring + "</select>";

  return selstring;
}

function generateCurrencySelector(id) {
  var res = '<select id="' + id + '">';
  for (var m = 0; m < Gcurrency.length; m++)
    res =
      res +
      '<OPTION value="' +
      Gcurrency[m] +
      '">' +
      Gcurrency[m] +
      "</OPTION>";
  return res;
}

function generateCurrencySelectorWithDefault(id, val) {
  var res = '<select id="' + id + '">';
  for (var m = 0; m < Gcurrency.length; m++) {
    if (val.valueOf() == Gcurrency[m].valueOf())
      res =
        res +
        '<OPTION value="' +
        Gcurrency[m] +
        '" selected>' +
        Gcurrency[m] +
        "</OPTION>";
    else
      res =
        res +
        '<OPTION value="' +
        Gcurrency[m] +
        '">' +
        Gcurrency[m] +
        "</OPTION>";
  }
  return res;
}

function generateCurrencySelectorWithDefaultEvent(id, val, eventspec) {
  var res = '<select id="' + id + '" ' + eventspec + " >";
  for (var m = 0; m < Gcurrency.length; m++) {
    if (val.valueOf() == Gcurrency[m].valueOf())
      res =
        res +
        '<OPTION value="' +
        Gcurrency[m] +
        '" selected>' +
        Gcurrency[m] +
        "</OPTION>";
    else
      res =
        res +
        '<OPTION value="' +
        Gcurrency[m] +
        '">' +
        Gcurrency[m] +
        "</OPTION>";
  }
  return res;
}

function addProject() {
  var cn = document.getElementById("companySelector").value;
  if (cn == null || cn.valueOf() == "".valueOf()) {
    showTimedMessage("projstat", "No company specified", 0, true);
    return;
  }
  var pn = document.getElementById("project-name").value;
  var pd = document.getElementById("project-desc").value;
  var pb = extractNumber(document.getElementById("project-budget").value);
  if (validNumber("project-budget") == 0) {
    showTimedMessage("projstat", "Budget is not a valid number!", 0, true);
    return;
  }
  var dn = document.getElementById("divname").value;
  var dd = document.getElementById("divdesc").value;
  var dl = document.getElementById("divloc").value;
  var curr = document.getElementById("pcurr").value;

  if (
    pn.valueOf() == "".valueOf() ||
    pd.valueOf() == "".valueOf() ||
    pb.valueOf() == "".valueOf() ||
    curr.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "projstat",
      "All project attributes (name, description, budget, units) must be provided!",
      0,
      true
    );
    return;
  }

  document.getElementById("projstat").innerHTML = "Adding new project ...";
  if (dn.valueOf() == "".valueOf())
    $.ajax({
      url:
        "add-bu.php?name=" +
        encodeURIComponent(pn) +
        "&company=" +
        encodeURIComponent(cn) +
        "&desc=" +
        encodeURIComponent(pd) +
        "&budget=" +
        encodeURIComponent(pb) +
        "&units=" +
        encodeURIComponent(curr) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateProjects,
      error: projectOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "add-bu.php?name=" +
        encodeURIComponent(pn) +
        "&company=" +
        encodeURIComponent(cn) +
        "&desc=" +
        encodeURIComponent(pd) +
        "&budget=" +
        encodeURIComponent(pb) +
        "&units=" +
        encodeURIComponent(curr) +
        "&division=" +
        encodeURIComponent(dn) +
        "&division-desc=" +
        encodeURIComponent(dd) +
        "&loc=" +
        encodeURIComponent(dl) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateProjects,
      error: projectOpFailed
      //,datatype: "json"
    });
}

function saveProject() {
  var comp = document.getElementById("companySelector").value;
  if (comp == null || comp.valueOf() == "".valueOf()) {
    showTimedMessage("projstat", "No company specified", 0, true);
    return;
  }
  var obj = document.getElementById("projectSelector").value;
  if (obj == null || obj.valueOf() == "".valueOf()) {
    showTimedMessage("projstat", "No project specified", 0, true);
    return;
  }
  var pn = document.getElementById("project-name").value;
  var pd = document.getElementById("project-desc").value;
  var pb = document.getElementById("project-budget").value;
  if (validNumber("project-budget") == 0) {
    showTimedMessage("projstat", "Budget is not a valid number!", 0, true);
    return;
  }
  var dn = document.getElementById("divname").value;
  var dd = document.getElementById("divdesc").value;
  var dl = document.getElementById("divloc").value;
  var curr = document.getElementById("pcurr").value;

  document.getElementById("projstat").innerHTML = "Saving project ...";
  if (dn == null || dn.valueOf() == "".valueOf())
    $.ajax({
      url:
        "save-bu?name=" +
        encodeURIComponent(pn) +
        "&desc=" +
        encodeURIComponent(pd) +
        "&budget=" +
        encodeURIComponent(extractNumber(pb)) +
        "&units=" +
        encodeURIComponent(curr) +
        "&company=" +
        encodeURIComponent(comp) +
        "&obj=" +
        encodeURIComponent(obj) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateProjects,
      error: projectOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "save-bu?name=" +
        encodeURIComponent(pn) +
        "&desc=" +
        encodeURIComponent(pd) +
        "&budget=" +
        encodeURIComponent(pb) +
        "&units=" +
        encodeURIComponent(curr) +
        "&obj=" +
        encodeURIComponent(obj) +
        "&company=" +
        encodeURIComponent(comp) +
        "&division=" +
        encodeURIComponent(dn) +
        "&division-desc=" +
        encodeURIComponent(dd) +
        "&loc=" +
        encodeURIComponent(dl) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateProjects,
      error: projectOpFailed
      //,datatype: "json"
    });
}

function clearDiv() {
  document.getElementById("divname").value = "";
  document.getElementById("divdesc").value = "";
  document.getElementById("divloc").value = "";
}

function clearBUForm() {
  document.getElementById("project-name").value = "";
  document.getElementById("project-desc").value = "";
  document.getElementById("project-budget").value = "";
  clearDiv();
}

function populateProjects() {
  var id = document.getElementById("companySelector").value;
  var selstring = "";
  clearBUForm();
  for (var i = 0; i < Gprojects.length; i++)
    if (("" + id).valueOf() == ("" + Gprojects[i][0]).valueOf()) {
      if (Gprojects[i].length > 2 && Gprojects[i][2] != null) {
        selstring = '<select id="projectSelector" onClick="populateProject()">';
        for (var j = 2; j < Gprojects[i].length; j++) {
          selstring =
            selstring + '<option value="' + Gprojects[i][j][0] + '"> ';
          selstring = selstring + Gprojects[i][j][1] + "</option>";
        }
        selstring = selstring + "</select>";
        document.getElementById("projectsArea").innerHTML = selstring;
        return;
      }
    }
  document.getElementById("projectsArea").innerHTML = selstring;
}

function populateProject() {
  clearDiv();
  var id = document.getElementById("companySelector").value;
  var proj = document.getElementById("projectSelector").value;
  for (var i = 0; i < Gprojects.length; i++) {
    if (id == Gprojects[i][0]) {
      for (var j = 0; j < Gprojects[i].length; j++) {
        var entry = Gprojects[i][j];
        if (("" + proj).valueOf() == ("" + entry[0]).valueOf()) {
          // project match
          if (entry[1] != null)
            document.getElementById("project-name").value = Gprojects[i][j][1];
          else document.getElementById("project-name").value = "";
          if (entry[2] != null)
            document.getElementById("project-desc").value = Gprojects[i][j][2];
          else document.getElementById("project-desc").value = "";
          if (Gprojects[i][j][3] != null) {
            document.getElementById("project-budget").value =
              Gprojects[i][j][3][0];
            document.getElementById("pcurr").value = Gprojects[i][j][3][1];
          } else {
            document.getElementById("project-budget").value = "";
            document.getElementById("pcurr").value = "";
          }
          if (entry.length > 4) {
            // means there is division infom
            if (entry[4] != null) {
              document.getElementById("divname").value = entry[4][0];
              document.getElementById("divdesc").value = entry[4][1];
              document.getElementById("divloc").value = entry[4][2];
            }
          }
          return;
        }
      }
    }
  }
}

function populateComm(c) {
  selectedCommodity = c;
  for (var i = 0; i < Gcommodities.length; i++) {
    if ((c + "").valueOf() == (Gcommodities[i][0] + "").valueOf()) {
      document.getElementById("commname").value = Gcommodities[i][1];
      document.getElementById("commdesc").value = Gcommodities[i][2];
      document.getElementById("commnaics").value = Gcommodities[i][3];
      //document.getElementById('naicsdesc').value = Gcommodities[i][4];
    }
  }
}

function refreshCommodities(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("commstat", result[1], 0, true);
    return;
  }
  var temp = result[1];
  Gcommodities = temp[0];
  document.getElementById("mainbody").innerHTML = commTable();
  setSelectedRadio("commselect", selectedCommodity);
  populateComm(selectedCommodity);
  showTimedMessage(
    "commstat",
    "Category information successfully refreshed",
    5000,
    false
  );
}

function updateCommodities(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "commstat",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-commodities.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshCommodities,
      error: commodityOpFailed
      //,datatype: "json"
    });
  } else showTimedMessage("commstat", res[1], 0, true);
}

function addCommodity() {
  var name = document.getElementById("commname").value;
  var desc = document.getElementById("commdesc").value;
  var naics = document.getElementById("commnaics").value;

  if (
    name.valueOf() == "".valueOf() ||
    desc.valueOf() == "".valueOf() ||
    naics.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "commtat",
      "All company attributes must be provided!",
      0,
      true
    );
    return;
  }

  document.getElementById("commstat").innerHTML = "Adding new category ...";
  $.ajax({
    url:
      "add-commodity.php?name=" +
      encodeURIComponent(name) +
      "&desc=" +
      encodeURIComponent(desc) +
      "&naics=" +
      encodeURIComponent(naics) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateCommodities,
    error: commodityOpFailed
    //,datatype: "json"
  });
}

function saveCommodity(obj) {
  var name = document.getElementById("commname-" + obj).value;
  var desc = document.getElementById("commdesc-" + obj).value;
  var naics = document.getElementById("commnaics-" + obj).value;

  if (
    name.valueOf() == "".valueOf() ||
    desc.valueOf() == "".valueOf() ||
    naics.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "commtat",
      "All category attributes must be provided!",
      0,
      true
    );
    return;
  }

  document.getElementById("commstat").innerHTML =
    "Saving the selected category ...";
  $.ajax({
    url:
      "save-commodity?obj=" +
      obj +
      "&name=" +
      encodeURIComponent(name) +
      "&desc=" +
      encodeURIComponent(desc) +
      "&naics=" +
      encodeURIComponent(naics) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateCommodities,
    error: commodityOpFailed
    //,datatype: "json"
  });
}

function commTable() {
  var tabstring =
    '<center><div id="commstat"></div><table width=100% class="fancyTable" id="commtab" cellpadding=2 cellspacing=2 border=1><thead>';
  tabstring =
    tabstring +
    "<TR><TH>Category name</TH><TH>Description</TH><TH>NAICS</TH><TH>NAICS description</TH><TH>Action</TH></TR></thead>";
  tabstring =
    tabstring +
    '<tfoot><TR style="background: ' +
    GheaderColor +
    ';"><TD align=center><input id=commname onClick="selectAll(commname)" type=text size=60></TD>';
  tabstring =
    tabstring +
    '<TD align=center><textarea id=commdesc onClick="selectAll(commdesc)" rows=3 cols=80></textarea></TD>';
  tabstring =
    tabstring +
    '<TD align=center><select id=commnaics onClick="populateNAICSDesc(commnaics, naicsdesc)">';
  for (var k = 0; k < Gnaics.length; k++)
    tabstring =
      tabstring +
      '<option value="' +
      Gnaics[k][0] +
      '">' +
      Gnaics[k][0] +
      "</option>";
  tabstring = tabstring + "</select></TD>";
  tabstring = tabstring + '<TD><div id="naicsdesc"></div></TD>';
  tabstring =
    tabstring +
    '<TD align=center><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new commodity" onClick="addCommodity()"></div> </TD></TR>';
  tabstring = tabstring + "</tfoot><tbody>";
  for (var i = 0; i < Gcommodities.length; i++) {
    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + "> ";
    var id = Gcommodities[i][0];
    tabstring =
      tabstring +
      '<TD align=center><input type=text size=60 id="commname-' +
      id +
      '" value="' +
      Gcommodities[i][1] +
      '"></TD>'; // commodity name
    tabstring =
      tabstring +
      '<TD align=center><textarea rows=2 cols=80 id="commdesc-' +
      id +
      '">' +
      Gcommodities[i][2] +
      "</textarea></TD>"; // commodity description
    var selid = "commnaics-" + id;
    var divid = "ndesc-" + id;
    (tabstring =
      tabstring +
      '<TD align=center><select id="' +
      selid +
      '" onClick="populateNAICSDesc(selid + '),
      divid + ')">';
    for (var k = 0; k < Gnaics.length; k++) {
      var selected = "";
      if (Gnaics[k][0].valueOf() == Gcommodities[i][3].valueOf())
        selected = " selected ";
      tabstring =
        tabstring +
        '<option value="' +
        Gnaics[k][0] +
        '"' +
        selected +
        " >" +
        Gnaics[k][0] +
        "</option>";
    }
    tabstring = tabstring + "</select></TD>";
    tabstring =
      tabstring +
      '<TD><div id="' +
      divid +
      '">' +
      Gcommodities[i][4] +
      "</div></TD>";
    tabstring =
      tabstring +
      '<TD align=center width=60><input title="Save the changes to the category in this row" type=image src="images/save-16.png" onClick="saveCommodity(' +
      id +
      ')"></TD>';
    tabstring = tabstring + "</TR>";
  }

  tabstring = tabstring + "</tbody></table>";
  return tabstring;
}

function populatePerson(p) {
  selectedPerson = p;
  for (var i = 0; i < Gpersons[1].length; i++) {
    if ((p + "").valueOf() == (Gpersons[1][i][0] + "").valueOf()) {
      document.getElementById("persemail").value = Gpersons[1][i][1];
      document.getElementById("perspass").value = Gpersons[1][i][2];
      document.getElementById("persfirst").value = Gpersons[1][i][3].trim();
      document.getElementById("perslast").value = Gpersons[1][i][4].trim();
      document.getElementById("persphone").value = Gpersons[1][i][5];
      document.getElementById("persrole").value = Gpersons[1][i][6];
      document.getElementById("employerselect").value = Gpersons[1][i][7];
    }
  }
}

function getPersonRole(p) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if ((p + "").valueOf() == (Gpersons[1][i][0] + "").valueOf()) {
      return Gpersons[1][i][6];
    }
  }
  return "";
}

function refreshPersonsLocal() {
  GpersonsBody = personsTable();
  document.getElementById("mainbody").innerHTML = GpersonsBody;
  setSelectedRadio("personselect", selectedPerson);
  populatePerson(selectedPerson);
}

function refreshPersons(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("persstat", result[1], 0, true);
    return;
  }
  Gpersons = JSON.parse(response);

  refreshPersonsLocal();
  showTimedMessage(
    "persstat",
    "Person information successfully refreshed",
    5000,
    false
  );
}

function addPersonToProject() {
  var cn = document.getElementById("partind_company").value;
  if (cn.valueOf() == "".valueOf()) {
    alert("no company");
    return;
  }
  var cid = getCompanyIdFromName(cn);
  var fn = document.getElementById("partind_fname").value;
  var ln = document.getElementById("partind_lname").value;
  var job = document.getElementById("partind_desg").value;
  var email = document.getElementById("partind_email").value;
  if (email.valueOf() == "".valueOf()) {
    alert("no email");
    return;
  }
  $("#participant_modal").modal("hide");

  $.ajax({
    url:
      "add-person.php?uemail=" +
      encodeURIComponent(email) +
      "&upwd=" +
      encodeURIComponent("temp111") +
      "&ufirst=" +
      encodeURIComponent(fn) +
      "&ulast=" +
      encodeURIComponent(ln) +
      // "&telephone=" + encodeURIComponent(phone) +
      "&employer=" +
      encodeURIComponent(cid) +
      "&job=" +
      encodeURIComponent(job) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateEDPersonsAddPart,
    error: personEDOpFailed
    //,datatype: "json"
  });
}

function saveEDPerson() {
  var email = document.getElementById("emp_email").value;
  // var upass = document.getElementById("emp_pass").value;
  var fname = document.getElementById("emp_fname").value;
  var lname = document.getElementById("emp_lname").value;
  // var phone = document.getElementById('ptel-'+id).value;
  var role = document.getElementById("emp_desg").value;
  var employer = document.getElementById("emp_company").value;
  var admin_role = document.getElementById("checkboxG6").checked;
  admin_role = admin_role ? 1 : 0;

  var empid = getCompanyIdFromName(employer);
  if (empid == -1) {
    showTimedMessage("gmsg", "Not a valid company", 0, true);
    return;
  }
  if (email.valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Every person requires an email!", 0, true);
    return;
  }
  $("#employee_modal").modal("hide");
  if (editingPerson == -1) {
    showTimedMessage("gmsg", "Adding new person...", 0, false);
    $.ajax({
      url:
        "add-person.php?uemail=" +
        encodeURIComponent(email) +
        "&upwd=" +
        encodeURIComponent("temp111") +
        "&ufirst=" +
        encodeURIComponent(fname) +
        "&ulast=" +
        encodeURIComponent(lname) +
        // "&telephone=" + encodeURIComponent(phone) +
        "&employer=" +
        encodeURIComponent(empid) +
        "&job=" +
        encodeURIComponent(role) +
        "&admin_role=" +
        encodeURIComponent(admin_role) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateEDPersons,
      error: personEDOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage("gmsg", "Saving selected person...", 0, false);
    $.ajax({
      url:
        "save-person.php?uemail=" +
        encodeURIComponent(email) +
        "&ufirst=" +
        encodeURIComponent(fname) +
        "&ulast=" +
        encodeURIComponent(lname) +
        "&employer=" +
        encodeURIComponent(empid) +
        "&job=" +
        encodeURIComponent(role) +
        "&admin_role=" +
        encodeURIComponent(admin_role) +
        "&obj=" +
        encodeURIComponent(editingPerson) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updateEDPersons,
      error: personEDOpFailed
      //,datatype: "json"
    });
  }
}

function addPersonInternal() {
  var email = document.getElementById("persemail").value;
  var upass = document.getElementById("perspass").value;
  var fname = document.getElementById("persfirst").value;
  var lname = document.getElementById("perslast").value;
  var phone = document.getElementById("persphone").value;
  var role = document.getElementById("persrole").value;
  var employer = document.getElementById("employerselect").value;

  if (
    email.valueOf() == "".valueOf() ||
    upass.valueOf() == "".valueOf() ||
    fname.valueOf() == "".valueOf() ||
    lname.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "persstat",
      "All person attributes must be provided!",
      0,
      true
    );
    return;
  }

  if (employer.valueOf() == "".valueOf()) {
    showTimedMessage(
      "persstat",
      "An employer must be provided for a new person!",
      0,
      true
    );
    return;
  }

  document.getElementById("persstat").innerHTML = "Adding new person ...";
  $.ajax({
    url:
      "add-person.php?uemail=" +
      encodeURIComponent(email) +
      "&upwd=" +
      encodeURIComponent(upass) +
      "&ufirst=" +
      encodeURIComponent(fname) +
      "&ulast=" +
      encodeURIComponent(lname) +
      "&telephone=" +
      encodeURIComponent(phone) +
      "&employer=" +
      encodeURIComponent(employer) +
      "&job=" +
      encodeURIComponent(role) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updatePersons,
    error: personOpFailed
    //,datatype: "json"
  });
}

function updatePersons(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "persstat",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshPersons,
      error: personOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("persstat", res[1], 0, true);
  }
}

function updateEDPersons(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDPersons,
      error: personEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateEDPersonsAddPart(response) {
  var res = JSON.parse(response);
  newParticipant = -1;
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    newParticipant = res[1];
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDPersonsAddPart,
      error: personEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function addPerson() {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a new person now!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addPersonInternal();
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addPersonInternal();
}

function savePerson(id, update) {
  var email = document.getElementById("pemail-" + id).value;
  var upass = document.getElementById("ppass-" + id).value;
  var fname = document.getElementById("pfirst-" + id).value;
  var lname = document.getElementById("plast-" + id).value;
  var phone = document.getElementById("ptel-" + id).value;
  var role = document.getElementById("prole-" + id).value;
  var employer = document.getElementById("pemp-" + id).value;

  if (employer.valueOf() == "".valueOf()) {
    showTimedMessage(
      "persstat",
      "An employer must be provided for every person!",
      0,
      true
    );
    return;
  }

  document.getElementById("persstat").innerHTML = "Saving selected person ...";
  if (update == 1) {
    $.ajax({
      url:
        "save-person?uemail=" +
        encodeURIComponent(email) +
        "&upwd=" +
        encodeURIComponent(upass) +
        "&ufirst=" +
        encodeURIComponent(fname) +
        "&ulast=" +
        encodeURIComponent(lname) +
        "&telephone=" +
        encodeURIComponent(phone) +
        "&employer=" +
        encodeURIComponent(employer) +
        "&job=" +
        encodeURIComponent(role) +
        "&obj=" +
        encodeURIComponent(id) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: updatePersons,
      error: personOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "save-person?uemail=" +
        encodeURIComponent(email) +
        "&upwd=" +
        encodeURIComponent(upass) +
        "&ufirst=" +
        encodeURIComponent(fname) +
        "&ulast=" +
        encodeURIComponent(lname) +
        "&telephone=" +
        encodeURIComponent(phone) +
        "&employer=" +
        encodeURIComponent(employer) +
        "&job=" +
        encodeURIComponent(role) +
        "&obj=" +
        encodeURIComponent(id) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: showTimedMessage("persstat", "Person updated", 0, false),
      error: personOpFailed
      //,datatype: "json"
    });
  }
}

function personsTable() {
  changedObjects = [];
  oldSelectValues = [];
  var prefixes = "[pemail, ppass, pfirst, plast, ptel, prole]";
  var selprefixes = "[pemp]";
  // var tabstring = '<table  width=98% class="stdtable" id="rrrr" >';
  var tabstring =
    '<div id="persstat"></div>' +
    injectModals() +
    '<div style="height: 520px; width: 98%"><table class="fancyTable" width=98% id="ptab">';
  tabstring = tabstring + "<thead >";
  tabstring =
    tabstring +
    "<TR><TH align=center>Email Address</TH><TH align=center>Password</TH><TH align=center>First Name</TH><TH align=center>Last Name</TH><TH align=center>Phone Number</TH><TH align=center>Job Title</TH><TH align=center>Employer</TH><TH align=center >Action</TH></TR>";

  tabstring = tabstring + "</thead>";
  tabstring = tabstring + "<tfoot>";
  tabstring = tabstring + "<TR>";
  tabstring =
    tabstring + "<TD align=center><input type=text id=persemail></TD>";
  tabstring =
    tabstring + "<TD align=center><input type=text size=20  id=perspass></TD>";
  tabstring =
    tabstring + "<TD align=center><input type=text size=20  id=persfirst></TD>";
  tabstring =
    tabstring + "<TD align=center><input type=text size=20  id=perslast></TD>";
  tabstring =
    tabstring + "<TD align=center><input type=text size=20  id=persphone></TD>";
  tabstring =
    tabstring + "<TD align=center><input type=text size=20  id=persrole></TD>";
  tabstring =
    tabstring +
    '<TD align=center><select style="max-width: 140px; min-width: 140px; width: 140px;" id=employerselect>';
  for (var m = 0; m < Gcompanies.length; m++) {
    if (Gcompanies[m][0] !== Gemployer && Gemployer !== "1") continue;
    tabstring =
      tabstring +
      '<OPTION value="' +
      Gcompanies[m][0] +
      '" > ' +
      Gcompanies[m][1] +
      "</OPTION>";
  }

  tabstring =
    tabstring +
    '</select></TD><TD align=center><div style="opacity: 0.4;"><input type=image src="images/plus24.png" title="Add a new person" onClick="addPerson()"></div></TD></TR></tfoot>';

  tabstring = tabstring + "<tbody>";
  for (var i = 0; i < Gpersons[1].length; i++) {
    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + "> ";
    var id = Gpersons[1][i][0];
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=text size=20 id="pemail-' +
      id +
      '" value="' +
      Gpersons[1][i][1] +
      '" ></TD>';
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=password size=20 id="ppass-' +
      id +
      '" value="" ></TD>';
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=text size=20 id="pfirst-' +
      id +
      '" value="' +
      Gpersons[1][i][3].trim() +
      '" ></TD>';
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=text size=20 id="plast-' +
      id +
      '" value="' +
      Gpersons[1][i][4] +
      '" ></TD>';
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=text size=20 id="ptel-' +
      id +
      '" value="' +
      Gpersons[1][i][5] +
      '" ></TD>';
    tabstring =
      tabstring +
      '<TD><input oninput="fixTextRowClass(' +
      prefixes +
      ", " +
      id +
      ')" type=text size=20 id="prole-' +
      id +
      '" value="' +
      Gpersons[1][i][6] +
      '" ></TD>';
    tabstring =
      tabstring +
      '<TD><select style="max-width: 140px; min-width: 140px; width: 140px;" onchange="fixSelRowClass(' +
      selprefixes +
      ", " +
      id +
      ')" id="pemp-' +
      id +
      '">';

    for (var m = 0; m < Gcompanies.length; m++) {
      if (Gcompanies[m][0] !== Gemployer && Gemployer !== "1") continue;
      var selected = "";
      if (Gpersons[1][i][7].valueOf() == Gcompanies[m][1].valueOf()) {
        selected = "selected";
        setOldSelectValue("pemp-" + id, Gcompanies[m][1]);
      }
      tabstring =
        tabstring +
        '<OPTION value="' +
        Gcompanies[m][0] +
        '" ' +
        selected +
        " > " +
        Gcompanies[m][1] +
        "</OPTION>";
    }
    tabstring = tabstring + "</select></TD><TD>&nbsp;</TD></TR>";
  }

  tabstring = tabstring + "</tbody>";

  tabstring = tabstring + "</table></div>";
  return tabstring;
}

function companiesReady(response) {
  var result = JSON.parse(response);

  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage(
      "startupstatus",
      "Loading projects & divisions...",
      0,
      true
    );
    return;
  }

  Gcompanies = result[1];
  let suppliers = [];
  for (var key in Gcompanies) {
    if (Gcompanies[key][7][0].length) {
      for (var innerKey in Gcompanies[key][7][0]) {
        suppliers.push(Gcompanies[key][7][0][innerKey]);
      }
    }
  }
  Gsuppliers = suppliers;
  sortCompanies();
  document.getElementById("startupstatus").innerHTML =
    "Loading projects & divisions...";
  $.ajax({
    url:
      "get-all-bus-divisions.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: projectsReady,
    error: startupfailed
    //,datatype: "json"
  });
}

function projectsReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("startupstatus", result[1], 0, true);
    return;
  }
  Gprojects = result[1];
  document.getElementById("startupstatus").innerHTML = "Loading categories...";
  $.ajax({
    url:
      "get-commodities.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: commoditiesReady,
    error: startupfailed
    //,datatype: "json"
  });
}

function populateNAICSDesc(selid, descdiv) {
  var naics = document.getElementById(selid).value;
  for (var i = 0; i < Gnaics.length; i++) {
    if (naics.valueOf() == Gnaics[i][0].valueOf()) {
      document.getElementById(descdiv).innerHTML = Gnaics[i][1];
      return;
    }
  }
  document.getElementById(descdiv).innerHTML = "?";
}

function commoditiesReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("statupstatus", result[1], 0, true);
    return;
  }
  var temp = result[1];
  Gcommodities = temp[0];
  Gnaics = temp[1];
  Gcurrency = temp[2];
  document.getElementById("startupstatus").innerHTML = "Loading people...";
  $.ajax({
    url:
      "get-persons.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: usersReady,
    error: startupfailed
    //,datatype: "json"
  });
}

function getFirstLast(pn) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (
      Gpersons[1][i][1]
        .toLowerCase()
        .trim()
        .valueOf() == pn.toLowerCase().valueOf()
    ) {
      // compare emails...
      return [
        Gpersons[1][i][3].trim(),
        Gpersons[1][i][4].trim(),
        Gpersons[1][i][3][0] + Gpersons[1][i][4][0]
      ];
    }
  }
  return ["first?", "last?", "??"];
}
/**
 * Get the persons first name, last name and full name initials given a person id
 * @param {number} id - Person Id
 */
function getFirstLastFromId(id) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][0] == id) {
      return [
        Gpersons[1][i][3] === undefined ? "" : Gpersons[1][i][3].trim(),
        Gpersons[1][i][4] === undefined ? "" : Gpersons[1][i][4].trim(),
        Gpersons[1][i][3][0] + Gpersons[1][i][4][0]
      ];
    }
  }
  return ["NA", "NA", "NA"];
}

function getPersonEntryFromId(id) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][0] == id) {
      return Gpersons[1][i];
    }
  }
  return null; // should never happen...
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 */
function getEmployerCompany(pid) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][0] == pid) {
      return [Gpersons[1][i][8], Gpersons[1][i][7]];
    }
  }
  return [-1, "Unknown employer"];
}

function updateWelcome() {
  var welstring = "";
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][1].trim().valueOf() == Gusername.valueOf()) {
      // compare emails...
      welstring =
        welstring +
        "Welcome: " +
        " " +
        Gpersons[1][i][3].trim() +
        " " +
        Gpersons[1][i][4].trim() +
        "";
      welstring =
        welstring +
        '&nbsp;&nbsp;&nbsp;<A href="javascript:void(0);"  onclick="logout()">Log out!</A> &nbsp;&nbsp;&nbsp;';
      document.getElementById("welcome").innerHTML = welstring;
      return;
    }
  }
}

function logoutOK() {
  Gusername = null;
  Gtoken = null;
  Gemployer = null;
  Gcompanies = null;
  Gprojects = null;
  Gstrategies = null;
  Gcurrentdata = null;
  Gadmin = null;
  Gcurrentstrategy = null;
  Gcurrentuser = null;

  document.getElementById("prelogin-body").innerHTML = GpreloginBody;
  document.getElementById("postlogin-body").style.display = "none";
  // document.getElementById("admincontent").style.visibility = "hidden";
  // document.getElementById("loginstatus").innerHTML = "You have been successfully logged out";
}

function logout() {
  $.confirm({
    title: "Attention!",
    message: "Are you sure you want to log out?",
    buttons: {
      OK: {
        class: "blue",
        action: function() {
          logoutOK();
        }
      },
      Cancel: {
        class: "gray",
        action: function() {}
      }
    }
  });
}

function logout2() {
  myConfirm(
    "Confirm logout!",
    "Are you sure you want to logout",
    "OK",
    "Cancel",
    "logoutOK()"
  );
}

// obj has to be a DataTable object...
function refreshTable(obj) {
  setTimeout(function() {
    obj.fnAdjustColumnSizing();
  }, 1000);
}
/**
 * called when users api is successful.
 * @callback
 */
function usersReady(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("startupstatus", result[1], 0, true);
    return;
  }

  Gpersons = result;

  if (Gadmin > 0) {
    // GcompaniesBody = companiesTable();
    GbusBody = projectsTable();
    // GpersonsBody = personsTable();
    // GeditCommsBody = commTable();
    // document.getElementById("allstrategies").innerHTML = strategiesTableAdmin();
    // GeditProjectsBody = strategiesTableAdmin();
    // document.getElementById("projteams").innerHTML = teamTableAdmin();
    // GeditTeamsBody = teamTableAdmin();
    // document.getElementById("adminstrategies").innerHTML =  strategiesTable();
    // GmyProjectsBody = strategiesTable(1);
  } else {
    GmyProjectsBody = strategiesTable(1);
  }
  // updateWelcome();
  Gcurrentuser = getMyData();
  switchMainContents("myprojects");
}

function startupfailed(response) {
  myAlert("ERROR", "Operation failed" + response, "error");
}

var suffix = "--";

function waitCursor() {
  document.getElementById("whole-document").style.cursor = "wait";
}

function normalCursor() {
  document.getElementById("whole-document").style.cursor = "pointer";
}

function loadFAQ() {
  $.ajax({
    url: "faqitems",
    type: "GET",
    success: fillFAQArea,
    error: errorFAQ
    //,datatype: "json"
  });
}

function fillFAQArea(response) {
  var results = JSON.parse(response);
  if (results == null) {
    document.getElementById("faqarea").innerHTML =
      "Error in retrieving the FAQ";
    return;
  }
  var tabstring = "<table class=fancyTable width=100%>";
  tabstring =
    tabstring +
    "<TR><TD width=85%>Is there a video overview of this web page?</TD><TD align=center>" +
    '<A target="_blank" class="btn btn-cta-secondary" href="https://youtu.be/bnWmW0ugEaE">View Video</A></TD></TR>';
  tabstring =
    tabstring +
    "<TR><TD width=85%>is there a video on the basics of defining a query?</TD><TD align=center>" +
    '<A target="_blank" class="btn btn-cta-secondary" href="https://www.youtube.com/watch?v=YszvJIyDWyY">View Video</A></TD></TR>';
  tabstring =
    tabstring +
    "<TR><TD colspan=2 align=center> Click on a question to see the answer. </TD><TR>";
  for (var i = 0; i < results.length; i++) {
    var bname = "ans_" + i;
    tabstring =
      tabstring +
      '<TR><TD colspan=2><span style="cursor: pointer;" data-toggle="collapse" data-target="#' +
      bname +
      '">' +
      results[i][1] +
      '</span><BR> <DIV class="collapse" ID="' +
      bname +
      '"><blockquote>' +
      results[i][2] +
      "</blockquote></DIV></TD></TR>";
  }
  tabstring = tabstring + "</TABLE>";
  document.getElementById("faqarea").innerHTML = tabstring;
}

function errorFAQ() {
  document.getElementById("faqarea").innerHTML = "Faq retrieval did not work";
}

function gotoFAQ() {
  document.getElementById("faqarea").scrollIntoView();
}

function getCostDriverName(d) {
  if (Gcurrentdata[Gcdindex] == null) return "";
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    var element = Gcurrentdata[Gcdindex][i];
    var drivers = element[2];
    if (drivers != null) {
      for (var j = 0; j < drivers.length; j++)
        if (drivers[j][0] == d) return drivers[j][1];
    }
  }
  return "";
}

function getPersonName(p) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if ((p + "").valueOf() == (Gpersons[1][i][0] + "").valueOf()) {
      return Gpersons[1][i][3].trim() + " " + Gpersons[1][i][4].trim();
    }
  }

  return " ? ";
}

function clearDisplayArea(id) {
  $(".msgimg").css("display", "none");
  $(".errimg").css("display", "none");
  $("#wait").css("display", "none");
}

var selectedNode = [];

var done = 0;
var tree = [
  "root",
  100000,
  [
    [
      "AAAA",
      30000,
      [
        ["BBB", 40000, []],
        [
          "CCC",
          850000,
          [
            ["DDD", 300000, []],
            ["EEE", 400000, []]
          ]
        ]
      ]
    ],
    ["MMM", 300000, []]
  ]
];

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

function saveImWorksheet() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    var ss = parseInt(items[1]);
    var action = parseInt(items[2]);
    if (i < changedObjects.length - 1)
      setTimeout(saveSSAction(ss, action, 0), 1000);
    else setTimeout(saveSSAction(ss, action, 1), 1000);
  }
  changedObjects = [];
}

function saveRWorksheet() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    if (items.length == 2) {
      // ss the ss...
      var ss = parseInt(items[1]);
      if (i < changedObjects.length - 1) setTimeout(saveSS(ss, 0), 1000);
      else setTimeout(saveSS(ss, 1), 1000);
    } // must be risks / benefits that haave changed
    else {
      var ss = parseInt(items[1]);
      var k = parseInt(items[2]);
      var type = items[3];

      if (type.valueOf() == "benefit".valueOf()) {
        if (i < changedObjects.length - 1)
          setTimeout(saveSSBenefit(ss, k, 0), 1000);
        else setTimeout(saveSSBenefit(ss, k, 1), 1000);
      } else {
        if (i < changedObjects.length - 1)
          setTimeout(saveSSRisk(ss, k, 0), 1000);
        else setTimeout(saveSSRisk(ss, k, 1), 1000);
      }
    }
  }
  changedObjects = [];
}

function saveDWorksheet() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  // alert("# changed objects: " + changedObjects.length + " [ " + changedObjects + " ]");
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    if (items.length == 3) {
      // the details of the driver given by cenum, drivnum
      var cenum = parseInt(items[1]);
      var drivnum = parseInt(items[2]);
      if (i < changedObjects.length - 1)
        setTimeout(saveDSDriver(cenum, drivnum, 0), 1000);
      else setTimeout(saveDSDriver(cenum, drivnum, 1), 1000);
    } // must be strategic option that has changed -- so dig up the old text: defaultValue of the textarea
    else {
      var cenum = parseInt(items[1]);
      var drivnum = parseInt(items[2]);
      var costElement = Gcostdrivers[cenum][0];
      var driver = Gcostdrivers[cenum][2][drivnum][0];

      var so = parseInt(items[3]);
      var checked = document.getElementById(
        "socb-" + cenum + "-" + drivnum + "-" + so
      ).checked;
      var val = 0;
      if (checked) val = 1;
      if (i < changedObjects.length - 1)
        setTimeout(
          saveSO(
            costElement,
            driver,
            so,
            document.getElementById(
              "sotext-" + cenum + "-" + drivnum + "-" + so
            ).value,
            val,
            0
          ),
          1000
        );
      else
        setTimeout(
          saveSO(
            costElement,
            driver,
            so,
            document.getElementById(
              "sotext-" + cenum + "-" + drivnum + "-" + so
            ).value,
            val,
            1
          ),
          1000
        );
    }
  }
  changedObjects = [];
}

function saveMWorksheet() {
  // alert("# changed objects: " + changedObjects.length + " [ " + changedObjects + " ]");
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    var cenum = parseInt(items[1]);
    var drivnum = parseInt(items[2]);
    if (i < changedObjects.length - 1)
      setTimeout(saveDriver(cenum, drivnum, 0), 1000);
    else setTimeout(saveDriver(cenum, drivnum, 1), 1000);
  }
  changedObjects = [];
}

function saveIWorksheet() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var cid = changedObjects[i];
    var items = cid.split("-");
    var typestring = items[0];
    var rowstring = items[1];
    var row = parseInt(rowstring);
    if (typestring.valueOf() == "row".valueOf()) {
      // details of ce
      if (i < changedObjects.length - 1) setTimeout(saveNew(row, 0), 1000);
      else setTimeout(saveNew(row, 1), 1000);
    } // whether it is carried forward
    else {
      myAlert("ERROR", "TBD", "error");
      return;
    }
  }
}

function saveNew(ce, update) {
  // alert ("ce = " + ce + " update= " + update);
  if (ce == null) {
    myAlert("Attention!", "NO changed cost data to save", "error");
    return;
  }

  var impactable = "";
  if (document.getElementById("imp-" + ce) != null)
    impactable = document.getElementById("imp-" + ce).value;

  var fcf = "";
  if (document.getElementById("fcf-" + ce) != null)
    fcf = document.getElementById("fcf-" + ce).value;

  if (validNumber("amt-" + ce) == 0) {
    showTimedMessage("treesel", "Cost is not a valid number!", 0, true);
    return;
  }

  showTimedMessage("treesel", "Saving cost element details...", 0, false);
  if (update == 1) {
    $.ajax({
      url:
        "modify-critical-cost.php?project=" +
        Gcurrentstrategy +
        "&ce=" +
        encodeURIComponent(ce) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&cename=" +
        encodeURIComponent(document.getElementById("cename-" + ce).value) +
        "&dollars=" +
        encodeURIComponent(
          extractNumber(document.getElementById("amt-" + ce).value)
        ) +
        // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
        "&units=" +
        "&impactable=" +
        encodeURIComponent(impactable) +
        "&future=" +
        encodeURIComponent(fcf) +
        "&comment=" +
        encodeURIComponent(document.getElementById("comm-" + ce).value) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: iStepSaved,
      error: saveFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "modify-critical-cost.php?project=" +
        Gcurrentstrategy +
        "&ce=" +
        encodeURIComponent(ce) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&cename=" +
        encodeURIComponent(document.getElementById("cename-" + ce).value) +
        "&dollars=" +
        encodeURIComponent(
          extractNumber(document.getElementById("amt-" + ce).value)
        ) +
        // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
        "&units=" +
        "&impactable=" +
        encodeURIComponent(impactable) +
        "&future=" +
        encodeURIComponent(fcf) +
        "&comment=" +
        encodeURIComponent(document.getElementById("comm-" + ce).value) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: showTimedMessage("treesel", "element updated", 0, false),
      error: saveFailed
      //,datatype: "json"
    });
  }
}

function setCoastClear(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("treesel", result[1], 0, true);
  } else {
    showTimedMessage("treesel", "Cost element saved", 0, false);
  }
  coastClear = 1;
}

function deleteNewInternal2(ce, leaf, cename) {
  showTimedMessage("treesel", "Removing cost element...", 0, false);
  $.ajax({
    url:
      "delete-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iStepSaved,
    error: saveFailed
    //,datatype: "json"
  });
}

function deleteNewInternal(ce, leaf, cename) {
  $.confirm({
    title: "Attention!",
    message: "Remove " + cename + " ? Please confirm!",
    buttons: {
      OK: {
        class: "blue",
        action: function() {
          deleteNewInternal2(ce, leaf, cename);
        }
      },
      Cancel: {
        class: "gray",
        action: function() {}
      }
    }
  });
}

function deleteNew(ce, leaf, cename) {
  if (ce == null) {
    myAlert("Attention!", "NO selected cost to delete", "error");
    return;
  }

  if (leaf != 1) {
    myAlert(
      "Attention!",
      "You cannot remove a cost element with sub costs",
      "error"
    );
    return;
  }

  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you delete this cost element!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            deleteNewInternal(ce, leaf, cename);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else deleteNewInternal(ce, leaf, cename);
}

function findChild(node, child) {
  for (var i = 0; i < node[2]; i++)
    if (child.valueOf() == node[2][i][0].valueOf()) return i;
  return -1;
}

function actuallyAddChild(treenode, newnode) {
  treenode[2].unshift(newnode);
}

function omoveUp(treenode, node, parent) {
  done = 0;
  moveUp(treenode, node, parent);
}

function moveUp(treenode, node, parent) {
  if (treenode[0].valueOf() == node.valueOf()) {
    if (parent == null) alert("Cannot move the primary cost up");
    else {
      for (var j = 0; j < parent[2].length; j++) {
        if (parent[2][j][0].valueOf() == node.valueOf()) {
          if (j == 0) {
            alert("Selected cost element cannot move up any further");
            return;
          } else {
            var temp = parent[2][j];
            parent[2][j] = parent[2][j - 1];
            parent[2][j - 1] = temp;
            updateDBWithAdjustments();
          }
        }
      }
    }
  }
  for (var i = 0; i < treenode[2].length; i++)
    if (done == 0) moveUp(treenode[2][i], node, treenode);
}

function omoveDown(treenode, node, parent) {
  done = 0;
  moveDown(treenode, node, parent);
}

function moveDown(treenode, node, parent) {
  if (treenode[0].valueOf() == node.valueOf()) {
    if (parent == null) alert("Cannot move the root (primary cost) down");
    else {
      for (var j = 0; j < parent[2].length; j++) {
        if (parent[2][j][0].valueOf() == node.valueOf()) {
          if (j + 1 == parent[2].length) {
            alert("Selected cost element cannot move down any further");
            return;
          } else {
            var temp = parent[2][j];
            parent[2][j] = parent[2][j + 1];
            parent[2][j + 1] = temp;
            updateDBWithAdjustments();
            done = 1;
            return;
          }
        }
      }
    }
  }
  for (var i = 0; i < treenode[2].length; i++)
    if (done == 0) moveDown(treenode[2][i], node, treenode);
}

// reset selection after tree change
function resetSelection() {
  var elements = document.getElementsByName("treeselect");
  for (var i = 0; i < elements.length; i++) {
    if (elements[i].value.valueOf() == selectedNode[7].valueOf()) {
      elements[i].checked = true;
      return;
    }
  }
}

// call this with the main tree, node to find, and child to add
var counter = 0;

function addChildNewInternal(type, ce) {
  showTimedMessage("treesel", "Adding sub cost...", 0, false);
  $.ajax({
    url:
      "add-child-cost.php?project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&costtype=" +
      encodeURIComponent(type) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iStepSaved,
    error: saveFailed
    //,datatype: "json"
  });

  return;
}

function addChildNew(type, ce) {
  if (ce == null) {
    // root node
    ce = -1;
  }
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you add a cost element!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            addChildNewInternal(type, ce);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else addChildNewInternal(type, ce);
}

function addSiblingNew() {
  if (selectedNode == null || selectedNode.length < 8) {
    showTimedMessage("treesel", "No current node to add child", 0, true);
    return;
  }
  showTimedMessage("treesel", "Adding peer cost...", 0, false);
  $.ajax({
    url:
      "add-sibling-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(selectedNode[7]) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iStepSaved,
    error: saveFailed
    //,datatype: "json"
  });
  return;
}

function addChild(treenode, node, child) {
  if (treenode[0].valueOf() == node.valueOf()) {
  }
  for (var i = 0; i < treenode[2].length; i++)
    addChild(treenode[2][i], node, child);
}

// call this with the main tree, node to find, sibling to add, and parent (initially null for the root)

function oFindNode(tree, ce) {
  done = 0;
  findNode(tree, ce);
}

function findNode(ltree, ce) {
  // ltree[7] is the cost element - and it can be null for some of tree nodes
  if (ltree[7] != null && (ltree[7] + "").valueOf() == (ce + "").valueOf()) {
    done = 1;
    selectedNode = ltree;
    return;
  }
  if (ltree[2] == null) return;
  for (var i = 0; i < ltree[2].length; i++) {
    if (done == 0) findNode(ltree[2][i], ce);
    else return;
  }
}

// now called with the cost element
function setSelection(node, treenum) {
  oFindNode(costTree[treenum], node);

  document.getElementById("treesel").innerHTML =
    "Cost element selected: " + selectedNode[0];
  document.getElementById("costname").value = selectedNode[0];
  document.getElementById("costval").value = selectedNode[1];
  // document.getElementById('costcurr').value = selectedNode[8];
  document.getElementById("impactable").value = selectedNode[3];
  document.getElementById("future").value = selectedNode[4];
  document.getElementById("cecomment").value = selectedNode[5];
}
var updateElements = [];

var checkBoxID;

function makeCriticalInternal(imp, fcf, i, leaf, treenumber) {
  var val = document.getElementById("cb-" + i).checked;

  var checkBoxiD = "cb-" + i;
  var res = 0;
  if (val) res = 1;

  if (res == 1) {
    // this cost is being carried forward
    oFindNode(costTree[treenumber], i);
    var node = selectedNode;
    if (node[2] != null) {
      for (var j = 0; j < node[2].length; j++) {
        var child = node[2][j];
        var childcb = document.getElementById("cb-" + child[7]);
        if (childcb != null && childcb.checked) {
          myAlert(
            "Attention!",
            "A child cost element of this cost element is already being carried forward!",
            "error"
          );
          document.getElementById("cb-" + i).checked = false;
          return;
        }
      }
    }
    if (node[9] != null) {
      var parentcb = document.getElementById("cb-" + node[9][7]);
      if (parentcb != null && parentcb.checked) {
        myAlert(
          "Attention!",
          "Parent cost element is already being carried forward!",
          "error"
        );
        document.getElementById("cb-" + i).checked = false;
        return;
      }
    }
  }

  var comment = document.getElementById("comm-" + i).value; // default comment...
  var newcomment = "";

  if (val == 1) {
    if (
      imp.valueOf() != "YES".valueOf() ||
      fcf.valueOf() != "YES".valueOf() ||
      leaf == 0
    ) {
      newcomment = prompt(
        "You have requested to carry forward a cost driver that is not impactable. Please document this departure from the recommended AIM&DRIVE process with a comment:",
        ""
      );
      if (newcomment == null || newcomment.valueOf() == "".valueOf()) {
        document.getElementById("cb-" + i).checked = false;
        return;
      }
    }
  }

  showTimedMessage(
    "treesel",
    "Updating selected cost elements to carry forward...",
    0,
    false
  );
  $.ajax({
    url:
      "set-critical-cost-element.php?project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      i +
      "&criticalp=" +
      encodeURIComponent(res) +
      "&comment=" +
      encodeURIComponent(comment + "\n" + newcomment) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iStepSaved,
    error: saveFailed
    //,datatype: "json"
  });
}

function makeCritical(imp, fcf, i, leaf, treenumber) {
  var val = document.getElementById("cb-" + i).checked;
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you change this checkbox now!  Do you want to go ahead  (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            makeCriticalInternal(imp, fcf, i, leaf, treenumber);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {
            document.getElementById("cb-" + i).checked = !val;
          }
        }
      }
    });
  } else makeCriticalInternal(imp, fcf, i, leaf, treenumber);
}

function iCarryForwardStep(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() != "".valueOf())
    // error
    document.getElementById(checkBoxID).checked = true;
  else iStepSaved(response);
}

var allAdjustments = [];

function getAdjustments(node, level) {
  var adjustment = [node[7], level, costOrder];
  if (level > 0) {
    allAdjustments.push(adjustment);
  }

  costOrder++;

  for (
    var k = 0;
    k < node[2].length;
    k++ // the children
  ) {
    getAdjustments(node[2][k], level + 1);
  }
}

function oGetAdjustments(node, level) {
  allAdjustments = [];
  costOrder = 1;
  getAdjustments(node, level);
}

var tdColor = "#E3E3E3";

var oldCheckBoxValues = [];
var oldSelectValues = [];

function renderTree(node, level) {
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";

  var nodestring = "";
  if (node[5] == null) node[5] = "";
  var uElement = [
    '"' + node[0] + '"',
    level,
    costOrder,
    '"' + node[1] + '"',
    '"' + node[3] + '"',
    '"' + node[4] + '"',
    '"' + node[5] + '"',
    '"' + node[6] + '"',
    node[7],
    node[8]
  ];
  var updateElement = "( ";
  updateElement =
    updateElement +
    '"' +
    node[0] +
    '"' +
    " " +
    level +
    " " +
    costOrder +
    " " +
    '"' +
    node[1] +
    '"' +
    " " +
    '"' +
    node[3] +
    '"' +
    " " +
    '"' +
    node[4] +
    '"' +
    " " +
    '"' +
    node[5] +
    '"' +
    " " +
    '"' +
    node[6] +
    '" ' +
    node[7] +
    ")";
  if (level > 0) {
    updateForm = updateForm + updateElement;
    updateElements.push(uElement);
  }

  var root = 0;
  if (level == 0) root = 1;
  costOrder++;
  rowCount++;

  var auto = 0;
  if (node[0].search("auto created") > -1) auto = 1;
  var omit = 0;

  // if (auto && (node[1] == 0 || (node[1]+"").valueOf() == "0".valueOf() || (node[1]+"").valueOf() == "-0".valueOf() || (node[1]+"").valueOf() == "+0".valueOf())) omit = 1;
  if (auto && Math.round(node[1]) == 0) omit = 1;

  var costtype = node[10];

  var leaf = 1;
  if (node[2] != null && node[2].length > 0) leaf = 0;

  var rowclass = "";
  if (rowCount % 2 == 0) rowclass = ' class="odd" ';
  nodestring = nodestring + "<TR " + rowclass + ">";
  // nodestring = nodestring + '<TD align=center width=40 bgcolor="#E3E3E3">';
  // nodestring = nodestring + '<input type=radio name="treeselect"  value="' + node[7] + '" id="treeselect" onClick="setSelection(node[7] + ', ' + node[10] + ')"> </TD>'
  if (auto == 1 || Gadmin == 0)
    nodestring = nodestring + '<TD width=40 bgcolor="#E3E3E3">&nbsp;</TD>';
  else
    nodestring =
      nodestring +
      '<TD width=40 align=center bgcolor="#E3E3E3"><div style="opacity: 0.4;"><input type=image src="images/plus.png" title="Add a sub cost" onClick="addChildNew(' +
      costtype +
      ", " +
      node[7] +
      ')"></div></TD>';
  if (level != 0 && auto != 1 && Gadmin == 1) {
    nodestring =
      nodestring +
      '<TD align=center width=40 bgcolor="#E3E3E3"><div style="opacity: 0.4;"><input type=image src="images/trash20.png" title="Delete cost element" onClick="deleteNew(' +
      node[7] +
      ", " +
      leaf +
      ", " +
      node[0] +
      ')"></div></TD>';
    // nodestring = nodestring + '<TD align=center width=40 bgcolor="#E3E3E3"><input type=image src="images/save-24.png" title="Save cost element" onClick="saveNew(' + node[7] + ')"></TD>';
  } else {
    nodestring = nodestring + '<TD bgcolor="#E3E3E3">&nbsp;</TD>';
    //	nodestring = nodestring + '<TD bgcolor="#E3E3E3">&nbsp;</TD>';
  }

  nodestring = nodestring + '<TD width=40 align=center bgcolor="#E3E3E3"> ';
  nodestring =
    nodestring +
    '<SPAN class="llevel' +
    (level + 1) +
    '">&nbsp;' +
    (level + 1) +
    "&nbsp;</SPAN>";
  nodestring = nodestring + '</TD><TD width=47% bgcolor="#E3E3E3">';
  var indent = "&nbsp;&nbsp;&nbsp;";
  for (var m = 0; m < level; m++)
    indent = indent + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

  var ceid = "cename-" + node[7];
  var amtid = "amt-" + node[7];
  var commid = "comm-" + node[7];
  var prefixes = "[cename, amt, comm]";
  var selprefixes = "[imp, fcf]";
  var checkprefixes = "[cb]";

  var length = 56;
  if (level == 0) length = 68;
  else if (level == 1) length = 65;
  else if (level == 2) length = 62;
  else if (level == 3) length = 59;

  if (level > 0 && auto == 0)
    nodestring =
      nodestring +
      indent +
      '<input  onInput="fixTextRowClass(' +
      prefixes +
      ", " +
      node[7] +
      ')" type=text id="' +
      ceid +
      '" size=' +
      length +
      ' class="level' +
      (level + 1) +
      '" value="' +
      node[0] +
      '" ' +
      disabled +
      "></TD>";
  // the cost
  else
    nodestring =
      nodestring +
      indent +
      '<input  type=text id="' +
      ceid +
      '" size=' +
      length +
      ' class="level' +
      (level + 1) +
      '" value="' +
      node[0] +
      '" readonly></TD>'; // the cost
  if (level > 0 && auto == 0) {
    if (Gadmin == 1)
      nodestring =
        nodestring +
        '<TD align=right width=10% bgcolor="#E3E3E3"><input onInput="fixTextRowClass(' +
        prefixes +
        ", " +
        node[7] +
        ')" type=text class="level' +
        (level + 1) +
        '" style="text-align: right;" size=10 id="' +
        amtid +
        '" onClick="selectAll(' +
        amtid +
        ')" value="' +
        CurrencyFormat("" + node[1], "", 0, "", ",") +
        '"></TD>';
    // actual cost (a number)
    else
      nodestring =
        nodestring +
        '<TD align=right width=15% bgcolor="#E3E3E3">' +
        CurrencyFormat("" + node[1], "", 0, "", ",") +
        "</TD>"; // actual cost (a number)
  } else if (auto != 0)
    nodestring =
      nodestring +
      '<TD align=right width=15% bgcolor="#E3E3E3"> <div class="llevel' +
      (level + 1) +
      '"><font color=blue>' +
      CurrencyFormat("" + node[1], "", 0, "", ",") +
      "</font></div></TD>";
  // actual cost (a number)
  else
    nodestring =
      nodestring +
      '<TD align=right width=15% bgcolor="#E3E3E3"> <div class="llevel' +
      (level + 1) +
      '"> <b>' +
      CurrencyFormat("" + node[1], "", 0, "", ",") +
      "</b></div></TD>"; // actual cost (a number)

  var percent = "&nbsp;";
  if (root == 1) percent = "100 %";
  // else if (leaf == 1) percent = numberFormat((node[1]/bigCost[costtype]) * 100, 2) + " %";
  else percent = numberFormat((node[1] / bigCost[costtype]) * 100, 2) + " %";

  var eventspec =
    ' onChange="fixSelRowClass(' + selprefixes + ", " + node[7] + ')"  ';

  if (root == 1)
    nodestring =
      nodestring +
      '<TD align=center  class="llevel' +
      (level + 1) +
      '" width=8% ><div class="llevel' +
      (level + 1) +
      '"><b>' +
      percent +
      "&nbsp;</b></div></TD>";
  else if (auto == 1)
    nodestring =
      nodestring +
      '<TD align=center  class="llevel' +
      (level + 1) +
      '" width=8% ><div class="llevel' +
      (level + 1) +
      '"><font color="blue">' +
      percent +
      "&nbsp;</font></div></TD>";
  else if (leaf == 1)
    nodestring =
      nodestring +
      '<TD align=center  class="llevel' +
      (level + 1) +
      '" width=8%><div class="llevel' +
      (level + 1) +
      '">' +
      percent +
      "&nbsp;</div></TD>";
  else
    nodestring =
      nodestring +
      '<TD align=center  class="llevel' +
      (level + 1) +
      '" width=8%><div class="llevel' +
      (level + 1) +
      '"><font color="red"> ' +
      percent +
      " &nbsp;</font></div></TD>";
  // nodestring = nodestring + '<TD width=7%>' + node[8] + '</TD>'; // units
  if (level > 0 && auto == 0) {
    if (Gadmin == 1) {
      nodestring =
        nodestring +
        '<TD align=center width=6% bgcolor="#E3E3E3">' +
        generateSelectDefaultEventClass(
          "imp-" + node[7],
          ["YES", "NO", ""],
          node[3],
          eventspec,
          level + 1
        ) +
        "</TD>"; // impactable
      nodestring =
        nodestring +
        '<TD align=center width=6% bgcolor="#E3E3E3">' +
        generateSelectDefaultEventClass(
          "fcf-" + node[7],
          ["YES", "NO", ""],
          node[4],
          eventspec,
          level + 1
        ) +
        "</TD>"; // future cash flow
      setOldSelectValue("imp-" + node[7], node[3]);
      setOldSelectValue("fcf-" + node[7], node[4]);
    } else {
      nodestring =
        nodestring +
        '<TD width=6% bgcolor="#E3E3E3">&nbsp;' +
        node[3] +
        "&nbsp;</TD>";
      nodestring =
        nodestring +
        '<TD width=6% bgcolor="#E3E3E3">&nbsp;' +
        node[4] +
        "&nbsp;</TD>";
    }
  } else {
    nodestring = nodestring + '<TD width=6% bgcolor="#E3E3E3">&nbsp;</TD>';
    nodestring = nodestring + '<TD width=6% bgcolor="#E3E3E3">&nbsp;</TD>';
  }

  if (level > 0 && auto == 0) {
    if (Gadmin == 1)
      nodestring =
        nodestring +
        '<TD width=20% bgcolor="#E3E3E3"> <textarea  class="level' +
        (level + 1) +
        '" onInput="fixTextRowClass(' +
        prefixes +
        ", " +
        node[7] +
        ')" rows=2 cols=30 id="' +
        commid +
        '" onClick="selectAll(' +
        commid +
        ')" >' +
        node[5] +
        "</textarea></TD>";
    else nodestring = nodestring + '<TD bgcolor="#E3E3E3">' + node[5] + "</TD>";
  } else nodestring = nodestring + '<TD bgcolor="#E3E3E3">&nbsp;</TD>';

  var checked = "";
  if (node[6].valueOf() == "YES".valueOf()) checked = "checked";

  if (level > 0 && auto == 0) {
    (nodestring =
      nodestring +
      '<TD align=center  bgcolor="#E3E3E3">' +
      '<input type=checkbox onClick="makeCritical(node[3] + '),
      node[4] +
        ", " +
        node[7] +
        "," +
        leaf +
        ", " +
        node[10] +
        ')" id="cb-' +
        node[7] +
        '" ' +
        checked +
        disabled +
        ">" +
        "</TD></TR>";
    //	nodestring = nodestring + '<TD align=center  bgcolor="#E3E3E3">' + '<div id="cbcont-' + node[7] + '"><input type=checkbox onchange="fixCheckBoxRowClass(' + checkprefixes + ', ' + node[7] + ')" id="cb-' + node[7] + '" ' + checked + disabled + ' ></div>' + '</TD></TR>';
    if (checked.valueOf() == "".valueOf())
      setOldCheckBoxValue("cb-" + node[7], "");
    else setOldCheckBoxValue("cb-" + node[7], "checked");
  } else nodestring = nodestring + '<TD bgcolor="#E3E3E3">&nbsp;</TD></TR>';

  if (omit == 1) nodestring = "";
  for (
    var k = 0;
    k < node[2].length;
    k++ // the children
  ) {
    nodestring = nodestring + renderTree(node[2][k], level + 1);
  }
  return nodestring;
}

function computeRemainingCosts(treenode) {
  if (treenode[0].search("auto created") > -1) {
    var parentTotal = treenode[9][1];
    var childTotal = 0;
    if (treenode[9] != null) {
      for (var i = 0; i < treenode[9][2].length - 1; i++) {
        var val = treenode[9][2][i][1];
        if (typeof val == "string") val = parseFloat(val);
        childTotal = childTotal + val;
      }
      treenode[1] = parentTotal - childTotal;
    }
  }
  for (var j = 0; j < treenode[2].length; j++)
    computeRemainingCosts(treenode[2][j]);
}

function refreshIStep() {
  if (Gcurrentdata[Gprimeindex] == null || Gcurrentdata[Gprimeindex][0] == null)
    return;
  costTree = [
    [
      Gcurrentdata[Gprimeindex][0],
      Gcurrentdata[Gprimeindex][1],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      0
    ],
    [
      "Acquisition Cost",
      Gcurrentdata[Gprimeindex][5],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      1
    ],
    [
      "Usage Cost",
      Gcurrentdata[Gprimeindex][6],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      2
    ],
    [
      "End of Life Cost",
      Gcurrentdata[Gprimeindex][7],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      3
    ]
  ];

  // make the ce the last value (we need this to do saves in incremental fashion)
  var parents = [
    [
      costTree[0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0]
    ],
    [
      costTree[1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1]
    ],
    [
      costTree[2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2]
    ],
    [
      costTree[3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3]
    ]
  ];
  var currentlevel = 0;
  var currentcost = 0; // indicates the tree number
  if (Gcurrentdata[Gelementsindex] != null) {
    // this will be an array: 1st entry has cost element details;
    // 2nd entry has a list of critical cost elements -- determined by the user
    if (Gcurrentdata[Gelementsindex][0] != null) {
      for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
        var element = Gcurrentdata[Gelementsindex][0][i];
        var ce = element[0];
        var cename = element[1];
        var level = element[2];
        var val = element[4];
        if (typeof val == "string") val = parseFloat(val);
        var imp = element[5];
        var fut = element[6];
        var com = element[7];
        var ordering = element[3];
        var costtype = element[10];
        if (typeof costtype == "string") costtype = parseInt(costtype); // should be 0, 1, 2, or 3...
        var selected = "NO";

        // see if the cost element is listed as critical going forward
        if (Gcurrentdata[Gelementsindex][1] != null) {
          for (var k = 0; k < Gcurrentdata[Gelementsindex][1].length; k++) {
            if (
              (ce + "").valueOf() ==
              (Gcurrentdata[Gelementsindex][1][k] + "").valueOf()
            )
              selected = "YES";
          }
        }
        // last "" ==> is the units of the value/future
        // cost element key: fcf == 4, impactable == 3, selected == 6, comment == 5, ordering == 8
        var newnode = [
          cename,
          val,
          [],
          imp,
          fut,
          com,
          selected,
          ce + "",
          ordering,
          null,
          costtype
        ];

        if (level == currentlevel + 1) {
          // make it a child of the prior level top of the stack
          parents[costtype][currentlevel][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel];
        } else if (level == currentlevel) {
          // sibling
          parents[costtype][currentlevel - 1][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel - 1];
        } // we are going back to an earlier node
        else {
          parents[costtype][level - 1][2].push(newnode);
          newnode[9] = parents[costtype][level - 1];
        }
        parents[costtype][level] = newnode;
        currentlevel = level;
      }
    }
  }
  computeRemainingCosts(costTree[0]);
  computeRemainingCosts(costTree[1]);
  computeRemainingCosts(costTree[2]);
  computeRemainingCosts(costTree[3]);
}

function saveFailed(response) {
  showTimedMessage("treesel", "Operation failed", 0, true);
}

// code to trigger cost estimates submit on hitting enter.

var input = document.getElementById("ce_value");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("ce_submit").click();
  }
});

function saveCostBreakDown() {
  var updateForm = "(";
  for (var i = 0; i < updateElements.length; i++) {
    updateForm = updateForm + "(";
    for (var j = 0; j < updateElements[i].length - 1; j++) {
      updateForm = updateForm + " " + updateElements[i][j];
    }
    if (document.getElementById(i + 3 + "").checked)
      updateForm = updateForm + ' "YES" ';
    else updateForm = updateForm + ' "NO" ';

    updateForm = updateForm + ")";
  }
  updateForm = updateForm + ")";
  // alert(updateForm);
  showTimedMessage("treesel", "Saving worksheet...", 0, false);
  $.ajax({
    url:
      "save-cost-breakdown?project=" +
      Gcurrentstrategy +
      "&elements=" +
      encodeURIComponent(updateForm) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iStepSaved,
    error: saveFailed
    //,datatype: "json"
  });
}

var rowCount = 0;
var costOrder = 1;
var updateForm = "";
var bigCost = [];

function renderFullTree() {
  oldCheckBoxValues = [];
  oldSelectValues = [];
  updateForm = "( ";
  updateElements = [];
  costOrder = 1;
  rowCount = 0;
  var treestring =
    '<h4>Old School Contents</h4><div id="treesel"></div>' +
    injectModals() +
    '<div style="height: 600px; width: 100%;"><TABLE id="itab" class="fancyTableBorder" width=100% cellpadding=2 cellspacing=1><thead width=100%><TR><TH >Add</TH><TH>Delete</TH><TH >Level</TH><TH>Critical Cost</TH><TH>Cost ';
  treestring = treestring + "&nbsp;( " + getProjectCurrency() + " )";
  treestring =
    treestring +
    "&nbsp;</TH><TH>Percent</TH><TH >Impactable</TH><TH>Future cash flow</TH><TH>Comments</TH><TH ALIGN=center>Select</TH></TR></thead><tbody>";
  changedObjects = [];
  treestring = treestring + renderTree(costTree[0], 0);
  treestring = treestring + renderTree(costTree[1], 0);
  treestring = treestring + renderTree(costTree[2], 0);
  treestring = treestring + renderTree(costTree[3], 0);
  treestring = treestring + "</tbody></TABLE></div>";
  // treestring = treestring + '<div id="treesel"></div>';
  document.getElementById("Identify-body").innerHTML = treestring;

  if (selectedNode != null && selectedNode.length > 0) {
    resetSelection();
  }
}

function arrayClone(arr) {
  var i, copy;

  if (Array.isArray(arr)) {
    copy = arr.slice(0);
    for (var i = 0; i < copy.length; i++) {
      copy[i] = arrayClone(copy[i]);
    }
    return copy;
  } else if (arr != null && typeof arr === "object") {
    throw "Cannot clone array containing an object!";
  } else {
    return arr;
  }
}

function validNumber(id) {
  var reg = /^\d+$/;
  var number = document.getElementById(id);
  return reg.test(number.value);
}

function extractNumber(str) {
  var cstr = "";
  var strcomponents = str.split(" ");
  if (strcomponents[0].length != str.length)
    // there was a space
    str = strcomponents[1]; // the 2nd element has the comma separated number...

  for (var i = 0; i < str.length; i++)
    if ((str[i] >= "0" && str[i] <= "9") || str[i] == "." || str[i] == "-")
      cstr = cstr + str[i];
  if (cstr.length > 0) return parseFloat(cstr);
  else return 0;
}

// each call needs to provide the right parameters...
function CurrencyFormat(
  number,
  units,
  decimalplaces,
  decimalcharacter,
  thousandseparater
) {
  number = parseFloat(number);
  var sign = number < 0 ? "-" : "";
  var formatted = new String(number.toFixed(decimalplaces));
  if (decimalcharacter.length && decimalcharacter != ".") {
    formatted = formatted.replace(/\./, decimalcharacter);
  }
  var integer = "";
  var fraction = "";
  var strnumber = new String(formatted);
  var dotpos = decimalcharacter.length
    ? strnumber.indexOf(decimalcharacter)
    : -1;
  if (dotpos > -1) {
    if (dotpos) {
      integer = strnumber.substr(0, dotpos);
    }
    fraction = strnumber.substr(dotpos + 1);
  } else {
    integer = strnumber;
  }
  if (integer) {
    integer = String(Math.abs(integer));
  }
  while (fraction.length < decimalplaces) {
    fraction += "0";
  }
  temparray = new Array();
  while (integer.length > 3) {
    temparray.unshift(integer.substr(-3));
    integer = integer.substr(0, integer.length - 3);
  }
  temparray.unshift(integer);
  integer = temparray.join(thousandseparater);

  return units + " " + sign + integer + decimalcharacter + fraction;
}

function numberFormat(original, decimals) {
  var multiplier = Math.pow(10, decimals);
  // return Math.round(original*multiplier)/multiplier ;
  return (Math.round(original * multiplier) / multiplier).toFixed(decimals);
}

function getTitle(prefix) {
  for (var i = 0; i < Gtitles.length; i++) {
    if (Gtitles[i][0].valueOf() == prefix.valueOf()) return Gtitles[i][1];
  }
  return "undefined??";
}

function updateHeader(left, middle, right) {
  setEDGenericHeader(left + "-" + middle + "-" + right);
}

function getProjectCurrentStatus(project) {
  for (i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == project) return Gstrategies[i][12];
  }
  return "Project not found";
}

var GcompanyFilter = "All";
var GsupplierFilter = "All";

function filterBySupplier() {
  var val = document.getElementById("selectSupp").value;
  if (val == null) return;
  GsupplierFilter = val;
  // alert("company filter changed to : " + GcompanyFilter);
  setEDMyProjectsBody();
}

function filterByCompany() {
  var val = document.getElementById("selectComp").value;
  if (val == null) return;
  GcompanyFilter = val;
  // alert("company filter changed to : " + GcompanyFilter);
  setEDMyProjectsBody();
}

function includeStrategyP(id) {
  // id is a strategy id
  if (GcompanyFilter.valueOf() == "All".valueOf()) return true; // every company is in...
  var cid = getCompanyForProject(id);
  if ((cid + "").valueOf() == GcompanyFilter.valueOf()) return true;
  return false;
}

function includeSupplierP(id) {
  if (GsupplierFilter.valueOf() == "All".valueOf()) return true; // every company is in...
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][0] == id) {
      for (var j = 0; j < Gstrategies[i][9].length; j++) {
        if (
          (Gstrategies[i][9][j][0] + "").valueOf() == GsupplierFilter.valueOf()
        )
          return true;
      }
    }
  }
  return false;
}
/**
 * Prepares the html post login. The projects table is prepared.
 */
function setEDMyProjectsBody() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    "<!-- people list -->" +
    '<div class="col-lg-12 col-md-12 col-sm-12 people_list">' +
    '<div class="sec_head">' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<strong>Status:</strong><select id="selectFilter" onChange="filterMyProjectsContents()" class="table_ctrls select_filter">';

  var allOption = "",
    droppedOption = "",
    activeOption = "",
    completedOption = "";
  if (GprojectFilterSetting.valueOf() == "Active".valueOf())
    activeOption = " selected";
  if (GprojectFilterSetting.valueOf() == "Dropped".valueOf())
    droppedOption = " selected";
  if (GprojectFilterSetting.valueOf() == "Completed".valueOf())
    completedOption = " selected";
  if (GprojectFilterSetting.valueOf() == "All".valueOf())
    allOption = " selected";

  body =
    body +
    '<option value="All" ' +
    allOption +
    ">All </option>" +
    '<option value="Active" ' +
    activeOption +
    ">Active </option>" +
    '<option value="Completed" ' +
    completedOption +
    ">Completed </option>" +
    '<option value="Dropped" ' +
    droppedOption +
    "> Dropped</option>" +
    // '<option value="Completed">Completed </option>' +
    "</select>" +
    // '<a href="#" class="searchbox"><img src="images/search_icon.png" /> </a>' +
    '<input type="text" id="search_project" onKeyUp="filterProjectsTable()"  class="search_input" placeholder="Search ....">' +
    '<img src="images/search_icon.png" />';

  if (Gadmin == 1) {
    if (Gemployer == 1) {
      body = body + "<strong>Client:</strong>";
      body =
        body +
        '<select id="selectComp" onChange="filterByCompany()" class="table_ctrls select_filter">';
      body = body + '<option value="All">All</option>';
      for (var i = 0; i < Gcompanies.length; i++) {
        if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
        var selString = "";
        if ((Gcompanies[i][0] + "").valueOf() == GcompanyFilter)
          selString = " selected";
        body =
          body +
          '<option value="' +
          Gcompanies[i][0] +
          '" ' +
          selString +
          ">" +
          Gcompanies[i][1] +
          "</option>";
      }
      body = body + "</select>";
    }
    body = body + "<strong>Supplier:</strong>";
    body =
      body +
      '<select id="selectSupp" onChange="filterBySupplier()" class="table_ctrls select_filter">';
    body = body + '<option value="All">All</option>';

    for (var i = 0; i < Gsuppliers.length; i++) {
      var selString = "";
      if ((Gsuppliers[i][1] + "").valueOf() == GsupplierFilter)
        selString = " selected";
      body =
        body +
        '<option value="' +
        Gsuppliers[i][1] +
        '" ' +
        selString +
        ">" +
        Gsuppliers[i][0] +
        "</option>";
    }
    body = body + "</select>";
  }

  if (Gadmin == 1) {
    body =
      body +
      // '<a href="#" class=" table_ctrls searchbox"><img src="images/search_icon.png" /></a>' +

      '<div class="rt_ctrls pull-right">' +
      '<a href="javascript:void(0);"  class="btn prmary_btn" onClick="addEDProject()" id="openprojects_modal">' +
      '<i class="fa fa-plus" aria-hidden="true"></i> Project' +
      "</a>" +
      "</div>";
  }

  body =
    body +
    "</div>" +
    '<div class="projects_table_wrp">' +
    '<table class="table projects_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting sortable asc">Project</th>' +
    '<th width="20%" class="sortable">Client</th>' +
    '<th width="15%" class="sortable">Supplier</th>' +
    '<th width="15%" class="sortable">Current step</th>' +
    '<th width="15%" class="sortable">Last edited</th>' +
    '<th width="5%" ></th>' +
    "</tr>" +
    "</thead></table>";
  body +=
    '<div class="projects_scroll cus_scroll">' +
    '<table class="table sort_table projects_table table-striped " id="projects_table"><tbody>';

  var selectedStrategies = Gstrategies;

  if (selectedStrategies.length) {
    for (i = 0; i < selectedStrategies.length; i++) {
      if (
        !includeStrategyP(selectedStrategies[i][0]) ||
        !includeSupplierP(selectedStrategies[i][0])
      )
        continue;
      //if (!includeSupplierP(selectedStrategies[i][0])) continue;
      var status = selectedStrategies[i][GstatusIndex];

      if (status.valueOf() == "INACTIVE".valueOf()) {
        status = "Dropped";
        if (
          GprojectFilterSetting.valueOf() == "Active".valueOf() ||
          GprojectFilterSetting.valueOf() == "Completed".valueOf()
        )
          continue;
      } else if (status.valueOf() == "COMPLETED".valueOf()) {
        status = "Completed";
        if (
          GprojectFilterSetting.valueOf() == "Dropped".valueOf() ||
          GprojectFilterSetting.valueOf() == "Active".valueOf()
        )
          continue;
      } else {
        status = "Active";
        if (
          GprojectFilterSetting.valueOf() == "Dropped".valueOf() ||
          GprojectFilterSetting.valueOf() == "Completed".valueOf()
        )
          continue;
      }
      body =
        body +
        '<tr  class="projects_data ">' + //  class="projects_data"  had to be taken out for some reason...
        '<td width="30%">' +
        '<h5 class="project_name"><a class="projlink" href="#" title="Select this project" onClick="selectStrategy(' +
        selectedStrategies[i][0] +
        ')"><strong>' +
        selectedStrategies[i][4] +
        "</strong></a></h5> ";

      if (status.valueOf() == "Dropped".valueOf())
        body = body + '<span class="project_status">Dropped</span><br>';

      body =
        body +
        '<p class="project_desc">' +
        selectedStrategies[i][5] +
        "</p>" +
        "</td>" +
        '<td width="20%"><strong>' +
        selectedStrategies[i][1][1] +
        '</strong><p class="client_dept">' +
        selectedStrategies[i][3][1] +
        "</p>" +
        "</td>" +
        '<td width="15%">';

      if (selectedStrategies[i][9] != null) {
        for (var j = 0; j < selectedStrategies[i][9].length; j++) {
          body =
            body +
            "<strong>" +
            selectedStrategies[i][9][j][1] +
            "</strong><br>";
          //
        }
      }

      var statusDisplay = "";
      if (status.valueOf() == "Completed".valueOf())
        statusDisplay =
          '<br><span class="Priority_type high_priority">Completed</span>';
      body =
        body +
        "</td>" +
        '<td width="15%"><span class="cur_step">' +
        selectedStrategies[i][12] +
        "</span>" +
        statusDisplay +
        "</td>" +
        '<td width="15%">' +
        getPrintDate(selectedStrategies[i][7]) +
        "</td>" +
        '<td width="5%">';

      if (Gadmin == 1) {
        body =
          body +
          '<div class="projects_opt">' +
          '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
          '<div class="opt_btn_wrp"> ' +
          '<ul class="other_action">                                         ' +
          '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDProject(' +
          i +
          ')"> Edit Project</a> </li>' +
          '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDProject(' +
          selectedStrategies[i][0] +
          ')"> Drop Project</a> </li>' +
          "</ul> " +
          "</div>" +
          "</div>";
      }
      body = body + "</td>" + "</tr>";
    }
  } else {
    body += '<tr><td colspan="5">No Data Available</td></tr>';
  }
  body = body + "</table></div>" + "</div>" + "</div>  " + "</div>" + "</div>";

  document.getElementById("mainbody").innerHTML = body;
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  $(".sortable").click(function() {
    var o = $(this).hasClass("asc") ? "desc" : "asc";
    $(".sortable")
      .removeClass("asc")
      .removeClass("desc");
    $(this).addClass(o);
    var colIndex = $(this).prevAll().length;
    sort(colIndex, o);
  });
}

function setEDMyProjectsBodySaved() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    "<!-- people list -->" +
    '<div class="col-lg-12 col-md-12 col-sm-12 people_list">' +
    '<div class="sec_head">' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<!--- <a href="#" class="table_ctrls archive_select">Active (0)</a> -->' +
    '<select id="selectFilter" onChange="filterMyProjectsContents()" class="table_ctrls select_filter">';

  var allOption = "",
    droppedOption = "",
    activeOption = "",
    completedOption = "";
  if (GprojectFilterSetting.valueOf() == "Active".valueOf())
    activeOption = " selected";
  if (GprojectFilterSetting.valueOf() == "Dropped".valueOf())
    droppedOption = " selected";
  if (GprojectFilterSetting.valueOf() == "Completed".valueOf())
    completedOption = " selected";
  if (GprojectFilterSetting.valueOf() == "All".valueOf())
    allOption = " selected";

  body =
    body +
    '<option value="All" ' +
    allOption +
    ">All </option>" +
    '<option value="Active" ' +
    activeOption +
    ">Active </option>" +
    '<option value="Completed" ' +
    completedOption +
    ">Completed </option>" +
    '<option value="Dropped" ' +
    droppedOption +
    "> Dropped</option>" +
    // '<option value="Completed">Completed </option>' +
    "</select>" +
    // '<a href="#" class="searchbox"><img src="images/search_icon.png" /> </a>' +
    '<input type="text" id="search_project" onKeyUp="filterProjectsTable()"  class="search_input" placeholder="Search ....">' +
    '<img src="images/search_icon.png" />' +
    // '<a href="#" class=" table_ctrls searchbox"><img src="images/search_icon.png" /></a>' +

    '<div class="rt_ctrls pull-right">' +
    '<a href="javascript:void(0);"  class="btn prmary_btn" onClick="addEDProject()" id="openprojects_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Project' +
    "</a>" +
    "</div>" +
    "</div>" +
    '<div class="projects_table_wrp">' +
    '<table class="table projects_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting sortable asc">Project</th>' +
    '<th width="20%" class="sortable">Client  </th>' +
    '<th width="15%" class="sortable">Supplier</th>' +
    '<th width="15%" class="sortable">Current step</th>' +
    '<th width="15%" class="sortable">Last edited</th>' +
    '<th width="5%" ></th>' +
    "</tr>" +
    "</thead>" +
    "<tbody>" +
    "<tr>" +
    '<td class="projects_scroll cus_scroll">' +
    '<table class="table sort_table projects_table " id="projects_table"><tbody>';

  if (Gstrategies.length) {
    for (i = 0; i < Gstrategies.length; i++) {
      var status = Gstrategies[i][GstatusIndex];
      if (status.valueOf() == "INACTIVE".valueOf()) {
        status = "Dropped";
        if (
          GprojectFilterSetting.valueOf() == "Active".valueOf() ||
          GprojectFilterSetting.valueOf() == "Completed".valueOf()
        )
          continue;
      } else if (status.valueOf() == "COMPLETED".valueOf()) {
        status = "Completed";
        if (
          GprojectFilterSetting.valueOf() == "Dropped".valueOf() ||
          GprojectFilterSetting.valueOf() == "Active".valueOf()
        )
          continue;
      } else {
        status = "Active";
        if (
          GprojectFilterSetting.valueOf() == "Dropped".valueOf() ||
          GprojectFilterSetting.valueOf() == "Completed".valueOf()
        )
          continue;
      }

      body =
        body +
        '<tr  class="projects_data ">' + //  class="projects_data"  had to be taken out for some reason...
        '<td width="30%">' +
        '<a class="projlink" href="#" title="Select this project" onClick="selectStrategy(' +
        Gstrategies[i][0] +
        ')"><h5 class="project_name">' +
        Gstrategies[i][4] +
        "</h5></A> ";

      if (status.valueOf() == "Dropped".valueOf())
        body = body + '<span class="project_status">Dropped</span><br>';

      body =
        body +
        '<p class="project_desc">' +
        Gstrategies[i][5] +
        "</p>" +
        "</td>" +
        '<td width="20%">' +
        Gstrategies[i][1][1] +
        '<p class="client_dept">' +
        Gstrategies[i][3][1] +
        "</p>" +
        "</td>" +
        '<td width="15%">';

      if (Gstrategies[i][9] != null) {
        for (var j = 0; j < Gstrategies[i][9].length; j++) {
          body = body + Gstrategies[i][9][j][1] + "<br>";
        }
      }
      var statusDisplay = "";
      if (status.valueOf() == "Completed".valueOf())
        statusDisplay =
          '<br><br><span class="Priority_type high_priority">Completed</span>';
      body =
        body +
        "</td>" +
        '<td width="15%"><span class="cur_step">' +
        Gstrategies[i][12] +
        "</span>" +
        statusDisplay +
        "</td>" +
        '<td width="15%">' +
        getPrintDate(Gstrategies[i][7]) +
        "</td>" +
        '<td width="5%">' +
        '<div class="projects_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDProject(' +
        i +
        ')"> Edit Project</a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDProject(' +
        Gstrategies[i][0] +
        ')"> Drop Project</a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  } else {
    body += '<tr><td colspan="5">No Data Available</td></tr>';
  }

  body =
    body +
    "</tbody></table>" +
    "</td>" +
    "</tr>" +
    "</tbody>" +
    "</table>" +
    "</div>" +
    "</div>  " +
    "</div>" +
    "</div>";

  document.getElementById("mainbody").innerHTML = body;

  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  $(".sortable").click(function() {
    var o = $(this).hasClass("asc") ? "desc" : "asc";
    $(".sortable")
      .removeClass("asc")
      .removeClass("desc");
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;

    sort(colIndex, o);
  });
}

function getPersonEntry(name) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (
      Gpersons[1][i][1]
        .toLowerCase()
        .trim()
        .valueOf() == name.toLowerCase().valueOf()
    ) {
      // compare emails...
      return Gpersons[1][i]; // return the whole person entry
    }
  }
  return []; // will likely break somewhere...
}

function setEDGenericHeader(page) {
  var projectsActive = "",
    reportsActive = "";
  var directoryActive = "",
    academyActive = "",
    knowledgebaseActive = "",
    learningActive = "";
  if (page.valueOf() == "myprojects".valueOf()) projectsActive = " active";
  else if (page.valueOf() == "reports".valueOf()) reportsActive = " active";
  else if (page.valueOf() == "directory".valueOf()) directoryActive = " active";
  else if (page.valueOf() == "academy".valueOf()) academyActive = " active";
  else if (page.valueOf() == "knowledgebase".valueOf())
    knowledgebaseActive = " active";
  else if (page.valueOf() == "learning".valueOf()) learningActive = " active";
  var names = getFirstLast(Gusername);
  var entry = getPersonEntry(Gusername);

  var body =
    "<header>" +
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">                    ' +
    '<a  href="#" class="logo pull-left">' +
    '<img src="images/logo.png" alt="logo" />' +
    "</a>" +
    '<ul class="tab_nav  pull-left">' +
    '<li class="' +
    projectsActive +
    '"><a   class="switch-main-contents" switchThis="myprojects" href="index.php">Projects</a></li>' +
    '<li class="' +
    reportsActive +
    '"><a  class="switch-main-contents" switchThis="reports" href="reports.html">Reports</a></li>';
  if (Gadmin == 1) {
    body =
      body +
      '<li class="' +
      directoryActive +
      '"><a  class="switch-main-contents" switchThis="directory" href="directory.html">Directory</a></li>';
  }
  if (Gadmin == 1) {
    body =
      body +
      '<li class="' +
      knowledgebaseActive +
      '"><a  class="switch-main-contents" switchThis="knowledgebase" href="directory.html">Knowledge Base</a></li>';
  }
  body =
    body +
    '<li class="' +
    academyActive +
    '"><a href="https://anklesaria.talentlms.com/" target="_blank">Academy</a></li>' +
    `<li class=${learningActive}>
      <a class="switch-main-contents" switchThis="learning" href="learning.html">Tutorial</a>
    </li>` +
    "</ul>" +
    "</div>" +
    '<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">' +
    '<div class="pull-right">' +
    '<a href="#" class="profile_name dropdown-toggle" data-toggle="dropdown">' +
    names[0] +
    " " +
    names[1] +
    generateProfileIcon(Gusername, "profile_icon") +
    "</a> " +
    '<div class="dropdown-menu profile_dropdown">' +
    "<ul> " +
    '<li> <span class="arrow top"></span> </li> ' +
    "</ul>" +
    '<section id="profile_wrp">' +
    '<div class="profile_dp_head">' +
    "<h5>Account Information</h5>" +
    '<input type="button" value="Edit" class="link_edit_profile pull-right" onClick="showEditProfile()" id="profile_edit_btn">' +
    "</div>" +
    '<div class="profile_dp_content">' +
    '<p class="input_wrp">' +
    "<label>Name</label>" +
    '<span class="fillvalue">' +
    names[0] +
    " " +
    names[1] +
    "</span>" +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Email</label>" +
    '<span class="fillvalue">' +
    Gusername +
    "</span>" +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Organization</label>" +
    '<span class="fillvalue">' +
    entry[7] +
    "</span>" +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Organizational role</label>" +
    '<span class="fillvalue">' +
    entry[6] +
    "</span>" +
    "</p>" +
    "</div>" +
    '<div class="profile_dp_footer">' +
    '<input type="submit" value="Logout" onClick="edLogout()" class="logut_btn" id="logout_submit">' +
    '<input type="button" value="Change password" onClick="showChangePassword()" class="link_chanage_pwd pull-right" id="cng_pwd">' +
    "</div>" +
    "</section>" +
    '<section id="profile_edit_wrp">' +
    '<div class="profile_dp_head">' +
    "<h5>Account Information</h5>" +
    "</div>" +
    '<div class="profile_dp_content">' +
    '<div class="profile_dp_content">' +
    '<p class="input_wrp">' +
    "<label>Current password:</label>" +
    '<input id="currpwd" title="Current password is needed for all profile changes!" type="password" class="textbox required" />' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>First name</label>" +
    '<input type="text" id="ufirst" class="textbox" value="' +
    entry[3] +
    '"/>' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Last name</label>" +
    '<input type="text" id="ulast" class="textbox" value="' +
    entry[4] +
    '"/>' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Email</label>" +
    '<span class="fillvalue">' +
    Gusername +
    "</span>" +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Organization</label>" +
    '<span class="fillvalue">Anklesaria Group</span>' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Organizational role:</label>" +
    '<input type="text" id="urole" class="textbox" value="' +
    entry[6] +
    '"/>' +
    "</p>" +
    "</div>" +
    '<div class="profile_dp_footer">' +
    '<input type="submit" value="Cancel" onClick="cancelProfile()" class="profile_cancal " id="edit_submit">' +
    '<input type="submit" value="Save" class="save_btn" onClick="savePersonalProfile()" id="edit_cancel">' +
    "</div>" +
    "</section>" +
    '<section id="change_pwd_wrp">' +
    '<div class="profile_dp_head">' +
    "<h5>Change Password</h5>" +
    "</div>" +
    '<div class="profile_dp_content">' +
    '<p class="input_wrp">' +
    "<label>Current password</label>" +
    '<input id="oldpwd" type="password" class="textbox" />' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>New password</label>" +
    '<input id="newpwd" type="password" class="textbox" />' +
    "</p>" +
    '<p class="input_wrp">' +
    "<label>Confirm new password</label>" +
    '<input id="confnewpwd" type="password" class="textbox" />' +
    "</p>" +
    "</div>" +
    '<div class="profile_dp_footer">' +
    '<input type="submit" value="Cancel" onClick="cancelProfile()" class="profile_cancal" id="cng_pwd_cancel ">' +
    '<input type="submit" value="Save Password" onClick="saveNewPassword()" class="save_btn" id="cng_pwd_submit">' +
    "</div>" +
    "</section>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</header>";

  document.getElementById("mainheader").innerHTML = body;
}

function getSupplierNames(s) {
  var suppliers = "";
  for (var i = 0; i < Gstrategies.length; i++) {
    if (s == Gstrategies[i][0]) {
      if (Gstrategies[i][9] != null) {
        // supplier array
        for (var n = 0; n < Gstrategies[i][9].length; n++) {
          suppliers = suppliers + Gstrategies[i][9][n][1];
          if (n < Gstrategies[i][9].length - 1) suppliers = suppliers + ", ";
        }
      }
    }
  }
  return suppliers;
}

function getCurrentSuppliers(s) {
  var suppliers = [];
  for (var i = 0; i < Gstrategies.length; i++) {
    if (s == Gstrategies[i][0]) {
      if (Gstrategies[i][9] != null) {
        // supplier array
        for (var n = 0; n < Gstrategies[i][9].length; n++) {
          suppliers.push(Gstrategies[i][9][n][0]);
        }
      }
    }
  }
  return suppliers;
}

function getAllSupplierCompanies() {
  var suppliers = [];
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i].length > 6) {
      // supplier array
      if (Gcompanies[i][1] === "") continue;
      suppliers.push(Gcompanies[i][0]);
    }
  }

  return suppliers;
}

function getAllSupplierCompanyNames() {
  var suppliers = [];
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i].length > 6) {
      // supplier array
      if (Gcompanies[i][1] === "") continue;
      suppliers.push(Gcompanies[i][1]);
    }
  }
  return suppliers;
}

function setEDProjectHeader(page) {
  var pname = getStrategyName(Gcurrentstrategy);
  var compname = getCompanyName(getCompanyForProject(Gcurrentstrategy));
  var dept = getBUNameFromProject(Gcurrentstrategy);
  var sname = getSupplierNames(Gcurrentstrategy);

  var body =
    '<header>     <div class="container-fluid">         <div class="row">             <div class="col-lg-8 col-md-8 col-sm-8 col-xs-8">                                     <a switchThis="myprojects" href="index.php" class="logo pull-left switch-main-contents">                 	<img src="images/logo.png" alt="logo" />                 </a>                 <div class="pull-left site_info">                 	<h3 class="site_title">' +
    pname +
    '</h3>                 	<h5 class="site_sub_title">' +
    compname +
    " - " +
    dept +
    ": " +
    sname +
    '</h5>                 </div>             </div>                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">             	<div class="right_nav pull-right">';
  body =
    body +
    '<a href="javascript:void(0);" onClick="$(#projOptions).toggle();" class="project_actbtn"><img src="images/ver_more.png" alt="more" /> </a>' +
    '<div id="projOptions" style="display: none;" class="project_opt_wrp" >' +
    '<h4>Mark Project <a href="javascript:void(0);" onClick="$(#projOptions).toggle();" ><img src="images/ver_more_black.png" alt="more" class="close_dropdown"  data-dismiss="project_opt_wrp"/></a></h4>' +
    '<ul class="project_action">                                        ' +
    '<li> <a href="javascript:void(0);" data-toggle="modal" onClick="changeProjectStatus(1);"> Completed </a> </li>' +
    '<li> <a href="javascript:void(0);" data-toggle="modal" onClick="changeProjectStatus(2);"> Dropped </a> </li>' +
    '<li> <a href="javascript:void(0);" data-toggle="modal" onClick="changeProjectStatus(3);"> Active </a> </li>' +
    "</ul>" +
    "</div>" +
    '<a  class="switch-main-contents" switchThis="myprojects" href="index.php"><img src="images/close_icon.png" alt="close" /></a>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</header>";

  document.getElementById("mainheader").innerHTML = body;
}

function setEDPageNav(page) {
  document.getElementById("pagenavbar").innerHTML = "";
  document.getElementById("pagenavbar").style.display = "none";
}

function filebtnClicked() {
  $(".files_wrapper").toggle();
  $(".task_wrapper").hide();
  //$(this).toggleClass('open_dropdwn');
  if ($(".exe_opt2").css("display") == "block") {
    $(".active_img_file").show();
    $(".click_img_file").hide();
  } else {
    $(".active_img_file").hide();
    $(".click_img_file").show();
  }

  $(".active_img_task").hide();
  $(".click_img_task").show();
  refreshFileSidePanel();
}

function taskbtnClicked() {
  $(".task_wrapper").toggle();
  $(".files_wrapper").hide();
  //$(this).toggleClass('open_dropdwn');
  if ($(".exe_opt1").css("display") == "block") {
    $(".active_img_task").show();
    $(".click_img_task").hide();
  } else {
    $(".active_img_task").hide();
    $(".click_img_task").show();
  }

  $(".active_img_file").hide();
  $(".click_img_file").show();
  refreshTaskSidePanel();
}

function refreshTaskSidePanel() {
  var selector = document.getElementById("sortTaskFilter").value;
  if (selector.valueOf() == "".valueOf()) selector = "all";
  // alert("selector: " + selector);
  var body = '<div class="row">' + '<div class="col-lg-6 col-md-6 col-sm-12"> ';

  if (
    Gcurrentdata[Gtasksindex] == null ||
    Gcurrentdata[Gtasksindex].length == 0
  ) {
    body =
      body +
      '<div class="info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/> No tasks planned for this project yet.' +
      "</div>";
  }
  body =
    body +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:20px;">' +
    '<div class="filelist_scroll tasks_table_wrp cus_scroll">' +
    '<table class="tasks_table">';
  // now loop over tasks  [ id , description, step, due, status, participants]
  for (var i = 0; i < Gcurrentdata[Gtasksindex].length; i++) {
    var cbid = "taskselect-" + i;
    var today = new Date();
    var deadline = new Date(Gcurrentdata[Gtasksindex][i][3]);
    var expired = "";
    var past = false;
    var upcoming = false;
    if (today > deadline) {
      expired = '<span class="action_status">Overdue</span>';
      past = true;
    }
    if (deadline > today) upcoming = true;
    if (
      selector.valueOf() == "all".valueOf() ||
      (selector.valueOf() == "overdue".valueOf() && past) ||
      (selector.valueOf() == "upcoming".valueOf() && upcoming)
    ) {
      body =
        body +
        '<tr id="task-' +
        i +
        '" >' +
        '<td width="30%" >' +
        expired +
        "&nbsp;&nbsp;" +
        Gcurrentdata[Gtasksindex][i][1] +
        "</td>" +
        '<td width="15%">' +
        getPrintDate(Gcurrentdata[Gtasksindex][i][3]) +
        "</td>" +
        '<td width="20%">';
      // alert( "task performers: " + Gcurrentdata[Gtasksindex][i][5])
      for (var j = 0; j < Gcurrentdata[Gtasksindex][i][5].length; j++) {
        var names = getFirstLastFromId(Gcurrentdata[Gtasksindex][i][5][j]);
        // '<span class="owner_count">' + names[2] + '</span>';
        body =
          body +
          generateProfileIconFromId(
            Gcurrentdata[Gtasksindex][i][5][j],
            "owner_count"
          );
        if (j == 2 && Gcurrentdata[Gtasksindex][i][5].length - 3 > 0) {
          body =
            body +
            " and " +
            (Gcurrentdata[Gtasksindex][i][5].length - 3) +
            " more...";
          break;
        }
      }
      body =
        body +
        "</td>" +
        '<td width="15%">' +
        '<span class="process_type">' +
        Gcurrentdata[Gtasksindex][i][2] +
        "</span>" +
        "</td>" +
        '<td width="5%">' +
        '<div class="task_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="taskOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editTaskFromPanel(' +
        i +
        ')"> Edit task </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost " onclick="confirmDeleteTaskFromPanel(' +
        i +
        ')"> Delete task </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  }

  body = body + "</table>" + "</div>" + "</div>       " + "</div>";
  document.getElementById("taskSidePanel").innerHTML = body;
}

function closeDialog() {
  $(".files_wrapper").hide();
  $(".task_wrapper").hide();
}

function refreshFileSidePanel() {
  body =
    '<section class="files_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Files</h2>' +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" onClick="addNewFile()" id="openfiles_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> File' +
    "</a>" +
    "</div>" +
    '<div class="files_table_wrp">' +
    '<table class="table files_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="15%"> Action </th>' +
    '<th width="45%"> File name </th>' +
    '<th width="30%"> Step used </th>' +
    '<th width="10%"></th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    '<div class="filelist_scroll cus_scroll" id="files_list">' +
    '<table class="table files_table" id="files_table">' +
    "<tbody>";
  if (Gcurrentdata[Gdocsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Gdocsindex].length; i++) {
      var step = Gcurrentdata[Gdocsindex][i][0];
      var docs = Gcurrentdata[Gdocsindex][i][1];
      if (docs != null) {
        for (var j = 0; j < docs.length; j++) {
          var docid = docs[j][0];
          var doctype = "Bookmark";
          if ((docs[j][7] + "").valueOf() != "".valueOf()) doctype = "Document";
          var title = docs[j][4];
          var filename = docs[j][7];
          var filetype = docs[j][8];
          var desc = docs[j][5];
          var url = "";
          var handle = title;
          if (handle.valueOf() == "".valueOf()) handle = filename;
          if (doctype.valueOf() == "Bookmark".valueOf()) {
            url =
              '<A target="_blank"  HREF="' + docs[j][6] + '">View Bookmark</A>';
          } else {
            url =
              '<A target="_blank" href="view-doc.php?' +
              "document=" +
              docid +
              "&company=" +
              getCompanyForProject(Gcurrentstrategy) +
              "&bu=" +
              getBUForProject(Gcurrentstrategy) +
              "&project=" +
              Gcurrentstrategy +
              "&username=" +
              Gusername +
              "&token=" +
              Gtoken +
              '">View</A>';
          }
          // alert(step + " docname: " + title + " ; desc " + desc);
          body =
            body +
            '<tr class="files_data">' +
            '<td width="15%"><span class="file_type">' +
            url +
            "</span></td>" +
            '<td width="45%"><span title="' +
            handle +
            '">' +
            handle +
            "</span></td>" +
            '<td width="30%"> <span class="step_used">' +
            step +
            "</span> </td>" +
            '<td width="10%">' +
            '<div class="company_opt">' +
            '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
            '<div class="opt_btn_wrp"> ' +
            '<ul class="other_action">                                         ' +
            // '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="alert(edit document tbd)"> Edit </a> </li>' +
            '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDDocument(' +
            docid +
            ');"> Delete </a> </li>' +
            "</ul> " +
            "</div>" +
            "</div>" +
            "</td>" +
            "</tr>";
        }
      }
    }
  }
  body = body + "</tbody>" + "</table>" + "</div>" + "</div>" + "</section>";
  document.getElementById("sideFilePanel").innerHTML = body;
}

function setEDProcessNav(page) {
  var execActive = " active",
    manActive = "",
    repActive = "";

  var agreeActive = "",
    identifyActive = "",
    measureActive = "",
    defineActive = "",
    reduceActive = "",
    impActive = "",
    verActive = "",
    eternalActive = "",
    backActive = "",
    taskActive = "",
    workActive = "";
  if (page.valueOf() == "Agree".valueOf()) agreeActive = " active";
  else if (page.valueOf() == "Identify".valueOf()) identifyActive = " active";
  else if (page.valueOf() == "Measure".valueOf()) measureActive = " active";
  else if (page.valueOf() == "Define".valueOf()) defineActive = " active";
  else if (page.valueOf() == "Reduce".valueOf()) reduceActive = " active";
  else if (page.valueOf() == "Implement".valueOf()) impActive = " active";
  else if (page.valueOf() == "Verify".valueOf()) verActive = " active";
  else if (page.valueOf() == "Eternal".valueOf()) eternalActive = " active";
  else if (page.valueOf() == "Background".valueOf()) backActive = " active";
  else if (page.valueOf() == "Tasks".valueOf()) taskActive = " active";
  else if (page.valueOf() == "Workplan".valueOf()) workActive = " active";
  var body = `
  <div class="main_nav_wrp">
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-10 col-md-10 col-sm-10 col-xs-9">
        <ul class="main_nav">
          <li class="${manActive}">
            <a href="#" class="switch-main-contents" switchThis="Background"
              >Project Setup</a
            >
          </li>
          <li class="${execActive}">
            <a href="#" class="switch-main-contents" switchThis="Agree"
              >Execution</a
            >
          </li>
          <li class="${repActive}">
            <a href="#" class="switch-main-contents" switchThis="Cor"
              >Reports</a
            >
          </li>
        </ul>
        <ul class="sub_nav">
          <li class=" ${agreeActive}">
            <a href="#" class="switch-main-contents" switchThis="Agree"
              >Agree</a
            >
          </li>
          <li class="${identifyActive}">
            <a href="#" class="switch-main-contents" switchThis="Identify"
              >Identify</a
            >
          </li>
          <li class="${measureActive}">
            <a href="#" class="switch-main-contents" switchThis="Measure"
              >Measure & Define</a
            >
          </li>
          <li class="${reduceActive}">
            <a href="#" class="switch-main-contents" switchThis="Reduce"
              >Reduce</a
            >
          </li>
          <li class="${impActive}">
            <a href="#" class="switch-main-contents" switchThis="Implement"
              >Implement</a
            >
          </li>
          <li class="${verActive}">
            <a href="#" class="switch-main-contents" switchThis="Verify"
              >Verify</a
            >
          </li>
          <li class="${eternalActive}">
            <a href="#" class="switch-main-contents" switchThis="Eternal"
              >Eternal</a
            >
          </li>
        </ul>
      </div>
      <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">
        <div class="right_subnav pull-right">
          <a
            href="javascript:void(0);"
            onClick="taskbtnClicked()"
            id="exe_taskbtn"
          >
            <img
              src="images/nav_icon_1.png"
              alt="icon"
              class="click_img_task"
              title="Click to Add Notes"
            />
            <img
              src="images/activetask.png"
              alt="icon"
              class="active_img_task"
              hidden
            />
          </a>
          <div class="exe_opt exe_opt1 task_wrapper">
            <!-- dropdown-menu -->
            <span class="arrow top"></span>
            <div class="container-fluid no_padding">
              <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12">
                  <div class="sec_head">
                    <h2 class="sec_title no_margin">Tasks</h2>
                    <span id="close" onclick="closeDialog()">x</span>
                    <div class="rt_ctrls pull-right">
                      <span>
                        <select
                          id="sortTaskFilter"
                          onChange="refreshTaskSidePanel()"
                          class="select_filter filter_list"
                        >
                          <option value="all">Show all</option>
                          <option value="overdue">Show overdue tasks</option>
                          <option value="upcoming">Show upcoming tasks</option>
                        </select>
                      </span>
                      <span>
                        <a
                          href="javascript:void(0);"
                          class="btn prmary_btn"
                          id="openTaskModal"
                          onClick="clearTasksModalSidePanel()"
                          data-toggle="modal"
                          data-target="#tasks_modal"
                        >
                          <i class="fa fa-plus" aria-hidden="true"></i> Task
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="taskSidePanel"></div>
            </div>
          </div>
          <a
            href="javascript:void(0);"
            onClick="filebtnClicked()"
            id="exe_filebtn"
          >
            <img
              src="images/nav_icon_2.png"
              alt="icon"
              class="click_img_file"
              title="Click to Add Files"
            />
            <img
              src="images/active_files.png"
              alt="icon"
              class="active_img_file"
              hidden
            />
          </a>
          <div class="exe_opt exe_opt2 files_wrapper">
            <!-- dropdown-menu -->
            <span class="arrow top"></span
            ><!-- Files -->
            <div id="sideFilePanel">
              <span id="close" onclick="closeDialog()">x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  `;

  document.getElementById("pagenavbar").innerHTML = body;
  $("#pagenavbar").css("display", "block");
}

function setEDProcessNavOld(page) {
  var execActive = " active",
    manActive = "",
    repactive = "";

  var agreeActive = "",
    identifyActive = "",
    measureActive = "",
    defineActive = "",
    reduceActive = "",
    impActive = "",
    verActive = "",
    eternalActive = "",
    backActive = "",
    taskActive = "",
    workActive = "";
  if (page.valueOf() == "Agree".valueOf()) agreeActive = " active";
  else if (page.valueOf() == "Identify".valueOf()) identifyActive = " active";
  else if (page.valueOf() == "Measure".valueOf()) measureActive = " active";
  else if (page.valueOf() == "Define".valueOf()) defineActive = " active";
  else if (page.valueOf() == "Reduce".valueOf()) reduceActive = " active";
  else if (page.valueOf() == "Implement".valueOf()) impActive = " active";
  else if (page.valueOf() == "Verify".valueOf()) verActive = " active";
  else if (page.valueOf() == "Eternal".valueOf()) eternalActive = " active";
  else if (page.valueOf() == "Background".valueOf()) backActive = " active";
  else if (page.valueOf() == "Tasks".valueOf()) taskActive = " active";
  else if (page.valueOf() == "Workplan".valueOf()) workActive = " active";

  document.getElementById("pagenavbar").innerHTML =
    '<div class="main_nav_wrp">      <div class="container-fluid">         <div class="row">             <div class="col-lg-10 col-md-10 col-sm-10 col-xs-9">                                         <ul class="main_nav">                         <li class="' +
    manActive +
    '"><a href="#" class="switch-main-contents" switchThis="Background">Management</a></li>                         <li class="' +
    execActive +
    '"><a href="#" class="switch-main-contents" switchThis="Agree" >Execution</a></li> <li class="' +
    repActive +
    '"><a href="#"    class="switch-main-contents" switchThis="Cor">Reports</a></li>                      </ul>                                          <ul class="sub_nav">                     	<li class="' +
    agreeActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Agree">Agree</a>                         </li>                                                  <li class="' +
    identifyActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Identify">Identify</a>                         </li>                                                  <li class="' +
    measureActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Measure">Measure & Define</a>                         </li>                                                  <li class="' +
    reduceActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Reduce">Reduce</a>                         </li>                                                  <li class="' +
    impActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Implement">Implement</a>                         </li>                                                  <li class="' +
    verActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Verify">Verify</a>                         </li>                                                  <li class="' +
    eternalActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Eternal">Eternal</a>                         </li>                     </ul>                </div>                                    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">                    <div class="right_subnav pull-right">                                     <a href="#"  href="#"><img src="images/nav_icon_1.png" alt="icon" /> </a>                    <a href="#"  href="#"><img src="images/nav_icon_2.png" alt="attach" /></a>                </div>             </div>                                          </div>     </div> </div>';
  $("#pagenavbar").css("display", "block");
}

function setEDMgmtNav(page) {
  var manActive = " active",
    execActive = "",
    repActive = "";
  // alert("page: " + page);
  var backActive = "",
    taskActive = "",
    workActive = "";
  if (page.valueOf() == "Background".valueOf()) backActive = " active";
  else if (page.valueOf() == "Tasks".valueOf()) taskActive = " active";
  else if (page.valueOf() == "Workplan".valueOf()) workActive = " active";

  document.getElementById("pagenavbar").innerHTML =
    '<div class="main_nav_wrp">     <div class="container-fluid">         <div class="row">             <div class="col-lg-10 col-md-10 col-sm-10 col-xs-9">                                        <ul class="main_nav">                         <li class="' +
    manActive +
    '"><a href="#" class="switch-main-contents" switchThis="Background">Project Setup</a></li>                         <li class="' +
    execActive +
    '"><a href="#" class="switch-main-contents" switchThis="Agree">Execution</a></li>  <li class="' +
    repActive +
    '"><a href="#" class="switch-main-contents" switchThis="Cor">Reports</a></li>                      </ul>                     <ul class="sub_nav management_subnav">                     	<li class="' +
    backActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Background">Background</a>                        </li>                                                 <li class="' +
    workActive +
    '">                         	<a  href="#" class="switch-main-contents" switchThis="Workplan">Workplan</a>                         </li>                                                <li class="' +
    taskActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Tasks">Tasks</a>                         </li>                                                  </div>                                   <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">                   <div class="right_subnav pull-right">                                              </div>             </div>                             </div>     </div> </div>';

  $("#pagenavbar").css("display", "block");
}
var downloaded = false;
function setEDReportsNav(page) {
  downloaded = false;
  var manActive = " ",
    execActive = "",
    repActive = " active";
  // alert("page: " + page);
  var corActive = "",
    progActive = "";
  if (page.valueOf() == "Cor".valueOf()) corActive = " active";
  else if (page.valueOf() == "progress".valueOf()) progActive = " active";

  document.getElementById("pagenavbar").innerHTML =
    '<div class="main_nav_wrp">     <div class="container-fluid">         <div class="row">             <div class="col-lg-10 col-md-10 col-sm-10 col-xs-9">                                        <ul class="main_nav">                         <li class="' +
    manActive +
    '"><a href="#"  class="switch-main-contents" switchThis="Background">Project Setup</a></li>                         <li class="' +
    execActive +
    '"><a href="#" class="switch-main-contents" switchThis="Agree">Execution</a></li> <li class="' +
    repActive +
    '"><a href="#" class="switch-main-contents" switchThis="Cor">Reports</a></li>                     </ul>                     <ul class="sub_nav management_subnav">                     	<li class="' +
    corActive +
    '">                         	<a href="#" class="switch-main-contents" switchThis="Cor">Close Out Report</a>                        </li>                                                 <li class="' +
    progActive +
    '">                         	<a  href="#" class="switch-main-contents" switchThis="progress">Progress</a>                         </li> </ul>    </div>                                   <div class="col-lg-2 col-md-2 col-sm-2 col-xs-3">                   <div class="right_subnav pull-right">                                              </div>             </div>                             </div>     </div> </div>';

  $("#pagenavbar").css("display", "block");
}

function saveCompanies() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  for (var i = 0; i < changedObjects.length; i++) {
    var items = changedObjects[i].split("-");
    var obj = items[1];
    obj = parseInt(obj);
    if (i < changedObjects.length - 1) setTimeout(saveCompany(obj, 0), 1000);
    else setTimeout(saveCompany(obj, 1), 1000);
  }
}

function savePeople() {
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  // alert(changedObjects.length + " object changed! " + changedObjects.length);
  for (var i = 0; i < changedObjects.length; i++) {
    var items = changedObjects[i].split("-");
    var obj = items[1];
    obj = parseInt(obj);
    if (i < changedObjects.length - 1) setTimeout(savePerson(obj, 0), 1000);
    else setTimeout(savePerson(obj, 1), 1000);
  }
}

function editMyProfile() {
  changedObjects = [];
  var table =
    '<div id="myprofilemsg"></div><br><table id="myprofiletable" class="fancyTable" width=50%>';
  table =
    table +
    "<tr><td width=35%><b>Email address:</b></td><td>" +
    Gcurrentuser[1] +
    "</td></tr>";

  table =
    table +
    '<tr class="odd"><td ><b>Enter current password:</b><br><font color="red">(required for ALL profile changes!)</font></td>';
  table = table + '<td><input id="mypwd" size=50 value=""></td></tr>';

  table =
    table +
    "<tr><td ><b>To Change Passwords:</b><br>&nbsp;&nbsp;&nbsp;1. Enter New Password: </b><br>&nbsp;&nbsp;&nbsp;2. Confirm New Password: </td>";
  table =
    table +
    '<td>&nbsp;<br><input id="newpwd" oninput="fixTextClass(newpwd)" size=50 value=""><br>';
  table =
    table +
    '<input id="confnewpwd" oninput="fixTextClass(confnewpwd)" size=50 value=""></td></tr>';

  table = table + '<tr class="odd"><td ><b>First Name:</b></td>';
  table =
    table +
    '<td><input id="myfn" oninput="fixTextClass(myfn)" size=50 value="' +
    Gcurrentuser[3] +
    '"></td></tr>';

  table = table + "<tr><td ><b>Last Name:</b></td>";
  table =
    table +
    '<td><input id="myln" oninput="fixTextClass(myln)" size=50 value="' +
    Gcurrentuser[4] +
    '"></td></tr>';

  table = table + '<tr class="odd"><td ><b>Telephone:</b></td>';
  table =
    table +
    '<td><input id="myphone" oninput="fixTextClass(myphone)" size=50 value="' +
    Gcurrentuser[5] +
    '"></td></tr>';

  table = table + "<tr><td ><b>Job Title:</b></td>";
  table =
    table +
    '<td><input id="mytitle" oninput="fixTextClass(mytitle)" size=50 value="' +
    Gcurrentuser[6] +
    '"></td></tr>';

  table = table + "</table>";
  return table;
}

function refreshPersonsProfile(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage("myprofilemsg", result[1], 0, true);
    return;
  }
  Gpersons = JSON.parse(response);

  refreshPersonsLocal();
  Gcurrentuser = getMyData();
  document.getElementById("mainbody").innerHTML = editMyProfile();
  showTimedMessage(
    "myprofilemsg",
    "Your profile has been updated...",
    10000,
    false
  );
}

var passwordChangeTried = null;

function updatePersonsProfiles(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    // profile change included password?  change the local var for subsequent operations
    // to succeed...
    if (passwordChangeTried != null) Gtoken = passwordChangeTried;
    showTimedMessage(
      "myprofilemsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshPersonsProfile,
      error: personOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("myprofilemsg", res[1], 0, true);
  }
}

function saveMyProfile() {
  passwordChangeTried = null;
  if (document.getElementById("mypwd").value.valueOf() == "".valueOf()) {
    showTimedMessage(
      "myprofilemsg",
      "You cannot make any changes unless you enter the correct password!",
      0,
      true
    );
    return;
  }

  var attributes = "";
  if (changedObjects.length == 0) {
    myAlert(
      "Attention!",
      "There are no changes to save on this page!",
      "error"
    );
    return;
  }
  var passwordChanged = 0;
  for (var i = 0; i < changedObjects.length; i++) {
    var field = changedObjects[i];
    if (field.valueOf() == "myfn".valueOf()) {
      attributes =
        attributes +
        "&ufirst=" +
        encodeURIComponent(document.getElementById("myfn").value);
    } else if (field.valueOf() == "myln".valueOf()) {
      attributes =
        attributes +
        "&ulast=" +
        encodeURIComponent(document.getElementById("myln").value);
    } else if (field.valueOf() == "myphone".valueOf()) {
      attributes =
        attributes +
        "&telephone=" +
        encodeURIComponent(document.getElementById("myphone").value);
    } else if (field.valueOf() == "mytitle".valueOf()) {
      attributes =
        attributes +
        "&job=" +
        encodeURIComponent(document.getElementById("mytitle").value);
    } else if (
      field.valueOf() == "confnewpwd".valueOf() ||
      field.valueOf() == "newpwd".valueOf()
    ) {
      if (
        document.getElementById("confnewpwd").value.valueOf() !=
        document.getElementById("newpwd").value.valueOf()
      ) {
        showTimedMessage(
          "myprofilemsg",
          "Please confirm the new password properly to update it!",
          0,
          true
        );
        return;
      }
      if (passwordChanged == 0)
        attributes =
          attributes +
          "&upwd=" +
          encodeURIComponent(document.getElementById("newpwd").value);
      passwordChanged = 1;
      passwordChangeTried = document.getElementById("newpwd").value;
    }
  }
  showTimedMessage("myprofilemsg", "Updating profile", 0, false);

  $.ajax({
    url:
      "updateme.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      attributes,
    type: "POST",
    success: updatePersonsProfiles,
    error: personOpFailed
    //,datatype: "json"
  });
}

var Gpages = [
  "Agree",
  "Identify",
  "Measure",
  "Define",
  "Reduce",
  "Implement",
  "Verify",
  "Eternal",
  "Reports"
];

function genMaster(reportData) {
  var mb =
    '<CENTER><TABLE class="reports" cellpadding=10 cellspacing=10 border=0 width=85%>';
  mb =
    mb +
    '<TR><TD colspan=4 bgcolor="#BCA9F5"><b><font size="+2">Agree on the Need to Manage Costs</font></b></TD></TR>';
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb +
    '<TR><TD colspan=4 bgcolor="#A5DF00"><b><font size="+1.5">Primary Cost</font></b></TD></TR>';
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb +
    '<TR><TD colspan=4 bgcolor=lightgray><b><font size="+1.5">' +
    reportData[Gprimeindex][0] +
    "</font></b></TD></TR>";
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb +
    "<TR><TD width=25%>Annual Spend:</TD><TD  bgcolor=lightgray>" +
    CurrencyFormat(reportData[Gprimeindex][1], "", 0, "", ",") +
    "(" +
    reportData[2][1] +
    ")</TD>";
  mb =
    mb +
    "<TD width=25%>Annual Spend:</TD><TD bgcolor=lightgray>" +
    CurrencyFormat(reportData[Gprimeindex][1], "", 0, "", ",") +
    "(" +
    reportData[2][1] +
    ")</TD></TR>";
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb + "<TR><TD colspan=4> Rationale for choosing Primary Cost: </TD></TR>";
  mb =
    mb +
    "<TR><TD colspan=4  bgcolor=lightgray>" +
    reportData[Gprimeindex][2] +
    "</TD></TR>";
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb = mb + '<TR><TD colspan=4 bgcolor="#A5DF00"><b>Team Goals</b></TD></TR>';
  mb =
    mb +
    '<TR><TD colspan=2 bgcolor="#A5DF00"><b>Goal</b></TD><TD bgcolor="#A5DF00"><b>Perspective</b></TD><TD  bgcolor="#A5DF00"><b>Stakeholder(s)</b></TD></TR>';

  for (var i = 0; i < reportData[Ggoalsindex].length; i++) {
    var goal = reportData[Ggoalsindex][i];
    mb =
      mb +
      "<TR><TD colspan=2  bgcolor=lightgray>" +
      goal[0] +
      "</TD><TD  bgcolor=lightgray>" +
      goal[1] +
      "</TD><TD  bgcolor=lightgray>" +
      goal[2] +
      "</TD></TR>";
  }
  mb = mb + "</table><P>&nbsp;</P>";

  total = reportData[Gprimeindex][1];
  if (typeof total == "string") total = parseFloat(total);

  mb =
    mb +
    '<TABLE  class="reports" cellpadding=4 cellspacing=4 border=0 width=85%>';
  mb =
    mb +
    '<TR><TD colspan=6 bgcolor="#BCA9F5"><b><font size="+2">Identifying Critical Costs in the Supply Chain</font></b></TD></TR>';
  mb = mb + "<TR><TD colspan=6> &nbsp; </TD></TR>";
  mb =
    mb +
    '<TR  bgcolor="#A5DF00"><TD width=5%><b>Level</b></TD><TD width=60%><b>Cost</b></TD><TD width=10%><b>Percentage</b></TD><TD width=10%><b>Impactable?</b></TD><TD><b>Future Cost?</b></TD><TD><b>Selected as Critical</b></TD></TR>';

  for (var i = 0; i < reportData[Gelementsindex][0].length; i++) {
    var element = reportData[Gelementsindex][0][i];
    var ce = element[0];
    var cename = element[1];
    var level = element[2];
    var val = element[4];
    if (typeof val == "string") val = parseFloat(val);
    var imp = element[5];
    var fut = element[6];
    var com = element[7];
    var units = element[9];
    var selected = "NO";
    // see if the cost element is listed as critical going forward
    if (reportData[Gelementsindex][1] != null) {
      for (var k = 0; k < reportData[Gelementsindex][1].length; k++) {
        if (
          (ce + "").valueOf() ==
          (reportData[Gelementsindex][1][k] + "").valueOf()
        )
          selected = "YES";
      }
    }
    if (cename.search("auto created") >= 0) {
      mb = mb + "<TR><TD colspan=6> &nbsp; </TD></TR>";
      continue;
    }
    mb = mb + "<TR><TD>" + level + "</TD>";
    mb = mb + "<TD>" + cename + "</TD>";
    mb = mb + "<TD>" + numberFormat((val / total) * 100, 2) + "</TD>";
    mb = mb + "<TD>" + imp + "</TD>";
    mb = mb + "<TD>" + fut + "</TD>";
    if (selected.valueOf() != "NO".valueOf())
      mb = mb + "<TD>" + selected + "</TD>";
    else mb = mb + "<TD>&nbsp;</TD>";
    mb = mb + "</TR>";
  }
  mb = mb + "</table>";

  var rbstring = "";
  if (reportData[Grbindex] != null) {
    for (var i = 0; i < reportData[Grbindex].length; i++) {
      var oentry = reportData[Grbindex][i];
      if (oentry == null) {
        rbstring = rbstring + "No data for this SS??";
      } else {
        var ss = oentry[0];
        var ssname = oentry[1];
        rbstring = rbstring + ssname + "<P>&nbsp;</P>";
      }
    }
  }

  mb =
    mb +
    '<TABLE  class="reports" cellpadding=4 cellspacing=4 border=0 width=85%>';
  mb =
    mb +
    '<TR><TD colspan=4 bgcolor="#BCA9F5"><b><font size="+2">Key Cost Drivers, Strategic Options, and Strategy statements</font></b></TD></TR>';
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb +
    '<TR  bgcolor="#A5DF00"><TD width=20%><b>Critical Costs</b></TD><TD width=20%><b>Key Cost Drivers</b></TD><TD width=20%><b>Strategic Options</b></TD><TD width=10%><b>Strategy Statements</b></TD></TR>';

  var ssdone = 0;
  for (var i = 0; i < reportData[Gcdindex].length; i++) {
    var numdrivers = 0;
    var ce = reportData[Gcdindex][i][1];

    if (reportData[Gcdindex][i][2] != null)
      numdrivers = reportData[Gcdindex][i][2].length;
    if (numdrivers == 0) continue;
    var numkcds = 0;
    var doce = true;
    for (var j = 0; j < numdrivers; j++) {
      var entry = reportData[Gcdindex][i][2][j]; // entry for the driver details
      var kcdp = 0;
      if (entry[4] == null) continue;
      if (entry[4].length >= 7 && ("" + entry[4][6]).valueOf() != "0".valueOf())
        kcdp = 1;
      if (kcdp == 0) continue;
      numkcds++;
      kcds = "<TD>" + entry[1] + "</TD>";
      var sostring = "<TD>";
      if (
        entry != null &&
        entry.length >= 5 &&
        entry[5] != null &&
        entry[5].length > 0
      ) {
        for (var k = 0; k < entry[5].length; k++) {
          var soid = entry[5][k][0];
          var sodesc = entry[5][k][1];
          var sosel = entry[5][k][2];
          var checked = 0;
          if ((sosel + "").valueOf() == "1".valueOf()) checked = 1;
          if (checked == 1) sostring = sostring + "<b>" + sodesc + "</b><br>";
          else sostring = sostring + sodesc + "<br>";
        }
      }
      sostring = sostring + "</TD>";
      var cerow = "<TD rowspan=" + numkcds + ">" + ce + "</TD>";
      if (ssdone == 0) {
        if (doce) {
          mb =
            mb +
            "<TR>" +
            cerow +
            kcds +
            sostring +
            "<TD>" +
            rbstring +
            "</TD> </TR>";
          doce = false;
        } else
          mb =
            mb +
            "<TR><TD>&nbsp;</TD>" +
            kcds +
            sostring +
            "<TD>" +
            rbstring +
            "</TD> </TR>";
        ssdone = 1;
      } else {
        if (doce) {
          mb = mb + "<TR>" + cerow + kcds + sostring + "<TD>&nbsp;</TD> </TR>";
          doce = false;
        } else
          mb =
            mb +
            "<TR><TD>&nbsp;</TD>" +
            kcds +
            sostring +
            "<TD>&nbsp;</TD> </TR>";
      }
      // mb = mb + '<TR><TD colspan=4>&nbsp;</TD></TR>';
    }
    if (numkcds > 0) {
      mb = mb + "<TR><TD colspan=4>&nbsp;</TD></TR>";
      mb = mb + "<TR><TD colspan=4>&nbsp;</TD></TR>";
    }
  }
  mb = mb + "</TABLE>";

  mb =
    mb +
    '<TABLE  class="reports" cellpadding=4 cellspacing=4 border=0 width=85%>';
  mb = mb + "<TR><TD colspan=4> &nbsp; </TD></TR>";
  mb =
    mb +
    '<TR  bgcolor="#A5DF00"><TD width=30%><b>Strategy Statement</b></TD><TD width=40%><b>Action Plan</b></TD><TD width=15%><b>Who</b></TD><TD width=15%><b>When</b></TD></TR>';

  if (reportData[Grbindex] != null) {
    for (var i = 0; i < reportData[Grbindex].length; i++) {
      var oentry = reportData[Grbindex][i];
      if (oentry == null) {
        mb =
          mb +
          "<TR><TD>&nbsp;</TD><TD>&nbsp;</TD><TD>&nbsp;</TD><TD>&nbsp;</TD></TR>";
      } else {
        var ssname = oentry[1];
        var actions = oentry[6];
        if (actions != null) {
          var ssi = true;
          for (var k = 0; k < actions.length; k++) {
            var action = actions[k][0];
            var actiontext = actions[k][1];
            var actionwho = getPersonName(actions[k][3]);
            var actiondate = actions[k][2];
            if (ssi) {
              mb =
                mb +
                "<TR><TD rowspan=" +
                actions.length +
                ">" +
                ssname +
                "</TD><TD>" +
                actiontext +
                "</TD><TD>" +
                actionwho +
                "</TD><TD>" +
                actiondate +
                "</TD></TR>";
              ssi = false;
            } else {
              mb =
                mb +
                "<TR><TD>" +
                actiontext +
                "</TD><TD>" +
                actionwho +
                "</TD><TD>" +
                actiondate +
                "</TD></TR>";
            }
          }
        }
      }
    }
  }

  mb = mb + "</TABLE></CENTER>";

  document.getElementById("mainbody").innerHTML = mb;
}

function viewDoc() {
  document.getElementById("content").innerHTML =
    '<object type="text/html" data="home.html" ></object>';
}

function generateReports() {
  var tabstring = '<div id="reportstat"></div>';

  tabstring =
    tabstring +
    '<P><div style="height: 600px; width: 100%;"> <table class="fancyTable" id="reportstab" width=100% cellpadding=2 cellspacing=2 border=1><thead>';
  tabstring =
    tabstring +
    "<TR><TH>Project name</TH><TH>Company name</TH><TH>Business unit</TH><TH>Description</TH><TH>Value of contract</TH><TH>Supplier(s)</TH><TH>Report</TH></TR>";
  tabstring = tabstring + "</thead><tbody>";
  for (var i = 0; i < Gstrategies.length; i++) {
    var mods = "";
    if (i % 2 == 0) mods = 'class="alt"';
    tabstring = tabstring + "<TR " + mods + ">";

    tabstring = tabstring + "<TD>" + Gstrategies[i][4] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][1][1] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][3][1] + "</TD>";
    tabstring = tabstring + "<TD>" + Gstrategies[i][5] + "</TD>";
    if (Gstrategies[i][6] != null && Gstrategies[i][6].length > 1) {
      var curr = CurrencyFormat(
        Gstrategies[i][6][0],
        Gstrategies[i][6][1],
        0,
        "",
        ","
      );
      tabstring = tabstring + "<TD>" + curr + "</TD>";
    } else tabstring = tabstring + "<TD> &nbsp;</TD>";
    tabstring = tabstring + "<TD>";
    if (Gstrategies[i][9] != null) {
      for (var j = 0; j < Gstrategies[i][9].length; j++)
        tabstring = tabstring + Gstrategies[i][9][j][1] + "<br>";
      tabstring = tabstring + "&nbsp;";
    } else tabstring = tabstring + "&nbsp;";
    tabstring = tabstring + "</TD>";
    tabstring = tabstring + "<TD width=80 align=center>";
    tabstring =
      tabstring +
      '<input type=submit  value="View Report" onClick="masterWorksheet(' +
      Gstrategies[i][0] +
      ')"></TD></TR>';
  }

  tabstring = tabstring + "</tbody></table></div>";
  return tabstring;
}

function refreshMyProjects(val) {
  GallProjects = true;
  document.getElementById("mainbody").innerHTML = strategiesTable(val);
}

function latestUpdates() {
  var result = "<center><table width=80% class=fancyTable>";
  result =
    result + "<TR><TD><b>Ordering Strategic Options in the Define Step</b><P>";
  result =
    result +
    "You can now re-order the different strategic options for a cost driver.  The idea is to let you group the strategic options in order of priority, for example.  Use the arrow keys next to each option to get that done.<P></TD></TR>";
  result = result + '<TR class="odd"><TD><b>De-activating a Project:</b><P>';
  result =
    result +
    'If you want to exclude projects from view, rather than delete the project, you can De-Activate it.  There are two steps involved: <OL style="margin: 2px 2px 2px 20px"><LI>From the admin menu, you can select <i>Edit Projects</i> to de-activate an active project; or activate a de-activated project.</LI><LI>On the opening <i>My Projects</i> screen, you can opt to dislay ALL projects or only active projects.  De-activated projects are shown in a light orange color to distinguish them from active projects.</LI></OL>Only admin users can de-activate a project.<P></TD></TR>';
  result = result + "<TR><TD><b>De-activating a Strategy Statement:</b><P>";
  result =
    result +
    'You might find that you have occasionally created a strategy statement that does not have any value.  Rather than delete it, you can de-activate it and elect to hide it from the normal view.  This has two steps:<OL style="margin: 2px 2px 2px 20px"><LI>When you open any strategy statement, under the text for the strategy statement, there are now radio buttons.  You can elect to de-activate an active strategy statement, or activate a de-activated strategy statement.</LI><LI>In the header for the R step, you are now provided radio buttons to elect to see either ALL strategy statements or only the active ones.  You will see the inactive stratements marked with orange.<P></LI></OL></TD></TR>';

  result =
    result +
    '<TR class="odd"><TD><b>Improvements in Identify worksheet:</b><P>';
  result =
    result +
    'Several improvements in the Identify worksheet. <OL style="margin: 2px 2px 2px 20px"><LI>Automatically calculated &quot;Unaccounted&quot; cost elements show up ONLY when they are non-zero, reducing clutter.<LI>Colors are a little more gentle and coordinated with the overall theme of the page.</LI><LI>Visually, you can distinguish places where inputs are needed, and the auto calculated cells.<P></LI></OL></TD></TR>';

  result = result + "</TABLE></center>";
  return result;
}

function setEDDirectoryNav(page) {
  var companiesActive = "",
    peopleActive = "";
  if (
    page.valueOf() == "companies".valueOf() ||
    page.valueOf() == "directory".valueOf()
  )
    companiesActive = " active";
  else peopleActive = " active";
  var body =
    '<div class="main_nav_wrp">' +
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">                  ' +
    '<ul class="tab_sub_nav Directory_subnav">' +
    '<li class="' +
    companiesActive +
    '">' +
    '<a href="#" class="switch-main-contents" switchThis="companies">Companies</a>' +
    "</li>" +
    '<li class="' +
    peopleActive +
    '">' +
    '<a href="#" class="switch-main-contents" switchThis="people">People</a>' +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  document.getElementById("pagenavbar").innerHTML = body;
  $("#pagenavbar").css("display", "block");
}

function getEmployeeCount(cid) {
  var count = 0;
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (Gpersons[1][i][8] == cid) count++;
  }
  return count;
}

function getProjectCountForCompany(cid) {
  var count = 0;
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][1][0] == cid) count++;
  }
  return count;
}

function getProjectCountForSupplier(cid) {
  //
  var count = 0;
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][9].length !== 0 && Gstrategies[i][9][0][0] == cid) {
      count++;
    }
  }
  return count;
}

function getProjectCountForPerson(pid) {
  var count = 0;
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][10] != null) {
      // the collection of people
      for (var j = 0; j < Gstrategies[i][10].length; j++) {
        if (Gstrategies[i][10][j][0] == pid) {
          count++;
          break;
        }
      }
    }
  }
  return count;
}

function getProjectsForPerson(pid) {
  var projects = [];
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][10] != null) {
      // the collection of people
      for (var j = 0; j < Gstrategies[i][10].length; j++) {
        if (Gstrategies[i][10][j][0] == pid) {
          projects.push([
            Gstrategies[i][0],
            Gstrategies[i][10][j][1],
            Gstrategies[i][10][j][2]
          ]); // [ proj, role ]
        }
      }
    }
  }
  return projects;
}

var newParticipant;

function refreshEDPersonsAddPart(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gpersons = JSON.parse(response);

  peopleEDContent();
  showTimedMessage(
    "gmsg",
    "Person information successfully refreshed",
    5000,
    false
  );
  $.ajax({
    url:
      "add-participant.php?project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      encodeURIComponent(getCompanyForProject(Gcurrentstrategy)) +
      "&bu=" +
      encodeURIComponent(getBUForProject(Gcurrentstrategy)) +
      "&person=" +
      encodeURIComponent(newParticipant) +
      "&role=" +
      encodeURIComponent("MEMBER") +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateStrategiesPart,
    error: teamOpFailed
    //,datatype: "json"
  });
}

function updateStrategiesPart(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-projects-for-user.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshStrategiesPart,
      error: strategyOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function refreshStrategiesPart(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  refreshStrategiesLocal();
  showTimedMessage("gmsg", "Project data successfully refreshed", 3000, false);
  switchMainContents("Background");
}

function showCompanyDetails(cid) {
  Gcurrentcompany = cid;
  var centry = getCompanyEntry(cid);
  var companyWebsite = centry[4] === "" ? "Not Provided" : centry[4];
  var companyAddress = centry[2] === "" ? "Not Provided" : centry[2];
  var companyPhone = centry[5] === "" ? "Not Provided" : centry[5];
  if (centry.length == 0) return; // should never happen...

  body =
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<div class="">' +
    "</div>" +
    '<div class="col-lg-4 col-md-5 col-sm-12 company_details">' +
    '<h3 class="com_name">' +
    centry[1] +
    "</h3>" +
    '<span class="com_asets"> Assets: <strong>' +
    CurrencyFormat(centry[3][0], GdefaultCurrency, 0, "", ",") +
    "</strong></span>" +
    '<div class="contact_details">' +
    '<span class="com_web">Website: <strong>' +
    companyWebsite +
    "</strong></span>" +
    '<span class="com_location">Address: <strong>' +
    companyAddress +
    "</strong></span>" +
    '<span class="com_contact"> Phone:<strong> ' +
    companyPhone +
    "</strong></span>" +
    "</div>" +
    '<div class="com_details_opt">' +
    '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
    '<div class="opt_btn_wrp"> ' +
    '<ul class="other_action">                                         ' +
    '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDCompany(' +
    cid.toString() +
    ');"> Edit Company</a> </li>' +
    // '<li><a href="#" class="mark_del_cost" onclick=""> Delete Company </a> </li>' +
    "</ul> " +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="clearfix"></div>' +
    '<div class="project_container">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Projects</h2>' +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openproject_modal" data-toggle="modal" onClick="addEDProjectForCompany(' +
    cid +
    ')" data-target="#projects_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Project' +
    "</a>" +
    "</div>" +
    '<div class="project_table_wrp">' +
    '<table class="table project_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting">Project</th>' +
    '<th width="15%"> Department  </th>' +
    '<th width="15%"> Supplier</th>' +
    '<th width="15%">Current Step</th>' +
    '<th width="20%">Last edited </th>' +
    '<th width="5%"></th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    '<div class="bg-white project_details_scroll cus_scroll">' +
    '<table class="table project_table">' +
    "<tbody>";

  var projectIDs = getProjectsForCompany(Gcurrentcompany);
  var projectIdIndex = getProjectsIndexForCompany(Gcurrentcompany);

  if (projectIDs.length) {
    for (var j = 0; j < projectIDs.length; j++) {
      var sentry = getProjectEntry(projectIDs[j]);

      body =
        body +
        "<tr>" +
        '<td width="30%">' +
        sentry[4] +
        "</td>" +
        '<td width="15%">' +
        sentry[3][1] +
        "</td>" +
        '<td width="15%">';
      if (sentry[9] != null) {
        for (var k = 0; k < sentry[9].length; k++) {
          body = body + sentry[9][k][1] + "<br>";
        }
      }
      body =
        body +
        "</td>" +
        '<td width="15%">' +
        '<span class="cur_step"> ' +
        sentry[12];

      body =
        body +
        "</span>" +
        "</td>" +
        '<td width="20%">' +
        getPrintDate(sentry[8]) +
        "</td>" +
        '<td width="5%">' +
        '<div class="company_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDProject(' +
        projectIdIndex[j] +
        ')"> Edit </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDProject(' +
        sentry[0] +
        ')"> Delete </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  } else {
    body += '<tr><td colspan="5">No Data Available</td></tr>';
  }
  body =
    body +
    "</tbody>" +
    "</table>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "<br>" +
    '<div class="employee_container">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">People</h2>' +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openemployee_modal" onClick="addEDPersonForCompany(' +
    cid +
    ')" data-toggle="modal" data-target="#employee_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> People' +
    "</a>" +
    "</div>" +
    '<div class="employee_table_wrp">' +
    '<table class="table employee_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting">Name</th>' +
    '<th width="15%"> Designation  </th>' +
    '<th width="25%"> Projects</th>' +
    '<th width="25%">Email</th>' +
    '<th width="5%"></th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    '<div class="employee_scroll cus_scroll">' +
    '<table class="table employee_table">' +
    "<tbody>";

  for (var j = 0; j < Gpersons[1].length; j++) {
    if (Gpersons[1][j][8] == Gcurrentcompany) {
      //
      var names = getFirstLastFromId(Gpersons[1][j][0]);
      var handle = names[2];
      body =
        body +
        '<tr class="employee_data">' +
        '<td width="30%">' +
        generateProfileIconFromId(Gpersons[1][j][0], "empname") +
        names[0] +
        " " +
        names[1] +
        " </td>" +
        '<td width="15%">' +
        Gpersons[1][j][6] +
        " </td>" +
        '<td width="25%">' +
        getProjectCountForPerson(Gpersons[1][j][0]) +
        "</td>" +
        '<td width="25%">' +
        Gpersons[1][j][1] +
        "</td>" +
        '<td width="5%">' +
        '<div class="company_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDPerson(' +
        j +
        ')"> Edit </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDPerson(' +
        Gpersons[1][j][0] +
        '"> Delete </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  }

  body = body + "</tbody>" + "</table>" + "</div>" + "</div>" + "</div>";

  // alert (body);
  document.getElementById("companiesPage").innerHTML = body;
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
}

function companiesEDContent() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    "<!-- company list -->" +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<div id="companiesPage">' +
    '<div class="col-lg-12 col-md-12 col-sm-12 company_list">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Companies</h2>' +
    // added 11/22/2017
    '<div class="dir_searchbox">                       ' +
    '<input type="text" id="search_company" onKeyUp="filterCompaniesTable()"  class="search_input" placeholder="Search ....">' +
    '<button type="submit" class="searchbox search_submit"><img src="images/search_icon.png" /> </button>' +
    "</div>" +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="opencompany_modal" onClick="addEDCompany()">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Company' +
    "</a>" +
    "</div>" +
    '<div class="company_table_wrp">' +
    '<table class="table company_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting sortable asc">Company name</span></th>' +
    '<th align=center width="15%"  class="sortable">Projects</th>' +
    '<th align=center width="15%" class="sortable">Employees</th>' +
    '<th  width="20%" class="sortable">Website</th>' +
    '<th align =center width="15%" class="sortable">Company type </th>' +
    '<th width="5%"></th>' +
    "</tr>" +
    "</thead></table>";
  body +=
    '<div class="zero-padding company_scroll cus_scroll">' +
    '<table class="table sort_table company_table" id="company_table">';

  // loop through the companies to put the data into the table

  for (var i = 0; i < Gcompanies.length; i++) {
    //coding here now
    // if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    var supplier = " ";
    if (Gcompanies[i].length > 6) supplier = " ";
    var weblink = Gcompanies[i][4];
    if (weblink.valueOf() != "".valueOf()) {
      if (
        weblink
          .substring(0, 4)
          .toUpperCase()
          .valueOf() != "HTTP".valueOf()
      )
        weblink = "http://" + weblink;
    } else weblink = "#";
    var row =
      "<tr >" +
      '<td width="30%">  <a onClick="showCompanyDetails(' +
      Gcompanies[i][0] +
      '); return false;" href="#" class="company_name">' +
      Gcompanies[i][1] +
      "</a> </td>" +
      '<td width="15%">' +
      getProjectCountForCompany(Gcompanies[i][0]) +
      "</td>" +
      '<td width="15%">' +
      getEmployeeCount(Gcompanies[i][0]) +
      "</td>" +
      '<td width="20%">' +
      '<a href="' +
      weblink +
      '" class="company_website" target="_blank">' +
      Gcompanies[i][4] +
      "</a>" +
      "</td>" +
      '<td width="15%">' +
      supplier +
      "</td>" +
      "<td> " +
      '<div class="company_opt">' +
      '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDCompany(' +
      Gcompanies[i][0] +
      ')"> Edit Company</a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDCompany(' +
      Gcompanies[i][0] +
      ')"> Delete Company</a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
    //alert("row " + i + " = " + row);
    body = body + row;
    //alert("body: " + i + " = " + body );
  }
  if (Gemployer != 1) {
    for (var i = 0; i < Gsuppliers.length; i++) {
      //coding here now
      // if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
      var supplier = "Supplier";
      var weblink = "";
      var row =
        "<tr >" +
        '<td width="30%">  <a onClick="showCompanyDetails(' +
        Gsuppliers[i][1] +
        '); return false;" href="#" class="company_name">' +
        Gsuppliers[i][0] +
        "</a> </td>" +
        '<td width="15%">' +
        getProjectCountForSupplier(Gsuppliers[i][1]) +
        "</td>" +
        '<td width="15%">' +
        getEmployeeCount(Gsuppliers[i][1]) +
        "</td>" +
        '<td width="20%">' +
        weblink +
        "</td>" +
        '<td width="15%">' +
        supplier +
        "</td>" +
        "<td> " +
        '<div class="company_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDCompany(' +
        Gsuppliers[i][1] +
        ')"> Edit Company</a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDCompany(' +
        Gsuppliers[i][1] +
        ')"> Delete Company</a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
      //alert("row " + i + " = " + row);
      body = body + row;
      //alert("body: " + i + " = " + body );
    }
  }

  body = body + " </table></div>" + "</div>" + "</div>";

  body = body + "</div>" + "</div>";

  //alert("reached here : " + body);
  document.getElementById("mainbody").innerHTML = body;
  $(".sortable").click(function() {
    var o = $(this).hasClass("asc") ? "desc" : "asc";
    $(".sortable")
      .removeClass("asc")
      .removeClass("desc");
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;

    sort(colIndex, o);
  });
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
}

function getActionCountForPerson(pid) {
  return "TBD";
}

function showPersonDetails(pid) {
  var pentry = [],
    ind = -1;
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (pid == Gpersons[1][i][0]) {
      pentry = Gpersons[1][i];
      ind = i;
      break;
    }
  }
  var names = getFirstLastFromId(pid);
  var personDesignation = pentry[6] === "" ? "Not Provided" : pentry[6];
  var personCompany = pentry[7] === "" ? "Not Provided" : pentry[7];
  var personEmail = pentry[1] === "" ? "Not Provided" : pentry[1];
  // alert("person details 1");
  var body =
    "<!-- people details -->" +
    '<div class="col-lg-12 col-md-12 col-sm-12 people_details_wrp">' +
    '<div class="sec_head">' +
    "</div>" +
    '<div class="col-lg-4 col-md-5 col-sm-12 people_details">' +
    '<h3 class="people_name">' +
    names[0] +
    " " +
    names[1] +
    "</h3>" +
    '<span class="people_desg"> Designation: <strong>' +
    personDesignation +
    "</strong></span>" +
    '<span class="people_company">Company: <strong>' +
    personCompany +
    "</strong></span>" +
    '<div class="contact_details">' +
    '<span class="people_email"> Email: <strong>' +
    personEmail +
    "</strong></span>" +
    "</div>" +
    '<div class="people_details_opt">' +
    '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
    '<div class="opt_btn_wrp optdropdown persondropdown"> ' +
    '<ul class="other_action">                                         ' +
    '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDPerson(' +
    ind +
    ')"> Edit Person</a> </li>' +
    '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDPerson(' +
    pid +
    ')"> Delete Person </a> </li>' +
    "</ul> " +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="clearfix"></div>' +
    '<div class="part_project_container">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Participating Projects</h2>' +
    "</div>" +
    '<div class="part_project_table_wrp">' +
    '<table class="table part_project_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="60%" class="sorting">Project</th>' +
    '<th width="20%"> Team Role  </th>' +
    '<th width="15%"> Pending Actions</th>' +
    '<th width="5%"></th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    '<div class="part_project_scroll cus_scroll">' +
    '<table class="table part_project_table">' +
    "<tbody>";
  // alert("person details = " + body);
  var projects = getProjectsForPerson(pid);
  if (projects.length) {
    for (var i = 0; i < projects.length; i++) {
      var pentry = getProjectEntry(projects[i][0]);
      body =
        body +
        '<tr class="part_project_data">' +
        '<td width="60%">' +
        pentry[4] +
        "</td>" +
        '<td width="20%">' +
        projects[i][1] +
        "</td>" +
        '<td width="15%">' +
        projects[i][2] +
        "</td>" +
        '<td width="5%">' +
        '<div class="company_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDProject(' +
        i +
        ')"> Edit </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDProject(' +
        projects[i][0] +
        ')"> Delete </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  } else {
    body += '<td rowspan="4">No Data Available</td>';
  }

  // alert("person details 3 " + body);
  body =
    body + "</tbody>" + "</table>" + "</div>" + "</div>" + "</div>" + "</div>";
  document.getElementById("personDetails").innerHTML = body;
}

function peopleEDContent() {
  body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    "<!-- people list -->" +
    '<div id="personDetails">' +
    '<div class="col-lg-12 col-md-12 col-sm-12 people_list">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">People</h2>' +
    // added 11/22/2017
    '<div class="dir_searchbox">                       ' +
    '<input type="text" id="search_people" onKeyUp="filterPeopleTable()"  class="search_input" placeholder="Search ....">' +
    '<button type="submit" class="searchbox search_submit"><img src="images/search_icon.png" /> </button>' +
    "</div>" +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openemployee_modal" onClick="addEDPerson()" data-toggle="modal" data-target="#employee_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> People' +
    "</a>" +
    "</div>" +
    '<div class="people_table_wrp">' +
    '<table class="table people_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="30%" class="sorting sortable asc">Name</th>' +
    '<th width="15%" class="sortable">Company</th>' +
    '<th width="15%" class="sortable">Designation  </th>' +
    '<th width="15%" class="sortable">Projects</th>' +
    '<th width="20%" class="sortable asc">Email</th>' +
    '<th width="5%"></th>' +
    "</tr>" +
    "</thead></table>";
  body +=
    '<div class="zero-padding people_scroll cus_scroll">' +
    '<table class="table sort_table people_table">';
  ("<tbody>");

  // loop through all the persons populating the table...
  for (var i = 0; i < Gpersons[1].length; i++) {
    //
    if (Gemployer != 1 && Gpersons[1][i][8] != Gemployer) continue;
    var names = getFirstLastFromId(Gpersons[1][i][0]);
    var handle = names[2];
    //alert ("made it here: " + i);
    body =
      body +
      '<tr class="employee_data" >' +
      '<td width="30%">' +
      generateProfileIconFromId(Gpersons[1][i][0], "empname") +
      '<a onClick="showPersonDetails(' +
      Gpersons[1][i][0] +
      '); return false;" href="javascript:void(0);"  class="person_name">' +
      names[0] +
      " " +
      names[1] +
      "</a></td>" +
      '<td width="15%">' +
      Gpersons[1][i][7] +
      "</td>" +
      '<td width="15%">' +
      Gpersons[1][i][6] +
      "</td>" +
      '<td width="15%">' +
      getProjectCountForPerson(Gpersons[1][i][0]) +
      "</td>" +
      '<td width="20%">' +
      Gpersons[1][i][1] +
      "</td>" +
      '<td width="5%">' +
      '<div class="company_opt">' +
      '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDPerson(' +
      i +
      ')"> Edit </a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDPerson(' +
      Gpersons[1][i][0] +
      ')"> Delete </a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
  }
  let supCompanyId = [];
  for (var key in Gsuppliers) {
    //
    supCompanyId.push(Gsuppliers[key][1]);
  }
  if (Gemployer != 1) {
    for (var i = 0; i < Gpersons[1].length; i++) {
      //
      if (getProjectCountForPerson(Gpersons[1][i][0]) === 0) continue;
      if (supCompanyId.indexOf(Gpersons[1][i][8]) === -1) continue;
      // if(Gemployer != 1 && Gpersons[1][i][8] != Supemployer) continue;
      var names = getFirstLastFromId(Gpersons[1][i][0]);
      var handle = names[2];
      //alert ("made it here: " + i);
      body =
        body +
        '<tr class="employee_data" >' +
        '<td width="30%">' +
        generateProfileIconFromId(Gpersons[1][i][0], "empname") +
        '<a onClick="showPersonDetails(' +
        Gpersons[1][i][0] +
        '); return false;" href="javascript:void(0);"  class="person_name">' +
        names[0] +
        " " +
        names[1] +
        "</a></td>" +
        '<td width="15%">' +
        Gpersons[1][i][7] +
        "</td>" +
        '<td width="15%">' +
        Gpersons[1][i][6] +
        "</td>" +
        '<td width="15%">' +
        getProjectCountForPerson(Gpersons[1][i][0]) +
        "</td>" +
        '<td width="20%">' +
        Gpersons[1][i][1] +
        "</td>" +
        '<td width="5%">' +
        '<div class="company_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDPerson(' +
        i +
        ')"> Edit </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDPerson(' +
        Gpersons[1][i][0] +
        ')"> Delete </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  }
  //alert(body);
  body = body + "</tbody>" + "</table></div>";
  "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
  document.getElementById("mainbody").innerHTML = body;

  $(".sortable").click(function() {
    var o = $(this).hasClass("asc") ? "desc" : "asc";
    $(".sortable")
      .removeClass("asc")
      .removeClass("desc");
    $(this).addClass(o);

    var colIndex = $(this).prevAll().length;

    sort(colIndex, o);
  });
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
}
kbFilter = ["all"];
/**
 * Module called when a link is clicked
 * @param {string} page - Name of the link clicked
 */
function switchMainContentsInternal(page) {
  // this is called ONLY when users shift page -- so reset display data for various screens...
  resetMDState();

  if (page.valueOf() == "myprojects".valueOf()) {
    $(".main_wrapper").css("margin-top", "60px");
  } else {
    $(".main_wrapper").css("margin-top", "121px");
  }

  changedObjects = [];
  Gcurrentpage = page;

  if (
    page.valueOf() == "Agree".valueOf() ||
    page.valueOf() == "Identify".valueOf() ||
    page.valueOf() == "Measure".valueOf() ||
    page.valueOf() == "Define".valueOf() ||
    page.valueOf() == "Reduce".valueOf() ||
    page.valueOf() == "Implement".valueOf() ||
    page.valueOf() == "Verify".valueOf() ||
    page.valueOf() == "Eternal".valueOf()
  ) {
    if (Gcurrentstrategy <= 0) {
      document.getElementById("mainbody").innerHTML =
        "<h3> Please select a project to view this page</h3>";
      return;
    }
    var hid = page + "-header";
    var bid = page + "-body";
    document.getElementById("mainbody").innerHTML =
      '<div id="' + hid + '"></div><div id="' + bid + '"></div>';

    strategyHeader(page);
    GcurrentSS = -1;
    if (page.valueOf() == "Agree".valueOf()) refreshAStep();
    else if (page.valueOf() == "Identify".valueOf()) identifyStepContents();
    else if (page.valueOf() == "Measure".valueOf()) refreshMStep();
    else if (page.valueOf() == "Define".valueOf()) refreshDStep();
    else if (page.valueOf() == "Reduce".valueOf()) refreshRStep();
    else if (page.valueOf() == "Implement".valueOf()) refreshImStep();
    else if (page.valueOf() == "Verify".valueOf()) refreshVStep();
    else if (page.valueOf() == "Eternal".valueOf())
      document.getElementById(
        "Eternal-body"
      ).innerHTML = eternalStepContents2();
    return;
  }

  if (
    page.valueOf() == "Cor".valueOf() ||
    page.valueOf() == "progress".valueOf()
  ) {
    setEDReportsNav(page);
    setEDProjectHeader(page);
    if (page.valueOf() == "Cor".valueOf()) {
      refreshCOR();
    } else refreshProgressReport();
    return;
  }

  if (
    page.valueOf() == "Background".valueOf() ||
    page.valueOf() == "Tasks".valueOf() ||
    page.valueOf() == "Workplan".valueOf()
  ) {
    setEDMgmtNav(page);
    setEDProjectHeader(page);
    if (page.valueOf() == "Tasks".valueOf()) {
      refreshTasks();
    } else if (page.valueOf() == "Workplan".valueOf()) refreshWorkplan();
    else refreshBackground();
    return;
  }

  if (page.valueOf() == "myprojects".valueOf()) {
    setEDGenericHeader("myprojects");
    setEDPageNav("myprojects");
    setEDMyProjectsBody();
    return;
  }

  if (page.valueOf() == "latest".valueOf()) {
    setEDPageNav(page);
    setEDGenericHeader("<H5>&nbsp;What&#39;s New?" + "</H5>");
    document.getElementById("mainbody").innerHTML = latestUpdates();
    return;
  }

  if (page.valueOf() == "bunits".valueOf()) {
    updateHeader(
      "<H5>&nbsp;" + "&nbsp;Add/Edit Business Units" + "</H5>",
      "&nbsp;",
      "&nbsp;"
    );
    document.getElementById("mainbody").innerHTML = projectsTable();
    return;
  }
  if (page.valueOf() == "editproj".valueOf()) {
    var csave =
      '<button title="Save changes to projects" type"button" class="btn-sm btn-primary" onClick="saveAllProjects()"> Save Projects</button>';
    updateHeader(
      "<H5>&nbsp;" + "&nbsp;Add/Edit Projects" + "</H5>",
      csave,
      "&nbsp;"
    );
    document.getElementById("mainbody").innerHTML = strategiesTableAdmin();

    return;
  }

  if (page.valueOf() == "editteam".valueOf()) {
    updateHeader(
      "<H5>&nbsp;" + "&nbsp;Project Suppliers &amp; Teams" + "</H5>",
      "&nbsp;",
      "&nbsp;"
    );
    document.getElementById("mainbody").innerHTML = teamTableAdmin();
    return;
  }

  if (page.valueOf() == "myprofile".valueOf()) {
    var csave =
      '<button title="Save changes to my profile" type"button" class="btn-sm btn-primary" onClick="saveMyProfile()"> Save My Profile</button>';
    updateHeader(
      "<H5>&nbsp;" + "&nbsp;View/Edit My Profile" + "</H5>",
      csave,
      "&nbsp;"
    );
    document.getElementById("mainbody").innerHTML = editMyProfile();

    return;
  }

  if (page.valueOf() == "editcomm".valueOf()) {
    updateHeader(
      "<H5>&nbsp;" + "&nbsp;Add/Edit Categories" + "</H5>",
      "&nbsp;",
      "&nbsp;"
    );
    document.getElementById("mainbody").innerHTML = commTable();
    return;
  }

  if (
    page.valueOf() == "directory".valueOf() ||
    page.valueOf() == "companies".valueOf()
  ) {
    setEDGenericHeader(page);
    setEDDirectoryNav(page);
    companiesEDContent();
    return;
  }
  // if people insided directory is clicked
  if (page.valueOf() == "people".valueOf()) {
    setEDGenericHeader(page);
    setEDDirectoryNav(page);
    peopleEDContent();
    return;
  }
  // if reports is clicked
  if (page.valueOf() == "reports".valueOf()) {
    setEDGenericHeader(page);
    setEDPageNav(page);
    getAllReportData();
    return;
  }
  // if academy is clicked
  if (page.valueOf() == "academy".valueOf()) {
    setEDGenericHeader(page);
    setEDPageNav(page);
    document.getElementById("mainbody").innerHTML =
      "Contents for page: " + page + " goes here";
    return;
  }
  // if knowledgebase is clicked
  if (page.valueOf() == "knowledgebase".valueOf()) {
    setEDGenericHeader(page);
    setEDPageNav(page);
    var kballChecked = "";
    var kbcceChecked = "";
    var kbkcdChecked = "";
    var kbssoChecked = "";
    var kbsssChecked = "";
    if (kbFilter.indexOf("all") !== -1) {
      kballChecked = "checked";
    }
    if (kbFilter.indexOf("cce") !== -1) {
      kbcceChecked = "checked";
    }
    if (kbFilter.indexOf("kcd") !== -1) {
      kbkcdChecked = "checked";
    }
    if (kbFilter.indexOf("sso") !== -1) {
      kbssoChecked = "checked";
    }
    if (kbFilter.indexOf("sss") !== -1) {
      kbsssChecked = "checked";
    }
    if (kbFilter.length === 0) {
    }
    document.getElementById("mainbody").innerHTML = `
    <div class="" style="margin: 0px 2%">
    <h3>Select</h3>
    <div class="form-check form-check-inline">
  <input ${kballChecked} class="form-check-input kb-checkbox" name="filter" type="checkbox" id="allFilter" value="all">
  <label class="form-check-label" for="allFilter">All</label>
</div>
<div class="form-check form-check-inline">
  <input ${kbcceChecked} class="form-check-input kb-checkbox" name="filter" type="checkbox" id="cceFilter" value="cce">
  <label class="form-check-label" for="cceFilter">Critical Cost Elements</label>
</div>
<div class="form-check form-check-inline">
  <input ${kbkcdChecked} class="form-check-input kb-checkbox" name="filter" type="checkbox" id="kcdFilter" value="kcd">
  <label class="form-check-label" for="kcdFilter">Key Cost Drivers</label>
</div>
<div class="form-check form-check-inline">
  <input ${kbssoChecked} class="form-check-input kb-checkbox" name="filter" type="checkbox" id="ssoFilter" value="sso">
  <label class="form-check-label" for="ssoFilter">Selected Strategic Options</label>
</div>
<div class="form-check form-check-inline">
  <input ${kbsssChecked} class="form-check-input kb-checkbox" name="filter" type="checkbox" id="sssFilter" value="sss">
  <label class="form-check-label" for="sssFilter">Selected Strategy Statements</label>
</div>
<input type="button" class="modify-search" value="Modify Search" onClick="modifySearch()" />
<input type="button" class="modify-search" value="Clear Search" onClick="clearSearch()" />
    </div>
    <table id="example" class="display" style="width:100%">
    <thead>
    <tr>
            <th width="15%">Title</th>
            
            <th width="10%">Critical Cost</th>
            <th width="12%">Cost drivers</th>
            <th width="20%">Strategic Options</th>
            <th>Strategy Statements</th>
        </tr>
        <tr class="small-thead">
            <th width="15%">Title</th>
            
            <th width="10%">Critical Cost</th>
            <th width="12%">Cost drivers</th>
            <th width="20%">Strategic Options</th>
            <th>Strategy Statements</th>
        </tr>
    </thead>
    <tfoot>
        <tr>
        <th width="15%">Title</th>
        
        <th width="10%">Critical Cost</th>
        <th width="12%">Cost drivers</th>
        <th width="20%">Strategic Options</th>
        <th>Strategy Statements</th>
        </tr>
    </tfoot>
</table>`;
    $(".kb-checkbox").on("click", function() {
      //
      let checked = $(this).prop("checked");
      let whichCheckbox = $(this).val();
      if (checked) {
        if (whichCheckbox === "all") {
          kbFilter = ["all"];
          $(".kb-checkbox").prop("checked", false);
          $("#allFilter").prop("checked", true);
        } else {
          let allIndex = kbFilter.indexOf("all");

          if (allIndex !== -1) kbFilter.splice(allIndex, 1);

          if (kbFilter.indexOf(whichCheckbox) === -1) {
            kbFilter.push(whichCheckbox);
          }

          $("#allFilter").prop("checked", false);
        }
      } else {
        let whichCheckboxIndex = kbFilter.indexOf(whichCheckbox);
        kbFilter.splice(whichCheckbox, 0);
      }
    });

    $("#example thead tr:eq(1) th").each(function() {
      var title = $(this).text();
      $(this).html(
        '<input type="text" placeholder="Search ' +
          title +
          '" class="column_search" />'
      );
    });
    var somex = $("#example").DataTable({
      dom: "Bfrtip",
      fixedHeader: {
        header: true,
        footer: true
      },
      ajax: {
        url: "/knowledgebase.php",
        data: {
          employer: Gemployer,
          filter: kbFilter
        },
        method: "post"
      },
      columns: [
        { data: "project" },
        { data: "cost_element" },
        { data: "cost_driver" },
        { data: "strategic_option" },
        { data: "strategy_statement" }
      ],
      buttons: [
        {
          extend: "csvHtml5",
          filename: "aimdrive_" + new Date().toLocaleDateString(),
          text: "Export to CSV",
          exportOptions: {
            stripHtml: true
          }
        }
      ],
      columnDefs: [{ className: "bold-title", targets: [0] }],
      orderCellsTop: true,
      pageLength: 10
    });

    $("#example thead").on("keyup", ".column_search", function() {
      somex
        .column(
          $(this)
            .parent()
            .index()
        )
        .search(this.value)
        .draw();
    });
    $("#example").on("click", "tbody tr", function() {
      let rowData = somex.row(this).data();
      //

      let c = confirm(
        "You will be navigated to " + rowData["project"] + " project screen!"
      );
      if (c) {
        selectStrategy(rowData.pjid);
      }
    });
    return;
  }
  // if tutorial is clicked
  if (page.valueOf() == "learning".valueOf()) {
    setEDGenericHeader(page);
    setEDPageNav(page);
    learningModule();
    return;
  }

  setEDPageNav(page);
  document.getElementById("mainbody").innerHTML =
    "Contents for page: " + page + " goes here";
}

function videoHTML(num) {}
/**
 * HTML for tutorial tab is prepared here
 */
function learningModule() {
  let htmlBody = `
  <div class="container-fluid">
<div id="faq" role="tablist" aria-multiselectable="true">
<h1>AIM & DRIVE Tutorial</h1>
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question1">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer1" aria-expanded="true" aria-controls="answer1">
AIMandDRIVE Introduction
</a>
</h5>
</div>
<div id="answer1" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="question1">
<div class="panel-body">
<video controls id="video1" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/1.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>

<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question2">
<h5 class="panel-title">
<a class="collapsed" data-toggle="collapse" data-parent="#faq" href="#answer2" aria-expanded="false" aria-controls="answer2">
Definition of the Word Strategy
</a>
</h5>
</div>
<div id="answer2" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question2">
<div class="panel-body">
<video controls id="video2" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/2.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>

<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question3">
<h5 class="panel-title">
<a class="collapsed" data-toggle="collapse" data-parent="#faq" href="#answer3" aria-expanded="false" aria-controls="answer3">
Do We Really Need A Strategy
</a>
</h5>
</div>
<div id="answer3" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question3">
<div class="panel-body">
<video controls id="video3" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/3.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question4">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer4" aria-expanded="false" aria-controls="answer4">
Selecting A Strategy
</a>
</h5>
</div>
<div id="answer4" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question4">
<div class="panel-body">
<video controls id="video4" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/4.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question5">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer5" aria-expanded="false" aria-controls="answer5">
AIM and DRIVE Overview
</a>
</h5>
</div>
<div id="answer5" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question5">
<div class="panel-body">
<video controls id="video5" class='video-video' style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/5.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question6">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer6" aria-expanded="false" aria-controls="answer6">
Win-Win Key Success Factor
</a>
</h5>
</div>
<div id="answer6" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question6">
<div class="panel-body">
<video controls id="video6" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/6.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question7">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer7" aria-expanded="false" aria-controls="answer7">
Agreeing on the Need to Manage Cost Part 1
</a>
</h5>
</div>
<div id="answer7" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question7">
<div class="panel-body">
<video controls id="video7" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/7.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question8">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer8" aria-expanded="false" aria-controls="answer8">
Agreeing on the Need to Manage Cost Part 2
</a>
</h5>
</div>
<div id="answer8" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question8">
<div class="panel-body">
<video controls id="video8" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/8.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question9">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer9" aria-expanded="false" aria-controls="answer9">
Identify Critical Costs Part 1 Process Map
</a>
</h5>
</div>
<div id="answer9" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question9">
<div class="panel-body">
<video controls id="video9" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/9.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question10">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer10" aria-expanded="false" aria-controls="answer10">
Identify Critical Costs Part 2 Cost Structure
</a>
</h5>
</div>
<div id="answer10" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question10">
<div class="panel-body">
<video controls id="video10" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/10.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question11">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer11" aria-expanded="false" aria-controls="answer11">
Measuring Secondary and Tertiary Costs Part 1
</a>
</h5>
</div>
<div id="answer11" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question11">
<div class="panel-body">
<video controls id="video11" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/11.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question12">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer12" aria-expanded="false" aria-controls="answer12">
Measuring Part 2 Formula Based Costing
</a>
</h5>
</div>
<div id="answer12" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question12">
<div class="panel-body">
<video controls id="video12" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/12.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question13">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer13" aria-expanded="false" aria-controls="answer13">
Measuring Part 3 Creating Formulas
</a>
</h5>
</div>
<div id="answer13" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question13">
<div class="panel-body">
<video controls id="video13" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/13.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question14">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer14" aria-expanded="false" aria-controls="answer14">
Developing Strategic Options Part 1 - Selecting Key Cost Drivers
</a>
</h5>
</div>
<div id="answer14" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question14">
<div class="panel-body">
<video controls id="video14" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/14.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question15">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer15" aria-expanded="false" aria-controls="answer15">
Developing Strategic Options Part 2 - Listing Strategic Options
</a>
</h5>
</div>
<div id="answer15" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question15">
<div class="panel-body">
<video controls id="video15" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/15.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question16">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer16" aria-expanded="false" aria-controls="answer16">
Reduce Eliminate or Change Part 1 - Constraints and Relationships

</a>
</h5>
</div>
<div id="answer16" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question16">
<div class="panel-body">
<video controls id="video16" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/16.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question17">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer17" aria-expanded="false" aria-controls="answer17">
Reduce Eliminate or Change Part 2 - Strategy Statements and Risk Benefit Analysis

</a>
</h5>
</div>
<div id="answer17" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question17">
<div class="panel-body">
<video controls  id="video17" class='video-video' style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/17.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question18">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer18" aria-expanded="false" aria-controls="answer18">
Implement Part 1 - Action Plan Steps

</a>
</h5>
</div>
<div id="answer18" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question18">
<div class="panel-body">
<video controls id="video18" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/18.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question19">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer19" aria-expanded="false" aria-controls="answer19">
Implement Part 2 - Risk Contingency Plan Mgmt Buy In

</a>
</h5>
</div>
<div id="answer19" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question19">
<div class="panel-body">
<video controls id="video19" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/19.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question20">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer20" aria-expanded="false" aria-controls="answer20">
Verify the Plan with Cost Monitors

</a>
</h5>
</div>
<div id="answer20" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question20">
<div class="panel-body">
<video controls id="video20" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/20.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
<!-- section starts-->
<div class="panel panel-default">
<div class="panel-heading" role="tab" id="question21">
<h5 class="panel-title">
<a data-toggle="collapse" data-parent="#faq" href="#answer21" aria-expanded="false" aria-controls="answer21">
Eternally Improving and Modifying the Process
</a>
</h5>
</div>
<div id="answer21" class="panel-collapse collapse" role="tabpanel" aria-labelledby="question21">
<div class="panel-body">
<video controls id="video21" class='video-video'  style="width:640px;height:360px;" poster="images/logo_big.png">
    <source src="videos_anklesaria/21.mp4"
            type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>
</div>
</div>
</div>
<!-- section ends -->
</div>

</div>`;
  document.getElementById("mainbody").innerHTML = htmlBody;
}

function modifySearch() {
  switchMainContentsInternal("knowledgebase");
}

function clearSearch() {
  kbFilter = ["all"];
  switchMainContentsInternal("knowledgebase");
}

function switchMainContents(page) {
  if (changedObjects.length > 0) {
    $.confirm({
      title: "Attention!",
      message:
        "You have unsaved changes that will be lost if you switch to another page!  Do you want to go ahead anyway (and lose these changes)?",
      buttons: {
        OK: {
          class: "blue",
          action: function() {
            switchMainContentsInternal(page);
          }
        },
        Cancel: {
          class: "gray",
          action: function() {}
        }
      }
    });
  } else switchMainContentsInternal(page);
}

var existingCompany;
var existingBU;
var existingSupplier;
var useSupplier;
var newProjectCN, newProjectCID;
var newProjectpn = "",
  newProjectpdesc = "",
  newProjectpval = "",
  newProjectcurr = "";
var newProjectBUN, newProjectBUid;
var newProjectSN, newProjectsupid;

function setCompany() {
  newProjectCID = document.getElementById("newCompSel").value;
}

function showNewCompany() {
  existingCompany = 0;
  document.getElementById("ncompcontents").innerHTML =
    '<input type=text size=50 id="newCompanyName">';
  document.getElementById("ecompcontents").innerHTML = "";
}

function showCompanies() {
  existingCompany = 1;

  var compsel = '<select id=newCompSel onClick="setCompany()">';
  for (var i = 0; i < Gcompanies.length; i++)
    compsel =
      compsel +
      "<option value=" +
      Gcompanies[i][0] +
      ">" +
      Gcompanies[i][1] +
      "</option>";
  compsel = compsel + "</select>";
  document.getElementById("ncompcontents").innerHTML = "";
  document.getElementById("ecompcontents").innerHTML = compsel;
}

function showNewBU() {
  existingBU = 0;
  document.getElementById("nbuscontents").innerHTML =
    '<input type=text size=50 id="newBUName">';
  document.getElementById("ebuscontents").innerHTML = "";
}

function setNewProjBU() {
  existingBU = 1;
  newProjectBUid = document.getElementById("projexistingBU").value;
}

function showExistingBUs() {
  existingBU = 1;
  var contents = "";
  for (var i = 0; i < Gprojects.length; i++) {
    if ((newProjectCID + "").valueOf() == (Gprojects[i][0] + "").valueOf()) {
      contents =
        contents + '<select id="projexistingBU" onClick="setNewProjBU()">';
      for (var j = 2; j < Gprojects[i].length; j++) {
        contents =
          contents +
          '<OPTION VALUE="' +
          Gprojects[i][j][0] +
          '">' +
          Gprojects[i][j][1] +
          "</OPTION>";
      }
      contents = contents + "</select>";
      break;
    }
  }

  document.getElementById("ebuscontents").innerHTML = contents;
  document.getElementById("nbuscontents").innerHTML = "";
}

function showBUs() {
  if (document.getElementById("newbu").checked) showNewBU();
  else showExistingBUs();
}

function showCompany() {
  if (document.getElementById("existing").checked) showCompanies();
  else showNewCompany();
}

function showNewSupplier() {
  existingSupplier = 0;
  document.getElementById("nsupcontent").innerHTML =
    '<input type=text size=50 id="newSupplierName">';
  document.getElementById("esupcontent").innerHTML = "";
}

function setSupplier() {
  newProjectsupid = document.getElementById("newSupSel").value;
}

function showSuppliers() {
  existingSupplier = 1;

  var contents = '<select id=newSupSel onClick="setSupplier()">';
  for (var i = 0; i < Gcompanies.length; i++)
    if (Gcompanies[i].length >= 7)
      // then it is a supplier...
      contents =
        contents +
        "<option value=" +
        Gcompanies[i][0] +
        ">" +
        Gcompanies[i][1] +
        "</option>";
  contents = contents + "</select>";
  document.getElementById("esupcontent").innerHTML = contents;
  document.getElementById("nsupcontent").innerHTML = "";
}

function showProjSupplier() {
  if (document.getElementById("nosup").checked) {
    useSupplier = 0;
    existingSupplier = null;
    existingSN = null;
    return;
  }
  useSupplier = 1;
  existingSupplier = null;
  existingSN = null;
  if (document.getElementById("exists").checked) showSuppliers();
  else showNewSupplier();
}

function projectNameExists(cid, buid, newpn) {
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][1][0] == cid && Gstrategies[i][3][0] == buid) {
      if (Gstrategies[i][4].valueOf() == newpn.valueOf()) return true;
    }
  }
  return false;
}

function loadProjectsForCompany(id) {
  document.getElementById("step2content").innerHTML = createProjectsFor(id);
}

function getBUName(cid, bid) {
  for (var i = 0; i < Gprojects.length; i++) {
    if ((cid + "").valueOf() == (Gprojects[i][0] + "").valueOf()) {
      for (var j = 2; j < Gprojects[i].length; j++) {
        if ((Gprojects[i][j][0] + "").valueOf() == (bid + "").valueOf())
          return Gprojects[i][j][1];
      }
    }
  }
  return "undefined?";
}

function updateEverything(response) {
  // alert("json string: " + response);
  $(".modal").modal("hide");
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("newprojfeedback", result[1], 0, true);
    return;
  }
  reloadStrategies();
}

function reloadStep4(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("newprojfeedback", result[1], 0, true);
    return;
  }
  Gprojects = result[1];
  refreshProjectsLocal();
  showTimedMessage(
    "newprojfeedback",
    "All information successfully refreshed",
    5000,
    false
  );

  switchMainContents("myprojects");
}

function reloadStep3(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }

    showTimedMessage(
      "newprojfeedback",
      "Loading business units & divisions...",
      0,
      true
    );
    return;
  }

  Gcompanies = result[1];
  sortCompanies();
  showTimedMessage(
    "newprojfeedback",
    "Loading business units & divisions...",
    0,
    false
  );
  $.ajax({
    url:
      "get-all-bus-divisions.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: reloadStep4,
    error: startupfailed
    //,datatype: "json"
  });
}

function reloadStep2(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("newprojfeedback", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  if (Gadmin > 0) {
    $.ajax({
      url:
        "get-companies.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: reloadStep3,
      error: startupfailed
      //,datatype: "json"
    });
  } // not an administrator...
  else {
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: usersReady,
      error: startupfailed
      //,datatype: "json"
    });
  }
}

function reloadStrategies() {
  if (document.getElementById("newprojfeedback") != null)
    document.getElementById("newprojfeedback").innerHTML =
      "Loading relevant projects ...";
  $.ajax({
    url:
      "get-projects-for-user.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: reloadStep2,
    error: startupfailed
    //,datatype: "json"
  });
}

function getCEEternalData(costElement) {
  var result = [];
  for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
    var element = Gcurrentdata[Gelementsindex][0][i];
    if (costElement == element[0]) {
      result = [
        element[1],
        getCEPercent(costElement, element[10]),
        element[11]
      ];
      return result;
    }
  }
  return result;
}

function getCEPercentCorrect(costElement) {
  for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
    var element = Gcurrentdata[Gelementsindex][0][i];
    if (costElement == element[0]) {
      return getCEPercent(costElement, element[10]);
    }
  }
  return "??";
}

function getCEPercent(costElement, treenum) {
  if (treenum == 0) bigCost[treenum] = Gcurrentdata[Gprimeindex][1];
  else if (treenum == 1) bigCost[treenum] = Gcurrentdata[Gprimeindex][5];
  else if (treenum == 2) bigCost[treenum] = Gcurrentdata[Gprimeindex][6];
  else if (treenum == 3) bigCost[treenum] = Gcurrentdata[Gprimeindex][7];
  else myAlert("Attention!", "Bad tree number: " + treenumber, "error");

  for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
    var element = Gcurrentdata[Gelementsindex][0][i];
    var ce = element[0];
    var val = element[4];
    if (typeof val == "string") val = parseFloat(val);
    if (ce == costElement)
      return numberFormat((val / bigCost[treenum]) * 100, 2);
  }
}

function getCEParent(costElement) {
  var treenum = 0;
  for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
    var element = Gcurrentdata[Gelementsindex][0][i];
    if (costElement == element[0]) {
      var oldlevel = element[2];
      treenum = element[10];
      for (var j = i - 1; j >= 0; j--) {
        var listelement = Gcurrentdata[Gelementsindex][0][j];
        if (treenum != listelement[10]) {
          return null;
        }
        var newlevel = listelement[2];
        if (newlevel < oldlevel) return listelement[1];
      }
      return null;
    }
  }
}

function genericSave() {
  if (Gcurrentpage.valueOf() == "companies".valueOf()) {
    saveCompanies();
    return;
  }

  if (Gcurrentpage.valueOf() == "projects".valueOf()) {
    saveAllProjects();
    return;
  }

  if (Gcurrentpage.valueOf() == "people".valueOf()) {
    savePeople();
    return;
  }

  if (Gcurrentpage.valueOf() == "Agree".valueOf()) {
    savePrimaryCost();
    return;
  }

  if (Gcurrentpage.valueOf() == "Identify".valueOf()) {
    saveIWorksheet();
    return;
  }

  if (Gcurrentpage.valueOf() == "Measure".valueOf()) {
    saveMWorksheet();
    return;
  }

  if (Gcurrentpage.valueOf() == "Define".valueOf()) {
    saveDWorksheet();
    return;
  }

  if (Gcurrentpage.valueOf() == "Reduce".valueOf()) {
    saveRWorksheet();
    return;
  }

  if (Gcurrentpage.valueOf() == "Implement".valueOf()) {
    saveImWorksheet();
    return;
  }
  myAlert("ERROR", "No keyboard ctrl-s defined for this page", "error");
}

var modalResult = 1; // OK is the default

function OK() {
  modalResult = 1;
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function Cancelled() {
  var modal = document.getElementById("myModal");
  modalResult = 0;
  modal.style.display = "none";
}

function injectModals() {
  var modals = '<div id="myModal" class="modal">';
  modals = modals + '<div class="modal-content">';
  modals = modals + '<div class="modal-header">';
  modals = modals + '<span class="close">&times;</span>';
  modals =
    modals +
    '<div id="modaltitle" style="font-weight: bold; font-family: Times New Roman, Times, serif; font-size: 1.1em;"></div>';
  modals = modals + "</div>";
  modals = modals + '<div class="modal-body">';
  modals =
    modals +
    '<div id="modal-content" style="font-family: Times New Roman, Times, serif; font-size: 1.1em;">';
  modals = modals + "</div>";
  modals = modals + '<div id="modalbuttons" style="align: center;">';
  modals = modals + "</div>";
  modals = modals + "</div>";
  modals =
    modals +
    '<div class="modal-footer" style="font-weight: bold; font-family: Times New Roman, Times, serif; font-size: 1.1em;">';
  modals = modals + '<div id="footer-content"></div>';
  modals = modals + "</div>";
  modals = modals + "</div>";
  modals = modals + "</div>";
  return modals;
}

function performerForTaskP(taskid, personid) {
  for (var j = 0; j < Gcurrentdata[Gtasksindex].length; j++) {
    if (Gcurrentdata[Gtasksindex][j][0] == taskid) {
      // alert("Performers: " + Gcurrentdata[Gtasksindex][j][5]);
      for (var k = 0; k < Gcurrentdata[Gtasksindex][j][5].length; k++) {
        if (Gcurrentdata[Gtasksindex][j][5][k] == personid) return true;
      }
      return false;
    }
  }
  return false;
}

function performerForWPP(sessionid, personid) {
  for (var j = 0; j < Gcurrentdata[Gworkplanindex].length; j++) {
    if (Gcurrentdata[Gworkplanindex][j][0] == sessionid) {
      // alert("Performers: " + Gcurrentdata[Gworkplanindex][j][7]);
      for (var k = 0; k < Gcurrentdata[Gworkplanindex][j][7].length; k++) {
        if (Gcurrentdata[Gworkplanindex][j][7][k] == personid) return true;
      }
      return false;
    }
  }
  return false;
}

function populateTeamSelector(pid, taskid, divname) {
  var performers =
    '<select multiple="multiple" id="multiselect_owner" class="textbox  mo-editor choice" style=" display:none;" >';
  var possiblePerformers = getTeamParticipants(pid); // getPotentialTeamMembers(getProjectEntry(pid));
  // alert (" project participants " + possiblePerformers + " of size " + possiblePerformers.length);
  var selectedValues = [];
  for (var i = 0; i < possiblePerformers.length; i++) {
    var selected = "";
    if (performerForTaskP(taskid, possiblePerformers[i][0])) {
      selectedValues.push("" + possiblePerformers[i][0]);
    }
    performers =
      performers +
      '<option value="' +
      possiblePerformers[i][0] +
      '" ' +
      selected +
      ">" +
      getPersonName(possiblePerformers[i][0]) +
      "(" +
      possiblePerformers[i][1] +
      ")" +
      "</option>";
  }
  performers = performers + "</select>";

  document.getElementById(divname).innerHTML = performers;

  var $select = $("#multiselect_owner");
  $select.find("option").prop("selected", false);
  $select.find('option[value=""]').prop("selected", true);

  $("#multiselect_owner").multiselect({
    filterPlaceholder: "Search",
    nonSelectedText: "Participants",
    nSelectedText: "selected",
    allSelectedText: "All selectd",
    // buttonClass: 'btn btn-sm btn-raised btn-default',
    buttonClass: "multiselect_input textbox",
    disableIfEmpty: true,
    maxHeight: 180,
    numberDisplayed: 3,
    enableCaseInsensitiveFiltering: true,
    enableClickableOptGroups: true,
    enableHTML: true,
    includeSelectAllOption: false,
    selectAllText: "(all)",
    delimiterText: ", ",
    buttonText: function(options, select) {
      var all = $select.find('option[value=""]');
      if (options.length === 0) {
        return this.nonSelectedText;
      } else if (all.is(":selected")) {
        return (
          this.allSelectedText + " (" + $("option", $(select)).length + ")"
        );
      } else if (
        this.allSelectedText &&
        options.length === $("option", $(select)).length &&
        $("option", $(select)).length !== 1 &&
        this.multiple
      ) {
        if (this.selectAllNumber) {
          return this.allSelectedText + " (" + options.length + ")";
        } else {
          return this.allSelectedText;
        }
      } else if (options.length > this.numberDisplayed) {
        var selectedarry = [];
        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selectedarry.push(label);
        });
        var selected = "";
        for (var i = 0; i < this.numberDisplayed; i++) {
          selected += "<label>" + selectedarry[i] + "</label>";
        }

        var optselected =
          '<label class ="show_count">' +
          " +" +
          (options.length - this.numberDisplayed) +
          " " +
          this.nSelectedText +
          "</label>";

        return selected + "" + optselected;
      } else {
        var selected = "";
        var delimiter = this.delimiterText;

        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selected += "<label>" + label + "</label>";
          //selected += label + delimiter;
        });

        return selected.substr(0, selected.length - 2);
      }
    },
    onChange: function(option, checked) {
      var all = $select.find('option[value=""]');
      var currentOption = $(option);
      if (all.is(":selected")) {
        if (currentOption.val() === all.val()) {
          $select
            .find("option")
            .not(all)
            .each(function() {
              $(this).prop("selected", false);
              var input = $('input[value="' + $(this).val() + '"]');
              input.prop("checked", false);
              input.closest("li").removeClass("active");
            });
        } else {
          $select.find(all).each(function() {
            $(this).prop("selected", false);
            var input = $('input[value="' + $(this).val() + '"]');
            input.prop("checked", false);
            input.closest("li").removeClass("active");
          });
          all.prop("selected", false);
          currentOption.prop("selected", true);
        }
        $select.multiselect("updateButtonText", true);
      } else {
        $select.find(all).each(function() {
          $(this).prop("selected", false);
          var input = $('input[value="' + $(this).val() + '"]');
          input.prop("checked", false);
          input.closest("li").removeClass("active");
        });
        //all.prop('selected', false);
      }
    }
  });

  $select.multiselect("select", selectedValues);

  // alert("performers selection: " + performers);
}

function populateWPTeamSelector(pid, sessionid, divname) {
  var performers =
    '<select multiple="multiple" id="multiselect_participants" class="textbox  mo-editor choice" style=" display:none;" >';
  var possiblePerformers = getTeamParticipants(pid);
  var selectedValues = [];
  for (var i = 0; i < possiblePerformers.length; i++) {
    var selected = "";
    if (performerForWPP(sessionid, possiblePerformers[i][0]))
      selectedValues.push("" + possiblePerformers[i][0]); // selected = " selected ";
    performers =
      performers +
      '<option value="' +
      possiblePerformers[i][0] +
      '" ' +
      selected +
      ">" +
      getPersonName(possiblePerformers[i][0]) +
      " ( " +
      possiblePerformers[i][1] +
      " )" +
      "</option>";
  }
  performers = performers + "</select>";

  document.getElementById(divname).innerHTML = performers;

  var $select = $("#multiselect_participants");
  $select.find("option").prop("selected", false);
  $select.find('option[value=""]').prop("selected", true);

  $("#multiselect_participants").multiselect({
    filterPlaceholder: "Search",
    nonSelectedText: "Participants",
    nSelectedText: "selected",
    allSelectedText: "All selectd",
    // buttonClass: 'btn btn-sm btn-raised btn-default',
    buttonClass: "multiselect_input textbox",
    disableIfEmpty: true,
    maxHeight: 180,
    numberDisplayed: 3,
    enableCaseInsensitiveFiltering: true,
    enableClickableOptGroups: true,
    enableHTML: true,
    includeSelectAllOption: false,
    selectAllText: "(all)",
    delimiterText: ", ",
    buttonText: function(options, select) {
      var all = $select.find('option[value=""]');
      if (options.length === 0) {
        return this.nonSelectedText;
      } else if (all.is(":selected")) {
        return (
          this.allSelectedText + " (" + $("option", $(select)).length + ")"
        );
      } else if (
        this.allSelectedText &&
        options.length === $("option", $(select)).length &&
        $("option", $(select)).length !== 1 &&
        this.multiple
      ) {
        if (this.selectAllNumber) {
          return this.allSelectedText + " (" + options.length + ")";
        } else {
          return this.allSelectedText;
        }
      } else if (options.length > this.numberDisplayed) {
        var selectedarry = [];
        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selectedarry.push(label);
        });
        var selected = "";
        for (var i = 0; i < this.numberDisplayed; i++) {
          selected += "<label>" + selectedarry[i] + "</label>";
        }

        var optselected =
          '<label class ="show_count">' +
          " +" +
          (options.length - this.numberDisplayed) +
          " " +
          this.nSelectedText +
          "</label>";

        return selected + "" + optselected;
      } else {
        var selected = "";
        var delimiter = this.delimiterText;

        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selected += "<label>" + label + "</label>";
          //selected += label + delimiter;
        });

        return selected.substr(0, selected.length - 2);
      }
    },
    onChange: function(option, checked) {
      var all = $select.find('option[value=""]');
      var currentOption = $(option);
      if (all.is(":selected")) {
        if (currentOption.val() === all.val()) {
          $select
            .find("option")
            .not(all)
            .each(function() {
              $(this).prop("selected", false);
              var input = $('input[value="' + $(this).val() + '"]');
              input.prop("checked", false);
              input.closest("li").removeClass("active");
            });
        } else {
          $select.find(all).each(function() {
            $(this).prop("selected", false);
            var input = $('input[value="' + $(this).val() + '"]');
            input.prop("checked", false);
            input.closest("li").removeClass("active");
          });
          all.prop("selected", false);
          currentOption.prop("selected", true);
        }
        $select.multiselect("updateButtonText", true);
      } else {
        $select.find(all).each(function() {
          $(this).prop("selected", false);
          var input = $('input[value="' + $(this).val() + '"]');
          input.prop("checked", false);
          input.closest("li").removeClass("active");
        });
        //all.prop('selected', false);
      }
    }
  });
  $select.multiselect("select", selectedValues);
  // alert("performers selection: " + performers);
}

var updateTaskPanel = "main";

function editTask(i) {
  updateTaskPanel = "main";
  editingTask = Gcurrentdata[Gtasksindex][i][0];
  $("#tasks_modal").modal("show");
  $(".tasktitle").text("Edit Project Task");
  // need to fix the indices...
  deactivateButton("tasks_submit");
  document.getElementById("tasktext").value = Gcurrentdata[Gtasksindex][i][1];
  document.getElementById("taskprocess").value =
    Gcurrentdata[Gtasksindex][i][2];
  setDateById("input_taskdate", Gcurrentdata[Gtasksindex][i][3]);
  populateTeamSelector(
    Gcurrentstrategy,
    Gcurrentdata[Gtasksindex][i][0],
    "taskPerformers"
  );
  $(".tasktitle").text("Edit Project Task");
  $(".opt_btn_wrp").hide();
}

function editTaskFromPanel(i) {
  updateTaskPanel = "side";
  editingTask = Gcurrentdata[Gtasksindex][i][0];
  $("#tasks_modal").modal("show");
  // need to fix the indices...
  document.getElementById("tasktext").value = Gcurrentdata[Gtasksindex][i][1];
  document.getElementById("taskprocess").value =
    Gcurrentdata[Gtasksindex][i][2];
  setDateById("input_taskdate", Gcurrentdata[Gtasksindex][i][3]);
  populateTeamSelector(
    Gcurrentstrategy,
    Gcurrentdata[Gtasksindex][i][0],
    "taskPerformers"
  );
  $(".tasktitle").text("Edit Project Task");
  $(".opt_btn_wrp").hide();
}

function refreshTaskItems() {
  var selector = document.getElementById("sortTaskFilter").value;
  if (selector.valueOf() == "".valueOf()) selector = "all";

  body = '<table class="tasks_table">';
  // now loop over tasks  [ id , description, step, due, status, participants]
  for (var i = 0; i < Gcurrentdata[Gtasksindex].length; i++) {
    var cbid = "taskselect-" + i;
    var today = new Date();
    var deadline = new Date(Gcurrentdata[Gtasksindex][i][3]);
    var expired = "";
    var past = false;
    if (today > deadline) {
      expired = '<span class="action_status">Overdue</span>';
      past = true;
    }
    var upcoming = false;
    if (deadline > today) {
      upcoming = true;
    }
    if (
      selector.valueOf() == "all".valueOf() ||
      (selector.valueOf() == "upcoming".valueOf() && upcoming) ||
      (selector.valueOf() == "overdue".valueOf() && past)
    ) {
      body =
        body +
        '<tr id="task-' +
        i +
        '" >' +
        '<td width="30%" >' +
        expired +
        "&nbsp;&nbsp;" +
        Gcurrentdata[Gtasksindex][i][1] +
        "</td>" +
        '<td width="15%">' +
        getPrintDate(Gcurrentdata[Gtasksindex][i][3]) +
        "</td>" +
        '<td width="20%">';
      // alert( "task performers: " + Gcurrentdata[Gtasksindex][i][5])
      for (var j = 0; j < Gcurrentdata[Gtasksindex][i][5].length; j++) {
        var names = getFirstLastFromId(Gcurrentdata[Gtasksindex][i][5][j]);
        // '<span class="owner_count">' + names[2] + '</span>';
        body =
          body +
          generateProfileIconFromId(
            Gcurrentdata[Gtasksindex][i][5][j],
            "owner_count"
          );
        if (j == 2 && Gcurrentdata[Gtasksindex][i][5].length - 3 > 0) {
          body =
            body +
            " and " +
            (Gcurrentdata[Gtasksindex][i][5].length - 3) +
            " more...";
          break;
        }
      }
      body =
        body +
        "</td>" +
        '<td width="15%">' +
        '<span class="process_type">' +
        Gcurrentdata[Gtasksindex][i][2] +
        "</span>" +
        "</td>" +
        '<td width="5%">' +
        '<div class="task_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="taskOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editTask(' +
        i +
        ')"> Edit task </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost " onclick="confirmDeleteTask(' +
        i +
        ')"> Delete task </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  }
  body = body + "</table>";
  document.getElementById("taskPlanItems").innerHTML = body;
}

function refreshTasks() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Tasks</h2>' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<div class="rt_ctrls pull-right">' +
    "<span>" +
    '<select id="sortTaskFilter" onChange="refreshTaskItems()" class="select_filter filter_list">' +
    '<option value="all">Show all</option>' +
    '<option value="overdue">Show overdue tasks</option>' +
    '<option value="upcoming">Show upcoming tasks</option>' +
    "</select>" +
    "</span>" +
    "<span>" +
    '<a href="javascript:void(0);"  class="btn prmary_btn" id="openTaskModal" onClick="clearTasksModal()">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Tasks' +
    "</a>" +
    "</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-lg-6 col-md-6 col-sm-12">  ';

  if (
    Gcurrentdata[Gtasksindex] == null ||
    Gcurrentdata[Gtasksindex].length == 0
  ) {
    body =
      body +
      '<div class="info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/> No tasks planned for this project yet.' +
      "</div>";
  }
  body =
    body +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:20px;">' +
    '<div class="tasks_table_wrp cus_scroll">' +
    '<div id="taskPlanItems">' +
    '<table class="tasks_table">';
  // now loop over tasks  [ id , description, step, due, status, participants]
  for (var i = 0; i < Gcurrentdata[Gtasksindex].length; i++) {
    var tid = Gcurrentdata[Gtasksindex][i][0];
    var cbid = "taskselect-" + tid;
    var today = new Date();
    var deadline = new Date(Gcurrentdata[Gtasksindex][i][3]);
    var status = Gcurrentdata[Gtasksindex][i][4];
    var checked = "";
    var ttip = "Task is not yet complete!";
    if (status.valueOf() == "Completed".valueOf()) {
      checked = " checked";
      ttip = "Task is completed.";
    }
    var expired = "";
    if (today > deadline)
      expired = '<span class="action_status">OVERDUE</span>';
    body =
      body +
      '<tr id="task-' +
      i +
      '" >' +
      '<td width="30%" >' +
      expired +
      "&nbsp;&nbsp;" +
      Gcurrentdata[Gtasksindex][i][1] +
      "</td>" +
      '<td width="15%">' +
      getPrintDate(Gcurrentdata[Gtasksindex][i][3]) +
      "</td>" +
      '<td width="20%">';
    // alert( "task performers: " + Gcurrentdata[Gtasksindex][i][5])
    for (var j = 0; j < Gcurrentdata[Gtasksindex][i][5].length; j++) {
      var names = getFirstLastFromId(Gcurrentdata[Gtasksindex][i][5][j]);
      // '<span class="owner_count">' + names[2] + '</span>';
      body =
        body +
        generateProfileIconFromId(
          Gcurrentdata[Gtasksindex][i][5][j],
          "owner_count"
        );
      if (j == 2 && Gcurrentdata[Gtasksindex][i][5].length - 3 > 0) {
        body =
          body +
          " and " +
          (Gcurrentdata[Gtasksindex][i][5].length - 3) +
          " more...";
        break;
      }
    }
    body =
      body +
      "</td>" +
      '<td width="15%">' +
      '<span class="process_type">' +
      Gcurrentdata[Gtasksindex][i][2] +
      "</span>" +
      "</td>" +
      '<td width="5%">' +
      '<div class="task_opt">' +
      '<button class="text-capitalize more_option opt_btn" onclick="taskOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editTask(' +
      i +
      ')"> Edit task </a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost " onclick="confirmDeleteTask(' +
      i +
      ')"> Delete task </a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
  }
  body =
    body +
    "</table>" +
    "</div>" +
    "</div>" +
    "</div>        " +
    "</div>" +
    "</div>";
  document.getElementById("mainbody").innerHTML = body;
}

function refreshWorkPlanItems() {
  var selector = "";
  selector = document.getElementById("sortWPFilter").value;
  if (selector.valueOf() == "".valueOf()) selector = "all";
  // alert("selector: " + selector);
  body = '<table class="session_table">';

  // now loop through the sessions - one row per session
  // id, agenda, step, start, end, location, meetingtype, participants array -- interface does not have end time
  // I will use start as the date
  // end will be the time...
  for (var i = 0; i < Gcurrentdata[Gworkplanindex].length; i++) {
    var meeting = Gcurrentdata[Gworkplanindex][i];
    // alert(meeting);
    var startElements = mysqlTimeStampToDate5(meeting[3]);
    var endElements = mysqlTimeStampToDate5(meeting[4]);
    var meetingdate = startElements[0];
    var fromtime = startElements[1] + ":" + startElements[2];
    var totime = endElements[1] + ":" + endElements[2];
    var today = new Date();
    var md = new Date(meetingdate);
    var today = new Date();
    var past = false;
    // alert("today: " + today + " md: " + md);
    if (today > md) past = true;
    var upcoming = false;
    if (md > today) upcoming = true;

    if (
      selector.valueOf() == "all".valueOf() ||
      (selector.valueOf() == "upcoming".valueOf() && upcoming) ||
      (selector.valueOf() == "past".valueOf() && past)
    ) {
      body = body + "<tr >" + '<td width="5%">';
      if (meeting[6].includes("Remote"))
        body =
          body + '<img src="images/session_icon_1.png" alt="Remote session"> ';
      else
        body =
          body +
          '<img src="images/session_icon_2.png" alt="Face-to-Face session"> ';
      body =
        body +
        "</td>" +
        '<td width="25%" >' +
        meetingdate +
        " " +
        fromtime +
        " to " +
        totime +
        "<br> (" +
        meeting[5] +
        ")" + // ', ' + meeting[4] +
        "</td>" +
        '<td width="15%">' +
        '<span class="process_type">' +
        meeting[2] +
        "</span>" +
        "</td>" +
        '<td width="25%">' +
        meeting[1] +
        "</td>" +
        '<td width="25%">';

      for (var j = 0; j < meeting[7].length; j++) {
        var names = getFirstLastFromId(meeting[7][j]);
        // '<span class="participants_count">' + names[2] + '</span>';
        body =
          body + generateProfileIconFromId(meeting[7][j], "participants_count");
        if (j == 2 && meeting[7].length > 3) {
          body = body + "+ " + (meeting[7].length - 3) + " more";
          break;
        }
      }

      body = body + "</td>";
      body =
        body +
        '<td width="5%">' +
        '<div class="workplan_opt">' +
        '<button class="text-capitalize more_option opt_btn" onclick="workplanOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editworkplan(' +
        i +
        ')"> Edit session </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteWorkPlan(' +
        i +
        ')"> Delete session </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  }
  body = body + "</table>";
  document.getElementById("workPlanItems").innerHTML = body;
}

function refreshWorkplan() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Work Plan</h2>' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<div class="rt_ctrls pull-right">' +
    "<span>" +
    '<select id="sortWPFilter" onChange="refreshWorkPlanItems()" class="select_filter filter_list">' +
    '<option value="all">Show all sessions</option>' +
    '<option value="past">Show past sessions</option>' +
    '<option value="upcoming">Show upcoming sessions</option>' +
    "</select>" +
    "</span>" +
    "<span>" +
    '<a href="javascript:void(0);"  class="btn prmary_btn" id="openWorkModal" data-toggle="modal" data-target="#session_modal" onClick="clearWPModal()">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Session' +
    "</a>" +
    "</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-lg-6 col-md-6 col-sm-12">';

  if (
    Gcurrentdata[Gworkplanindex] == null ||
    Gcurrentdata[Gworkplanindex].length == 0
  ) {
    body =
      body +
      '<div class="info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/> Populate your work plan with sessions for the project.' +
      "</div>";
  }
  body =
    body +
    "</div>" +
    "</div>" +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12 col-sm-12" style="margin-top:20px;">' +
    '<div class="session_table_wrp cus_scroll" >' +
    '<div id="workPlanItems">' +
    '<table class="session_table">';

  // now loop through the sessions - one row per session
  // id, agenda, step, start, end, location, meetingtype, participants array -- interface does not have end time
  // I will use start as the date
  // end will be the time...
  for (var i = 0; i < Gcurrentdata[Gworkplanindex].length; i++) {
    var meeting = Gcurrentdata[Gworkplanindex][i];
    // alert(meeting);
    var startElements = mysqlTimeStampToDate5(meeting[3]);
    var endElements = mysqlTimeStampToDate5(meeting[4]);
    var meetingdate = startElements[0];
    var fromtime = startElements[1] + ":" + startElements[2];
    var totime = endElements[1] + ":" + endElements[2];
    body = body + "<tr >" + '<td width="5%">';
    if (meeting[6].includes("Remote"))
      body =
        body + '<img src="images/session_icon_1.png" alt="Remote session"> ';
    else
      body =
        body +
        '<img src="images/session_icon_2.png" alt="Face-to-Face session"> ';
    body =
      body +
      "</td>" +
      '<td width="25%" >' +
      meetingdate +
      " " +
      fromtime +
      " to " +
      totime +
      "<br> (" +
      meeting[5] +
      ")" + // ', ' + meeting[4] +
      "</td>" +
      '<td width="15%">' +
      '<span class="process_type">' +
      meeting[2] +
      "</span>" +
      "</td>" +
      '<td width="25%">' +
      meeting[1] +
      "</td>" +
      '<td width="25%">';

    for (var j = 0; j < meeting[7].length; j++) {
      var names = getFirstLastFromId(meeting[7][j]);
      // '<span class="participants_count">' + names[2] + '</span>';
      body =
        body + generateProfileIconFromId(meeting[7][j], "participants_count");
      if (j == 2 && meeting[7].length > 3) {
        body = body + "+ " + (meeting[7].length - 3) + " more";
        break;
      }
    }

    body = body + "</td>";
    body =
      body +
      '<td width="5%">' +
      '<div class="workplan_opt">' +
      '<button class="text-capitalize more_option opt_btn" onclick="workplanOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">                                         ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editworkplan(' +
      i +
      ')"> Edit session </a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteWorkPlan(' +
      i +
      ')"> Delete session </a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
  }
  body =
    body + "</table>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
  // alert(body);
  document.getElementById("mainbody").innerHTML = body;
}

function clearDateModal() {
  editingMilestone = -1;
  // $('#dates_modal').modal('show');
  document.getElementById("input_milestone").value = "";
  setDateById("date_milestone", "");
  deactivateButton("date_submit");
  $(".dates_modaltitle").text("Add Milestone");
  $(".opt_btn_wrp").hide();
}

// flipping yyyy to the last position works!  JS is a piece of &*$&^%^!!
function getPrintDate(dbdate) {
  if (dbdate === null) {
    return "TBD";
  }
  if (dbdate.valueOf() == "".valueOf()) return " - ";
  var elimSpace = dbdate.split(" ");
  var elements = elimSpace[0].split("-");
  // alert(elements);
  var newd = elements[1] + "/" + elements[2] + "/" + elements[0];
  var d = new Date(newd);
  return d.toDateString().substring(4);
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function refreshBackground() {
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    "<!-- left sec -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 strategy_container cus_scroll_left" id="left-panel">' +
    "<!-- Scope section -->" +
    '<section class="scope_section">' +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin">Scope</h2>' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    "";

  if (
    Gcurrentdata[Gscopeindex] == null ||
    Gcurrentdata[Gscopeindex].valueOf() == "".valueOf()
  ) {
    body =
      body +
      '<div class="pull-right">                    ' +
      '<a href="javascript:void(0);"  class="btn prmary_btn"  id="open_scope_modal" data-toggle="modal" data-target="#scope_modal" onClick="clearEditScope()">' +
      '<i class="fa fa-plus" aria-hidden="true"></i> Scope ' +
      "</a>" +
      "</div>";
    body =
      body +
      "</div>" +
      '<div class="info_block scope_info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/> Add scope definition which guides the activities of this project.' +
      "</div>";
  } else {
    body =
      body +
      '<div class="scope_txt_data">' +
      '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))">' +
      '<img src="images/ver_more_black.png" alt="more"> ' +
      "</button>" +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">                                         ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editScope()"> Edit scope </a> </li>' +
      // '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteScope()"> Delete scope </a> </li>' +
      "</ul> " +
      "</div>" +
      '<p onclick="editScope()">' +
      '<div class="replayText"  id="projscope">' +
      Gcurrentdata[Gscopeindex] +
      "</div>" +
      "</p>" +
      "</div>";
  }
  body =
    body +
    "</section>" +
    "<!-- Date section -->" +
    '<section class="date_section">' +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin">Milestones</h2>' +
    '<div class="pull-right">                    ' +
    '<a href="javascript:void(0);"  class="btn prmary_btn"  id="open_dates_modal" data-toggle="modal" data-target="#dates_modal" onClick="clearDateModal()">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Milestones ' +
    "</a>" +
    "</div>" +
    "</div>" +
    "";
  if (
    Gcurrentdata[Gmilesindex] == null ||
    Gcurrentdata[Gmilesindex].length == 0
  ) {
    body =
      body +
      '<div class="info_block date_info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/>Add dates that identify the key milestones of the contract.' +
      "</div>" +
      "";
  }
  body = body + '<div class="date_text_container">';

  // now we loop through the available milestones...
  var i = 0;
  //
  if (Gcurrentdata.length)
    while (i < Gcurrentdata[Gmilesindex].length) {
      body =
        body +
        '<div class="date_text_wrp pull-left">' +
        '<span class="milestone_value">' +
        Gcurrentdata[Gmilesindex][i][1] +
        "</span>" +
        '<span class="date_value">' +
        getPrintDate(Gcurrentdata[Gmilesindex][i][2]) +
        "</span>" +
        '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))">' +
        '<img src="images/ver_more_black.png" alt="more"> ' +
        "</button>" +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editDate(' +
        i +
        ')"> Edit Milestone</a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteMilestone(' +
        i +
        ')"> Delete Milestone</a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>";
      i = i + 1;
      if (i < Gcurrentdata[Gmilesindex].length) {
        body =
          body +
          '<div class="date_text_wrp pull-right">' +
          '<span class="milestone_value">' +
          Gcurrentdata[Gmilesindex][i][1] +
          "</span>" +
          '<span class="date_value">' +
          getPrintDate(Gcurrentdata[Gmilesindex][i][2]) +
          "</span>" +
          '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))">' +
          '<img src="images/ver_more_black.png" alt="more"> ' +
          "</button>" +
          '<div class="opt_btn_wrp"> ' +
          '<ul class="other_action">                                         ' +
          '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editDate(' +
          i +
          ')"> Edit Milestone</a> </li>' +
          '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="confirmDeleteMilestone(' +
          i +
          ')"> Delete Milestone </a> </li>' +
          "</ul> " +
          "</div>" +
          "</div>";
        i = i + 1;
      }
    }
  body =
    body +
    "</div>" +
    "</section>" +
    '<div class="clearfix"></div>' +
    "<!-- Cost Estimates section  -->" +
    "<section>" +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin"> Cost Estimates</h2>' +
    '<div class="pull-right">                    ' +
    '<a href="javascript:void(0);"  class="btn prmary_btn" id="open_estimate_modal" data-toggle="modal" data-target="#estimate_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Estimates ' +
    "</a>" +
    "</div>" +
    "</div>" +
    "";
  if (
    Gcurrentdata[Gestimatesindex] == null ||
    Gcurrentdata[Gestimatesindex].length == 0
  ) {
    body =
      body +
      '<div class="info_block estimate_info_block">' +
      '<img src="images/info_icon.png" class="icon_lt"/> Add estimated spend for the project' +
      "</div>" +
      "";
  }
  body = body + '<div class="estimate_text_container">';

  // now we loop through the available cost estimates
  var i = 0;
  while (i < Gcurrentdata[Gestimatesindex].length) {
    body =
      body +
      '<div class="estimate_text_wrp pull-left">' +
      '<span class="est_desc_value">' +
      Gcurrentdata[Gestimatesindex][i][1] +
      "</span>" +
      '<span class="est_amt_value">' +
      CurrencyFormat(
        Gcurrentdata[Gestimatesindex][i][2],
        GdefaultCurrency,
        0,
        "",
        ","
      ) +
      "</span>" +
      '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))">' +
      '<img src="images/ver_more_black.png" alt="more"> ' +
      "</button>" +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">                                         ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEstimate(' +
      i +
      ')"> Edit Estimate</a> </li>' +
      '<li> <a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEstimate(' +
      i +
      ')"> Delete Estimate</a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>";
    i = i + 1;
    if (i < Gcurrentdata[Gestimatesindex].length) {
      body =
        body +
        '<div class="estimate_text_wrp pull-left">' +
        '<span class="est_desc_value">' +
        Gcurrentdata[Gestimatesindex][i][1] +
        "</span>" +
        '<span class="est_amt_value">' +
        CurrencyFormat(
          Gcurrentdata[Gestimatesindex][i][2],
          GdefaultCurrency,
          0,
          "",
          ","
        ) +
        "</span>" +
        '<button class="text-capitalize more_option opt_btn" onclick="Rationaleoption($(this))">' +
        '<img src="images/ver_more_black.png" alt="more"> ' +
        "</button>" +
        '<div class="opt_btn_wrp"> ' +
        '<ul class="other_action">                                         ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEstimate(' +
        i +
        ')"> Edit </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEstimate(' +
        i +
        ')"> Delete </a> </li>' +
        "</ul> " +
        "</div>" +
        "</div>";
      i = i + 1;
    }
  }
  body =
    body +
    "</div>" +
    "</section>" +
    '<div class="clearfix"></div>' +
    "<!-- Past Initiatives section  -->" +
    '<section class="initiatives_section">' +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin"> Past/Current Initiatives</h2>' +
    '<div class="pull-right">                    ' +
    '<a href="javascript:void(0);"  class="btn prmary_btn" id="open_init_modal" onClick="addPastInitiative()" data-toggle="modal" data-target="#initiatives_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Initiatives ' +
    "</a>" +
    "</div>" +
    "</div>" +
    '<div class="initiatives_wrap" > ';
  for (var i = 0; i < Gcurrentdata[Gpastinitindex].length; i++) {
    var initEntry = Gcurrentdata[Gpastinitindex][i];
    var id = initEntry[0];
    var desc = initEntry[1];
    var year = initEntry[2] === "" ? "TBD" : initEntry[2];

    var val = initEntry[3];
    var delval = initEntry[4];
    var status = initEntry[5];
    var tag = "";
    if (status.valueOf() == "Ongoing".valueOf())
      tag = '<span class="initiative_status">Ongoing</span>';

    body =
      body +
      '<section class="init_list pull-left" id="init_1"> ' +
      '<div class="head">' +
      '<span class="itemcount">' +
      (i + 1) +
      ". " +
      tag +
      " </span> " +
      '<button class="text-capitalize more_option opt_btn pull-right" onclick="Rationaleoption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp optdropdown initiativesdropdown">' +
      '<ul class="other_action">                                        ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editPastInitiative(' +
      i +
      ')"> Edit Initiative </a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deletePastInitiative(' +
      i +
      ')"> Delete Initiative</a> </li>' +
      "</ul>" +
      "</div>" +
      "</div>" +
      '<p class="init_stat">' +
      desc +
      "</p> " +
      '<ul class="info_option_wrp init_action">' +
      "<li> " +
      '<div class="item year_value">' +
      '<h6 class="title">Year </h6>' +
      year +
      "</div>" +
      "</li>" +
      "<li>" +
      '<div class="item saving_value">' +
      '<h6 class="title">Savings </h6>' +
      CurrencyFormat(val, GdefaultCurrency, 0, "", ",") +
      "</div>" +
      "</li>" +
      "</ul>  " +
      "</section> ";
  }
  body =
    body +
    "</div>" +
    "</section>" +
    "</div> " +
    "<!-- right sec -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 bg_right_wrp">' +
    '<div class="bg_rightscroll cus_scroll">' +
    "<!-- Bp participants -->" +
    '<section class="bp_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Team Participants</h2>' +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openbp_modal" data-toggle="modal"  onClick="editProjectParticipants()" data-target="#participant_modal">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Participants' +
    "</a>" +
    "</div>" +
    '<div class="bp_table_wrp">' +
    '<table class="table bp_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="35%"> Company</th>' +
    '<th width="35%"> Participant</th>' +
    '<th width="25%"> Designation  </th>' +
    '<th width="5%"></th>' +
    "</thead>" +
    "</table>" +
    '<div class="bp_participants_scroll cus_scroll" id="bp_part_list">' +
    '<table class="table bp_table ">' +
    "<tbody>";
  var currentTeamsters = getTeamParticipants(Gcurrentstrategy);

  for (var i = 0; i < currentTeamsters.length; i++) {
    var performer = currentTeamsters[i][0];
    var teamrole = currentTeamsters[i][1];
    var incTeam = "";
    if (teamrole.toUpperCase().valueOf() == "FACILITATOR".valueOf())
      incTeam = " (F)";
    else if (teamrole.toUpperCase().valueOf() == "LEADER".valueOf())
      incTeam = " (L)";

    var pentry = getPersonEntryFromId(performer);
    var desig = "";
    if (pentry != null) desig = pentry[6];
    if (desig == null || desig.valueOf() == "".valueOf()) desig = "Unassigned";
    var cname = getEmployerCompany(performer)[1];
    var names = getFirstLastFromId(performer);
    body =
      body +
      '<tr class="bp_data">' +
      '<td width="35%">' +
      cname +
      "</td>" +
      '<td width="35%">' +
      generateProfileIconFromId(performer, "empname") +
      "&nbsp;" +
      names[0] +
      "&nbsp;" +
      names[1] +
      "&nbsp;" +
      "</td>" +
      '<td width="25%">' +
      desig +
      incTeam +
      "</td>" +
      '<td width="5%">' +
      '<div class="company_opt">' +
      '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
      '<div class="opt_btn_wrp"> ' +
      '<ul class="other_action">                                         ' +
      // '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editParticipant($(this))"> Edit </a> </li>' +
      '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteParticipant(' +
      performer +
      ');"> Delete </a> </li>' +
      "</ul> " +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>";
  }
  body =
    body +
    "</tbody>" +
    "</table>" +
    "</div>" +
    "</div>" +
    "</section>" +
    "<!-- Files -->" +
    '<div id="sideFilePanel"><section class="files_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Files</h2>' +
    '<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="openfiles_modal" onClick="addNewFile()">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Files' +
    "</a>" +
    "</div>" +
    '<div class="files_table_wrp">' +
    '<table class="table files_thead">' +
    "<thead>" +
    "<tr>" +
    '<th width="15%"> Action </th>' +
    '<th width="45%"> File name  </th>' +
    '<th width="30%"> Step used</th>' +
    '<th width="10%"></th>' +
    "</tr>" +
    "</thead>" +
    "</table>" +
    '<div class="filelist_scroll cus_scroll" id="files_list">' +
    '<table class="table files_table">' +
    "<tbody>";
  if (Gcurrentdata[Gdocsindex] != null) {
    for (var i = 0; i < Gcurrentdata[Gdocsindex].length; i++) {
      var step = Gcurrentdata[Gdocsindex][i][0];
      var docs = Gcurrentdata[Gdocsindex][i][1];
      if (docs != null) {
        for (var j = 0; j < docs.length; j++) {
          var docid = docs[j][0];
          var doctype = "Bookmark";
          if ((docs[j][7] + "").valueOf() != "".valueOf()) doctype = "Document";
          var title = docs[j][4];
          var filename = docs[j][7];
          var filetype = docs[j][8];
          var desc = docs[j][5];
          var url = "";
          var handle = title;
          if (handle.valueOf() == "".valueOf()) handle = filename;
          if (doctype.valueOf() == "Bookmark".valueOf()) {
            url =
              '<A target="_blank"  HREF="' + docs[j][6] + '">View Bookmark</A>';
          } else {
            url =
              '<A title="' +
              title +
              '" target="_blank" href="view-doc.php?' +
              "document=" +
              docid +
              "&company=" +
              getCompanyForProject(Gcurrentstrategy) +
              "&bu=" +
              getBUForProject(Gcurrentstrategy) +
              "&project=" +
              Gcurrentstrategy +
              "&username=" +
              Gusername +
              "&token=" +
              Gtoken +
              '"> View </A>';
          }
          // alert(step + " docname: " + title + " ; desc " + desc);
          body =
            body +
            '<tr class="files_data">' +
            '<td width="15%"> <span class="file_type">' +
            url +
            "</span></td>" +
            '<td width="45%"><span title="' +
            handle +
            '">' +
            title +
            "</td>" +
            '<td width="30%"> <span class="step_used">' +
            step +
            "</span> </td>" +
            '<td width="10%">' +
            '<div class="company_opt">' +
            '<button class="text-capitalize more_option opt_btn" onclick="goalDataOption($(this))"><img src="images/ver_more_black.png" alt="more"> </button>' +
            '<div class="opt_btn_wrp"> ' +
            '<ul class="other_action">                                         ' +
            // '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="alert(edit document tbd)"> Edit </a> </li>' +
            '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDDocument(' +
            docid +
            ');"> Delete Document </a> </li>' +
            "</ul> " +
            "</div>" +
            "</div>" +
            "</td>" +
            "</tr>";
        }
      }
    }
  }
  //alert("background 1");
  body =
    body +
    "</tbody>" +
    "</table>" +
    "</div>" +
    "</div>" +
    "</section></div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  document.getElementById("mainbody").innerHTML = body;
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });

  OverlayScrollbars(document.getElementById("left-panel"), {
    className: "os-theme-dark deviant-scrollbars"
  });
}

function saveScope() {
  var ck_text = $("#cke_editor2 iframe")
    .contents()
    .find("body")
    .text();

  if (!ck_text) {
    return alert("Scope cant be blank.");
  }
  $("#scope_modal").modal("hide");
  showTimedMessage("gmsg", "Saving project scope...", 0, false);
  $.ajax({
    url:
      "save-project.php?" +
      "&obj=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&scope=" +
      encodeURIComponent(CKEDITOR.instances.editor2.getData()) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateBackground,
    error: backOpFailed
    //,datatype: "json"
  });
}

function clearEditScope() {
  $("#cke_editor2 iframe")
    .contents()
    .find("body")
    .text("");
  $(".scope_modaltitle").html("Add Scope");
}

function teamDataBackground(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMesssage("gmsg", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  refreshBackground();
  showTimedMessage("gmsg", "Display updated", 3000, false);
}

function backOpFailed(resp) {
  showTimedMessage("gmsg", "Project update failed", 0, true);
}

var editingPerson = -1;
var editingProject = -1;
var editingMilestone = -1;
var deleteSuppliers = [];

function saveMilestone() {
  var date = getDateById("date_milestone");
  var milest = document.getElementById("input_milestone").value;
  if (milest === "" || milest.size == 0) {
    $(".input_milestone_error")
      .text("Milestone is required")
      .show();
    return false;
  }
  if (date === "" || date.size == 0) {
    $(".date_milestone_error")
      .text("Date is required")
      .show();
    return false;
  }
  $("#dates_modal").modal("hide");
  if (editingMilestone == -1) {
    // addition
    showTimedMessage("gmsg", "Adding milestone...", 0, false);
    $.ajax({
      url:
        "add-project-milestone.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&label=" +
        encodeURIComponent(document.getElementById("input_milestone").value) +
        "&date=" +
        encodeURIComponent(date),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  } // modifying existing milestong
  else {
    $(".opt_btn_wrp").hide();
    showTimedMessage("gmsg", "Saving milestone...", 0, false);
    $.ajax({
      url:
        "save-project-milestone.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&milestone=" +
        editingMilestone +
        "&label=" +
        encodeURIComponent(document.getElementById("input_milestone").value) +
        "&date=" +
        encodeURIComponent(date),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  }
  editingMilestone = -1;
}

function confirmDeleteMilestone(i) {
  // alert("enter here for milestone deletion " + i);
  myConfirm(
    "Confirm milestone deletion!",
    "Please confirm that you want to delete this milestone",
    "OK",
    "Cancel",
    "deleteMilestone(" + i + ")"
  );
}

function deleteMilestone(i) {
  //alert("deleting milesone with id: " + i);

  //var confirmed = confirm("Are you sure you want to delete the milestone?");
  // if (!confirmed) return;
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  showTimedMessage("gmsg", "Removing milestone", 0, false);
  $.ajax({
    url:
      "delete-project-milestone.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&milestone=" +
      Gcurrentdata[Gmilesindex][i][0],
    type: "POST",
    success: updateBackground,
    error: backOpFailed
    //,datatype: "json"
  });
}

var editingEstimate = -1;

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

$(function() {
  $.fn.modal.Constructor.DEFAULTS.backdrop = "static";
});

var input = document.getElementById("input_estimateamt");
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById("estimate_submit").click();
  }
});

function saveEstimate() {
  var des = document.getElementById("input_estimatedesc").value;
  var amt = document.getElementById("input_estimateamt").value;
  if (des === "" || des.size == 0) {
    $(".input_estimatedesc_error")
      .text("Description is required")
      .show();
    return false;
  }
  if (amt === "" || amt.size == 0) {
    $(".input_estimateamt_error")
      .text("Savings is required")
      .show();
    return false;
  }
  $("#estimate_modal").modal("hide");
  if (validNumber("input_estimateamt") == 0) {
    showTimedMessage("gmsg", "Estimate amount is not a valid number!", 0, true);
    return;
  }
  deactivateButton("estimate_submit");
  var est = extractNumber(document.getElementById("input_estimateamt").value);
  if (editingEstimate == -1) {
    // addition
    showTimedMessage("gmsg", "Adding cost estimate...", 0, false);
    $.ajax({
      url:
        "add-project-cost-est.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&description=" +
        encodeURIComponent(
          document.getElementById("input_estimatedesc").value
        ) +
        "&value=" +
        encodeURIComponent(est),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  } // modifying existing milestong
  else {
    $(".opt_btn_wrp").hide();
    showTimedMessage("gmsg", "Saving cost estimate...", 0, false);
    $.ajax({
      url:
        "save-project-cost-est.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&costest=" +
        editingEstimate +
        "&description=" +
        encodeURIComponent(
          document.getElementById("input_estimatedesc").value
        ) +
        "&value=" +
        encodeURIComponent(est),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  }
  editingMilestone = -1;
  editingEstimate = -1;
  document.getElementById("input_estimatedesc").value = "";
  document.getElementById("input_estimateamt").value = "";
  $(".estimate_modaltitle").text("Add Estimate");
}

function cancelEstimate() {
  editingEstimate = -1;
  document.getElementById("input_estimatedesc").value = "";
  document.getElementById("input_estimateamt").value = "";
  $(".estimate_modaltitle").text("Add Estimate");
}

function deleteEstimate(i) {
  // alert("deleting milesone with id: " + i);
  $(".opt_btn_wrp").hide();
  var confirmed = confirm("Are you sure you want to delete the estimate?");
  if (!confirmed) return;

  $.ajax({
    url:
      "delete-project-cost-est.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&costest=" +
      Gcurrentdata[Gestimatesindex][i][0],
    type: "POST",
    success: updateBackground,
    error: backOpFailed
    //,datatype: "json"
  });
}

var editingSession = -1;

var editingTask = -1;
var taskPerformers = [];
var wpPerformers = [];

var editingAction = -1;

function addTaskPerformers(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    if (taskPerformers.length == 0) {
      updateProjectTasksInternal();
      return;
    }
    for (var i = 0; i < taskPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding task performer " + i, 0, false);
      if (i < taskPerformers.length - 1)
        addTaskPerformer(parseInt(results[1]), taskPerformers[i], 0);
      else addTaskPerformer(parseInt(results[1]), taskPerformers[i], 1);
    }
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", "Error: " + results[1], 0, true);
  }
}

function getCurrentPerformers(task) {
  for (var i = 0; i < Gcurrentdata[Gtasksindex].length; i++) {
    var taskEntry = Gcurrentdata[Gtasksindex][i];
    if (task == taskEntry[0]) {
      return taskEntry[5];
    }
  }
}

function addExistingTaskPerformers(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    var addedPerformers = [],
      deletedPerformers = [];
    var taskid = editingTask;

    var currentPerformersOfTask = getCurrentPerformers(taskid);
    //alert("Current performers in DB: " + currentPerformersOfTask);
    //alert("New performers: " + taskPerformers);
    for (var i = 0; i < taskPerformers.length; i++) {
      if (currentPerformersOfTask.indexOf(taskPerformers[i]) < 0)
        addedPerformers.push(taskPerformers[i]);
    }
    //alert("Added performers: " + addedPerformers);
    for (var i = 0; i < currentPerformersOfTask.length; i++) {
      if (taskPerformers.indexOf(currentPerformersOfTask[i]) < 0)
        deletedPerformers.push(currentPerformersOfTask[i]);
    }
    //alert("deleted performers: " + deletedPerformers);

    // check if there is no work to do...
    if (addedPerformers.length == 0 && deletedPerformers.length == 0) {
      updateProjectTasksInternal();
      return;
    }

    for (var i = 0; i < addedPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding task performer " + i, 0, false);
      // alert("saving task performer " + addedPerformers[i] + " for " + taskid);
      if (i < addedPerformers.length - 1)
        addTaskPerformer(taskid, addedPerformers[i], 0);
      else addTaskPerformer(taskid, addedPerformers[i], 1);
    }
    for (var i = 0; i < deletedPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding task performer " + i, 0, false);
      // alert("deleting task performer " + deletedPerformers[i] + " for " + taskid);
      if (i < deletedPerformers.length - 1)
        deleteTaskPerformer(taskid, deletedPerformers[i], 0);
      else deleteTaskPerformer(taskid, deletedPerformers[i], 1);
    }
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    myAlert("ERROR", results[1], "error");
  }
}

function updateProjectTasks(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    updateProjectTasksInternal();
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function deleteTaskPerformer(taskid, perf, update) {
  if (update == 1)
    $.ajax({
      url:
        "delete-project-task-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&task=" +
        taskid +
        "&person=" +
        perf,
      type: "POST",
      success: updateProjectTasks,
      error: backOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "delete-project-task-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&task=" +
        taskid +
        "&person=" +
        perf,
      type: "POST",
      success: showTimedMessage(
        "gmsg",
        "Deleted another participant...",
        0,
        true
      ),
      error: backOpFailed
      //,datatype: "json"
    });
}

function addTaskPerformer(taskid, perf, update) {
  if (update == 1)
    $.ajax({
      url:
        "add-project-task-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&task=" +
        taskid +
        "&person=" +
        perf,
      type: "POST",
      success: updateProjectTasks,
      error: backOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "add-project-task-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&task=" +
        taskid +
        "&person=" +
        perf,
      type: "POST",
      success: showTimedMessage("gmsg", "Added a new task...", 0, false),
      error: backOpFailed
      //,datatype: "json"
    });
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function saveTask() {
  $("#tasks_modal").modal("hide");
  var date = getDateById("input_taskdate");

  if (editingTask >= 0) {
    $(".opt_btn_wrp").hide();
    showTimedMessage("gmsg", "Saving task...", 0, false);
    taskPerformers = $("#multiselect_owner").val() || [];
    // alert("saving taskperformers: " + taskPerformers);
    $.ajax({
      url:
        "save-project-task.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&task=" +
        editingTask +
        "&description=" +
        encodeURIComponent(document.getElementById("tasktext").value) +
        "&step=" +
        encodeURIComponent(document.getElementById("taskprocess").value) +
        "&duedate=" +
        encodeURIComponent(date) +
        "&status=" +
        encodeURIComponent("??"),
      type: "POST",
      success: addExistingTaskPerformers,
      error: backOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage("gmsg", "Adding task...", 0, false);
    taskPerformers = $("#multiselect_owner").val() || [];
    // alert("adding new taskperformers: " + taskPerformers);
    tasktext = document.getElementById("tasktext").value;
    taskprocess = document.getElementById("taskprocess").value;
    $.ajax({
      url:
        "add-project-task.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&description=" +
        encodeURIComponent(tasktext) +
        "&step=" +
        encodeURIComponent(taskprocess) +
        "&duedate=" +
        encodeURIComponent(date) +
        "&status=" +
        encodeURIComponent("??"),
      type: "POST",
      success: addTaskPerformers,
      error: backOpFailed
      //,datatype: "json"
    });
  }
}

function confirmDeleteTask(i) {
  updateTaskPanel = "main";
  myConfirm(
    "Confirm task deletion!",
    "Please confirm that you want to delete this task",
    "OK",
    "Cancel",
    "deleteTask(" + i + ")"
  );
}

function confirmDeleteTaskFromPanel(i) {
  updateTaskPanel = "side";
  myConfirm(
    "Confirm task deletion!",
    "Please confirm that you want to delete this task",
    "OK",
    "Cancel",
    "deleteTask(" + i + ")"
  );
}

function deleteTask(i) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();

  if (Gcurrentdata[Gtasksindex][i][5].length > 0) {
    myAlert(
      "Attention!",
      "The selected task has action performers assigned. Kindly remove the action performer before deleting the task",
      "error"
    );
    return;
  }

  showTimedMessage("gmsg", "Delete task...", 0, false);

  $.ajax({
    url:
      "delete-project-task.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&task=" +
      Gcurrentdata[Gtasksindex][i][0],
    type: "POST",
    success: updateProjectTasks,
    error: backOpFailed
    //,datatype: "json"
  });
}

function clearWPModal() {
  editingSession = -1;
  document.getElementById("workplantext").value = "";
  document.getElementById("workprocess").value = "";
  document.getElementById("worksessiontype").value = "";
  document.getElementById("sessiondate").value = "";
  document.getElementById("workfrom").value = "";
  document.getElementById("workto").value = "";
  document.getElementById("worklocation").value = "";
  deactivateButton("session_submit");
  populateWPTeamSelector(Gcurrentstrategy, -1, "wpPerformers");
  $(".workplanitle").text("Add Work Session");
  $(".opt_btn_wrp").hide();
}

function clearTasksModal() {
  updateTaskPanel = "main";
  editingTask = -1;
  deactivateButton("tasks_submit");
  document.getElementById("tasktext").value = "";
  document.getElementById("taskprocess").value = "";
  $("#input_taskdate").datepicker("setDate", new Date());
  document.getElementById("input_taskdate").value = "";
  populateTeamSelector(Gcurrentstrategy, -1, "taskPerformers");
  $(".tasktitle").text("Add Project Task");
  $(".opt_btn_wrp").hide();
  $("#tasks_modal").modal("show");
}

function clearTasksModalSidePanel() {
  updateTaskPanel = "side";
  $(".tasktitle").text("Add Project Task");
  editingTask = -1;
  deactivateButton("tasks_submit");
  document.getElementById("tasktext").value = "";
  document.getElementById("input_taskdate").value = "";
  document.getElementById("taskprocess").value = "";
  populateTeamSelector(Gcurrentstrategy, -1, "taskPerformers");
  $(".workplanitle").text("Add Work Session");
  $(".opt_btn_wrp").hide();
}

function mysqlTimeStampToDate(timestamp) {
  //function parses mysql datetime string and returns javascript Date object
  //input has to be in this format: 2007-06-05 15:26:02
  var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
  var parts = timestamp.replace(regex, "$1 $2 $3 $4 $5 $6").split(" ");
  return [parts[0] + "-" + (parts[1] - 1) + "-" + parts[2], parts[3], parts[4]];
}

function mysqlTimeStampToDate5(timestamp) {
  //function parses mysql datetime string and returns javascript Date object
  //input has to be in this format: 2007-06-05 15:26:02
  var regex = /^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9]) (?:([0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
  var parts = timestamp.replace(regex, "$1 $2 $3 $4 $5 $6").split(" ");
  return [parts[0] + "-" + parts[1] + "-" + parts[2], parts[3], parts[4]];
}

function getStartTimeForSession() {
  var d = new Date($("#sessiondate").val());
  var fromtimeval = $("#workfrom").val();
  var elements = fromtimeval.split(":");
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    elements[0] +
    ":" +
    elements[1] +
    ":00"
  );
}

function getEndTimeForSession() {
  var d = new Date($("#sessiondate").val());
  var totimeval = $("#workto").val();
  var elements = totimeval.split(":");
  return (
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    elements[0] +
    ":" +
    elements[1] +
    ":00"
  );
}

// temporary -- just to make sure the data is getting there...
function saveWorkPlanX() {
  var starttime = getStartTimeForSession(),
    endtime = getEndTimeForSession();
  alert("start: " + starttime + "  ;; end: " + endtime);
}

function saveWorkPlan() {
  var starttime = getStartTimeForSession(),
    endtime = getEndTimeForSession();

  $("#session_modal").modal("hide");
  if (editingSession == -1) {
    wpPerformers = $("#multiselect_participants").val() || [];
    $.ajax({
      url:
        "add-project-meeting.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&agenda=" +
        encodeURIComponent(document.getElementById("workplantext").value) +
        "&step=" +
        encodeURIComponent(document.getElementById("workprocess").value) +
        "&start=" +
        encodeURIComponent(starttime) +
        "&end=" +
        encodeURIComponent(endtime) +
        "&location=" +
        encodeURIComponent(document.getElementById("worklocation").value) +
        "&type=" +
        encodeURIComponent(document.getElementById("worksessiontype").value),
      type: "POST",
      success: addNewWPPerformers,
      error: backOpFailed
      //,datatype: "json"
    });
  } else {
    $(".opt_btn_wrp").hide();
    wpPerformers = $("#multiselect_participants").val() || [];
    $.ajax({
      url:
        "save-project-meeting.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&meeting=" +
        editingSession +
        "&agenda=" +
        encodeURIComponent(document.getElementById("workplantext").value) +
        "&step=" +
        encodeURIComponent(document.getElementById("workprocess").value) +
        "&start=" +
        encodeURIComponent(starttime) +
        "&end=" +
        encodeURIComponent(endtime) +
        "&location=" +
        encodeURIComponent(document.getElementById("worklocation").value) +
        "&type=" +
        encodeURIComponent(document.getElementById("worksessiontype").value),
      type: "POST",
      success: addExistingWPPerformers,
      error: backOpFailed
      //,datatype: "json"
    });
  }
}

function confirmDeleteWorkPlan(i) {
  myConfirm(
    "Confirm session deletion!",
    "Please confirm that you want to delete this session",
    "OK",
    "Cancel",
    "deleteWorkPlan(" + i + ")"
  );
}

function deleteWorkPlan(i) {
  // alert("Request to delete work plan item: " + Gcurrentdata[Gworkplanindex][i][0]);
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();

  if (Gcurrentdata[Gworkplanindex][i][7].length > 0) {
    alert(
      "This session has assigned participants.  Please remove the participants and re-try deletion of this session."
    );
    return;
  }
  showTimedMessage("gmsg", "Delete session...", 0, false);
  $.ajax({
    url:
      "delete-project-meeting.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&meeting=" +
      Gcurrentdata[Gworkplanindex][i][0],
    type: "POST",
    success: updateProjectWP,
    error: backOpFailed
    //,datatype: "json"
  });
}

function addNewWPPerformers(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    if (wpPerformers.length == 0) {
      updateProjectWPInternal();
      return;
    }
    for (var i = 0; i < wpPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding meeting participant " + i, 0, false);
      if (i < wpPerformers.length - 1)
        addWPPerformer(parseInt(results[1]), wpPerformers[i], 0);
      else addWPPerformer(parseInt(results[1]), wpPerformers[i], 1);
    }
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    myAlert("ERROR", results[1], "error");
  }
}

function getCurrentWPPerformers(wp) {
  for (var i = 0; i < Gcurrentdata[Gworkplanindex].length; i++) {
    var wpEntry = Gcurrentdata[Gworkplanindex][i];
    if (wp == wpEntry[0]) {
      return wpEntry[7];
    }
  }
}

function addExistingWPPerformers(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    var addedPerformers = [],
      deletedPerformers = [];
    var meetingid = editingSession;

    var currentPerformersOfWP = getCurrentWPPerformers(meetingid);
    //alert("Current performers in DB: " + currentPerformersOfWP);
    //alert("New performers: " + wpPerformers);
    for (var i = 0; i < wpPerformers.length; i++) {
      if (currentPerformersOfWP.indexOf(wpPerformers[i]) < 0)
        addedPerformers.push(wpPerformers[i]);
    }
    //alert("Added performers: " + addedPerformers);
    for (var i = 0; i < currentPerformersOfWP.length; i++) {
      if (wpPerformers.indexOf(currentPerformersOfWP[i]) < 0)
        deletedPerformers.push(currentPerformersOfWP[i]);
    }
    //alert("deleted performers: " + deletedPerformers);

    // check if there is no work to do...
    if (addedPerformers.length == 0 && deletedPerformers.length == 0) {
      updateProjectWPInternal();
      return;
    }

    for (var i = 0; i < addedPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding meeting performer " + i, 0, false);
      // alert("saving meeting performer " + addedPerformers[i] + " for " + meetingid);
      if (i < addedPerformers.length - 1)
        addWPPerformer(meetingid, addedPerformers[i], 0);
      else addWPPerformer(meetingid, addedPerformers[i], 1);
    }
    for (var i = 0; i < deletedPerformers.length; i++) {
      showTimedMessage("gmsg", "Adding meeting participant " + i, 0, false);
      // alert("deleting meeting participant " + deletedPerformers[i] + " for " + meetingid);
      if (i < deletedPerformers.length - 1)
        deleteWPPerformer(meetingid, deletedPerformers[i], 0);
      else deleteWPPerformer(meetingid, deletedPerformers[i], 1);
    }
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    myAlert("ERROR", results[1], "error");
  }
}

function updateProjectWP(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    updateProjectWPInternal();
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function deleteWPPerformer(meetingid, perf, update) {
  $(".opt_btn_wrp").hide();
  if (update == 1)
    $.ajax({
      url:
        "delete-project-meeting-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&meeting=" +
        meetingid +
        "&person=" +
        perf,
      type: "POST",
      success: updateProjectWP,
      error: backOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "delete-project-meeting-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&meeting=" +
        meetingid +
        "&person=" +
        perf,
      type: "POST",
      success: showTimedMessage(
        "gmsg",
        "Deleted another participant...",
        0,
        true
      ),
      error: backOpFailed
      //,datatype: "json"
    });
}

function addWPPerformer(meetingid, perf, update) {
  if (update == 1)
    $.ajax({
      url:
        "add-project-meeting-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&meeting=" +
        meetingid +
        "&person=" +
        perf,
      type: "POST",
      success: updateProjectWP,
      error: backOpFailed
      //,datatype: "json"
    });
  else
    $.ajax({
      url:
        "add-project-meeting-partic.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&meeting=" +
        meetingid +
        "&person=" +
        perf,
      type: "POST",
      success: showTimedMessage("gmsg", "Add another participant...", 0, true),
      error: backOpFailed
      //,datatype: "json"
    });
}

function getCompanyEntry(cid) {
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][0] == cid) return Gcompanies[i];
  }
  return [];
}

function getProjectsForCompany(cid) {
  var projects = [];
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][1][0] == cid) {
      projects.push(Gstrategies[i][0]);
    }
  }
  return projects;
}

function getProjectsIndexForCompany(cid) {
  var projects = [];
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][1][0] == cid) {
      projects.push(i);
    }
  }
  return projects;
}

function projectExistsForCompany(cid, pn) {
  var projects = [];
  for (var i = 0; i < Gstrategies.length; i++) {
    if (Gstrategies[i][1][0] == cid) {
      if (Gstrategies[i][4].valueOf() == pn.valueOf()) return true;
    }
  }
  return false;
}

function addEDCompany() {
  if (Gemployer !== "1") {
    alert("You cannot add companies");
    return false;
  } else {
    Gcurrentcompany = -1;
    $(".companyTitle").text("Add Company");
    deactivateButton("company_submit");
    document.getElementById("company_name").value = "";
    document.getElementById("company_asets").value = "";
    document.getElementById("company_address").value = "";
    document.getElementById("company_website").value = "";
    document.getElementById("company_contact").value = "";
    document.getElementById("supplierCB").checked = false;
    $("#company_modal").modal("show");
  }
}

function editEDCompany(cid) {
  Gcurrentcompany = cid;
  var centry = getCompanyEntry(cid);
  $(".opt_btn_wrp").hide();
  $("#company_modal").modal("show");
  document.getElementById("company_name").value = centry[1];
  if (centry[3] != null && centry[3].length > 1)
    document.getElementById("company_asets").value = centry[3][0];
  deactivateButton("company_submit");
  document.getElementById("company_address").value = centry[2];
  document.getElementById("company_website").value = centry[4];
  document.getElementById("company_contact").value = centry[5];
  $(".companyTitle").text("Edit Company");
  // alert("company : " + centry);
  if (centry.length > 6) document.getElementById("supplierCB").checked = true;
  else document.getElementById("supplierCB").checked = false;
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function saveEDCompany() {
  $("#company_modal").modal("hide");
  var name = document.getElementById("company_name").value;
  if (name.valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Company requires a name!", 0, true);
    return;
  }
  var add = document.getElementById("company_address").value;
  var ass = extractNumber(document.getElementById("company_asets").value);
  var curr = "USD"; // document.getElementById('compcurr').value;
  var url = document.getElementById("company_website").value;
  var tel = document.getElementById("company_contact").value;
  var supplierp = document.getElementById("supplierCB").checked;

  if (Gcurrentcompany == -1) {
    showTimedMessage("gmsg", "Adding new company ...", 0, false);
    if (supplierp) {
      $.ajax({
        url:
          "add-company.php?name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent(curr) +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=yes" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateEDCompanies,
        error: companyEDOpFailed
        //,datatype: "json"
      });
    } else {
      $.ajax({
        url:
          "add-company.php?name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent(curr) +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateEDCompanies,
        error: companyEDOpFailed
        //,datatype: "json"
      });
    }
  } else {
    showTimedMessage("gmsg", "Saving company ...", 0, false);
    if (supplierp)
      $.ajax({
        url:
          "save-company.php?obj=" +
          Gcurrentcompany +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=1" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateEDCompanies,
        error: companyEDOpFailed
        //,datatype: "json"
      });
    else
      $.ajax({
        url:
          "save-company.php?obj=" +
          Gcurrentcompany +
          "&name=" +
          encodeURIComponent(name) +
          "&address=" +
          encodeURIComponent(add) +
          "&assets=" +
          encodeURIComponent(ass) +
          "&units=" +
          encodeURIComponent("USD") +
          "&url=" +
          encodeURIComponent(url) +
          "&telephone=" +
          encodeURIComponent(tel) +
          "&supplierp=0" +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: updateEDCompanies,
        error: companyEDOpFailed
        //,datatype: "json"
      });
  }
}

function companyEDOpFailed(resp) {
  showTimedMessage("gmsg", "Company update failed", 0, true);
}

function deleteEDCompany(i) {
  $(".opt_btn_wrp").hide();
  myAlert("Attention", "Companies cannot be deleted!", "error");
}

function updateEDCompanies(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-companies.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDCompanies,
      error: companyEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function refreshEDCompanies(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gcompanies = result[1];
  sortCompanies();
  companiesEDContent();
  showTimedMessage(
    "gmsg",
    "Company information successfully refreshed",
    5000,
    false
  );
}

function addEDPerson() {
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();
  $(".employeeTitle").text("Add Person");
  document.getElementById("emp_fname").value = "";
  document.getElementById("emp_lname").value = "";
  deactivateButton("employee_submit");
  document.getElementById("emp_company").value = "";
  document.getElementById("emp_desg").value = "";
  document.getElementById("emp_email").value = "";
  $("#checkboxG6").prop("checked", false);
  editingPerson = -1;
}

function addEDPersonForCompany(cid) {
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();
  $(".employeeTitle").text("Add Person");
  document.getElementById("emp_company").value = getCompanyName(cid);
  deactivateButton("employee_submit");
  document.getElementById("emp_fname").value = "";
  document.getElementById("emp_lname").value = "";
  document.getElementById("emp_desg").value = "";
  document.getElementById("emp_email").value = "";
  editingPerson = -1;
}

function generateDeptSelector(cid) {}

function generateCompanySelector() {
  var body = '<datalist id="compsel">';
  for (var i = 0; i < Gcompanies.length; i++) {
    if (Gcompanies[i][0] !== Gemployer && Gemployer !== "1") continue;
    body =
      body +
      '<option value="' +
      Gcompanies[i][1] +
      '"> ' +
      Gcompanies[i][1] +
      "</option>";
  }

  body = body + "</datalist>";
  return body;
}

function generateCompanySelector2() {
  var suppliers = getCurrentSuppliers(Gcurrentstrategy);

  var cid = getCompanyForProject(Gcurrentstrategy);
  suppliers.push(cid);
  var body = '<datalist id="compsel2">';
  for (var i = 0; i < suppliers.length; i++) {
    var centry = getCompanyEntry(suppliers[i]);
    body =
      body + '<option value="' + centry[1] + '"> ' + centry[1] + "</option>";
  }
  body = body + "</datalist>";
  return body;
}

function editEDPerson(i) {
  $(".opt_btn_wrp").hide();
  $("#employee_modal").modal("show");
  $(".employeeTitle").text("Edit Person");
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();
  editingPerson = Gpersons[1][i][0];

  deactivateButton("employee_submit");
  document.getElementById("emp_fname").value = Gpersons[1][i][3].trim();
  document.getElementById("emp_lname").value = Gpersons[1][i][4].trim();
  document.getElementById("emp_company").value = Gpersons[1][i][7];
  document.getElementById("emp_desg").value = Gpersons[1][i][6];
  document.getElementById("emp_email").value = Gpersons[1][i][1];
  if (Gpersons[1][i][10] == "1") $("#checkboxG6").prop("checked", true);
  else $("#checkboxG6").prop("checked", false);
}

function refreshEDPersons(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gpersons = JSON.parse(response);

  peopleEDContent();
  showTimedMessage(
    "gmsg",
    "Person information successfully refreshed",
    5000,
    false
  );
}

function personEDOpFailed(response) {
  showTimedMessage("gmsg", response, 0, true);
}

function deleteEDPerson(perf) {
  myConfirm(
    "Please Confirm!",
    "Please confirm that you want to remove this person",
    "OK",
    "Cancel",
    "deletePersonInternal(" + perf + ")"
  );
  $(".opt_btn_wrp").hide();
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function deletePersonInternal(perf) {
  //
  //
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  var participantData = {
    token: Gtoken,
    username: Gusername,
    participant: perf,
    type: "person"
  };
  $.ajax({
    url: "delete-person.php",
    type: "POST",
    data: {
      data: JSON.stringify(participantData)
    },
    success: updateEDPersons,
    error: teamOpFailed
  });
}

function addEDProject() {
  editingProject = -1;
  $(".projectstitle").text("Add Project");
  var company_name = "";
  if (Gemployer != 1) {
    $(".client-hidden").hide();
    company_name = getCompanyName(Gemployer);
  }
  document.getElementById("client_name").value = company_name;
  document.getElementById("supp_name").value = "";
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();

  document.getElementById("client_dept").value = "";
  document.getElementById("project_title").value = "";
  document.getElementById("project_desc").value = "";
  document.getElementById("project_region").value = "";
  document.getElementById("activeProject").checked = false;
  generateCurrencyDatalist("currlist", "currencySelector");
  document.getElementById("base_currency").value = "";
  deactivateButton("project_submit");
  document.getElementById("project_value").value = "";
  generateSupplierSelector("supplierSelector", -1);
  $("#projects_modal").modal("show");
}

function addEDProjectForCompany(cid) {
  editingProject = cid;
  $(".projectsTitle").text("Add Project for: " + getCompanyName(cid));
  document.getElementById("supp_name").value = "";
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();
  company_name = getCompanyName(cid);
  if (Gemployer != 1) {
    $(".client-hidden").hide();
    company_name = getCompanyName(Gemployer);
  }
  document.getElementById("client_name").value = getCompanyName(cid);
  document.getElementById("client_dept").value = "";
  document.getElementById("project_title").value = "";
  document.getElementById("project_desc").value = "";
  generateCurrencyDatalist("currlist", "currencySelector");
  document.getElementById("base_currency").value = "";
  deactivateButton("project_submit");
  document.getElementById("project_value").value = "";
  document.getElementById("activeProject").checked = false;
  generateSupplierSelector("supplierSelector", editingProject);
}

function editEDProject(i) {
  editingProject = Gstrategies[i][0];
  var pentry = Gstrategies[i];
  $(".opt_btn_wrp").hide();
  $("#projects_modal").modal("show");
  $(".projectsTitle").text("Edit Project");
  document.getElementById("supp_name").value = "";
  document.getElementById(
    "companySelector"
  ).innerHTML = generateCompanySelector();
  document.getElementById("project_region").value = pentry[14];
  document.getElementById("client_name").value = pentry[1][1];
  generateBUSelector();
  document.getElementById("client_dept").value = pentry[3][1];
  document.getElementById("project_title").value = pentry[4];
  document.getElementById("project_desc").value = pentry[5];
  deactivateButton("project_submit");
  var status = false;
  if (pentry[GstatusIndex].valueOf() == "INACTIVE".valueOf()) status = true;
  document.getElementById("activeProject").checked = status;
  generateCurrencyDatalist("currlist", "currencySelector");
  if (pentry[6] != null && pentry[6].length > 1) {
    document.getElementById("base_currency").value = pentry[6][1];
    document.getElementById("project_value").value = pentry[6][0];
  } else {
    document.getElementById("base_currency").value = "";
    document.getElementById("project_value").value = "";
  }
  generateSupplierSelector("supplierSelector", editingProject);
}

function editValueRealised(valuRealiseObject) {
  //
  $("#notesNPV").val(valuRealiseObject.comment);
  $("#verifyRisksType").val(valuRealiseObject.stype);
  $("#value_realized").val(valuRealiseObject.vrealized);
  $("#vDate-Picker").val(valuRealiseObject.date);
  $("#savingsId").val(valuRealiseObject.vrssid);
  $("#update_val_modal").modal("show");
}

function deleteValueRealised(savingsId) {
  showTimedMessage("gmsg", "Deleting value realized ... ", 0, false);
  $.ajax({
    url:
      "delete-ss-savings.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&savingsId=" +
      savingsId,
    type: "POST",
    success: updateVerifyContents,
    error: progOpFailed
    //,datatype: "json"
  });
}

function updateEDProjects(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-all-bus-divisions.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: addProjectWithBU,
      error: projectEDOpFailed
      //,datatype: "json"
    });
  } else showTimedMessage("projstat", "ERROR: " + res[0] + res[1], 0, true);
}

function addProjectWithBUID(dept) {
  $.ajax({
    url:
      "add-project.php?pn=" +
      encodeURIComponent(document.getElementById("project_title").value) +
      "&bu=" +
      encodeURIComponent(dept) +
      "&company=" +
      encodeURIComponent(
        getCompanyIdFromName(document.getElementById("client_name").value)
      ) +
      "&desc=" +
      encodeURIComponent(document.getElementById("project_desc").value) +
      "&savings=" +
      encodeURIComponent(document.getElementById("project_value").value) +
      "&curr=" +
      encodeURIComponent(document.getElementById("base_currency").value) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateEDStrategiesAfterAdd,
    error: strategyEDOpFailed
    //,datatype: "json"
  });
}

function addProjectWithBU(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    var dept = result[1];

    $.ajax({
      url:
        "get-all-bus-divisions.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: showTimedMessage("gmsg", "Department added...", 0, false),
      error: projectEDOpFailed
      //,datatype: "json"
    });
    // delay the 2nd call a bit to avoid problems.
    setTimeout(addProjectWithBUID(dept), 500);
  } else {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
  }
}

function alert_remove(data) {
  if (data.value == "") {
    $("." + data.id + "_error")
      .text("Field can not be blank")
      .show();
  } else {
    $("." + data.id + "_error").hide();
  }
}

var numberRegex = new RegExp(/^\d*\.?\d*$/);
var lastValid = $(".formattedNumberField").val();

function numbersOnlyPlease(elem) {
  if (numberRegex.test(elem.value)) {
    lastValid = elem.value;
  } else {
    elem.value = lastValid;
  }
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function saveEDProject() {
  var name = document.getElementById("project_title").value;
  var compname = document.getElementById("client_name").value;
  var projdes = document.getElementById("project_desc").value;
  var deptname = document.getElementById("client_dept").value;
  var basecurrency = document.getElementById("base_currency").value;
  var new_supplier = document.getElementById("supp_name").value;
  var start_date = getDateById("project_start_date");
  start_date = start_date.split(",");
  start_date = start_date[0];
  var region = document.getElementById("project_region").value;
  if (compname === "" || compname.size == 0) {
    $(".client_name_error")
      .text("Client Name is required")
      .show();
    return false;
  }
  var comp = getCompanyIdFromName(compname.trim());
  if (name === "" || name.size == 0) {
    $(".project_title_error")
      .text("Project title is required")
      .show();
    return false;
  }
  if (projdes === "" || projdes.size == 0) {
    $(".project_desc_error")
      .text("Project Description is required")
      .show();
    return false;
  }
  if (basecurrency === "" || basecurrency.size == 0) {
    $(".base_currency_error")
      .text("Base Currency is required")
      .show();
    return false;
  }
  if (deptname === "" || deptname.size == 0) {
    $(".client_dept_error")
      .text("Dept Name is required")
      .show();
    return false;
  }

  var allSuppliers = getAllSupplierCompanyNames();
  if (userSelectedSuppliers.length === 0 && new_supplier === undefined) {
    $(".supplierSelector_error")
      .text("Please provide either of supplier fields")
      .show();
    return false;
  }
  //code to avoid duplicates of suppliers and comapnies
  var sample1 = new_supplier === undefined ? "" : new_supplier.toLowerCase();
  if (sample1 !== "" && allSuppliers.indexOf(sample1) !== -1) {
    // add new supplier
  }

  var buname = document.getElementById("client_dept").value;
  var dept = -1;
  if (comp >= 0) dept = getBUIdFromName(comp, buname);
  var saveStr = document.getElementById("project_value").value;
  var save = 0;
  if (saveStr != null && saveStr.valueOf() != "".valueOf()) {
    if (validNumber("project_value"))
      save = extractNumber(document.getElementById("project_value").value);
    else {
      showTimedMessage(
        "gmsg",
        "Project Value specified has invalid characters",
        0,
        true
      );
      return;
    }
  }
  var projectData = {
    pj_name: name,
    pj_desc: projdes,
    pj_costunit: basecurrency,
    new_supplier: new_supplier,
    deptname: deptname,
    compname: compname,
    pj_value: save,
    suppliers: userSelectedSuppliers,
    token: Gtoken,
    username: Gusername,
    prjid: editingProject,
    region: region,
    start_date: start_date
  };

  $.ajax({
    url: "add-project-new.php",
    type: "POST",
    data: {
      data: JSON.stringify(projectData)
    },
    success: updateEverything,
    error: strategyEDOpFailed
    //,datatype: "json"
  });
}

function displayMessage() {
  alert("Supplier Addded successfully.");
}

function deleteEDProject(projectId) {
  var c = confirm("Are you sure you want to drop the project?");

  if (c) {
    var projectData = {
      token: Gtoken,
      username: Gusername,
      pid: projectId
    };
    $.ajax({
      url: "drop-project.php",
      type: "POST",
      data: {
        data: JSON.stringify(projectData)
      },
      success: updateEverything,
      error: strategyEDOpFailed
    });
  }
}

var userSelectedSuppliers = [];
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function generateSupplierSelector(divid, projectid) {
  var body =
    '<select multiple="multiple" id="multiselect_suppliers" class="textbox  mo-editor choice" style=" display:none;" >';
  var projectSuppliers = getCurrentSuppliers(projectid);
  var selectedValues = [];

  for (var i = 0; i < Gsuppliers.length; i++) {
    var sup = Gsuppliers[i][1];
    if (projectSuppliers.indexOf(sup) >= 0) selectedValues.push(sup);
    body =
      body + '<option value="' + sup + '">' + Gsuppliers[i][0] + "</option>";
  }
  userSelectedSuppliers = selectedValues;

  body = body + "</select>";
  // alert(body);
  document.getElementById(divid).innerHTML = body;

  var $select = $("#multiselect_suppliers");
  $select.find("option").prop("selected", false);
  $select.find('option[value=""]').prop("selected", true);

  $("#multiselect_suppliers").multiselect({
    // filterPlaceholder: 'Search',
    nonSelectedText: "Select Existing Suppliers",
    dropUp: true,
    nSelectedText: "selected",
    allSelectedText: "All selected",
    // buttonClass: 'btn btn-sm btn-raised btn-default',
    buttonClass: "multiselect_input textbox height57",
    disableIfEmpty: true,
    maxHeight: 180,
    numberDisplayed: 3,
    enableCaseInsensitiveFiltering: true,
    enableClickableOptGroups: true,
    enableHTML: true,
    includeSelectAllOption: false,
    selectAllText: "(all)",
    delimiterText: ", ",
    buttonText: function(options, select) {
      var all = $select.find('option[value=""]');
      if (options.length === 0) {
        return this.nonSelectedText;
      } else if (all.is(":selected")) {
        return (
          this.allSelectedText + " (" + $("option", $(select)).length + ")"
        );
      } else if (
        this.allSelectedText &&
        options.length === $("option", $(select)).length &&
        $("option", $(select)).length !== 1 &&
        this.multiple
      ) {
        if (this.selectAllNumber) {
          return this.allSelectedText + " (" + options.length + ")";
        } else {
          return this.allSelectedText;
        }
      } else if (options.length > this.numberDisplayed) {
        var selectedarry = [];
        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selectedarry.push(label);
        });
        var selected = "";
        for (var i = 0; i < this.numberDisplayed; i++) {
          selected += "<label>" + selectedarry[i] + "</label>";
        }

        var optselected =
          '<label class ="show_count">' +
          " +" +
          (options.length - this.numberDisplayed) +
          " " +
          this.nSelectedText +
          "</label>";

        return selected + "" + optselected;
      } else {
        var selected = "";
        var delimiter = this.delimiterText;

        options.each(function() {
          var label =
            $(this).attr("label") !== undefined
              ? $(this).attr("label")
              : $(this).text();
          selected += "<label>" + label + "</label>";
          //selected += label + delimiter;
        });

        return selected.substr(0, selected.length - 2);
      }
    },
    onChange: function(option, checked) {
      var all = $select.find('option[value=""]');
      var currentOption = $(option);
      var selected_option = currentOption.val();
      if (all.is(":selected")) {
        if (selected_option === all.val()) {
          $select
            .find("option")
            .not(all)
            .each(function() {
              $(this).prop("selected", false);
              var input = $('input[value="' + $(this).val() + '"]');
              input.prop("checked", false);
              input.closest("li").removeClass("active");
            });
        } else {
          $select.find(all).each(function() {
            $(this).prop("selected", false);
            var input = $('input[value="' + $(this).val() + '"]');
            input.prop("checked", false);
            input.closest("li").removeClass("active");
          });
          all.prop("selected", false);
          currentOption.prop("selected", true);
        }
        $select.multiselect("updateButtonText", true);
      } else {
        var index = userSelectedSuppliers.indexOf(selected_option);

        if (index === -1) {
          userSelectedSuppliers.push(selected_option);
        } else {
          userSelectedSuppliers.splice(index, 1);
        }

        $select.find(all).each(function() {
          $(this).prop("selected", false);
          var input = $('input[value="' + $(this).val() + '"]');
          input.prop("checked", false);
          input.closest("li").removeClass("active");
        });
        //all.prop('selected', false);
      }
    }
  });
  $select.multiselect("select", selectedValues);
}

function generateCurrencyDatalist(id, divid) {
  var res = '<datalist id="' + id + '">';
  for (var m = 0; m < Gcurrency.length; m++) {
    res =
      res +
      '<OPTION value="' +
      Gcurrency[m] +
      '">' +
      Gcurrency[m] +
      "</OPTION>";
  }
  res = res + "</datalist>";
  document.getElementById(divid).innerHTML = res;
}

function generateBUSelector() {
  var cid = getCompanyIdFromName(document.getElementById("client_name").value);
  // alert("cid: " + cid);
  var projstring = '<datalist id="depsel" >';
  for (var i = 0; i < Gprojects.length; i++) {
    if ((cid + "").valueOf() == (Gprojects[i][0] + "").valueOf()) {
      // alert("company matched...");
      for (var j = 2; j < Gprojects[i].length; j++) {
        projstring =
          projstring +
          '<OPTION VALUE="' +
          Gprojects[i][j][1] +
          '">' +
          Gprojects[i][j][1] +
          "</OPTION>";
      }
      projstring = projstring + "</datalist>";
      break;
    }
  }
  projstring = projstring + "</datalist";
  document.getElementById("deptSelector").innerHTML = projstring;
}

var GprojectForSupplier = -1;
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function addEDSupplier(response) {
  var res = JSON.parse(response);
  var new_supplier = document.getElementById("supp_name").value;

  if (res[0].valueOf() == "".valueOf()) {
    Gstrategies = res[1];

    setEDMyProjectsBody();
    if (userSelectedSuppliers.length == 0 && deleteSuppliers.length == 0) {
      showTimedMessage("gmsg", "Project added", 5, false);
      //return;
    }

    if (new_supplier.length > 0) {
      $.ajax({
        url:
          "add-new-supplier.php?project=" +
          encodeURIComponent(GprojectForSupplier) +
          "&company=" +
          encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
          "&bu=" +
          encodeURIComponent(getBUForProject(GprojectForSupplier)) +
          "&new_supplier=" +
          encodeURIComponent(new_supplier) +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: showTimedMessage("gmsg", "Added another supplier", 0, false),
        error: projectEDOpFailed
        //,datatype: "json"
      });
    }

    // means userSelectedSuppliers has real companies....
    showTimedMessage("gmsg", "Adding suppliers...", 0, false);
    if (userSelectedSuppliers.length > 0 && deleteSuppliers.length == 0) {
      for (var i = 0; i < userSelectedSuppliers.length; i++) {
        if (i < userSelectedSuppliers.length - 1)
          $.ajax({
            url:
              "add-supplier.php?project=" +
              encodeURIComponent(GprojectForSupplier) +
              "&company=" +
              encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
              "&bu=" +
              encodeURIComponent(getBUForProject(GprojectForSupplier)) +
              "&supplier=" +
              encodeURIComponent(userSelectedSuppliers[i]) +
              "&username=" +
              encodeURIComponent(Gusername) +
              "&token=" +
              encodeURIComponent(Gtoken),
            type: "POST",
            success: showTimedMessage(
              "gmsg",
              "Added another supplier",
              0,
              false
            ),
            error: projectEDOpFailed
            //,datatype: "json"
          });
        else
          $.ajax({
            url:
              "add-supplier.php?project=" +
              encodeURIComponent(GprojectForSupplier) +
              "&company=" +
              encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
              "&bu=" +
              encodeURIComponent(getBUForProject(GprojectForSupplier)) +
              "&supplier=" +
              encodeURIComponent(userSelectedSuppliers[i]) +
              "&username=" +
              encodeURIComponent(Gusername) +
              "&token=" +
              encodeURIComponent(Gtoken),
            type: "POST",
            success: updateEDStrategiesFinal,
            error: projectEDOpFailed
            //,datatype: "json"
          });
      }
      return;
    }

    if (userSelectedSuppliers.length == 0 && deleteSuppliers.length > 0) {
      for (var i = 0; i < deleteSuppliers.length; i++) {
        if (i < deleteSuppliers.length - 1)
          $.ajax({
            url:
              "remove-supplier.php?project=" +
              encodeURIComponent(GprojectForSupplier) +
              "&company=" +
              encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
              "&bu=" +
              encodeURIComponent(getBUForProject(GprojectForSupplier)) +
              "&supplier=" +
              encodeURIComponent(deleteSuppliers[i]) +
              "&username=" +
              encodeURIComponent(Gusername) +
              "&token=" +
              encodeURIComponent(Gtoken),
            type: "POST",
            success: showTimedMessage(
              "gmsg",
              "Deleting another supplier",
              0,
              false
            ),
            error: projectEDOpFailed
            //,datatype: "json"
          });
        else
          $.ajax({
            url:
              "remove-supplier.php?project=" +
              encodeURIComponent(GprojectForSupplier) +
              "&company=" +
              encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
              "&bu=" +
              encodeURIComponent(getBUForProject(GprojectForSupplier)) +
              "&supplier=" +
              encodeURIComponent(deleteSuppliers[i]) +
              "&username=" +
              encodeURIComponent(Gusername) +
              "&token=" +
              encodeURIComponent(Gtoken),
            type: "POST",
            success: updateEDStrategiesFinal,
            error: projectEDOpFailed
            //,datatype: "json"
          });
      }
      return;
    }

    // both additions and removals need to be done
    for (var i = 0; i < userSelectedSuppliers.length; i++) {
      $.ajax({
        url:
          "add-supplier.php?project=" +
          encodeURIComponent(GprojectForSupplier) +
          "&company=" +
          encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
          "&bu=" +
          encodeURIComponent(getBUForProject(GprojectForSupplier)) +
          "&supplier=" +
          encodeURIComponent(userSelectedSuppliers[i]) +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: showTimedMessage("gmsg", "Added another supplier", 0, false),
        error: projectEDOpFailed
        //,datatype: "json"
      });
    }

    for (var i = 0; i < deleteSuppliers.length; i++) {
      if (i < deleteSuppliers.length - 1)
        $.ajax({
          url:
            "remove-supplier.php?project=" +
            encodeURIComponent(GprojectForSupplier) +
            "&company=" +
            encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
            "&bu=" +
            encodeURIComponent(getBUForProject(GprojectForSupplier)) +
            "&supplier=" +
            encodeURIComponent(deleteSuppliers[i]) +
            "&username=" +
            encodeURIComponent(Gusername) +
            "&token=" +
            encodeURIComponent(Gtoken),
          type: "POST",
          success: showTimedMessage(
            "gmsg",
            "Deleting another supplier",
            0,
            false
          ),
          error: projectEDOpFailed
          //,datatype: "json"
        });
      else
        $.ajax({
          url:
            "remove-supplier.php?project=" +
            encodeURIComponent(GprojectForSupplier) +
            "&company=" +
            encodeURIComponent(getCompanyForProject(GprojectForSupplier)) +
            "&bu=" +
            encodeURIComponent(getBUForProject(GprojectForSupplier)) +
            "&supplier=" +
            encodeURIComponent(deleteSuppliers[i]) +
            "&username=" +
            encodeURIComponent(Gusername) +
            "&token=" +
            encodeURIComponent(Gtoken),
          type: "POST",
          success: updateEDStrategiesFinal,
          error: projectEDOpFailed
          //,datatype: "json"
        });
    }
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateEDStrategiesAfterAdd(response) {
  var res = JSON.parse(response);
  GprojectForSupplier = -1;
  if (res[0].valueOf() == "".valueOf()) {
    GprojectForSupplier = res[1];
    if (userSelectedSuppliers.length == 0) {
      showTimedMessage(
        "gmsg",
        "Database updated.  Refreshing display...",
        0,
        false
      );
      $.ajax({
        url:
          "get-projects-for-user.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: refreshEDStrategies,
        error: strategyEDOpFailed
        //,datatype: "json"
      });
      return;
    } else {
      showTimedMessage(
        "gmsg",
        "Database updated.  Refreshing display...",
        0,
        false
      );
      $.ajax({
        url:
          "get-projects-for-user.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: addEDSupplier,
        error: strategyEDOpFailed
        //,datatype: "json"
      });
      return;
    }
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateEDStrategiesAfterSave(response) {
  var res = JSON.parse(response);
  var new_supplier = document.getElementById("supp_name").value;

  if (res[0].valueOf() == "".valueOf()) {
    if (userSelectedSuppliers.length == 0 && deleteSuppliers.length == 0) {
      showTimedMessage(
        "gmsg",
        "Database updated.  Refreshing display...",
        0,
        false
      );
      $.ajax({
        url:
          "get-projects-for-user.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: refreshEDStrategies,
        error: strategyEDOpFailed
        //,datatype: "json"
      });
      //return;
    }
    if (new_supplier.length != 0) {
      showTimedMessage(
        "gmsg",
        "Database updated.  Refreshing display...",
        0,
        false
      );
      $.ajax({
        url:
          "get-projects-for-user.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: addEDSupplier,
        error: strategyEDOpFailed
        //,datatype: "json"
      });
      //return;
    } else {
      showTimedMessage(
        "gmsg",
        "Database updated.  Refreshing display...",
        0,
        false
      );
      $.ajax({
        url:
          "get-projects-for-user.php?username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken),
        type: "POST",
        success: addEDSupplier,
        error: strategyEDOpFailed
        //,datatype: "json"
      });
      return;
    }
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateEDStrategiesFinal(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-projects-for-user.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDStrategies,
      error: strategyEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function updateEDStrategiesAfterStatusChange(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Project status updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-projects-for-user.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDStrategiesStatusChange,
      error: strategyEDOpFailed
      //,datatype: "json"
    });
    return;
  } else {
    if (invalidTokenP(res[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function strategyEDOpFailed(resp) {
  showTimedMessage("gmsg", "Project update failed", 0, true);
}

function projectEDOpFailed(resp) {
  showTimedMessage("gmsg", "Project update failed", 0, true);
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function verifyStepContents() {
  let loggedinuser = localStorage.getItem("Gpnid");
  //
  let netPotentialValue, netValueRealised, temp;
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    "<!-- left sec -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 strategy_container cus_scroll_left" id="left-panel"> ' +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin">Strategy Statements</h2>' +
    "</div>";
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    let performersUI = "";
    var oentry = Gcurrentdata[Grbindex][i];

    if (oentry == null) {
      body = body + "Nothing to see here in this entry";
      continue;
    }
    //
    var ss = oentry[0];
    chartObjects.push(ss);
    let actionOwners = getActionOwners(oentry[6]);
    for (var ij = 0; ij < actionOwners.length; ij++) {
      if (actionOwners[ij] === "") continue;
      performersUI += generateProfileIconFromId(
        actionOwners[ij],
        "owner_count"
      );
    }
    //
    var performance = getSummaryPerformanceAlt(oentry);
    var ssname = oentry[1];
    var constraints = oentry[2];
    var priority = oentry[3];
    var unimplement =
      oentry[31] == 1
        ? '<span class ="action-statuss Priority_type  low_priority">Unselected for Implementation</span>'
        : '<span class="active_strategy text-capitalize">selected for implementation';
    if (oentry[9].valueOf() != "SELECTED".valueOf()) continue;
    var sshandle = oentry[12];
    var ssOwnerId = oentry[19];
    var completed =
      oentry[14] == 1 ? '<span class="ss-completed">Completed</span>' : "";
    var fixedhandle = sshandle;

    if (sshandle.length > GmaxShortStrategyDesc)
      fixedhandle =
        '<span title="' +
        sshandle +
        '">' +
        sshandle.substring(0, GmaxShortStrategyDesc) +
        "</span>";
    var actualSavings = oentry[13];
    var totalActions = oentry[6].length;
    if (actualSavings != null) {
      var valueRealisedTotal = 0;
      for (var k = 0; k < actualSavings.length; k++) {
        if (
          actualSavings[k][5] == "Cost Improvement" ||
          actualSavings[k][5] == "Revenue Improvement"
        ) {
          valueRealisedTotal =
            valueRealisedTotal + parseInt(actualSavings[k][0]);
        } else {
          valueRealisedTotal =
            valueRealisedTotal - parseInt(actualSavings[k][0]);
        }
      }
    }
    var pclass = " low_priority";
    if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
    else if (priority.valueOf() == "MEDIUM".valueOf())
      pclass = " medium_priority";
    var eternalImg = "";
    if (
      oentry.length >= 12 &&
      oentry[11] != null &&
      oentry[11].valueOf() == "ETERNAL".valueOf()
    ) {
      eternalImg =
        '<img title="Marked for reconsideration in Eternal step"  width="28px" src="images/eternal_icon.png"/>';
    }
    temp = performance[0] + performance[1] - performance[2];
    netPotentialValue = CurrencyFormat(temp, GdefaultCurrency, 0, "", ",");
    netValueRealised = CurrencyFormat(
      valueRealisedTotal,
      GdefaultCurrency,
      0,
      "",
      ","
    );
    if (oentry[21] == 0) {
      body += '<div class="strategy_stat_wrap" id="strategy-' + ss + '"> ';
      var ssObject = {
        ssid: oentry[0],
        sscomplete: oentry[14],
        ssdropped: oentry[21]
      };
      ssObject = JSON.stringify(ssObject);
      let participantEdit = `<div class="col-md-2">
      <button class="text-capitalize more_option opt_btn" onclick="RationaleoptionAlt('implementDropDown${ss}')">
      <img src="images/ver_more_black.png" alt="more"> </button></div>`;
      let ssAdminBody = "";
      if (Gadmin == 1 || loggedinuser == ssOwnerId) {
        if (oentry[14] == 0) {
          ssAdminDropDown = `<li class="verify_ss" onclick="completeSS()">
          <i class="fa fa-lock complete-icon" style="margin-right: 10px"></i>
          complete Strategy Statement
          </li>
          <li class="verify_ss" onclick='deleteEDSSS(${ssObject})'>
          <i class="fa fa-trash delete-icon" style="margin-right: 10px"></i>
            Unselect for implementation</li>`;
        }
        if (oentry[14] == 1) {
          ssAdminDropDown = `<li class="verify_ss" onclick='reopenSS(${ssObject})'>
            <i class="fa fa-lock complete-icon" style="margin-right: 10px"></i>
            Reopen Strategy Statement
          </li>`;
        }
        if (oentry[31] == 1) {
          ssAdminDropDown = `<li class="verify_ss" onclick='reselectSS(${ssObject})'>
          <i class="fa fa-lock complete-icon" style="margin-right: 10px"></i>
          Select for Implementation
          </li>`;
        }

        ssAdminBody += `
        <div class="pull-right">
        <div class="row">
          <div class="col-md-10">
          <div class="optdropdown verifydropdown" id="implementDropDown${ss}">
          <ul class="dropdown-ul">
          ${ssAdminDropDown}
            </ul>
          </div>
        </div>
        ${participantEdit}
        </div></div>`;
      }
      ssBody = `<section>
        <div class="head">
        <span class="stat_count">${fixedhandle} ${ssname}</span> 
        <div class="container col-md-12">
        <div class='row'>
        <div class="col-md-6">
          <h6 class="title">Net potential value identified</h6>
          ${netPotentialValue}
        </div>
        <div class="col-md-6">
          <h6 class="title">Net value realised</h6>
          ${netValueRealised}
        </div>
      </div>
      <div class='row'>
        <div class="col-md-6">
          <h6 class="title">Action Items</h6>
          ${totalActions}
        </div>
        <div class="col-md-6">
          <h6 class="title">Owners </h6>
          ${performersUI}
        </div>
      </div>
      <div class='row' style='margin-top:5px'>
        <div class="col-md-8">
        <span class="Priority_type ${pclass}">${priority}</span>
        <span>${unimplement}</span>
         <span>${completed} </span>
        </div>
        <div class="col-md-4">
        ${ssAdminBody}
        </div>
      </div>
        </div>
       </section>`;
      let adminValuEdit = "";
      if (Gadmin == 1 || loggedinuser == ssOwnerId) {
        adminValuEdit = `<button class="v_stage_button" style="float: right" onclick="addEDValueRealized(${ss})">
        <img src="images/add_box.png" width="20" height="20">
        <span>Value Realized</span>
        </button>`;
      }
      body += ssBody;
      body += `<div class="value_realised_wrap">
    <div class="value_realised_head">
    <span class="show_pro_note_opt" onclick="toggleValueRealsied($(this))">Show Value Realized 
    <i class="fa fa-angle-down" aria-hidden="true"></i>
    </span>
    ${adminValuEdit}
    </div>
    <div class="value_realised_dropdown_wrp" hidden>
       <table class="value_realised_dropdown strategic_opt_lists">
          <thead>
             <tr>
                <th width="20%">Type Of Savings</th>     
                <th width="15%">Value Realised</th>
                <th width="20%">Comment</th>
                <th width="25%">Updated by </th>
                <th width="20%"></th>
             </tr>
          </thead><tbody>`;
      if (actualSavings != null) {
        for (var k = 0; k < actualSavings.length; k++) {
          // var valueRealised = actualSavings[k];
          var realizedOwner = generateProfileIconFromId(
            actualSavings[k][3],
            "owner_count"
          );
          var dateReadable = getPrintDate(actualSavings[k][1]);
          var valuRealiseObject = {
            date: actualSavings[k][1],
            stype: actualSavings[k][5],
            vrealized: actualSavings[k][0],
            vrssid: actualSavings[k][6],
            vrowner: actualSavings[k][3],
            comment: actualSavings[k][2]
          };
          valuRealiseObject = JSON.stringify(valuRealiseObject);
          let adminEdit = "";
          if (Gadmin == 1 || loggedinuser == ssOwnerId) {
            adminEdit = `<div class="updatedate">
              <button class='custom-icon edit-icon' onclick='editValueRealised(${valuRealiseObject})'  ><i class='fa fa-edit'></i> Edit</button>
              <button class='custom-icon delete-icon' onclick='deleteValueRealised( ${actualSavings[k][6]})'  ><i class='fa fa-trash'></i> Delete</button>
              </div>`;
          }
          body =
            body +
            `<tr class=vstageborder>
          <td>
          <div class="updatedate">${actualSavings[k][5]}</div>
         </td>
          <td>
         <div class="valueRealiseds">${CurrencyFormat(
           actualSavings[k][0],
           GdefaultCurrency,
           0,
           "",
           ","
         )}</div>
          </td>
          </td> 
          <td>
          <div class="updatedate">${actualSavings[k][2]}</div>
         </td>
          <td>
          <div class="updatedate">${realizedOwner +
            " on " +
            dateReadable} </div>
          </td>
          <td>
          ${adminEdit}
          </td>
          </tr>`;
        }
      }
      body = body + "</table>" + "</div>" + " </div>" + "</div>";
    }
  }
  body =
    body +
    "</div>" +
    "<!-- right sec -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 action_container">' +
    '<div class="sec_head verify_action_head">' +
    '<h2 class="sec_title no_margin">Actions</h2>' +
    '<div class="pull-right">' +
    // '<a href="#" class="priority_filter">Sort by priority <i class="fa fa-caret-down" aria-hidden="true"></i></a>' +
    "</div>" +
    "</div>" +
    '<div id="vactionsheader">' +
    '<div class="info_block action_info_block">' +
    '<img src="images/info_icon.png" class="icon_lt"/> Select a strategy statement and start assigning action items and owners' +
    "</div>" +
    "</div>" +
    "<!-- submitted action list-->" +
    '<div class="stat_actions_wrp cus_scroll" id="verify_actions">';
  body = body + '<div id="verifyActions"></div>'; // to be filled in after selection of SS
  body = body + "</div>" + "</div>" + "</div>";
  return body;
}

GCurrentSSDropped = false;
GCurrentSSComplete = false;
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function implementStepContents() {
  let loggedinuser = localStorage.getItem("Gpnid");
  //
  let netPotentialValue, temp;
  let ssAdminDropDown = "";
  var body =
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    "<!-- left sec -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 strategy_container cus_scroll_left" id="left-panel"> ' +
    '<div class="sec_head no_margin">' +
    '<h2 class="sec_title no_margin">Strategy Statements</h2>' +
    "</div>";
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    let performersUI = "";
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry == null) {
      body = body + "Nothing to see here in this entry";
      continue;
    }
    var ss = oentry[0];
    chartObjects.push(ss);
    let actionOwners = getActionOwners(oentry[6]);
    let SSOwnerId =
      oentry[19] == null
        ? "-"
        : generateProfileIconFromId(oentry[19], "owner_count");
    var performance = getSummaryPerformanceAlt(oentry);
    for (var ij = 0; ij < actionOwners.length; ij++) {
      if (actionOwners[ij] === "") continue;
      performersUI += generateProfileIconFromId(
        actionOwners[ij],
        "owner_count"
      );
    }
    var ssname = oentry[1];
    var priority = oentry[3];
    var selected = oentry[9];
    if (oentry[9].valueOf() != "SELECTED".valueOf()) continue;
    var sshandle = oentry[12];
    var completed =
      oentry[14] == 1 ? '<span class="ss-completed">Completed</span>' : "";
    var dropped =
      oentry[21] == 1
        ? '<span class ="action-statuss action-status-danger">Dropped</span>'
        : "";
    var fixedhandle = sshandle;
    if (sshandle.length > GmaxShortStrategyDesc)
      fixedhandle =
        '<span title="' +
        sshandle +
        '">' +
        sshandle.substring(0, GmaxShortStrategyDesc) +
        "</span>";
    var actualSavings = oentry[13];
    var totalActions = oentry[6].length;
    if (actualSavings != null) {
      var valueRealisedTotal = 0;
      for (var k = 0; k < actualSavings.length; k++) {
        if (
          actualSavings[k][5] == "Cost Improvement" ||
          actualSavings[k][5] == "Revenue Improvement"
        ) {
          valueRealisedTotal =
            valueRealisedTotal + parseInt(actualSavings[k][0]);
        } else {
          valueRealisedTotal =
            valueRealisedTotal - parseInt(actualSavings[k][0]);
        }
      }
    }
    var ssObject = {
      ssid: oentry[0],
      sscomplete: oentry[14],
      ssdropped: oentry[21],
      unimplement: oentry[31]
    };
    ssObject = JSON.stringify(ssObject);
    var pclass = " low_priority";
    if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
    else if (priority.valueOf() == "MEDIUM".valueOf())
      pclass = " medium_priority";
    var eternalImg = "";
    if (
      oentry.length >= 12 &&
      oentry[11] != null &&
      oentry[11].valueOf() == "ETERNAL".valueOf()
    ) {
      eternalImg =
        '<img title="Marked for reconsideration in Eternal step"  width="28px" src="images/eternal_icon.png"/>';
    }

    let startDate = getPrintDate(oentry[17]);
    let targetDate = getPrintDate(oentry[18]);
    temp = performance[0] + performance[1] - performance[2];
    netPotentialValue = CurrencyFormat(temp, GdefaultCurrency, 0, "", ",");
    body += `<div class="strategy_stat_wrap">`;
    let ssAdminBody = "";
    if (Gadmin == 1) {
      if (oentry[21] == 0) {
        ssAdminDropDown = `<li class="verify_ss" onclick='editEDSSS(2, ${ss},${ssObject})'>
     <i class="fa fa-lock complete-icon" style="margin-right: 10px"></i>
     Edit Strategy Statement
     </li>
     <li class="verify_ss" onclick='deleteEDSSI(${ssObject})'>
     <i class="fa fa-trash delete-icon" style="margin-right: 10px"></i>
      Drop Strategy Statement</li>`;
      } else {
        ssAdminDropDown = `<li class="verify_ss" onclick='undropss(${ssObject})'>
        <i class="fa fa-lock complete-icon" style="margin-right: 10px"></i>
         Undrop Strategy Statement
      </li>`;
      }
      ssAdminBody += `
      <div class="pull-right">
        <div class="row">
          <div class="col-md-10">
          <div class="optdropdown verifydropdown" id="implementDropDown${ss}">
          <ul class="dropdown-ul">
          ${ssAdminDropDown}
            </ul>
          </div>
        </div>
        <div class="col-md-2"><button class="text-capitalize more_option opt_btn" onclick="RationaleoptionAlt('implementDropDown${ss}')"><img src="images/ver_more_black.png" alt="more"> </button></div>
      </div></div>`;
    }
    ssBody = `<section class="stat_count" id="strategy-${ss}" ssObject='${ssObject}'>
        <div class="head">
        <span>${fixedhandle} ${ssname}</span> 
        <div class="container col-md-12">
        <div class='row'>
        <div class="col-md-3">
        <h6 class="title">Owner</h6>
        ${SSOwnerId}
        </div>
        <div class="col-md-3">
      <h6 class="title">Start Date</h6>
        ${startDate}
        </div>
        <div class="col-md-3">
        <h6 class="title">Target Date</h6>
        ${targetDate}
        </div>
        </div>
        <div class='row'>
        <div class="col-md-3">
        <h6 class="title">Net potential value identified</h6>
        ${netPotentialValue}
      </div>
        <div class="col-md-3">
          <h6 class="title">Action Items</h6>
          ${totalActions}
        </div>
        <div class="col-md-3">
          <h6 class="title">Action Owners </h6>
          ${performersUI}
        </div>
        <div class="col-md-3">
        </div>
      </div>
      <div class='row' style='margin-top:5px'>
      <div class="col-md-8">
      <span class="Priority_type ${pclass}">${priority}</span>
      <span class="active_strategy text-capitalize">${selected.toLowerCase()} for implementation </span>
      ${completed}
      <span class ="ss_status" id="ss_status_${ss}">${dropped}</span>
      </div>
      <div class="col-md-4">
        ${ssAdminBody}
        </div>
    </div>
        </div>
       </section></div>`;

    body += ssBody;
  }

  let adminActionButton = "";
  if (Gadmin == 1) {
    adminActionButton += `<div class="pull-right">
           <a href="javascript:void(0);" class="btn prmary_btn" id="openaction_modal" onclick="addEDSSAction()">
             <i class="fa fa-plus" aria-hidden="true"></i>Actions</a></div>`;
  }
  body =
    body +
    `</div>
    <!-- right sec -->
    <div class="col-lg-6 col-md-6 col-sm-6 action_container">
      <div class="sec_head verify_action_head">`;
  body =
    body +
    `<h2 class="sec_title no_margin">Actions</h2>
         ${adminActionButton}
      </div> 
       <div id="vactionsheader">
         <div class="info_block action_info_block">
             <img src="images/info_icon.png" class="icon_lt"/> Select a strategy statement and start assigning action items and owners
         </div>
       </div>`;
  body =
    body +
    `<!-- submitted action list-->
          <div class="stat_actions_wrp cus_scroll" id="right-panel">`;
  body = body + `<div id="ssActions"></div>`; // to be filled in after selection of SS
  body =
    body +
    `</div>
      </div>
    </div>`;
  return body;
}
var selectedActionPerformers = [];
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function populateActionPerformers(datalistname, divname, performers) {
  selectedActionPerformers = [];
  var actionPerformers = performers.split(",");
  var body =
    '<select multiple="multiple" id="multiselect_performers" class="textbox mo-editor choice" style=" display:none;" >';
  var teamsters = getTeamParticipants(Gcurrentstrategy);

  for (var i = 0; i < teamsters.length; i++) {
    if (actionPerformers.indexOf(teamsters[i][0]) >= 0)
      selectedActionPerformers.push(teamsters[i][0]);
    body =
      body +
      '<option value="' +
      teamsters[i][0] +
      '">' +
      getPersonName(teamsters[i][0]) +
      "</option>";
  }
  body = body + "</select>";
  document.getElementById(divname).innerHTML = body;
  var $select = $("#multiselect_performers");
  $select.find("option").prop("selected", false);
  $select.find('option[value=""]').prop("selected", true);
  $("#multiselect_performers").multiselect({
    dropUp: true,
    buttonClass: "multiselect_input textbox",
    disableIfEmpty: true,
    maxHeight: 200,
    numberDisplayed: 3,
    enableHTML: false,
    enableCaseInsensitiveFiltering: true,
    includeSelectAllOption: false,
    delimiterText: ", ",
    buttonText: function(options, select) {
      if (options.length === 0) {
        return "Select a person";
      } else if (options.length > 3) {
        return "More than 3 persons selected!";
      } else {
        var labels = [];
        options.each(function() {
          if ($(this).attr("label") !== undefined) {
            labels.push($(this).attr("label"));
          } else {
            labels.push($(this).html());
          }
        });
        return labels.join(", ") + "";
      }
    },
    onChange: function(option, checked) {
      var selectedOption = $(option).val();
      if (checked) {
        selectedActionPerformers.push(selectedOption);
      } else {
        selectedActionPerformers = selectedActionPerformers.filter(function(
          item
        ) {
          return item != selectedOption;
        });
      }
    }
  });

  $select.multiselect("select", selectedActionPerformers);
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function addEDSSAction() {
  if (GCurrentSSDropped) {
    //
    myAlert(
      "Attention",
      "Strategy Statement has been Dropped.Please Un-Drop Strategy Statement before adding action item",
      "error"
    );
  } else if (GCurrentSSComplete) {
    myAlert(
      "Attention",
      "Unable to add an action item as Strategy Statement has been marked as completed in Verify Step. Please Reopen Strategy Statement before adding action item",
      "error"
    );
  } else {
    editingAction = -1;
    var oentry = findSSEntry(GcurrentSS);
    var performance = getSummaryPerformanceAlt(oentry);
    var priority = oentry[3];
    var pclass = " low_priority";
    if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
    else if (priority.valueOf() == "MEDIUM".valueOf())
      pclass = " medium_priority";
    var sshandle = oentry[12];
    var fixedhandle = sshandle;
    if (sshandle.length > GmaxShortStrategyDesc)
      fixedhandle =
        '<span title="' +
        sshandle +
        '">' +
        sshandle.substring(0, GmaxShortStrategyDesc) +
        "</span>";

    document.getElementById("ssHeaderA").innerHTML =
      '<span class="stat_count">' +
      fixedhandle +
      "</span>" +
      '<span class="Priority_type added_risk' +
      pclass +
      '">' +
      priority +
      "</span>";

    deactivateButton("action_submit");

    document.getElementById("ssDesc").innerHTML = oentry[1];
    document.getElementById("ssVal").innerHTML = CurrencyFormat(
      performance[0] + performance[1] - performance[2],
      GdefaultCurrency,
      0,
      "",
      ","
    );
    $("#action_date").datepicker("setDate", new Date());
    document.getElementById("action_desc").value = "";
    document.getElementById("action_date").value = "";
    populateActionPerformers("perfList", "actionPerformers", "");
    // document.getElementById("action_who").value = "";
    $(".actiontitle").text("Add Action");
    $(".datepicker").datepicker("update", "");
    $("#action_modal").modal("show");
  }
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function findActionEntryInSS(ss, position) {
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry[0] == GcurrentSS) {
      if (oentry[6] == null || oentry[6].length == 0) return [];
      return oentry[6][position];
    }
  }
  return [];
}
var currentActionId = -1;
/**
 * called when edit action button is clicked in I step
 * @param {number} i - index of the action item in strategy statement
 * @param {object} ssObject1 - strategy statement Object
 */
function editEDSSAction(i, ssObject1) {
  if (ssObject1.ssdropped == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been completed.Please Un-Drop Strategy Statement before modifying action item",
      "error"
    );
  } else if (ssObject1.sscomplete == 1) {
    myAlert(
      "Attention",
      "Unable to edit the action item as Strategy Statement has been marked as completed in Verify Step. Please Reopen Strategy Statement before modifying action item",
      "error"
    );
  } else if (ssObject1.actioncompleted == 1) {
    myAlert(
      "Attention",
      "Action item has been Completed in Verify stage.Please reopen action item before modifying action item",
      "error"
    );
  } else if (ssObject1.ssunimplement == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been Unselected for Implementation. Please Select Strategy Statement in Verify Stage before modifying Action Item",
      "error"
    );
  } else {
    // currentActionId = actionId;

    $(".datepicker").datepicker("update", "");
    $(".opt_btn_wrp").hide();
    $(".actiontitle").text("Edit Action");
    var oentry = findSSEntry(ssObject1.ssid);

    var performance = getSummaryPerformanceAlt(oentry);
    var priority = oentry[3];
    var pclass = " low_priority";
    if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
    else if (priority.valueOf() == "MEDIUM".valueOf())
      pclass = " medium_priority";
    var sshandle = oentry[12];
    var fixedhandle = sshandle;
    if (sshandle.length > GmaxShortStrategyDesc)
      fixedhandle =
        '<span title="' +
        sshandle +
        '">' +
        sshandle.substring(0, GmaxShortStrategyDesc) +
        "</span>";
    var str1 = '<span class="stat_count">' + fixedhandle + "</span>";
    var str2 =
      '<span class="Priority_type ' + pclass + '">' + priority + "</span>";
    //alert(str1);
    //alert(str2);
    document.getElementById("ssHeaderA").innerHTML = str1 + str2;
    document.getElementById("ssDesc").innerHTML = oentry[1];
    document.getElementById("ssVal").innerHTML = CurrencyFormat(
      performance[0] + performance[1] - performance[2],
      GdefaultCurrency,
      0,
      "",
      ","
    );

    var ae = ssObject1.ssactions;

    editingAction = ae[0];
    document.getElementById("action_desc").value = ae[1];
    var delms = ae[2].split(" ");

    if (delms[0].valueOf() != "".valueOf())
      setDateById("action_date", delms[0]);
    else setDateById("action_date", "");

    populateActionPerformers("perfList", "actionPerformers", ae[3]);
    deactivateButton("action_submit");
    $("#action_modal").modal("show");
  }
  $(".opt_btn_wrp").css("visibility", "hidden");
}

function confirmDeleteEDSSAction(i, ssObject1) {
  if (ssObject1.ssdropped == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been Dropped.Please Un-Drop Strategy Statement before deleting the action item",
      "error"
    );
  } else if (ssObject1.sscomplete == 1) {
    myAlert(
      "Attention",
      "Unable to delete the action item as Strategy Statement has been marked as completed in Verify Step. Please Reopen Strategy Statement before deleting action item",
      "error"
    );
  } else if (ssObject1.actioncompleted == 1) {
    myAlert(
      "Attention",
      "Action item has been Completed in Verify stage.Please reopen action item before deleting action item",
      "error"
    );
  } else if (ssObject1.ssunimplement == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been Unselected for Implementation. Please Select Strategy Statement in Verify Stage before modifying Action Item",
      "error"
    );
  } else {
    $(".opt_btn_wrp").hide();
    myConfirm(
      "Confirm action deletion!",
      "Please confirm that you want to delete this action",
      "OK",
      "Cancel",
      "deleteEDSSAction(" + i + ")"
    );
  }
  $(".opt_btn_wrp").css("visibility", "hidden");
}

function deleteEDSSAction(i, actionId) {
  currentActionId = actionId;
  $(".opt_btn_wrp").hide();
  $("#myconfirm_modal").modal("hide");
  var ae = findActionEntryInSS(GcurrentSS, i);
  if (ae[5] != null && ae[5].valueOf() != "".valueOf()) {
    myAlert(
      "Error!",
      "Action cannot be deleted -- completion date is set!",
      "error"
    );
    return;
  }
  if (ae[4] != null && ae[4].length > 0) {
    myAlert(
      "Error!",
      "Action cannot be deleted -- action comments exist!",
      "error"
    );
    return;
  }
  if (ae[7] != null && ae[7].length > 0) {
    myAlert(
      "Error!",
      "Action cannot be deleted -- progress notes exist!",
      "error"
    );
    return;
  }

  showTimedMessage("gmsg", "Deleting action from action plan...", 0, false);
  $.ajax({
    url:
      "delete-ss-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      GcurrentSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&action=" +
      ae[0],
    type: "POST",
    success: updateActionsTab,
    error: actionOpFailed
    //,datatype: "json"
  });
}

function getActionImplementers(oentry) {
  var performers = [];

  return performers;
}
/**
 * HTML for actions of a strategy statement in I step
 */
function refreshSS_ED_Actions() {
  console.trace();
  var body = "";
  let temPbody = "";
  var deadline;
  let actionId;
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    //
    var oentry = Gcurrentdata[Grbindex][i];
    var ss = oentry[0];
    var ssname = oentry[1];
    var completed = oentry[14];
    var dropped = oentry[21];
    if (parseInt(Gcurrentdata[Grbindex][i][0]) !== GcurrentSS) {
      continue;
    }

    var ss_actions = Gcurrentdata[Grbindex][i][6];
    // actionstatus
    if (ss_actions == null || ss_actions.length == 0) {
      body = body + "No actions for this strategy statement!";
      break;
    }
    for (j = 0; j < ss_actions.length; j++) {
      if (ss_actions[j][2] === null || ss_actions[j][2] === "") {
        deadline = "TBD";
      } else {
        deadline = getPrintDate(ss_actions[j][2]);
      }
      actionId = ss_actions[j][0];
      actionCompleted = ss_actions[j][12];

      //
      actionTitle = ss_actions[j][1];
      var performers = ss_actions[j][3].split(",");
      //
      // getFirstLastFromId(performers[j])
      let actionOwnersHtml = "";
      for (var i = 0; i < performers.length; i++) {
        var names = getFirstLastFromId(performers[i]);
        actionOwnersHtml +=
          '<span title="' +
          names[0] +
          " " +
          names[1] +
          '" class="owner_count">' +
          names[2] +
          "</span>";
      }
      //
      var ssObject1 = {
        ssid: oentry[0],
        sscomplete: oentry[14],
        ssunimplement: oentry[31],
        ssdropped: oentry[21],
        actionid: ss_actions[j][0],
        ssactions: ss_actions[j],
        actionstatus: ss_actions[j][10],
        actioncompleted: ss_actions[j][12]
      };
      ssObject1 = JSON.stringify(ssObject1);
      let admineditbutton = "";
      if (Gadmin == 1) {
        admineditbutton += `<div class="col-md-1">
       <button class="text-capitalize more_option opt_btn" onclick="RationaleoptionAlt('action-actions-${actionId}')"><img src="images/ver_more_black.png" alt="more"> </button>
       </div>`;
      }
      temPbody += `<div class="action_stat_wrap" id="action-${actionId}">
        <section class="new_action_stat_wrap">
          <div class="head">
          <span class="stat_subcount">${actionTitle}</span> 
          </div>
          <div class="container col-md-12">
            <div class="row">
              <div class="col-md-3">
              <h6 class="title">Target Date</h6>
              ${deadline}
              </div>
              <div class="col-md-3">
                <h6 class="title">Owner</h6>
                  ${actionOwnersHtml}
              </div> 
              
              
              <div class="col-md-5">
                <div class="verifydropdown margin_block pull-right" id="action-actions-${actionId}">
                    <ul class="">
                      <li class="verify_ss" onclick='editEDSSAction(0,${ssObject1});'>
                      <i class="fa fa-pencil complete-icon" style="margin-right: 10px"></i>
                          Edit Action
                        </li>
                      <li class="verify_ss" onclick='confirmDeleteEDSSAction(${j},${ssObject1});'>
                      <i class="fa fa-trash delete-icon " style="margin-right: 10px"></i>
                          Delete Action
                      </li>
                    </ul>
                </div>
              </div>
              ${admineditbutton}</div> </div></section> </div>`;
      // //
      //    }
    }
    break;
  }

  //
  $("#iactionsheader").html("");
  document.getElementById("ssActions").innerHTML = temPbody;
}

function getIDFromName(name) {
  for (var i = 0; i < Gpersons[1].length; i++) {
    if (getPersonName(Gpersons[1][i][0]).valueOf() == name.valueOf())
      return Gpersons[1][i][0];
  }
  return -1;
}

function saveEDSSAction() {
  $(".opt_btn_wrp").hide();
  $("#action_modal").modal("hide");

  var desc = document.getElementById("action_desc").value;
  if (desc.valueOf() == "".valueOf()) {
    myAlert("Attention", "Action description is blank!", "error");
    return;
  }
  var includeDate = true;
  if (document.getElementById("action_date").value.valueOf() == "".valueOf()) {
    includeDate = false;
  }
  var dd = "";
  if (includeDate) dd = getDateById("action_date");
  if (dd !== "") {
    dd = dd.split(",");
    dd = dd[0];
  }

  var id = selectedActionPerformers.join(",");
  var sendData = {
    ssid: GcurrentSS,
    pjid: Gcurrentstrategy,
    coid: getCompanyForProject(Gcurrentstrategy),
    buid: getBUForProject(Gcurrentstrategy),
    description: desc,
    responsible: id,
    deadline: dd,
    actionId: editingAction
  };

  storeSSPageState();
  showTimedMessage("gmsg", "Saving action plan...", 0, false);
  $.ajax({
    url:
      "save-ss-action.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    data: {
      data: JSON.stringify(sendData)
    },
    success: updateActionsTab,
    error: actionOpFailed
    //,datatype: "json"
  });
}

function actionOpFailed(resp) {
  showTimedMessage("gmsg", "Progress update failed", 0, true);
}

function progOpFailed(resp) {
  showTimedMessage("gmsg", "Progress update failed", 0, true);
}

function populateCompanySelector() {
  var host = getCompanyForProject(Gcurrentstrategy);
  var anklesaria = getAnklesaria();
  var suppliers = getCurrentSuppliers(Gcurrentstrategy);
  suppliers.push(host);
  suppliers.reverse(); // make host first
  suppliers.push(anklesaria);

  var body = '<datalist id="companyList">';
  for (var i = 0; i < suppliers.length; i++) {
    body =
      body +
      '<option value="' +
      suppliers[i] +
      '">' +
      getCompanyName(suppliers[i]) +
      "</option>";
  }
  body = body + "</datalist>";
  document.getElementById("companySelector").innerHTML = body;
}

function currentParticipantP(s, p) {
  var participants = getTeamParticipants(s);
  // alert("current participants: " + participants);
  for (var i = 0; i < participants.length; i++) {
    if (participants[i][0] == p) {
      return true;
    }
  }
  return false;
}

function populateParticipantPoolSelector() {
  var body = '<table class="table prv_proj_table" id="Table4">';
  var participants = getPotentialTeamMembers(getProjectEntry(Gcurrentstrategy));

  // participants.sort();
  for (var i = 0; i < participants.length; i++) {
    var pid = participants[i][0];
    var names = getFirstLastFromId(pid);

    var selected = "";
    if (currentParticipantP(Gcurrentstrategy, pid)) selected = " checked";
    // alert("potential participant: " + names[0] + ' ' + names[1] + ' ' + selected);
    body =
      body +
      "<tr>" +
      '<td width="5%">' +
      '<p class="checkbox_wrp">' +
      '<input type="checkbox" name="checkbox-' +
      pid +
      '" value="yes" id="checkbox-' +
      pid +
      '" class="css-checkbox" ' +
      selected +
      " >" +
      '<label for="checkbox-' +
      pid +
      '" class="css-label"></label>' +
      "</p>" +
      "</td>" +
      '<td width="50%">' +
      generateProfileIconFromId(pid, "empname") +
      names[0] +
      " " +
      names[1] +
      "</td>" +
      '<td width="45%">' +
      getPersonRole(pid) +
      "</td>" +
      "</tr>";
  }
  body = body + "</table>";
  document.getElementById("participantPoolSelector").innerHTML = body;
  $("#prvprojserach").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    $("#Table4 tr").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .toLowerCase()
          .indexOf(value) > -1
      );
    });
  });
}

function editProjectParticipants() {
  document.getElementById("partind_fname").value = "";
  document.getElementById("partind_lname").value = "";
  populateCompanySelector();
  document.getElementById("partind_company").value = "";
  document.getElementById("partind_desg").value = "";
  populateParticipantPoolSelector();
  document.getElementById("partind_email").value = "";
  document.getElementById("prvprojserach").value = "";
  $("#partTabs").tabs();
  activateButton("bpprv_submit");
  document.getElementById(
    "companySelector2"
  ).innerHTML = generateCompanySelector2();
}

function refreshEDTeam(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Updating relevant displays", 0, false);
    $.ajax({
      url:
        "get-projects-for-user.php?" +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: teamDataBackground,
      error: projectEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function updateParticipants() {
  $("#participant_modal").modal("hide");
  var candidates = getPotentialTeamMembers(getProjectEntry(Gcurrentstrategy));
  var candidateIDs = [];
  for (var i = 0; i < candidates.length; i++) {
    candidateIDs.push(candidates[i][0]);
  }

  var currentParticipants = getTeamParticipants(Gcurrentstrategy);
  var currentParticipantIDs = [];
  for (var i = 0; i < currentParticipants.length; i++) {
    currentParticipantIDs.push(currentParticipants[i][0]);
  }

  var added = [];
  deleted = [];
  var proposedParticipants = [];
  for (var i = 0; i < candidateIDs.length; i++) {
    var pid = candidateIDs[i];
    var cbid = "checkbox-" + pid;
    if (document.getElementById(cbid).checked) {
      // in the new team
      if (currentParticipantIDs.indexOf(pid) < 0)
        // not in the old team
        added.push(pid);
    } // person is NOT in the new team
    else {
      if (currentParticipantIDs.indexOf(pid) >= 0)
        // but in the old team
        deleted.push(pid);
    }
  }

  var operations = [];
  for (var i = 0; i < added.length; i++) {
    operations.push(["add-participant.php", added[i]]);
  }

  for (var i = 0; i < deleted.length; i++) {
    operations.push(["remove-participant.php", deleted[i]]);
  }

  for (var i = 0; i < operations.length; i++) {
    var strategy = Gcurrentstrategy;
    var person = operations[i][1];

    if (i < operations.length - 1) {
      $.ajax({
        url:
          operations[i][0] +
          "?project=" +
          encodeURIComponent(strategy) +
          "&company=" +
          encodeURIComponent(getCompanyForProject(strategy)) +
          "&bu=" +
          encodeURIComponent(getBUForProject(strategy)) +
          "&person=" +
          encodeURIComponent(person) +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&role=MEMBER",
        type: "POST",
        success: showTimedMessage("gmsg", "Next operation", 0, false),
        error: teamOpFailed
        //,datatype: "json"
      });
    } else {
      $.ajax({
        url:
          operations[i][0] +
          "?project=" +
          encodeURIComponent(strategy) +
          "&company=" +
          encodeURIComponent(getCompanyForProject(strategy)) +
          "&bu=" +
          encodeURIComponent(getBUForProject(strategy)) +
          "&person=" +
          encodeURIComponent(person) +
          "&username=" +
          encodeURIComponent(Gusername) +
          "&token=" +
          encodeURIComponent(Gtoken) +
          "&role=MEMBER",
        type: "POST",
        success: refreshEDTeam,
        error: teamOpFailed
        //,datatype: "json"
      });
    }
  }
}

function filterMyProjectsContents() {
  // myAlert("Attention", "Filter to show: " + document.getElementById("selectFilter").value, "success");
  GprojectFilterSetting = document.getElementById("selectFilter").value.trim();
  setEDMyProjectsBody();
}

function filterProjectsTable() {
  var $rows = $(".projects_table tr");
  $("#search_project").keyup(function() {
    var val = $.trim($(this).val())
      .replace(/ +/g, " ")
      .toLowerCase();
    $rows
      .show()
      .filter(function() {
        var text = $(this)
          .text()
          .replace(/\s+/g, " ")
          .toLowerCase();
        return !~text.indexOf(val);
      })
      .hide();
  });
}

function filterCompaniesTable() {
  var $rows = $(".company_table tbody tr");
  $("#search_company").keyup(function() {
    var val = $.trim($(this).val())
      .replace(/ +/g, " ")
      .toLowerCase();
    $rows
      .show()
      .filter(function() {
        var text = $(this)
          .text()
          .replace(/\s+/g, " ")
          .toLowerCase();
        return !~text.indexOf(val);
      })
      .hide();
    $(".company_table .no_data_row").hide();
  });
}

function filterPeopleTable() {
  var $rows = $(".people_table tbody tr");
  $("#search_people").keyup(function() {
    var val = $.trim($(this).val())
      .replace(/ +/g, " ")
      .toLowerCase();
    $rows
      .show()
      .filter(function() {
        var text = $(this)
          .text()
          .replace(/\s+/g, " ")
          .toLowerCase();
        return !~text.indexOf(val);
      })
      .hide();
    $(".people_table .no_data_row").hide();
  });
}

// single function that puts up a modal dialog to confirm something
// title of modal, mesg of modal, label for OK, label for Cancel, and string representing the action for OK click
function myConfirm(title, msg, okLabel, cancelLabel, okFunction) {
  $("#myconfirm_modal").modal("show");
  document.getElementById("myconfirmtitle").innerHTML = title;
  document.getElementById("confirmMsg").innerHTML = msg;
  document.getElementById("myconfirmButtons").innerHTML =
    '<input type="submit" value="' +
    okLabel +
    '" class="activeBtn submit_btn action_btn" onClick="' +
    okFunction +
    '" id="del_submit"/>' +
    '<button type="button" class="cancel_btn" data-dismiss="modal">' +
    cancelLabel +
    "</button>";
}

function myAlert(title, msg, type) {
  $("#mymsg_modal").modal("show");
  document.getElementById("mymsgtitle").innerHTML = title;
  var alertSubClass = " alert-success";
  if (type.valueOf() == "error".valueOf()) alertSubClass = " alert-danger";
  else if (type.valueOf() == "warning".valueOf())
    alertSubClass = " alert-warning";
  document.getElementById("mymsgbody").innerHTML =
    '<div class="alert' + alertSubClass + '">' + msg + "</div>";
}

function toggleProgNotes(obj) {
  obj
    .closest(".progress_note_wrp")
    .find(".pronote_dropdown_wrp")
    .toggleClass("d-block");

  if (
    obj
      .closest(".progress_note_wrp")
      .find(".pronote_dropdown_wrp")
      .hasClass("d-block")
  ) {
    obj.html(
      'Hide progress notes <i class="fa fa-angle-up" aria-hidden="true"></i>'
    );
  } else {
    obj.html(
      'Show progress notes <i class="fa fa-angle-down" aria-hidden="true"></i>'
    );
    obj
      .closest(".progress_note_wrp")
      .find(".pronote_dropdown_wrp")
      .removeClass("d-block");
  }
}

function toggleValueRealsied(obj) {
  obj
    .closest(".value_realised_wrap")
    .find(".value_realised_dropdown_wrp")
    .toggleClass("d-block");

  if (
    obj
      .closest(".value_realised_wrap")
      .find(".value_realised_dropdown_wrp")
      .hasClass("d-block")
  ) {
    obj.html(
      'Hide Value Realised <i class="fa fa-angle-up" aria-hidden="true"></i>'
    );
  } else {
    obj.html(
      'Show Value Realized <i class="fa fa-angle-down" aria-hidden="true"></i>'
    );
    obj
      .closest(".value_realised_wrap")
      .find(".value_realised_dropdown_wrp")
      .removeClass("d-block");
  }
}
function addEDProgressNote(SSn, position, ssObject) {
  if (ssObject.sscomplete == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been Completed.Please Reopen Strategy Statement before modifying the action item",
      "error"
    );
  } else if (ssObject.ssunimplement == 1) {
    myAlert(
      "Attention",
      "Strategy Statement has been Unselected for Implementation.Please select Strategy Statement for Implementation before modifying action item",
      "error"
    );
  } else {
    var ae = findActionEntryInSS(GcurrentSS, position);
    editingAction = ae[0];

    let progressVerify = 0;
    let lastUpdatedVerify = "TBD";
    for (var pro = 0; pro < ae[7].length; pro++) {
      progressVerify += parseInt(ae[7][pro][1]);
      lastUpdatedVerify = ae[7][pro][4];
    }
    if (lastUpdatedVerify !== "TBD") {
      lastUpdatedVerify = getPrintDate(lastUpdatedVerify);
    }
    document.getElementById("actionLabel").innerHTML =
      "" + (SSn + 1) + "." + (position + 1);
    document.getElementById("actionDesc").innerHTML = ae[1];
    document.getElementById("actionDeadline").innerHTML = getPrintDate(ae[2]);
    document.getElementById("actionLastDate").innerHTML = lastUpdatedVerify;
    document.getElementById("actionProgress").innerHTML = progressVerify;
    document.getElementById("input_update").value = "";
    deactivateButton("progressnote_submit");
    var names = getFirstLastFromId(ae[3]);
    document.getElementById("actionPerf").innerHTML = names[2];
    setDateById("date-picker_progress", "");
    document.getElementById("input_progress").value = "";
    $(".ss-action").each(function() {
      $(this).prop("checked", false);
    });
    $("#setProgress").prop("checked", true);
    $(".progress-div").show();
    $("#progressnote_modal").modal("show");
  }
}

function addEDValueRealized(ss) {
  $("#update_val_modal").modal("show");
  let today = new Date();
  setupUpdateVal(ss);
  $("#notesNPV").val("");
  $("#verifyRisksType").val("");
  $("#value_realized").val("");
  $("#savingsId").val("");
  $("#vDate-Picker").val(datePickerFormatter(today));
}

function datePickerFormatter(date) {
  let today = "";
  let month = date.getMonth() + 1;
  today += month + "/";
  today += date.getDate() + "/";
  today += date.getFullYear();
  return today;
}

/**
 * add an action progress for a strategy statement in V step
 */
function saveNewProgressNote() {
  var comment = document.getElementById("input_update").value;
  var progress = document.getElementById("input_progress").value;
  var date = getDateById("date-picker_progress");
  var completed = document.getElementById("setCompleted").checked;
  var dropped = document.getElementById("setDropped").checked;
  var updateProgress = document.getElementById("setProgress").checked;
  if (comment === "") {
    $(".error").show();
    $("#input_update_error").html(
      "Please leave a comment to update the progress"
    );
    return;
  }
  if (completed) {
    showTimedMessage("gmsg", "Updating action ...", 0, false);
    $.ajax({
      url:
        "set-action-complete.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        GcurrentSS +
        "&action=" +
        editingAction +
        "&comment=" +
        encodeURIComponent(comment) +
        "&completed=" +
        encodeURIComponent(completed) +
        "&dropped=" +
        encodeURIComponent(dropped) +
        "&date=" +
        date,

      type: "POST",
      success: updateEDProgress,
      error: progOpFailed
      //,datatype: "json"
    });
    document.getElementById("input_update").value = "";
    document.getElementById("input_progress").value = "";
    document.getElementById("setCompleted").checked = false;
    $("#progressnote_modal").modal("hide");
    return false;
  }

  if (dropped) {
    showTimedMessage("gmsg", "Updating action ...", 0, false);
    $.ajax({
      url:
        "set-action-complete.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        GcurrentSS +
        "&action=" +
        editingAction +
        "&comment=" +
        encodeURIComponent(comment) +
        "&completed=" +
        encodeURIComponent(completed) +
        "&dropped=" +
        encodeURIComponent(dropped) +
        "&date=" +
        date,

      type: "POST",
      success: updateEDProgress,
      error: progOpFailed
      //,datatype: "json"
    });
    document.getElementById("input_update").value = "";
    document.getElementById("input_progress").value = "";
    document.getElementById("setCompleted").checked = false;
    $("#progressnote_modal").modal("hide");
    return false;
  }

  if (progress === "") {
    $(".error").show();
    $("#input_progress_error").html("Please enter progress percentage");
    return false;
  }

  showTimedMessage("gmsg", "Updating action ...", 0, false);
  $.ajax({
    url:
      "add-action-progress.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&action=" +
      editingAction +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      GcurrentSS +
      "&date=" +
      encodeURIComponent(date) +
      "&comment=" +
      encodeURIComponent(comment) +
      "&percent=" +
      encodeURIComponent(progress),
    type: "POST",
    success: updateEDProgress,
    error: progOpFailed
    //,datatype: "json"
  });
  $("#progressnote_modal").modal("hide");
}

function actionCompleteAddProgress(response) {
  var comment = document.getElementById("input_update").value;
  var date = getDateById("date-picker_progress");
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Adding percentage complete to action...",
      0,
      false
    );
    $.ajax({
      url:
        "add-action-progress.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&action=" +
        editingAction +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        GcurrentSS +
        "&date=" +
        encodeURIComponent(date) +
        "&comment=" +
        encodeURIComponent(comment) +
        "&percent=" +
        encodeURIComponent(100),
      type: "POST",
      success: updateEDProgress,
      error: progOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 1, true);
  }
}

function toggleStrategicOptions(obj) {
  obj
    .closest(".strategic_opt_wrp")
    .find(".strategic_opt_list")
    .toggleClass("d-block");
  if (
    obj
      .closest(".strategic_opt_wrp")
      .find(".strategic_opt_list")
      .hasClass("d-block")
  ) {
    obj.html(
      'Hide selected strategic options <i class="fa fa-angle-up" aria-hidden="true"></i>'
    );
  } else {
    obj.html(
      'Show selected strategic options <i class="fa fa-angle-down" aria-hidden="true"></i>'
    );
    obj
      .closest(".strategic_opt_wrp")
      .find(".strategic_opt_list")
      .removeClass("d-block");
  }
}
/**
 * HTML for strategic option checkboxes while adding/editing a strategy statement in R step
 * @param {number} currSS - current strategy statement
 * @param {number} divid - id of the div where the checboxes has to be added
 */
function initStrategicOptions(currSS, divid) {
  body = "";
  allCBIDs = [];
  if (Gcurrentdata[Gcdindex] != null) {
    for (var m = 0; m < Gcurrentdata[Gcdindex].length; m++) {
      var centry = Gcurrentdata[Gcdindex][m];
      if (centry == null) continue;
      var costElement = centry[0];
      if (centry[2] == null) continue;
      for (var b = 0; b < Gcurrentdata[Gcdindex][m][2].length; b++) {
        var cdentry = Gcurrentdata[Gcdindex][m][2][b];
        if (cdentry != null) {
          var driver = cdentry[0];
          var cdname = cdentry[1];
          // may need to check if this is a kcd...
          if (cdentry[5] != null) {
            // strategic options
            for (var xx = 0; xx < cdentry[5].length; xx++) {
              var so = cdentry[5][xx][0];
              var sotext = cdentry[5][xx][1];
              var sosel = cdentry[5][xx][2]; // carried forward to SS
              if ((sosel + "").valueOf() != "1".valueOf()) continue; // not carried forward
              var selectedp = 0;
              if (currSS > -1) {
                var oentry = findSSEntry(currSS);
                if (oentry == null) continue;
                if (oentry[7] != null) {
                  // check if this so is selected
                  for (var yy = 0; yy < oentry[7].length; yy++) {
                    if (so == oentry[7][yy]) {
                      selectedp = 1;
                    }
                  }
                }
              }
              if (selectedp == 1) {
                var checked = " checked";
                var cbid = "stratop-" + costElement + "-" + driver + "-" + so;
                allCBIDs.push(cbid);
                body =
                  body +
                  '<p class="checkbox_wrp">' +
                  '<input type="checkbox" name="' +
                  cbid +
                  '" id="' +
                  cbid +
                  '" class="css-checkbox" ' +
                  checked +
                  'value="' +
                  costElement +
                  "-" +
                  driver +
                  "-" +
                  so +
                  '"' +
                  ">" +
                  '<label for="' +
                  cbid +
                  '" class="css-label">' +
                  sotext +
                  "</label>" +
                  "</p>";
              }
            }
          }
        }
      }
    }
    for (var m = 0; m < Gcurrentdata[Gcdindex].length; m++) {
      var centry = Gcurrentdata[Gcdindex][m];
      if (centry == null) continue;
      var costElement = centry[0];
      if (centry[2] == null) continue;
      for (var b = 0; b < Gcurrentdata[Gcdindex][m][2].length; b++) {
        var cdentry = Gcurrentdata[Gcdindex][m][2][b];
        if (cdentry != null) {
          var driver = cdentry[0];
          var cdname = cdentry[1];
          // may need to check if this is a kcd...
          if (cdentry[5] != null) {
            // strategic options
            for (var xx = 0; xx < cdentry[5].length; xx++) {
              var so = cdentry[5][xx][0];
              var sotext = cdentry[5][xx][1];
              var sosel = cdentry[5][xx][2]; // carried forward to SS
              if ((sosel + "").valueOf() != "1".valueOf()) continue; // not carried forward
              var selectedp = 0;
              if (currSS > -1) {
                var oentry = findSSEntry(currSS);
                if (oentry == null) continue;
                if (oentry[7] != null) {
                  // check if this so is selected
                  for (var yy = 0; yy < oentry[7].length; yy++) {
                    //alert("so xx" + cdentry[5][xx] + "\n so yy:" + oentry[7][yy]);
                    if (so == oentry[7][yy]) {
                      selectedp = 1;
                    }
                  }
                }
              }
              if (selectedp == 0) {
                var checked = " ";
                var cbid = divid + "-" + costElement + "-" + driver + "-" + so;
                allCBIDs.push(cbid);
                body =
                  body +
                  '<p class="checkbox_wrp">' +
                  '<input type="checkbox" name="' +
                  cbid +
                  '" id="' +
                  cbid +
                  '" class="css-checkbox" ' +
                  checked +
                  'value="' +
                  costElement +
                  "-" +
                  driver +
                  "-" +
                  so +
                  '"' +
                  ">" +
                  '<label for="' +
                  cbid +
                  '" class="css-label">' +
                  sotext +
                  "</label>" +
                  "</p>";
              }
            }
          }
        }
      }
    }
  }
  document.getElementById(divid).innerHTML = body;
}

function initStrategicOptionsOld(currSS, divid) {
  body = "";
  allCBIDs = [];
  if (Gcurrentdata[Gcdindex] != null) {
    for (var m = 0; m < Gcurrentdata[Gcdindex].length; m++) {
      var centry = Gcurrentdata[Gcdindex][m];
      if (centry == null) continue;
      var costElement = centry[0];
      if (centry[2] == null) continue;
      for (var b = 0; b < Gcurrentdata[Gcdindex][m][2].length; b++) {
        var cdentry = Gcurrentdata[Gcdindex][m][2][b];
        if (cdentry != null) {
          var driver = cdentry[0];
          var cdname = cdentry[1];
          // may need to check if this is a kcd...
          if (cdentry[5] != null) {
            // strategic options
            for (var xx = 0; xx < cdentry[5].length; xx++) {
              var so = cdentry[5][xx][0];
              var sotext = cdentry[5][xx][1];
              var sosel = cdentry[5][xx][2]; // carried forward to SS
              if ((sosel + "").valueOf() != "1".valueOf()) continue; // not carried forward
              var selectedp = 0;
              if (currSS > -1) {
                var oentry = findSSEntry(currSS);
                if (oentry == null) continue;
                if (oentry[7] != null) {
                  // check if this so is selected
                  for (var yy = 0; yy < oentry[7].length; yy++) {
                    //alert("so xx" + cdentry[5][xx] + "\n so yy:" + oentry[7][yy]);
                    if (so == oentry[7][yy]) {
                      selectedp = 1;
                    }
                  }
                }
              }
              var checked = "";
              if (selectedp == 1) checked = " checked";
              var cbid = "stratop-" + costElement + "-" + driver + "-" + so;
              allCBIDs.push(cbid);
              body =
                body +
                '<p class="checkbox_wrp">' +
                '<input type="checkbox" name="' +
                cbid +
                '" id="' +
                cbid +
                '" class="css-checkbox" ' +
                checked +
                ' value="' +
                costElement +
                "-" +
                driver +
                "-" +
                so +
                '"' +
                ">" +
                '<label for="' +
                cbid +
                '" class="css-label">' +
                sotext +
                "</label>" +
                "</p>";
            }
          }
        }
      }
    }
  }
  document.getElementById(divid).innerHTML = body;
}

function findSSEntry(ss) {
  var entry = [];
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry[0] == ss) return oentry;
  }
  return entry;
}

function getSummaryPerformanceForStrat(ss, currentData) {
  var net = 0,
    costSavings = 0,
    revenueIncrease = 0,
    costIncrease = 0,
    revenueDecrease = 0;
  var riskVal = 0;
  var totalBenefits = 0;
  var totalRisks = 0;
  for (var i = 0; i < currentData.length; i++) {
    var oentry = currentData[i];
    if (oentry[0] == ss) {
      var risks = oentry[4];
      var benefits = oentry[5];

      if (benefits != null) {
        for (var k = 0; k < benefits.length; k++) {
          var rbtype = benefits[k][2];
          var val = benefits[k][1];
          // alert( "btype = " + rbtype + " value= " + val);
          if (typeof val == "string") val = parseFloat(val);
          totalBenefits += val;
          if (rbtype.search("Cost Improvement"))
            costSavings = costSavings + val;
          else revenueIncrease = revenueIncrease + val;
        }
      }
      data = {
        costSavings: costSavings,
        revenueIncrease: revenueIncrease,
        riskVal: riskVal,
        costIncrease: costIncrease,
        revenueDecrease: revenueDecrease,
        totalBenefits: totalBenefits,
        totalRisks: totalRisks,
        totalIdentifiedValue: totalBenefits - totalRisks
      };
      return [
        costSavings,
        revenueIncrease,
        riskVal,
        costIncrease,
        revenueDecrease,
        data
      ];
    }
  }
  return [costSavings, revenueIncrease, riskVal, costIncrease, revenueDecrease];
}
/**
 * get benefits and risks of a strategy statement
 * @param {array} oentry - strategy statement array
 */
function getSummaryPerformanceAlt(oentry) {
  var net = 0,
    costSavings = 0,
    revenueIncrease = 0,
    costIncrease = 0,
    revenueDecrease = 0,
    totalBenefits = 0,
    totalRisks = 0;
  var riskVal = 0;
  var benefitVal = 0;
  var risks = oentry[4];
  var benefits = oentry[5];

  if (benefits != null) {
    for (var k = 0; k < benefits.length; k++) {
      var rbtype = benefits[k][2];
      var val = benefits[k][1];
      if (typeof val == "string") val = parseFloat(val);
      totalBenefits += val;
      if (rbtype === "Cost Improvement" || rbtype === "") {
        costSavings = costSavings + val;
      } else {
        //
        revenueIncrease = revenueIncrease + val;
      }
      benefitVal = benefitVal + val;
    }
  }
  if (risks != null) {
    for (var k = 0; k < risks.length; k++) {
      var rbtype = risks[k][2];
      var val = risks[k][1];
      // alert( "rtype = " + rbtype + " value= " + val);
      if (typeof val == "string") val = parseFloat(val);
      totalRisks += val;
      if (rbtype.search("Revenue Decrease"))
        revenueDecrease = revenueDecrease + val;
      else costIncrease = costIncrease + val;
      riskVal = riskVal + val;
    }
  }
  var data = {
    costImprovement: costSavings,
    revenueImprovement: revenueIncrease,
    riskVal: riskVal,
    costIncrease: costIncrease,
    revenueDecrease: revenueDecrease,
    benefitVal: benefitVal,
    totalBenefits: totalBenefits,
    totalRisks: totalRisks,
    totalIdentifiedValue: totalBenefits - totalRisks
  };
  return [
    costSavings,
    revenueIncrease,
    riskVal,
    costIncrease,
    revenueDecrease,
    data
  ];
}

function getCompletePerformance() {
  var net = 0,
    costSavings = 0,
    revenueIncrease = 0;
  var riskVal = 0;
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    var risks = oentry[4];
    var benefits = oentry[5];

    if (benefits != null) {
      for (var k = 0; k < benefits.length; k++) {
        var rbtype = benefits[k][2];
        var val = benefits[k][1];
        // alert( "btype = " + rbtype + " value= " + val);
        if (typeof val == "string") val = parseFloat(val);
        if (rbtype.search("Cost Improvement")) costSavings = costSavings + val;
        else revenueIncrease + revenueIncrease + val;
      }
    }

    if (risks != null) {
      for (var k = 0; k < risks.length; k++) {
        var rbtype = risks[k][2];
        var val = risks[k][1];
        // alert( "rtype = " + rbtype + " value= " + val);
        if (typeof val == "string") val = parseFloat(val);
        riskVal = riskVal + val;
      }
    }
  }
  return [costSavings, revenueIncrease, riskVal];
}

var editingSS = -1;

function addEDSS() {
  editingSS = -1;
  document.getElementById("add_strategy_no").value = "";
  // document.getElementById("priority_txt").value= "";
  activateButton("Strategy_submit");
  document.getElementById("add_priority_txt").value = "";
  document.getElementById("add_strategy_statmnt").value = "";
  initStrategicOptions(-1, "add_allStrategicOptions");
  $(".strategy_modaltitle").text("Add Strategy Statement");

  $(".opt_btn_wrp").hide();
}

var SSUpdateFrom = 1;

function editEDSS(page) {
  SSUpdateFrom = page;
  editingSS = GcurrentSS;
  var oentry = findSSEntry(GcurrentSS);
  activateButton("Strategy_submit");
  document.getElementById("add_strategy_no").value = oentry[12];
  document.getElementById("add_priority_txt").value = oentry[3];
  document.getElementById("add_strategy_statmnt").value = oentry[1];
  initStrategicOptionsOld(GcurrentSS, "add_allStrategicOptions");
  $("#strategy_modaltitle").text("Edit Strategy");
  $("#strategy_modal").modal("show");
}

function deleteEDSS(ss, selected) {
  if (selected === "SELECTED") {
    myAlert(
      "Attention",
      "Strategy statement is selected for implementation and cannot be deleted!",
      "error"
    );
  } else {
    $.ajax({
      url:
        "delete-ss.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ss +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy),
      type: "POST",
      success: function(response) {
        updateEDSSWithResult(response);
      },
      error: ssEDOpFailed
    });
  }

  // alert("requesting delete of SS: " + GcurrentSS);
}

function deleteEDSSIm(ssObject) {
  $("#drop_modal").modal("hide");
  var that = this;

  var drop_reason = document.getElementById("drop_reason").value;
  var ssid = document.getElementById("drop_ssid").value;
  var ssData = {
    token: Gtoken,
    username: Gusername,
    currentSS: GcurrentSS,
    drop_reason: drop_reason
  };
  $.ajax({
    url: "dropss.php",
    type: "POST",
    data: {
      data: JSON.stringify(ssData)
    },
    success: apUpdated,
    error: progOpFailed
  });

  $(".opt_btn_wrp").hide();
}

var SSUpdateFrom = 1;
/**
 * called when edit strategy statement is clicked in I stage
 * @param {number} page - step identifier
 * @param {number} ssid - strategy statement id
 * @param {object} ssObject - strategy statement object
 */
function editEDSSS(page, ssid, ssObject) {
  if (ssObject.sscomplete == 1) {
    myAlert(
      "Attention",
      "Unable to edit Strategy Statement as it has been marked as Complete in the Verify Stage. Please Reopen Strategy Statement before editing",
      "error"
    );
  } else {
    SSUpdateFrom = page;
    var teamsters = getTeamParticipants(Gcurrentstrategy);

    let body = "";
    for (var i = 0; i < teamsters.length; i++) {
      body +=
        '<option value="' +
        teamsters[i][0] +
        '">' +
        getPersonName(teamsters[i][0]) +
        "</option>";
    }
    $("#multiselect_owners").html(body);

    editingSS = ssid;
    var oentry = findSSEntry(ssid);
    let input_startdate = oentry[17] !== null ? oentry[17].split(" ")[0] : "";
    $("#input_startdate").datepicker("setDate", new Date());
    $("#input_enddate").datepicker("setDate", new Date());
    // document.getElementById("input_taskdate").value = "";
    activateButton("Strategy_submit");
    document.getElementById("strategy_no").value = oentry[12];
    document.getElementById("priority_txt").value = oentry[3];
    document.getElementById("strategy_statmnt").value = oentry[1];
    document.getElementById("input_startdate").value = input_startdate;
    document.getElementById("input_enddate").value =
      oentry[18] !== null ? oentry[18].split(" ")[0] : "";
    document.getElementById("multiselect_owners").value = oentry[19];
    $("#edit_strategy_modal").modal("show");
    $(".opt_btn_wrp").css("visibility", "hidden");
  }
  $(".opt_btn_wrp").hide();
}

function undropss(ssObject) {
  //
  $(".opt_btn_wrp").hide();
  $("#undrop_ssid").val(ssObject.ssid);
  $("#undrop_modal").modal("show");
  document.getElementById("undrop_reason").value = "";
  $(".opt_btn_wrp").css("visibility", "hidden");
}

function deleteEDSSI(ssObject) {
  $(".opt_btn_wrp").hide();
  if (ssObject.sscomplete == 1) {
    myAlert(
      "Attention",
      "Unable to drop Strategy Statement as it has been marked as Complete in the Verify Stage. Please Reopen Strategy Statement before Dropping",
      "error"
    );
  } else {
    $(".opt_btn_wrp").hide();
    $("#drop_ssid").val(ssObject.ssid);
    $("#drop_modal").modal("show");
    document.getElementById("drop_reason").value = "";
    $(".opt_btn_wrp").css("visibility", "hidden");
  }
}

function deleteEDSSS(ssObject) {
  document.getElementById("unimplement_reason").value = "";
  //
  $(".opt_btn_wrp").hide();
  $("#unselect_modal").modal("show");
  $(".opt_btn_wrp").hide();

  // alert("requesting delete of SS: " + GcurrentSS);
}

function reopenSS(ssObject) {
  document.getElementById("reopen_reason").value = "";
  //
  $(".opt_btn_wrp").hide();
  $("#reopen_modal").modal("show");
  $(".opt_btn_wrp").hide();

  // alert("requesting delete of SS: " + GcurrentSS);
}

function setupSOs(ss) {
  editingSS = ss;
  var oentry = findSSEntry(ss);
  var priority = oentry[3];
  var pclass = " low_priority";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = " medium_priority";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  $(".somtitle").text("Edit Strategic Options");
  if (sshandle.length > 8)
    fixedhandle =
      '<span title="' + sshandle + '">' + sshandle.substring(0, 8) + "</span>";

  document.getElementById("ssHeaderSO").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class="Priority_type ' +
    pclass +
    '">' +
    priority +
    "</span>";
  activateButton("strategyopt_submit");

  document.getElementById("ssStatSO").innerHTML = oentry[1];
  initStrategicOptions(editingSS, "optAllStrategicOptions");
}

var allCBIDs = [];
/**
 * Adding a new strategy statement
 */
function saveEDSS() {
  var handle = document.getElementById("add_strategy_no").value;
  var desc = document.getElementById("add_strategy_statmnt").value;
  var priority = document.getElementById("add_priority_txt").value;
  var favorite = [];
  var checkbox_checked_value;
  $.each($("#add_allStrategicOptions .css-checkbox:checked"), function() {
    checkbox_checked_value = $(this).val();

    favorite.push(checkbox_checked_value);
  });

  ss_strategic_options = favorite.join(",");

  if (desc == null || desc.valueOf() == "".valueOf()) {
    myAlert(
      "Attention",
      "Strategy statement description missing!  Please provide.",
      "error"
    );
    return;
  }
  if (handle.length > GmaxShortStrategyDesc) {
    myAlert(
      "Attention",
      "Short strategy statement description exceeds " +
        GmaxShortStrategyDesc +
        " characters!  Please shorten.",
      "warning"
    );
    return;
  }
  if (priority.length < 1) {
    myAlert("Attention", "Priority is mandatory! ", "warning");
    return;
  }
  $("#strategy_modal").modal("hide");
  $(".opt_btn_wrp").hide();

  storeSSPageState();
  if (editingSS == -1) {
    showTimedMessage("gmsg", "Adding strategy statement...", 0, false);
    $.ajax({
      url:
        "add-ss.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ssname=" +
        encodeURIComponent(desc) +
        "&handle=" +
        encodeURIComponent(handle) +
        "&ss_strategic_options=" +
        encodeURIComponent(ss_strategic_options) +
        "&priority=" +
        encodeURIComponent(priority),
      type: "POST",
      success: function(response) {
        $("#strategy_modal").modal("hide");

        updateEDSSWithResult(response);
      },
      error: ssEDOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage("gmsg", "Saving strategy statement...", 0, false);
    $.ajax({
      url:
        "save-ss-r.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        editingSS +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&desc=" +
        encodeURIComponent(desc) +
        "&handle=" +
        encodeURIComponent(handle) +
        "&ss_strategic_options=" +
        encodeURIComponent(ss_strategic_options) +
        "&priority=" +
        encodeURIComponent(priority),

      type: "POST",
      success: function(response) {
        $("#strategy_modal").modal("hide");

        updateEDSSWithResult(response);
      },
      error: ssEDOpFailed
      //,datatype: "json"
    });
  }
}
/**
 * Edit/Add Strategy statement in I step
 */
function saveEDSSI() {
  var handle = document.getElementById("strategy_no").value;
  var desc = document.getElementById("strategy_statmnt").value;
  var priority = document.getElementById("priority_txt").value;
  var startdate = document.getElementById("input_startdate").value;
  var enddate = document.getElementById("input_enddate").value;
  var ssowner = document.getElementById("multiselect_owners").value;
  if (desc == null || desc.valueOf() == "".valueOf()) {
    myAlert(
      "Attention",
      "Strategy statement description missing!  Please provide.",
      "error"
    );
    return;
  }
  if (handle.length > GmaxShortStrategyDesc) {
    myAlert(
      "Attention",
      "Short strategy statement description exceeds " +
        GmaxShortStrategyDesc +
        " characters!  Please shorten.",
      "warning"
    );
    return;
  }
  $("#strategy_modal").modal("hide");
  $(".opt_btn_wrp").hide();

  storeSSPageState();
  showTimedMessage("gmsg", "Editing strategy statement...", 0, false);
  $.ajax({
    url:
      "save-ss.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      editingSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&desc=" +
      encodeURIComponent(desc) +
      "&handle=" +
      encodeURIComponent(handle) +
      "&priority=" +
      encodeURIComponent(priority) +
      "&startdate=" +
      encodeURIComponent(startdate) +
      "&enddate=" +
      encodeURIComponent(enddate) +
      "&ssowner=" +
      encodeURIComponent(ssowner),

    type: "POST",
    success: function(response) {
      $("#edit_strategy_modal").modal("hide");
      clearDisplayArea("");
      updateEDSSWithResult(response);
    },
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function saveUnDropReason() {
  //
  $("#undrop_modal").modal("hide");
  // GcurrentSS = ssObject.ssid;
  var ssundrop_rsn = document.getElementById("undrop_reason").value;
  var ssid = document.getElementById("undrop_ssid").value;
  var ssData = {
    token: Gtoken,
    username: Gusername,
    currentSS: GcurrentSS,
    ssundrop_rsn: ssundrop_rsn
  };
  $.ajax({
    url: "undropss.php",
    type: "POST",
    data: {
      data: JSON.stringify(ssData)
    },
    success: apUpdated,
    error: progOpFailed
  });
}

function saveUnSelectReason() {
  $(".opt_btn_wrp").hide();
  $("#unselect_modal").modal("hide");
  var unimplement_reason = document.getElementById("unimplement_reason").value;
  var ssid = document.getElementById("unselect_ssid").value;
  var ssData = {
    token: Gtoken,
    username: Gusername,
    currentSS: GcurrentSS,
    unimplement_rsn: unimplement_reason
  };
  $.ajax({
    url: "unimplement.php",
    type: "POST",
    data: {
      data: JSON.stringify(ssData)
    },
    success: updateVerifyContents,
    error: progOpFailed
  });
}

function reopenSSV(ssObject) {
  $(".opt_btn_wrp").hide();
  $("#reopen_modal").modal("hide");
  var ssData = {
    token: Gtoken,
    username: Gusername,
    currentSS: GcurrentSS
    // currentSS: ssObject.ssid,
  };
  $.ajax({
    url: "reopen.php",
    type: "POST",
    data: {
      data: JSON.stringify(ssData)
    },
    success: updateVerifyContents,
    error: progOpFailed
  });
  //
  $(".opt_btn_wrp").css("visibility", "hidden");
}

function reselectSS(ssObject) {
  var ssData = {
    token: Gtoken,
    username: Gusername,
    currentSS: ssObject.ssid
  };
  $.ajax({
    url: "reselect.php",
    type: "POST",
    data: {
      data: JSON.stringify(ssData)
    },
    success: updateVerifyContents,
    error: progOpFailed
  });
  //
  $(".opt_btn_wrp").css("visibility", "hidden");
}

function saveRemainingSS(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    var ssid = parseInt(results[1]);
    editingSS = ssid;
    var handle = document.getElementById("strategy_no").value;
    var desc = document.getElementById("strategy_statmnt").value;
    var priority = document.getElementById("priority_txt").value;
    showTimedMessage("gmsg", "Adding strategy statement...", 0, false);
    $.ajax({
      url:
        "save-ss.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        ssid +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&handle=" +
        encodeURIComponent(handle) +
        "&priority=" +
        encodeURIComponent(priority),
      type: "POST",
      success: saveEDSSSOs,
      error: ssEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function saveEDSSSOs(response) {
  var results = JSON.parse(response);
  if (results[0].valueOf() == "".valueOf()) {
    updateSOList();
  } else {
    if (invalidTokenP(results[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", results[1], 0, true);
  }
}

function updateSOList() {
  $("#add_statopt_modal").modal("hide");

  var checkedBoxes = [];
  var allBoxes = [];
  for (var i = 0; i < allCBIDs.length; i++) {
    var ids = allCBIDs[i].split("-");
    var ce = ids[1];
    var cd = ids[2];
    var so = ids[3];
    allBoxes.push([ce, cd, so]);
    if (document.getElementById(allCBIDs[i]).checked) {
      checkedBoxes.push([ce, cd, so]);
    }
  }
  for (var i = 0; i < allBoxes.length; i++) {
    var ce = allBoxes[i][0];
    var cd = allBoxes[i][1];
    var so = allBoxes[i][2];
    setTimeout(setEDSSSO(ce, cd, so, "0"), 200);
  }

  for (var i = 0; i < checkedBoxes.length; i++) {
    var ce = checkedBoxes[i][0];
    var cd = checkedBoxes[i][1];
    var so = checkedBoxes[i][2];
    setTimeout(setEDSSSO(ce, cd, so, "1"), 200);
  }
  storeSSPageState();
  setTimeout(updateEDSS(), 1000);
}

function setEDSSSO(ce, cd, so, val) {
  $.ajax({
    url:
      "set-ss-option.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&ce=" +
      ce +
      "&driver=" +
      cd +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      encodeURIComponent(editingSS) +
      "&value=" +
      encodeURIComponent(val) +
      "&option=" +
      encodeURIComponent(so),
    type: "POST",
    success: showTimedMessage("gmsg", "Adjusting strategic options ", 0, false),
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function deleteEDSSSO(so, ss) {
  $.ajax({
    url:
      "delete-ss-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&ss=" +
      encodeURIComponent(ss) +
      "&so=" +
      encodeURIComponent(so),
    type: "POST",
    success: showTimedMessage("gmsg", "Adjusting strategic options ", 0, false),
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function ssEDOpFailed(response) {
  var results = JSON.parse(response);
  showTimedMessage("gmsg", results, 0, true);
}

function removeSSSO(so, ss) {
  $("#myconfirm_modal").modal("hide");
  editingSS = ss;
  showTimedMessage("gmsg", "Removing strategic option", 0, false);
  deleteEDSSSO(so, ss);
  setTimeout(updateEDSS, 1000);
}

function confirmRemoveSSSOAlt(so, ss) {
  myConfirm(
    "Confirm strategic option deletion!",
    "Please confirm that you want to delete this strategic option",
    "OK",
    "Cancel",
    "removeSSSO(" + so + ", " + ss + ")"
  );
}

function initRisk() {
  var oentry = findSSEntry(GcurrentSS);
  editingSS = GcurrentSS;
  editingRisk = "";
  var priority = oentry[3];
  var pclass = " low_priority";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = " medium_priority";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  if (sshandle.length > GmaxShortStrategyDesc)
    fixedhandle =
      '<span title="' +
      sshandle +
      '">' +
      sshandle.substring(0, GmaxShortStrategyDesc) +
      "</span>";
  // if (sshandle.length > 8) fixedhandle = '<span title="' + sshandle + '">' + sshandle.substring(0, 8) + '</span>';

  deactivateButton("risk_submit");
  document.getElementById("ssHeaderRisk").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class="Priority_type risk_priority_type rsk_type ' +
    pclass +
    '">' +
    priority +
    "</span>";
  document.getElementById("ssStatRisk").innerHTML = oentry[1];
  document.getElementById("risktext").value = "";
  document.getElementById("riskvalue").value = "";
  document.getElementById("risksType").value = "";
  $(".risktitle").text("Add Risk");
}

function initBenefit() {
  var oentry = findSSEntry(GcurrentSS);

  editingSS = GcurrentSS;
  editingBenefit = "";
  var priority = oentry[3];
  var pclass = "btn btn-default btn-sm";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = "btn btn-success btn-sm";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = "btn btn-info btn-sm";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  if (sshandle.length > GmaxShortStrategyDesc)
    fixedhandle =
      '<span title="' +
      sshandle +
      '">' +
      sshandle.substring(0, GmaxShortStrategyDesc) +
      "</span>";
  // if (sshandle.length > 8) fixedhandle = '<span title="' + sshandle + '">' + sshandle.substring(0, 8) + '</span>';

  document.getElementById("ssHeaderBen").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class= "' +
    pclass +
    '">' +
    priority +
    "</span>";
  pclass = " medium_priority";

  deactivateButton("benefit_submit");
  document.getElementById("ssStatBen").innerHTML = oentry[1];
  document.getElementById("benefittext").value = "";
  document.getElementById("benefitvalue").value = "";
  document.getElementById("benefitsType").value = "";
  $(".bentitle").text("Add Benefit");
}

var editingBenefit = "",
  editingRisk = "";

function editEDBenefit(i) {
  $("#benefit_modal").modal("show");
  $(".opt_btn_wrp").hide();
  $(".bentitle").text("Edit Benefit");
  var oentry = findSSEntry(GcurrentSS);
  if (oentry == null || oentry.length == 0) return;
  var priority = oentry[3];
  var pclass = " low_priority";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = " medium_priority";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  if (sshandle.length > GmaxShortStrategyDesc)
    fixedhandle =
      '<span title="' +
      sshandle +
      '">' +
      sshandle.substring(0, GmaxShortStrategyDesc) +
      "</span>";
  // if (sshandle.length > 8) fixedhandle = '<span title="' + sshandle + '">' + sshandle.substring(0, 8) + '</span>';

  document.getElementById("ssHeaderBen").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class="Priority_type ' +
    pclass +
    '">' +
    priority +
    "</span>";

  benefits = oentry[5];
  var benefit = benefits[i];
  editingSS = GcurrentSS;
  editingBenefit = benefit[0];

  deactivateButton("benefit_submit");

  document.getElementById("ssStatBen").innerHTML = oentry[1];
  document.getElementById("benefittext").value = benefit[0];
  document.getElementById("benefitvalue").value = benefit[1];
  document.getElementById("benefitsType").value = benefit[2];
}
$("body").on("change", "#benefitsType", function() {
  let benefitsType = $(this).val();
  document.getElementById("benefitvalue").value = "";
  if (benefitsType === "Qualitative Improvement") {
    document.getElementById("benefitvalue").value = 0;
  }
});

function editEDRisk(i) {
  $("#risk_modal").modal("show");
  $(".opt_btn_wrp").hide();
  $(".risktitle").text("Edit Risk");

  var oentry = findSSEntry(GcurrentSS);
  if (oentry == null || oentry.length == 0) return;
  var priority = oentry[3];
  var pclass = " low_priority";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = " medium_priority";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  if (sshandle.length > GmaxShortStrategyDesc)
    fixedhandle =
      '<span title="' +
      sshandle +
      '">' +
      sshandle.substring(0, GmaxShortStrategyDesc) +
      "</span>";

  document.getElementById("ssHeaderRisk").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class="Priority_type ' +
    pclass +
    '">' +
    priority +
    "</span>";

  risks = oentry[4];
  var risk = risks[i];
  editingSS = GcurrentSS;
  editingRisk = risk[0];

  deactivateButton("risk_submit");
  document.getElementById("ssStatRisk").innerHTML = oentry[1];
  document.getElementById("risktext").value = risk[0];
  document.getElementById("riskvalue").value = risk[1];
  document.getElementById("risksType").value = risk[2];
}
$("body").on("change", "#risksType", function() {
  let riskType = $(this).val();
  document.getElementById("riskvalue").value = "";
  if (riskType === "Qualitative Risk") {
    document.getElementById("riskvalue").value = 0;
  }
});

function saveEDBenefit() {
  $("#benefit_modal").modal("hide");
  storeSSPageState();
  if (editingBenefit.valueOf() == "".valueOf()) {
    addEDBenefit();
  } else {
    var newbenefit = document.getElementById("benefittext").value;
    var btype = document.getElementById("benefitsType").value;
    if (validNumber("benefitvalue") == 0) {
      showTimedMessage("gmsg", "Value is not a valid number!", 0, true);
      return;
    }
    var ben = extractNumber(document.getElementById("benefitvalue").value);
    showTimedMessage("gmsg", "Saving strategy statement benefit...", 0, false);
    $.ajax({
      url:
        "save-benefit.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        GcurrentSS +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&benefit=" +
        encodeURIComponent(editingBenefit) +
        "&newbenefit=" +
        encodeURIComponent(newbenefit) +
        "&newval=" +
        encodeURIComponent(ben) +
        "&newtype=" +
        encodeURIComponent(btype),
      type: "POST",
      success: updateEDSSWithResult,
      error: ssOpFailed
      //,datatype: "json"
    });
  }
}

function saveEDRisk() {
  $("#risk_modal").modal("hide");
  storeSSPageState();
  $(".risktitle").text("Edit Risk");
  if (editingRisk.valueOf() == "".valueOf()) {
    addEDRisk();
  } else {
    var newrisk = document.getElementById("risktext").value;
    var rtype = document.getElementById("risksType").value;
    if (validNumber("riskvalue") == 0) {
      showTimedMessage("gmsg", "Value is not a valid number!", 0, true);
      return;
    }
    var riskval = extractNumber(document.getElementById("riskvalue").value);
    showTimedMessage("gmsg", "Saving strategy statement risk...", 0, false);
    $.ajax({
      url:
        "save-risk.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&ss=" +
        GcurrentSS +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&risk=" +
        encodeURIComponent(editingRisk) +
        "&newrisk=" +
        encodeURIComponent(newrisk) +
        "&newval=" +
        encodeURIComponent(riskval) +
        "&newtype=" +
        encodeURIComponent(rtype),
      type: "POST",
      success: updateEDSSWithResult,
      error: ssEDOpFailed
      //,datatype: "json"
    });
  }
}

function addEDRisk() {
  $("#risk_modal").modal("hide");
  var risk = document.getElementById("risktext").value;
  var rtype = document.getElementById("risksType").value;
  storeSSPageState();

  if (validNumber("riskvalue") == 0) {
    showTimedMessage("gmsg", "Risk is not a valid number!", 0, true);
    return;
  }
  var riskval = extractNumber(document.getElementById("riskvalue").value);
  showTimedMessage("gmsg", "Adding strategy statement risk...", 0, false);
  $.ajax({
    url:
      "add-risk.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      editingSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&risk=" +
      encodeURIComponent(risk) +
      "&value=" +
      encodeURIComponent(riskval) +
      "&type=" +
      encodeURIComponent(rtype),
    type: "POST",
    success: updateEDSSWithResult,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function addEDBenefit() {
  $("#benefit_modal").modal("hide");
  var benefit = document.getElementById("benefittext").value;
  var btype = document.getElementById("benefitsType").value;
  storeSSPageState();
  if (validNumber("benefitvalue") == 0) {
    showTimedMessage("gmsg", "Value is not a valid number!", 0, true);
    return;
  }
  var ben = extractNumber(document.getElementById("benefitvalue").value);

  showTimedMessage("gmsg", "Adding strategy statement benefit...", 0, false);
  $.ajax({
    url:
      "add-benefit.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      editingSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&benefit=" +
      encodeURIComponent(benefit) +
      "&value=" +
      encodeURIComponent(ben) +
      "&type=" +
      encodeURIComponent(btype),
    type: "POST",
    success: updateEDSSWithResult,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function deleteEDRisk(i) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  var oentry = findSSEntry(GcurrentSS);
  if (oentry == null || oentry.length == 0) return;
  risks = oentry[4];
  var risk = risks[i][0];
  storeSSPageState();

  showTimedMessage("gmsg", "Deleting strategy statement risk...", 0, false);
  $.ajax({
    url:
      "delete-risk.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      GcurrentSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&risk=" +
      encodeURIComponent(risk),
    type: "POST",
    success: updateEDSSWithResult,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function confirmDeleteEDRisk(i) {
  $(".opt_btn_wrp").hide();
  myConfirm(
    "Confirm risk deletion!",
    "Please confirm that you want to delete this risk",
    "OK",
    "Cancel",
    "deleteEDRisk(" + i + ")"
  );
}

function deleteEDBenefit(i) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  storeSSPageState();
  var oentry = findSSEntry(GcurrentSS);
  if (oentry == null || oentry.length == 0) return;
  benefits = oentry[5];
  var benefit = benefits[i][0];
  showTimedMessage("gmsg", "Deleting strategy statement benefit...", 0, false);
  $.ajax({
    url:
      "delete-benefit.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      GcurrentSS +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&benefit=" +
      encodeURIComponent(benefit),
    type: "POST",
    success: updateEDSSWithResult,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}

function confirmDeleteEDBenefit(i) {
  $(".opt_btn_wrp").hide();
  myConfirm(
    "Confirm benefit deletion!",
    "Please confirm that you want to delete this benefit",
    "OK",
    "Cancel",
    "deleteEDBenefit(" + i + ")"
  );
}

// initiatives
var editingInitiative = -1;

function addPastInitiative() {
  $(".opt_btn_wrp").hide();
  $(".init_modaltitle").text("Add Past Initiative");

  editingInitiative = -1;
  document.getElementById("pidesc").value = "";
  deactivateButton("init_submit");
  document.getElementById("piyear").value = "";
  document.getElementById("pisaving").value = "";
  document.getElementById("ongoingCB").checked = false;
}

function editPastInitiative(i) {
  $(".opt_btn_wrp").hide();
  $("#initiatives_modal").modal("show");
  $(".init_modaltitle").text("Edit Past Initiative");

  var initEntry = Gcurrentdata[Gpastinitindex][i];
  editingInitiative = initEntry[0];
  document.getElementById("pidesc").value = initEntry[1];
  deactivateButton("init_submit");
  document.getElementById("piyear").value = initEntry[2];
  document.getElementById("pisaving").value = initEntry[3];
  if (initEntry[5].valueOf() == "Ongoing".valueOf())
    document.getElementById("ongoingCB").checked = true;
  else document.getElementById("ongoingCB").checked = false;
}

function deletePastInitiative(i) {
  $(".opt_btn_wrp").hide();
  var initEntry = Gcurrentdata[Gpastinitindex][i];
  showTimedMessage("gmsg", "Delete session...", 0, false);
  $.ajax({
    url:
      "delete-project-past-initiative.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&initiative=" +
      initEntry[0],
    type: "POST",
    success: updateBackground,
    error: backOpFailed
    //,datatype: "json"
  });
}

function savePastInitiative() {
  var desc = document.getElementById("pidesc").value;
  var val = document.getElementById("pisaving").value;
  var year = document.getElementById("piyear").value;
  if (desc === "" || desc.size == 0) {
    $(".pidesc_error")
      .text("Description is required")
      .show();
    return false;
  }
  $(".opt_btn_wrp").hide();
  $("#initiatives_modal").modal("hide");
  var initval = extractNumber(document.getElementById("pisaving").value);

  var year = document.getElementById("piyear").value;
  var status = "Ongoing";
  if (!document.getElementById("ongoingCB").checked) status = "Completed";

  if (editingInitiative == -1) {
    showTimedMessage("gmsg", "Adding past initiative...", 0, false);
    $.ajax({
      url:
        "add-project-past-initiative.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&description=" +
        encodeURIComponent(desc) +
        "&startyear=" +
        encodeURIComponent(year) +
        "&status=" +
        encodeURIComponent(status) +
        "&identifiedval=" +
        encodeURIComponent(initval) +
        "&deliveredval=" +
        encodeURIComponent(0),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage("gmsg", "Saving past initiative...", 0, false);
    $.ajax({
      url:
        "save-project-past-initiative.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&initiative=" +
        editingInitiative +
        "&description=" +
        encodeURIComponent(desc) +
        "&startyear=" +
        encodeURIComponent(year) +
        "&status=" +
        encodeURIComponent(status) +
        "&identifiedval=" +
        encodeURIComponent(initval) +
        "&deliveredval=" +
        encodeURIComponent(0),
      type: "POST",
      success: updateBackground,
      error: backOpFailed
      //,datatype: "json"
    });
  }
}

function generateProfileIcon(username, pclass) {
  var names = getFirstLast(username);
  return (
    '<span title="' +
    names[0] +
    " " +
    names[1] +
    '" class="' +
    pclass +
    '">' +
    names[2] +
    "</span>"
  );
}

function generateProfileIconFromId(id, pclass) {
  if (id.valueOf() == "".valueOf()) return "";
  var names = getFirstLastFromId(id);
  return (
    '<span title="' +
    names[0] +
    " " +
    names[1] +
    '" class="' +
    pclass +
    '">' +
    names[2] +
    "</span>"
  );
}

function generateFullNameFromId(id, pclass) {
  if (id.valueOf() == "".valueOf()) return "";
  var names = getFirstLastFromId(id);
  return (
    '<span title="' +
    names[0] +
    " " +
    names[1] +
    '" class="' +
    pclass +
    '">' +
    names[0] +
    " " +
    names[1] +
    "</span>"
  );
}

function showEditProfile() {
  $("#profile_edit_wrp").show();
  $("#profile_wrp").hide();
}

function showChangePassword() {
  $("#change_pwd_wrp").show();
  $("#profile_wrp").hide();
}

function cancelProfile() {
  $("#profile_wrp").show();
  $("#change_pwd_wrp").hide();
  $("#profile_edit_wrp").hide();
}

function saveNewPassword() {
  // var oldpwd = document.getElementById("oldpwd").value;
  var newpwd = document.getElementById("newpwd").value;
  var confnewpwd = document.getElementById("confnewpwd").value;

  if (
    // oldpwd.valueOf() == "".valueOf() ||
    newpwd.valueOf() == "".valueOf() ||
    confnewpwd.valueOf() == "".valueOf()
  ) {
    showTimedMessage(
      "gmsg",
      "All fields are  required for password change!",
      0,
      true
    );
    return;
  }

  if (newpwd.valueOf() != confnewpwd.valueOf()) {
    showTimedMessage("gmsg", "New password not properly confirmed!", 0, true);
    return;
  }

  showTimedMessage("gmsg", "Updating password", 0, false);

  $.ajax({
    url:
      "updateme.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&upwd=" +
      encodeURIComponent(newpwd),
    type: "POST",
    success: updateEDPersonPasswordChange,
    error: personEDOpFailed
    //,datatype: "json"
  });
}

function updateEDPersonPasswordChange(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDPersonProfile,
      error: personEDOpFailed
      //,datatype: "json"
    });
  } else showTimedMessage("gmsg", res[1], 0, true);
}

function refreshEDPersonProfile(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    if (invalidTokenP(result[1])) {
      //edLogout2();
      return;
    }
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gpersons = JSON.parse(response);

  setEDGenericHeader(Gcurrentpage);
  Gcurrentuser = getMyData();
  // document.getElementById("mainbody").innerHTML = editMyProfile();
  showTimedMessage("gmsg", "Your profile has been updated...", 4000, false);
}

function savePersonalProfile() {
  var attributes = "";

  showTimedMessage("gmsg", "Updating profile", 0, false);

  $.ajax({
    url:
      "updateme.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ufirst=" +
      encodeURIComponent(document.getElementById("ufirst").value) +
      "&ulast=" +
      encodeURIComponent(document.getElementById("ulast").value) +
      "&job=" +
      encodeURIComponent(document.getElementById("urole").value),
    type: "POST",
    success: updateEDPersonProfile,
    error: personEDOpFailed
    //,datatype: "json"
  });
}

function updateEDPersonProfile(response) {
  var res = JSON.parse(response);
  if (res[0].valueOf() == "".valueOf()) {
    showTimedMessage(
      "gmsg",
      "Database updated.  Refreshing display...",
      0,
      false
    );
    $.ajax({
      url:
        "get-persons.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: refreshEDPersonProfile,
      error: personEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(res[1])) {
      // //edLogout2();
      return;
    }
    showTimedMessage("gmsg", res[1], 0, true);
  }
}

function edLogout2() {
  // call this when token is invalidated...
  myAlert(
    "SESSION EXPIRED",
    "Your login session has expired.  Please login to resume work!",
    "error"
  );
  edLogoutInternal();
}

function edLogout() {
  // normal logout called when logout is clicked...
  myConfirm(
    "Confirm Logout Request!!",
    "Please confirm your logout - you will lose unsaved work!",
    "OK",
    "Cancel",
    "edLogoutInternal()"
  );
}

function edLogoutInternal() {
  $("#myconfirm_modal").modal("hide");
  Gusername = null;
  Gtoken = null;
  Gcompanies = null;
  Gprojects = null;
  Gstrategies = null;
  Gcurrentdata = null;
  Gadmin = null;
  Gcurrentstrategy = null;
  Gcurrentuser = null;
  localStorage.clear();

  document.getElementById("prelogin-body").innerHTML = GpreloginBody;
  document.getElementById("postlogin-body").style.display = "none";

  location.reload();
  //document.getElementById("admincontent").style.visibility = "hidden";
  // document.getElementById("loginstatus").innerHTML = "You have been successfully logged out";
}
/**
 * Ajax call to upload a file
 */
function disableFileSubmit() {
  document.getElementById("file_submit").disabled = false;
  let file = document.getElementById("file").files[0]; // file from input
  // let req = new XMLHttpRequest();
  let formData = new FormData();
  // req.open("POST", '/upload/image');
  // req.send(formData);
  var title = $("#title").val();
  var step = $("#step").val();
  var company = $("#upl_comp").val();
  var bu = $("#upl_bu").val();
  var project = $("#upl_strat").val();
  var username = $("#upl_uname").val();
  var token = $("#upl_token").val();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("step", step);
  formData.append("company", company);
  formData.append("bu", bu);
  formData.append("project", project);
  formData.append("username", username);
  formData.append("token", token);
  $.ajax({
    url: "upload-document.php",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: uploadEDDone,
    error: fileEDOpFailed
    //,datatype: "json"
  });
}

var updateFilePanel = "main";
/**
 * called when add file button is clicked
 */
function addNewFile() {
  $("#files_modal").modal("show");
  $("#title").val("");
  $("#file").val("");
  $("#step").val("");
  updateFilePanel = "main";
  var tabstring = "";
  tabstring =
    tabstring +
    '<input name="company" id="upl_comp" type="hidden" value="' +
    getCompanyForProject(Gcurrentstrategy) +
    '">';
  tabstring =
    tabstring +
    '<input name="bu" id="upl_bu" type="hidden" value="' +
    getBUForProject(Gcurrentstrategy) +
    '">';
  tabstring =
    tabstring +
    '<input name="project" id="upl_strat" type="hidden" value="' +
    Gcurrentstrategy +
    '">';
  tabstring =
    tabstring +
    '<input name="username" id="upl_uname" type="hidden" value="' +
    Gusername +
    '">';
  tabstring =
    tabstring +
    '<input name="token" id="upl_token" type="hidden" value="' +
    Gtoken +
    '">';
  document.getElementById("projectVariables").innerHTML = tabstring;
}

function uploadEDDone(response) {
  //Function will be called when iframe is loaded

  $("#files_modal").modal("hide");
  var data = JSON.parse(response);
  if (data[0].valueOf() == "".valueOf()) {
    //This part happens when the image gets uploaded.
    if (updateFilePanel.valueOf() == "main".valueOf())
      getEDDocuments(Gcurrentstrategy);
    else getEDDocumentsPanel(Gcurrentstrategy);

    showTimedMessage("gmsg", "Updating document list", 0, false);
  } else showTimedMessage("gmsg", "Upload Failed: " + data, 0, true);
}

function getEDDocuments(strategy) {
  $.ajax({
    url:
      "get-docs.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: updateBackground,
    error: fileEDOpFailed
    //,datatype: "json"
  });
}

function getEDDocumentsPanel(strategy) {
  $.ajax({
    url:
      "get-docs.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy),
    type: "POST",
    success: updateSideFilePanel,
    error: fileEDOpFailed
    //,datatype: "json"
  });
}

function fileEDOpFailed(response) {
  showTimedMessage("gmsg", "ERROR in uploading " + response, 0, true);
}
/**
 * HTML for identify step is prepared
 */
function identifyStepContents() {
  console.trace();
  if (Gcurrentdata[Gprimeindex] == null || Gcurrentdata[Gprimeindex][0] == null)
    return;
  costTree = [
    [
      Gcurrentdata[Gprimeindex][0],
      Gcurrentdata[Gprimeindex][1],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      0
    ], // in ED design, only the first will be used...
    [
      "Acquisition Cost",
      Gcurrentdata[Gprimeindex][5],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      1
    ],
    [
      "Usage Cost",
      Gcurrentdata[Gprimeindex][6],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      2
    ],
    [
      "End of Life Cost",
      Gcurrentdata[Gprimeindex][7],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      3
    ]
  ];

  // alert("idContents 6");

  // make the ce the last value (we need this to do saves in incremental fashion)
  var parents = [
    [
      costTree[0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0]
    ],
    [
      costTree[1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1]
    ],
    [
      costTree[2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2]
    ],
    [
      costTree[3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3]
    ]
  ];
  var currentlevel = 0;
  var currentcost = 0; // indicates the tree number
  if (Gcurrentdata[Gelementsindex] != null) {
    // this will be an array: 1st entry has cost element details;
    // 2nd entry has a list of critical cost elements -- determined by the user
    if (Gcurrentdata[Gelementsindex][0] != null) {
      for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
        var element = Gcurrentdata[Gelementsindex][0][i];
        var ce = element[0];
        var cename = element[1];
        var level = element[2];
        var val = element[4];
        if (typeof val == "string") val = parseFloat(val);
        var imp = element[5];
        var fut = element[6];
        var com = element[7];
        var ordering = element[3];
        var costtype = element[10];
        if (typeof costtype == "string") costtype = parseInt(costtype); // should be 0, 1, 2, or 3...
        var selected = "NO";

        // see if the cost element is listed as critical going forward
        if (Gcurrentdata[Gelementsindex][1] != null) {
          for (var k = 0; k < Gcurrentdata[Gelementsindex][1].length; k++) {
            if (
              (ce + "").valueOf() ==
              (Gcurrentdata[Gelementsindex][1][k] + "").valueOf()
            )
              selected = "YES";
          }
        }
        // last "" ==> is the units of the value/future
        // cost element key: fcf == 4, impactable == 3, selected == 6, comment == 5, ordering == 8
        var newnode = [
          cename,
          val,
          [],
          imp,
          fut,
          com,
          selected,
          ce + "",
          ordering,
          null,
          costtype
        ];

        if (level == currentlevel + 1) {
          // make it a child of the prior level top of the stack
          parents[costtype][currentlevel][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel];
        } else if (level == currentlevel) {
          // sibling
          parents[costtype][currentlevel - 1][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel - 1];
        } // we are going back to an earlier node
        else {
          parents[costtype][level - 1][2].push(newnode);
          newnode[9] = parents[costtype][level - 1];
        }
        parents[costtype][level] = newnode;
        currentlevel = level;
      }
    }
  }
  allNodeCosts = []; // reset the whole cost structure

  computeBottomUpCosts(costTree[0]);
  renderFullEDTree();
  restoreMainScrollXY();
}

// up and down describe whether up button and down button are needed (or not)
/**
 * Get the company info when person id is given
 * @param {array} node - cost elements array
 * @param {number} level - level
 * @param {number} up - Cost element id above
 * @param {number} down - Cost element id below
 */
function renderEDTree(node, level, up, down) {
  var disabled = "";
  if (Gadmin == 0) disabled = " disabled ";
  // alert("up = " + up + " down = " + down);

  var nodestring = "";
  if (node[5] == null) node[5] = "";
  var uElement = [
    '"' + node[0] + '"',
    level,
    costOrder,
    '"' + node[1] + '"',
    '"' + node[3] + '"',
    '"' + node[4] + '"',
    '"' + node[5] + '"',
    '"' + node[6] + '"',
    node[7],
    node[8]
  ];
  var updateElement = "( ";
  updateElement =
    updateElement +
    '"' +
    node[0] +
    '"' +
    " " +
    level +
    " " +
    costOrder +
    " " +
    '"' +
    node[1] +
    '"' +
    " " +
    '"' +
    node[3] +
    '"' +
    " " +
    '"' +
    node[4] +
    '"' +
    " " +
    '"' +
    node[5] +
    '"' +
    " " +
    '"' +
    node[6] +
    '" ' +
    node[7] +
    ")";
  if (level > 0) {
    updateForm = updateForm + updateElement;
    updateElements.push(uElement);
  }

  var root = 0;
  if (level == 0) root = 1;
  costOrder++;
  rowCount++;

  var costtype = node[10];
  // if (costid != 0) return "";
  var costid = node[7];
  // alert(" cost element id: " + costid);
  var leaf = 1;
  var percent = "&nbsp;";
  var baseCost = getComputedCost(costTree[0][7]); // use the base node's cost as the foundation

  percent = numberFormat((getComputedCost(node[7]) / baseCost) * 100, 2);

  //
  // percent = isNaN(percent)? percent: 0;
  if (node[2] != null && node[2].length > 0) leaf = 0;
  var impactable = node[3];
  var fcf = node[4];
  var comment = node[5];
  var selected = node[6]; // if YES, then selected...
  var criticalp = false;
  if (selected != null && selected.valueOf() == "YES".valueOf())
    criticalp = true;
  // alert("identify get here");
  var ceStatus = getCEStatus(node[7]);
  var eternalImg = "";
  if (ceStatus.valueOf() == "ETERNAL".valueOf())
    eternalImg =
      '<span class="strategy-statement"><img title="Marked for reconsideration in Eternal step" width="28px" src="images/eternal_icon.png"/></span>';

  // alert("identify get here 2 : status ==> "+ ceStatus);
  var alertstring = "alert(adding sub cost " + costid + ");";
  // alert(alertstring);
  var disableUpdates = "";
  if (Gadmin == 0) disableUpdates = " disabled";

  if (root == 1) {
    nodestring =
      nodestring +
      "<ul>" +
      "<li>" +
      '<div class="ul-appending">' +
      '<table id="parentrow" class="row_saved_data primary_cost_row">' +
      "<tr>" +
      "<td>" +
      '<span class="drag_icon_wrap">' +
      '<!--<img src="images/drag_icon.png" class="def_hide" />-->' +
      '<a href="javascript:void(0)" class="def_hide drag_up" onClick="alert(drag up id= +$(this).closest(table).attr(id));">' +
      '<img src="images/drag_up.png" />' +
      "</a>" +
      '<a href="javascript:void(0)" class="def_hide drag_down" onClick="alert(drag down id= +$(this).closest(table).attr(id));">' +
      '<img src="images/drag_down.png" />' +
      "</a>" +
      "</span>" +
      '<button class="text-capitalize add_row_btn" onClick="addSubCost(' +
      costid +
      ');" data-toggle="tooltip" data-placement="top" title="Add cost item in the next level" ' +
      disableUpdates +
      ">" +
      '<i class="fa fa-plus"></i>' +
      "</button>" +
      "</td>" +
      "<td>";

    var criticalicon =
      '<span class="critical_icon" data-toggle="tooltip" data-placement="top" title="Selected critical cost" hidden> ' +
      '<img src="images/critical_icon.png"/> ' +
      "</span>";
    if (criticalp)
      criticalicon =
        '<span class="critical_icon" data-toggle="tooltip" data-placement="top" title="Selected critical cost"> ' +
        '<img src="images/critical_icon.png"/> ' +
        "</span>";

    nodestring =
      nodestring +
      criticalicon +
      node[0] +
      "</td>" +
      "<td>" +
      CurrencyFormat(getComputedCost(node[7]), "", 0, "", ",") +
      "</td>" +
      "<td>" +
      "<span >" +
      percent +
      " % </span>" +
      "</td>" +
      "<td>" +
      '<div class="row_action_btn">';

    // alert ("fcf: " + fcf + "  impactable: " + impactable);
    var fcfbutton =
      '<button class="text-capitalize action_btn_1" data-toggle="tooltip" data-placement="top" title="Not a future cash flow"></button>';
    if (fcf != null && fcf.valueOf() == "YES".valueOf())
      fcfbutton =
        '<button class="text-capitalize action_btn_1 click_icon" title="Marked as future cash flow" data-toggle="tooltip" data-placement="top"></button>';

    var impbutton =
      '<button class="text-capitalize action_btn_2" data-toggle="tooltip" data-placement="top" title="Not marked as impactable cost"></button>';
    if (impactable != null && impactable.valueOf() == "YES".valueOf())
      impbutton =
        '<button class="text-capitalize action_btn_2 click_icon" data-toggle="tooltip" data-placement="top" title="Marked  as impactable cost"></button>';

    var comtextid = "ic-" + costid;
    var comdiv = "comdiv-" + costid;

    nodestring =
      nodestring +
      fcfbutton +
      impbutton +
      '<button class="text-capitalize action_btn_3 comment_btn def_hide"  title="' +
      comment +
      '" onClick="showCommentBox(' +
      costid +
      ');"></button>' +
      '<div id="' +
      comdiv +
      '" class="comment_box_wrp">' +
      "<p>" +
      '<textarea class="input_comment" id="' +
      comtextid +
      '"> </textarea>' +
      "</p>" +
      '<p class="submit_btnwrp">' +
      '<input type="submit" value="Save" onclick="saveComment(' +
      costid +
      ')" id="commentsubmit" class="submit_btn"/>' +
      '<input type="submit" value="Cancel" id="commentcancel" onclick="commentBoxHide(' +
      costid +
      ')"  class="cancel_btn"/>  ' +
      "</p>" +
      "</div>" +
      '<button class="text-capitalize action_btn_4 opt_btn" data-toggle="tooltip" data-placement="top" title="Option"></button>' +
      '<div class="opt_btn_wrp">' +
      '<div class="def_hide">' +
      "<h4>Select cost as</h4>" +
      '<ul class="cost_action">' +
      '<li> <a href="javascript:void(0);"  class="mark_Fututr" onclick="markFuture($(this))"> Future Cash Flow </a> </li>' +
      '<li> <a href="javascript:void(0);"  class="mark_impactable" onclick="markImpactable($(this))"> Impactable Cost </a> </li>' +
      '<li> <a href="javascript:void(0);"  class="mark_critical" onclick="markCritical($(this))"> Critical Cost </a> </li>' +
      '<li> <a href="javascript:void(0);"  class="mark_eternal" onclick="markEternal($(this))"> Mark for Eternal Watchlist </a> </li>' +
      "</ul>" +
      "</div>" +
      "<h4>Other actions</h4>" +
      '<ul class="other_action">                                        ' +
      '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editIdentity($(this))"> Edit cost </a> </li>' +
      '<li class="def_hide"><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteIdentity($(this))"> Delete cost </a> </li>' +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</table>   " +
      '<table class="cust_table" hidden>' +
      "<tr>" +
      "<td>&nbsp; </td>" +
      "<td>" +
      '<input type="text" placeholder="Primary cost description" class="row_txtbox costdesc" onkeyup="Costdescription($(this))"/>' +
      "</td>" +
      "<td>" +
      '<input type="text" placeholder="Amount"  onkeyup="CostAmount($(this))" class="def_hide text-right row_txtbox costamount"/>' +
      "</td>" +
      "<td>" +
      "<span></span>" +
      "</td>" +
      "<td>" +
      '<div class="row_submit_wrp">' +
      '<input type="submit" value="Save" class="submit_btn action_btn cost_submit"/>' +
      '<button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>' +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</table>" +
      "</div>";
  } else {
    nodestring =
      nodestring +
      '<ul class="newul">' +
      "<li>" +
      '<div class="childdiv">' +
      '<table class="cust_table" hidden>' +
      "<tr>" +
      "<td>&nbsp; </td>" +
      "<td>" +
      '<input type="text" placeholder="Primary cost description" class="row_txtbox costdesc" onkeyup="Costdescription($(this))"/>' +
      "</td>" +
      "<td>" +
      '<input type="text" placeholder="Amount"  onkeyup="CostAmount($(this))" class="def_hide text-right row_txtbox costamount"/>' +
      "</td>" +
      "<td>" +
      "<span></span>" +
      "</td>" +
      "<td>" +
      '<div class="row_submit_wrp">' +
      '<input type="submit" value="Save" class="submit_btn action_btn cost_submit"/>' +
      '<button type="button" class="cancel_btn" data-dismiss="modal">Cancel</button>' +
      "</div>" +
      "</td>" +
      "</tr>" +
      "</table>";

    var criticalBG = "";
    if (criticalp) criticalBG = " critical_bg ";
    nodestring =
      nodestring +
      '<table id="identity1" class="row_saved_data ' +
      criticalBG +
      '">' +
      "<tr>" +
      "<td>";
    // alert("here 1");

    var prev = -1;
    var next = -1;
    if (typeof up == "string") up = parseInt(up);
    if (typeof down == "string") down = parseInt(down);
    // alert("after parse: up = " + up + " down = " + down);
    var upClass = "";
    if (up == -1) upClass = "def_hide";
    else {
      // alert("up = " + up);
      oFindNode(costTree[0], up);
      if (selectedNode != null && selectedNode.length > 0) {
        // alert("selectedNode = " + selectedNode);
        prev = selectedNode[8]; // ordering of the previous sibling..
        // alert("prev: " + prev);
        if (typeof prev == "string") prev = parseInt(prev);
      }
    }
    var downClass = "";
    if (down == -1) downClass = "def_hide";
    else {
      // alert("down = " + down);
      oFindNode(costTree[0], down);
      if (selectedNode !== null && selectedNode.length > 0) {
        // alert("selectedNode = " + selectedNode);
        next = selectedNode[8]; // ordering of the next sibling
        // alert("next: " + next);
        if (typeof next == "string") next = parseInt(next);
      }
    }
    var ordering = node[8]; // current node ordering...

    if (typeof ordering == "string") ordering = parseInt(ordering);

    // alert("here 2");
    if (Gadmin == 1) {
      nodestring =
        nodestring +
        '<span class="drag_icon_wrap">' +
        // '<!--<img src="images/drag_icon.png" class="def_hide" />-->' +
        '<a href="javascript:void(0)" class="' +
        upClass +
        ' drag_up" onClick="moveEDUp(' +
        ordering +
        "," +
        prev +
        ')">' +
        '<img src="images/drag_up.png" />' +
        "</a>" +
        '<a href="javascript:void(0)" class="' +
        downClass +
        ' drag_down" onClick="moveEDDown(' +
        ordering +
        "," +
        next +
        ')">' +
        '<img src="images/drag_down.png" />' +
        "</a>" +
        "</span>" +
        '<button class="text-capitalize add_row_btn" onClick="addSubCost(' +
        costid +
        ');" data-toggle="tooltip" data-placement="top" title="Add cost item in the next level">' +
        '<i class="fa fa-plus"></i>' +
        "</button>";
    }

    nodestring = nodestring + "</td>" + "<td>";
    // alert("here 3");
    var criticalicon =
      '<span class="critical_icon" data-toggle="tooltip" data-placement="top" title="Selected critical cost" hidden> ' +
      '<img src="images/critical_icon.png"/> ' +
      "</span>";
    if (criticalp)
      criticalicon =
        '<span class="critical_icon" data-toggle="tooltip" data-placement="top" title="Selected critical cost"> ' +
        '<img src="images/critical_icon.png"/> ' +
        "</span>";
    // alert("here 4");
    nodestring =
      nodestring +
      criticalicon +
      node[0] +
      "&nbsp;" +
      eternalImg +
      "</td>" +
      "<td>" +
      CurrencyFormat(getComputedCost(node[7]), "", 0, "", ",") +
      "</td>" +
      "<td>" +
      "<span >" +
      percent +
      " % </span>" +
      "</td>" +
      "<td>" +
      '<div class="row_action_btn">';
    // alert ("fcf: " + fcf + "  impactable: " + impactable);
    var fcfbutton =
      '<button class="text-capitalize action_btn_1" onClick="markFuture(' +
      costid +
      ');" data-toggle="tooltip" data-placement="top" title="Not a future cash flow"' +
      disableUpdates +
      "></button>";
    if (fcf != null && fcf.valueOf() == "YES".valueOf())
      fcfbutton =
        '<button class="text-capitalize action_btn_1 active_action_btn_1 click_icon"  onClick="markFuture(' +
        costid +
        ');" title="Marked as future cash flow" data-toggle="tooltip" data-placement="top"' +
        disableUpdates +
        "></button>";

    var impbutton =
      '<button class="text-capitalize action_btn_2"  onClick="markImpactable(' +
      costid +
      ');" data-toggle="tooltip" data-placement="top" title="Not marked as impactable cost"' +
      disableUpdates +
      "></button>";
    if (impactable != null && impactable.valueOf() == "YES".valueOf())
      impbutton =
        '<button class="text-capitalize action_btn_2 active_action_btn_2 click_icon"  onClick="markImpactable(' +
        costid +
        ');" data-toggle="tooltip" data-placement="top" title="Marked  as impactable cost"' +
        disableUpdates +
        "></button>";

    var comtextid = "ic-" + costid;
    var comdiv = "comdiv-" + costid;
    var activeComClass = "";
    if (comment.valueOf() != "".valueOf()) activeComClass = " realComment";
    var comButtonClass = "";
    // if (comment.valueOf() != "".valueOf()) comButtonClass = " active_action_btn_3";
    if (criticalp) comButtonClass = comButtonClass + " active_comment";
    // if (comment.valueOf() != "".valueOf()) comButtonClass = comButtonClass + " realComment";

    nodestring =
      nodestring +
      fcfbutton +
      impbutton +
      '<span class="' +
      activeComClass +
      '">' +
      '<button class="text-capitalize action_btn_3 comment_btn ' +
      comButtonClass +
      '"  title="' +
      comment +
      '" onClick="showCommentBox(' +
      costid +
      ');"' +
      disableUpdates +
      "></button>" +
      "</span>" +
      '<div id="' +
      comdiv +
      '" class="comment_box_wrp">' +
      "<p>" +
      '<textarea class="input_comment" id="' +
      comtextid +
      '"> </textarea>' +
      "</p>" +
      '<p class="submit_btnwrp">' +
      '<input type="submit" value="Save" onclick="saveComment(' +
      costid +
      ');" id="commentsubmit" class="submit_btn"/>' +
      '<input type="submit" value="Cancel" id="commentcancel" onclick="hideCommentBox(' +
      costid +
      ')"  class="cancel_btn"/>  ' +
      "</p>" +
      "</div>";
    if (Gadmin == 1) {
      nodestring =
        nodestring +
        '<button class="text-capitalize action_btn_4 opt_btn" onClick="goalDataOption($(this));" data-toggle="tooltip" data-placement="top" title="Option"></button>' +
        '<div class="opt_btn_wrp">' +
        // '<div class="def_hide">' +
        "<h4>Select cost as</h4>";
      // alert("identify here 77");
      var futureChecked = "";
      if (fcf != null && fcf.valueOf() == "YES".valueOf())
        futureChecked = " click_icon";
      var impChecked = "";
      if (impactable != null && impactable.valueOf() == "YES".valueOf())
        impChecked = " click_icon";
      var critChecked = "";
      if (criticalp) critChecked = " click_icon";
      var eternChecked = "";
      if (ceStatus.valueOf() == "ETERNAL".valueOf())
        eternChecked = " click_icon";
      // alert("identify here 88");
      nodestring =
        nodestring +
        '<ul class="cost_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_Fututr ' +
        futureChecked +
        '" onclick="markFuture(' +
        costid +
        ');"> Future Cash Flow </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_impactable ' +
        impChecked +
        '" onclick="markImpactable(' +
        costid +
        ')"> Impactable Cost </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_critical ' +
        critChecked +
        '" onclick="markCritical(' +
        costid +
        ')"> Critical Cost </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_eternal ' +
        eternChecked +
        '" onclick="markCEEternal(' +
        costid +
        "," +
        criticalp +
        ')"> Mark for Eternal Watchlist </a> </li>' +
        "</ul>" +
        // '</div>' +
        "<h4>Other actions</h4>" +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);" class="mark_edit_cost" onclick="editCostElement(' +
        costid +
        ')"> Edit cost </a> </li>' +
        '<li class="def_hide"><a href="javascript:void(0);" class="mark_del_cost" onclick="deleteCostElement(' +
        costid +
        ')"> Delete cost </a> </li>' +
        "</ul>" +
        "</div>";
    } else nodestring = nodestring + "&nbsp;";
    nodestring = nodestring + "</div>" + "</td>" + "</tr>" + "</table>";
  }

  for (
    var k = 0;
    k < node[2].length;
    k++ // the children
  ) {
    var up = -1;
    if (k > 0) up = node[2][k - 1][7];
    var down = -1;
    if (k < node[2].length - 1) down = node[2][k + 1][7];
    // alert("previous: " + up + " down: " + down);
    // pass in the prev and next ce's as relevan
    nodestring = nodestring + renderEDTree(node[2][k], level + 1, up, down);
  }
  nodestring = nodestring + "</li>" + "</ul>";

  return nodestring;
}

function isLeaf(node) {
  if (node[2] != null && node[2].length > 0) return false;
  return true;
}

// foundation for bottom up calculations
var allNodeCosts = [];

function computeBottomUpCosts(node) {
  var ce = "";
  if (node == null) return;
  if (node[7] != null) ce = node[7];
  if (ce == null || ce.valueOf() == "".valueOf()) {
    return 0;
  }
  if (typeof ce == "string") ce = parseInt(ce);
  // alert("cost element: " + ce + " value: " + node[1]);
  var costval = node[1];
  if (typeof node[1] == "string") costval = parseFloat(node[1]);
  if (isLeaf(node)) {
    allNodeCosts.push([ce, costval]);
    return costval;
  }
  var cost = 0;
  // alert("Not a leaf -- looping over " + node[2].length + " children");
  for (var i = 0; i < node[2].length; i++) {
    // alert("child " + i + " of " + ce);
    cost = cost + computeBottomUpCosts(node[2][i]);
  }

  // alert("computed cost of node: " + ce + " = " + cost);
  allNodeCosts.push([ce, cost]);
  return cost;
}

function getComputedCost(ce) {
  for (var i = 0; i < allNodeCosts.length; i++) {
    if (ce == allNodeCosts[i][0]) {
      return allNodeCosts[i][1];
    }
  }
  return -1; // should never happen...
}
/**
 * HTML for identify step tree
 */
function renderFullEDTree() {
  console.trace();
  oldCheckBoxValues = [];
  oldSelectValues = [];
  updateForm = "( ";
  updateElements = [];
  costOrder = 1;
  rowCount = 0;
  var fullCost = Gcurrentdata[Gprimeindex][1];
  var treestring =
    '<div class="content_head_wrp">' +
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<div class="total_cost_wrp">' +
    '<label class="total_cost">Primary cost (from Agree Step):</label>' +
    "<span>" +
    CurrencyFormat(fullCost, GdefaultCurrency, 0, "", ",") +
    "</span>" +
    "</div>" +
    '<!--<a href="javascript:void(0);"  class="btn prmary_btn pull-right" id="primary_cost_btn" style="margin-top:10px;">' +
    '<i class="fa fa-plus" aria-hidden="true"></i> Primary Cost' +
    "</a>-->" +
    "</div>        " +
    "</div>" +
    "</div>" +
    "</div>";
  //alert("rfted 1");
  treestring =
    treestring +
    "<!---------------------------------- Main content (identify)---------------------------------->" +
    '<div class="container-fluid">' +
    '<!-- <div class="row">' +
    '<div class="col-lg-6 col-md-8 col-sm-12 col-lg-push-3 col-md-push-2 text-center">' +
    '<div class="info_block">' +
    '<img src="images/info_icon.png" class="icon_lt"/> Add a primary cost to start identifying critical costs from the cost breakdown.' +
    "</div>" +
    "</div>        " +
    "</div>-->" +
    '<div class="row cost_hierarchy">' +
    '<div class="col-lg-12 col-md-12 col-sm-12">' +
    '<table class="table cost_table_head">' +
    "<tr>" +
    "<td></td>" +
    "<td>Cost Breakdown</td>" +
    "<td>Cost (" +
    GdefaultCurrency +
    ") </td>" +
    "<td>Percentage</td>" +
    "<td>&nbsp;</td>" +
    "</tr>" +
    "</table>";

  // alert("tree building 2");

  treestring = treestring + renderEDTree(costTree[0], 0, -1, -1);

  // alert("tree rendered 3");

  treestring = treestring + "</div>" + "</div>" + "</div>";
  document.getElementById("Identify-body").innerHTML = treestring;
}

function markFuture(ce) {
  // $('.opt_btn_wrp').hide();
  showTimedMessage("gmsg", "Toggling future cash flow", 0, false);
  oFindNode(costTree[0], ce); // sets selectedNode...
  if (selectedNode == null || selectedNode.length == 0) {
    showTimedMessage("gmsg", "Could not find the tree node for " + ce, 0, true);
    return;
  }
  // toggle fcf
  var fcf = "YES";
  // alert("fcf value: " + selectedNode[4]);
  if (selectedNode[4] != null && selectedNode[4].valueOf() == "YES".valueOf())
    fcf = "NO";

  $.ajax({
    url:
      "modify-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
      "&future=" +
      encodeURIComponent(fcf) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
  // alert("Mark as cash flow in the future " + ce);
}

function markImpactable(ce) {
  // showTimedMessage("gmsg", "Toggling impactable", 0, false);
  oFindNode(costTree[0], ce); // sets selectedNode...
  if (selectedNode == null || selectedNode.length == 0) {
    showTimedMessage("gmsg", "Could not find the tree node for " + ce, 0, true);
    return;
  }
  // toggle impactable
  var imp = "YES";
  // alert("impactable value: " + selectedNode[3]);
  if (selectedNode[3] != null && selectedNode[3].valueOf() == "YES".valueOf())
    imp = "NO";

  $.ajax({
    url:
      "modify-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
      "&impactable=" +
      encodeURIComponent(imp) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });

  // alert("Mark as impactable " + ce);
}

function saveComment(ce) {
  showTimedMessage("gmsg", "Saving comment....", 0, false);
  $.ajax({
    url:
      "modify-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
      "&comment=" +
      encodeURIComponent(document.getElementById("ic-" + ce).value) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
  $(".opt_btn_wrp").hide();
}

function modifyCEComment(ce, comment) {
  $.ajax({
    url:
      "modify-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      // "&units=" + encodeURIComponent(document.getElementById('costcurr').value) +
      "&comment=" +
      encodeURIComponent(comment) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
}

function someChildIsCritical(node) {
  if (node[2] != null) {
    //  has children
    for (
      var j = 0;
      j < node[2].length;
      j++ // look at the children of node...
    ) {
      var child = node[2][j];
      if (child[6] != null && child[6].valueOf() == "YES".valueOf()) {
        // alert("A child cost element of this cost element is declared critical!");
        return true;
      }
      return someChildIsCritical(child);
    }
    return false;
  }
  return false;
}

function someParentIsCritical(node) {
  if (node[9] == null) return false; // no parent, so return false...
  if (node[9][6] != null && node[9][6].valueOf() == "YES".valueOf()) {
    // check its criticality
    return true;
  }
  return someParentIsCritical(node[9]);
}
/**
 * Marks the cost element critical
 * @param {number} ce - Cost Element Id
 */
function markCritical(ce) {
  $(".opt_btn_wrp").hide();
  // showTimedMessage("gmsg", "Toggling cost element critical", 0, false);
  var newcomment = "";

  oFindNode(costTree[0], ce); // sets selectedNode...
  if (selectedNode == null || selectedNode.length == 0) {
    showTimedMessage("gmsg", "Could not find the tree node for " + ce, 0, true);
    return;
  }
  // basically toggle the current value of critical...
  if (selectedNode[6] != null && selectedNode[6] == "YES") crit = "0";
  else crit = "1";

  if (crit.valueOf() == "1".valueOf()) {
    var node = selectedNode;
    if (someChildIsCritical(node)) {
      alert(
        "A direct or indirect sub- cost of this cost element is already declared critical!"
      );
      return;
    }
    if (someParentIsCritical(node)) {
      // if there is a parent
      alert(
        "A direct or indirect parent cost element is already declared critical!!"
      );
      return;
    }

    if (
      node[3] == null ||
      node[3].valueOf() != "YES".valueOf() || // not impactable
      node[4] == null ||
      node[4].valueOf() != "YES".valueOf() || // not fcf
      node[2].length > 0
    ) {
      // not a leaf...
      newcomment = prompt(
        "You have requested to carry forward a cost element that either has sub-costs, or is not impactable, or is not a future cash flow. Please document this deviation from the recommended AIM&DRIVE process with a comment",
        ""
      );
    }
  }

  showTimedMessage(
    "gmsg",
    "Updating selected cost elements to carry forward...",
    0,
    false
  );
  if (newcomment.valueOf() == "".valueOf()) {
    $.ajax({
      url:
        "set-critical-cost-element.php?project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(ce) +
        "&criticalp=" +
        encodeURIComponent(crit) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: iEDStepSaved,
      error: identifyEDOpFailed
      //,datatype: "json"
    });
  } else {
    $.ajax({
      url:
        "set-critical-cost-element.php?project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(ce) +
        "&criticalp=" +
        encodeURIComponent(crit) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: iEDStepSaved,
      error: identifyEDOpFailed
      //,datatype: "json"
    });
    setTimeout(modifyCEComment(ce, newcomment), 2000);
  }
  // alert("Mark as critical cost " + ce);
}

function markEternal(ce) {
  $(".opt_btn_wrp").hide();
  myAlert("Attention", "Requesting add to eternal: !" + ce, "error");
}

function editCostElement(ce) {
  // alert("edit cost element " + ce);
  $("#ce_modal").modal("show");
  $(".opt_btn_wrp").hide();
  $(".ce_modaltitle").text("Edit Cost Element");
  oFindNode(costTree[0], ce);
  document.getElementById("ce_name").value = selectedNode[0];
  document.getElementById("ce_value").value = selectedNode[1];
  deactivateButton("ce_submit");
  editingCE = ce;
  $(document).ready(function() {
    // $('input[type="submit"]').attr('disabled','disabled');
    $('input[type="text"]').on("keyup", function() {
      if ($(this).val != "") {
        $('input[type="submit"]').removeAttr("disabled");
      }
    });
  });
}

function deleteCostElement(ce) {
  $(".opt_btn_wrp").hide();
  oFindNode(costTree[0], ce);
  // has children?
  if (selectedNode[2].length > 0) {
    myAlert(
      "Attention!",
      "Cannot delete a cost element with sub costs!",
      "error"
    );
    return;
  }
  var criticalp = false;
  if (selectedNode[6] != null && selectedNode[6].valueOf() == "YES".valueOf())
    criticalp = true;
  if (criticalp) {
    myAlert("Attention!", "Cannot delete a CRITICAL cost element!", "error");
    return;
  }

  myConfirm(
    "Confirm!",
    "Please confirm that you wish to delete the cost element",
    "OK",
    "Cancel",
    "deleteCostElementInternal(" + ce + ")"
  );
}

function deleteCostElementInternal(ce) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  showTimedMessage("gmsg", "Removing cost element...", 0, false);
  $.ajax({
    url:
      "delete-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
}

var parentCE = -1;
var editingCE = -1;

function addSubCost(ce) {
  $("#ce_modal").modal("show");
  $(".opt_btn_wrp").hide();
  $(".ce_modaltitle").text("Add Sub-Cost");
  document.getElementById("ce_name").value = "";
  document.getElementById("ce_value").value = "";
  deactivateButton("ce_submit");
  parentCE = ce;
  editingCE = -1;
  $(document).ready(function() {
    // $('input[type="submit"]').attr('disabled','disabled');
    $('input[type="text"]').on("keyup", function() {
      if ($(this).val != "") {
        $('input[type="submit"]').removeAttr("disabled");
      }
    });
  });
}

function saveCE() {
  if (editingCE == -1) {
    if (!validNumber("ce_value")) {
      showTimedMessage(
        "gmsg",
        "Estimated cost is not a valid number!",
        0,
        true
      );
      return;
    }
    var ce_name = document.getElementById("ce_name").value;
    if (ce_name === "") {
      showTimedMessage("gmsg", "Cost Element should not be blank!", 0, true);
      return;
    }
    var cost = document.getElementById("ce_value").value;
    showTimedMessage("gmsg", "Adding sub cost...", 0, false);
    saveMainScrollXY();
    $.ajax({
      url:
        "add-child-cost.php?project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(parentCE) +
        "&costtype=" +
        encodeURIComponent(0) +
        "&newcename=" +
        encodeURIComponent(document.getElementById("ce_name").value) +
        "&dollars=" +
        encodeURIComponent(cost) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: iEDStepSaved,
      error: identifyEDOpFailed
      //,datatype: "json"
    });
  } else {
    saveMainScrollXY();
    $.ajax({
      url:
        "modify-critical-cost.php?project=" +
        Gcurrentstrategy +
        "&ce=" +
        encodeURIComponent(editingCE) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&cename=" +
        encodeURIComponent(document.getElementById("ce_name").value) +
        "&dollars=" +
        encodeURIComponent(
          extractNumber(document.getElementById("ce_value").value)
        ) +
        "&username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken),
      type: "POST",
      success: iEDStepSaved,
      error: identifyEDOpFailed
      //,datatype: "json"
    });
  }
  $("#ce_modal").modal("hide");
}

function identifyEDOpFailed(response) {
  showTimedMessage("gmsg", "ERROR in uploading " + response, 0, true);
}

function showCommentBox(ce) {
  // $('#comdiv'+ce)
  // var cb = document.getElementById("comdiv-"+ce);
  if ($("#comdiv-" + ce).css("display") == "none") {
    $("#comdiv-" + ce).show();
    oFindNode(costTree[0], ce);
    document.getElementById("ic-" + ce).value = selectedNode[5];
  } else $("#comdiv-" + ce).hide();
}

function hideCommentBox(ce) {
  $("#comdiv-" + ce).hide();
}

function moveEDUp(source, destination) {
  // alert("moving: " + source + " to " + destination);
  saveMainScrollXY();

  $.ajax({
    url:
      "move-cost-element.php?project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(destination) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
}

function moveEDDown(source, destination) {
  //alert("moving: " + source + " to " + destination);
  //alert("moving: " + source + " to " + destination);
  saveMainScrollXY();
  $.ajax({
    url:
      "move-cost-element.php?project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&source=" +
      encodeURIComponent(source) +
      "&destination=" +
      encodeURIComponent(destination) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
}

function setSSSelection(ss) {
  // toggle selection for implementation of ss
  if (ss == -1) {
    showTimedMessage("gmsg", "Invalid strategy statement...", 0, true);
    return;
  }

  var oentry = findSSEntry(ss);

  storeSSPageState();
  if (oentry[9].valueOf() == "SELECTED".valueOf()) {
    // currently selected
    showTimedMessage(
      "gmsg",
      "Setting strategy statement as unselected...",
      0,
      false
    );
    $.ajax({
      url:
        "set-ss-unselected.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss,
      type: "POST",
      success: updateEDSSWithResult,
      error: ssEDOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage(
      "gmsg",
      "Setting strategy statement as selected...",
      0,
      false
    );
    $.ajax({
      url:
        "set-ss-selected.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ss=" +
        ss,
      type: "POST",
      success: updateEDSSWithResult,
      error: ssEDOpFailed
      //,datatype: "json"
    });
  }
}

function markSSEternal(ss, selected) {
  // toggle selection for Eternal of GcurrentSS
  if (selected == "SELECTED") {
    myAlert(
      "ERROR!",
      "Unable to mark Strategy Statement as Eternal since it is Selected for Implementation. Unselect Strategy Statement for Implementation before marking it as Eternal",
      "error"
    );
    return;
  }
  var oentry = findSSEntry(ss);
  // alert("ss = " + ss + " length: " + oentry.length + " oentry= " + oentry)
  if (oentry == null && oentry.length < 13) {
    showTimedMessage("gmsg", "Strategy statement invalid...", 0, true);
    return;
  }
  var status = oentry[11];
  var newstatus = "ETERNAL";
  if (status != null && status.valueOf() == "ETERNAL".valueOf()) newstatus = "";
  storeSSPageState();

  showTimedMessage("gmsg", "Adding strategy statement...", 0, false);
  $.ajax({
    url:
      "save-ss.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&ss=" +
      ss +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&status=" +
      encodeURIComponent(newstatus),
    type: "POST",
    success: updateEDSSWithResult,
    error: ssEDOpFailed
    //,datatype: "json"
  });
}
//here
function markCEEternal(ce, criticalp) {
  if (criticalp) {
    myAlert(
      "ERROR!",
      "Unable to mark Cost Element as Eternal since it is marked as a Critical Cost Element. Unselect it as a Critical Cost Element before marking it as Eternal",
      "error"
    );
    return;
  }
  var status = getCEStatus(ce);
  var newstatus = "ETERNAL";
  if (status != null && status.valueOf() == "ETERNAL".valueOf()) newstatus = "";
  showTimedMessage("gmsg", "Updating critical cost eternal status", 0, false);
  $.ajax({
    url:
      "modify-critical-cost.php?project=" +
      Gcurrentstrategy +
      "&ce=" +
      encodeURIComponent(ce) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&status=" +
      encodeURIComponent(newstatus) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: iEDStepSaved,
    error: identifyEDOpFailed
    //,datatype: "json"
  });
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function eternalStepContents2() {
  console.trace();
  body = "";
  body =
    body +
    '<div class="container-fluid">' +
    '<div class="row">' +
    '<div class="col-lg-12 col-md-12">' +
    "<!-- Primary Cost Components -->" +
    '<section class="primary_cost_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Deferred Cost Elements</h2>' +
    '<div class="pull-right">' +
    "</div>" +
    "</div>" +
    '<div class="et_primary_cost">' +
    '<table class="row_saved_data  et_pricost_table">';
  var no_data = false;
  if (Gcurrentdata[Gelementsindex][0] != null) {
    for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
      var celement = Gcurrentdata[Gelementsindex][0][i];
      var status = celement[11];

      if (!(status != null && status.valueOf() == "ETERNAL".valueOf()))
        continue;
      var criticalp = false;
      var val = celement[4];
      if (celement[8] != null && celement[8].valueOf() == "YES".valueOf())
        criticalp = true;
      no_data = true;
      body = body + "<tr>" + "<td width=50%>";

      if (criticalp) {
        body =
          body +
          '<span class="critical_icon" data-toggle="tooltip" data-placement="top" title="Selected critical cost"> ' +
          '<img src="images/critical_icon.png"> ' +
          "</span>";
      }
      var fcf = celement[5];
      var impactable = celement[6];
      var comment = celement[7];
      // alert("celement:  " + fcf + " imp:" + impactable + " comment: " + comment);
      var fcfbutton =
        '<button class="text-capitalize action_btn_1" data-toggle="tooltip" data-placement="top" title="Not a future cash flow"></button>';
      if (fcf != null && fcf.valueOf() == "YES".valueOf())
        fcfbutton =
          '<button class="text-capitalize action_btn_1 click_icon" title="Marked as future cash flow" data-toggle="tooltip" data-placement="top"></button>';

      var impbutton =
        '<button class="text-capitalize action_btn_2" data-toggle="tooltip" data-placement="top" title="Not marked as impactable cost"></button>';
      if (impactable != null && impactable.valueOf() == "YES".valueOf())
        impbutton =
          '<button class="text-capitalize action_btn_2 click_icon" data-toggle="tooltip" data-placement="top" title="Marked  as impactable cost"></button>';

      var eternalImg =
        '<img title="Marked for reconsideration in Eternal step"  width="28px" src="images/eternal_icon.png"/>';

      body =
        body +
        celement[1] +
        "</td>" +
        "<td width=15%>" +
        CurrencyFormat(val, GdefaultCurrency, 0, "", ",") +
        "</td>" +
        "<td>" +
        '<div class="row_action_btn">' +
        eternalImg +
        fcfbutton +
        impbutton +
        '<button class="text-capitalize action_btn_3 comment_btn" title="Icon for comments"></button>' +
        '<button class="text-capitalize action_btn_4 opt_btn" data-toggle="tooltip" data-placement="top" title="Option" onclick="optionButton($(this))"></button>' +
        '<div class="opt_btn_wrp" style="display: none;">' +
        '<div class="">' +
        "<h4>Select cost as</h4>" +
        '<ul class="cost_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_Fututr" onclick="markFuture($(this))"> Future Cash Flow </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_impactable" onclick="markimpactable($(this))"> Impactable Cost </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_critical" onclick="markcritical($(this))"> Critical Cost </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="mark_eternal" onclick="marketernal($(this))"> Mark for Eternal Watchlist </a> </li>' +
        "</ul>" +
        "</div>" +
        "<h4>Other actions</h4>" +
        '<ul class="other_action">' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editIdentity($(this))"> Edit cost </a> </li>' +
        '<li class=""><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteIdentity($(this))"> Delete cost </a> </li>' +
        "</ul>" +
        "</div>" +
        "</div>" +
        "</td>" +
        "</tr>";
    }
  } else {
    body += "<tr><td>No Data Available</td></tr>";
  }
  if (!no_data) {
    body +=
      "<tr class='no-data-tr'><td class='no-data-td'>No Data Available</td></tr>";
  }
  // alert("after ces")
  body =
    body +
    "</table>" +
    "</div>" +
    "</section>" +
    "<!-- Critical Cost Components -->" +
    '<section class="critical_cost_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Deferred Cost Drivers</h2>' +
    '<div class="pull-right">' +
    "</div>" +
    "</div>" +
    '<div id="criticalcostdiv">' + // need to end this  00 also prior section
    '<div class="clearfix"></div>' +
    '<div class="cost_driver_container_wrapper">' + // another driver
    "<!------ slider ------>" +
    "";
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    // alert("cd loop 0");

    var cdelement = Gcurrentdata[Gcdindex][i];
    var cdCEID = cdelement[0];
    // cdelement: 0 cdid, 1 cdname, 2 position, 3 unused, Element 4: [0 num, 1 den, 2 currval, 3 improve, 4 target, 5 unit, 6 key, 7 status ]

    var centry = getCEEntry(cdCEID);
    // alert("cd loop 1");
    var cestring = "";
    var eternalFound = false;
    // alert("cd loop 2");

    cestring = // cestring +
      '<div class="cost_driver_container slider_1">' +
      "<!------ critical_cost ------>  " +
      '<div class="crit_cost_wrp">' +
      '<h3 class="title">' +
      centry[1] +
      "</h3>" +
      '<p class="cost">' +
      CurrencyFormat(centry[4], GdefaultCurrency, 0, "", ",") +
      "</p>" +
      '<div class="crit_cost_bottom">' +
      '<span class="pull-left est_values_btn">' +
      // '<a href="javascript:void(0);"  id="show_est_val_1">Show estimated values <i class="fa fa-angle-down" aria-hidden="true"></i></a>' +
      "</span>" +
      '<span class="pull-right more_info">' +
      // '<a href="javascript:void(0);"  class="prev"><i class="fa fa-angle-down" aria-hidden="true"></i></a>' +
      // '<a href="javascript:void(0);"  class="next"><i class="fa fa-angle-up" aria-hidden="true"></i></a>' +
      // '<a href="javascript:void(0);" ><img src="images/ver_more.png" alt="more" /> </a>' +
      "</span>" +
      "</div>" +
      "</div>" +
      "<!------ cost driver ------>" +
      '<div class="cost_driver_wrp">' +
      '<div class="cd_inner_wrp">' +
      '<div id="caroousel_1">';

    // alert("cd loop 3");
    var numdrivers = 0;
    if (cdelement[2] != null) numdrivers = cdelement[2].length;
    for (var k = 0; k < numdrivers; k++) {
      // alert("cd inner details loop 1");
      var cdentry = cdelement[2][k];

      var cdid = cdentry[0];
      var cdname = cdentry[1];
      var status = "";
      var keycd = "";
      var keyp = false;
      var num = "",
        den = "",
        cdcurr = "",
        cdtarget = "",
        impact = "";
      if (
        cdentry != null &&
        cdentry.length >= 4 &&
        cdentry[4] != null &&
        cdentry[4].length > 0
      ) {
        num = cdentry[4][0];
        den = cdentry[4][1];
        cdcurr = cdentry[4][2];
        impact = cdentry[4][3];
        if (impact == null) impact = "";
        cdtarget = cdentry[4][4];
        keycd = cdentry[4][6];
        status = cdentry[4][7];
      }
      var keyText = "";
      if (keycd != null && keycd.valueOf() == "1".valueOf()) keyp = true;
      if (keyp) keyText = "K";
      var impClass = "";
      var keyCDClass = "";
      var keyvalClass = "";
      var keyBGClass = "";
      if (keyp) {
        keyCDClass = " keycost";
        keyvalClass = " d-block";
        keyBGClass = " critical_bg";
      }

      var impText = "";
      if (impact.valueOf() == "YES".valueOf()) {
        impClass = " d-block";
        impactableP = true;
      }

      var eternalP = false;
      var eternalImg = "";
      if (status != null && status.valueOf() == "ETERNAL".valueOf()) {
        eternalP = true;
        eternalFound = true;
        eternalImg =
          '<img title="Marked for reconsideration in Eternal step" width="28px" src="images/eternal_icon.png"/>';
      } else {
        continue;
      }

      // alert("cd inner details loop 2");
      cestring =
        cestring +
        '<section class="cd_sec" id="cost1">' +
        '<div class="cd_item ' +
        keyCDClass +
        '">' +
        '<div class="upper_sec">' +
        '<span class="num_value">' +
        num +
        "</span>" +
        "<hr>" +
        '<span class="den_value">' +
        den +
        "</span>" +
        "</div>" +
        '<div class="bottom_sec">' +
        '<span class="process_value ' +
        keyBGClass +
        '">' +
        cdname +
        "</span>" +
        '<div class="est_values_wrp">' +
        '<label class="est_title"> Current value</label>' +
        '<span class="est_value">' +
        cdcurr +
        "</span>" +
        '<label class="est_title"> Target value</label>' +
        '<span class="est_value">' +
        cdtarget +
        "</span> " +
        "</div>" +
        '<div class="cd_action_btn">' +
        '<div class="pull-left">' +
        '<button class="text-capitalize mark_keycost ' +
        keyvalClass +
        '"> </button>' +
        // '<button class="text-capitalize ">' + keyText + '</button>' +
        // '<button class="text-capitalize ">' + impText + '</button>' +
        '<button class="text-capitalize mark_impact ' +
        impClass +
        '"></button>' +
        '<span class="eternal_strategy">' +
        eternalImg +
        "</span>" +
        "</div>" +
        "<!-- option dropdown -->" +
        '<div class="pull-right rt_div">' +
        '<button class="text-capitalize comment_btn"></button>' +
        '<button class="text-capitalize opt_btn"></button>' +
        '<div class="opt_btn_wrp optdropdown costdriverdropdown" style="display:none;">' +
        "<h4>Select cost driver as</h4>" +
        '<ul class="cost_action">' +
        '<li> <a href="javascript:void(0);"  class="impact_btn"> Impactable Cost Driver </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="keycost_btn" > Key Cost Driver </a> </li>' +
        '<li> <a href="javascript:void(0);"  class="eternal_btn"> Mark for Eternal Watchlist </a> </li>' +
        "</ul>" +
        "<h4>Other actions</h4>" +
        '<ul class="other_action">                                        ' +
        '<li> <a href="javascript:void(0);"  class="mark_edit_cost"> Edit cost </a> </li>' +
        '<li><a href="javascript:void(0);"  class="mark_del_cost"> Delete cost </a> </li>' +
        "</ul>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</section>";
    }
    if (eternalFound)
      body =
        body +
        cestring +
        '</div></div></div><div class="clearfix"></div></div>';
  }

  body =
    body +
    "</div>" +
    "</div>" +
    "</div>" +
    "</section>" +
    "<!-- Strtagy Statement -->" +
    '<section class="stag_stat_sec">' +
    '<div class="sec_head">' +
    '<h2 class="sec_title no_margin">Deferred Strategy Statements </h2>' +
    "</div>" +
    "<!-- Statement wrap -->" +
    '<div class="col-lg-6 col-md-6 col-sm-6 no_padding"> ' +
    '<div class="et_state_wrap"> ';

  // alert("eternal before ss");
  var eternalCount = 0;
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var ssEntry = Gcurrentdata[Grbindex][i];
    var ssid = ssEntry[0];
    var status = ssEntry[11];
    if (status.valueOf() != "ETERNAL".valueOf()) continue;
    // alert("found an ss " + ssid);
    eternalCount = eternalCount + 1;
    var performance = getSummaryPerformanceAlt(ssEntry);
    // alert("found performance for ss");
    var sshandle = ssEntry[12];
    var fixedhandle = sshandle;
    if (sshandle.length > GmaxShortStrategyDesc)
      fixedhandle =
        '<span title="' +
        sshandle +
        '">' +
        sshandle.substring(0, GmaxShortStrategyDesc) +
        "</span>";

    body =
      body +
      '<section class="et_state_list"> ' +
      '<div class="head">' +
      '<span class="stat_count">' +
      fixedhandle +
      "</span> " +
      '<button class="text-capitalize eternal_btn pull-right" id="eternal_btn"> </button> ' +
      '<div class="et_btn_wrp etdropdown">' +
      "<h4>Show</h4>" +
      '<ul class="et_action">                                        ' +
      '<li> <a href="javascript:void(0);"  class=""> Eternal Bookmarks (2)</a> </li>' +
      '<li><a href="javascript:void(0);"  class=""> Dropped Strategy Statements (2) </a> </li>' +
      "</ul>" +
      "</div>" +
      "</div>" +
      '<p class="strategy_stat">' +
      ssEntry[1] +
      "</p> " +
      '<ul class="info_option_wrp stat_action">' +
      "<li> " +
      '<div class="item total_bc_value">' +
      '<h6 class="title">Net potential value </h6>' +
      CurrencyFormat(
        performance[0] + performance[1] - performance[2],
        GdefaultCurrency,
        0,
        "",
        ","
      ) +
      "</div>" +
      "</li>" +
      "<li> " +
      '<div class="item total_bc_value">' +
      // '<h6 class="title">Revisit on</h6>' +
      // "?? " +
      "</div>" +
      "</li>" +
      "<li>" +
      '<div class="item owner_items">';
    // '<h6 class="title">Owners </h6>'

    var performers = getActionImplementers(ssEntry);
    // alert("found performers");
    for (var j = 0; j < performers.length; j++) {
      body = body + generateProfileIconFromId(performers[j], "owner_count");
    }
    body = body + "</div>" + "</li>" + "</ul>  " + "</section>";
  }
  body =
    body + "</div>" + "</div>" + "</section>" + "</div>" + "</div>" + "</div>";
  return body;
}

function getCEEntry(ce) {
  for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
    if (Gcurrentdata[Gelementsindex][0][i][0] == ce)
      return Gcurrentdata[Gelementsindex][0][i];
  }
  return [];
}

function getCEStatus(ce) {
  var centry = getCEEntry(ce);
  var status = centry[11];
  if (status == null) status = "";
  return status;
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 * @param {number} pid - Person Id
 */
function mdStepContents2() {
  console.trace();
  var disableUpdates = "";
  if (Gadmin == 0) disableUpdates = " disabled";

  var body =
    '<div class="measure_head">' +
    '<div class="crit_cost_sec pull-left">' +
    "<h4>Critical cost</h4>" +
    "</div>" +
    '<div class="cost_driver_sec pull-left">' +
    "<h4>Cost drivers</h4>" +
    "</div>" +
    '<div class="rt_ctrls pull-right">' +
    "<span>" +
    '<button id="enable-carousel-default" type="button" class="enable_icon enable_activemode">' +
    '<!--<img src="images/display_row.png" alt="enable" />-->' +
    "</button>" +
    '<button id="destroy-carousel-default" type="button" class="disable_icon">' +
    '<!--<img src="images/display_td.png" alt="destroy">-->' +
    "</button>" +
    "</span>" +
    '<!--<span class="slider_controls">' +
    '<button class="text-capitalize prev" id="go-to-prev-carousel-default" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>' +
    '<button class="text-capitalize next" id="go-to-next-carousel-default" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>' +
    "</span>-->" +
    "</div>" +
    "</div>" +
    '<div class="clearfix"></div>' +
    '<div id="gmsg" onClick="document.getElementById(gmsg).innerHTML=;"></div>' +
    '<div class="cost_driver_container_wrapper">';
  // alert("md 1");
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    // alert("md ce loop: " + i);

    var cdelement = Gcurrentdata[Gcdindex][i];
    var cdCEID = cdelement[0];
    // alert("md step 2 - ce = " + cdCEID);
    // cdelement: 0 cdid, 1 cdname, 2 position, 3 unused, Element 4: [0 num, 1 den, 2 currval, 3 improve, 4 target, 5 unit, 6 key, 7 status ]
    var centry = getCEEntry(cdCEID);
    var esPanelId = "espanel-" + cdCEID;
    var carID = "carousel_" + cdCEID;
    var sliderID = "slider_" + cdCEID;
    mdSliders.push(sliderID);

    carouselIDs.push(carID);
    body =
      body +
      '<div class="cost_driver_container slider_' +
      cdCEID +
      '">' +
      "<!------ critical_cost ------>  " +
      '<div class="crit_cost_wrp">' +
      '<h3 class="title">' +
      centry[1] +
      "</h3>" +
      '<p class="cost">' +
      CurrencyFormat(centry[4], GdefaultCurrency, 0, "", ",") +
      "</p>" +
      '<div class="crit_cost_bottom">' +
      '<span class="pull-left est_values_btn">' +
      `<a href="javascript:void(0)" onClick="showEstimatePanel('${esPanelId}')" 
        id="${esPanelId}">
        <div id="innerP${cdCEID}">
        Show estimated values 
        <i class="fa fa-angle-down" aria-hidden="true"></i>
        </div>
        </a>
        </span>
        </div>` +
      '<a href="javascript:void(0)" class="strategic_option" id="show_stag_opt_' +
      cdCEID +
      '">' +
      // '<a href="javascript:void(0)" data-toggle="collapse" data-target="#load_stag_opt_' + cdCEID + '" class="strategic_option" id="show_stag_opt_' + cdCEID + '">' +
      'Show strategic Options <i class="fa fa-angle-down" aria-hidden="true"></i>' +
      "</a>" +
      "</div>" +
      "<!------ cost drivers for this ce ------>" +
      '<div class="cost_driver_wrp" id="cd_wrp_' +
      cdCEID +
      '">' +
      '<div class="cd_inner_wrp">' +
      '<div class="" id="carousel_' +
      cdCEID +
      '">';
    var numdrivers = 0;
    if (cdelement[2] != null) numdrivers = cdelement[2].length;
    // alert("md step 3 - numdrivers = " + numdrivers);
    var lastcdID = -1;
    // alert("cost element " + cdCEID);
    for (var k = 0; k < numdrivers; k++) {
      // alert("md ce : " + i + " cd " + k);
      // alert("inner loop for cd: " + k);
      // alert("got here in md 0");
      var lastP = false;
      if (k == numdrivers - 1) lastP = true;
      var cdentry = cdelement[2][k];
      var cdid = cdentry[0];
      var cdname = cdentry[1];
      var pos = cdentry[2];
      // alert("driver position: " + cdentry[2]);
      var status = "";
      var impactable = "";
      var keycd = "";
      var num = "",
        den = "",
        cdcurr = "",
        cdtarget = "";
      var status = "";
      var keyp = false;
      var num = "",
        den = "",
        cdcurr = "",
        cdtarget = "";
      // alert("got here in md 1");
      if (
        cdentry != null &&
        cdentry.length >= 4 &&
        cdentry[4] != null &&
        cdentry[4].length > 0
      ) {
        num = cdentry[4][0];
        den = cdentry[4][1];
        cdcurr = cdentry[4][2];
        impactable = cdentry[4][3];
        if (impactable == null) impactable = "";
        cdtarget = cdentry[4][4];
        keycd = cdentry[4][6];
        if (keycd == null) keycd = "";
        status = cdentry[4][7];
        if (status == null) status = "";
      }
      if (keycd != null && keycd.valueOf() == "1".valueOf()) keyp = true;
      var eternalP = false;
      var impClass = "";
      var keyCDClass = "";
      var keyvalClass = "";
      var keyBGClass = "";
      var keyText = "";
      if (keyp) {
        keyCDClass = " keycost";
        keyvalClass = " d-block";
        keyBGClass = " critical_bg";
      }
      if (keyp) keyText = "K";
      var impText = "";
      var impactableP = false;
      if (impactable.valueOf() == "YES".valueOf()) {
        impClass = " d-block";
        impactableP = true;
      }
      if (impactableP) impText = "I";
      // alert("got here in md 2");
      markClass = "";
      var eternalImg = "";
      if (status != null && status.valueOf() == "ETERNAL".valueOf()) {
        eternalP = true;
        eternalFound = true;
        eternalImg =
          '<img title="Marked for reconsideration in Eternal step" width="28px" src="images/eternal_icon.png"/>';
      }
      // alert("got here in md 1.5");

      body =
        body +
        '<section class="cd_sec" id="costsec-' +
        cdCEID +
        "-" +
        cdid +
        '">' +
        '<div class="cd_item ' +
        keyCDClass +
        '" id="cost-' +
        cdCEID +
        "-" +
        'cdid">';

      body = body + '<div class="cd_hover_wrap">';
      if (Gadmin == 1) {
        body =
          body +
          '<a href="javascript:void(0)" class="add_left" onclick="addCDAtPosition(' +
          cdCEID +
          "," +
          k +
          ');" ' +
          ">" +
          '<img src="images/add_box.png">' +
          "</a>" +
          '<span class="drag_box_wrap">' +
          '<!--<img src="images/drag_icon.png" class="def_hide" />-->';
        // alert("cds 1");
        if (lastcdID == -1) {
          body =
            body +
            '<a  class="drag_left" title="Left most item cannot be shifted left!!" onclick="" >' +
            // '<img src="images/drag_left.png">' +
            "&nbsp;" +
            "</a>";
        } else {
          body =
            body +
            '<a href="javascript:void(0)" class="drag_left" title="Shift this driver to the left" onclick="swapDriversED(' +
            cdCEID +
            "," +
            k +
            "," +
            (k - 1) +
            ');">' +
            '<img src="images/drag_left.png">' +
            "</a>";
        }

        // alert("cds 2");
        body =
          body +
          '<a href="javascript:void(0)" class="drag_boxm" onclick="" disabled>' +
          '<img src="images/drag_boxm.png">' +
          "</a>";
        // alert("cds 3");

        if (lastP) {
          body =
            body +
            '<a  class="drag_right" title="Last item cannot be moved right!" onclick="" >' +
            // '<img src="images/drag_right.png">' +
            "&nbsp;" +
            "</a>";
        } else {
          var nextCD = cdelement[2][k + 1][0];
          body =
            body +
            '<a href="javascript:void(0)" class="drag_right" title="Shift this driver to the right" onclick="swapDriversED(' +
            cdCEID +
            "," +
            k +
            "," +
            (k + 1) +
            ')">' +
            '<img src="images/drag_right.png">' +
            "</a>";
        }
      }

      // alert( "keyclass = " + keyClass + " impClass = " + impClass);

      var NumDenLength = 20;
      var shortnum = num,
        shortden = den,
        printnum = "",
        printden = "";
      if (num.length > NumDenLength)
        shortnum = num.substring(0, NumDenLength) + "...";
      if (num.length <= NumDenLength) {
        printnum = '<span class="num_value">' + shortnum + "</span>";
      } else {
        printnum =
          '<span title="' + num + '" class="num_value">' + shortnum + "</span>";
      }
      if (den.length > NumDenLength)
        shortden = den.substring(0, NumDenLength) + "...";
      if (den.length <= NumDenLength) {
        printden = '<span class="den_value">' + den + "</span>";
      } else {
        printden =
          '<span title="' + den + '" class="den_value">' + shortden + "</span>";
      }

      body = body + "</span>" + "";
      if (Gadmin == 1) {
        body =
          body +
          '<a href="javascript:void(0)" class="add_right" onclick="addCDAtPosition(' +
          cdCEID +
          "," +
          (k + 1) +
          ');" ' +
          ">" +
          '<img src="images/add_box.png">' +
          "</a>";
      }
      body =
        body +
        "</div>" +
        '<div class="upper_sec">' +
        printnum +
        "<hr>" +
        printden +
        "</div>" +
        '<div class="bottom_sec">';

      var shortname = cdname;
      if (cdname.length > 12) shortname = cdname.substring(0, 12) + "...";
      if (cdname.length <= 12) {
        body =
          body +
          '<span class="process_value ' +
          keyBGClass +
          '">' +
          shortname +
          "</span>";
      } else {
        body =
          body +
          '<span title="' +
          cdname +
          '" class="process_value ' +
          keyBGClass +
          '">' +
          shortname +
          "</span>";
      }
      body =
        body +
        '<div class="est_values_wrp">' +
        '<label class="est_title"> Current value</label>' +
        '<span class="est_value">' +
        cdcurr +
        "</span>" +
        '<label class="est_title"> Target value</label>' +
        '<span class="est_value">' +
        cdtarget +
        "</span> " +
        "</div>" +
        '<div class="cd_action_btn">' +
        '<div class="pull-left">' +
        // '<button class="text-capitalize ' + keyClass + '">' + keyText + '</button>' +
        // '<button class="text-capitalize ' + impClass + '">' + impText + '</button>' +
        '<button class="text-capitalize mark_keycost ' +
        keyvalClass +
        '"> </button>' +
        // '<button class="text-capitalize ' +  '">' + keyText + '</button>' +
        '<button class="text-capitalize mark_impact ' +
        impClass +
        '"></button>' +
        '<span class="eternal_strategy">' +
        eternalImg +
        "</span>" +
        // '<button class="text-capitalize mark_eternal ' + markClass + '"></button>' +
        // '<button class="text-capitalize ' +  '">' + impText + '</button>' +
        "</div>" +
        "<!-- option dropdown -->";
      if (Gadmin == 1) {
        body =
          body +
          '<div class="pull-right rt_div">' +
          '<button class="text-capitalize opt_btn"></button>' +
          '<div class="opt_btn_wrp optdropdown costdriverdropdown" style="display:none;">' +
          "<h4>Select cost driver as</h4>" +
          '<ul class="cd_actions">' +
          '<li> <a href="javascript:void(0);"  class="impact_btn" onclick="markCDImpactable(' +
          cdCEID +
          "," +
          cdid +
          ')"> Impactable Cost Driver </a> </li>' +
          '<li> <a href="javascript:void(0);"  class="keycost_btn" onclick="markCDKey(' +
          cdCEID +
          "," +
          cdid +
          ')"> Key Cost Driver </a> </li>' +
          '<li> <a href="javascript:void(0);"  class="eternal_btn" onclick="markCDEternal(' +
          cdCEID +
          "," +
          cdid +
          "," +
          keyp +
          ')"> Mark for Eternal Watchlist </a> </li>' +
          "</ul>" +
          "<h4>Other actions</h4>" +
          '<ul class="other_action">                                        ' +
          '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editEDCostDriver(' +
          cdCEID +
          "," +
          cdid +
          ')" > Edit cost driver</a> </li>' +
          '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteEDCostDriver(' +
          cdCEID +
          "," +
          cdid +
          ')" > Delete cost driver</a> </li>' +
          "</ul>" +
          "</div>" +
          "</div>";
      }
      body =
        body +
        "</div>" +
        "</div>" +
        // should be end of cd_item
        "</div>";

      body =
        body +
        '<div class="strag_opt_load">' +
        '<div class="strag_opt">' +
        ' <i class="fa fa-caret-down" aria-hidden="true"></i>' +
        '<span class="pull-right">';
      // '<a href="javascript:void(0)" class="iconbtn"><img src="images/showlist_btn.png" /></a>' +
      if (Gadmin == 1) {
        body =
          body +
          '<a href="javascript:void(0)" class="iconbtn open_stag_modal" onClick="addEDSO(' +
          cdCEID +
          "," +
          cdid +
          ');" data-toggle="modal" data-target="#stag_item_modal"><img src="images/add_btn.png" /></a>' +
          "</span>                        " +
          "</div>     ";
      }

      // inject strategic options for this driver
      body = body + ' <ul class="strag_opt_list">';

      if (
        cdentry != null &&
        cdentry.length >= 5 &&
        cdentry[5] != null &&
        cdentry[5].length > 0
      ) {
        for (var m = 0; m < cdentry[5].length; m++) {
          var soid = cdentry[5][m][0];
          // alert("processing so " + soid);
          var sodesc = cdentry[5][m][1];
          var sosel = cdentry[5][m][2];
          var sobutClass = "",
            soselClass = "";
          var selMenu = "Carry Forward to R Step";
          if (sosel.valueOf() == "1".valueOf()) {
            subutClass = " active_action";
            soselClass = " mark_stag_imp";
            selMenu = "Cancel Carry Forward to R Step";
          }
          body =
            body +
            '<li class="stag_item ' +
            soselClass +
            '" id="stag1_1"><P>' +
            sodesc;
          if (Gadmin == 1) {
            body =
              body +
              '</P><button class="text-capitalize more_option opt_btn pull-right ' +
              sobutClass +
              '" onClick=""></button>' +
              '<div class="clrfloat"></div>' +
              '<div class="opt_btn_wrp optdropdown optionsdropdown" style="display:none;">' +
              '<ul class="strag_action">' +
              '<li> <a href="javascript:void(0);"  class="implement_btn" onclick="markSOForKeeps(' +
              cdCEID +
              "," +
              cdid +
              "," +
              soid +
              ')">' +
              selMenu +
              "</a> </li>" +
              // '<li> <a href="javascript:void(0);"  class="eternal_btn" onclick=""> Mark for Eternal Watchlist </a> </li>' +
              "</ul>" +
              "<h4>Other actions</h4>" +
              '<ul class="other_action">' +
              '<li> <a href="javascript:void(0);"  class="mark_edit_cost" onclick="editStagItem(' +
              cdCEID +
              "," +
              cdid +
              "," +
              soid +
              ')"> Edit Strategic Option </a> </li>' +
              '<li><a href="javascript:void(0);"  class="mark_del_cost" onclick="deleteStagItem(' +
              cdCEID +
              "," +
              cdid +
              "," +
              soid +
              ')"> Delete Strategic Option </a> </li>' +
              "</ul>" +
              "</div>";
          } else body = body + "</P><button></button>";
          body = body + "</li>";
        }
      } // end of strategic options for a given driver
      else body = body + "<li>&nbsp;</li>";

      body = body + "</ul>" + "</div>";

      body = body + "</section>";
      lastcdID = cdid;
    }
    if (Gadmin == 1) {
      body =
        body +
        "<!-- on click popup -->" +
        '<div class="cd_item add_cost_driver">' +
        '<a href="javascript:void(0)" data-toggle="modal" onclick="addEDCostDriver(' +
        cdCEID +
        ')">' +
        '<img src="images/add_icon.png" alt="add cost driver" />' +
        "<label>Add cost driver</label>" +
        "</a>" +
        "</div>" +
        "";
    }

    body =
      body +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="clearfix"></div>' +
      "</div>";
  }
  body = body + '<div class="clearfix"></div>' + "</div>" + "";
  return body;
}

function showEstimatePanel(id) {
  var elements = id.split("-");
  var ceid = elements[1];
  // alert("innerP"+ceid);
  if ($("#carousel_" + ceid + " .est_values_wrp").hasClass("d-block")) {
    document.getElementById("innerP" + ceid).innerHTML =
      'Show estimated values <i class="fa fa-angle-down" aria-hidden="true"></i>';
    if ($.inArray(id, ceEstimatePanels) >= 0)
      ceEstimatePanels.splice($.inArray(id, ceEstimatePanels), 1);
  } else {
    if ($.inArray(id, ceEstimatePanels) < 0) ceEstimatePanels.push(id);
    document.getElementById("innerP" + ceid).innerHTML =
      'Hide estimated values <i class="fa fa-angle-up" aria-hidden="true"></i>';
  }

  $("#carousel_" + ceid + " .est_values_wrp").toggleClass("d-block");
  $("#carousel_" + ceid + " .cd_item").toggleClass("item_collapse");
  $(".slider_" + ceid + " .crit_cost_wrp").toggleClass("item_collapse"); // expand cd item
  $(".slider_" + ceid + " .strag_opt").toggleClass("strag_opt_collapse"); // stragic option position chnge
  //chnage text
}

function showStrategicOptions(ceid) {
  // alert("calling sos for " + ceid);
  $("body").toggleClass("noscroll"); // hide vertical scroll of body
  $(".slider_controls").toggle(); // hide slider controls
  $("#destroy-carousel-default").toggle(); // hide grid mode
  $("#carousel_" + ceid + " .strag_opt").toggleClass("stag_collapse");
  $(".strag_opt").toggle(); //	 strag  clck menu
  $("#load_stag_opt_" + ceid).toggle(); // load strag option with scroll
  for (var i = 0; i < mdSliders.length; i++) {
    if (!(mdSliders[i].valueOf() == ("slider_" + ceid).valueOf())) {
      // everything but the slider for this ceid...
      // alert("slider loop toggle " + ceid);
      $(".slider_" + mdSliders[i]).toggle();
    }
  }

  //chnage text
  if ($(".strag_opt").hasClass("stag_collapse")) {
    $("#show_stag_opt_" + ceid).html(
      'Hide strategic options <i class="fa fa-angle-up" aria-hidden="true"></i>'
    );
  } else {
    $("#show_stag_opt_" + ceid).html(
      'Show strategic options <i class="fa fa-angle-down" aria-hidden="true"></i>'
    );
  }
}

function getNumCDEntries(ce) {
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    var cdelement = Gcurrentdata[Gcdindex][i];
    var cdCEID = cdelement[0];
    if (cdCEID != ce) continue;
    var numdrivers = 0;
    if (cdelement[2] != null) numdrivers = cdelement[2].length;
    return numdrivers;
  }
}

function getCDEntry(ce, cd) {
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    var cdelement = Gcurrentdata[Gcdindex][i];
    var cdCEID = cdelement[0];
    if (cdCEID != ce) continue;
    var numdrivers = 0;
    if (cdelement[2] != null) numdrivers = cdelement[2].length;
    for (var k = 0; k < numdrivers; k++) {
      // alert("cd inner details loop 1");
      var cdentry = cdelement[2][k];
      var cdid = cdentry[0];
      if (cdid == cd) return cdentry;
    }
  }
  // should never really happen because ce, cd should be valid for all calls.
  return null;
}

var contextualCE = -1;
var editingCD = -1;

function addEDCostDriver(ce) {
  $(".error").hide();
  $("#cost_driver_modal").modal("show");
  contextualCE = ce;
  editingCD = -1;
  addingPosition = -1;
  $(".measuretitle").text("Add Cost Driver");
  document.getElementById("numerator").value = "";
  document.getElementById("denominator").value = "";
  document.getElementById("cdname").value = "";
  document.getElementById("currentVal").value = "";
  document.getElementById("targetVal").value = "";
  deactivateButton("add_cost_btn");
}

function editEDCostDriver(ce, cd) {
  $(".error").hide();
  $("#cost_driver_modal").modal("show");
  $(".measuretitle").text("Edit Cost Driver");
  $(".opt_btn_wrp").hide();
  contextualCE = ce;
  editingCD = cd;
  var cdentry = getCDEntry(ce, cd);
  if (cdentry == null) {
    myAlert("Attention", "No way this should happen", "error");
    return;
  }
  // alert("cdentry: " + cdentry);
  var num = "",
    den = "",
    cdname = "",
    cdcurr = "",
    cdtarget = "";
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    num = cdentry[4][0];
    den = cdentry[4][1];
    cdcurr = cdentry[4][2];
    cdtarget = cdentry[4][4];
  }
  deactivateButton("add_cost_btn");
  document.getElementById("numerator").value = num;
  document.getElementById("denominator").value = den;
  document.getElementById("cdname").value = cdentry[1];
  document.getElementById("currentVal").value = cdcurr;
  document.getElementById("targetVal").value = cdtarget;
}

function saveEDCostDriver() {
  if (contextualCE < 0) {
    myAlert("Attention", "Cost element is not valid!", "error");
    return;
  }
  var cdname = document.getElementById("cdname").value;
  var num = document.getElementById("numerator").value;
  var deno = document.getElementById("denominator").value;
  var currval = document.getElementById("currentVal").value;
  var tarval = document.getElementById("targetVal").value;

  let canSaveCD = true;
  if (cdname === "" || cdname.size == 0) {
    $(".cdname_error")
      .text("Cost Driver is required")
      .show();
    canSaveCD = false;
  }
  if (num === "" || num.size == 0) {
    $(".numerator_error")
      .text("Numerator is required")
      .show();
    canSaveCD = false;
  }
  if (deno === "" || deno.size == 0) {
    $(".denominator_error")
      .text("Denominator is required")
      .show();
    canSaveCD = false;
  }
  if (canSaveCD === false) return false;
  $("#cost_driver_modal").modal("hide");
  saveMainScrollXY();
  // alert("scroll positions: " + scrollX + " " + scrollY);
  if (editingCD == -1) {
    // adding a new one
    var pos = addingPosition; // if there is a position spec incoming...
    if (addingPosition == -1) pos = getNumCDEntries(contextualCE);

    showTimedMessage("gmsg", "Adding a new driver...", 0, false);
    $.ajax({
      url:
        "add-driver-to-project.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(contextualCE) +
        "&dname=" +
        encodeURIComponent(cdname) +
        "&driver=" +
        encodeURIComponent(editingCD) +
        "&numerator=" +
        encodeURIComponent(document.getElementById("numerator").value) +
        "&denominator=" +
        encodeURIComponent(document.getElementById("denominator").value) +
        "&current=" +
        encodeURIComponent(document.getElementById("currentVal").value) +
        "&target=" +
        encodeURIComponent(document.getElementById("targetVal").value) +
        "&pos=" +
        pos,
      type: "POST",
      success: driverEDAdded,
      error: driverEDOpFailed
      //,datatype: "json"
    });

    // alert("adding a cost driver to element: " + contextualCE);
  } else {
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(contextualCE) +
        "&driver=" +
        encodeURIComponent(editingCD) +
        "&dname=" +
        encodeURIComponent(document.getElementById("cdname").value) +
        "&numerator=" +
        encodeURIComponent(document.getElementById("numerator").value) +
        "&denominator=" +
        encodeURIComponent(document.getElementById("denominator").value) +
        "&current=" +
        encodeURIComponent(document.getElementById("currentVal").value) +
        "&target=" +
        encodeURIComponent(document.getElementById("targetVal").value),
      type: "POST",
      success: driverEDRefresh,
      error: driverEDOpFailed
      //,datatype: "json"
    });
    // alert("Saving cost driver: " + editingCD + "of cost element: " + contextualCE);
    return;
  }
}

function deleteEDCostDriver(ce, cd) {
  var command = "deleteEDCostDriverInternal(" + ce + "," + cd + ")";
  // alert(command);
  myConfirm(
    "Confirm!",
    "Please confirm that you want to delete this cost driver",
    "OK",
    "Cancel",
    command
  );
}

function deleteEDCostDriverInternal(ce, cd) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  showTimedMessage("gmsg", "Deleting the driver...", 0, false);
  $.ajax({
    url:
      "delete-driver.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&driver=" +
      encodeURIComponent(cd),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}

function driverEDOpFailed(resp) {
  showTimedMessage("gmsg", "Driver database update failed", 0, true);
}

function driverEDAdded(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() == "".valueOf()) {
    var driver = result[1];
    if (typeof driver == "string") driver = parseInt(driver);
    showTimedMessage(
      "gmsg",
      "Driver added.  Saving other properties...",
      0,
      false
    );
    $.ajax({
      url:
        "save-driver.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        encodeURIComponent(contextualCE) +
        "&driver=" +
        encodeURIComponent(driver) +
        "&numerator=" +
        encodeURIComponent(document.getElementById("numerator").value) +
        "&denominator=" +
        encodeURIComponent(document.getElementById("denominator").value) +
        "&current=" +
        encodeURIComponent(document.getElementById("currentVal").value) +
        "&target=" +
        encodeURIComponent(document.getElementById("targetVal").value),
      type: "POST",
      success: driverEDRefresh,
      error: driverEDOpFailed
      //,datatype: "json"
    });
  } else {
    if (invalidTokenP(result[1])) {
      // //edLogout2();
      return;
    }

    showTimedMessage("gmsg", result[1], 0, true);
  }
}

// cd1 and cd2 must be adjacent to one another for this to work
function swapDriversED(ce, cd1, cd2) {
  showTimedMessage("gmsg", "Swapping drivers as requested...", 0, false);
  $.ajax({
    url:
      "swap-drivers.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&source=" +
      encodeURIComponent(cd1) +
      "&destination=" +
      encodeURIComponent(cd2),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}
var addingPosition = -1;

function addCDAtPosition(ce, pos) {
  contextualCE = ce;
  editingCD = -1;
  addingPosition = pos;
  $(".measuretitle").text("Add Cost Driver At Position: " + (pos + 1));
  document.getElementById("numerator").value = "";
  document.getElementById("denominator").value = "";
  document.getElementById("cdname").value = "";
  document.getElementById("currentVal").value = "";
  document.getElementById("targetVal").value = "";
}

var editngSO = -1;
/**
 * called when edit strategic option mesaure and define step is clicked
 * @param {number} ce - cost element id
 * @param {number} cd - cost driver id
 */
function addEDSO(ce, cd) {
  $(".opt_btn_wrp").hide();
  var cdentry = getCDEntry(ce, cd);
  var num = "",
    den = "",
    cdname = "",
    cdcurr = "",
    cdtarget = "";
  $(".stagmodal_title").text("Add Strategic Option(s)");
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    num = cdentry[4][0];
    den = cdentry[4][1];
    cdcurr = cdentry[4][2];
    cdtarget = cdentry[4][4];
  }
  document.getElementById("cdNum").innerHTML = num;
  document.getElementById("cdDen").innerHTML = den;
  document.getElementById("cdName").innerHTML = cdentry[1];
  contextualCE = ce;
  editingCD = cd;
  editingSO = -1;
  document.getElementById("useEachLine").disabled = false;
  document.getElementById("input_stagdesc").value = "";
  deactivateButton("stag_item_submit");
}

function getSOEntry(ce, cd, soid) {
  // alert("looking for ce = " + ce + " cd = " + cd + "; so = " + soid);
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    var centry = Gcurrentdata[Gcdindex][i];
    // alert("entering for ce: " + ce);
    if (centry[0] == ce) {
      // alert("found ce: " + ce);
      var numdrivers = 0;
      if (centry[2] != null) numdrivers = centry[2].length;
      for (var j = 0; j < numdrivers; j++) {
        var cdelement = centry[2][j];
        // alert(" current driver : " + cdelement[0]);
        if (cdelement[0] == cd) {
          // alert("found cd: " + cd + " cdelement: " + cdelement);
          if (cdelement[5] != null && cdelement[5].length > 0) {
            // alert("found straegic options");
            for (var k = 0; k < cdelement[5].length; k++) {
              // alert("looking at soid: " + cdelement[5][k][0]);
              if (cdelement[5][k][0] == soid) return cdelement[5][k];
            }
          }
          return null;
        }
      }
    }
  }
  return null; // should never happen
}

function editStagItem(ce, cd, soid) {
  $(".opt_btn_wrp").hide();
  $("#stag_item_modal").modal("show");
  $(".stagmodal_title").text("Edit Strategic Option");
  var cdentry = getCDEntry(ce, cd);
  var num = "",
    den = "",
    cdname = "",
    cdcurr = "",
    cdtarget = "";
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    num = cdentry[4][0];
    den = cdentry[4][1];
    cdcurr = cdentry[4][2];
    cdtarget = cdentry[4][4];
  }
  document.getElementById("cdNum").innerHTML = num;
  document.getElementById("cdDen").innerHTML = den;
  deactivateButton("stag_item_submit");
  document.getElementById("cdName").innerHTML = cdentry[1];
  contextualCE = ce;
  editingCD = cd;
  editingSO = soid;
  var soEntry = getSOEntry(ce, cd, soid);
  // alert("entry for : " + soid + " = " + soEntry);
  if (soEntry == null) {
    myAlert("Attention", "Strategic option not found!", "error");
    return;
  }
  document.getElementById("input_stagdesc").value = soEntry[1];
  // document.getElementById("useEachLine").disabled = true;
}

function saveEDSOs() {
  if (contextualCE == -1) {
    showTimedMessage("gmsg", "Cost element not defined!!", 0, true);
    return;
  }
  if (editingCD == -1) {
    showTimedMessage("gmsg", "Cost driver not defined!!", 0, true);
    return;
  }
  var soText = document.getElementById("input_stagdesc").value;
  if (soText.valueOf() == "".valueOf()) {
    showTimedMessage("gmsg", "Strategic option text must be provided", 0, true);
    return;
  }
  var allSOs = [];

  $("#stag_item_modal").modal("hide");
  saveMainScrollXY();

  if (editingSO == -1) {
    if (!document.getElementById("useEachLine").checked) {
      allSOs.push(soText);
    } else {
      var options = soText.split("\n");
      for (var m = options.length - 1; m >= 0; m--) {
        if (options[m].valueOf() == "".valueOf()) {
          options.splice(m, 1);
        }
      }
      allSOs = options;
    }
    for (var j = 0; j < allSOs.length; j++) {
      if (j < allSOs.length - 1) {
        setTimeout(addEDDriverSO(allSOs[j], 0), 1000);
      } // last add operation, request update
      else {
        setTimeout(addEDDriverSO(allSOs[j], 1), 1000);
      }
    }
  } // editing an existing SO...
  else {
    // alert("editing so: " + editingSO + " for ce: " + contextualCE + "  cd: " + editingCD);
    $.ajax({
      url:
        "save-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(editingCD) +
        "&ce=" +
        encodeURIComponent(contextualCE) +
        "&project=" +
        Gcurrentstrategy +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&so=" +
        encodeURIComponent(editingSO) +
        "&desc=" +
        encodeURIComponent(soText),
      type: "POST",
      success: driverEDRefresh,
      error: driverEDOpFailed
      //,datatype: "json"
    });
  }
}

function addEDDriverSO(soText, update) {
  if (update == 1) {
    showTimedMessage("gmsg", "Adding strategic option...", 0, false);
    $.ajax({
      url:
        "add-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(editingCD) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        contextualCE +
        "&desc=" +
        encodeURIComponent(soText),
      type: "POST",
      success: driverEDRefresh,
      error: driverEDOpFailed
      //,datatype: "json"
    });
  } else {
    showTimedMessage("gmsg", "Adding strategic option...", 0, false);
    $.ajax({
      url:
        "add-driver-so.php?username=" +
        encodeURIComponent(Gusername) +
        "&token=" +
        encodeURIComponent(Gtoken) +
        "&driver=" +
        encodeURIComponent(editingCD) +
        "&project=" +
        encodeURIComponent(Gcurrentstrategy) +
        "&company=" +
        getCompanyForProject(Gcurrentstrategy) +
        "&bu=" +
        getBUForProject(Gcurrentstrategy) +
        "&ce=" +
        contextualCE +
        "&desc=" +
        encodeURIComponent(soText),
      type: "POST",
      success: showTimedMessage("gmsg", "Added another option...", 0, false),
      error: driverEDOpFailed
      //,datatype: "json"
    });
  }
}

function deleteStagItem(ce, cd, soid) {
  $(".opt_btn_wrp").hide();
  var command = "deleteStagItemInternal(" + ce + "," + cd + "," + soid + ")";
  // alert(command);
  myConfirm(
    "Confirm!",
    "Please confirm that you want to delete this strategic option",
    "OK",
    "Cancel",
    command
  );
}

function deleteStagItemInternal(ce, cd, soid) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();

  showTimedMessage("gmsg", "Removing strategic option...", 0, false);
  $.ajax({
    url:
      "delete-driver-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(cd) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&so=" +
      encodeURIComponent(soid),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}

function markCDImpactable(ce, cd) {
  $(".opt_btn_wrp").hide();
  var cdentry = getCDEntry(ce, cd);
  var impact = "";
  let kcd = cdentry[4][6];

  if (kcd == "1") {
    newcomment = prompt(
      "You have requested to carry forward a cost driver that is not impactable. Please document this departure from the recommended AIM&DRIVE process with a comment:",
      ""
    );
    if (newcomment == null || newcomment.valueOf() == "".valueOf()) {
      alert(
        "You must document this departure from the recommended AIM&DRIVE process"
      );
      return;
    }
  }
  // what is the current impact value
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    impact = cdentry[4][3];
    if (impact == null) impact = "";
  }
  // flip it to the other value
  if (impact.valueOf() == "YES".valueOf()) impact = "NO";
  else impact = "YES";

  // showTimedMessage("gmsg", "Toggling impactable...", 0, true);
  $.ajax({
    url:
      "save-driver.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&driver=" +
      encodeURIComponent(cd) +
      "&impact=" +
      encodeURIComponent(impact),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}

function markCDKey(ce, cd) {
  $(".opt_btn_wrp").hide();
  var cdentry = getCDEntry(ce, cd);

  var kcd = "0";
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    kcd = cdentry[4][6];
    if (kcd == null) kcd = "";
  }
  let impractable = cdentry[4][3];

  if (impractable == null || impractable == "NO") {
    newcomment = prompt(
      "You have requested to carry forward a cost driver that is not impactable. Please document this departure from the recommended AIM&DRIVE process with a comment:",
      ""
    );
    if (newcomment == null || newcomment.valueOf() == "".valueOf()) {
      alert(
        "You must document this departure from the recommended AIM&DRIVE process"
      );
      return;
    }
  }
  showTimedMessage("gmsg", "Set key cd...", 0, false);
  if (kcd.valueOf() == "1".valueOf()) kcd = "0";
  else kcd = "1";
  $.ajax({
    url:
      "set-kcd.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(cd) +
      "&ce=" +
      ce +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&val=" +
      encodeURIComponent(kcd),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}

function markCDEternal(ce, cd, keyp) {
  if (keyp) {
    myAlert(
      "ERROR!",
      "Unable to mark Cost Driver as Eternal since it is marked as Key Cost Driver. Unselect Key before marking Cost Driver as Eternal",
      "error"
    );
    return;
  }
  $(".opt_btn_wrp").hide();
  var cdentry = getCDEntry(ce, cd);
  var eternal = "";
  // what is the current eternal value
  if (
    cdentry != null &&
    cdentry.length >= 4 &&
    cdentry[4] != null &&
    cdentry[4].length > 0
  ) {
    eternal = cdentry[4][7];
    if (eternal == null) eternal = "";
  }
  // flip it to the other value
  if (eternal.valueOf() == "ETERNAL".valueOf()) eternal = "";
  else eternal = "ETERNAL";

  showTimedMessage("gmsg", "Toggling eternal...", 0, false);
  $.ajax({
    url:
      "save-driver.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&driver=" +
      encodeURIComponent(cd) +
      "&status=" +
      encodeURIComponent(eternal),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}

function markSOForKeeps(ce, cd, soid) {
  $(".opt_btn_wrp").hide();
  var soEntry = getSOEntry(ce, cd, soid);
  if (soEntry == null) {
    myAlert("NOTE", "Strategic option : " + soid + " not found", "error");
    return;
  }
  var selected = soEntry[2];
  var selString = "0";
  if (selected == null || selected.valueOf() == "0".valueOf()) selString = "1";
  else selString = "0";

  $.ajax({
    url:
      "save-driver-so.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&driver=" +
      encodeURIComponent(cd) +
      "&ce=" +
      encodeURIComponent(ce) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&so=" +
      encodeURIComponent(soid) +
      "&select=" +
      encodeURIComponent(selString),
    type: "POST",
    success: driverEDRefresh,
    error: driverEDOpFailed
    //,datatype: "json"
  });
}
/**
 * Called when edit primary cost button is clicked
 */
function editPrimaryCost() {
  $(".opt_btn_wrp").hide();
  $("#primarycost_modal").modal("show");
  $(".pcosttitle").text("Edit Primary Cost");
  document.getElementById("pcost_input").value = Gcurrentdata[Gprimeindex][0];
  document.getElementById("estamt_input").value = Gcurrentdata[Gprimeindex][1];
  document.getElementById("change_currency").value = GdefaultCurrency;
  generateCurrencyDatalist("currlist", "currencySelector");
  deactivateButton("pcost_submit");
  $(document).ready(function() {
    // $('input[type="submit"]').attr('disabled','disabled');
    $('input[type="text"]').on("keyup", function() {
      if ($(this).val != "") {
        $('input[type="submit"]').removeAttr("disabled");
      }
    });
  });
}

$(document).ready(function() {
  var len = 0;
  var maxchar = 64;
  history.pushState(null, null, location.href);
  window.onpopstate = function() {
    history.go(1);
  };
  $("#pcost_input").keyup(function() {
    len = this.value.length;
    if (len > maxchar) {
      return false;
    } else if (len > 0) {
      $("#chars").html("Remaining characters: " + (maxchar - len));
    } else {
      $("#chars").html("Remaining characters: " + maxchar);
    }
  });
  var verfiyN = 1;
  $("body").on("click", ".switch-main-contents", function(event) {
    selectedClientReports = "all";
    selectedSuppReports = "all";
    selectedDeptReports = "all";
    selectedRegionReports = "all";
    selectedYearReports = "all";
    event.preventDefault();
    var newPage = $(this).attr("switchThis");
    switchMainContents(newPage);
  });
  $(".error").hide();
  $('input[type="text"]').on("keyup", function() {
    if ($(this).val != "") {
      $('input[type="submit"]').removeAttr("disabled");
    }
  });
  $(".ss-action").on("click", function() {
    let value = $(this).val();

    if (value !== "progress") $(".progress-div").hide();
    else $(".progress-div").show();
  });
  $("body").on("click", ".action_stat_wrap", function() {
    var elements = this.id.split("-");

    let GcurrentAction = parseInt(elements[1]);

    let ratOpn = localStorage.getItem("toggleId");

    if ("action-actions-" + GcurrentAction == ratOpn) {
      if ($("#" + ratOpn).css("visibility") == "hidden") {
        $("#" + ratOpn).css("visibility", "hidden");
      } else $("#" + ratOpn).css("visibility", "visible");
    } else {
      $(".verifydropdown").css("visibility", "hidden");
    }
  });
});

function errorEDFun(response) {
  showTimedMessage("gmsg", response[1], 0, true);
}

function Pcostoption(pcostOpn) {
  var isoptionOpen = pcostOpn
    .parent()
    .find(".opt_btn_wrp")
    .css("display");
  if (isoptionOpen == "none") {
    $(".opt_btn_wrp").hide();
    pcostOpn
      .parent()
      .find(".opt_btn_wrp")
      .toggle();
  } else {
    pcostOpn
      .parent()
      .find(".opt_btn_wrp")
      .toggle();
  }
}

function activateButton(id) {
  $("#" + id).addClass("activeBtn");
}

function deactivateButton(id) {
  $("#" + id).removeClass("activeBtn");
}
/**
 * Setting up the values for the strategy statement modal
 * @param {number} ss - strategy statement id
 */
function setupUpdateVal(ss) {
  console.trace();
  console.log(ss);
  let allStrategies = Gcurrentdata[Grbindex];
  let currentStrategy = allStrategies.filter(function(strategies) {
    return strategies[0] == ss;
  });
  var oentry = currentStrategy[0];
  var performance = getSummaryPerformanceAlt(oentry);
  var ssname = oentry[1];
  var constraints = oentry[2];
  var priority = oentry[3];
  var pclass = " low_priority";
  if (priority.valueOf() == "HIGH".valueOf()) pclass = " high_priority";
  else if (priority.valueOf() == "MEDIUM".valueOf())
    pclass = " medium_priority";
  var sshandle = oentry[12];
  var fixedhandle = sshandle;
  if (sshandle.length > 8)
    fixedhandle =
      '<span title="' + sshandle + '">' + sshandle.substring(0, 8) + "</span>";

  document.getElementById("ssHeaderBen").innerHTML =
    '<span class="stat_count">' +
    fixedhandle +
    "</span>" +
    '<span class="Priority_type ' +
    pclass +
    '">' +
    priority +
    "</span>";

  var selected = oentry[9];
  var actionCount = oentry[6].length;
  var ownerString = "";
  var performers = getActionOwners(oentry[6]);
  for (var j = 0; j < performers.length; j++) {
    ownerString =
      ownerString + generateProfileIconFromId(performers[j], "owner_count");
  }

  GcurrentSS = ss;
  // document.getElementById("vCount").innerHTML = (num+1);
  document.getElementById("vSS").innerHTML = ssname;
  document.getElementById("vNPV").innerHTML = CurrencyFormat(
    performance[0] + performance[1] - performance[2],
    GdefaultCurrency,
    0,
    "",
    ","
  );
  var actualSavings = oentry[13];
  if (actualSavings != null) {
    var valueRealisedTotal = 0;
    for (var k = 0; k < actualSavings.length; k++) {
      if (
        actualSavings[k][5] == "Cost Improvement" ||
        actualSavings[k][5] == "Revenue Improvement"
      ) {
        valueRealisedTotal = valueRealisedTotal + parseInt(actualSavings[k][0]);
      } else {
        valueRealisedTotal = valueRealisedTotal - parseInt(actualSavings[k][0]);
      }
    }
  }
  valueRealisedTotal = CurrencyFormat(
    valueRealisedTotal,
    GdefaultCurrency,
    0,
    "",
    ","
  );
  document.getElementById("vPerformers").innerHTML = ownerString;
  document.getElementById("vNumActions").innerHTML = actionCount + "";
  document.getElementById("vRealized").innerHTML = valueRealisedTotal;
}
/**
 * Add value realized to a strategy statement
 */
function addNPVtoSS() {
  $("#update_val_modal").modal("hide");
  var val = document.getElementById("value_realized").value;
  if (!validNumber("value_realized")) {
    showTimedMessage(
      "gmsg",
      "Value realized cannot be blank and should be a number only!",
      0,
      true
    );
  }
  val = extractNumber(document.getElementById("value_realized").value);
  let verifyRisksType = $("#verifyRisksType").val();

  var notes = document.getElementById("notesNPV").value;
  var updateDate = getDateById("vDate-Picker");
  updateDate = updateDate.split(",");
  updateDate = updateDate[0];
  var savingsId = $("#savingsId").val();
  $.ajax({
    url:
      "add-ss-savings.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&ss=" +
      GcurrentSS +
      "&comment=" +
      encodeURIComponent(notes) +
      "&date=" +
      encodeURIComponent(updateDate) +
      "&value=" +
      encodeURIComponent(val) +
      "&savingstype=" +
      encodeURIComponent(verifyRisksType) +
      "&savingsId=" +
      encodeURIComponent(savingsId),
    type: "POST",
    success: updateVerifyContents,
    error: progOpFailed
    //,datatype: "json"
  });
}

function deleteEDDocument(docid) {
  $(".opt_btn_wrp").hide();
  var command = "deleteEDDocumentInternal(" + docid + ")";

  myConfirm(
    "Confirm!",
    "Please confirm that you want to delete this document",
    "OK",
    "Cancel",
    command
  );
}

function deleteEDDocumentInternal(docid) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  showTimedMessage("gmsg", "Removing document...", 0, false);
  $.ajax({
    url:
      "delete-document.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&document=" +
      docid +
      "&project=" +
      Gcurrentstrategy +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy),
    type: "POST",
    success: updateBackground,
    error: docEDFailed
  });
}

function docEDFailed(resp) {
  showTimedMessage("gmsg", "Doc operation failed", 0, true);
}

function deleteParticipant(perf) {
  myConfirm(
    "Please Confirm!",
    "Please confirm that you want to remove this participant",
    "OK",
    "Cancel",
    "deleteParticipantInternal(" + perf + ")"
  );
  $(".opt_btn_wrp").hide();
}
/**
 * Deletes a participant of a particular project
 * @param {number} perf - Person Id
 */
function deleteParticipantInternal(perf) {
  $("#myconfirm_modal").modal("hide");
  $(".opt_btn_wrp").hide();
  var participantData = {
    token: Gtoken,
    username: Gusername,
    participant: perf,
    type: "participant",
    project: Gcurrentstrategy
  };
  $.ajax({
    url: "delete-person.php",
    type: "POST",
    data: {
      data: JSON.stringify(participantData)
    },
    success: refreshEDTeam,
    error: teamOpFailed
  });
}
// update task with status
function saveTaskStatus(task) {
  $("#myconfirm_modal").modal("hide");
  editingTask = task;
  var cbid = "taskselect-" + task;
  var cb = document.getElementById(cbid);
  var status = "??";
  if (cb.checked) status = "Completed";
  $.ajax({
    url:
      "save-project-task.php?username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken) +
      "&project=" +
      Gcurrentstrategy +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&task=" +
      task +
      "&status=" +
      encodeURIComponent(status),
    type: "POST",
    success: addExistingTaskPerformers,
    error: backOpFailed
    //,datatype: "json"
  });
}

function changeProjectStatus(stat) {
  var status = "COMPLETED";
  if (stat == 2) status = "INACTIVE";
  else if (stat == 3) status = "";

  $("#projOptions").toggle();
  showTimedMessage("gmsg", "Saving project status...", 4000, false);
  $.ajax({
    url:
      "save-project.php?" +
      "&obj=" +
      encodeURIComponent(Gcurrentstrategy) +
      "&company=" +
      getCompanyForProject(Gcurrentstrategy) +
      "&bu=" +
      getBUForProject(Gcurrentstrategy) +
      "&status=" +
      encodeURIComponent(status) +
      "&username=" +
      encodeURIComponent(Gusername) +
      "&token=" +
      encodeURIComponent(Gtoken),
    type: "POST",
    success: updateEDStrategiesAfterStatusChange,
    error: strategyEDOpFailed
    //,datatype: "json"
  });
}

function refreshEDStrategiesStatusChange(response) {
  var result = JSON.parse(response);
  if (result[0].valueOf() != "".valueOf()) {
    showTimedMessage("gmsg", result[1], 0, true);
    return;
  }
  Gstrategies = result[1];

  showTimedMessage("gmsg", "Project data successfully refreshed", 5000, false);
}
var criticalNodesToShow = [];
var allCriticalCosts = [];
var db_reducetable = [];
var db_implementtable = [];
function isCostCritical(ce) {
  for (var i = 0; i < allCriticalCosts.length; i++) {
    if (ce == allCriticalCosts[i]) return true;
  }
  return false;
}
function isCostVisible(ce) {
  for (var i = 0; i < criticalNodesToShow.length; i++) {
    if (ce == criticalNodesToShow[i]) return true;
  }
  return false;
}
function markParentsVisible(node) {
  if (node == null) return; // means nothing to do
  var ce = node[7]; // ce id
  for (var i = 0; i < criticalNodesToShow.length; i++) {
    if (criticalNodesToShow[i] == ce) return;
  }
  criticalNodesToShow.push(ce);
  var parentNode = node[9];
  if (parentNode == null) return;
  oFindNode(costTree[0], parentNode[7]);
  markParentsVisible(selectedNode);
}
var maxHeight = 664;
var sentinel = "&&**()()";
var behindColor = "rgba(235, 86, 42, 1)",
  ongoingColor = "rgba(68, 140, 203, 1)",
  completedColor = "rgba(84, 178, 59, 1)";
var progressBarChartCursor = 0; // this will move around
var progressBarChartLowerCursor = 0;
var valBarChartCursor = 0; // this will move around
var valBarChartLowerCursor = 0;
var valBarChartSize = 7; // this is how many we can show at a time...
var totalRevenueImprovement,
  totalCostSavings,
  totalValueDelivered,
  totalValueUndelivered;
var allSS = [];
var selectedSS = [];
var eternalSS = [];
var unselectedSS = [];
var activeSS = [];
var lateSS = [];
var completedSS = [];
var progressSSActions = [];
var ganttChartData = [];
var ganttLowerCursor = -1;
var ganttUpperCursor = 1000;
var manValuesByProjectData = [];
var manValuesSize = 2;
var manLowerCursor = -1;
var manUpperCursor = 1000;
var manProjects = [];
var manActive = 0,
  manCompleted = 0,
  manDropped = 0;
var lastManDataRetrieved = -1;
var allManProjectsData = [];
var allManProjectsDataTemp = [];
var GmgmtReportCurrency = "";
var valueLineSize = 2;
var valueUpperCursor = 0;
var valueLowerCursor = -1;
var trendLineConfig1;
var manAllProjectsData = [];
var manAllPendingActionsData = [];
var manReverseUserData = [];
var addManUserDataCount = 0;
let selectedClientReports = "all";
let selectedSuppReports = "all";
let selectedDeptReports = "all";
let selectedRegionReports = "all";
let selectedYearReports = "all";

function getParentString(node) {
  if (node == null) return "";
  if (node[9] == null) return "";
  var parentNode = node[9];
  return getParentString(parentNode) + sentinel + parentNode[0];
}
//individual report starts here
/**
 * Close Out Report of a project
 */
function refreshCOR() {
  criticalNodesToShow = [];
  temptable = [];
  allCriticalCosts = [];
  db_reducetable = [];
  db_implementtable = [];
  let milestones = [];

  var pname = getStrategyName(Gcurrentstrategy);
  var compname = getCompanyName(getCompanyForProject(Gcurrentstrategy));
  let spend = "";
  for (var es = 0; es < Gcurrentdata[19].length; es++) {
    spend +=
      "<li>" +
      Gcurrentdata[19][es][1] +
      " is " +
      CurrencyFormat(Gcurrentdata[19][es][2], GdefaultCurrency, 0, "", ",") +
      " </li>";
  }

  var body = `<a href="close-out-report.php?id=${Gcurrentstrategy}" target="_blank" id="renderPdf">download report</a><br/>`;
  body +=
    "	<!-- intro_screen --> " +
    "    <!-- section 1 -->    " +
    '    <div id="close_out_report"><section class="sec_blue sec_wrapper">' +
    '        <div class="sec_head">' +
    '            <h1 class="sec_title">CLOSE OUT REPORT</h1>' +
    "        </div>" +
    "        " +
    '        <div class="sec_body">' +
    '        	<h2 class="sec_subtitle">' +
    pname +
    "<br><strong>" +
    compname +
    "</strong></h2>" +
    "         " +
    "        </div>" +
    "        " +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    "            " +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "	<!-- section 1 -->    " +
    '	<section class="sec_wrapper">' +
    '        <div class="sec_head">' +
    '            <!-- <h1 class="sec_title">Process Overview</h1> -->' +
    '            <h2 class="sec_subtitle">AIM & DRIVE Methodology</h2>' +
    "        </div>" +
    "        " +
    '        <div class="sec_body">' +
    "        	<p>The Cost Challenge follows a rigorous and structured approach to arrive at the Opportunities/Strategies using the AIM&DRIVE methodology</p>" +
    "			<p>	The objective is to maximize value from contracts and/or categories through improvements in  productivity, efficiency, planning, waste elimination and optimization of specifications without adversely impacting Safety and Operational risk </p>" +
    '            <img src="images/1_bg.png" width="100%"/>' +
    "        </div>" +
    "        " +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    "            " +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 2 --> " +
    '    <section class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head">' +
    '           <!--  <h1 class="sec_title">Process Overview</h1> -->' +
    '            <h2 class="sec_subtitle">AIM & DRIVE Methodology</h2>' +
    "        </div>" +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<ul class="process_list">' +
    "            	<li>" +
    '                	<div class="data_list">' +
    "                    	Agreeing on the need to manage costs" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Define team goals <br/>" +
    "						Identify pain points / areas of improvement <br/>" +
    "						Document past initiatives" +
    "                    </div>" +
    "                </li>" +
    "                " +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Identifying critical costs in the supply chain" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Develop cost breakdown and select critical costs<br>" +
    "                    	Develop process maps" +
    "                    </div>" +
    "                </li>" +
    "                " +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Measuring secondary and tertiary costs" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Develop list of cost drivers for each critical cost<br>" +
    "					    (using a proprietary methodology called Formula Based Costing)" +
    "                    </div>" +
    "                </li>" +
    "                " +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Defining Key Cost Drivers and Developing Strategic Options" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Select key cost drivers<br>" +
    "						Develop list of strategic options (Factors)<br>" +
    "						Identify the critical strategic options " +
    "                    </div>" +
    "                </li>" +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Reducing, Changing, or Eliminating activities that cause costs : Strategies" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                        Develop strategy statements<br>Identify and quantify Benefits and Risks/Costs for each Strategy<br>Prioritize Strategies for Implementation" +
    "					" +
    "                    </div>" +
    "                </li>" +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Implementing an action plan" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Develop detailed implementation plan for each strategy (action items, owners, and due dates)" +
    "                    </div>" +
    "                </li>" +
    "                <li>" +
    '                	<div class="data_list">' +
    "                    	Verifying the plan with cost monitors" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Document savings and value realized" +
    "                    </div>" +
    "                </li>" +
    "                 <li>" +
    '                	<div class="data_list">' +
    "                    	Eternally improving and modifying the process" +
    "                    </div>" +
    "                    " +
    '                    <div class="data_desc">' +
    "                    	Revisit the AIM&DRIVE process for further improvement opportunities and value addition" +
    "                    </div>" +
    "                </li>" +
    "                " +
    "            </ul>" +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 4 --> " +
    '    <section class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head">' +
    '            <h1 class="sec_title">Overview</h1>' +
    "        </div>" +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<ul class="topic_list">' +
    "                <li>" +
    Gcurrentdata[1] +
    "</li>";
  for (var ml = 0; ml < Gcurrentdata[23].length; ml++) {
    body +=
      "<li>" +
      Gcurrentdata[23][ml][1] +
      " " +
      getPrintDate(Gcurrentdata[23][ml][2]) +
      "</li>";
  }
  body +=
    "                " +
    spend +
    "            </ul>" +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 5 --> " +
    '    <section class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head">' +
    '            <h1 class="sec_title">Past Initiatives</h1>' +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<table class="table past_init_table">' +
    "            	<thead>" +
    "                    <tr>" +
    '                        <th width="10%">Year</th>' +
    '                        <th width="60%">Initiative</th>' +
    '                         <th width="20%">Savings</th>' +
    '                         <th width="10%">Status</th>' +
    "                    </tr>" +
    "                </thead>" +
    "                " +
    "                <tbody>";

  for (var i = 0; i < Gcurrentdata[Gpastinitindex].length; i++) {
    var initEntry = Gcurrentdata[Gpastinitindex][i];
    var id = initEntry[0];
    var desc = initEntry[1];
    var year = initEntry[2];
    var val = initEntry[3];
    var delval = initEntry[4];
    var status = initEntry[5];

    body =
      body +
      "                    <tr>" +
      "                        <td>" +
      year +
      "</td>" +
      "                     " +
      "                        <td>" +
      desc +
      "</td>" +
      "                        <td>" +
      CurrencyFormat(val, GdefaultCurrency, 0, "", ",") +
      "</td>" +
      "                         <td>" +
      status +
      "</td>" +
      "                    </tr>";
  }
  body =
    body +
    "</tbody>" +
    "                </thead>" +
    "            </table>" +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 6 --> " +
    '    <section id="temp" class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head">' +
    '            <ul class="tab">' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Agree</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<table class="table goal_table">' +
    "            	<thead>" +
    "                    <tr>" +
    '                        <th width="20%">Perspective</th>' +
    '                        <th width="80%">Goal</th>' +
    "                    </tr>" +
    "                </thead>" +
    "                " +
    "                <tbody>";
  if (Gcurrentdata[Ggoalsindex] != null) {
    var coveredPerspectives = [];
    for (var i = 0; i < Gcurrentdata[Ggoalsindex].length; i++) {
      var currentPersp = Gcurrentdata[Ggoalsindex][i][1];
      var goal = Gcurrentdata[Ggoalsindex][i][0];
      body = body + "<tr><td>" + currentPersp + "</td><td>";
      body = body + goal;
      body = body + "</td></tr>";
      var temp = {};
      temp["perspective"] = currentPersp;
      temp["goal"] = goal;
      temptable.push(temp);
    }
  }
  body =
    body +
    "                </tbody>" +
    "            </table>" +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 7 --> " +
    '    <section class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head tab_section">' +
    '            <ul class="tab">' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agree</a></li>' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>";

  // calculate percentages...

  var total_cost = 0,
    total_critical_cost = 0,
    numCCEs = 0;
  if (Gcurrentdata[Gprimeindex] == null || Gcurrentdata[Gprimeindex][0] == null)
    return;
  costTree = [
    [
      Gcurrentdata[Gprimeindex][0],
      Gcurrentdata[Gprimeindex][1],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      0
    ], // in ED design, only the first will be used...
    [
      "Acquisition Cost",
      Gcurrentdata[Gprimeindex][5],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      1
    ],
    [
      "Usage Cost",
      Gcurrentdata[Gprimeindex][6],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      2
    ],
    [
      "End of Life Cost",
      Gcurrentdata[Gprimeindex][7],
      [],
      "",
      "",
      "",
      "NO",
      -1,
      Gcurrentdata[Gprimeindex][3],
      null,
      3
    ]
  ];

  // alert("idContents 6");

  // make the ce the last value (we need this to do saves in incremental fashion)
  var parents = [
    [
      costTree[0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0],
      ["", "", [], "", "", "", "NO", "", "", null, 0]
    ],
    [
      costTree[1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1],
      ["", "", [], "", "", "", "NO", "", "", null, 1]
    ],
    [
      costTree[2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2],
      ["", "", [], "", "", "", "NO", "", "", null, 2]
    ],
    [
      costTree[3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3],
      ["", "", [], "", "", "", "NO", "", "", null, 3]
    ]
  ];
  var currentlevel = 0;
  var currentcost = 0; // indicates the tree number
  if (Gcurrentdata[Gelementsindex] != null) {
    // this will be an array: 1st entry has cost element details;
    // 2nd entry has a list of critical cost elements -- determined by the user
    if (Gcurrentdata[Gelementsindex][0] != null) {
      for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
        var element = Gcurrentdata[Gelementsindex][0][i];
        var ce = element[0];
        var cename = element[1];
        var level = element[2];
        var val = element[4];
        if (typeof val == "string") val = parseFloat(val);
        var imp = element[5];
        var fut = element[6];
        var com = element[7];
        var ordering = element[3];
        var costtype = element[10];
        if (typeof costtype == "string") costtype = parseInt(costtype); // should be 0, 1, 2, or 3...
        var selected = "NO";

        // see if the cost element is listed as critical going forward
        if (Gcurrentdata[Gelementsindex][1] != null) {
          for (var k = 0; k < Gcurrentdata[Gelementsindex][1].length; k++) {
            if (
              (ce + "").valueOf() ==
              (Gcurrentdata[Gelementsindex][1][k] + "").valueOf()
            )
              selected = "YES";
          }
        }
        // last "" ==> is the units of the value/future
        // cost element key: fcf == 4, impactable == 3, selected == 6, comment == 5, ordering == 8
        var newnode = [
          cename,
          val,
          [],
          imp,
          fut,
          com,
          selected,
          ce + "",
          ordering,
          null,
          costtype
        ];

        if (level == currentlevel + 1) {
          // make it a child of the prior level top of the stack
          parents[costtype][currentlevel][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel];
        } else if (level == currentlevel) {
          // sibling
          parents[costtype][currentlevel - 1][2].push(newnode);
          newnode[9] = parents[costtype][currentlevel - 1];
        } // we are going back to an earlier node
        else {
          parents[costtype][level - 1][2].push(newnode);
          newnode[9] = parents[costtype][level - 1];
        }
        parents[costtype][level] = newnode;
        currentlevel = level;
      }
    }
  }
  allNodeCosts = []; // reset the whole cost structure
  computeBottomUpCosts(costTree[0]);

  var numCriticalCosts = 0;
  if (Gcurrentdata[Gelementsindex][0] != null) {
    for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
      var element = Gcurrentdata[Gelementsindex][0][i];
      var ce = element[0];
      var cename = element[1];
      var level = element[2];
      var val = getComputedCost(ce);
      if (typeof val == "string") val = parseFloat(val);
      var selected = "NO";
      oFindNode(costTree[0], ce);
      var node = selectedNode;
      if (node == null) continue;
      // alert("node found " + ce + " cost " + val);
      if (node[2] == null || node[2].length == 0) total_cost = total_cost + val;
      if (node[6] != null && node[6].valueOf() == "YES".valueOf()) {
        total_critical_cost = total_critical_cost + val;
        numCriticalCosts = numCriticalCosts + 1;
        allCriticalCosts.push(ce);
        markParentsVisible(node);
      }
    }
  }
  var percent = 0;
  if (total_cost != 0)
    percent = numberFormat((total_critical_cost / total_cost) * 100, 2);

  let nonCriticalCost = total_cost - total_critical_cost;
  let criticalCost = total_critical_cost;
  body =
    body +
    "			 <h2>The team identified " +
    percent +
    "% of the total cost to be critical</h2>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    "        	" +
    '            <div id="chartdiv7" class="cost_chart pull-left"></div>' +
    "            " +
    '            <section class="cost_chart_values">' +
    '            	<ul class="cost_indicator">' +
    '                    <li class="total_cost">' +
    '                        <span class="color_indicator"></span>Total Non-Critical cost:' +
    '                        <strong class="value">' +
    CurrencyFormat(
      total_cost - total_critical_cost,
      GdefaultCurrency,
      0,
      "",
      ","
    ) +
    "</strong>" +
    "                    </li>" +
    "                    " +
    '                    <li class="critical_cost">' +
    '                        <span class="color_indicator"></span>Total critical cost:' +
    '                       <strong class="value">' +
    CurrencyFormat(total_critical_cost, GdefaultCurrency, 0, "", ",") +
    "</strong>" +
    "                    </li>" +
    "                    " +
    "                </ul>   " +
    "            </section>" +
    "            " +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    " +
    "    <!-- section 8 --> " +
    '    <section class="sec_wrapper identify_wrapper"> ' +
    "        <!------ header ------> " +
    '        <div class="sec_head tab_section"> ' +
    '            <ul class="tab"> ' +
    '                <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agree</a></li> ' +
    '                <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Identify</a></li> ' +
    '                <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li> ' +
    '                <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Reduce</a></li> ' +
    '                <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li> ' +
    "            </ul> " +
    "            <h2>The team has chosen to focus their improvement efforts on " +
    numCriticalCosts +
    " critical costs</h2> " +
    "        </div> " +
    " " +
    "        <!------ body ------> " +
    '        <div class="sec_body"> ' +
    "            <ul> " +
    "                <li> " +
    '                    <table class="table cost_breakdown_head"> ' +
    "                        <tr> " +
    '                            <td width="65%">Cost item</td> ' +
    '                            <td width="20%">Cost($) </td> ' +
    '                            <td width="15%">Percentage</td> ' +
    "                        </tr> " +
    "                    </table> " +
    "                </li> " +
    "            </ul> " +
    '            <ul class="cost_breakdown_list"> ' +
    '                <li class="critical_bg font18"> ' +
    "                    <table> " +
    "                        <tr> " +
    '                            <td colspan="3" width="100%" class="headitem"> ' +
    "                                <span>Drilling fluids and waste management</span> " +
    '                                <span class="arrow-right">&nbsp;</span> ' +
    "                                <span>Utilization</span> " +
    "                            </td> " +
    "                        </tr> " +
    "                        <tr> " +
    '                            <td width="65%">Vacuum technologies ' +
    "                            </td> " +
    " " +
    '                            <td width="20%">7,151,880 </td> ' +
    " " +
    '                            <td width="15%">17.49%</td> ' +
    "                        </tr> " +
    "                    </table> " +
    "                </li> " +
    "            </ul> " +
    "        </div> " +
    " " +
    "        <!------ footer ------> " +
    '        <div class="sec_footer"> ' +
    '            <img src="images/logo.png" class="pull-left" /> ' +
    '            <span class="page_no pull-right"></span> ' +
    "        </div> " +
    " " +
    "    </section> ";

  // need two passes because of the format of the report *&#$%!@#**
  var numKCDs = 0,
    numAllDrivers = 0;
  for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
    var celement = Gcurrentdata[Gcdindex][i];
    var cdCEID = celement[0];
    var cename = celement[1];
    if (!isCostCritical(cdCEID)) continue;
    var numdrivers = 0;
    if (celement[2] != null) numdrivers = celement[2].length;
    if (numdrivers == 0) continue;
    numAllDrivers = numAllDrivers + numdrivers;
    for (j = 0; j < numdrivers; j++) {
      var cdentry = celement[2][j];
      if (cdentry == null) continue;
      var cdid = cdentry[0];
      var cdname = cdentry[1];
      var keyp = false;
      var keycd = "";
      if (
        cdentry != null &&
        cdentry.length >= 4 &&
        cdentry[4] != null &&
        cdentry[4].length > 0
      ) {
        keycd = cdentry[4][6];
        if (keycd != null && keycd.valueOf() == "1".valueOf())
          numKCDs = numKCDs + 1;
      }
    }
  }

  body =
    body +
    "    <!-- section 9 --> " +
    '    <section class="sec_wrapper mand_wrapper">' +
    "    	<!------ header ------>" +
    '       <div class="sec_head tab_section">' +
    '                        <ul class="tab">' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agree</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>" +
    "			 <h2>The team identified the following cost drivers and strategic options for further analysis:</h2>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    "        </div>" +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>";

  // Reduce step report is next
  var highGain = 0,
    medGain = 0,
    lowGain = 0;
  var totalCostReduction = 0,
    totalRevenueImprovement = 0;
  var numStrategies = Gcurrentdata[Grbindex].length;
  var totalSelected = 0;
  var ssTable = [];
  var selectedCostReduction = 0,
    selectedRevenueImprovement = 0;
  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    var ss = oentry[0];
    var ssname = oentry[1];
    var constraints = oentry[2];
    var priority = oentry[3];
    var risks = oentry[4];
    var benefits = oentry[5];
    var selected = oentry[9];
    var sshandle = oentry[12];
    var performance = getSummaryPerformanceAlt(oentry);
    performanceObj = performance[5];
    var unimplemented = oentry[31];
    var dropped = oentry[21];
    if (unimplemented == "1") continue;
    if (dropped == "1") continue;
    if (selected.valueOf() == "SELECTED".valueOf()) {
      if (priority.valueOf() == "HIGH".valueOf()) {
        highGain =
          highGain + performanceObj.benefitVal - performanceObj.riskVal;
      } else if (priority.valueOf() == "LOW".valueOf()) {
        lowGain = lowGain + performanceObj.benefitVal - performanceObj.riskVal;
      } else {
        medGain = medGain + performanceObj.benefitVal - performanceObj.riskVal;
      }
      totalCostReduction = highGain + lowGain + medGain;
      totalRevenueImprovement =
        totalRevenueImprovement + performanceObj.riskVal;
      totalSelected = totalSelected + 1;
      selectedCostReduction = selectedCostReduction + performance[0];
      selectedRevenueImprovement =
        selectedRevenueImprovement + performanceObj.riskVal;
      ssTable.push([
        "<strong>" + sshandle + "</strong><br>" + ssname,
        priority,
        performance[0],
        performance[1]
      ]);
    }
  }

  body =
    body +
    "    <!-- section 11 --> " +
    '    <section class="sec_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head tab_section">' +
    '            <ul class="tab">' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agrees</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>" +
    "			 <h2>The Total Value identified from the Strategies selected for Implementation is " +
    CurrencyFormat(totalCostReduction, GdefaultCurrency, 0, "", ",") +
    "</h2>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    "        	<div>" +
    '            <div id="chartdiv11" class="priority_chart pull-left"></div>' +
    '            <section class="priority_chart_values">' +
    '            	<ul class="priority_indicator">' +
    '                    <li class="high_indicator">' +
    '                        <span class="color_indicator"></span>High priority strategies' +
    '                        <strong class="value">' +
    CurrencyFormat(highGain, GdefaultCurrency, 0, "", ",") +
    "</strong>" +
    "                    </li>" +
    "                    " +
    '                    <li class="medium_indicator">' +
    '                        <span class="color_indicator"></span>Medium priority strategies' +
    '                       <strong class="value">' +
    CurrencyFormat(medGain, GdefaultCurrency, 0, "", ",") +
    " </strong>" +
    "                    </li>" +
    "                    " +
    '                    <li class="low_indicator">' +
    '                        <span class="color_indicator"></span>Low priority strategies' +
    '                         <strong class="value">' +
    CurrencyFormat(lowGain, GdefaultCurrency, 0, "", ",") +
    "</strong>" +
    "                    </li>" +
    "                </ul>  " +
    "               " +
    "            </section>" +
    '            <div class="clearfix"></div>	' +
    "            </div>" +
    '            <p class="strategi_para">' +
    (numStrategies - totalSelected) +
    " additional strategies were  rejected. To see more details of each strategy, please refer to the R step online.</p> 		" +
    "    " +
    "            " +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "    </section>" +
    "    " +
    "    <!-- section 12 --> " +
    '    <section class="sec_wrapper reduce_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head tab_section">' +
    '            <ul class="tab">' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agree</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>" +
    "			 <h2>The Total Value identified from the Strategies selected for Implementation " +
    CurrencyFormat(totalCostReduction, GdefaultCurrency, 0, "", ",") +
    "</h2>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<table class="table strategy_stat_table reduce_table">' +
    "            	<thead>" +
    "                    <tr>" +
    '                        <th width="55%">Strategy Statement</th>' +
    '                        <th width="15%">Priority</th>' +
    '                        <th class="text-right" width="15%">Net Cost Improvement (' +
    GdefaultCurrency +
    ")</th>" +
    '                        <th class="text-right" 	width="15%">Net Revenue Improvement (' +
    GdefaultCurrency +
    ")</th>" +
    "                    </tr>" +
    "                </thead>" +
    "                " +
    '                <tbody><TR class="critical_bg"><TD>&nbsp;</TD><TD>&nbsp;</TD><TD>&nbsp;</TD><TD>&nbsp;</TD></TR></TBODY></TABLE>';

  for (var i = 0; i < ssTable.length; i++) {
    var entry = {
      statement: ssTable[i][0],
      priority: ssTable[i][1],
      cost: CurrencyFormat(ssTable[i][2], "", 0, "", ","),
      revenue: CurrencyFormat(ssTable[i][3], "", 0, "", ",")
    };
    db_reducetable.push(entry);
  }
  body =
    body +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>" +
    "    ";

  body =
    body +
    "    <!-- section 14 --> " +
    '	<section class="sec_wrapper implement_wrapper">' +
    "    	<!------ header ------>" +
    '        <div class="sec_head tab_section">' +
    '            <ul class="tab">' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Agree</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Identify</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Measure & Define</a></li>' +
    '			    <li><a style="background-color: #d5e2ed" href="javascript:void(0)">Reduce</a></li>' +
    '			    <li><a style="background-color: #2b4b74; color: #d5e2ed;border-color: #2b4b74" href="javascript:void(0)">Implement</a></li>' +
    "			 </ul>" +
    "			 <h2>The team is committed to completing the following actions and delivering the value identified</h2>" +
    "        </div>" +
    "        " +
    "        <!------ body ------>" +
    '        <div class="sec_body">' +
    '        	<table class="table strategy_stat_table implement_strategy_table">' +
    "            	<thead>" +
    "                    <tr>" +
    '                        <th width="55%">Strategy Statement</th>' +
    '                        <th width="15%">Priority</th>' +
    '                        <th class="text-right" width="15%">Net Cost Improvement</th>' +
    '                        <th class="text-right" width="15%">Net Revenue Improvement</th>' +
    "                    </tr>" +
    "                </thead>" +
    "                " +
    "                <tbody></tbody></table>" +
    '            <table class="table action_table implement_action_table">' +
    "            	<thead>" +
    "                    <tr>" +
    '                        <th width="55%">Action Item</th>' +
    '                        <th width="25%">Performer</th>' +
    '                        <th class="text-right" width="20%">Target Date</th>' +
    "                    </tr>" +
    "                </thead>" +
    "                " +
    "                <tbody></tbody></table>";

  for (var i = 0; i < Gcurrentdata[Grbindex].length; i++) {
    var oentry = Gcurrentdata[Grbindex][i];
    if (oentry == null) continue;
    var ss = oentry[0];
    performance = getSummaryPerformanceAlt(oentry);

    var ssname = oentry[1];
    var constraints = oentry[2];
    var priority = oentry[3];
    var risks = oentry[4];
    var benefits = oentry[5];
    var selected = oentry[9];
    //come here
    var sshandle = oentry[12];
    var unimplemented = oentry[31];
    var dropped = oentry[21];
    if (unimplemented == "1") continue;
    if (dropped == "1") continue;
    if (selected.valueOf() != "SELECTED".valueOf()) continue;

    var stratEntry = {
      strategy: sshandle,
      statement: ssname,
      priority: priority,
      cost: CurrencyFormat(performance[0], GdefaultCurrency, 0, "", ","),
      revenue: CurrencyFormat(performance[1], GdefaultCurrency, 0, "", ",")
    };
    var actionEntries = [];

    for (j = 0; j < oentry[6].length; j++) {
      var actionid = oentry[6][j][0];
      var atext = oentry[6][j][1];
      var adead = oentry[6][j][2];
      // alert("action deadline: " + adead);
      if (
        !(
          adead == null ||
          adead.valueOf() == "".valueOf() ||
          adead.valueOf() == "null".valueOf()
        )
      )
        adead = getPrintDate(adead);
      else adead = "TBD";
      var awho = oentry[6][j][3];
      if (awho == null || awho === "") awho = "None";
      else {
        awho = awho.split(",");
        awho = generateFullNameFromId(awho[0], "");
      }
      var actionEntry = {
        action: atext,
        author: awho,
        targetdate: adead
      };
      actionEntries.push(actionEntry);
    }
    stratEntry["actionitems"] = actionEntries;

    db_implementtable.push(stratEntry);
  }

  body =
    body +
    "        </div>" +
    "        " +
    "        <!------ footer ------>" +
    '        <div class="sec_footer">' +
    '            <img src="images/logo.png" class="pull-left" />' +
    '            <span class="page_no pull-right"></span>' +
    "        </div>" +
    "        " +
    "    </section>";
  body =
    body +
    "    " +
    "    <!-- section 1 -->    " +
    '    <section class="sec_blue">' +
    '        <div class="sec_head">' +
    '            <h1 class="sec_title">THANK YOU</h1>' +
    "        </div>" +
    "    </section>" +
    "   </div> ";
  document.getElementById("mainbody").innerHTML = body;
  // add the chart initialization stuff here

  // adjust the goals table
  // alert("got here 0");
  jQuery("#temp").each(function() {
    // alert("got here 1");
    addgoalpagebreak($(this), 0);
  });

  jQuery(".identify_wrapper").each(function() {
    var db_identifytable = [];
    if (Gcurrentdata[Gelementsindex][0] != null) {
      for (var i = 0; i < Gcurrentdata[Gelementsindex][0].length; i++) {
        var element = Gcurrentdata[Gelementsindex][0][i];
        var ce = element[0];
        var cename = element[1];
        var level = element[2];
        var val = getComputedCost(ce);
        if (typeof val == "string") val = parseFloat(val);

        oFindNode(costTree[0], ce);
        var node = selectedNode;
        var criticalCost = false;
        if (node == null) continue;
        if (node[6].valueOf() == "YES".valueOf()) criticalCost = true;
        if (!criticalCost) continue;
        var ps = getParentString(node);

        var item = {
          costdescription: cename,
          cost: CurrencyFormat(val, "", 0, "", ","),
          percentage: numberFormat((val / total_cost) * 100, 2),
          parents: ps
        };
        db_identifytable.push(item);
      }
    }
    addidentifypagebreak($(this), 0, db_identifytable);
  });

  jQuery(".mand_wrapper").each(function(index) {
    // code to retrieve m&d data from database for each selected critical cost
    // alert("mand_wrapper found");

    var db_mdtable12 = [];
    for (var i = 0; i < Gcurrentdata[Gcdindex].length; i++) {
      var celement = Gcurrentdata[Gcdindex][i];
      var cdCEID = celement[0];
      var cename = celement[1];
      if (!isCostCritical(cdCEID)) continue;
      var keyCostDrivers = [],
        selectedSOs = [];
      var numdrivers = 0;
      if (celement[2] != null) numdrivers = celement[2].length;
      if (numdrivers == 0) continue;
      for (j = 0; j < numdrivers; j++) {
        var cdentry = celement[2][j];
        if (cdentry == null) continue;
        var cdid = cdentry[0];
        var cdname = cdentry[1];
        var keyp = false;
        var keycd = "";
        if (
          cdentry != null &&
          cdentry.length >= 4 &&
          cdentry[4] != null &&
          cdentry[4].length > 0
        ) {
          keycd = cdentry[4][6];
          if (keycd != null && keycd.valueOf() == "1".valueOf()) keyp = true;
        }
        if (!keyp) continue;
        var numSOs = 0;
        if (
          cdentry != null &&
          cdentry.length >= 5 &&
          cdentry[5] != null &&
          cdentry[5].length > 0
        ) {
          for (var m = 0; m < cdentry[5].length; m++) {
            var soid = cdentry[5][m][0];
            // alert("processing so " + soid);
            var sodesc = cdentry[5][m][1];
            var sosel = cdentry[5][m][2];
            if (sosel.valueOf() == "1".valueOf()) {
              var newItem = {
                criticalcost: cename,
                costdrivers: cdname,
                strategicoptions: sodesc
              };

              db_mdtable12.push(newItem);
              numSOs = numSOs + 1;
            }
          }
        }
      }
    }

    var db_mdtable2_new = [];
    for (var i = 0; i < db_mdtable12.length + 2; i = i + 3) {
      var temp = {};
      for (var j = 0; j < 3; j++) {
        var ij = i + j;
        if (ij >= db_mdtable12.length) break;

        var item = db_mdtable12[ij];
        temp["criticalcost" + j] = item.criticalcost;
        temp["costdrivers" + j] = item.costdrivers;
        temp["strategicoptions" + j] = item.strategicoptions;
      }
      db_mdtable2_new.push(temp);
    }

    // db_mdtable11 = null;

    addmdpagebreak($(this), 0, db_mdtable2_new);
  });

  jQuery(".reduce_wrapper").each(function() {
    addreducepagebreak($(this), 0, db_reducetable);
  });

  $.each(db_implementtable, function(key, item) {
    var obj = $(".implement_wrapper").last();
    var section_clone = $(obj).clone();
    $(section_clone).insertAfter($(obj));
    addimplementpagebreak($(section_clone), 0, item);
  });
  $(".implement_wrapper")
    .first()
    .remove();

  var chart7;
  var legend7;

  var chartData7 = [
    {
      cost: "Non-Critical cost:",
      litres: nonCriticalCost,
      color: "#e9e9e9",
      labelcolor: "#fff"
    },
    {
      cost: "Total critical cost:",
      litres: criticalCost,
      color: "#2b4b74",
      labelcolor: "#fff"
    }
  ];

  // AmCharts.ready(function () {
  // PIE CHART
  chart7 = new AmCharts.AmPieChart();
  chart7.dataProvider = chartData7;
  chart7.colorField = "color";
  chart7.labelColorField = "labelcolor";
  chart7.titleField = "cost";
  chart7.valueField = "litres";
  chart7.outlineColor = "#FFFFFF";
  chart7.outlineAlpha = 0.8;
  chart7.outlineThickness = 0;
  chart7.fontSize = 15;
  chart7.labelRadius = -60;
  chart7.labelText = "[[percents]]%";

  chart7.autoMargins = false;
  chart7.marginTop = 40;
  chart7.marginBottom = 40;
  chart7.marginLeft = 40;
  chart7.marginRight = 40;
  chart7.pullOutRadius = 0;

  // WRITE
  chart7.write("chartdiv7");
  balloon = {
    fixedPosition: true
  };

  // });

  //section 11
  let totalGain = highGain + medGain + lowGain;
  var chart;
  var legend;
  var chartData = [
    {
      cost: "High priority strategies:",
      litres: highGain,
      color: "#2b4b74",
      labelcolor: "#ffffff"
    },
    {
      cost: "Medium priority strategies:",
      litres: medGain,
      color: "#666666",
      labelcolor: "#ffffff"
    },
    {
      cost: "Low priority strateiges",
      litres: lowGain,
      color: "#e9e9e9",
      labelcolor: "#666666"
    }
  ];

  // AmCharts.ready(function () {
  // PIE CHART
  chart = new AmCharts.AmPieChart();
  chart.dataProvider = chartData;
  chart.colorField = "color";
  chart.labelColorField = "labelcolor";
  chart.titleField = "cost";
  chart.valueField = "litres";
  chart.outlineColor = "#FFFFFF";
  chart.outlineAlpha = 0.8;
  chart.outlineThickness = 0;
  chart.fontSize = 15;
  chart.labelRadius = -60;
  chart.labelText = "[[percents]]%";

  chart.autoMargins = false;
  chart.marginTop = 40;
  chart.marginBottom = 40;
  chart.marginLeft = 40;
  chart.marginRight = 40;
  chart.pullOutRadius = 0;

  // WRITE
  chart.write("chartdiv11");
  balloon = {
    fixedPosition: true
  };

  var totalPages = $(".sec_wrapper").length + 2;
  jQuery(".sec_wrapper").each(function(index) {
    $(this)
      .find(".page_no")
      .html("Page " + (index + 2) + " of " + totalPages);
  });

  //    });
}
// individual report ends
/**
 * Implement step HTML in close out report
 * @param {object} obj - HTML document object
 * @param {number} startkey - next element index
 * @param {array} db_strategy - array with implement step data
 */
function addimplementpagebreak(obj, startkey, db_strategy) {
  var implement_strategy_table = $(obj).find(".implement_strategy_table");
  $(implement_strategy_table)
    .find("tbody")
    .html("");

  var markup = '<tr class="critical_bg">';
  markup +=
    "<td><strong>" +
    db_strategy.strategy +
    ".</strong> " +
    db_strategy.statement +
    "</td>";
  markup += "<td>" + db_strategy.priority + "</td>";
  markup +=
    '<td class="text-right">' +
    db_strategy.cost +
    '</td><td class="text-right">' +
    db_strategy.revenue +
    "</td>";
  $(implement_strategy_table)
    .find("tbody:last")
    .append(markup);

  var implement_action_table = $(obj).find(".implement_action_table");
  $(implement_action_table)
    .find("tbody")
    .html("");
  var tempMaxHeight = maxHeight + $(obj).offset().top - 20;

  $.each(db_strategy.actionitems, function(key, item) {
    if (key >= startkey) {
      var markup1 = "<tr>";
      markup1 += "<td>" + item.action + "</td>";
      markup1 += "<td>" + item.author + "</td>";
      markup1 += '<td class="text-right">' + item.targetdate + "</td>";
      $(implement_action_table)
        .find("tbody:last")
        .append(markup1);
    }
  });

  var clone_key = -1;
  $(implement_action_table)
    .find("tbody tr")
    .each(function(index) {
      var requiredHeight = $(this).offset().top + $(this).height();

      if (requiredHeight > tempMaxHeight) {
        //alert("todo");
        $(implement_action_table)
          .find("tbody")
          .html("");
        clone_key = index;
        return false;
      }
    });

  if (parseInt(clone_key) > -1) {
    //alert(clone_key);
    clone_key = clone_key + startkey;
    $.each(db_strategy.actionitems, function(key, item) {
      if (key >= startkey && key <= clone_key) {
        var markup1 = "<tr>";
        markup1 += "<td>" + item.action + "</td>";
        markup1 += "<td>" + item.author + "</td>";
        markup1 += '<td class="text-right">' + item.targetdate + "</td>";
        $(implement_action_table)
          .find("tbody:last")
          .append(markup1);
      }
    });

    clone_key = clone_key + 1;
    if (db_strategy.actionitems.length > clone_key) {
      var section_clone = $(obj).clone();
      $(section_clone).insertAfter($(obj));
      addimplementpagebreak($(section_clone), clone_key, db_strategy);
    }
  }
}
/**
 * Reduce HTML in close out report
 * @param {object} obj - HTML document object
 * @param {number} startkey - Next element index
 * @param {array} db_reducetable - array with reduce step data
 */
function addreducepagebreak(obj, startkey, db_reducetable) {
  var goal_table = $(obj).find(".reduce_table");
  $(goal_table)
    .find("tbody")
    .html("");
  var tempMaxHeight = maxHeight + $(obj).offset().top - 20;

  $.each(db_reducetable, function(key, item) {
    if (key >= startkey) {
      var markup =
        "<tr class='critical_bg'><td>" +
        item.statement +
        "</td><td>" +
        item.priority +
        "</td><td class='text-right'>" +
        item.cost +
        "</td><td class='text-right'>" +
        item.revenue +
        "</td></tr>";
      $(goal_table)
        .find("tbody:last")
        .append(markup);
    }
  });

  var clone_key = -1;
  $(goal_table)
    .find("tbody tr")
    .each(function(index) {
      var requiredHeight = $(this).offset().top + $(this).height();

      if (requiredHeight > tempMaxHeight) {
        //alert("todo");
        $(goal_table)
          .find("tbody")
          .html("");
        clone_key = index;
        return false;
      }
    });

  if (parseInt(clone_key) > -1) {
    //alert(clone_key);
    clone_key = clone_key + startkey;
    $.each(db_reducetable, function(key, item) {
      if (key >= startkey && key <= clone_key) {
        var markup =
          "<tr class='critical_bg'><td>" +
          item.statement +
          "</td><td>" +
          item.priority +
          "</td><td class='text-right'>" +
          item.cost +
          "</td><td class='text-right'>" +
          item.revenue +
          "</td></tr>";
        $(goal_table)
          .find("tbody:last")
          .append(markup);
      }
    });

    clone_key = clone_key + 1;
    if (db_reducetable.length > clone_key) {
      var section_clone = $(obj).clone();
      $(section_clone).insertAfter($(obj));
      addreducepagebreak($(section_clone), clone_key, db_reducetable);
    }
  }
}
/**
 * Identify step HTML in close out report
 * @param {object} obj - HTML document object
 * @param {number} startkey - next element index
 * @param {arrat} db_identifytable - array of cost elements and percentages
 */
function addidentifypagebreak(obj, startkey, db_identifytable) {
  var sec_body = $(obj).find(".cost_breakdown_list");
  $(sec_body).html("");

  var tempMaxHeight = 460;
  $.each(db_identifytable, function(key, item) {
    if (key >= startkey) {
      var markup = '<ul class="cost_breakdown_list">';
      markup += '<li class="critical_bg font18"><table>';
      var parents = item.parents.split(sentinel);
      markup += '<tr><td colspan="3" width="100%" class="headitem">';
      for (var i = 0; i < parents.length; i++) {
        markup += "<span>" + $.trim(parents[i]) + "</span>";
        if (i < parents.length - 1)
          markup += '<span class="arrow-right">&nbsp;</span>';
      }
      markup += "</td></tr>";
      markup +=
        '<tr><td width="65%">' +
        item.costdescription +
        '</td><td width="20%">' +
        item.cost +
        '</td><td width="15%">' +
        item.percentage +
        "%</td></tr>";
      markup += "</table></li></ul>";
      $(sec_body).append(markup);
    }
  });

  var clone_key = -1;
  $(sec_body)
    .find("li")
    .each(function(index) {
      var requiredHeight = $(this).height() + 20;

      if (tempMaxHeight <= requiredHeight) {
        $(sec_body).html("");
        clone_key = index - 1;
        return false;
      } else {
        tempMaxHeight -= requiredHeight;
      }
    });

  if (parseInt(clone_key) > -1) {
    //alert(clone_key);
    clone_key = clone_key + startkey;
    $.each(db_identifytable, function(key, item) {
      if (key >= startkey && key <= clone_key) {
        var markup = '<ul class="cost_breakdown_list">';
        markup += '<li class="critical_bg font18"><table>';
        var parents = item.parents.split(sentinel);
        markup += '<tr><td colspan="3" width="100%" class="headitem">';
        for (var i = 0; i < parents.length; i++) {
          markup += "<span>" + $.trim(parents[i]) + "</span>";
          if (i < parents.length - 1)
            markup += '<span class="arrow-right">&nbsp;</span>';
        }
        markup += "</td></tr>";
        markup +=
          '<tr><td width="65%">' +
          item.costdescription +
          '</td><td width="20%">' +
          item.cost +
          '</td><td width="15%">' +
          item.percentage +
          "%</td></tr>";
        markup += "</table></li></ul>";
        $(sec_body).append(markup);
      }
    });

    clone_key = clone_key + 1;
    if (db_identifytable.length > clone_key) {
      var section_clone = $(obj).clone();
      $(section_clone).insertAfter($(obj));
      addidentifypagebreak($(section_clone), clone_key, db_identifytable);
    }
  }
}
/**
 * Measure and Define HTML in close out report
 * @param {object} obj - HTML document object
 * @param {number} startkey - next element index
 * @param {array} db_mdtable2 - cost elements, cost driver, strategic options array
 */
function addmdpagebreak(obj, startkey, db_mdtable2) {
  var sec_body = $(obj).find(".sec_body");
  var tempTable2 = `<table class="table measure_and_define">
  <thead>
  <tr><th width="30%">Critical Cost</th>
  <th width="20%">Cost Driver</th>
  <th width="50%">Strategic Option</th>
  </tr>
  </thead> 
  <tbody>
  `;
  $(sec_body).html("");
  var tempMaxHeight = maxHeight + $(obj).offset().top - 20;
  let markup = tempTable2;
  var clone_key = startkey + 2;
  if (parseInt(clone_key) > -1) {
    $.each(db_mdtable2, function(key, item) {
      if (
        key >= startkey &&
        key <= clone_key &&
        item["criticalcost" + 0] != undefined
      ) {
        if (item["criticalcost" + 0] !== undefined) {
          let cc = item["criticalcost" + 0];
          let cd = item["costdrivers" + 0];
          let so = item["strategicoptions" + 0];
          markup += `<tr>
        <td class="item">
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cc}
        </td><td>
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cd}
        </td>
        <td>${so}</td></tr>`;
        }
        if (item["criticalcost" + 1] !== undefined) {
          let cc = item["criticalcost" + 1];
          let cd = item["costdrivers" + 1];
          let so = item["strategicoptions" + 1];
          markup += `<tr>
        <td class="item">
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cc}
        </td><td>
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cd}
        </td>
        <td>${so}</td></tr>`;
        }
        if (item["criticalcost" + 2] !== undefined) {
          let cc = item["criticalcost" + 2];
          let cd = item["costdrivers" + 2];
          let so = item["strategicoptions" + 2];
          markup += `<tr>
        <td class="item">
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cc}
        </td><td>
        <img class="mar_0" src="images/critical_icon.png" style="background: #2b4d76;margin-right: 5px">${cd}
        </td>
        <td>${so}</td></tr>`;
        }
        markup += "</td></tr>";
      }
    });
    $(sec_body).append(markup + "</tbody></table>");
    if (db_mdtable2.length > clone_key + 1) {
      var section_clone = $(obj).clone();
      $(section_clone).insertAfter($(obj));
      addmdpagebreak($(section_clone), clone_key + 1, db_mdtable2);
    }
  }
}
/**
 * HTML for goals in close out report. Adds page break after every 13 goals
 * @param {object} obj - html document object
 * @param {number} startkey - next element index
 */
function addgoalpagebreak(obj, startkey) {
  var goal_table = $(obj).find(".goal_table");
  $(goal_table)
    .find("tbody")
    .html("");
  var tempMaxHeight = maxHeight + $(obj).offset().top - 20;

  $.each(temptable, function(key, item) {
    if (key >= startkey) {
      var markup =
        "<tr><td>" + item.perspective + "</td><td>" + item.goal + "</td></tr>";
      $(goal_table)
        .find("tbody:last")
        .append(markup);
    }
  });

  var clone_key = -1;
  $(goal_table)
    .find("tbody tr")
    .each(function(index) {
      var requiredHeight = $(this).offset().top + $(this).height();
      if (requiredHeight > tempMaxHeight) {
        //alert("todo");
        $(goal_table)
          .find("tbody")
          .html("");
        clone_key = index;
        return false;
      }
    });

  if (parseInt(clone_key) > -1) {
    //alert(clone_key);
    clone_key = clone_key + startkey;
    $.each(temptable, function(key, item) {
      if (key >= startkey && key <= clone_key) {
        var markup =
          "<tr><td>" +
          item.perspective +
          "</td><td>" +
          item.goal +
          "</td></tr>";
        $(goal_table)
          .find("tbody:last")
          .append(markup);
      }
    });
    clone_key = clone_key + 1;
    if (temptable.length > clone_key) {
      var section_clone = $(obj).clone();
      $(section_clone).insertAfter($(obj));
      addgoalpagebreak($(section_clone), clone_key);
    }
  }
}
function quarter_of_the_year(date) {
  var month = date.getMonth() + 1;
  return Math.ceil(month / 3);
}
/**
 * Progress Report of a particular project
 */
function refreshProgressReport() {
  let loggedInUser = getFirstLast(Gusername);
  let loggedInUserName = loggedInUser[0].trim() + " " + loggedInUser[1].trim();
  let valueRealizedTrend = Gcurrentdata[31].trendData;
  let VRxAxis = [];
  let VRyAxisData = [];
  for (var key in valueRealizedTrend) {
    let reverseQuarter = key.split(",");
    let quarterYear = reverseQuarter[1] + "'" + reverseQuarter[0];
    VRxAxis.push(quarterYear);
    VRyAxisData.push(valueRealizedTrend[key]);
  }
  let p_pendingActions = [];
  let p_all_strategies = Gcurrentdata[12];
  let p_total_strats = Gcurrentdata[12].length;
  for (var key in p_all_strategies) {
    if (p_all_strategies[key][21] === "1") {
      p_total_strats--;
    }
  }
  progressBarChartCursor = 0;
  progressBarChartLowerCursor = 0;
  var stratEnt = getProjectEntry(Gcurrentstrategy);
  if (stratEnt == []) {
    document.getElementById("mainbody").innerHTML =
      "No data for this project!!";
    return;
  }
  let pStatus = "";
  for (var GSkey in Gstrategies) {
    if (Gstrategies[GSkey][0] === stratEnt[0]) {
      pStatus = Gstrategies[GSkey][12];
    }
  }
  var projectCurrency = stratEnt[6][1];
  var lastEdit = stratEnt[7];
  var status = stratEnt[GstatusIndex];
  allSS = [];
  selectedSS = [];
  selectedSSNames = [];
  eternalSS = [];
  unselectedSS = [];
  activeSS = [];
  lateSS = [];
  completedSS = [];
  droppedSS = [];
  pendingSS = [];
  unimplementSS = [];
  onScheduleSS = [];
  behingScheduleSS = [];
  percentageValueRealized = 0;
  progressSSActions = [];
  droppedActions = [];
  completedActions = [];
  totalActions = [];
  progressBarChartCursor = 0;
  var valueRealized = 0;
  var totalPossible = Gcurrentdata[Gprimeindex][1];
  var totalAcrossAll = 0;
  if (Gcurrentdata[Grbindex] != null) {
    numSS = Gcurrentdata[Grbindex].length;
    for (var i = 0; i < numSS; i++) {
      var oentry = Gcurrentdata[Grbindex][i];
      if (oentry == null) continue;
      var ss = oentry[0];
      var sshandle = oentry[12].substring(0, 7);
      var impSel = oentry[9];
      allSS.push(oentry);
      if (impSel.valueOf() == "SELECTED".valueOf()) {
        selectedSS.push(oentry);
        if (oentry[14] == "1") {
          completedSS.push(oentry);
        } else if (oentry[31] == "1" && oentry[21] != "1") {
          unimplementSS.push(oentry);
        } else {
          if (oentry[21] != "1") {
            if (oentry[18] === null) {
              onScheduleSS.push(oentry);
            } else {
              let x = new Date(oentry[18]);
              let y = new Date();
              let actualDate =
                x.getMonth() + 1 + "-" + x.getDate() + "-" + x.getFullYear();
              let todayDate =
                y.getMonth() + 1 + "-" + y.getDate() + "-" + y.getFullYear();
              if (new Date(actualDate) >= new Date(todayDate)) {
                onScheduleSS.push(oentry);
              } else {
                behingScheduleSS.push(oentry);
              }
            }
            pendingSS.push(oentry);
          }
        }
        if (oentry[21] == "1") {
          droppedSS.push(oentry);
        }
        var actualSavings = oentry[13];
        if (actualSavings.length > 0) {
          for (var fas = 0; fas < actualSavings.length; fas++) {
            valueRealized += parseInt(actualSavings[fas][0]);
          }
        }
        var performance = getSummaryPerformanceAlt(oentry);
        if (performance != null) {
          totalAcrossAll =
            totalAcrossAll + performance[0] + performance[1] - performance[2];
        }

        var actions = oentry[6];

        if (actions == null) continue;
        for (var k = 0; k < actions.length; k++) {
          var actionEntry = actions[k];

          actionEntry.push({
            completedV: oentry[14] == "1",
            droppedI: oentry[21] == "1",
            unimplementedV: oentry[31] == "1",
            selectedR: oentry[9] == "SELECTED",
            eternalR: oentry[11] == "ETERNAL"
          }); // completed in V step [15]

          var completionDate = actionEntry[5];
          var completedFlag = actionEntry[12];
          var droppedFlag = actionEntry[10];
          var adead = actionEntry[2];
          totalActions.push(actionEntry);
          if (droppedFlag == "1") {
            droppedActions.push(actionEntry);
          } else if (completedFlag == "1") {
            completedActions.push(actionEntry);
          } else if (completionDate != null) {
            if (completionDate == "") {
              p_pendingActions.push(actionEntry);
            } else {
              completedActions.push(actionEntry);
            }
          } else {
            p_pendingActions.push(actionEntry);
          }
        }
      } else {
        if (
          oentry.length >= 12 &&
          oentry[11] != null &&
          oentry[11].valueOf() == "ETERNAL".valueOf()
        )
          eternalSS.push(oentry);
        else unselectedSS.push(oentry);
      }
    }
  }
  let droppedSScount = droppedSS.length;
  percentageValueRealized = numberFormat(
    (valueRealized / totalAcrossAll) * 100,
    2
  );
  pendingActionsCount = (
    (completedActions.length / (totalActions.length - droppedActions.length)) *
    100
  ).toFixed(2);
  if (isNaN(percentageValueRealized)) percentageValueRealized = 0;
  if (isNaN(pendingActionsCount)) pendingActionsCount = 0;
  let lastEdited = getPrintDate(lastEdit);
  var body = `
  <div class="container-fluid dataviz">
    <div class="row">
    <div class="col-lg-4 col-md-4 col-sm-4">
      <div class="sec_head">
          <h2 class="sec_title no_margin">Summary</h2>
      </div>
      <div class="main_block">
        <section>
          <table width="100%" class="statustable">
              <tr>
                <td>Status:</td>
                <td>${pStatus}</td>
              </tr>
              <tr>
                <td>Last Updated:</td>
                <td>${lastEdited}</td>
              </tr>
              <tr>
                <td>Strategies Selected for Implementation:</td>
                <td>${selectedSS.length}</td>
              </tr>
              <tr>
                <td>Action Items Completed:</td>
                <td>${pendingActionsCount} %</td>
              </tr>
              <tr>
                <td>Percentage Value Realized:</td>
                <td>${percentageValueRealized} %</td>
              </tr>
          </table>
        </section>
      </div>
    </div>
    <div class="col-lg-8 col-md-8 col-sm-8">
    <div class="row">
      <div class="col-lg-7 col-md-7 col-sm-5">
          <div class="sec_head">
            <h2 class="sec_title no_margin">Pending Strategy Statements</h2>
          </div>
      </div>
      <div class="col-lg-5 col-md-5 col-sm-5 text-right">
          <div class="btn_group">
          <input type="submit" id="allStrategies" useThis = "" value="All Strategies" class="strategiesActionPR left active">
          <input type="submit" id="myStrategies" useThis = "${loggedInUserName}" value="My Strategies" class="strategiesActionPR right">
        </div>
        <input type="text" id="Text1" class="search_input" placeholder="Search">                     
      </div>
    </div>
    <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12">
    <div class="main_block" style="margin-top: 0px;">
    <div class="projects_table_wrp1">
    <table class="table projects_thead">
      <thead>
          <tr>
            <th width="60%" class="sortable">Strategy Statement</th>
            <th width="20%" class="sortable">Due by</th>
            <th width="20%" class="sortable">Owners</th>
          </tr>
      </thead>
    </table>
    <div class="projects_scroll cus_scroll">
    <table class="table projects_table" id="Table3">
  `;
  for (var m = 0; m < pendingSS.length; m++) {
    var action = pendingSS[m];
    let awho;
    let time;
    if (action[19] === "" || action[19] === null) {
      awho = "NA";
    } else {
      awho = action[19];
      awho = generateFullNameFromId(awho, "");
    }
    if (action[18] === "" || action[18] === null) {
      time = "TBD";
    } else {
      time = action[18].split(" ");
      time = getPrintDate(time[0]);
    }
    let zztempaction = action[1];
    let zztemphandle = action[12];
    let zztemp = `
    <tr>
    <td width="60%">${zztemphandle} ${zztempaction}</td>
    <td width="20%">${time}</td>
    <td width="20%">${awho}</td>
    </tr>
    `;
    body = body + zztemp;
  }
  body += "</table></div></div></div></div></div></div></div>";
  let valueIdentifiedFormat = CurrencyFormat(
    totalAcrossAll,
    GdefaultCurrency,
    0,
    "",
    ","
  );
  let valueRealizedFormat = CurrencyFormat(
    valueRealized,
    GdefaultCurrency,
    0,
    "",
    ","
  );
  let valueYetToBeRealized = totalAcrossAll - valueRealized;
  if (valueYetToBeRealized < 0) {
    valueYetToBeRealized = 0;
  }
  let valueYetToBeRealizedFormat = CurrencyFormat(
    valueYetToBeRealized,
    GdefaultCurrency,
    0,
    "",
    ","
  );

  let yytemp = `
    <div class="row">
      <div class="col-lg-4 col-md-4 col-sm-4">
          <div class="main_block block2">
              <section>
                  <div class="head"> Value across All Strategies </div>
                  <div class="row">
                      <div class="col-lg-3 col-md-3 col-sm-3"> </div>
                      <div class="col-lg-9 col-md-9 col-sm-9">
                          <div class="status"> Value identified </div>
                          <div class="number1"> ${valueIdentifiedFormat} </div>
                      </div>
                      <br />
                      <div class="row">
                          <div class="col-lg-3 col-md-3 col-sm-3"> </div>
                          <div class="col-lg-9 col-md-9 col-sm-9">
                              <div class="status_green"> Value realized </div>
                              <div class="number2"> ${valueRealizedFormat} </div>
                          </div>
                      </div>
              </section>
              </div>
          </div>
          <div class="col-lg-8 col-md-8 col-sm-8">
              <div class="main_block">
                  <section>
                      <div id="trend_linechart1_canvas"></div>
                  </section>
                </div>
          </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="main_block">
          
              <section>
                <div class="head"> Strategies </div>
                  <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <div id="strategies_piechart1_canvas"></div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <div id="strategies_piechart2_canvas"></div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4">
                      <div id="strategies_piechart3_canvas"></div>
                    </div>
                  </div>
              </section>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="main_block">
            <div class="projects_scroll cus_scroll">
              <section>
                <div class="row">
                  <div class="col-lg-12 col-md-12 col-sm-12">
                    <div id="progress_hbarchar_canvas"></div>
                  </div>
                </div>
              </section>
              </div>
            </div>
          </div>
    </div>`;
  yytemp += `
      <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-6">
            <div class="sec_head">
              <h2 class="sec_title no_margin">Pending Action Items</h2>
            </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 text-right">
            <div class="btn_group">
            <input type="submit" id="allActions" useThis = "" value="All Actions" class="actionsActionPR left active">
            <input type="submit" id="myActions" useThis = "${loggedInUserName}" value="My Actions" class="actionsActionPR right">
          </div>
          <input type="text" id="Text2" class="search_input" placeholder="Search">                     
        </div>
      </div>
      <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12">
      <div class="main_block" style="margin-top: 0px;">
      <div class="projects_table_wrp1">
      <table class="table projects_thead">
        <thead>
            <tr>
              <th width="40%" class="sortable">Action</th>
              <th width="10%" class="sortable">Strategy Statement</th>
              <th width="20%" class="sortable">Due by</th>
              <th width="20%" class="sortable">Owners</th>
            </tr>
        </thead>
      </table>
      <div class="projects_scroll cus_scroll">
      <table class="table projects_table" id="Table4">
      `;
  for (var m = 0; m < p_pendingActions.length; m++) {
    var action = p_pendingActions[m];
    if (action[15].completedV) {
    }
    if (action[15].droppedI) {
      continue;
    }
    if (action[15].unimplementedV) {
      continue;
    }
    if (action[15].selectedR) {
    }
    if (action[15].eternalR) {
    }
    let awho;
    let time;
    if (action[3] === "") {
      awho = "NA";
    } else {
      awho = action[3].split(",");
      awho = awho[0];
      awho = generateFullNameFromId(awho, "");
    }
    if (action[2] === "") {
      time = "TBD";
    } else {
      time = action[2].split(" ");
      time = getPrintDate(time[0]);
    }
    let zztempaction = action[1];
    let zzsshandle = action[14];
    let zztemp = `
        <tr>
        <td width="40%" class="text-justify">${zztempaction}</td>
        <td width="10%" class="text-center">${zzsshandle}</td>
        <td width="20%">${time}</td>
        <td width="20%">${awho}</td>
        </tr>
        `;
    yytemp += zztemp;
  }
  yytemp += "</table></div></div></div></div></div></div></div> ";
  yytemp += `<div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <div class="main_block progress_block7" style="height: 320px;">
              <section>
                <div class="row">
                  <div class="col-lg-8 col-md-8 col-sm-8">
                      <div id="strategy_hbarchar_canvas"></div>
                  </div>
                  <div class="col-lg-4 col-md-4 col-sm-4">
                      <div class="row">
                        <div class="col-md-6">Cost Improvement Identified:
                            <div id="totalCostSavings"></div>
                        </div>
                        <div class="col-md-6">Revenue Improvement Identified:
                          <div id="totalRevenueImprovement"></div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <span class="circle circle2">&nbsp;</span>
                          Value Delivered:
                          <span id="totalValueDelivered">${valueRealizedFormat}</span>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12">
                          <span class="circle circle1">&nbsp;</span>
                          Value Yet To Be Delivered:
                          <span id="totalValueUndelivered">${valueYetToBeRealizedFormat}</span>
                        </div>
                      </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
      </div>
      </div><br/><br/><br/>
  `;
  body += yytemp;
  document.getElementById("mainbody").innerHTML = body;

  $(document).ready(function() {
    $("#Text1").on("keyup", function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $("#Table3 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
    $(".strategiesActionPR").on("click", function() {
      $(".strategiesActionPR").removeClass("active");
      $(this).addClass("active");
      var value = $(this)
        .attr("useThis")
        .toLowerCase();

      $("#Table3 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
    $(".actionsActionPR").on("click", function() {
      $(".actionsActionPR").removeClass("active");
      $(this).addClass("active");
      var value = $(this)
        .attr("useThis")
        .toLowerCase();

      $("#Table4 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
    $("#Text2").on("keyup", function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $("#Table4 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
  });
  let piechartChartCommom = {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
    height: 250
  };
  let piechartText1 = {
    text: "Identified in R step"
  };
  let piechartText2 = {
    text: "Selected For Implementation"
  };
  let piechartText3 = {
    text: "Implementation Status"
  };
  let piechartTooltipCommon = {
    pointFormat: "{series.name}: <b>{point.y}</b>"
  };
  let selectedForImpData = [
    {
      name: "Selected",
      y: selectedSS.length - droppedSScount
    },
    {
      name: "Dropped",
      y: droppedSScount
    }
  ];
  let impStatusData = [
    {
      name: "Completed",
      y: completedSS.length
    },
    {
      name: "On Schedule",
      y: onScheduleSS.length
    },
    {
      name: "Behind Schedule",
      y: behingScheduleSS.length
    },
    {
      name: "Unselected",
      y: unimplementSS.length
    }
  ];
  let identifiedSData = [
    {
      name: "Selected",
      y: selectedSS.length
    },
    {
      name: "Dropped",
      y: unselectedSS.length
    },
    {
      name: "Eternal",
      y: eternalSS.length
    }
  ];
  let actionsCompleted = [];
  let actionsOnSchedule = [];
  let actionsBehindSchedule = [];
  let ttActions = 0;
  let valueDelivered = [];
  let valueNotDelivered = [];
  let benfitTemp, riskTemp, valueRealizedTemp, valueIdentifiedTemp;
  for (var key in Gcurrentdata[34]) {
    if (Gcurrentdata[34][key].ss_dropped == 1) continue;
    if (Gcurrentdata[34][key].ss_unimplement == 1) continue;
    benfitTemp =
      Gcurrentdata[34][key].benefit === undefined
        ? 0
        : Gcurrentdata[34][key].benefit;
    riskTemp =
      Gcurrentdata[34][key].risk === undefined ? 0 : Gcurrentdata[34][key].risk;
    valueIdentifiedTemp = benfitTemp - riskTemp;
    valueRealizedTemp = Gcurrentdata[34][key].realized;

    if (valueRealizedTemp == undefined) {
      valueDelivered.push(0);
      valueNotDelivered.push(valueIdentifiedTemp);
    } else if (valueRealizedTemp > valueIdentifiedTemp) {
      valueDelivered.push(valueRealizedTemp);
      valueNotDelivered.push(0);
    } else {
      valueDelivered.push(valueRealizedTemp);
      valueNotDelivered.push(valueIdentifiedTemp - valueRealizedTemp);
    }
  }
  for (var key in Gcurrentdata[30]) {
    ttActions =
      Gcurrentdata[30][key].totalActions - Gcurrentdata[30][key].dropped;

    completePercent = Math.round(
      (Gcurrentdata[30][key].completed / ttActions) * 100
    );
    onSchedulePercent = Math.round(
      (Gcurrentdata[30][key].onTime / ttActions) * 100
    );
    behindSchedulePercent = Math.round(
      (Gcurrentdata[30][key].outStanding / ttActions) * 100
    );
    selectedSSNames.push(Gcurrentdata[30][key].sshandle);
    actionsCompleted.push(completePercent);
    actionsOnSchedule.push(onSchedulePercent);
    actionsBehindSchedule.push(behindSchedulePercent);
  }
  let strategiesWithActions = selectedSSNames;
  let actionItemsData = [
    {
      name: "Completed", //green
      data: actionsCompleted,
      index: 2
    },
    {
      name: "On Schedule", //yellow
      data: actionsOnSchedule,
      index: 1
    },
    {
      name: "Behind Schedule", //red
      data: actionsBehindSchedule,
      index: 0
    }
  ];
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
    if (VRxAxis.length === 0) {
      $("#trend_linechart1_canvas").html("No Data Available");
    } else {
      let VRyAxis = [
        {
          name: "Value Realized",
          data: VRyAxisData
        }
      ];
      Highcharts.chart("trend_linechart1_canvas", {
        chart: {
          height: 200,
          type: "line"
        },
        title: {
          text: "Value Realization Trend"
        },
        yAxis: {
          title: {
            text: "Value Realized"
          }
        },
        xAxis: {
          categories: VRxAxis,
          crosshair: true
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: VRyAxis,
        plotOptions: {
          series: {
            label: {
              connectorAllowed: false
            }
          }
        },
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom"
                }
              }
            }
          ]
        }
      });
    }
    Highcharts.chart("strategies_piechart1_canvas", {
      chart: piechartChartCommom,
      title: piechartText1,
      tooltip: piechartTooltipCommon,
      colors: ["#2C7873", "#FD5E53", "#FFBA5A"],
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Strategies",
          colorByPoint: true,
          data: identifiedSData
        }
      ]
    });
    Highcharts.chart("strategies_piechart2_canvas", {
      chart: piechartChartCommom,
      title: piechartText2,
      tooltip: piechartTooltipCommon,
      colors: ["#2C7873", "#FD5E53"],
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Strategies",
          colorByPoint: true,
          data: selectedForImpData
        }
      ]
    });
    Highcharts.chart("strategies_piechart3_canvas", {
      chart: piechartChartCommom,
      title: piechartText3,
      tooltip: piechartTooltipCommon,
      colors: ["#2C7873", "#52DE97", "#FD5E53", "#FFBA5A"],
      plotOptions: {
        pie: {
          allowPointSelect: false,
          cursor: "pointer",
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: "Strategies",
          colorByPoint: true,
          data: impStatusData
        }
      ]
    });
    let progress_hbarchar_canvas = {
      chart: {
        type: "bar"
      },
      title: {
        text: "Status of Action Items Completed per Strategy"
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
      },
      colors: ["#2C7873", "#52DE97", "#FD5E53"],
      xAxis: {
        categories: strategiesWithActions,
        title: {
          text: "Strategy Statements"
        },
        scrollbar: {
          enabled: true,
          showFull: false
        }
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: "Action Items Progress"
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle",
        reversed: true
      },

      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      series: actionItemsData
    };
    let strategy_hbarchar_canvas = {
      chart: {
        type: "column",
        height: 300
      },
      title: {
        text: "Value Realisation by Strategy"
      },
      colors: ["#52DE97", "#FFBA5A"],
      xAxis: {
        categories: strategiesWithActions,
        title: {
          text: "Strategy Statement Number"
        }
      },
      yAxis: {
        title: {
          text: "Total Value"
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: "<b>{point.x}</b><br/>",
        pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
      },
      plotOptions: {
        column: {
          stacking: "normal"
        }
      },
      series: [
        {
          name: "Value Delivered",
          data: valueDelivered,
          index: 1
        },
        {
          name: "Value yet to be delivered",
          data: valueNotDelivered,
          index: 0
        }
      ]
    };

    Highcharts.chart("progress_hbarchar_canvas", progress_hbarchar_canvas);
    Highcharts.chart("strategy_hbarchar_canvas", strategy_hbarchar_canvas);
  });
}
/**
 * Get the company info when person id is given
 * @param {number} pid - Person Id
 */
function getAllReportData() {
  console.trace();
  manProjects = Gstrategies;
  allManProjectsData = [];
  allManProjectsDataTemp = [];
  lastManDataRetrieved = 0;
  if (manProjects.length > 0) {
    if (manProjects.length > 10)
      myConfirm(
        "Confirm Report Request!",
        "Are you sure you want to retrieve data for: " +
          manProjects.length +
          " projects?",
        "OK",
        "Cancel",
        "retrieveNextStrategyDataWrapper();"
      );
    else retrieveNextStrategyData();
  }
}
function retrieveNextStrategyDataWrapper() {
  $("#myconfirm_modal").modal("hide");
  retrieveNextStrategyData();
}
/**
 * Filter reports by company
 * @param {object} event - event changed
 */
function filterReportsByClient(event) {
  let selected = event.value;
  selectedClientReports = selected;
  setManagementReports();
}
/**
 * Filter reports by supplier
 * @param {object} event - event changed
 */
function filterReportsBySupplier(event) {
  let selected = event.value;
  selectedSuppReports = selected;
  setManagementReports();
}
/**
 * Filter reports by region
 * @param {object} event - event changed
 */
function filterReportsByRegion(event) {
  let selected = event.value;
  selectedRegionReports = selected;
  setManagementReports();
}
/**
 * Filter reports by department
 * @param {object} event - event changed
 */
function filterReportsByDept(event) {
  let selected = event.value;
  selectedDeptReports = selected;
  setManagementReports();
}
/**
 * HTML for all reports prepared
 */
function setManagementReports() {
  console.trace();
  let abc =
    selectedClientReports !== "all" ? clientProjs[selectedClientReports] : [];
  let bcd = selectedDeptReports !== "all" ? depProjs[selectedDeptReports] : [];
  let cde = selectedSuppReports !== "all" ? supProjs[selectedSuppReports] : [];
  let def =
    selectedRegionReports !== "all" ? regProjs[selectedRegionReports] : [];
  let parent = [];
  if (abc.length !== 0) {
    parent.push(abc);
  }
  if (bcd.length !== 0) {
    parent.push(bcd);
  }
  if (cde.length !== 0) {
    parent.push(cde);
  }
  if (def.length !== 0) {
    parent.push(def);
  }

  if (parent.length) {
    var result = parent.shift().reduce(function(res, v) {
      if (
        res.indexOf(v) === -1 &&
        parent.every(function(a) {
          return a.indexOf(v) !== -1;
        })
      )
        res.push(v);
      return res;
    }, []);

    allManProjectsDataTemp = [];
    reportStrategies = [];
    for (sel = 0; sel < result.length; sel++) {
      for (var ampdt = 0; ampdt < allManProjectsData.length; ampdt++) {
        if (allManProjectsData[ampdt][26] == result[sel]) {
          allManProjectsDataTemp.push(allManProjectsData[ampdt]);
          reportStrategies.push(Gstrategies[ampdt]);
        }
      }
    }
  } else {
    reportStrategies = Gstrategies;
    allManProjectsDataTemp = allManProjectsData;
  }
  if (allManProjectsDataTemp.length === 0) {
    showTimedMessage(
      "gmsg",
      "No projects exist for the filters selected! Change filters to view reports.",
      0,
      true
    );
    return false;
  }
  manProjects = reportStrategies;
  GmgmtReportCurrency = manProjects[0][6][1];
  manValuesByProjectData = [];
  manAllPendingActionsData = [];
  manReverseUserData = [];
  manActive = 0;
  manCompleted = 0;
  manDropped = 0;
  activeSS = [];
  lateSS = [];
  completedSS = [];
  allSS = [];
  selectedSS = [];
  eternalSS = [];
  progressSSActions = [];
  ganttChartData = [];
  ganttLowerCursor = -1;
  ganttUpperCursor = -1;
  manAllProjectsData = [];
  var totalAcrossAll = 0;
  var totalValueRealized = 0;
  var totalNumSelected = 0;
  var totalRealizedValue = 0;
  var totalActionsOnTime = 0;
  var totalActionsLate = 0;
  var totalIdentifiedValue = 0;
  var valueRealized = 0;
  var numSelected = 0;
  var totalActionsInProgress = 0;
  var totalActionsCompleted = 0;
  var totalIdentifiedValue = 0;
  var totalActionsLatePerProject = 0;
  var totalStrategiesOnTime = 0;
  var totalStrategies = 0;
  var totalStrategiesCompleted = 0;
  var totalStrategiesInProgress = 0;
  var totalOutstandingStrategies = 0;

  var strategiesImplemented = 0;
  var strategiesOnSchedule = 0;
  var strategiesBeyondSchedule = 0;

  for (var i = 0; i < manProjects.length; i++) {
    //loop 1
    var totalActionsCompletedPerProject = 0;
    var totalIdentifiedValuePerProject = 0;
    var valueRealizedPerProject = 0;
    var numSelectedPerProject = 0;
    var totalActionsInProgressPerProject = 0;
    var totalActionsPerProject = 0;
    var totalActionsCompletedPerProject = 0;
    var totalIdentifiedValuePerProject = 0;
    var totalActionsLatePerProject = 0;
    var totalActionsOnTimePerProject = 0;
    var proj = manProjects[i];
    //
    var projname = proj[4];
    var currency = proj[2] === null ? "" : proj[2][1];

    var status = proj[GstatusIndex];
    if (status == null) status = "";
    var lastEdit = proj[7];
    if (status.valueOf() == "INACTIVE".valueOf()) {
      status = "DROPPED";
      manDropped++;
    } else if (status.valueOf() == "COMPLETED".valueOf()) manCompleted++;
    else {
      status = "ACTIVE";
      manActive++;
    }
    var stratEnt = allManProjectsDataTemp[i];

    valueRealized += parseInt(stratEnt[31].realized);
    if (stratEnt === undefined) continue;
    //
    var currency = stratEnt[2][1];
    if (currency == null) currency = "";
    if (stratEnt[Grbindex] == null) continue;
    var totalActions = 0;

    for (var key in stratEnt[27]) {
      totalActionsPerProject += stratEnt[27][key].totalActions;
      totalActionsCompletedPerProject += stratEnt[27][key].completed;
      totalActionsInProgressPerProject += stratEnt[27][key].inProgress;
      totalActionsLatePerProject += stratEnt[27][key].outStanding;
      totalActionsOnTimePerProject += stratEnt[27][key].onTime;
      totalActions += stratEnt[27][key].totalActions;
      totalActionsCompleted += stratEnt[27][key].completed;
      totalActionsInProgress += stratEnt[27][key].inProgress;
      totalActionsLate += stratEnt[27][key].outStanding;
      totalActionsOnTime += stratEnt[27][key].onTime;
      manReverseUserData.push(stratEnt[27][key]);
    }

    totalStrategies += stratEnt[30].length;

    for (var key in stratEnt[30]) {
      //

      if (stratEnt[30][key].completed === stratEnt[30][key].totalActions) {
        strategiesImplemented++;
      } else if (stratEnt[30][key].outStanding > stratEnt[30][key].onTime) {
        strategiesBeyondSchedule++;
      } else {
        strategiesOnSchedule++;
      }
      if (stratEnt[30][key].inProgress > 0) {
        totalStrategiesInProgress += 1;
      }
      if (stratEnt[30][key].completed > 0) {
        totalStrategiesCompleted += 1;
      }
      if (stratEnt[30][key].outStanding > 0) {
        totalOutstandingStrategies += 1;
      }
      if (stratEnt[30][key].onTime > 0) {
        totalStrategiesOnTime += 1;
      }
    }

    for (var key in stratEnt[28]) {
      manAllPendingActionsData.push([
        stratEnt[28][key].description,
        stratEnt[28][key].pj_name,
        getCompanyName(getCompanyForProject(stratEnt[28][key].pjid)),
        stratEnt[28][key].deadline,
        generateProfileIconFromId(stratEnt[28][key].participant, "empname")
      ]);
    }
    if (stratEnt[Grbindex].length > 0) {
      for (var j = 0; j < stratEnt[Grbindex].length; j++) {
        // loop 2
        var oentry = stratEnt[Grbindex][j];
        //
        //
        var ss = oentry[0];
        var ssname = oentry[1];
        var sshandle = oentry[12].substring(0, 7);
        var impSel = oentry[9];
        allSS.push(oentry);
        if (impSel.valueOf() == "SELECTED".valueOf()) {
          var actualSavings = oentry[13];
          numSelected++;
          numSelectedPerProject++;
          var performance = getSummaryPerformanceForStrat(ss, stratEnt[12]);
          let performanceObj = performance[5];
          if (performanceObj != null) {
            totalIdentifiedValuePerProject +=
              performanceObj.totalIdentifiedValue;
            totalIdentifiedValue += performanceObj.totalIdentifiedValue;
            totalAcrossAll += performanceObj.totalIdentifiedValue;
          }
          //
          var actions = oentry[6];
          if (actions == null) continue;
          progressSSActions.push([
            ss,
            sshandle,
            totalActions,
            totalActionsCompleted,
            totalActionsLate,
            totalActionsOnTime
          ]);
          //
        } else {
          if (
            oentry.length >= 12 &&
            oentry[11] != null &&
            oentry[11].valueOf() == "ETERNAL".valueOf()
          )
            eternalSS.push(oentry);
          else unselectedSS.push(oentry);
        }
      }
    }

    manAllProjectsData.push([
      projname,
      status,
      lastEdit,
      totalIdentifiedValuePerProject,
      stratEnt[31].realized,
      numSelectedPerProject,
      totalActionsInProgressPerProject,
      currency,
      stratEnt[26],
      stratEnt[32]
    ]);
    manValuesByProjectData.push(stratEnt[30]);

    var compflag = 2;

    if (stratEnt[29].totalActions) {
      var ssActionEntry = {
        id: i,
        name: stratEnt[29].pj_name,
        startyear: stratEnt[29].startYear,
        endyear: stratEnt[29].endYear,
        progress: numberFormat(
          (stratEnt[29].completedActions / stratEnt[29].totalActions) * 100,
          0
        ),
        flag: compflag
      };
      ganttChartData.push(ssActionEntry);
    }
  }
  var yearsReports = '<option value="all">Select All</option>';
  var clientsReports = '<option value="all">Select All</option>';
  var suppliersReports = '<option value="all">Select All</option>';
  var deptsReports = '<option value="all">Select All</option>';
  var regionsReports = '<option value="all">Select All</option>';

  var supProjsKeys = Object.keys(supProjs);
  var regProjsKeys = Object.keys(regProjs);
  var clientProjsKeys = Object.keys(clientProjs);
  var depProjsKeys = Object.keys(depProjs);

  for (var yearyear = 2000; yearyear <= 2020; yearyear++) {
    yearsReports +=
      '<option value="' + yearyear + '">' + yearyear + "</option>";
  }
  let suppSelectedValue;
  for (var supI = 0; supI < supProjsKeys.length; supI++) {
    suppSelectedValue = "";
    if (supProjsKeys[supI] == selectedSuppReports) {
      suppSelectedValue = "selected";
    }
    suppliersReports +=
      '<option value="' +
      supProjsKeys[supI] +
      '" ' +
      suppSelectedValue +
      ">" +
      supProjsKeys[supI] +
      "</option>";
  }

  for (var clientI = 0; clientI < clientProjsKeys.length; clientI++) {
    clientSelectedValue = "";
    if (clientProjsKeys[clientI] == selectedClientReports) {
      clientSelectedValue = "selected";
    }
    clientsReports +=
      '<option value="' +
      clientProjsKeys[clientI] +
      '" ' +
      clientSelectedValue +
      ">" +
      clientProjsKeys[clientI] +
      "</option>";
  }

  for (var regionI = 0; regionI < regProjsKeys.length; regionI++) {
    regionSelectedValue = "";
    if (regProjsKeys[regionI] == selectedRegionReports) {
      regionSelectedValue = "selected";
    }
    regionsReports +=
      '<option value="' +
      regProjsKeys[regionI] +
      '" ' +
      regionSelectedValue +
      ">" +
      regProjsKeys[regionI] +
      "</option>";
  }

  for (var deptI = 0; deptI < depProjsKeys.length; deptI++) {
    deptSelectedValue = "";
    if (depProjsKeys[deptI] == selectedDeptReports) {
      deptSelectedValue = "selected";
    }
    deptsReports +=
      '<option value="' +
      depProjsKeys[deptI] +
      '" ' +
      deptSelectedValue +
      ">" +
      depProjsKeys[deptI] +
      "</option>";
  }

  var body =
    '    <div class="container-fluid dataviz">' +
    '        <div class="row">' +
    '            <div class="col-lg-6 col-md-6 col-sm-6">' +
    '                <div class="sec_head">' +
    '                    <h2 class="sec_title no_margin">Summary</h2>' +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-6 col-md-6 col-sm-6 text-right">' +
    '            <div class="row">';
  if (Gemployer == 1) {
    body +=
      '                <div class="col-lg-3 col-md-3 text-uppercase-bold">' +
      "                    Client&nbsp;&nbsp;" +
      '                <select onChange="filterReportsByClient(this)">' +
      clientsReports +
      "                </select>" +
      "                </div>";
  }

  body +=
    '                <div class="col-lg-3 col-md-3 text-uppercase-bold">' +
    "                    Department&nbsp;&nbsp;" +
    '                <select onChange="filterReportsByDept(this)">' +
    deptsReports +
    "                </select>" +
    "                </div>" +
    '                <div class="col-lg-3 col-md-3 text-uppercase-bold">' +
    "                    Supplier&nbsp;&nbsp;" +
    '                <select onChange="filterReportsBySupplier(this)">' +
    suppliersReports +
    "                </select>" +
    "                </div>" +
    '                <div class="col-lg-3 col-md-3 text-uppercase-bold">' +
    "                    Region&nbsp;&nbsp;" +
    '                <select onChange="filterReportsByRegion(this)">' +
    regionsReports +
    "                </select>" +
    "                </div>" +
    "            </div>" +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-4 col-md-4 col-sm-4">' +
    '                <div class="main_block">' +
    '                    <div class="row block1">' +
    '                        <div class="col-lg-7 col-md-7 col-sm-7">' +
    "                            <section>" +
    '                                <div class="head">' +
    "                                    Projects" +
    "                                </div>" +
    '                                <div class="number1">' +
    manActive +
    "                                </div>" +
    '                                <div class="status">' +
    "                                    Active" +
    "                                </div>" +
    "                            </section>" +
    "                        </div>" +
    '                        <div class="col-lg-5 col-md-5 col-sm-5">' +
    '                            <section class="sub_block2">' +
    '                                <div class="number2">' +
    manCompleted +
    "                                </div>" +
    '                                <div class="status_green">' +
    "                                    Completed" +
    "                                </div>" +
    "                            </section>" +
    '                            <section class="sub_block3">' +
    '                                <div class="number3">' +
    manDropped +
    "                                </div>" +
    '                                <div class="status_black">' +
    "                                    Dropped" +
    "                                </div>" +
    "                            </section>" +
    "                        </div>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-4 col-md-4 col-sm-4">' +
    '                <div class="main_block block2">' +
    "                    <section>" +
    '                        <div class="head">' +
    "                            Value across projects" +
    "                        </div>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-3 col-md-3 col-sm-3">' +
    "                                <center>" +
    '                                <img src="images/value_identified_blue.png" alt="Value-identified" /></center>' +
    "                            </div>" +
    '                            <div class="col-lg-9 col-md-9 col-sm-9">' +
    '                                <div class="status">' +
    "                                    Value identified" +
    "                                </div>" +
    '                                <div class="number1">' +
    CurrencyFormat(totalAcrossAll, GmgmtReportCurrency, 0, "", ",") +
    "                                </div>" +
    "                            </div>" +
    "                        </div>" +
    "                        <br />" +
    '                        <div class="row">' +
    '                            <div class="col-lg-3 col-md-3 col-sm-3">' +
    "                                <center>" +
    '                                <img src="images/value_realized_green.png" alt="Value-realized" /></center>' +
    "                            </div>" +
    '                            <div class="col-lg-9 col-md-9 col-sm-9">' +
    '                                <div class="status_green">' +
    "                                    Value realized" +
    "                                </div>" +
    '                                <div class="number2">' +
    CurrencyFormat(valueRealized, GmgmtReportCurrency, 0, "", ",") +
    "                                </div>" +
    "                            </div>" +
    "                        </div>" +
    "                    </section>" +
    "                </div>" +
    "            </div>" +
    '        <div class="row"> ' +
    '            <div class="col-lg-4 col-md-4 col-sm-4"> ' +
    '                <div class="main_block block3 indi-reports-pie-chart"> ' +
    "                    <section> " +
    '                        <div class="head"> ' +
    "                            Strategies " +
    "                        </div> " +
    '                        <div class="row"> ' +
    '                            <div class="col-lg-6 col-md-6 col-sm-6"><h3 class="h3-strategies">Identified for Benefit / Risk analysis</h3> ' +
    "</div>" +
    ' <div class="col-lg-6 col-md-6 col-sm-6"><h3 class="h3-strategies">Selected for implementation</h3> ' +
    "</div>" +
    "</div>" +
    '  <div class="row"> ' +
    '   <div class="col-lg-6 col-md-6 col-sm-6"> <canvas id="strategies_piechart1_canvas" style="width:210px; margin-left:-16px"></canvas>' +
    "</div>" +
    ' <div class="col-lg-6 col-md-6 col-sm-6"> <canvas id="strategies_piechart2_canvas_all" style="width:210px;padding-top:2px;margin-left:-16px"></canvas>' +
    "</div>" +
    "</div>" +
    ' <div class="row"> ' +
    '<div class="col-lg-6 col-md-6 col-sm-6"> ' +
    " <ul class='piechart-label less-width'> " +
    ' <li><span class="circle circle5">&nbsp;</span> Selected</li> ' +
    ' <li><span class="circle circle6">&nbsp;</span> Dropped</li> ' +
    '<li><span class="circle circle7">&nbsp;</span> Eternal</li> ' +
    " </ul> </div>" +
    ' <div class="col-lg-6 col-md-6 col-sm-6"> ' +
    " <ul class='piechart-label more-width'> " +
    ' <li><span class="circle circle8">&nbsp;</span> Implemented</li> ' +
    ' <li><span class="circle circle9">&nbsp;</span> On Schedule</li> ' +
    '  <li><span class="circle circle10">&nbsp;</span> Behind Schedule</li> ' +
    "  </ul> </div>" +
    "</div>" +
    "</div>" +
    "                        </div> " +
    "                    </section> " +
    '        <div class="row">' +
    '            <div class="col-lg-6 col-md-6 col-sm-6">' +
    '                <div class="sec_head">' +
    '                    <h2 class="sec_title no_margin">Progress</h2>' +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-8 col-md-8 col-sm-8">' +
    '                <div class="main_block block2 gannt_block">' +
    "                    <section>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-6 col-md-6 col-sm-6 head">' +
    "                                Status of Action items completed per Project" +
    "                            </div>" +
    "                        </div>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-12 col-md-12 col-sm-12">' +
    '                                <div id="progress_hbarchar_canvas" class= "projects_scroll cus_scroll" style="width: 99%; font-size: 12px;">' +
    '                                    <table width="100%;"></table>' +
    "                                </div>" +
    "                            </div>" +
    "                        </div>" +
    "                    </section>" +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-4 col-md-4 col-sm-4">' +
    '                <div class="main_block block3">' +
    "                    <section>" +
    '                        <div class="head">' +
    "                            Action item status" +
    "                        </div>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-12 col-md-12 col-sm-12">' +
    '                                <canvas id="actionitem_piechart2_canvas" style="width: auto; height: 170px;"></canvas>' +
    "                            </div>" +
    "                        </div>" +
    "                    </section>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-12 col-md-12 col-sm-12" style="display:none">' +
    '                <div class="main_block block2">' +
    "                    <section>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-6 col-md-6 col-sm-6 head">' +
    '                                Values generated trends across projects <div id="localCurrency"></div>' +
    "                            </div>" +
    "                        </div>" +
    '                        <div class="row">' +
    '                            <div class="col-lg-8 col-md-8 col-sm-8">' +
    '                                <canvas id="trend_linechart1_canvas" style="width: 99%; height: 180px;"></canvas>' +
    "                            </div>" +
    '                            <div class="col-lg-4 col-md-4 col-sm-4">' +
    '                                <div class="row">' +
    '                                    <div class="col-lg-3 col-md-3 col-sm-3">' +
    "                                        <center>" +
    '                                <img src="images/value_identified_blue.png" alt="Value-identified" /></center>' +
    "                                    </div>" +
    '                                    <div class="col-lg-9 col-md-9 col-sm-9">' +
    '                                        <div class="status">' +
    "                                            Value identified" +
    "                                        </div>" +
    '                                        <div class="number1">' +
    ' <div id="localIdentified"></div>' +
    "                                        </div>" +
    "                                    </div>" +
    "                                </div>" +
    "                                <br />" +
    '                                <div class="row">' +
    '                                    <div class="col-lg-3 col-md-3 col-sm-3">' +
    "                                        <center>" +
    '                                <img src="images/value_realized_green.png" alt="Value-realized" /></center>' +
    "                                    </div>" +
    '                                    <div class="col-lg-9 col-md-9 col-sm-9">' +
    '                                        <div class="status_green">' +
    "                                            " +
    "                                        </div>" +
    '                                        <div class="number2">' +
    ' <div id="localRealized"></div>' +
    "                                        </div>" +
    "                                    </div>" +
    "                                </div>" +
    "                            </div>" +
    "                        </div>" +
    "                    </section>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <br />" +
    '        <div class="row">' +
    '            <div class="col-lg-6 col-md-6 col-sm-6">' +
    '                <div class="sec_head">' +
    '                    <h2 class="sec_title no_margin">All Projects</h2>' +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-6 col-md-6 col-sm-6 text-right">' +
    '                <input type="text" id="search_project" class="search_input" placeholder="Search"  > ' +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-12 col-md-12 col-sm-12">' +
    '                <div class="main_block">' +
    '                    <div class="projects_table_wrp1">' +
    '                        <table class="table projects_thead">' +
    "                            <thead>" +
    "                                <tr>" +
    '                                    <th width="30%" class="sortable">Project</th>' +
    '                                    <th width="10%" class="sortable asc">Status </th>' +
    '                                    <th width="10%" class="sortable">Last updated</th>' +
    '                                    <th width="10%" class="sortable">Value identified</th>' +
    '                                    <th width="10%" class="sortable">Value realized</th>' +
    '                                    <th width="10%" class="sortable">% Realized</th>' +
    '                                    <th width="10%" class="sortable">Strategies implemented</th>' +
    '                                    <th width="10%" class="sortable">Total Actions Pending</th>' +
    "                                </tr>" +
    "                            </thead></table>";
  body +=
    '<div class="projects_scroll cus_scroll">' +
    '<table class="table projects_table" id="projects_table">';

  for (var x = 0; x < manAllProjectsData.length; x++) {
    let susu = manAllProjectsData[x];
    //

    inProgressActions =
      susu[9].inProgress === undefined ? 0 : susu[9].inProgress;

    body =
      body +
      "                                            <tr>" +
      '                                                <td width="30%">' +
      susu[0] +
      "</td>" +
      '                                                <td width="10%">' +
      susu[1] +
      "</td>" +
      '                                                <td width="10%">' +
      getPrintDate(susu[2]) +
      "</td>" +
      '                                                <td width="10%">' +
      CurrencyFormat(susu[3], susu[7], 0, "", ",") +
      "</td>" +
      '                                                <td width="10%">' +
      CurrencyFormat(susu[4], susu[7], 0, "", ",") +
      "</td>";
    var valclass = "";
    var percent = 0;
    if (susu[3] > 0) percent = (susu[4] / susu[3]) * 100;
    if (percent < 30) valclass = ' class="" ';
    else if (percent > 70) valclass = ' class=""';
    body =
      body +
      '                                                <td width="10%" ' +
      valclass +
      ">" +
      numberFormat(percent, 0) +
      "</td>" +
      '                                               <td width="10%">' +
      susu[5] +
      "</td>";
    valclass = "";
    if (susu[6] > 50) valclass = ' class=""';
    else if (susu[6] < 10) valclass = ' class=""';
    body =
      body +
      '                                                <td width="10%" ' +
      valclass +
      ">" +
      inProgressActions +
      "</td>" +
      "                                            </tr>";
  }

  $(document).ready(function() {
    $("#search_project").on("keyup", function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $("#projects_table tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
  });

  body =
    body +
    "                        </table></div>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <br />" +
    '        <div class="row">' +
    '            <div class="col-lg-6 col-md-6 col-sm-6">' +
    '                <div class="sec_head">' +
    '                    <h2 class="sec_title no_margin">Pending Actions</h2>' +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-6 col-md-6 col-sm-6 text-right">' +
    '                <div class="btn_group">' +
    '                    <input type="submit" value="All Actions" class="left active">' +
    '                    <input type="submit" value="My Actions" class="right">' +
    "                </div>" +
    "                &nbsp;&nbsp;&nbsp;" +
    '                <input type="text" id="Text1" class="search_input" supplierSelector>' +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-12 col-md-12 col-sm-12">' +
    '                <div class="main_block" style="margin-top: 0px;">' +
    '                    <div class="projects_table_wrp1">' +
    '                        <table class="table projects_thead">' +
    "                            <thead>" +
    "                                <tr>" +
    '                                    <th width="25%" class="sortable">Action</th>' +
    '                                    <th width="25%" class="sortable asc">Project </th>' +
    '                                    <th width="10%" class="sortable">Client</th>' +
    '                                    <th width="20%" class="sortable">Due by</th>' +
    '                                    <th width="20%" class="sortable">Owners</th>' +
    "                                </tr>" +
    "                            </thead></table>";
  body +=
    '<div class="projects_scroll cus_scroll">' +
    '<table class="table projects_table" id="Table1">';
  for (var x = 0; x < manAllPendingActionsData.length; x++) {
    var pentry = manAllPendingActionsData[x];
    body =
      body +
      "                                            <tr>" +
      '                                                <td width="25%">' +
      pentry[0] +
      "</td>" +
      '                                                <td width="25%">' +
      pentry[1] +
      "</td>" +
      '                                                <td width="10%">' +
      pentry[2] +
      "</td>" +
      '                                                <td width="20%">' +
      getPrintDate(pentry[3]) +
      "</td>" +
      '                                                <td width="20%"> <span class="empname">' +
      pentry[4] +
      "</span></td>" +
      "                                            </tr>";
  }

  $(document).ready(function() {
    $("#Text1").on("keyup", function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $("#Table1 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
  });

  body =
    body +
    "                        </table></div>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <br />" +
    '        <div class="row">' +
    '            <div class="col-lg-6 col-md-6 col-sm-6">' +
    '                <div class="sec_head">' +
    '                    <h2 class="sec_title no_margin">Participants</h2>' +
    "                </div>" +
    "            </div>" +
    '            <div class="col-lg-6 col-md-6 col-sm-6 text-right">' +
    '                <input type="text" id="Text2" class="search_input" placeholder="Search">' +
    "            </div>" +
    "        </div>" +
    '        <div class="row">' +
    '            <div class="col-lg-12 col-md-12 col-sm-12">' +
    '                <div class="main_block">' +
    '                    <div class="projects_table_wrp1">' +
    '                        <table class="table projects_thead">' +
    "                            <thead>";
  body += `<tr>
      <th colspan="4"></th>
      <th colspan="2" class="text-center">In Progress</th>
    </tr>`;
  body +=
    "                                <tr>" +
    '                                    <th width="15%" class="sortable">Name</th>' +
    '                                    <th width="25%" class="sortable asc">Project Name </th>' +
    '                                    <th width="10%" class="sortable">Total Actions</th>' +
    '                                    <th width="10%" class="sortable">Completed</th>' +
    '                                    <th width="10%" class="sortable">Behind Schedule</th>' +
    '                                    <th width="10%" class="sortable">On Schedule</th>' +
    "                                </tr>";

  body +=
    " </thead></table>" +
    '<div class="projects_scroll cus_scroll">' +
    '<table class="table projects_table" id="Table2">';

  for (var x = 0; x < manReverseUserData.length; x++) {
    var huhu = manReverseUserData[x];

    body =
      body +
      "                                            <tr>" +
      '                                                <td width="15%">' +
      generateProfileIconFromId(huhu.participant, "empname") +
      getPersonName(huhu.participant) +
      "</td>" +
      '                                                <td width="25%">' +
      huhu.projectName +
      "</td>" +
      '                                                <td width="10%">' +
      huhu.totalActions +
      "</td>" +
      '                                                <td width="10%">' +
      huhu.completed +
      "</td>" +
      '                                                <td width="10%">' +
      huhu.outStanding +
      "</td>" +
      // '<td width="10%">' +
      // (huhu.totalActions-huhu.inProgress-huhu.completed) +
      // "</td>" +
      '                                                <td width="10%">' +
      (huhu.inProgress - huhu.outStanding) +
      "</td>" +
      "                                            </tr>";
  }

  $(document).ready(function() {
    $("#Text2").on("keyup", function() {
      var value = $(this)
        .val()
        .toLowerCase();
      $("#Table2 tr").filter(function() {
        $(this).toggle(
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value) > -1
        );
      });
    });
  });

  body =
    body +
    "                        </table></div>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <br />" +
    "        &nbsp;" +
    "    </div>";
  document.getElementById("mainbody").innerHTML = body;
  $("body").mouseover(function(ev) {
    var currentclass = $(ev.target).attr("class");
    var tooltipEl = document.getElementById("chartjs-tooltip");
    if (tooltipEl) tooltipEl.innerHTML = "";

    var tooltipE2 = document.getElementById("chartjs-tooltip2");
    if (tooltipE2) tooltipE2.innerHTML = "";
  });

  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
      container: "body",
      html: true
    });
  });

  var configPie1 = {
    type: "pie",
    plugins: [ChartDataLabels],
    data: {
      datasets: [
        {
          data: [
            numSelected,
            allSS.length - (numSelected + eternalSS.length),
            eternalSS.length
          ],
          backgroundColor: [
            "rgba(43, 75, 116, 1)",
            "rgba(191, 195, 197, 1)",
            "rgba(188, 79, 213, 1)"
          ],
          label: "Dataset 1"
        }
      ],
      labels: ["Selected", "Dropped", "Eternal"]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      legend: {
        display: false
      }
    }
  };

  var configPie11 = {
    type: "pie",
    plugins: [ChartDataLabels],
    data: {
      datasets: [
        {
          data: [
            strategiesImplemented,
            strategiesOnSchedule,
            strategiesBeyondSchedule
          ],
          backgroundColor: [
            "rgba(84, 178, 5, 1)",
            "rgba(221, 221, 47, 1)",
            "rgba(235, 86, 42, 1)"
          ],
          label: "Dataset 1"
        }
      ],
      labels: ["Implemented", "On Schedule", "Behind Schedule"]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      legend: {
        display: false
      }
    }
  };
  let data = [totalActionsCompleted, totalActionsInProgress, totalActionsLate];

  var configPie2 = {
    type: "pie",
    plugins: [ChartDataLabels],
    data: {
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgba(84, 178, 5, 1)",
            "rgba(221, 221, 47, 1)",
            "rgba(235, 86, 42, 1)"
          ],
          label: "Dataset 1"
        }
      ],
      labels: ["Implemented", "On Schedule", "Behind Schedule"]
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      legend: {
        display: true,
        position: "right",
        labels: {
          fontFamily: "'Nunito', sans-serif",
          fontStyle: "bold",
          fontColor: "#333",
          usePointStyle: true
        }
      }
    }
  };
  var ctx1 = document
    .getElementById("strategies_piechart1_canvas")
    .getContext("2d");
  window.myPie = new Chart(ctx1, configPie1);
  var ctx11 = document
    .getElementById("strategies_piechart2_canvas_all")
    .getContext("2d");
  window.myPie = new Chart(ctx11, configPie11);

  var ctx3 = document
    .getElementById("actionitem_piechart2_canvas")
    .getContext("2d");
  window.myHorizontalBar = new Chart(ctx3, configPie2);

  ganttChartLowerCursor = -1;
  ganttChartUpperCursor = 0;
  $(function() {
    $(".cus_scroll").overlayScrollbars({});
  });
}
function createtooltip(el) {
  // retrieve data from database, el = project_id
  var currentid = ".proj_" + el;

  var proj_name = "Project Name " + el;
  var completed_items = 7;
  var pending_items = 12;
  var tooltip =
    "<div style='background-color: #f9f9f9;padding: 15px;width: 380px;box-shadow: 1px 0px 6px #ccc;'><h3 style='font-size: 14px;margin: 0;margin-bottom: 20px;font-weight: 700;'>" +
    proj_name +
    "</h3><div><div class='pull-left' style='width:50%'><label style='font-size: 12px;color: #929292;'>Completed action items</label><div style='font-size: 14px;font-weight: 700;'>" +
    completed_items +
    "</div></div><div class='pull-left' style='width:50%'><label style='font-size: 12px;color: #929292;'>Action items pending</label><div style='font-size: 14px;font-weight: 700;'>" +
    pending_items +
    "</div></div><div class='clearfix'></div></div></div>";

  $(currentid).attr("data-toggle", "tooltip");
  $(currentid).attr("data-original-title", tooltip);

  $('[data-toggle="tooltip"]').tooltip({
    container: "body",
    html: true
  });
}
function charcountupdate(str) {
  var lng = str.length;
  document.getElementById("charcount").innerHTML =
    "255" - lng + " " + " " + "characters left";
}
