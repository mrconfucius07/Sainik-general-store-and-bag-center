import "dotenv/config";
import { seedAdmin, seedProducts } from "../src/lib/seed";

(async () => {
  await seedAdmin();
  const added = await seedProducts();
  console.log(`✓ Seeded ${added} new products (existing skipped)`);
  process.exit(0);
})();
