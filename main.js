const Cliente = function(nombre, edad, sueldo){
    this.nombre = nombre
    this.edad = edad
    this.sueldo = sueldo
    this.prestamos = []
}
const listaClientes = []

const Prestamo = function(monto, cuotas, interes, montoTotal, montoCuota){
    this.monto = monto
    this.cuotas = cuotas
    this.interes = interes
    this.montoTotal = montoTotal
    this.montoCuota = montoCuota
}
const listaPrestamos = []
const historialPrestamos = []

function agregarClientes(){
    let nombre = prompt("Ingrese su nombre").trim().toUpperCase()
    let edad = parseInt(prompt("Ingrese su edad"))
    let sueldo = parseFloat(prompt("Ingrese su sueldo"))

    if (nombre === "" || isNaN(edad) || isNaN(sueldo)){
        alert("Por favor ingrese datos válidos!")
        return
    }

    let cliente = new Cliente(nombre, edad, sueldo)
    listaClientes.push(cliente)
    alert("Cliente agregado exitosamente!")

    // Construimos la tabla en formato de texto para el alert
    let mensaje = "Lista de Clientes:\n\n"
    listaClientes.forEach(cliente => {
        mensaje += `Nombre: ${cliente.nombre}\n`
        mensaje += `Edad: ${cliente.edad}\n`
        mensaje += `Sueldo: $${cliente.sueldo}\n`
        mensaje += `Préstamos: ${cliente.prestamos.length}\n`
        mensaje += "-------------------\n"
    });

    alert(mensaje)
}


function buscarClientes(){
    let palabraClave = prompt("Ingresa el nombre del cliente a buscar").trim().toUpperCase()
    let clienteBuscado = listaClientes.filter((x)=> x.nombre.toUpperCase().includes(palabraClave))

    if(clienteBuscado.length > 0){
        let mensaje = "Clientes encontrados:\n\n"
        clienteBuscado.forEach(c => {
            mensaje += `Nombre: ${c.nombre}\n`
            mensaje += `Edad: ${c.edad}\n`
            mensaje += `Sueldo: $${c.sueldo}\n`
            mensaje += `Cantidad de préstamos: ${c.prestamos.length}\n`
            mensaje += "-------------------\n"
        });

        alert(mensaje)
    } else {
        alert("No se encontraron coincidencias en la base!")
    }
}


function solicitarPrestamo(){
    let nombre = prompt("Ingrese su nombre").trim()
    let cliente = listaClientes.find(c => c.nombre.toLowerCase() === nombre.toLowerCase())

    if (!cliente){
        alert("Cliente no encontrado. Por favor, registrese primero")
        return
    }

    let monto = parseFloat(prompt("Ingrese el monto del préstamo:"))
    let cuotas = parseInt(prompt("Ingrese la cantidad de cuotas:"))

    if (isNaN(monto) || isNaN(cuotas) || monto <= 0 || cuotas <= 0){
        alert("Datos inválidos. Intente nuevamente.")
        return
    }

    let interes = parseFloat(prompt("Ingrese el interes anual (en porcentaje):"))

    if (isNaN(interes) || interes <= 0){
        alert("Por favor, ingrese una tasa de interés válida mayor a 0.")
        return
    }

    let montoTotal = (monto + (monto * (interes / 100))).toFixed(2)
    let montoCuota = (montoTotal / cuotas).toFixed(2)

    let prestamo = new Prestamo(monto, cuotas, interes, montoTotal, montoCuota)
    listaPrestamos.push(prestamo)
    cliente.prestamos.push(prestamo)

    let clienteHistorial = historialPrestamos.find(h => h.nombre.toLowerCase() === nombre.toLocaleLowerCase())

    if (clienteHistorial){
        clienteHistorial.cantidad += 1
    } else{
        historialPrestamos.push({nombre: nombre.toUpperCase(), cantidad: 1})
    }

    console.log("Préstamo aprobado!")
    console.table(listaPrestamos)
    console.table(historialPrestamos)

    alert(`Resumen del préstamo:
        Monto del préstamo: $${monto}
        Cantidad de cuotas: ${cuotas}
        Tasa de interés anual: ${interes}%
        Monto total a pagar: $${montoTotal}
        Monto por cuota: $${montoCuota}`)
}

function iniciarSimulacion(){
    let opcion;
    do {
        opcion = prompt(
            "Bienvenido al sistema de clientes. Seleccione una opción:\n" +
            "1. Agregar cliente\n" +
            "2. Buscar cliente\n" +
            "3. Solicitar préstamo\n" +
            "4. Salir"
        );

        switch (opcion) {
            case "1":
                agregarClientes()
                break
            case "2":
                buscarClientes()
                break
            case "3":
                solicitarPrestamo()
                break
            case "4":
                alert("Gracias por utilizar nuestro sistema!")
                break
            default:
                alert("Opción inválida. Intente nuevamente.")
                break
        }
    } while (opcion !== "4");
}

iniciarSimulacion();