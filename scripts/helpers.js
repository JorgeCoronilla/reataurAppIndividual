
export function subir(clave, valor) {
    localStorage.setItem(clave, valor);
}
export function bajar(clave) {
    return localStorage.getItem(clave);
}
export function borrarChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function camActual() {
    return parseInt(bajar('camareroActual'));
}

export function getCamareros() {
    return JSON.parse(bajar('camarero'));
}

//VUELVE MESA A ESTADO INICIAL
export function resetMesa(menu, mesa, numMesa) {
    const resetComanda = Array(menu.length).fill(0);
    mesa[numMesa].comanda = resetComanda;
    mesa[numMesa].id_camarero = 0;
    mesa[numMesa].estado = "cerrada";
    subir("mesa", JSON.stringify(mesa));
}

//Define Tickets

export const Ticket = class {

    constructor(id, fecha, camarero, mesa, comanda, menu) {
        this.id = id;
        this.camarero = camarero;
        this.mesa = mesa;
        this.comanda = comanda
        this.menu = menu;
        this.fecha = fecha;
    }

    getId() {
        return this.id;
    }

    getComanda() {
        return this.comanda;
    }

    imprime() {
        var items = [];
        var cantidad = [];
        var precios = [];
        this.comanda.forEach((element, i) => {
            if (element > 0) {
                precios.push(this.menu[i].precio)
                items.push(this.menu[i].nombre);
                cantidad.push(element);
                console.log(this.menu[i].nombre, element, (element * this.menu[i].precio));
            }
        });
    }
};


//Cambia la forma de tratar tickets: solo hay un ticket o es un array
export function formatTicket() {
    var ticketSel = JSON.parse(bajar("TicketConsulta")).id
    var ticketsAux = JSON.parse(bajar("Tickets"))
    if (ticketsAux.length) { return ticketsAux[ticketSel] } else { return ticketsAux }
}



//ALERTAS - tiempo == 0 botón aceptar

export function alerta(mensaje) {
    var container = document.querySelector(".alert_container");
    var bloque = document.createElement('div');
    bloque.setAttribute("id", "alerta");
    container.appendChild(bloque);
    var ventana = document.querySelector("#alerta")
    ventana.innerHTML = mensaje;
        document.getElementById('anchor').scrollIntoView();

        setTimeout(() => {
            container.removeChild(container.firstChild);
            document.getElementById('anchor').style.paddingTop = "0";
        }, 4500);

}


export function cargarGraficos(num) {

    // DATOS -------------

    var tickets = JSON.parse(bajar('Tickets'))
    var camareros = JSON.parse(bajar('camarero'))
    var total = [0]
    var total1 = [0]
    var total2 = [0]
    var total3 = [0]
    var total4 = [0]
    var mesas = 0, mesas1 = 0, mesas2 = 0, mesas3 = 0, mesas4 = 0;
    var sTotal = 0, sTotal1 = 0, sTotal2 = 0, sTotal3 = 0, sTotal4 = 0;
   
    if (tickets) {
    if (tickets.length){
    if (tickets) {
        for (let i = 0; i < tickets.length; i++) {
            total.push(tickets[i].total)
            if (tickets[i].camarero == camareros[0].id_camarero) {
                total1.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[1].id_camarero) {
                total2.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[2].id_camarero) {
                total3.push(tickets[i].total)
            }
            if (tickets[i].camarero == camareros[3].id_camarero) {
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
        document.getElementById('a_resultados').innerHTML = "No hay datos"}
    }else{document.getElementById('a_resultados').innerHTML = "No hay datos"}
}else{document.getElementById('a_resultados').innerHTML = "No hay datos"}

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
