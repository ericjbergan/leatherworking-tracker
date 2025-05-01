import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterialItem {
  materialId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IProject extends Document {
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  materials: IMaterialItem[];
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialItemSchema = new Schema<IMaterialItem>({
  materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  quantity: { type: Number, required: true, min: 0 }
});

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
    default: 'Planning'
  },
  materials: [MaterialItemSchema],
  estimatedCompletionDate: { type: Date },
  actualCompletionDate: { type: Date },
  notes: { type: String, trim: true }
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema); 