// Initialize
let donations = JSON.parse(localStorage.getItem('donations')) || [];
let chart = null;

// DOM Elements
const [form, table, totalEl, countEl] = ['donation-form', 'donations-table', 'total-donations', 'donation-count']
    .map(id => document.getElementById(id));

// Form Submit
form.addEventListener('submit', e => {
    e.preventDefault();
    const [name, amount, date, category] = e.target.elements;
    
    donations.unshift({
        id: Date.now(),
        name: name.value,
        amount: +amount.value,
        date: date.value,
        category: category.value
    });
    
    saveAndRender();
    form.reset();
    date.value = new Date().toISOString().split('T')[0];
});

// Search Functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Render Functions
const renderDonations = () => {
    table.innerHTML = donations.map(d => `
        <tr>
            <td>${new Date(d.date).toLocaleDateString()}</td>
            <td>${d.name}</td>
            <td>₹${d.amount.toFixed(2)}</td>
            <td><span class="badge bg-primary">${d.category}</span></td>
            <td><button class="btn btn-sm btn-danger" onclick="deleteDonation(${d.id})">Delete</button></td>
        </tr>
    `).join('');
};

const renderSummary = () => {
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    totalEl.textContent = `₹${total.toFixed(2)}`;
    countEl.textContent = donations.length;
};

const renderChart = () => {
    const categories = donations.reduce((acc, d) => 
        (acc[d.category] = (acc[d.category] || 0) + d.amount, acc), {});
    
    if (chart) chart.destroy();
    
    chart = new Chart(document.getElementById('chart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#0d6efd', '#20c997', '#fd7e14', '#6f42c1']
            }]
        }
    });
};

// Helpers
const saveAndRender = () => {
    localStorage.setItem('donations', JSON.stringify(donations));
    renderDonations();
    renderSummary();
    renderChart();
};

window.deleteDonation = id => {
    if (confirm('Delete this donation?')) {
        donations = donations.filter(d => d.id !== id);
        saveAndRender();
    }
};

// Initialize
document.querySelector('[type="date"]').value = new Date().toISOString().split('T')[0];
saveAndRender();