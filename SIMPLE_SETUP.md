# Simple Username/Password Authentication Setup

This guide will help you set up username/password authentication with Supabase storage.

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-make-it-long-and-random

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 2. Supabase Setup

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### Create Users Table

Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  name TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for additional security)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);
```

## 3. Generate NextAuth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

## 4. Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/login`

3. Create a test user in Supabase:

   - Go to your Supabase dashboard
   - Navigate to Table Editor > users
   - Insert a new row with:
     - username: `testuser`
     - password: `testpass123`
     - name: `Test User`
     - email: `test@example.com`

4. Test login with the credentials you created

## 5. Add User Registration

To allow users to register themselves, you'll need to create a signup API endpoint. Here's a simple example:

```typescript
// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { username, password, email, name } = await request.json();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          password, // In production, hash this password!
          email,
          name,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 6. Security Considerations

For production use, make sure to:

1. **Hash passwords** using bcrypt or similar
2. **Add input validation** for usernames and passwords
3. **Implement rate limiting** for login attempts
4. **Use HTTPS** in production
5. **Add email verification** for new accounts
6. **Set up proper CORS policies**

## 7. Database Schema

The users table stores:

- `id`: Unique user identifier (UUID)
- `email`: User's email address (optional)
- `name`: Display name (optional)
- `username`: Unique username (required)
- `password`: User's password (required - should be hashed)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

## 8. Production Deployment

For production, update your environment variables:

```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```
