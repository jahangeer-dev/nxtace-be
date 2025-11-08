import mongoose, { Schema, Document, type ObjectId } from 'mongoose';

export interface IFavorite extends Document {
  _id: ObjectId;
  userId: ObjectId;
  templateId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
    required: true,
  },
}, {
  timestamps: true,
});

// Create compound unique index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, templateId: 1 }, { unique: true });

// Populate template data by default
favoriteSchema.pre(['find', 'findOne'], function(this: any) {
  this.populate('templateId');
});

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);
