// Recuperar stock de juegos 

document.getElementById("resetStock").addEventListener("click", () => {
    // Volvemos a la cantidad inicial de cada juego
    juegos = [
        {id: 1, nombre: "PES", cantidad: 3, precio: 500},
        {id: 2, nombre: "PES2", cantidad: 1, precio: 700},
        {id: 3, nombre: "PES3", cantidad: 8, precio: 800},
        {id: 4, nombre: "PES4", cantidad: 5, precio: 900},
        {id: 5, nombre: "PES5", cantidad: 0, precio: 5100}
    ];

    carrito = []; // opcional: limpiar carrito
    guardarLocal();
    cargarDOM();
    cargarCarrito();
});


// inicializar

let juegos = JSON.parse(localStorage.getItem("juegos")) || [
    {id: 1, nombre: "PES", cantidad: 3, precio: 500},
    {id: 2, nombre: "PES2", cantidad: 1, precio: 700},
    {id: 3, nombre: "PES3", cantidad: 8, precio: 800},
    {id: 4, nombre: "PES4", cantidad: 5, precio: 900},
    {id: 5, nombre: "PES5", cantidad: 0, precio: 5100}
];

// Recuperar carrito del localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar cambios en LocalStorage
const guardarLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("juegos", JSON.stringify(juegos));
};

// Función principal para cargar productos
const cargarDOM = () => {
    const prods = document.getElementById("prods");
    prods.innerHTML = "";

    juegos.forEach(juego => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <span>ID: ${juego.id}</span>
            <h3>${juego.nombre}</h3>
            <span>Stock: ${juego.cantidad}</span>
            <span>Precio: $${juego.precio}</span>
            <button data-id="${juego.id}" class="${juego.cantidad === 0 ? 'agotado' : ''}" ${juego.cantidad === 0 ? 'disabled' : ''}>
                Agregar al Carrito
            </button>`;
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

                // Agregar al carrito o aumentar cantidadCarrito
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
                cargarCarrito();
            }
        });
    });
};

// Función para cargar carrito
const cargarCarrito = () => {
    const contCarrito = document.getElementById("carrito");
    contCarrito.innerHTML = `<h2>Carrito</h2>`;
    let total = 0;

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

    // Solo mostrar total y botón comprar si hay productos
    if (carrito.length > 0) {
        const divTotal = document.createElement("div");
        divTotal.classList.add("totalCarrito");
        divTotal.innerHTML = `
            <strong>Total: $${total}</strong>
            <button id="btnComprarTotal">Comprar</button>
        `;
        contCarrito.appendChild(divTotal);

        // Evento botón comprar
        document.getElementById("btnComprarTotal").addEventListener("click", () => {
            alert(`Compra realizada por $${total}`);
            carrito = [];
            guardarLocal();
            cargarDOM();
            cargarCarrito();
        });
    }

    // Botones eliminar de cada producto
    contCarrito.querySelectorAll(".producto button").forEach(btn => {
        btn.addEventListener("click", e => {
            const index = Number(e.target.dataset.index);
            const productoEliminado = carrito[index];
            const juegoOriginal = juegos.find(j => j.id === productoEliminado.id);

            // Devolver 1 unidad al stock
            if (juegoOriginal) juegoOriginal.cantidad++;

            // Reducir cantidadCarrito
            productoEliminado.cantidadCarrito--;
            if (productoEliminado.cantidadCarrito === 0) {
                carrito.splice(index, 1);
            }

            guardarLocal();
            cargarDOM();
            cargarCarrito();
        });
    });
};

// Inicialización
cargarDOM();
cargarCarrito();
