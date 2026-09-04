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
    pathname === '/api/training/submit' ||
    pathname === '/api/training/lock' ||
    pathname === '/api/training/strike';

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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-candidate-id', session.candidateId);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
