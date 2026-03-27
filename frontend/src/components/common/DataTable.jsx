import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Edit2, Trash2, Download } from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  pagination = null,
  title = '',
  exportCSV = null,
  actions = true,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === data.length) setSelectedRows([]);
    else setSelectedRows(data.map((r) => r.id));
  };

  if (loading) {
    return (
      <div className="data-table-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-row" style={{ height: 44, marginBottom: 8, borderRadius: 6, background: '#f1f5f9', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h3>No records found</h3>
        <p>No data available matching your current filters.</p>
      </div>
    );
  }

  return (
    <div className="data-table-wrap">
      {(title || exportCSV) && (
        <div className="table-toolbar">
          {title && <span className="table-title">{title}</span>}
          {exportCSV && (
            <button className="btn btn-ghost btn-sm" onClick={exportCSV}>
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>
      )}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={toggleAll}
                />
              </th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className={selectedRows.includes(row.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleRow(row.id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
                {actions && (
                  <td>
                    <div className="row-actions">
                      {onView && (
                        <button className="action-btn view" title="View" onClick={() => onView(row)}>
                          <Eye size={14} />
                        </button>
                      )}
                      {onEdit && (
                        <button className="action-btn edit" title="Edit" onClick={() => onEdit(row)}>
                          <Edit2 size={14} />
                        </button>
                      )}
                      {onDelete && (
                        <button className="action-btn delete" title="Delete" onClick={() => onDelete(row)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pagination">
          <span className="pagination-info">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </span>
          <div className="pagination-controls">
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.ceil(pagination.total / pagination.limit))].map((_, i) => {
              const pg = i + 1;
              if (pg === 1 || pg === Math.ceil(pagination.total / pagination.limit) || Math.abs(pg - pagination.page) <= 1) {
                return (
                  <button
                    key={pg}
                    className={`btn btn-sm ${pg === pagination.page ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => pagination.onPageChange(pg)}
                  >
                    {pg}
                  </button>
                );
              }
              if (Math.abs(pg - pagination.page) === 2) return <span key={pg} style={{ padding: '0 4px' }}>…</span>;
              return null;
            })}
            <button
              className="btn btn-ghost btn-sm"
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
