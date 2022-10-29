import {subir, bajar, borrarChild, camActual, getCamareros, pintaCamFooter} from './helpers.js';

//BAJA INFO E INICIA MESAS EN ESTADO ACTUAL
( () => {
    camareroIn();
} )();


 function camareroIn() {
    pintaCamFooter ()
    var camareroActual = camActual();
    var mesas = JSON.parse(bajar('mesa'));
    cargarMesas(camareroActual, mesas);
}

//BORRA MESAS ANTES DE ACTUALIZAR HTML
function borraMesas() {
    for (let i=1;i<=3;i++) {
        var mesas = document.querySelector(`.c_cpntainer${i}`);
        borrarChild(mesas);
    }    
}

//CARGA LA INFO EN EL HTML CAMARERO: MESAS ABIERTAS/OCUPADAS Y LIBRES
function cargarMesas(camareroActual, mesas) {
    //BORRA MESAS ANTERIORES PARA ACTUALIZAR
    borraMesas();
    
    //PINTA MESAS CON ESTADO ACTUAL
  
    for (let i = 0; i < 10; i++) {
        var divMesa = document.createElement('button');
        //FILTRA MESAS ABIERTAS DEL CAMARERO Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == camareroActual) {
            divMesa.className = `c_mesasA`;
            divMesa.addEventListener('click', () => { enviaMesa(i); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer1').appendChild(divMesa);
        }

        //FILTRA MESAS DISPONIBLES Y LAS PINTA
        if (mesas[i].estado == 'cerrada') {
            divMesa.className = `c_mesasC`;
            divMesa.addEventListener('click', () => { checkMesa(i, camareroActual); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer2').appendChild(divMesa);
        }

        //FILTRA MESAS ABIERTAS DE OTROS CAMAREROS Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero != camareroActual) {
            divMesa.className = `c_mesasR`;
            var numero = document.createTextNode(mesas[i].numero);
            divMesa.appendChild(numero);
            document.getElementsByClassName("c_cpntainer3")[0].appendChild(divMesa);
        }
    }
    historial();
}


//CAMBIA ESTADO DE MESA Y ACTUALIZA DOM
function checkMesa(indice, camareroActual) {
    var mesasArriba = JSON.parse(bajar('mesa'));
    mesasArriba[indice].estado = 'abierta';
    mesasArriba[indice].id_camarero = camareroActual;
    subir('mesa', JSON.stringify(mesasArriba));
    camareroIn();
}

// ENVÍA MESA A COMANDAS
function enviaMesa(indice) {
    subir('mesaActual', indice);
    window.location = "comandas.html"
}

// PINTA HISTORIAL DE FACTURAS DEL CAMARERO ACTUAL
function historial() {
   
    var camareros = getCamareros();
    var camareroActual = camActual();
    if (bajar("Tickets") != null) {
        var tickets = JSON.parse(localStorage.Tickets);
        for (let i = 0; i < tickets.length; i++) {
            if (tickets[i].camarero == camareros[camareroActual - 1].id_camarero) {
                console.log("ENTRA EN cond")
                var idTicket = tickets[i].id
                var botonTicket = document.createElement('button');
                botonTicket.className = `c_ticket`;
                botonTicket.addEventListener('click', () => {
                    consulta_ticket(idTicket);
                    window.location = "ticket.html"
                })
                var id = document.createTextNode(`Fecha: ${tickets[i].fecha} | id: ${idTicket}`);
                botonTicket.appendChild(id);
                document.querySelector('#c_historial').appendChild(botonTicket);
            }
        }
    }
  
}