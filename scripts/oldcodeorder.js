document.addEventListener('DOMContentLoaded', async function () {
    //const { jsPDF } = window.jspdf; // Ensure jsPDF is properly loaded
    const { jsPDF } = window.jspdf; // Ensure jsPDF is loaded
    if (!jsPDF) {
        console.error("jsPDF is not loaded correctly!");
        return;
    }
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // Avoid CORS issues
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    const companySelect = document.getElementById('companySelect');
    const stockTableBody = document.getElementById('stockTable').querySelector('tbody');
    const itemImage = document.getElementById('itemImage');
    const cartContainer = document.getElementById('cartContainer');
    const showCartButton = document.getElementById('showCartButton');
    const confirmOrderButton = document.getElementById('confirmOrderButton');
    
    let stockData = [];
    let cart = [];

    async function loadStockData() {
        try {
            stockData = await window.getStocksData();
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

    // Load stock data
    await loadStockData();

    companySelect.addEventListener('change', () => {
        const selectedCompany = companySelect.value;
        if (selectedCompany) {
            const companyItems = stockData.filter(row => row[0] === selectedCompany && parseFloat(row[6]) > 0);
            stockTableBody.innerHTML = ''; // Clear existing rows
            companyItems.forEach(item => {
                const tr = document.createElement('tr');
                const imageUrl = `../images/${item[1]}.jpg`; // Assuming image filename matches item name
                tr.innerHTML = `
                    <td><img src="${imageUrl}" alt="${item[1]}" style="width: 50px; height: 50px;"></td>
                    <td class="item-name" data-image="${imageUrl}">${item[1]}</td>
                    <td>${item[2]}</td> <!-- MRP -->
                    <td>${item[3]}</td> <!-- Rate -->
                    <td>${item[4]}</td> <!-- Tax % -->
                    <td>${item[5]}</td> <!-- Stock -->
                    <td><input type="number" class="form-control quantity-input quantity-input-small" data-item="${item[1]}" data-rate="${item[3]}" data-tax="${item[4]}" min="1"></td>
                    <td><button class="btn btn-sm btn-primary add-to-cart-button" data-item="${item[1]}" data-rate="${item[3]}" data-tax="${item[4]}" data-image="${imageUrl}">Add</button></td>
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
                cart.push({ name: itemName, rate: itemRate, tax: itemTax, quantity: quantity, image: itemImage });
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
            const itemTotalBeforeTax = item.rate * item.quantity;
            const itemTotalAfterTax = item.quantity * (item.rate + (item.rate * item.tax / 100));
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

        doc.text('Order Summary', 10, yPosition);
        yPosition += 10;

        // Table Headers
        const headers = [["Image", "Name", "MRP", "Quantity", "Total"]];
        let bodyData = [];

        let totalBeforeTax = 0;
        let totalAfterTax = 0;

        for (const item of cart) {
            const itemTotalBeforeTax = item.rate * item.quantity;
            const itemTotalAfterTax = item.quantity * (item.rate + (item.rate * item.tax / 100));
            totalBeforeTax += itemTotalBeforeTax;
            totalAfterTax += itemTotalAfterTax;

            bodyData.push([
                "", // Placeholder for image
                item.name,
                item.rate.toFixed(2),
                item.quantity,
                itemTotalAfterTax.toFixed(2)
            ]);
        }

        doc.autoTable({
            startY: yPosition,
            head: headers,
            body: bodyData,
            didDrawCell: function (data) {
                if (data.column.index === 0 && cart[data.row.index]) {
                    const imgUrl = `../images/${cart[data.row.index].name}.jpg`;
                    loadImageAsBase64(imgUrl).then(base64 => {
                        doc.addImage(base64, 'PNG', data.cell.x + 2, data.cell.y + 2, 10, 10);
                    });
                }
            }
        });

        doc.text(`Total Before Tax: ${totalBeforeTax.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
        doc.text(`Total After Tax: ${totalAfterTax.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 20);

        // Convert PDF to Blob
        const pdfBlob = doc.output('blob');

        // Upload to a file hosting service (GoFile.io for free hosting)
        const uploadURL = await uploadPDF(pdfBlob);

        if (uploadURL) {
            // Send WhatsApp message with the file link
            sendWhatsAppMessage(uploadURL);
        } else {
            alert("Failed to upload the PDF.");
        }
    });

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
            img.onerror = reject;
            img.src = url;
        });
    }

    async function uploadPDF(pdfBlob) {
        const formData = new FormData();
        formData.append("file", pdfBlob, "order-summary.pdf");

        try {
            const response = await fetch("https://file.io", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                return result.link; // Return the uploaded file URL
            } else {
                console.error("Upload failed:", result);
                return null;
            }
        } catch (error) {
            console.error("Error uploading PDF:", error);
            return null;
        }
    }

    function sendWhatsAppMessage(pdfLink) {
        const whatsappNumber = '9533762508';
        const message = `Your order summary is ready. Download it here: ${pdfLink}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
});