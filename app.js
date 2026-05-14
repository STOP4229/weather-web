let select = document.querySelector("select") ; 
let city_name = select.value ; 
let input = document.querySelector(".add-city input") ;   
let country_select = document.querySelector(".country-select") ; 
let country_name = "PK" ; 
let latitude ; 
let longitude ;
let data ; 
let current_temperature_box = document.querySelector(".temperature p") ; 
let humidity_box = document.querySelector(".humidity p") ; 
let uv_index_box = document.querySelector(".uv-index p") ;
let feellike_temperature_box = document.querySelector(".feel-like-temperature p") ; 
let tommorow_weather_box = document.querySelector(".tommorow-weather p") ; 
let rain_box = document.querySelector(".rain_box") ; 
let precipitation_probability_box = document.querySelector(".precipitation_probability") ; 


let date = new Date() ; 
const offset = date.getTimezoneOffset() * 60000;
date = new Date (date - offset ) ; 


async function main(select , option) { 
   let data = await req_api(option.value);
    if (data[0]==undefined) {
        alert("Please enter a valid city name") ;
    } 
    else{ 
        alert("City is added") ;
        select.appendChild(option) ;
    }
    latitude_array = data[0] ; 
    return latitude_array ; 
 }

   
 

for (country in countryList) {
    let option = document.createElement("option") ; 
    option.value = countryList[country] ; 
    option.innerText = country ; 
    option.setAttribute("class" , "countryselect-option") ; 
    country_select.appendChild(option) ;  
    if (country=="PKR") {
        option.selected = true ; 
    }
}  
country_select.addEventListener("change" , (event)=>{
  country_name = event.target.value ; 
}) ; 




select.addEventListener("change", () => {
    city_name = select.value;
    if (select.value == "dubai") {
        country_name = "UAE" ;
    }
    latiutude_array_function(city_name).then(latitude_array => {
        latitude = latitude_array.latitude;
        longitude = latitude_array.longitude;
        real(latitude, longitude); 
    });
});



const button_function = ()=>{
let input = document.querySelector(".add-city input") ; 
 let button = document.querySelector(".add-city button") ; 
 let submit_button = document.querySelector(".submit-button") ; 
 submit_button.setAttribute("class" , "submit-button") ; 
 button.setAttribute("class" , "hidden") ; 
input.setAttribute("class" , "input") ;   
return input ; 
} 

const submit_buttton_function = () =>{
    let input = document.querySelector(".add-city input") ;      
    let option = document.createElement("option") ; 
    option.innerText = input.value ; 
    option.value = input.value ; 
    main(select , option) ; 
    return input.value;
} 


input.addEventListener("keydown" , (event)=>{ 
    if (event.key=="Enter") {
        let input_value = submit_buttton_function ();  
    }
}) ;


async function  req_api(city_name) {
    let api = await fetch(
        `https://api.api-ninjas.com/v1/geocoding?city=${city_name}%20&country=${country_name}`  , 
        {
            method : "get" , 
            headers : {
                "X-Api-Key" : "ZbneJxjENGAqo96YvbLqqznNLgLv2Ww96GqNa435" , 
            } 
        }
    )  
    let final_api =await api.json() ;   
   return final_api ; 
}  

 async function latiutude_array_function(city_name) {
   let data = await req_api(city_name) ; 
   return data[0] ; 
} 

latiutude_array_function(city_name).then(latitude_array=>{
     latitude = latitude_array.latitude ; 
     longitude = latitude_array.longitude ; 
    real(latitude , longitude) ; 
}) ; 
  
 




async function weather_api(latitude , longitude) { 
let api = await fetch (`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,precipitation_probability,windspeed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset&current_weather=true&forecast_days=3&timezone=Asia%2FKarachi
`) ;
  data = await api.json() ;
return data ; 
} 
async function real(latitude , longitude) {
    await weather_api (latitude , longitude) ;  
    current_temp = data.current_weather.temperature ; 
    current_temperature_box.innerText = ` ${current_temp} ` ; 
   let date_indux = data.hourly.time.findIndex(t => t.startsWith(date.toISOString().slice(0 , 13))) ; 
   let humidity = data.hourly.relativehumidity_2m[date_indux] ;  
   let tomorrowMaxTemp = data.daily.temperature_2m_max[1]; 
   let uv_index = data.hourly.uv_index[date_indux] ; 
   let feellike_temp = data.hourly.apparent_temperature[date_indux] ;  
   let today_max_temp = data.daily.temperature_2m_max[0] ; 
   let temp_diffrence = tomorrowMaxTemp - today_max_temp ; 
   if (temp_diffrence < 0) {
      tommorow_weather_box.innerText = `Tommorow will be ${Math.abs(temp_diffrence).toFixed(1)} degree celcius colder than today` ;
   } 
   else if (temp_diffrence == 0){
    tommorow_weather_box.innerText = `Tommorow max temperature will be same as today` ;  
    } 
    else {
        tommorow_weather_box.innerText =`Tommorow will be ${temp_diffrence.toFixed(1)} degree celcius hoter than today` ;
    }
   feellike_temperature_box.innerText = feellike_temp ;
   uv_index_box.innerText = uv_index ;
   humidity_box.innerText = humidity ;
   
   let rain_msg = `No rain is expected` ; 
   for (let i = date_indux + 1 ; i<=date_indux + 6 ; i++) {
    if (data.hourly.precipitation[i] > 0) {
        let hoursfromNow = i - date_indux ; 
        rain_msg = `Rain is expected in ${hoursfromNow} hour(s)` ;  
    } 

    rain_box.innerText = rain_msg ; 
    
    let precipitation_probability = `${data.hourly.precipitation_probability[date_indux]}` ; 
    precipitation_probability_box.innerText = precipitation_probability ;

   } 
   
} 
async function search_Api(input_value) {
     let api_fetch = await fetch (`https://api.weatherapi.com/v1/search.json?key= 7c9eaf6e3e4c48a7830151944261604&q=${input_value}`) ;   
     api_fetch = await api_fetch.json() ;   
    return api_fetch ; 
} 
  let timer ;
  let unordered_list = document.querySelector("ul") ; 
input.addEventListener("input" , (event )=>{   
    clearTimeout(timer) ; 
   unordered_list.innerHTML = "" ;
   let input_value = input.value ;
  if (input_value.length > 2) { 
  timer = setTimeout(()=> {search_Api(input_value).then((api_fetch)=>{ 
    for(let i = 0 ; i < api_fetch.length ; i++) {
        let list_item = document.createElement("li") ;  
        list_item.innerText = api_fetch[i].name ;   
         unordered_list.appendChild(list_item) ;
         unordered_list.addEventListener("click" , (e)=>{     
        if (e.target.tagName === 'LI') {
             let selected_city = e.target.textContent ; 
            input.value = selected_city ; 
            unordered_list.innerHTML = "" ; 
          }
        })
    } 
  } ) } , 300);  

  }
 }) ; 



 