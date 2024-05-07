import React from "react";
import RenderTasks from "./RenderTasks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TaskList = (props) => {
  if (props.tasks && props.tasks.length > 0) {
    props.tasks.map((task) => {
      if (!task.id) {
        task.id = Math.random();
      }
      if (props.attributeId) {
        task.attribute = task[props.attributeId];
      }
      return task;
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
          noneMessage={props.noneMessage}
          startAdornment={props.startAdornment}
        />
      </DndProvider>
    </div>
  );
};

export default TaskList;
