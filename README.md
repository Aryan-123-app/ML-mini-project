<!-- @format -->

# 📈 Trader's Street

**AI-powered stock market analytics & LSTM-based index prediction platform for Indian markets.**

Final year B.Tech (Computer Science) major project by **Aryan Patade** — a full-stack web application that combines real-time-style financial charting, custom-trained LSTM deep learning models for market index predictions, live financial news aggregation, and curated video commentary, all in a responsive unified dashboard.

> ⚠️ **Disclaimer:** Predictions are generated for educational and research purposes only and do not constitute financial advice.

---

## ✨ Features

- **Live & Historical Stock Charts** — Interactive, zoomable price charts (via Chart.js and `chartjs-chart-financial`) for major Indian stocks (e.g. RELIANCE, TCS, HDFCBANK) with candlestick/line views, high/low tracking, and tabular data inspection.
- **LSTM Deep Learning Index Predictions** — Multi-feature LSTM models for 5 major market indices:
  - **Nifty 50** (`^NSEI`)
  - **Nifty Bank** (`^NSEBANK`)
  - **Nifty IT** (`^CNXIT`)
  - **Nifty Auto** (`^CNXAUTO`)
  - **Nifty Next 50** (`^NSMIDCP`)
- **Interactive 60-Day Data Pipeline** — Inspect the exact 60-day historical time-series sequence feeding the model, and submit custom adjustments to see simulated prediction responses.
- **Personalized Watchlist** — Authenticated users can save, monitor, and remove preferred stocks.
- **Financial News Aggregator** — Real-time searchable financial news feed pulled from top Indian publications (Economic Times, Mint, NDTV Profit, Business Standard, Moneycontrol).
- **Market Commentary Vlogs** — Curated YouTube technical analysis and market summary videos embedded directly in the platform.
- **Authentication & Security** — Secure JWT authentication with bcrypt password hashing, session tokens, and OTP-based email verification via Nodemailer.
- **Dark & Light Mode** — Seamless theme toggle support.
- **Mobile Responsive** — Fully adaptive layout with a dedicated mobile drawer and desktop navigation.

---

## 🛠️ Tech Stack

### Frontend

- **React 18** + **Vite**
- **Chart.js** & **react-chartjs-2** (with `chartjs-adapter-date-fns` and `chartjs-chart-financial`)
- **React Router 7**
- **Lucide React** (icons)
- **Axios**

### Backend

- **Node.js** & **Express 5**
- **MongoDB** & **Mongoose**
- **JWT** (`jsonwebtoken`) & **bcryptjs**
- **Nodemailer** (OTP verification & email services)

### Machine Learning & Data Pipeline

- **Python 3.11+ / 3.13**
- **TensorFlow** / **Keras 3** (LSTM Recurrent Neural Networks)
- **scikit-learn** (`MinMaxScaler` for multi-feature scaling)
- **Flask** & **Flask-CORS** (REST API microservice for serving predictions)
- **yfinance** (Automated ETL data ingestion from Yahoo Finance)
- **PyMongo** & **python-dotenv**

---

## 📁 Project Structure

```text
Trader-street/
├── ML_model/
│   ├── train_models.py       # Trains LSTM models & generates .h5 weights and scalers
│   ├── predict_server.py     # Flask REST API serving real-time predictions on port 5000
│   ├── Nifty_50/             # Nifty 50 model weights (.h5) & scalers (.pkl)
│   ├── Nifty_bank/           # Nifty Bank model weights (.h5) & scalers (.pkl)
│   ├── Nifty_IT/             # Nifty IT model weights (.h5) & scalers (.pkl)
│   ├── Nifty_auto/           # Nifty Auto model weights (.h5) & scalers (.pkl)
│   └── Nifty_next/           # Nifty Next 50 model weights (.h5) & scalers (.pkl)
├── backend/
│   ├── config/               # Database connection
│   ├── controllers/          # Auth, user, and news controllers
│   ├── middleware/           # JWT authentication middleware
│   ├── model/                # Mongoose models & prediction proxy service
│   ├── routes/               # API routes
│   └── server.js             # Express application entry point (port 5001 / 8080)
├── data_Pipeline/
│   ├── db_connection.py      # MongoDB client configuration
│   ├── For_whole_stock_data/ # Scripts for fetching broad market stock datasets
│   └── Model_stock_data/     # Scripts for inserting 60-day index sequence data
├── frontend/
│   ├── src/                  # React components, pages, context, and styles
│   ├── package.json
│   └── vite.config.js
├── activate.ps1              # PowerShell virtual environment activation helper
├── package.json
└── requirements.txt          # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) & **npm**
- **Python** (v3.10+) with `pip`
- **MongoDB** instance (local or MongoDB Atlas connection string)

---

### 1. Environment Configuration

Create a `.env` file in the root directory (and inside `backend/.env`):

```env
db_username=your_db_username`
db_password=your_db_password
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password
```

---

### 2. Backend Setup

```bash
cd backend
npm install
node server.js
```

The backend server will start listening for API requests.

---

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 4. Machine Learning & Prediction Server Setup

In a new terminal at the project root:

1. **Activate the Python virtual environment:**

   ```powershell
   .\activate.ps1
   # Or: venv\Scripts\activate
   ```

2. **Install required Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Fetch recent index data & train the LSTM models:**

   ```bash
   # Ingest latest 60+ trading days into MongoDB:
   python data_Pipeline/Model_stock_data/modeldatainsert.py

   # Train and export all 5 index LSTM models & scalers:
   python ML_model/train_models.py
   ```

4. **Start the Flask prediction server:**
   ```bash
   python ML_model/predict_server.py
   ```
   The Flask server will start on **`http://localhost:5000`**.

---

## 📡 Prediction API Endpoints

| Method | Endpoint               | Description                                                                                                                             |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/`                    | API status and available endpoints summary                                                                                              |
| `GET`  | `/health`              | Health check and list of loaded ML models                                                                                               |
| `GET`  | `/predict/<model_key>` | Returns predicted next close price and 60-day history for the given index (`nifty50`, `niftybank`, `niftyit`, `niftyauto`, `niftynext`) |
| `POST` | `/predict/<model_key>` | Accepts custom 60-row payload `{ "rows": [...] }` and returns real-time model prediction                                                |

## ☁️ Deployment (Vercel + Render)

1. Push this repository to GitHub and create a Render Blueprint from it. Render reads `render.yaml` to create the Node API and Python ML services. Enter the same MongoDB Atlas `MONGO_URI` for both services and provide `EMAIL_USER` and `EMAIL_PASSWORD` for the API's OTP email feature. Render generates `JWT_SECRET` and connects the API to the ML service.
2. Deploy `frontend/` as a Vercel project. Set `VITE_API_URL` to the public URL of the Render API service, for example `https://trader-street-api.onrender.com`, then redeploy the frontend.
3. Use the Render API URL to check `/` and `/health`; use the frontend's Vercel URL to open the app.

The ML service loads TensorFlow and all five models at startup, so it may exceed the memory available on a free instance. Upgrade that Render service if its deployment logs show an out-of-memory failure. Do not put credentials in the repository; rotate any credentials previously committed in source code.

---

## 📬 Contact & Credits

- **Author:** Aryan Patade
- **Email:** [aryanpatade8@gmail.com](mailto:aryanpatade8@gmail.com)
- **Project:** Final Year B.Tech Computer Science Major Project

---

## 📄 License

This project is licensed for educational and academic demonstration purposes.
