const mongoose = require("mongoose");
const https = require("https");
const Listing = require("./models/listing");

require("dotenv").config();

const MONGO_URL = "mongodb://127.0.0.1:27017/homeheaven";
const PEXELS_KEY = process.env.PEXELS_API_KEY;

function fetchPexelsImage(query) {
    return new Promise((resolve) => {
        const options = {
            hostname: "api.pexels.com",
            path: `/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
            headers: { Authorization: PEXELS_KEY }
        };
        https.get(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    if (json.photos && json.photos.length > 0) {
                        resolve({ url: json.photos[0].src.large, filename: String(json.photos[0].id) });
                    } else {
                        resolve({ url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", filename: "fallback" });
                    }
                } catch (e) {
                    resolve({ url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", filename: "fallback" });
                }
            });
        }).on("error", () => {
            resolve({ url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800", filename: "fallback" });
        });
    });
}

const listingsData = [
    { title: "Cozy Room in Vadodara", description: "A comfortable and affordable room in the heart of Vadodara. Perfect for students and working professionals.", price: 5000, location: "Vadodara", country: "India", category: "Room", whatsapp: "9876543210", query: "cozy bedroom interior" },
    { title: "Luxury Guest House Mumbai", description: "Experience luxury living in this beautiful guest house in South Mumbai with all modern amenities.", price: 12000, location: "Mumbai", country: "India", category: "Guest House", whatsapp: "9876543211", query: "luxury guest house" },
    { title: "Backpacker Hostel Goa", description: "Fun and vibrant hostel perfect for backpackers near Baga Beach. Meet travellers from around the world!", price: 800, location: "Goa", country: "India", category: "Hostels", whatsapp: "9876543212", query: "hostel travel backpacker" },
    { title: "Camping Site in Manali", description: "Breathtaking camping experience in the mountains of Manali. Includes bonfire and breakfast.", price: 2500, location: "Manali", country: "India", category: "Camping", whatsapp: "9876543213", query: "mountain camping tent" },
    { title: "Iconic City Apartment Delhi", description: "Modern apartment in New Delhi. Close to all major attractions and metro stations.", price: 8000, location: "New Delhi", country: "India", category: "Iconic Cities", whatsapp: "9876543214", query: "modern city apartment" },
    { title: "Rooftop Pool Villa Jaipur", description: "Stunning villa with private swimming pool and rooftop view of the Pink City.", price: 15000, location: "Jaipur", country: "India", category: "Swimming Pools", whatsapp: "9876543215", query: "rooftop swimming pool villa" },
    { title: "Trending Beachside Stay Goa", description: "Most booked property in Goa! Wake up to the sound of waves. Steps away from Anjuna Beach.", price: 6000, location: "Anjuna, Goa", country: "India", category: "Trending", whatsapp: "9876543216", query: "beach house resort" },
    { title: "Commercial Shop Space Pune", description: "Well-located shop space in a busy commercial area of Pune. High footfall guaranteed.", price: 20000, location: "Pune", country: "India", category: "Shops", whatsapp: "9876543217", query: "commercial shop retail" },
    { title: "Cozy Hostel in Rishikesh", description: "Budget-friendly hostel near the Ganges river. Perfect base for yoga, rafting and trekking.", price: 600, location: "Rishikesh", country: "India", category: "Hostels", whatsapp: "9876543218", query: "yoga retreat nature" },
    { title: "Mountain View Room Shimla", description: "Cozy room with stunning mountain views in the queen of hill stations.", price: 3500, location: "Shimla", country: "India", category: "Room", whatsapp: "9876543219", query: "mountain view hotel room" },
    { title: "Luxury Pool Resort Udaipur", description: "5-star experience at affordable prices. Infinity pool overlooking Lake Pichola.", price: 18000, location: "Udaipur", country: "India", category: "Swimming Pools", whatsapp: "9876543220", query: "infinity pool lake resort" },
    { title: "Trending Treehouse Stay Coorg", description: "A beautiful treehouse surrounded by coffee plantations in Coorg.", price: 7500, location: "Coorg", country: "India", category: "Trending", whatsapp: "9876543221", query: "treehouse nature forest" }
];

async function seedDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");
        await Listing.deleteMany({});
        console.log("🗑️  Cleared old listings");
        console.log("📸 Fetching real images from Pexels...\n");
        const listings = [];
        for (let data of listingsData) {
            const image = await fetchPexelsImage(data.query);
            listings.push({ title: data.title, description: data.description, price: data.price, location: data.location, country: data.country, category: data.category, whatsapp: data.whatsapp, image });
            console.log(`✅ ${data.title} — image fetched!`);
        }
        await Listing.insertMany(listings);
        console.log("\n🌱 12 listings with real Pexels images added!");
        console.log("✅ Done! Go to http://localhost:3000");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        mongoose.connection.close();
    }
}

seedDB();
