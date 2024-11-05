import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/Login';
import '@testing-library/jest-dom'


jest.mock('axios');

describe('Login Component', () => {
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  test('should render the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Assert that the form is rendered with required fields
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('should handle successful login', async () => {
    // Mock the axios post response for successful login
    const mockResponse = { data: { token: 'mockedToken' } };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill the form fields and submit
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the async actions to complete
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockedToken');
      expect(mockNavigate).toHaveBeenCalledWith('/posts');
    });
  });

  test('should display error on failed login', async () => {
    // Mock the axios post response for failed login
    const mockError = {
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    };
    (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill the form fields and submit
    fireEvent.change(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'wronguser' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the async actions to complete
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
