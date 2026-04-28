import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Users, Zap, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Smart Volunteer Coordination for <span className="text-brand-500">Social Impact</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Aram Seivom connects local NGOs and communities with ready volunteers during emergencies using AI-driven priority detection and matching.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Submit Need Report
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-black rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Join as Volunteer
              </Link>
            </div>
            <div className="mt-6 flex justify-center gap-4">
               <Link to="/login" className="text-gray-500 hover:text-brand-600 font-medium inline-flex items-center gap-1 transition-colors">
                 Login <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 w-full h-full overflow-hidden opacity-30">
           <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
           <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
           <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How Aram Seivom Works</h2>
            <p className="mt-4 text-lg text-gray-600">Our platform uses smart matching to save time when it matters most.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              title="AI Priority Detection"
              description="Automatically analyzes incoming reports to flag critical needs and assign priority scores."
            />
            <FeatureCard 
              icon={<Users className="w-8 h-8 text-brand-500" />}
              title="Fast Volunteer Matching"
              description="Matches the right skills, availability, and location to urgent community needs instantly."
            />
            <FeatureCard 
              icon={<LayoutDashboard className="w-8 h-8 text-purple-500" />}
              title="Real-Time Dashboard"
              description="Monitor everything from pending tasks to volunteer availability in one comprehensive view."
            />
            <FeatureCard 
              icon={<ShieldAlert className="w-8 h-8 text-green-500" />}
              title="Disaster & Social Help"
              description="Built for NGOs and local bodies handling natural disasters, medical emergencies, or basic needs."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
