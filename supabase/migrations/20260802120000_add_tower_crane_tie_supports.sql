-- Amendment 2: merge the new catalog product into the live state without
-- replacing administrator-managed product names, descriptions, categories, or images.
begin;

with current_catalog as (
  select id, data, coalesce(data -> 'products', '[]'::jsonb) as products
  from public.catalog_state
  where id = 1
)
update public.catalog_state as catalog
set data = jsonb_set(
  catalog.data,
  '{products}',
  current_catalog.products || jsonb_build_array(
    jsonb_build_object(
      'id', 'p43',
      'slug', 'tower-crane-tie-supports',
      'categoryId', 'cat-3',
      'nameEn', 'Tower Crane Tie Supports',
      'nameAr', 'دعامات ربط الرافعات البرجية',
      'descriptionEn', 'Tie-In (Wall Tie) systems provide engineered structural connections that safely stabilize tower cranes for operation beyond their freestanding height. Designed to meet applicable engineering standards and project requirements, our solutions ensure reliable load transfer, enhanced safety, and dependable performance throughout construction.',
      'descriptionAr', 'توفر أنظمة ربط الرافعات البرجية بالجدران وصلات إنشائية هندسية تثبّت الرافعات البرجية بأمان عند التشغيل فوق ارتفاعها الحر. صُممت هذه الحلول لتتوافق مع المعايير الهندسية المعمول بها ومتطلبات المشاريع، لضمان نقل موثوق للأحمال وتعزيز السلامة وتحقيق أداء يُعتمد عليه طوال مراحل الإنشاء.'
    )
  ),
  true
)
from current_catalog
where catalog.id = current_catalog.id
  and not exists (
    select 1
    from jsonb_array_elements(current_catalog.products) as product
    where product ->> 'id' = 'p43'
       or product ->> 'slug' = 'tower-crane-tie-supports'
  );

commit;
