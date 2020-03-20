let seriesData = [
  {
    name: "Completed", //green
    data: [5, 10, 10, 20, 10]
  },
  {
    name: "Pending", //yellow
    data: [15, 10, 30, 20, 20]
  },
  {
    name: "Unselected", //red
    data: [10, 10, 30, 20, 50]
  }
];

let categoriesData = [
  "project1",
  "project2",
  "project3",
  "project4",
  "project5",
  "pro6",
  "pro7",
  "pro8"
];

Highcharts.chart("progress_hbarchar_canvas", {
  chart: {
    type: "bar"
  },
  xAxis: {
    categories: categoriesData
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "Total Strategies"
    }
  },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "top",
    reversed: false
  },

  plotOptions: {
    series: {
      stacking: "normal"
    }
  },
  series: seriesData
});

///////////////////////////////       above code completed progress bar    //////////////////////////////////////////
//
//
//
//////// //////        ///   //          next baseline code start here      //////// /////////////////////

let VRyAxis = [
  {
    name: "Completed",
    data: [
      100000,
      190500,
      109999,
      150000,
      250000,
      300000,
      200000,
      300000,
      500000,
      900000,
      1000000,
      1200000
    ]
  }
];

let VRxAxis = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

Highcharts.chart("trend_linechart1_canvas", {
  yAxis: {
    title: {
      text: "Value Realized (in thousands)"
    }
  },

  xAxis: {
    categories: VRxAxis,
    crosshair: true
  },

  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "top"
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
///////////////////////////////       above code completed base line    //////////////////////////////////////////
//
//
//
//////// //////        ///   //          next Progress bar 2 code start here      //////// /////////////////////

let seriesData2 = [
  {
    name: "Completed", //green
    data: [5, 10, 18, 20, 10]
  },
  {
    name: "Pending", //yellow
    data: [15, 10, 10, 20, 20]
  },
  {
    name: "Unselected", //red
    data: [10, 10, 15, 20, 40]
  },
  {
    name: "No Action", /// GRAY
    data: [12, 1, 28, 23, 20]
  }
];

let categoriesData2 = [
  "project1",
  "project2",
  "project3",
  "project4",
  "project5",
  "pro6",
  "pro7",
  "pro8"
];

Highcharts.chart("container2", {
  chart: {
    type: "bar"
  },
  xAxis: {
    categories: categoriesData2,
    title: {
      text: "Strategy Serial Number"
    }
  },
  yAxis: {
    min: 0,

    title: {
      text: "Completion"
    }
  },
  legend: {
    layout: "vertical",
    align: "right",
    verticalAlign: "top",
    reversed: true
  },

  plotOptions: {
    series: {
      stacking: "normal"
    }
  },
  series: seriesData2
});

///////////////////////////////       above code completed progress bar 2    ///////////////////
///////////////////////
