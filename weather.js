const https = require('https');
var usr;
function get_result(query){
	return new Promise(function(resolve,reject){

		https.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=API_KEY', (resp) => {
			let data = '';
		  
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk;
			});
		  
			// The whole response has been received. Print out the result.
			resp.on('end', () => {
			  // console.log(typeof(data));
			  resolve(JSON.parse(data));
			  //  return data;
			});
		  
		  }).on("error", (err) => {
			reject(err);
		  });
	
	})
	
}
	// var x=get_result("Mumbai");
	// x.then(function(result){
	// 	 usr=result;
	// 	console.log(usr["main"].temp);
	// 	var temperature=toString(usr["main"].temp)
	// 	console.log(temperature)
	// },function(err){
	// 	console.log(err);
	// })
	


module.exports=get_result
