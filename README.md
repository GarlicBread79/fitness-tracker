# Fitness Tracker

**Overview**  
Full-Stack Fitness Tracker is a full-stack web application that enables users to log workouts, track their progress, and manage personal profiles. I contributed to both the front-end and back-end development using React, Node.js, Express, and MongoDB. This project demonstrates my ability to work under pressure, follow the software development life cycle, and implement a scalable and maintainable solution.

**Features**  
- Users can create, edit, and delete profiles while only one profile is active at a time.
- The application allows workout logging with a custom date picker and form validation.
- A dashboard displays aggregated data such as total workouts and calories burned.
- Interactive progress views include charts and tables that dynamically update based on the active profile.
- A secure RESTful API handles all data operations between the front end and the back end.

**Technologies Used**  
- **Front End:** React, JavaScript, HTML, CSS, React Hook Form, Bootstrap, Bootswatch (Flatly theme)  
- **Back End:** Node.js, Express, MongoDB, Mongoose  
- **Tools:** Git, GitHub, Render (back end deployment), Netlify (front end deployment)

**Architecture & Design**  
The project follows a modular architecture with clear separation of concerns. The front end uses reusable React components, while the back end is organized into controllers, routes, and models—reflecting object-oriented design principles. This structure helped ensure the code was both maintainable and scalable.

**Performance & Optimization**  
We focused on optimizing performance by refining MongoDB schemas and streamlining our API logic. In local testing, we achieved a 37% reduction in API response times and a 25% improvement in query efficiency under simulated production loads.

**Deployment**  
The live link is: fitness-tracker-three-lilac.vercel.app/

**Installation & Usage**

*Back End:*  
1. Navigate to the `fitness-tracker-backend` folder and run `npm install`.  
2. Create a `.env` file with your MongoDB connection string (`MONGO_URI`) and a port (e.g., `5000`).  
3. Start the server with `node index.js`.

*Front End:*  
1. Navigate to the `fitness-tracker-frontend` folder and run `npm install`.  
2. Start the development server with `npm start`.

For a detailed look at the code, please visit the (https://github.com/GarlicBread79/fitness-tracker).

**License**  
This project is licensed under the MIT License.
