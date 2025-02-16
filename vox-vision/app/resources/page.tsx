import Footer from "../../components/footer"

export default function ResourcesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-coyote">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="inconsolata-xl font-light mb-8 text-citron"> </h1>
        <h1 className="inconsolata-lg font-light mb-8 text-citron">VoxVision Resources </h1>
        
        <div className="bg-walnut-brown text-citron p-6 rounded-md w-full">
          <h2 className="inconsolata-med font-thin mb-4">Useful Links</h2>
          <ul className="list-disc list-inside space-y-2">
            <li className="inconsolata-sm">
              <a
                href="https://www.nad.org/resources/american-sign-language/learning-american-sign-language/"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Association of the Deaf - Learning ASL
              </a>
            </li>
            <li className="inconsolata-sm">
              <a
                href="https://www.handspeak.com/"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                HandSpeak - ASL Dictionary
              </a>
            </li>
            <li className="inconsolata-sm">
              <a
                href="https://www.signingsavvy.com/"
                className="hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                SigningSavvy - Sign Language Dictionary
              </a>
            </li>
            <li className="inconsolata-sm">
              <a 
                href="https://www.startasl.com/" 
                className="hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Start ASL - Free ASL Courses
              </a>
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  )
}