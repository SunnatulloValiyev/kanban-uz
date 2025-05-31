import React, { useState, useEffect } from "react";

function AddTaskModal({ onClose, onCreate, columns = [], taskToEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([{ text: "", completed: false }]);
  const [status, setStatus] = useState(columns[0] || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setSubtasks(
        taskToEdit.subtasks?.length
          ? taskToEdit.subtasks.map((st) =>
              typeof st === "string" ? { text: st, completed: false } : st
            )
          : [{ text: "", completed: false }]
      );
      setStatus(taskToEdit.status);
    } else {
      resetForm();
    }
  }, [taskToEdit]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubtasks([{ text: "", completed: false }]);
    setStatus(columns[0] || "");
    setErrors({});
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index] = { ...updated[index], text: value };
    setSubtasks(updated);

    if (errors[`subtask-${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`subtask-${index}`];
      setErrors(newErrors);
    }
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { text: "", completed: false }]);
  };

  const removeSubtask = (index) => {
    const updated = subtasks.filter((_, i) => i !== index);
    setSubtasks(updated);

    const newErrors = { ...errors };
    for (let key in newErrors) {
      if (key.startsWith("subtask-") && parseInt(key.split("-")[1]) >= index) {
        delete newErrors[key];
      }
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    subtasks.forEach((st, index) => {
      if (!st.text.trim()) {
        newErrors[`subtask-${index}`] = "Subtask cannot be empty";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      subtasks: subtasks
        .map((st) => ({
          text: st.text.trim(),
          completed: st.completed,
        }))
        .filter((st) => st.text !== ""),
      status,
    };

    onCreate(newTask);
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div 
        className="rounded-xl p-6 w-full max-w-md"
        style={{
          backgroundColor: "var(--color-card-bg)",
          color: "var(--color-text)",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {taskToEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition"
            style={{ color: "var(--color-text-muted)" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Take coffee break"
              className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                backgroundColor: "var(--color-input-bg)",
                color: "var(--color-text)",
                border: errors.title ? "1px solid #ef4444" : "1px solid var(--color-border)"
              }}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Description..."
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              rows="3"
              style={{
                backgroundColor: "var(--color-input-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)"
              }}
            />
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Subtasks
            </label>
            <div className="space-y-2">
              {subtasks.map((st, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={st.text}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    placeholder="e.g. Make coffee"
                    className={`flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
                      errors[`subtask-${index}`] ? "border-red-500" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: "var(--color-input-bg)",
                      color: "var(--color-text)",
                      border: errors[`subtask-${index}`] ? "1px solid #ef4444" : "1px solid var(--color-border)"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Remove subtask"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {Object.keys(errors).map(
                (key) =>
                  key.startsWith("subtask-") && (
                    <p key={key} className="text-sm text-red-500">
                      {errors[key]}
                    </p>
                  )
              )}
            </div>
            <button
              type="button"
              onClick={addSubtask}
              className="mt-2 w-full py-2 rounded-md transition font-medium"
              style={{
                backgroundColor: "var(--color-button-secondary-bg)",
                color: "var(--color-primary)",
              }}
            >
              + Add New Subtask
            </button>
          </div>

          <div>
            <label 
              className="block text-sm font-medium mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--color-input-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)"
              }}
              required
            >
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col.split("").join(" ")}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white rounded-md hover:bg-blue-700 transition font-medium"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          >
            {taskToEdit ? "Save Changes" : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;