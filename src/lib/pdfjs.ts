import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from '../workers/pdf.worker.ts?worker&url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export { pdfjsLib };
