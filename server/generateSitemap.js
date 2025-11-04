require("dotenv").config();
const mongoose = require("mongoose");
const AllBikes = require("./api/models/AllBikes");
const fs = require("fs");
const path = require("path");

async function generateSitemap() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all public bikes
    const bikes = await AllBikes.find({ public: true }).sort({
      brand: -1,
      name: 1,
    });
    console.log(`✅ Found ${bikes.length} public bikes`);

    // Start building XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Homepage -->
  <url>
    <loc>https://www.northshorebikeshop.net/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Shop Page -->
  <url>
    <loc>https://www.northshorebikeshop.net/shop</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Service Page -->
  <url>
    <loc>https://www.northshorebikeshop.net/service</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>https://www.northshorebikeshop.net/contact</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Return Policy Page -->
  <url>
    <loc>https://www.northshorebikeshop.net/return-policy</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
`;

    // Add all bike detail pages
    const today = new Date().toISOString().split("T")[0];
    bikes.forEach((bike) => {
      const bikeId = bike._id.toString();
      const brand = (bike.brand || "").toLowerCase().replace(/\s+/g, "-");
      // Use today's date since timestamps are disabled in the model
      const lastmod = today;

      xml += `  <!-- ${bike.brand} ${bike.name} -->
  <url>
    <loc>https://www.northshorebikeshop.net/shop/${brand}/${bikeId}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
`;
    });

    xml += `</urlset>`;

    // Write to client/public/sitemap.xml
    const sitemapPath = path.join(__dirname, "../client/public/sitemap.xml");
    fs.writeFileSync(sitemapPath, xml, "utf8");
    console.log(
      `✅ Sitemap generated successfully with ${bikes.length} bike pages`
    );
    console.log(`📄 Saved to: ${sitemapPath}`);

    // Close connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

// Run the script
generateSitemap();
