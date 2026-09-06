create or replace function public.enforce_staff_entry_amounts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  listed_price numeric(14, 0);
  expected_revenue numeric(14, 0);
begin
  if public.is_owner() then return new; end if;
  if current_setting('mombicare.benefit_write', true) = 'allowed' then return new; end if;

  if new.sale_type = 'external_tour'::public.sale_type then
    raise exception 'Chỉ chủ spa mới có thể ghi nhận trả tua ngoài.';
  end if;

  select default_price into listed_price from public.services where id = new.service_id;
  if listed_price is null then raise exception 'Dịch vụ không hợp lệ.'; end if;

  -- Staff can enter the total package price and actual payment on a new sale.
  -- Existing-entry editing remains governed by the owner-only RLS policy.
  if TG_OP = 'INSERT' and new.sale_type = 'package_sale'::public.sale_type then
    if new.external_payout_amount <> 0 then
      raise exception 'Nhân viên không được thay đổi khoản chi.';
    end if;
    return new;
  end if;

  expected_revenue := case
    when new.sale_type in ('package_usage'::public.sale_type, 'gift'::public.sale_type) then 0
    else listed_price
  end;
  if new.price_snapshot <> listed_price
     or new.revenue_amount <> expected_revenue
     or new.external_payout_amount <> 0 then
    raise exception 'Nhân viên không được thay đổi giá gói, thực thu hoặc khoản chi. Giá do chủ spa thiết lập.';
  end if;
  return new;
end;
$$;
