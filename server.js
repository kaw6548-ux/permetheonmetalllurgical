import express from "express";
import fs from "fs";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // your HTML/CSS folder

// Save & email route
app.post("/api/book", (req, res) => {
  const appointment = req.body;

  // Save to JSON file
  const file = "./appointments.json";
  let data = [];
  if (fs.existsSync(file)) {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  }
  data.push(appointment);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

  // Email using Gmail (replace with your credentials)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourgmail@gmail.com", // <-- replace this
      pass: "your-app-password"   // <-- use Gmail App Password
    }
  });

  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: "kaitwils11@gmail.com",
    subject: "New Consulting Appointment Booked",
    text: `
New appointment booked:
Name: ${appointment.name}
Phone: ${appointment.phone}
Email: ${appointment.email}
Date: ${appointment.date}
Time: ${appointment.time}
    `
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Email failed:", error);
      res.json({ message: "Appointment saved, but email failed to send." });
    } else {
      res.json({ message: "Appointment booked and email sent successfully!" });
    }
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
