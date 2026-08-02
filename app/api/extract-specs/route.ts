import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json();
    return NextResponse.json({
      success: true,
      extracted: {
        specCode: "03 30 00",
        material: "Cast-in-Place Concrete",
        rating: "4000 PSI",
        quantity: 120,
        unit: "CY",
        rawInput: rawText
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }
}
