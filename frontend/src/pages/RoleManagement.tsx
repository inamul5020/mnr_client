import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users } from 'lucide-react';
import { Role, RoleFormData, StaffRoleType } from '../types/staff';
import { API_BASE_URL } from '../lib/apiConfig';

const ROLE_TYPE_OPTIONS: { value: StaffRoleType; label: string }[] = [
  { value: 'STAFF', label: 'Staff' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'PARTNER', label: 'Partner' },
  { value: 'HR', label: 'HR' },
  { value: 'OFFICE_ADMIN', label: 'Office Admin' },
];

export function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Role | null>(null);
  const [formData, setFormData] = useState<RoleFormData>({
    name: '',
    type: 'STAFF',
    description: ''
  });

  // Fetch roles
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/roles`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        console.error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingRole 
        ? `${API_BASE_URL}/api/roles/${editingRole.id}`
        : `${API_BASE_URL}/api/roles`;
      
      const method = editingRole ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchRoles();
        setShowModal(false);
        setEditingRole(null);
        setFormData({ name: '', type: 'STAFF', description: '' });
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save role');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Failed to save role');
    }
  };

  // Handle edit
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      type: role.type,
      description: role.description || ''
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (role: Role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/roles/${role.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRoles();
        setDeleteConfirm(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role');
    }
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600">Manage staff roles and permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setFormData({ name: '', type: 'STAFF', description: '' });
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Role
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Roles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading roles...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {role.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        role.type === 'PARTNER' ? 'bg-purple-100 text-purple-800' :
                        role.type === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                        role.type === 'SUPERVISOR' ? 'bg-green-100 text-green-800' :
                        role.type === 'HR' ? 'bg-pink-100 text-pink-800' :
                        role.type === 'OFFICE_ADMIN' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {role.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {role.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        {(role as any)._count?.staffRoles || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(role)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as StaffRoleType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {ROLE_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter role description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingRole(null);
                      setFormData({ name: '', type: 'STAFF', description: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                  >
                    {editingRole ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Role
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
                {deleteConfirm._count?.staffRoles > 0 && (
                  <span className="block mt-2 text-red-600">
                    This role is assigned to {deleteConfirm._count.staffRoles} staff members. 
                    Please reassign them first.
                  </span>
                )}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleteConfirm._count?.staffRoles > 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
