const express = require("express");
const app = express();

// Helper: format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// Helper: clone date
function cloneDate(d) {
  return new Date(d.getTime());
}

app.get("/order-schedule", (req, res) => {
  const now = new Date(); // server time
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // strip time

  // JS: 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  const day = today.getDay();

  // Distance from Friday (5)
  const daysSinceFriday = (day + 2) % 7;
  const orderStart = cloneDate(today);
  orderStart.setDate(orderStart.getDate() - daysSinceFriday);

  // Order window is Friday → Thursday (7 days)
  const orderEnd = cloneDate(orderStart);
  orderEnd.setDate(orderEnd.getDate() + 6); // Friday + 6 = Thursday

  // Delivery week is the week AFTER the orderEnd week, Monday–Friday
  const orderEndDay = orderEnd.getDay(); // 0=Sun..6=Sat
  const daysToNextMonday = ((8 - orderEndDay) % 7) || 7;
  const deliveryStart = cloneDate(orderEnd);
  deliveryStart.setDate(deliveryStart.getDate() + daysToNextMonday);

  const deliveryEnd = cloneDate(deliveryStart);
  deliveryEnd.setDate(deliveryEnd.getDate() + 4); // Mon + 4 = Fri

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  res.json({
    todayDate: formatDate(today),
    dayOfWeek: dayNames[day],
    orderWindowStart: formatDate(orderStart),
    orderWindowEnd: formatDate(orderEnd),
    deliveryWeekStart: formatDate(deliveryStart),
    deliveryWeekEnd: formatDate(deliveryEnd)
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Order schedule API running on port ${PORT}`);
});
