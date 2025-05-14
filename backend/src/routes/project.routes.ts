import express, { Request, Response, RequestHandler } from 'express';
import { Project } from '../models/project.model';
import { body, param, validationResult } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';

const router = express.Router();

// Validation middleware
const validateProject = [
  body('name').notEmpty().withMessage('Name is required'),
  body('status').isIn(['Planning', 'In Progress', 'Completed', 'On Hold']).withMessage('Invalid status'),
  body('materials').optional().isArray().withMessage('Materials must be an array'),
  body('materials.*.materialId').optional().isMongoId().withMessage('Invalid material ID'),
  body('materials.*.quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('estimatedCompletionDate').optional().isISO8601().withMessage('Invalid date format'),
  body('notes').optional().isString().withMessage('Notes must be a string')
];

// Get all projects
const getAllProjects: RequestHandler = async (req, res) => {
  try {
    const projects = await Project.find().populate('materials.materialId');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get a single project
const getProject: RequestHandler = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('materials.materialId');
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create a new project
const createProject: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update a project
const updateProject: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Update project status
const updateProjectStatus: RequestHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project status' });
  }
};

// Delete a project
const deleteProject: RequestHandler = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Route definitions
router.get('/', getAllProjects);
router.get('/:id', getProject);
router.post('/', validateProject, createProject);
router.put('/:id', validateProject, updateProject);
router.patch('/:id/status', [
  param('id').isMongoId().withMessage('Invalid project ID'),
  body('status').isIn(['Planning', 'In Progress', 'Completed', 'On Hold']).withMessage('Invalid status')
], updateProjectStatus);
router.delete('/:id', deleteProject);

export const projectRoutes = router; 