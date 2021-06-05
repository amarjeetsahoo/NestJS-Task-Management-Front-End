import React from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Fab, IconButton } from '@material-ui/core';
import { Add as AddIcon, ExitToApp as SignOutIcon } from '@material-ui/icons';
import { useTasksStore, useUserStore } from './hooks';
import TasksFilters from './TasksFilters';
import TasksList from './TasksList';

const TasksWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  margin: auto;
  padding: 20px;
  box-sizing: border-box;
`;

const TasksHeader = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 3px solid #757c87;
`;

const Title = styled.h1`
  width: 100%;
  color: #edf4ff;
`;

const CreateButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TasksContainer = styled.div`
  padding-top: 20px;
`;

const SignOutIconContainer = styled.div`
  margin-left: 10px;

  .signOutIcon {
    fill: #edf4ff;
  }
`;

const TasksView = () => {
  const router = useRouter();
  const tasksStore = useTasksStore();
  const userStore = useUserStore();

  React.useEffect(() => {
    (async () => {
      try {
        if (tasksStore) {
          await tasksStore.fetchTasks();
        }
      } catch (error) {
        const { statusCode } = error.response?.data || {};

        if (statusCode === 401) {
          await router.push('/');
        }
      }
    })();
  }, [tasksStore]);

  const handleSignOut = async () => {
    userStore.signout();
    tasksStore.resetTasks();
    await router.push('/signin');
  };

  return (
    <TasksWrapper>
      <TasksHeader>
        <Title>Get things done.</Title>

        <CreateButtonContainer>
          <Fab
            variant="extended"
            onClick={async () => {
              await router.push('/tasks/create');
            }}
          >
            <AddIcon />
            Create Task
          </Fab>

          <SignOutIconContainer>
            <IconButton onClick={handleSignOut}>
              <SignOutIcon className="signOutIcon" />
            </IconButton>
          </SignOutIconContainer>
        </CreateButtonContainer>
      </TasksHeader>

      <TasksFilters />

      <TasksContainer>
        <TasksList tasks={tasksStore.tasks} />
      </TasksContainer>
    </TasksWrapper>
  );
};

export default observer(TasksView);
