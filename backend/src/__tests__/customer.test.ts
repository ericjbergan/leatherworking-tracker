import request from 'supertest';
import { app } from '../index';
import { Customer } from '../models/customer.model';

describe('Customer Endpoints', () => {
  const testCustomer = {
    name: 'Test Customer',
    email: 'test@example.com',
    phone: '123-456-7890'
  };

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send(testCustomer)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({
        _id: expect.any(String),
        __v: expect.any(Number),
        name: testCustomer.name,
        email: testCustomer.email,
        phone: testCustomer.phone,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({ name: '' }) // Invalid data
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      // Create a test customer
      await Customer.create(testCustomer);

      const response = await request(app)
        .get('/api/customers')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toMatchObject({
        name: testCustomer.name,
        email: testCustomer.email,
        phone: testCustomer.phone
      });
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a specific customer', async () => {
      // Create a test customer
      const customer = await Customer.create(testCustomer);

      const response = await request(app)
        .get(`/api/customers/${customer._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        name: testCustomer.name,
        email: testCustomer.email,
        phone: testCustomer.phone
      });
    });

    it('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/customers/507f1f77bcf86cd799439011') // Non-existent ID
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Customer not found');
    });
  });
}); 