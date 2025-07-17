// client/src/tests/integration/ButtonIntegration.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/Button';

// Example parent component that uses Button and simulates API call
function ParentComponent() {
  const [clicked, setClicked] = React.useState(false);
  const handleClick = async () => {
    // Simulate API call
    await Promise.resolve();
    setClicked(true);
  };
  return (
    <div>
      <Button onClick={handleClick}>Click Me</Button>
      {clicked && <span data-testid="result">Clicked!</span>}
    </div>
  );
}

describe('Button Integration', () => {
  it('should update parent state and show result after click', async () => {
    render(<ParentComponent />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    // Wait for state update
    const result = await screen.findByTestId('result');
    expect(result).toHaveTextContent('Clicked!');
  });
}); 
