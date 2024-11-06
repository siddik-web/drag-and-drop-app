import { CertificateTemplate } from "../types/types";
import { predefinedThemes } from "./themes";

const generateRandomImage = () => {
  return `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
};


export const certificateTemplates: CertificateTemplate[] = [
    {
      id: 'achievement',
      name: 'Achievement Certificate',
      theme: predefinedThemes[0],
      previewImage: generateRandomImage(),
      elements: [
        {
          id: 'title',
          type: 'title',
          content: 'Certificate of Achievement',
          position: { x: 250, y: 50 },
          dimensions: { width: 500, height: 80 },
          style: {
            fontSize: 36,
            textAlign: 'center',
            fontWeight: 'bold',
          },
        },
        // Add more predefined elements...
        {
          id: 'date',
          type: 'date',
          content: 'Date: [Insert Date]',
          position: { x: 250, y: 150 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        {
          id: 'signature',
          type: 'signature',
          content: 'Signature: [Insert Signature]',
          position: { x: 250, y: 200 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        // Add more predefined elements...
      ],
    },
    {
      id: 'diploma',
      name: 'Diploma Certificate',
      theme: predefinedThemes[1],
      previewImage: generateRandomImage(),
      elements: [
        {
          id: 'title',
          type: 'title',
          content: 'Diploma of Completion',
          position: { x: 250, y: 50 },
          dimensions: { width: 500, height: 80 },
          style: {
            fontSize: 36,
            textAlign: 'center',
            fontWeight: 'bold',
          },
        },
        // Add more predefined elements...
        {
          id: 'date',
          type: 'date',
          content: 'Date: [Insert Date]',
          position: { x: 250, y: 150 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        {
          id: 'signature',
          type: 'signature',
          content: 'Signature: [Insert Signature]',
          position: { x: 250, y: 200 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        // Add more predefined elements...
      ],
    },
    {
      id: 'participation',
      name: 'Participation Certificate',
      theme: predefinedThemes[2],
      previewImage: generateRandomImage(),
      elements: [
        {
          id: 'title',
          type: 'title',
          content: 'Certificate of Participation',
          position: { x: 250, y: 50 },
          dimensions: { width: 500, height: 80 },
          style: {
            fontSize: 36,
            textAlign: 'center',
            fontWeight: 'bold',
          },
        },
        // Add more predefined elements...
        {
          id: 'date',
          type: 'date',
          content: 'Date: [Insert Date]',
          position: { x: 250, y: 150 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        {
          id: 'signature',
          type: 'signature',
          content: 'Signature: [Insert Signature]',
          position: { x: 250, y: 200 },
          dimensions: { width: 300, height: 40 },
          style: {
            fontSize: 24,
            textAlign: 'center',
            fontWeight: 'normal',
          },
        },
        // Add more predefined elements...
      ],
    },
    // Add more templates...
  ];