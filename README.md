# Digital Menu Hub

Build a simple, modern, mobile-first QR Digital Menu platform for restaurants and cafes.

The product should be extremely easy to use and should feel similar to a modern QR restaurant menu platform.

IMPORTANT:

This is NOT an online food delivery website.

Do NOT add unnecessary features like payment, delivery tracking, complex ordering, or customer accounts in the first version.

The main flow should be:

Restaurant Admin

→ Create restaurant

→ Add menu categories

→ Add food items

→ Publish menu

→ Generate QR code

→ Customer scans QR

→ Mobile digital menu opens

==================================================

1. CUSTOMER MENU

==================================================

Create a beautiful mobile-first restaurant menu page.

Example URL:

/menu/spice-garden

The page should contain:

- Restaurant logo

- Restaurant name

- Short description

- Location

- Google rating display area

- Menu categories

- Food items

- Food images

- Food name

- Food description

- Price

- Veg / non-veg indicator

- Available / unavailable status

Menu categories should be displayed as horizontally scrollable buttons.

Example:

All | Starters | Main Course | Biryani | Drinks | Desserts

Food items should be displayed as clean cards.

Each card:

[Food Image]

Chicken Biryani

Aromatic basmati rice with tender chicken

₹280

Use a clean, premium but simple restaurant design.

The website must be extremely fast and optimized for mobile phones because customers will access it after scanning a QR code.

==================================================

2. RESTAURANT INFORMATION

==================================================

At the top or bottom of the menu show:

Restaurant name

Address

Phone number

Buttons:

📍 Get Directions

📞 Call

💬 WhatsApp

📷 Instagram

The "Get Directions" button should open the restaurant's Google Maps location.

The restaurant admin should be able to save a Google Maps URL.

==================================================

3. GOOGLE REVIEW

==================================================

Add a section near the bottom:

"Enjoyed your experience?"

⭐⭐⭐⭐⭐

"Leave us a Google Review"

Button:

⭐ Review us on Google

The restaurant admin should be able to enter its Google Review URL.

When the customer clicks the button, open the Google review page.

Do NOT create our own review system.

Google Reviews should remain on Google's platform.

==================================================

4. ADMIN DASHBOARD

==================================================

Create a simple admin dashboard.

Sidebar/navigation:

Dashboard

Restaurant

Categories

Menu Items

QR Code

Settings

Dashboard should show:

Restaurant name

Total categories

Total menu items

Menu status

QR code

==================================================

5. RESTAURANT SETTINGS

==================================================

Admin can edit:

Restaurant name

Logo

Description

Phone

WhatsApp number

Address

Google Maps URL

Google Review URL

Instagram URL

==================================================

6. CATEGORY MANAGEMENT

==================================================

Admin can:

Add category

Edit category

Delete category

Reorder category

Examples:

Starters

Main Course

Biryani

Chinese

Beverages

Desserts

==================================================

7. MENU ITEM MANAGEMENT

==================================================

Admin can:

Add item

Edit item

Delete item

Mark item available/unavailable

Each item should contain:

Food name

Category

Price

Description

Food image

Veg/non-veg

Available/unavailable

Allow image upload.

==================================================

8. QR CODE

==================================================

Every restaurant should automatically have a unique public menu URL.

Example:

https://yourdomain.com/menu/spice-garden

Generate a QR code for this URL.

Admin should be able to:

View QR code

Download QR code

Print QR code

The QR code should remain the same even when the restaurant changes its menu.

==================================================

9. DATABASE

==================================================

Use a proper database structure.

Create tables/collections for:

Restaurants

Categories

MenuItems

AdminUsers

Relationships:

Restaurant

→ Categories

→ MenuItems

Each restaurant must only access its own data.

==================================================

10. DESIGN

==================================================

Design style:

- Clean

- Modern

- Premium but simple

- Mobile-first

- White/light background

- Rounded cards

- Large food images

- Excellent typography

- Smooth subtle animations

- No unnecessary visual clutter

The customer menu should feel like a premium restaurant menu, not a generic website.

Admin dashboard should be simple and functional.

==================================================

11. RESPONSIVE

==================================================

The customer menu is primarily designed for mobile.

It must work perfectly on:

Mobile

Tablet

Desktop

Prioritize mobile UI.

==================================================

12. DEMO DATA

==================================================

Create a demo restaurant:

Restaurant:

The Spice Garden

Categories:

Starters

Main Course

Biryani

Beverages

Desserts

Add realistic sample menu items with prices and placeholder food images.

==================================================

13. IMPORTANT PRODUCT STRUCTURE

==================================================

This platform will eventually be used by many restaurants.

Therefore, DO NOT hardcode "The Spice Garden".

Create a reusable multi-restaurant architecture.

Example:

/menu/spice-garden

/menu/royal-cafe

/menu/bengal-bites

Each restaurant must have its own:

Logo

Information

Categories

Menu items

Google Maps

Google Review URL

Social links

==================================================

14. DO NOT BUILD YET

==================================================

Do not build:

Online payment

Food delivery

Customer login

Customer registration

Complex ordering

Kitchen management

Inventory management

Table reservation

Subscription billing

Keep this version simple.

First priority:

ADMIN → CREATE MENU → QR CODE → CUSTOMER MENU

Make the application production-quality, clean, responsive and easy to expand later.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f14fddd6-a9d7-47f9-8f4e-f2c9762db6d1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
