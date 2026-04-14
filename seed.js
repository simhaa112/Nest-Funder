const mongoose = require("mongoose");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb+srv://9640narasimlareddy143_db_user:Reddy%407569@nestfinder.i6toiph.mongodb.net/nestfinder?retryWrites=true&w=majority";

const sampleListings = [
    {
        title: "Cozy Room in Vadodara",
        description: "A comfortable and affordable room in the heart of Vadodara. Perfect for students and working professionals.",
        image: { url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", filename: "sample1" },
        price: 5000, location: "Vadodara", country: "India", category: "Room", whatsapp: "9876543210"
    },
    {
        title: "Luxury Guest House Mumbai",
        description: "Experience luxury living in this beautiful guest house located in South Mumbai with all modern amenities.",
        image: { url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", filename: "sample2" },
        price: 12000, location: "Mumbai", country: "India", category: "Guest House", whatsapp: "9876543211"
    },
    {
        title: "Backpacker Hostel Goa",
        description: "Fun and vibrant hostel perfect for backpackers near Baga Beach. Meet travellers from around the world!",
        image: { url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", filename: "sample3" },
        price: 800, location: "Goa", country: "India", category: "Hostels", whatsapp: "9876543212"
    },
    {
        title: "Camping Site in Manali",
        description: "Breathtaking camping experience in the mountains of Manali. Includes bonfire and breakfast.",
        image: { url: "https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg", filename: "sample4" },
        price: 2500, location: "Manali", country: "India", category: "Camping", whatsapp: "9876543213"
    },
    {
        title: "Iconic City Apartment Delhi",
        description: "Modern apartment in the iconic city of New Delhi. Close to all major attractions and metro stations.",
        image: { url: "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg", filename: "sample5" },
        price: 8000, location: "New Delhi", country: "India", category: "Iconic Cities", whatsapp: "9876543214"
    },
    {
        title: "Rooftop Pool Villa Jaipur",
        description: "Stunning villa with private swimming pool and rooftop view of the Pink City. A royal experience!",
        image: { url: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg", filename: "sample6" },
        price: 15000, location: "Jaipur", country: "India", category: "Swimming Pools", whatsapp: "9876543215"
    },
    {
        title: "Trending Beachside Stay Goa",
        description: "Most booked property in Goa! Wake up to the sound of waves. Steps away from Anjuna Beach.",
        image: { url: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg", filename: "sample7" },
        price: 6000, location: "Anjuna, Goa", country: "India", category: "Trending", whatsapp: "9876543216"
    },
    {
        title: "Commercial Shop Space Pune",
        description: "Well-located shop space available for rent in a busy commercial area of Pune. High footfall guaranteed.",
        image: { url: "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg", filename: "sample8" },
        price: 20000, location: "Pune", country: "India", category: "Shops", whatsapp: "9876543217"
    },
    {
        title: "Cozy Hostel in Rishikesh",
        description: "Budget-friendly hostel near the Ganges river. Perfect base for yoga, rafting and trekking adventures.",
        image: { url: "https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg", filename: "sample9" },
        price: 600, location: "Rishikesh", country: "India", category: "Hostels", whatsapp: "9876543218"
    },
    {
        title: "Mountain View Room Shimla",
        description: "Cozy room with stunning mountain views in the queen of hill stations. Perfect for a weekend getaway.",
        image: { url: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", filename: "sample10" },
        price: 3500, location: "Shimla", country: "India", category: "Room", whatsapp: "9876543219"
    },
    {
        title: "Luxury Pool Resort Udaipur",
        description: "5-star experience at affordable prices. Infinity pool overlooking Lake Pichola in the City of Lakes.",
        image: { url: "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg", filename: "sample11" },
        price: 18000, location: "Udaipur", country: "India", category: "Swimming Pools", whatsapp: "9876543220"
    },
    {
        title: "Trending Treehouse Stay Coorg",
        description: "One of the most unique stays in India! A beautiful treehouse surrounded by coffee plantations in Coorg.",
        image: { url: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg", filename: "sample12" },
        price: 7500, location: "Coorg", country: "India", category: "Trending", whatsapp: "9876543221"
    }
];

async function seedDB() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB Atlas");
        await Listing.deleteMany({});
        console.log("🗑️  Cleared old listings");
        await Listing.insertMany(sampleListings);
        console.log("🌱 12 listings added successfully!");
        console.log("✅ Done! Go to https://nest-funder-1.onrender.com");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        mongoose.connection.close();
    }
}

seedDB();