// ==========================
// Datos iniciales
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
// Renderizar carrito en DOM
// ==========================

const cargarCarrito = () => {
    const contCarrito = document.getElementById("carrito");
    if (!contCarrito) return; // evita errores si no existe el contenedor

    contCarrito.innerHTML = `<h2>Carrito</h2>`;
    let total = 0;

    // Mostrar cada producto
    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        const subtotal = item.precio * item.cantidadCarrito;

        div.innerHTML = `
            <span>${item.nombre} - Cantidad: ${item.cantidadCarrito} - $${subtotal}</span>
            <button data-index="${index}">Eliminar</button>
        `;

        contCarrito.appendChild(div);
        total += subtotal;
    });

    // Mostrar total y botón comprar si hay productos
    if (carrito.length > 0) {
        const divTotal = document.createElement("div");
        divTotal.classList.add("totalCarrito");
        divTotal.innerHTML = `
            <strong>Total: $${total}</strong>
            <button id="btnComprarTotal">Comprar</button>
        `;
        contCarrito.appendChild(divTotal);

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
    }

    // Botones eliminar productos
    contCarrito.querySelectorAll(".producto button").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = Number(e.target.dataset.index);
            const productoEliminado = carrito[index];

            Swal.fire({
                title: '¿Eliminar producto?',
                text: `¿Quieres eliminar 1 unidad de ${productoEliminado.nombre}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const juegoOriginal = juegos.find(j => j.id === productoEliminado.id);
                    if (juegoOriginal) juegoOriginal.cantidad++;

                    productoEliminado.cantidadCarrito--;
                    if (productoEliminado.cantidadCarrito === 0) {
                        carrito.splice(index, 1);
                    }

                    guardarLocal();
                    cargarCarrito();

                    Swal.fire({
                        title: 'Eliminado!',
                        text: `${productoEliminado.nombre} se eliminó del carrito.`,
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    });
};

// Inicializar
cargarCarrito();
