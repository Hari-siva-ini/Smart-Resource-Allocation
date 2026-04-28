const express = require('express');
const cors = require('cors');
const axios = require('axios');
let { volunteers, reports, tasks } = require('./data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/volunteers', (req, res) => res.json(volunteers));

app.post('/api/volunteers', (req, res) => {
  const volunteer = { id: String(Date.now()), ...req.body, createdAt: new Date().toISOString() };
  volunteers.push(volunteer);
  res.status(201).json(volunteer);
});

app.get('/api/reports', (req, res) => res.json(reports));

app.post('/api/reports', (req, res) => {
  const report = { 
    id: String(Date.now()), 
    ...req.body, 
    status: 'Pending',
    priority: 'Unassigned',
    createdAt: new Date().toISOString() 
  };
  reports.push(report);
  res.status(201).json(report);
});

// AI Endpoints — proxied to Python/Gemini service
app.post('/api/analyze-report', async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/api/analyze-report`, req.body);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'AI service unavailable', detail: err.message });
  }
});

app.post('/api/match-volunteers', async (req, res) => {
  try {
    const { data } = await axios.post(`${AI_SERVICE_URL}/api/match-volunteers`, req.body);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'AI service unavailable', detail: err.message });
  }
});

// Task tracking
app.post('/api/tasks', (req, res) => {
    const { reportId, volunteerId } = req.body;
    const task = { id: String(Date.now()), reportId, volunteerId, status: 'In Progress' };
    tasks.push(task);
    
    const reportIndex = reports.findIndex(r => r.id === reportId);
    if(reportIndex !== -1) {
        reports[reportIndex].status = 'In Progress';
    }
    
    res.status(201).json(task);
});

app.put('/api/task-status/:id', (req, res) => {
  const { status } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = status;
    
    const reportIndex = reports.findIndex(r => r.id === tasks[taskIndex].reportId);
    if(reportIndex !== -1 && status === 'Completed') {
         reports[reportIndex].status = 'Completed';
    }
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
