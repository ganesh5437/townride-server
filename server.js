const express = require("express");
const app = express();
app.use(express.json());

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
    res.json({
      success: true,
      message: "Notification sent to drivers!",
    });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("TownRide server running on port " + PORT);
});
