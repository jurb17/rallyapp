import React, { useState, useCallback } from "react";
import Task from "./Task";
import TaskCard from "./TaskCard";
import update from "immutability-helper";

const RenderTasks = (props) => {
  let cards = props.tasks;

  // update task list
  const updateTaskList = (newList) => {
    props.reorderTaskList(newList);
  };
  // card movement definition
  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      updateTaskList(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [cards]
  );
  // delete task by passing the element ID to this function
  const deleteTaskWithId = (deleteId) => {
    props.handleDeleteTask(deleteId);
  };
  const renderCardEdit = (card, index) => {
    return (
      <Task
        key={card.id}
        id={card.id}
        index={index}
        order={index + 1}
        title={card.title}
        deliverable={card.deliverable}
        moveCard={moveCard}
        deleteTaskWithId={deleteTaskWithId}
      />
    );
  };
  const renderCard = (card, index) => {
    const taskData = {
      title: card.title,
      deliverable: card.deliverable,
      order: index + 1,
    };
    return <TaskCard key={card.id} task={taskData} editMode="false" />;
  };
  return (
    <>
      {!cards || cards.length === 0 ? (
        <div>
          <h3>
            <em>No tasks to display</em>
          </h3>
          {!props.editMode && (
            <p>{/* Select "Edit Service" to add tasks to your service. */}</p>
          )}
        </div>
      ) : (
        <div ref={props.forwardedTaskListRef}>
          {props.editMode
            ? cards.map((card, i) => renderCardEdit(card, i))
            : cards.map((card, i) => renderCard(card, i))}
        </div>
      )}
    </>
  );
};

export default RenderTasks;
