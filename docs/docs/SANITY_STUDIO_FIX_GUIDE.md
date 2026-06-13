# Sanity Studio SchemaError Fix Guide

## Problem

Sanity Studio at `/studio` is not loading due to a SchemaError (digest: 284825957). While schemas load successfully (14 types detected), the Studio UI fails to render, showing only a blank main content area.

## Investigation Summary

### What We Know

1. **Error persists across schema simplifications** - Even with completely flattened course schema structure
2. **Not isolated to course schema** - Simplified course schema still produces same error
3. **All 14 schemas examined** - No obvious structural issues found in manual review
4. **Schemas load successfully** - The error occurs during Studio initialization, not schema parsing

### Schemas in Project

1. `course.ts` - Complex with nested objects (already tested simplified version)
2. `courseCategory.ts` - Simple reference schema
3. `enrollment.ts` - Nested objects for live course details
4. `pendingEnrollment.ts` - Similar to enrollment  
5. `faq.ts` - Simple text schema
6. `post.ts` - Blog post schema
7. `project.ts` - Portfolio project schema
8. `service.ts` - Service offering schema
9. `serviceCategory.ts` - Complex with packages array
10. `serviceCaseStudy.ts` - Service case studies
11. `serviceRequest.ts` - Service request submissions
12. `serviceStatistics.ts` - Service stats
13. `serviceTestimonial.ts` - Service testimonials
14. `testimonial.ts` - General testimonials

## Fix Approach: Schema Isolation Testing

### Strategy

Use a systematic process to identify the problematic schema:

1. **Start with minimal set** - Load only 3-5 simple schemas
2. **Test Studio loading** - Verify if Studio renders correctly
3. **Progressive addition** - Add schemas one by one
4. **Identify culprit** - When error appears, we found the problem
5. **Fix and verify** - Correct the issue and confirm Studio works

### Method 1: Automated Testing (Recommended)

We've created testing tools to streamline this process:

#### Option A: Use Test Configuration

```bash
# 1. Backup your current config
cp sanity.config.ts sanity.config.ts.backup

# 2. Use the test config (starts with 5 simple schemas)
cp sanity.config.test.ts sanity.config.ts

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000/studio
# Check if Studio loads without errors

# 5. If it works, the error is in one of the excluded schemas
# If it fails, the error is in one of the included schemas

# 6. Restore original when done
cp sanity.config.ts.backup sanity.config.ts
```

#### Option B: Use Automated Test Script

```bash
./scripts/test-sanity-schemas.sh
```

This script:
- Backs up your original config
- Applies test config
- Starts dev server
- Provides instructions for testing

### Method 2: Manual Testing

If you prefer manual control:

1. **Edit `sanity.config.ts`** directly
2. **Comment out schemas** in the import section and schemaTypes array
3. **Start with these safe schemas:**
   ```typescript
   import faq from './src/sanity/schemas/faq'
   import post from './src/sanity/schemas/post'
   import testimonial from './src/sanity/schemas/testimonial'
   
   export const schemaTypes = [
     faq,
     post,
     testimonial
   ]
   ```
4. **Test Studio** - Visit `/studio`
5. **Add schemas one by one** until error appears

## Testing Sequence

### Phase 1: Simple Schemas (Low Complexity)
Test first - these are least likely to cause issues:
- `faq`
- `post`
- `testimonial`
- `courseCategory`
- `project`

### Phase 2: Medium Complexity
Add next if Phase 1 passes:
- `service`
- `serviceCaseStudy`
- `serviceStatistics`
- `serviceTestimonial`

### Phase 3: Complex Schemas
Add last - most likely to have issues:
- `serviceCategory` (has complex packages array)
- `serviceRequest` (nested objects)
- `enrollment` (complex nested for live courses)
- `pendingEnrollment` (similar complexity)
- `course` (already tested, but most complex)

## Common SchemaError Causes

### 1. Nested `defineField()` Calls

**Problem:**
```typescript
defineField({
  name: 'parent',
  type: 'object',
  fields: [
    defineField({  // ❌ Nested defineField
      name: 'child',
      type: 'string'
    })
  ]
})
```

**Solution:**
```typescript
defineField({
  name: 'parent',
  type: 'object',
  fields: [
    {  // ✅ Plain object
      name: 'child',
      type: 'string'
    }
  ]
})
```

### 2. Excessive Nesting Depth

Sanity has limits on nesting depth (typically 3-4 levels). Deeply nested objects can cause SchemaError.

**Solution:** Flatten the structure or split into separate document types.

### 3. Circular References

Self-referencing or circular schema references can cause issues.

**Solution:** Use weak references or restructure to avoid circularity.

### 4. Missing Required Fields

Fields marked as required but missing `validation` or vice versa.

**Solution:** Ensure consistency between field definitions and validation.

### 5. Invalid Field Names

Field names with special characters or starting with numbers.

**Solution:** Use camelCase and start with letters.

## Once the Problematic Schema is Found

### Step 1: Identify the Issue

Look for:
- Nested `defineField()` calls
- Excessive nesting (>3 levels deep)
- Missing `name` or `type` properties
- Invalid field names
- Circular references

### Step 2: Apply the Fix

Common fixes:
- Remove nested `defineField()` - use plain objects instead
- Flatten deeply nested structures
- Fix field name issues
- Add missing required properties
- Break circular references

### Step 3: Verify the Fix

```bash
# Restore your original config with the fix
npm run dev

# Visit /studio
# Verify Studio loads and displays all content types
```

### Step 4: Test CRUD Operations

Once Studio loads:
1. **Create** - Add a new document of the fixed type
2. **Read** - View existing documents
3. **Update** - Edit a document
4. **Delete** - Remove a test document

All operations should work normally.

## Fallback: Fresh Sanity Reinit

If schema isolation doesn't reveal the issue, consider:

### Option: Clean Slate Approach

1. **Export all content**
   ```bash
   sanity dataset export production backup.tar.gz
   ```

2. **Delete and recreate dataset**
   ```bash
   sanity dataset delete production
   sanity dataset create production
   ```

3. **Deploy fresh schemas**
   ```bash
   # Fix any schema issues first
   sanity deploy
   ```

4. **Import content back**
   ```bash
   sanity dataset import backup.tar.gz production
   ```

⚠️ **Warning:** Only use this as a last resort. Always backup first.

## Verification Checklist

After fixing Studio:

- [ ] `/studio` loads without SchemaError
- [ ] All 14 document types visible in Studio
- [ ] Can create new documents
- [ ] Can edit existing documents
- [ ] Can delete documents
- [ ] Course PPP pricing fields are editable
- [ ] Migration can proceed with Studio working

## Support Files

- `sanity.config.test.ts` - Minimal test configuration
- `scripts/test-sanity-schemas.sh` - Automated testing script
- `src/sanity/schemas/course-fixed.ts` - Simplified course schema (backup)
- `src/sanity/schemas/course-original-backup.ts` - Original course schema (backup)

## Next Steps After Fix

Once Studio is working:

1. ✅ Verify all schemas load correctly
2. ✅ Test CRUD operations
3. ✅ Run course migration if needed
4. ✅ Update courses with new PPP pricing
5. ✅ Uncomment FeaturedCourses on home page
6. ✅ Restore courses page from ComingSoon
7. ✅ Merge to main branch

## Questions?

If issues persist:
- Check Sanity Studio console for detailed error messages
- Review browser developer console for client-side errors
- Check terminal output for server-side errors
- Verify environment variables are set correctly
