import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import { CartProvider } from './context/cart';
import { SearchProvider } from './context/search';
import PageNotFound from './pages/PageNotFound';
import Login from './pages/Auth/Login';

// Wrap components with required providers
const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <MemoryRouter>
            {ui}
          </MemoryRouter>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

test('renders 404 page with Go Back button', () => {
  renderWithProviders(<PageNotFound />);
  expect(screen.getByText(/404/i)).toBeInTheDocument();
  expect(screen.getByText(/Go Back/i)).toBeInTheDocument();
});

test('renders Login form with email and password fields', () => {
  renderWithProviders(<Login />);
  expect(screen.getByPlaceholderText(/Enter Your Email Address/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Enter Strong Password/i)).toBeInTheDocument();
  expect(screen.getByText(/Login Form/i)).toBeInTheDocument();
});