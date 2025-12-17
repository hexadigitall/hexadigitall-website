# User Authentication Testing Guide

## ✅ Testing User Login & Role Access

### 1. Create Test Users via Admin Panel

**Login as Admin:**
1. Go to `https://hexadigitall.com/admin/login`
2. Login with admin credentials
3. Navigate to `/admin/users`

**Create a Test Teacher:**
- Name: `John Teacher`
- Username: `teacher1`
- Email: `teacher@test.com`
- Password: `teacher123` (minimum 8 characters)
- Role: `Teacher`
- Status: `Active`

**Create a Test Student:**
- Name: `Jane Student`
- Username: `student1`
- Email: `student@test.com`
- Password: `student123` (minimum 8 characters)
- Role: `Student`
- Status: `Active`

---

### 2. Test Teacher Login

1. **Logout from admin** (if logged in)
2. Go to `https://hexadigitall.com/teacher/login`
3. Login with:
   - Username: `teacher1`
   - Password: `teacher123`
4. Should redirect to `/teacher/dashboard`

**Expected on Teacher Dashboard:**
- See courses they're assigned to
- See students enrolled in their courses
- Download buttons for course PDFs (if available)
- Enrollment count for each course

**Test Access:**
- ✅ Can access `/teacher/dashboard`
- ❌ Cannot access `/student/dashboard` (should redirect)
- ✅ Can access `/admin/dashboard` if role is admin (admins have all access)

---

### 3. Test Student Login

1. **Logout from teacher** (if logged in)
2. Go to `https://hexadigitall.com/student/login`
3. Login with:
   - Username: `student1`
   - Password: `student123`
4. Should redirect to `/student/dashboard`

**Expected on Student Dashboard:**
- See courses they're enrolled in
- See payment due dates for live courses
- Download buttons for course PDFs
- "Pay Now" button for active live courses with monthly payments
- View assigned teacher information

**Test Access:**
- ✅ Can access `/student/dashboard`
- ❌ Cannot access `/teacher/dashboard` (should redirect)
- ❌ Cannot access `/admin/dashboard` (should redirect)

---

### 4. Test Admin Access to All Dashboards

1. Login as admin at `/admin/login`
2. Admin should be able to access:
   - ✅ `/admin/dashboard`
   - ✅ `/teacher/dashboard` (sees ALL courses)
   - ✅ `/student/dashboard` (sees enrollments if admin has studentId)

---

### 5. Assign Teacher to Course

**Via Admin Panel:**
1. Login as admin
2. Go to `/admin/users`
3. Find teacher user
4. Click "Assign Courses" button
5. Select courses to assign to teacher

**Via Sanity Studio (Alternative):**
1. Go to `https://hexadigitall.com/studio`
2. Open a Course document
3. Find "Assigned Teachers" field
4. Add reference to the teacher user

**Via Enrollment:**
1. Go to `/admin/enrollments`
2. Create or edit an enrollment
3. Set `teacherId` to reference the teacher user

---

### 6. Test Course Materials Access

**Create Test Course with PDFs:**
1. Go to `/studio`
2. Create or edit a Course
3. Upload `contentPdf` (course content PDF)
4. Upload `roadmapPdf` (learning roadmap PDF)
5. Add teacher to `assignedTeachers` array

**Test Access on Course Page:**
1. Visit `/courses/[course-slug]`
2. **Unauthenticated**: Should see "Login and enroll to access materials"
3. **As Student (enrolled)**: Should see download buttons for both PDFs
4. **As Teacher (assigned)**: Should see download buttons for both PDFs
5. **As Admin**: Always see download buttons

**Test Access on Dashboards:**
- Teacher dashboard should show download buttons for assigned courses
- Student dashboard should show download buttons for enrolled courses

---

### 7. Test Payment Feature (Students)

**Prerequisites:**
1. Create an enrollment with `courseType: "live"`
2. Set `monthlyAmount` (e.g., 25000 for ₦25,000)
3. Set `nextPaymentDue` to a future date
4. Assign `teacherId` to a teacher
5. Set `status: "active"`

**Test Payment:**
1. Login as student
2. Go to `/student/dashboard`
3. Find active live course with payment due
4. Click "Pay Now" button
5. Should see payment initiation message
6. (If Paystack configured, should redirect to payment page)

---

### 8. Expected API Responses

**Teacher Courses API** (`GET /api/teacher/courses`):
```json
{
  "success": true,
  "courses": [
    {
      "_id": "course-id",
      "title": "Course Title",
      "slug": { "current": "course-slug" },
      "description": "Course description",
      "level": "intermediate",
      "contentPdf": { "asset": { "_ref": "file-..." } },
      "roadmapPdf": { "asset": { "_ref": "file-..." } },
      "enrollmentCount": 5,
      "activeEnrollments": [...]
    }
  ]
}
```

**Student Enrollments API** (`GET /api/student/enrollments`):
```json
{
  "success": true,
  "enrollments": [
    {
      "_id": "enrollment-id",
      "courseType": "live",
      "status": "active",
      "monthlyAmount": 25000,
      "nextPaymentDue": "2025-01-15",
      "course": { "title": "...", ... },
      "teacher": { "name": "John Teacher", ... }
    }
  ]
}
```

**Payment Initiation** (`POST /api/student/renew`):
```json
{
  "success": true,
  "message": "Payment link generated",
  "paymentUrl": "https://checkout.paystack.com/...",
  "reference": "PAY-xxx-123456",
  "enrollment": {
    "id": "enrollment-id",
    "course": "Course Title",
    "amount": 25000,
    "currency": "NGN"
  }
}
```

---

### 9. Troubleshooting

**Issue: User can't login**
- ✅ Check username and password are correct
- ✅ Verify user status is "active" (not "suspended")
- ✅ Check password was set (minimum 8 characters)
- ✅ Clear browser cache and cookies

**Issue: Teacher sees no courses**
- ✅ Verify teacher is added to course's `assignedTeachers` array
- ✅ OR verify enrollments have `teacherId` reference
- ✅ Check teacher's userId matches

**Issue: Student sees no enrollments**
- ✅ Verify enrollment has `studentId` reference to student user
- ✅ Check enrollment status is "active"
- ✅ Verify student's userId matches

**Issue: PDFs not downloading**
- ✅ Check PDFs are uploaded in Sanity Studio
- ✅ Verify `contentPdf` and `roadmapPdf` fields have asset references
- ✅ Check user has proper access (enrolled/assigned)

**Issue: Payment button doesn't work**
- ✅ Verify enrollment has `courseType: "live"`
- ✅ Check `monthlyAmount` is set
- ✅ Verify enrollment status is "active"
- ✅ Add `PAYSTACK_PUBLIC_KEY` to environment variables for real payments

---

### 10. Next Steps After Testing

1. ✅ Integrate Paystack/Flutterwave for real payments
2. ✅ Add payment history tracking
3. ✅ Create email notifications for payment reminders
4. ✅ Add teacher-student messaging/announcements
5. ✅ Implement assignment submission system
6. ✅ Add progress tracking for students

---

## Quick Test Commands

**Check if user exists in Sanity:**
```bash
# In Sanity Studio query tool
*[_type == "user" && username == "teacher1"][0]
```

**Check enrollments:**
```bash
# In Sanity Studio query tool
*[_type == "enrollment" && studentId._ref == "user-id"]
```

**Check course assignments:**
```bash
# In Sanity Studio query tool
*[_type == "course" && "user-id" in assignedTeachers[]._ref]
```

---

## Status Checklist

- [ ] Admin can create users (teacher, student)
- [ ] Teacher can login at `/teacher/login`
- [ ] Student can login at `/student/login`
- [ ] Teacher sees assigned courses
- [ ] Student sees enrolled courses
- [ ] PDFs downloadable by appropriate roles
- [ ] Payment button works for students
- [ ] Middleware properly restricts routes by role
- [ ] Admin can access all dashboards
- [ ] Enrollment status affects access
