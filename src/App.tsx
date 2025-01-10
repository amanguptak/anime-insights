import React, { useEffect } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HomePage } from './pages/HomePage';
import { AnimeDetailsPage } from './pages/AnimeDetailsPage';
import { themeAtom } from './store/atoms';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

// Theme initializer component
function ThemeInitializer() {
  const theme = useRecoilValue(themeAtom);
  
  useEffect(() => {
    // Apply theme on mount and when theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <ThemeInitializer />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/anime/:id" element={<AnimeDetailsPage />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;