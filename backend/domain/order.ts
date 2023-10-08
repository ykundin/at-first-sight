interface LabeledPrice {
  label: string;
  amount: number;
}

export interface Order {
  title: string;
  description: string;
  currency: string;
  prices: LabeledPrice[];
  payload: string;
}
