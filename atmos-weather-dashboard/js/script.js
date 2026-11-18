const $=id=>document.getElementById(id);
let unit="C",lastWeather=null,lastCity=null;
const weatherMap={
0:["Clear sky","☀️"],1:["Mainly clear","🌤️"],2:["Partly cloudy","⛅"],3:["Overcast","☁️"],
45:["Fog","🌫️"],48:["Depositing rime fog","🌫️"],51:["Light drizzle","🌦️"],53:["Drizzle","🌦️"],55:["Dense drizzle","🌧️"],
56:["Freezing drizzle","🌧️"],57:["Heavy freezing drizzle","🌧️"],61:["Slight rain","🌦️"],63:["Rain","🌧️"],65:["Heavy rain","🌧️"],
66:["Freezing rain","🌧️"],67:["Heavy freezing rain","🌧️"],71:["Slight snow","🌨️"],73:["Snow","🌨️"],75:["Heavy snow","❄️"],77:["Snow grains","🌨️"],
80:["Rain showers","🌦️"],81:["Heavy showers","🌧️"],82:["Violent showers","⛈️"],85:["Snow showers","🌨️"],86:["Heavy snow showers","❄️"],
95:["Thunderstorm","⛈️"],96:["Thunderstorm with hail","⛈️"],99:["Severe thunderstorm","⛈️"]
};
function condition(code){return weatherMap[code]||["Unknown conditions","🌡️"]}
function celsiusToF(c){return Math.round(c*9/5+32)}
function displayTemp(c){return unit==="C"?Math.round(c):celsiusToF(c)}
function getRecent(){try{return JSON.parse(localStorage.getItem("atmosRecent")||"[]")}catch{return []}}
function saveRecent(city){let list=getRecent().filter(x=>x.toLowerCase()!==city.toLowerCase());list.unshift(city);localStorage.setItem("atmosRecent",JSON.stringify(list.slice(0,5)));renderRecent()}
function renderRecent(){let list=getRecent(),wrap=$("recent-wrap"),box=$("recent-searches");box.innerHTML="";wrap.classList.toggle("hidden",list.length===0);list.forEach(city=>{let b=document.createElement("button");b.className="chip";b.textContent=city;b.type="button";b.addEventListener("click",()=>searchCity(city));box.append(b)})}
function setStatus(message,isError=false){$("status").textContent=message;$("status").classList.toggle("error",isError)}
async function searchCity(city){
 city=city.trim();if(city.length<2){setStatus("Please enter a city name with at least two characters.",true);return}
 $("search-btn").disabled=true;$("search-btn").textContent="Searching…";setStatus("Finding your location and fetching live weather…");$("weather-content").classList.add("hidden");
 try{
  const geoUrl=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const geoResponse=await fetch(geoUrl);if(!geoResponse.ok)throw new Error(`Location service error (${geoResponse.status}). Please try again.`);
  const geoData=await geoResponse.json();if(!geoData.results||geoData.results.length===0)throw new Error(`We couldn't find "${city}". Check the spelling and try another city.`);
  const place=geoData.results[0];
  const params=new URLSearchParams({latitude:place.latitude,longitude:place.longitude,current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",timezone:"auto",forecast_days:"5"});
  const weatherResponse=await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if(!weatherResponse.ok)throw new Error(`Weather service error (${weatherResponse.status}). Please try again later.`);
  const data=await weatherResponse.json();if(!data.current||!data.daily)throw new Error("The weather service returned incomplete data. Please try again.");
  lastWeather={place,data};lastCity=place.name;saveRecent(place.name);renderWeather();setStatus("");
 }catch(error){setStatus(error.message==="Failed to fetch"?"Network error. Check your internet connection and try again.":error.message,true)}
 finally{$("search-btn").disabled=false;$("search-btn").innerHTML='Search <span>→</span>'}
}
function renderWeather(){
 const {place,data}=lastWeather,c=data.current,d=data.daily,desc=condition(c.weather_code);
 $("weather-content").classList.remove("hidden");$("place-name").textContent=place.name+(place.admin1?`, ${place.admin1}`:"");
 $("place-meta").textContent=[place.country,place.timezone].filter(Boolean).join(" · ");
 $("current-day").textContent=new Date(c.time).toLocaleString(undefined,{weekday:"long",hour:"numeric",minute:"2-digit"});
 $("temperature").textContent=displayTemp(c.temperature_2m);$("unit-symbol").textContent=`°${unit}`;
 $("condition").textContent=desc[0];$("current-icon").textContent=desc[1];
 $("feels-like").textContent=`Feels like ${displayTemp(c.apparent_temperature)}°${unit}`;
 $("humidity").textContent=`${c.relative_humidity_2m}%`;$("wind").textContent=`${Math.round(c.wind_speed_10m)} km/h`;$("rain").textContent=`${c.precipitation} mm`;
 $("updated-label").textContent=`LOCAL TIME · ${c.time.replace("T"," ")}`;
 const grid=$("forecast");grid.innerHTML="";
 d.time.forEach((date,i)=>{let info=condition(d.weather_code[i]),day=new Date(date+"T12:00:00").toLocaleDateString(undefined,{weekday:"short"});
 let card=document.createElement("article");card.className="day-card";
 card.innerHTML=`<div class="day">${i===0?"TODAY":day.toUpperCase()}</div><div class="day-icon">${info[1]}</div><div class="day-condition"></div><div class="temps"></div>`;
 card.querySelector(".day-condition").textContent=info[0];
 card.querySelector(".temps").textContent=`${displayTemp(d.temperature_2m_max[i])}°`;
 let low=document.createElement("span");low.className="low";low.textContent=`${displayTemp(d.temperature_2m_min[i])}°`;card.querySelector(".temps").append(low);
 grid.append(card);
 });
}
$("search-form").addEventListener("submit",e=>{e.preventDefault();searchCity($("city-input").value)});
$("unit-toggle").addEventListener("click",()=>{unit=unit==="C"?"F":"C";$("unit-toggle").textContent=unit==="C"?"°C / °F":"°F / °C";if(lastWeather)renderWeather()});
$("theme-toggle").addEventListener("click",()=>{document.body.classList.toggle("light");let light=document.body.classList.contains("light");localStorage.setItem("atmosTheme",light?"light":"dark");$("theme-toggle").textContent=light?"🌙":"☀️"});
if(localStorage.getItem("atmosTheme")==="light"){document.body.classList.add("light");$("theme-toggle").textContent="🌙"}
renderRecent();
