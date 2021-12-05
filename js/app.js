function sendRequest(url, func) {
   fetch(url)
      .then(response => response.json())
      .then(body => func(body));
}

function getInfo(url = "https://api.openweathermap.org/data/2.5/forecast?") {
   const queryParams = {
      q: "Minsk",
      appid: "70a21360959a07d4ec257e63e598fa6b",
      units: "metric",
   };
   url = url + new URLSearchParams(queryParams);
   sendRequest(url, showWeather);
};




function showWeather(obj) {
   document.querySelector(".name__city").innerHTML = obj.city.name;
   document.querySelector(".date").innerHTML = obj.list[0].dt_txt;
   const img = document.querySelector(".img__weather");
   img.style.backgroundImage = `url(http://openweathermap.org/img/w/${obj.list[0].weather[0].icon}.png)`;
   document.querySelector(".text__weather").innerHTML = obj.list[0].weather[0].main;

   document.querySelector(".temp__now").innerHTML = `${Math.round(obj.list[0].main.temp)} &degC`;
   document.querySelector(".wind__now").innerHTML = `Wind: ${obj.list[0].wind.speed} kph`;
   document.querySelector(".precip__now").innerHTML = `Humidity: ${obj.list[0].main.humidity} %`;
   document.querySelector(".pressure__now").innerHTML = `Pressure: ${obj.list[0].main.pressure} mb`;

   const weatherFuture = document.querySelector(".weather__future");
   for (let i = 0; i < 5; i++) {
      const blockFuture = buildBlocksFutureWeather(obj, i);
      blockFuture.hidden = false;

      weatherFuture.append(blockFuture);
   };
};

function testRequest(obj) {
   console.log(obj);
}
getInfo();
// setInterval(getInfo, 10000);

function buildBlocksFutureWeather(obj, i) {
   const blockFuture = document.querySelector(".block__future").cloneNode(true);
   const date = new Date;
   let dateStr = [date.getFullYear(), date.getMonth() + 1, date.getDate() + i].map(elem => {
      if ((elem + "").length === 1) return "0" + elem;
      return elem + "";
   });
   date.setTime(date.getTime() + 86400000 * i);

   let day = (date + '').substring(0, 3);

   blockFuture.querySelector(".day").innerHTML = day;

   let listWeather = [];
   obj.list.forEach(elem => {
      if (elem.dt_txt.substring(0, 10) == dateStr.join("-")) listWeather.push(elem);
   });

   blockFuture.querySelector(".date").innerHTML = dateStr.reverse().join(".").substring(0, 6) + dateStr[2].substring(2);

   let temp = 0;
   let weather = {};
   listWeather.forEach(elem => {
      temp += elem.main.temp;
      if (!weather[elem.weather[0].icon]) weather[elem.weather[0].icon] = 1
      else weather[elem.weather[0].icon] = weather[elem.weather[0].icon] + 1;
   });
   temp = Math.round(temp / listWeather.length);

   blockFuture.querySelector(".temp").innerHTML = `${temp} &degC`;

   let nameImg = "";
   let count = 0;
   for (let key in weather) {
      if (weather[key] > count) {
         count = weather[key];
         nameImg = key;
      };
   };

   const img = blockFuture.querySelector(".img");
   img.style.backgroundImage = `url(http://openweathermap.org/img/w/${nameImg}.png)`;

   return blockFuture;
};