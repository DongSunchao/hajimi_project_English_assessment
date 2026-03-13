import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome page title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Welcome to English Pronunciation Assessment/i);
  expect(titleElement).toBeInTheDocument();
});
