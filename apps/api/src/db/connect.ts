import mongoose from "mongoose";
import chalk from "chalk";

let isConnected = false;

function printMongoBanner(dbName: string) {
  const line = "─".repeat(48);
  console.log("");
  console.log(chalk.green("  ╔" + line + "╗"));
  console.log(chalk.green("  ║") + chalk.bold.white("                                                ") + chalk.green("║"));
  console.log(
    chalk.green("  ║") +
      "  " +
      chalk.bold.green("🍃 MongoDB") +
      chalk.white(" Connected Successfully!          ") +
      chalk.green("║"),
  );
  console.log(
    chalk.green("  ║") +
      "  " +
      chalk.cyan("Database :") +
      chalk.bold.yellow(` ${dbName}`) +
      " ".repeat(35 - dbName.length) +
      chalk.green("║"),
  );
  console.log(
    chalk.green("  ║") +
      "  " +
      chalk.cyan("Provider :") +
      chalk.white(" MongoDB Atlas                    ") +
      chalk.green("║"),
  );
  console.log(
    chalk.green("  ║") +
      "  " +
      chalk.cyan("Status   :") +
      chalk.bold.green(" ● Connected") +
      chalk.white("                        ") +
      chalk.green("║"),
  );
  console.log(chalk.green("  ║") + chalk.bold.white("                                                ") + chalk.green("║"));
  console.log(chalk.green("  ╚" + line + "╝"));
  console.log("");
}

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables.");
  }

  await mongoose.connect(uri);
  isConnected = true;

  const dbName = mongoose.connection.db?.databaseName ?? "unknown";
  printMongoBanner(dbName);
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log(chalk.yellow("\n[db] MongoDB disconnected on app termination.\n"));
  process.exit(0);
});
