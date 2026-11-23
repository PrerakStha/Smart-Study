import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true, // creates an index (NFR13)
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false }, // never returned by default (NFR4)
    role: { type: String, enum: ['student', 'teacher'], required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Strip sensitive/internal fields whenever a user is serialised to JSON
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
