import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

const isOrgSelectionRoute = createRouteMatcher(["/org-selection(.*)"])

export default clerkMiddleware(async (auth, req) => {

    const { userId, orgId } = await auth

    //protect non public routes
    if (!auth) {
        await auth.protect()
    }

    if (isOrgSelectionRoute(req)) {
        return NextResponse.next()
    }

    // for all protected routes, ensure org is selected
    if (userId && !orgId) {
        const orgSelection = new URL("/org-selection", req.url)
        return NextResponse.redirect(orgSelection)
    }

    return NextResponse.next()

})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};