# API Documentation

## Base Configuration

The application uses Axios for HTTP requests with a centralized configuration in `src/api/index.js`. This ensures consistent API communication across the application.

### API Client Setup

```javascript
const apiClient = axios.create({
  baseURL: `${store.getters.baseApi}`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Token ${store.getters.token}`,
  },
});
```

## Authentication

The application uses token-based authentication:

- Token is stored in the Vuex store and persisted in localStorage
- Token is automatically included in all API requests via the Authorization header
- Format: `Authorization: Token <token_value>`

## Base URL Configuration

The API base URL is configured through environment variables:
- Development: Configured in `.env.development`
- Production: Should be configured in `.env.production`

Accessed via: `process.env.VUE_APP_BASE_API_URL`

## State Management

API-related state is managed in Vuex store:

### State
```javascript
state: {
  baseApi: process.env.VUE_APP_BASE_API_URL,
  user: null
}
```

### Getters
- `baseApi`: Returns the API base URL
- `token`: Retrieves authentication token (with localStorage fallback)
- `userName`: Returns the authenticated user's username

### Mutations
- `setUser`: Stores user data and token in state and localStorage
- `clearUser`: Removes user data and token from state and localStorage

## Error Handling

Recommended error handling approach:

```javascript
try {
  const response = await apiClient.get('/endpoint');
  // Handle success
} catch (error) {
  if (error.response) {
    // Handle specific HTTP error codes
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break;
      case 404:
        // Handle not found
        break;
      default:
        // Handle other errors
    }
  } else if (error.request) {
    // Handle network errors
  }
}
```

## Security Considerations

1. All sensitive data (tokens, user information) should only be transmitted over HTTPS
2. Tokens are stored in localStorage - ensure proper token expiration and renewal strategy
3. Implement CSRF protection for non-GET requests
4. Validate all API responses before processing
5. Implement rate limiting where necessary

## API Endpoints

The application interacts with the following routes:

### Authentication
- Login: POST /login
- Register: POST /register
- Logout: POST /logout

### Articles
- List Articles: GET /articles
- Create Article: POST /articles
- Edit Article: PUT /articles/:slug
- Delete Article: DELETE /articles/:slug

## Making API Calls

Example usage of the API client:

```javascript
import apiClient from '@/api';

// GET request
const getArticles = async () => {
  const response = await apiClient.get('/articles');
  return response.data;
};

// POST request
const createArticle = async (articleData) => {
  const response = await apiClient.post('/articles', articleData);
  return response.data;
};
```