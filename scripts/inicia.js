
// --------------------------INICIO DE DATOS POR DEFECTO (SI NO HAY DATOS)--------------------------

import { subir, bajar } from './helpers.js';

export function iniciarApp() {
    if (localStorage.length == 0) {
        iniciarCamareros();
        iniciarMenu();
        iniciarMesas();

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
    var menu = JSON.parse(bajar("menu"));
    const comandaActual = Array(menu.length).fill(0);
    var listaMesas = [];
    for (let i = 1; i < 12; i++) {

        var mesa = {
            numero: `${i}`,
            estado: 'cerrada',
            id_camarero: 0,
            comanda: comandaActual,
            total:0
        }
        listaMesas.push(mesa);
    }

    subir("mesa", JSON.stringify(listaMesas));
}

//MENU POR DEFECTO

function iniciarMenu() {
    var menu = [
        {
            "id_articulo": 0,
            "tipo": "bebida-caliente",
            "nombre": "café",
            "precio": 1.6
        },
        {
            "id_articulo": 1,
            "tipo": "bebida-caliente",
            "nombre": "infusión",
            "precio": 1.3
        },
        {
            "id_articulo": 2,
            "tipo": "bebida-caliente",
            "nombre": "café especial",
            "precio": 2.5
        },
        {
            "id_articulo": 3,
            "tipo": "bebida-caliente",
            "nombre": "carajillo",
            "precio": 3
        },
        {
            "id_articulo": 4,
            "tipo": "bebida-fria",
            "nombre": "agua pequeña",
            "precio": 1.5
        },
        {
            "id_articulo": 5,
            "tipo": "bebida-fria",
            "nombre": "agua grande",
            "precio": 1.5
        },
        {
            "id_articulo": 6,
            "tipo": "bebida-fria",
            "nombre": "vino copa",
            "precio": 2.5
        },
        {
            "id_articulo": 7,
            "tipo": "bebida-fria",
            "nombre": "vino copa reserv",
            "precio": 3.5
        },
        {
            "id_articulo": 8,
            "tipo": "bebida-fria",
            "nombre": "cerveza 33cl",
            "precio": 2.5
        },
        {
            "id_articulo": 9,
            "tipo": "bebida-fria",
            "nombre": "cerveza 50cl",
            "precio": 3.6
        },
        {
            "id_articulo": 10,
            "tipo": "bebida-fria",
            "nombre": "refresco",
            "precio": 1.8
        },
        {
            "id_articulo": 11,
            "tipo": "bebida-fria",
            "nombre": "zumo",
            "precio": 2
        },
        {
            "id_articulo": 12,
            "tipo": "bebida-fria",
            "nombre": "tinto verano",
            "precio": 2.8
        },
        {
            "id_articulo": 13,
            "tipo": "primeros",
            "nombre": "ensalada",
            "precio": 5
        },
        {
            "id_articulo": 14,
            "tipo": "primeros",
            "nombre": "pasta",
            "precio": 6.5
        },
        {
            "id_articulo": 15,
            "tipo": "primeros",
            "nombre": "sopa día",
            "precio": 4.5
        },
        {
            "id_articulo": 16,
            "tipo": "primeros",
            "nombre": "especial",
            "precio": 6.5
        },
        {
            "id_articulo": 17,
            "tipo": "segundos",
            "nombre": "musaka",
            "precio": 6
        },
        {
            "id_articulo": 18,
            "tipo": "segundos",
            "nombre": "carne día",
            "precio": 7
        },
        {
            "id_articulo": 19,
            "tipo": "segundos",
            "nombre": "pescado día",
            "precio": 7.5
        },
        {
            "id_articulo": 20,
            "tipo": "segundos",
            "nombre": "pizza",
            "precio": 6
        },
        {
            "id_articulo": 21,
            "tipo": "segundos",
            "nombre": "hamburguesa",
            "precio": 6.5
        },
        {
            "id_articulo": 22,
            "tipo": "segundos",
            "nombre": "especial",
            "precio": 9
        },
        {
            "id_articulo": 23,
            "tipo": "postres",
            "nombre": "helado",
            "precio": 2
        },
        {
            "id_articulo": 24,
            "tipo": "postres",
            "nombre": "brownie",
            "precio": 3.5
        },
        {
            "id_articulo": 25,
            "tipo": "postres",
            "nombre": "tarta queso",
            "precio": 3.5
        },
        {
            "id_articulo": 26,
            "tipo": "postres",
            "nombre": "fruta",
            "precio": 2
        },
        {
            "id_articulo": 27,
            "tipo": "postres",
            "nombre": "flan",
            "precio": 2.5
        },
        {
            "id_articulo": 28,
            "tipo": "postres",
            "nombre": "especial",
            "precio": 4.5
        }
    ]

    subir('menu', JSON.stringify(menu));

}


export const Ticket = class {

    constructor(id, fecha, camarero, mesa, comanda, total, menu, pagado, ultimaMod) {
        this.id = id;
        this.camarero = camarero;
        this.mesa = mesa;
        this.comanda = comanda;
        this.total = total;
        this.menu = menu;
        this.fecha = fecha;
        this.pagado = pagado;
        this.ultimaMod = ultimaMod
    }

    getId() {
        return this.id;
    }

    getComanda() {
        return this.comanda;
    }

    getComanda(comanda) {
        return this.comanda;
    }

    setUltimaMod (ultimaMod) {
        this.ultimaMod = ultimaMod
    }

    imprime() {

        var importe = 0;
        this.comanda.forEach((element, i) => {
            if (element > 0) {
                importe += this.menu[i].precio * element;

                var articulo = document.createElement("p");
                var texto1 = document.createTextNode(this.menu[i].nombre);
                articulo.appendChild(texto1);
                document.querySelector("#col1").appendChild(articulo)

                var numero = document.createElement("p");
                var texto2 = document.createTextNode(element);
                numero.appendChild(texto2);
                document.querySelector("#col2").appendChild(numero)

                var precio = document.createElement("p");
                var texto3 = document.createTextNode(this.menu[i].precio);
                precio.appendChild(texto3);
                document.querySelector("#col3").appendChild(precio)

            }
        });
        var total = document.createElement("h4");
                var texto4 = document.createTextNode(`Total: * ${importe} *`);
                total.appendChild(texto4);
                document.querySelector("#total").appendChild(total)
    }
};
