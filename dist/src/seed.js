"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../prismaClient");
async function main() {
    const productos = [
        // Ropa
        { nombre: "Abrigo Lana Marrón", precio: 120, img: "/productos/abrigo-lana.png", stock: 10, cantidad: 1, categoria: "ropa" },
        { nombre: "Bufanda Suave Beige", precio: 35, img: "/productos/bufanda-beige.png", stock: 15, cantidad: 1, categoria: "ropa" },
        { nombre: "Jersey Naranja", precio: 60, img: "/productos/jersey-naranja.png", stock: 8, cantidad: 1, categoria: "ropa" },
        { nombre: "Chaqueta Denim Azul", precio: 90, img: "/productos/chaqueta-denim.png", stock: 5, cantidad: 1, categoria: "ropa" },
        { nombre: "Pantalón Beige", precio: 70, img: "/productos/pantalon-beige.png", stock: 12, cantidad: 1, categoria: "ropa" },
        // Hogar
        { nombre: "Vela Aromática Canela", precio: 15, img: "/productos/vela-canela.png", stock: 20, cantidad: 1, categoria: "hogar" },
        { nombre: "Almohadón Otoñal", precio: 25, img: "/productos/almohadon-otono.png", stock: 15, cantidad: 1, categoria: "hogar" },
        { nombre: "Manta de Lana Beige", precio: 40, img: "/productos/manta-lana.png", stock: 10, cantidad: 1, categoria: "hogar" },
        { nombre: "Juego de Tazas Naranja", precio: 30, img: "/productos/tazas-naranja.png", stock: 12, cantidad: 1, categoria: "hogar" },
        { nombre: "Lámpara de Mesa Madera", precio: 55, img: "/productos/lampara-madera.png", stock: 8, cantidad: 1, categoria: "hogar" },
    ];
    await prismaClient_1.prisma.product.createMany({
        data: productos,
        skipDuplicates: true,
    });
    console.log("Todos los productos creados ✅");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prismaClient_1.prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map