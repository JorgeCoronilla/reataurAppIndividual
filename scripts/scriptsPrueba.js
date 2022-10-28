// -------------------------- Funciones auxiliares ---------------------------------

function subir(clave, valor) {
    localStorage.setItem(clave, valor);
}
function bajar(clave) {
    return localStorage.getItem(clave);
}

function borrarChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// --------------------------INICIO DE DATOS POR DEFECTO (SI NO HAY DATOS)--------------------------


function iniciar() {
    if (localStorage.length == 0) {
        iniciarCamareros();
        iniciarMesas();
        iniciarMenu();
        iniciarTicket();
    }

}

function iniciarCamareros() {
    var listaCamareros = [];
    for (let i = 1; i < 5; i++) {
        var camarero = {
            id_camarero: `${i}`,
            nombre_camarero: `camarero${i}`,
            password: "1234",
            mesasActuales: {},
            mesasAtendidas: 0
        }
        listaCamareros.push(camarero);
    }
    subir("camarero", JSON.stringify(listaCamareros))
}

function iniciarMesas() {
    var listaMesas = [];
    for (let i = 1; i < 11; i++) {

        var mesa = {
            numero: `${i}`,
            estado: 'cerrada',
            id_camarero: 0,
            comanda: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        listaMesas.push(mesa);
    }

    subir("mesa", JSON.stringify(listaMesas));
}

function iniciarMenu() {
    var menu = {
        "id_articulo": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        'nombre': ['Vino tinto', 'Vino blanco', 'Cerveza', 'Refresco', 'Zumo', 'Café', 'Café especial', 'Gazpacho', 'Ensalada mixta', 'Ensaladilla', 'Lasaña', 'Puré de verduras', 'Secreto ibérico', 'Escalope de pollo', 'Bacalao a la riojana', 'Hamburguesa', 'Tarta de queso', 'Fruta del tiempo', 'Flan de la casa', 'Tarta de la abuela', 'Varios'],
        'precio': [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5]
    }
    subir('menu', JSON.stringify(menu));
}


function iniciarTicket() {
    var fecha = new Date;
    var fechaticket = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes()
    var ticket = {
        id_ticket: 0,
        fecha: fechaticket,
        id_mesa: 0,
        nombre_camarero: "camarero3",
        comanda: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 0,
        pagado: false,
    }
    subir("ticket", JSON.stringify(ticket))
}

//---------------------------------------- FUNCIONES INDEX ---------------------------------
//Funcion logIn de camareros y admin

function iniciarSesion() {
    let loginUser = document.getElementById("a_nombre").value;
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
                window.location = "camarero.html";
                subir("camareroActual", id_camarero[i]);
                loginok = true
            }
        }
        if (!loginok) { alert("Usuario y/o contraseña incorrecta") }
    }
}


// Funcion para que el cliente pueda ver el ticket de su consumicion y pagarlo.

function imprimirTicket(id_ticket_entrada) {
    let tabla = document.getElementById("t_tabla");
    let articulos = JSON.parse(localStorage.menu).nombre;
    let precios = JSON.parse(localStorage.menu).precio;
    let ticketsLista = JSON.parse(localStorage.ticket);
    let ticket = ticketsLista.filter((element) => {
        if (element.id_ticket == id_ticket_entrada) {
            return element
        }
    })
    let comanda = ticket[0].comanda;
    var totalCuenta = 0;
    for (let i = 0; i < comanda.length; i++) {
        if (comanda[i] > 0) {
            var fila = document.createElement("tr");
            var articulo = document.createElement("td");
            var precio = document.createElement("td");
            var cant = document.createElement("td");
            var total = document.createElement("td");
            articulo.innerHTML = articulos[i];
            articulo.setAttribute("class", "t_articulos")
            precio.innerHTML = precios[i];
            cant.innerHTML = comanda[i];
            total.innerHTML = comanda[i] * precios[i];
            fila.appendChild(articulo);
            fila.appendChild(cant);
            fila.appendChild(precio);
            fila.appendChild(total);
            tabla.appendChild(fila);
            totalCuenta += (comanda[i] * precios[i]);
        }
    }
    var p_total = document.getElementById("t_total");
    p_total.innerText = `${totalCuenta} €`;
    var p_camarero = document.getElementById("t_nombreCamarero");
    p_camarero.innerText = ticket[0].nombre_camarero;
    var p_id_ticket = document.getElementById("t_id_ticket");
    p_id_ticket.innerText = ticket[0].id_ticket;
    var p_id_mesa = document.getElementById("t_id_mesa");
    p_id_mesa.innerText = ticket[0].id_mesa + 1;
}

function consulta_ticket(id_ticket) {
    subir("ticketSeleccionado", id_ticket);
    window.location = "ticket.html";
}


// ---------------------------------------PASARELA DE PAGO -----------------------------------

function cargarPago() {
    var ticketSeleccionado = localStorage.ticketSeleccionado
    var tickets = JSON.parse(localStorage.ticket)
    var pagado = tickets[ticketSeleccionado].pagado;
    if (pagado) {
        alert("Esta cuenta está pagada. muchas gracias");
        window.location = "index.html"
    }
    var precio = tickets[ticketSeleccionado].total
    console.log(precio)
    var p_total = document.getElementById("p_total")
    p_total.innerText = precio + "€"
}

function checkPago() {
    var visa = document.getElementById("num_tarjeta").value
    console.log(visa)
    var regexp = /^(?:4\d([\- ])?\d{6}\1\d{5}|(?:4\d{3}|5[1-5]\d{2}|6011)([\- ])?\d{4}\2\d{4}\2\d{4})$/
    var validation = true
    var validationCard = regexp.test(visa)
    console.log(validationCard)
    console.log((visa.match(/^4\d{3}-?\d{4}-?\d{4}-?\d{4}$/)))
    console.log((visa.match(/^5[1-5]\d{2}-?\d{4}-?\d{4}-?\d{4}$/)))
    var nombre = document.getElementById("nombre_tarjeta").value;
    var ticketSeleccionado = localStorage.ticketSeleccionado
    var tikets = JSON.parse(localStorage.ticket)
    var pagado = tikets[ticketSeleccionado].pagado;
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
    }
    tikets[ticketSeleccionado].pagado = pagado;
    subir("ticket", JSON.stringify(tikets))
}
// ---------------------------------------------- FUNCIONES ADMIN -------------------------------------

function mostrarDatos() {
    let users = JSON.parse(localStorage.camarero);
    let rendimiento = document.getElementsByClassName("a_rendimiento")
    let username = users.map(element => element.nombre_camarero);
    let password = users.map(element => element.password);
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");
    console.log(placeholders_name)
    console.log(placeholders_pass)
    var mesas = JSON.parse(localStorage.mesa)
    console.log(mesas)
    console.log(username)

    var mesasAtendidas1 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 1) {
            mesasAtendidas1.push(mesas[i].numero)
        }
    }
    var mesasAtendidas2 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 2) {
            mesasAtendidas2.push(mesas[i].numero)
        }
    }
    var mesasAtendidas3 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 3) {
            mesasAtendidas3.push(mesas[i].numero)
        }
    }
    var mesasAtendidas4 = []
    for (let i = 0; i < 10; i++) {
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == 4) {
            mesasAtendidas4.push(mesas[i].numero)
        }
    }

    for (let i = 0; i < placeholders_name.length; i++) {
        placeholders_name[i].value = username[i];
        placeholders_pass[i].value = password[i];

    }
    rendimiento[0].innerHTML = mesasAtendidas1;
    rendimiento[1].innerHTML = mesasAtendidas2;
    rendimiento[2].innerHTML = mesasAtendidas3;
    rendimiento[3].innerHTML = mesasAtendidas4;
}
function guardarCambios() {
    var placeholders_name = document.getElementsByClassName("userName");
    var placeholders_pass = document.getElementsByClassName("userPass");
    var names = [];
    var pass = [];
    let users = JSON.parse(localStorage.camarero);
    for (let i = 0; i < placeholders_name.length; i++) {
        names.push(placeholders_name[i].value);
        pass.push(placeholders_pass[i].value);
    };
    console.log(names)
    console.log(pass)
    console.log(users)
    for (let k = 0; k < placeholders_name.length; k++) {
        users[k].nombre_camarero = names[k];
        users[k].password = pass[k];
    };
    console.log(users)
    subir("camarero", JSON.stringify(users))
}





//---------------------------------------- GRAFICA RESULTADOS -------------------------------------------------------------------------------------
function cargarGraficos(num) {

    // DATOS -------------

    var tickets = JSON.parse(bajar('ticket'))
    var camareros = JSON.parse(bajar('camarero'))
    var total = [0]
    var total1 = [0]
    var total2 = [0]
    var total3 = [0]
    var total4 = [0]
    var mesas = 0, mesas1 = 0, mesas2 = 0, mesas3 = 0, mesas4 = 0;
    var sTotal = 0, sTotal1 = 0, sTotal2 = 0, sTotal3 = 0, sTotal4 = 0;
    if (tickets != null) {
        for (let i = 0; i < tickets.length; i++) {
            total.push(tickets[i].total)
            if (tickets[i].nombre_camarero == camareros[0].nombre_camarero) {
                total1.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[1].nombre_camarero) {
                total2.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[2].nombre_camarero) {
                total3.push(tickets[i].total)
            }
            if (tickets[i].nombre_camarero == camareros[3].nombre_camarero) {
                total4.push(tickets[i].total)
            }
        }
        mesas = total.length - 1
        mesas1 = total1.length - 1
        mesas2 = total2.length - 1
        mesas3 = total3.length - 1
        mesas4 = total4.length - 1
        sTotal = total.reduce(function (a, b) { return a + b });
        sTotal1 = total1.reduce(function (a, b) { return a + b });
        sTotal2 = total2.reduce(function (a, b) { return a + b });
        sTotal3 = total3.reduce(function (a, b) { return a + b });
        sTotal4 = total4.reduce(function (a, b) { return a + b });
    } else {
        document.getElementById('a_resultados').innerHTML = "No hay datos"
    }
    /*---- Config graficas ----*/
    const labels = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT = 4;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Mesas servidas',
            backgroundColor: 'blcak',
            borderColor: 'blcak',
            data: [mesas, mesas1, mesas2, mesas3, mesas4]
        }]
    };

    const config = {
        type: 'bar',
        data: data, min: 0,
        options: {}
    };

    const labels1 = [
        'total',
        camareros[0].nombre_camarero,
        camareros[1].nombre_camarero,
        camareros[2].nombre_camarero,
        camareros[3].nombre_camarero
    ];
    const DATA_COUNT1 = 5;
    const data1 = {
        labels: labels1,
        datasets: [{
            label: 'Importe total',
            backgroundColor: 'black',
            borderColor: 'black',
            data: [sTotal, sTotal1, sTotal2, sTotal3, sTotal4]
        }]
    };

    const config1 = {
        type: 'bar',
        data: data1, min: 0,
        options: {}
    };

    switch (num) {
        case 0:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart')
            document.getElementById('a_resultados').append(canvas)
            const myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            break;
        case 1:
            document.getElementById('a_resultados').innerHTML = ""
            var canvas = document.createElement('canvas')
            canvas.setAttribute('id', 'myChart1')
            document.getElementById('a_resultados').append(canvas)
            const myChart1 = new Chart(
                document.getElementById('myChart1'),
                config1
            );

    }

}

//Baja datos de las mesas y camarero logueado - llama a la función que carga la info
function camareroIn() {
    var camareros = JSON.parse(bajar('camarero'));
    var camareroActual = parseInt(bajar('camareroActual'));
    var mesas = JSON.parse(bajar('mesa'));
    document.getElementById('c_nombre').innerText = camareros[(camareroActual - 1)].nombre_camarero
    cargarMesas(camareroActual, mesas);
}


function borraMesas() {
    var mesasA = document.querySelector('.c_cpntainer1');
    var mesasC = document.querySelector('.c_cpntainer2');
    var mesasR = document.querySelector('.c_cpntainer3');
    borrarChild(mesasA);
    borrarChild(mesasC);
    borrarChild(mesasR);
}
//CARGA LA INFO EN EL HTML CAMARERO: MESAS ABIERTAS/OCUPADAS Y LIBRES
function cargarMesas(camareroActual, mesas) {
    //BORRA MESAS ANTERIORES PARA ACTUALIZAR
    borraMesas();
    for (let i = 0; i < 10; i++) {
        //FILTRA MESAS ABIERTAS DEL CAMARERO Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero == camareroActual) {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasA`;
            divMesa.addEventListener('click', () => { enviaMesa(i); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer1').appendChild(divMesa);
        }

        //FILTRA MESAS DISPONIBLES Y LAS PINTA
        if (mesas[i].estado == 'cerrada') {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasC`;
            divMesa.addEventListener('click', () => { checkMesa(i, camareroActual); })
            var numero = document.createTextNode((mesas[i].numero));
            divMesa.appendChild(numero);
            document.querySelector('.c_cpntainer2').appendChild(divMesa);
        }

        //FILTRA MESAS ABIERTAS DE OTROS CAMAREROS Y LAS PINTA
        if (mesas[i].estado == 'abierta' && mesas[i].id_camarero != camareroActual) {
            var divMesa = document.createElement('button');
            divMesa.className = `c_mesasR`;
            var numero = document.createTextNode(mesas[i].numero);
            divMesa.appendChild(numero);
            document.getElementsByClassName("c_cpntainer3")[0].appendChild(divMesa);
        }
    }
    historial();
}

//ENVÍA LA MESA A MESA.HTML
function checkMesa(indice, camareroActual) {
    var mesasArriba = JSON.parse(bajar('mesa'));
    mesasArriba[indice].estado = 'abierta';
    mesasArriba[indice].id_camarero = camareroActual;
    subir('mesa', JSON.stringify(mesasArriba));
    camareroIn();
    enviaMesa(indice)
}


function enviaMesa(indice) {
    subir('mesaActual', indice);
    window.location = "mesa.html"
}
function historial() {
    var tickets = JSON.parse(localStorage.ticket);
    var camareros = JSON.parse(bajar('camarero'));
    var camareroActual = parseInt(bajar("camareroActual"))

    for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].nombre_camarero == camareros[camareroActual - 1].nombre_camarero) {
            var idTicket = tickets[i].id_ticket
            console.log(idTicket)
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

//Inicia mesa-comandas
function iniciarMesa() {
    iniciarDesplegables();
    sumarYRestar();
    var add = adicionarComanda();
    verComanda(add[0], add[1]);

    var cerrar = document.querySelector('#m_cerrarMesa');
    cerrar.addEventListener('click', () => {
        cerrarMesa(add[0], add[1], add[2]);
    });

    //Estilo desplegable
    var desplegables = document.getElementsByClassName('m_desplegables');
    var opciones = document.querySelectorAll('.m_opciones h2');
    for (let i = 0; i < opciones.length; i++) {
        opciones[i].addEventListener('click', () => {
            desplegar(desplegables[i]);
        });
    }


    //Boton de Volver
    var volver = document.querySelector('#m_volver');
    volver.addEventListener('click', () => {
        window.location = 'camarero.html'
    });
}


//Iniciar desplegables del Menu
function iniciarDesplegables() {
    var menu = JSON.parse(bajar('menu'));
    var desplegables = document.getElementsByClassName('m_desplegables');

    let i = 0;
    while (i < 7) {
        //Bebidas
        let li = document.createElement('li');
        desplegables[0].append(li);
        li.innerHTML = (`<span class = 'articulo'>${menu.nombre[i]}</span>`);

        let span = document.createElement('span');
        span.innerHTML = (` <span class = 'restar'>-</span> <span class='cantidad'>0</span> <span class='sumar'>+</span>`);

        li.append(span);

        i++;
    };

    let j = 7;
    while (j < 12) {
        //Primeros
        let li = document.createElement('li');
        desplegables[1].append(li);
        li.innerHTML = (`<span class = 'articulo'>${menu.nombre[j]}</span>`);

        let span = document.createElement('span');
        span.innerHTML = (` <span class = 'restar'>-</span> <span class='cantidad'>0</span> <span class='sumar'>+</span>`);

        li.append(span);

        j++;
    }

    let k = 12;
    while (k < 16) {
        //Segundos
        let li = document.createElement('li');
        desplegables[2].append(li);
        li.innerHTML = (`<span class = 'articulo'>${menu.nombre[k]}</span>`);

        let span = document.createElement('span');
        span.innerHTML = (` <span class = 'restar'>-</span> <span class='cantidad'>0</span> <span class='sumar'>+</span>`);

        li.append(span);

        k++;
    }

    let m = 16;
    while (m < 21) {
        //Postres
        let li = document.createElement('li');
        desplegables[3].append(li);
        li.innerHTML = (`<span class = 'articulo'>${menu.nombre[m]}</span>`);

        let span = document.createElement('span');
        span.innerHTML = (` <span class = 'restar'>-</span> <span class='cantidad'>0</span> <span class='sumar'>+</span>`);

        li.append(span);

        m++;
    }

}

//Añadir y quitar cantidades de cada elemento del menu
function sumarYRestar() {
    var restar = document.getElementsByClassName('restar');
    var sumar = document.getElementsByClassName('sumar');
    var spanCantidad = document.getElementsByClassName('cantidad');

    for (let i = 0; i < sumar.length; i++) {
        restar[i].addEventListener('click', () => {
            let numero = parseInt(spanCantidad[i].innerHTML);
            if (numero > 0) {
                spanCantidad[i].innerHTML = numero - 1;
            } else {
                spanCantidad[i].innerHTML = numero;
            }
        });
        sumar[i].addEventListener('click', () => {
            let numero = parseInt(spanCantidad[i].innerHTML);
            spanCantidad[i].innerHTML = numero + 1;
        });
    }
}

//Funcion para borrar la comanda una vez se genere la cuenta
function borraComanda() {
    var mostrarComanda = document.querySelector('#m_comanda');
    borrarChild(mostrarComanda);
}

//Muestra la comanda de la mesa Actual
function verComanda(mesa, mesaActual) {
    borraComanda();
    var menu = JSON.parse(bajar('menu'));
    var mostrarComanda = document.querySelector('#m_comanda');
    let ul = document.createElement('ul');
    ul.style.display = 'flex';
    ul.style['flex-flow'] = 'row wrap';
    ul.style['justify-content'] = 'space-evenly';

    let h2 = document.createElement('h2');
    h2.style.display = 'flex';
    h2.style['flex-flow'] = 'column wrap';
    h2.style['align-items'] = 'center';
    h2.innerHTML = 'Comanda';

    mostrarComanda.append(h2);
    mostrarComanda.append(ul);

    for (let j = 0; j < mesa[mesaActual].comanda.length; j++) {
        if (mesa[mesaActual].comanda[j] > 0) {
            let li = document.createElement('li');
            li.setAttribute('class', 'articuloComanda');
            li.style.cursor = 'pointer'
            li.style.padding = '5px';
            li.style.margin = '3px';
            li.style.border = '1px solid black';
            li.innerHTML = `${menu.nombre[j]}: ${mesa[mesaActual].comanda[j]}`
            ul.append(li);
        }
    }
}

//funcion desplegables para reutilizar en los clicks
function desplegar(desplegable) {
    let display = desplegable.style.display;
    if (display == 'none') {
        desplegable.style.display = 'block';
    } else {
        desplegable.style.display = 'none';
    }
}
//TICKET
class Ticket {
    constructor(id_ticket, fecha, id_mesa, nombre_camarero, comanda, total, pagado) {
        this.id_ticket = id_ticket;
        this.fecha = fecha;
        this.id_mesa = id_mesa;
        this.nombre_camarero = nombre_camarero;
        this.comanda = comanda;
        this.total = total;
        this.pagado = pagado;
    }
}


// -------------------------- Guardar ticket ----------------------------------------

function guardarTicket() {
    var fecha = new Date;
    var fechaticket = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes();
    var ticketsLista = [JSON.parse(bajar("ticket"))];
    console.log(ticketsLista)
    var id_anterior = ticketsLista[ticketsLista.length - 1].id_ticket;
    var ticket = {
        id_ticket: id_anterior + 1,
        fecha: fechaticket,
        id_mesa: 0,
        nombre_camarero: "camarero3",
        comanda: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        total: 0,
        pagado: false,
    };
    ticketsLista.push(ticket);
    subir("ticket", JSON.stringify(ticketsLista));
}


//funcion desplegables para reutilizar en los clicks
function desplegar(desplegable) {
    let display = desplegable.style.display;
    if (display == 'none') {
        desplegable.style.display = 'block';
    } else {
        desplegable.style.display = 'none';
    }
}


//Cerrar Mesa
function cerrarMesa(mesa, mesaActual, camareroActual) {
    var fecha = new Date;
    var fechaticket = fecha.getDay() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes();

    let users = JSON.parse(localStorage.camarero);
    let username = users.map(element => element.nombre_camarero);
    var camareroActual = bajar("camareroActual")
    var camareroActualN = "";
    switch (camareroActual) {
        case "1": camareroActualN = username[0]
            break;
        case "2": camareroActualN = username[1]
            break;
        case "3": camareroActualN = username[2]
            break;
        case "4": camareroActualN = username[3]
            break;
    }

    var menu = JSON.parse(bajar('menu'));
    var total = 0;
    var pagado = false;
    var ticketsLista = JSON.parse(bajar("ticket"));
    var inicioTicket = [];
    for (let i = 0; i < mesa[mesaActual].comanda.length; i++) {
        total += mesa[mesaActual].comanda[i] * menu.precio[i];
    }
    if (!ticketsLista) {
        var newTicket = new Ticket(0, fechaticket, mesaActual, camareroActualN, mesa[mesaActual].comanda, total, pagado);
        inicioTicket.push(newTicket);
        subir("ticket", JSON.stringify(inicioTicket))
    } else {
        var id_anterior = ticketsLista[ticketsLista.length - 1].id_ticket + 1;
        console.log(ticketsLista)
        var newTicket = new Ticket(id_anterior, fechaticket, mesaActual, camareroActualN, mesa[mesaActual].comanda, total, pagado);
        ticketsLista.push(newTicket);
        subir("ticket", JSON.stringify(ticketsLista))
    }
    mesa[mesaActual].estado = 'cerrada';
    mesa[mesaActual].comanda = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    subir('mesa', JSON.stringify(mesa));

    window.location = 'camarero.html';


    let mesasAtendidas = JSON.parse(localStorage.camarero)[localStorage.camareroActual].mesasAtendidas;
    users[localStorage.camareroActual - 1].mesasAtendidas = mesasAtendidas + 1;
    subir("camarero", JSON.stringify(users))
}
function adicionarComanda() {
    //Recoger mesaActual
    var mesa = JSON.parse(bajar('mesa'));
    var mesaActual = parseInt(bajar('mesaActual'));
    var camareroActual = parseInt(bajar('camareroActual'));
    document.querySelector('h1').innerHTML = 'Mesa' + ' ' + (mesaActual + 1);
    document.querySelector('#m_cerrarMesa').innerHTML = 'Generar Cuenta Mesa' + ' ' + (mesaActual + 1);
    var comanda = mesa[mesaActual].comanda;

    //Añadir cantidades
    var spanCantidad = document.getElementsByClassName('cantidad');

    var añadir = document.getElementById('m_añadir');
    añadir.addEventListener('click', () => {
        for (let i = 0; i < spanCantidad.length; i++) {
            let cantidad = spanCantidad[i].innerHTML;
            if (cantidad > 0) {
                comanda[i] = parseInt(comanda[i]) + parseInt(cantidad);
                spanCantidad[i].innerHTML = 0;
            }
        }
        mesa[mesaActual].comanda = comanda;
        mesa[mesaActual].id_camarero = camareroActual;
        subir('mesa', JSON.stringify(mesa));
        verComanda(mesa, mesaActual)
    });

    return [mesa, mesaActual, camareroActual]
}




//Ver comanda en el cuerpo de la Mesa Actual
//Guardar id ticket, comanda mesa actual,
// TICKETS.html == Imprimir el numero de mesa, camarero id tickets.
// pago.html == crear la pasarela
// admin.html == mostrar rendimiento camareros en grafica.