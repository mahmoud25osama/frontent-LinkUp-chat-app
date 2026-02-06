const Logo = ({ size = 'md', showText = true }) => {
    const sizes = {
        sm: { container: 'w-8 h-8', text: 'text-sm', icon: 20 },
        md: { container: 'w-12 h-12', text: 'text-lg', icon: 28 },
        lg: { container: 'w-16 h-16', text: 'text-2xl', icon: 36 },
        xl: { container: 'w-24 h-24', text: 'text-4xl', icon: 52 },
    }

    const currentSize = sizes[size] || sizes.md

    return (
        <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className={`${currentSize.container} relative`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient
                            id="favicon_grad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop offset="0%" stop-color="#379ad5" />
                            <stop offset="100%" stop-color="#0284c7" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="50" fill="url(#favicon_grad)" />
                    <path
                        d="M38.5,28 L38.5,48 C38.5,53.5 43,58 48.5,58 L52.5,58 L52.5,51 L48.5,51 C46.8,51 45.5,49.7 45.5,48 L45.5,35 L38.5,28 Z M61.5,72 L61.5,52 C61.5,46.5 57,42 51.5,42 L47.5,42 L47.5,49 L51.5,49 C53.2,49 54.5,50.3 54.5,52 L54.5,65 L61.5,72 Z M38.5,28 L31.5,35 L45.5,35 L38.5,28 Z M61.5,72 L68.5,65 L54.5,65 L61.5,72 Z"
                        fill="white"
                    />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1
                        className={`font-bold text-gray-50 ${currentSize.text} leading-none tracking-tight`}
                    >
                        Link<span className="text-primary-400">Up</span>
                    </h1>
                    <p className="text-xs text-gray-300 font-medium">
                        Connect Instantly
                    </p>
                </div>
            )}
        </div>
    )
}

export default Logo
