import { describe, it, expect } from "vitest";
import { Cinemagen } from "../src/core.js";
describe("Cinemagen", () => {
  it("init", () => { expect(new Cinemagen().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Cinemagen(); await c.process(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Cinemagen(); await c.process(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
