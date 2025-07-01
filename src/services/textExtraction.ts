import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import mammoth from 'mammoth';
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfWorker;

export interface TextExtractionResult {
  text: string;
  wordCount: number;
  error?: string;
}

export class TextExtractionService {
  static async extractFromPDF(file: File): Promise<TextExtractionResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      const cleanText = fullText.trim();
      const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

      return {
        text: cleanText,
        wordCount
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      return {
        text: '',
        wordCount: 0,
        error: 'Failed to extract text from PDF. Please ensure the file is not corrupted.'
      };
    }
  }

  static async extractFromDOCX(file: File): Promise<TextExtractionResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      const cleanText = result.value.trim();
      const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;

      return {
        text: cleanText,
        wordCount
      };
    } catch (error) {
      console.error('DOCX extraction error:', error);
      return {
        text: '',
        wordCount: 0,
        error: 'Failed to extract text from DOCX. Please ensure the file is not corrupted.'
      };
    }
  }

  static async extractText(file: File): Promise<TextExtractionResult> {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return this.extractFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return this.extractFromDOCX(file);
    } else {
      return {
        text: '',
        wordCount: 0,
        error: 'Unsupported file format. Please upload a PDF or DOCX file.'
      };
    }
  }
}