import React, { useEffect, useState, memo } from 'react'
import { useData } from '../context/DataContext'

const About = memo(function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const { teamMembers } = useData()

  useEffect(() => {
    setIsVisible(true)
    
    // Track page visits for community engagement metric
    const visits = localStorage.getItem('mati_website_visits')
    const currentVisits = visits ? parseInt(visits) : 0
    const newVisits = currentVisits + 1
    localStorage.setItem('mati_website_visits', newVisits.toString())
    setVisitCount(newVisits) // Show actual visit count
  }, [])

  const timeline = [
    { year: '2024', event: 'Platform founded with initial biodiversity surveys', status: 'completed' },
    { year: '2025', event: 'AR features launched and community partnerships established', status: 'completed' },
    { year: '2026', event: 'Expanded to 15 protected areas with 20 documented species', status: 'current' },
    { year: '2027', event: 'Planning international collaboration and advanced monitoring tools', status: 'planned' }
  ]

  const impact = [
    { metric: '20', label: 'Species documented' },
    { metric: '15', label: 'Protected areas mapped' },
    { metric: `${visitCount.toLocaleString()}+`, label: 'Community members engaged' },
    { metric: '0', label: 'Partner organizations' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 dark:bg-emerald-500/10 backdrop-blur-sm border border-blue-600/20 dark:border-emerald-500/20 rounded-full text-sm font-semibold text-blue-700 dark:text-emerald-400 mb-6">
            <span className="w-2 h-2 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></span>
            About the Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Mati ARBio
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            A digital platform connecting technology with biodiversity conservation in Mati City.
          </p>
        </div>

        {/* Timeline */}
        <div className={`mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">📅</span>
            Project Timeline
          </h3>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -left-1 top-0 bottom-0 w-1 ${
                  item.status === 'completed' ? 'bg-gradient-to-b from-emerald-500 to-teal-500' :
                  item.status === 'current' ? 'bg-gradient-to-b from-blue-500 to-cyan-500' :
                  'bg-slate-300 dark:bg-slate-600'
                }`}></div>
                <div className="ml-6 flex items-center gap-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-emerald-500/50">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{item.year}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-700 dark:text-slate-300">{item.event}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50' :
                      item.status === 'current' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50 animate-pulse' :
                      'bg-slate-400'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meet the Team */}
        <div className={`mb-16 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
              <span className="text-3xl">👥</span>
              Meet the Team
            </h3>
            <p className="text-slate-600 dark:text-slate-400">The people behind Mati ARBio</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                  {/* Photo Container */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Placeholder - Replace with actual image */}
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {/* Uncomment when you have photos:
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      */}
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {member.name}
                    </h4>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-3">
                      {member.role}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className={`mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
            <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center flex items-center justify-center gap-2">
                <span className="text-3xl">📊</span>
                Our Impact
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {impact.map((item, index) => (
                  <div key={index} className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-emerald-200/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:scale-110">
                    <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">{item.metric}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`text-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
            <div className="relative p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 dark:bg-purple-500/10 backdrop-blur-sm border border-purple-600/20 dark:border-purple-500/20 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-400 mb-6">
                <span className="text-xl">🎯</span>
                Our Mission
              </div>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                To create accessible tools for biodiversity documentation and conservation education,
                bridging the gap between scientific research and public understanding through technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default About