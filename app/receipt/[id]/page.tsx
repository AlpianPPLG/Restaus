// ============================================
// RESTAUS - Receipt Page
// ============================================

'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/use-orders';
import { ReceiptPreview } from '@/components/organisms/receipt-preview';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: order, isLoading } = useOrder(Number(id));
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Receipt-${id}`,
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading receipt...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 flex flex-col items-center">
      {/* Header Actions */}
      <div className="w-full max-w-[80mm] mb-6 flex items-center justify-between no-print">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => handlePrint()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Actual Receipt */}
      <div ref={contentRef} id="print-content" className="print:w-full">
        <ReceiptPreview order={order} />
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #print-content, #print-content * {
            visibility: visible;
          }
          #print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}
