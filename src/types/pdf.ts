export type TextNode = {
  id: string;
  pageIndex: number;
  content: string;
  x: number;
  y: number;
  fontRef: string;
  fontSize: number;
  transform: number[];
  width: number;
  height: number;
  originalOperatorIndex: number;
  modified: boolean;
  deleted: boolean;
  isNew?: boolean;
  originalX?: number;
  originalY?: number;
  originalWidth?: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  bgColor: string;
};

export type PageInfo = {
  pageIndex: number;
  width: number;
  height: number;
  thumbnailDataUrl?: string;
};
