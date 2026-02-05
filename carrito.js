// ==========================
// Inicialización
// ==========================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let juegos = JSON.parse(localStorage.getItem("juegos")) || [];

// ==========================
// Guardar LocalStorage
// ==========================

const guardarLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("juegos", JSON.stringify(juegos));
};

// ==========================
// Cargar carrito en DOM
// ==========================

const cargarCarrito = () => {
    const contProductos = document.getElementById("productos-container");
    const contTotal = document.getElementById("total-container");

    if (!contProductos || !contTotal) return;

    contProductos.innerHTML = "";
    contTotal.innerHTML = "";

    // Si el carrito está vacío
    if (carrito.length === 0) {
        contProductos.innerHTML = `
            <p>Tu carrito está vacío 😢</p>
        `;
        return;
    }

    let total = 0;

    // Mostrar productos
    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidadCarrito;
        total += subtotal;

        const div = document.createElement("div");
        div.classList.add("producto-card");
        div.innerHTML = `
            <img src="${juegos.find(j => j.id === item.id)?.imagen || ''}" 
                 alt="${item.nombre}" class="img-carrito">
            <div class="info">
                <h4>${item.nombre}</h4>
                <p>Cantidad: ${item.cantidadCarrito}</p>
                <p>Subtotal: $${subtotal}</p>
            </div>
            <button data-index="${index}">Eliminar</button>
        `;
        contProductos.appendChild(div);
    });

    // Total y botón comprar
    contTotal.innerHTML = `
        <strong>Total: $${total}</strong>
        <button id="btnComprarTotal">Comprar</button>
    `;

    // Comprar carrito
    document.getElementById("btnComprarTotal").addEventListener("click", () => {
        Swal.fire({
            title: '¿Confirmar compra?',
            text: `El total es $${total}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, comprar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                guardarLocal();
                cargarCarrito();

                Swal.fire({
                    title: 'Compra realizada!',
                    text: `Gracias por tu compra de $${total}`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    });

    // Eliminar unidades
    contProductos.querySelectorAll(".producto-card button").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = Number(e.target.dataset.index);
            const producto = carrito[index];

            Swal.fire({
                title: `Eliminar ${producto.nombre}`,
                text: `Tienes ${producto.cantidadCarrito} unidad(es) en el carrito. ¿Cuántas quieres eliminar?`,
                input: 'number',
                inputAttributes: {
                    min: 1,
                    max: producto.cantidadCarrito,
                    step: 1
                },
                inputValue: 1,
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    let cantidadEliminar = Number(result.value);
                    if (cantidadEliminar < 1 || cantidadEliminar > producto.cantidadCarrito) {
                        cantidadEliminar = 1;
                    }

                    // Aumentar stock original
                    const juegoOriginal = juegos.find(j => j.id === producto.id);
                    if (juegoOriginal) juegoOriginal.cantidad += cantidadEliminar;

                    // Reducir cantidad en carrito
                    producto.cantidadCarrito -= cantidadEliminar;
                    if (producto.cantidadCarrito <= 0) {
                        carrito.splice(index, 1);
                    }

                    guardarLocal();
                    cargarCarrito();

                    Swal.fire({
                        title: 'Producto actualizado',
                        text: `${producto.nombre} reducido en ${cantidadEliminar} unidad(es).`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    });
};

// ==========================
// Inicializar
// ==========================

cargarCarrito();
