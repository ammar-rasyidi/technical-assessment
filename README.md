# 🧪 Assessment Test – Transactions App

This is a short skill test to demonstrate your full-stack development capabilities.

Please refer to the original requirements here:  
🔗 [Assessment Repository](https://bitbucket.org/review04/demo-build/src/main/)

---

### Demo videos

**Desktop version :**  
https://drive.google.com/file/d/1RPpMXUuMV-ArJAMijXAIgmM0avoD-1jt/view?usp=sharing

**Mobile version :**  
https://drive.google.com/file/d/1RPpMXUuMV-ArJAMijXAIgmM0avoD-1jt/view?usp=sharing


## 📌 App Test Requirements

### 1️⃣ Backend

**Route:**  
`api/transactions` — for handling transaction-related requests.

**Features:**

1. Implement full **CRUD** operations (Create, Read, Update, Delete).
2. Handle at least **three types of transactions**:
   - `Stake`
   - `Borrow`
   - `Lend`
3. Use **mock data** or a **simple database** (e.g., in-memory store or lightweight DB).

**Each transaction should include:**

- `id`
- `username`
- `transactionType` (Stake, Borrow, Lend)
- `token` (e.g., ETH, USDC, DAI)
- `amount`
- `date`
- _(Optional)_ `status`
- _(Optional)_ `description`

---

### 2️⃣ Frontend

**Route:**  
`/transactions` — to display and manage user transactions.

**Features:**

- Display mock or API-based user transactions (Stake, Borrow, Lend).
- Render a **data table** with the following columns:
  - Username
  - Transaction Type
  - Token (e.g., ETH, USDC, DAI)
  - Amount
  - Date
- Add **filter controls** (dropdown or buttons) to filter by transaction type (Stake, Borrow, Lend).
- Filters should dynamically update the displayed data.
- Use **Tailwind CSS** or **plain CSS**.
  - Must be **responsive**
  - Apply **alternating row colors** for readability

---

## 🛠️ System Requirements

Before running the app, make sure your system is set up with the following:

- **Node.js**: Version `23.4.0`  
- **MongoDB**: Local instance running at default port `27017`

**env Setup**
Create a `.env` file in the root directory and add the following:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=technical_assessment
MONGODB_USER=
MONGODB_PASSWORD=
```
MONGODB_USER and MONGODB_PASSWORD can be left empty for local development without authentication.

## 🌱 Seeding the Database

To populate the database with sample transactions, run:

```bash
npm run seed
```

This will:

* Connect to your local **MongoDB**
* Clear all existing transactions
* Insert **50 random transactions** with varying:

  * Types (`Stake`, `Borrow`, `Lend`)
  * Tokens (`ETH`, `USDC`, `DAI`, etc.)
  * Statuses (`pending`, `completed`, `failed`)
  * Descriptions

---

## ▶️ Getting Started

### Install dependencies:

```bash
npm install
```

### Run the development server:

```bash
npm run dev
```

The app should be accessible at:

```
http://localhost:3000
```
