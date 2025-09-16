import { prismaClient } from "../application/database";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prismaClient.user.findFirst({
      where: { role: Role.ADMIN }
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prismaClient.user.create({
      data: {
        name: "Administrator",
        email: "admin@desa.com",
        phone_number: "08123456789",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("Admin user created successfully:");
    console.log("Email: admin@desa.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await prismaClient.$disconnect();
  }
}

createAdminUser();