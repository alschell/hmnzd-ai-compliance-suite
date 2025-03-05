/**
 * Database Seeder Script
 * Current date: 2025-03-05 13:47:09
 * Current user: alschell
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/userModel';
import { Framework, Control } from '../models/complianceModel';
import { Incident, IncidentUpdate } from '../models/incidentModel';
import { Vendor } from '../models/vendorModel';
import Policy from '../models/policyModel';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    department: 'IT Security',
    isActive: true
  },
  {
    username: 'compliance',
    email: 'compliance@example.com',
    password: 'password123',
    role: 'compliance_manager',
    firstName: 'Compliance',
    lastName: 'Manager',
    department: 'Compliance',
    isActive: true
  },
  {
    username: 'analyst',
    email: 'analyst@example.com',
    password: 'password123',
    role: 'security_analyst',
    firstName: 'Security',
    lastName: 'Analyst',
    department: 'Security',
    isActive: true
  },
  {
    username: 'auditor',
    email: 'auditor@example.com',
    password: 'password123',
    role: 'auditor',
    firstName: 'Internal',
    lastName: 'Auditor',
    department: 'Audit',
    isActive: true
  }
];

const frameworks = [
  {
    id: 'ISO27001',
    name: 'ISO/IEC 27001',
    description: 'ISO/IEC 27001 is an international standard on how to manage information security.',
    category: 'Information Security',
    version: '2022'
  },
  {
    id: 'SOC2',
    name: 'SOC 2',
    description: 'Service Organization Control 2 (SOC 2) is a framework for managing data security risks.',
    category: 'Data Security',
    version: 'Type II'
  },
  {
    id: 'GDPR',
    name: 'GDPR',
    description: 'The General Data Protection Regulation is a regulation on data protection and privacy in the EU.',
    category: 'Privacy',
    version: '2018'
  }
];

const vendors = [
  {
    id: 'VEN-2025-001',
    name: 'Cloud Provider Inc.',
    description: 'Major cloud infrastructure provider',
    category: 'Cloud Services',
    riskLevel: 'Critical',
    riskScores: {
      security: 85,
      privacy: 78,
      compliance: 90,
      overall: 84
    },
    dataAccessed: ['Customer Data', 'Financial Information'],
    status: 'Active'
  },
  {
    id: 'VEN-2025-002',
    name: 'Security Solutions Ltd.',
    description: 'Security software and services provider',
    category: 'Security',
    riskLevel: 'Medium',
    riskScores: {
      security: 92,
      privacy: 88,
      compliance: 95,
      overall: 92
    },
    dataAccessed: ['System Logs'],
    status: 'Active'
  }
];

const incidents = [
  {
    id: 'INC-2025-001',
    title: 'Website Outage',
    description: 'Main website down due to database connectivity issues',
    severity: 'High',
    status: 'Resolved',
    category: 'Availability',
    affectedSystems: ['Web Server', 'Database'],
    impact: 'Customers unable to access services for 2 hours'
  },
  {
    id: 'INC-2025-002',
    title: 'Phishing Attempt',
    description: 'Several employees received sophisticated phishing emails',
    severity: 'Medium',
    status: 'Closed',
    category: 'Security',
    affectedSystems: ['Email'],
    impact: 'No successful compromise, but increased security awareness needed'
  },
  {
    id: 'INC-2025-003',
    title: 'Data Center Temperature Alert',
    description: 'Temperature exceeding thresholds in rack C4',
    severity: 'Medium',
    status: 'Investigating',
    category: 'Infrastructure',
    affectedSystems: ['Data Center'],
    impact: 'Potential server overheating if not addressed'
  }
];

const policies = [
  {
    id: 'POL-2025-001',
    title: 'Acceptable Use Policy',
    description: 'Guidelines for appropriate use of company IT resources',
    type: 'Policy',
    category: 'Information Security',
    version: '1.0',
    content: 'All employees must use company resources responsibly...',
    status: 'Published'
  },
  {
    id: 'POL-2025-002',
    title: 'Data Retention Policy',
    description: 'Requirements for retaining and disposing of data',
    type: 'Policy',
    category: 'Data Governance',
    version: '1.0',
    content: 'Company data must be retained according to the following schedule...',
    status: 'Published'
  },
  {
    id: 'PRO-2025-001',
    title: 'Incident Response Procedure',
    description: 'Steps to follow during security incidents',
    type: 'Procedure',
    category: 'Incident Management',
    version: '1.0',
    content: 'When an incident occurs, follow these steps...',
    status: 'Published'
  }
];

// ISO 27001 Controls Sample
const iso27001Controls = [
  {
    id: 'A.5.1',
    name: 'Information Security Policies',
    description: 'Management direction for information security',
    requirement: 'The organization shall define and implement information security policies.',
    category: 'Policies',
    riskLevel: 'High',
    implementationStatus: 'Implemented'
  },
  {
    id: 'A.6.1',
    name: 'Organization of Information Security',
    description: 'Internal organization of information security responsibilities',
    requirement: 'Security roles and responsibilities shall be defined and allocated.',
    category: 'Organization',
    riskLevel: 'Medium',
    implementationStatus: 'Implemented'
  },
  {
    id: 'A.8.1',
    name: 'Asset Management',
    description: 'Responsibility for assets',
    requirement: 'Assets shall be identified and appropriate responsibilities defined.',
    category: 'Assets',
    riskLevel: 'Medium',
    implementationStatus: 'Partial'
  }
];

// SOC2 Controls Sample
const soc2Controls = [
  {
    id: 'CC1.1',
    name: 'COSO Principle 1',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    requirement: 'The organization should establish standards of conduct and ethics policies.',
    category: 'Control Environment',
    riskLevel: 'High',
    implementationStatus: 'Implemented'
  },
  {
    id: 'CC5.1',
    name: 'Security Policies',
    description: 'The entity defines and communicates security policies and procedures.',
    requirement: 'Security policies should be established and communicated to relevant personnel.',
    category: 'Communication and Information',
    riskLevel: 'High',
    implementationStatus: 'Implemented'
  },
  {
    id: 'CC7.1',
    name: 'System Development and Maintenance',
    description: 'The entity develops and maintains systems using secure development practices.',
    requirement: 'Secure development standards should be established and followed.',
    category: 'System Operations',
    riskLevel: 'Medium',
    implementationStatus: 'Partial'
  }
];

// Import data to database
const importData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hmnzd-compliance');
    
    // Clear existing data
    await User.deleteMany({});
    await Framework.deleteMany({});
    await Control.deleteMany({});
    await Incident.deleteMany({});
    await Vendor.deleteMany({});
    await Policy.deleteMany({});
    
    logger.info('Data cleared...');
    
    // Create admin user first
    const adminUser = await User.create(
      {
        ...users[0],
        password: bcrypt.hashSync(users[0].password, 10)
      }
    );
    
    // Create other users
    const createdUsers = await User.insertMany(
      users.slice(1).map(user => {
        return {
          ...user,
          password: bcrypt.hashSync(user.password, 10)
        };
      })
    );
    
    // Add admin to created users array for reference in other entities
    createdUsers.unshift(adminUser);
    
    logger.info(`${createdUsers.length} users created`);
    
    // Create frameworks
    const createdFrameworks = await Framework.create(
      frameworks.map(framework => {
        return {
          ...framework,
          owner: adminUser._id,
          createdBy: adminUser._id
        };
      })
    );
    
    logger.info(`${createdFrameworks.length} frameworks created`);
    
    // Create controls for ISO 27001
    const iso27001Framework = createdFrameworks.find(f => f.id === 'ISO27001');
    if (iso27001Framework) {
      const iso27001CreatedControls = await Control.create(
        iso27001Controls.map(control => {
          return {
            ...control,
            framework: iso27001Framework._id,
            owner: createdUsers[1]._id, // Assign to compliance manager
            createdBy: adminUser._id
          };
        })
      );
      
      // Add controls to framework
      iso27001Framework.controls = iso27001CreatedControls.map(control => control._id);
      await iso27001Framework.save();
      
      logger.info(`${iso27001CreatedControls.length} ISO 27001 controls created`);
    }
    
    // Create controls for SOC 2
    const soc2Framework = createdFrameworks.find(f => f.id === 'SOC2');
    if (soc2Framework) {
      const soc2CreatedControls = await Control.create(
        soc2Controls.map(control => {
          return {
            ...control,
            framework: soc2Framework._id,
            owner: createdUsers[1]._id, // Assign to compliance manager
            createdBy: adminUser._id
          };
        })
      );
      
      // Add controls to framework
      soc2Framework.controls = soc2CreatedControls.map(control => control._id);
      await soc2Framework.save();
      
      logger.info(`${soc2CreatedControls.length} SOC 2 controls created`);
    }
    
    // Create vendors
    const createdVendors = await Vendor.create(
      vendors.map(vendor => {
        return {
          ...vendor,
          createdBy: adminUser._id,
          updatedBy: adminUser._id
        };
      })
    );
    
    logger.info(`${createdVendors.length} vendors created`);
    
    // Create incidents
    const createdIncidents = await Incident.create(
      incidents.map(incident => {
        return {
          ...incident,
          createdBy: adminUser._id,
          owner: createdUsers[2]._id, // Assign to security analyst
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );
    
    // Create incident updates
    const incidentUpdates = [];
    for (const incident of createdIncidents) {
      incidentUpdates.push({
        incident: incident._id,
        updateText: `Incident created: ${incident.description}`,
        updatedBy: adminUser._id,
        updateType: 'General',
        createdAt: new Date()
      });
      
      // Add an update for resolved incidents
      if (incident.status === 'Resolved') {
        incidentUpdates.push({
          incident: incident._id,
          updateText: 'Issue has been resolved. Root cause identified as database configuration error.',
          updatedBy: createdUsers[2]._id, // Security analyst
          updateType: 'Resolution',
          previousStatus: 'Investigating',
          newStatus: 'Resolved',
          createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        });
      }
    }
    
    await IncidentUpdate.insertMany(incidentUpdates);
    logger.info(`${incidentUpdates.length} incident updates created`);
    
    // Create policies
    const createdPolicies = await Policy.create(
      policies.map(policy => {
        return {
          ...policy,
          owner: createdUsers[1]._id, // Assign to compliance manager
          createdBy: adminUser._id,
          updatedBy: adminUser._id,
          effectiveDate: new Date(),
          reviewDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // 1 year from now
        };
      })
    );
    
    logger.info(`${createdPolicies.length} policies created`);
    
    logger.info('Data import completed successfully!');
    process.exit();
  } catch (error: any) {
    logger.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from the database
const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hmnzd-compliance');
    
    await User.deleteMany({});
    await Framework.deleteMany({});
    await Control.deleteMany({});
    await Incident.deleteMany({});
    await IncidentUpdate.deleteMany({});
    await Vendor.deleteMany({});
    await Policy.deleteMany({});
    
    logger.info('All data destroyed!');
    process.exit();
  } catch (error: any) {
    logger.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
