import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  supplier?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  supplier: { type: String, trim: true },
  notes: { type: String, trim: true },
}, {
  timestamps: true
});

export const Material = mongoose.model<IMaterial>('Material', MaterialSchema); 