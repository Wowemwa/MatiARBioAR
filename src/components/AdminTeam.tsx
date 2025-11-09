import { useState } from 'react'
import { useData, TeamMember } from '../context/DataContext'
import { PlusIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon } from './Icons'

interface TeamFormData {
  id: string
  name: string
  role: string
  image: string
  description: string
}

const emptyMember: TeamFormData = {
  id: '',
  name: '',
  role: '',
  image: '',
  description: ''
}

export default function AdminTeam() {
  const { teamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = useData()
  const [editingMember, setEditingMember] = useState<TeamFormData | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null)

  const handleCreate = () => {
    setIsCreating(true)
    setEditingMember({ ...emptyMember, id: Date.now().toString() })
  }

  const handleEdit = (member: TeamMember) => {
    setIsCreating(false)
    setEditingMember({ ...member })
  }

  const handleSave = () => {
    if (!editingMember) return

    if (isCreating) {
      createTeamMember(editingMember as TeamMember)
    } else {
      updateTeamMember(editingMember.id, editingMember)
    }

    setEditingMember(null)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setEditingMember(null)
    setIsCreating(false)
  }

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteTeamMember(memberToDelete.id)
      setShowDeleteConfirm(false)
      setMemberToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setMemberToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Team Members</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage team members displayed on the About page
          </p>
        </div>
        {!editingMember && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
          >
            <PlusIcon />
            Add Member
          </button>
        )}
      </div>

      {/* Edit/Create Form */}
      {editingMember && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-blue-500 dark:border-cyan-500 shadow-xl">
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {isCreating ? 'Add New Team Member' : 'Edit Team Member'}
          </h4>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role *
              </label>
              <input
                type="text"
                value={editingMember.role}
                onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent"
                placeholder="Lead Researcher"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Image URL *
              </label>
              <input
                type="text"
                value={editingMember.image}
                onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent"
                placeholder="/path/to/photo.jpg"
              />
              {editingMember.image && (
                <div className="mt-2">
                  <img 
                    src={editingMember.image} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128"%3E%3Crect fill="%23ddd" width="128" height="128"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description *
              </label>
              <textarea
                value={editingMember.description}
                onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:border-transparent"
                placeholder="Brief description of role and responsibilities"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={!editingMember.name || !editingMember.role || !editingMember.image || !editingMember.description}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <SaveIcon />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                <CancelIcon />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {member.name}
              </h4>
              <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-2">
                {member.role}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {member.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Delete Team Member
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to delete <strong>{memberToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
              >
                Delete
              </button>
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
