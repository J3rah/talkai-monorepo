import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import supabase from '../../../supabaseClient';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('../../../supabaseClient', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOtp: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-google-recaptcha', () => {
  const ReCAPTCHA = React.forwardRef(({ onChange }: { onChange: (token: string | null) => void }, ref) => {
    const handleChange = (token: string | null) => {
      if (onChange) {
        onChange(token);
      }
    };

    React.useImperativeHandle(ref, () => ({
      execute: () => handleChange('mock-recaptcha-token'),
    }));

    return <div data-testid="mock-recaptcha" onClick={() => handleChange('mock-recaptcha-token')}></div>;
  });
  ReCAPTCHA.displayName = 'ReCAPTCHA';
  return ReCAPTCHA;
});


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
  })
) as jest.Mock;

describe('Login', () => {
  let push: jest.Mock;

  beforeEach(() => {
    push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (supabase.auth.signInWithPassword as jest.Mock).mockClear();
    (supabase.auth.signInWithOtp as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders the login form with email and password fields by default', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login with Password/i })).toBeInTheDocument();
  });

  it('allows typing in email and password fields', () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('switches to the magic link form when the "Magic Link" button is clicked', () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /Magic Link/i }));

    expect(screen.getByRole('button', { name: /Send Magic Link/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
  });

  describe('Password Login', () => {
    it('shows an error if reCAPTCHA is not completed', async () => {
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login with Password/i }));

        expect(await screen.findByText('Please complete the reCAPTCHA.')).toBeInTheDocument();
      });

    it('calls supabase.auth.signInWithPassword with the correct credentials and redirects on success', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error: null });
      render(<Login />);

      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByTestId('mock-recaptcha'));
      fireEvent.click(screen.getByRole('button', { name: /Login with Password/i }));

      await waitFor(() => {
        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('displays an error message on failed login', async () => {
      const errorMessage = 'Invalid login credentials';
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({ error: { message: errorMessage } });
      render(<Login />);

      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByTestId('mock-recaptcha'));
      fireEvent.click(screen.getByRole('button', { name: /Login with Password/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Magic Link Login', () => {
    beforeEach(() => {
      render(<Login />);
      fireEvent.click(screen.getByRole('button', { name: /Magic Link/i }));
    });

    it('shows an error if reCAPTCHA is not completed', async () => {
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

        expect(await screen.findByText('Please complete the reCAPTCHA.')).toBeInTheDocument();
      });

    it('calls supabase.auth.signInWithOtp with the correct email and shows a confirmation message', async () => {
      (supabase.auth.signInWithOtp as jest.Mock).mockResolvedValueOnce({ error: null });

      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByTestId('mock-recaptcha'));
      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

      await waitFor(() => {
        expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
          email: 'test@example.com',
          options: {
            emailRedirectTo: `${window.location.origin}/auth/login-success`,
            shouldCreateUser: false
          }
        });
      });

      expect(await screen.findByText("We've sent a magic link to", { exact: false })).toBeInTheDocument();
    });

    it('displays an error message on failed magic link request', async () => {
      const errorMessage = 'Could not send magic link';
      (supabase.auth.signInWithOtp as jest.Mock).mockResolvedValueOnce({ error: { message: errorMessage } });

      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByTestId('mock-recaptcha'));
      fireEvent.click(screen.getByRole('button', { name: /Send Magic Link/i }));

      expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    });
  });
});
