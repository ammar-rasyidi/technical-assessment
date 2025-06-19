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

Before running the app, ensure your environment meets the following:

- **Node.js**: Version `23.4.0`

---
