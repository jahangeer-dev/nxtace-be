import mongoose, { Schema, Document, type ObjectId } from 'mongoose';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password?: string; // Optional for OAuth users
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Not required for OAuth users
    minlength: 6,
  },
  name: {
    type: String,
    trim: true,
  },
 
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);
