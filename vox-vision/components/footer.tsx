import { Github, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto pt-8 w-full">
      <div className="flex justify-center space-x-4 mb-2">
        <a
          href="https://github.com/raulsharma21/vox-vision"
          target="_blank"
          rel="noopener noreferrer"
          className="text-citron hover:text-citron/80"
        >
          <Github size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/raul-sharma-046937256/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-citron hover:text-citron/80"
        >
          <Linkedin size={24} />
        </a>
      </div>
      <p className="text-center text-sm text-citron momcake-med">&copy; 2025 VoxVision. All rights reserved.</p>
    </footer>
  )
}

