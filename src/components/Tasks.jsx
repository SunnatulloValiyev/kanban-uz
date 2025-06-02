import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Tasks({
  tasks = [],
  columns = [],
  onEditTask,
  onDeleteTask,
  onAddColumn,
  onDeleteColumn,
  onTaskMove,
}) {
  const getStatusTasks = (status) =>
    tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
  const { source, destination } = result;
    
    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

  if (onTaskMove) {
      onTaskMove(
        result.draggableId, 
        source.droppableId, 
        destination.droppableId, 
        source.index,
        destination.index
      );
    }
  };

  const renderTasks = (taskList, status) => {
    if (!taskList.length) {
      return (
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              ref={provided.innerRef}
            {...provided.droppableProps}
              className="w-full p-4 my-2 bg-base-100 rounded-xl text-center"
          >
              No tasks
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }

    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
          ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3"
          >
            {taskList.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`w-full p-4 my-2 bg-base-100 rounded-xl shadow-sm hover:shadow-md transition relative group ${
                      snapshot.isDragging ? 'shadow-lg ring-2 ring-[#A8A4FF]' : ''
                    }`}
                  >
                    <h3 className="font-semibold  group-hover:text-[#A8A4FF] transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm mt-1 group-hover:text-[#A8A4FF] transition-colors">
                    {`${task.subtasks?.filter((st) => st.completed).length || 0} of ${
                        task.subtasks?.length || 0
                      } subtasks`}
                    </p>

                    <div className="flex gap-4 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => onEditTask && onEditTask(task)} 
                        aria-label="Edit"
                      >
                      <img
                          className="cursor-pointer hover:opacity-70 transition-opacity"
                          src="./svg/editt.svg"
                          alt="edit"
                          width={20}
                          height={20}
                        />
                      </button>
                      <button 
                        onClick={() => onDeleteTask && onDeleteTask(task.id)} 
                        aria-label="Delete"
                      >
                        <img
                          className="cursor-pointer hover:opacity-70 transition-opacity"
                          src="./svg/deleted.svg"
                          alt="delete"
                          width={20}
                          height={20}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  const handleAddColumn = () => {
    if (!onAddColumn) {
      console.error("onAddColumn function is not provided");
      return;
    }

    if (columns.length >= 5) {
      alert("Maximum 5 columns allowed");
      return;
    }

    const newColumn = prompt("Enter new column name:");

    if (newColumn === null || newColumn.trim() === "") {
      return;
    }

    const formattedColumn = newColumn.trim().toUpperCase();

    if (!columns.includes(formattedColumn)) {
      onAddColumn(formattedColumn);
    } else {
      alert("Column already exists");
    }
  };

  const handleDeleteColumn = (column) => {
    if (!onDeleteColumn) {
      console.error("onDeleteColumn function is not provided");
      return;
    }
    onDeleteColumn(column);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto pb-4">
        <div   className="gap-6 p-7 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {columns.map((status, idx) => (
            <div key={idx} className="max-w-[300px] w-full">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      status === "TODO"
                        ? "bg-blue-500"
                        : status === "DOING"
                        ? "bg-purple-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <h2 className="font-medium uppercase">
                    {status} ({getStatusTasks(status).length})
                  </h2>
                </div>
                {!["TODO", "DOING", "DONE"].includes(status) && (
                  <button
                    onClick={() => handleDeleteColumn(status)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Delete column"
                  >
                    ×
                  </button>
                )}
              </div>
              {renderTasks(getStatusTasks(status), status)}
            </div>
          ))}

          {columns.length < 5 && (
            <div
              className="max-w-[300px] w-full h-20 bg-base-100 rounded-xl mt-8 flex items-center justify-center cursor-pointer hover:bg-violet-400 transition"
              onClick={handleAddColumn}
            >
              <span className="text-blue-600 font-medium">+ Add New Column</span>
            </div>
          )}
        </div>
      </div>
    </DragDropContext>
  );
}

export default Tasks;