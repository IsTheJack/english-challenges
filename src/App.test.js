import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders "Get Random Sentence" button', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Get Random Word/i);
  expect(linkElement).toBeInTheDocument();
});
