import mongoose from 'mongoose';

// Vendor model
interface IVendor {
  id: string;
  name: string;
  description?: string;
  category: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  riskScores?: {
    security: number;
    privacy: number;
    compliance: number;
    overall?: number;
  };
  dataAccessed?: string[];
  lastAssessmentDate?: Date;
  nextAssessment?: Date;
  contract?: {
    startDate: Date;
    endDate: Date;
    value?: number;
    auto_renewal: boolean;
    documentUrl?: string;
  };
  contactInfo?: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  status: 'Active' | 'Pending' | 'Terminated' | 'Under Review';
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new mongoose.Schema<IVendor>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    riskLevel: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      required: true
    },
    riskScores: {
      security: {
        type: Number,
        min: 0,
        max: 100
      },
      privacy: {
        type: Number,
        min: 0,
        max: 100
      },
      compliance: {
        type: Number,
        min: 0,
        max: 100
      },
      overall: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    dataAccessed: [String],
    lastAssessmentDate: {
      type: Date
    },
    nextAssessment: {
      type: Date
    },
    contract: {
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      value: {
        type: Number
      },
      auto_renewal: {
        type: Boolean,
        default: false
      },
      documentUrl: {
        type: String
      }
    },
    contactInfo: {
      name: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      },
      role: {
        type: String
      }
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Terminated', 'Under Review'],
      default: 'Pending'
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
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate ID if not provided
vendorSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const date = new Date();
    const year = date.getFullYear();
    
    // Find the latest vendor
    const lastVendor = await mongoose.model('Vendor').findOne(
      { id: new RegExp(`^VEN-${year}-\\d+$`) },
      { id: 1 },
      { sort: { id: -1 } }
    );
    
    let number = 1;
    if (lastVendor && lastVendor.id) {
      const parts = lastVendor.id.split('-');
      if (parts.length === 3) {
        number = parseInt(parts[2], 10) + 1;
      }
    }
    
    this.id = `VEN-${year}-${number.toString().padStart(3, '0')}`;
  }
  next();
});

// Vendor Assessment model
interface IVendorAssessment {
  id: string;
  type: string;
  vendor: mongoose.Schema.Types.ObjectId;
  status: 'Approved' | 'Pending' | 'Rejected' | 'In Progress' | 'Expired';
  dueDate: Date;
  completionDate?: Date;
  nextDueDate?: Date;
  assessor: mongoose.Schema.Types.ObjectId;
  scope?: string;
  issues?: number;
  highRiskIssues?: number;
  remediatedIssues?: number;
  controlsAssessed?: number;
  method?: string;
  riskLevel?: 'Critical' | 'High' | 'Medium' | 'Low';
  progress?: number;
  reportUrl?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vendorAssessmentSchema = new mongoose.Schema<IVendorAssessment>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    type: {
      type: String,
      required: true
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Rejected', 'In Progress', 'Expired'],
      default: 'Pending'
    },
    dueDate: {
      type: Date,
      required: true
    },
    completionDate: {
      type: Date
    },
    nextDueDate: {
      type: Date
    },
    assessor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    scope: {
      type: String
    },
    issues: {
      type: Number,
      default: 0
    },
    highRiskIssues: {
      type: Number,
      default: 0
    },
    remediatedIssues: {
      type: Number,
      default: 0
    },
    controlsAssessed: {
      type: Number
    },
    method: {
      type: String
    },
    riskLevel: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low']
    },
    progress: {
      type: Number,
      min: 0,
      max: 100
    },
    reportUrl: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate ID for vendor assessment
vendorAssessmentSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const date = new Date();
    const year = date.getFullYear();
    
    // Find the latest assessment
    const lastAssessment = await mongoose.model('VendorAssessment').findOne(
      { id: new RegExp(`^ASM-${year}-\\d+$`) },
      { id: 1 },
      { sort: { id: -1 } }
    );
    
    let number = 1;
    if (lastAssessment && lastAssessment.id) {
      const parts = lastAssessment.id.split('-');
      if (parts.length === 3) {
        number = parseInt(parts[2], 10) + 1;
      }
    }
    
    this.id = `ASM-${year}-${number.toString().padStart(3, '0')}`;
  }
  next();
});

// Vendor Issue model
interface IVendorIssue {
  id: string;
  title: string;
  description?: string;
  vendor: mongoose.Schema.Types.ObjectId;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'In Progress' | 'Remediated' | 'Accepted';
  identifiedDate: Date;
  dueDate?: Date;
  closedDate?: Date;
  owner: mongoose.Schema.Types.ObjectId;
  category?: string;
  remediationPlan?: string;
  remediationProgress?: number;
  assessment: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const vendorIssueSchema = new mongoose.Schema<IVendorIssue>(
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
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true
    },
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'In Progress', 'Remediated', 'Accepted'],
      default: 'Open'
    },
    identifiedDate: {
      type: Date,
      required: true
    },
    dueDate: {
      type: Date
    },
    closedDate: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String
    },
    remediationPlan: {
      type: String
    },
    remediationProgress: {
      type: Number,
      min: 0,
      max: 100
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VendorAssessment',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate ID for vendor issue
vendorIssueSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const date = new Date();
    const year = date.getFullYear();
    
    // Find the latest issue
    const lastIssue = await mongoose.model('VendorIssue').findOne(
      { id: new RegExp(`^ISS-${year}-\\d+$`) },
      { id: 1 },
      { sort: { id: -1 } }
    );
    
    let number = 1;
    if (lastIssue && lastIssue.id) {
      const parts = lastIssue.id.split('-');
      if (parts.length === 3) {
        number = parseInt(parts[2], 10) + 1;
      }
    }
    
    this.id = `ISS-${year}-${number.toString().padStart(3, '0')}`;
  }
  next();
});

const Vendor = mongoose.model<IVendor>('Vendor', vendorSchema);
const VendorAssessment = mongoose.model<IVendorAssessment>('VendorAssessment', vendorAssessmentSchema);
const VendorIssue = mongoose.model<IVendorIssue>('VendorIssue', vendorIssueSchema);

export {
  Vendor,
  VendorAssessment,
  VendorIssue
};
