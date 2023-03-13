import { subir, bajar, alerta } from './helpers.js';
import { iniciarApp } from './inicia.js';


//Inicia datos si no hay nada registrado
iniciarApp();

//añade llamadas a funciones en btones
document.getElementById("ticketID").addEventListener("click", () => {
    consulta_ticket()
})

document.getElementById("initialInfo").addEventListener("click", () => {
    closeInfo();
})

document.getElementById("login").addEventListener("click", () => {
    iniciarSesion();
})

//Funcion para cerrar mensaje inicial

function closeInfo(){
    document.getElementById("initialInfo").style.display = "none";
}

//Funcion logIn de camareros y admin
function iniciarSesion() {
    let loginok;
    let loginUser = document.getElementById("user").value;
    let loginPass = document.getElementById("password").value;
    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    let id_camarero = users.map(element => element.id_camarero);
    let admin = JSON.parse(bajar("admin"));
    if (loginUser == admin.name && loginPass == admin.pass) {
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
        if (!loginok) { alerta("<p>Usuario y/o contraseña incorrecta</p>") }
    }
}

//Mira el id de ticket introducido, valida y lleva a si procede ticket.html
function consulta_ticket() {
    let i = parseInt(document.getElementById('ticket').value);
    var tickets = JSON.parse(bajar("Tickets"))
    
    if (tickets) {
        if (tickets.length) { var checker= (tickets.length-1) } else { var checker=0 }
        if (i >= 0 && i<=checker) {
            var consulta = { "id": i, "origen": "cliente" };
            subir("TicketConsulta", JSON.stringify(consulta));
            window.location = "ticket.html"
        } else {
            alerta("<p>El número introducido no es correcto</p>")
        }
    } else {
        alerta("<p>No hay ningún ticket resgistrado.</p>")
    }
}
