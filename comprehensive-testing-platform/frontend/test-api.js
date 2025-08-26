/**
 * Simple API Test Script for Relationship Module
 * Tests the relationship API endpoints
 */

const API_BASE_URL = 'http://localhost:8787';

// Test function
async function testRelationshipAPI() {
  console.log('🧪 Testing Relationship API...\n');

  try {
    // Test 1: Get all questions
    console.log('1️⃣ Testing GET /api/relationship/questions...');
    const allQuestionsResponse = await fetch(`${API_BASE_URL}/api/relationship/questions`);
    const allQuestionsData = await allQuestionsResponse.json();
    
    if (allQuestionsData.success) {
      console.log('✅ Success! Found questions for:');
      Object.keys(allQuestionsData.data).forEach(type => {
        const count = allQuestionsData.data[type]?.length || 0;
        console.log(`   - ${type}: ${count} questions`);
      });
    } else {
      console.log('❌ Failed:', allQuestionsData.error);
    }

    console.log('');

    // Test 2: Get love style questions
    console.log('2️⃣ Testing GET /api/relationship/questions/love_style...');
    const loveStyleResponse = await fetch(`${API_BASE_URL}/api/relationship/questions/love_style`);
    const loveStyleData = await loveStyleResponse.json();
    
    if (loveStyleData.success) {
      console.log(`✅ Success! Found ${loveStyleData.data?.length || 0} love style questions`);
    } else {
      console.log('❌ Failed:', loveStyleData.error);
    }

    console.log('');

    // Test 3: Get love language questions
    console.log('3️⃣ Testing GET /api/relationship/questions/love_language...');
    const loveLanguageResponse = await fetch(`${API_BASE_URL}/api/relationship/questions/love_language`);
    const loveLanguageData = await loveLanguageResponse.json();
    
    if (loveLanguageData.success) {
      console.log(`✅ Success! Found ${loveLanguageData.data?.length || 0} love language questions`);
    } else {
      console.log('❌ Failed:', loveLanguageData.error);
    }

    console.log('');

    // Test 4: Get interpersonal questions
    console.log('4️⃣ Testing GET /api/relationship/questions/interpersonal...');
    const interpersonalResponse = await fetch(`${API_BASE_URL}/api/relationship/questions/interpersonal`);
    const interpersonalData = await interpersonalResponse.json();
    
    if (interpersonalData.success) {
      console.log(`✅ Success! Found ${interpersonalData.data?.length || 0} interpersonal questions`);
    } else {
      console.log('❌ Failed:', interpersonalData.error);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testRelationshipAPI();
