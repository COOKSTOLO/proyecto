export interface User {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "user";
  subscriptionActive: boolean;
  createdAt: any;
}