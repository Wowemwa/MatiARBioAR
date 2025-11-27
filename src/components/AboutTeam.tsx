import { memo } from 'react'

interface TeamMember {
  name: string
  role: string
  description: string
  image?: string
}

interface AboutTeamProps {
  teamMembers: TeamMember[]
}

const AboutTeam = memo(function AboutTeam({ teamMembers }: AboutTeamProps) {
  return (
    <div className="mb-16 sm:mb-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
          <span className="text-2xl">👥</span>
          Meet Our Team
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Passionate individuals dedicated to biodiversity conservation and technology innovation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-emerald-500/50">

              {/* Professional Header with Photo */}
              <div className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-800 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-avatar') as HTMLElement
                        if (fallback) fallback.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  {/* Professional Avatar Fallback */}
                  <div
                    className="fallback-avatar w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white dark:border-slate-800 transition-all duration-300 group-hover:scale-110"
                    style={{ display: member.image ? 'none' : 'flex' }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                </div>
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Professional Content Section */}
              <div className="p-6">
                {/* Name and Title */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 text-blue-700 dark:text-slate-300 text-sm font-medium rounded-full border border-blue-200 dark:border-slate-500">
                    {member.role}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center mb-4">
                  {member.description}
                </p>

                {/* Professional accent line */}
                <div className="flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300 group-hover:w-24"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default AboutTeam