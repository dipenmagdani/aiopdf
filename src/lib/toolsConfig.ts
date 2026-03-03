import {
  Merge,
  Scissors,
  Minimize2,
  RotateCw,
  Image,
  Images,
  LayoutGrid,
  Droplets,
  Lock,
  Unlock,
  type LucideIcon,
} from 'lucide-react';

export type ToolTier = 'free' | 'pro' | 'enterprise';
export type ToolCategory = 'Edit' | 'Convert' | 'Organize' | 'Security';

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  tier: ToolTier;
  route: string;
  color: string; // gradient accent
}

export const toolsConfig: ToolConfig[] = [
  {
    id: 'merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into a single document',
    icon: Merge,
    category: 'Organize',
    tier: 'free',
    route: '/tools/merge',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'split',
    name: 'Split PDF',
    description: 'Extract specific pages into separate files',
    icon: Scissors,
    category: 'Organize',
    tier: 'free',
    route: '/tools/split',
    color: 'from-violet-500 to-purple-400',
  },
  {
    id: 'compress',
    name: 'Compress PDF',
    description: 'Reduce file size while maintaining quality',
    icon: Minimize2,
    category: 'Edit',
    tier: 'free',
    route: '/tools/compress',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'rotate',
    name: 'Rotate PDF',
    description: 'Rotate pages by 90, 180, or 270 degrees',
    icon: RotateCw,
    category: 'Organize',
    tier: 'free',
    route: '/tools/rotate',
    color: 'from-orange-500 to-amber-400',
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    description: 'Convert PDF pages to PNG or JPEG images',
    icon: Image,
    category: 'Convert',
    tier: 'free',
    route: '/tools/pdf-to-images',
    color: 'from-pink-500 to-rose-400',
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Combine images into a single PDF document',
    icon: Images,
    category: 'Convert',
    tier: 'free',
    route: '/tools/images-to-pdf',
    color: 'from-indigo-500 to-blue-400',
  },
  {
    id: 'organize',
    name: 'Organize Pages',
    description: 'Reorder, delete, and manage PDF pages',
    icon: LayoutGrid,
    category: 'Organize',
    tier: 'pro',
    route: '/tools/organize',
    color: 'from-sky-500 to-blue-400',
  },
  {
    id: 'watermark',
    name: 'Add Watermark',
    description: 'Overlay text or image watermarks on PDFs',
    icon: Droplets,
    category: 'Edit',
    tier: 'pro',
    route: '/tools/watermark',
    color: 'from-fuchsia-500 to-pink-400',
  },
  {
    id: 'encrypt',
    name: 'Encrypt PDF',
    description: 'Password-protect your PDF documents',
    icon: Lock,
    category: 'Security',
    tier: 'pro',
    route: '/tools/encrypt',
    color: 'from-red-500 to-orange-400',
  },
  {
    id: 'decrypt',
    name: 'Decrypt PDF',
    description: 'Remove password protection from PDFs',
    icon: Unlock,
    category: 'Security',
    tier: 'pro',
    route: '/tools/decrypt',
    color: 'from-yellow-500 to-amber-400',
  },
];

export function getToolBySlug(slug: string) {
  return toolsConfig.find((t) => t.id === slug);
}
