import { Todo } from '../models/todo.model';


/**
 * 
 * @param {Todo} todo 
 */
export const createTodoHTML = ( todo ) => {
    if ( !todo ) throw new Error('A TODO object is required');

    const { done, description, id } = todo;

    const liElement = document.createElement('li');
    liElement.setAttribute('data-id', id);
    if ( done ) liElement.classList.add('completed');

    // Vista (safe: no XSS — se usa textContent para la descripción)
    const viewDiv = document.createElement('div');
    viewDiv.className = 'view';

    const checkbox = document.createElement('input');
    checkbox.className = 'toggle';
    checkbox.type = 'checkbox';
    checkbox.checked = done;

    const label = document.createElement('label');
    label.textContent = description;

    const destroyBtn = document.createElement('button');
    destroyBtn.className = 'destroy';

    viewDiv.append(checkbox, label, destroyBtn);

    // Input de edición inline
    const editInput = document.createElement('input');
    editInput.className = 'edit';
    editInput.value = description;

    liElement.append(viewDiv, editInput);

    return liElement;
}