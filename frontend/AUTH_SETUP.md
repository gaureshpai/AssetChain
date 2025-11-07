# Magic SDK Authentication Setup

This project uses Magic SDK to provide email/password authentication with blockchain wallet integration.

## Features

- **Email/Password Signup & Login**: Users can create accounts with email and password
- **Magic Wallet Integration**: Each user automatically gets a blockchain wallet via Magic SDK
- **Private Key Export**: Users can export their private key for direct wallet access
- **Wallet-based Login**: After exporting, users can login directly with their private key

## Architecture

### Frontend (`/lib/auth-context.tsx`)
- `signup(email, password)` - Register new user and create Magic wallet
- `login(email, password)` - Login with email/password (requires email OTP verification)
- `loginWithWallet(privateKey)` - Login directly with exported private key
- `exportPrivateKey()` - Export wallet private key for future use
- `logout()` - Logout and clear session

### Backend (`/backend/index.ts`)
- `POST /signup` - Register user with email/password
- `POST /login` - Verify credentials (email/password validation)

## Setup

### 1. Install Dependencies

**Frontend:**
```bash
npm install magic-sdk ethers
```

**Backend:**
```bash
cd backend
npm install @magic-sdk/admin express cors body-parser
```

### 2. Environment Variables

Create `.env.local` in the frontend root:
```
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=your_magic_publishable_key
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

Create `.env` in the backend directory:
```
MAGIC_SECRET_KEY=your_magic_secret_key
```

### 3. Get Magic SDK Keys

1. Go to [Magic Dashboard](https://dashboard.magic.link/)
2. Create a new app
3. Copy your **Publishable API Key** to `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY`
4. Copy your **Secret Key** to `MAGIC_SECRET_KEY`

### 4. Run the Application

**Backend:**
```bash
cd backend
npm start
```
Backend runs on http://localhost:3001

**Frontend:**
```bash
npm run dev
```
Frontend runs on http://localhost:3000

## User Flow

### First Time Signup
1. User enters email and password on `/signup`
2. Backend stores credentials
3. Magic SDK creates a wallet for the user
4. User receives email OTP for verification
5. Upon verification, user is logged in with wallet access

### Email/Password Login
1. User enters email and password on `/login`
2. Backend verifies credentials
3. Magic SDK sends OTP to user's email
4. User verifies OTP
5. User is logged in with wallet access

### Export Private Key
1. After email login, user can click "Export Private Key"
2. Private key is revealed and stored in localStorage
3. User can copy or download the private key

### Wallet Login (After Export)
1. User selects "Private Key/Wallet" login option
2. User enters their private key
3. Instantly logged in without email verification
4. Full blockchain functionality available

## Security Notes

⚠️ **Important Security Considerations:**

1. **Private Key Storage**: 
   - Private keys are stored in localStorage (for demo purposes)
   - In production, use more secure methods (hardware wallet, encrypted storage)

2. **Password Security**:
   - Backend uses plain text passwords (for demo)
   - In production, use bcrypt or similar to hash passwords

3. **HTTPS Required**:
   - Always use HTTPS in production
   - Magic SDK requires secure connections

4. **Private Key Warning**:
   - Warn users to never share their private key
   - Anyone with the private key has full wallet access

## Components

### `ExportPrivateKey` Component
Located at `/components/user/export-private-key.tsx`

Shows a dialog to export the user's private key. Features:
- Security warnings
- Copy to clipboard
- Download as file
- Only shows if key not already exported

Usage:
```tsx
import { ExportPrivateKey } from '@/components/user/export-private-key';

function Dashboard() {
  return (
    <div>
      <ExportPrivateKey />
    </div>
  );
}
```

## Blockchain Integration

The auth system integrates with `blockchain-service.ts`:

- `initializeWithMagic(magic)` - Initialize blockchain with Magic wallet
- `initialize(privateKey)` - Initialize blockchain with private key

Both methods provide full blockchain functionality for interacting with smart contracts.

## API Reference

### Auth Context

```typescript
interface AuthContextType {
  user: User;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithWallet: (privateKey: string) => Promise<void>;
  logout: () => void;
  exportPrivateKey: () => Promise<string>;
  isLoading: boolean;
}

interface User {
  email?: string;
  address?: string;
  role: 'user' | 'admin' | null;
  isConnected: boolean;
  hasPrivateKey?: boolean;
}
```

## Troubleshooting

### "Magic SDK not initialized"
- Ensure `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` is set
- Check that the key is valid in Magic Dashboard

### "Email verification not working"
- Check spam folder
- Verify email configuration in Magic Dashboard
- Ensure the correct domain is whitelisted

### "Wallet login fails"
- Verify private key format (64 character hex string)
- Check that blockchain RPC endpoint is accessible
- Ensure contract addresses are correctly configured

### "Backend connection refused"
- Verify backend is running on port 3001
- Check CORS configuration
- Ensure both frontend and backend are running

## Next Steps

For production deployment:

1. ✅ Hash passwords with bcrypt
2. ✅ Use secure private key storage (KMS, hardware wallet)
3. ✅ Implement rate limiting on auth endpoints
4. ✅ Add session management with JWT tokens
5. ✅ Enable 2FA for additional security
6. ✅ Use environment-specific Magic apps
7. ✅ Implement proper database (replace in-memory storage)
8. ✅ Add logging and monitoring
9. ✅ Set up proper error handling
10. ✅ Configure CSP and security headers
