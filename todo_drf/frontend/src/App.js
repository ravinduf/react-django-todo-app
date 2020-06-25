import React from 'react';
import './App.css';

class App extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      todoList:[],
      activeItem:{
        id: "",
        title: '',
        completed: false
      },
      activeId: null,
      editing: false,
    }

    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.strikeUnstrike = this.strikeUnstrike.bind(this);
  };

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

  componentDidMount(){
    this.fetchTasks();
  }

  fetchTasks(){
    console.log('Fetching ...')
    fetch("http://127.0.0.1:8000/api/task-list/")
    .then(response => response.json())
    .then(data => 
      //console.log(data)
      this.setState({ todoList:data })
          );
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({
      activeItem:{
        title: value
      }
    })


  }

  handleSubmit(e) {
    e.preventDefault();
    
    
    const csrftoken = this.getCookie('csrftoken');

    let url = 'http://127.0.0.1:8000/api/task-create/';
    console.log(this.state.activeItem.id)
    if (this.state.editing == true ){
      url = `http://127.0.0.1:8000/api/task-update/${ this.state.activeId }/`;
      this.setState({
        editing: false
      })
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      console.log(response)
      this.fetchTasks();
      this.setState({
        activeItem : {
          title : ''
        },
        activeId: null,
        editing: false
      })
  
    }).catch((error) => {
      console.log('Error: ', error)
    })
  }

  startEdit(task){

    this.setState({
      activeItem: task,
      activeId: task.id,
      editing: true
    })
  }

  deleteItem(task) {
    const csrftoken = this.getCookie('csrftoken');

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((res) => {
      this.fetchTasks();
    });
  }

  strikeUnstrike(task) {
    
    task.completed = !task.completed;
    
    //this.fetchTasks();

    const csrftoken = this.getCookie('csrftoken');

    fetch(`http://127.0.0.1:8000/api/task-update/${task.id}/`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(task)
    }).then((res) => {
      this.fetchTasks();
    });
  }

  render(){
    const tasks = this.state.todoList;
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex: 6}}>
                  <input onChange={this.handleChange} className="form-control" id="title" type="text" name="title" value={this.state.activeItem.title} placeholder="Add Task..."></input>
                </div>

                <div style={{flex: 1}}>
                  
                  <button onClick={this.handleSubmit} id="submit" className="btn btn-warning" type="submit">
                    {this.state.editing ? 'Edit' : 'Add'}
                  </button>
                </div>
              </div>
            </form>
          
          </div>

          <div id="list-wrapper">
            {tasks.map( (task, index) => 
              <div key={index} className="task-wrapper flex-wrapper">
                <div onClick={() => this.strikeUnstrike(task)} style = {{flex: 7}}>
                  { task.completed !== true ? (
                      <span>{task.title}</span>
                  ) : ( 
                    <strike>{task.title}</strike>
                   )}
                  
                </div>

                <div style = {{flex: 1}}>
                  
                  <button onClick={() => this.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                </div>

                <div style = {{flex: 1}}>
                  <button onClick={() => this.deleteItem(task)} className="btn btn-sm btn-outline-dark delete">-</button>
                </div>
                
              </div>
            )}
          </div>
        </div>
        
      </div>
    )
  }
}

export default App;
