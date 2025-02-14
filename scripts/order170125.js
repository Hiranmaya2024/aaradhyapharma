document.addEventListener('DOMContentLoaded', async function() {
    const companySelect = document.getElementById('companySelect');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const itemImage = document.getElementById('itemImage');
    const cartContainer = document.getElementById('cartContainer');
    const showCartButton = document.getElementById('showCartButton');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const customerName = document.getElementById('customer-name').textContent;
    const shopName = document.getElementById('shop-name').textContent;
    let stockData = [];
    let cart = [];

    // Function to load stock data
    async function loadStockData() {
        stockData = await window.getStocksData(); // Replace with actual data fetching logic
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

    // Load stock data
    loadStockData();

    companySelect.addEventListener('change', () => {
        const selectedCompany = companySelect.value;
        console.log('Company Selected', selectedCompany);

        if (selectedCompany) {
            const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[6]) > 0);
            stockTableBody.innerHTML = ''; // Clear existing rows
            companyItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="item-name" data-image="${item[7]}">${item[1]}</td>
                    <td>${item[2]}</td> <!-- Assuming MRP is in the second column (index 1) -->
                    <td>${item[3]}</td> <!-- Assuming Rate is in the third column (index 2) -->
                    <td>${item[4]}</td>
                    <td>${item[5]}</td>
                    <td>${item[6]}</td>
                    <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[3]}" min="1"></td>
                    <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[3]}">Add</button></td>
                `;
                stockTableBody.appendChild(tr);
            });
        }
    });

    // Event listener for item name clicks
    stockTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('item-name')) {
            const imageUrl = event.target.getAttribute('data-image');
            console.log('Image URL:', imageUrl); // Debugging statement
            if (imageUrl) {
                itemImage.src = imageUrl;
                itemImage.style.display = 'block';
            } else {
                console.error('Image URL is null or undefined');
            }
        }
    });

    // Event listener for "Add" button clicks
    stockTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-button')) {
            const itemName = event.target.getAttribute('data-item');
            const itemRate = parseFloat(event.target.getAttribute('data-rate'));
            const quantityInput = event.target.closest('tr').querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);

            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name: itemName, rate: itemRate, quantity: quantity });
            }

            console.log('Cart:', cart);
        }
    });

    // Event listener for "Show Cart" button clicks
    showCartButton.addEventListener('click', () => {
        cartContainer.innerHTML = ''; // Clear existing cart
        let totalAmount = 0;

        cart.forEach(item => {
            const itemTotal = item.rate * item.quantity;
            totalAmount += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.innerHTML = `
                <p>${item.name} - ${item.quantity} x ${item.rate} = ${itemTotal}</p>
            `;
            cartContainer.appendChild(cartItem);
        });

        const totalElement = document.createElement('div');
        totalElement.innerHTML = `<h4>Total: ${totalAmount}</h4>`;
        cartContainer.appendChild(totalElement);

        cartContainer.style.display = 'block';
        confirmOrderButton.style.display = 'block';
    });

    // Event listener for "Confirm Order" button clicks
    confirmOrderButton.addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add header
        doc.setFontSize(18);
        doc.text('Order Details', 10, 10);

        // Add customer details
        doc.setFontSize(12);
        doc.text(`Customer Name: ${shopName}`, 10, 20);
        doc.text(`Username: ${customerName}`, 10, 30);
        doc.text(`Order Date: ${new Date().toLocaleString()}`, 10, 40);

        // Add table headers
        doc.text('Item', 10, 50);
        doc.text('Quantity', 60, 50);
        doc.text('Rate', 110, 50);
        doc.text('Total', 160, 50);

        // Add table content
        let yPosition = 60;
        let preGstTotal = 0;
        let netTotal = 0;
        cart.forEach(item => {
            const itemTotal = item.rate * item.quantity;
            const gstRate = 0.18; // Assuming 18% GST
            const itemTotalWithGst = itemTotal + (itemTotal * gstRate);
            preGstTotal += itemTotal;
            netTotal += itemTotalWithGst;

            doc.text(item.name, 10, yPosition);
            doc.text(item.quantity.toString(), 60, yPosition);
            doc.text(item.rate.toString(), 110, yPosition);
            doc.text(itemTotalWithGst.toFixed(2).toString(), 160, yPosition);
            yPosition += 10;
        });

        // Add total amounts
        doc.text('Pre-GST Amount:', 110, yPosition);
        doc.text(preGstTotal.toFixed(2).toString(), 160, yPosition);
        yPosition += 10;
        doc.text('Net Amount:', 110, yPosition);
        doc.text(netTotal.toFixed(2).toString(), 160, yPosition);

        // Save PDF
        doc.save('order.pdf');

        // Send order details to WhatsApp
        let orderDetails = 'Order Details:\n';
        cart.forEach(item => {
            orderDetails += `${item.name} - ${item.quantity} x ${item.rate} = ${item.rate * item.quantity}\n`;
        });
        orderDetails += `Total: ${netTotal.toFixed(2)}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');
    });
});