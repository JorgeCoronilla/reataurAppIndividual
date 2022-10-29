import { subir, bajar, borrarChild, camActual, getCamareros, pintaCamFooter } from './helpers.js';
import { Ticket } from './inicia.js';

(() => {
    consultaTicket();
})();

function consultaTicket() {

    var consulta = JSON.parse(bajar("TicketConsulta"));
    var camarero = JSON.parse(bajar("camarero"));
    var id = consulta.id;
    var ticket = JSON.parse(bajar("Tickets"));
    var ticketConsulta = new Ticket(ticket[id].id, ticket[id].fecha, ticket[id].camarero, ticket[id].mesa, ticket[id].comanda, ticket[id].menu, ticket[id].pagado);

    document.querySelector("p").innerHTML = `ID: ${ticket[id].id}`;
    document.querySelector("h5").innerHTML = `Atendido por: ${camarero[ticket[id].camarero].nombre_camarero}`;
    ticketConsulta.imprime();
    preparaBtn(consulta.origen, ticketConsulta.getId())
}

function preparaBtn(origen, id) {
    if (origen == "camarero") {
       opcionCamarero (id);
    }
    if (origen == "cliente") {
        preparaCliente();
    }
}

function opcionCamarero (id) {
    document.querySelector("#cerrar").innerText = "volver";
    document.getElementById("cerrar").addEventListener('click', () => {
        var consulta = { "id": null, "origen": "vacio" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "mesas.html";
    });

    document.getElementById("revisar").addEventListener('click', () => {
        if (ticketConsulta.pagado==true) {
            alert ("Este ticket ya está abonado, no puedes hacer modificaciones")
        } else {
            subir("mesaActual", "11");
            var mesasArriba = JSON.parse(bajar('mesa'));
            mesasArriba[11].estado = 'abierta';
            mesasArriba[11].id_camarero = camareroActual;
            mesasArriba[11].comanda = ticketConsulta.comanda;
            subir('mesa', JSON.stringify(mesasArriba));
            /*var consulta = { "id": null, "origen": "vacio" };
            subir("TicketConsulta", JSON.stringify(consulta));*/
            window.location = "comandas.html";
        }
      
    });

    document.getElementById("salir").addEventListener('click', () => {
        var consulta = { "id": null, "origen": "vacio" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "index.html";
    });
}

function preparaCliente() {
    
}