# EventSphere AI

## Event Management System

### Project Overview

EventSphere AI is a full-stack Event Management System developed using React.js, Node.js, Express.js, and MongoDB. The system allows students to browse and register for events, while organizers can create, update, and manage events efficiently through a dedicated dashboard.

The project implements secure authentication using JSON Web Tokens (JWT) and role-based access control to separate student and organizer functionalities.

---

## Features

### Student Module

* User Registration and Login
* Secure Authentication using JWT
* Student Dashboard
* Browse Available Events
* View Event Details
* Register for Events
* View Registered Events
* Logout Functionality

### Organizer Module

* Organizer Registration and Login
* Organizer Dashboard
* Create New Events
* View All Events
* Edit Existing Events
* Delete Events
* Manage Event Information
* Logout Functionality

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* JSON Web Token (JWT)
* Protected Routes
* Role-Based Access Control

---

## Project Structure

### Frontend

* Login Page
* Registration Page
* Student Dashboard
* Organizer Dashboard
* Events Page
* Event Details Page
* Create Event Page
* Edit Event Page
* My Registered Events Page

### Backend

* Authentication APIs
* Event Management APIs
* Registration APIs
* JWT Middleware
* MongoDB Models

---

## Database Collections

### Users

Stores user information including:

* Name
* Email
* Password
* Role (Student / Organizer)

### Events

Stores event information including:

* Title
* Description
* Date
* Venue
* Category
* Maximum Participants
* Event Creator

### Registrations

Stores event registrations including:

* User ID
* Event ID
* Registration Date

---

## Installation Guide

### Clone Repository

```bash
git clone <repository-url>
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Events

```text
GET    /api/events
GET    /api/events/:id
POST   /api/events/create
PUT    /api/events/update/:id
DELETE /api/events/delete/:id
```

### Registrations

```text
POST /api/registrations/register/:eventId
GET  /api/registrations/my-events
```

---

## Security Features

* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Secure Password Storage
* Event Ownership Validation

---

## Future Enhancements

* Admin Dashboard
* Event Certificates
* Email Notifications
* Event Analytics
* QR Code Based Registration
* Attendance Tracking

---
---

## 👥 Team

- Jaiveer Tanwar (JAIV683883)
- Surya Prakash Bharti  (SURYED4183)
- Gopal Kumar Gond (GOPA608E22)
- Satyam Yadav  (TECH3CB2E1)

---

## 👥 Team & Responsibilities

| Team Member | Role | Responsibilities |
|------------|------|------------------|
| Jaiveer Tanwar | Project Lead & Full Stack Developer | Project architecture, React frontend, Express backend, MongoDB integration, authentication, AI integration, GitHub management, deployment, testing and final integration. |
| Surya Prakash Bharti | Frontend Developer | UI/UX design, landing page, responsive design, student dashboard, organizer dashboard, reusable React components, Tailwind CSS styling. |
| Gopal Kumar Gond | Backend Developer | REST APIs, Express.js, MongoDB database, CRUD operations, user management, event management, authentication APIs. |
| Satyam Yadav | AI & Documentation Lead | AI feature research, Gemini API integration, QR attendance workflow, documentation, pitch deck, reports, demo video and testing. |

---


### Project

**EventSphere AI – Event Management System**
