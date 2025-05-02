import JWST from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const secret = process.env.SECRET as string

if (!secret) {
    throw new Error('JWT Secret is not defined in environment variables');
}

export default function Middleware(req: NextRequest) {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    try {
        const decoded = JWST.verify(token, secret) as { id: string };
        return NextResponse.json({ userId: decoded.id });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}