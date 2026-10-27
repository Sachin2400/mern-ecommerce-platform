const dns = require('dns');
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
    // Fallback to default system DNS
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Users = require('./models/userModel');
const Category = require('./models/categoryModel');
const Products = require('./models/productModel');

const rawURI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/ecommerce';
const URI = rawURI.replace(/:\s*<([^>]+)>\s*@/, (match, p1) => ':' + encodeURIComponent(p1) + '@');

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB Atlas for seeding...");
        await mongoose.connect(URI);
        console.log("Connected to MongoDB.");

        // Clear existing collections
        await Users.deleteMany({});
        await Category.deleteMany({});
        await Products.deleteMany({});
        console.log("Cleared existing data.");

        // Create Users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        await Users.create({
            name: "Admin User",
            email: "admin@example.com",
            password: adminPassword,
            role: 1
        });

        await Users.create({
            name: "John Doe",
            email: "user@example.com",
            password: userPassword,
            role: 0
        });

        console.log("Created Admin (admin@example.com / admin123) and Customer (user@example.com / user123).");

        // Create Categories
        const catElectronics = await Category.create({ name: "Electronics" });
        const catWearables = await Category.create({ name: "Wearables & Watches" });
        const catAudio = await Category.create({ name: "Audio & Headphones" });
        const catAccessories = await Category.create({ name: "Accessories" });

        console.log("Created Categories.");

        // Create Products
        const sampleProducts = [
            {
                product_id: "TECH-001",
                title: "SonicPro Wireless ANC Headphones",
                price: 199.99,
                description: "Premium over-ear wireless headphones with active noise cancellation and 40h battery life.",
                content: "Engineered with 40mm custom high-fidelity drivers, ultra-soft memory foam ear cushions, multi-device Bluetooth 5.3 pairing, and rapid USB-C fast charging.",
                images: {
                    public_id: "sample_headphone_01",
                    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                },
                category: catAudio._id.toString(),
                sold: 142
            },
            {
                product_id: "TECH-002",
                title: "Aura Smart Watch Series 7",
                price: 249.99,
                description: "Next-gen fitness smartwatch with sapphire crystal glass, heart monitor, and AMOLED display.",
                content: "All-day wellness tracking featuring SpO2 blood oxygen sensing, ECG heart monitor, built-in GPS, water resistance up to 50 meters, and customizable watch faces.",
                images: {
                    public_id: "sample_watch_02",
                    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
                },
                category: catWearables._id.toString(),
                sold: 95
            },
            {
                product_id: "TECH-003",
                title: "UltraBook Pro 15-inch Laptop",
                price: 1199.99,
                description: "Lightweight productivity powerhouse with 16-core processor and Retina OLED display.",
                content: "Built with aerospace-grade aluminum chassis, 32GB LPDDR5 RAM, 1TB NVMe PCIe Gen4 SSD storage, Thunderbolt 4 ports, and up to 18 hours of real-world battery life.",
                images: {
                    public_id: "sample_laptop_03",
                    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
                },
                category: catElectronics._id.toString(),
                sold: 48
            },
            {
                product_id: "TECH-004",
                title: "Studio Pulse Studio Monitor Speaker",
                price: 149.00,
                description: "Compact wireless hi-fi desktop speaker delivering crystal-clear acoustics and deep bass.",
                content: "Features dual passive radiators, 60W RMS total power output, optical & auxiliary inputs, Bluetooth 5.2 connectivity, and walnut timber acoustic enclosure.",
                images: {
                    public_id: "sample_speaker_04",
                    url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80"
                },
                category: catAudio._id.toString(),
                sold: 76
            },
            {
                product_id: "TECH-005",
                title: "Ergonomic Mechanical Keyboard",
                price: 89.99,
                description: "Hot-swappable RGB mechanical keyboard with pre-lubed linear switches and PBT keycaps.",
                content: "Compact 75% layout, CNC machined aluminum knob, sound dampening silicone gaskets, tri-mode connection (Bluetooth, 2.4GHz dongle, and USB-C wired).",
                images: {
                    public_id: "sample_keyboard_05",
                    url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"
                },
                category: catAccessories._id.toString(),
                sold: 110
            },
            {
                product_id: "TECH-006",
                title: "ProFocus Mirrorless 4K Camera",
                price: 849.99,
                description: "Flagship 32.5 MP mirrorless camera with 4K60p video and 5-axis image stabilization.",
                content: "High-speed dual pixel CMOS autofocus, eye detection AF, weather-sealed magnesium body, articulating touchscreen display, and dual SD UHS-II card slots.",
                images: {
                    public_id: "sample_camera_06",
                    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
                },
                category: catElectronics._id.toString(),
                sold: 34
            }
        ];

        await Products.insertMany(sampleProducts);
        console.log(`Inserted ${sampleProducts.length} sample products with images and details.`);

        console.log("✅ Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seedData();
