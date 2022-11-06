
import { subir, formatTicket, alerta } from './helpers.js';

(() => {
    cargarPago()
})();

// Carga la info del pago. Comprueba que está pagada.
function cargarPago() {
    var tickets = formatTicket();
    var pagado = tickets.pagado;
    if (pagado) {
        alerta("Esta cuenta está pagada. Muchas gracias");
        setTimeout(() => { window.location = "index.html" }, 5000);
    }
    var precio = tickets.total
    console.log(precio)
    var p_total = document.getElementById("p_total")
    p_total.innerText = `Total: ${precio} €`
    document.getElementById("cerrar").addEventListener('click', () => { checkPago(); });
    document.getElementById("salir").addEventListener('click', () => { window.location = "index.html" });
}

// Valida entrada de datos de pago
function checkPago() {

    var tickets = formatTicket();
    var pagado = tickets.pagado;
    if (pagado) {
        mensaje += "<p>Esta cuenta está pagada. muchas gracias</p>";
        setTimeout(() => { window.location = "index.html" }, 5000);
    }

    if (validaNam() && cardNumVal() && fechaVal() && cvvVal()) {
        ticketPagado(tickets);
        alerta("<p>Operación finalizada con éxito. ¡Gracias!</p>")
        setTimeout(() => { window.location = "index.html" }, 5000)
    } else {
        alerta( mensajeError());
    }
}
//Mensajes

function mensajeError(){
    var mensaje = ""
    if (!validaNam()) mensaje += "<p>El nombre introducido no es válido.</p>";
    if (!cardNumVal()) mensaje += "<p>El número de tarjeta introducido no es Visa o Mastercard</p>";
    if (!fechaVal()) mensaje += "<p>La fecha de caducidad debe ser posterior. ¿Ha caducado?</p>";
    if (!cvvVal()) mensaje += "<p>El CVV no es correcto</p>";
    
    return mensaje;
}


// Valida nombre de tarjeta
function validaNam() {
    var nombre = document.getElementById("nombre_tarjeta").value;
    return (nombre.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u))
}

//Valida numero de tarjeta
function cardNumVal() {
    var visa = document.getElementById("num_tarjeta").value
    var regexp = /^(?:4\d([\- ])?\d{6}\1\d{5}|(?:4\d{3}|5[1-5]\d{2}|6011)([\- ])?\d{4}\2\d{4}\2\d{4})$/;
    return regexp.test(visa)
}

//Valida fecha

function fechaVal() {

    var mes = document.getElementById("mes_tarjeta").value;
    var ano = document.getElementById("ano_tarjeta").value;
    var fecha = new Date;
    return ((ano > fecha.getFullYear()) || (ano = fecha.getFullYear && (mes-1) > fecha.getMonth()))
}

function cvvVal() {

    var cvv = document.getElementById("cvv").value;
    return (cvv.length > 2 && cvv.length< 5)
}

//Actualiza ticket

function ticketPagado(tickets) {
    let oldTickets = JSON.parse(localStorage.Tickets);
    if (oldTickets.length) {
        oldTickets[tickets.id].pagado = true;
    } oldTickets.pagado = true;
    subir("Tickets", JSON.stringify(oldTickets));
}