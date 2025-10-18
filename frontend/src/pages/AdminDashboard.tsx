import { useState, useEffect } from 'react';
import { ClientIntake } from '../types';
import { clientIntakeApi, exportApi, downloadFile } from '../lib/api';
import { Search, Download, Trash2, RefreshCw, Eye } from 'lucide-react';
import { ClientDetailView } from '../components/ClientDetailView';

export function AdminDashboard() {
  const [clientIntakes, setClientIntakes] = useState<ClientIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientIntake | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client intake?')) return;
    
    try {
      const response = await clientIntakeApi.delete(id);
      if (response.success) {
        fetchData();
      } else {
        setError('Failed to delete client intake');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete client intake');
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage client intake submissions and export data
        </p>
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
                          onClick={() => handleDelete(client.id!)}
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
    </div>
  );
}
