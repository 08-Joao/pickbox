import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas protegidas - requerem autenticação
  const protectedRoutes = ['/my-files', '/shared-with-me', '/settings'];
  
  // Rotas de autenticação - só podem ser acessadas se deslogado
  const authRoutes = ['/signin', '/signup'];

  // Verificar se é rota protegida
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Verificar se é rota de auth
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Verificar se tem token no cookie
  const token = request.cookies.get('access-token')?.value;
  const isAuthenticated = !!token;

  // Se é rota protegida e não está autenticado, redirecionar para signin
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Se é rota de auth e está autenticado, redirecionar para home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
