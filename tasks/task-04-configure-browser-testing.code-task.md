---
status: pending
created: 2026-01-20
started: null
completed: null
---
# Task: Configure Browser Testing Environment

## Description
Properly configure the browser testing environment including Jest setup, browser mocks, test utilities, and polyfills to ensure tests run correctly and consistently.

## Background
Browser testing configuration is incomplete or incorrect, causing test failures and preventing proper validation of browser-specific code. A properly configured test environment is essential for catching regressions and ensuring browser compatibility.

## Reference Documentation
**Required:**
- Design: planning/design/detailed-design.md

**Additional References:**
- apps/native/jest.config.js (current Jest configuration)
- apps/native/jest.setup.js (current test setup)

**Note:** Read the detailed design document before beginning implementation.

## Technical Requirements
1. Configure Jest for browser environment testing with proper presets
2. Add necessary polyfills for browser APIs (window, navigator, localStorage, etc.)
3. Set up proper mocks for React Native/Expo modules in browser context
4. Configure test-transformer to handle ES modules and syntax
5. Add test utilities for common browser testing scenarios

## Dependencies
- Current Jest configuration in apps/native/jest.config.js
- Current test setup in apps/native/jest.setup.js
- Expo and React Native testing libraries

## Implementation Approach
1. Review existing Jest configuration and identify gaps
2. Add jest-expo or appropriate browser environment preset
3. Configure module name mapper for browser-specific imports
4. Add polyfills in setup file for missing browser globals
5. Mock React Native modules that don't work in jsdom
6. Add helper utilities for browser testing (viewport simulation, event firing)

## Acceptance Criteria

1. **Jest Configuration**
   - Given the Jest configuration
   - When running tests with --clearCache
   - Then all tests execute without configuration errors

2. **Browser API Mocks**
   - Given a test needing browser APIs
   - When using window, localStorage, navigator, etc.
   - Then these APIs are properly mocked and available in tests

3. **React Native Module Handling**
   - Given tests importing React Native/Expo modules
   - When the tests run
   - Then modules are properly mocked without import errors

4. **Test Utilities Available**
   - Given common browser testing scenarios
   - When writing tests
   - Then helper utilities exist for viewport simulation, touch events, etc.

5. **Unit Test Coverage**
   - Given the browser test configuration
   - When running the test suite
   - Then configuration itself is validated by a sample passing test

## Metadata
- **Complexity**: Medium
- **Labels**: Configuration, Jest, Testing, Browser Environment
- **Required Skills**: Jest configuration, React Native testing, jsdom, module mocking
