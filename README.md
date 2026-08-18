# LUXAURA
We are developing a real estate luxurious website for real estate agents and companies to use to showcase their services 

# STACK USED
Next.Js
MongoDB

# UI Dependancies used
- Motion for animations
- Lucide for icons
- clsx for conditional classes
- Tailwind

# Integration of the Backend to the app

We now integrate the backend.
We will use MongoDB together with prisma

`npm install prisma @prisma/client`
`npx prisma init`

# Seed the data
After installing prosma and creating the schema, we then seed the data from the properties.ts file into the database

# Do Authentication to protect the routes
`npm install @clerk/nextjs`

I used Clerk to handle the authentication of the users
I started with the authentication of the admins.
