# OWASP Quiz Portal

A modern React + TailwindCSS frontend for an OWASP Quiz Portal with authentication system.

## Features

- **Authentication System**: Login and Signup pages with form validation
- **Protected Routes**: Quiz page is only accessible after successful authentication
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Form Handling**: Complete form validation and error handling
- **Password Visibility Toggle**: Eye icons for showing/hiding passwords
- **Demo Mode**: Accepts any credentials for demonstration purposes

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router DOM
- Context API for state management

## Project Structure

```
src/
├── auth/
│   ├── Login.jsx
│   └── Signup.jsx
├── components/
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── pages/
│   └── Quiz.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`

## Pages

- **`/login`** - Login page with roll number and password fields
- **`/signup`** - Signup page with all required fields
- **`/quiz`** - Protected quiz page (requires authentication)

## Demo Credentials

The application includes demo admin credentials:
- **Roll Number**: 102403070
- **Password**: admin123

Or you can use any credentials as the app accepts all inputs for demo purposes.

## Features Implemented

### Authentication
- Login and signup forms with validation
- Password confirmation matching
- Email format validation
- Form error handling
- Loading states during API calls

### UI/UX
- Responsive design for desktop and mobile
- Modern card-based layout
- Subtle gradient background
- Rounded corners and smooth transitions
- Hover effects on interactive elements

### Security
- Protected routes using React Router
- Authentication context for state management
- Local storage for session persistence
- Redirect to login if accessing protected routes

### Form Features
- Password visibility toggle
- Real-time form validation
- Error message display
- Loading states
- Demo credentials display

## API Integration

The app includes placeholder API calls to `https://example.com/api/login` and `https://example.com/api/signup`. For demo purposes, all requests are accepted regardless of credentials.

## Responsive Design

The application is fully responsive and works well on:
- Desktop screens (1024px+)
- Tablet screens (768px - 1023px)
- Mobile screens (320px - 767px)

## Customization

You can easily customize the app by:
- Modifying colors in `tailwind.config.js`
- Updating form validation rules
- Changing API endpoints in `AuthContext.jsx`
- Adding new pages and routes in `App.jsx`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

This project is for educational purposes and demo use.
