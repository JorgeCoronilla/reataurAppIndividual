import {subir, bajar, borrarChild, camActual, getCamareros, pintaCamFooter} from './helpers.js';
import {Ticket} from './inicia.js';

//BAJA INFO E INICIA MESAS EN ESTADO ACTUAL
( () => {
    pintaMenu();
    var i = camActual();
    var camareros = getCamareros();
    var mesa = document.createElement('h5');
    mesa.className = "c_nombre";
    var texto = document.createTextNode(`${camareros[(i - 1)].nombre_camarero}  -   Mesa ${bajar("mesaActual")}`);
    mesa.appendChild(texto);
    document.querySelector('#screen').appendChild(mesa);
    addBtn();
} )();

//AÑADE EVENT BTN FOOTER
function addBtn() {
    document.getElementById("cerrar").addEventListener('click', () => { checkOut(); });
    document.getElementById("revisar").addEventListener('click', () => { revisar(); });
    document.getElementById("salir").addEventListener('click', () => { window.location = "mesas.html" });
    }

//PINTA BOTONES MENU
function pintaMenu() {
var menu = bajar("menu");

JSON.parse(menu).forEach(element => {
    var btMenu = document.createElement('button');
    btMenu.className = element.tipo;
    btMenu.addEventListener('click', () => { pedido(element.id_articulo); })
    var texto = document.createTextNode((element.nombre));
    btMenu.appendChild(texto);
    document.querySelector('.menu_btns').appendChild(btMenu);
});
}

//RECOGE PEDIDO BOTONES
function pedido (id) {
    var numMesa = JSON.parse(bajar("mesaActual"));
    var mesa = JSON.parse(bajar("mesa"))
    var aux = (mesa[numMesa].comanda[id] + 1);
    mesa[numMesa].comanda[id] = aux;
    subir("mesa", JSON.stringify(mesa));
    pintaPedido(id);
}

function pintaPedido(id) {
    var menu = bajar("menu");
    menu = JSON.parse(menu);
    var pedido = document.createElement('p');
    pedido.className = "pedido";
    var texto = document.createTextNode(menu[id].nombre);
    pedido.appendChild(texto);
    document.querySelector('#screen').appendChild(pedido);
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
    const newTicket = new Ticket (lastId(), fechaticket, camActual(), bajar("mesaActual"), mesa[bajar("mesaActual")].comanda, menu, false);
    actualizaTickets(newTicket);
    resetMesa(menu, mesa, numMesa);
    window.location = "mesas.html"
 }

//VUELVE MESA A ESTADO INICIAL
 function resetMesa (menu, mesa, numMesa) {
    const resetComanda = Array(menu.length).fill(0);
    mesa[numMesa].comanda = resetComanda;
    mesa[numMesa].id_camarero = 0;
    mesa[numMesa].estado = "cerrada";
    subir("mesa", JSON.stringify(mesa));
}


function actualizaTickets(newTicket) {
    switch(newTicket.getId()) {
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

 function lastId(){
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


 function revisar(){

}
