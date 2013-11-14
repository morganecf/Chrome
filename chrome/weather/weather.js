
/*
* TODO: Better error-handling. Also, displayError won't work 
* TODO: Can put weather codes in global hashtable with overridden get method that finds closest code 
* Will facilitate adding more pictures. Also way too many if statements in getWeather 
* TODO: Add more weather codes/images. See here: http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes
*/

// The background generator 
var backgroundGenerator = {

	/*
	* Attempt to get latitude and longitude. 
	* If this succeeds query OpenWeather API for the current weather. 
	* Otherwise display an error (for now). 
	*/
	generateBackground: function () {
		this.getLocation();
	},

	// Get the user's current location 
	getLocation: function () {
		var self = this;

		if (!navigator.geolocation) {
			self.displayError("Geolocation is not supported :(");
		}

		function success(position) {
			alert("in success function");
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			self.getWeather(latitude, longitude);
		}

		function error(err) {
			switch(err.code) {
				case error.PERMISSION_DENIED:
					self.displayError("You denied me permission to display the weather :(");
					break;
				case error.POSITION_UNAVAILABLE:
					self.displayError("Your position is unavailable :(");
					break;
				case error.TIMEOUT:
					self.displayError("Oops...timed out :(");
					break;
				case error.UNKNOWN_ERROR:
					self.displayError("I don't know what's going on! :(");
			}
			self.displayError("I don't know what's going on! :(");
		}

		navigator.geolocation.getCurrentPosition(success, error);

	},

	getWeatherAlternative: function(lat, lng) {
		var query = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&callback=?";

		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var json = xhr.responseText;
			json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1');
			json = JSON.parse(json);
		};
		
		// Example:
		data = 'Example: appended to the query string..';
		xhr.open('GET', 'http://domain/getjson?data=' + encodeURIComponent(data));
	},

	/*
	* Use JSONP to query OpenWeather API for current weather information. 
	* TODO: Get more pictures. And eschew ugly slew of else ifs
	*/
	getWeather: function(lat, lng) {
		var query = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lng+"&callback=?";

		// Asynchronous call 
		$.getJSON(query, function(data) {
			var code = data.weather[0].id;
			alert(code);
			var imgsrc = '';

			if ( code <= 232 && code >= 200 ) {
				imgsrc = 'thunderstorm.jpg';
			}
			else if ( (code <= 321 && code >= 300) || (code <= 522 && code >= 500) ) {
				imgsrc = 'rain.jpg';
			}
			else if ( code <= 621 && code >= 600 ) {
				imgsrc = 'snow.jpg';
			}
			else if ( code == 701 || code == 721 ) {
				imgsrc = 'mist.jpg';
			}
			else if ( code == 741 ) {
				imgsrc = 'fog.jpg';
			}
			else if ( code == 800 ) {
				imgsrc = 'clear.jpg';
			}
			else if ( code == 801 ) {
				imgsrc = 'few_clouds.jpg';
			}
			else if ( code == 802 || code == 803 ) {
				imgsrc = 'scattered_clouds.jpg';
			}
			else if ( code == 804 ) {
				imgsrc = 'overcast.jpg';
			}

			alert(imgsrc);

			document.getElementById("background").src = 'backgrounds/'+imgsrc;
		});
	},

	displayWeather: function(picname) {
		var path = 'backgrounds/'+picname;
		document.getElementById("background").src = path;
	},

	displayError: function(error) {
		document.getElementById("error").display = 'block';
	}
	
};

// Run script to generate background when DOM elements are ready
// Or should do this WHILE DOM elements are loading? Since want to load background at the same time? 
document.addEventListener('DOMContentLoaded', function () {
	backgroundGenerator.generateBackground();
});
