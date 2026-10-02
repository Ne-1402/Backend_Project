import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ArticleList from "./pages/ArticleList";
import ArticleDetails from "./pages/ArticleDetails";
import ArticleForm from "./pages/ArticleForm";
import MyArticles from "./pages/MyArticles";
import EditorPanel from "./pages/EditorPanel";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/new" element={
          <ProtectedRoute roles={["author"]}><ArticleForm /></ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute roles={["author"]}><ArticleForm /></ProtectedRoute>
        } />
        <Route path="/my-articles" element={
          <ProtectedRoute roles={["author"]}><MyArticles /></ProtectedRoute>
        } />
        <Route path="/editor" element={
          <ProtectedRoute roles={["editor"]}><EditorPanel /></ProtectedRoute>
        } />
      </Routes>
    </>
  );
}