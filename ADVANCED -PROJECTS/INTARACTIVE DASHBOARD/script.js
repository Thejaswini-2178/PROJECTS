// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const timePeriodSelect = document.getElementById('time-period');
const orderSearch = document.getElementById('order-search');
const ordersTableBody = document.getElementById('orders-table-body');
const exportBtn = document.querySelector('.export-btn');

// Sample data for orders table
const ordersData = [
    { id: '#ORD-001', customer: 'John Smith', date: '2023-05-15', status: 'completed', amount: '$125.00' },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: '2023-05-14', status: 'completed', amount: '$89.50' },
    { id: '#ORD-003', customer: 'Michael Brown', date: '2023-05-14', status: 'processing', amount:'$45.56'}
]