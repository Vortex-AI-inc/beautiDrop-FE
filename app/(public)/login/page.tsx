import { SignIn } from '@clerk/nextjs'
import { Header } from "../../../components/layout/header"
import { Footer } from "../../../components/layout/footer"

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <Header />

            <div className="flex-grow min-h-[95vh] pt-40 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <SignIn
                        appearance={{
                            elements: {
                                formButtonPrimary:
                                    'bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg',
                                card: 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-2xl',
                                headerTitle: 'text-3xl font-bold text-gray-900',
                                headerSubtitle: 'text-gray-500',
                                socialButtonsBlockButton:
                                    'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-lg',
                                formFieldInput:
                                    'border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                                footerActionLink: 'text-blue-600 hover:text-blue-500 font-medium',
                            },
                        }}
                        routing="path"
                        path="/login"
                        signUpUrl="/signup"
                        afterSignInUrl="/"
                    />
                </div>
            </div>

            <Footer />
        </main>
    )
}
