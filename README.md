# Money Manager - GUVI's Career Carnival Hackathon 2026 (Full Stack)

![Money Manager Banner](public/image.png)

## 🚀 Project Overview

**Money Manager** is a comprehensive full-stack financial management application designed to help users track their income, expenses, and overall financial health. Built for **GUVI's Career Carnival Hackathon 2026**, this project demonstrates a modern, responsive, and secure approach to personal finance.

## ✨ Key Features

- **📊 Interactive Dashboard:** Get a quick snapshot of your financial status with real-time summaries.
- **📈 Advanced Analytics:** Visualize your spending habits and income trends using beautiful interactive charts.
- **💸 Transaction Tracking:** Easily add, edit, and categorize income and expenses.
- **🏦 Account Management:** Manage multiple accounts and track balances in one place.
- **🔒 Secure Authentication:** Robust user authentication system to keep your data safe.
- **📱 Responsive Design:** Fully optimized for seamless use on desktop and mobile devices.

## 🛠️ Tech Stack

This project leverages a modern and powerful technology stack:

### Frontend

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** [Zod](https://zod.dev/)

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- MongoDB instance (local or Atlas)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd money-manager
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend` folder and add your configuration (e.g., PORT, MONGO_URI, JWT_SECRET).

```bash
# Example .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/money-manager
JWT_SECRET=your_super_secret_key
```

Start the backend server:

```bash
pnpm dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
pnpm install
```

Start the frontend development server:

```bash
pnpm dev
```

The application should now be running at `http://localhost:5173`.

## 👨‍💻 Team

Developed with ❤️ for GUVI's Career Carnival Hackathon 2026.
