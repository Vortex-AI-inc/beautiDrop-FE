import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    variant?: "horizontal" | "stacked"
    size?: "sm" | "md" | "lg"
    theme?: "light" | "dark"
}

export function Logo({ className, variant = "horizontal", size = "md", theme = "light" }: LogoProps) {
    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-4xl",
    }

    const textColor = theme === "dark" ? "text-white" : "text-gray-900"

    // Always use the stacked layout as requested by the user, 
    // or we can keep the variant prop but update the stacked implementation.
    // The user said "our logo should looks like this", implying this is THE logo.
    // However, for a header, a horizontal version might still be useful.
    // I will update the 'stacked' variant to match the description perfectly.

    if (variant === "stacked") {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <div className={cn("flex flex-col justify-between", sizeClasses[size])}>
                    <span className="text-blue-600 font-bold leading-none tracking-tight">BEAUTY</span>
                    <div className="h-[2px] w-full bg-amber-400 my-0.5" />
                    <div className={cn("flex justify-between w-full font-bold leading-none", textColor)}>
                        <span>D</span>
                        <span>R</span>
                        <span>O</span>
                        <span>P</span>
                    </div>
                </div>
                <span className={cn("text-amber-400 font-bold leading-none", size === "lg" ? "text-7xl" : "text-5xl")}>AI</span>
            </div>
        )
    }

    // Horizontal variant (fallback or for smaller spaces)
    return (
        <div className={cn("flex items-center font-bold tracking-tight", sizeClasses[size], className)}>
            <span className="text-blue-600">BEAUTY</span>
            <span className={cn("ml-1.5", textColor)}>DROP</span>
            <span className="text-amber-400 ml-1">AI</span>
        </div>
    )
}
