import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-medium tracking-tight">Flow Experiments Lab</span>
          <nav className="flex items-center gap-6">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#principles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Principles
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-balance max-w-xl">
            A space for building and experimentation.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-lg">
            For indie builders, founders, and technical entrepreneurs who ship.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Button className="gap-2">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              Learn more
            </Button>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* About */}
        <section id="about" className="scroll-mt-20 mx-auto max-w-5xl px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">About</h2>
              <p className="text-foreground text-lg leading-relaxed">
                Flow Experiments Lab is a minimal workspace for builders who value iteration over perfection. No motivational slogans. No hype. Just tools and space to experiment.
              </p>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Focus</h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>Rapid prototyping and validation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>Small, focused experiments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>Shipping over planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>Learning through building</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Principles */}
        <section id="principles" className="scroll-mt-20 mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-8">Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="font-medium">Start small</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every experiment begins with a minimal viable version. Complexity comes later, if at all.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Iterate fast</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ship early. Gather feedback. Adjust. Repeat. Speed matters more than perfection.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Stay functional</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every feature serves a purpose. If it doesn't help users, it doesn't ship.
              </p>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-medium">Ready to build?</h2>
              <p className="text-muted-foreground mt-1">No signup required. Start experimenting now.</p>
            </div>
            <Button className="gap-2 w-fit">
              Enter the lab
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">Flow Experiments Lab</span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
