// Test script to verify checkout API
const testCartData = {
  "33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1": {
    id: "33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1",
    name: "Test Course", 
    price: 5000000, // 50,000 NGN in kobo
    currency: "NGN",
    quantity: 1
  }
};

async function testCheckout() {
  try {
    console.log('🧪 Testing checkout API...');
    console.log('📦 Test cart data:', testCartData);
    
    const response = await fetch('https://hexadigitall.com/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCartData)
    });
    
    console.log('📊 Response status:', response.status);
    const data = await response.json();
    console.log('📄 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Checkout API is working correctly!');
      console.log('🔗 Checkout session ID:', data.id);
    } else {
      console.error('❌ Checkout API failed:', data.error);
    }
  } catch (error) {
    console.error('💥 Network error:', error);
  }
}

testCheckout();
