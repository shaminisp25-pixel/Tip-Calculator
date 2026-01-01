import express, { Request, Response } from 'express';
import { getDatabase } from '../database';

const router = express.Router();

interface CalculationHistory {
  id: number;
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
  tipAmount: number;
  totalWithTip: number;
  amountPerPerson: number;
  createdAt: string;
}

// GET /api/history - Get calculation history
router.get('/', (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const db = getDatabase();
    const calculations = db.prepare(`
      SELECT 
        id,
        bill_amount as billAmount,
        tip_percent as tipPercent,
        number_of_people as numberOfPeople,
        tip_amount as tipAmount,
        total_with_tip as totalWithTip,
        amount_per_person as amountPerPerson,
        created_at as createdAt
      FROM calculations
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as CalculationHistory[];

    const total = db.prepare('SELECT COUNT(*) as count FROM calculations').get() as { count: number };

    res.json({
      calculations,
      pagination: {
        total: total.count,
        limit,
        offset,
        hasMore: offset + limit < total.count
      }
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch calculation history' });
  }
});

// GET /api/history/:id - Get a specific calculation
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid calculation ID' });
    }

    const db = getDatabase();
    const calculation = db.prepare(`
      SELECT 
        id,
        bill_amount as billAmount,
        tip_percent as tipPercent,
        number_of_people as numberOfPeople,
        tip_amount as tipAmount,
        total_with_tip as totalWithTip,
        amount_per_person as amountPerPerson,
        created_at as createdAt
      FROM calculations
      WHERE id = ?
    `).get(id) as CalculationHistory | undefined;

    if (!calculation) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.json(calculation);
  } catch (error) {
    console.error('Error fetching calculation:', error);
    res.status(500).json({ error: 'Failed to fetch calculation' });
  }
});

// DELETE /api/history/:id - Delete a specific calculation
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid calculation ID' });
    }

    const db = getDatabase();
    const result = db.prepare('DELETE FROM calculations WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Calculation not found' });
    }

    res.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    console.error('Error deleting calculation:', error);
    res.status(500).json({ error: 'Failed to delete calculation' });
  }
});

// DELETE /api/history - Delete all calculations
router.delete('/', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    db.prepare('DELETE FROM calculations').run();

    res.json({ message: 'All calculations deleted successfully' });
  } catch (error) {
    console.error('Error deleting all calculations:', error);
    res.status(500).json({ error: 'Failed to delete calculations' });
  }
});

export default router;

