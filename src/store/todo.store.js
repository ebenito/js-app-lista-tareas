import { Todo } from '../todos/models/todo.model';

export const Filters = {
    All: 'all',
    Completed: 'completed',
    Pending: 'pending'
}

const state = {
    todos: [
        new Todo('Planificar observación del eclipse'),
        new Todo('Comprar gafas de eclipse en Tubkala.com'),
        new Todo('Reservar alojamiento en la zona'),
        new Todo('Crear parametros personalizados para la Reflex'),
        new Todo('Compartir fotos del eclipse con la comunidad'),
    ],
    filter: Filters.All,
}


const initStore = () => {
    loadStore();
    console.log('InitStore 🥑');
}

const loadStore = () => {
    if( !localStorage.getItem('state') ) return;

    const { todos = [], filter = Filters.All } = JSON.parse( localStorage.getItem('state') );
    state.todos = todos.map( todo => {
        const t = new Todo( todo.description );
        t.id = todo.id;
        t.done = todo.done;
        t.createdAt = new Date( todo.createdAt );
        return t;
    });
    state.filter = filter;
}

const saveStateToLocalStorage = () =>{
    localStorage.setItem('state', JSON.stringify(state) );
}


const getTodos = ( filter = Filters.All ) => {
    
    switch( filter ) {
        case Filters.All:
            return [...state.todos];
        
        case Filters.Completed:
            return state.todos.filter( todo => todo.done );

        case Filters.Pending:
            return state.todos.filter( todo => !todo.done );

        default:
            throw new Error(`Option ${ filter } is not valid.`);
    }
}

/**
 * 
 * @param {String} description 
 */
const addTodo = ( description ) => {
    if ( !description ) throw new Error('Description is required');
    state.todos.push( new Todo(description) );

    saveStateToLocalStorage();
}

/**
 * 
 * @param {String} todoId
 */
const toggleTodo = ( todoId ) => {
    
    state.todos = state.todos.map( todo => {
        if( todo.id === todoId ) {
            todo.done = !todo.done;
        }
        return todo;
    });

    saveStateToLocalStorage();
}

const deleteTodo = ( todoId ) => {
    state.todos = state.todos.filter( todo => todo.id !== todoId  );
    saveStateToLocalStorage();
}

const deleteCompleted = () => {
    state.todos = state.todos.filter( todo => !todo.done );
    saveStateToLocalStorage();
}

const toggleAll = () => {
    const allCompleted = state.todos.every( todo => todo.done );
    state.todos.forEach( todo => { todo.done = !allCompleted; });
    saveStateToLocalStorage();
}

const updateTodo = ( todoId, description ) => {
    if ( !description.trim() ) throw new Error('Description is required');
    state.todos = state.todos.map( todo => {
        if ( todo.id === todoId ) todo.description = description.trim();
        return todo;
    });
    saveStateToLocalStorage();
}

const isAllCompleted = () => {
    return state.todos.length > 0 && state.todos.every( todo => todo.done );
}

/**
 * 
 * @param {Filters} newFilter 
 */
const setFilter = ( newFilter = Filters.All ) => {
    state.filter = newFilter;
    saveStateToLocalStorage();
}

const getCurrentFilter = () => {
    return state.filter;
}


export default {
    addTodo,
    deleteCompleted,
    deleteTodo,
    getCurrentFilter,
    getTodos,
    initStore,
    isAllCompleted,
    loadStore,
    setFilter,
    toggleAll,
    toggleTodo,
    updateTodo,
}