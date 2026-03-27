export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    active: '#10b981',
    inactive: '#6b7280',
    suspended: '#ef4444',
    draft: '#94a3b8',
    confirmed: '#f59e0b',
    processing: '#06b6d4',
    dispatched: '#3b82f6',
    in_transit: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
    pending: '#f59e0b',
    completed: '#10b981',
  };
  return colors[status] || '#6b7280';
};

export const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge-success',
    inactive: 'badge-secondary',
    suspended: 'badge-danger',
    draft: 'badge-secondary',
    confirmed: 'badge-warning',
    processing: 'badge-info',
    dispatched: 'badge-info',
    in_transit: 'badge-info',
    delivered: 'badge-success',
    cancelled: 'badge-danger',
    pending: 'badge-warning',
    completed: 'badge-success',
  };
  return classes[status] || 'badge-secondary';
};

export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncate = (str, len = 50) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const downloadCSV = (data, filename) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const generateColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
