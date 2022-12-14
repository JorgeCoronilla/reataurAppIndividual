import { subir, bajar, formatTicket, camActual, resetMesa, alerta } from './helpers.js';
import { Ticket } from './inicia.js';

(() => {
    consultaTicket();
})();

//Busca el ticket
function consultaTicket() {
    var consulta = JSON.parse(bajar("TicketConsulta"));
    var camarero = JSON.parse(bajar("camarero"));
    var ticket=formatTicket();
    var ticketConsulta = new Ticket(ticket.id, ticket.fecha, ticket.camarero, ticket.mesa, ticket.comanda, ticket.total, ticket.menu, ticket.pagado, ticket.ultimaMod);
    console.log(ticketConsulta);
    var numMesa = parseInt(bajar("mesaActual"));
    if (numMesa == 10) {
        var mesa = JSON.parse(bajar("mesa"));
        var menu = JSON.parse(bajar("menu"));
        ticketConsulta.getComanda(mesa[10].comanda);
        resetMesa(menu, mesa, numMesa);
    }
    document.querySelector("p").innerHTML = `ID: ${ticket.id}`;
    document.querySelector("h5").innerHTML = `Atendido por: ${camarero[(ticket.camarero-1)].nombre_camarero}`;
    ticketConsulta.imprime();
    preparaBtn(consulta.origen, ticketConsulta)
}

// filtra el origen (camarero o cliente)
function preparaBtn(origen, ticket) {
    if (origen == "camarero") {
        opcionCamarero(ticket);
    }
    if (origen == "cliente") {
        opcionCliente(ticket);
    }
}

//Prepara opciones para camarero
function opcionCamarero(ticket) {
    document.querySelector("#cerrar").innerText = "volver";
    document.getElementById("cerrar").addEventListener('click', () => {
        var consulta = { "id": null, "origen": "vacio" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "mesas.html";
    });

    document.getElementById("revisar").addEventListener('click', () => {
        if (ticket.pagado == true) {
            alerta("<p>Este ticket ya está abonado, no puedes hacer modificaciones</p>")
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

//Prepara opciones para cliente
function opcionCliente() {
 var footer= document.querySelector('footer');
 footer.removeChild(footer.firstElementChild);
 var pagarBtn = document.querySelectorAll("footer button")
 pagarBtn[0].className="btnClient";
 pagarBtn[1].className="btnClient";
 pagarBtn[0].innerHTML="Pagar"
 pagarBtn[0].addEventListener('click', () => {
    window.location = "pago.html";
});
pagarBtn[1].addEventListener('click', () => {
    window.location = "index.html";
});
}