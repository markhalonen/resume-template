globalh2w = []; //Global vars = i dont know what i'm doing.
globalw2h = [];
globalHomeDepartureTimes = [];
var homeDepartureTimeIdx = 0;
globalWorkDepartureTimes = [];
var workDepartureTimeIdx = 0;
doneWithh2w = false;
var mins = [0, 15, 30, 45];
var timeZoneConvert = 0;
var home_address = ""
var work_address = ""

function nextWeekDay(){
    var now = new Date();
    now.setDate(now.getDate() + 1);
    while (now.getDay() == 6 || now.getDay() == 0) //weekend = no traffic
        now.setDate(now.getDate() + 1);
    return now;
}

function getHomeDepartureTimes(){
    homeDepartureTimes = [];

    var today = nextWeekDay();
    
    for(var i = 1; i < 20; i++){
        var minutes = mins[(i - 1) % 4];
        
        homeDepartureTimes[i - 1] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6 + (i - 1) / 4 + timeZoneConvert, minutes, 0, 0);
    }
    return homeDepartureTimes
}

function getWorkDepartureTimes(){
    workDepartureTimes = [];

    var today = nextWeekDay();

    for(var i = 1; i < 20; i++){
        var minutes = mins[(i - 1) % 4];
        
        workDepartureTimes[i-1] = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12 + 3 + (i - 1) / 4 + timeZoneConvert, minutes, 0, 0);
    }
    return workDepartureTimes
}

function chartFunction () {

    home_address = $('#home_address').val();
    work_address = $('#work_address').val();

    // home_address = "1011 13th Ave SE Minneapolis, MN 55414";
    // work_address = "7655 Commerce Way Eden Prairie, MN 55344";

    globalh2w = []; //Global vars = i dont know what i'm doing.
    globalw2h = [];
    globalHomeDepartureTimes = [];
    homeDepartureTimeIdx = 0;
    globalWorkDepartureTimes = [];
    workDepartureTimeIdx = 0;
    doneWithh2w = false;

    globalHomeDepartureTimes = getHomeDepartureTimes();
    globalWorkDepartureTimes = getWorkDepartureTimes();


    globalh2w = []
    globalw2h = []
    for(var i = 0; i < globalHomeDepartureTimes.length; i++){
        globalh2w[i] = -1;
        globalw2h[i] = -1;
    }

    callAWS(home_address, work_address, globalHomeDepartureTimes[0].getTime());

};

function createChart(){
        chartData = []
        var idx = 0;

        for(var i = 0; i < globalw2h.length; i++){
            for(var j = 0; j < globalh2w.length; j++){

                sublist = [];
                sublist[0] = j; // X-axis is home to work
                sublist[1] = i; // Y-axis is work to home
                var sum = (parseInt(globalw2h[i]) + parseInt(globalh2w[j])) / 60.0;
                sublist[2] = sum;
                chartData[idx] = sublist;
                idx = idx + 1;
            }
        }

        yAxisCategories = [];
        xAxisCategories = [];
        for(var i = 0; i < globalw2h.length; i++)
        {
            yAxisCategories[i] = globalHomeDepartureTimes[i].toLocaleTimeString().slice(0, -6) + "am";
            xAxisCategories[i] = globalWorkDepartureTimes[i].toLocaleTimeString().slice(0, -6) + "pm";
        }


        $('#container').highcharts({
        
        chart: {
            type: 'heatmap',
            marginTop: 40,
            spacingBottom: 40,
            height: 500
        },


        title: {
            text: 'Total Commute Time'
        },

        xAxis: {
            categories: yAxisCategories,
            title: {
                enabled: true,
                text: 'Home Departure Time',
                style: {
                    fontWeight: 'normal'
                }
            }
        
        },

        yAxis: {
            categories: xAxisCategories,
            title: {
                enabled: true,
                text: 'Work Departure Time',
                style: {
                    fontWeight: 'normal'
                }
            }
        },

        colorAxis: {
            //min: 2800,
            minColor: '#FFFFB2',
            maxColor: '#FF0000'
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 320,
        },

        tooltip: {
            enabled:false,
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
        },
        

        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: chartData,//,//[[0,0,10],[0,1,19],[0,2,8], [1,0,3], [1,1,4], [1,2,3], [2,0,1], [2,1,8], [2,2,23]],//,[0,3,24],[0,4,67],[1,0,92],[1,1,58],[1,2,78],[1,3,117],[1,4,48],[2,0,35],[2,1,15],[2,2,123],[2,3,64],[2,4,52],[3,0,72],[3,1,132],[3,2,114],[3,3,19],[3,4,16],[4,0,38],[4,1,5],[4,2,8],[4,3,117],[4,4,115],[5,0,88],[5,1,32],[5,2,12],[5,3,6],[5,4,120],[6,0,13],[6,1,44],[6,2,88],[6,3,98],[6,4,96],[7,0,31],[7,1,1],[7,2,82],[7,3,32],[7,4,30],[8,0,85],[8,1,97],[8,2,123],[8,3,64],[8,4,84],[9,0,47],[9,1,114],[9,2,31],[9,3,48],[9,4,91]],
            dataLabels: {
                enabled: false,
                color: 'black',
                style: {
                    textShadow: 'none'
                }
            }
        },],



    });

}



function callAWS(originAddress, departureAddress, leaveTimeMillis){
    AWS.config.update({region: 'us-east-1'});
    insaneLevelEncryption1 = "OnMuyhxyd2+SuhQZ0V9";
    insaneLevelEncryption2 = "xKrZG978+TmhmijgheroP";
    secret = insaneLevelEncryption1 + insaneLevelEncryption2;
    part1 = "AKIAINKQOM";
    part2 = "V57VAY5ZZQ";
    sum = part1 + part2;
    AWS.config.update({accessKeyId: sum, secretAccessKey: secret});
    var lambda = new AWS.Lambda();
    
    //payload = '{"origin" : "{0}" , "destination" : "{1}"}'.format(home_address, work_address);
    payload = {origin : home_address , destination : work_address, departureTime : leaveTimeMillis}
    if(homeDepartureTimeIdx == globalHomeDepartureTimes.length) //Haha
        payload = {origin : work_address , destination : home_address, departureTime : leaveTimeMillis}


    var params = {
        FunctionName: 'arn:aws:lambda:us-east-1:815393274756:function:graphCommute', /* required */
        Payload: JSON.stringify(payload),
    };
    lambda.invoke(params, awsCallback);
}

var awsCallback = function(err, data) {
    if (err){
        console.log("ERRROR");
        console.log(err, err.stack); // an error occurred
    }
    else{
        travelTime = data["Payload"];// successful response

        if(homeDepartureTimeIdx != globalHomeDepartureTimes.length)
        {

            globalh2w[homeDepartureTimeIdx] = travelTime;
            homeDepartureTimeIdx = homeDepartureTimeIdx + 1;
            
        }
        else if(workDepartureTimeIdx != globalWorkDepartureTimes.length)
        {

            globalw2h[workDepartureTimeIdx] = travelTime;
            workDepartureTimeIdx = workDepartureTimeIdx + 1;
            
        }

        var obj= document.getElementById('progress-bar');
        var percentage = (homeDepartureTimeIdx + workDepartureTimeIdx) / (globalHomeDepartureTimes.length + globalWorkDepartureTimes.length);
        percentage = percentage * 100;
        obj.style.width= percentage.toString() + "%";

        if(homeDepartureTimeIdx != globalHomeDepartureTimes.length)
        {
            callAWS(home_address, work_address, globalHomeDepartureTimes[homeDepartureTimeIdx].getTime());
        }
        else if(workDepartureTimeIdx != globalWorkDepartureTimes.length)
        {
            callAWS(work_address, home_address, globalWorkDepartureTimes[workDepartureTimeIdx].getTime());
        }
        else{

            createChart();

        }
      
    }
}

// First, checks if it isn't implemented yet.
// if (!String.prototype.format) {
//   String.prototype.format = function() {
//     var args = arguments;
//     return this.replace(/{(\d+)}/g, function(match, number) { 
//       return typeof args[number] != 'undefined'
//         ? args[number]
//         : match
//       ;
//     });
//   };
// }

