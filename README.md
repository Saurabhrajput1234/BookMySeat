# 🎟️ BookMySeat

BookMySeat is an online event booking platform built using **React (frontend)** and **ASP.NET Core (backend)**.  
The application allows users to **browse events, view details, select seats, and book them in real-time**.  
Admins can **manage events, seats, and users** via an Admin Dashboard.

---

## ✅ Live Demo
- **Frontend:** [BookMySeat Live App](https://book-my-seat-three.vercel.app/)  
- **Backend:** Hosted locally or deploy to Azure/AWS.

---

## 🚀 Features
### **User Features**
- 🔍 Browse upcoming events
- 📅 View event details (date, time, location)
- 🎫 Book available seats in real-time
- 📋 View booking history in **User Dashboard**
- 🔐 Authentication & Authorization

### **Admin Features**
- ➕ Create and manage events
- ➕ Add/Delete seats dynamically
- 👥 Manage users (Activate/Deactivate, Role Updates)
- 📊 View & manage bookings

### **Real-Time Updates**
- 🟢 SignalR integration for **live seat booking updates**

---

## 🛠️ Tech Stack
### **Frontend**
- React + TypeScript
- Material-UI (MUI)
- Axios
- React Router DOM

### **Backend**
- ASP.NET Core Web API
- Entity Framework Core
- SignalR (real-time updates)
- JWT Authentication

### **Database**
- SQL Server

---

## 📂 Project Structure
BookMySeat/
├── frontend/ # React app
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── contexts/
│ │ └── App.tsx
├── backend/ # ASP.NET Core API
│ ├── Controllers/
│ ├── Models/
│ ├── Services/
│ └── Program.cs