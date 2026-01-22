// ============================================
// RESTAUS - Landing Page
// ============================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
  Table as TableIcon,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20">
              <UtensilsCrossed className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              RESTAUS
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-600/20 text-orange-500 text-xs font-semibold mb-6 animate-fade-in">
                  <ShieldCheck className="w-3 h-3" />
                  The Next Generation of Restaurant Management
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                  Elevate Your <span className="text-orange-600">Dining</span> Experience
                </h1>
                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0">
                  A comprehensive digital solution to streamline your restaurant operations, from front-of-house service to back-of-house kitchen efficiency and administrative analytics.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white h-14 px-8 text-lg shadow-xl shadow-orange-600/20 group">
                      Get Started Today
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-white/10 bg-white/5 hover:bg-white/10 h-14 px-8 text-lg">
                    Schedule a Demo
                  </Button>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <span className="text-xs font-semibold tracking-widest uppercase">Trusted by</span>
                  <div className="flex gap-6">
                    {/* Add some dummy logos here if needed */}
                    <div className="font-bold">BISTRO</div>
                    <div className="font-bold">CAFE.CO</div>
                    <div className="font-bold">DINER</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-square lg:aspect-video">
                  <Image
                    src="/images/hero.png"
                    alt="RESTAUS Dashboard Preview"
                    fill
                    className="object-cover"
                  />
                  {/* Glass Overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>

                {/* Floating Elements */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl animate-bounce-slow hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Latest Transaction</div>
                      <div className="text-sm font-bold">$124.50 Success</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-10 -right-6 bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl animate-pulse hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-500">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Revenue Growth</div>
                      <div className="text-sm font-bold">+24.8% This Month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-slate-900/50 relative">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Every Role</h2>
            <p className="text-slate-400 max-w-3xl mx-auto">
              RESTAUS provides specialized dashboards for every member of your team, ensuring a seamless flow of information throughout your restaurant.
            </p>
          </div>

          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Waiter App"
              description="Real-time table tracking, digital ordering, and instant kitchen notifications."
              color="bg-orange-500"
            />
            <FeatureCard
              icon={<ChefHat className="w-6 h-6" />}
              title="Kitchen KDS"
              description="A robust kitchen display system to manage order priority and preparation status."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<CreditCard className="w-6 h-6" />}
              title="Cashier Desk"
              description="Fast payment processing with support for multiple payment methods and split bills."
              color="bg-green-500"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Admin Panel"
              description="Comprehensive analytics, stock management, and staff performance tracking."
              color="bg-purple-500"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl p-12 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 blur-[80px] rounded-full group-hover:bg-white/20 transition-all duration-700" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Transform Your Restaurant?</h2>
                <p className="text-orange-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join hundreds of restaurants that have already upgraded their service quality and operational efficiency with RESTAUS.
                </p>
                <Link href="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 h-14 px-10 text-xl font-bold rounded-full">
                    Register Your Restaurant Now
                  </Button>
                </Link>
                <div className="mt-8 text-sm text-orange-200">
                  No credit card required. Start your 14-day free trial today.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="text-slate-400 w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-500">
                RESTAUS
              </span>
            </div>

            <div className="text-sm text-slate-500">
              © 2026 RESTAUS. All rights reserved.
              <div className="mt-2 text-xs text-slate-600 space-x-2">
                <span>Demo Access:</span>
                <Link href="/tables" className="hover:text-orange-500 underline decoration-dotted">Customer Tables</Link>
                <span>•</span>
                <Link href="/menu?table=1" className="hover:text-orange-500 underline decoration-dotted">Direct Menu (T01)</Link>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Smartphone className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Smartphone className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Smartphone className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-left hover:border-white/10 hover:bg-white/[0.07] transition-all group">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
