import mongoose from 'mongoose';
import { config } from '../config';

async function clearData() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    // Get all collections
    const collections = await mongoose.connection.db.collections();
    console.log('Found collections:', collections.map(c => c.collectionName));

    // Delete all documents from each collection
    for (const collection of collections) {
      const result = await collection.deleteMany({});
      console.log(`Cleared ${collection.collectionName}:`, result.deletedCount, 'documents deleted');
    }

    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await mongoose.connection.close();
  }
}

clearData(); 