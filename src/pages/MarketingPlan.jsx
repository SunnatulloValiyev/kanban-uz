import React, { useState, useEffect } from "react";
import AddTaskModal from "../components/AddTaskModal";
import Tasks from "../components/Tasks";
import Navbar from "../components/Navbar";

function MarketingPlan() {
  const [showModal, setShowModal] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [columns, setColumns] = useState(["TODO", "DOING", "DONE"]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem("marketingPlanTasks");
    const savedColumns = localStorage.getItem("marketingPlanColumns");

    if (savedTasks) setAllTasks(JSON.parse(savedTasks));
    if (savedColumns) {
      const parsedColumns = JSON.parse(savedColumns);
      setColumns(parsedColumns.length > 0 ? parsedColumns : ["TODO", "DOING", "DONE"]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("marketingPlanTasks", JSON.stringify(allTasks));
    localStorage.setItem("marketingPlanColumns", JSON.stringify(columns));
  }, [allTasks, columns]);

  const handleAddTask = (newTask) => {
    if (editingTask) {
      setAllTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id
            ? { ...newTask, id: editingTask.id, order: task.order }
            : task
        )
      );
      setEditingTask(null);
    } else {
      const tasksInColumn = allTasks.filter(
        (task) => task.status === newTask.status
      );
      setAllTasks([
        ...allTasks,
        { ...newTask, id: Date.now(), order: tasksInColumn.length },
      ]);
    }
  };

  const handleAddColumn = (newColumn) => {
    if (!newColumn) return;
    if (columns.length >= 5) {
      alert("Maximum 5 columns allowed");
      return;
    }
    if (!columns.includes(newColumn)) {
      setColumns([...columns, newColumn]);
    } else {
      alert("Column already exists");
    }
  };

  const handleDeleteColumn = (columnToDelete) => {
    const basicColumns = ["TODO", "DOING", "DONE"];
    if (basicColumns.includes(columnToDelete) && columns.length <= 3) {
      alert("Cannot delete basic columns");
      return;
    }
    if (
      window.confirm(`Delete "${columnToDelete}" column and all its tasks?`)
    ) {
      setColumns(columns.filter((col) => col !== columnToDelete));
      setAllTasks(allTasks.filter((task) => task.status !== columnToDelete));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setAllTasks(allTasks.filter((task) => task.id !== taskId));
    }
  };

  const handleTaskMove = (taskId, fromCol, toCol, fromIdx, toIdx) => {
    const movingTask = allTasks.find((t) => t.id === Number(taskId));
    if (!movingTask) return;

    const updatedTasks = allTasks.map((task) => {
      if (task.id === movingTask.id) {
        return { ...task, status: toCol };
      }
      return task;
    });

    const reorderedTasks = updatedTasks.map((task) => {
      if (task.status === toCol && task.id === movingTask.id) {
        return { ...task, order: toIdx };
      }

      if (task.status === fromCol && task.id !== movingTask.id) {
        if (task.order > fromIdx) {
          return { ...task, order: task.order - 1 };
        }

        if (task.status === toCol && task.id !== movingTask.id) {
          if (task.order >= toIdx) {
            return { ...task, order: task.order + 1 };
          }
        }
      }
      return task;
    });

    setAllTasks(reorderedTasks);
  };

  return (
    <div className="relative min-h-screen bg-base-300">
      {showNavbar && (
        <div className="fixed top-0 left-0 z-50 w-[300px] h-full bg-base-100 shadow-lg">
          <Navbar darkMode={false} toggleTheme={() => {}} />
        </div>
      )}

      <div className="flex justify-between items-center mb-8 p-10 bg-base-100">
        <h1 className="text-3xl font-bold">Marketing Plan</h1>
        <div className="flex gap-6">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
          >
            + Add New Task
          </button>
          <button
            className="cursor-pointer"
            onClick={() => setShowNavbar(!showNavbar)}
          >
            <img src="/svg/burger.svg" />
          </button>
        </div>
      </div>

      {showModal && (
        <AddTaskModal
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onCreate={handleAddTask}
          columns={columns}
          taskToEdit={editingTask}
        />
      )}

      <Tasks
        tasks={allTasks}
        columns={columns}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onAddColumn={handleAddColumn}
        onDeleteColumn={handleDeleteColumn}
        onTaskMove={handleTaskMove}
      />
    </div>
  );
}

export default MarketingPlan;
