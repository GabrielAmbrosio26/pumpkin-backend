import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prismaClient";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => res.send("¡Servidor funcionando! 🎃"));

// ===== USERS ENDPOINTS =====

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

app.post("/auth/register", async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, surname, email, password: hashedPassword },
        });
        return res.json({ id: user.id, name: user.name, surname: user.surname, email: user.email });
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña requeridos" });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Contraseña incorrecta" });
        return res.json({ id: user.id, name: user.name, surname: user.surname, email: user.email, avatarColor: user.avatarColor, avatarTextColor: user.avatarTextColor });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

app.patch("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, surname, avatarColor, avatarTextColor } = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, surname, avatarColor, avatarTextColor },
        });
        return res.json(user);
    } catch (err: any) {
        return res.status(400).json({ message: err.message });
    }
});

// ===== PRODUCTS ENDPOINTS =====

app.get("/products", async (req, res) => {
    try {
        const q = (req.query.q as string) || null;
        if (q) {
            const products = await prisma.product.findMany({
                where: { nombre: { contains: q, mode: "insensitive" } },
            });
            return res.json(products);
        }
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
});

// ===== CART ENDPOINTS =====

// Obtener carrito (pedido con status 'CART')
app.get("/cart/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const pedido = await prisma.pedido.findFirst({ where: ({ userId: parseInt(userId), status: "CART" } as any) });
        if (!pedido) return res.json({ productos: [], total: 0 });
        const productos = JSON.parse(pedido.productos || "[]");
        return res.json({ productos, total: pedido.total });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

// Crear o actualizar carrito
app.post("/cart/:userId", async (req, res) => {
    const { userId } = req.params;
    const { productos, total } = req.body; // productos: array
    try {
        const existing = await prisma.pedido.findFirst({ where: ({ userId: parseInt(userId), status: "CART" } as any) });
        if (existing) {
            const updated = await prisma.pedido.update({
                where: { id: existing.id },
                data: ({ productos: JSON.stringify(productos), total } as any),
            });
            return res.json({ productos: JSON.parse(updated.productos), total: updated.total });
        }
        const created = await prisma.pedido.create({
            data: ({ userId: parseInt(userId), productos: JSON.stringify(productos), total, status: "CART" } as any),
        });
        return res.json({ productos: JSON.parse(created.productos), total: created.total });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

// Eliminar carrito (vaciar)
app.delete("/cart/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const existing = await prisma.pedido.findFirst({ where: ({ userId: parseInt(userId), status: "CART" } as any) });
        if (!existing) return res.json({ message: "Carrito vacío" });
        await prisma.pedido.delete({ where: { id: existing.id } });
        return res.json({ message: "Carrito eliminado" });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
});

app.get("/products/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: { categoria: category },
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos por categoría" });
    }
});

app.get("/categories", async (req, res) => {
    try {
        const categories = await prisma.product.findMany({
            select: { categoria: true },
            distinct: ["categoria"],
        });
        const uniqueCategories = categories.map((p: any) => p.categoria);
        res.json(uniqueCategories);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener categorías" });
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
