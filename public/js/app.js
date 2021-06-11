var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";


function getLocation() {
	console.log(navigator.geolocation);
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition,function (params) {
			console.log("Geolocation not allowed by the user");
			let position = {
				coords: {
					latitude: 28.6139,
					longitude: 77.2090
				}
			}
			showPosition(position)
		});
	} else {
		console.log("Geolocation is not supported by this browser.");
		let position ={
			coords:{
				latitude: 28.644800,
				longitude: 77.216721
			}
		}
		showPosition(position)
	}
}

function showPosition(position) {
	console.log(position);
	fetch('/getweather', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body:JSON.stringify({
			lat:position.coords.latitude,
			long:position.coords.longitude
		})
	}).then(response=>{
		return response.json()
	}).then(data=>{
		console.log(data);
		setWeather(data);
	});
}

$('#findLocation').submit(function(evt){
	evt.preventDefault();
	var x = $(this).serializeArray();
	let location = {};
	$.each(x, function (i, field) {
		location[field.name] = field.value;
	});
	fetch('/getweatherbycity', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(location)
	}).then(response => {
		return response.json()
	}).then(data => {
		setWeather(data);
	}).catch(err=>{
		console.log(err)
	});

})

function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
	return arr[(val % 16)];
}

function getDate(objToday){
	var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
		dayOfWeek = weekday[objToday.getDay()],
		domEnder = "<sup>"+function () { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }()+"</sup>",
		dayOfMonth = today + (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
		months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
		curMonth = months[objToday.getMonth()],
		curYear = objToday.getFullYear(),
		curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
		curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
		curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
		curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
	var today = dayOfWeek + " " + dayOfMonth +" "+ curMonth + ", " + curYear;
	return today;
}


function setCurrentDay(day,date,location,data,imageSrc){
	return `<div class="today forecast"><div class="forecast-header"> <div class="day">${day}</div> <div class="date">${date}</div> </div><div class="forecast-content"> <div class="location">${location}</div> <div class="degree"> <div class="num">${data.main.temp}<sup>o</sup>C</div><div class="forecast-icon"><img src="${imageSrc}" height="120%"> </div> </div> <span><img src="images/icons/humidity.svg" height ="25" alt="">${data.main.humidity}%</span> <span><img src="images/icon-wind.png" alt="">${data.wind.speed} m/s</span> <span><img src="images/icon-compass.png" alt="">${degToCompass(data.wind.deg)}</span> </div></div>`
}

function setNextDays(day,data,imageSrc){
	return `<div class="forecast"><div class="forecast-header"> <div class="day">${day}</div> </div><div class="forecast-content"> <div class="forecast-icon"> <img src="${imageSrc}" alt="" width=48 height="100%"> </div> <div class="degree">${data.main.temp}<sup>o</sup>C</div> <small>${data.main.feels_like}<sup>o</sup></small> </div> </div>`
}

function setWeather(data) {
	$("#forecastContainer").empty();
	var date = new Date();
	var divEle = setCurrentDay(weekday[date.getDay()],getDate(date),data.city.name+','+data.city.country,data.list[0],getImageString(data.list[0].weather[0].icon));
	$("#forecastContainer").prepend(divEle);

	let arr = Array.from(data.list)
	for(let i = 1;i<arr.length;i++){
		date.setDate(date.getDate()+1)
		let div = setNextDays(weekday[date.getDay()], arr[i],getImageString(arr[i].weather[0].icon));
		$("#forecastContainer").append(div);
	}
}

function getImageString(code){

	return `http://openweathermap.org/img/wn/${code}@2x.png`
}



$(document).ready(function(){
	getLocation()
})