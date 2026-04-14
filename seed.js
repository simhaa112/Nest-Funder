const mongoose = require("mongoose");
const https = require("https");
const Listing = require("./models/listing");

require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
const PEXELS_KEY = process.env.PEXELS_API_KEY;

// Validate environment variables
if (!MONGO_URL) {
    console.error("❌ MONGO_URL not set in environment variables");
    process.exit(1);
}

if (!PEXELS_KEY) {
    console.error("❌ PEXELS_API_KEY not set in environment variables");
    process.exit(1);
}

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
    { title: "Cozy Room in Vadodara", query: "cozy room", description: "A comfortable and affordable room in the heart of Vadodara. Perfect for students and working professionals.", price: 5000, location: "Vadodara", country: "India", category: "Room", whatsapp: "..." },
    { title: "Luxury Guest House Mumbai", query: "luxury guest house", description: "Experience luxury living in this beautiful guest house in South Mumbai with all modern amenities.", price: 12000, location: "Mumbai", country: "India", category: "Guest House", whatsapp: "..." },
    // ... add all 12 listings with query field
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
            const image = await fetchPexelsImage(data.query || data.title);
            listings.push({ ...data, image });
            console.log(`✅ ${data.title} — image fetched!`);
        }
        await Listing.insertMany(listings);
        console.log("\n🌱 12 listings with real Pexels images added!");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.connection.close();
    }
}

seedDB();