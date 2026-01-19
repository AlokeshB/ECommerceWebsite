// // Route Guard (Placeholder for Auth Logic)
// const ProtectedRoute = ({ children, role }) => {
//   const isAuthenticated = true; // Replace with actual AuthContext logic
//   const userRole = 'admin';     // Replace with actual user role from state
  
//   if (!isAuthenticated) return <Navigate to="/login" />;
//   if (role && role !== userRole) return <Navigate to="/" />;
//   return children;
// };