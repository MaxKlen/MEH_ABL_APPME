const express = require("express");
const path = require("path");
const session = require("express-session");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");

// Create Express app
const app = express();

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");
app.use(expressLayouts);

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Session middleware
app.use(session({
  secret: "abl-group-services-catalog",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Mock authentication middleware
app.use((req, res, next) => {
  // For demo purposes, we"ll simulate a logged-in user
  if (!req.session.user) {
    req.session.user = {
      id: 1,
      name: "Demo User",
      email: "demo@ablgroup.com",
      role: "engineer",
      isInternal: true
    };
  }
  res.locals.user = req.session.user;
  res.locals.activeNav = "home"; // Default active nav
  next();
});

// Routes
const indexRoutes = require("./routes/index");
const servicesRoutes = require("./routes/services");
const bundlesRoutes = require("./routes/bundles");
const knowledgeCenterRoutes = require("./routes/knowledge-center");
const energyLifecycleRoutes = require("./routes/energy-lifecycle");
const adminRoutes = require("./routes/admin");
const salesTrainingRoutes = require("./routes/sales-training");
const leadFormRoutes = require("./routes/lead-form");
const downloadsRoutes = require("./routes/downloads");
const softwareRoutes = require("./routes/software");
const companyRoutes = require("./routes/companyRoutes"); // Added company routes
const energyTransitionRoutes = require("./routes/energy-transition"); // Added Energy Transition routes

app.use("/", indexRoutes);
app.use("/services", servicesRoutes);
app.use("/bundles", bundlesRoutes);
app.use("/knowledge-center", knowledgeCenterRoutes);
app.use("/energy-lifecycle", energyLifecycleRoutes);
app.use("/admin", adminRoutes);
app.use("/sales-training", salesTrainingRoutes);
app.use("/lead-form", leadFormRoutes);
app.use("/downloads", downloadsRoutes);
app.use("/software", softwareRoutes);
app.use("/", companyRoutes); // Used company routes, assuming they are at root like /abl, /owc
app.use("/energy-transition", energyTransitionRoutes); // Used Energy Transition routes

// Error handling
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    title: "Error - ABL Group Services Catalog",
    message: err.message,
    error: app.get("env") === "development" ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`ABL Group Services Catalog running on http://localhost:${PORT}`);
});

module.exports = app;

