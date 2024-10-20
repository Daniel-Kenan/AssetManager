import { PrismaClient } from '@prisma/client';
import { Clerk } from '@clerk/clerk-sdk-node';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Clerk
const clerk = new Clerk({
  apiKey: process.env.CLERK_API_KEY,
});

// Function to store organizations from Clerk to the database
async function storeOrganisations() {
  try {
    // Fetch organizations from Clerk
    const organisations = await clerk.organizations.getAllOrganizations();

    if (!organisations || organisations.length === 0) {
      console.log('No organizations found in Clerk.');
      return;
    }

    // Loop through organizations and store them in Prisma's Organisation model
    for (const org of organisations) {
      const { id: clerkId, name } = org;

      // Check if organization already exists in the database
      const existingOrg = await prisma.organisation.findUnique({
        where: { clerkId },
      });

      if (!existingOrg) {
        // Create a new organisation in the database
        await prisma.organisation.create({
          data: {
            clerkId,
            name,
          },
        });
        console.log(`Stored organisation: ${name}`);
      } else {
        console.log(`Organisation already exists: ${name}`);
      }
    }
  } catch (error) {
    console.error('Error storing organizations:', error);
  } finally {
    // Disconnect Prisma client after the operation is complete
    await prisma.$disconnect();
  }
}

// Execute the function
storeOrganisations().catch((e) => {
  console.error(e);
  process.exit(1);
});
