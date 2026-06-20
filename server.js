const express = require("express");
const app = express();
app.use(express.json());

const SUPABASE_URL = "https://metabbraajdxbrojneog.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldGFiYnJhYWpkeGJyb2puZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MzM0MjIsImV4cCI6MjA5NzAwOTQyMn0.B3oJqDdEPoZS-H8uTjcnIAb6ldQTESk2YTsW-ZOcM-g";

app.get("/", function (req, res) {
  res.json({ status: "TownRide Server Running!" });
});

app.post("/notify-driver", async function (req, res) {
  try {
    const { rider_phone, pickup, destination, fare, vehicle_type } = req.body;
    console.log("New ride booked!");
    console.log("Rider:", rider_phone);
    console.log("Pickup:", pickup);
    console.log("Destination:", destination);
    console.log("Fare:", fare);
    console.log("Vehicle:", vehicle_type);

    const response = await fetch(
      SUPABASE_URL +
        "/rest/v1/drivers?is_online=eq.true&is_approved=eq.true&select=*",
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: "Bearer " + SUPABASE_KEY,
        },
      },
    );
    const drivers = await response.json();

    const messages = [];
    drivers.forEach(function (driver) {
      if (driver.expo_push_token) {
        messages.push({
          to: driver.expo_push_token,
          title: "New Ride Request!",
          body: pickup + " → " + destination + " | Rs." + fare,
          data: { rider_phone, pickup, destination, fare, vehicle_type },
        });
      }
    });

    if (messages.length > 0) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
      console.log("Notifications sent to", messages.length, "drivers");
    }

    res.json({ success: true, drivers_notified: messages.length });
  } catch (e) {
    console.log("Error:", e.message);
    res.json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("TownRide server running on port " + PORT);
});
