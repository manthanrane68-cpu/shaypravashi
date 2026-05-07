// ======== Dependencies ========
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// ======== Database Connection ========
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",   // change to your MySQL password
  database: "user_info"
});

// ======== Middleware ========
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS so frontend can access backend
// app.use(cors({
//   origin: "http://localhost:5500", // frontend origin
//   credentials: true
// }));

// Session config
app.use(session({
  secret: "swayam",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}));

// Static for uploads, public files, and shared images
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));

// ======== Admin Middleware ========
function adminOnly(req, res, next) {
  if (!req.session.user) return res.status(401).json({ message: "Login required" });
  if (req.session.user.role !== "admin") return res.status(403).json({ message: "Admins only" });
  next();
}

// ======== Multer Config (for file uploads) ========
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ======== AUTH ROUTES ========

// Signup
app.post("/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO user_info_table (username, email, password, role) VALUES (?, ?, ?, 'user')",
    [username, email, hashedPassword],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Username or email already exists" });
        return res.status(500).json({ message: err.message });
      }
      res.json({ message: "User registered successfully" });
    }
  );
});

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM user_info_table WHERE email=?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(401).json({ message: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Save session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    res.json({ message: "Login successful", role: user.role });
  });
});

// Logout
app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

// ======== FORTS ROUTES ========

// Add a fort (admin only, with image)
app.post("/api/forts", adminOnly, upload.single("image"), (req, res) => {
  const { name, description, location, difficulty } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO forts (name, description, location, difficulty, image_url) VALUES (?, ?, ?, ?, ?)",
    [name, description, location, difficulty, imageUrl],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Fort added successfully" });
    }
  );
});

// Get all forts
app.get("/api/forts", (req, res) => {
  db.query("SELECT * FROM forts", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======== PACKAGES ROUTES ========

// Add package (admin, multiple images)
app.post("/api/packages", adminOnly, upload.array("images", 5), (req, res) => {
  const { name, price, itinerary, season, base_village, difficulty } = req.body;
  db.query(
    "INSERT INTO packages (name, price, itinerary, season, base_village, difficulty) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, itinerary, season, base_village, difficulty],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const packageId = result.insertId;
      const images = req.files.map(f => [`/uploads/${f.filename}`, packageId]);

      if (images.length) {
        db.query("INSERT INTO package_images (image_url, package_id) VALUES ?", [images], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "Package + images added" });
        });
      } else {
        res.json({ message: "Package added without images" });
      }
    }
  );
});

// Get all packages
app.get("/api/packages", (req, res) => {
  db.query("SELECT * FROM packages", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ======== BOOKINGS ROUTES ========

// User creates booking
app.post("/api/bookings", (req, res) => {
  const { fullname, email, phone, participants, message, package_id } = req.body;
  db.query(
    "INSERT INTO bookings (fullname, email, phone, participants, message, package_id, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')",
    [fullname, email, phone, participants, message, package_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Booking request submitted" });
    }
  );
});

// Admin: view bookings
app.get("/api/bookings", adminOnly, (req, res) => {
  db.query("SELECT * FROM bookings", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Admin: update booking status
app.put("/api/bookings/:id", adminOnly, (req, res) => {
  const { status } = req.body;
  db.query("UPDATE bookings SET status=? WHERE id=?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Booking ${status}` });
  });
});

// Admin: delete booking
app.delete("/api/bookings/:id", adminOnly, (req, res) => {
  db.query("DELETE FROM bookings WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Booking deleted" });
  });
});

// ======== Admin Panel ========
app.get("/admin.html", adminOnly, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// ======== Root Route ========
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======== Start Server ========
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
