import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F0] via-[#F0F0EB] to-[#EBEBE6] text-[#2B2B2B] font-inter relative overflow-hidden">
      {/* Background decorations - EcoSense style */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-[#F4D35E]/20 to-[#F4D35E]/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-[#F4D35E]/15 to-[#F4D35E]/6 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-[#F4D35E]/12 to-[#F4D35E]/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-[#F4D35E]/8 to-[#F4D35E]/3 rounded-full blur-2xl"></div>
      <div className="absolute bottom-40 right-20 w-20 h-20 bg-gradient-to-br from-[#F4D35E]/6 to-[#F4D35E]/2 rounded-full blur-xl"></div>
      {/* Header */}
      <header className="py-20 md:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg className="h-8 w-8" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M10 30a14 14 0 1 1 4 -19" stroke="#2B2B2B" strokeWidth="2.4" strokeLinecap="round"/>
                <circle cx="28" cy="12" r="4" fill="#F4D35E"/>
              </svg>
              <span className="text-xl font-semibold tracking-tight text-[#2B2B2B]">EcoSense</span>
            </div>
            {/* CTA Button */}
            <Link href="/dashboard" className="text-sm font-medium underline underline-offset-4 hover:opacity-80 text-[#2B2B2B]">
              Ver Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="py-20 md:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#2B2B2B]">
                Entendé la economía de forma clara y sin estrés.
              </h1>
              <p className="text-lg md:text-xl text-[#2B2B2B]/70 mb-12 max-w-2xl">
                Interpretamos lo que está pasando, qué significa y por qué importa — para ayudarte a tomar mejores decisiones sin perder tiempo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard"
                  className="bg-[#F4D35E] text-[#2B2B2B] px-8 py-4 rounded-xl font-semibold text-lg hover:brightness-95 transition-all text-center"
                >
                  Ver Dashboard
                </Link>
                <a href="#" className="text-[#2B2B2B] px-8 py-4 rounded-xl font-semibold text-lg underline underline-offset-4 hover:opacity-80 transition-all text-center sm:text-left">
                  Seguir novedades
                </a>
              </div>
            </div>
            {/* Placeholder visual */}
            <div className="hidden lg:block">
              <div className="border border-black/5 rounded-xl p-8 h-96 flex items-center justify-center bg-white">
                <div className="text-center">
                  <p className="text-[#2B2B2B]/60 font-medium">Visualización de datos económicos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Indicadores Clave Section */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold mb-12 text-[#2B2B2B] text-center">Indicadores clave</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Dólar oficial */}
            <div className="rounded-xl border-2 border-[#F4D35E]/20 bg-white p-5 text-center hover:border-[#F4D35E]/40 hover:shadow-sm transition-all duration-300 cursor-pointer">
              <div className="text-sm text-[#2B2B2B]/60 mb-2 font-medium">Dólar oficial</div>
              <div className="text-2xl font-bold text-[#2B2B2B] mb-2">$850,00</div>
              <div className="text-xs px-2 py-1 rounded-full border border-green-200 text-green-700 bg-green-50 font-medium inline-block">
                = estable
              </div>
            </div>
            
            {/* Dólar MEP */}
            <div className="rounded-xl border-2 border-[#F4D35E]/20 bg-white p-5 text-center hover:border-[#F4D35E]/40 hover:shadow-sm transition-all duration-300 cursor-pointer">
              <div className="text-sm text-[#2B2B2B]/60 mb-2 font-medium">Dólar MEP</div>
              <div className="text-2xl font-bold text-[#2B2B2B] mb-2">$1.250,00</div>
              <div className="text-xs px-2 py-1 rounded-full border border-red-200 text-red-700 bg-red-50 font-medium inline-block">
                +2,1%
              </div>
            </div>
            
            {/* Reservas BCRA */}
            <div className="rounded-xl border-2 border-[#F4D35E]/20 bg-white p-5 text-center hover:border-[#F4D35E]/40 hover:shadow-sm transition-all duration-300 cursor-pointer">
              <div className="text-sm text-[#2B2B2B]/60 mb-2 font-medium">Reservas BCRA</div>
              <div className="text-2xl font-bold text-[#2B2B2B] mb-2">$23,2B</div>
              <div className="text-xs px-2 py-1 rounded-full border border-red-200 text-red-700 bg-red-50 font-medium inline-block">
                -1,2%
              </div>
            </div>
            
            {/* Inflación semanal */}
            <div className="rounded-xl border-2 border-[#F4D35E]/20 bg-white p-5 text-center hover:border-[#F4D35E]/40 hover:shadow-sm transition-all duration-300 cursor-pointer">
              <div className="text-sm text-[#2B2B2B]/60 mb-2 font-medium">Inflación semanal</div>
              <div className="text-2xl font-bold text-[#2B2B2B] mb-2">4,2%</div>
              <div className="text-xs px-2 py-1 rounded-full border border-green-200 text-green-700 bg-green-50 font-medium inline-block">
                = estable
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#2B2B2B]">Beneficios claros y simples.</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="rounded-xl border border-black/5 bg-white p-6 text-center">
              <div className="w-12 h-12 bg-[#F4D35E] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3">Señales que importan</h3>
              <p className="text-[#2B2B2B]/70">Te avisamos solo cuando algo realmente cambia.</p>
            </div>
            {/* Card 2 */}
            <div className="rounded-xl border border-black/5 bg-white p-6 text-center">
              <div className="w-12 h-12 bg-[#F4D35E] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3">Ahorro de tiempo</h3>
              <p className="text-[#2B2B2B]/70">Eliminamos el ruido para que veas lo esencial.</p>
            </div>
            {/* Card 3 */}
            <div className="rounded-xl border border-black/5 bg-white p-6 text-center">
              <div className="w-12 h-12 bg-[#F4D35E] rounded-full mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3">Decisiones con sentido</h3>
              <p className="text-[#2B2B2B]/70">Entendé el contexto antes de actuar.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#2B2B2B]">Sé el primero en saberlo.</h2>
          <p className="text-xl lg:text-2xl text-[#2B2B2B]/70 mb-12 max-w-3xl mx-auto">
            Unite a la lista temprana y recibí interpretación clara cuando algo importante suceda.
          </p>
          <div className="flex flex-col lg:flex-row gap-4 max-w-2xl mx-auto">
            <Link 
              href="/dashboard"
              className="bg-[#F4D35E] text-[#2B2B2B] px-8 py-4 rounded-xl font-semibold text-lg hover:brightness-95 transition-all text-center"
            >
              Ver Dashboard
            </Link>
            <a href="#" className="text-[#2B2B2B] px-8 py-4 rounded-xl font-semibold text-lg underline underline-offset-4 hover:opacity-80 transition-all text-center sm:text-left">
              Solo quiero estar atento
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-black/5 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-[#2B2B2B]/60">
            EcoSense · Política de Privacidad · Términos de Uso
          </p>
        </div>
      </footer>
    </div>
  );
}
