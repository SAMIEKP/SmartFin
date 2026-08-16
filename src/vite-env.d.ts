/// <reference types="vite/client" />

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-dev-runtime'
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.svg' {
  const value: string
  export default value
}