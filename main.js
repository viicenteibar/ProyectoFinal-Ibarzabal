// Variables globales
let montoPrestamo;
let tasaInteres;
let cantidadCuotas;
let montoTotal;
let montoCuota;

// Función de validación
const validarEntrada = (input) => {
    return !isNaN(input) && input > 0;  // verifico si el valor ingresado es un número mayor que 0
}

// Ciclo para interactuar con el usuario y obtener los datos
do {
    montoPrestamo = parseFloat(prompt("Ingrese el monto del préstamo:"));
    if (!validarEntrada(montoPrestamo)) {
        alert("Por favor, ingrese un monto válido mayor a 0.");
    }
} while (!validarEntrada(montoPrestamo));

do {
    tasaInteres = parseFloat(prompt("Ingrese la tasa de interés anual (en porcentaje):"));
    if (!validarEntrada(tasaInteres)) {
        alert("Por favor, ingrese una tasa de interés válida mayor a 0.");
    }
} while (!validarEntrada(tasaInteres));

do {
    cantidadCuotas = parseInt(prompt("Ingrese la cantidad de cuotas del préstamo:"));
    if (!validarEntrada(cantidadCuotas) || cantidadCuotas < 1) {
        alert("Por favor, ingrese una cantidad de cuotas válida mayor a 0.");
    }
} while (!validarEntrada(cantidadCuotas) || cantidadCuotas < 1);

// Función para calcular el monto total y las cuotas
const calcularPrestamo = () => {
    // Calculando el monto total (con interés simple)
    montoTotal = montoPrestamo + (montoPrestamo * (tasaInteres / 100));  // Monto total con tasa de interés
    montoCuota = montoTotal / cantidadCuotas;  // Monto por cuota

    return {
        montoTotal: montoTotal.toFixed(2),
        montoCuota: montoCuota.toFixed(2)
    };
}

// Mostrar el resultado en pantalla con alert
const resultado = calcularPrestamo();
alert(`Resumen del préstamo:
Monto del préstamo: $${montoPrestamo.toFixed(2)}
Tasa de interés anual: ${tasaInteres}%
Cantidad de cuotas: ${cantidadCuotas}
Monto total a pagar: $${resultado.montoTotal}
Monto por cuota: $${resultado.montoCuota}`);
