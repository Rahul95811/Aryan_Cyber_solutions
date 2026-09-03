import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect assessment pages and APIs (except register)
  const isProtectedPage = 
    pathname.startsWith('/training/assessment') || 
    pathname.startsWith('/training/rules') || 
    pathname.startsWith('/training/submitted');
    
  const isProtectedApi = 
    pathname === '/api/training/start' || 
    pathname === '/api/training/draft' || 
    pathname === '/api/training/submit';

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get('acs_session')?.value;

  if (!token) {
    return handleUnauthorized(request, isProtectedApi);
  }

  const session = await verifySessionToken(token);

  if (!session || !session.candidateId) {
    return handleUnauthorized(request, isProtectedApi);
  }

  // We could rewrite the URL to inject the true candidate ID, or just pass it in a header
  // Setting a header allows the downstream API/page to trust the middleware's validation
  const response = NextResponse.next();
  response.headers.set('x-candidate-id', session.candidateId);
  return response;
}

function handleUnauthorized(request: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ message: 'Unauthorized. Please register again.' }, { status: 401 });
  } else {
    return NextResponse.redirect(new URL('/training/register', request.url));
  }
}

export const config = {
  matcher: [
    '/training/assessment',
    '/training/rules',
    '/training/submitted',
    '/api/training/:path*',
  ],
};
