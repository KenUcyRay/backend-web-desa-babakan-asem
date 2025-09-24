const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected');
    
    // Test CallCenter table structure
    console.log('\nTesting CallCenter table...');
    
    // Try to create a test record with new fields
    const testRecord = await prisma.callCenter.create({
      data: {
        name: "Test Service",
        type: "CALL_CENTER",
        number: "123",
        icon: "test_icon",
        color: "text-blue-500",
        is_active: true
      }
    });
    
    console.log('✅ CallCenter record created with icon and color:', testRecord);
    
    // Clean up test record
    await prisma.callCenter.delete({
      where: { id: testRecord.id }
    });
    
    console.log('✅ Test record cleaned up');
    console.log('✅ Database schema is working correctly!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();