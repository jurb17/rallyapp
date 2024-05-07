import React from "react";
import RenderTasks from "./RenderTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// ========================================

const TaskList = (props) => {
  if (props.tasks && props.tasks.length > 0) {
    props.tasks.map((task) => {
      if (!task.id) {
        task.id = Math.random();
        return task;
      }
    });
  }

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <RenderTasks
          forwardedTaskListRef={props.forwardedTaskListRef}
          tasks={props.tasks}
          editMode={props.editMode}
          reorderTaskList={props.reorderTaskList}
          handleDeleteTask={props.handleDeleteTask}
        />
      </DndProvider>
    </div>
  );
};

export default TaskList;
