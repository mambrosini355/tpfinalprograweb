
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(precio);
}


const productos = [
    {
        id: 1,
        nombre: "Escritorio elevable",
        precio: 700000,
        imagen: "https://i.blogs.es/dc9b35/41n9xrnkjvl._sl500_/original.jpeg",
        descripcion: "Escritorio elevable con tabla de madera y sistema de gestión de cables"
    },
    {
        id: 2,
        nombre: "Silla Gamer DXRacer",
        precio: 400000,
        imagen: "https://http2.mlstatic.com/D_Q_NP_767581-MLU75789607666_042024-O.webp",
        descripcion: "Silla gaming profesional con soporte lumbar, reposabrazos 4D y reclinable hasta 180°"
    },
    {
        id: 3,
        nombre: "Kit Organizador de cables",
        precio: 15000,
        imagen: "https://http2.mlstatic.com/D_NQ_NP_658334-MLC71466583272_092023-O.webp",
        descripcion: "Kit completo de organización de cables para escritorio"
    },
    {
        id: 4,
        nombre: "Soporte Monitor",
        precio: 50000,
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XFZ5JMW-ELMjl9Us0vNny_XZuwaTLjQ8AoYABH8Y6FMSHhd4a2pzGuPiWCyVCLJmnvo&usqp=CAU",
        descripcion: "Soporte articulado para monitores con rotación 360°"
    },
    {
        id: 5,
        nombre: "Mousepad HyperX XXL",
        precio: 80000,
        imagen: "https://images.fravega.com/f500/ee5dcb42efa7c76fc2bfe5e5fee7ce3f.jpg",
        descripcion: "Mouse pad HyperX con superficie tipo control XXL"
    },
    {
        id: 6,
        nombre: "PegBoard",
        precio: 20000,
        imagen: "https://www.ikea.com/mx/en/images/products/skadis-pegboard-black__1085369_pe860083_s5.jpg?f=xs",
        descripcion: "PegBoard perfecto para organizar tus cosas en la pared y liberar espacio en tu escritorio"
    }
];


let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


function mostrarSeccion(seccionId) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });
    
    document.getElementById(seccionId).style.display = 'block';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === seccionId) {
            link.classList.add('active');
        }
    });

    if (seccionId === 'tienda') {
        cargarProductos();
    }
}

function cargarProductos() {
    const contenedor = document.querySelector('.productos-grid');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">$ ${formatearPrecio(producto.precio)}</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        contenedor.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
    guardarCarrito();
}

function actualizarCarrito() {
    document.getElementById('carrito-cantidad').textContent = carrito.length;
    const carritoItems = document.getElementById('carrito-items');
    carritoItems.innerHTML = '';
    
    const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
    
    carrito.forEach((producto, index) => {
        const div = document.createElement('div');
        div.className = 'carrito-item';
        div.innerHTML = `
            <p>${producto.nombre} - $ ${formatearPrecio(producto.precio)}</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoItems.appendChild(div);
    });
    
    document.getElementById('carrito-total').textContent = `Total: $ ${formatearPrecio(total)}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarrito();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const seccionId = link.getAttribute('data-section');
        mostrarSeccion(seccionId);
        history.pushState({}, '', `#${seccionId}`);
    });
});

const carritoModal = document.getElementById('carrito-modal');
const checkoutModal = document.getElementById('checkout-modal');

document.getElementById('carrito-btn').onclick = () => {
    carritoModal.style.display = 'block';
}

document.getElementById('checkout-btn').onclick = () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    carritoModal.style.display = 'none';
    checkoutModal.style.display = 'block';
}

document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias por su compra!');
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    checkoutModal.style.display = 'none';
}

document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = function() {
        carritoModal.style.display = 'none';
        checkoutModal.style.display = 'none';
    }
});

window.addEventListener('popstate', () => {
    const seccionId = window.location.hash.slice(1) || 'inicio';
    mostrarSeccion(seccionId);
});

window.addEventListener('load', () => {
    const seccionId = window.location.hash.slice(1) || 'inicio';
    mostrarSeccion(seccionId);
    actualizarCarrito();
});