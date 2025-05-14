import mongoose, { Document, Schema } from 'mongoose';

interface IMaterialItem {
  materialId: Schema.Types.ObjectId;
  quantity: number;
}

interface IImage {
  key: string;
  url: string;
  uploadedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock: number;
  imageUrl?: string;
  materials?: IMaterialItem[];
  images: IImage[];
  createdAt: Date;
  updatedAt: Date;
}

const MaterialItemSchema = new Schema({
  materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const ImageSchema = new Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String
  },
  materials: [MaterialItemSchema],
  images: [ImageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema); 