# DevHub

DevHub is a full-stack social networking platform designed for developers and engineers to connect, send and accept connection requests, and interact through a dynamic feed. The platform is built for scalability, offering features such as real-time chat, AI-generated profile recommendations, and advanced user authentication.

## Features

- **User Authentication:** Secure authentication using JWT.
- **Profile Management:** Users can update their profiles with details such as name, age, gender, skills, and an AI-generated "About Me" section.
- **AI-Powered Profile Assistance:** AI assistant recommends the "About Me" section based on user profile and input.
- **Connection System:** Send and accept connection requests.
- **Dynamic Feed:** Users can suggestions of different user's profile.
- **Real-Time Chat:** Instant messaging with WebSockets.
- **Email Notifications:** AWS SES is used for sending emails.
- **Cron Jobs:** Scheduled background tasks.
- **Scalability:** MongoDB indexing and pagination for efficient data retrieval.
- **Deployment:** Hosted on AWS EC2 with Nginx reverse proxy.

## Tech Stack

### [Frontend](https://github.com/yadivyanshu/devHub-UI)  
- React.js
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Groq API (AI Features)

### Backend
- Node.js (Express.js)
- MongoDB (Database)
- WebSockets (Real-Time Chat)
- AWS SES (Email Notifications)
- Redis (Session Management, Not inc. in main branch)
- PM2 (Process Management)

## Contributions
Feel free to submit issues and pull requests to improve DevHub!
