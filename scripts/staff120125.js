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
async function updateDashboardData(selectedDate) {

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
}  
        // Existing code...
    
        
            // Existing code...
        
          //  const todayDayElement = document.getElementById('today-day');
          //  const areaCountElement1 = document.getElementById('area-count');
          //  const areaNameElement = document.getElementById('area-name');
         //   const totalBalanceElement1 = document.getElementById('total-balance');
         //   const totalClientsElement = document.getElementById('total-clients');
        //    const clientsIdElement = document.getElementById('clients-id');
        //    const productIdsElement = document.getElementById('product-ids');
         //   const offerIdElement = document.getElementById('offer-id');
        //    const distantIdElement = document.getElementById('distant-id');
        //    const timeIdElement = document.getElementById('time-id');
            const calendar = document.getElementById('calendar');
        
            // Function to update the dashboard data
          //  async function updateDashboardData(date) {
           //     const todayDay = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
          //      const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
           //     todayDayElement.textContent = `${todayDay} (${formattedDate})`;
        
                // Fetch and update other dashboard data based on the selected date
                // Example: Fetch data from an API or Google Sheets
                //const data = await fetchDataForDate(date);
          //      const data = await window.getCustomerLedger();
            //    const filtrddata = data.filter(row => row[5] === date);
        //        areaCountElement1.textContent = data.uniqueAreas.length;
       //         areaNameElement.textContent = data.uniqueAreas.join(', ');
        //        totalBalanceElement1.textContent = data.totalBalance;
         //       totalClientsElement.textContent = data.totalShopnames;
        //        clientsIdElement.textContent = data.ShopnamesToday.join(', ');
         //       productIdsElement.textContent = data.starproducts.join(', ');
         //       offerIdElement.textContent = data.offerss.join(', ');
         //       distantIdElement.textContent = data.distanceid;
         //       timeIdElement.textContent = data.timeid;
         //   }
        
            // Function to fetch data for a specific date
            async function fetchDataForDate(date) {
                // Implement the logic to fetch data for the selected date

                // This could be an API call or fetching data from Google Sheets
                // For now, returning mock data
                return {
                    uniqueAreas: new Set(filtrdcustomerData.map(row => row[7])),
                    totalBalance: filtrdcustomerData.reduce((sum, row) => sum + parseFloat(row[1]), 0),
                    totalShopnames: filtrdcustomerData.map(row => row[6]).join(', '),
                    ShopnamesToday: filtrdcustomerData.length,
                    starproducts: ['Product 1', 'Product 2'],
                    offerss: ['Offer 1', 'Offer 2'],
                    distanceid: '10 km',
                    timeid: '2 hours'
                };
            }
        
            // Event listener for date selection
            calendar.addEventListener('change', (event) => {
                const selectedDate = new Date(event.target.value);
                if (selectedDate) {
                    updateDashboardData(selectedDate);
                } else {
                    // Reset to the actual date if no date is selected
                    const actualDate = new Date();
                    updateDashboardData(actualDate);
                }
            });
        
            // Initialize the dashboard with the actual date
            const actualDate = new Date();
            updateDashboardData(actualDate);
        
});