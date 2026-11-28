import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true, trim: true, maxlength: 255 },
    fileType: { type: String, enum: ['pdf', 'txt'], required: true },
    fileSize: { type: Number, required: true },

    // Where the file lives. Local storage: the saved file name. Cloud later: a URL (NFR14).
    fileUrl: { type: String, required: true, select: false },

    status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
    extractedText: { type: String, select: false }, // FR6, large, so only loaded on request

    // What the user asked for on the upload page (FR8)
    generate: {
      summary: { type: Boolean, default: true },
      quiz: { type: Boolean, default: true },
      flashcards: { type: Boolean, default: true },
    },

    // Filled in by the generation step; shown in "My documents" (FR7)
      questionCount: { type: Number, default: 0 },
    flashcardCount: { type: Number, default: 0 },
    summaryPreview: { type: String, default: null },
    errorMessage: { type: String, default: null },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: false } }
);

// NFR13: "My documents" always queries by user, newest first
documentSchema.index({ userId: 1, uploadedAt: -1 });

documentSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    delete ret.fileUrl;
    delete ret.extractedText;
    return ret;
  },
});

export const Document = mongoose.model('Document', documentSchema);