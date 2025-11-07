# Migration from Express to Next.js Server Actions

This document outlines the migration from Express backend to Next.js server actions.

## Changes Made

### 1. Created Server Actions (`app/actions/auth.ts`)
- Replaced Express routes (`/signup` and `/login`) with Next.js server actions
- `signupAction`: Handles user registration
- `loginAction`: Handles user authentication with optional Magic DID token validation
- Both actions use the `'use server'` directive to run on the server side

### 2. Updated Auth Context (`lib/auth-context.tsx`)
- Removed `fetch` calls to `http://localhost:3001/signup` and `http://localhost:3001/login`
- Replaced with direct calls to `signupAction` and `loginAction` server actions
- No changes needed to client-side components (login/signup pages)

### 3. Dependencies
- Added `@magic-sdk/admin` to `package.json` for server-side Magic SDK operations
- No longer need Express, body-parser, or cors packages

### 4. Environment Variables
- Created `.env.local.example` template
- Required environment variables:
  - `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` (client-side)
  - `MAGIC_SECRET_KEY` (server-side only)

## Migration Steps

1. **Install new dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Add your Magic SDK keys

3. **Remove the old Express backend:**
   - The `backend/index.ts` file is no longer needed
   - You can delete the `backend` folder if desired

4. **Remove Express from scripts (if any):**
   - Check your `package.json` scripts for any Express-related commands and remove them

5. **Run the application:**
   ```bash
   npm run dev
   ```

## Benefits of Server Actions

1. **Simplified Architecture**: No separate Express server needed
2. **Better Type Safety**: Direct TypeScript integration between client and server
3. **Automatic API Routes**: Next.js handles routing automatically
4. **Built-in Security**: Server actions only execute on the server
5. **Better Developer Experience**: Single codebase, single dev server

## Important Notes

### In-Memory Storage Warning
The current implementation uses an in-memory `Map` for user storage. This means:
- User data is lost when the server restarts
- Not suitable for production use

### For Production
Consider implementing:
1. **Database Integration**: Use PostgreSQL, MongoDB, or another database
2. **Password Hashing**: Use bcrypt or argon2 to hash passwords
3. **Session Management**: Implement proper session handling with cookies or JWT
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Input Validation**: Use libraries like Zod for request validation

## Troubleshooting

### Issue: "Magic SDK not initialized"
- Ensure `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` is set in `.env.local`
- Restart the development server after adding environment variables

### Issue: "Internal server error" on login/signup
- Check that `MAGIC_SECRET_KEY` is set in `.env.local`
- Verify the Magic SDK admin package is installed

### Issue: Server actions not working
- Ensure you're using Next.js 13+ with App Router
- Verify the `'use server'` directive is at the top of `app/actions/auth.ts`
