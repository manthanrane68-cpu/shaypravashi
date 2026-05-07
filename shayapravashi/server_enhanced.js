// ======== Dependencies ========
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

// ======== Middleware ========
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session config
app.use(session({
  secret: "swayam",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));

// Static for uploads & public files
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));

// ======== Admin Middleware ========
function adminOnly(req, res, next) {
  // For demo purposes, allow access without login
  // In production, this would check req.session.user
  next();
}

// ======== Multer Config (for file uploads) ========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ======== Sample Data ========
let sampleForts = [
  {
    id: 1,
    name: "Raigad Fort",
    description: "Historic fort of Chhatrapati Shivaji Maharaj, known for its strategic location and architectural marvel.",
    location: "Raigad, Maharashtra",
    difficulty: "Hard",
    image_url: "/images/raigad.jpg"
  },
  {
    id: 2,
    name: "Sinhagad Fort",
    description: "Famous for the Battle of Sinhagad where Tanaji Malusare fought bravely.",
    location: "Pune, Maharashtra",
    difficulty: "Medium",
    image_url: "/images/sinhagad.jpg"
  },
  {
    id: 3,
    name: "Pratapgad Fort",
    description: "Built by Chhatrapati Shivaji Maharaj, famous for the encounter with Afzal Khan.",
    location: "Satara, Maharashtra",
    difficulty: "Medium",
    image_url: "/images/pratapgad.jpg"
  },
  {
    id: 4,
    name: "Rajgad Fort",
    description: "Former capital of Maratha Empire, known for its massive size and strategic importance.",
    location: "Pune, Maharashtra",
    difficulty: "Hard",
    image_url: "/images/rajgad.jpg"
  },
  {
    id: 5,
    name: "Lohagad Fort",
    description: "Iron fort known for its unique architecture and scenic beauty.",
    location: "Lonavala, Maharashtra",
    difficulty: "Easy",
    image_url: "/images/lohagad.jpg"
  }
];

let samplePackages = [
  {
    id: 1,
    name: "Raigad Fort Trek",
    price: 1500.00,
    itinerary: "Day 1: Arrival at base village, Day 2: Trek to Raigad Fort, Day 3: Explore fort and return",
    season: "Winter",
    base_village: "Pachad",
    difficulty: "Hard"
  },
  {
    id: 2,
    name: "Sinhagad Day Trek",
    price: 800.00,
    itinerary: "Early morning trek to Sinhagad, explore the fort, lunch at base village, return by evening",
    season: "All Seasons",
    base_village: "Sinhagad Ghat",
    difficulty: "Medium"
  },
  {
    id: 3,
    name: "Pratapgad Adventure",
    price: 1200.00,
    itinerary: "2-day trek including fort exploration and local village visit",
    season: "Monsoon",
    base_village: "Par",
    difficulty: "Medium"
  },
  {
    id: 4,
    name: "Rajgad Heritage Trek",
    price: 1800.00,
    itinerary: "3-day trek covering the massive fort complex with historical insights",
    season: "Winter",
    base_village: "Gunjavane",
    difficulty: "Hard"
  },
  {
    id: 5,
    name: "Lohagad Family Trek",
    price: 600.00,
    itinerary: "Easy family-friendly trek suitable for beginners",
    season: "All Seasons",
    base_village: "Malavli",
    difficulty: "Easy"
  }
];

let sampleBookings = [
  {
    id: 1,
    fullname: "Rajesh Kumar",
    email: "rajesh@email.com",
    phone: "9876543210",
    participants: 2,
    message: "Looking forward to the trek!",
    package_id: 1,
    status: "Pending",
    created_at: "2024-01-15 10:30:00"
  },
  {
    id: 2,
    fullname: "Priya Sharma",
    email: "priya@email.com",
    phone: "9876543211",
    participants: 4,
    message: "Family trek for weekend",
    package_id: 2,
    status: "Confirmed",
    created_at: "2024-01-14 15:45:00"
  },
  {
    id: 3,
    fullname: "Amit Patel",
    email: "amit@email.com",
    phone: "9876543212",
    participants: 1,
    message: "Solo trekker, experienced",
    package_id: 3,
    status: "Pending",
    created_at: "2024-01-13 09:20:00"
  }
];

// ======== AUTH ROUTES ========

// Signup
app.post("/auth/signup", async (req, res) => {
  res.json({ message: "Demo mode: User registration simulated successfully" });
});

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Demo login - accept any credentials
  // Check if it's admin email
  if (email === "admin@shayapravashi.com" || email === "admin") {
    req.session.user = {
      id: 1,
      username: "admin",
      email: email,
      role: "admin"
    };
    res.json({ message: "Login successful", role: "admin", username: "admin" });
  } else {
    // Regular user
    req.session.user = {
      id: 2,
      username: email.split('@')[0] || "user",
      email: email,
      role: "user"
    };
    res.json({ message: "Login successful", role: "user", username: email.split('@')[0] || "user" });
  }
});

// Logout
app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// ======== FORTS ROUTES ========

// Add a fort (admin only, with image)
app.post("/api/forts", adminOnly, upload.single("image"), (req, res) => {
  const { name, description, location, difficulty } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : "/images/default-fort.jpg";

  const newFort = {
    id: sampleForts.length + 1,
    name,
    description,
    location,
    difficulty,
    image_url: imageUrl
  };

  sampleForts.push(newFort);
  res.json({ message: "Fort added successfully", fort: newFort });
});

// Get all forts
app.get("/api/forts", (req, res) => {
  res.json(sampleForts);
});

// Update fort
app.put("/api/forts/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const { name, description, location, difficulty } = req.body;

  const fortIndex = sampleForts.findIndex(f => f.id == id);
  if (fortIndex !== -1) {
    sampleForts[fortIndex] = { ...sampleForts[fortIndex], name, description, location, difficulty };
    res.json({ message: "Fort updated successfully", fort: sampleForts[fortIndex] });
  } else {
    res.status(404).json({ message: "Fort not found" });
  }
});

// Delete fort
app.delete("/api/forts/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const fortIndex = sampleForts.findIndex(f => f.id == id);

  if (fortIndex !== -1) {
    sampleForts.splice(fortIndex, 1);
    res.json({ message: "Fort deleted successfully" });
  } else {
    res.status(404).json({ message: "Fort not found" });
  }
});

// ======== PACKAGES ROUTES ========

// Add package (admin, multiple images)
app.post("/api/packages", adminOnly, upload.array("images", 5), (req, res) => {
  const { name, price, itinerary, season, base_village, difficulty } = req.body;

  const newPackage = {
    id: samplePackages.length + 1,
    name,
    price: parseFloat(price),
    itinerary,
    season,
    base_village,
    difficulty
  };

  samplePackages.push(newPackage);
  res.json({ message: "Package added successfully", package: newPackage });
});

// Get all packages
app.get("/api/packages", (req, res) => {
  res.json(samplePackages);
});

// Update package
app.put("/api/packages/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const { name, price, itinerary, season, base_village, difficulty } = req.body;

  const packageIndex = samplePackages.findIndex(p => p.id == id);
  if (packageIndex !== -1) {
    samplePackages[packageIndex] = {
      ...samplePackages[packageIndex],
      name,
      price: parseFloat(price),
      itinerary,
      season,
      base_village,
      difficulty
    };
    res.json({ message: "Package updated successfully", package: samplePackages[packageIndex] });
  } else {
    res.status(404).json({ message: "Package not found" });
  }
});

// Delete package
app.delete("/api/packages/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const packageIndex = samplePackages.findIndex(p => p.id == id);

  if (packageIndex !== -1) {
    samplePackages.splice(packageIndex, 1);
    res.json({ message: "Package deleted successfully" });
  } else {
    res.status(404).json({ message: "Package not found" });
  }
});

// ======== BOOKINGS ROUTES ========

// User creates booking
app.post("/api/bookings", (req, res) => {
  const { fullname, email, phone, participants, message, package_id } = req.body;

  const newBooking = {
    id: sampleBookings.length + 1,
    fullname,
    email,
    phone,
    participants: parseInt(participants),
    message,
    package_id: parseInt(package_id),
    status: "Pending",
    created_at: new Date().toISOString()
  };

  sampleBookings.push(newBooking);
  res.json({ message: "Booking request submitted successfully", booking: newBooking });
});

// Admin: view bookings
app.get("/api/bookings", adminOnly, (req, res) => {
  res.json(sampleBookings);
});

// Admin: update booking status
app.put("/api/bookings/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const bookingIndex = sampleBookings.findIndex(b => b.id == id);
  if (bookingIndex !== -1) {
    sampleBookings[bookingIndex].status = status;
    res.json({ message: `Booking ${status}`, booking: sampleBookings[bookingIndex] });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// Admin: delete booking
app.delete("/api/bookings/:id", adminOnly, (req, res) => {
  const { id } = req.params;
  const bookingIndex = sampleBookings.findIndex(b => b.id == id);

  if (bookingIndex !== -1) {
    sampleBookings.splice(bookingIndex, 1);
    res.json({ message: "Booking deleted successfully" });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
});

// ======== Admin Panel ========
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ======== User Dashboard ========
app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ======== Start Server ========
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${path.join(__dirname, "public")}`);
  console.log(`🎭 Demo mode: Full admin functionality with sample data`);
  console.log(`👨‍💼 Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`🔧 To enable database features, install MySQL and run: mysql -u root -p < setup_database.sql`);
});

