import React from "react";
import { Link } from "react-router-dom";

const dummyCategories = [
  { id: "1", name: "Work", description: "Tasks related to office and projects" },
  { id: "2", name: "Health", description: "Exercise, diet and wellness" },
  { id: "3", name: "Learning", description: "Courses, tutorials and reading" },
  { id: "4", name: "Personal", description: "Hobbies and personal goals" },
];

const Categories = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Your Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/tasks/${cat.id}`}
            className="block p-5 bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
            <p className="mt-1 text-gray-500">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
