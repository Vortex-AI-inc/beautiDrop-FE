import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function AuthCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary/5 via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-tertiary" />
        </div>

        {/* Content - replaced card-base, heading-2, body-default, heading-3, body-small, btn-secondary with inline Tailwind */}
        <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Verify Your Email</h1>
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              We've sent a confirmation link to your email address.
            </p>
          </div>

          <div className="py-6 bg-muted rounded-lg space-y-3">
            <p className="font-heading text-2xl font-semibold text-primary">Check Your Email</p>
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Click the link in your email to verify your account and get started.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center">
              Resend Email
            </button>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Questions?{" "}
              <Link href="/contact" className="text-primary hover:underline font-medium">
                Contact support
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
          Back to home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
