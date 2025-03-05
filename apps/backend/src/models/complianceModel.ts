import mongoose from 'mongoose';

// Framework model
interface IFramework {
  id: string;
  name: string;
  description?: string;
  category: string;
  version: string;
  controls: mongoose.Schema.Types.ObjectId[];
  complianceScore?: number;
  lastAssessmentDate?: Date;
  nextAssessmentDate?: Date;
  owner?: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const frameworkSchema = new mongoose.Schema<IFramework>(
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
    version: {
      type: String,
      required: true
    },
    controls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Control'
      }
    ],
    complianceScore: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAssessmentDate: {
      type: Date
    },
    nextAssessmentDate: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

// Control model
interface IControl {
  id: string;
  name: string;
  description: string;
  framework: mongoose.Schema.Types.ObjectId;
  category?: string;
  subCategory?: string;
  requirement: string;
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not-Applicable';
  evidence?: mongoose.Schema.Types.ObjectId[];
  policies?: mongoose.Schema.Types.ObjectId[];
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  implementationStatus?: 'Implemented' | 'In Progress' | 'Planned' | 'Not Implemented';
  owner?: mongoose.Schema.Types.ObjectId;
  lastAssessment?: Date;
  nextAssessment?: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const controlSchema = new mongoose.Schema<IControl>(
  {
    id: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    framework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Framework',
      required: true
    },
    category: {
      type: String
    },
    subCategory: {
      type: String
    },
    requirement: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Compliant', 'Partial', 'Non-Compliant', 'Not-Applicable'],
      default: 'Not-Applicable'
    },
    evidence: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence'
      }
    ],
    policies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Policy'
      }
    ],
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    },
    implementationStatus: {
      type: String,
      enum: ['Implemented', 'In Progress', 'Planned', 'Not Implemented'],
      default: 'Not Implemented'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastAssessment: {
      type: Date
    },
    nextAssessment: {
      type: Date
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

// Assessment model
interface IAssessment {
  id: string;
  name: string;
  description?: string;
  framework: mongoose.Schema.Types.ObjectId;
  status: 'Planned' | 'In Progress' | 'Compliant' | 'Non-Compliant' | 'Remediation';
  assessmentDate: Date;
  completionDate?: Date;
  nextAssessmentDate?: Date;
  assessor: mongoose.Schema.Types.ObjectId;
  findings?: mongoose.Schema.Types.ObjectId[];
  completionPercentage?: number;
  reportUrl?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new mongoose.Schema<IAssessment>(
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
    framework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Framework',
      required: true
    },
    status: {
      type: String,
      enum: ['Planned', 'In Progress', 'Compliant', 'Non-Compliant', 'Remediation'],
      default: 'Planned'
    },
    assessmentDate: {
      type: Date,
      required: true
    },
    completionDate: {
      type: Date
    },
    nextAssessmentDate: {
      type: Date
    },
    assessor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    findings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finding'
      }
    ],
    completionPercentage: {
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

// Finding model
interface IFinding {
  id: string;
  title: string;
  description?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed' | 'In Review';
  framework: mongoose.Schema.Types.ObjectId;
  controlId: string;
  assessment: mongoose.Schema.Types.ObjectId;
  identifiedDate: Date;
  dueDate?: Date;
  closedDate?: Date;
  owner: mongoose.Schema.Types.ObjectId;
  remediationProgress?: number;
  remediationPlan?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const findingSchema = new mongoose.Schema<IFinding>(
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
    severity: {
      type: String,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'In Review'],
      default: 'Open'
    },
    framework: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Framework',
      required: true
    },
    controlId: {
      type: String,
      required: true
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true
    },
    identifiedDate: {
      type: Date,
      required: true,
      default: Date.now
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
    remediationProgress: {
      type: Number,
      min: 0,
      max: 100
    },
    remediationPlan: {
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

// Evidence model
interface IEvidence {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: mongoose.Schema.Types.ObjectId;
  uploadDate: Date;
  controls?: mongoose.Schema.Types.ObjectId[];
  assessments?: mongoose.Schema.Types.ObjectId[];
  tags?: string[];
  expiryDate?: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const evidenceSchema = new mongoose.Schema<IEvidence>(
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
    fileUrl: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    controls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Control'
      }
    ],
    assessments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment'
      }
    ],
    tags: [String],
    expiryDate: {
      type: Date
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

// Create and export the models
const Framework = mongoose.model<IFramework>('Framework', frameworkSchema);
const Control = mongoose.model<IControl>('Control', controlSchema);
const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
const Finding = mongoose.model<IFinding>('Finding', findingSchema);
const Evidence = mongoose.model<IEvidence>('Evidence', evidenceSchema);

export {
  Framework,
  Control,
  Assessment,
  Finding,
  Evidence
};
