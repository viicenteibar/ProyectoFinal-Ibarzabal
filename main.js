// funcion para guardar clientes en el localstorage
function guardarClientesEnElLocalStorage() {
    localStorage.setItem('listaClientes', JSON.stringify(listaClientes))
}

// funcion para cargar clientes desde el localstorage
function cargarClientesDesdeLocalStorage() {
    const clientesGuardados = localStorage.getItem('listaClientes');
    if (clientesGuardados) {
        const clientesParseados = JSON.parse(clientesGuardados);
        clientesParseados.forEach(clienteData => {
            const cliente = new Cliente(clienteData.nombre, clienteData.dni, clienteData.sueldo);
            cliente.prestamos = clienteData.prestamos || []; // asegúrate de inicializar los préstamos
            listaClientes.push(cliente);
        });
    }
}

// contructor para cliente
const Cliente = function(nombre, dni, sueldo) {
    this.nombre = nombre
    this.dni = dni
    this.sueldo = sueldo
    this.prestamos = []
}

// contructor para prestamo
const Prestamo = function(monto, cuotas, interes, montoTotal, montoCuota) {
    this.monto = monto
    this.cuotas = cuotas
    this.interes = interes;
    this.montoTotal = montoTotal;
    this.montoCuota = montoCuota;
}

// arrays para almacenar los datos
const listaClientes = [];
const listaPrestamos = [];
const historialPrestamos = [];

// cargar clientes desde el localstorage al iniciar
cargarClientesDesdeLocalStorage();

// funcion para agregar clientes
function agregarClientes() {
    const nombre = document.getElementById('nombre-cliente').value.trim().toUpperCase();
    const dni = parseInt(document.getElementById('dni-cliente').value);
    const sueldo = parseFloat(document.getElementById('sueldo-cliente').value);

    if (!nombre || isNaN(dni) || isNaN(sueldo)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos correctamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const clienteExistente = listaClientes.find(c => c.dni === dni);
    if (clienteExistente) {
        Swal.fire({
            title: 'Error',
            text: 'Ya existe un cliente con este DNI.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const cliente = new Cliente(nombre, dni, sueldo);
    listaClientes.push(cliente);
    guardarClientesEnElLocalStorage();

    Swal.fire({
        title: 'Éxito',
        text: 'Cliente agregado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
    });

    // limpiar el formulario
    document.getElementById('nombre-cliente').value = '';
    document.getElementById('dni-cliente').value = '';
    document.getElementById('sueldo-cliente').value = '';
}

// funcion para buscar clientes por dni
function buscarClientes() {
    const dni = parseInt(document.getElementById('buscar-dni').value);

    if (isNaN(dni)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un DNI válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    // buscar al cliente por su dni
    const clienteBuscado = listaClientes.find(c => c.dni === dni);
    const resultadoDiv = document.getElementById('resultado-contenido');

    if (clienteBuscado) {
        // mostrar los datos del cliente
        let prestamosHTML = '';
        let tablaCuotasHTML = '';

        if (clienteBuscado.prestamos.length > 0) {
            // sumatoria de las cuotas por mes
            const maxMeses = Math.max(...clienteBuscado.prestamos.map(p => p.cuotas));
            const cuotasPorMes = Array(maxMeses).fill(0);

            clienteBuscado.prestamos.forEach(prestamo => {
                const cuotaMensual = parseFloat(prestamo.montoCuota);
                for (let mes = 0; mes < prestamo.cuotas; mes++) {
                    cuotasPorMes[mes] += cuotaMensual;
                }
            });

            // tabla con los totales por mes
            tablaCuotasHTML = `
                <h3>Sumatoria de Cuotas por Mes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mes</th>
                            <th>Total a Pagar</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            cuotasPorMes.forEach((total, index) => {
                tablaCuotasHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>
                `;
            });

            tablaCuotasHTML += `
                    </tbody>
                </table>
            `;

            // tabla de préstamos
            prestamosHTML = `
                <p><strong>Préstamos:</strong> ${clienteBuscado.prestamos.length}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Monto</th>
                            <th>Cuotas</th>
                            <th>Interés</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            clienteBuscado.prestamos.forEach(prestamo => {
                prestamosHTML += `
                    <tr>
                        <td>$${prestamo.monto}</td>
                        <td>${prestamo.cuotas}</td>
                        <td>${(prestamo.interes * 100).toFixed(2)}%</td>
                        <td>$${prestamo.montoTotal}</td>
                    </tr>
                `;
            });

            prestamosHTML += `
                    </tbody>
                </table>
            `;
        } else {
            prestamosHTML = '<p><strong>Préstamos:</strong> No tiene préstamos asociados.</p>';
        }

        // datos del cliente y las tablas
        resultadoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${clienteBuscado.nombre}</p>
            <p><strong>DNI:</strong> ${clienteBuscado.dni}</p>
            <p><strong>Sueldo:</strong> $${clienteBuscado.sueldo}</p>
            ${prestamosHTML}
            ${tablaCuotasHTML}
        `;

        Swal.fire({
            title: 'Cliente Encontrado',
            text: 'Los datos del cliente se han cargado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });

        document.getElementById('resultados').style.display = 'block';
    } else {
        resultadoDiv.innerHTML = `<p>No se encontró un cliente con ese DNI.</p>`;
        Swal.fire({
            title: 'No Encontrado',
            text: 'No se encontró un cliente con ese DNI.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
    }
    document.getElementById('buscar-dni').value = '';
}

// funcion solitiar prestamo segun metodo
function calcularPrestamoPorMetodo() {
    const dni = parseInt(document.getElementById('dni').value);
    const cliente = listaClientes.find(c => c.dni === dni);

    if (!cliente) {
        Swal.fire({
            title: 'No Encontrado',
            text: 'Cliente no encontrado. Por favor, registrese primero.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const monto = parseFloat(document.getElementById('monto').value);
    const cuotas = parseInt(document.getElementById('cuotas').value);
    const metodo = document.getElementById('metodo').value;

    if (isNaN(monto) || isNaN(cuotas) || monto <= 0 || cuotas <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, complete todos los campos con valores válidos.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    let tablaAmortizacion;
    switch (metodo) {
        case "frances":
            tablaAmortizacion = calcularMetodoFrances(monto, cuotas);
            break;
        case "aleman":
            tablaAmortizacion = calcularMetodoAleman(monto, cuotas);
            break;
        case "americano":
            tablaAmortizacion = calcularMetodoAmericano(monto, cuotas);
            break;
        default:
            Swal.fire({
                title: 'Error',
                text: 'Método de amortización no válido.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
    }

    const interes = 0.05;
    const montoTotal = tablaAmortizacion.reduce((acc, fila) => acc + parseFloat(fila.capital) + parseFloat(fila.interes), 0);
    const montoCuota = montoTotal / cuotas;

    const prestamo = new Prestamo(monto, cuotas, interes, montoTotal.toFixed(2), montoCuota.toFixed(2));
    cliente.prestamos.push(prestamo);

    guardarClientesEnElLocalStorage();

    Swal.fire({
        title: 'Éxito',
        text: 'Préstamo solicitado exitosamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
    });

    mostrarTablaAmortizacion(tablaAmortizacion);

    document.getElementById('dni').value = '';
    document.getElementById('monto').value = '';
}

// metodo frances
function calcularMetodoFrances(monto, cuotas){
    const tasaMensual = 0.05
    const cuotaMensual = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -cuotas))
    let saldo = monto
    const tabla = []

    for (let i = 1; i <= cuotas; i++){
        const interes = saldo * tasaMensual
        const capital = cuotaMensual - interes
        saldo -= capital

        tabla.push({
            cuota: i,
            capital: capital.toFixed(2),
            interes: interes.toFixed(2),
            saldo: saldo.toFixed(2),
        })
    }
    return tabla
}

// metodo aleman
function calcularMetodoAleman(monto, cuotas){
    const tasaMensual = 0.05
    const amortizacion = monto / cuotas
    let saldo = monto
    const tabla = []

    for (let i = 1; i <= cuotas; i++){
        const interes = saldo * tasaMensual
        const cuota = amortizacion + interes
        saldo -= amortizacion

        tabla.push({
            cuota: i,
            capital: amortizacion.toFixed(2),
            interes: interes.toFixed(2),
            saldo: saldo.toFixed(2),
        })
    }
    return tabla
}

// metodo americano
function calcularMetodoAmericano(monto, cuotas){
    const tasaMensual = 0.05
    const interesMensual = monto * tasaMensual
    const tabla = []

    for (let i = 1; i <= cuotas; i++){
        const capital = i === cuotas ? monto : 0
        const cuota = capital + interesMensual

        tabla.push({
            cuota: i,
            capital: capital.toFixed(2),
            interes: interesMensual.toFixed(2),
            saldo: i === cuotas ? 0 : monto,
        })
    }
    return tabla
}

// mostrar la tabla de amortizacion
function mostrarTablaAmortizacion(tabla){
    const tablaContenido = document.getElementById('prestamo-contenido')
    tablaContenido.innerHTML = `
        <h3>Tabla de Amortización</h3>
        <table>
            <thead>
                <tr>
                    <th>Cuota</th>
                    <th>Capital</th>
                    <th>Interés</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                ${tabla.map(fila => `
                    <tr>
                        <td>${fila.cuota}</td>
                        <td>${fila.capital}</td>
                        <td>${fila.interes}</td>
                        <td>${fila.saldo}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `
    document.getElementById('resultado-prestamo').style.display = 'block'
}

// funcion para eliminar cliente
function eliminarCliente() {
    const dni = parseInt(document.getElementById('dni-eliminar').value);

    if (isNaN(dni)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un DNI válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const clienteIndex = listaClientes.findIndex(c => c.dni === dni);
    if (clienteIndex === -1) {
        Swal.fire({
            title: 'No Encontrado',
            text: 'No se encontró un cliente con ese DNI.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    // confirmar eliminacion
    Swal.fire({
        title: `¿Está seguro que quieres eliminar a ${listaClientes[clienteIndex].nombre}?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            listaClientes.splice(clienteIndex, 1);
            guardarClientesEnElLocalStorage();

            Swal.fire({
                title: 'Eliminado',
                text: 'El cliente ha sido eliminado exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        }
    });
}

// funcion para modificar cliente
function modificarCliente() {
    const dni = parseInt(document.getElementById('dni-modificar').value);

    if (isNaN(dni)) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingrese un DNI válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const cliente = listaClientes.find(c => c.dni === dni);
    if (!cliente) {
        Swal.fire({
            title: 'No Encontrado',
            text: 'No se encontró un cliente con ese DNI.',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    // mostrar los datos actuales del cliente y que quiere modificar
    Swal.fire({
        title: 'Cliente Encontrado',
        html: `
            <p><strong>DNI:</strong> ${cliente.dni}</p>
            <p><strong>Nombre:</strong> ${cliente.nombre}</p>
            <p><strong>Sueldo:</strong> $${cliente.sueldo.toFixed(2)}</p>
            <p>¿Qué desea modificar?</p>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: {
            nombre: 'Nombre',
            sueldo: 'Sueldo',
            dni: 'DNI',
            completo: 'Modificar Todo',
        },
        inputPlaceholder: 'Seleccione una opción',
    }).then((result) => {
        if (result.isConfirmed) {
            const opcion = result.value;

            switch (opcion) {
                case 'nombre':
                    modificarNombre(cliente);
                    break;
                case 'sueldo':
                    modificarSueldo(cliente);
                    break;
                case 'dni':
                    modificarDni(cliente);
                    break;
                case 'completo':
                    modificarTodo(cliente);
                    break;
                default:
                    Swal.fire({
                        title: 'Cancelado',
                        text: 'No se realizó ninguna modificación.',
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                    });
            }
        }
    });
}

// funcion para modificar el nombre
function modificarNombre(cliente) {
    Swal.fire({
        title: 'Modificar Nombre',
        input: 'text',
        inputLabel: 'Nuevo Nombre',
        inputValue: cliente.nombre,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            cliente.nombre = result.value.trim().toUpperCase();
            guardarClientesEnElLocalStorage();
            Swal.fire({
                title: 'Éxito',
                text: 'El nombre ha sido actualizado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        }
    });
}

// funcion para modificar el sueldo
function modificarSueldo(cliente) {
    Swal.fire({
        title: 'Modificar Sueldo',
        input: 'number',
        inputLabel: 'Nuevo Sueldo',
        inputValue: cliente.sueldo,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            cliente.sueldo = parseFloat(result.value);
            guardarClientesEnElLocalStorage();
            Swal.fire({
                title: 'Éxito',
                text: 'El sueldo ha sido actualizado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        }
    });
}

// funcion para modificar el dni
function modificarDni(cliente) {
    Swal.fire({
        title: 'Modificar DNI',
        input: 'number',
        inputLabel: 'Nuevo DNI',
        inputValue: cliente.dni,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            const nuevoDni = parseInt(result.value);
            const clienteExistente = listaClientes.find(c => c.dni === nuevoDni && c !== cliente);

            if (clienteExistente) {
                Swal.fire({
                    title: 'Error',
                    text: 'El nuevo DNI ya está asociado a otro cliente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                cliente.dni = nuevoDni;
                guardarClientesEnElLocalStorage();
                Swal.fire({
                    title: 'Éxito',
                    text: 'El DNI ha sido actualizado.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
            }
        }
    });
}

// funcion para modificar todo
function modificarTodo(cliente) {
    Swal.fire({
        title: 'Modificar Cliente',
        html: `
            <label for="nuevo-nombre">Nombre:</label>
            <input id="nuevo-nombre" class="swal2-input" value="${cliente.nombre}">
            <label for="nuevo-sueldo">Sueldo:</label>
            <input id="nuevo-sueldo" type="number" class="swal2-input" value="${cliente.sueldo}">
            <label for="nuevo-dni">DNI:</label>
            <input id="nuevo-dni" type="number" class="swal2-input" value="${cliente.dni}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nuevoNombre = document.getElementById('nuevo-nombre').value.trim().toUpperCase();
            const nuevoSueldo = parseFloat(document.getElementById('nuevo-sueldo').value);
            const nuevoDni = parseInt(document.getElementById('nuevo-dni').value);

            if (!nuevoNombre || isNaN(nuevoSueldo) || isNaN(nuevoDni)) {
                Swal.showValidationMessage('Por favor, complete todos los campos correctamente.');
                return false;
            }

            const clienteExistente = listaClientes.find(c => c.dni === nuevoDni && c !== cliente);
            if (clienteExistente) {
                Swal.showValidationMessage('El nuevo DNI ya está asociado a otro cliente.');
                return false;
            }

            return { nuevoNombre, nuevoSueldo, nuevoDni };
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const { nuevoNombre, nuevoSueldo, nuevoDni } = result.value;
            cliente.nombre = nuevoNombre;
            cliente.sueldo = nuevoSueldo;
            cliente.dni = nuevoDni;

            guardarClientesEnElLocalStorage();
            Swal.fire({
                title: 'Éxito',
                text: 'Los datos del cliente han sido actualizados.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        }
    });
}

// mostrar el formulario correspondiente
function mostrarFormulario(formularioId) {
    // ocultar todos los formularios
    document.getElementById('form-agregar-cliente').style.display = 'none';
    document.getElementById('form-modificar-cliente').style.display = 'none';
    document.getElementById('form-eliminar-cliente').style.display = 'none';

    // mostrar el formulario seleccionado
    document.getElementById(formularioId).style.display = 'block';
}

// eventos para los botones principales
document.getElementById('btn-agregar-cliente').addEventListener('click', function () {
    mostrarFormulario('form-agregar-cliente');
});

document.getElementById('btn-modificar-cliente').addEventListener('click', function () {
    mostrarFormulario('form-modificar-cliente');
});

document.getElementById('btn-eliminar-cliente').addEventListener('click', function () {
    mostrarFormulario('form-eliminar-cliente');
});

// eventos para confirmar las acciones
document.getElementById('btn-confirmar-agregar').addEventListener('click', agregarClientes);
document.getElementById('btn-confirmar-modificar').addEventListener('click', modificarCliente);
document.getElementById('btn-confirmar-eliminar').addEventListener('click', eliminarCliente);

// manejadores de eventos para los botones
document.getElementById('btn-buscar-cliente').addEventListener('click', buscarClientes);
document.getElementById('btn-solicitar-prestamo').addEventListener('click', calcularPrestamoPorMetodo);

// botones para cerrar
document.getElementById('btn-cerrar-resultados').addEventListener('click', function(){
    document.getElementById('resultados').style.display = 'none'
})
document.getElementById('btn-cerrar-prestamo').addEventListener('click', function(){
    document.getElementById('resultado-prestamo').style.display = 'none'
})