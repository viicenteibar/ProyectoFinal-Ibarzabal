const Cliente = function(nombre, edad, sueldo){
    this.nombre = nombre
    this.edad = edad
    this.sueldo = sueldo
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
    console.log("Cliente agregado exitosamente!")
    console.table(listaClientes)
}

function buscarClientes(){
    let palabraClave = prompt("Ingresa el nombre del cliente a buscar").trim().toUpperCase()
    let clienteBuscado = listaClientes.filter((x)=> x.nombre.toUpperCase().includes(palabraClave))

    if(clienteBuscado.length >0){
        console.table(clienteBuscado)
    }else{
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
    console.log("Préstamo aprobado!")
    console.table(listaPrestamos)
    alert(`Resumen del préstamo:
        Monto del préstamo: $${monto}
        Tasa de interés anual: ${interes}%
        Cantidad de cuotas: ${cuotas}
        Monto total a pagar: $${montoTotal}
        Monto por cuota: $${montoCuota}`)
}
