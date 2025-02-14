document.addEventListener('DOMContentLoaded', async function () {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF is not loaded correctly!");
        return;
    }

    const companySelect = document.getElementById('companySelect');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const cartContainer = document.getElementById('cartContainer');
    const showCartButton = document.getElementById('showCartButton');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    const genericImageUrl = '../images/generic.jpg'; // Path to the generic image
    
    let stockData = [];
    let cart = [];

    async function loadStockData() {
        try {
            // Replace this with your actual data fetching logic
            stockData = await window.getStocksData(); // Load stock data from an external source
            if (!stockData || stockData.length === 0) {
                console.error('No stock data available');
                return;
            }
            const companyNames = [...new Set(stockData.map(row => row[0]))];
            companyNames.forEach(company => {
                const option = document.createElement('option');
                option.value = company;
                option.textContent = company;
                companySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching stock data:', error);
        }
    }

    await loadStockData(); // Load stock data on page load

    companySelect.addEventListener('change', () => {
        const selectedCompany = companySelect.value;
        if (selectedCompany) {
            const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[6]) > 0);
            stockTableBody.innerHTML = ''; // Clear existing rows
            companyItems.forEach(item => {
                const imageUrl = `../images/${item[1]}.jpg`; // Assuming image filename matches item name
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${imageUrl}" alt="${item[1]}" style="width: 50px; height: 50px;" onerror="this.onerror=null;this.src='${genericImageUrl}';"></td>
                    <td class="item-name" data-image="${imageUrl}">${item[1]}</td>
                    <td>${item[2]}</td> <!-- MRP -->
                    <td>${item[3]}</td> <!-- Rate -->
                    <td>${item[4]}</td> <!-- Scheme -->
                    <td>${item[5]}</td> <!-- Tax -->
                    <td>${item[6]}</td> <!-- Stock -->
                    <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[3]}" data-mrp="${item[2]}" data-tax="${item[5]}" min="1"></td>
                    <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[3]}" data-mrp="${item[2]}" data-tax="${item[5]}" data-image="${imageUrl}">Add</button></td>
                `;
                stockTableBody.appendChild(tr);
            });
        }
    });

    // Event listener for adding items to cart
    stockTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-button')) {
            const itemName = event.target.getAttribute('data-item');
            const itemRate = parseFloat(event.target.getAttribute('data-rate'));
            const itemMRP = parseFloat(event.target.getAttribute('data-mrp'));
            const itemTax = parseFloat(event.target.getAttribute('data-tax'));
            const itemImage = event.target.getAttribute('data-image');
            const quantityInput = event.target.closest('tr').querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value);

            if (!quantity || quantity <= 0) {
                alert("Please enter a valid quantity.");
                return;
            }

            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ name: itemName, rate: itemRate, mrp: itemMRP, tax: itemTax, quantity: quantity, image: itemImage });
            }

            alert(`${itemName} added to cart.`);
        }
    });

    // Event listener for "Show Cart" button
    showCartButton.addEventListener('click', () => {
        cartContainer.innerHTML = ''; // Clear existing cart
        let totalBeforeTax = 0;
        let totalAfterTax = 0;

        cart.forEach(item => {
            const rate = isNaN(item.rate) ? 0 : item.rate;
            const quantity = isNaN(item.quantity) ? 0 : item.quantity;
            const tax = isNaN(item.tax) ? 0 : item.tax;

            const itemTotalBeforeTax = rate * quantity;
            const itemTotalAfterTax = quantity * (rate + (rate * tax / 100));
            totalBeforeTax += itemTotalBeforeTax;
            totalAfterTax += itemTotalAfterTax;

            const cartItem = document.createElement('div');
            cartItem.innerHTML = `<p>${item.name} - ${item.quantity} x ${item.rate} = ${itemTotalAfterTax.toFixed(2)}</p>`;
            cartContainer.appendChild(cartItem);
        });

        const totalElement = document.createElement('div');
        totalElement.innerHTML = `<h4>Total Before Tax: ${totalBeforeTax.toFixed(2)}</h4><h4>Total After Tax: ${totalAfterTax.toFixed(2)}</h4>`;
        cartContainer.appendChild(totalElement);

        cartContainer.style.display = 'block';
        confirmOrderButton.style.display = 'block';
    });

    // Event listener for confirm order button
    confirmOrderButton.addEventListener('click', async function () {
        const doc = new jsPDF();
        let yPosition = 20;

        const orderDate = new Date().toLocaleDateString();
        const customerName = document.getElementById('customer-nam').textContent;
        const shopName = sessionStorage.getItem('shop-name') || document.getElementById('shop-name').textContent;

        doc.text(`Order Date: ${orderDate}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Customer Name: ${customerName}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Shop Name: ${shopName}`, 10, yPosition);
        yPosition += 10;

        doc.text('Order Summary', 10, yPosition);
        yPosition += 10;

        // Table Headers
        const headers = [["Image", "Name", "MRP", "Rate", "Tax", "Quantity", "Total"]];
        let bodyData = [];

        let totalBeforeTax = 0;
        let totalAfterTax = 0;

        for (const item of cart) {
            // Ensure valid numerical values for calculations
            const rate = isNaN(item.rate) ? 0 : item.rate;
            const mrp = isNaN(item.mrp) ? 0 : item.mrp;
            const quantity = isNaN(item.quantity) ? 0 : item.quantity;
            const tax = isNaN(item.tax) ? 0 : item.tax;

            const itemTotalBeforeTax = rate * quantity;
            const itemTotalAfterTax = quantity * (rate + (rate * tax / 100));
            totalBeforeTax += itemTotalBeforeTax;
            totalAfterTax += itemTotalAfterTax;

            bodyData.push([
                "", // Placeholder for image
                item.name,
                mrp.toFixed(2), // MRP
                rate.toFixed(2), // Rate
                tax.toFixed(2), // Tax
                quantity,
                itemTotalAfterTax.toFixed(2)
            ]);
        }

        doc.autoTable({
            startY: yPosition,
            head: headers,
            body: bodyData,
            didDrawCell: async function (data) {
                if (data.column.index === 0 && cart[data.row.index]) {
                    const imgUrl = cart[data.row.index].image;
                    try {
                        const base64Image = await loadImageAsBase64(imgUrl);
                        doc.addImage(base64Image, 'PNG', data.cell.x + 2, data.cell.y + 2, 10, 10);
                    } catch (err) {
                        console.error("Error loading image:", err);
                        // Use generic image if there's an error loading the specific image
                        const base64GenericImage = await loadImageAsBase64(genericImageUrl);
                        doc.addImage(base64GenericImage, 'PNG', data.cell.x + 2, data.cell.y + 2, 10, 10);
                    }
                }
            }
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const totalBeforeTaxText = `Total Before Tax: ${totalBeforeTax.toFixed(2)}`;
        const totalAfterTaxText = `Total After Tax: ${totalAfterTax.toFixed(2)}`;
        const textWidthBeforeTax = doc.getTextWidth(totalBeforeTaxText);
        const textWidthAfterTax = doc.getTextWidth(totalAfterTaxText);

        doc.text(totalBeforeTaxText, pageWidth - textWidthBeforeTax - 10, doc.autoTable.previous.finalY + 10);
        doc.text(totalAfterTaxText, pageWidth - textWidthAfterTax - 10, doc.autoTable.previous.finalY + 20);

        // Convert PDF to Blob
        const pdfBlob = doc.output('blob');

        // Trigger PDF download
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'order-summary.pdf';
        downloadLink.click();
    });

    // Helper function to load image as base64
    async function loadImageAsBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = function () {
                // Use generic image if there's an error loading the specific image
                const genericImg = new Image();
                genericImg.crossOrigin = "anonymous";
                genericImg.onload = function () {
                    const canvas = document.createElement("canvas");
                    canvas.width = genericImg.width;
                    canvas.height = genericImg.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(genericImg, 0, 0);
                    resolve(canvas.toDataURL("image/png"));
                };
                genericImg.onerror = reject;
                genericImg.src = genericImageUrl;
            };
            img.src = url;
        });
    }
});