export interface OrderInterface {
    id?: number;
    name: string;
    item: string;
    amount: number;
    qty: number;
    state: string;
    zip: number;
    type?: string
}
