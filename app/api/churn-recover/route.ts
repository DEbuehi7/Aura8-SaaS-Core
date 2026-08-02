import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { customerName, customerEmail, failedAmount, daysPastDue = 3 } = await req.json();

    let dunningStage = 'Stage 1: Friendly Reminder';
    if (daysPastDue >= 7 && daysPastDue < 14) {
      dunningStage = 'Stage 2: Urgent Payment Action Required';
    } else if (daysPastDue >= 14) {
      dunningStage = 'Stage 3: Pre-Suspension Final Notice';
    }

    const recoveryMessage = `Hi ${customerName || 'Customer'}, your payment of $${failedAmount || 99} for Aura8 SaaS failed. Please update your payment method here: https://billing.aura8.io/update?retry=true`;

    return NextResponse.json({
      success: true,
      dunningEngine: {
        customerName: customerName || 'Valued Customer',
        customerEmail: customerEmail || 'customer@example.com',
        failedAmount: failedAmount || 99,
        daysPastDue,
        dunningStage,
        generatedRecoveryMessage: recoveryMessage,
        channelsTargeted: ['Email', 'SMS Webhook'],
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Churn recovery trigger failed' }, { status: 500 });
  }
}
