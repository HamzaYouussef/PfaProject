"use client"

import type React from "react"
import { useState } from "react"
import AppLayout from "../components/layout/AppLayout"
import Button from "../components/ui/Button"
import {
  Search,
  UserPlus,
  Frown,
  User,
  Mail,
  ChevronDown,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertTriangle,
} from "lucide-react"

interface UserData {
  id: number
  nom: string
  email: string
  role: string
}

interface UserFormData {
  nom: string
  email: string
  role: string
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [formData, setFormData] = useState<UserFormData>({ nom: "", email: "", role: "user" })
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({})

  // Mock data - replace with your actual data
  const [users, setUsers] = useState<UserData[]>([
    { id: 1, nom: "Jean Dupont", email: "jean.dupont@email.com", role: "admin" },
    { id: 2, nom: "Marie Martin", email: "marie.martin@email.com", role: "user" },
    { id: 3, nom: "Pierre Durand", email: "pierre.durand@email.com", role: "user" },
    { id: 4, nom: "Sophie Bernard", email: "sophie.bernard@email.com", role: "user" },
    { id: 5, nom: "Antoine Moreau", email: "antoine.moreau@email.com", role: "admin" },
    { id: 6, nom: "Bachir Feki", email: "camille.petit@email.com", role: "user" },
    { id: 7, nom: "Lucas Robert", email: "lucas.robert@email.com", role: "user" },
    { id: 8, nom: "Emma Richard", email: "emma.richard@email.com", role: "user" },
    { id: 9, nom: "Thomas Dubois", email: "thomas.dubois@email.com", role: "admin" },
    { id: 10, nom: "Julie Garcia", email: "julie.garcia@email.com", role: "admin" },
    { id: 11, nom: "Alexandre Roux", email: "alexandre.roux@email.com", role: "user" },
    { id: 12, nom: "Léa Fournier", email: "lea.fournier@email.com", role: "user" },
    { id: 13, nom: "Nicolas Girard", email: "nicolas.girard@email.com", role: "user" },
    { id: 14, nom: "Chloé André", email: "chloe.andre@email.com", role: "admin" },
    { id: 15, nom: "Maxime Lefebvre", email: "maxime.lefebvre@email.com", role: "user" },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Delete modal functions
  const openDeleteModal = (user: UserData) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      closeDeleteModal()
    }
  }

  // User form modal functions
  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({ nom: "", email: "", role: "user" })
    setFormErrors({})
    setShowUserModal(true)
  }

  const openEditModal = (user: UserData) => {
    setEditingUser(user)
    setFormData({ nom: user.nom, email: user.email, role: user.role })
    setFormErrors({})
    setShowUserModal(true)
  }

  const closeUserModal = () => {
    setShowUserModal(false)
    setEditingUser(null)
    setFormData({ nom: "", email: "", role: "user" })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {}

    if (!formData.nom.trim()) {
      errors.nom = "Le nom est requis"
    }

    if (!formData.email.trim()) {
      errors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "L'email n'est pas valide"
    }

    if (!formData.role) {
      errors.role = "Le rôle est requis"
    }

    // Check if email already exists (for create or different user in edit)
    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() && (!editingUser || user.id !== editingUser.id),
    )

    if (emailExists) {
      errors.email = "Cet email est déjà utilisé"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (editingUser) {
      // Edit existing user
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
    } else {
      // Create new user
      const newUser: UserData = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        ...formData,
      }
      setUsers([...users, newUser])
    }

    closeUserModal()
  }

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const roles = ["all", "admin", "user"]
  const roleOptions = ["admin", "user"]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              <p>Manage all registered users and their permissions</p>
            </div>
          </div>
          <div>
            <Button icon={<UserPlus className="h-4 w-4" />} variant="primary" onClick={openCreateModal}>
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.nom}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Frown className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
                        <p className="text-gray-400 text-sm">Essayez de modifier vos critères de recherche</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de <span className="font-medium">{indexOfFirstUser + 1}</span> à{" "}
                    <span className="font-medium">{Math.min(indexOfLastUser, filteredUsers.length)}</span> sur{" "}
                    <span className="font-medium">{filteredUsers.length}</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                      <span className="font-medium text-gray-900">{userToDelete?.nom}</span> ?
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Cette action est irréversible.</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={closeDeleteModal}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Form Modal (Create/Edit) */}
        {showUserModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
                </h3>
                <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.nom ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez le nom complet"
                  />
                  {formErrors.nom && <p className="mt-1 text-sm text-red-600">{formErrors.nom}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez l'adresse email"
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle *
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeUserModal}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingUser ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default UsersPage
