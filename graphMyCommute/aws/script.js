

function callAWS(originAddress, departureAddress, leaveTimeMillis, travelTime){
	console.log("callAWS has begun");

	var home_address = originAddress;
	//home_address = "1011 13th Ave SE Minneapolis, MN 55414"
	var work_address = departureAddress
	//work_address = "7655 Commerce Way Eden Prairie, MN 55344"

	AWS.config.update({region: 'us-east-1'});
	AWS.config.update({accessKeyId: 'AKIAIL5ZI255TUJOR7TQ', secretAccessKey: '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'});
	var lambda = new AWS.Lambda();
	
	//payload = '{"origin" : "{0}" , "destination" : "{1}"}'.format(home_address, work_address);
	payload = {origin : home_address , destination : work_address, departureTime : leaveTimeMillis}


	var params = {
		FunctionName: 'arn:aws:lambda:us-east-1:815393274756:function:graphCommute', /* required */
		Payload: JSON.stringify(payload),
	};

	lambda.invoke(params, function(err, data) {
	  	if (err) 
	  		console.log(err, err.stack); // an error occurred
	  	else{
	  		travelTime = data["Payload"];// successful response
	  		console.log(travelTime);
	  	}
	});


	console.log("callAWS is done");
}

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
