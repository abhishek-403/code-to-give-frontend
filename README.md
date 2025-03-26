# 🚀 Smarthanam Trust - Event & Volunteer Management System

## 🏢 Introduction
Smarthanam Trust for Disabled is dedicated to empowering individuals with disabilities through various initiatives. This project is a web-based application built using the **MERN (MongoDB, Express, React, Node.js) stack**, designed to streamline event management and volunteer coordination.

## ✨ Features
- **📅 Event Management**
  - ✅ Create, update, and delete events
  - 📊 Track event registrations and attendance
  - 🛎️ Event calendar with reminders
  
- **🙌 Volunteer Management**
  - 📝 Volunteer registration and profile management
  - 🔗 Assign volunteers to events
  - ⏳ Track volunteer hours and contributions

- **🔐 User Authentication & Role Management**
  - 🔑 Secure authentication (JWT-based login/signup)
  - 👤 Role-based access control (Admin, Volunteer, Organizer)

- **📢 Communication & Notifications**
  - 📧 Email and SMS notifications for event updates
  - 📣 Announcements and volunteer opportunities

## 🛠 Tech Stack
- **Frontend:** React.js, Redux, Tailwind CSS, TypeScript, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Token (JWT)
- **Deployment:** Docker, AWS/GCP, CI/CD with GitHub Actions

## 🚀 Installation & Setup
### 📌 Prerequisites
Ensure you have the following installed:
- 🟢 Node.js & npm
- 🍃 MongoDB (local or cloud-based like MongoDB Atlas)
- 🔗 Git

### 📥 Clone the Repositories
#### Frontend
```sh
git clone https://github.com/abhishek-403/code-to-give-frontend
cd code-to-give-frontend
```
#### Backend
```sh
git clone https://github.com/abhishek-403/code-to-give-backend
cd code-to-give-backend
```

### 📦 Install Dependencies
#### Backend
```sh
cd code-to-give-backend
npm install
```
#### Frontend
```sh
cd code-to-give-frontend
npm install
```

### ⚙️ Configure Environment Variables
Create a `.env` file in both `backend` and `frontend` directories and configure required environment variables.

### ▶️ Run the Application in development mode
#### Backend
```sh
cd code-to-give-backend
npm run dev
```
#### Frontend
```sh
cd code-to-give-frontend
npm run dev
```

## 📡 API Endpoints
| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| 🟢 GET    | /api/events            | Fetch all events                    |
| 🟠 POST   | /api/events            | Create a new event                  |
| 🟢 GET    | /api/volunteers        | Fetch all volunteers                |
| 🟠 POST   | /api/volunteers        | Register a new volunteer            |
| 🔑 POST   | /api/auth/login        | User login                          |

## 🖼 Screenshots

![Login/Register Page](https://github.com/user-attachments/assets/96368193-41a2-4028-a4b0-422185d7792d)
![Home Page](https://github.com/user-attachments/assets/8b80a7e6-8786-4498-af5e-431e1c2aa10c)
![Contact Us](https://github.com/user-attachments/assets/85fb48b7-9ea1-4630-a5fa-5e82f77c35b7)
![User Profile](https://github.com/user-attachments/assets/4e50dee4-a134-40e1-bc6f-af92e9093d0f)
![Admin View](https://github.com/user-attachments/assets/73ef987d-e860-4fe5-bd49-38efc40d25a6)


## ⚡ React + TypeScript + Vite Setup
This project uses React with TypeScript and Vite for a fast and modern development experience.

### 🔧 Expanding ESLint Configuration
For a production-level application, enhance ESLint settings to enable type-aware lint rules:
```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Additionally, install and configure React-specific ESLint plugins:
```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## 🛤 Roadmap
- [ ] 🔍 Implement advanced search and filtering for events
- [ ] 💬 Add real-time chat feature for volunteers and organizers
- [ ] 📱 Mobile app version for volunteers
- [ ] 💰 Integration with payment gateway for donations

## 🤝 Contribution
We welcome contributions from the community. To contribute:
1. 🍴 Fork the repository
2. 🌱 Create a feature branch (`git checkout -b feature-xyz`)
3. ✏️ Commit your changes (`git commit -m 'Add feature xyz'`)
4. 🚀 Push to your branch (`git push origin feature-xyz`)
5. 📩 Open a pull request

## 📜 License
This project is licensed under the MIT License.

## 📞 Contact
For any queries, reach out to us at **📧 contact@smarthanamtrust.org** or visit 🌍 [Smarthanam Trust](https://www.smarthanamtrust.org).

