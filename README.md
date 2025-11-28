# Overview

The Personal Finance Manager is a web application I developed to practice and strengthen my full-stack development skills while creating a tool that helps users manage their finances more easily. The application lets users create an account, log in securely, and track their income, expenses, budgets, and savings goals. All data is stored in a cloud-hosted database so users can access their records anytime.

The program workflow is straightforward:  
1. Create an account or log in with your existing credentials.  
2. Add income and expense entries to track your financial activity.  
3. Set budgets and savings goals.  
4. View summaries such as total income, total expenses, remaining balance, and savings progress.

I built this software to improve my understanding of full-stack development using Node.js and Express, and to gain real experience working with MongoDB Atlas for cloud database storage and retrieval.

<!-- [Software Demo Video](http://youtube.link.goes.here) -->

# Cloud Database

This project uses **MongoDB Atlas** as its cloud database solution. Using Atlas’ free-tier cluster, the application stores and retrieves financial data securely and reliably from the cloud.

### Database Structure:
- **users**: Contains user accounts with hashed passwords for authentication.  
- **transactions**: Stores income and expense entries linked to a user account.  
- **budgets**: Manages spending limits categorized by type or time period.  
- **savings**: Holds user-created savings goals with both current and target amounts.

The application fully supports CRUD operations:
- **Create**: Add new users, transactions, budgets, or savings goals.  
- **Read**: Retrieve all user-specific financial information.  
- **Update**: Modify transactions, adjust budgets, or change savings progress.  
- **Delete**: Remove records when they are no longer needed.

# Development Environment

- **Backend**: Node.js with Express.js for server logic and API endpoints.  
- **Database**: MongoDB Atlas (cloud-hosted NoSQL database).  
- **Frontend**: EJS templates with HTML, CSS, and JavaScript.  
- **Authentication**: JWT (JSON Web Tokens) and bcrypt for secure password hashing.

I developed and tested the application using VS Code, Node.js, and the MongoDB Atlas dashboard.

# Useful Websites

- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)  
- [Node.js Documentation](https://nodejs.org/en/docs/)  
- [Express.js Guide](https://expressjs.com/)  
- [JWT.io](https://jwt.io/)  
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)

# Future Work

- Integrate visual dashboards using charts and graphs for better insights.  
- Upgrade the UI/UX using a modern frontend framework (React or Vue).  
- Add reminders or notifications for budgets and upcoming bills.  
- Support multiple currencies.  
- Possibly add multi-user or household account roles.  
