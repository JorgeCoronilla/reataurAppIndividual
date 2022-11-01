import { subir, bajar } from './helpers.js';


(() => {
    cargarGraficos();
    addEvents();
    estadoMesas();
})();


function addEvents() {
    document.getElementById("mostrarDatos").addEventListener('click', () => { mostrarDatos(); });
    document.getElementById("guardarCambios").addEventListener('click', () => { guardarCambios(); });
    document.getElementsByClassName("a_resultados1")[0].addEventListener('click', () => { cargarGraficos(0) });
    document.getElementsByClassName("a_resultados1")[1].addEventListener('click', () => { cargarGraficos(1) });
    document.getElementById("añadir").addEventListener('click', () => { añadirArticulo() });
    document.getElementsByClassName("cargaMenu")[0].addEventListener('click', () => { cargarMenu("modificar") });
    document.getElementsByClassName("cargaMenu")[1].addEventListener('click', () => { cargarMenu("eliminar") });
    document.getElementById("salirAdmin").addEventListener('click', () => { window.location = "index.html"; });
}

function mostrarDatos() {
    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");

    for (let i = 0; i < placeholders_name.length; i++) {
        placeholders_name[i].value = username[i];
        placeholders_pass[i].value = password[i];
    }
}

function estadoMesas() {

    let mesasAtendidas = document.getElementsByClassName("mesasAtendidas");
    let camareroAt = document.getElementsByClassName("camareroAt");
    var mesas = JSON.parse(localStorage.mesa);
    var camarero = JSON.parse(localStorage.camarero);
    for (let i = 0; i < 4; i++) {
        var mesasAux = "";
        for (let j = 0; j < 10; j++) {
            if (mesas[j].estado == 'abierta' && mesas[j].id_camarero == (i + 1)) {
                mesasAux += ` · ${mesas[j].numero}`
            }
        }
        mesasAtendidas[i].innerHTML = mesasAux + " ·";
        camareroAt[i].innerHTML = camarero[i].nombre_camarero;
    }
}


function guardarCambios() {
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");
    var names = [];
    var pass = [];
    let users = JSON.parse(localStorage.camarero);
    for (let i = 0; i < placeholders_name.length; i++) {
        names.push(placeholders_name[i].value);
        pass.push(placeholders_pass[i].value);
    };

    for (let k = 0; k < placeholders_name.length; k++) {
        users[k].nombre_camarero = names[k];
        users[k].password = pass[k];
    };
    subir("camarero", JSON.stringify(users))
}

function cargarGraficos(num) {

    // DATOS -------------

    var tickets = JSON.parse(bajar('ticket'))
    var camareros = JSON.parse(bajar('camarero'))
    var total = [0]
    var total1 = [0]
    var total2 = [0]
    var total3 = [0]
    var total4 = [0]
    var mesas = 0, mesas1 = 0, mesas2 = 0, mesas3 = 0, mesas4 = 0;
    var sTotal = 0, sTotal1 = 0, sTotal2 = 0, sTotal3 = 0, sTotal4 = 0;
    if (tickets != null) {
        for (let i = 0; i < tickets.length; i++) {
            total.push(tickets[i].total)
            if (tickets[i].nombre_camarero == camareros[0].nombre_camarero) {
                total1.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[1].nombre_camarero) {
                total2.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[2].nombre_camarero) {
                total3.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[3].nombre_camarero) {
                total4.push(tickets[i].total)
            }
        }
        mesas = total.length - 1
        mesas1 = total1.length - 1
        mesas2 = total2.length - 1
        mesas3 = total3.length - 1
        mesas4 = total4.length - 1
        sTotal = total.reduce(function (a, b) { return a + b });
        sTotal1 = total1.reduce(function (a, b) { return a + b });
        sTotal2 = total2.reduce(function (a, b) { return a + b });
        sTotal3 = total3.reduce(function (a, b) { return a + b });
        sTotal4 = total4.reduce(function (a, b) { return a + b });
    } else {
        document.getElementById('a_resultados').innerHTML = "No hay datos"
    }
    /*---- Config graficas ----*/
    const labels = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT = 4;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Mesas servidas',
            backgroundColor: 'blcak',
            borderColor: 'blcak',
            data: [mesas, mesas1, mesas2, mesas3, mesas4]
        }]
    };

    const config = {
        type: 'bar',
        data: data, min: 0,
        options: {}
    };

    const labels1 = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT1 = 5;
    const data1 = {
        labels: labels1,
        datasets: [{
            label: 'Importe total',
            backgroundColor: 'black',
            borderColor: 'black',
            data: [sTotal, sTotal1, sTotal2, sTotal3, sTotal4]
        }]
    };

    const config1 = {
        type: 'bar',
        data: data1, min: 0,
        options: {}
    };

    switch (num) {
        case 0:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart')
            document.getElementById('a_resultados').append(canvas)
            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            break;
        case 1:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart1')
            document.getElementById('a_resultados').append(canvas)
            const myChart1 = new Chart(
                document.getElementById('myChart1'),
                config1
            );

    }

}

function cargarMenu (modo){
 
        borrarChild(document.querySelector('.menu_btns'));
        var menu = bajar("menu");
        JSON.parse(menu).forEach(element => {
            var btMenu = document.createElement('button');
            btMenu.className = element.tipo;
            if (modo == "eliminar") {btMenu.addEventListener('click', () => { borrarArticulo(element.id_articulo); })}
            if (modo == "modificar") {btMenu.addEventListener('click', () => { modificarArticulo(element.id_articulo); })}
            var texto = document.createTextNode((element.nombre));
            btMenu.appendChild(texto);
            document.querySelector('.menu_btns').appendChild(btMenu);
        });
    }

    function borrarArticulo(id) {
console-log("Entra en borrar")
    }

    function modificarArticulo(id) {
        console-log("Entra en modificar")

    }
