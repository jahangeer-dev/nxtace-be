import mongoose, { Schema, Document, type ObjectId } from 'mongoose';

export interface ITemplate extends Document {
    _id: ObjectId;
    name: string;
    description: string;
    thumbnail_url: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail_url: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Create indexes
templateSchema.index({ category: 1 });
templateSchema.index({ name: 'text', description: 'text' });

export const Template = mongoose.model<ITemplate>('Template', templateSchema);
