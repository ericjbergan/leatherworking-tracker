import mongoose from 'mongoose';
import { config } from '../config';

async function listCustomers() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const Customer = mongoose.model('Customer');
    const customers = await Customer.find({});
    
    console.log('\nCustomers in database:');
    console.log(JSON.stringify(customers, null, 2));
    console.log(`\nTotal customers: ${customers.length}`);

  } catch (error) {
    console.error('Error listing customers:', error);
  } finally {
    await mongoose.connection.close();
  }
}

listCustomers(); 