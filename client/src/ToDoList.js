import React from 'react'
import { Container } from '@material-ui/core';
import styled from "styled-components"
import ToDo from "./ToDo"

const ToDoUL = styled.ul`
    list-style-type: none;
    padding: 0;
`
const ToDoLI = styled.li`
    margin-bottom: 1rem;
`
export default function ToDoList({ ToDos, subscribeToNewToDos }) {
    // When the component is mounted, subscribe to new To Dos
    React.useEffect(() => subscribeToNewToDos(), []);

    return (
        <Container maxWidth="xs" >
            <ToDoUL>
                {ToDos ? ToDos.map(todo => <ToDoLI key={todo.id}><ToDo title={todo.title} /></ToDoLI>) : <p>loading</p>}
            </ToDoUL>
        </Container>
    )
}
