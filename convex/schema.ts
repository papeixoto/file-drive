import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// in prod if you need to add a field to the schema
// orgId: v.optional(v.string())

export default defineSchema({
  files: defineTable({
    name: v.string(),
    fileId: v.id("_storage"),
    orgId: v.string(),
  }).index("by_orgId", ["orgId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
