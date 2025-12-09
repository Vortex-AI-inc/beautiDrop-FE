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
    '/staff/complete-signup(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();
    const currentPath = req.nextUrl.pathname;

    if (!isPublicRoute(req) && !userId) {
        const signInUrl = new URL('/login', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signInUrl);
    }

    if (userId && sessionClaims) {
        const role = (sessionClaims.unsafeMetadata as { role?: string })?.role;

        if (role === 'customer' || role === 'client') {
            if (currentPath.startsWith('/portal') || currentPath.startsWith('/staff-portal')) {
                return NextResponse.redirect(new URL('/customer-dashboard', req.url));
            }
        }

        if (role === 'staff') {
            if (currentPath.startsWith('/portal') || currentPath.startsWith('/customer-dashboard')) {
                return NextResponse.redirect(new URL('/staff-portal', req.url));
            }
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
