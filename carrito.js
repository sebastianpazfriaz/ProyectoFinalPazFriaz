
// Inicialización

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let juegos = JSON.parse(localStorage.getItem("juegos")) || [];


// Guardar LocalStorage

const guardarLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("juegos", JSON.stringify(juegos));
};


// Cargar carrito en DOM

const cargarCarrito = () => {
    const contenedor = document.getElementById("productos-container");
    const totalCont = document.getElementById("total-container");
    const formCompra = document.getElementById("formularioCompra");

    if (!contenedor || !totalCont || !formCompra) return;

    contenedor.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidadCarrito;
        total += subtotal;

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-juego">
            <div class="info">
                <h4>${producto.nombre}</h4>
                <span>Cantidad: ${producto.cantidadCarrito}</span>
                <span>Subtotal: $${subtotal}</span>
            </div>
            <button data-index="${index}">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });

    // Mostrar total
    if (carrito.length > 0) {
        totalCont.innerHTML = `<strong>Total: $${total}</strong>`;
        formCompra.style.display = "block"; // Mostrar formulario si hay productos
    } else {
        totalCont.innerHTML = "<p>El carrito está vacío</p>";
        formCompra.style.display = "none"; // Ocultar formulario si no hay productos
    }

    // Eliminar productos
    contenedor.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", async e => {
            const index = Number(e.target.dataset.index);
            const producto = carrito[index];
            const juegoOriginal = juegos.find(j => j.id === producto.id);
            if (!producto || !juegoOriginal) return;

            if (producto.cantidadCarrito > 1) {
                const { value: cantidadEliminar } = await Swal.fire({
                    title: `Eliminar ${producto.nombre}`,
                    input: 'number',
                    inputLabel: 'Cantidad a eliminar',
                    inputAttributes: {
                        min: 1,
                        max: producto.cantidadCarrito,
                        step: 1
                    },
                    inputValue: 1,
                    showCancelButton: true
                });

                if (cantidadEliminar) {
                    juegoOriginal.cantidad += Number(cantidadEliminar);
                    producto.cantidadCarrito -= Number(cantidadEliminar);
                    if (producto.cantidadCarrito === 0) carrito.splice(index, 1);
                    guardarLocal();
                    cargarCarrito();
                }

            } else {
                juegoOriginal.cantidad += 1;
                carrito.splice(index, 1);
                guardarLocal();
                cargarCarrito();
            }
        });
    });
};


// Vaciar carrito completo

const vaciarCarrito = () => {
    carrito.forEach(p => {
        const juegoOriginal = juegos.find(j => j.id === p.id);
        if (juegoOriginal) juegoOriginal.cantidad += p.cantidadCarrito;
    });
    carrito = [];
    guardarLocal();
    cargarCarrito();
};


// Evento vaciar carrito


document.getElementById("btnVaciarCarrito").addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'No hay productos para vaciar.',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    Swal.fire({
        title: '¿Vaciar todo el carrito?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, vaciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito();
            Swal.fire({
                icon: 'success',
                title: 'Carrito vaciado',
                timer: 1300,
                showConfirmButton: false
            });
        }
    });
});

// ==========================
// Manejar formulario de compra
// ==========================
const formCompra = document.getElementById("compraForm");
formCompra.addEventListener("submit", (e) => {
    e.preventDefault();

    if (carrito.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Carrito vacío",
            text: "Agrega productos antes de finalizar la compra"
        });
        return;
    }

    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const metodoPago = document.getElementById("metodoPago").value;

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidadCarrito, 0);

    Swal.fire({
        title: `Confirmar compra`,
        html: `
            <p>Nombre: ${nombre} ${apellido}</p>
            <p>Correo: ${correo}</p>
            <p>Método de pago: ${metodoPago}</p>
            <p>Total a pagar: $${total}</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            guardarLocal();
            cargarCarrito();
            formCompra.reset();

            Swal.fire({
                title: "Compra realizada",
                text: `Gracias por tu compra de $${total}`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
});

// Inicializar

cargarCarrito();
