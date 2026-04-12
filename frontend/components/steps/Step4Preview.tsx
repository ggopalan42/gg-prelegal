'use client';

import dynamic from 'next/dynamic';
import { NDAFormData } from '@/lib/types';

const DocumentPreview = dynamic(() => import('@/components/DocumentPreview'), { ssr: false });

interface Props {
  data: NDAFormData;
}

export default function Step4Preview({ data }: Props) {
  return <DocumentPreview data={data} />;
}
