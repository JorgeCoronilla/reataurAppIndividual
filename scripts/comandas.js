import { subir, bajar, borrarChild, camActual, getCamareros, pintaCamFooter } from './helpers.js';
import { Ticket } from './inicia.js';

//BAJA INFO E INICIA MESAS EN ESTADO ACTUAL
(() => {
    
    var numMesa = JSON.parse(bajar("mesaActual"));
    if (numMesa == 11) {revisar();}
    pintaMenu(0);
    pintaPedido();
    addBtn();
})();

//AÑADE EVENT BTN FOOTER
function addBtn() {
    document.getElementById("cerrar").addEventListener('click', () => { checkOut(); });
    document.getElementById("revisar").addEventListener('click', () => { revisar(); });
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

    mesas[i].comanda.forEach((element, num) => {
        if (element > 0) {
            total += element * menu[num].precio;
            var item = document.createElement("p");
            item.className = `pedido`;
            var texto = document.createTextNode((`* ${menu[num].nombre} ${element}  X ${menu[num].precio}`))
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
}

//PEDIR CUENTA
function checkOut() {
    //Recogemos datos
    var menu = JSON.parse(bajar("menu"))
    var mesa = JSON.parse(bajar("mesa"))
    var numMesa = parseInt(bajar("mesaActual"));
    mesa[numMesa].comanda
    var fecha = new Date;
    var fechaticket = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes()

    //Creamos el ticket y subimos a LocalStorage
    const newTicket = new Ticket(lastId(), fechaticket, camActual(), bajar("mesaActual"), mesa[bajar("mesaActual")].comanda, menu, false);
    actualizaTickets(newTicket);
    resetMesa(menu, mesa, numMesa);
    window.location = "mesas.html"
}

//VUELVE MESA A ESTADO INICIAL
function resetMesa(menu, mesa, numMesa) {
    const resetComanda = Array(menu.length).fill(0);
    mesa[numMesa].comanda = resetComanda;
    mesa[numMesa].id_camarero = 0;
    mesa[numMesa].estado = "cerrada";
    subir("mesa", JSON.stringify(mesa));
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
    console.log("ENTRA EN BORRAR")
    var numMesa = JSON.parse(bajar("mesaActual"));
    var mesa = JSON.parse(bajar("mesa"))
    var aux = (mesa[numMesa].comanda[num] - 1);
    mesa[numMesa].comanda[num] = aux;
    subir("mesa", JSON.stringify(mesa));
    revisar();
}

//CAMBIOS VISUALES PARA MODO REVISION
function modoRevision() {
    document.querySelector("#cerrar").innerText="terminar";
    document.getElementById("cerrar").addEventListener('click', () => { finRevision(); });
    document.body.style.backgroundColor = "#a53636";
    document.querySelector("#screen1").style.backgroundColor = "#a53636";
}

//VUELTA A MODO NORMAL
function finRevision() {
    document.querySelector("#cerrar").innerText="cerrar";
    document.getElementById("cerrar").addEventListener('click', () => { checkOut(); });
    document.body.style.backgroundColor = "#white";
    document.querySelector("#screen1").style.backgroundColor = "#white";
    pintaMenu(0);
    pintaPedido();
    addBtn();
}