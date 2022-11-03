import { subir, bajar, borrarChild } from './helpers.js';


(() => {
    cargarGraficos();
    addEvents();
    estadoMesas();
    cargarMenu();
    document.getElementById('select2').value = "";
    document.getElementById('nombreItem2').value = "";
    document.getElementById('precio2').value = "";
})();


function addEvents() {
    document.getElementById("mostrarDatos").addEventListener('click', () => { mostrarDatos(); });
    document.getElementById("guardarCambios").addEventListener('click', () => { guardarCambios(); });
    document.getElementsByClassName("a_resultados1")[0].addEventListener('click', () => { cargarGraficos(0) });
    document.getElementsByClassName("a_resultados1")[1].addEventListener('click', () => { cargarGraficos(1) });
    document.getElementById("añadir").addEventListener('click', () => { datosNuevoItem(1) });
    document.getElementById("añadir2").addEventListener('click', () => { datosNuevoItem(2) });
    document.getElementById("salirAdmin").addEventListener('click', () => { window.location = "index.html"; });
}


const details = document.querySelectorAll('.mainMenu');
details.forEach(element => {
    element.addEventListener('toggle', toggleOpenOneOnly)
})

function toggleOpenOneOnly(e) {
    if (this.open) {
        details.forEach(element => {
            if (element != this && element.open) element.open = false
        });
    }
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

    var tickets = JSON.parse(bajar('Tickets'))
    var camareros = JSON.parse(bajar('camarero'))
    var total = [0]
    var total1 = [0]
    var total2 = [0]
    var total3 = [0]
    var total4 = [0]
    var mesas = 0, mesas1 = 0, mesas2 = 0, mesas3 = 0, mesas4 = 0;
    var sTotal = 0, sTotal1 = 0, sTotal2 = 0, sTotal3 = 0, sTotal4 = 0;
   if (tickets.length){
    if (tickets) {
        for (let i = 0; i < tickets.length; i++) {
            total.push(tickets[i].total)
            if (tickets[i].camarero == camareros[0].id_camarero) {
                total1.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[1].id_camarero) {
                total2.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[2].id_camarero) {
                total3.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[3].id_camarero) {
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
        document.getElementById('a_resultados').innerHTML = "No hay datos"}
    }else{document.getElementById('a_resultados').innerHTML = "No hay datos"}

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

    function cargarMenu() {
        borrarChild(document.querySelector('.menu_btns1'));
        borrarChild(document.querySelector('.menu_btns2'));
        var menu = bajar("menu");
        JSON.parse(menu).forEach(element => {
            var btMenu1 = document.createElement('button');
            var btMenu2 = document.createElement('button');
            btMenu1.className = element.tipo;
            btMenu2.className = element.tipo;
            btMenu1.addEventListener('click', () => { modificarArticulo(element.id_articulo); })
            btMenu2.addEventListener('click', () => { borrarArticulo(element.id_articulo); })
            var texto1 = document.createTextNode((element.nombre));
            var texto2 = document.createTextNode((element.nombre));
            btMenu1.appendChild(texto1);
            btMenu2.appendChild(texto2);
            document.querySelector('.menu_btns1').appendChild(btMenu1);
            document.querySelector('.menu_btns2').appendChild(btMenu2);
        });
    }

    function borrarArticulo(id) {
        var menu = JSON.parse(bajar("menu"));
        var position;
        menu.forEach((element, index) => { if (element.id_articulo == id) { position = index } });
        menu.splice(position, 1);
        subir("menu", JSON.stringify(menu));
        cargarMenu();
    }

    function modificarArticulo(id) {
        document.getElementById('modificar').style.display = "block";
        var menu = JSON.parse(bajar("menu"));
        document.getElementById('select2').value = menu[id].tipo;
        document.getElementById('nombreItem2').value = menu[id].nombre;
        document.getElementById('precio2').value = menu[id].precio;
        borrarArticulo(id);
    }

    function datosNuevoItem(id) {
        var tipo = document.getElementById(`select${id}`).value;
        var nombre = document.getElementById(`nombreItem${id}`).value;
        var precio = parseFloat(document.getElementById(`precio${id}`).value);
        document.getElementById(`select${id}`).value = "";
        document.getElementById(`nombreItem${id}`).value = "";
        document.getElementById(`precio${id}`).value = "";
        añadirArticulo(tipo, nombre, precio);
        document.getElementById('modificar').style.display = "none";
    }

    function añadirArticulo(tipo, nombre, precio) {
        var menu = JSON.parse(bajar("menu"));
        var bebidasCalientes = menu.filter(element => element.tipo == "bebida-caliente");
        var bebidasFrias = menu.filter(element => element.tipo == "bebida-fria");
        var primeros = menu.filter(element => element.tipo == "primeros");
        var segundos = menu.filter(element => element.tipo == "segundos");
        var postres = menu.filter(element => element.tipo == "postres");
        var newItem = {
            "id_articulo": 0,
            "tipo": tipo,
            "nombre": nombre,
            "precio": precio
        }
        switch (tipo) {
            case "bebida-caliente":
                bebidasCalientes.push(newItem);
                break;
            case "bebida-fria":
                bebidasFrias.push(newItem);
                break;
            case "primeros":
                primeros.push(newItem);
                break;
            case "segundos":
                segundos.push(newItem);
                break;
            case "postres":
                postres.push(newItem);
                break;
        }
        var newMenu = [];
        newMenu.push(...bebidasCalientes, ...bebidasFrias, ...primeros, ...segundos, ...postres);
        newMenu.forEach((element, id) => {
            element.id_articulo = id
        })
        subir("menu", JSON.stringify(newMenu));
        cargarMenu();
    }



