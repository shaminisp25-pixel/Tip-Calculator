import express, { Request, Response } from 'express';
import { getDatabase } from '../database';

const router = express.Router();

interface CalculationRequest {
  billAmount: number;
  tipPercent: number;
  numberOfPeople: number;
}

interface CalculationResponse {
  tipAmount: number;
  totalWithTip: number;
  amountPerPerson: number;
  calculationId?: number;
}

// Validate calculation input
function validateCalculation(data: any): data is CalculationRequest {
  return (
    typeof data.billAmount === 'number' &&
    data.billAmount > 0 &&
    typeof data.tipPercent === 'number' &&
    data.tipPercent >= 0 &&
    typeof data.numberOfPeople === 'number' &&
    data.numberOfPeople > 0 &&
    Number.isInteger(data.numberOfPeople)
  );
}

// POST /api/calculations - Calculate tip and save to history
router.post('/', (req: Request, res: Response) => {
  try {
    if (!validateCalculation(req.body)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'billAmount, tipPercent, and numberOfPeople are required and must be valid numbers'
      });
    }

    const { billAmount, tipPercent, numberOfPeople } = req.body;

    // Calculate tip and totals
    const tipAmount = Math.round((billAmount * (tipPercent / 100)) * 100) / 100;
    const totalWithTip = Math.round((billAmount + tipAmount) * 100) / 100;
    const amountPerPerson = Math.round((totalWithTip / numberOfPeople) * 100) / 100;

    // Save to database
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO calculations (
        bill_amount, tip_percent, number_of_people,
        tip_amount, total_with_tip, amount_per_person
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      billAmount,
      tipPercent,
      numberOfPeople,
      tipAmount,
      totalWithTip,
      amountPerPerson
    );

    const response: CalculationResponse = {
      tipAmount,
      totalWithTip,
      amountPerPerson,
      calculationId: Number(result.lastInsertRowid)
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error calculating tip:', error);
    res.status(500).json({ error: 'Failed to calculate tip' });
  }
});

// POST /api/calculations/validate - Validate calculation without saving
router.post('/validate', (req: Request, res: Response) => {
  try {
    if (!validateCalculation(req.body)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'billAmount, tipPercent, and numberOfPeople are required and must be valid numbers'
      });
    }

    const { billAmount, tipPercent, numberOfPeople } = req.body;

    // Calculate tip and totals
    const tipAmount = Math.round((billAmount * (tipPercent / 100)) * 100) / 100;
    const totalWithTip = Math.round((billAmount + tipAmount) * 100) / 100;
    const amountPerPerson = Math.round((totalWithTip / numberOfPeople) * 100) / 100;

    const response: CalculationResponse = {
      tipAmount,
      totalWithTip,
      amountPerPerson
    };

    res.json(response);
  } catch (error) {
    console.error('Error validating calculation:', error);
    res.status(500).json({ error: 'Failed to validate calculation' });
  }
});

export default router;

