import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 400

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        function updateVisibility() {
            const shouldShow = window.scrollY > SCROLL_THRESHOLD
            setIsVisible((current) => current === shouldShow ? current : shouldShow)
        }

        updateVisibility()
        window.addEventListener('scroll', updateVisibility, { passive: true })
        return () => window.removeEventListener('scroll', updateVisibility)
    }, [])

    if (!isVisible) return null

    return (
        <button
            className="scroll-to-top btn btn-danger rounded-circle shadow"
            type="button"
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
            onClick={() => {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                })
            }}
        >
            <span aria-hidden="true">&#8593;</span>
        </button>
    )
}
