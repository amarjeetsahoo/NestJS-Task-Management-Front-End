import React from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import styled from 'styled-components';
import { useTasksStore } from './hooks';

const FiltersContainer = styled.div`
  margin-top: 20px;
`;

const ControlContainer = styled.div`
  background-color: #c0cde0;
  border-radius: 5px;
  padding: 10px;
`;

const TasksFilters = () => {
  const router = useRouter();
  const tasksStore = useTasksStore();

  const [filters, setFilters] = React.useState({
    status: tasksStore.filters.status,
    search: tasksStore.filters.search,
  });

  React.useEffect(() => {
    (async () => {
      try {
        await tasksStore.updateFilters(filters);
      } catch (error) {
        const { statusCode } = error.response?.data || {};

        if (statusCode === 401) {
          await router.push('/');
        }
      }
    })();
  }, [filters]);

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setFilters({ ...filters, status });
  };

  const handleSearchTermChange = (e) => {
    const search = e.target.value;
    setFilters({ ...filters, search });
  };

  return (
    <FiltersContainer>
      <Grid
        justify="space-between" // Add it here :)
        container
      >
        <Grid item>
          <ControlContainer>
            <FormControl style={{ width: '220px' }}>
              <TextField
                placeholder="Search..."
                value={filters.search}
                onChange={handleSearchTermChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </ControlContainer>
        </Grid>

        <Grid item>
          <ControlContainer>
            <FormControl style={{ width: '220px' }}>
              <Select
                value={filters.status}
                onChange={handleStatusFilterChange}
                displayEmpty
              >
                <MenuItem value="">No status filter</MenuItem>
                <MenuItem value={'OPEN'}>Open</MenuItem>
                <MenuItem value={'IN_PROGRESS'}>In Progress</MenuItem>
                <MenuItem value={'DONE'}>Done</MenuItem>
              </Select>
            </FormControl>
          </ControlContainer>
        </Grid>
      </Grid>
    </FiltersContainer>
  );
};

export default observer(TasksFilters);
