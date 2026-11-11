import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatPage from './pages/ChatPage';
import { useAuthStore } from './stores/useAuthStore';

const queryClient = new QueryClient();

/** 登录守卫：无 Token 重定向到登录页（登录页可按教程补充 LoginForm） */
function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

const router = createBrowserRouter([
  { path: '/login', element: <div>登录页（见教程 Step 2）</div> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <ChatPage />
      </RequireAuth>
    ),
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
