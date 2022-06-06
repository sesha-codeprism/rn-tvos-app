export interface FormKeyBoard {
  row1: Row1[];
  row2: Row2[];
  row3: Row2[];
}

interface Row2 {
  type: string;
  content: string;
}

interface Row1 {
  type: string;
  content?: number;
  image?: string;
}
