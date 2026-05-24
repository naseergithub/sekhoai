import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add New Course</h1>
      <CourseForm mode="create" />
    </div>
  );
}
