
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

export function camActual () {
    return  parseInt(bajar('camareroActual'));
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
        var items=[];
        var cantidad=[];
        var precios=[];
        this.comanda.forEach((element, i) => {
            if (element > 0){
                precios.push(this.menu[i].precio)
                items.push(this.menu[i].nombre);
                cantidad.push(element);
                console.log(this.menu[i].nombre, element, (element*this.menu[i].precio));
            }
        });
    }
};

