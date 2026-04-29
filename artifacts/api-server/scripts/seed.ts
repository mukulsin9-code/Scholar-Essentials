import {
  db,
  usersTable,
  itemsTable,
  accommodationsTable,
  userProfilesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

async function ensureUser(opts: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  city: string;
  lat: number;
  lng: number;
  userType: "student" | "owner";
}) {
  const existing = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, opts.id))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(usersTable).values({
      id: opts.id,
      email: opts.email,
      firstName: opts.firstName,
      lastName: opts.lastName,
    });
  }
  const profile = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, opts.id))
    .limit(1);
  if (profile.length === 0) {
    await db.insert(userProfilesTable).values({
      userId: opts.id,
      userType: opts.userType,
      city: opts.city,
      latitude: opts.lat,
      longitude: opts.lng,
    });
  }
}

async function main() {
  await ensureUser({
    id: "seed-student-aanya",
    email: "aanya@example.edu",
    firstName: "Aanya",
    lastName: "Rao",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    userType: "student",
  });
  await ensureUser({
    id: "seed-student-rohan",
    email: "rohan@example.edu",
    firstName: "Rohan",
    lastName: "Mehta",
    city: "Bengaluru",
    lat: 12.9716,
    lng: 77.5946,
    userType: "student",
  });
  await ensureUser({
    id: "seed-student-isha",
    email: "isha@example.edu",
    firstName: "Isha",
    lastName: "Krishnan",
    city: "Bengaluru",
    lat: 12.9279,
    lng: 77.6271,
    userType: "student",
  });
  await ensureUser({
    id: "seed-owner-vikram",
    email: "vikram@pgowners.com",
    firstName: "Vikram",
    lastName: "Shetty",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.614,
    userType: "owner",
  });
  await ensureUser({
    id: "seed-owner-priya",
    email: "priya@pgowners.com",
    firstName: "Priya",
    lastName: "Nair",
    city: "Bengaluru",
    lat: 12.9698,
    lng: 77.7499,
    userType: "owner",
  });

  const existingItems = await db.select().from(itemsTable);
  if (existingItems.length === 0) {
    await db.insert(itemsTable).values([
      {
        sellerId: "seed-student-aanya",
        title: "Engineering Mathematics — B.S. Grewal (Latest Edition)",
        description:
          "Used for one semester, all pages intact, light pencil notes in early chapters. Includes the solutions companion.",
        price: "350",
        condition: "good",
        category: "Textbooks",
      },
      {
        sellerId: "seed-student-aanya",
        title: "Casio fx-991ES PLUS Scientific Calculator",
        description:
          "Allowed in most exams. Works perfectly, fresh batteries installed last month.",
        price: "650",
        condition: "like_new",
        category: "Electronics",
      },
      {
        sellerId: "seed-student-rohan",
        title: "Introduction to Algorithms (CLRS) — Hardcover",
        description:
          "The classic. Spine is straight, no highlighter, kept in a sleeve. Selling because I graduated.",
        price: "1200",
        condition: "like_new",
        category: "Textbooks",
      },
      {
        sellerId: "seed-student-rohan",
        title: "Wired Earphones with Mic — Sony MDR-EX150AP",
        description: "Great for online classes, never opened. Original packaging.",
        price: "450",
        condition: "new",
        category: "Electronics",
      },
      {
        sellerId: "seed-student-isha",
        title: "Single Bedside Study Lamp (LED, dimmable)",
        description:
          "Minimal scratches on the base. Three brightness modes, USB powered.",
        price: "300",
        condition: "good",
        category: "Room Essentials",
      },
      {
        sellerId: "seed-student-isha",
        title: "Cycle — Hero Sprint 26T (Lock + helmet included)",
        description:
          "Perfect campus cycle. Tyres replaced six months ago. No issues with brakes or gears.",
        price: "4500",
        condition: "good",
        category: "Transport",
      },
      {
        sellerId: "seed-student-aanya",
        title: "Lab Coat — Size M",
        description: "Worn twice. Freshly washed and ironed.",
        price: "180",
        condition: "like_new",
        category: "Lab Supplies",
      },
      {
        sellerId: "seed-student-rohan",
        title: "Notebook bundle — five 200-page ruled notebooks",
        description: "Two are completely unused, three have first 10 pages used.",
        price: "120",
        condition: "fair",
        category: "Stationery",
      },
    ]);
  }

  const existingAcc = await db.select().from(accommodationsTable);
  if (existingAcc.length === 0) {
    await db.insert(accommodationsTable).values([
      {
        ownerId: "seed-owner-vikram",
        name: "Sunrise Boys PG",
        address: "12, 4th Cross, Koramangala 5th Block, Bengaluru",
        description:
          "Walking distance to most colleges in Koramangala. Three home-cooked meals daily, weekly laundry, and reliable Wi-Fi.",
        monthlyRent: "9500",
        latitude: 12.9352,
        longitude: 77.614,
        genderPreference: "male",
        amenities: ["Wi-Fi", "Three meals", "Laundry", "Power backup", "Hot water"],
      },
      {
        ownerId: "seed-owner-priya",
        name: "Lotus Ladies Hostel",
        address: "44, 2nd Main, HSR Layout Sector 6, Bengaluru",
        description:
          "Quiet residential lane. CCTV at entry, separate study room, biometric access. Only for women students and working professionals.",
        monthlyRent: "11500",
        latitude: 12.9121,
        longitude: 77.6446,
        genderPreference: "female",
        amenities: [
          "Wi-Fi",
          "Three meals",
          "CCTV",
          "Study room",
          "Hot water",
          "Housekeeping",
        ],
      },
      {
        ownerId: "seed-owner-vikram",
        name: "Maple House Co-living",
        address: "78, Outer Ring Road, Marathahalli, Bengaluru",
        description:
          "Modern co-living with private rooms, shared lounge, and a rooftop. Suits older students and interns.",
        monthlyRent: "14500",
        latitude: 12.9569,
        longitude: 77.7011,
        genderPreference: "any",
        amenities: [
          "Wi-Fi",
          "Two meals",
          "Gym",
          "Common lounge",
          "Power backup",
          "Housekeeping",
        ],
      },
      {
        ownerId: "seed-owner-priya",
        name: "Green Leaf PG",
        address: "21, 8th Block, Jayanagar, Bengaluru",
        description:
          "Old Bengaluru charm in a refurbished bungalow. Affordable, walking distance to bus stops and the metro.",
        monthlyRent: "7800",
        latitude: 12.9237,
        longitude: 77.5825,
        genderPreference: "any",
        amenities: ["Wi-Fi", "Two meals", "Hot water", "Cycle parking"],
      },
      {
        ownerId: "seed-owner-vikram",
        name: "Riverside Boys Stay",
        address: "5, Whitefield Main Road, Bengaluru",
        description:
          "Close to ITPL and engineering colleges in the east. Spacious twin-sharing rooms with attached bathrooms.",
        monthlyRent: "10500",
        latitude: 12.9698,
        longitude: 77.7499,
        genderPreference: "male",
        amenities: ["Wi-Fi", "Three meals", "Power backup", "Cycle parking"],
      },
    ]);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
