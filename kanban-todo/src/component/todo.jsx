import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  TASK: "task",
};

function Task({ task, moveTask, deleteTask }) {
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { id: task.id },
  }));

  return (
    <div
      ref={drag}
      className="p-2 border mt-2 cursor-pointer"
      style={{
        backgroundColor:
          task.priority === "High"
            ? "#f87171"
            : task.priority === "Medium"
            ? "#fbbf24"
            : "#6ee7b7",
      }}
    >
      {task.title}
      <p>Priority: {task.priority}</p>
      <button className="border-solid border-2 bg-green-500 text-white rounded mt-2  p-1" onClick={() => deleteTask(task.id)}>delete</button>
    </div>
  );
}


function Column({ title,status, tasks, moveTask,deleteTask }) {
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (item) => moveTask(item.id, status),
  }));

 
  return (
    <div
      ref={drop}
      style={{ width: "30%" }}
      className="p-3 border"
    >
      <h2 className="text-center text-xl font-bold">{title}</h2>
    
      {tasks
        .filter((task) => task.isCompleted === status)
        .map((task) => (
          <Task key={task.id} task={task} moveTask={moveTask}  deleteTask={deleteTask}/>
        ))}
    </div>
  );
}

export function Todo() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [priority, setPriority] = useState("Low");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  useEffect(() => {

    if(tasks.length>0){
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      title: task,
      isCompleted: 0,
      priority: priority, 
      id: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
    setTask("");
  };

  const moveTask = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, isCompleted: newStatus } : task
      )
    );
  };

 const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center p-3">
        <h1 className="text-3xl font-bold">Kanban Task Management App</h1>
      </div>

      <div className="mt-4 flex flex-col items-center p-5">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            style={{ width: "200px" }}
            className="border p-3"
          />
          <span className="mt-2">
            Priority:
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="ml-2 p-2 border"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </span>
          <button
            type="submit"
            className="mt-3 p-2 bg-green-500 text-white rounded"
          >
            Add Task
          </button>
        </form>
      </div>

      <div className="flex justify-around mt-4">
        <Column
          title="To-Do"
          status={0}
          tasks={tasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
        />
        <Column
          title="In-Process"
          status={1}
          tasks={tasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
        />
        <Column
          title="Completed"
          status={2}
          tasks={tasks}
          moveTask={moveTask}
          deleteTask={deleteTask}
        />
      </div>
    </DndProvider>
  );
}
