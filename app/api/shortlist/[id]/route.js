import { NextResponse } from 'next/server';
import { connect, serializeFirestoreData } from '@/lib/db';
import { requireAdmin } from '@/lib/require-admin';

export async function PATCH(req, { params }) {
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const db = await connect();
        const { id } = params;
        const body = await req.json();

        if (typeof body.shortlisted !== 'boolean') {
            return NextResponse.json(
                { success: false, message: 'shortlisted must be a boolean' },
                { status: 400 }
            );
        }
        const { shortlisted } = body;

        const docRef = db.collection('formData').doc(id);
        const snapshot = await docRef.get();

        if (!snapshot.exists) {
            return NextResponse.json({ success: false, message: 'Applicant not found' }, { status: 404 });
        }

        await docRef.update({ shortlisted });
        const updatedSnapshot = await docRef.get();

        const applicant = {
            id: updatedSnapshot.id,
            _id: updatedSnapshot.id,
            ...serializeFirestoreData(updatedSnapshot.data()),
        };

        return NextResponse.json({ success: true, data: applicant });
    } catch (error) {
        console.error('Error updating applicant:', error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}