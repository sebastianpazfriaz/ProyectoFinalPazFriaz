// ==========================
// Inicialización
// ==========================

let juegos = []; // se llenará desde JSON o LocalStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==========================
// Guardar LocalStorage
// ==========================

const guardarLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("juegos", JSON.stringify(juegos));
};

// ==========================
// Cargar juegos desde JSON / LocalStorage
// ==========================

const cargarJuegos = () => {
    fetch("juegos.json")
        .then(res => res.json())
        .then(data => {
            const juegosGuardados = JSON.parse(localStorage.getItem("juegos"));
            juegos = juegosGuardados || data;

            guardarLocal();
            cargarDOM();
        })
        .catch(err => console.error("Error al cargar juegos.json:", err));
};

// ==========================
// Función para cargar productos en DOM
// ==========================

const cargarDOM = () => {
    const prods = document.getElementById("prods");
    if (!prods) return;

    prods.innerHTML = "";

    juegos.forEach(juego => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${juego.imagen}" alt="${juego.nombre}" class="img-juego">
            <span>ID: ${juego.id}</span>
            <h3>${juego.nombre}</h3>
            <span>Stock: ${juego.cantidad}</span>
            <span>Precio: $${juego.precio}</span>
            <button data-id="${juego.id}" class="${juego.cantidad === 0 ? 'agotado' : ''}" ${juego.cantidad === 0 ? 'disabled' : ''}>
                Agregar al Carrito
            </button>
        `;

        prods.appendChild(div);
    });

    // Eventos de botones Comprar
    document.querySelectorAll(".card button").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = Number(e.target.dataset.id);
            const juegoSeleccionado = juegos.find(j => j.id === id);

            if (juegoSeleccionado && juegoSeleccionado.cantidad > 0) {
                // Disminuir stock
                juegoSeleccionado.cantidad--;

                // Agregar al carrito o aumentar cantidad
                const itemCarrito = carrito.find(item => item.id === id);
                if (itemCarrito) {
                    itemCarrito.cantidadCarrito++;
                } else {
                    carrito.push({
                        id: juegoSeleccionado.id,
                        nombre: juegoSeleccionado.nombre,
                        precio: juegoSeleccionado.precio,
                        cantidadCarrito: 1
                    });
                }

                guardarLocal();
                cargarDOM();
                if (typeof cargarCarrito === "function") cargarCarrito();

                // 🚀 Notificación con Toastify
                Toastify({
                    text: `${juegoSeleccionado.nombre} agregado al carrito ✅`,
                    duration: 2500,
                    gravity: "top",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)"
                    }
                }).showToast();
            }
        });
    });
};

// ==========================
// Botón reiniciar stock
// ==========================

document.getElementById("resetStock").addEventListener("click", () => {
    fetch("juegos.json")
      .then(res => res.json())
      .then(data => {
        juegos = data;
        carrito = [];
        guardarLocal();
        cargarDOM();
        if (typeof cargarCarrito === "function") cargarCarrito();
      })
      .catch(err => console.error("Error al reiniciar stock desde JSON:", err));
});

// ==========================
// Inicialización
// ==========================

cargarJuegos();
