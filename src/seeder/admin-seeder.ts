import { prismaClient } from "../application/database";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

async function createAdminUser() {
  try {
    // Delete existing admin users
    await prismaClient.user.deleteMany({
      where: { role: Role.ADMIN }
    });
    console.log("Existing admin users deleted");

    // command Create admin user
    // npm run seed-admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prismaClient.user.create({
      data: {
        name: "Administrator",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("Admin user created successfully:");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

createAdminUser();