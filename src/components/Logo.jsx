const Logo = ({ size = 'md', showText = true }) => {
    const sizes = {
        sm: { container: 'w-8 h-8', text: 'text-sm', icon: 20 },
        md: { container: 'w-12 h-12', text: 'text-lg', icon: 28 },
        lg: { container: 'w-16 h-16', text: 'text-2xl', icon: 36 },
        xl: { container: 'w-24 h-24', text: 'text-4xl', icon: 52 },
    }

    const currentSize = sizes[size] || sizes.md

    return (
        <div className="flex items-center  gap-3">
            {/* Logo Icon */}
            <div className={`${currentSize.container} relative`}>
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            id="logoGrad"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                style={{ stopColor: '#0ea5e9', stopOpacity: 1 }}
                            />
                            <stop
                                offset="100%"
                                style={{ stopColor: '#0284c7', stopOpacity: 1 }}
                            />
                        </linearGradient>
                        <filter id="shadow">
                            <feDropShadow
                                dx="0"
                                dy="2"
                                stdDeviation="3"
                                floodOpacity="0.3"
                            />
                        </filter>
                    </defs>

                    {/* Background Circle with Gradient */}
                    <circle
                        cx="50"
                        cy="50"
                        r="48"
                        fill="url(#logoGrad)"
                        filter="url(#shadow)"
                    />

                    {/* Chat Bubble */}
                    <path
                        d="M 30 35 Q 30 25 40 25 L 70 25 Q 80 25 80 35 L 80 55 Q 80 65 70 65 L 50 65 L 40 75 L 40 65 L 40 65 Q 30 65 30 55 Z"
                        fill="white"
                        opacity="0.95"
                    />

                    {/* Message Lines */}
                    <line
                        x1="40"
                        y1="38"
                        x2="70"
                        y2="38"
                        stroke="#0284c7"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <line
                        x1="40"
                        y1="47"
                        x2="60"
                        y2="47"
                        stroke="#0284c7"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <line
                        x1="40"
                        y1="56"
                        x2="65"
                        y2="56"
                        stroke="#0284c7"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Logo Text */}
            {showText && (
                <div className="flex flex-col">
                    <h1
                        className={`font-bold text-gray-50 ${currentSize.text} leading-none`}
                    >
                        تطبيق الدردشة
                    </h1>
                    <p className="text-xs text-gray-200">محادثات فورية</p>
                </div>
            )}
        </div>
    )
}

export default Logo
