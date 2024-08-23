// Simulación de datos de acelerómetro (reemplazar con datos reales)

var payload;

//______________________________________________________
function sendMessage(event) {
        var input = document.getElementById("messageText")
        ws.send(input.value)
        input.value = ''
        event.preventDefault()
    }


//______________________________________________________
// Actualizar datos y gráficos
function actualizarDatosYSensor(sensorId, datos, frecuencias) {
    const sensor = document.getElementById(sensorId);
    const chart = sensor.querySelector('.chart');
    // Dibujar gráfico
    dibujarGrafico(chart, datos, frecuencias);
}


//______________________________________________________
// Actualizar estatus de componente generico
function actualizarEstatus(estatus, id_elem) {
    const elem = document.getElementById(id_elem);
    elem.innerText = estatus;
}


//______________________________________________________
function dibujarGrafico(canvas, datos, frecuencias) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const stepX = width / datos.length;
    const maxDato = Math.max(...datos)*(1.1);
    
    const range = maxDato;

    // Dibujar ejes coordenados
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.moveTo(0, height);
    ctx.lineTo(0, 0);
    ctx.strokeStyle = '#aaa'; // Color de las líneas del eje
    ctx.stroke();
    
    // Dibujar etiquetas en el eje x (frecuencias)
    ctx.fillStyle = '#777'; // Color de las etiquetas
    ctx.font = '10px Arial';
    const step = Math.ceil(frecuencias.length / 50); // Dibujar una etiqueta de cada 100
    for (let i = 0; i < frecuencias.length; i += step) {
        const frecuencia = frecuencias[i]*2;
        const x = (i * stepX*2);
        const y = height-315; // Posición en y para todas las etiquetas
        ctx.save(); // Guardamos el estado actual del contexto
        ctx.translate(x, y); // Movemos el origen al punto de dibujo
        ctx.rotate(-Math.PI / 3); // Rotamos 60 grados en sentido antihorario
        ctx.fillText(frecuencia.toFixed(2), 0, 0); // Ajusta posición de la etiqueta
        ctx.restore(); // Restauramos el estado del contexto
    }
    // Dibujar líneas horizontales y etiquetas verticales en eje y
    const numLines = 20; // Número de líneas horizontales
    const deltaY = height / (numLines + 1);
    for (let i = 1; i <= numLines; i++) {
        const yValue = (range / numLines) * i;
        const yPos = height - (yValue / range) * height;
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(width, yPos);
        ctx.strokeStyle = '#ccc'; // Color de las líneas horizontales
        ctx.stroke();
        // Dibujar etiquetas
        ctx.fillStyle = '#777'; // Color de las etiquetas
        ctx.fillText(yValue.toFixed(2), 5, yPos - 5); // Ajusta posición de la etiqueta
    }

    // Dibujar datos
    ctx.beginPath();
    ctx.moveTo(0, height - datos[0] / range * height);
    datos.forEach((dato, index) => {
        ctx.lineTo(index * stepX, height - dato / range * height);
    });
    ctx.strokeStyle = '#ff7426'; // Color de la línea del gráfico
    ctx.lineWidth = 2; // Grosor de la línea del gráfico
    ctx.stroke();
}


//______________________________________________________
function interval_counter(study_time, ws){
    let counter = 0;
    actualizarEstatus(`Estudio Iniciado`, "onoff_study");
    // Obtener datos y actualizar cada cierto intervalo de tiempo
    var interval = setInterval(() => {    
        if (counter < study_time){
            actualizarEstatus(`Tiempo: ${counter}`, "onoff_study");
            ws.send('1');
        }
        else{
            ws.close();
            clearInterval(interval);        
        }
        counter=counter+1;
    }, 1000); // Intervalo de actualización en milisegundos
}


//______________________________________________________
function startStudy(){
    const PORT = 5001;
    var study_time = 20;

    var ws = new WebSocket(`ws://localhost:${PORT}/ws/${study_time}`);
    ws.onmessage = function(event) {
        payload = JSON.parse(event.data);
        
        actualizarDatosYSensor('sensor1', payload["dev1"][0], []);
        actualizarDatosYSensor('fourier1', payload["dev1"][1], payload["dev1"][2]);

        actualizarDatosYSensor('sensor2', payload["dev2"][0], []);
        actualizarDatosYSensor('fourier2', payload["dev2"][1], payload["dev2"][2]);
    }
    ws.onerror = function(event){
    }
    ws.onopen = function(event){
        actualizarEstatus("Iniciar Estudio", "onoff_study");
        interval_counter(study_time, ws);
    }
    ws.onclose = function(event){
        actualizarEstatus("Iniciar Estudio", "onoff_study");
    }

}

//______________________________________________________


function changeDivText(elem){
    var h4 = elem.lastChild;
    h4.innerText="RMS";
    h4.style.color="#FFF";
}
    

function normalDiv(elem){
    var h4 = elem.lastChild;
    h4.innerText="";
}