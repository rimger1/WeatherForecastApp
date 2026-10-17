let weatherChart = null
let weatherCalendar = null

let loggeduser = loadUser()

let editingID = null      // ID of the row being edited (null = adding new)
let weatherData = []      // the last loaded rows, used by editWeather()

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
        weatherData = datas.results
        drawWeatherTable(datas.results)
        initWeatherChart(datas.results)
    }
}

async function getWeatherGuest(){

    const response = await fetch(`http://localhost:3000/guest/weather`, {
        method:"GET",
        headers:{"Content-Type":"application/json"},
    });

    if(response.status !=200){
        const res = await response.json();
        showMessage('danger','error',res.error)
    }
    else{
        const datas = await response.json();
        drawWeatherTableGuest(datas.results)
    }
}

function drawWeatherTable(results){
    let tbody = document.querySelector('#tbody')
    tbody.innerHTML=""

    let sumMin = 0
    let sumMax = 0

    const isAdmin = loggeduser?.role === 'admin'

    // copy, so the original array isn't mutated
    let rows = [...results].reverse()

    if(isAdmin){
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
                    <td class="text-end text-nowrap">
                        <button class="btn btn-sm btn-warning" onclick="editWeather(${w.ID})"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteWeather(${w.ID})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
                `
        })
    }
    else{
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
                </tr>
                `
        })
    }

    // averages in the footer
    // columns after "Max": admin has 7 (with Operations), user has 6
    let count = rows.length || 1
    tbody.innerHTML+=`
    <tr class="t foot">
        <td><br></td>
        <td colspan="3"><strong>Average:</strong></td>
        <td class="text-end"><strong>${(sumMin / count).toFixed(1)} °C</strong></td>
        <td class="text-end"><strong>${(sumMax / count).toFixed(1)} °C</strong></td>
        <td colspan="${isAdmin ? 7 : 6}"><br></td>
    </tr>`
}


function drawWeatherTableGuest(results){
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
                <td>${moment(w.date).format('YYYY-MM-DD')}&nbsp;&nbsp;<i class="bi bi-calendar-week"></i></td>
                <td>${w.location}</td>
                <td><i class="bi ${getWeatherIcon(w.weather_type)}"></i>&nbsp;${w.weather_type}</td>
                <td class="text-end">${w.temp_min} °C</td>
                <td class="text-end">${w.temp_max} °C</td>
            </tr>
            `
    })

    let count = rows.length || 1
    tbody.innerHTML+=`
    <tr class="t foot">
        <td colspan="3"><strong>Average:</strong></td>
        <td class="text-end"><strong>${(sumMin / count).toFixed(1)} °C</strong></td>
        <td class="text-end"><strong>${(sumMax / count).toFixed(1)} °C</strong></td>
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

// fills the form with the selected row
function editWeather(weatherID){
    const w = weatherData.find(x => x.ID == weatherID)
    if(!w) return

    editingID = weatherID

    document.querySelector('#date').value = moment(w.date).format('YYYY-MM-DD')
    document.querySelector('#location').value = w.location
    document.querySelector('#tempmin').value = w.temp_min
    document.querySelector('#tempmax').value = w.temp_max
    document.querySelector('#weathertype').value = w.weather_type
    document.querySelector('#precipitation').value = w.precipitation
    document.querySelector('#precipitationprobability').value = w.precipitation_probability
    document.querySelector('#windspeed').value = w.wind_speed
    document.querySelector('#winddirection').value = w.wind_direction
    document.querySelector('#humidity').value = w.humidity
    document.querySelector('#pressure').value = w.pressure
    document.querySelector('#uvindex').value = w.uv_index

    document.querySelector('#saveBtn').innerHTML = '<i class="bi bi-check-lg">&nbsp;&nbsp;Save</i>'
    document.querySelector('#cancelBtn').classList.remove('d-none')

    // open the form and scroll to it
    const collapse = document.querySelector('#collapseOne')
    if(!collapse.classList.contains('show')){
        new bootstrap.Collapse(collapse, { toggle: true })
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit(){
    editingID = null
    resetWeatherForm()
}

function resetWeatherForm(){
    document.querySelector('#date').value = null
    document.querySelector('#location').value = ''
    document.querySelector('#tempmin').value = 0
    document.querySelector('#tempmax').value = 0
    document.querySelector('#weathertype').value = ''
    document.querySelector('#precipitation').value = 0
    document.querySelector('#precipitationprobability').value = 0
    document.querySelector('#windspeed').value = 0
    document.querySelector('#winddirection').value = ''
    document.querySelector('#humidity').value = 0
    document.querySelector('#pressure').value = 0
    document.querySelector('#uvindex').value = 0

    document.querySelector('#saveBtn').innerHTML = '<i class="bi bi-plus-lg">&nbsp;&nbsp;Add</i>'
    document.querySelector('#cancelBtn').classList.add('d-none')
}

// replaces createWeather(): adds a new row, or updates the edited one
async function saveWeather() {
    let luid = loadUser() ? loadUser().ID : 0;
    let data = {
        luid,
        date: document.querySelector('#date').value,
        location: document.querySelector('#location').value,
        temp_min: document.querySelector('#tempmin').value,
        temp_max: document.querySelector('#tempmax').value,
        weather_type: document.querySelector('#weathertype').value,
        precipitation: document.querySelector('#precipitation').value,
        precipitation_probability: document.querySelector('#precipitationprobability').value,
        wind_speed: document.querySelector('#windspeed').value,
        wind_direction: document.querySelector('#winddirection').value,
        humidity: document.querySelector('#humidity').value,
        pressure: document.querySelector('#pressure').value,
        uv_index: document.querySelector('#uvindex').value
    }

    const isEdit = editingID !== null
    const url = isEdit
        ? `http://localhost:3000/weather/${editingID}`
        : `http://localhost:3000/weather`

    const response = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(data)
    });

    // your POST route answers 201, the PUT route answers 200
    const expectedStatus = isEdit ? 200 : 201

    if(response.status != expectedStatus){
        const res = await response.json();
        showMessage('danger','error',res.error)
    }
    else{
        if(isEdit){
            showMessage('success','ok','Forecast updated')
        }
        editingID = null
        resetWeatherForm()
        getWeather()
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
