import React from 'react';
import TaskList from './TaskList';
import Task from './Task';
import NewTask from './NewTask';
import { TaskHeader } from './Task';
import { shallow } from 'enzyme';
import * as redux from 'react-redux';

const tasks = [
  {
    title: 'test task 1',
    description: 'This is a test task',
    _id: '1',
    priority: 'LOW',
    dueDate: new Date().toISOString(),
  },
  {
    title: 'test',
    description: 'This is a test task',
    _id: '2',
    priority: 'HIGH',
    dueDate: new Date().toISOString(),
  },
];

describe('Tasks list', () => {
  const useDispatchMock = jest.spyOn(redux, 'useDispatch');
  const useSelectorMock = jest.spyOn(redux, 'useSelector');
  beforeEach(() => {
    useSelectorMock.mockReturnValue(tasks);
  });

  it('Renders 2 lists', () => {
    const wrapper = shallow(<TaskList />);
    expect(wrapper.find('ul')).toHaveLength(2);
  });

  it('Renders task components from state', () => {
    const wrapper = shallow(<TaskList />);
    const list = wrapper.find('ul');
    expect(list.find(Task)).toHaveLength(2);
  });
});

describe('Task element', () => {
  const useDispatchMock = jest.spyOn(redux, 'useDispatch');

  it('Renders correct task title', () => {
    const wrapper = shallow(<Task task={tasks[0]} />);
    expect(wrapper.text().includes(tasks[0].title)).toBe(true);
  });

  it('Renders task description on click', () => {
    const wrapper = shallow(<Task task={tasks[0]} />);
    wrapper.find('#task-title').simulate('click');
    expect(wrapper.text().includes(tasks[0].description)).toBe(true);
  });
});

describe('New task form', () => {
  const useSelectorMock = jest.spyOn(redux, 'useSelector');
  it('Renders a form', () => {
    useSelectorMock.mockReturnValue({ folders: [], currentFolder: {} });
    const wrapper = shallow(<NewTask />);
    expect(wrapper.find('new-task-form')).toHaveLength(1);
  });
});
