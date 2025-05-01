import { Document, Schema, model } from 'mongoose';

interface IOrderItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  items: IOrderItem[];
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [OrderItemSchema],
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  totalAmount: { type: Number, required: true, min: 0 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Order = model<IOrder>('Order', OrderSchema); 