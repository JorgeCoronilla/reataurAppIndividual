import { subir, bajar, borrarChild, camActual, getCamareros, resetMesa } from './helpers.js';
import { Ticket } from './inicia.js';

(() => {
    consultaTicket();
})();

function consultaTicket() {

    var consulta = JSON.parse(bajar("TicketConsulta"));
    var camarero = JSON.parse(bajar("camarero"));
    var id = consulta.id;
    var ticket = JSON.parse(bajar("Tickets"));
    var ticketConsulta = new Ticket(ticket[id].id, ticket[id].fecha, ticket[id].camarero, ticket[id].mesa, ticket[id].comanda, ticket[id].menu, ticket[id].pagado, ticket[id].ultimaMod);
    var numMesa = parseInt(bajar("mesaActual"));

    if (numMesa == 10) {
        var mesa = JSON.parse(bajar("mesa"));
        var menu = JSON.parse(bajar("menu"));
        ticketConsulta.getComanda(mesa[10].comanda);
        resetMesa(menu, mesa, numMesa);
    }

    document.querySelector("p").innerHTML = `ID: ${ticket[id].id}`;
    document.querySelector("h5").innerHTML = `Atendido por: ${camarero[ticket[id].camarero].nombre_camarero}`;
    ticketConsulta.imprime();
    preparaBtn(consulta.origen, ticketConsulta)
    console.log("TERMINA LA CONSULTA");
}


function preparaBtn(origen, ticket) {
    console.log("ENTRA EN PREPARADOR")
    if (origen == "camarero") {
        opcionCamarero(ticket);
    }
    if (origen == "cliente") {
        opcionCliente(ticket);
    }
}

function opcionCamarero(ticket) {
    document.querySelector("#cerrar").innerText = "volver";
    document.getElementById("cerrar").addEventListener('click', () => {
        var consulta = { "id": null, "origen": "vacio" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "mesas.html";
    });

    document.getElementById("revisar").addEventListener('click', () => {
        if (ticket.pagado == true) {
            alert("Este ticket ya está abonado, no puedes hacer modificaciones")
        } else {
            subir("mesaActual", "10");
            var mesasArriba = JSON.parse(bajar('mesa'));
            mesasArriba[10].id_camarero = camActual();
            mesasArriba[10].comanda = ticket.comanda;
            subir('mesa', JSON.stringify(mesasArriba));
            window.location = "comandas.html";
        }
    });
    document.getElementById("salir").addEventListener('click', () => {
        var consulta = { "id": null, "origen": "vacio" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "index.html";
    });
}

function opcionCliente() {
 console.log("Entra");
 var footer= document.querySelector('footer');
 footer.removeChild(footer.firstElementChild);
 var pagarBtn = document.querySelector("#revisar")
 pagarBtn.className="btnClient";
 pagarBtn.innerHTML="Pagar"
 pagarBtn.addEventListener('click', () => {
    window.location = "pago.html";
});
document.getElementById("salir").className="btnClient"
}