# Amite Email Backend (Node.js + Express + Nodemailer)

## ✅ What it does:
- Receives form submissions (from your Netlify frontend)
- Sends enquiry details to your Gmail using Nodemailer

## 🛠 How to Run Locally

1. Install Node.js and npm
2. Run the following commands:

```bash
npm install
npm start
```

## 🌐 Deploy Free on Render

1. Go to https://render.com/
2. Create new Web Service → Connect GitHub or Upload Manually
3. Use:
   - Build command: `npm install`
   - Start command: `npm start`

✅ Make sure to add these **Environment Variables** in Render:
- `EMAIL_USER` = your email
- `EMAIL_PASS` = your app password
- `EMAIL_TO`   = receiver email

## 📮 POST API Endpoint

```
POST /send-email
Content-Type: application/json

{
  "name": "Vishnu C",
  "type": "Mini Project",
  "reg": "1234",
  "phone": "9123456789",
  "email": "vishnu@gmail.com",
  "college": "MSEC",
  "city": "Chennai",
  "state": "TN",
  "queries": "Need smart bell project"
}
```

🚀 Done!