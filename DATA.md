# Data Fetching

## Order Status

- Query: Order status
- Key: `/api/orders/${id}`
- Refresh rule: Every 5 seconds
- Reason: The order status can change while the customer is viewing the page, so SWR polls for updates.

## Menu Search

- Query: Dish search
- Key: `/api/dishes?q=${debounced}`
- Refresh rule: Fetches when the debounced search term changes
- Reason: Search results depend on what the customer types, so the SWR key changes with the search term.

## Menu Pagination

- Query: Dish page
- Key: `/api/dishes?page=${page}`
- Refresh rule: Fetches when the page number changes
- Reason: Each page has its own query key so numbered pages can be loaded and shared by URL.