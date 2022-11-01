import { subir, bajar } from './helpers.js';
import { iniciarApp } from './inicia.js';


//Inicia datos si no hay nada registrado
iniciarApp();

//añade llamadas a funciones en btones
document.getElementById("ticketID").addEventListener("click", () => {
    consulta_ticket()
})

document.getElementById("login").addEventListener("click", () => {
    iniciarSesion();
})

//Funcion logIn de camareros y admin
function iniciarSesion() {
    let loginok;
    let loginUser = document.getElementById("user").value;
    let loginPass = document.getElementById("password").value;
    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    let id_camarero = users.map(element => element.id_camarero);
    if (loginUser == "admin" && loginPass == "nimda") {
        window.location = "admin.html"
    }
    else {
        loginok = false
        for (let i = 0; i < username.length; i++) {
            if (loginUser == username[i] && loginPass == password[i]) {
                window.location = "mesas.html";
                subir("camareroActual", id_camarero[i]);
                loginok = true
            }
        }
        if (!loginok) { alert("Usuario y/o contraseña incorrecta") }
    }
}


function consulta_ticket() {
    let i = parseInt(document.getElementById('ticket').value);
    var tickets = JSON.parse(bajar("Tickets"));
    console.log(tickets.length);
    if (i >= 0 && i<= tickets.length) {
        var consulta = { "id": i, "origen": "cliente" };
        subir("TicketConsulta", JSON.stringify(consulta));
        window.location = "ticket.html"
    } else {
        alert("El número introducido no es correcto")
    }
}
