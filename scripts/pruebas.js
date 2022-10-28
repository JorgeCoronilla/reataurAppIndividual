//Indica la secuencia de salida y explica razonadamente el siguiente código

 const hornoListo = async () => {
    return new Promise(resolve => setTimeout(() => {
        resolve('Beep! Horno Calentado!')
    }, 3000));
}

const preCalentarHorno = async () => {
    console.log('Pre calentar horno.');
    const respuesta = await hornoListo();
    console.log(respuesta);
}

// Definir las otras funciones
const obtenerPizzaFria = () => console.log('Obtener pizza.');
const abrirPizzaFria = () => console.log('Abrir pizza.');
const obtenerSartenPizza = () => console.log('Obtener sarten.');
const ponerPizzaSarten = () => console.log('Poner pizza en el sarten.');
const tomarRefresco = () => console.log('Tomar un refresco.');
const mirarTV = () => console.log('Ver la televisión.');

// Ahora llama a las funciones
preCalentarHorno();
obtenerPizzaFria();
abrirPizzaFria();
obtenerSartenPizza();
ponerPizzaSarten();
tomarRefresco();
mirarTV();


/*async function getUserAsync2(name) {
    try {
        let response = await fetch(`https://api.github.com/users/${name}`);
        let data = await response.json()
        return data;    
    }
    catch (error) {
        console.log(`ERROR: ${error.stack}`);
    }
}
getUserAsync2('daviniathebridge')
.then(data=>console.log(data))

*/
/*
async function getUserAsync(name) {
    let response = await fetch(`https://api.github.com/users/${name}`);
    let data = await response.json()
    return data;
}

getUserAsync('daviniathebridge')
.then(data => console.log(data))
.catch(error => console.log("hubo un error"+error));
*/
/*
class Persona {
    constructor (nombre, edad, profesion) {
        this.nombre = nombre;
        this.edad = edad;
        this.profesion = profesion;
    }
   
    nuevoN () {
        return this.nombre;
    }
   
    nuevoN (nombre) {
        this.nombre=nombre;
    }

    nuevoE () {
        return this.edad;
    }
   
    nuevoE (edad) {
        this.edad=edad;
    }

    dameINfo () {
        console.log("El nombre es " + this.name + " la edad " + this.edad + " y la profesión " + this.profesion);

    }
}

var persona1 = new Persona ("Jorge", 43, "profe");
var persona2 = new Persona ("Jose", 45, "profe");
console.log(persona1);

console.log(persona1.dameINfo());
// El nombre es undefined la edad 43 y la profesión profe

persona1.nuevoN("Fernando");

console.log(persona1.dameINfo());
// El nombre es Fernando la edad 43 y la profesión profe

localStorage.setItem("Profe", JSON.stringify(persona1));

var nuevo = JSON.parse(localStorage.getItem('Profe'));

console.log(nuevo);
// {nombre: 'Fernando', edad: 43, profesion: 'profe'}

var persona4 = new Persona (nuevo.nombre, nuevo.edad,nuevo.profesion);

console.log(nuevo.nombre);
// Fernando

console.log(persona4);
// Persona {nombre: 'Fernando', edad: 43, profesion: 'profe'}
*/