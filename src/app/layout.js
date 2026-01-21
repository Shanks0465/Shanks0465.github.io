import '../styles/globals.css'
import CodeRain from '../components/CodeRain'

export const metadata = {
  title: 'Umashankar | Developer Portfolio',
  description: 'Full Stack Developer specializing in web applications and cloud technologies',
  keywords: ['developer', 'portfolio', 'full stack', 'react', 'node.js'],
  authors: [{ name: 'Umashankar Kumaravelan' }],
  openGraph: {
    title: 'Umashankar | Developer Portfolio',
    description: 'Full Stack Developer specializing in web applications',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="scanlines">
        <CodeRain />
        {children}
      </body>
    </html>
  )
}
