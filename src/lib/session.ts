import { SignJWT, jwtVerify } from 'jose';

function getSecretKey() {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing. Application cannot start securely.');
  }
  return new TextEncoder().encode(secretKey);
}

export async function createSessionToken(candidateId: string): Promise<string> {
  const key = getSecretKey();
  return await new SignJWT({ candidateId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('4h') // 4 hours is plenty for a 45 min assessment + review buffer
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<{ candidateId: string } | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return { candidateId: payload.candidateId as string };
  } catch (error) {
    return null;
  }
}
