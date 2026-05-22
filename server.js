require("dotenv").config();



const express = require("express");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/send-message", async (req, res) => {
  const { name, email, orderType, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
    });

   await transporter.sendMail({
  from: "vancesbinfinds@gmail.com",
  to: "ambernc@hotmail.com",
  replyTo: email,
  subject: `Amberwood Contact Form - ${orderType}`,
  html: `
    <h2>New Amberwood Inquiry</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Order Type:</strong> ${orderType}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
});

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Email failed to send"
    });
  }
});

app.get("/api/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync("products.json", "utf8"));
  res.json(products);
});

app.post("/api/products", (req, res) => {

  const adminPassword = req.headers["x-admin-password"];

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  const products = JSON.parse(fs.readFileSync("products.json", "utf8"));

  const newProduct = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image
  };

  products.push(newProduct);

  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  res.json({
    success: true,
    product: newProduct
  });
});

app.post("/api/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});