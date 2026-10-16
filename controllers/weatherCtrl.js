let weatherChart = null
let weatherCalendar = null

const weatherIcons = {
    sunny:  'bi-sun',
    clear:  'bi-sun',
    cloudy: 'bi-cloud',
    rainy:  'bi-cloud-rain',
    rain:   'bi-cloud-rain',
    stormy: 'bi-cloud-lightning-rain',
    storm:  'bi-cloud-lightning-rain',
    snowy:  'bi-snow',
    snow:   'bi-snow',
    foggy:  'bi-cloud-fog',
    fog:    'bi-cloud-fog',
    windy:  'bi-wind'
}

function getWeatherIcon(type){
    return weatherIcons[(type || '').toLowerCase()] || 'bi-cloud-sun'
}

async function getWeather(){

    const response = await fetch(`http://localhost:3000/weather`, {
        method:"GET",
        headers:{"Content-Type":"application/json"},
    });

    if(response.status !=200){
        const res = await response.json();
        showMessage('danger','error',res.error)
    }
    else{
        const datas = await response.json();
        drawWeatherTable(datas.results)
        initWeatherChart(datas.results)
        initWeatherCalendar(datas.results)
    }
}


function drawWeatherTable(results){
    let tbody = document.querySelector('#tbody')
    tbody.innerHTML=""

    let sumMin = 0
    let sumMax = 0

    // copy, so the original array isn't mutated
    let rows = [...results].reverse()

    rows.forEach(w=>{
        sumMin += Number(w.temp_min)
        sumMax += Number(w.temp_max)

        tbody.innerHTML+=`
            <tr>
                <th scope="row">${w.ID}</th>
                <td>${moment(w.date).format('YYYY-MM-DD')}&nbsp;&nbsp;<i class="bi bi-calendar-week"></i></td>
                <td>${w.location}</td>
                <td><i class="bi ${getWeatherIcon(w.weather_type)}"></i>&nbsp;${w.weather_type}</td>
                <td class="text-end">${w.temp_min} °C</td>
                <td class="text-end">${w.temp_max} °C</td>
                <td class="text-end">${w.precipitation} mm</td>
                <td class="text-end">${w.precipitation_probability} %</td>
                <td class="text-end">${w.wind_speed} km/h ${w.wind_direction ?? ''}</td>
                <td class="text-end">${w.humidity} %</td>
                <td class="text-end">${w.pressure} hPa</td>
                <td class="text-end">${w.uv_index}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-danger" onclick="deleteWeather(${w.ID})">
                        <i class="bi bi-trash3">&nbsp;&nbsp;Delete</i>
                    </button>
                </td>
            </tr>
            `
    })

    // averages in the footer
    let count = rows.length || 1
    tbody.innerHTML+=`
    <tr class="t foot">
        <td><br></td>
        <td colspan="3"><strong>Average:</strong></td>
        <td class="text-end"><strong>${(sumMin / count).toFixed(1)} °C</strong></td>
        <td class="text-end"><strong>${(sumMax / count).toFixed(1)} °C</strong></td>
        <td colspan="8"><br></td>
    </tr>`
}

async function deleteWeather(weatherID){

    let luid = loadUser() ? loadUser().ID : 0;

    const response = await fetch(`http://localhost:3000/weather/${weatherID}`, {
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({luid})
    });

    const res = await response.json();

    if(response.status !=200){
        showMessage('danger','error',res.error)
    }
    else{
        showMessage('success','ok',res.message)
        getWeather()
    }
}

async function createWeather() {
    let date = document.querySelector('#date')
    let location = document.querySelector('#location')
    let temp_min = document.querySelector('#tempmin')
    let temp_max = document.querySelector('#tempmax')
    let weather_type = document.querySelector('#weathertype')
    let precipitation = document.querySelector('#precipitation')
    let precipitation_probability = document.querySelector('#precipitationprobability')
    let wind_speed = document.querySelector('#windspeed')
    let wind_direction = document.querySelector('#winddirection')
    let humidity = document.querySelector('#humidity')
    let pressure = document.querySelector('#pressure')
    let uv_index = document.querySelector('#uvindex')

    let luid = loadUser() ? loadUser().ID : 0;
    let data = {
        luid,
        date: date.value,
        location: location.value,
        temp_min: temp_min.value,
        temp_max: temp_max.value,
        weather_type: weather_type.value,
        precipitation: precipitation.value,
        precipitation_probability: precipitation_probability.value,
        wind_speed: wind_speed.value,
        wind_direction: wind_direction.value,
        humidity: humidity.value,
        pressure: pressure.value,
        uv_index: uv_index.value
    }

    const response = await fetch(`http://localhost:3000/weather`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

    if(response.status !=200){
        const res = await response.json();
        showMessage('danger','error',res.error)
    }
    else{
        getWeather()
        date.value=null
        location.value=''
        temp_min.value=0
        temp_max.value=0
        weather_type.value=''
        precipitation.value=0
        precipitation_probability.value=0
        wind_speed.value=0
        wind_direction.value=''
        humidity.value=0
        pressure.value=1013
        uv_index.value=0
    }
}

function initWeatherChart(results){

    // oldest -> newest, without mutating the original array
    let rows = [...results].sort((a, b) => new Date(a.date) - new Date(b.date))

    let labels = []
    let tempMin = []
    let tempMax = []
    let precip = []

    rows.forEach((w)=>{
        labels.push(moment(w.date).format('YYYY-MM-DD'))
        tempMin.push(w.temp_min)
        tempMax.push(w.temp_max)
        precip.push(w.precipitation)
    })

    const ctx = document.getElementById('myChart');

    // avoid "Canvas is already in use" on re-render
    if(weatherChart){
        weatherChart.destroy()
    }

    weatherChart = new Chart(ctx, {
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Max temp (°C)',
                    data: tempMax,
                    borderColor: 'rgb(220, 53, 69)',
                    backgroundColor: 'rgba(220, 53, 69, 0.4)',
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    yAxisID: 'y'
                },
                {
                    type: 'line',
                    label: 'Min temp (°C)',
                    data: tempMin,
                    borderColor: 'rgb(13, 110, 253)',
                    backgroundColor: 'rgba(13, 110, 253, 0.4)',
                    borderWidth: 2,
                    pointStyle: 'circle',
                    pointRadius: 6,
                    pointHoverRadius: 10,
                    yAxisID: 'y'
                },
                {
                    type: 'bar',
                    label: 'Precipitation (mm)',
                    data: precip,
                    backgroundColor: 'rgba(13, 202, 240, 0.5)',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            scales: {
                y:  { position: 'left',  title: { display: true, text: '°C' } },
                y1: { position: 'right', beginAtZero: true, title: { display: true, text: 'mm' }, grid: { drawOnChartArea: false } }
            }
        }
    });
}

function initWeatherCalendar(results){
    var calendarEl = document.getElementById('calendar');
    colorScheme = localStorage.getItem('StepcounterTheme') || 'light'

    let myEvents = results.map((w)=>{
        return {
            title: `${w.weather_type} ${w.temp_min}° / ${w.temp_max}° (${w.location})`,
            start: w.date
        }
    })

    // avoid stacking calendars on re-render
    if(weatherCalendar){
        weatherCalendar.destroy()
    }

    weatherCalendar = new FullCalendar.Calendar(calendarEl, {
      colorScheme: colorScheme,
      initialDate: new Date(),
      initialView: 'dayGridMonth',
      nowIndicator: true,
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      navLinks: true,
      editable: false,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      events: myEvents
    });

    weatherCalendar.render();
}