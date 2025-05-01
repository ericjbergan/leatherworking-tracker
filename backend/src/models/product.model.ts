import { Document, Schema, model } from 'mongoose';

interface IMaterialItem {
  materialId: Schema.Types.ObjectId;
  quantity: number;
}

interface IImage {
  key: string;
  url: string;
  uploadedAt: Date;
}

interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
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
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  materials: [MaterialItemSchema],
  images: [ImageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Product = model<IProduct>('Product', ProductSchema); 