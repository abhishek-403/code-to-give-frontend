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
git clone https://github.com/yourusername/smarthanam-frontend.git
cd smarthanam-frontend
```
#### Backend
```sh
git clone https://github.com/yourusername/smarthanam-backend.git
cd smarthanam-backend
```

### 📦 Install Dependencies
#### Backend
```sh
cd smarthanam-backend
npm install
```
#### Frontend
```sh
cd smarthanam-frontend
npm install
```

### ⚙️ Configure Environment Variables
Create a `.env` file in both `backend` and `frontend` directories and configure required environment variables.

### ▶️ Run the Application
#### Backend
```sh
cd smarthanam-backend
npm run dev
```
#### Frontend
```sh
cd smarthanam-frontend
npm start
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
Include screenshots of the website here.

![🏠 Home Page](path/to/homepage-screenshot.png)
![📅 Event Management](path/to/event-management-screenshot.png)
![🙌 Volunteer Dashboard](path/to/volunteer-dashboard-screenshot.png)

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

