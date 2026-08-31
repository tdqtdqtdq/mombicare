export type AppRole = "owner" | "staff";
export type SaleType = "retail" | "package_sale" | "package_usage" | "gift" | "external_tour";
export type CommissionTarget = "technician" | "consultant";
export type CommissionRateType = "fixed" | "percentage";

export type Profile = {
  id: string;
  display_name: string;
  role: AppRole;
  is_active: boolean;
};

export type Service = {
  id: string;
  name: string;
  default_price: number;
  active: boolean;
};

export type CommissionRule = {
  id: string;
  service_id: string | null;
  target: CommissionTarget;
  recipient_profile_id: string | null;
  sale_type: SaleType | null;
  rate_type: CommissionRateType;
  rate_value: number;
  valid_from: string;
  valid_to: string | null;
  active: boolean;
  service?: Pick<Service, "name"> | null;
  recipient?: Pick<Profile, "display_name"> | null;
};

export type RevenueEntry = {
  id: string;
  service_date: string;
  customer_name: string;
  sale_type: SaleType;
  service_id: string;
  service_name_snapshot: string;
  revenue_amount: number;
  price_snapshot: number;
  external_payout_amount: number;
  technician_id: string | null;
  consultant_id: string | null;
  created_by: string;
  notes: string | null;
  status: "completed" | "void";
  service?: Pick<Service, "name"> | null;
  technician?: Pick<Profile, "display_name"> | null;
  consultant?: Pick<Profile, "display_name"> | null;
};

export type CommissionLedger = {
  id: string;
  revenue_entry_id: string;
  employee_id: string;
  target: CommissionTarget;
  amount: number;
  rate_type: CommissionRateType;
  rate_value: number;
  service_name_snapshot: string;
  service_date: string;
  status: "pending" | "locked" | "paid";
  employee?: Pick<Profile, "display_name"> | null;
  entry?: Pick<RevenueEntry, "sale_type" | "customer_name"> | null;
};

export type PayrollPeriod = {
  id: string;
  label: string;
  starts_on: string;
  ends_on: string;
  status: "pending" | "locked" | "paid";
  locked_at: string | null;
};

export type MonthlyTarget = {
  id: string;
  profile_id: string;
  target_month: string;
  target_amount: number;
  profile?: Pick<Profile, "display_name"> | null;
};

export type ExpenseCategory = "materials" | "offering" | "utilities" | "operating" | "other";

export type ExpenseEntry = {
  id: string;
  expense_date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  notes: string | null;
  status: "completed" | "void";
  created_by: string;
};

export const saleTypeLabels: Record<SaleType, string> = {
  retail: "Khách lẻ",
  package_sale: "Bán gói",
  package_usage: "Dùng gói cũ",
  gift: "Tặng / khuyến mãi",
  external_tour: "Trả tua ngoài",
};

export const commissionTargetLabels: Record<CommissionTarget, string> = {
  technician: "Kỹ thuật",
  consultant: "Tư vấn",
};

export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  materials: "Nguyên vật liệu",
  offering: "Đồ cúng / lễ",
  utilities: "Điện, nước, internet",
  operating: "Vận hành khác",
  other: "Chi khác",
};
