
var sKeyAPI = "ce61eec684e9c70b67cd58ccd89bee51";
var allStorLocPlaces = [];
var allPlaces = [];
var sLocalStorageName = "obj_weather_buttons";

//----------------------------------------------------------------------------------------loadpage()
//Getting data saved in local storage and "feeding" it to the allPlaces[] array.
//Displaying the buttons based on the data saved in Local Storage.
function loadPage() {
    var objWeatherButtons = localStorage.getItem(sLocalStorageName);

    if(objWeatherButtons == null || objWeatherButtons == "undefined") {
      allStorLocPlaces = [];
    } else {
        allStorLocPlaces = JSON.parse(objWeatherButtons);
    }

    var buttonsSection = document.querySelector("#btns_section");
    for (let i = 0; i < allStorLocPlaces.length; i++) {
        const aPlace = allStorLocPlaces[i];

        //Creating button dynamically
        var btn = document.createElement('BUTTON');
        btn.id = aPlace.id;
        btn.setAttribute("class", "city_search");
        var tNode = document.createTextNode(aPlace.place);
        btn.appendChild(tNode);
        btn.addEventListener("click", getWeatherForButton);
        buttonsSection.appendChild(btn);   
    }

}
//---------------------------------------------------------------------------------------------------------weatherInfoDay()
//Making area and displaying the information for one day
function weatherInfoDay(sLatNum, sLonNum){
    var sURL = "https://api.openweathermap.org/data/2.5/weather"; 
    var sLat = "lat=" + sLatNum;
    var sLon = "lon=" + sLonNum;
    var sUnits = "units=imperial";
    var sKey = "appid=" + sKeyAPI;
    var sRequest = sURL + "?" + sLat + "&" + sLon + "&" + sUnits + "&" + sKey;

     fetch(sRequest)
    .then(function(response) {
        return response.json();                    
    })
    .then(function (data) {  
        readResponceSingle();             
    });
}

//---------------------------------------------------------------------------------------------------getbyLatLonForecast(p1, p2)
function getByLatLonForecast(sLatNum, sLonNum) {
    var sURL = "https://api.openweathermap.org/data/2.5/forecast"; //forecast for 5 days
    var sLat = "lat=" + sLatNum;
    var sLon = "lon=" + sLonNum;
    var sUnits = "units=imperial";
    var sKey = "appid=" + sKeyAPI;
    var sRequest = sURL + "?" + sLat + "&" + sLon + "&" + sUnits + "&" + sKey;

     fetch(sRequest)
    .then(function(response) {
        return response.json();                    
    })
    .then(function (data) {  
        readResponce(data);        
    });
}

//--------------------------------------------------------------------------------------------------getWeatherForButton()
function getWeatherForButton() {
    var sLatNum = "";
    var sLonNum = "";

    //Getting the ID from the button
    var btnID = $(this).attr('id');

    //Finding the latitude and longitude for the ID
    for (let i = 0; i < allStorLocPlaces.length; i++) {
        var sID = allStorLocPlaces[i].id;
        if(sID ==  btnID) {
            sLatNum = allStorLocPlaces[i].lat;
            sLonNum = allStorLocPlaces[i].lon;
            break;
        }
    }

    if(sLatNum !== "" && sLonNum !== "") {
        getByLatLon(sLatNum, sLonNum); 
        getByLatLonForecast(sLatNum, sLonNum);
    }
} 


//---------------------------------------------------------------------------------------------------readResponseSingle(p1)
function readResponceSingle(result) {
   var weatherInfoContainer = document.querySelector('#weather-title');
    
    var iDate = result.dt;
    var dDate = dayjs(iDate * 1000);
    var sDate = dDate.format('MM/DD/YYYY');

    var weatherTitle = result.name;
 
    var iconCode = result.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    $("#wicon").attr('src', iconURL);

    var skyTitle = result.weather[0].main;
    var tempTitle = result.main.temp;
    var windTitle = result.wind.speed;
    var humidTitle = result.main.humidity;

    //The Title
    weatherInfoContainer.innerText =  weatherTitle + "(" + sDate + ")";
    weatherInfoContainer.innerText += " Condition: " + skyTitle + "\n"; 

    //the Text
    var otherFactorContainer = document.querySelector('#other-text');
    otherFactorContainer.innerText = "Temp: " + tempTitle + "°F" + "\n";
    otherFactorContainer.innerText += "Wind: " + windTitle + " MPH" + "\n";
    otherFactorContainer.innerText += "Humidity: " + humidTitle + "%" + "\n";
}



//---------------------------------------------------------------------------------------------------getByLatLon(p1,p2)
function getByLatLon(sLatNum, sLonNum) {
    var sURL = "https://api.openweathermap.org/data/2.5/weather"; 
    var sLat = "lat=" + sLatNum;
    var sLon = "lon=" + sLonNum;
    var sVar = "exclude=hourly,daily"; 
    var sUnits = "units=imperial";
    var sKey = "appid=" + sKeyAPI;
    var sRequest = sURL + "?" + sLat + "&" + sLon + "&" + sVar + "&" + sUnits + "&" + sKey;

    fetch(sRequest)
    .then(function(response) {
        return response.json();                    
    })
    .then(function (data) {  
        readResponceSingle(data);        
    });
}

//---------------------------------------------------------------------------------------------------clearSelection()
function clearSelection() {
    var arrObjects = ["#select_label", "#select_options", "#btn_select"];
    var selectSection = document.querySelector(".selection");

    for (let i = 0; i < arrObjects.length; i++) {
       var child_name = arrObjects[i];
       var child = selectSection.querySelector(child_name);
        selectSection.removeChild(child);        
    }
}

//---------------------------------------------------------------------------------------------------makeSelection()
function makeSelection() {
    var selectObject = $("#select_options");
    var selectedText = selectObject.find(":selected").text();
    var sID = "";
    var sPlace = "";
    var sLat = "";
    var sLon = "";
    clearSelection();

    for (let i = 0; i < allPlaces.length; i++) {
        sPlace = allPlaces[i].place;

        if(sPlace == selectedText) {
            sLat = allPlaces[i].lat;
            sLon = allPlaces[i].lon;
            break;       
        }        
    }

    sID = sLat + "& " + sLon;;
    var iAllStorLocPlacesLength = allStorLocPlaces.length;
    if( iAllStorLocPlacesLength  > 0) {
        for (let i = 0; i <  iAllStorLocPlacesLength ; i++) {
            var iExistingID = allStorLocPlaces[i].id;
        if(iExistingID == sID) {
            alert("You already have the same place saved. Please check buttons for this city.");
            return;
        }
            
        }
    }

    //After the user finds the city, we are creating the button of the city
    var buttonsSection = document.querySelector("#btns_section");

    //appending the Latitude, Longitude, Place, and ID
    var aStorLocPlace = {id:sID, place: sPlace, lat: sLat , lon: sLon};
    allStorLocPlaces.push(aStorLocPlace);

    //Adding this to Local Storage
    localStorage.setItem(sLocalStorageName, JSON.stringify(allStorLocPlaces));

    //Creating button dynamically
    var btn = document.createElement('BUTTON');
    btn.id = sID;
    btn.setAttribute("class", "city_search");
    var tNode = document.createTextNode(selectedText);
    btn.appendChild(tNode);
    btn.addEventListener("click", getWeatherForButton);
    buttonsSection.appendChild(btn);

    //Getting current weather information to the screen
    getByLatLon(sLat , sLon); 

    //Getting the 5-day forecast to the screen
    getByLatLonForecast(sLat , sLon);
}

//---------------------------------------------------------------------------------------------------
function createSelectionAPI() {
    var array = allPlaces;
    var selectSection = document.querySelector(".selection");
    var objSection = document.querySelector("#select_options");

    if(objSection != null) {
        return;
    }

    //Creating the labels for input
    var newLabel = document.createElement("label");
    newLabel.setAttribute("for", "select_box");
    newLabel.setAttribute("id", "select_label");
    newLabel.innerHTML = "Please select:";
    selectSection.appendChild(newLabel);

    //Selecting Options
    var selectList= document.createElement("select");
    selectList.id = "select_options";

    //Create and Append options
    for (let i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i].place;
        option.text = array[i].place;
        selectList.appendChild(option);
    }
    selectSection.appendChild(selectList);

    //Making city selection button
    var btn = document.createElement('BUTTON');
    btn.id = "btn_select";
    var tNode = document.createTextNode("Get info for selected city");
    btn.appendChild(tNode);
    btn.addEventListener("click", makeSelection);

    selectSection.appendChild(btn);
}

//---------------------------------------------------------------------------------------getLatLonByCity(p1)
function  getLatLonByCity(sCity) {
        var sURL = "https://api.openweathermap.org/geo/1.0/direct";
        var sPlace = "q=" + sCity;
        var sUnits = "limit=10";
        var sKey = "appid=" + sKeyAPI;
        var sRequest = sURL + "?" + sPlace + "&" + sUnits + "&" + sKey;

        fetch(sRequest)
        .then(function(response) {
            return response.json();                    
        })

        .then(function (data) {  
            allPlaces = [];
            for (var i = 0; i < data.length; i++) {
                var sPlace = data[i].name + "," + data[i].state+ " " + data[i].country;
                var aPlace = {place: sPlace, lat: data[i].lat, lon: data[i].lon};
                allPlaces.push(aPlace);
            }
            createSelectionAPI();

        });
}

//----------------------------------------------------------------------------------------searchCity()
function searchCity() {    
    var searchBox = document.querySelector("#city_search");
    
   var sCityName = searchBox.value;

//Getting all the cities for that city name (Fun fact: "Chester" is located in Pennsylvania, Great Britain, etc.!)
getLatLonByCity(sCityName);
}

//--------------------------------------------------------------------------------readResponce(p1)
function readResponce(result) {
   //------------------------------The hierarchy of the API
    //result[]
        //city
            //list
                //weather[]
                    //main
    

    //get current weather
    var iIndexDay = 0;             
    var arrList = result.list; 
    var iLength = arrList.length;

    if (iLength < 1) {
        alert("Cannot find forecast data");
        return;
    }
    var sDayToRecord = "";
    var sSky = "";
    var sTemperature = "";
    var sWind = "";
    var sHumidity = "";

    var dDate = dayjs(); 
    dDate = dDate.set('hour', 12).set('minute', 0).set('second', 0)

    //Find the weather for the current day and time
    dDate = dDate.add(1, 'day');
    var sDate = dDate.format('YYYY-MM-DD HH:mm:ss');

    //get weather for 12 PM on future 5 days
    for (var i = 0; i < iLength; i++) {
        var sDateFromWeb = arrList[i].dt_txt;

        if (sDateFromWeb == sDate) {

            sDayToRecord = dDate.format('YYYY-MM-DD');
            sSky = arrList[i].weather[0].main;
            sTemperature = arrList[i].main.temp;
            sWind = arrList[i].wind.speed;
            sHumidity = arrList[i].main.humidity;

            var iconCode = arrList[i].weather[0].icon;
            var sIiconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
    
            var aDayForecast = {Day: sDayToRecord, Sky: sSky, Temperature: sTemperature, Wind: sWind, Humidity: sHumidity, icon: sIiconURL};
    
            //display weather info in the box for a day
            iIndexDay += 1;
            var sTitleID = "#weather-title-" + String(iIndexDay);
            

            //Title
            var weatherInfoContainer = document.querySelector(sTitleID);
            weatherInfoContainer.innerText =  sDayToRecord;

            //Icon
            var sIconID = "#wicon-" + String(iIndexDay);
            var iconCode = arrList[i].weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $(sIconID).attr('src', iconURL);

            //Text
            var sTextID = "#other-text-" + String(iIndexDay);
            var otherFactorContainer = document.querySelector(sTextID);

            otherFactorContainer.innerText = "Temp: " + sTemperature + "°F" + "\n"
            otherFactorContainer.innerText += "Wind: " + sWind + " MPH" + "\n"
            otherFactorContainer.innerText += "Humidity: " + sHumidity + "%" + "\n"

           //Adding a day
            dDate = dDate.add(1, 'day');
            sDate = dDate.format('YYYY-MM-DD HH:mm:ss');
        }
    } 
}
