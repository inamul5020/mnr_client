import { useState, useEffect } from 'react';
import { ClientIntake } from '../types';
import { clientIntakeApi, exportApi, downloadFile } from '../lib/api';
import { Search, Download, Trash2, RefreshCw, Eye, Edit, Plus, ArrowRight, Save, X } from 'lucide-react';
import { ClientDetailView } from '../components/ClientDetailView';

export function AdminDashboard() {
  const [clientIntakes, setClientIntakes] = useState<ClientIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientIntake | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientIntake | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<ClientIntake>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deletePasscode, setDeletePasscode] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    service: '',
    ramisStatus: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await clientIntakeApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      if (response.success) {
        setClientIntakes(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, filters]);

  const handleViewDetails = (client: ClientIntake) => {
    setSelectedClient(client);
    setShowDetailView(true);
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedClient(null);
  };

  const handleEditClient = (client: ClientIntake) => {
    setEditingClient(client);
    setEditFormData({ ...client });
    setEditErrors({});
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingClient(null);
    setEditFormData({});
    setEditErrors({});
  };

  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (editErrors[field]) {
      setEditErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateEditForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!editFormData.legalName?.trim()) {
      errors.legalName = 'Legal name is required';
    }
    if (!editFormData.ownerName?.trim()) {
      errors.ownerName = 'Owner name is required';
    }
    if (!editFormData.address?.trim()) {
      errors.address = 'Address is required';
    }
    if (!editFormData.phoneMobile?.trim()) {
      errors.phoneMobile = 'Mobile phone is required';
    }
    if (!editFormData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!editFormData.natureOfBusiness?.trim()) {
      errors.natureOfBusiness = 'Nature of business is required';
    }
    if (!editFormData.servicesSelected || editFormData.servicesSelected.length === 0) {
      errors.servicesSelected = 'At least one service must be selected';
    }
    if (!editFormData.consent) {
      errors.consent = 'Consent is required';
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateClient = async () => {
    if (!validateEditForm() || !editingClient?.id) return;
    
    setIsSaving(true);
    try {
      const response = await clientIntakeApi.update(editingClient.id, editFormData as ClientIntake);
      if (response.success) {
        fetchData();
        handleCloseEditForm();
        setError(null);
      } else {
        setError('Failed to update client intake');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update client intake');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete || !deletePasscode) return;

    try {
      const response = await clientIntakeApi.delete(clientToDelete, deletePasscode);
      if (response.success) {
        fetchData();
        setShowDeleteModal(false);
        setClientToDelete(null);
        setDeletePasscode('');
        setError(null);
      } else {
        setError('Failed to delete client intake');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete client intake');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
    setDeletePasscode('');
  };


  const handleExportExcel = async (id: string) => {
    try {
      const blob = await exportApi.exportExcel(id);
      downloadFile(blob, `client-intake-${id}.xlsx`);
    } catch (err: any) {
      setError(err.message || 'Failed to export Excel');
    }
  };

  const handleExportCsv = async (id: string) => {
    try {
      const blob = await exportApi.exportCsv(id);
      downloadFile(blob, `client-intake-${id}.csv`);
    } catch (err: any) {
      setError(err.message || 'Failed to export CSV');
    }
  };

  const handleExportAllExcel = async () => {
    try {
      const blob = await exportApi.exportAllExcel();
      downloadFile(blob, `all-client-intakes-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err: any) {
      setError(err.message || 'Failed to export all Excel');
    }
  };

  const handleExportAllCsv = async () => {
    try {
      const blob = await exportApi.exportAllCsv();
      downloadFile(blob, `all-client-intakes-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err: any) {
      setError(err.message || 'Failed to export all CSV');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation button to create new client form */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage client intake submissions and export data
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Client Form
            <ArrowRight className="h-4 w-4 ml-2" />
          </a>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10 w-full sm:w-64"
              />
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="COMPANY">Company</option>
              <option value="NGO">NGO</option>
              <option value="OTHER">Other</option>
            </select>

            <select
              value={filters.ramisStatus}
              onChange={(e) => setFilters({ ...filters, ramisStatus: e.target.value })}
              className="input"
            >
              <option value="">All RAMIS Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="NOT_AVAILABLE">Not Available</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleExportAllExcel}
              className="btn btn-outline inline-flex items-center px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Excel
            </button>
            <button
              onClick={handleExportAllCsv}
              className="btn btn-outline inline-flex items-center px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Export All CSV
            </button>
            <button
              onClick={fetchData}
              className="btn btn-secondary inline-flex items-center px-4 py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : clientIntakes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No client intakes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RAMIS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientIntakes.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {client.legalName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {client.servicesSelected.slice(0, 2).join(', ')}
                        {client.servicesSelected.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.ramisStatus === 'AVAILABLE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {client.ramisStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date((client as any).submittedAt || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(client)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditClient(client)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExportExcel(client.id!)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Export Excel"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExportCsv(client.id!)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Export CSV"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(client.id!)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Detail View Modal */}
      {selectedClient && (
        <ClientDetailView
          client={selectedClient}
          isOpen={showDetailView}
          onClose={handleCloseDetailView}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this client intake? This action cannot be undone.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter delete passcode:
                </label>
                <input
                  type="password"
                  value={deletePasscode}
                  onChange={(e) => setDeletePasscode(e.target.value)}
                  className="input w-full"
                  placeholder="MNR_DELETE_2024"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={!deletePasscode}
                  className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingClient && showEditForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex justify-center items-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Client: {editingClient.legalName}</h2>
              <button onClick={handleCloseEditForm} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section A - Organization Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Organization Details</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name *</label>
                    <input
                      type="text"
                      value={editFormData.legalName || ''}
                      onChange={(e) => handleEditFormChange('legalName', e.target.value)}
                      className={`input ${editErrors.legalName ? 'border-red-500' : ''}`}
                    />
                    {editErrors.legalName && <p className="text-red-500 text-xs mt-1">{editErrors.legalName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trade Name</label>
                    <input
                      type="text"
                      value={editFormData.tradeName || ''}
                      onChange={(e) => handleEditFormChange('tradeName', e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      value={editFormData.type || ''}
                      onChange={(e) => handleEditFormChange('type', e.target.value)}
                      className="input"
                    >
                      <option value="INDIVIDUAL">Individual</option>
                      <option value="PARTNERSHIP">Partnership</option>
                      <option value="COMPANY">Company</option>
                      <option value="NGO">NGO</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner/Primary Contact *</label>
                    <input
                      type="text"
                      value={editFormData.ownerName || ''}
                      onChange={(e) => handleEditFormChange('ownerName', e.target.value)}
                      className={`input ${editErrors.ownerName ? 'border-red-500' : ''}`}
                    />
                    {editErrors.ownerName && <p className="text-red-500 text-xs mt-1">{editErrors.ownerName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <textarea
                      value={editFormData.address || ''}
                      onChange={(e) => handleEditFormChange('address', e.target.value)}
                      className={`input ${editErrors.address ? 'border-red-500' : ''}`}
                      rows={3}
                    />
                    {editErrors.address && <p className="text-red-500 text-xs mt-1">{editErrors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      value={editFormData.phoneMobile || ''}
                      onChange={(e) => handleEditFormChange('phoneMobile', e.target.value)}
                      className={`input ${editErrors.phoneMobile ? 'border-red-500' : ''}`}
                    />
                    {editErrors.phoneMobile && <p className="text-red-500 text-xs mt-1">{editErrors.phoneMobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => handleEditFormChange('email', e.target.value)}
                      className={`input ${editErrors.email ? 'border-red-500' : ''}`}
                    />
                    {editErrors.email && <p className="text-red-500 text-xs mt-1">{editErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Business *</label>
                    <input
                      type="text"
                      value={editFormData.natureOfBusiness || ''}
                      onChange={(e) => handleEditFormChange('natureOfBusiness', e.target.value)}
                      className={`input ${editErrors.natureOfBusiness ? 'border-red-500' : ''}`}
                    />
                    {editErrors.natureOfBusiness && <p className="text-red-500 text-xs mt-1">{editErrors.natureOfBusiness}</p>}
                  </div>
                </div>

                {/* Section B - Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Services & Tax Info</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services Selected *</label>
                    <div className="space-y-2">
                      {['Direct Tax', 'Indirect Tax', 'HR Services', 'SLTDA', 'Trade License'].map(service => (
                        <label key={service} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={editFormData.servicesSelected?.includes(service) || false}
                            onChange={(e) => {
                              const current = editFormData.servicesSelected || [];
                              if (e.target.checked) {
                                handleEditFormChange('servicesSelected', [...current, service]);
                              } else {
                                handleEditFormChange('servicesSelected', current.filter(s => s !== service));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{service}</span>
                        </label>
                      ))}
                    </div>
                    {editErrors.servicesSelected && <p className="text-red-500 text-xs mt-1">{editErrors.servicesSelected}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TIN</label>
                    <input
                      type="text"
                      value={editFormData.tin || ''}
                      onChange={(e) => handleEditFormChange('tin', e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RAMIS Status</label>
                    <select
                      value={editFormData.ramisStatus || ''}
                      onChange={(e) => handleEditFormChange('ramisStatus', e.target.value)}
                      className="input"
                    >
                      <option value="AVAILABLE">Available</option>
                      <option value="NOT_AVAILABLE">Not Available</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RAMIS Email</label>
                    <input
                      type="email"
                      value={editFormData.ramisEmail || ''}
                      onChange={(e) => handleEditFormChange('ramisEmail', e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editFormData.notes || ''}
                      onChange={(e) => handleEditFormChange('notes', e.target.value)}
                      className="input"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editFormData.consent || false}
                      onChange={(e) => handleEditFormChange('consent', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Consent Given *</span>
                    {editErrors.consent && <p className="text-red-500 text-xs ml-2">{editErrors.consent}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleCloseEditForm}
                  className="btn btn-secondary"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleUpdateClient}
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
