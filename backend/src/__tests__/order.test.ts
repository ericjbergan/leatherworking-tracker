import request from 'supertest';
import { app } from '../index';
import { Order } from '../models/order.model';
import { Customer } from '../models/customer.model';
import { Types } from 'mongoose';

describe('Order Endpoints', () => {
  let customerId: Types.ObjectId;
  let productId: Types.ObjectId;

  beforeEach(async () => {
    // Create a test customer
    const customer = await Customer.create({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '123-456-7890'
    });
    customerId = customer._id;

    // Create a test product
    productId = new Types.ObjectId();
  });

  const testOrder = {
    customerId: new Types.ObjectId(), // Will be set in tests
    items: [
      {
        productId: new Types.ObjectId(), // Will be set in tests
        quantity: 1
      }
    ],
    status: 'Pending',
    totalAmount: 100,
    notes: 'Test order'
  };

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        ...testOrder,
        customerId: customerId.toString(),
        items: [{
          productId: productId.toString(),
          quantity: 1
        }]
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual({
        _id: expect.any(String),
        __v: expect.any(Number),
        customerId: customerId.toString(),
        items: [{
          _id: expect.any(String),
          productId: productId.toString(),
          quantity: 1
        }],
        status: 'Pending',
        totalAmount: 100,
        notes: 'Test order',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({}) // Invalid data
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders', async () => {
      // Create a test order
      await Order.create({
        customerId: customerId,
        items: [{
          productId: productId,
          quantity: 1
        }],
        status: 'Pending',
        totalAmount: 100,
        notes: 'Test order'
      });

      const response = await request(app)
        .get('/api/orders')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toMatchObject({
        customerId: customerId.toString(),
        items: [{
          productId: productId.toString(),
          quantity: 1
        }],
        status: 'Pending',
        totalAmount: 100
      });
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a specific order', async () => {
      // Create a test order
      const order = await Order.create({
        customerId: customerId,
        items: [{
          productId: productId,
          quantity: 1
        }],
        status: 'Pending',
        totalAmount: 100,
        notes: 'Test order'
      });

      const response = await request(app)
        .get(`/api/orders/${order._id}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        customerId: customerId.toString(),
        items: [{
          productId: productId.toString(),
          quantity: 1
        }],
        status: 'Pending',
        totalAmount: 100
      });
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/507f1f77bcf86cd799439011') // Non-existent ID
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message', 'Order not found');
    });
  });
}); 