
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

export function pintaCamFooter (){
    var camareroActual = camActual();
    var camareros = getCamareros();
    document.getElementById('c_nombre').innerText = camareros[(camareroActual - 1)].nombre_camarero
  
}
