import { subir, bajar, borrarChild, camActual, resetMesa, alerta } from './helpers.js';
import { Ticket } from './inicia.js';

//BAJA INFO E INICIA MESAS EN ESTADO ACTUAL
(() => {

    pintaMenu(0);
    pintaPedido();
    addBtn();
})();

//AÑADE EVENT BTN FOOTER
function addBtn() {
    document.getElementById("cerrar").addEventListener('click', () => { checkOut(); });
    document.getElementById("revisar").addEventListener('click', () => {
        revisar();
    });
    document.getElementById("salir").addEventListener('click', () => { window.location = "mesas.html" });
}

//PINTA BOTONES MENU - PARA AÑADIR O PARA BORRAR SEGUN MIN
function pintaMenu(min) {
    borrarChild(document.querySelector('.menu_btns'));
    var menu = bajar("menu");
    var i = JSON.parse(bajar("mesaActual"));
    var mesas = JSON.parse(bajar("mesa"));

    JSON.parse(menu).forEach(element => {
        if (mesas[i].comanda[element.id_articulo] >= min) {
            var btMenu = document.createElement('button');
            btMenu.className = element.tipo;
            if (min == 0) {
                btMenu.addEventListener('click', () => { pedido(element.id_articulo); })
            }
            if (min == 1) {
                btMenu.addEventListener('click', () => { borrar(element.id_articulo); })
            }
            var texto = document.createTextNode((element.nombre));
            btMenu.appendChild(texto);
            document.querySelector('.menu_btns').appendChild(btMenu);
        }
    });
}

//RECOGE PEDIDO BOTONES
function pedido(id) {
    var numMesa = JSON.parse(bajar("mesaActual"));
    var mesa = JSON.parse(bajar("mesa"))
    var aux = (mesa[numMesa].comanda[id] + 1);
    mesa[numMesa].comanda[id] = aux;
    subir("mesa", JSON.stringify(mesa));
    pintaPedido();
}

function pintaPedido() {
    borrarChild(document.querySelector('#screen'));
    //IMPRIME cabecera (nume mesa y nombre camarero)


    //IMPRIME comanda actual y almacena total 
    var total = 0;
    var menu = JSON.parse(bajar("menu"));
    var i = JSON.parse(bajar("mesaActual"));
    var mesas = JSON.parse(bajar("mesa"));
    var index = (JSON.parse(localStorage.getItem("camareroActual")) - 1);
    var camarero=JSON.parse(bajar('camarero'));
    var camareroAct = (camarero[index].nombre_camarero)
    var item = document.createElement("p");
    item.className = `pedido`;
    var texto1 = document.createTextNode((` Mesa ${i + 1} | ${camareroAct}`));
    item.appendChild(texto1);
    document.getElementById('screen').appendChild(item);

    var spacer = document.createElement("br");
    document.getElementById('screen').appendChild(spacer);

    mesas[i].comanda.forEach((element, num) => {
        if (element > 0) {
            total += element * menu[num].precio;

            var item = document.createElement("p");
            item.className = `pedido`;
            var texto = document.createTextNode((`* ${menu[num].nombre} ${element}  X ${menu[num].precio} €`))
            item.appendChild(texto);
            document.getElementById('screen').appendChild(item);
        }
    });
    var item = document.createElement("br");
    document.querySelector('#screen').appendChild(item);
    var item = document.createElement("p");
    item.className = "pedido";
    var texto = document.createTextNode(`* TOTAL: ${total}`);
    item.appendChild(texto);
    document.querySelector('#screen').appendChild(item);
    mesas[i].total = total;
    subir("mesa", JSON.stringify(mesas));
}

//PEDIR CUENTA
function checkOut() {
    var mesa = JSON.parse(bajar("mesa"))
    var numMesa = (parseInt(bajar("mesaActual")));
    var comandaOK=mesa[numMesa].comanda.reduce(function (a, b) { return a + b });
    if (comandaOK>0) {
       if(numMesa < 10) { checkoutNormal(mesa);
    } else {
        checkoutTicket(mesa)
    }} else { 
        alerta("Mesa cerrada sin artículos. No se generará ningún ticket",4500)
        setTimeout(() => { window.location = "mesas.html" },4500)}
}

// CREAMOS TICKET
function checkoutNormal(mesa) {

    alerta("<p>Se ha creado un ticket. Si necesita modificarlo solo puede hacerlo antes de que el cliente haya pago en mesas>historial</p>");
    var menu = JSON.parse(bajar("menu"))
    var mesa = JSON.parse(bajar("mesa"))
    var numMesa = parseInt(bajar("mesaActual"));
    var total = mesa[numMesa].total;
    var fecha = new Date;
    var fechaticket = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes()
    const newTicket = new Ticket(lastId(), fechaticket, camActual(), bajar("mesaActual"), mesa[bajar("mesaActual")].comanda, total, menu, false, "No mdoficado");
    actualizaTickets(newTicket);
    resetMesa(menu, mesa, numMesa);
    finRevision();
    setTimeout(() => { window.location = "mesas.html" }, 5000);
   
}

//SUBE NUEVO TICKET A LOCALSTORAGE
function actualizaTickets(newTicket) {
    switch (newTicket.getId()) {
        case 0:
            subir("Tickets", JSON.stringify(newTicket));
            break;

        case 1:
            var oldTickets = JSON.parse(bajar("Tickets"));
            var totalTickets = [];
            totalTickets.push(oldTickets);
            totalTickets.push(newTicket);
            subir("Tickets", JSON.stringify(totalTickets));
            break;

        default:
            var oldTickets = JSON.parse(bajar("Tickets"));
            oldTickets.push(newTicket);
            subir("Tickets", JSON.stringify(oldTickets));
    }
}

//ACTUALIZAMOS TICKET EN REVISIÓN
function checkoutTicket(mesa) {
    let reference = JSON.parse(localStorage.TicketConsulta);
    let oldTickets = JSON.parse(localStorage.Tickets);
    oldTickets[reference.id].comanda = mesa[10].comanda;
    oldTickets[reference.id].total = mesa[10].total;
    var fecha = new Date;
    var fechaticket = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes()
    oldTickets[reference.id].ultimaMod = fechaticket;
    subir("Tickets", JSON.stringify(oldTickets));
    alerta("<p>El ticket ha sido modificado con éxito</p>");
    setTimeout(() => { window.location = "ticket.html" }, 5000);
}



//SACA ID PARA NUEVO TICKET
function lastId() {
    if (bajar("Tickets") == null) {
        return 0;
    } else {
        var tickets = JSON.parse(bajar("Tickets"));
        if (tickets.length == undefined) {
            return 1;
        } else {
            return tickets.length
        }
    }
}

//ENTRA EN MODO QUITAR ELEMENTOS
function revisar() {
    modoRevision();
    pintaMenu(1);
    pintaPedido();
}

//BORRAR ARTICULOS DE LA COMANDA
function borrar(num) {
    var numMesa = JSON.parse(bajar("mesaActual"));
    var mesa = JSON.parse(bajar("mesa"))
    var aux = (mesa[numMesa].comanda[num] - 1);
    mesa[numMesa].comanda[num] = aux;
    subir("mesa", JSON.stringify(mesa));
    revisar();
}

//CAMBIOS VISUALES PARA MODO REVISION
function modoRevision() {
    document.body.style.backgroundColor = "#ffcfcf";
    document.querySelector("#screen1").style.backgroundColor = "#ffcfcf";//"#a53636";
    document.getElementById("revisar").innerText = "volver";
    document.getElementById("revisar").addEventListener('click', () => { finRevision() });
}

//VUELTA A MODO NORMAL
function finRevision() {
    document.body.style.backgroundColor = "white";
    document.querySelector("#screen1").style.backgroundColor = "white";
    pintaMenu(0);
    pintaPedido();
    addBtn();
}