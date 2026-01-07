# PHASE 2 IMPLEMENTATION ROADMAP

**Status**: Ready to begin  
**Saved to memory**: All tasks, pricing, course data, instructions  
**Estimated duration**: 2-3 hours

---

## Phase 2 Overview

Extend the student course experience with resources (curriculum PDFs, live links) and teacher capability to manage class links.

### Core Deliverables
1. **Course schema**: Add curriculumPdf, roadmapPdf, liveClassLink
2. **Student UX**: Resources tab with downloadable materials + live link
3. **Teacher UX**: Form to update liveClassLink per course
4. **Renewal flow**: Countdown timer, expiry states, Pay Now CTA

---

## Task 1: Course Schema Extension (30-45 min)

### File: [src/sanity/schemas/course.ts](src/sanity/schemas/course.ts)

**What to add** (after existing roadmapPdf):
```typescript
defineField({
  name: 'liveClassLink',
  title: 'Live Class Meeting Link',
  type: 'url',
  description: 'Zoom, Google Meet, or Teams link for live class sessions. Updated by teacher.',
  validation: (Rule) => Rule.custom((value, context) => {
    const parent = context?.parent;
    if (parent?.courseType !== 'live') return true;
    // Optional field, but if provided must be valid URL
    if (value && !value.match(/^https?:\/\/.+/)) {
      return 'Must be a valid HTTPS URL';
    }
    return true;
  })
})
```

**Register**: Ensure schema is registered in [src/sanity/schemas/index.ts](src/sanity/schemas/index.ts)

**Test**: 
```bash
npm run build
npm run dev
# Visit Sanity Studio, edit a course, verify field appears
```

---

## Task 2: Student Resources Tab (45-60 min)

### File: [src/app/student/dashboard/page.tsx](src/app/student/dashboard/page.tsx)

**What to add** to the course card (after download buttons, before enrollment details):

```typescript
{/* Resources Tab Section */}
<div className="mb-4 border-t border-gray-200 pt-4">
  <h4 className="font-semibold text-gray-800 mb-3">Resources & Class</h4>
  
  <div className="space-y-2">
    {/* Live Class Link */}
    {enrollment.course?.liveClassLink && (
      <a
        href={enrollment.course.liveClassLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-between px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <VideoCameraIcon className="h-4 w-4" />
          Join Live Class
        </span>
        <ExternalLinkIcon className="h-4 w-4" />
      </a>
    )}

    {/* Curriculum PDF */}
    {enrollment.course?.contentPdf && (
      <button
        onClick={() => downloadPdf(enrollment.course?.contentPdf, `${enrollment.course?.title || 'course'}-curriculum.pdf`)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download Curriculum
      </button>
    )}

    {/* Roadmap PDF */}
    {enrollment.course?.roadmapPdf && (
      <button
        onClick={() => downloadPdf(enrollment.course?.roadmapPdf, `${enrollment.course?.title || 'course'}-roadmap.pdf`)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Download Roadmap
      </button>
    )}
  </div>
</div>
```

**Required imports** (add to top):
```typescript
import { VideoCameraIcon, ExternalLinkIcon } from '@heroicons/react/24/outline'
```

**Test**:
- Enroll in a live course with liveClassLink set
- Verify link appears and is clickable
- Test PDF downloads still work

---

## Task 3: Teacher Update Link Form (60-90 min)

### File: [src/app/teacher/dashboard/page.tsx](src/app/teacher/dashboard/page.tsx)

**What to add** to each teacher's course card:

```typescript
// Add to course card component (new section after course title)
<div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
  <h4 className="font-semibold text-gray-700 mb-3">Live Class Link</h4>
  
  {editingCourseId === course._id ? (
    <div className="space-y-2">
      <input
        type="url"
        placeholder="https://zoom.us/j/123456 or https://meet.google.com/abc-defg-hij"
        value={editingLink}
        onChange={(e) => setEditingLink(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={() => handleSaveLink(course._id)}
          disabled={savingLinkId === course._id}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {savingLinkId === course._id ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setEditingCourseId(null)}
          className="flex-1 px-3 py-2 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600 truncate">
        {course.liveClassLink ? (
          <a href={course.liveClassLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {course.liveClassLink}
          </a>
        ) : (
          <span className="text-gray-400">No link set</span>
        )}
      </p>
      <button
        onClick={() => {
          setEditingCourseId(course._id);
          setEditingLink(course.liveClassLink || '');
        }}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Edit
      </button>
    </div>
  )}
</div>
```

**Add state** at component top:
```typescript
const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
const [editingLink, setEditingLink] = useState<string>('');
const [savingLinkId, setSavingLinkId] = useState<string | null>(null);
```

**Add handler**:
```typescript
const handleSaveLink = async (courseId: string) => {
  setSavingLinkId(courseId);
  try {
    const response = await fetch(`/api/teacher/course/${courseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        liveClassLink: editingLink,
      }),
    });

    if (response.ok) {
      // Update local state
      setTeacherCourses(prev =>
        prev.map(c => c._id === courseId ? { ...c, liveClassLink: editingLink } : c)
      );
      setEditingCourseId(null);
      alert('Live class link updated successfully!');
    } else {
      alert('Failed to update link. Please try again.');
    }
  } catch (error) {
    console.error('Error updating link:', error);
    alert('Error updating link.');
  } finally {
    setSavingLinkId(null);
  }
};
```

**Create API route** [src/app/api/teacher/course/[courseId]/route.ts](src/app/api/teacher/course/[courseId]/route.ts):

```typescript
import { createClient } from '@sanity/client';
import { NextRequest, NextResponse } from 'next/server';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-08-30',
});

export async function PATCH(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify teacher token
    const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!authRes.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const authData = await authRes.json();
    if (authData.role !== 'teacher' && authData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { liveClassLink } = body;

    // Update course in Sanity
    const result = await client.patch(params.courseId).set({ liveClassLink }).commit();

    return NextResponse.json({ success: true, course: result });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}
```

---

## Task 4: Testing & Refinement (30-45 min)

### Test Checklist

- [ ] **Schema registration**: Course schema includes all 3 new fields
- [ ] **Student view**: Resources tab appears on enrolled courses
- [ ] **Live link**: Clickable, opens in new tab
- [ ] **PDFs**: Download buttons work for curriculum & roadmap
- [ ] **Teacher form**: Edit mode toggles correctly
- [ ] **Teacher save**: Link persists after save
- [ ] **Permission check**: Only teacher/admin can edit
- [ ] **Countdown**: Renewal dates display correctly
- [ ] **Pay Now button**: Still visible, payment flow works

### Manual Testing Script
```bash
# 1. Start dev server
npm run dev

# 2. Student side:
# - Login as student
# - Enroll in live course (if not already)
# - Verify Resources tab visible
# - Click Join Live Class link
# - Download curriculum/roadmap

# 3. Teacher side:
# - Login as teacher
# - Navigate to dashboard
# - Edit liveClassLink for a course
# - Save and verify it persists

# 4. Student confirms:
# - Refresh dashboard
# - New link appears in Resources
```

---

## Optional: Dev-Only Paystack Mock (For testing)

### File: [src/app/api/student/renew/route.ts](src/app/api/student/renew/route.ts)

Add at top of handler:
```typescript
// Dev-only mock mode
if (process.env.NEXT_PUBLIC_PAYSTACK_DEV_MOCK === 'true') {
  console.log('DEV MOCK: Simulating successful payment');
  
  // Update enrollment as "paid"
  const updatedEnrollment = await client
    .patch(enrollmentId)
    .set({
      paymentStatus: 'completed',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      nextPaymentDue: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days
    })
    .commit();

  return NextResponse.json({
    success: true,
    message: 'Payment simulated (dev mode)',
    enrollment: updatedEnrollment,
  });
}
```

**Enable with**:
```bash
NEXT_PUBLIC_PAYSTACK_DEV_MOCK=true npm run dev
```

---

## Completion Checklist

- [ ] Task 1: Course schema updated (curriculumPdf, roadmapPdf, liveClassLink)
- [ ] Task 2: Student resources tab implemented with all CTAs
- [ ] Task 3: Teacher update form + API route working
- [ ] Task 4: All tests passing, no console errors
- [ ] Optional: Dev-only Paystack mock enabled for safe testing
- [ ] Documentation: Update README/guides with new features
- [ ] Deployment: Commit all changes, test on staging

---

## After Phase 2: Phase 3 (Curriculum & Metrics)

```
Phase 3: Curriculum Structure & Progress Tracking
├── Define course curriculum schema (lessons, modules, milestones)
├── Create assignment/test types
├── Build progress tracking dashboard
├── Implement course completion logic
├── Design certificate generation
└── Link KPIs to student dashboard
```

Estimated: 3-5 hours after Phase 2

---

**Ready to proceed?** Start with Task 1 (Schema Extension) and work through systematically.  
**Questions?** Refer to file links and code examples above.  
**Progress**: Track completion in todo list as you complete each task.
