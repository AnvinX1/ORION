# Orion — Security Guide

> For vulnerability reports, see the **Reporting a Vulnerability** section below. Do not open a public GitHub issue for security bugs.

## Overview
Orion implements security measures to prevent common web vulnerabilities including XSS, injection attacks, and data leaks.

## Security Features

### 1. XSS Prevention

#### HTML Entity Escaping
**Location**: `src/utils/security.ts` - `escapeHtml()`

Converts dangerous characters to HTML entities:
```typescript
// Converts: <script>alert('xss')</script>
// To: &lt;script&gt;alert('xss')&lt;/script&gt;
```

**Protected Characters**:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#x27;`
- `/` → `&#x2F;`

**Usage in Components**: Applied to all user-controlled text in logs and messages

#### Safe String Validation
**Location**: `src/utils/security.ts` - `isValidSafeString()`

Regex pattern: `/^[a-zA-Z0-9\s\-_.,:'"%()]*$/`

Only allows:
- Alphanumeric characters
- Spaces, hyphens, underscores
- Common punctuation marks
- Prevents special characters that could enable injection

### 2. Input Sanitization

#### Sanitize Input Function
**Location**: `src/utils/security.ts` - `sanitizeInput()`

**Process**:
1. Trim whitespace
2. Limit to MAX_MESSAGE_LENGTH (1000 chars)
3. Remove control characters (0x00-0x1F, 0x7F)
4. Return clean string

#### Safe JSON Parsing
**Location**: `src/utils/security.ts` - `safeJsonParse()`

**Features**:
- Try-catch wrapper prevents parsing crashes
- Validates input is string type
- Sanitizes parsed object recursively
- Returns default value on error
- Logs errors without sensitive data

### 3. Type Safety & Validation

#### Zod Schemas
**Location**: `src/types/validation.ts`

All data structures validated at runtime:

```typescript
LogEntrySchema: {
  - id: UUID format
  - timestamp: positive integer
  - level: enum of valid levels
  - category: SafeString (max 255 chars)
  - message: SafeString (max 5000 chars)
  - source: SafeString
}

GpuStatsSchema: {
  - id: integer 0-15 (prevents arbitrary GPU count)
  - name: SafeString
  - utilization: 0-100 range
  - temperature: 0-150 range (prevents spoofing)
  - All numeric fields validated for ranges
}

BuildStatusSchema: {
  - All string fields use SafeString
  - Status must be enum value
  - Progress validated 0-100
  - Timestamps must be positive integers
}

SettingsSchema: {
  - theme: 'dark' | 'light' only
  - refreshInterval: 100-60000 ms range
  - logLevel: specific enum values
}
```

**Benefits**:
- Rejects malformed data at runtime
- Type-safe through TypeScript inference
- Prevents injection through structured data

### 4. Path & URL Validation

#### File Path Validation
**Location**: `src/utils/security.ts` - `isValidFilePath()`

**Prevents**:
- Directory traversal (`../`)
- Home directory escape (`~`)
- Invalid characters

**Pattern**: `/^[a-zA-Z0-9/\.\-_]*$/`

#### URL Validation
**Location**: `src/utils/security.ts` - `isValidHttpUrl()`

**Checks**:
- Valid URL structure
- Only allows `http://` and `https://`
- Rejects `javascript:` and `data:` schemes

### 5. Rate Limiting

#### Rate Limiter Implementation
**Location**: `src/utils/security.ts`

**Functions**:
- `isRateLimited(key, limit, windowMs)`: Check if rate limited
- `clearRateLimit(key)`: Reset rate limit for a key

**Usage**:
```typescript
if (isRateLimited('api-call', 10, 60000)) {
  // Block if >10 requests in 60 seconds
  return;
}
```

**Features**:
- In-memory tracking with Map
- Automatic window cleanup
- Prevents brute force attacks
- Configurable limits per endpoint

### 6. Sensitive Data Protection

#### Object Sanitization
**Location**: `src/utils/security.ts` - `sanitizeObject()`

**Automatic Filtering**:
- Removes `password` fields
- Removes `token` fields
- Removes `secret` fields
- Removes `apiKey` fields
- Recursively sanitizes nested objects (max 10 levels)

**Use Cases**:
- Before logging error objects
- Before sending data to analytics
- Before storing in cache

**Example**:
```typescript
const userObj = {
  name: 'John',
  email: 'john@example.com',
  password: 'secret123', // Auto-filtered
  token: 'xyz', // Auto-filtered
};

const safe = sanitizeObject(userObj);
// Result: { name: 'John', email: 'john@example.com' }
```

### 7. Secure Random ID Generation

**Location**: `src/utils/security.ts` - `generateSecureId()`

**Implementation**:
- Uses `window.crypto.getRandomValues()` when available
- Cryptographically secure random values
- Fallback for server-side environments

**Output**: 32-character hexadecimal string

### 8. Configuration Security

#### Constants Validation
**Location**: `src/config/constants.ts`

**Security Constants**:
```typescript
MAX_LOGS: 1000               // Prevent unbounded memory
LOG_BUFFER_SIZE: 100         // Circular buffer
MAX_MESSAGE_LENGTH: 1000     // Prevent DoS
MAX_FILENAME_LENGTH: 255     // Prevent buffer overflow
MAX_GPU_COUNT: 16            // Prevent invalid GPU counts
```

#### Regex Patterns
All validation patterns designed to prevent injection:
- `SAFE_STRING`: Alphanumeric + safe punctuation
- `SAFE_PATH`: Path characters only
- `POSITIVE_NUMBER`: Prevents negative injection

### 9. Component-Level Security

#### LogsTab Security
**Location**: `src/components/tabs/LogsTab.tsx`

- All user input sanitized via `sanitizeInput()`
- Log messages escaped with `escapeHtml()`
- Search term validated before use
- Filter values from enum only

#### CodeBlock Component
**Location**: `src/components/base/CodeBlock.tsx`

- Code content HTML-escaped
- Line numbers sanitized
- Language identifier validated
- Copy functionality uses `navigator.clipboard`

#### Header Component
**Location**: `src/components/layout/Header.tsx`

- Title and subtitle escaped
- Status text from enum only
- Timestamp auto-generated (no user input)

### 10. Keyboard Navigation Security

**Location**: `src/hooks/useKeyboardNavigation.ts`

- Event handlers validate key values
- Prevents keyboard-based injections
- Tab navigation via enum-based IDs

## Security Checklist

- [x] XSS Prevention (HTML escaping)
- [x] CSRF Protection (no state modification from logs)
- [x] Input Validation (Zod schemas)
- [x] Output Encoding (HTML entity escaping)
- [x] Rate Limiting (built-in)
- [x] Secure Randomness (crypto API)
- [x] Type Safety (TypeScript strict mode)
- [x] Sensitive Data Filtering (auto-removal)
- [x] Path Traversal Prevention
- [x] URL Scheme Validation
- [x] SQL Injection Prevention (no SQL used)
- [x] Command Injection Prevention (no shell commands)
- [x] Error Handling (no sensitive data in errors)
- [x] Session Security (no sensitive cookies)
- [x] Data Validation (multi-layer)
- [x] Accessibility (WCAG compliance)

## Testing Security

### Manual Testing Steps

1. **XSS Testing**
   - Try entering: `<script>alert('xss')</script>` in logs
   - Should display escaped, not execute

2. **Path Traversal Testing**
   - Try paths like: `../../etc/passwd`
   - Should be rejected by `isValidFilePath()`

3. **Rate Limiting Testing**
   - Rapid-fire API calls should be rate-limited
   - Can clear with `clearRateLimit()`

4. **Input Length Testing**
   - Excessively long strings truncated
   - Prevents memory exhaustion

5. **Type Validation Testing**
   - Invalid data types rejected by Zod
   - Falls back to defaults safely

## Production Recommendations

1. **Enable CSP Headers**
   ```
   Content-Security-Policy: default-src 'self';
   ```

2. **Use HTTPS Only**
   - All data transmitted encrypted
   - Prevents man-in-the-middle attacks

3. **Implement Authentication**
   - Add JWT or session-based auth
   - Validate user permissions per endpoint

4. **Set Secure Cookies**
   - `HttpOnly` flag for session cookies
   - `Secure` flag for HTTPS
   - `SameSite=Strict` for CSRF protection

5. **Monitor & Log**
   - Log security events
   - Monitor for rate limit abuse
   - Track failed validations

6. **Regular Audits**
   - Review security dependencies
   - Update to latest versions
   - Perform penetration testing

7. **Environment Variables**
   - Store secrets in `.env.local`
   - Never commit sensitive data
   - Rotate keys regularly

## Security Libraries Used

- **Zod**: Runtime schema validation
- **TypeScript**: Compile-time type safety
- **Next.js**: Built-in security headers
- **Tailwind CSS**: No inline styles (prevents style injection)

## Reported Security Considerations

- This is a demo/educational project
- Mock data is not encrypted in transit
- No persistent storage of data
- For production, add: authentication, HTTPS, database security, etc.

## Contact & Reporting

For security vulnerabilities:
- Do not open public issues
- Report privately to your security team
- Include proof of concept and impact assessment

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

To report a vulnerability in Orion:

1. Email the maintainers directly (see GitHub profile for contact).
2. Include: a description of the issue, steps to reproduce, potential impact, and any suggested mitigations.
3. You will receive an acknowledgement within 72 hours.
4. We aim to release a fix within 14 days for confirmed issues and will credit reporters in the CHANGELOG unless you prefer to remain anonymous.

We follow [responsible disclosure](https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html) — please give us a reasonable window before public disclosure.

