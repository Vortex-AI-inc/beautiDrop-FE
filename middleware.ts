import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/for-salon-owners',
    '/credit-card-processing',
    '/browse-salons',
    '/browse-salons/(.*)',
    '/saloon/(.*)',
    '/login(.*)',
    '/signup(.*)',
    '/api/v1/shops(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const currentPath = req.nextUrl.pathname;

    // Protect non-public routes
    if (!isPublicRoute(req) && !userId) {
        const signInUrl = new URL('/login', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
    }

    // Role-based redirects for authenticated users
    if (userId && sessionClaims) {
        const role = (sessionClaims.unsafeMetadata as { role?: string })?.role;

        // Redirect customers away from business portal
        if (role === 'customer' && currentPath.startsWith('/portal')) {
            return NextResponse.redirect(new URL('/customer-dashboard', req.url));
        }

        // Redirect business users away from customer dashboard
        if (role === 'client' && currentPath.startsWith('/customer-dashboard')) {
            return NextResponse.redirect(new URL('/portal', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
