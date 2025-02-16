# MASKoff

MASKoff is a full-stack MERN job platform that combines job searching with community engagement and messaging features. The app empowers job seekers and employers by offering customizable profiles, secure real-time messaging, community posts, and integrated interview scheduling—all with robust role-based authentication.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Stories](#user-stories)
- [Wireframe](#wireframe)
- [Model (ERD)](#model-erd)
- [API Routes](#api-routes)
- [Express Auth](#express-auth)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Attributions](#attributions)
- [Contact](#contact)

---

## Overview

MASKoff is designed to reduce bias in the hiring process while empowering both job seekers and employers. The platform supports three types of logins:

- **User:** Job seekers with customizable profiles. Anyone can post jobs and apply for jobs
- **Admin:** Overseers with management and moderation capabilities, among all User rights. (Admin Login in the backend-EJS)

Key functionalities include:
- **Community Posts & Comments:** Users can create, read, update, and delete posts and comments. -> Community tab -> MASKoff -> Community? 
- **Anonymous Posts & Comments:** Users can create, read, update, and delete posts and comments. -> Introduction tab/feed -> MASKon ?
- **Direct Messaging:** Secure, encrypted real-time chat between users.
- **Profile Privacy:** Users can choose which parts of their profile to share on a per-application basis.
- **Job Posting & Interview Scheduling:** Users can post job opportunities and set up interviews via an integrated calendar.

---

## Features

- **Authentication & Role-Based Access**
  - Multi-role login (User, Admin)
  - JWT-based authentication and secure password handling via bcrypt

- **User Profile Customization**
  - Customizable profiles with per-application privacy settings
  - Tailored view for users that post jobs

- **Community Posts & Comments**
  - Full CRUD functionality for posts and comments
  - Seamless navigation between list and details pages

- **Direct Messaging**
  - End-to-end encryption for messages using AES encryption
  - CRUD operations on chat messages (send, update, delete)

- **Job Posting & Interview Scheduling**
  - Dedicated interfaces for job postings
  - Integrated calendar for scheduling interviews

- **Security & Scalability**
  - RESTful API built with Node.js and Express
  - MongoDB for data persistence
  - Comprehensive error handling and response codes

---

## User Stories

- **Account Management**
  - *As a guest,* I should be able to create an account so that I can access MASKoff features.
  - *As a new user,* I should be able to log in to my account and receive a JWT token to access protected routes.
  - *As a user,* I should be able to log out, which will remove my token and end my session.

- **Profile Customization**
  - *As a user,* I should be able to update my profile details, including selecting which information to share for specific job applications.
  - *As a user,* I should be able to view my profile with both public and private sections clearly separated.

- **Community Engagement**
  - *As a user,* I should be able to **create** a community post.
  - *As a user,* I should be able to view a **list** of all community posts on a “List” page.
  - *As a user,* clicking on a post in the “List” page should navigate me to a post’s **“Details”** page, where I can see the full content and any associated comments.
  - *As a user,* I should be able to add, edit, and delete comments on posts.
  - *As the author of a post,* I should see options to **edit** or **delete** my post.

- **Job Posting & Interview Scheduling**
  - *As a user,* I should be able to create and manage job posts.
  - *As a user,* I should be able to schedule interviews through an integrated calendar.
  - *As a user,* I should be able to apply for jobs while keeping certain profile details private.

- **Direct Messaging**
  - *As a user,* I should be able to send, receive, update, and delete messages in a real-time chat interface.
  - *As a user,* I should have my messages encrypted using AES encryption for security.

- **Administrative Functions**
  - *As an admin,* I should be able to monitor and manage users, posts, and messages for moderation purposes.
  - *As an admin,* I should have the ability to restrict or remove content that violates community guidelines.

---

## Wireframe

### React Router

| URI                       | Use Case                                              |
| ------------------------- | ----------------------------------------------------- |
| `/signup`                 | Form to create a new account                          |
| `/login`                  | Log in to the system                                  |
| `/home`                   | Landing page and community post feed                  |
| `/posts/new`              | Form to create a new community post                   |
| `/posts`                  | List all community posts                              |
| `/posts/:postId`          | View a single post (Details page)                     |
| `/posts/:postId/edit`     | Edit a post                                           |
| `/posts/:postId/comments` | Create a comment on a post                            |
| `/jobs/new`               | Form to create a new job post                         |
| `/jobs`                   | List all job posts                                    |
| `/jobs/:jobId`            | View details of a specific job post                   |
| `/messages`               | List direct messages                                  |
| `/messages/:chatId`       | View a chat conversation                              |


### Components & Architecture

- **Pages:** Components mapped to routes (signup, login, home, posts, jobs, messages).
- **Components:** 
  - **State/Props:** Managed via React hooks (`useState`, `useEffect`, Context API).
  - **Data Fetching:** 
    - On page load using `useEffect`
    - On interactions (e.g., button clicks) using event handlers.
- **Forms:** Implemented as controlled components.
- **Services:** API calls via Axios.

---

## Model (ERD)

### User

| id  | username | password | role      |
| --- | -------- | -------- | --------- |
| 001 | manzo    | ****     | admin     |
| 002 | ken      | ****     | user      |
| 003 | shawn    | ****     | user      |

### Post (Community Post)

| id  | title         | content                    | author | comments |
| --- | ------------- | -------------------------- | ------ | -------- |
| 101 | First Post    | This is my first post      | 003    | []       |

### Job Post

| id  | title             | description             | employer | applicants |
| --- | ----------------- | ----------------------- | -------- | ---------- |
| 201 | Software Engineer | Looking for developers  | 002      | []         |

### Chat Message (Embedded in ChatLog)

| id  | sender | recipient | message content         | timestamp  |
| --- | ------ | --------- | ----------------------- | ---------- |
| 301 | 003    | 002       | Hi, I am interested.    | 2025-02-12 |

---

## API Routes

## API Routes

| HTTP Method | Controller          | Response Codes                              | Request Body Example                                                      | URI                                   | Use Case                                                                 |
| ----------- | ------------------- | ------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------ |
| POST        | createUser          | **201:** User registered successfully<br>**400:** Missing fields<br>**409:** Username already taken<br>**500:** Server error | `{ "username": "exampleUser", "password": "StrongPassword123!" }`          | `/api/newuser`                        | Create a new user account                                                |
| POST        | loginUser           | **200:** Login successful<br>**400:** Missing credentials<br>**404:** User not found<br>**401:** Invalid credentials<br>**500:** Server error | `{ "username": "exampleUser", "password": "StrongPassword123!" }`          | `/api/users/login`                    | Log in an existing user                                                  |
| GET         | fetchUserData       | **200:** User data retrieved<br>**403:** Access denied<br>**404:** User not found<br>**500:** Server error | N/A                                                                       | `/api/user/:userID`                   | Fetch user data (protected route)                                        |
| GET         | retrieveAllUsers    | **200:** Users retrieved<br>**500:** Server error | N/A                                                                       | `/api/users`                          | List all users                                                           |
| POST        | startChat           | **200:** Chat created successfully<br>**500:** Server error | `{ "participantId": "otherUserId" }`                                       | `/api/chat/create`                    | Create a chat log between users                                          |
| POST        | sendMessage         | **200:** Message sent successfully<br>**400:** Chat ID and message required<br>**404:** Chat not found<br>**403:** Not authorized<br>**500:** Server error | `{ "chatId": "chatId", "message": "Hello!" }`                             | `/api/chat/send`                      | Send a message in an existing chat                                       |
| GET         | findChats           | **200:** Chats retrieved<br>**500:** Server error | N/A                                                                       | `/api/chat/:userId`                   | Retrieve all chat logs that include the specified user                   |
| GET         | seeChatLog          | **200:** Chat messages retrieved<br>**404:** Chat log not found<br>**500:** Server error | N/A                                                                       | `/api/chat/messages/:chatId`          | Get decrypted chat messages                                              |
| DELETE      | deleteMessage       | **200/204:** Message deleted<br>**404:** Chat/message not found<br>**500:** Server error | N/A                                                                       | `/api/chat/message/:chatId/:messageId` | Delete a specific message (only by the sender)                           |
| DELETE      | deleteChatLog       | **200/204:** Chat log deleted<br>**404:** Chat log not found<br>**500:** Server error | N/A                                                                       | `/api/chat/:chatId`                   | Delete an entire chat log                                                |
| POST        | friendRequest       | **200:** Friend request sent<br>**400:** Missing target user ID or request already sent<br>**404:** Target user not found<br>**500:** Server error | `{ "targetUserId": "userId" }`                                             | `/api/friends/request`                | Send a friend request                                                    |
| DELETE      | deleteFriendRequest | **200:** Friend request canceled/declined successfully<br>**400:** Missing target user ID or no pending request<br>**404:** Target user not found<br>**500:** Server error | `{ "targetUserId": "userId" }`                                             | `/api/friends/request`                | Cancel/decline a pending friend request                                  |
| GET         | retrieveFriendRequests | **200:** Friend requests retrieved<br>**500:** Server error | N/A                                                                       | `/api/friends/requests`               | Retrieve incoming friend requests                                      |
| POST        | acceptFriend        | **200:** Friend request accepted<br>**400:** Missing requester ID or no friend request<br>**500:** Server error | `{ "requesterId": "userId" }`                                              | `/api/friends/accept`                 | Accept a friend request                                                  |
| GET         | fetchFriends        | **200:** Friend list retrieved<br>**500:** Server error | N/A                                                                       | `/api/friends`                        | Get the friend list for the logged in user                               |
| POST        | createPost          | **201:** Post created successfully<br>**400:** Title and content required<br>**500:** Server error | `{ "title": "Post Title", "content": "Post content" }`                     | `/api/posts`                          | Create a new community post                                              |
| GET         | getPosts            | **200:** Posts retrieved<br>**500:** Server error | N/A                                                                       | `/api/posts`                          | Retrieve all community posts                                             |
| GET         | getPost             | **200:** Post retrieved<br>**404:** Post not found<br>**500:** Server error | N/A                                                                       | `/api/posts/:postId`                  | Retrieve a single community post                                         |
| PUT         | updatePost          | **200:** Post updated successfully<br>**404:** Post not found<br>**403:** Not authorized<br>**500:** Server error | `{ "title": "Updated title", "content": "Updated content" }`               | `/api/posts/:postId`                  | Update a community post (only by the author)                             |
| DELETE      | deletePost          | **200:** Post deleted successfully<br>**404:** Post not found<br>**403:** Not authorized<br>**500:** Server error | N/A                                                                       | `/api/posts/:postId`                  | Delete a community post (only by the author)                             |
| POST        | addComment          | **201:** Comment added successfully<br>**400:** Comment content required<br>**404:** Post not found<br>**500:** Server error | `{ "content": "Comment content" }`                                         | `/api/posts/:postId/comments`         | Add a comment to a community post                                        |
| POST        | createJob           | **201:** Job post created successfully<br>**400:** Title and description required<br>**500:** Server error | `{ "title": "Job Title", "description": "Job description" }`               | `/api/jobs`                           | Create a new job post (by any user)                                      |
| GET         | getJobs             | **200:** Job posts retrieved<br>**500:** Server error | N/A                                                                       | `/api/jobs`                           | Retrieve all job posts                                                   |
| GET         | getJob              | **200:** Job post retrieved<br>**404:** Job post not found<br>**500:** Server error | N/A                                                                       | `/api/jobs/:jobId`                    | Retrieve a specific job post                                             |
| PUT         | updateJob           | **200:** Job post updated successfully<br>**404:** Job post not found<br>**403:** Not authorized<br>**500:** Server error | `{ "title": "Updated title", "description": "Updated description" }`       | `/api/jobs/:jobId`                    | Update a job post (only by the employer who posted it)                   |
| DELETE      | deleteJob           | **200:** Job post deleted successfully<br>**404:** Job post not found<br>**403:** Not authorized<br>**500:** Server error | N/A                                                                       | `/api/jobs/:jobId`                    | Delete a job post (only by the employer who posted it)                   |
| POST        | postIntroduction    | **201:** Introduction posted successfully<br>**400:** Content required<br>**500:** Server error | `{ "content": "Introduction content" }`                                  | `/api/introduction`                   | Post an anonymous introduction                                           |
| GET         | getIntroductions    | **200:** Introductions retrieved<br>**500:** Server error | N/A                                                                       | `/api/introductions`                  | Retrieve all anonymous introductions                                   |


---

## Express Auth

### User Registration

- **Endpoint:** `POST /api/newuser`
- **Purpose:** Create a new user account.
- **Request Body:**
  ```json
  {
    "username": "exampleUser",
    "password": "StrongPassword123!"
  }

---

## Tech Stack

### Front-end:
- React: For building dynamic user interfaces.
- HeroUI: Pre-styled components (Navbar, Buttons, Inputs, etc.).
- Tailwind CSS & Tailwind-Variants: For responsive styling.
- React Router: For client-side routing.
- Custom Hooks & Context API: For state and theme management.

### Back-end:
- Node.js & Express: RESTful API server.
- MongoDB & Mongoose: Database and schema management.
- JWT & bcrypt: For authentication and password security.
- AES Encryption: For secure messaging in chats.

### Other Tools & Libraries:
- Axios: For API calls.
- clsx: For conditional class names.
- Concurrently: To run client and server concurrently.
- dotenv & nodemon: For environment variable management and auto-reloading.