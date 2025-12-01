# Airtable-Connected Dynamic Form Builder

## Project Overview
This is a **full-stack MERN application** that allows users to create dynamic forms connected to Airtable. The application integrates **Airtable OAuth**, supports **conditional logic for form questions**, and saves responses to both **MongoDB** and **Airtable**. Additionally, the app syncs data using **Airtable Webhooks**, ensuring the database reflects real-time updates from Airtable.

The focus of this project is **correctness, data modeling, and business logic** rather than UI design.

---

## Live Demo
- **Frontend (React):** [https://airtable-brown.vercel.app/](https://airtable-brown.vercel.app/)  
- **Backend (Express + MongoDB):** [https://airtablebackend-wrf0.onrender.com/](https://airtablebackend-wrf0.onrender.com/)  
- **Demo Video:** [Watch Demo](https://drive.google.com/file/d/1Syj68ZypxfhIC61oyDoATuoIZzXV5-pS/view?usp=sharing)  

---

## Tech Stack
- **Frontend:** React.js  
- **Backend:** Node.js + Express  
- **Database:** MongoDB  
- **Authentication:** Airtable OAuth 2.0  
- **External API:** Airtable REST API + Webhooks  
- **Deployment:** Vercel (Frontend), Render (Backend)  

---

## Core Features

### 1. Airtable OAuth Login
- Users can log in via **Airtable OAuth**.  
- On successful login, the following is stored in MongoDB:
  - Airtable `userId` and basic profile
  - OAuth `accessToken` & `refreshToken`
  - Login timestamp  

### 2. Form Builder
Authenticated users can:
- Select an Airtable Base and Table from their account.  
- Fetch all fields from the table.  
- Include selected fields in the form.  
- Rename question labels (optional).  
- Mark fields as required or optional.  
- Define **conditional logic rules** for dynamic question visibility.  

Stored in MongoDB as a form schema:
- `formOwner`  
- `airtableBaseId`  
- `airtableTableId`  
- List of questions:
  - `questionKey` (internal)  
  - `airtableFieldId`  
  - `label`  
  - `type`  
  - `required`  
  - `conditionalRules`  

---

### 3. Supported Question Types
- Short text  
- Long text  
- Single select  
- Multi select  
- Attachment (file upload)  

> Unsupported Airtable field types are automatically rejected at the backend.

---

### 4. Conditional Logic
- Each question can have multiple conditions combined with `AND` or `OR`.  
- Conditional rules are evaluated via a **pure function**:

```ts
function shouldShowQuestion(
  rules: ConditionalRules | null,
  answersSoFar: Record<string, any>
): boolean
```

Environment Variables (.env.example)
```
# JWT Secret
JWT_SECRET=jwt_secret_here

# General App Settings
FOLDER_NAME=Airtable
PORT=4000

# MongoDB
MONGODB_URL=mongodb_connection_string_here

# Cloudinary (for attachments, if used)
CLOUD_NAME=cloud_name_here
API_KEY=cloud_api_key_here
API_SECRET=cloud_api_secret_here

# Airtable OAuth
AIRTABLE_CLIENT_ID=airtable_client_id_here
AIRTABLE_CLIENT_SECRET=airtable_client_secret_here
AIRTABLE_REDIRECT_URI=http://localhost:4000/api/v1/auth/callback

# Airtable API URLs
AIRTABLE_API_URL=https://api.airtable.com/v0
AIRTABLE_OAUTH_TOKEN_URL=https://airtable.com/oauth2/v1/token
AIRTABLE_AUTHORIZE_URL=https://airtable.com/oauth2/v1/authorize

# App URLs
FRONTEND_URL=https://airtable-brown.vercel.app
SERVER_BASE_URL=http://localhost:4000

# Airtable Webhook Secret
AIRTABLE_WEBHOOK_SECRET=airtable_webhook_secret_here
```
Setup Instructions
Backend

1. Clone the repository and navigate to /backend.

2. Install dependencies:
 ```
 npm install
```
3.Create .env from .env.example and fill your credentials.
4.Start the server:
```
npm start
```
5. The backend runs on the configured port (default: 5000).

Frontend

1.Navigate to /frontend.

2.Install dependencies:
```
npm install
```
3. Configure frontend .env if needed (Airtable redirect URI, backend URL).
4. Start the frontend:
   ```
   npm start
   ```
5. Access the app on http://localhost:3000.

License

This project is for educational purposes and interview evaluation.
