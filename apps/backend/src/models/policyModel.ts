import mongoose from 'mongoose';

interface IPolicy {
  id: string;
  title: string;
  description?: string;
  type: 'Policy' | 'Procedure' | 'Standard' | 'Guideline' | 'Evidence';
  category: string;
  version: string;
  content: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Archived';
  approvalDate?: Date;
  approvedBy?: mongoose.Schema.Types.ObjectId;
  effectiveDate?: Date;
  reviewDate?: Date;
  owner: mongoose.Schema.Types.ObjectId;
  tags?: string[];
  frameworks?: string[];
  relatedControls?: {
    id: string;
    name: string;
    framework: string;
  }[];
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  revisions?: {
    version: string;
    date: Date;
    changedBy: mongoose.Schema.Types.ObjectId;
    changes: string;
  }[];
}

const policySchema = new mongoose.Schema<IPolicy>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    type: {
      type: String,
      enum: ['Policy', 'Procedure', 'Standard', 'Guideline', 'Evidence'],
      required: true
    },
    category: {
      type: String,
      required: true
    },
    version: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Draft', 'Review', 'Approved', 'Published', 'Archived'],
      default: 'Draft'
    },
    approvalDate: {
      type: Date
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    effectiveDate: {
      type: Date
    },
    reviewDate: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tags: [String],
    frameworks: [String],
    relatedControls: [
      {
        id: String,
        name: String,
        framework: String
      }
    ],
    fileUrl: {
      type: String
    },
    fileType: {
      type: String
    },
    fileSize: {
      type: Number
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    revisions: [
      {
        version: String,
        date: Date,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        changes: String
      }
    ]
  },
  {
    timestamps: true
  }
);

// Auto-generate ID if not provided
policySchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const prefix = this.type === 'Policy' ? 'POL' : 
                  this.type === 'Procedure' ? 'PRO' : 
                  this.type === 'Standard' ? 'STD' : 
                  this.type === 'Guideline' ? 'GDL' : 'EVI';
    
    const date = new Date();
    const year = date.getFullYear();
    
    // Find the latest document with this prefix and year
    const lastDoc = await mongoose.model('Policy').findOne(
      { id: new RegExp(`^${prefix}-${year}-\\d+$`) },
      { id: 1 },
      { sort: { id: -1 } }
    );
    
    let number = 1;
    if (lastDoc && lastDoc.id) {
      const parts = lastDoc.id.split('-');
      if (parts.length === 3) {
        number = parseInt(parts[2], 10) + 1;
      }
    }
    
    this.id = `${prefix}-${year}-${number.toString().padStart(3, '0')}`;
  }
  next();
});

const Policy = mongoose.model<IPolicy>('Policy', policySchema);

export default Policy;
