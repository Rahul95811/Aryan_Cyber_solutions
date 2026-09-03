import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-for-development-only-change-in-prod';
const key = new TextEncoder().encode(secretKey);

export async function createSessionToken(candidateId: string): Promise<string> {
  return await new SignJWT({ candidateId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h') // 4 hours is plenty for a 45 min assessment + review buffer
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<{ candidateId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return { candidateId: payload.candidateId as string };
  } catch (error) {
    return null;
  }
}
