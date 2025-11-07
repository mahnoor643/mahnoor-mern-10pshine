import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateNotes from "./pages/CreateNotes/CreateNotes";
import Notes from "./pages/Notes/Notes";
import Archive from "./pages/Archive/Archive";
import Locked from "./pages/Locked/Locked";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/archive"
        element={
          <ProtectedRoute>
            <Archive />
          </ProtectedRoute>
        }
      />
      <Route
        path="/locked"
        element={
          <ProtectedRoute>
            <Locked />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
