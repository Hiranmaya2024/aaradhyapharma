// Function to fetch and populate company names
export async function populateCompanySelect(companySelect) {
    const stockData = await window.getStocksData();
    const companyNames = [...new Set(stockData.map(row => row[0]))];
    console.log('Stock data', stockData);
    console.log('Company Names', companyNames);
    companyNames.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
    });
}

// Function to handle company selection and populate stock table
export async function populateStockTable(selectedCompany, stockTableBody, stockTableContainer, confirmOrderButton, paginationContainer) {
    const stockData = await window.getStocksData();
    const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[4]) > 0);
    stockTableBody.innerHTML = ''; // Clear existing rows
    companyItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item[1]}</td>
            <td>${item[2]}</td>
            <td>${item[3]}</td>
            <td>${item[4]}</td>
            <td>${item[5]}</td>
            <td>${item[6]}</td>
            <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[2]}" min="1"></td>
            <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[2]}">Add</button></td>
        `;
        stockTableBody.appendChild(tr);
    });
    stockTableContainer.style.display = 'block';
    confirmOrderButton.style.display = 'block';
    paginateTable(document.getElementById('stockTable'), paginationContainer, 10); // Apply pagination
}

// Function to paginate table
export function paginateTable(table, paginationContainer, rowsPerPage) {
    const rows = table.querySelectorAll('tbody tr');
    const pageCount = Math.ceil(rows.length / rowsPerPage);
    let currentPage = 1;

    function showPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? '' : 'none';
        });

        paginationContainer.innerHTML = '';
        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => showPage(i));
            paginationContainer.appendChild(button);
        }
    }

    showPage(1);
}