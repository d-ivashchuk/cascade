export interface LemonsqueezySubscriptionAttributes {
  billing_anchor: number;
  cancelled: boolean;
  card_brand: string;
  card_last_four: string;
  created_at: string;
  customer_id: number;
  ends_at: string | null;
  id: string; // Custom data
  order_id: number;
  order_item_id: number;
  pause: string | null;
  product_id: number;
  product_name: string;
  renews_at: string;
  status: string;
  status_formatted: string;
  store_id: number;
  test_mode: boolean;
  trial_ends_at: string | null;
  updated_at: string;
  urls: {
    update_payment_method: string;
    customer_portal: string;
    customer_portal_update_subscription: string;
  };
  user_email: string;
  user_name: string;
  variant_id: number;
  variant_name: string;
}

export interface LemonsqueezyOrderAttributes {
  status: "paid";
  user_email: string;
  user_name: string;
  customer_id: number;
  id: string;
  first_order_item: {
    id: number;
    price_id: number;
    variant_id: number;
    variant_name: string;
    subscription_id: number;
  };
}

export interface LemonsqueezyWebhookPayload {
  data: {
    attributes:
      | LemonsqueezyOrderAttributes
      | LemonsqueezySubscriptionAttributes;
    id: string;
    relationships: unknown;
    type: string;
  };
  meta: {
    custom_data: {
      user_id_in_database: string;
    };
    event_name:
      | "order_created"
      | "subscription_cancelled"
      | "subscription_created"
      | "subscription_updated";
    test_mode: boolean;
  };
}
