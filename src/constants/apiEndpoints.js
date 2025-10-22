export const API_BASE_URL = "http://localhost:9009";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    LOGOUT: "/logout",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/update",
  },
  BOOKS: {
    GET_ALL: "/api/books/list",
    GET_BY_ID: "/books/:id",
    CREATE: "/books",
    UPDATE: "/books/:id",
    DELETE: "/books/:id",
    SEARCH: "/books/search",
  },
  LIBRARY: {
    ISSUE_BOOK: "/library/issue",
    RETURN_BOOK: "/library/return",
    GET_ISSUED_BOOKS: "/library/issued",
    BORROW_BOOKS: "/api/v1/transactions/books/borrow",
  },
};
