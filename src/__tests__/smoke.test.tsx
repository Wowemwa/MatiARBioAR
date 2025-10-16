import { render } from '@testing-library/react'
import { test, expect } from 'vitest'
import App from '../App'

test('renders App without crashing', () => {
  // jsdom doesn't implement matchMedia; polyfill a minimal version used by useTheme
  // matching behavior: default to light mode
  if (typeof window.matchMedia !== 'function') {
    // assign polyfill to window
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }

  const { container } = render(<App />)
  expect(container).toBeTruthy()
})
