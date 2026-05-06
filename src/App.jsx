import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/Guards/ProtectedRoute';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import CompleteProfilePage from './pages/Register/CompleteProfilePage';
import HomePage, { HomeRedirect } from './pages/Home/HomePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';

// Lazy load feature pages for code splitting
import { lazy, Suspense } from 'react';
import Loader from './components/UI/Loader';

const TodosPage = lazy(() => import('./pages/Todos/TodosPage'));
const PostsPage = lazy(() => import('./pages/Posts/PostsPage'));
const PostDetail = lazy(() => import('./pages/Posts/PostDetail'));
const AlbumsPage = lazy(() => import('./pages/Albums/AlbumsPage'));
const AlbumPhotos = lazy(() => import('./pages/Albums/AlbumPhotos'));

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader message="Loading page..." />}>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/complete" element={<CompleteProfilePage />} />

            {/* ── Protected Routes ── */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomeRedirect />} />
              <Route path="todos" element={<TodosPage />} />
              <Route path="posts" element={<PostsPage />}>
                <Route path=":postId" element={<PostDetail />} />
              </Route>
              <Route path="albums" element={<AlbumsPage />} />
              <Route path="albums/:albumId/photos" element={<AlbumPhotos />} />
            </Route>

            {/* ── Redirects & Fallback ── */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
