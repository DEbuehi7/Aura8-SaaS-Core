import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vendorName, policyType, expirationDate, coverageAmount } = body;
    
    if (!expirationDate) {
      return NextResponse.json({ success: false, error: 'expirationDate is required (YYYY-MM-DD).' }, { status: 400 });
    }

    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = 'COMPLIANT';
    if (daysRemaining < 0) {
      status = 'EXPIRED - ACTION REQUIRED';
    } else if (daysRemaining <= 30) {
      status = 'EXPIRING SOON - RENEWAL NOTICE SENT';
    }

    const responseData = {
      success: true,
      complianceAudit: {
        vendorName: vendorName || 'Unknown Vendor',
        policyType: policyType || 'General Liability',
        coverageAmount: coverageAmount || '$1,000,000',
        expirationDate,
        daysRemaining,
        status,
        generatedNotice: daysRemaining <= 30 
          ? `URGENT: Your ${policyType || 'COI'} insurance policy for ${vendorName || 'Vendor'} expires in ${daysRemaining} days. Please upload updated certificate.`
          : 'Policy is active and compliant.'
      },
      timestamp: new Date().toISOString()
    };

    // Persist log to Supabase PostgreSQL if configured
    if (supabase) {
      await supabase.from('api_logs').insert([
        {
          endpoint: '/api/compliance-vault',
          payload: body,
          response: responseData
        }
      ]);
    }

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Compliance check failed' }, { status: 500 });
  }
}
