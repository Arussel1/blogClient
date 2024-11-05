export default {
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testEnvironment: 'jsdom', 
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
    setupFilesAfterEnv: [
      "@testing-library/jest-dom/extend-expect"
    ]

  };
  