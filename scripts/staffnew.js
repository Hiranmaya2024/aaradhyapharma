document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
   
    // Fetch the username from session storage
        const username = sessionStorage.getItem('username');
        console.log('Fetched username from sessionStorage:', username);
        const customerData = await window.getCustomerLedger();
        console.log(sessionStorage.getItem('username'));
        console.log('Customer Data:', customerData);    
     //  const filtrdcustomerData = customerData.filter(row => row[5] === todayDay);
      //  console.log('Filtered Customer Data:', filtrdcustomerData);
    
        const customerNameElement = document.getElementById('customer-name');
        if (customerNameElement) {
            customerNameElement.textContent = username || 'Guest'; // Fallback to 'Guest' if username is null
        }
    // Assuming `data` is now available globally after loading data.js
    // Define days of the week
   // const todayDay = document.getElementById('today-day');
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const todayDay = daysOfWeek[today.getDay()];
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    console.log('Today:', todayDay);
    document.getElementById('today-day').textContent = `${todayDay} (${formattedDate})`;
    // Filter customer data based on Tourday = Today
  const filtrdcustomerData = customerData.filter(row => row[5] === todayDay);
  console.log('Filtered Customer Data:', filtrdcustomerData);
    
    // Calculate the sum of the balance from the filtered data set
    const totalBalance = filtrdcustomerData.reduce((sum, row) => sum + parseFloat(row[1]), 0); // Assuming balance is in row[1]
    console.log('Total Balance:', totalBalance);
    
    // Update the DOM element for total balance
    const totalBalanceElement = document.getElementById('total-balance');
    if (totalBalanceElement) {
        totalBalanceElement.textContent = totalBalance.toFixed(2); // Format to 2 decimal places
    }

    // Find total number of unique areas to visit
    const uniqueAreas = new Set(filtrdcustomerData.map(row => row[7]));
    console.log('Unique Areas:', uniqueAreas);
    
    // Update the DOM element for area count
    const areaCountElement = document.getElementById('area-count');
    if (areaCountElement) {
        areaCountElement.textContent = uniqueAreas.size;
    }

    // Find area names to visit
    const areaNames = Array.from(uniqueAreas).join(', ');
    console.log('Area Names:', areaNames);
    
    // Update the DOM element for area names
    const areaNamesElement = document.getElementById('area-name');
    if (areaNamesElement) {
        areaNamesElement.textContent = areaNames;
    }

    // Find total number of shops to visit
    const totalShops = filtrdcustomerData.length;
    console.log('Total Shops:', totalShops);
    
    // Update the DOM element for total shops
    const totalShopsElement = document.getElementById('total-clients');
    if (totalShopsElement) {
        totalShopsElement.textContent = totalShops;
    }

    // Find shop names to visit
    const shopNames = filtrdcustomerData.map(row => row[6]).join(', ');
    console.log('Shop Names:', shopNames);
    
    // Update the DOM element for shop names
    const shopNamesElement = document.getElementById('clients-id');
    if (shopNamesElement) {
        shopNamesElement.textContent = shopNames;
    }
});