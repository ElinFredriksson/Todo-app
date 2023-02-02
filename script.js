const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/'
const LIMIT_URL = 'https://jsonplaceholder.typicode.com/todos?page=2&_limit=7'

const form = document.querySelector('#form')
const submit = document.querySelector('#submit');
const todoText = document.querySelector('#todoText');
const deleteBtn = document.querySelector('#deleteBtn')
const errorMessage = document.querySelector('#errorMessage');

const modal = document.querySelector('#simpleModal');
const closeBtn = document.querySelector('.closeBtn');

const todoList = document.querySelector('#todo-list')

// https://preciselab.io/fetch-promise-and-template-string-on-example-of-to-do-list-in-javascript/
const title = [];
const todos = [];


const getTodos = async () => {
    const res = await fetch(LIMIT_URL);
    const data = await res.json();

    console.log(todos);
    data.forEach(todo => {
        todos.push(todo)
    })
    listTodos()
}

getTodos()

const listTodos = () => {
    todoList.innerHTML = ''

    todos.forEach(todo => {

        const todoElement = createTodo(todo)
        todoList.appendChild(todoElement)

        
    })
}


const createTodo = (data) => {
    let todoCard = document.createElement("div")
    todoCard.classList.add('todo-Card')
    
    let todo = document.createElement('div')
    todoCard.id = data.id
    todo.classList.add('todo-id')

    const task = document.createElement("p")
    task.classList.add('todo-task')
    task.innerText = data.title

    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.classList.add('form-check-input')
    // checkBox.classList.toggle('completed')
    if(data.completed) {
        checkBox.checked = true;
        task.style.textDecoration = 'line-through'


    }
    checkBox.addEventListener('change', function() {
        
        fetch(BASE_URL + data.id, {
            method: 'PATCH',
            body: JSON.stringify({completed: !data.completed}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },

            
        })
        .then(res => res.json())
        .then(todo => {
            
            data.completed = todo.completed

            
            if(data.completed) {
                task.style.textDecoration = 'line-through'
                this.checked = true
                return true;
    
            } 
            if(!data.completed){
                console.log('not checked');
                task.style.textDecoration = 'none'
                this.checked = false
                return false;
            } 
        })

        
    })

   

    const deleteBtn = document.createElement("button")
    deleteBtn.innerText = "Remove"
    deleteBtn.classList.add('deleteBtn')

    deleteBtn.addEventListener('click', e => {

        if(!data.completed) {
            // MODAL
            openModal();
            return false;
        }

        if(data.completed){
            // return true;
        }
            
            fetch(BASE_URL + data.id, {
                method: 'DELETE',
            })
            .then(res => {
                
                if(res.ok) {
                    todoCard.remove()
                    console.log(todos.indexOf(data))
                    const index = todos.indexOf(data) 
                    todos.splice(index, 1)
                    
                }
            })
        
})


    todoCard.appendChild(checkBox);
    todoCard.appendChild(task);
    todoCard.appendChild(deleteBtn);

    return todoCard;

    
}

const fetchTodos = async () => {

    const res = await fetch(BASE_URL);
    const post = await res.json();


    const todoContainer = document.createElement("div");

    post.forEach((todo) => {
        const todoCard = createTodo(todo);
        // console.log(todoCard);
        todoContainer.appendChild(todoCard);

        return todoCard;
    });
};
fetchTodos();



function validateTodo () {
    const input = document.querySelector('#input')

    if(input.value === '') {
        errorMessage.classList.remove("d-none")
        console.log('Not a valid task');
        return false;
    }
    else {
        errorMessage.classList.add("d-none")
        console.log('Task added to todo list');
        return true;
    }
}


const handleSubmit = e => {
    e.preventDefault();
    const title = document.querySelector('#input').value
    console.log(title);

    const newTodo = {
        title,
        completed: false,

    }

    if(!validateTodo()) {
        return
    }

    fetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
    })
        .then((res) => res.json())
        .then((data) => {
            

            data.id = crypto.randomUUID()
            todos.push(data)
            console.log(data);
            const todoElement = createTodo(data)
            todoList.appendChild(todoElement)
           
        });

    form.reset();
}



function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}


submit.addEventListener('click' , handleSubmit)

closeBtn.addEventListener('click', closeModal);



// closeBtn.addEventListener ('click', e => {
//     if(e.target == closeBtn) {
//      modal.style.display = 'block'
//     }
//  })






