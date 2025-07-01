# NextAuth.js Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random
```

## How to Generate a Secret

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator and make sure it's at least 32 characters long.

## Demo Credentials

For testing purposes, use these credentials:

- Username: `demo`
- Password: `password`

## Features Implemented

1. **Login Page** (`/login`) - User authentication with error handling
2. **Signup Page** (`/signup`) - User registration with password confirmation
3. **Protected Routes** - Main page shows different content based on auth status
4. **Session Management** - Automatic session handling with NextAuth
5. **Logout Functionality** - Sign out button on the main page

## Next Steps

To make this production-ready, you should:

1. **Add a Database** - Replace the demo credentials with real user storage
2. **Add Password Hashing** - Use bcrypt or similar for password security
3. **Add Email Verification** - Implement email confirmation for new accounts
4. **Add Social Login** - Integrate Google, GitHub, or other OAuth providers
5. **Add Password Reset** - Implement forgot password functionality

## Database Integration

To integrate with a database, update the `authorize` function in `app/api/auth/[...nextauth]/route.ts`:

```typescript
async authorize(credentials) {
  if (!credentials?.username || !credentials?.password) {
    return null;
  }

  // Query your database here
  const user = await db.user.findUnique({
    where: { username: credentials.username }
  });

  if (user && await bcrypt.compare(credentials.password, user.password)) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    };
  }

  return null;
}
```
