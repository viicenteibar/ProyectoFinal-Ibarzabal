// funcion para guardar clientes en el localstorage
function guardarClientesEnElLocalStorage(){
    localStorage.setItem('listaClientes', JSON.stringify(listaClientes))
}

//funcion para cargar clientes desde el localstorage
function cargarClientesDesdeLocalStorage(){
    const clientesGuardados = localStorage.getItem('listaClientes')
    if (clientesGuardados){
        const clientesParseados = JSON.parse(clientesGuardados)
        clientesParseados.forEach(clienteData=>{
            const cliente = new Cliente(clienteData.nombre, clienteData.dni, clienteData.sueldo)
            cliente.prestamos = clienteData.prestamos
            listaClientes.push(cliente)
        })
    }
}

// contructor para cliente
const Cliente = function(nombre, dni, sueldo){
    this.nombre = nombre
    this.dni = dni
    this.sueldo = sueldo
    this.prestamos = []
}

// contructor para prestamo
const Prestamo = function(monto, cuotas, interes, montoTotal, montoCuota){
    this.monto = monto
    this.cuotas = cuotas
    this.interes = interes
    this.montoTotal = montoTotal
    this.montoCuota = montoCuota
}

// arrays para almacenar los datos
const listaClientes = []
const listaPrestamos = []
const historialPrestamos = []

//cargar clientes desde el localstorage al iniciar
cargarClientesDesdeLocalStorage()

// funcion para agregar clientes
function agregarClientes(){
    const nombre = document.getElementById('nombre-cliente').value.trim().toUpperCase()
    const dni = parseInt(document.getElementById('dni-cliente').value)
    const sueldo = parseFloat(document.getElementById('sueldo-cliente').value)

    if(!nombre || isNaN(dni) || isNaN(sueldo)){
        alert("Por favor, complete todos los campos con valores válidos.")
        return
    }

    const clienteExistente = listaClientes.find(c=> c.dni === dni)
    if(clienteExistente){
        alert("Ya existe un cliente con este DNI.")
        return
    }

    const cliente = new Cliente(nombre, dni, sueldo)
    listaClientes.push(cliente)
    guardarClientesEnElLocalStorage()
    alert("Cliente agregado exitosamente.")
}

// funcion para buscar clientes por dni
function buscarClientes(){
    const dni = parseInt(document.getElementById('buscar-dni').value)

    if(isNaN(dni)){
        alert("Por favor, ingrese un DNI válido.")
        return
    }

    const clienteBuscado = listaClientes.find(c=> c.dni === dni)
    const resultadoDiv = document.getElementById('resultado-contenido')

    if (clienteBuscado) {
        resultadoDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${clienteBuscado.nombre}</p>
        <p><strong>DNI:</strong> ${clienteBuscado.dni}</p>
        <p><strong>Sueldo:</strong> $${clienteBuscado.sueldo}</p>
        <p><strong>Préstamos:</strong> ${clienteBuscado.prestamos.length}</p>
        `
    } else {
        resultadoDiv.innerHTML = `<p>No se encontró un cliente con ese DNI.</p>`
    }
    document.getElementById('resultados').style.display = 'block'
}

// funcion para solicitar un prestamo
function solicitarPrestamo(){
    const dni = parseInt(document.getElementById('dni').value)
    const cliente = listaClientes.find(c => c.dni === dni)

    if (!cliente){
        alert("Cliente no encontrado. Por favor, registrese primero.")
        return
    }

    // confirmacion para verificar si es la persona correcta
    const confirmacion = confirm(`¿Es usted ${cliente.nombre} con DNI ${cliente.dni}?`)
    if(!confirmacion){
        alert("Operación cancelada.")
        return
    }

    const monto = parseFloat(document.getElementById('monto').value)
    const cuotas = parseInt(document.getElementById('cuotas').value)
    const interes = parseFloat(document.getElementById('interes').value)

    if(isNaN(monto) || isNaN(cuotas) || isNaN(interes) || monto <= 0 || cuotas <= 0 || interes <= 0){
        alert("Por favor, complete todos los campos con valores válidos.")
        return
    }

    const montoTotal = (monto + (monto * (interes / 100))).toFixed(2)
    const montoCuota = (montoTotal / cuotas).toFixed(2)

    const prestamo = new Prestamo(monto, cuotas, interes, montoTotal, montoCuota)
    listaPrestamos.push(prestamo)
    cliente.prestamos.push(prestamo)

    guardarClientesEnElLocalStorage()

    // mostrar los resultados del prestamo en el contenedor
    const prestamoContenido = document.getElementById('prestamo-contenido')
    prestamoContenido.innerHTML = `
        <p><strong>Monto:</strong> $${monto}</p>
        <p><strong>Cuotas:</strong> ${cuotas}</p>
        <p><strong>Interés:</strong> ${interes}%</p>
        <p><strong>Monto Total a Pagar:</strong> $${montoTotal}</p>
        <p><strong>Monto por Cuota:</strong> $${montoCuota}</p>
        `
    document.getElementById('resultado-prestamo').style.display = 'block'
}

// manejadores de eventos para los botones
document.getElementById('btn-agregar-cliente').addEventListener('click', agregarClientes)
document.getElementById('btn-buscar-cliente').addEventListener('click', buscarClientes)
document.getElementById('btn-solicitar-prestamo').addEventListener('click', solicitarPrestamo)

// botones para cerrar
document.getElementById('btn-cerrar-resultados').addEventListener('click', function(){
    document.getElementById('resultados').style.display = 'none'
})
document.getElementById('btn-cerrar-prestamo').addEventListener('click', function(){
    document.getElementById('resultado-prestamo').style.display = 'none'
})