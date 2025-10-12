# Testing Guide

This directory contains all test files for the Comprehensive Testing Platform frontend.

## Directory Structure

```
tests/
├── unit/           # Unit tests for individual components and functions
├── integration/    # Integration tests for component interactions
├── e2e/           # End-to-end tests for complete user workflows
├── setup.ts       # Test environment setup and configuration
└── README.md      # This file
```

## Test Types

### Unit Tests (`unit/`)
- Test individual components in isolation
- Test utility functions
- Test custom hooks
- Mock external dependencies

### Integration Tests (`integration/`)
- Test component interactions
- Test service integrations
- Test store interactions
- Test routing behavior

### End-to-End Tests (`e2e/`)
- Test complete user workflows
- Test cross-module functionality
- Test real API interactions
- Test user experience flows

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- tests/unit/ComponentName.test.tsx

# Generate coverage report
npm test -- --coverage
```

## Test Conventions

- Test files should be named `*.test.ts` or `*.test.tsx`
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Use `it` or `test` for individual test cases
- Mock external dependencies to ensure test isolation
- Test both success and failure scenarios
- Test edge cases and error conditions

## Example Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentName } from '@/components/ComponentName';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup test environment
  });

  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    // Test user interactions
  });

  it('should handle errors gracefully', () => {
    // Test error scenarios
  });
});
```
