import { subir, bajar, borrarChild, alerta, cargarGraficos } from './helpers.js';
import { generaMesas} from './inicia.js'

// Carga datos, events, etc para inicializar
(() => {
    cargarGraficos();
    addEvents();
    estadoMesas();
    cargarMenu();
    document.getElementById('select2').value = "";
    document.getElementById('nombreItem2').value = "";
    document.getElementById('precio2').value = "";
})();

//Añade events
function addEvents() {
    document.getElementById("mostrarDatos").addEventListener('click', () => { mostrarDatos(); });
    document.getElementById("guardarCambios").addEventListener('click', () => { guardarCambios(); });
    document.getElementsByClassName("a_resultados1")[0].addEventListener('click', () => { cargarGraficos(0) });
    document.getElementsByClassName("a_resultados1")[1].addEventListener('click', () => { cargarGraficos(1) });
    document.getElementById("añadir").addEventListener('click', () => { datosNuevoItem(1) });
    document.getElementById("añadir2").addEventListener('click', () => { datosNuevoItem(2) });
    document.getElementById("salirAdmin").addEventListener('click', () => { window.location = "index.html"; });
    document.getElementById("guardarAdmin").addEventListener('click', () => { guardarAdmin() });
    document.getElementById("mesasConMas").addEventListener('click', () => { mesasConfig(1) });
    document.getElementById("mesasConMenos").addEventListener('click', () => { mesasConfig(-1) });
    var mesas = JSON.parse(bajar("mesa"))
    var mesasNum = mesas.length - 1
    document.querySelector("h6.mesasCon").innerHTML = mesasNum;
}

//Hacer que los 'Details se cierren al abrie otro'
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

//Muestra datos camareros
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

//Guarda cambios de camareros
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
    alerta("<p>Cambios guardados</p>")
    subir("camarero", JSON.stringify(users))
}

//Guarda cambios de admin nombre y paswors

function guardarAdmin() {
    console.log("ENTRA1");
    var oldName = document.getElementById("oldName").value;
    var newName = document.getElementById("newName").value;
    var oldPass = document.getElementById("oldPass").value;
    var newPass = document.getElementById("newPass").value;
    var admin = JSON.parse(localStorage.admin);
    if ((admin.pass === oldPass) && (admin.name === oldName) && (newName.length > 0) && (newPass.length > 3)) {
        admin.pass = newPass;
        admin.name = newName;
        subir("admin", JSON.stringify(admin))
        alerta("<p>Cambios guardados</p>")
    } else {
        alerta("<p>Comprueba los datos, no son correctos.</p>")
    }

}


//Estado actual de las mesas 
function estadoMesas() {
    let mesasAtendidas = document.getElementsByClassName("mesasAtendidas");
    let camareroAt = document.getElementsByClassName("camareroAt");
    var mesas = JSON.parse(localStorage.mesa);
    var camarero = JSON.parse(localStorage.camarero);
    for (let i = 0; i < 4; i++) {
        var mesasAux = "";
        for (let j = 0; j < mesas.length-2; j++) {
            if (mesas[j].estado == 'abierta' && mesas[j].id_camarero == (i + 1)) {
                mesasAux += ` · ${mesas[j].numero}`
            }
        }
        mesasAtendidas[i].innerHTML = mesasAux + " ·";
        camareroAt[i].innerHTML = camarero[i].nombre_camarero;
    }
}

//Carga e imprime menú
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
        btMenu2.addEventListener('click', () => { borrarArticulo(element.id_articulo, "borr"); })
        var texto1 = document.createTextNode((element.nombre));
        var texto2 = document.createTextNode((element.nombre));
        btMenu1.appendChild(texto1);
        btMenu2.appendChild(texto2);
        document.querySelector('.menu_btns1').appendChild(btMenu1);
        document.querySelector('.menu_btns2').appendChild(btMenu2);
    });
}

//Borra artículos
function borrarArticulo(id, mensaje) {
    var menu = JSON.parse(bajar("menu"));
    var position;
    menu.forEach((element, index) => { if (element.id_articulo == id) { position = index } });
    if (mensaje != "mod") {
        alerta(`<p>Artículo: <strong>${menu[position].nombre}</strong> borrado con éxito</p>`) }
    menu.splice(position, 1);
    subir("menu", JSON.stringify(menu));
    cargarMenu();
}

//Modifica un artículo
function modificarArticulo(id) {
    document.getElementById('modificar').style.display = "block";
    var menu = JSON.parse(bajar("menu"));
    document.getElementById('select2').value = menu[id].tipo;
    document.getElementById('nombreItem2').value = menu[id].nombre;
    document.getElementById('precio2').value = menu[id].precio;
    borrarArticulo(id, "mod");
}

//Recoge datos a modificar 
function datosNuevoItem(id) {
    var tipo = document.getElementById(`select${id}`).value;
    var nombre = document.getElementById(`nombreItem${id}`).value;
    var precio = parseFloat(document.getElementById(`precio${id}`).value);
    document.getElementById(`select${id}`).value = "";
    document.getElementById(`nombreItem${id}`).value = "";
    document.getElementById(`precio${id}`).value = "";
    if (nombre.length > 0 && precio > 0) {
        añadirArticulo(tipo, nombre, precio);
        document.getElementById('modificar').style.display = "none";
        alerta("<p>Menú actualizado</p>");
    } else {
        alerta("<p>No has introducido ningún dato</p>");
    }
}

//Añade artículos nuevos o modificados en el menú
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
    alerta(`<p>Artículo: <strong>${nombre}</strong> añadido con éxito</p>`)
    cargarMenu();
}


// Añade o elimina mesas
function mesasConfig(operacion) {
    var mesas = JSON.parse(bajar("mesa"))
    var val = true;
    var mesasNum = mesas.length - 1;
    for (let i = 0; i < (mesasNum); i++) {
        if (mesas[i].estado == "abierta") val = false;
    }
    if (!val) {
        alerta("Esta opción no está disponible si tienes mesas abiertas");
        setTimeout(() => { location.reload() }, 5000);
    } else {
        mesasNum += (operacion);
        if (mesasNum < 4) {
            alerta("No puedes eliminar más mesas, ya tienes el mínimo de 4");
            setTimeout(() => { location.reload() }, 5000);
        } else {
            if (mesasNum > 25) {
                alerta("No puedes añadir más mesas, ya tienes el máximo de 25");
                setTimeout(() => { location.reload() }, 5000);
            } else {generaMesas(mesasNum)
                document.querySelector("h6.mesasCon").innerHTML = mesasNum;}
        }
    }
}


