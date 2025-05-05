## Overview

DoDash is a comprehensive application designed to streamline task management and enhance productivity. It features a robust backend, a user-friendly frontend, and a well-organized folder structure to ensure scalability and maintainability.

# 🚗 Ride Booking & Payment System – Full Stack App

This project is a full-stack **ride-sharing platform** that features:

- 🚦 Real-time ride tracking using WebSockets.
- 💸 Payment processing and driver-rider associations.
- 🧭 Frontend visualization with live updates.

---

## Deployed Link:

    Frontend : https://do-dash-beige.vercel.app/
    Backend : https://dodash.onrender.com/

## 🛠 Technologies Used

### 🔧 Backend

- **Node.js** – Runtime environment
- **Express.js** – REST API framework
- **MongoDB** – Database
- **Mongoose** – ODM for MongoDB
- **Socket.IO** – Real-time communication
- **JWT (assumed)** – Authentication
- **dotenv** – Environment variable management

### 🎨 Frontend

- **React.js** – UI library
- **JavaScript** – Programming language
- **Material UI (MUI)** – Component library
- **Tailwind CSS** – Utility-first CSS framework
- **React Leaflet** – Map rendering with OpenStreetMap
- **Socket.IO-client** – WebSocket integration

---

## 📁 Project Structure

```
/controllers     → Business logic (ride, payment)
/models          → Mongoose models: User, Driver, Payment
/routes          → Express API routes
/server.js       → Main entry + Socket.IO setup
/frontend/       → React app with maps and UI components
```

---

## ⚙️ Features

### 1. 🔴 Live Ride Tracking (Frontend + WebSocket)

- Frontend simulates a moving driver from origin to destination.
- Driver's location updates every 300ms.
- Destination proximity is checked using haversine formula.
- Once the ride is complete:
  - Emits a `rideCompleted` event to backend via Socket.IO.
  - Triggers a ride data fetch and status update.

### 2. 💸 Payment Processing (Backend)

- Endpoint: `POST /api/payment/process`
- Accepts `amount`, `paymentMethod`, `driverId`.
- Simulates successful payment with:
  - Unique `transactionId`
  - Linked `user` (payer) and `driver` (receiver)
- Updates payment records in both User and Driver schemas.

### 3. 🧾 MongoDB Models

#### Payment Schema

```js
{
  user: ObjectId,        // Rider who paid
  driver: ObjectId,      // Driver who received payment
  amount: Number,
  method: String,
  transactionId: String,
  status: String,        // 'pending' | 'completed' | 'failed'
  createdAt: Date
}
```

#### Driver/User Schema

```js
{
  name: String,
  ...
  payments: [{ type: ObjectId, ref: "Payment" }]
}
```

---

## Folder Structure

```
/DoDash
├── backend/          # Backend services and APIs
│   ├── controllers/  # Business logic and request handling
│   ├── models/       # Database schemas and models
│   ├── routes/       # API route definitions
│   ├── config/       # Configuration files (e.g., database, environment)
│   ├── utils/        # Utility functions and helpers
│   ├── server.js     # Entry point for the backend server
│
├── frontend/         # Frontend application
│   ├── public/       # Static assets (e.g., images, icons)
│   ├── src/          # Source code for the frontend
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── services/   # API calls and frontend logic
│   │   ├── App.js      # Main application component
│   │   ├── index.js    # Entry point for the frontend
│
├── README.md         # Project documentation
├── package.json      # Project dependencies and scripts
├── .gitignore        # Files and directories to ignore in Git
```

---

## 📡 API Endpoints

### `POST /api/payment/process`

**Request:**

```json
{
  "amount": 150,
  "paymentMethod": "UPI",
  "driverId": "645abc..."
}
```

**Response:**

```json
{
  "message": "Payment processed successfully.",
  "payment": {
    "_id": "abc123",
    "user": "...",
    "driver": "...",
    "amount": 150,
    "method": "UPI",
    "transactionId": "TXN1712345678",
    "status": "completed"
  }
}
```

---

## 🎯 Frontend Highlights

- Built with **React.js** using functional components and hooks.
- Map displayed via **React-Leaflet** and OpenStreetMap.
- Uses **Socket.IO-client** to listen for live updates.
- Styled with **Tailwind CSS** and **Material UI** components.
- Shows driver's live movement and payment status visually.

---

## 📦 Getting Started

1. **Backend Setup**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. Visit: `http://localhost:3000`

---

## 📬 Feedback & Contributions

Have suggestions or want to contribute? Open an issue or pull request.

---

## 📄 License

This project is for educational and prototyping purposes. MIT License.
