import express, { Request, Response } from 'express';
import { Project } from '../models/project.model';
import { body, validationResult } from 'express-validator';
import { TypedRequestBody, TypedRequestParams } from '../types/express';

const router = express.Router();

// Validation middleware
const validateProject = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('description').optional().isString().trim(),
  body('status').isIn(['Planning', 'In Progress', 'Completed', 'On Hold']).withMessage('Invalid status'),
  body('materials').optional().isArray(),
  body('materials.*.materialId').isMongoId().withMessage('Valid material ID is required'),
  body('materials.*.quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('estimatedCompletionDate').optional().isISO8601().toDate(),
  body('notes').optional().isString().trim(),
];

// Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate('materials.materialId')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('materials.materialId');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Create project
router.post('/', validateProject, async (req: TypedRequestBody<{
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  materials?: Array<{
    materialId: string;
    quantity: number;
  }>;
  estimatedCompletionDate?: Date;
  notes?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = new Project({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Update project
router.put('/:id', validateProject, async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  name: string;
  description?: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  materials?: Array<{
    materialId: string;
    quantity: number;
  }>;
  estimatedCompletionDate?: Date;
  notes?: string;
}>, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('materials.materialId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Update project status
router.patch('/:id/status', async (req: TypedRequestParams<{ id: string }> & TypedRequestBody<{
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
}>, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['Planning', 'In Progress', 'Completed', 'On Hold'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: new Date(),
        ...(status === 'Completed' ? { actualCompletionDate: new Date() } : {})
      },
      { new: true }
    ).populate('materials.materialId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project status' });
  }
});

// Delete project
router.delete('/:id', async (req: TypedRequestParams<{ id: string }>, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

export const projectRoutes = router; 