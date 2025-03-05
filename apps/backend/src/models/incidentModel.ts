import mongoose from 'mongoose';

interface IIncident {
  id: string;
  title: string;
  description?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Investigating' | 'Mitigated' | 'Resolved' | 'Closed';
  category: string;
  createdAt: Date;
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  owner?: mongoose.Schema.Types.ObjectId;
  assignedTeam?: string;
  affectedSystems?: string[];
  impact?: string;
  rootCause?: string;
  mitigation?: string;
  lessons?: string;
  sla?: Date;
  progress?: number;
  related?: {
    id: string;
    type: string;
    name: string;
  }[];
  notificationsSent?: boolean;
  reportUrl?: string;
}

const incidentSchema = new mongoose.Schema<IIncident>(
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
      enum: ['Open', 'Investigating', 'Mitigated', 'Resolved', 'Closed'],
      default: 'Open'
    },
    category: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: {
      type: Date
    },
    closedAt: {
      type: Date
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignedTeam: {
      type: String
    },
    affectedSystems: [String],
    impact: {
      type: String
    },
    rootCause: {
      type: String
    },
    mitigation: {
      type: String
    },
    lessons: {
      type: String
    },
    sla: {
      type: Date
    },
    progress: {
      type: Number,
      min: 0,
      max: 100
    },
    related: [
      {
        id: String,
        type: String,
        name: String
      }
    ],
    notificationsSent: {
      type: Boolean,
      default: false
    },
    reportUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate ID for incidents
incidentSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const date = new Date();
    const year = date.getFullYear();
    
    // Find the latest incident
    const lastIncident = await mongoose.model('Incident').findOne(
      { id: new RegExp(`^INC-${year}-\\d+$`) },
      { id: 1 },
      { sort: { id: -1 } }
    );
    
    let number = 1;
    if (lastIncident && lastIncident.id) {
      const parts = lastIncident.id.split('-');
      if (parts.length === 3) {
        number = parseInt(parts[2], 10) + 1;
      }
    }
    
    this.id = `INC-${year}-${number.toString().padStart(3, '0')}`;
  }
  next();
});

// Set SLA based on severity if not manually specified
incidentSchema.pre('save', function(next) {
  if (this.isNew && !this.sla) {
    const now = new Date();
    
    // SLA timeframes based on severity
    switch(this.severity) {
      case 'Critical':
        // 4 hours for critical
        this.sla = new Date(now.getTime() + (4 * 60 * 60 * 1000));
        break;
      case 'High':
        // 24 hours for high
        this.sla = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        break;
      case 'Medium':
        // 72 hours for medium
        this.sla = new Date(now.getTime() + (72 * 60 * 60 * 1000));
        break;
      case 'Low':
        // 7 days for low
        this.sla = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        break;
    }
  }
  next();
});

interface IIncidentUpdate {
  incident: mongoose.Schema.Types.ObjectId;
  updateText: string;
  updatedBy: mongoose.Schema.Types.ObjectId;
  updateType: 'Status Change' | 'Investigation' | 'Mitigation' | 'Resolution' | 'General' | 'Assignment';
  previousStatus?: string;
  newStatus?: string;
  attachments?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  createdAt: Date;
}

const incidentUpdateSchema = new mongoose.Schema<IIncidentUpdate>(
  {
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true
    },
    updateText: {
      type: String,
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updateType: {
      type: String,
      enum: ['Status Change', 'Investigation', 'Mitigation', 'Resolution', 'General', 'Assignment'],
      required: true
    },
    previousStatus: {
      type: String
    },
    newStatus: {
      type: String
    },
    attachments: [
      {
        url: String,
        name: String,
        type: String,
        size: Number
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      required: true
    }
  }
);

const Incident = mongoose.model<IIncident>('Incident', incidentSchema);
const IncidentUpdate = mongoose.model<IIncidentUpdate>('IncidentUpdate', incidentUpdateSchema);

export {
  Incident,
  IncidentUpdate
};
