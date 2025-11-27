import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function PostCheckoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tertiary/5 via-background to-primary/5 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-tertiary" />
        </div>

        {/* Content - replaced card-base, heading-2, body-default, heading-4, btn-primary, body-small with inline Tailwind */}
        <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Payment Successful</h1>
            <p className="font-sans text-base leading-relaxed text-muted-foreground">
              Your subscription is active! You're all set to start using BeautyDrop AI.
            </p>
          </div>

          <div className="py-6 bg-muted rounded-lg space-y-3">
            <p className="font-heading text-xl font-semibold text-foreground">What's Next?</p>
            <ul className="text-left space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Your subscription is active</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Access to all features</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Onboarding support team standing by</span>
              </li>
            </ul>
          </div>

          <Link
            href="/portal"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
          >
            Access Your Portal
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-4 border-t border-border space-y-3">
            <p className="font-sans text-sm leading-relaxed text-muted-foreground">
              Your invoice has been sent to your email address.
            </p>
            <Link href="/contact" className="text-primary hover:underline text-sm font-medium">
              Need help? Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
