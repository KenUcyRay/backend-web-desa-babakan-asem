// Test script untuk CallCenter API dengan field icon dan color
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testData = {
  name: "Customer Service",
  type: "CALL_CENTER",
  number: "08123456789",
  icon: "customer_service",
  color: "text-blue-500",
  is_active: true
};

async function testCallCenterAPI() {
  try {
    console.log('Testing CallCenter API with icon and color fields...\n');
    
    // Test GET public endpoint
    console.log('1. Testing GET /callcenters (public)');
    const publicResponse = await axios.get(`${BASE_URL}/callcenters`);
    console.log('Response:', JSON.stringify(publicResponse.data, null, 2));
    console.log('✅ Public endpoint working\n');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Uncomment to run test
// testCallCenterAPI();

console.log('Test file created. To run test:');
console.log('1. Make sure server is running on port 3000');
console.log('2. Uncomment the testCallCenterAPI() call at the end');
console.log('3. Run: node test-callcenter.js');