import React, { Suspense } from 'react';
import { query } from '@/lib/db';
import { Table } from '@/types';
import { TableSelectionView } from '@/components/customer/table-selection-view';

export const dynamic = 'force-dynamic';

export default async function CustomerLandingPage() {
    // Fetch real-time table status
    // We use the logic from API: check actual orders if needed, but for now trusting table.status
    // Ideally use the API logic but here we query direct for speed in Server Component
    const tables = await query<Table[]>(`
    SELECT id, table_number, capacity, status, created_at 
    FROM tables 
    ORDER BY CAST(REGEXP_REPLACE(table_number, '[^0-9]+', '') AS UNSIGNED), table_number
  `);

    // Custom sorting to handle T1, T2, T10 correctly

    return (
        <Suspense fallback={<div className="min-h-screen text-center pt-20">Loading tables...</div>}>
            <TableSelectionView tables={tables} />
        </Suspense>
    );
}
