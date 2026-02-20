# 🐝 TwinkleBee – Digital Toy Store UI Prototype

TwinkleBee is a high-fidelity interactive prototype of a digital toy store application developed for the Human-Computer Interaction course.

The application focuses on usability principles, interaction design and conversational interfaces.  
This project implements a front-end prototype only (data is simulated locally, no backend).

---

## 🎯 Project Objective

The goal of this project is to design and implement an interactive user interface for a digital toy store that enables:

- Advanced toy search using multiple criteria  
- Reservation and cart management  
- User authentication and profile management  
- Reservation status tracking  
- Rating system for completed reservations  
- Interaction with a text-based conversational agent  

The prototype follows usability heuristics and interaction design principles covered during the course.

---

## 🛍 Core Functionalities

### 🔎 Advanced Search

Users can search toys by:

- Name  
- Description  
- Type (puzzle, figure, character, book, etc.)  
- Age group  
- Target group (girl, boy, all)  
- Production date  
- Price  
- Reviews  

---

### 🛒 Reservation System

Users can:

- Reserve toys from a predefined catalog  
- View reserved items in the cart  
- Modify reservation data (if status = "Reserved")  
- Remove items (if status = "Arrived")  

Each toy contains:

- Name  
- Description  
- Type  
- Age group  
- Target group  
- Production date  
- Price  
- Reservation status:
  - Reserved  
  - Arrived  
  - Cancelled  
- Rating (only available when status is "Arrived")

The cart automatically calculates total price.

---

### 👤 User Authentication & Profile

The prototype simulates:

- User registration  
- Login  
- Profile editing (name, contact data, preferences)  

Access to reservation cart and checkout requires authentication.

---

### ⭐ Rating System

Users can rate only toys that:

- Were previously reserved  
- Have status "Arrived"  

Ratings are visually highlighted and clearly presented.

---

### 🤖 Conversational Agent (Chatbot)

The application includes a text-based conversational agent that:

- Can be activated from any page  
- Displays greeting message  
- Allows toy search via dialogue  
- Returns summarized toy information:
  - Name  
  - Description  
  - Type  
  - Age group  
  - Target group  
  - Production date  
  - Price  
  - Review summary  
- Provides link to toy details  
- Supports reservation through conversation  

The dialogue is implemented as a predefined interaction tree.

---

## 🌟 Additional Feature

### 🧶 Handmade Crochet Toy Reservation

TwinkleBee includes an additional reservation module for homemade crochet toys.

This feature allows users to:

- Browse handcrafted crochet toys  
- Reserve handmade products  
- Experience an extended and creative shopping flow  

This functionality extends the base project requirements and enhances the overall concept.

---

## 🛠 Technologies Used

- Angular  
- TypeScript  
- HTML / CSS  
- Local data simulation  
- Rasa-based chatbot structure (dialogue simulation)

---

## 🧠 UX & Design Focus

The prototype emphasizes:

- Visibility of system status  
- Clear feedback through toast notifications  
- Logical navigation structure  
- Route protection using guards  
- Consistent visual hierarchy  
- Error prevention in reservation flow  

---

## ⚠ Important Note

This is a high-fidelity UI prototype.  
No backend or persistent database is implemented.  
All application data is simulated locally for interaction purposes.

---

## 👩‍💻 Author

**Ksenija Raković**  
Software Engineering Student  
Focused on interaction design, usability principles and intelligent user interfaces.
