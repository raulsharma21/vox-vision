import Link from "next/link"
import { Home, Book } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 p-4 z-10">
      <div className="flex space-x-4">
        <Link href="/" className="text-citron hover:text-citron/80 transition-colors">
          <Home size={24} />
          <span className="sr-only">Home</span>
        </Link>
        <Link href="/resources" className="text-citron hover:text-citron/80 transition-colors">
          <Book size={24} />
          <span className="sr-only">Resources</span>
        </Link>
      </div>
    </nav>
  )
}

