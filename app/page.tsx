'use client';

import { Play, Map, Trophy } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { UserProfile } from "@/components/auth/user-profile";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b border-white/50 backdrop-blur-sm fixed w-full z-50 transition-all bg-white/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌊</span>
          <span className="font-heading font-bold text-2xl text-brand-700 tracking-tight">SeeVoca</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-500 animate-spin" />
          ) : user ? (
            <UserProfile />
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
                Log in
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-brand-600 text-white rounded-full font-bold shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-brand-50 via-white to-white -z-10" />
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary-light/20 rounded-full blur-[100px] animate-pulse-subtle -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-light/20 rounded-full blur-[100px] animate-pulse-subtle delay-1000 -z-10" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 shadow-sm mb-8 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-brand-600 tracking-wide uppercase">New: iPad Support</span>
            </div>

            <h1 className="font-heading text-6xl lg:text-8xl font-black text-slate-900 mb-6 leading-tight animate-fade-in-up delay-100">
              Vocabulary <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-secondary-DEFAULT">Adventure</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
              Forget boring flashcards. Join Max the Dog on a magical journey where stories come to life and learning feels like playing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <button
                onClick={() => user ? router.push('/play') : router.push('/login')}
                className="group relative px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-600/20 hover:shadow-2xl hover:shadow-brand-600/40 hover:-translate-y-1 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  {user ? 'Continue Journey' : 'Start Free Trial'}
                </span>
                {!user && (
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-dark text-xs font-bold px-2 py-1 rounded-full animate-bounce-slow">
                    FREE
                  </div>
                )}
              </button>

              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Watch Demo
              </button>
            </div>

            {/* Floating Elements (Visual Polish) */}
            <div className="absolute top-1/2 left-10 lg:left-40 animate-float hidden lg:block">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-brand-900/5 rotate-[-6deg]">
                <span className="text-4xl">🐶</span>
              </div>
            </div>
            <div className="absolute top-1/2 right-10 lg:right-40 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-brand-900/5 rotate-[6deg]">
                <span className="text-4xl">📚</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-lg text-slate-500">Simple 3-step magic formula</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300">
                <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-slate-800">Watch Stories</h3>
                <p className="text-slate-600 leading-relaxed">
                  Immerse in 3-minute clay animation stories where 20 new words are naturally woven into the narrative.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-secondary-900/5 transition-all duration-300">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-slate-800">Play Games</h3>
                <p className="text-slate-600 leading-relaxed">
                  Defend your base by matching falling words. Wrong answers shake the screen, correct ones pop with joy!
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-accent-900/5 transition-all duration-300">
                <div className="w-16 h-16 bg-accent-light/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-accent-dark" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-3 text-slate-800">Earn Badges</h3>
                <p className="text-slate-600 leading-relaxed">
                  Collect stars, unlock new maps, and earn badges. Progress visualization keeps motivation high.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© 2026 SeeVoca. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
