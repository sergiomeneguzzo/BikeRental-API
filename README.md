# BikeRental-API

Backend API for managing a **bike rental system**, developed in **one week** by a team of **3 people** as the final project for an ITS full stack web development course.

---

## 📘 Context

A company operating in bicycle sales wants to expand into the rental sector, with multiple physical stores. The goal of this project is to provide a modern, efficient, and scalable **REST API** to handle:

- Online bookings
- Real-time availability
- Insurance and pricing
- Pick-up and return operations
- Email communication

---

## 🎯 Goal

Deliver a **complete rental backend system** with:

- Public-facing endpoints (used by a separate frontend)
- Backoffice interface for store operators
- Well-structured, secure, and documented API

---

## 🧱 Tech Stack

- **Node.js 22**
- **Express.js**
- **Passport.js** (JWT authentication)
- **Node-Cron** (task scheduling)
- **Nodemailer** (email handling)
- **TypeScript**
- **Azure App Service + Pipeline** (CI/CD)

---

## 📂 Project Structure

```
src/
├── api/
│ ├── accessories/
│ ├── auth/
│ ├── bike/
│ ├── biketype/
│ ├── booking/
│ ├── insurances/
│ ├── location/
│ ├── services/
│ │ ├── logs/
│ │ ├── email.service.ts
│ │ ├── reminder.service.ts
│ │ └── reservation.service.ts
│ ├── user/
│ ├── routes.ts
│ └── errors/
├── scheduled-services/
├── utils/
├── app.ts
├── index.ts
```

---

## 🔐 Authentication

Protected routes (used by operators) require **JWT authentication** via Passport.js. Users must register and confirm their email address to complete a reservation.

---

## ⏰ Scheduled Tasks

- ✅ **Daily email reminders** for upcoming bookings
- ✅ **Automatic release** of bikes from unconfirmed reservations
- 🛠️ Scheduled using `node-cron`

---

## ✉️ Email Automation

- Email with confirmation link after registration
- Booking summary email after reservation
- Pickup reminder email sent the day before

---

## 🚀 Deployment

- The API is deployed on **Azure App Service**
- CI/CD managed through **Azure Pipeline** (`azure-pipelines.yml`)

---

## 🧪 Core Features

### Public (user-facing)
- Book bikes with optional accessories and insurance
- User registration with email confirmation
- Manage personal bookings
- Reminder emails for pickup

### Operator (backoffice)
- JWT-protected login
- Manage stores, bikes, accessories, and pricing
- Confirm pickup / return of bikes
- Monthly reports generation

---

## 📈 Future Improvements

- Payment gateway integration (e.g., PayPal)
- Operator activity tracking
- Frontend dashboard for analytics

---

## 👥 Team

Developed in 1 week by a team of 3 developers as part of a final exam simulation project.

---
