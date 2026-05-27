import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';


const ElementIDs = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
    ToggleAll: '#toggle-all',
    MainSection: '.main',
    FooterSection: '.footer',
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( ElementIDs.TodoList, todos );
        updatePendingCount();
        updateToggleAll();
        updateEmptyState();
        updateActiveFilter();
    }

    const updatePendingCount = () => {
        renderPending( ElementIDs.PendingCountLabel );
    }

    const updateToggleAll = () => {
        const toggleAll = document.querySelector( ElementIDs.ToggleAll );
        if ( toggleAll ) toggleAll.checked = todoStore.isAllCompleted();
    }

    const updateEmptyState = () => {
        const isEmpty = todoStore.getTodos( Filters.All ).length === 0;
        const main = document.querySelector( ElementIDs.MainSection );
        const footer = document.querySelector( ElementIDs.FooterSection );
        if ( main ) main.style.display = isEmpty ? 'none' : '';
        if ( footer ) footer.style.display = isEmpty ? 'none' : '';
    }

    const updateActiveFilter = () => {
        const currentFilter = todoStore.getCurrentFilter();
        document.querySelectorAll( ElementIDs.TodoFilters ).forEach( el => {
            el.classList.toggle( 'selected', el.dataset.filter === currentFilter );
        });
    }

    const setFilterFromHash = () => {
        const hash = window.location.hash;
        let filter = Filters.All;
        if ( hash === '#/active' ) filter = Filters.Pending;
        else if ( hash === '#/completed' ) filter = Filters.Completed;
        todoStore.setFilter( filter );
        displayTodos();
    }

    const commitEdit = ( liElement, input ) => {
        const newValue = input.value.trim();
        if ( newValue ) {
            todoStore.updateTodo( liElement.getAttribute('data-id'), newValue );
        } else {
            todoStore.deleteTodo( liElement.getAttribute('data-id') );
        }
        liElement.classList.remove('editing');
        displayTodos();
    }

    // Cuando la función App() se llama
    (()=> {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append( app );
        setFilterFromHash();
    })();


    // Referencias HTML
    const newDescriptionInput = document.querySelector( ElementIDs.NewTodoInput );
    const todoListUL = document.querySelector( ElementIDs.TodoList );
    const clearCompletedButton = document.querySelector( ElementIDs.ClearCompletedButton );
    const toggleAllCheckbox = document.querySelector( ElementIDs.ToggleAll );

    // Nuevo todo (event.key reemplaza el deprecado event.keyCode)
    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if ( event.key !== 'Enter' ) return;
        if ( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value.trim() );
        displayTodos();
        event.target.value = '';
    });

    // Listener unificado: toggle y eliminar
    todoListUL.addEventListener('click', ( event ) => {
        const element = event.target.closest('[data-id]');
        if ( !element ) return;

        if ( event.target.classList.contains('destroy') ) {
            todoStore.deleteTodo( element.getAttribute('data-id') );
            displayTodos();
        } else if ( event.target.classList.contains('toggle') ) {
            todoStore.toggleTodo( element.getAttribute('data-id') );
            displayTodos();
        }
    });

    // Edición inline: doble clic sobre una tarea
    todoListUL.addEventListener('dblclick', ( event ) => {
        const liElement = event.target.closest('[data-id]');
        if ( !liElement ) return;
        liElement.classList.add('editing');
        const editInput = liElement.querySelector('.edit');
        if ( editInput ) {
            editInput.focus();
            editInput.setSelectionRange( editInput.value.length, editInput.value.length );
        }
    });

    // Enter confirma la edición, Escape la cancela
    todoListUL.addEventListener('keyup', ( event ) => {
        const liElement = event.target.closest('[data-id]');
        if ( !liElement || !liElement.classList.contains('editing') ) return;

        if ( event.key === 'Enter' ) {
            commitEdit( liElement, event.target );
        } else if ( event.key === 'Escape' ) {
            liElement.classList.remove('editing');
            displayTodos();
        }
    });

    // Al perder el foco también confirma la edición
    todoListUL.addEventListener('focusout', ( event ) => {
        const liElement = event.target.closest('[data-id]');
        if ( !liElement || !liElement.classList.contains('editing') ) return;
        commitEdit( liElement, event.target );
    });

    clearCompletedButton.addEventListener( 'click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });

    // Marcar / desmarcar todas las tareas
    toggleAllCheckbox.addEventListener('click', () => {
        todoStore.toggleAll();
        displayTodos();
    });

    // Hash routing: los filtros navegan por el hash de la URL
    window.addEventListener('hashchange', setFilterFromHash);

}