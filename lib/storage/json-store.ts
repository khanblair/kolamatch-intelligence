import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
    await ensureDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function readJson<T>(filename: string): Promise<T | null> {
    await ensureDir();
    const filePath = path.join(DATA_DIR, filename);
    try {
        const content = await fs.readFile(filePath, "utf-8");
        return JSON.parse(content) as T;
    } catch (error) {
        return null;
    }
}

export async function updateJson<T>(
    filename: string,
    updateFn: (data: T | null) => T
): Promise<T> {
    const currentData = await readJson<T>(filename);
    const newData = updateFn(currentData);
    await writeJson(filename, newData);
    return newData;
}
