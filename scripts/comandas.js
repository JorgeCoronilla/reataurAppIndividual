import {subir, bajar, borrarChild, camActual, getCamareros, pintaCamFooter} from './helpers.js';

//BAJA INFO E INICIA MESAS EN ESTADO ACTUAL
( () => {
    pintaCamFooter ();
    pintaMenu();
    var mesa = document.createElement('h5');
    var texto = document.createTextNode(`Mesa ${bajar("mesaActual")}`);
    mesa.appendChild(texto);
    document.querySelector('#screen').appendChild(mesa);
} )();

//PINTA BOTONES
function pintaMenu() {
var menu = bajar("menu");

JSON.parse(menu).forEach(element => {
    var divMesa = document.createElement('button');
    divMesa.className = element.tipo;
    divMesa.addEventListener('click', () => { pedido(element.id_articulo); })
    var texto = document.createTextNode((element.nombre));
    divMesa.appendChild(texto);
    document.querySelector('.menu_btns').appendChild(divMesa);
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
/*
var comandaActual=[];
    console.log(menu.precio);
    menu.forEach(element => {
    comandaActual.push(element.precio)
    });*/