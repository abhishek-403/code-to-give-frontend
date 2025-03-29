# 🚀 Beyond Sight - Event & Volunteer Management System
<div style="text-align:center">
  <img src="https://github.com/user-attachments/assets/e63818ed-cef2-47d8-9845-443f650d3067" alt="Logo" style="width:200px"/>
</div>

## 🏢 Introduction
Samarthanam Trust for Disabled is dedicated to empowering individuals with disabilities through various initiatives. This project is a web-based application built using the **MERN stack**, designed to streamline event management and volunteer coordination while addressing critical accessibility and management challenges.

## 🚀 Live   
[![Live Demo](https://img.shields.io/badge/Live_Demo-Beyond_Sight-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://beyondsight.vercel.app/)

## Team 17 - Beyond Sight 👥👥
- Abhishek Sharma
- Ayush Tandon
- Garvit Singh
- Kirti Kumari
- Komal Meena
- Prajwal Tiwari

## Mentors 🤵
- **Sankaran Subramanian**  [LinkedIn](https://www.linkedin.com/in/sankaransubramanian/)

- **Kirthan G**   [LinkedIn](https://www.linkedin.com/in/kirthan-m-g-95330a91/)

## Round 1 Presentation
[![Watch Round 1 Presentation](https://img.shields.io/badge/Watch-Round_1_Presentation-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/_4XSa1-E96s?si=O81UrMng1o5ZiiR8)

## Round 2 Presentation  
[![Watch Round 2 Presentation](https://img.shields.io/badge/Watch-Round_2_Presentation-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/RuUWWiDcb0k)

## ✨ Features

### ♿ Inclusive by Design
- **Fully Accessible Digital Platform** – Screen reader compatibility, keyboard navigation, and high-contrast modes for visually impaired users
- **Multi-lingual Accessibility** – Supports English, Hindi, Kannada for diverse volunteers
- **Adaptive Reading Experience** – Adjustable font sizes and customizable display settings

### 📅 Seamless Event Management
- **Smart Event Creation** – Intuitive templates for different causes (sports, education, rehabilitation)
- **Real-Time Task Tracking** – Assign volunteers and track progress updates
- **Automated Feedback System** – Post-event surveys for continuous improvement
- **Event Calendar** with reminders and notifications

### 🙌 Volunteer Management
- **Dynamic Volunteer Forms** – Customizable fields based on event type
- **Automated Certificate Generation** – E-certificates upon task completion
- **Volunteer Analytics Dashboard** – Tracks participation trends and engagement metrics
- **Performance Insights** – Identifies top contributors and improvement areas

### 🔐 User Authentication & Role Management
- **Secure Authentication** using Firebase
- **Role-based Access Control** (Admin, Volunteer, Organizer)

## 🛠 Tech Stack
- **Frontend:** React.js, Redux, Tailwind CSS, TypeScript, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase
- **Deployment:** Vercel


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
![Screenshot 2025-03-26 225033](https://github.com/user-attachments/assets/1abd7994-8956-440f-852c-c77535d3b7a7)
![Screenshot 2025-03-29 124138](https://github.com/user-attachments/assets/f6450df5-f90c-403e-8a87-545515a6f241)
![Screenshot 2025-03-26 230503](https://github.com/user-attachments/assets/40659bc5-dc7d-4fb0-993b-91f60b5975d2)
![Screenshot 2025-03-26 225100](https://github.com/user-attachments/assets/d979e587-22da-4989-aabb-2450747231d5)
![Screenshot 2025-03-26 225456](https://github.com/user-attachments/assets/7574ee50-f58b-45ef-a0c3-93df50007bd8)
![Screenshot 2025-03-26 225205](https://github.com/user-attachments/assets/f15e4eb9-6b0b-474a-88a8-654a450eda14)
![image](https://github.com/user-attachments/assets/1a490024-ec7b-44fa-b105-a6daaacaf1e5)
![image](https://github.com/user-attachments/assets/0132c1ed-205e-4229-9cb6-77fef79da135)
![Screenshot 2025-03-26 230355](https://github.com/user-attachments/assets/8aa98f27-a84a-4293-b786-39c46112af9f)
![Screenshot 2025-03-26 160458](https://github.com/user-attachments/assets/aea5e56d-cbb0-4167-a998-3db0af90eff1)
![Screenshot 2025-03-26 225348](https://github.com/user-attachments/assets/46fa7550-22b7-41df-9cd6-400b91ea1670)



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

## 🤝 Contribution
We welcome contributions from the community. To contribute:
1. 🍴 Fork the repository
2. 🌱 Create a feature branch (`git checkout -b feature-xyz`)
3. ✏️ Commit your changes (`git commit -m 'Add feature xyz'`)
4. 🚀 Push to your branch (`git push origin feature-xyz`)
5. 📩 Open a pull request

## 📞 Contact
For any queries, reach out to us at **📧 info@samarthanam.org** or visit 🌍 [Samarthanam Trust](https://samarthanam.org/)

