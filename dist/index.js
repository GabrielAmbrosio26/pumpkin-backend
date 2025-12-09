"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = require("./prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => res.send("¡Servidor funcionando! 🎃"));
// ===== USERS ENDPOINTS =====
app.get("/users", async (req, res) => {
    try {
        const users = await prismaClient_1.prisma.user.findMany();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});
app.post("/auth/register", async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prismaClient_1.prisma.user.create({
            data: { name, surname, email, password: hashedPassword },
        });
        return res.json({ id: user.id, name: user.name, surname: user.surname, email: user.email });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }
        const user = await prismaClient_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid)
            return res.status(401).json({ message: "Contraseña incorrecta" });
        return res.json({ id: user.id, name: user.name, surname: user.surname, email: user.email, avatarColor: user.avatarColor, avatarTextColor: user.avatarTextColor });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
});
app.patch("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, surname, avatarColor, avatarTextColor } = req.body;
    try {
        const user = await prismaClient_1.prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, surname, avatarColor, avatarTextColor },
        });
        return res.json(user);
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
// ===== PRODUCTS ENDPOINTS =====
app.get("/products", async (req, res) => {
    try {
        const products = await prismaClient_1.prisma.product.findMany();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
});
app.get("/products/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await prismaClient_1.prisma.product.findMany({
            where: { categoria: category },
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener productos por categoría" });
    }
});
app.get("/categories", async (req, res) => {
    try {
        const categories = await prismaClient_1.prisma.product.findMany({
            select: { categoria: true },
            distinct: ["categoria"],
        });
        const uniqueCategories = categories.map((p) => p.categoria);
        res.json(uniqueCategories);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener categorías" });
    }
});
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
//# sourceMappingURL=index.js.map