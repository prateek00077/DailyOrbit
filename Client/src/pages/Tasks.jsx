import React from "react";
import { useParams, Link } from "react-router-dom";

const dummyTasks = {
  "1": [
    { id: "t1", title: "Finish project report", completed: false, due: "2025-06-01" },
    { id: "t2", title: "Email client feedback", completed: true, due: "2025-05-28" },
  ],
  "2": [
    { id: "t3", title: "Morning yoga", completed: true, due: "2025-05-27" },
    { id: "t4", title: "Book doctor appointment", completed: false, due: "2025-06-05" },
  ],
  "3": [
    { id: "t5", title: "Complete React tutorial", completed: false, due: "2025-06-10" },
  ],
  "4": [
    { id: "t6", title: "Read a new book", completed: false, due: "2025-06-15" },
  ],
};

const categoryNames = {
  "1": "Work",
  "2": "Health",
  "3": "Learning",
  "4": "Personal",
};

const Tasks = () => {
  const { categoryId } = useParams();
  const tasks = dummyTasks[categoryId] || [];
  const categoryName = categoryNames[categoryId] || "Unknown Category";

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600">{categoryName} Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 italic">No tasks found for this category.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg shadow-md bg-white flex justify-between items-center ${
                task.completed ? "opacity-60 line-through" : ""
              }`}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                <p className="text-sm text-gray-500">Due: {task.due}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.completed ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {task.completed ? "Completed" : "Pending"}
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        to="/categories"
        className="inline-block mt-6 text-indigo-600 hover:underline"
      >
        ← Back to Categories
      </Link>
    </div>
  );
};

export default Tasks;
