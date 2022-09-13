
let apikey = "20f6e7cf2c4a06d496564b024c62c6fb";
let idioma = "lang=es"
let celsius = "units=metric"

const dias = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"]
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];
const hora = document.querySelector("#hora");
const fecha = document.querySelector("#fecha");
const clima = document.querySelector("#caracteristicasDelClima");
const latlon = document.querySelector("#latlon")
const pais = document.querySelector("#pais");
const pronostico = document.querySelector("#pronostico");
const temperaturaActual = document.querySelector("#temperaturaActual");
const modal = document.querySelector("#informacionSobreCiudades");
let ciudades = ["Florencia", "Roma", "Bristol", "Copenhagen", "Oslo", "Londres"]
const selCiudades = document.querySelector("#ciudades")


selCiudades.addEventListener("change", mostrarDatosPromedio);


cargarSelectCiudades()

function mostrarInformacionSobreCiudades(promedio) {
    if (promedio < 0.1) {
        modal.innerHTML = `   
                <div class="container">
                    <br><br>
                    <img src="img/sol.jpeg" alt="">
                    <div class="row center">
                        <h5 id="infoAdicional" class="header col s12 light">Parece que no va a llover. ¿Por qué no alquilas una bici?</h5>
                        <a href="#">Clickea aquí</a>
                        </div>
    
                    <br><br>
    
                </div>
`
    }
    else if (promedio < 0.3) {
        modal.innerHTML = `
                <div class="container">
                    <br><br>
                    <img src="img/nollueve.jpeg" alt="">
                    <div class="row center">
                        <h5 id="infoAdicional" class="header col s12 light">¡Puede que llueva, pero arriesgate! ¡Nuestras bicis tienen un 20% de descuento si vas con un amigo!</h5>
                        <a href="#">Clickea aquí</a>
                        </div>
    
                    <br><br>
    
                </div>
       `
    }
    else if (promedio < 0.6) {
        modal.innerHTML = ` 
                <div class="container">
                    <br><br>
                    <img src="img/llueve.jpeg" alt="">
                    <div class="row center">
                        <h5 id="infoAdicional" class="header col s12 light">¡Llueve!¿Sabías que también contamos con servicio renta de vehículos? Escribinos al bicivia@gmail.com </h5>
                        <a href="#">Clickea aquí</a>
                        </div>
    
                    <br><br>
    
                </div>
  `
    }
    else {
        modal.innerHTML = `      
                <div class="container">
                    <br><br>
                    <img src="img/tormenta.jpeg" alt="">
                    <div class="row center">
                        <h5 id="infoAdicional" class="header col s12 light">Se cae el mundo. Yo si fuera vos me quedo en casa... </h5>
                        <a href="#">Clickea aquí</a>
                        </div>
    
                    <br><br>
    
                </div>
`
    }
}

function mostrarDatosPromedio() {
    const ciudadSeleccionada = selCiudades.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudadSeleccionada}&appid=${apikey}&${celsius}&${idioma}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            console.log(datos)
            let latitud = datos.coord.lat;
            let longitud = datos.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitud}&lon=${longitud}&exclude=hourly&${celsius}&${idioma}&appid=${apikey}&precipitation=rain`)
                .then(r => r.json())
                .then(datosPronostico => {
                    console.log(datosPronostico);
                    let pop = 0;

                    datosPronostico.daily.forEach(d => {
                        pop += d.pop
                    }
                    )
                    pop = pop / datosPronostico.daily.length
                    console.log(pop)
                    mostrarInformacionSobreCiudades(pop)
                }
                )
        })
}

function cargarSelectCiudades() {
    for (const ciudad of ciudades) {
        selCiudades.innerHTML += `
        <option value="${ciudad}">${ciudad}</option>`
    }
}


setInterval(() => {
    const nuevaFecha = new Date();
    const mes = nuevaFecha.getMonth();
    const fecha = nuevaFecha.getDate();
    const dia = nuevaFecha.getDay();
    const hora = nuevaFecha.getHours();

    const minutos = nuevaFecha.getMinutes();
    let textoHora = (hora < 10 ? '0' + hora : hora) + ':' + (minutos < 10 ? '0' + minutos : minutos);
    let textoFecha = dias[dia - 1] + ', ' + fecha + ' de ' + meses[mes];

    document.querySelector("#hora").innerHTML = textoHora;
    document.querySelector("#fecha").innerHTML = textoFecha;
}, 1000);

obtenerClima()

function obtenerClima() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&${celsius}&appid=${apikey}`)
            .then(respuesta => respuesta.json()).then(data => {
                console.log(data)
                mostrarClima(data);
            })

    })
}


function mostrarClima(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    pais.innerHTML = `<div id="pais"> Te encuentras en ${data.timezone}</div>`;
    latlon.innerHTML = data.lat + 'N ' + data.lon + 'E'
    clima.innerHTML =
        `<div>
        <div>Humedad</div>
        <div>${humidity}%</div>
    </div>
    <div>
        <div>Presion</div>
        <div>${pressure} mb</div>
    </div>
    <div>
        <div>Viento</div>
        <div>${wind_speed} km/h</div>
    </div>

    <div>
        <div>Amanecer</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div>
        <div>Atardecer</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
    </div>    `
        ;

    let pronosticoSemanal = ''
    data.daily.forEach((dia, i) => {
        let localLocale = window.moment(dia.dt * 1000);
        moment.locale('es');
        localLocale.locale(false);
        if (i == 0) {
            temperaturaActual.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${dia.weather[0].icon}@4x.png" >
            <div class ="card right-align">
                <div class="card-content dia">${localLocale.format('dddd')}</div>
                <div class="temperatura">Noche - ${dia.temp.night}</div>
                <div class="temperatura">Día - ${dia.temp.day}</div>
            </div>
            
            `
        } else if (i <= 6) {
            pronosticoSemanal += `
            <div class="card center-align">
            <img src="http://openweathermap.org/img/wn/${dia.weather[0].icon}@2x.png" >
                <div class="card-content col s12 dia">${localLocale.format('dddd')}</div>
                <div class="temperatura">Noche - ${dia.temp.night}</div>
                <div class="temperatura">Día - ${dia.temp.day}</div>
            </div>
            
            `
        }
    })
    pronostico.innerHTML = pronosticoSemanal;
}



