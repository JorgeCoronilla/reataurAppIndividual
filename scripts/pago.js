
import { subir, bajar } from './helpers.js';

(() => {
    cargarPago()
})();

function cargarPago() {
    var tickets = formatTicket();
    var pagado = tickets.pagado;
    if (pagado) {
        alert("Esta cuenta está pagada. muchas gracias");
        window.location = "index.html"
    }
    var precio = tickets.total
    console.log(precio)
    var p_total = document.getElementById("p_total")
    p_total.innerText = `Total: ${precio} €`
    document.getElementById("cerrar").addEventListener('click', () => { checkPago(); });
    document.getElementById("salir").addEventListener('click', () => { window.location = "index.html" });
}

function formatTicket() {
    var ticketSel = JSON.parse(bajar("TicketConsulta")).id
    var ticketsAux = JSON.parse(bajar("Tickets"))
    if (ticketsAux.length) { return ticketsAux[ticketSel] } else { return ticketsAux }
}

function checkPago() {
    var visa = document.getElementById("num_tarjeta").value
    console.log(visa)
    var regexp = /^(?:4\d([\- ])?\d{6}\1\d{5}|(?:4\d{3}|5[1-5]\d{2}|6011)([\- ])?\d{4}\2\d{4}\2\d{4})$/
    var validation = true
    var validationCard = regexp.test(visa)
    var nombre = document.getElementById("nombre_tarjeta").value;
    var tickets = formatTicket();
    var pagado = tickets.pagado;
    if (pagado) {
        alert("Esta cuenta está pagada. muchas gracias");
        window.location = "index.html"
    }
    if (!nombre.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u)) {
        alert("El nombre introducido no es válido.");
        validation = false;
    }
    var mes = document.getElementById("mes_tarjeta").value;
    var ano = document.getElementById("ano_tarjeta").value;
    if (mes.length != 2 && mes <= 12) {
        alert("El Mes debe estar escrito con dos cifras.")
        validation = false;
    }

    if (ano.length != 2 && ano >= 22) {
        alert("El Año debe estar escrito con dos cifras.")
        validation = false;
    }
    var cvv = document.getElementById("cvv").value
    if (cvv.length != 3) {
        alert("El CVV debe tener tres cifras")
        validation = false
    }
    if (!validationCard) { alert("El número de tarjeta introducido no es Visa o Mastercard") }
    if (validation && validationCard) {
        alert("Operación finalizada con éxito.")
        window.location = "index.html"
        pagado = true;
        if (ticketsAux.length) { ticketsAux[ticketSel].pagado = true } else { ticketsAux.pagado = true }
        subir("Tickets", JSON.stringify(ticketsAux))
    }
}