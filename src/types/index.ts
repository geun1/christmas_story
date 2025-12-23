export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  position: {
    x: number;
    y: number;
  };
}

export interface OrnamentPosition {
  x: number;
  y: number;
  row: number;
}
