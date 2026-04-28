// Initial demo data
let volunteers = [
  { id: '1', name: 'Priya Sharma', phone: '9876543210', email: 'priya@example.com', city: 'Chennai', skills: ['Medical', 'Nurse'], availability: 'Weekend', vehicle: 'Yes', experience: '3 years', createdAt: new Date().toISOString() },
  { id: '2', name: 'Arun Kumar', phone: '9876543211', email: 'arun@example.com', city: 'Madurai', skills: ['Driver', 'Logistics'], availability: 'Full Time', vehicle: 'Yes', experience: '5 years', createdAt: new Date().toISOString() },
  { id: '3', name: 'Sanjay Gupta', phone: '9876543212', email: 'sanjay@example.com', city: 'Chennai', skills: ['General', 'Food Delivery'], availability: 'Emergency Only', vehicle: 'No', experience: 'None', createdAt: new Date().toISOString() }
];

let reports = [
  { id: '1', reporterName: 'Kavitha', contactNumber: '9988776655', location: 'Velachery, Chennai', category: 'Medical', description: 'Need immediate medical assistance for an elderly person.', peopleAffected: '1', urgency: 'High', status: 'Pending', priority: 'High', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', reporterName: 'Rahul', contactNumber: '9988776656', location: 'Anna Nagar, Chennai', category: 'Food', description: 'Food required for 50 people at the community shelter.', peopleAffected: '50', urgency: 'Medium', status: 'In Progress', priority: 'Medium', createdAt: new Date(Date.now() - 7200000).toISOString() }
];

let tasks = [
  { id: '1', reportId: '2', volunteerId: '3', status: 'In Progress' }
];

module.exports = { volunteers, reports, tasks };
